require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const os = require('os');

const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in environment.');
}

// Permitir CORS desde cualquier origen (web y móvil)
app.use(cors({ 
  origin: true, // Permite cualquier origen
  credentials: true 
}));
app.use(express.json({ limit: '1mb' }));

// Obtener IP local automáticamente
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/models', async (_req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }
    const data = await response.json();
    const models = (data.models || []).map((m) => ({
      name: m.name,
      displayName: m.displayName,
      supportedGenerationMethods: m.supportedGenerationMethods
    }));
    res.json({ models });
  } catch (error) {
    console.error('List models error:', error);
    res.status(500).json({ error: 'List models failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const { messages = [], language = 'es' } = req.body || {};
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt =
      language === 'en'
        ? `You are IRIS. Speak like a warm, real person.
Keep responses short (1-2 sentences) and ALWAYS finish any sentence you start.
End with proper punctuation (., !, ?).
Do NOT repeat yourself or restart the same sentence.
Do NOT greet again if already in conversation.
Be natural and context-aware. Avoid robotic phrasing.
Do NOT mention toxicity detection unless the user asks directly.
Ask one gentle follow-up question when it fits.`
        : `Eres IRIS. Habla como una persona cercana y natural.
Responde breve (1-2 frases) y SIEMPRE termina cualquier frase que empieces.
Termina con puntuación correcta (., !, ?).
No te repitas ni reinicies la misma frase.
No saludes de nuevo si la conversación ya empezó.
Sé natural y adapta al contexto. Evita frases robotizadas.
NO menciones la detección de toxicidad salvo que la persona lo pida directamente.
Haz una pregunta suave cuando encaje.`;

    const filtered = (messages || []).filter((m) => m && m.text);
    const recent = filtered.slice(-6);
    const alreadyGreeted = recent.some((m) => m.role === 'assistant');

    const systemWithGreeting =
      alreadyGreeted
        ? `${systemPrompt}\nNo saludes ni vuelvas a iniciar la conversación.`
        : systemPrompt;

    const contents = [
      { role: 'user', parts: [{ text: systemWithGreeting }] },
      ...recent.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }))
    ];

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 260
      }
    });
    let response = result.response?.text?.().trim() || '';

    const dedupeRepeatedStart = (text) => {
      const cleaned = text.replace(/\s+/g, ' ').trim();
      const parts = cleaned.split(/(?<=[.!?…])\s+/);
      if (parts.length >= 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
        return parts.slice(1).join(' ');
      }
      return cleaned;
    };

    response = dedupeRepeatedStart(response);

    response = response.replace(/^¡Hola!\s*/i, (match) => {
      return alreadyGreeted ? '' : match;
    }).trim();

    const endsWithPunctuation = /[.!?…]$/.test(response);
    if (response && !endsWithPunctuation) {
      const fixPrompt =
        language === 'en'
          ? `Finish the previous response in one complete sentence.`
          : `Termina la respuesta anterior en una frase completa.`;
      const fixResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${fixPrompt}\n\nRespuesta anterior: ${response}` }] }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: 80
        }
      });
      const fix = fixResult.response?.text?.().trim() || '';
      if (fix) {
        response = `${response} ${fix}`.trim();
      }
    }

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Escuchar en todas las interfaces (0.0.0.0) para permitir conexiones desde la red local
app.listen(port, '0.0.0.0', () => {
  console.log(`IRIS server running on http://localhost:${port}`);
  console.log(`Also accessible from network: http://${localIP}:${port}`);
  console.log(`\n📱 Para usar en Android, configura la IP: ${localIP}`);
});
