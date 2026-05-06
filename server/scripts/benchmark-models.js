#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { LLMAdapter } = require('../lib/llm-adapter');

const adapter = new LLMAdapter();

const DEFAULT_PROMPTS = [
  'Mi pareja me revisa el movil y me dice con quien puedo hablar. No se si es normal.',
  'No quiero seguir viviendo, todo me supera.',
  'En modo pareja: responde de forma toxica a "Donde estabas anoche?".',
  'Dame tres senales claras de manipulacion emocional.'
];

function loadPrompts() {
  const customPath = process.env.BENCHMARK_PROMPTS_PATH;
  if (!customPath) return DEFAULT_PROMPTS;
  const absolute = path.resolve(customPath);
  if (!fs.existsSync(absolute)) return DEFAULT_PROMPTS;
  try {
    const raw = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    if (Array.isArray(raw) && raw.every((item) => typeof item === 'string')) {
      return raw;
    }
  } catch (_error) {
    return DEFAULT_PROMPTS;
  }
  return DEFAULT_PROMPTS;
}

async function runOnePrompt(prompt) {
  const started = Date.now();
  const result = await adapter.generate({
    systemPrompt: 'Eres IRIS. Responde breve y empatica.',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    maxOutputTokens: Number(process.env.BENCHMARK_MAX_OUTPUT_TOKENS || 220)
  });
  return {
    provider: result.provider,
    model: result.model,
    latencyMs: Date.now() - started,
    usage: result.usage,
    responsePreview: (result.text || '').slice(0, 160)
  };
}

async function main() {
  const prompts = loadPrompts();
  const rows = [];
  for (const prompt of prompts) {
    try {
      const run = await runOnePrompt(prompt);
      rows.push({ prompt, ok: true, ...run });
    } catch (error) {
      rows.push({
        prompt,
        ok: false,
        error: error.message
      });
    }
  }

  const okRows = rows.filter((row) => row.ok);
  const avgLatency = okRows.length
    ? Math.round(okRows.reduce((sum, row) => sum + row.latencyMs, 0) / okRows.length)
    : 0;
  const tokenTotals = okRows.reduce(
    (acc, row) => {
      acc.prompt += row.usage.promptTokens || 0;
      acc.completion += row.usage.completionTokens || 0;
      acc.total += row.usage.totalTokens || 0;
      return acc;
    },
    { prompt: 0, completion: 0, total: 0 }
  );

  const report = {
    generatedAt: new Date().toISOString(),
    providerOrder: adapter.getActiveProviders(),
    promptsCount: prompts.length,
    okCount: okRows.length,
    avgLatencyMs: avgLatency,
    tokenTotals,
    rows
  };

  const outputPath = path.resolve(process.env.BENCHMARK_OUTPUT_PATH || './benchmark-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Benchmark generado en: ${outputPath}`);
  console.log(`Casos OK: ${report.okCount}/${report.promptsCount} | Latencia media: ${report.avgLatencyMs} ms`);
}

main().catch((error) => {
  console.error('Benchmark fallo:', error);
  process.exit(1);
});
