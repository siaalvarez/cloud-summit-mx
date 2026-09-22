import json
import pandas as pd
from google.cloud import bigquery

client = bigquery.Client(project="cloud-summit-mx")
DATASET_ID = "cloud-summit-mx.logistica_demo"

try:
    query_envios = f"""
    SELECT id_envio as id, ubicacion_actual as nombre, lat, lon, estado,
           cliente, producto, penalizacion_usd,
           IF(estado LIKE '%Retrasado%', 'Crítica', 'Normal') as criticidad
    FROM `{DATASET_ID}.envios_activos`
    """
    df_envios = client.query(query_envios).to_dataframe()
    
    query_bodegas = f"""
    SELECT bodega as id, bodega as nombre, lat, lon, 'Inventario (Plan B)' as estado,
           'Propio (Stock)' as cliente, sku as producto, 0 as penalizacion_usd,
           'Mitigación' as criticidad
    FROM `{DATASET_ID}.inventario_bodegas`
    """
    df_bodegas = client.query(query_bodegas).to_dataframe()
    
    df_combined = pd.concat([df_envios, df_bodegas])
    out = json.loads(df_combined.to_json(orient="records"))
    with open('test_out.json', 'w') as f:
        json.dump(out, f)
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
