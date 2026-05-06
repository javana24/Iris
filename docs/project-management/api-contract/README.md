# API Contract Pack (SCRUM-65)

Documentación del contrato API único entre el backend Node y los clientes web Angular y Android nativo.

## Documentos

- [`ADR-001-unified-api-contract.md`](./ADR-001-unified-api-contract.md) — Decisión arquitectónica (Opción A: Android se adapta al backend).
- [`api-spec.md`](./api-spec.md) — Especificación canónica con endpoints, validaciones, errores y ejemplos curl.
- [`android-migration.md`](./android-migration.md) — Guía operativa para el equipo Android: breaking changes, DTOs Kotlin y plan de pruebas.
- [`scrum-65-summary.md`](./scrum-65-summary.md) — Resumen del trabajo realizado y razones de cada decisión.

## Cómo leer este pack

- **Si vas a integrar contra el backend** (web, móvil): empieza por `api-spec.md`.
- **Si quieres entender por qué el contrato es así**: lee `ADR-001-unified-api-contract.md`.
- **Si vas a tocar la app Android nativa**: ve directamente a `android-migration.md`.
- **Si presentas el trabajo en daily o demo**: usa `scrum-65-summary.md`.

## Trazabilidad

- Issue Jira: `SCRUM-65`.
- Épica: `SCRUM-34`.
- Implementación de referencia: `server/server.js`.
- Cliente Angular alineado: `src/app/services/ai.service.ts`.
