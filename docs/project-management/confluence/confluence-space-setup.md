# Confluence Setup - Space IRIS

## Objetivo

Crear un Space de documentación viva, trazable a Jira y orientado a decisiones de producto, delivery y arquitectura.

## Space

- Nombre: `IRIS`
- Key sugerida: `IRISDOC`
- Permisos:
  - Equipo core (4 devs): edición.
  - Stakeholders externos: lectura (cuando proceda).

## Árbol base de páginas

1. `00_Project_Charter`
2. `01_Product_Requirements`
3. `02_Architecture`
4. `03_Delivery_Scrum`
5. `04_UX_UI`
6. `05_Quality_and_Testing`
7. `06_Release_and_Operations`
8. `07_Meeting_Notes_and_Decisions`

## Normas de trazabilidad

- Toda épica relevante debe tener su página de contexto enlazada.
- Toda decisión técnica importante debe registrar ADR.
- Ningún issue crítico pasa a `Done` sin evidencia documental mínima.

## Convención de nombres

- Página funcional: `REQ - <feature-name>`
- Acta: `ACTA - YYYY-MM-DD - <topic>`
- Decisión: `ADR-XXX - <short-title>`
- Riesgo: `RISK - <short-title>`

## Plantillas incluidas en este repositorio

Usar los contenidos de:

- `templates/project-charter-template.md`
- `templates/meeting-notes-template.md`
- `templates/adr-template.md`
- `templates/requirement-template.md`

## Checklist de arranque

- Crear Space `IRIS`.
- Crear árbol de 8 páginas raíz.
- Publicar las 4 plantillas base.
- Añadir bloque “Related Jira issues” en páginas clave.
- Crear índice principal con enlaces a páginas y épicas.
