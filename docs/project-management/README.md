# IRIS Project Management Pack

Este directorio contiene la implementación operativa del plan de arranque Scrum para IRIS.

## Contenido

- `jira/jira-project-setup.md`: configuración detallada de Jira (workflow, issue types, carriles y filtros).
- `confluence/confluence-space-setup.md`: estructura del Space IRIS y normas de documentación viva.
- `confluence/templates/`: plantillas listas para pegar en Confluence (Charter, Acta, ADR y Requisito).
- `scrum/scrum-operating-model.md`: cadencia semanal, capacidades, DoR/DoD y reglas de WIP.
- `github/github-governance.md`: estrategia de ramas, commits con clave Jira, PR flow y protección de ramas.
- `discovery/sprint-0-mvp-discovery.md`: ejecución de sprint 0 para cerrar alcance de MVP y backlog priorizado.
- `operations/data-retention-policy-pilot.md`: política de datos, retención, acceso y borrado para menores en piloto.
- `operations/capacity-cost-model-pilot.md`: modelo de capacidad/coste para 50, 100 y 200 concurrentes con IA limitada.
- `operations/ai-guardrails-and-safety-protocol.md`: guardrails IA por modo y protocolo de escalado de riesgo.
- `operations/onprem-minimum-blueprint.md`: blueprint técnico on-prem mínimo para operar el piloto.
- `operations/go-live-checklist-june-pilot.md`: checklist técnico-operativo para salida del 1 de junio.
- `operations/release-readiness-web-mobile-scrum-14.md`: evidencia de validacion release web/movil, riesgos y plan de mitigacion para `SCRUM-14`.
- `operations/planning-reconciliation-jira-confluence.md`: contraste de planning entre Jira y Confluence con diferencias normalizadas.
- `api-contract/`: contrato API canonico entre web Angular y Android nativo, ADR de la decision, especificacion y guia de migracion para `SCRUM-65`.

## Resultado esperado

Con estos documentos el equipo puede:

1. Arrancar Jira y Confluence desde cero con estructura profesional.
2. Trabajar con Scrum híbrido (sprint + fast lane) sin perder foco.
3. Mantener trazabilidad de extremo a extremo entre Jira, Confluence y GitHub.
4. Operar un piloto con criterios claros de seguridad, coste, capacidad y salida a producción.
