# Migración Android al contrato canónico

Issue Jira: `SCRUM-65` (este documento es la guía operativa para la issue de seguimiento que se crea de aquí).  
ADR de referencia: [`ADR-001-unified-api-contract.md`](./ADR-001-unified-api-contract.md)  
Spec: [`api-spec.md`](./api-spec.md)

Esta guía describe los cambios mínimos que el equipo Android (Ezequiel, Alberto) necesita aplicar para que la app nativa consuma el backend real del piloto. Está pensada para ejecutarse en un sprint corto (< 4h de trabajo efectivo).

## 1. Resumen de la migración

Pasamos de un contrato imaginado (`https://api.iris-app.com/v1/chat/message` con DTOs propios y wrapper `ApiResponse<T>`) a un contrato real ya en producción para web (`/api/chat`, body plano, sin wrapper).

## 2. Breaking changes

| Aspecto | Antes (Android nativo) | Después (canónico) |
|---|---|---|
| `BASE_URL` | `https://api.iris-app.com/v1/` | `http://<IP-LAN>:3001/` (dev) y dominio definitivo (prod) |
| Ruta chat | `POST chat/message` | `POST api/chat` |
| Health | No existía | `GET api/health` |
| Request | `ChatRequestDto` ad-hoc | `ChatRequest` con `messages`, `language`, `simulatorMode` |
| Response | `ApiResponse<T>` (wrapper) | Cuerpo plano `ChatResponse` |
| Modos | `IRIS`, `VIRTUAL_PARTNER` enviados literalmente | UI mantiene esos nombres, pero el cliente traduce a `"iris"` / `"partner"` antes de enviar |
| Errores | Sin formato definido | `{ error, details? }` con HTTP status semántico (400/500/503) |
| Detección de toxicidad | Sin definir | Viene del backend en `safetyAlert` / `safetyMessage`; el cliente solo presenta |

## 3. Pasos concretos

### 3.1 Configuración de red

1. Sustituir `BASE_URL` en la configuración de Retrofit por la del entorno actual (la IP de desarrollo está en `src/app/config/api.config.ts` para referencia).
2. En desarrollo, permitir tráfico HTTP en `network_security_config.xml`. La guía está en `CONFIGURAR_ANDROID_HTTP.md` del repo principal.
3. En producción, exigir HTTPS y validar el dominio definitivo cuando Javier lo confirme.

### 3.2 DTOs Kotlin

Reemplazar `ChatRequestDto` y los wrappers por:

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

### 3.3 Interfaz Retrofit

```kotlin
interface ChatApi {
  @GET("api/health")
  suspend fun health(): HealthResponse

  @POST("api/chat")
  suspend fun chat(@Body request: ChatRequest): ChatResponse
}
```

`role` siempre es `"user"` o `"assistant"`. Los mensajes locales del usuario se envían como `"user"`, las respuestas de IRIS como `"assistant"`.

### 3.4 Mapeo de modos en `Chatscreen.kt`

```kotlin
fun ChatMode.toApiValue(): String = when (this) {
  ChatMode.VIRTUAL_PARTNER -> "partner"
  ChatMode.IRIS -> "iris"
}
```

La UI sigue usando `IRIS` y `VIRTUAL_PARTNER`. La traducción ocurre solo al construir el `ChatRequest`.

### 3.5 Tratamiento de errores

Mapear status HTTP a una sealed class:

```kotlin
sealed class ChatError {
  data class Validation(val details: List<ApiErrorDetail>) : ChatError()
  object MissingApiKey : ChatError()
  object Generic : ChatError()
  data class Network(val cause: Throwable) : ChatError()
}
```

- 400 → `Validation` (parsear `details`).
- 500 → `Generic`.
- 503 → `MissingApiKey` (mostrar mensaje al usuario indicando que el servicio no está disponible).
- Excepciones de transporte → `Network`.

### 3.6 Presentación de `safetyAlert`

Cuando la respuesta incluya `safetyAlert: true`:

- Renderizar `safetyMessage` en un componente destacado (banner, card o snackbar persistente), nunca como un mensaje más del chat.
- Mantener visible la opción de contactar con el 016 o emergencias.
- No reimplementar la detección en el cliente: solo se confía en lo que viene del servidor.

## 4. Plan de pruebas mínimo

Antes de cerrar la migración:

1. `GET /api/health` responde `{ "ok": true }` desde el dispositivo en LAN del centro de pruebas.
2. `POST /api/chat` con un mensaje neutral en modo `iris` devuelve `response` no vacío y no devuelve `safetyAlert`.
3. `POST /api/chat` con un mensaje que contenga una de las frases del catálogo (ejemplo: `"Mi pareja no me deja salir"`) devuelve `safetyAlert: true` y `safetyMessage` localizado.
4. `POST /api/chat` en modo `partner` con `"Hola"` devuelve respuesta breve (1-2 frases) en tono tóxico y dispara `safetyAlert` cuando corresponde.
5. `POST /api/chat` con body inválido (sin `messages`) devuelve 400 con `details` y la app muestra mensaje legible.
6. Cambio de `language` a `"en"` devuelve respuesta en inglés.

## 5. Listado de archivos previsibles a tocar en el proyecto Android

Pendiente de confirmar al cruzar con el repo Android real durante el inventario. Estimación inicial:

- `network/RetrofitProvider.kt` o equivalente — cambia `BASE_URL`.
- `network/ChatApi.kt` — endpoints y firmas.
- `data/dto/ChatRequestDto.kt`, `ApiResponse.kt` — sustitución por los DTOs nuevos.
- `data/repository/ChatRepository.kt` — eliminar el unwrap de `ApiResponse<T>`.
- `ui/chat/Chatscreen.kt` — añadir `toApiValue()` en el envío y la presentación del banner de `safetyAlert`.
- `res/xml/network_security_config.xml` — cleartext en dev.

## 6. Criterios de cierre

- Los seis casos de prueba de la sección 4 pasan en dispositivo real conectado al backend del centro.
- El código del cliente Android no contiene referencias a `https://api.iris-app.com/v1/`, `chat/message`, `ChatRequestDto`, ni `ApiResponse<T>`.
- La nueva issue Jira "Android: migrar a contrato canónico" queda en `Hecho` con commits enlazados.
