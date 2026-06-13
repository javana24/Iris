const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CONTENT_DIR = path.join(__dirname, '..', 'data', 'contenido-instituto');
const CACHE_PATH = path.join(CONTENT_DIR, 'cache.json');
const BUILD_SCRIPT = path.join(__dirname, '..', 'scripts', 'build-institute-cache.js');

const MODE_LIMITS = {
  iris: 3200,
  partner: 2400
};

const MODE_DOCUMENT_BOOST = {
  iris: {
    'PUNTO 5 - YASMINA': 1.4,
    'PUNTO 7 - NOELIA': 1.3,
    'PUNTO 1 - IRINA': 1.2,
    'PUNTO 2 - ELENA': 1.2,
    'PUNTO 4 - ANDREA': 1.3,
    'PUNTO 9 - INÉS': 1.1
  },
  partner: {
    'PUNTO 4 - ANDREA': 2,
    'PUNTO 2 - ELENA': 1.5
  }
};

const CONVERSATION_TOPIC_HINTS = [
  { terms: ['movil', 'móvil', 'telefono', 'teléfono', 'instagram', 'whatsapp', 'redes'], folders: ['PUNTO 4 - ANDREA', 'PUNTO 2 - ELENA'] },
  { terms: ['control', 'controla', 'celos', 'celosa', 'celoso', 'ubicacion', 'ubicación'], folders: ['PUNTO 4 - ANDREA', 'PUNTO 2 - ELENA', 'PUNTO 1 - IRINA'] },
  { terms: ['miedo', 'amenaza', 'chantaje', 'manipul', 'gaslight'], folders: ['PUNTO 4 - ANDREA', 'PUNTO 2 - ELENA'] },
  { terms: ['016', '112', 'ayuda', 'recurso', 'telefono', 'teléfono'], folders: ['PUNTO 7 - NOELIA', 'PUNTO 9 - INÉS'] },
  { terms: ['derecho', 'denunc', 'victima', 'víctima'], folders: ['PUNTO 9 - INÉS'] }
];

let cachedPayload = null;

function cacheIsStale() {
  if (!fs.existsSync(CACHE_PATH)) {
    return true;
  }

  const cacheMtime = fs.statSync(CACHE_PATH).mtimeMs;
  return walkContentFiles(CONTENT_DIR).some((filePath) => {
    if (filePath.endsWith('cache.json')) {
      return false;
    }
    return fs.statSync(filePath).mtimeMs > cacheMtime;
  });
}

function walkContentFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.name.startsWith('.')) {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...walkContentFiles(entryPath));
      continue;
    }
    if (/\.docx$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function rebuildCache() {
  const result = spawnSync(process.execPath, [BUILD_SCRIPT], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'No se pudo generar cache del instituto');
  }
}

function loadPayload(forceReload = false) {
  if (!forceReload && cachedPayload) {
    return cachedPayload;
  }

  if (cacheIsStale()) {
    rebuildCache();
  }

  if (!fs.existsSync(CACHE_PATH)) {
    cachedPayload = { documents: [], documentCount: 0, chunkCount: 0 };
    return cachedPayload;
  }

  cachedPayload = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  return cachedPayload;
}

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9áéíóúñü]+/i)
    .filter((token) => token.length >= 4);
}

function scoreChunk({ chunk, topics, folder, mode, conversationTokens, conversationText }) {
  const chunkTokens = new Set(tokenize(chunk));
  let score = 0;

  for (const token of conversationTokens) {
    if (chunkTokens.has(token)) {
      score += 3;
    }
  }

  for (const topic of topics) {
    const topicTokens = tokenize(topic);
    for (const topicToken of topicTokens) {
      if (chunkTokens.has(topicToken)) {
        score += 2;
      }
      if ((chunk || '').toLowerCase().includes(topicToken)) {
        score += 1;
      }
    }
  }

  for (const hint of CONVERSATION_TOPIC_HINTS) {
    const matchesHint = hint.terms.some((term) => conversationText.includes(term));
    if (matchesHint && hint.folders.includes(folder)) {
      score += 6;
    }
  }

  const boost = MODE_DOCUMENT_BOOST[mode]?.[folder] || 1;
  return score * boost;
}

