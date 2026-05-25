## Objetivo
Eliminar el `502 Bad Gateway` en producción corrigiendo la inicialización del servidor, no convirtiendo el proyecto a SPA estática.

## Diagnóstico confirmado
El problema actual no es caché ni una ruta inexistente.

Los logs publicados muestran dos errores reales del origen:
- `Error: No such module "h3-v2" imported from "server.js"`
- `Error: No such module "assets/h3-v2" imported from "assets/server-...js"`

Eso significa que el deploy publicado sigue intentando arrancar SSR, pero el bundle del servidor quedó roto. Un `vercel.json` con rewrite a `index.html` no es la solución aquí, porque este proyecto usa **TanStack Start** y Lovable resuelve sus rutas publicadas automáticamente; forzarlo a SPA puede romper más el arranque.

## Plan

### 1. Restaurar una entrada de servidor válida
- Recrear `src/server.ts` como wrapper SSR.
- Hacer import **lazy** del server entry real.
- Capturar fallos de inicialización para evitar que el worker muera sin diagnóstico.
- Normalizar respuestas 500/502 catastróficas para que no queden errores opacos del runtime.

### 2. Reinstalar la captura de errores del runtime
- Recrear `src/lib/error-capture.ts` para registrar errores globales y promesas rechazadas.
- Recrear `src/lib/error-page.ts` con un fallback HTML autónomo, sin depender del resto de la app.

### 3. Conectar Vite/TanStack Start al entry correcto
- Ajustar `vite.config.ts` para que `tanstackStart.server.entry` apunte a `server`.
- Así el deploy deja de intentar cargar un `server.js` incompleto o un módulo interno inexistente como `h3-v2`.

### 4. Limpiar configuración de despliegue heredada
- Revisar `vercel.json` y dejar solo lo estrictamente compatible con el output actual, o retirarlo si está interfiriendo.
- No añadir rewrites SPA globales a `index.html`.

### 5. Fortalecer el manejo de errores de la app
- Mantener el `errorComponent` del root route.
- Añadir `defaultErrorComponent` en `src/router.tsx` para cubrir fallos de render/carga dentro del árbol de rutas.

### 6. Validación final
- Verificar que `/` ya no responda `502`.
- Revisar logs publicados para confirmar que desaparecen `No such module "h3-v2"` y `assets/h3-v2`.
- Confirmar que preview y published cargan correctamente.

## Detalles técnicos
```text
Cloudflare -> published app -> SSR worker
                      X
              server bundle intenta importar h3-v2
              y falla antes de responder bien
```

La corrección será:
```text
vite.config.ts -> tanstackStart.server.entry = "server"
src/server.ts  -> wrapper SSR estable
logs           -> error visible y controlado
published app  -> responde 200 en /
```

## Resultado esperado
- El dominio publicado deja de devolver `502`.
- El worker SSR vuelve a inicializar correctamente.
- Si ocurre otro error, queda capturado con logs útiles en lugar de fallar como gateway.

Cuando apruebes, lo implemento y lo valido contra el published URL.