#!/bin/bash
set -euo pipefail

# ==============================================================================
# Script de Construcción y Despliegue para Google Cloud Summit México
# Proyecto: cloud-summit-mx
# Región: northamerica-south1 (México - Querétaro)
# ==============================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Detectar directorio base del proyecto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -d "$SCRIPT_DIR/demo-vuetify" ]; then
    BASE_DIR="$SCRIPT_DIR/demo-vuetify"
else
    BASE_DIR="$SCRIPT_DIR"
fi
cd "$BASE_DIR"

# Parámetros del proyecto y región
PROJECT_ID="cloud-summit-mx"
REGION="northamerica-south1"  # Querétaro, México
REPO_NAME="summit-repo"

BACKEND_SERVICE="summit-backend"
FRONTEND_SERVICE="summit-frontend"

BACKEND_SA="summit-backend-sa@${PROJECT_ID}.iam.gserviceaccount.com"
FRONTEND_SA="summit-frontend-sa@${PROJECT_ID}.iam.gserviceaccount.com"

# Dominio para Identity-Aware Proxy (IAP) opcional como primer argumento
DOMAIN="${1:-${USER_DOMAIN:-}}"

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}  Despliegue Google Cloud Summit México - Cloud Run (Querétaro)       ${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e "Proyecto:           ${GREEN}${PROJECT_ID}${NC}"
echo -e "Región:             ${GREEN}${REGION} (México - Querétaro)${NC}"
echo -e "Artifact Registry:  ${GREEN}${REPO_NAME}${NC}"
echo -e "Servicio Backend:   ${GREEN}${BACKEND_SERVICE}${NC}"
echo -e "Servicio Frontend:  ${GREEN}${FRONTEND_SERVICE} (Con flag nativo --iap)${NC}"
if [ -n "$DOMAIN" ]; then
    echo -e "Dominio IAP:        ${GREEN}@${DOMAIN}${NC}"
fi
echo -e "----------------------------------------------------------------------"

# 1. Configurar proyecto activo en gcloud
echo -e "\n${YELLOW}[1/6] Configurando proyecto activo en gcloud...${NC}"
gcloud config set project "$PROJECT_ID" --quiet

# 2. Habilitar APIs requeridas
echo -e "\n${YELLOW}[2/6] Verificando y habilitando APIs de Google Cloud...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    aiplatform.googleapis.com \
    bigquery.googleapis.com \
    iap.googleapis.com \
    --project="$PROJECT_ID" --quiet

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# 3. Asegurar repositorio en Artifact Registry
echo -e "\n${YELLOW}[3/6] Verificando repositorio en Artifact Registry (${REGION})...${NC}"
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    echo -e "Creando repositorio Docker '${REPO_NAME}' en ${REGION}..."
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="Repositorio de contenedores para Cloud Summit México" \
        --project="$PROJECT_ID" --quiet
else
    echo -e "${GREEN}Repositorio '${REPO_NAME}' ya existe.${NC}"
fi

# 4. Asegurar Cuentas de Servicio y Permisos IAM
echo -e "\n${YELLOW}[4/6] Configurando Cuentas de Servicio e IAM...${NC}"

# Backend SA (Vertex AI + BigQuery)
if ! gcloud iam service-accounts describe "$BACKEND_SA" --project="$PROJECT_ID" &>/dev/null; then
    echo -e "Creando cuenta de servicio para Backend..."
    gcloud iam service-accounts create summit-backend-sa \
        --display-name="Summit Backend Service Account" \
        --project="$PROJECT_ID" --quiet
fi

# Roles para el Backend: Vertex AI y BigQuery
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${BACKEND_SA}" \
    --role="roles/aiplatform.user" --condition=None --quiet >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${BACKEND_SA}" \
    --role="roles/bigquery.user" --condition=None --quiet >/dev/null

# Frontend SA
if ! gcloud iam service-accounts describe "$FRONTEND_SA" --project="$PROJECT_ID" &>/dev/null; then
    echo -e "Creando cuenta de servicio para Frontend..."
    gcloud iam service-accounts create summit-frontend-sa \
        --display-name="Summit Frontend Service Account" \
        --project="$PROJECT_ID" --quiet
fi

# Permisos para Cloud Build
echo -e "Otorgando permisos de despliegue a Cloud Build..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${CB_SA}" \
    --role="roles/run.admin" --condition=None --quiet >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${CB_SA}" \
    --role="roles/iam.serviceAccountUser" --condition=None --quiet >/dev/null

# 5. Construcción y Despliegue del Backend
echo -e "\n${YELLOW}[5/6] Construyendo y desplegando Backend en Cloud Run (cloudbuild.yaml)...${NC}"
echo -e "Sizing: 2 vCPU, 4Gi RAM | Min Instancias: 1 | Max Instancias: 3"
echo -e "Seguridad: --no-allow-unauthenticated (Solo peticiones autenticadas)"

gcloud builds submit backend \
    --config=backend/cloudbuild.yaml \
    --substitutions=\
_REGION="${REGION}",\
_REPO_NAME="${REPO_NAME}",\
_SERVICE_NAME="${BACKEND_SERVICE}",\
_SERVICE_ACCOUNT="${BACKEND_SA}",\
_CPU="2",\
_MEMORY="4Gi",\
_MIN_INSTANCES="1",\
_MAX_INSTANCES="3" \
    --project="$PROJECT_ID"

BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" --region="$REGION" --format='value(status.url)' --project="$PROJECT_ID")
echo -e "${GREEN}✓ Backend desplegado exitosamente en:${NC} ${BACKEND_URL}"

# Otorgar permiso al Frontend SA para invocar el Backend autenticado con IAM
echo -e "Otorgando rol roles/run.invoker al Frontend SA para invocar el Backend..."
gcloud run services add-iam-policy-binding "$BACKEND_SERVICE" \
    --region="$REGION" \
    --member="serviceAccount:${FRONTEND_SA}" \
    --role="roles/run.invoker" \
    --project="$PROJECT_ID" --quiet >/dev/null

# 6. Construcción y Despliegue del Frontend (con flag nativo --iap)
echo -e "\n${YELLOW}[6/6] Construyendo y desplegando Frontend en Cloud Run con IAP nativo (--iap)...${NC}"
echo -e "Sizing: 2 vCPU, 4Gi RAM | Min Instancias: 1 | Max Instancias: 3"
echo -e "Seguridad: --no-allow-unauthenticated con flag nativo --iap"

gcloud builds submit frontend \
    --config=frontend/cloudbuild.yaml \
    --substitutions=\
_REGION="${REGION}",\
_REPO_NAME="${REPO_NAME}",\
_SERVICE_NAME="${FRONTEND_SERVICE}",\
_SERVICE_ACCOUNT="${FRONTEND_SA}",\
_BACKEND_URL="${BACKEND_URL}",\
_CPU="2",\
_MEMORY="4Gi",\
_MIN_INSTANCES="1",\
_MAX_INSTANCES="3" \
    --project="$PROJECT_ID"

FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE" --region="$REGION" --format='value(status.url)' --project="$PROJECT_ID")

# Si se especificó el dominio o correo, otorgar acceso IAP
if [ -z "$DOMAIN" ]; then
    echo -e "\n${YELLOW}¿Deseas autorizar ahora a tu organización (@empresa.com) o a tu correo personal en IAP?${NC}"
    echo -e "Nota: La aplicación usará la URL por defecto de Cloud Run (*.run.app)."
    read -rp "Ingresa tu dominio (ej. miempresa.com) o correo (ej. usuario@gmail.com) [Enter para omitir]: " INPUT_MEMBER || true
    DOMAIN="${INPUT_MEMBER:-}"
fi

if [ -n "$DOMAIN" ]; then
    if [[ "$DOMAIN" == *"@"* ]]; then
        MEMBER_FLAG="user:${DOMAIN}"
    else
        MEMBER_FLAG="domain:${DOMAIN}"
    fi

    echo -e "Otorgando acceso IAP (roles/iap.httpsResourceAccessor) a '${MEMBER_FLAG}'..."
    gcloud iap web add-iam-policy-binding \
        --member="${MEMBER_FLAG}" \
        --role="roles/iap.httpsResourceAccessor" \
        --resource-type="cloud-run" \
        --service="$FRONTEND_SERVICE" \
        --region="$REGION" \
        --project="$PROJECT_ID" --quiet >/dev/null 2>&1 || \
    gcloud run services add-iam-policy-binding "$FRONTEND_SERVICE" \
        --region="$REGION" \
        --member="${MEMBER_FLAG}" \
        --role="roles/iap.httpsResourceAccessor" \
        --project="$PROJECT_ID" --quiet >/dev/null 2>&1 || true
    echo -e "${GREEN}✓ Acceso IAP concedido a: ${MEMBER_FLAG}${NC}"
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}  ¡Despliegue Completado Exitosamente!                                ${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo -e "URL Frontend: ${BLUE}${FRONTEND_URL}${NC} (Protegido nativamente por IAP)"
echo -e "URL Backend:  ${BLUE}${BACKEND_URL}${NC} (Protegido por IAM OIDC)"
if [ -n "$DOMAIN" ]; then
    echo -e "Acceso IAP:   Autorizado para ${GREEN}${MEMBER_FLAG}${NC}"
else
    echo -e "\n${YELLOW}Para conceder acceso IAP más adelante a tu correo o dominio, ejecuta:${NC}"
    echo -e "  gcloud iap web add-iam-policy-binding \\"
    echo -e "    --member=\"domain:TU_EMPRESA.com\" (o \"user:tu-correo@gmail.com\") \\"
    echo -e "    --role=\"roles/iap.httpsResourceAccessor\" \\"
    echo -e "    --resource-type=\"cloud-run\" \\"
    echo -e "    --service=\"${FRONTEND_SERVICE}\" \\"
    echo -e "    --region=\"${REGION}\""
fi
echo -e "======================================================================\n"