function selectContext(simulatorMode, messages = [], language = 'es') {
  const mode = simulatorMode === 'partner' ? 'partner' : 'iris';
  const payload = loadPayload();
  const maxChars = MODE_LIMITS[mode];
  const conversationText = (messages || [])
    .map((message) => message?.text || '')
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const conversationTokens = new Set(tokenize(conversationText));

  const rankedChunks = [];

  for (const document of payload.documents || []) {
    if (!document.modes?.includes(mode === 'partner' ? 'partner' : 'iris')) {
      continue;
    }

    document.chunks.forEach((chunk, index) => {
      rankedChunks.push({
        documentId: document.id,
        title: document.title,
        folder: document.folder,
        chunkIndex: index,
        text: chunk,
        score: scoreChunk({
          chunk,
          topics: document.topics || [],
          folder: document.folder,
          mode,
          conversationTokens,
          conversationText
        })
      });
    });
  }

  rankedChunks.sort((a, b) => b.score - a.score || a.chunkIndex - b.chunkIndex);

  const selected = [];
  let usedChars = 0;
  const usedKeys = new Set();

  const pickChunks = (chunks, minScore = 0) => {
    const perDocument = new Map();

    for (const item of chunks) {
      if (item.score < minScore) {
        continue;
      }
      const key = `${item.documentId}:${item.chunkIndex}`;
      if (usedKeys.has(key)) {
        continue;
      }
      const currentCount = perDocument.get(item.documentId) || 0;
      if (currentCount >= 2) {
        continue;
      }
      if (usedChars + item.text.length > maxChars) {
        continue;
      }
      usedKeys.add(key);
      selected.push(item);
      usedChars += item.text.length;
      perDocument.set(item.documentId, currentCount + 1);
    }
  };

  pickChunks(rankedChunks, 2);

  if (selected.length < 2) {
    pickChunks(rankedChunks, 0);
  }

  if (selected.length === 0) {
    for (const document of payload.documents || []) {
      if (!document.modes?.includes(mode === 'partner' ? 'partner' : 'iris')) {
        continue;
      }
      const fallbackChunk = document.chunks?.[0];
      if (!fallbackChunk) {
        continue;
      }
      selected.push({
        documentId: document.id,
        title: document.title,
        folder: document.folder,
        chunkIndex: 0,
        text: fallbackChunk,
        score: 0
      });
      if (selected.length >= 2) {
        break;
      }
    }
  }

  const contextText = selected
    .map((item) => `[${item.title}]\n${item.text}`)
    .join('\n\n');

  return {
    mode,
    language,
    maxChars,
    usedChars,
    chunkCount: selected.length,
    sources: selected.map((item) => ({
      id: item.documentId,
      title: item.title
    })),
    text: contextText
  };
}

function buildInstituteInstruction(simulatorMode, messages, language = 'es') {
  const context = selectContext(simulatorMode, messages, language);
  if (!context.text) {
    return '';
  }

  if (language === 'en') {
    return simulatorMode === 'partner'
      ? `\nINSTITUTE TRAINING MATERIAL (use for realistic toxic phrasing, never quote verbatim long passages):\n${context.text}\nStay in character. Use the tone and manipulation patterns above when they fit the conversation.`
      : `\nINSTITUTE TRAINING MATERIAL (ground your counseling in this content, do not mention documents):\n${context.text}\nUse this guidance to explain patterns, validate feelings and recommend appropriate help when needed.`;
  }

  return simulatorMode === 'partner'
    ? `\nMATERIAL FORMATIVO DEL INSTITUTO (úsalo para un lenguaje realista y tóxico; no copies párrafos enteros):\n${context.text}\nMantén el personaje. Usa el tono y los patrones de manipulación anteriores cuando encajen en la conversación.`
    : `\nMATERIAL FORMATIVO DEL INSTITUTO (basa tu orientación en este contenido; no menciones documentos):\n${context.text}\nUsa esta guía para explicar patrones, validar emociones y recomendar ayuda adecuada cuando haga falta.`;
}

function getExtraSafetyKeywords() {
  const payload = loadPayload();
  const keywords = new Set();

  for (const document of payload.documents || []) {
    for (const topic of document.topics || []) {
      if (topic.length >= 4) {
        keywords.add(topic.toLowerCase());
      }
    }
  }

  const resourceDoc = (payload.documents || []).find((doc) => doc.punto === 7);
  if (resourceDoc) {
    const matches = resourceDoc.chunks.join(' ').match(/\b0\d{2,3}\b/g) || [];
    matches.forEach((value) => keywords.add(value));
  }

  return Array.from(keywords);
}

function getInstituteStatus() {
  const payload = loadPayload();
  return {
    loaded: Boolean(payload.documentCount),
    documentCount: payload.documentCount || 0,
    chunkCount: payload.chunkCount || 0,
    generatedAt: payload.generatedAt || null,
    topics: (payload.documents || []).map((doc) => ({
      id: doc.id,
      punto: doc.punto,
      title: doc.title,
      modes: doc.modes,
      belt: doc.belt
    }))
  };
}

function initializeInstituteContent() {
  const payload = loadPayload();
  console.log(
    `Contenido instituto: ${payload.documentCount || 0} documentos, ${payload.chunkCount || 0} fragmentos`
  );
  return payload;
}

module.exports = {
  initializeInstituteContent,
  buildInstituteInstruction,
  getExtraSafetyKeywords,
  getInstituteStatus,
  selectContext,
  loadPayload
};
