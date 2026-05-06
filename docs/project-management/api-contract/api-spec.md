# Especificación API IRIS - Contrato canónico

Versión: 1.0  
Fecha: 2026-05-06  
Issue Jira: `SCRUM-65`  
ADR: [`ADR-001-unified-api-contract.md`](./ADR-001-unified-api-contract.md)  
Implementación de referencia: `server/server.js`

Este documento es la fuente de verdad para todos los clientes (web Angular, APK Capacitor y app Android nativa). Cualquier divergencia se trata como bug del cliente, no del servidor.

## 1. Transporte y entorno

| Entorno | Base URL | TLS |
|---|---|---|
| Desarrollo local (web) | `http://localhost:3001` | No |
| Desarrollo local (móvil en LAN) | `http://<IP-LAN>:3001` | No |
| Producción piloto | Pendiente de confirmar por Javier | Obligatorio HTTPS |

- `Content-Type: application/json; charset=utf-8` en todos los endpoints con body.
- Tamaño máximo de body: 1 MB.
- CORS abierto (`origin: true`, `credentials: true`).
- Servidor escuchando en `0.0.0.0:3001` (configurable con `PORT`).

## 2. Endpoints

### 2.1 `GET /api/health`

Comprobación de vida del servicio. Sin autenticación.

**Respuesta 200:**

```json
{ "ok": true }
```

### 2.2 `GET /api/models`

Lista de modelos Gemini disponibles para la API key configurada.

**Respuesta 200:**

```json
{
  "models": [
    {
      "name": "models/gemini-1.5-pro",
      "displayName": "Gemini 1.5 Pro",
      "supportedGenerationMethods": ["generateContent", "countTokens"]
    }
  ]
}
```

**Errores:**

- `503 { "error": "Missing GEMINI_API_KEY" }` si el servidor no tiene la key.

### 2.3 `POST /api/chat`

Endpoint principal: envía el historial de mensajes y devuelve la respuesta de la IA, junto con la alerta de seguridad si procede.

**Request:**

```json
{
  "messages": [
    { "role": "user", "text": "Hola, ¿cómo sé si mi pareja me controla?" }
  ],
  "language": "es",
  "simulatorMode": "iris"
}
```

**Reglas de validación** (`express-validator`, ver `server.js` líneas 49-99):

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| `messages` | array | Sí | No vacío. |
| `messages[].role` | string | Sí | `"user"` o `"assistant"`. |
| `messages[].text` | string | Sí | 1..10000 caracteres. Acepta `content` como alias por compatibilidad. |
| `language` | string | No | Hasta 10 caracteres. Por defecto `"es"`. |
| `simulatorMode` | string \| boolean | No | `"iris"`, `"partner"` o boolean (`true → partner`). Por defecto `"iris"`. |

**Respuesta 200:**

```json
{
  "response": "Es importante que sepas que no estás sola...",
  "safetyAlert": true,
  "safetyMessage": "Se han detectado posibles signos de riesgo (en lo que escribes o en lo que dice la pareja). Si necesitas ayuda, contacta con el 016 o con emergencias."
}
```

`safetyAlert` y `safetyMessage` solo aparecen si el detector se ha disparado. Los clientes deben mostrarlos en un recuadro destacado, **fuera del bubble del chat**.

## 3. Modelo de errores

Formato común para todos los endpoints:

```json
{
  "error": "Mensaje legible",
  "details": [
    { "field": "messages.0.text", "message": "Each message text/content must be between 1 and 10000 characters." }
  ]
}
```

`details` solo aparece cuando hay errores de validación de campo.

| HTTP | Caso | Body |
|---|---|---|
| 400 | JSON mal formado | `{ "error": "Invalid JSON body", "details": [...] }` |
| 400 | Validación de campos | `{ "error": "Invalid request body", "details": [...] }` |
| 500 | Fallo del proveedor IA | `{ "error": "Chat failed" }` |
| 503 | Falta `GEMINI_API_KEY` | `{ "error": "Missing GEMINI_API_KEY" }` |

## 4. Modos del simulador

El contrato acepta:

- `"iris"` — IRIS, asistente empática que valida y orienta.
- `"partner"` — pareja simulada con patrones tóxicos para entrenamiento educativo.
- `boolean` — `true → partner`, `false → iris` (compatibilidad histórica con la web).

La UI puede usar nombres distintos (por ejemplo `IRIS` y `VIRTUAL_PARTNER` en Android), pero **traduce a `"iris" | "partner"` antes de enviar la petición**.

## 5. Detector de seguridad

El backend analiza los mensajes y, si encuentra señales de violencia, manipulación, control, autolesión o suicidio, añade `safetyAlert: true` con un `safetyMessage` localizado a `language`.

Detalle del catálogo y el comportamiento por modo: `server/server.js` líneas 163-302 y 482-499. En modo `partner` también se inspecciona la respuesta generada por la IA.

Los clientes **no** deben implementar su propio detector: dependen de la respuesta del servidor.

## 6. Ejemplos curl

```bash
# Health
curl -s http://localhost:3001/api/health

# Chat - modo IRIS
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role":"user","text":"Hola"}],
    "language": "es",
    "simulatorMode": "iris"
  }'

# Chat - modo pareja, debe disparar safetyAlert
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role":"user","text":"Mi pareja no me deja salir"}],
    "simulatorMode": "partner"
  }'

# Error de validación esperado: 400
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": []}'
```

## 7. Modelos para clientes

### 7.1 TypeScript (web Angular - referencia)

Definidos en `src/app/services/ai.service.ts`:

```ts
export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatResponse {
  response: string;
  safetyAlert?: boolean;
  safetyMessage?: string;
}
```

### 7.2 Kotlin (Android nativo - propuesta)

```kotlin
data class ChatMessage(
  val role: String,
  val text: String
)

data class ChatRequest(
  val messages: List<ChatMessage>,
  val language: String = "es",
  val simulatorMode: String = "iris"
)

data class ChatResponse(
  val response: String,
  val safetyAlert: Boolean? = null,
  val safetyMessage: String? = null
)

data class ApiError(
  val error: String,
  val details: List<ApiErrorDetail>? = null
)

data class ApiErrorDetail(
  val field: String?,
  val message: String
)
```

Interfaz Retrofit sugerida:

```kotlin
interface ChatApi {
  @GET("api/health")
  suspend fun health(): HealthResponse

  @POST("api/chat")
  suspend fun chat(@Body request: ChatRequest): ChatResponse
}
```

`BASE_URL` debe terminar con `/` y apuntar al host correcto según entorno (`http://<IP-LAN>:3001/` en dev).

## 8. Versionado

El piloto opera sin prefijo de versión. Cuando aparezca una ruptura real:

- Cambios aditivos (campos nuevos opcionales): se hacen sobre `/api/...` y se anuncian en el changelog del repo.
- Cambios rompedores: se introduce `/v2/` con periodo de coexistencia y nueva ADR.

## 9. Changelog del contrato

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-05-06 | Versión inicial documentada (SCRUM-65). |
