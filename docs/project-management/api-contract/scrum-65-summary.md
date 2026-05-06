# SCRUM-65 - Resumen del trabajo realizado

Fecha: 2026-05-06  
Issue Jira: `SCRUM-65`  
Épica: `SCRUM-34` (Backend estable, seguro y observable)  
Sprint: `S3 - 4/10`  
Responsable: Antonio Salces  
Validan: Ezequiel Mora, Alberto Ortiz (Android), Javier Ballesteros (Web/Backend)

## Por qué hacía falta esta historia

El backend Node servía un contrato (`POST /api/chat`, body plano) y la app Android nativa asumía otro distinto (`POST /v1/chat/message` con wrapper `ApiResponse<T>` contra un dominio inexistente). La web Angular ya estaba alineada con el backend; el móvil no. Sin resolverlo, la app Android no podía consumir el mismo servicio que la web y bloqueaba la integración para la beta.

La historia pedía dos cosas: una decisión cerrada y un documento que cualquier integrante pudiera leer y empezar a integrar sin preguntar.

## Qué se ha hecho

1. **Inventario de endpoints reales contra los esperados por cada cliente.** Recogido en la tabla de divergencias del ADR y en la guía de migración. Confirmado que la web Angular ya consume `POST /api/chat` correctamente.

2. **Decisión arquitectónica documentada como ADR.** Adoptamos la **Opción A**: la app Android se adapta al backend Node existente. No se introduce alias `/v1/`, no se duplica el contrato, no se despliegan servicios separados. Plan B (gateway `/v1/...` en el backend) queda escrito como mitigación si más adelante aparece un consumidor real atado al shape antiguo, pero no se activa hoy.

3. **Especificación API canónica publicada en el repo.** Endpoints, validaciones, ejemplos curl copy-paste, modelo de errores, modelos Kotlin y TypeScript, comportamiento del detector de seguridad y política de versionado.

4. **Guía operativa de migración para el equipo Android.** Breaking changes, DTOs nuevos, interfaz Retrofit, mapeo de modos `IRIS / VIRTUAL_PARTNER → "iris" / "partner"`, tratamiento de errores y plan de pruebas mínimo.

5. **Issue Jira de seguimiento creada y bloqueada por SCRUM-65.** El equipo Android la toma cuando empiece la integración.

## Decisiones clave y por qué

- **Una sola fuente de verdad: el backend.** El servidor ya está implementado, validado y con la lógica de seguridad funcionando. Mover el contrato hacia los DTOs imaginados por el cliente Android implica romper lo que ya funciona en web. Cambiamos el cliente, no el servidor.

- **Sin prefijo `/v1/` en el piloto.** Añadirlo obliga a tocar backend, web y la configuración de Capacitor sin beneficio real (no hay clientes terceros). Cuando exista la primera ruptura real, se introducirá `/v2/` con plan formal de migración.

- **Sin wrapper `ApiResponse<T>`.** No hay paginación, ni metadata, ni multi-status. El wrapper añade una capa de indirección que solo complica el parsing y oscurece los errores. Mantenemos cuerpos planos.

- **Modos del simulador en el contrato: `"iris"` y `"partner"`.** El backend ya acepta estos strings (y `boolean` por compatibilidad). La UI Android conserva sus nombres (`IRIS`, `VIRTUAL_PARTNER`) y traduce en su capa de mapeo. Separamos el dominio de UI del dominio de API.

- **El detector de toxicidad vive en el servidor.** Los clientes solo presentan `safetyAlert` y `safetyMessage`. Evita divergencia entre lo que el backend considera riesgo y lo que el cliente considera riesgo, y mantiene el catálogo de palabras clave en un único lugar.

## Entregables

| Entregable | Ubicación | Estado |
|---|---|---|
| ADR de la decisión | [`ADR-001-unified-api-contract.md`](./ADR-001-unified-api-contract.md) | Aprobado, pendiente de tres OKs |
| Especificación API canónica | [`api-spec.md`](./api-spec.md) | Versión 1.0 publicada |
| Guía de migración Android | [`android-migration.md`](./android-migration.md) | Lista para que Ezequiel/Alberto la ejecuten |
| Resumen del trabajo (este documento) | [`scrum-65-summary.md`](./scrum-65-summary.md) | Publicado |
| Issue Jira de migración Android | Creada y enlazada a SCRUM-65 con `is blocked by` | Pendiente de assignación al equipo Android |

## Riesgos abiertos

- **Dominio de producción**: `api.iris-app.com` no existe. Bloqueo a Javier para definir dominio público y certificado HTTPS antes del go-live de junio. Vinculado a `operations/go-live-checklist-june-pilot.md`.
- **Inventario del repo Android nativo**: la lista de archivos a tocar en `android-migration.md` es estimada. Se confirmará al cruzar con el repo real durante la primera media hora de la migración.
- **Cobertura E2E**: no hay tests automatizados que validen el contrato extremo a extremo. Se mitiga con el plan de pruebas manual de la sección 4 de la guía de migración.

## Siguientes pasos

1. Recoger los tres OKs (Ezequiel, Alberto, Javier) como comentarios en SCRUM-65 antes del fin del sprint.
2. Asignar la issue de migración Android y arrancar la integración.
3. Confirmar dominio y HTTPS de producción con Javier para desbloquear `BASE_URL` en release.
4. Cuando se cierre la migración Android, marcar SCRUM-65 como `Hecho`.

## Estimación frente a real

Estimado en Jira: ~8h. Distribución real:

- Inventario y diagnóstico: 1h.
- Redacción ADR: 1.5h.
- Redacción spec API: 2h.
- Redacción guía Android: 1.5h.
- Resumen y trazabilidad en Jira: 1h.

Margen restante destinado a la validación cruzada con el equipo.
