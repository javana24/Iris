# GitHub Governance - IRIS

## Objetivo

Garantizar trazabilidad con Jira, calidad de integración y flujo de colaboración estable para equipo pequeño.

## Estrategia de ramas

- Rama principal: `main` (protegida).
- Rama de integración opcional: `develop` (si el volumen lo requiere).
- Ramas de trabajo por issue:
  - `feature/IRIS-123-short-name`
  - `bugfix/IRIS-456-short-name`
  - `chore/IRIS-789-short-name`

## Convención de commits

Formato recomendado:

`IRIS-123 type(scope): message`

Ejemplos:

- `IRIS-123 feat(chat): improve message validation`
- `IRIS-221 fix(api): handle timeout on gemini adapter`

Tipos sugeridos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Pull Request flow

1. Abrir PR enlazando issue Jira.
2. Completar plantilla PR obligatoria.
3. Al menos 1 aprobación de compañero.
4. Checks en verde (build/test/lint cuando estén disponibles).
5. Merge a `main` (o `develop`) con historial limpio.

## Reglas de protección recomendadas (`main`)

- Require pull request before merging.
- Require approvals: mínimo 1.
- Require conversation resolution.
- Require status checks (activar cuando exista CI).
- Block force pushes.
- Block branch deletion.

## Regla de trazabilidad

Un issue de Jira no se considera cerrado sin:

- PR mergeada.
- Commit(s) con clave `IRIS-XXX`.
- Evidencia funcional mínima (capturas o notas breves).
