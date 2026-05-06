# Implementacion MVP chat IA (1 mes)

Este documento deja operativo el plan de seleccion IA para Iris con foco en coste, rapidez y capacidad de usar dataset propio.

## Resultado implementado

- Backend con capa multi-proveedor (`LLMAdapter`) en `server/lib/llm-adapter.js`.
- Fallback automatico entre proveedor principal y secundario (`LLM_PROVIDER`, `LLM_FALLBACK_PROVIDER`).
- RAG minimo con dataset local en `server/lib/rag-store.js`.
- Endpoint `POST /api/chat` usando:
  - contexto recuperado del dataset (si aplica),
  - limites de tokens (`LLM_MAX_OUTPUT_TOKENS`),
  - timeout (`LLM_TIMEOUT_MS`),
  - telemetria por request (`provider`, `model`, `usage`, `ragHits`).
- Script de benchmark: `node server/scripts/benchmark-models.js`.
- Plantillas listas para configurar entorno y dataset:
  - `server/.env.example`
  - `server/data/rag-dataset.example.json`

## Decision operativa recomendada

- **Proveedor principal inicial**: `deepseek` (coste bajo).
- **Fallback**: `openai` (estabilidad operativa para demo).
- **Alternativa si ya usais Gemini**: `gemini` principal + `openai` fallback.

## Umbral minimo para aceptar proveedor principal

- Calidad media >= 3.8/5 en prompts reales.
- Latencia p95 <= 3000 ms.
- Error rate <= 3% en muestra de benchmark.
- Coste por 1000 conversaciones dentro del presupuesto de demo.

Si falla uno de los umbrales, se conmuta proveedor principal al fallback.

## Como ejecutar benchmark rapido

1. Copiar `server/.env.example` a `server/.env`.
2. Configurar al menos un API key.
3. Ejecutar:

```bash
cd server
node scripts/benchmark-models.js
```

Se genera `server/benchmark-report.json`.

## Hardening demo (checklist)

- [ ] Validar 20-30 prompts reales (incluye casos sensibles).
- [ ] Revisar `benchmark-report.json` y fijar proveedor principal/fallback.
- [ ] Confirmar que `telemetry.usage.totalTokens` llega en respuestas.
- [ ] Probar desconexion del proveedor principal y verificar fallback.
- [ ] Verificar respuestas de riesgo con mensaje de seguridad visible.
- [ ] Revisar coste diario estimado con volumen de presentacion.

## Notas de alcance

- Este RAG es deliberadamente simple para cumplir tiempo (1 mes).
- Si quereis escalar despues de la demo: mover de dataset local a pgvector/Qdrant y usar embeddings dedicados.
