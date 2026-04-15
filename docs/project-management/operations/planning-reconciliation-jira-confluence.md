# Reconciliación de Planning con Jira y Confluence

## Fuentes validadas

- Confluence: `08_Plan_Final_Junio_4Personas` (id `360487`)
- Confluence: `09_Sprint_Planning_Abril_Junio` (id `557057`)
- Jira: issues `SCRUM-16` a `SCRUM-32` en proyecto `SCRUM`

## Resultado de corroboración

El planning técnico del piloto está **alineado en estructura** con Jira y Confluence:

- 4 líneas de ejecución en paralelo (Frontend, Backend/Security, Mobile, QA/Docs/Piloto).
- Gate de release en `SCRUM-32` con fecha objetivo `01/06/2026`.
- Cadencia semanal por sprints de 1 semana.

## Diferencias detectadas y normalización aplicada

### 1) Asignación del gate de release

- En Confluence (página de plan) `SCRUM-32` aparece como gate final, pero sin owner explícito en el reparto principal de 4 líneas.
- En Jira, `SCRUM-32` sí tiene owner: **Antonio Salces Alcaraz**.

Decisión aplicada para documentación operativa:

- Tomar Jira como fuente de verdad de ownership operativo.
- Mantener Confluence como fuente de verdad funcional del plan y hitos.

### 2) Nombre visible de persona de línea Mobile

- Confluence refleja `Ezequiel Vargas Berrocal`.
- Jira muestra `Ezequiel Vargas` como displayName actual.

Decisión aplicada:

- Normalizar por `accountId` en integraciones técnicas y usar displayName vigente en Jira para operación diaria.

## Estado confirmado de reparto (Jira actual)

- Frontend UX:
  - `SCRUM-19`, `SCRUM-20`, `SCRUM-21`, `SCRUM-22` -> Javier Ballesteros Martínez
- Backend/Security:
  - `SCRUM-18`, `SCRUM-23`, `SCRUM-24`, `SCRUM-25` -> Antonio Salces Alcaraz
- Mobile:
  - `SCRUM-17`, `SCRUM-26`, `SCRUM-27`, `SCRUM-30` -> Ezequiel Vargas
- QA/Docs/Piloto:
  - `SCRUM-16`, `SCRUM-28`, `SCRUM-29`, `SCRUM-31` -> Alberto Maldonado Triana
- Gate release:
  - `SCRUM-32` -> Antonio Salces Alcaraz

## Sprint mapping validado (Confluence)

- S1: `SCRUM-15`, `SCRUM-12`
- S2: `SCRUM-10`, `SCRUM-9`, `SCRUM-7`, `SCRUM-21`, `SCRUM-8`, `SCRUM-27`, `SCRUM-23`, `SCRUM-6`
- S3: `SCRUM-29`, `SCRUM-14`
- S4: `SCRUM-13`, `SCRUM-19`, `SCRUM-18`, `SCRUM-17`, `SCRUM-16`, `SCRUM-20`, `SCRUM-26`, `SCRUM-24`
- S5: `SCRUM-11`
- S6: `SCRUM-25`, `SCRUM-31`
- S7: `SCRUM-22`, `SCRUM-30`, `SCRUM-28`, `SCRUM-32`

## Regla de sincronización recomendada

- Ownership, estado y prioridad: Jira manda.
- Narrativa, hitos y calendario funcional: Confluence manda.
- Cualquier diferencia se resuelve en Jira primero y luego se refleja en Confluence en menos de 24h.
