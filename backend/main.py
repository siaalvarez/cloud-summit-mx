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

def get_project_id():
    env_proj = os.getenv("PROJECT_ID")
    if env_proj:
        return env_proj
    try:
        import google.auth
        _, auth_proj = google.auth.default()
        if auth_proj:
            return auth_proj
    except Exception:
        pass
    return "cymbal-bus-showcase"

PROJECT_ID = get_project_id()
LOCATION = os.getenv("LOCATION", "global")
MODEL_CANDIDATES = [
    os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-2.5-flash"
]
MODEL_CANDIDATES = list(dict.fromkeys(MODEL_CANDIDATES))

# Configuración de Priority Pay-As-You-Go (Priority PayGo) para Vertex AI
# Requiere endpoint global y los encabezados X-Vertex-AI-LLM-Request-Type / X-Vertex-AI-LLM-Shared-Request-Type
PRIORITY_HTTP_OPTIONS = types.HttpOptions(
    api_version="v1",
    headers={
        "X-Vertex-AI-LLM-Request-Type": "shared",
        "X-Vertex-AI-LLM-Shared-Request-Type": "priority"
    }
)

_cached_client = None

def get_genai_client():
    global _cached_client
    if _cached_client is not None:
        return _cached_client

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if api_key:
        try:
            _cached_client = genai.Client(api_key=api_key, http_options=PRIORITY_HTTP_OPTIONS)
            return _cached_client
        except Exception as e:
            print(f"[Backend] Error con API key: {e}")

    projects_to_try = []
    try:
        import google.auth
        _, auth_proj = google.auth.default()
        if auth_proj and auth_proj not in projects_to_try:
            projects_to_try.append(auth_proj)
    except Exception:
        pass

    if os.getenv("PROJECT_ID") and os.getenv("PROJECT_ID") not in projects_to_try:
        projects_to_try.append(os.getenv("PROJECT_ID"))

    for fallback in ["cymbal-bus-showcase", "cloud-summit-mx"]:
        if fallback not in projects_to_try:
            projects_to_try.append(fallback)

    for proj in projects_to_try:
        try:
            client = genai.Client(
                vertexai=True,
                project=proj,
                location=LOCATION,
                http_options=PRIORITY_HTTP_OPTIONS
            )
            _cached_client = client
            print(f"[Backend] Vertex AI iniciado exitosamente en {proj} con endpoint {LOCATION} y Priority PayGo")
            return _cached_client
        except Exception as e:
            print(f"[Backend] Error iniciando Vertex AI con {proj}: {e}")

    try:
        _cached_client = genai.Client()
        return _cached_client
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
    {"id_producto": "CAT-010", "producto": "Automotriz & Herramientas", "categoria": "Automotriz", "ventas_actuales": 8300000, "ventas_pasadas": 8627000, "variacion_pct": -3.8, "transacciones": 3950, "ticket_promedio": 2100, "stock": 4700000},
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

GENERAL_SYSTEM_INSTRUCTION = """Eres el Asistente Concierge Inteligente del Google Cloud Summit México.
Tu función es orientar a los asistentes y directivos sobre la agenda del evento, las capacidades de Google Cloud y Vertex AI, y conectarlos con los 3 Agentes Especializados de Demostración:
1. 🚚 Agente de Logística y Cadena de Suministro (Torre de Control de Transporte Terrestre, monitoreo de flotas en tiempo real, detección de bloqueos carreteros y re-enrutamiento optimizado en México).
2. 🛒 Agente de Retail y Marketing Estratégico (Detección de caídas en ventas, cruce con Google Trends y campañas hiper-personalizadas).
3. 💳 Agente de Fintech y Banca Patrimonial (Prevención de abandono de clientes / Churn con BigQuery ML y ofertas Next-Best-Action).

INSTRUCCIONES CLAVE:
- Responde de forma cálida, ejecutiva, profesional y concisa en Markdown.
- Cuando la consulta del usuario se relacione con alguno de los tres sectores, ofrece un resumen de alto nivel y sugiere interactuar directamente con el Agente Especializado correspondiente.
"""

