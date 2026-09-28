FROM python:3.10-slim

WORKDIR /app

# Configuración de variables de entorno para Python y Cloud Run
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Instalar curl para healthchecks si es necesario
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente y datos
COPY . .

# Cloud Run escucha en el puerto definido por la variable PORT (por defecto 8080)
EXPOSE 8080

# Iniciar servidor Uvicorn con 2 workers aprovechando las 2 vCPUs asignadas
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 2
