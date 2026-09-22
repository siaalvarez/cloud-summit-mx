
# --- TOOLS DE RETAIL ---
analizar_ventas_func = FunctionDeclaration(
    name="analizar_caida_ventas",
    description="Obtiene los productos con mayor caída porcentual en ventas de la última semana y su stock actual.",
    parameters={"type": "object", "properties": {}}
)

cruzar_trends_func = FunctionDeclaration(
    name="cruzar_con_google_trends",
    description="Obtiene la tendencia actual (alza, baja, estable), índice de búsqueda y regiones top de interés para un producto en Google Trends.",
    parameters={
        "type": "object",
        "properties": {"producto": {"type": "string", "description": "El nombre exacto del producto, ej: 'Termo Acero Inoxidable 1L'."}},
        "required": ["producto"]
    }
)

retail_tool = Tool(function_declarations=[analizar_ventas_func, cruzar_trends_func])

retail_model = GenerativeModel(
    "gemini-2.5-flash",
    tools=[retail_tool],
    system_instruction="""Eres un Copiloto Estratégico de Retail y Marketing impulsado por Gemini para directivos en México.
Tu objetivo es identificar caídas en ventas y cruzarlas con tendencias del mercado para proponer campañas hiper-personalizadas.

REGLAS DE FORMATO (ESTRICTAS):
- Usa emojis (📉 para caídas, 📈 para tendencias altas, 🎯 para audiencias, 🚀 para campañas).
- NUNCA uses listas anidadas profundas. Usa párrafos cortos o listas simples.
- Sé MUY ejecutivo y directo al grano.

REGLAS LÓGICAS:
1. Si te piden analizar ventas, usa 'analizar_caida_ventas' para ver qué productos caen más.
2. Si te piden buscar oportunidades o cruzar con el mercado, usa 'cruzar_con_google_trends' para el producto con caída.
3. Si descubres que las ventas caen pero las búsquedas en Google suben, propón una campaña dirigida a las regiones top.
4. Termina SIEMPRE con una pregunta de acción: "¿Deseas que lance esta campaña en Google Ads e Instagram ahora mismo?"."""
)

chat_sessions_retail = {}

def ejecutar_funcion_bq_retail(nombre_funcion, args):
    if nombre_funcion == "analizar_caida_ventas":
        query = f"SELECT id_producto, producto, categoria, ventas_actuales, ventas_pasadas, variacion_pct, stock, precio_mxn FROM `{DATASET_ID}.ventas_ecommerce` ORDER BY variacion_pct ASC LIMIT 5"
    elif nombre_funcion == "cruzar_con_google_trends":
        prod = args.get('producto', '')
        query = f"SELECT producto, tendencia, indice_busqueda, regiones_top, motivo_tendencia FROM `{DATASET_ID}.google_trends_insights` WHERE producto = '{prod}'"
    else:
        return json.dumps({"error": "Función no encontrada"})
        
    try:
        df = bq_client.query(query).to_dataframe()
        return df.to_json(orient="records")
    except Exception as e:
        return json.dumps({"error": str(e)})

@app.post("/api/chat/retail")
async def chat_retail(request: ChatRequest):
    if request.session_id not in chat_sessions_retail:
        chat_sessions_retail[request.session_id] = retail_model.start_chat()
        
    session = chat_sessions_retail[request.session_id]
    
    try:
        response = session.send_message(request.message)
        
        function_calls = response.function_calls if hasattr(response, "function_calls") else (
            response.candidates[0].function_calls if response.candidates and hasattr(response.candidates[0], "function_calls") else []
        )
        
        while function_calls:
            function_call = function_calls[0]
            func_name = function_call.name
            args = {key: value for key, value in function_call.args.items()}
            
            api_response = ejecutar_funcion_bq_retail(func_name, args)
            
            response = session.send_message(
                Part.from_function_response(name=func_name, response={"content": api_response})
            )
            
            function_calls = response.function_calls if hasattr(response, "function_calls") else (
                response.candidates[0].function_calls if response.candidates and hasattr(response.candidates[0], "function_calls") else []
            )
            
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/retail/chart")
def get_retail_chart_data():
    try:
        query = f"SELECT producto, variacion_pct, stock FROM `{DATASET_ID}.ventas_ecommerce`"
        df = bq_client.query(query).to_dataframe()
        return json.loads(df.to_json(orient="records"))
    except Exception as e:
        return {"error": str(e)}