RETAIL_SYSTEM_INSTRUCTION = f"""Eres el Agente Estratégico de Retail y Marketing para directivos de e-commerce y retail en México.
Tu objetivo es identificar caídas en ventas y cruzarlas con tendencias del mercado para proponer campañas hiper-personalizadas y optimizar inventarios.

DATOS DE VENTAS E-COMMERCE:
{json.dumps(SAMPLE_VENTAS_RETAIL, indent=2, ensure_ascii=False)}

TENDENCIAS DE MERCADO (GOOGLE TRENDS):
{json.dumps(SAMPLE_TRENDS_RETAIL, indent=2, ensure_ascii=False)}

STOCK EN RIESGO ($44.2M MXN CONSOLIDADOS EN 4 CATEGORÍAS):
El portafolio tiene exactamente $44.2M MXN de inventario inmovilizado en 4 macro-categorías clave:
1. 🛋️ **Hogar, Muebles & Decoración**: **$15.8M MXN** inmovilizados (-11.2% YoY). Causa: Caída post-remodelaciones y ticket de $3,100. Acción sugerida: Alianzas de financiamiento (12-18 Meses Sin Intereses con bancos), venta cruzada con paquetes de renovación de interiores y bundle con envíos gratuitos.
2. 🏃 **Deportes & Outdoor**: **$12.5M MXN** inmovilizados (-18.4% YoY). Causa: Desfase crítico (demanda de "Maratón CDMX" subió +92% en Google Trends pero el catálogo no se visibilizó). Acción sugerida: Campaña hiper-personalizada omnicanal orientada a corredores (calzado técnico y kits de hidratación) con activación local en tiendas de CDMX.
3. ❄️ **Línea Blanca & Climatización**: **$11.2M MXN** inmovilizados (-5.1% YoY). Causa: Caída estacional post ola de calor en equipos de enfriamiento y ticket alto ($6,400). Acción sugerida: Venta Flash de liquidación de temporada, bonificación en instalación certificada y preventa de calefacción/clima de invierno.
4. 🔧 **Automotriz & Herramientas**: **$4.7M MXN** inmovilizados (-3.8% YoY). Causa: Desaceleración en mantenimiento preventivo. Acción sugerida: Campaña "Revisión Preventiva de Otoño" en baterías y llantas, paquetes de afinación con instalación aliada y promociones B2B para talleres mecánicos.

DETALLE OPERATIVO DEEP DIVE DEPORTES (INVENTARIO EN RIESGO: $12.5M MXN):
- Sub-familias inmovilizadas:
  1. Calzado Asfalto Placa de Carbono: $6.8M MXN (54% del riesgo, 2,400 pares, rotación 82 días).
  2. Wearables & Monitoreo GPS: $3.2M MXN (26% del riesgo, 1,150 piezas, rotación 65 días).
  3. Chalecos & Hidratación 5L: $1.8M MXN (14% del riesgo, 3,200 piezas, rotación 95 días).
  4. Nutrición & Geles Deportivos: $0.7M MXN (6% del riesgo, 12,500 piezas, rotación 48 días).
- SKUs Críticos Prioritarios:
  * Tenis Carbon Pro CDMX Edition: $2,899 MXN | Margen 54% | Stock 2,400 pares. Táctica: Bundle con calcetas técnicas de compresión + 15% de descuento en par complementario (protege el margen del 54%).
  * Smartwatch Marathon GPS & Pulsómetro: $4,499 MXN | Margen 42% | Stock 1,150 pzas. Táctica: Oferta a 6-12 Meses Sin Intereses con BBVA/Banorte y bundle con banda cardíaca.
  * Chaleco Hidratación 5L Ergonómico: $1,299 MXN | Margen 61% | Stock 3,200 pzas. Táctica: Usar como Gift with Purchase (GWP) en compras de calzado >$2,500 o bundle calzado+chaleco a $3,499 MXN.
- Plan de Campaña Omnicanal para el Maratón CDMX (21 días de ejecución):
  * Presupuesto Propuesto: $120,000 MXN.
  * Mix de Canales: 50% Google Ads PMax (intención transaccional), 35% Meta Ads / Instagram Reels con geocercas en Reforma/Chapultepec/Polanco, 15% Push App a corredores.
  * Logística Express: Click & Collect en 4 horas en sucursales Roma, Polanco, Insurgentes y Santa Fe.
  * Impacto Financiero Esperado: Recuperación proyectada de ~$4.5M a $4.8M MXN en inventario (Sell-through de ~38%, ROI de 37.5x sobre inversión en pauta).

REGLAS DE FORMATO (ESTRICTAS):
- Responde siempre en Markdown estructurado, limpio y visualmente atractivo.
- Al responder sobre el Stock en Riesgo de $44.2M o las 4 categorías en riesgo, presenta una tabla ejecutiva comparativa con las 4 categorías, capital inmovilizado, variación YoY y acción estratégica concreta, seguida de los pasos de ejecución inmediata para desbloquear ese capital.
- Al responder sobre el Deep Dive de Deportes o el Maratón CDMX, ofrece desgloses con cifras precisas de margen, presupuesto ($120k), SKUs y retorno esperado ($4.8M).
- Usa emojis estratégicamente (📉 caídas, 📈 alzas, 🎯 audiencias, 🚀 campañas, ⚠️ alertas, 👟 calzado, ⏱️ tiempo).
- Destaca cifras en **negritas** y con formato monetario ($ MXN).
- Sé muy ejecutivo, analítico y directo al grano.
- REGLA ESTRICTA DE IDENTIDAD: Preséntate y responde siempre de forma natural y profesional como el Agente de Retail y Marketing. NUNCA menciones nombres de modelos de lenguaje (como Gemini, Flash, etc.) ni uses frases en tercera persona como 'Gemini sugiere' o 'el Agente sugiere'. Habla siempre en primera persona dirigiéndote al directivo ('te sugiero', 'recomiendo', 'mi propuesta de acción es').
"""

