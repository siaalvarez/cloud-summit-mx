const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '8080', 10);
const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:8080').replace(/\/+$/, '');

// Determinar directorio de archivos estáticos (public/ en contenedor, o raíz local)
const hasPublicDir = fs.existsSync(path.join(__dirname, 'public'));
const STATIC_DIR = process.env.STATIC_DIR || (hasPublicDir ? path.join(__dirname, 'public') : __dirname);

// Cache para tokens OIDC emitidos por el servidor de metadatos de Cloud Run
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Obtiene un token de identidad (OIDC ID Token) desde el servidor de metadatos de GCP.
 * Incluye format=full para que el token contenga el claim 'email' de la service account,
 * requerido por Cloud Run IAM para validar roles/run.invoker.
 */
async function getGoogleIdToken(audience) {
  if (!audience || audience.includes('localhost') || audience.includes('127.0.0.1')) {
    return null;
  }

  // Limpiar cualquier diagonal al final del audience
  const cleanAudience = audience.replace(/\/+$/, '');

  const now = Date.now();
  // Reutilizar token si aún tiene más de 5 minutos de vigencia
  if (cachedToken && tokenExpiresAt - now > 300000) {
    return cachedToken;
  }

  return new Promise((resolve) => {
    const params = new URLSearchParams({
      audience: cleanAudience,
      format: 'full'
    });
    const metadataUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?${params.toString()}`;

    const req = http.get(
      metadataUrl,
      {
        headers: { 'Metadata-Flavor': 'Google' },
        timeout: 5000
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode === 200) {
            cachedToken = data.trim();
            tokenExpiresAt = Date.now() + 50 * 60 * 1000;
            console.log(`[Proxy] Token OIDC obtenido exitosamente para ${cleanAudience}`);
            resolve(cachedToken);
          } else {
            console.warn(`[Proxy] Error metadata server (${res.statusCode}): ${data}`);
            resolve(null);
          }
        });
      }
    );

    req.on('error', (err) => {
      console.warn(`[Proxy] Metadata server error: ${err.message}`);
      resolve(null);
    });

    req.on('timeout', () => {
      console.warn('[Proxy] Timeout consultando metadata server');
      req.destroy();
      resolve(null);
    });
  });
}

// Mapa de tipos MIME
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname || '/';

  // Endpoint de verificación de salud (Cloud Run & Load Balancer)
  if (pathname === '/healthz' || pathname === '/_health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Enrutar llamadas a /api/* hacia el backend de Cloud Run
  if (pathname.startsWith('/api/') || pathname === '/api') {
    try {
      const targetUrl = new URL(req.url, BACKEND_URL);
      const isHttps = targetUrl.protocol === 'https:';
      const transport = isHttps ? https : http;

      // Buffer del cuerpo para evitar pérdida de datos por streaming asíncrono
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyBuffer = Buffer.concat(chunks);

      // Obtener token de autenticación IAM para invocar el backend
      const idToken = await getGoogleIdToken(BACKEND_URL);

      const headers = { ...req.headers };
      delete headers['host'];
      headers['host'] = targetUrl.host;
      if (bodyBuffer.length > 0) {
        headers['content-length'] = bodyBuffer.length;
      }

      if (idToken) {
        headers['authorization'] = `Bearer ${idToken}`;
        headers['x-serverless-authorization'] = `Bearer ${idToken}`;
      } else {
        console.warn(`[Proxy] Aviso: Despachando peticion sin token (BACKEND_URL: ${BACKEND_URL})`);
      }

      const proxyReq = transport.request(
        targetUrl,
        {
          method: req.method,
          headers: headers,
          timeout: 60000
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        }
      );

      proxyReq.on('error', (err) => {
        console.error('[Proxy Error]', err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Bad Gateway', details: err.message }));
        }
      });

      if (bodyBuffer.length > 0) {
        proxyReq.write(bodyBuffer);
      }
      proxyReq.end();
      return;
    } catch (err) {
      console.error('[Proxy Exception]', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy Configuration Error', details: err.message }));
      }
      return;
    }
  }

  // Servir archivos estáticos de la SPA
  let safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(STATIC_DIR, safeSuffix);
  const requestedExt = path.extname(pathname).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Si el navegador solicita un archivo con extensión (.js, .css, .png, etc.) y no existe, retornar 404
      if (requestedExt && requestedExt !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File Not Found: ${pathname}`);
        return;
      }
      // Fallback a index.html únicamente para rutas de navegación SPA
      filePath = path.join(STATIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found');
        return;
      }

      const responseHeaders = {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400'
      };

      res.writeHead(200, responseHeaders);
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Frontend] Servidor activo en puerto ${PORT}`);
  console.log(`[Frontend] Sirviendo estaticos desde: ${STATIC_DIR}`);
  console.log(`[Frontend] Backend destino para /api: ${BACKEND_URL}`);
});
