# Plan para resolver el 500

## Qué voy a arreglar
1. Revisar la configuración de SSR/build que todavía está generando una referencia rota a `assets/h3-v2` en producción.
2. Eliminar cualquier resto de configuración o entrypoint legacy que fuerce un bundle incompatible para el despliegue público.
3. Validar después del cambio tanto el preview como el dominio publicado para confirmar que `/` ya responde 200.

## Hallazgo confirmado
- El error ya está reproducido en el despliegue real.
- La respuesta del servidor es HTTP 500.
- Los logs del servidor muestran exactamente:
  - `Error: No such module "assets/h3-v2" imported from "assets/server-BaB-NBoU.js"`
- Eso indica que el bundle SSR publicado sigue intentando cargar un módulo interno inexistente o mal empaquetado.

## Cambios propuestos
### 1) Normalizar el entrypoint del servidor
- Revisar `vite.config.ts` y la estrategia de `tanstackStart.server.entry`.
- Si el wrapper actual está provocando o preservando el bundle roto, simplificarlo a la configuración canónica compatible con el runtime de Lovable.

### 2) Limpiar configuración de despliegue residual
- Revisar `vercel.json` y cualquier configuración restante que pueda alterar el output esperado del framework.
- Confirmar que no haya rutas, salidas o convenciones de hosting heredadas interfiriendo con TanStack Start.

### 3) Verificar el árbol de arranque
- Confirmar que `src/server.ts`, `src/start.ts`, `src/router.tsx` y `src/routes/__root.tsx` estén alineados con el flujo estándar del proyecto.
- Si hace falta, reducir la personalización del manejo de errores del servidor al mínimo seguro para evitar romper el bundle SSR.

### 4) Validación final
- Probar `/` con invocación directa al servidor.
- Revisar logs del deployment otra vez para asegurar que desaparezca `assets/h3-v2`.
- Confirmar que la página cargue también en preview.

## Detalle técnico
El fallo no es caché del navegador. El 500 viene del origen en tiempo real. El problema actual está en el bundle del servidor publicado: intenta importar `assets/h3-v2`, pero ese módulo no existe en el runtime final. La corrección debe centrarse en la configuración de build/SSR y no en el frontend visual.

## Resultado esperado
- `https://test-liderazgo-cuh.lovable.app/` deja de devolver 500.
- El preview también carga correctamente.
- Desaparece el error `No such module "assets/h3-v2"` de los logs.