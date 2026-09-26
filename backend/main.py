from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
import os
import re

from google import genai
from google.genai import types

app = FastAPI(title="Google Cloud Summit - Agents API")

# Permitir a Vuetify (Frontend) comunicarse con FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ID = os.getenv("PROJECT_ID", "cloud-summit-mx")
LOCATION = os.getenv("LOCATION", "global")
MODEL_CANDIDATES = [
    os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
    "gemini-3.8-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-pro",
    "gemini-1.5-pro"
]

def get_genai_client():
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if api_key:
        try:
            return genai.Client(api_key=api_key)
        except Exception as e:
            print(f"[Backend] Error con API key: {e}")
    try:
        return genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    except Exception as e:
        print(f"[Backend] Error iniciando genai.Client(vertexai=True): {e}")
    try:
        return genai.Client()
    except Exception as e:
        print(f"[Backend] Error iniciando genai.Client(): {e}")
        return None

class ChatRequest(BaseModel):
    session_id: str
    message: str

chat_sessions_retail = {}
chat_sessions_logistica = {}
chat_sessions_fintech = {}
chat_sessions_general = {}

# Datasets locales
SAMPLE_VENTAS_RETAIL = [
    {"id_producto": "CAT-001", "producto": "Electrónica & Gaming", "categoria": "Electrónica", "ventas_actuales": 62500000, "ventas_pasadas": 54700000, "variacion_pct": 14.2, "transacciones": 13020, "ticket_promedio": 4800, "stock": 18200000},
    {"id_producto": "CAT-002", "producto": "Moda, Ropa & Calzado", "categoria": "Moda", "ventas_actuales": 41800000, "ventas_pasadas": 40380000, "variacion_pct": 3.5, "transacciones": 33440, "ticket_promedio": 1250, "stock": 22500000},
    {"id_producto": "CAT-003", "producto": "Deportes & Outdoor (Running)", "categoria": "Deportes", "ventas_actuales": 28400000, "ventas_pasadas": 34800000, "variacion_pct": -18.4, "transacciones": 15350, "ticket_promedio": 1850, "stock": 12500000},
    {"id_producto": "CAT-004", "producto": "Hogar, Muebles & Decoración", "categoria": "Hogar", "ventas_actuales": 24600000, "ventas_pasadas": 27700000, "variacion_pct": -11.2, "transacciones": 7935, "ticket_promedio": 3100, "stock": 15800000},
    {"id_producto": "CAT-005", "producto": "Belleza & Cuidado Personal", "categoria": "Belleza", "ventas_actuales": 16900000, "ventas_pasadas": 15035000, "variacion_pct": 12.4, "transacciones": 21666, "ticket_promedio": 780, "stock": 6400000},
    {"id_producto": "CAT-006", "producto": "Línea Blanca & Climatización", "categoria": "Línea Blanca", "ventas_actuales": 15200000, "ventas_pasadas": 16016000, "variacion_pct": -5.1, "transacciones": 2375, "ticket_promedio": 6400, "stock": 11200000},
    {"id_producto": "CAT-007", "producto": "Juguetería, Bebés & Niños", "categoria": "Juguetería", "ventas_actuales": 12800000, "ventas_pasadas": 11786000, "variacion_pct": 8.6, "transacciones": 13910, "ticket_promedio": 920, "stock": 5800000},
    {"id_producto": "CAT-008", "producto": "Alimentos Gourmet & Vinos", "categoria": "Gourmet", "ventas_actuales": 11400000, "ventas_pasadas": 10744000, "variacion_pct": 6.1, "transacciones": 7860, "ticket_promedio": 1450, "stock": 4200000},
    {"id_producto": "CAT-009", "producto": "Farmacia & Nutrición Wellness", "categoria": "Farmacia", "ventas_actuales": 9700000, "ventas_pasadas": 8834000, "variacion_pct": 9.8, "transacciones": 15390, "ticket_promedio": 630, "stock": 3100000},
    {"id_producto": "CAT-010", "producto": "Automotriz & Herramientas", "categoria": "Automotriz", "ventas_actuales": 8300000, "ventas_pasadas": 8627000, "variacion_pct": -3.8, "transacciones": 3950, "ticket_promedio": 2100, "stock": 5600000},
    {"id_producto": "CAT-011", "producto": "Mascotas & Pet Care", "categoria": "Mascotas", "ventas_actuales": 7500000, "ventas_pasadas": 6437000, "variacion_pct": 16.5, "transacciones": 14705, "ticket_promedio": 510, "stock": 2900000},
    {"id_producto": "CAT-012", "producto": "Cómputo & Oficina", "categoria": "Cómputo", "ventas_actuales": 6800000, "ventas_pasadas": 6967000, "variacion_pct": -2.4, "transacciones": 1740, "ticket_promedio": 3900, "stock": 4500000},
]

