const fs = require('fs');
const path = require('path');

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(text) {
  return normalize(text)
    .split(' ')
    .filter((token) => token.length > 2);
}

function overlapScore(query, candidate) {
  const a = new Set(tokens(query));
  const b = new Set(tokens(candidate));
  if (a.size === 0 || b.size === 0) return 0;
  let overlap = 0;
  for (const token of a) {
    if (b.has(token)) overlap += 1;
  }
  return overlap / Math.sqrt(a.size * b.size);
}

class RagStore {
  constructor() {
    this.items = [];
    this.datasetPath = process.env.RAG_DATASET_PATH
      ? path.resolve(process.env.RAG_DATASET_PATH)
      : path.join(__dirname, '..', 'data', 'rag-dataset.json');
    this.topK = Number(process.env.RAG_TOP_K || 3);
    this.minScore = Number(process.env.RAG_MIN_SCORE || 0.08);
    this.enabled = process.env.RAG_ENABLED !== 'false';
  }

  loadDataset() {
    if (!this.enabled) {
      this.items = [];
      return;
    }
    if (!fs.existsSync(this.datasetPath)) {
      this.items = [];
      return;
    }
    try {
      const raw = fs.readFileSync(this.datasetPath, 'utf8');
      const parsed = JSON.parse(raw);
      const entries = Array.isArray(parsed) ? parsed : parsed.documents;
      this.items = Array.isArray(entries)
        ? entries
            .filter((doc) => doc && typeof doc.content === 'string')
            .map((doc, index) => ({
              id: doc.id || `doc-${index + 1}`,
              title: doc.title || `Documento ${index + 1}`,
              content: doc.content.trim(),
              source: doc.source || ''
            }))
        : [];
    } catch (_error) {
      this.items = [];
    }
  }

  getContextForQuery(query) {
    if (!this.enabled || this.items.length === 0 || !query) {
      return { contextText: '', hits: [] };
    }

    const ranked = this.items
      .map((item) => ({
        ...item,
        score: overlapScore(query, `${item.title} ${item.content}`)
      }))
      .filter((item) => item.score >= this.minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topK);

    if (ranked.length === 0) return { contextText: '', hits: [] };

    const contextText = ranked
      .map((hit) => {
        const sourceLine = hit.source ? ` | Fuente: ${hit.source}` : '';
        return `[${hit.id}] ${hit.title}${sourceLine}\n${hit.content}`;
      })
      .join('\n\n');

    return { contextText, hits: ranked };
  }
}

module.exports = {
  RagStore
};
