# ADR-001 - Contrato API único entre web Angular y Android nativo

## Estado

Aprobado (pendiente de validación cruzada por Ezequiel, Alberto y Javier)

Fecha: 2026-05-06  
Issue Jira: `SCRUM-65`  
Épica: `SCRUM-34` (Backend estable, seguro y observable)  
Sprint: `S3 - 4/10`  
Responsable: Antonio Salces

## Contexto

El backend actual (`server/server.js`) expone `POST /api/chat` con cuerpo `{ messages, language, simulatorMode }` y respuesta plana `{ response, safetyAlert?, safetyMessage? }`.

El cliente Angular (`src/app/services/ai.service.ts`) ya consume ese contrato, tanto en navegador como dentro del APK Capacitor.

La app Android nativa (Retrofit) descrita en SCRUM-65 asume otro contrato: `BASE_URL = https://api.iris-app.com/v1/`, ruta `chat/message`, DTO `ChatRequestDto` y wrapper `ApiResponse<T>`. Ese dominio no existe y esos DTOs no se corresponden con lo que el servidor sirve, por lo que la app Android nativa hoy **no puede** integrarse contra el backend real.

Sin alinear esto, no podemos entregar la beta con web y móvil apuntando al mismo servicio.

## Decisión

Adoptamos un **contrato único** servido por el backend Node, con prefijo `/api/...` y respuestas planas. La app Android nativa adapta sus DTOs y rutas a ese contrato. No se introduce prefijo `/v1/` ni wrapper `ApiResponse<T>` en el piloto.

Resumen del contrato canónico:

- Base: `http://<host>:3001` en desarrollo, dominio definitivo a confirmar para producción.
- Endpoints: `GET /api/health`, `GET /api/models`, `POST /api/chat`.
- Modos: `simulatorMode: "iris" | "partner"`.
- Errores: `{ error, details? }` con HTTP status semántico.

Detalle completo en [`api-spec.md`](./api-spec.md). Pasos de migración Android en [`android-migration.md`](./android-migration.md).

## Opciones consideradas

1. **Opción A — Android se adapta al backend Node actual** (elegida).
2. **Opción B — Gateway `/v1/...`** en el backend que traduce y delega a `/api/chat`.
3. **Opción C — Despliegue separado** para Android.

### Por qué A

- No hay app Android nativa publicada en producción. El APK distribuido en la beta es Capacitor envolviendo Angular (ver `README.md` y scripts `cap:build:android` en `package.json`). No rompemos clientes existentes.
- El backend ya está validado con `express-validator`, instrumentado y con la lógica de seguridad (`safetyAlert`) integrada. Cambiarlo en lugar del cliente significa tocar un sistema que funciona.
- Una sola superficie de API reduce a la mitad los tests, los logs y las rutas de bug.
- Coste de adaptación en Android: cambiar `BASE_URL`, una interfaz Retrofit y un par de DTOs. Estimado < 4h.
- Encaja con la épica SCRUM-34: añadir alias `/v1` aumenta superficie sin beneficio funcional para el piloto.

### Por qué no B

- Duplicar contratos (uno `/api`, otro `/v1`) crea divergencia silenciosa cuando se añadan campos (por ejemplo, en `safetyAlert`).
- El equipo es pequeño; mantener dos shapes consume tiempo que necesitamos para feature work.
- Solo aporta valor si hay clientes en producción atados al shape antiguo, y no es el caso.

### Por qué no C

- Sobre-ingeniería para un piloto. No hay requisitos de aislamiento, SLAs distintos, ni escalado por canal.

## Consecuencias

### Positivas

- Un único contrato versionado por código (`server/server.js`) y un único documento de referencia (`api-spec.md`).
- Curl, ejemplos y respuestas de error son los mismos para web y Android.
- Los cambios futuros se hacen una vez y propagan a ambos clientes.

### Negativas / Trade-offs

- El equipo Android tiene trabajo de migración (rutas, DTOs, mapeo de modos).
- No hay versionado explícito (`/v1/`) hasta que aparezca la primera ruptura real. Mientras tanto, los cambios son aditivos y no rompen el cliente.

## Plan B (mitigación)

Si después del inventario el equipo Android demuestra que existe **algún consumidor real** atado a `/v1/chat/message`, añadimos un alias en el backend que reescribe la URL y delega:

```js
app.post('/v1/chat/message', requireGeminiApiKey, (req, res, next) => {
  req.url = '/api/chat';
  return app._router.handle(req, res, next);
});
```

Se activa solo con aprobación explícita y se registra como deuda técnica en una nueva ADR.

## Plan de implementación

- Inventario contrastado de endpoints reales del proyecto Android (Antonio + Ezequiel/Alberto).
- Publicación de la spec canónica en Confluence enlazada desde SCRUM-65.
- Issue Jira de seguimiento "Android: migrar a contrato canónico" bloqueada por SCRUM-65.
- Validación cruzada: tres OKs en SCRUM-65 (Ezequiel, Alberto, Javier).
- Bloqueo a Javier para definir dominio público y HTTPS antes del go-live.

## Enlaces

- Especificación API: [`api-spec.md`](./api-spec.md)
- Migración Android: [`android-migration.md`](./android-migration.md)
- Resumen del trabajo: [`scrum-65-summary.md`](./scrum-65-summary.md)
- Backend de referencia: `server/server.js`
- Cliente Angular: `src/app/services/ai.service.ts`
- Jira: `SCRUM-65`, `SCRUM-34`