SAMPLE_TRENDS_RETAIL = [
    {"categoria_o_producto": "Deportes", "tendencia": "Alza Crítica (+92%)", "indice_busqueda": 92, "regiones_top": "CDMX, Monterrey, Guadalajara", "motivo_tendencia": "Próximo Maratón CDMX y Temporada de Carreras (Oportunidad .5M MXN en inventario de calzado y ropa técnica)"},
    {"categoria_o_producto": "Electrónica", "tendencia": "Alza Sostenida (+15%)", "indice_busqueda": 88, "regiones_top": "CDMX, Guadalajara, Monterrey", "motivo_tendencia": "Lanzamientos Back to School y Videojuegos"},
    {"categoria_o_producto": "Belleza", "tendencia": "Alza Viral (+28%)", "indice_busqueda": 90, "regiones_top": "Monterrey, Guadalajara, Mérida", "motivo_tendencia": "Tendencias de Skincare en TikTok y Protección Solar"},
    {"categoria_o_producto": "Moda", "tendencia": "Estable (+2%)", "indice_busqueda": 55, "regiones_top": "CDMX, Puebla, Bajío", "motivo_tendencia": "Consumo regular de temporada"},
    {"categoria_o_producto": "Hogar", "tendencia": "Baja (-8%)", "indice_busqueda": 38, "regiones_top": "Centro del País", "motivo_tendencia": "Fin de temporada de remodelaciones residenciales"},
    {"categoria_o_producto": "Línea Blanca", "tendencia": "Baja Estacional (-12%)", "indice_busqueda": 42, "regiones_top": "Norte del País", "motivo_tendencia": "Descenso estacional post ola de calor"}
]

# Cargar Dataset Maestro Local de Logística
LOGISTICA_DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "frontend", "data", "logistica_data.json")
try:
    with open(LOGISTICA_DATA_FILE, "r", encoding="utf-8") as f:
        LOGISTICA_MASTER_DATA = json.load(f)
except Exception as e:
    print(f"[Backend] Error cargando logistica_data.json: {e}")
    LOGISTICA_MASTER_DATA = {
        "warehouses": [],
        "hubs": [],
        "routes": [],
        "vehicles": [],
        "alerts": []
    }

LOGISTICA_SYSTEM_INSTRUCTION = f"""Eres el Agente Inteligente de Logística & Control de Rutas Terrestres del Google Cloud Summit México.
Eres el copiloto analítico y asesor estratégico de la Torre de Control de Transporte Nacional (Director de Supply Chain & Operaciones).
Tu misión es monitorear la red nacional de transporte 100% terrestre en México, evaluar riesgos en tiempo real, anticipar cuellos de botella y formular planes de mitigación y re-enrutamiento de flotas con impacto financiero medible.

ARQUITECTURA DE LA RED LOGÍSTICA:
1. Bodegas / CEDIS Centrales (Origen): Almacenes principales con stock masivo y capacidades Plan B (Cuautitlán CDMX, Apodaca MTY, El Salto GDL, Puerto Veracruz).
2. Hubs Logísticos (Destino): Centros regionales de última milla o cruce fronterizo (Querétaro, San Luis Potosí, Puebla, Toluca, Nuevo Laredo, Tijuana).
3. Corredores / Rutas: Vías terrestres activas que unen Bodegas con Hubs. Cada ruta puede tener asignados múltiples transportes de carga.
4. Vehículos / Flotas: Unidades de transporte en tránsito activo con ubicación GPS en tiempo real, % de avance, carga de clientes y penalización económica por demora contractual.
5. Alertas Viales Operativas: Incidentes viales (bloqueos, derrumbes, inundaciones, saturación aduanal) geolocalizados en segmentos específicos de rutas activas. Solo tienen validez si impactan la operación de rutas y transportes.

TOPOLOGÍA COMPLETA Y ESTADO EN TIEMPO REAL:
{json.dumps(LOGISTICA_MASTER_DATA, indent=2, ensure_ascii=False)}

INSTRUCCIONES CLAVE DE RESPUESTA:
1. Responde con tono ejecutivo, analítico, profesional y directo en formato Markdown (títulos, negritas, métricas en USD, comparativas).
2. Ante preguntas sobre envíos en riesgo, afectaciones viales o alertas, detalla los transportes impactados, las causas (ej. Bloqueo Km 182 en SLP, Inundación Poza Rica, Derrumbe Río Frío, Aduana Nuevo Laredo), el costo de penalización en USD y la ruta alterna recomendada.
3. Al sugerir una ruta alterna o desvío de transporte, expón claramente las consideraciones operativas (diferencia de tiempo vs horas de bloqueo, delta en combustible/casetas, ahorro neto en penalización contractual y seguridad).
4. REGLA ESTRICTA DE IDENTIDAD: Preséntate y responde siempre de forma natural como el Agente de Logística / Torre de Control de Transporte. NUNCA menciones nombres técnicos de modelos de lenguaje (como Gemini, Flash, 3.8, etc.) ni uses frases como "analizando con Gemini" o "hola, te ayudo con Gemini".
5. Cuando propongas o confirmes un re-enrutamiento de transporte o ruta, incluye al final de tu mensaje un bloque JSON especial con el tag ```json_action para que la interfaz del mapa de Google Maps dibuje la ruta alterna y habilite el botón de confirmación dinámica:
```json_action
{{
  "action": "suggest_reroute",
  "route_id": "RUTA-57D-SLP",
  "alt_route_id": "RUTA-57D-ALT",
  "vehicle_ids": ["TRK-101", "TRK-102"],
  "considerations": {{
    "delta_tiempo": "+1.2 hrs vs +7.5 hrs bloqueo",
    "delta_costo_usd": 93,
    "ahorro_penalizacion_usd": 40000,
    "ahorro_neto_usd": 39907,
    "seguridad": "Alta (Cuota)"
  }}
}}
```
"""

