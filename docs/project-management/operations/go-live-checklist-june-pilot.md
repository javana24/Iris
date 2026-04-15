# Go-Live Checklist - Piloto IRIS (1 de Junio)

## 1) Gobierno y responsabilidades

- [ ] `Release Owner` asignado.
- [ ] `Incident Commander` asignado.
- [ ] `Security/DPO contact` asignado.
- [ ] Ventana oficial de despliegue aprobada por coordinación del centro.

## 2) Infraestructura y plataforma

- [ ] Certificados TLS válidos y no próximos a caducar.
- [ ] DNS/ruta de acceso validada en red del centro.
- [ ] API `/api/health` responde correctamente.
- [ ] PostgreSQL operativo con backups programados.
- [ ] Redis operativo con TTL para cuotas/colas.
- [ ] Monitorización y alertas activas.

## 3) Seguridad y cumplimiento

- [ ] Política de retención de datos aprobada y publicada internamente.
- [ ] Accesos RBAC aplicados (mínimo privilegio).
- [ ] Rotación/validación de secretos completada.
- [ ] Auditoría de accesos a datos sensibles habilitada.
- [ ] Procedimiento de borrado probado (muestra controlada).

## 4) IA y guardrails

- [ ] Límites de mensajes por sesión activados.
- [ ] Límite de tokens por respuesta activado por modo.
- [ ] Hard block de contenido peligroso verificado.
- [ ] Escalado de riesgo `R3` probado con simulación.
- [ ] Modo contingencia por presupuesto IA validado.

## 5) Rendimiento y capacidad

- [ ] Smoke test con 20 usuarios concurrentes.
- [ ] Test de carga con 100 concurrentes sin degradación severa.
- [ ] Test de estrés con 200 concurrentes y cola controlada.
- [ ] Validación de latencia p95 en umbral objetivo.
- [ ] Validación de error rate bajo carga.

## 6) Operación en aula

- [ ] Protocolo de alta de aula/sesión validado.
- [ ] Docente conoce límites de uso y mensajes de cola.
- [ ] Guía rápida para incidencias de conectividad entregada.
- [ ] Flujo de escalado a soporte técnico definido.
- [ ] Flujo de escalado de seguridad pedagógica definido.

## 7) Plan de rollback

- [ ] Criterios claros de rollback documentados.
- [ ] Snapshot previo a despliegue generado y verificado.
- [ ] Procedimiento de rollback ensayado.
- [ ] Tiempo objetivo de recuperación (RTO) comunicado al equipo.

## 8) Comunicación y soporte

- [ ] Mensaje de inicio de servicio preparado para el centro.
- [ ] Canal único de incidencias durante go-live habilitado.
- [ ] Turno de guardia técnica definido para la primera semana.
- [ ] Informe diario de estado previsto (resumen de KPIs e incidentes).

## 9) Exit criteria de go-live

Se considera go-live exitoso si, durante 5 días lectivos:

- [ ] Disponibilidad dentro del objetivo operativo acordado.
- [ ] Sin incidentes críticos de seguridad sin resolver.
- [ ] Coste IA en trayectoria compatible con presupuesto mensual.
- [ ] Docentes reportan operación estable en al menos 2 centros/aulas.

## 10) Evidencias obligatorias post-lanzamiento

- [ ] Acta de despliegue firmada por Release Owner.
- [ ] Capturas/export de dashboards de salud.
- [ ] Registro de incidentes y resolución de la primera semana.
- [ ] Informe de lecciones aprendidas y acciones para fase 2.
