const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const CONTENT_DIR = path.join(__dirname, '..', 'data', 'contenido-instituto');
const CACHE_PATH = path.join(CONTENT_DIR, 'cache.json');

const FOLDER_META = {
  'PUNTO 1 - IRINA': {
    punto: 1,
    title: 'Qué es la violencia de género y sus formas',
    modes: ['iris'],
    topics: ['violencia de género', 'formas', 'tipos', 'maltrato', 'control', 'machismo'],
    belt: 'white'
  },
  'PUNTO 2 - ELENA': {
    punto: 2,
    title: 'Señales de alerta',
    modes: ['iris', 'partner'],
    topics: ['señales', 'alerta', 'red flags', 'preocuparse', 'adolescencia', 'riesgo'],
    belt: 'white'
  },
  'PUNTO 4 - ANDREA': {
    punto: 4,
    title: 'Cómo hablan los jóvenes',
    modes: ['partner', 'iris'],
    topics: ['lenguaje', 'manipulación', 'control', 'celos', 'chantaje', 'gaslighting', 'adolescentes'],
    belt: 'yellow'
  },
  'PUNTO 5 - YASMINA': {
    punto: 5,
    title: 'Cómo responder en situaciones complicadas',
    modes: ['iris'],
    topics: ['responder', 'apoyo', 'escuchar', 'juzgar', 'contención', 'límites'],
    belt: 'purple'
  },
  'PUNTO 6 - ELVA': {
    punto: 6,
    title: 'Cómo hablar sobre estos temas',
    modes: ['iris'],
    topics: ['comunicación', 'escucha', 'lenguaje', 'adolescentes', 'empatía', 'juzgar'],
    belt: 'purple'
  },
  'PUNTO 7 - NOELIA': {
    punto: 7,
    title: 'Recursos oficiales y teléfonos de ayuda',
    modes: ['iris'],
    topics: ['016', '112', 'ayuda', 'recursos', 'teléfono', 'IAM', 'emergencia'],
    belt: 'black'
  },
  'PUNTO 8 - ROSA': {
    punto: 8,
    title: 'Proyecto IRIS',
    modes: ['iris'],
    topics: ['proyecto', 'prevención', 'educación', 'formación'],
    belt: 'white'
  },
  'PUNTO 9 - INÉS': {
    punto: 9,
    title: 'Derechos de las víctimas',
    modes: ['iris'],
    topics: ['derechos', 'víctimas', 'ley', 'protección', 'denuncia', 'ayuda'],
    belt: 'black'
  }
};

function normalizeText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/[ \u00a0]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function chunkText(text, maxChunkSize = 900) {
  const paragraphs = normalizeText(text)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 40);

  const chunks = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if ((current + '\n\n' + paragraph).length <= maxChunkSize) {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (paragraph.length <= maxChunkSize) {
      current = paragraph;
      continue;
    }

    const sentences = paragraph.split(/(?<=[.!?…])\s+/);
    current = '';
    for (const sentence of sentences) {
      if ((current + ' ' + sentence).trim().length <= maxChunkSize) {
        current = current ? `${current} ${sentence}` : sentence;
      } else {
        if (current) chunks.push(current.trim());
        current = sentence;
      }
    }
  }

  if (current) {
    chunks.push(current.trim());
  }

  return chunks;
}

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({ buffer: fs.readFileSync(filePath) });
  return normalizeText(result.value || '');
}

async function collectDocuments() {
  const documents = [];

  for (const entry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }

    const folderPath = path.join(CONTENT_DIR, entry.name);
    const meta = FOLDER_META[entry.name];
    if (!meta) {
      console.warn(`Sin metadatos para carpeta: ${entry.name}`);
      continue;
    }

    const docxFiles = fs.readdirSync(folderPath)
      .filter((name) => name.toLowerCase().endsWith('.docx'))
      .sort();

    if (docxFiles.length === 0) {
      console.warn(`Sin .docx en: ${entry.name}`);
      continue;
    }

    const primaryFile = docxFiles[0];
    const filePath = path.join(folderPath, primaryFile);
    const text = await extractDocx(filePath);
    const chunks = chunkText(text);

    documents.push({
      id: `punto-${meta.punto}`,
      folder: entry.name,
      file: primaryFile,
      ...meta,
      charCount: text.length,
      chunks
    });

    console.log(`OK ${entry.name}: ${chunks.length} fragmentos (${text.length} caracteres)`);
  }

  return documents.sort((a, b) => a.punto - b.punto);
}

async function main() {
  const documents = await collectDocuments();
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceDir: 'server/data/contenido-instituto',
    documentCount: documents.length,
    chunkCount: documents.reduce((sum, doc) => sum + doc.chunks.length, 0),
    documents
  };

  fs.writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Cache escrita en ${CACHE_PATH}`);
}

main().catch((error) => {
  console.error('Error generando cache del instituto:', error);
  process.exit(1);
});
