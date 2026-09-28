FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080

# Copiar el servidor de producción (maneja static files, SPA fallback y proxy IAM a backend)
COPY server.js ./

# Copiar todos los archivos estáticos de la aplicación a public/
COPY index.html main.js router.js ./public/
COPY views/ ./public/views/
COPY data/ ./public/data/

# Usar usuario sin privilegios para mayor seguridad
USER node

EXPOSE 8080

CMD ["node", "server.js"]
