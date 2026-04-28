# Release Readiness Web + Movil (SCRUM-14)

Fecha de validacion: `2026-04-28`  
Issue Jira: `SCRUM-14`  
Responsable: Javier Ballesteros

## Objetivo

Confirmar que la aplicacion web y su variante movil estan preparadas para una entrega final estable, con riesgos identificados y plan de correccion claro.

## Evidencia tecnica ejecutada

### 1) Build de integracion (web)

- Comando: `npm run build`
- Resultado: OK
- Salida principal:
  - `Initial total`: `665.37 kB`
  - `Estimated transfer size`: `175.30 kB`
  - `Output`: `dist/proyecto-iris`

### 2) Build de produccion (web)

- Comando: `npm run build:prod`
- Resultado: OK
- Salida principal:
  - `Initial total`: `665.37 kB`
  - `Estimated transfer size`: `175.30 kB`
  - `Output`: `dist/proyecto-iris`

## Validacion funcional minima (DoD)

Se ha validado la condicion tecnica minima de release definida en el operating model:

- Build de aplicacion sin errores.
- Artefacto de salida generado correctamente.
- Base preparada para validacion funcional desktop y mobile.

## Riesgos finales identificados

1. **Riesgo de UX en viewport pequeno**
   - Se han corregido ajustes mobile recientes, pero puede haber regresiones visuales en dispositivos no testeados manualmente.
   - Impacto: medio.

2. **Riesgo de cobertura funcional manual**
   - No hay evidencia automatizada E2E para flujos criticos web/movil.
   - Impacto: medio-alto.

3. **Riesgo de rendimiento en red real de centro**
   - Build correcta no garantiza comportamiento optimo en condiciones de conectividad real.
   - Impacto: medio.

## Plan de correccion y mitigacion

1. Ejecutar smoke manual guiado en desktop y movil sobre flujos criticos:
   - Inicio, navegacion principal, simulador de chat, cambio de idioma.
2. Registrar incidencias visuales por breakpoint (movil pequeno, movil grande, tablet, desktop).
3. Validar despliegue en entorno de red real del centro antes de release final.
4. Cerrar solo con evidencia adjunta en Jira (capturas, checklist y observaciones).

## Estado recomendado de la historia

- **Estado funcional**: listo para cierre tecnico de `SCRUM-14`.
- **Siguiente paso operativo**: ejecutar smoke manual final y adjuntar evidencia en Jira si se requiere auditoria externa.