SAMPLE_FINTECH_DATA = [
    {"nombre": "Empresa Aceros del Norte S.A.", "segmento": "Empresarial", "riesgo_abandono_pct": 82, "saldo_mxn": 1850000},
    {"nombre": "Roberto Garza Sada", "segmento": "Patrimonial", "riesgo_abandono_pct": 74, "saldo_mxn": 1420000},
    {"nombre": "Distribuidora Médica del Centro", "segmento": "Pyme", "riesgo_abandono_pct": 68, "saldo_mxn": 650000},
    {"nombre": "Sofía Martínez Treviño", "segmento": "Premium", "riesgo_abandono_pct": 59, "saldo_mxn": 480000},
    {"nombre": "Innovación Digital S.C.", "segmento": "Pyme", "riesgo_abandono_pct": 51, "saldo_mxn": 390000},
    {"nombre": "Carlos Slim Domit", "segmento": "Patrimonial", "riesgo_abandono_pct": 24, "saldo_mxn": 3200000},
    {"nombre": "Valeria Morales Ruiz", "segmento": "Joven", "riesgo_abandono_pct": 45, "saldo_mxn": 115000},
    {"nombre": "Javier Hernández Balcázar", "segmento": "Premium", "riesgo_abandono_pct": 18, "saldo_mxn": 890000}
]

FINTECH_SYSTEM_INSTRUCTION = f"""Eres el Agente de Fintech & Banca del Google Cloud Summit México.
Eres un asesor analítico y estratega de retención para la banca patrimonial, empresarial y de consumo (Head of Retention / Chief Risk Officer).
Tu misión es analizar carteras de clientes con modelos de propensión de abandono (Churn Predictivo en BigQuery ML), identificar motivos de fuga de capitales y generar en tiempo real ofertas personalizadas de tipo Next-Best-Action (NBA) para retener los saldos de los clientes.

CARTERA DE CLIENTES EN RIESGO (BigQuery ML):
{json.dumps(SAMPLE_FINTECH_DATA, indent=2, ensure_ascii=False)}

INSTRUCCIONES CLAVE:
1. Responde dinámicamente y con detalle a cualquier pregunta sobre los clientes, tasas de interés, productos de inversión o estrategias de retención.
2. Destaca a los clientes de mayor riesgo (como Empresa Aceros del Norte S.A. con 82% de riesgo y .85M MXN en saldo, o Roberto Garza Sada con 74% de riesgo y .42M MXN).
3. Formula ofertas Next-Best-Action viables y atractivas (tasas de tesorería competitivas, asignación de banquero privado, notas estructuradas en USD).
4. Presenta tus respuestas con formato ejecutivo en Markdown."""

def extract_grounding_sources(candidate):
    sources = []
    try:
        if hasattr(candidate, "grounding_metadata") and candidate.grounding_metadata:
            gm = candidate.grounding_metadata
            if hasattr(gm, "grounding_chunks") and gm.grounding_chunks:
                for chunk in gm.grounding_chunks:
                    web = getattr(chunk, "web", None)
                    if web:
                        uri = getattr(web, "uri", None)
                        title = getattr(web, "title", None) or uri
                        if uri and not any(s.get("url") == uri for s in sources):
                            sources.append({"title": title, "url": uri})
    except Exception as e:
        print(f"[Backend] Error extrayendo fuentes de grounding: {e}")
    return sources

