import vertexai
from google.cloud import aiplatform

PROJECT_ID = "cloud-summit-mx"
LOCATION = "us-central1"

aiplatform.init(project=PROJECT_ID, location=LOCATION)

print("Buscando modelos Gemini disponibles en la región us-central1...")
models = aiplatform.Model.list() # This lists custom models usually.
# To list publisher models, we can try using the discovery API or just try common names.

common_names = [
    "gemini-3.1-pro",
    "gemini-3.1-flash",
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-preview",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro-001",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-002",
    "gemini-1.5-flash-002"
]

from vertexai.generative_models import GenerativeModel

print("\nProbando nombres de modelos directamente en múltiples regiones...")
for region in ["us-central1", "us-east1", "us-east4", "us-west1", "europe-west1", "europe-west4", "northamerica-northeast1", "asia-northeast1"]:
    print(f"\n--- Probando región: {region} ---")
    aiplatform.init(project=PROJECT_ID, location=region)
    for name in ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-3.1-pro", "gemini-3.1-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"]:
        try:
            model = GenerativeModel(name)
            # Hacemos una llamada muy pequeña para validar si existe
            response = model.generate_content("hola")
            print(f"✅ ÉXITO: El modelo '{name}' está disponible en {region}.")
        except Exception as e:
            error_msg = str(e)
            if "404" in error_msg or "not found" in error_msg.lower():
                pass # No hacer ruido, simplemente no está
            elif "API has not been used" in error_msg:
                print(f"⚠️ ERROR DE API: Vertex AI no está habilitada en el proyecto para la región {region}.")
                break
            else:
                pass # Ignorar errores gRPC de red temporales