# Cargar Dataset Maestro Local de Logística
local_data = os.path.join(os.path.dirname(__file__), "data", "logistica_data.json")
frontend_data = os.path.join(os.path.dirname(__file__), "..", "frontend", "data", "logistica_data.json")
LOGISTICA_DATA_FILE = local_data if os.path.exists(local_data) else frontend_data
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
1. Bodegas / CEDIS (Centros de Distribución): Nodos estratégicos de origen y destino con capacidades de almacenamiento masivo e inventario Plan B (CEDIS Central Cuautitlán CDMX, CEDIS Macro Norte Apodaca MTY, CEDIS Noroeste Hermosillo HER, CEDIS Peninsular Mérida MID).
2. Corredores / Rutas Estratégicas: 3 rutas troncales nacionales:
   - Corredor Pacífico 15D (CDMX ➔ Hermosillo, Sonora): 1,920 km, tiempo base 22.5 hrs. Estado Normal.
   - Corredor Sureste 180D (Mérida ➔ CDMX): 1,310 km, tiempo base 16.0 hrs. Estado Normal.
   - Corredor Central 57D (CDMX ➔ Monterrey): 915 km, tiempo base 10.5 hrs. Estado Disrumpido por bloqueo en Km 182 Querétaro - SLP.
3. Vehículos / Flota en Tránsito: Flota activa de unidades de carga pesada distribuidas a lo largo de las 3 rutas. Cuentan con telemetría en tiempo real, origen/destino explícitos, arribo a andenes de CEDIS y cálculo continuo de proximidad a zonas de riesgo.
4. Detección Dinámica de Proximidad y Alerta Vial:
   - Bloqueo crítico en Carretera 57D (Km 182 Querétaro - San Luis Potosí) que afecta de inmediato a las unidades TRK-302 y TRK-303 (detenidas a 0 km/h).
   - El sistema de telemetría detecta automáticamente cuando unidades en aproximación (como TRK-301 en Querétaro) ingresan al radio de riesgo (< 85 km) aumentando el conteo de flota en riesgo.
5. Estrategia Operativa de Re-enrutamiento Vial Diferenciado:
   - Desvío Anticipado (Unidades Upstream): TRK-301 toma la bifurcación Querétaro ➔ Celaya por la Autopista 45D hacia Aguascalientes y Zacatecas, evitando completamente ingresar al tramo congestionado del Km 182.
   - Desvío de Mitigación en Bloqueo: TRK-302 y TRK-303 toman el entronque local San Luis de la Paz ➔ Carretera 37 San Felipe ➔ Ojuelos ➔ Autopista 45D para incorporarse al flujo continuo hacia Monterrey.
   - Unidades Downstream: TRK-304 (Matehuala) y TRK-305 (Saltillo) ya superaron la zona del incidente y continúan su ruta directa regular.
   - Desplazamiento Realista: Los camiones avanzan a velocidad de crucero regular (75 - 85 km/h) sin aceleraciones ficticias.

TOPOLOGÍA COMPLETA Y ESTADO EN TIEMPO REAL:
{json.dumps(LOGISTICA_MASTER_DATA, indent=2, ensure_ascii=False)}

