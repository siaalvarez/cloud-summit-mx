# Google Cloud Summit México - AI Agents Suite

Suite interactiva de demostración con Agentes de Inteligencia Artificial (Retail, Logística y Fintech) impulsados por Google Cloud y Gemini API / Vertex AI.

---

## 📋 Requisitos Previos

- **Python**: 3.10 o superior
- **Node.js**: v18 o superior & **npm**
- **Google Cloud SDK / Gemini API Key**:
  - `GEMINI_API_KEY` o `GOOGLE_API_KEY` configurada en el entorno, o
  - Credenciales de GCP (`gcloud auth application-default login`) para usar Vertex AI.
- *(Opcional)* **Docker**

---

## 🚀 Backend (FastAPI + Uvicorn)

El backend expone las APIs REST y los endpoints de chat con Gemini.

### 1. Instalación de dependencias

Si no tienes un entorno virtual configurado:

```bash
# Crear entorno virtual dentro de backend
python3 -m venv backend/venv

# Activar entorno virtual
source backend/venv/bin/activate

# Instalar dependencias
pip install -r backend/requirements.txt
```

### 2. Variables de Entorno (Opcional)

Puedes exportar tu clave de Gemini si no usas Vertex AI:

```bash
export GEMINI_API_KEY="tu-api-key-aqui"
```

### 3. Iniciar el Servidor Backend

#### Opción A: Desde la raíz del proyecto (Recomendado)

```bash
# Usando directamente el binario del entorno virtual
./backend/venv/bin/uvicorn backend.main:app --reload --port 8080

# O activando el entorno virtual primero
source backend/venv/bin/activate
uvicorn backend.main:app --reload --port 8080
```

#### Opción B: Desde el directorio `backend/`

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8080
```

El backend estará disponible en `http://localhost:8080` (incluye Swagger UI en `http://localhost:8080/docs`).

---

## 💻 Frontend (Vue 3 + Vuetify + Vite)

El frontend incluye el panel de control y las interfaces interactivas para cada agente.

### 1. Instalación de dependencias

```bash
cd frontend
npm install
```

### 2. Iniciar en modo Desarrollo

Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR). Las llamadas a `/api/*` se redirigen automáticamente al backend en el puerto `8080`.

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:3000`.

### 3. Otros comandos del Frontend

- **Compilar para producción:**
  ```bash
  npm run build
  ```
- **Previsualizar la compilación de producción:**
  ```bash
  npm run preview
  ```
- **Servir estáticos con proxy:**
  ```bash
  npm run serve
  ```

---

## 🐳 Ejecución con Docker

Puedes empaquetar y ejecutar tanto el backend como el frontend en un único contenedor Docker:

```bash
# Construir la imagen
docker build -t cloud-summit-mx .

# Ejecutar el contenedor
docker run -p 8080:8080 -e GEMINI_API_KEY="tu-api-key" cloud-summit-mx
```

La aplicación completa estará accesible en `http://localhost:8080`.

---

## 📁 Estructura del Proyecto

```text
├── Dockerfile              # Configuración de Docker para despliegue
├── README.md               # Documentación general del proyecto
├── backend/                # Servidor FastAPI y lógica de agentes
│   ├── main.py             # Entrypoint y endpoints de la API
│   ├── requirements.txt    # Dependencias de Python
│   └── venv/               # Entorno virtual de Python
└── frontend/               # Aplicación SPA (Vue 3 + Vuetify + Vite)
    ├── package.json        # Dependencias y scripts de Node.js
    ├── vite.config.js      # Configuración de Vite y proxy
    ├── index.html          # HTML principal
    ├── router.js           # Enrutamiento de la SPA
    ├── views/              # Vistas de los agentes (Retail, Logística, Fintech)
    └── data/               # Datos simulados y fixtures
```
