export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Esta página no cargó</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background:#0b0b0c; color:#f5f5f7; padding:24px; }
  .card { max-width: 420px; text-align:center; }
  h1 { font-size: 20px; margin: 0 0 8px; font-weight:600; }
  p  { font-size: 14px; margin: 0 0 20px; opacity:.75; }
  .row { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
  a, button { font: inherit; padding:10px 16px; border-radius:8px; border:1px solid #2a2a2e;
    background:#1a1a1d; color:#f5f5f7; cursor:pointer; text-decoration:none; }
  a.primary, button.primary { background:#f5f5f7; color:#0b0b0c; border-color:#f5f5f7; }
</style>
</head>
<body>
  <div class="card">
    <h1>Esta página no cargó</h1>
    <p>Algo falló en el servidor. Puedes intentar de nuevo o volver al inicio.</p>
    <div class="row">
      <button class="primary" onclick="location.reload()">Reintentar</button>
      <a href="/">Ir al inicio</a>
    </div>
  </div>
</body>
</html>`;
}