INSTRUCCIONES CLAVE DE RESPUESTA:
1. Responde con tono ejecutivo, analítico, profesional y directo en formato Markdown (títulos, negritas, métricas en USD, comparativas).
2. Ante preguntas sobre envíos en riesgo, afectaciones viales o alertas, detalla los transportes impactados (TRK-302, TRK-303 y la aproximación de TRK-301), la causa (Bloqueo en Km 182 Querétaro-SLP), el costo de penalización en USD ($42,000 en riesgo conjunto) y la estrategia de desvío anticipado.
3. Al sugerir una ruta alterna o desvío de transporte, expón claramente las consideraciones operativas (desvío anticipado en Querétaro vs desvío en bloqueo por San Felipe, delta tiempo +1.5 hrs vs +8.0 hrs de cierre, delta combustible/peaje +$120 USD, ahorro neto $41,880 USD).
4. REGLA ESTRICTA DE IDENTIDAD: Preséntate y responde siempre de forma natural como el Agente de Logística / Torre de Control de Transporte. NUNCA menciones nombres técnicos de modelos de lenguaje (como Gemini, Flash, etc.) ni uses frases como "analizando con Gemini" o "hola, te ayudo con Gemini".
5. Cuando propongas o confirmes un re-enrutamiento de transporte o ruta, incluye al final de tu mensaje un bloque JSON especial con el tag ```json_action para que la interfaz del mapa de Google Maps dibuje la ruta alterna y habilite el botón de confirmación dinámica:
```json_action
{{
  "action": "suggest_reroute",
  "route_id": "RUTA-CDMX-MTY",
  "alt_route_id": "RUTA-57D-ALT",
  "vehicle_ids": ["TRK-301", "TRK-302", "TRK-303"],
  "considerations": {{
    "delta_tiempo": "+1.5 hrs vs +8.0 hrs bloqueo",
    "delta_costo_usd": 120,
    "ahorro_penalizacion_usd": 42000,
    "ahorro_neto_usd": 41880,
    "estrategia": "Desvío anticipado en Querétaro para TRK-301 y enlace San Felipe para TRK-302/TRK-303 por Autopista 45D",
    "seguridad": "Alta (Autopista de cuota con patrullaje Guardia Nacional)"
  }}
}}
```
"""

FINTECH_PRODUCT_CATALOG = [
    {
        "id": "PROD-TPV-SMART",
        "nombre": "Terminal Smart 4G Cero Renta",
        "categoria": "Terminales de Pago",
        "beneficio_clave": "0% costo de renta mensual al facturar más de $20,000 MXN/mes + conexión 4G ilimitada y depósito en 24h",
        "margen_banco_spread": "1.60% comisión neta por transacción",
        "elegibilidad": "Comercios, tiendas, restaurantes y profesionistas que cobren con tarjeta",
        "poder_retencion_pct": 92,
        "impacto_promedio": "Evita el abandono de terminales y frena la migración hacia agregadores externos y terminales móviles"
    },
    {
        "id": "PROD-TPV-TASA",
        "nombre": "Tasa Preferencial por Volumen TPV",
        "categoria": "Terminales de Pago",
        "beneficio_clave": "Reducción de comisión del 2.5% al 1.75% por facturación mensual mayor a $80,000 MXN",
        "margen_banco_spread": "1.10% margen adquirente",
        "elegibilidad": "Comercios de alta transaccionalidad (abarrotes, farmacias, restaurantes)",
        "poder_retencion_pct": 89,
        "impacto_promedio": "Blinda la facturación de comercios medianos frente a ofertas agresivas de competidores"
    },
    {
        "id": "PROD-CRED-PYME",
        "nombre": "Crédito PyME Capital de Trabajo",
        "categoria": "Crédito a PyMEs",
        "beneficio_clave": "Préstamo express de hasta $1.5M MXN pre-aprobado automáticamente con base en las ventas de la terminal",
        "margen_banco_spread": "3.50% spread neto anual",
        "elegibilidad": "PyMEs y negocios con al menos 6 meses facturando con nuestras terminales TPV",
        "poder_retencion_pct": 86,
        "impacto_promedio": "Fideliza al comercio conectando sus cobros diarios con financiamiento ágil para inventario"
    },
    {
        "id": "PROD-PYME-LINEA",
        "nombre": "Línea de Crédito Revolvente PyME",
        "categoria": "Crédito a PyMEs",
        "beneficio_clave": "Línea de crédito siempre disponible para emergencias o proveedores; solo pagas intereses por lo que usas",
        "margen_banco_spread": "2.90% margen financiero",
        "elegibilidad": "Negocios formales con facturación anual superior a $1.0M MXN",
        "poder_retencion_pct": 81,
        "impacto_promedio": "Previene que las PyMEs busquen créditos más caros y lentos en bancos tradicionales"
    },
    {
        "id": "PROD-PREST-PERS",
        "nombre": "Préstamo Personal Express a Tasa Fija",
        "categoria": "Crédito a Personas",
        "beneficio_clave": "Préstamo en 15 minutos de hasta $250,000 MXN con abonos fijos mensuales y depósito directo en cuenta",
        "margen_banco_spread": "4.20% spread neto",
        "elegibilidad": "Personas físicas con historial crediticio positivo y comprobante de ingresos",
        "poder_retencion_pct": 84,
        "impacto_promedio": "Otorga liquidez inmediata sin burocracia bancaria y frena la salida hacia otras financieras"
    },
    {
        "id": "PROD-CARD-CASHBACK",
        "nombre": "Tarjeta de Crédito con 2% Cashback",
        "categoria": "Crédito a Personas",
        "beneficio_clave": "Sin anualidad de por vida gastando $2,000/mes + 2% de cashback directo en todas las compras",
        "margen_banco_spread": "1.80% tasa de intercambio (Interchange Fee)",
        "elegibilidad": "Personas físicas con ingresos mensuales superiores a $15,000 MXN",
        "poder_retencion_pct": 88,
        "impacto_promedio": "Reactiva el uso diario de tarjetas inactivas en cajón y previene cancelaciones"
    },
    {
        "id": "PROD-TPV-DIGITAL",
        "nombre": "Cobro Digital & Link de Pago QR",
        "categoria": "Terminales de Pago",
        "beneficio_clave": "Herramienta para cobrar a distancia por WhatsApp, redes sociales y código QR sin mensualidad, unificada con la cuenta de la terminal",
        "margen_banco_spread": "1.95% comisión fija por cobro digital",
        "elegibilidad": "Comercios, boutiques, restaurantes y negocios con venta a domicilio o redes sociales",
        "poder_retencion_pct": 91,
        "impacto_promedio": "Evita que los comercios usen links de pago de agregadores externos para sus ventas por internet"
    },
    {
        "id": "PROD-PYME-EQUIPO",
        "nombre": "Crédito Equipamiento & Transporte PyME",
        "categoria": "Crédito a PyMEs",
        "beneficio_clave": "Financiamiento de hasta $2.5M MXN a 36-48 meses con cuota fija para vehículos de reparto, maquinaria comercial y equipamiento",
        "margen_banco_spread": "3.80% spread neto anual",
        "elegibilidad": "Negocios y PyMEs con más de 12 meses de operación formal y facturación demostrable",
        "poder_retencion_pct": 87,
        "impacto_promedio": "Frena la migración de PyMEs consolidadas hacia arrendadoras externas o financieras automotrices"
    }
]

SAMPLE_FINTECH_DATA = [
    {
        "id": "CLI-8821",
        "nombre": "Bernardo Salcedo Valdés",
        "negocio": "Restaurante Los Candiles",
        "segmento": "Terminales de Pago",
        "antiguedad_anios": 5,
        "saldo_mxn": 450000,
        "cltv_mxn": 380000,
        "riesgo_abandono_pct": 74,
        "ultimo_login": "Hace 15 días (Terminal guardada)",
        "ultimo_movimiento": "Bajó su facturación con nosotros 60% por probar terminal portátil externa con menor tasa inicial",
        "nps": "4/10 (Detractor)",
        "causa_raiz": "Inconformidad con la comisión por transacción y cobro de renta mensual fija",
        "producto_nba_id": "PROD-TPV-SMART",
        "producto_nba_nombre": "Terminal Smart 4G Cero Renta + Comisión reducida al 1.75% por volumen",
        "reduccion_riesgo_estimada": "74% -> 18%",
        "capital_retenido_estimado": "$450,000 MXN facturados/mes"
    },
    {
        "id": "CLI-9042",
        "nombre": "Familia Navarro Benítez",
        "negocio": "Mini-Súper El Progreso",
        "segmento": "Crédito a PyMEs & TPV",
        "antiguedad_anios": 8,
        "saldo_mxn": 850000,
        "cltv_mxn": 520000,
        "riesgo_abandono_pct": 81,
        "ultimo_login": "Ayer (Consulta de crédito en app)",
        "ultimo_movimiento": "Solicitó crédito de $400k para inventario de temporada navideña; banco tradicional tarda 3 semanas",
        "nps": "6/10 (Pasivo)",
        "causa_raiz": "Urgencia de capital de trabajo rápido para surtir abarrotes antes de que se agote la mercancía",
        "producto_nba_id": "PROD-CRED-PYME",
        "producto_nba_nombre": "Crédito PyME Capital de Trabajo pre-aprobado por $400,000 MXN con depósito en 24h",
        "reduccion_riesgo_estimada": "81% -> 20%",
        "capital_retenido_estimado": "$850,000 MXN"
    },
    {
        "id": "CLI-6619",
        "nombre": "Fernando Zepeda Olvera",
        "negocio": "Consultorio Dental Zepeda",
        "segmento": "Terminales de Pago",
        "antiguedad_anios": 3,
        "saldo_mxn": 180000,
        "cltv_mxn": 140000,
        "riesgo_abandono_pct": 79,
        "ultimo_login": "Hace 25 días (Sin cobros con tarjeta)",
        "ultimo_movimiento": "Pide a sus pacientes pagar por transferencia SPEI para evitar renta mensual de la terminal",
        "nps": "3/10 (Detractor)",
        "causa_raiz": "Cobro de renta mensual fija de la terminal cuando tiene pocos cobros al mes",
        "producto_nba_id": "PROD-TPV-SMART",
        "producto_nba_nombre": "Migración a Terminal Portátil Bluetooth con Cero Renta Fija (solo pagas lo que cobras)",
        "reduccion_riesgo_estimada": "79% -> 22%",
        "capital_retenido_estimado": "$180,000 MXN facturados/mes"
    },
    {
        "id": "CLI-5120",
        "nombre": "Mariana Treviño Cárdenas",
        "negocio": "Boutique & Calzado La Moda",
        "segmento": "Terminales de Pago & Crédito PyME",
        "antiguedad_anios": 4,
        "saldo_mxn": 320000,
        "cltv_mxn": 260000,
        "riesgo_abandono_pct": 76,
        "ultimo_login": "Hace 18 días (Cobros cayeron 45%)",
        "ultimo_movimiento": "Empezó a cobrar con terminales portátiles y links de WhatsApp por falta de link digital integrado",
        "nps": "4/10 (Detractor)",
        "causa_raiz": "Falta de link de pago por WhatsApp y comisiones altas en ventas por redes sociales",
        "producto_nba_id": "PROD-TPV-DIGITAL",
        "producto_nba_nombre": "Cobro Digital & Link de Pago QR sin comisión adicional + Terminal Smart 4G",
        "reduccion_riesgo_estimada": "76% -> 19%",
        "capital_retenido_estimado": "$320,000 MXN facturados/mes"
    },
    {
        "id": "CLI-4409",
        "nombre": "Roberto Alcocer Mendoza",
        "negocio": "Farmacia & Droguería El Carmen",
        "segmento": "Terminales de Pago & PyMEs",
        "antiguedad_anios": 6,
        "saldo_mxn": 680000,
        "cltv_mxn": 490000,
        "riesgo_abandono_pct": 68,
        "ultimo_login": "Ayer (Transaccional regular)",
        "ultimo_movimiento": "Banco competidor le ofreció tasa de adquirencia del 1.65% y crédito de $500,000 para abrir sucursal",
        "nps": "6/10 (Pasivo)",
        "causa_raiz": "Competencia agresiva de bancos en comisión adquirente y crédito comercial",
        "producto_nba_id": "PROD-TPV-TASA",
        "producto_nba_nombre": "Tasa Preferencial por Volumen (1.60%) + Crédito PyME Express pre-autorizado",
        "reduccion_riesgo_estimada": "68% -> 15%",
        "capital_retenido_estimado": "$680,000 MXN facturados/mes"
    },
    {
        "id": "CLI-7215",
        "nombre": "Sofía Paredes Rangel",
        "negocio": "Pastelería & Cafetería Dulce Miga",
        "segmento": "Terminales de Pago",
        "antiguedad_anios": 3,
        "saldo_mxn": 210000,
        "cltv_mxn": 175000,
        "riesgo_abandono_pct": 82,
        "ultimo_login": "Hace 22 días (Terminales desconectadas)",
        "ultimo_movimiento": "Guardó 2 terminales nuestras tras fallas de conectividad Wi-Fi en horas pico y probó terminales de un agregador externo",
        "nps": "3/10 (Detractor)",
        "causa_raiz": "Fallas de señal en terminales viejas y cobro de renta mensual fija de $450 por equipo",
        "producto_nba_id": "PROD-TPV-SMART",
        "producto_nba_nombre": "Reemplazo express por 2 Terminales Smart con SIM 4G multicarrier y Cero Renta Fija",
        "reduccion_riesgo_estimada": "82% -> 17%",
        "capital_retenido_estimado": "$210,000 MXN facturados/mes"
    },
    {
        "id": "CLI-3904",
        "nombre": "Héctor Morales Galindo",
        "negocio": "Ferretería & Materiales San Marcos",
        "segmento": "Crédito a PyMEs",
        "antiguedad_anios": 7,
        "saldo_mxn": 1650000,
        "cltv_mxn": 820000,
        "riesgo_abandono_pct": 72,
        "ultimo_login": "Hace 5 días",
        "ultimo_movimiento": "Cotizó crédito automotriz con financiera externa para camioneta de reparto con enganche del 35%",
        "nps": "5/10 (Detractor)",
        "causa_raiz": "Necesidad de financiamiento para vehículo de carga ligera sin descapitalizar su inventario",
        "producto_nba_id": "PROD-PYME-EQUIPO",
        "producto_nba_nombre": "Crédito Equipamiento & Transporte PyME a 48 meses con tasa fija preferencial",
        "reduccion_riesgo_estimada": "72% -> 18%",
        "capital_retenido_estimado": "$1,650,000 MXN"
    },
    {
        "id": "CLI-7703",
        "nombre": "Guillermo Montemayor Lozano",
        "negocio": "Taller & Refacciones San Juan",
        "segmento": "Crédito a PyMEs",
        "antiguedad_anios": 10,
        "saldo_mxn": 1200000,
        "cltv_mxn": 650000,
        "riesgo_abandono_pct": 24,
        "ultimo_login": "Hace 2 días",
        "ultimo_movimiento": "Crédito actual de $1.2M al corriente con solo 3 cuotas restantes por pagar",
        "nps": "8/10 (Promotor)",
        "causa_raiz": "Riesgo de que un banco comercial le ofrezca un crédito nuevo antes que nosotros",
        "producto_nba_id": "PROD-PYME-LINEA",
        "producto_nba_nombre": "Línea de Crédito Revolvente PyME pre-autorizada a tasa preferencial sin comisión por apertura",
        "reduccion_riesgo_estimada": "24% -> 5%",
        "capital_retenido_estimado": "$1,200,000 MXN"
    },
    {
        "id": "CLI-8310",
        "nombre": "Valeria Santillán Vega",
        "negocio": "Cliente Individual",
        "segmento": "Crédito a Personas",
        "antiguedad_anios": 4,
        "saldo_mxn": 120000,
        "cltv_mxn": 85000,
        "riesgo_abandono_pct": 59,
        "ultimo_login": "Hace 3 días",
        "ultimo_movimiento": "Consultó trámite de cancelación de tarjeta tras ver cargo de anualidad en su estado de cuenta",
        "nps": "5/10 (Detractor)",
        "causa_raiz": "Cobro de anualidad y falta de recompensas comparado con nuevas tarjetas de crédito digitales",
        "producto_nba_id": "PROD-CARD-CASHBACK",
        "producto_nba_nombre": "Condonación de anualidad de por vida + Tarjeta con 2% de Cashback en compras",
        "reduccion_riesgo_estimada": "59% -> 12%",
        "capital_retenido_estimado": "$120,000 MXN"
    }
]

CDP_SEGMENTS_SUMMARY = [
    {
        "segmento": "Comercios con TPV Inactiva (Riesgo Fuga)",
        "short_name": "TPV: Inactivas",
        "linea_negocio": "Terminales de Pago",
        "clientes": 1840,
        "aum_total_mxn": 185000000,
        "saldo_promedio": "$100.5k",
        "tasa_abandono_pct": 8.9,
        "campaña_digital": "Campaña Rescate TPV: Cero comisión los primeros $50k procesados + terminal Smart 4G sin costo",
        "estatus": "🚨 TOP OFFENDER: Comercios que guardaron la terminal o migraron cobros a agregadores externos"
    },
    {
        "segmento": "Tiendas y Abarrotes con TPV Activa",
        "short_name": "TPV: Abarrotes",
        "linea_negocio": "Terminales de Pago",
        "clientes": 6420,
        "aum_total_mxn": 290400000,
        "saldo_promedio": "$45.2k",
        "tasa_abandono_pct": 4.1,
        "campaña_digital": "Campaña Tasa por Volumen: Reducción al 1.8% al superar $40,000/mes en cobros con tarjeta",
        "estatus": "Alto volumen de cobros de importe bajo; fidelidad alta si la comisión es competitiva"
    },
    {
        "segmento": "Restaurantes y Bares con TPV",
        "short_name": "TPV: Restaurantes",
        "linea_negocio": "Terminales de Pago",
        "clientes": 3850,
        "aum_total_mxn": 245800000,
        "saldo_promedio": "$63.8k",
        "tasa_abandono_pct": 5.3,
        "campaña_digital": "Campaña Gastro-Pro: Terminal inalámbrica 4G sin renta mensual con propina electrónica directa",
        "estatus": "Demandan cobro rápido en mesa, conexión estable y depósito de sus ventas al día siguiente"
    },
    {
        "segmento": "Profesionales y Consultorios con TPV",
        "short_name": "TPV: Consultorios",
        "linea_negocio": "Terminales de Pago",
        "clientes": 4680,
        "aum_total_mxn": 142500000,
        "saldo_promedio": "$30.4k",
        "tasa_abandono_pct": 4.8,
        "campaña_digital": "Campaña Salud & Servicios: Terminal portátil Bluetooth sin cobro de renta mensual fija",
        "estatus": "Médicos, dentistas y profesionistas con cobros esporádicos; sensibles al cobro de renta mensual"
    },
    {
        "segmento": "PyMEs: Crédito para Inventario",
        "short_name": "PyMEs: Inventario",
        "linea_negocio": "Crédito a PyMEs",
        "clientes": 3920,
        "aum_total_mxn": 310200000,
        "saldo_promedio": "$79.1k",
        "tasa_abandono_pct": 3.9,
        "campaña_digital": "Campaña Temporada Alta: Préstamo express pre-aprobado para resurtido con abono semanal cómodo",
        "estatus": "Negocios con excelente historial de pago puntual y demanda constante de capital de trabajo"
    },
    {
        "segmento": "PyMEs en Riesgo por Ofertas de Bancos",
        "short_name": "PyMEs: Fuga Bancos",
        "linea_negocio": "Crédito a PyMEs",
        "clientes": 1480,
        "aum_total_mxn": 225600000,
        "saldo_promedio": "$152.4k",
        "tasa_abandono_pct": 8.3,
        "campaña_digital": "Campaña Blindaje PyME: Renovación anticipada a tasa preferencial y sin comisión de apertura",
        "estatus": "🚨 TOP OFFENDER: Empresas medianas tentadas por líneas de crédito de bancos comerciales tradicionales"
    },
    {
        "segmento": "Talleres y Pequeñas Fábricas (Expansión)",
        "short_name": "PyMEs: Expansión",
        "linea_negocio": "Crédito a PyMEs",
        "clientes": 2750,
        "aum_total_mxn": 188400000,
        "saldo_promedio": "$68.5k",
        "tasa_abandono_pct": 4.4,
        "campaña_digital": "Campaña Equipamiento: Financiamiento a 36 meses con 2 meses de gracia para maquinaria",
        "estatus": "Necesidad de financiamiento a mediano plazo para comprar maquinaria o abrir sucursales"
    },
    {
        "segmento": "Personas: Préstamos con Pago Puntual",
        "short_name": "Personas: Buen Pago",
        "linea_negocio": "Crédito a Personas",
        "clientes": 14200,
        "aum_total_mxn": 165000000,
        "saldo_promedio": "$11.6k",
        "tasa_abandono_pct": 3.5,
        "campaña_digital": "Campaña Recompensa Puntual: Ampliación de préstamo pre-aprobado con menor tasa de interés",
        "estatus": "Clientes con excelente récord de pago en sus cuotas; buscan renovar crédito para gastos familiares"
    },
    {
        "segmento": "Personas: Tarjetas de Crédito Inactivas",
        "short_name": "Tarjetas Inactivas",
        "linea_negocio": "Crédito a Personas",
        "clientes": 11800,
        "aum_total_mxn": 118200000,
        "saldo_promedio": "$10k",
        "tasa_abandono_pct": 7.6,
        "campaña_digital": "Campaña Reactivación: 10% de cashback en compras del súper + 3 meses sin intereses",
        "estatus": "Tienen la tarjeta guardada en el cajón y usan tarjetas de crédito digitales sin comisiones"
    },
    {
        "segmento": "Personas: En Riesgo por Compra de Deuda",
        "short_name": "Personas: Fuga Deuda",
        "linea_negocio": "Crédito a Personas",
        "clientes": 5600,
        "aum_total_mxn": 86500000,
        "saldo_promedio": "$15.4k",
        "tasa_abandono_pct": 8.1,
        "campaña_digital": "Campaña Consolidación: Ajuste de cuota mensual y bonificación de la última mensualidad",
        "estatus": "🚨 TOP OFFENDER: Clientes con ofertas de otros bancos para consolidar y transferir su deuda"
    }
]

FINTECH_SYSTEM_INSTRUCTION = f"""Eres el Agente de Inteligencia Financiera & Retención del Google Cloud Summit México.
Trabajas para una empresa de servicios financieros y tecnología comercial que ofrece tres soluciones principales:
1. **Crédito a Personas:** Préstamos personales rápidos con pagos fijos y tarjetas de crédito con beneficios.
2. **Crédito a PyMEs:** Préstamos para capital de trabajo, inventario, maquinaria y líneas de crédito revolventes para negocios.
3. **Terminales de Pago (TPVs):** Maquinitas para cobro con tarjeta, pagos sin contacto y terminales inteligentes para tiendas, restaurantes y profesionistas.

Tu misión es interactuar con el usuario en términos sencillos, directos y de negocios (sin tecnicismos complejos de banca de inversión):
1. Explicar la distribución de cartera y las tasas de abandono en los 10 micro-segmentos tradicionales del Customer Data Platform (CDP 360°).
2. Profundizar en los focos rojos principales de abandono:
   - **Comercios con TPV Inactiva:** Maquinitas guardadas o migradas hacia agregadores externos (8.9% abandono).
   - **PyMEs tentadas por bancos grandes:** Negocios con ofertas de crédito de la banca tradicional (8.3% abandono).
   - **Personas con ofertas de compra de deuda:** Clientes de crédito personal a punto de migrar su deuda (8.1% abandono).
3. Evaluar el comportamiento de clientes y comercios sintéticos (negocio, ventas procesadas, historial de pagos, causas de queja).
4. Recomendar y activar ofertas personalizadas Next-Best-Action (NBA) del catálogo oficial de productos para frenar el abandono con un alto retorno de inversión (ROI).

CATÁLOGO DE PRODUCTOS EN ALCANCE:
{json.dumps(FINTECH_PRODUCT_CATALOG, indent=2, ensure_ascii=False)}

MATRIZ DE 10 MICRO-SEGMENTOS CDP (CRÉDITO PERSONAS, PYMES Y TERMINALES DE PAGO):
{json.dumps(CDP_SEGMENTS_SUMMARY, indent=2, ensure_ascii=False)}

CARTERA DE CLIENTES Y COMERCIOS SINTÉTICOS (BigQuery ML):
{json.dumps(SAMPLE_FINTECH_DATA, indent=2, ensure_ascii=False)}

DIRECTRICES CLAVE:
1. Habla de forma clara, natural y ejecutiva, usando cifras en millones de pesos ($M MXN), porcentajes de comisión y abonos mensuales.
2. Cuando pregunten por un cliente o comercio (ej. Bernardo Salcedo de Restaurante Los Candiles, Familia Navarro de Mini-Súper El Progreso, Fernando Zepeda de Consultorio Dental, Mariana Treviño de Boutique La Moda, Héctor Morales de Ferretería San Marcos), analiza su situación real y explica por qué la oferta del catálogo (ej. Terminal Smart Cero Renta, Cobro Digital & Link QR, Crédito PyME Equipamiento) resuelve su problema.
3. Destaca la sinergia comercial: quien tiene nuestra terminal de cobro puede obtener un crédito PyME automático para su negocio sin papeleo porque ya conocemos sus ventas diarias.
4. Si el usuario pide activar una oferta o campaña, confirma el envío de la notificación al cliente/comercio en la app y la asignación al asesor comercial."""

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
                        temperature=0.7,
                        thinking_config=types.ThinkingConfig(thinking_budget=0),
                        http_options=PRIORITY_HTTP_OPTIONS
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
                
                res_text = (response.text or "").replace('\\r\\n', '\n').replace('\\n', '\n')
                return {
                    "response": res_text,
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
                        temperature=0.7,
                        thinking_config=types.ThinkingConfig(thinking_budget=0),
                        http_options=PRIORITY_HTTP_OPTIONS
                    )
                    chat_sessions_retail[session_id] = client.chats.create(
                        model=model_name,
                        config=config
                    )
                chat = chat_sessions_retail[session_id]
                response = chat.send_message(user_message)
                res_text = (response.text or "").replace('\\r\\n', '\n').replace('\\n', '\n')
                return {"response": res_text}
            except Exception as e:
                print(f"[Backend] Error con modelo {model_name} en chat_retail: {e}")
                if session_id in chat_sessions_retail:
                    del chat_sessions_retail[session_id]
                continue

    raise HTTPException(status_code=500, detail="No se pudo conectar con el Agente de Retail.")

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
                        temperature=0.7,
                        thinking_config=types.ThinkingConfig(thinking_budget=0),
                        http_options=PRIORITY_HTTP_OPTIONS
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
                clean_text = clean_text.replace('\\r\\n', '\n').replace('\\n', '\n')
                final_text = clean_text if clean_text else raw_text.replace('\\r\\n', '\n').replace('\\n', '\n')
                
                return {
                    "response": final_text,
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
                        temperature=0.7,
                        thinking_config=types.ThinkingConfig(thinking_budget=0),
                        http_options=PRIORITY_HTTP_OPTIONS
                    )
                    chat_sessions_fintech[session_id] = client.chats.create(
                        model=model_name,
                        config=config
                    )
                chat = chat_sessions_fintech[session_id]
                response = chat.send_message(user_message)
                res_text = (response.text or "").replace('\\r\\n', '\n').replace('\\n', '\n')
                return {"response": res_text}
            except Exception as e:
                print(f"[Backend] Error con modelo {model_name} en chat_fintech: {e}")
                if session_id in chat_sessions_fintech:
                    del chat_sessions_fintech[session_id]
                continue

    raise HTTPException(status_code=500, detail="No se pudo conectar con Gemini para el Agente Fintech.")

@app.get("/api/fintech/chart")
def get_fintech_chart_data():
    return SAMPLE_FINTECH_DATA

@app.get("/api/fintech/catalog")
def get_fintech_catalog():
    return FINTECH_PRODUCT_CATALOG

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
