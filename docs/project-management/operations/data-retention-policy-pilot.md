# Política de Retención y Borrado de Datos - Piloto IRIS

## Alcance

Esta política aplica al piloto IRIS en institutos con:

- alumnado anónimo por código de aula/sesión,
- uso de chatbot para prevención y simulación educativa,
- operación `on-premise` con presupuesto limitado.

## Principios de tratamiento

- Minimización: no se solicita nombre real, email, teléfono ni identificadores directos del menor.
- Finalidad educativa: los datos se usan para operación técnica, seguridad y mejora pedagógica agregada.
- Seguridad por defecto: cifrado en tránsito, control de acceso y trazabilidad de acciones administrativas.
- Retención acotada: borrar lo antes posible sin romper continuidad operativa ni soporte.

## Clasificación de datos

| Categoría | Ejemplos | Sensibilidad | Base de uso |
|---|---|---|---|
| Metadatos de sesión | `sessionId`, `classroomId`, timestamps, latencia | Media | Operación técnica |
| Contenido conversacional | mensajes de usuario y respuestas IA | Alta | Función pedagógica |
| Eventos de seguridad | detección de riesgo, bloqueos, escalados | Alta | Protección y trazabilidad |
| Métricas agregadas | volumen diario, tasa de error, consumo IA | Baja/Media | Capacidad y coste |
| Auditoría administrativa | cambios de configuración, accesos admin | Alta | Cumplimiento y forense |

## Retención por categoría

| Categoría | Retención | Borrado | Responsable |
|---|---:|---|---|
| Metadatos de sesión | 30 días | Purga automática diaria | Backend/Ops |
| Contenido conversacional | 30 días | Purga automática + borrado bajo solicitud | DPO/Responsable de centro |
| Eventos de seguridad | 180 días | Purga automática mensual | Seguridad/DPO |
| Métricas agregadas (anonimizadas) | 12 meses | Rotación mensual | Product/Ops |
| Auditoría administrativa | 12 meses | Rotación mensual (archivo inmutable cuando aplique) | Seguridad/Ops |

## Matriz de acceso (RBAC)

| Rol | Puede ver contenido de chat | Puede ver métricas | Puede borrar datos | Puede cambiar retención |
|---|---|---|---|---|
| Alumno/a | Solo su sesión activa | No | No | No |
| Docente | Solo panel agregado de su aula | Sí (agregado) | No | No |
| Coordinación centro | Casos escalados del centro | Sí | Solicitar borrado | No |
| DPO/Legal | Sí, bajo incidente y registro | Sí | Sí | Sí (con aprobación) |
| Admin técnico | No por defecto (solo metadatos) | Sí | Ejecuta proceso técnico | No |

Reglas obligatorias:

- Toda lectura de contenido sensible deja rastro en auditoría.
- Acceso a contenido de chat solo por necesidad justificada (incidente, riesgo o revisión autorizada).
- Principio de mínimo privilegio y cuentas nominales.

## Flujo de borrado

1. Solicitud registrada (centro, DPO o incidente técnico).
2. Validación del alcance (`classroomId`, rango de fechas, tipo de dato).
3. Ejecución por job de borrado idempotente.
4. Verificación con reporte de filas eliminadas.
5. Registro de evidencia de cumplimiento en auditoría.

### SLA de borrado

- Solicitud ordinaria: máximo 7 días naturales.
- Solicitud crítica (incidente o requerimiento legal): máximo 72 horas.

## Reglas para datos de menores

- Prohibido capturar identificadores personales en prompts o formularios.
- Filtro de PII en backend antes de persistir mensajes cuando sea viable.
- Pseudonimización de `sessionId` en exportes y análisis.
- Exportes externos solo en formato agregado/anónimo.

## Backups y restauración

- Frecuencia: backup diario de base de datos.
- Cifrado de backup: obligatorio (clave gestionada por operación).
- Retención de backups: 30 días.
- Restauración: prueba mensual documentada en entorno controlado.
- Borrado en backups: se aplica por expiración de backup (no reescritura retroactiva salvo obligación legal).

## Controles técnicos mínimos

- TLS interno/externo para API.
- Hash de identificadores de sesión cuando aplique.
- Rotación de secretos y claves de API.
- Alertas de acceso inusual a tablas sensibles.
- Logs firmados o inmutables para eventos de auditoría.

## Excepciones

Toda excepción requiere:

- aprobación de DPO + responsable técnico,
- tiempo de vigencia definido,
- plan de remediación y cierre.

## Checklist de cumplimiento rápido

- [ ] Retención parametrizada por categoría en backend.
- [ ] Job de purga diaria activo y monitorizado.
- [ ] Tabla de auditoría habilitada para accesos sensibles.
- [ ] Procedimiento de borrado probado end-to-end.
- [ ] Documento de comunicación al centro sobre política de datos.
