from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Tool, FunctionDeclaration, Part
from google.cloud import bigquery
import json
import os

app = FastAPI(title="Google Cloud Summit - Agents API")

# Permitir a Vuetify (Frontend) comunicarse con FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ID = "cloud-summit-mx"
DATASET_ID = f"{PROJECT_ID}.logistica_demo"
LOCATION = "us-central1"

# Inicializar clientes
bq_client = bigquery.Client(project=PROJECT_ID)
vertexai.init(project=PROJECT_ID, location=LOCATION)

# --- TOOLS DE LOGÍSTICA ---
consultar_envios_func = FunctionDeclaration(
    name="consultar_estado_envios",
    description="Consulta envíos activos, estado de retraso y alertas climáticas. Devuelve cliente afectado y penalización económica.",
    parameters={"type": "object", "properties": {}}
)

buscar_alternativas_func = FunctionDeclaration(
    name="buscar_alternativas_inventario",
    description="Busca inventario terrestre para un producto. Devuelve bodega, stock y costo extra.",
    parameters={
        "type": "object",
        "properties": {"producto": {"type": "string", "description": "Producto a buscar, ej 'Autopartes - Motor'."}},
        "required": ["producto"]
    }
)

logistics_tool = Tool(function_declarations=[consultar_envios_func, buscar_alternativas_func])

# Inicializar Modelo (Usaremos Flash 2.5 porque es la versión más reciente disponible en este proyecto)
model = GenerativeModel(
    "gemini-2.5-flash",
    tools=[logistics_tool],
    system_instruction="""Eres un Copiloto Ejecutivo de Logística impulsado por Gemini para directivos en México.
Tu objetivo es impresionar en una demostración (Google Cloud Summit). Tus respuestas deben ser MUY ejecutivas, visualmente atractivas y directas al grano.

REGLAS DE FORMATO (ESTRICTAS):
- Usa SIEMPRE emojis para destacar elementos visuales (🚨 para alertas críticas, ⚠️ para advertencias, ✅ para soluciones, 💰 para impacto financiero, 📦 para productos).
- NUNCA uses listas anidadas profundas. Usa párrafos cortos o listas de un solo nivel con negritas.
- Destaca los montos económicos en **negritas**.
- Si hay un problema grave (como la tormenta), inicia tu mensaje con un título claro como "🚨 ALERTA CRÍTICA".

REGLAS LÓGICAS:
1. Al usar 'consultar_estado_envios', filtra y reporta SOLO los envíos que tienen problemas, retrasos o alertas climáticas. Ignora los envíos que van bien a menos que el usuario pregunte por ellos explícitamente.
2. Si piden alternativas, usa 'buscar_alternativas_inventario', calcula el ahorro neto (Penalización evitada - Costo extra) y muéstralo como el "💰 Ahorro Proyectado".
3. Termina SIEMPRE tus recomendaciones con una pregunta de acción clara: "¿Deseas que proceda con la autorización de este cambio de ruta en el sistema ERP?"."""
)

# Diccionario para guardar sesiones de chat en memoria (simplificado para demo)
chat_sessions = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

def ejecutar_funcion_bq(nombre_funcion, args):
    if nombre_funcion == "consultar_estado_envios":
        query = f"SELECT e.id_envio, e.cliente, e.producto, e.ubicacion_actual, e.estado, a.tipo as alerta, e.penalizacion_usd FROM `{DATASET_ID}.envios_activos` e LEFT JOIN `{DATASET_ID}.alertas_externas` a ON a.region LIKE CONCAT('%', e.ubicacion_actual, '%')"
    elif nombre_funcion == "buscar_alternativas_inventario":
        prod = args.get('producto', '')
        query = f"SELECT bodega, stock, costo_transporte_usd FROM `{DATASET_ID}.inventario_bodegas` WHERE sku = '{prod}'"
    else:
        return json.dumps({"error": "Función no encontrada"})
        
    try:
        df = bq_client.query(query).to_dataframe()
        return df.to_json(orient="records")
    except Exception as e:
        return json.dumps({"error": str(e)})


@app.post("/api/chat/logistica")
async def chat_logistica(request: ChatRequest):
    if request.session_id not in chat_sessions:
        chat_sessions[request.session_id] = model.start_chat()
        
    session = chat_sessions[request.session_id]
    
    try:
        response = session.send_message(request.message)
        
        # Manejar Function Calling (Bucle hasta que el modelo decida responder texto)
        function_calls = response.function_calls if hasattr(response, "function_calls") else (
            response.candidates[0].function_calls if response.candidates and hasattr(response.candidates[0], "function_calls") else []
        )
        
        while function_calls:
            function_call = function_calls[0]
            func_name = function_call.name
            args = {key: value for key, value in function_call.args.items()}
            
            # Ejecutar BQ
            api_response = ejecutar_funcion_bq(func_name, args)
            
            # Devolver resultado a Gemini
            response = session.send_message(
                Part.from_function_response(name=func_name, response={"content": api_response})
            )
            
            # Volver a checar si devolvió más llamadas a funciones
            function_calls = response.function_calls if hasattr(response, "function_calls") else (
                response.candidates[0].function_calls if response.candidates and hasattr(response.candidates[0], "function_calls") else []
            )
            
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/map")
def get_map_data():
    import pandas as pd
    try:
        query_envios = f"""
        SELECT id_envio as id, ubicacion_actual as nombre, lat, lon, estado,
               cliente, producto, penalizacion_usd,
               IF(estado LIKE '%Retrasado%', 'Crítica', 'Normal') as criticidad
        FROM `{DATASET_ID}.envios_activos`
        """
        df_envios = bq_client.query(query_envios).to_dataframe()
        
        query_bodegas = f"""
        SELECT bodega as id, bodega as nombre, lat, lon, 'Inventario (Plan B)' as estado,
               'Propio (Stock)' as cliente, sku as producto, 0 as penalizacion_usd,
               'Mitigación' as criticidad
        FROM `{DATASET_ID}.inventario_bodegas`
        """
        df_bodegas = bq_client.query(query_bodegas).to_dataframe()
        
        df_combined = pd.concat([df_envios, df_bodegas])
        # Convertir a JSON
        return json.loads(df_combined.to_json(orient="records"))
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"status": "Google Cloud Summit API is running"}
