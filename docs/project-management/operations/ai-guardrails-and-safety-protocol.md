# Guardrails IA y Protocolo de Seguridad - Piloto IRIS

## Objetivo

Definir controles de seguridad para los dos modos de chatbot:

- `detector`: apoyo para identificar señales de violencia de género.
- `partner`: simulación de pareja tóxica con límites pedagógicos.

## Principios de diseño

- No daño: el sistema no debe reforzar conductas violentas o coercitivas.
- Contención: ante riesgo, priorizar seguridad y derivación a ayuda.
- Trazabilidad: registrar eventos de seguridad sin exponer PII innecesaria.
- Proporcionalidad: respuestas breves, claras y no revictimizantes.

## Matriz de políticas por modo

| Política | `detector` | `partner` |
|---|---|---|
| Lenguaje empático | Obligatorio | No aplica como tono principal |
| Detección de señales de riesgo | Obligatorio | Obligatorio (sobre mensajes del usuario y respuesta simulada) |
| Derivación a recursos | Obligatoria ante riesgo | Obligatoria ante riesgo |
| Bloqueo de instrucciones peligrosas | Obligatorio | Obligatorio |
| Simulación de manipulación | No | Permitida con límites |
| Escalada a humano | Sí | Sí |

## Contenido prohibido (hard block)

- Instrucciones para autolesión, suicidio o agresión.
- Instrucciones para controlar, aislar o intimidar de forma ejecutable.
- Validación explícita de violencia o culpa a la víctima.
- Consejos para ocultar abuso o evitar ayuda profesional.
- Cualquier sexualización no apropiada para entorno educativo.

## Contenido permitido con límites (modo `partner`)

- Frases de manipulación leves para aprendizaje, sin:
  - amenazas explícitas de daño,
  - humillación extrema o insultos degradantes sostenidos,
  - escalada a coacción sexual o violencia física detallada.

Regla: tras una secuencia de señales de riesgo, el sistema debe reconducir a reflexión y seguridad.

## Niveles de riesgo y respuesta

| Nivel | Señal | Acción del chatbot | Acción de plataforma |
|---|---|---|---|
| R0 | Conversación normal | Respuesta estándar | Sin alertas |
| R1 | Red flags leves (control, celos) | Validar y educar en límites | `safetyAlert` suave |
| R2 | Riesgo medio (aislamiento, amenazas verbales) | Recomendar apoyo y recursos | Log de incidente + banner reforzado |
| R3 | Riesgo alto (autolesión, violencia explícita) | Mensaje de contención + derivación urgente | Escalado inmediato a protocolo humano |

## Flujo de escalado humano (R3)

1. Detectar patrón crítico en entrada o salida.
2. Devolver mensaje seguro y corto con recomendación de ayuda inmediata.
3. Registrar incidente con `incidentId`, timestamp, severidad y aula.
4. Notificar al canal de coordinación definido por el centro.
5. Bloquear continuidad de simulación tóxica en esa sesión.
6. Revisión posterior por equipo autorizado.

## Reglas de prompting seguro

- Plantillas cerradas por modo de uso.
- Prohibido prompt libre administrativo desde frontend.
- Sanitización de entrada para evitar prompt injection básico.
- Límites estrictos de tokens y longitud.
- No exponer contenido del sistema ni reglas internas al usuario.

## Reglas de UX de seguridad

- Mostrar alerta separada del texto conversacional.
- No mostrar mensajes alarmistas que puedan incrementar ansiedad.
- Mantener llamadas a la acción concretas:
  - en España: `016` como referencia principal.
- Ofrecer salida rápida y opción de cierre de sesión.

## Telemetría mínima de seguridad

- Conteo de alertas por nivel (`R1-R3`).
- Tasa de incidentes por aula y franja.
- Tiempo de respuesta ante escalado humano.
- Falsos positivos revisados semanalmente.

## Casos de prueba obligatorios

- [ ] Usuario pide ayuda por amenaza directa de pareja.
- [ ] Usuario sugiere autolesión.
- [ ] Usuario intenta extraer instrucciones para manipular mejor.
- [ ] Modo `partner` genera respuesta demasiado agresiva.
- [ ] Saturación de cola con múltiples alertas simultáneas.

## Gobernanza

- Revisión quincenal de keywords y patrones.
- Revisión mensual de incidentes críticos y tuning de guardrails.
- Aprobación de cambios por rol técnico + rol pedagógico.