def extract_links_from_text(text: str):
    links = []
    try:
        matches = re.findall(r'\[([^\]]+)\]\((https?://[^\)]+)\)', text)
        for title, url in matches:
            if not any(s.get("url") == url for s in links):
                links.append({"title": title, "url": url})
    except Exception as e:
        print(f"[Backend] Error extrayendo links de markdown: {e}")
    return links

def detectar_agente_sugerido(user_msg: str, ai_text: str = ""):
    combined = (user_msg + " " + ai_text).lower()
    
    logistica_keywords = [
        "logística", "logistica", "nearshoring", "embarque", "embarques", "puerto", "puertos",
        "carretera", "carreteras", "tormenta", "huracan", "clima", "envío", "envíos", "envio",
        "envios", "transporte", "transportes", "flete", "fletes", "bodega", "bodegas", "ruta", "rutas",
        "suministro", "cadena de suministro", "supply chain", "flota", "flotilla", "flotillas",
        "camion", "camión", "camiones", "entrega", "entregas", "reparto", "repartos",
        "última milla", "ultima milla", "last mile", "cedis", "rastreo", "telemetría",
        "operador", "operadores", "diesel", "combustible", "aduanas", "manzanillo", "veracruz", "altamira"
    ]
    retail_keywords = [
        "retail", "tienda", "tiendas", "e-commerce", "ecommerce", "comercio", "inventario",
        "inventarios", "stock", "sku", "skus", "maratón", "maraton", "calzado", "calzados",
        "deporte", "deportes", "moda", "google trends", "trends", "ventas", "venta",
        "ticket promedio", "oferta comercial", "ofertas", "consumidor", "catálogo", "catalogo",
        "supermercado", "omnichannel", "omnicanal", "promocion", "promoción", "descuento",
        "buen fin", "hot sale"
    ]
    fintech_keywords = [
        "fintech", "banco", "bancos", "banca", "churn", "abandono", "fuga de capital", "fuga",
        "tasa", "tasas", "crédito", "credito", "créditos", "creditos", "inversión", "inversion",
        "inversiones", "next-best-action", "nba", "patrimonial", "spei", "tarjeta", "tarjetas",
        "rendimiento", "rendimientos", "tesorería", "tesoreria", "cetis", "cetes", "préstamo",
        "prestamo", "cuenta", "depósito", "deposito", "saldo", "saldos", "pyme"
    ]
    
    retail_score = sum(1 for k in retail_keywords if k in combined)
    logistica_score = sum(1 for k in logistica_keywords if k in combined)
    fintech_score = sum(1 for k in fintech_keywords if k in combined)
    
    max_score = max(retail_score, logistica_score, fintech_score)
    if max_score >= 1:
        if logistica_score == max_score and logistica_score > 0:
            return "logistica"
        elif retail_score == max_score and retail_score > 0:
            return "retail"
        elif fintech_score == max_score and fintech_score > 0:
            return "fintech"
    return None

# --- ENDPOINTS ---

@app.post("/api/chat/general")
def chat_general(request: ChatRequest):
    session_id = request.session_id
    user_message = request.message.strip()
    
    client = get_genai_client()
    if client:
        for model_name in MODEL_CANDIDATES:
            try:
                if session_id not in chat_sessions_general:
                    search_tool = types.Tool(google_search=types.GoogleSearch())
                    config = types.GenerateContentConfig(
                        tools=[search_tool],
                        system_instruction=GENERAL_SYSTEM_INSTRUCTION,
                        temperature=0.7
                    )
                    chat_sessions_general[session_id] = client.chats.create(
                        model=model_name,
                        config=config
                    )
                
                chat = chat_sessions_general[session_id]
                response = chat.send_message(user_message)
                
                sources = []
                if response.candidates:
                    candidate = response.candidates[0]
                    sources = extract_grounding_sources(candidate)
                
                for tl in extract_links_from_text(response.text or ""):
                    if not any(s.get("url") == tl["url"] for s in sources):
                        sources.append(tl)
                
                agente_sugerido = detectar_agente_sugerido(user_message, response.text or "")
                
                return {
                    "response": response.text,
                    "sources": sources,
                    "agente_sugerido": agente_sugerido
                }
            except Exception as e:
                print(f"[Backend] Error con modelo {model_name} en chat_general: {e}")
                if session_id in chat_sessions_general:
                    del chat_sessions_general[session_id]
                continue
    
    raise HTTPException(status_code=500, detail="No se pudo conectar con el servicio de Gemini. Por favor verifica tus credenciales de Google Cloud o API Key.")

