# Modelo de Capacidad y Coste - Piloto IRIS

## Objetivo

Definir un marco de operación viable con presupuesto máximo de `1.000 EUR/año` para:

- carga variable por instituto,
- chatbot para todo el alumnado,
- tope de hasta 200 usuarios concurrentes en fase 1,
- infraestructura `on-premise`.

## Supuestos de cálculo

- Ventana lectiva diaria: 6 horas.
- Días lectivos al mes: 20.
- Longitud media de respuesta IA: 120-180 tokens.
- Longitud media de entrada: 60-120 tokens.
- Costes de infraestructura on-prem imputados como coste operativo anual (electricidad, conectividad, mantenimiento básico y reposición proporcional).
- Objetivo de gasto mensual medio: `<= 83 EUR`.

## Escenarios de concurrencia

| Escenario | Concurrentes pico | Sesiones/hora estimadas | Riesgo |
|---|---:|---:|---|
| S1 | 50 | 150-220 | Bajo |
| S2 | 100 | 300-450 | Medio |
| S3 | 200 | 600-900 | Alto (sin throttling fuerte) |

## Presupuesto mensual objetivo (83 EUR)

| Componente | S1 (50) | S2 (100) | S3 (200) |
|---|---:|---:|---:|
| Infra on-prem (energía + operación) | 35 EUR | 40 EUR | 45 EUR |
| Observabilidad y backup | 8 EUR | 10 EUR | 12 EUR |
| Reserva incidencias | 5 EUR | 8 EUR | 10 EUR |
| Presupuesto IA disponible | 35 EUR | 25 EUR | 16 EUR |
| Total | 83 EUR | 83 EUR | 83 EUR |

Conclusión: el escenario S3 solo es viable con límites estrictos y degradación planificada.

## Política de consumo IA por escenario

| Escenario | Límite mensajes por sesión | Tokens máximos por respuesta | Cola en picos | Resultado esperado |
|---|---:|---:|---|---|
| S1 | 20 | 220 | No habitual | UX fluida |
| S2 | 14 | 180 | Moderada | UX estable |
| S3 | 8 | 120 | Obligatoria | UX controlada con espera |

## Reglas de control de costes

- Presupuesto IA mensual hard-cap configurado en backend.
- Cuando el consumo supere 80% del mes:
  - bajar `maxOutputTokens` automáticamente,
  - priorizar respuestas cortas,
  - limitar mensajes por sesión.
- Cuando el consumo supere 95%:
  - activar modo contingencia (respuesta pedagógica mínima + cola más estricta).
- Cuando se supere 100%:
  - bloquear nuevas interacciones IA no críticas hasta reset mensual o aprobación manual.

## Política de degradación por carga

| Métrica | Umbral | Acción |
|---|---|---|
| CPU backend > 75% durante 5 min | Alerta amarilla | Reducir tokens máximos 20% |
| Latencia p95 > 2.5 s | Alerta amarilla | Activar cola por aula |
| Cola > 100 solicitudes | Alerta roja | Rechazo temporal con mensaje de reintento |
| Error rate > 3% en 5 min | Alerta roja | Modo protección y notificación ops |

## Capacidad recomendada para fase 1

- Operar en nominal `S2` (100 concurrentes sostenidos).
- Aceptar picos `S3` (200) solo en ráfagas cortas y con controles:
  - cola,
  - cuotas por aula,
  - límites de mensajes por sesión,
  - reducción automática de tokens.

## KPI de seguimiento semanal

- Coste IA acumulado vs presupuesto mensual.
- Tokens por sesión media.
- Latencia p95 en hora punta.
- Tasa de rechazo por cuota.
- Incidencias por saturación.

## Plan de escalado posterior (fuera del tope anual actual)

- Requisito para escalar a 500+ concurrentes reales:
  - aumento de presupuesto,
  - separación de servicios (API/colas/worker IA),
  - redundancia de nodos y observabilidad avanzada.
