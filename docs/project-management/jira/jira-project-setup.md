# Jira Setup - Proyecto IRIS

## Objetivo

Configurar un proyecto Jira híbrido para un equipo de 4 personas, combinando ejecución por sprint con gestión rápida de incidencias.

## 1) Crear proyecto

- Tipo recomendado: `Company-managed Software`.
- Nombre: `IRIS`.
- Clave: `IRIS`.
- Roles iniciales:
  - `Product Owner / Scrum Facilitator`: liderazgo de priorización y cadencia.
  - `Developers`: el resto del equipo (incluye revisión cruzada).

## 2) Issue Types

Configurar y habilitar los siguientes tipos:

- `Epic`: objetivos funcionales de alto nivel.
- `Story`: entrega de valor funcional.
- `Task`: trabajo técnico o de soporte.
- `Spike`: investigación acotada en tiempo.
- `Bug`: defectos funcionales o técnicos.
- `Sub-task`: descomposición granular.

## 3) Workflow recomendado

Estados:

`Backlog -> Ready -> In Progress -> In Review -> Done`

Reglas:

- Solo items con criterios de aceptación claros pasan a `Ready`.
- Todo item en `In Review` debe tener PR asociada.
- `Done` requiere evidencia mínima:
  - PR mergeada.
  - checklist QA básico superado.
  - enlace de documentación en Confluence (si aplica).

## 4) Carriles de trabajo (modelo híbrido)

### Sprint lane (planificado)

- `Story`, `Task`, `Spike`.
- Objetivo: entregables comprometidos en sprint semanal.

### Fast lane (incidencias)

- `Bug` bloqueante o urgencia operativa validada por PO/Scrum Facilitator.
- Política: reservar 20-25% de la capacidad semanal.

## 5) Campos obligatorios

Marcar como required en pantalla de creación/edición:

- `Priority`
- `Story Points` (o estimación equivalente)
- `Acceptance Criteria` (custom text field recomendado)
- `Definition of Done` (checklist o texto)
- `Component/s`
- `Platform` (single select: `web`, `mobile`, `shared`)

## 6) Components iniciales

- `frontend`
- `backend`
- `ux`
- `infra-future`
- `security`
- `content`
- `analytics`
- `mobile-first`

## 7) Board y filtros

Crear board `IRIS Delivery Board`.

Swimlanes por JQL:

1. Fast lane
   - `project = IRIS AND issuetype = Bug AND statusCategory != Done ORDER BY priority DESC, updated DESC`
2. Sprint lane
   - `project = IRIS AND issuetype in (Story, Task, Spike) AND statusCategory != Done ORDER BY Rank ASC`

Filtros guardados sugeridos:

- `IRIS - Sprint Ready`: `project = IRIS AND status = Ready ORDER BY priority DESC`
- `IRIS - Mobile`: `project = IRIS AND Platform = mobile AND statusCategory != Done`
- `IRIS - Blockers`: `project = IRIS AND priority = Highest AND statusCategory != Done`

## 8) Definition of Ready (DoR)

Un item entra en sprint solo si cumple:

- Objetivo claro y medible.
- Criterios de aceptación definidos.
- Dependencias identificadas.
- Diseño/API/alcance suficientemente claros para iniciar.

## 9) Definition of Done (DoD)

Un item pasa a `Done` solo si:

- Desarrollo completado y revisado.
- PR mergeada en rama principal definida.
- Validación funcional en desktop y mobile (si aplica).
- Documentación mínima actualizada en Confluence.
- Issue enlazada con commit/PR y evidencias.