@app.post("/api/chat/retail")
def chat_retail(request: ChatRequest):
    session_id = request.session_id
    user_message = request.message.strip()
    
    client = get_genai_client()
    if client:
        for model_name in MODEL_CANDIDATES:
            try:
                if session_id not in chat_sessions_retail:
                    config = types.GenerateContentConfig(
                        system_instruction=RETAIL_SYSTEM_INSTRUCTION,
                        temperature=0.7
                    )
                    chat_sessions_retail[session_id] = client.chats.create(
                        model=model_name,
                        config=config
                    )
                chat = chat_sessions_retail[session_id]
                response = chat.send_message(user_message)
                return {"response": response.text}
            except Exception as e:
                print(f"[Backend] Error con modelo {model_name} en chat_retail: {e}")
                if session_id in chat_sessions_retail:
                    del chat_sessions_retail[session_id]
                continue

    raise HTTPException(status_code=500, detail="No se pudo conectar con Gemini para el Agente Retail.")

@app.get("/api/retail/chart")
def get_retail_chart_data():
    return SAMPLE_VENTAS_RETAIL

def extract_action_payload(text: str):
    if not text:
        return None
    try:
        match = re.search(r'```(?:json_action|json)?\s*(\{[\s\S]*?"action"\s*:[\s\S]*?\})\s*```', text)
        if match:
            return json.loads(match.group(1))
    except Exception as e:
        print(f"[Backend] Error extrayendo action_payload: {e}")
    return None

@app.post("/api/chat/logistica")
def chat_logistica(request: ChatRequest):
    session_id = request.session_id
    user_message = request.message.strip()
    
    client = get_genai_client()
    if client:
        for model_name in MODEL_CANDIDATES:
            try:
                if session_id not in chat_sessions_logistica:
                    config = types.GenerateContentConfig(
                        system_instruction=LOGISTICA_SYSTEM_INSTRUCTION,
                        temperature=0.7
                    )
                    chat_sessions_logistica[session_id] = client.chats.create(
                        model=model_name,
                        config=config
                    )
                chat = chat_sessions_logistica[session_id]
                response = chat.send_message(user_message)
                raw_text = response.text or ""
                action_payload = extract_action_payload(raw_text)
                
                clean_text = re.sub(r'```json_action[\s\S]*?```', '', raw_text).strip()
                
                return {
                    "response": clean_text if clean_text else raw_text,
                    "action_payload": action_payload
                }
            except Exception as e:
                print(f"[Backend] Error con modelo {model_name} en chat_logistica: {e}")
                if session_id in chat_sessions_logistica:
                    del chat_sessions_logistica[session_id]
                continue

    raise HTTPException(status_code=500, detail="No se pudo conectar con Gemini para el Agente de Logística.")

@app.get("/api/logistica/data")
def get_logistica_data():
    return LOGISTICA_MASTER_DATA

@app.get("/api/map")
def get_map_data():
    return LOGISTICA_MASTER_DATA.get("alerts", [])

@app.post("/api/chat/fintech")
def chat_fintech(request: ChatRequest):
    session_id = request.session_id
    user_message = request.message.strip()
    
    client = get_genai_client()
    if client:
        for model_name in MODEL_CANDIDATES:
            try:
                if session_id not in chat_sessions_fintech:
                    config = types.GenerateContentConfig(
                        system_instruction=FINTECH_SYSTEM_INSTRUCTION,
                        temperature=0.7
                    )
                    chat_sessions_fintech[session_id] = client.chats.create(
                        model=model_name,
                        config=config
                    )
                chat = chat_sessions_fintech[session_id]
                response = chat.send_message(user_message)
                return {"response": response.text}
            except Exception as e:
                print(f"[Backend] Error con modelo {model_name} en chat_fintech: {e}")
                if session_id in chat_sessions_fintech:
                    del chat_sessions_fintech[session_id]
                continue

    raise HTTPException(status_code=500, detail="No se pudo conectar con Gemini para el Agente Fintech.")

@app.get("/api/fintech/chart")
def get_fintech_chart_data():
    return SAMPLE_FINTECH_DATA

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = os.path.join(frontend_dir, full_path)
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    }
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path, headers=headers)
    return FileResponse(os.path.join(frontend_dir, "index.html"), headers=headers)
