require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { body, validationResult } = require('express-validator');
const { buildSystemPrompt } = require('./lib/chat-prompts');
const {
  getAiConfig,
  getAiConfigError,
  generateChatCompletion,
  listAvailableModels,
  checkOllamaReachable,
  isOllamaConnectionError
} = require('./lib/llm-provider');
const {
  initializeInstituteContent,
  buildInstituteInstruction,
  getExtraSafetyKeywords,
  getInstituteStatus
} = require('./lib/institute-content');

const app = express();
const port = process.env.PORT || 3001;
const aiConfig = getAiConfig();

if (getAiConfigError(aiConfig)) {
  console.error(`AI configuration issue: ${getAiConfigError(aiConfig)}`);
} else {
  console.log(`AI provider: ${aiConfig.provider}${aiConfig.provider === 'ollama' ? ` (${aiConfig.ollamaModel} @ ${aiConfig.ollamaBaseUrl})` : ` (${aiConfig.geminiModel})`}`);
}

// Permitir CORS desde cualquier origen (web y móvil)
app.use(cors({
  origin: true, // Permite cualquier origen
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

function sendError(res, status, error, details = []) {
  return res.status(status).json({
    error,
    ...(details.length > 0 && { details })
  });
}

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return sendError(res, 400, 'Invalid JSON body', [
      { message: 'Request body must be valid JSON.' }
    ]);
  }
  return next(err);
});

function requireAiProvider(_req, res, next) {
  const configError = getAiConfigError();
  if (configError) {
    return sendError(res, 503, configError);
  }
  return next();
}

const allowedRoles = ['user', 'assistant'];
const allowedSimulatorModes = ['iris', 'partner'];

const validateChatRequest = [
  body('messages')
    .exists()
    .withMessage('messages is required.')
    .bail()
    .isArray({ min: 1 })
    .withMessage('messages must be a non-empty array.')
    .customSanitizer((messages) =>
      Array.isArray(messages)
        ? messages.map((message) => ({
            ...message,
            text: typeof message?.text === 'string' ? message.text : message?.content
          }))
        : messages
    ),
  body('messages.*.role')
    .exists()
    .withMessage('Each message needs a role.')
    .bail()
    .isString()
    .withMessage('Each message role must be a string.')
    .bail()
    .isIn(allowedRoles)
    .withMessage(`Each message role must be one of: ${allowedRoles.join(', ')}.`),
  body('messages.*.text')
    .exists()
    .withMessage('Each message needs text or content.')
    .bail()
    .isString()
    .withMessage('Each message text/content must be a string.')
    .bail()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Each message text/content must be between 1 and 10000 characters.'),
  body('language')
    .optional()
    .isString()
    .withMessage('language must be a string.')
    .bail()
    .isLength({ max: 10 })
    .withMessage('language must be at most 10 characters.'),
  body('simulatorMode')
    .optional()
    .custom((value) => {
      if (typeof value === 'boolean') return true;
      return typeof value === 'string' && allowedSimulatorModes.includes(value);
    })
    .withMessage(`simulatorMode must be a boolean or one of: ${allowedSimulatorModes.join(', ')}.`)
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Invalid request body', errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    })));
  }
  return next();
}

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
let instituteSafetyKeywords = [];

try {
  initializeInstituteContent();
  instituteSafetyKeywords = getExtraSafetyKeywords();
} catch (error) {
  console.error('No se pudo cargar el contenido del instituto:', error.message);
}

app.get('/api/health', async (_req, res) => {
  const ollamaStatus = aiConfig.provider === 'ollama'
    ? await checkOllamaReachable(aiConfig)
    : null;

  res.json({
    ok: true,
    ai: {
      provider: aiConfig.provider,
      configured: getAiConfigError() === null,
      model: aiConfig.provider === 'ollama' ? aiConfig.ollamaModel : aiConfig.geminiModel,
      fallbackToGemini: aiConfig.fallbackToGemini,
      ollama: ollamaStatus
    },
    institute: getInstituteStatus()
  });
});

app.get('/api/institute/topics', (_req, res) => {
  res.json(getInstituteStatus());
});

app.get('/api/models', requireAiProvider, async (_req, res) => {
  try {
    const models = await listAvailableModels();
    res.json({ models, provider: aiConfig.provider });
  } catch (error) {
    console.error('List models error:', error);
    sendError(res, 500, 'List models failed');
  }
});

app.post('/api/chat', requireAiProvider, validateChatRequest, handleValidationErrors, async (req, res) => {
  try {
    const { messages = [], language = 'es', simulatorMode = 'iris' } = req.body || {};
    const normalizedSimulatorMode =
      typeof simulatorMode === 'boolean'
        ? (simulatorMode ? 'partner' : 'iris')
        : simulatorMode;
    const isPartnerMode = normalizedSimulatorMode === 'partner';

    const safetyKeywords = [
      // Violence & Physical Aggression
      'golpear', 'pegar', 'empujar', 'herir', 'matar', 'cuchillo', 'sangre', 'puñetazo', 'patada',
      'ahorcar', 'quemar', 'disparar', 'arma', 'navaja', 'moratón', 'cicatriz', 'bofetada', 'agresión',
      'paliza', 'forcejear', 'romper cosas', 'lanzar objetos', 'encerrar', 'violencia', 'abuso',
      'golpes', 'cachetada', 'zurrar', 'tirar del pelo', 'estrangulación', 'asfixiar', 'disparo',
      'apuñalar', 'acuchillar', 'machacar', 'torturar', 'maltrato físico', 'moretón', 'hematoma',
      'ojo morado', 'costilla rota', 'hueso roto', 'traumatismo', 'lesión', 'dañar', 'hacer daño',

      // Psychological Manipulation & Control (Gaslighting, Isolation, etc.)
      'culpa', 'loco', 'loca', 'inventas', 'imaginas', 'celos', 'control', 'revisar móvil',
      'contraseña', 'ubicación', 'prohibir', 'vestir', 'maquillar', 'amigos', 'familia',
      'nadie te quiere', 'inútil', 'estúpida', 'todo es tu culpa', 'me provocas',
      'si me dejas me mato', 'chantaje', 'amenaza', 'miedo', 'terror', 'aislamiento',
      'triangulación', 'ley del hielo', 'ignorar', 'silencio', 'no vales nada',
      'gaslighting', 'manipulación', 'manipular', 'controlar', 'obedecer', 'sumisa', 'sumiso',
      'no salgas', 'no hables con', 'no trabajes', 'no estudies', 'te vigilo', 'espío',
      'te lo mereces', 'estás loca', 'estás loco', 'exageras', 'no fue para tanto',
      'lo que dijiste no pasó', 'te lo inventaste', 'nadie te va a creer', 'dependes de mí',
      'sin mí no eres nada', 'te quedarás sola', 'te quedarás solo', 'quién te va a querer',
      'gritar', 'gritarme', 'humillar', 'humillación', 'ridiculizar', 'vergüenza',
      'chantajear', 'amenazar', 'intimidar', 'acoso', 'acosar', 'perseguir', 'stalker',
      'posesivo', 'celoso obsesivo', 'revisar mensajes', 'revisar redes', 'quién te escribe',
      'no te vistas así', 'no hables así', 'cállate', 'callarte', 'no opines',
      'mi mujer', 'mi hombre', 'te pertenezco', 'eres mío', 'eres mía', 'de nadie más',
      // Common manipulative phrases (incl. when partner says them)
      'solo digo la verdad', 'es tu problema', 'no es mi problema', 'si no te gusta',
      'tú te lo buscaste', 'mira lo que me haces hacer', 'no aguantas nada',
      'eres una dramática', 'eres un dramático', 'siempre estás igual',
      'dónde estabas', 'donde estabas', 'a ti qué te importa', 'no es asunto tuyo',
      'qué te importa', 'no tengo que explicarte', 'no te debo explicaciones',

      // Suicide & Self-harm
      'suicidio', 'suicidar', 'morir', 'quitarme la vida', 'cortarme', 'pastillas', 'no quiero vivir',
      'acabar con todo', 'desaparecer', 'autolesión', 'suicidarme', 'acabar conmigo',
      'no merece la pena vivir', 'quiero morirme', 'me quiero morir', 'prefiero estar muerto',
      'prefiero estar muerta', 'tomarme todas las pastillas', 'colgarme', 'ahorcarme',
      'tirarme por la ventana', 'tirarme al tren', 'desaparecer para siempre',
      'nadie me echaría de menos', 'sería mejor si no existiera', 'no quiero seguir',
      'cortes', 'cortarme las venas', 'rasguños', 'autolesionarme', 'hacerme daño yo mismo',
      'overdosis', 'sobredosis', 'envenenarme', 'no quiero despertar', 'dormir y no despertar',

      // Abuse & Coercion
      'abuso sexual', 'violar', 'violación', 'forzar', 'obligar', 'no quería', 'no consentí',
      'tocarme sin permiso', 'abusar de mí', 'maltrato', 'maltratar', 'maltrato psicológico',
      'maltrato verbal', 'insultar', 'insultos', 'vejaciones', 'vejar', 'degradar',
      'coacción', 'coaccionar', 'presión', 'presionar', 'obligarme', 'no me deja ir',
      'me tiene atrapada', 'me tiene atrapado', 'no puedo salir', 'me encierra',
      'me quita el dinero', 'me controla el dinero', 'no me deja trabajar',

      // Relationship toxicity & dangerous phrases
      'te voy a matar', 'te mato', 'te parto la cara', 'te rompo', 'te voy a dar una paliza',
      'te voy a pegar', 'si sales con tus amigos', 'te dejo tirada', 'te dejo tirado',
      'nadie te va a creer', 'la policía no hará nada', 'estás mintiendo', 'mientes',
      'te lo vas a ganar', 'te lo voy a hacer pagar', 'me las pagarás', 'me la pagarás',
      'relación tóxica', 'tóxico', 'tóxica', 'pareja violenta', 'maltratador', 'maltratadora',
      'me tiene miedo', 'le tengo miedo', 'no me atrevo a dejarlo', 'no me atrevo a dejarla',
      'me va a hacer algo', 'me va a buscar', 'no tengo a donde ir', 'me va a quitar a los niños',

      // No dejar salir / control de movilidad y libertad
      'no me deja salir', 'no puedo salir', 'me prohíbe salir', 'me tiene encerrada', 'me tiene encerrado',
      'no quiere que salga', 'no quiere que salga con', 'dice que no puedo salir', 'mi pareja dice que no puedo',
      'que no salga', 'no salga a la calle', 'me ha dicho que no salga', 'que no salga así',
      'voy provocando', 'vas provocando', 'que voy provocando', 'que vas provocando',
      'no me deja salir de casa', 'me obliga a quedarme', 'no puedo ver a mis amigos',
      'no puedo salir con mis amigas', 'no puedo salir con mis amigos', 'no me deja ver a mi familia', 'me prohíbe ver a', 'no puede salir con nadie',
      'solo puede estar conmigo', 'solo puede salir si voy yo', 'tengo que pedir permiso para salir',
      'me controla dónde voy', 'tengo que decirle dónde estoy', 'me pide la ubicación siempre',
      'no me deja ir de fiesta', 'no me deja ir a trabajar', 'no me deja quedar con nadie',
      'se enfada si salgo', 'monta un numerito si salgo', 'me castiga si salgo',
      'no me deja tener vida social', 'me ha alejado de todo el mundo', 'me aisló de',
      'no puedo quedar con mis amigas', 'no puedo quedar con mis amigos', 'me prohíbe ver a mi madre',
      'me prohíbe ver a mi padre', 'no me deja ir al gym', 'no me deja hacer deporte',
      'controla mis horarios', 'tengo que estar en casa a las', 'me pone toque de queda',
      'me encierra en casa', 'me quita las llaves', 'me esconde el móvil para que no salga',
      'no me deja ir a clase', 'no me deja estudiar fuera', 'no me deja viajar',
      'me impide salir', 'me limita', 'no tengo libertad para salir', 'vivo encerrada', 'vivo encerrado',

      // Relación tóxica en general: dependencia, desvalorización, control
      'dependencia emocional', 'no puedo vivir sin él', 'no puedo vivir sin ella',
      'me hace sentir que sin él no soy nadie', 'me hace sentir que sin ella no soy nadie',
      'solo me valora cuando le obedezco', 'solo me quiere cuando hago lo que pide',
      'me critica constantemente', 'nada de lo que hago le parece bien', 'me menosprecia',
      'me compara con otras', 'me compara con otros', 'dice que su ex era mejor',
      'me culpa de todo', 'siempre soy yo el problema', 'siempre soy yo la problema',
      'me hace dudar de todo', 'ya no sé qué es verdad', 'me hace sentir culpable por todo',
      'quiere que le pida perdón por todo', 'tengo que disculparme por cosas que no hice',
      'amor tóxico', 'amor obsesivo', 'obsesión conmigo', 'no me deja respirar',
      'quiere saber todo lo que hago', 'revisa mis cosas', 'registra mis cosas',
      'me quita la llave del coche', 'no me deja usar el coche', 'controla hasta lo que como',
      'me dice con quién puedo hablar', 'me dice qué puedo hacer', 'me trata como un objeto',
      'me trata como su propiedad', 'soy suya', 'soy suyo', 'no tengo vida propia',
      'todo gira en torno a él', 'todo gira en torno a ella', 'he perdido a todos por la relación',
      'relación de poder', 'abuso de poder', 'me domina', 'me somete',
      'no me respeta', 'no respeta mis límites', 'hace lo que quiere conmigo',
      'me ignora cuando no hago lo que quiere', 'me castiga con el silencio',
      'me hace el vacío', 'ley del hielo por días', 'después me pide perdón y vuelve',
      'ciclo de disculpas', 'cambia y vuelve a lo mismo', 'promete que va a cambiar',
      'me tiene cogida', 'me tiene cogido', 'no me suelta', 'no me deja ir',
      'si lo dejo hace algo', 'si la dejo hace algo', 'me amenaza con quitarme',
      'relación enferma', 'relación dañina', 'esta relación me está destruyendo',
      'amigos tóxicos', 'familia tóxica', 'jefe tóxico', 'ambiente tóxico',

      // Ultimátums y manipulación condicional ("si no X, me voy / te dejo / termino")
      'si no hay lentejas me voy', 'si no hay lentejas me voy de casa', 'me voy a ir de casa',
      'me voy de casa si no',
      'si no haces lo que digo me voy', 'si no obedeces me largo', 'o haces lo que digo o me voy',
      'o haces esto o termino', 'o haces esto o me voy', 'si no cambias me voy',
      'me voy si no', 'te dejo si no', 'te dejo si no haces', 'si no lo haces te dejo',
      'si no me complaces me voy', 'si no accedes me voy', 'ultimátum', 'ultimatums',
      'amenaza con irse', 'dice que se va si no', 'dice que me deja si no',
      'condiciona quedarse', 'condiciona su amor', 'amor condicional',
      'si no haces eso me voy', 'si no comes eso me voy', 'si no vienes me voy',
      'me canso y me voy', 'me voy y no vuelvo', 'si no es como yo quiero me voy',
      'o lo haces o nos separamos', 'o cambias o termino', 'o entiendes o me voy',
      'si no entiendes me voy', 'si no piensas como yo me voy', 'o estás conmigo o te vas',
      'manipulando con irse', 'usa que se va para', 'me chantajea con irse',
      'cada vez que no hago lo que quiere dice que se va', 'siempre que discutimos dice que me deja',
      'amenaza con dejarme', 'amenaza con marcharse', 'si no cedes me largo',
      'o te plegas o me voy', 'o aceptas o me voy', 'o cedes o termino',
      'chantaje emocional', 'me chantajea emocionalmente', 'me pone condiciones para quererme',
      'solo me quiere si', 'me quiere solo cuando', 'su cariño depende de que',
      'si no hago X se enfada y dice que se va', 'si no accedo dice que lo dejamos',
      'me da el ultimátum', 'me pone ultimátums', 'todo es o blanco o negro con él',
      'todo es o blanco o negro con ella', 'o todo o nada', 'si no es perfecto se va',

      // English equivalents (for bilingual or mixed input)
      'kill', 'kill myself', 'suicide', 'hurt myself', 'cut myself', 'self-harm', 'abuse',
      'hit me', 'beat me', 'punch', 'slap', 'strangle', 'threaten', 'control', 'manipulate',
      'gaslight', 'worthless', 'useless', 'no one loves you', 'I will kill myself',
      'you make me', 'your fault', 'crazy', 'imagine', 'isolate', 'scared', 'afraid',
      "won't let me go out", "doesn't let me leave", "can't see my friends", "keeps me locked",
      'not allowed to go out', 'controls where I go', 'have to ask permission', 'trapped',
      'toxic relationship', 'emotional abuse', 'never lets me go', 'isolated me from',
      "doesn't let me work", "doesn't let me see my family", 'curfew', 'tracks my location',
      'dependent on him', 'dependent on her', 'belittles me', 'power imbalance',
      "if you don't I'm leaving", "I'll leave if you don't", 'or you do it or I go',
      'gives me an ultimatum', 'threatens to leave', 'emotional blackmail',
      'love conditional', 'only loves me when', 'uses leaving as a threat'
    ];

    const filtered = (messages || []).filter((m) => m && m.text);

    // En modo pareja revisamos también lo que "dice la pareja" (assistant) para detectar toxicidad
    const allTextToScan = (messages || [])
      .filter((m) => m && (m.role === 'user' || (isPartnerMode && m.role === 'assistant')) && m.text)
      .map((m) => (m.text || '').toLowerCase())
      .join(' ');
    const hasSafetyTrigger = [...safetyKeywords, ...instituteSafetyKeywords].some((kw) =>
      allTextToScan.includes(kw.toLowerCase())
    );

    const instituteInstruction = buildInstituteInstruction(
      normalizedSimulatorMode,
      filtered,
      language
    );
    const systemPrompt = buildSystemPrompt(
      normalizedSimulatorMode,
      language,
      instituteInstruction
    );

    const recent = filtered.slice(-6);
    const alreadyGreeted = recent.some((m) => m.role === 'assistant');

    const systemWithGreeting =
      alreadyGreeted
        ? `${systemPrompt}\nNo saludes ni vuelvas a iniciar la conversación.`
        : systemPrompt;

    let response = await generateChatCompletion({
      systemPrompt: systemWithGreeting,
      messages: recent,
      temperature: isPartnerMode ? 0.75 : 0.5,
      topP: 0.9,
      maxTokens: isPartnerMode ? 280 : 512
    });

    // En modo pareja: quitar si la IA repitió el inicio del mensaje del usuario (ej. "Hola. ¿Por qué tardaste en contest...")
    if (isPartnerMode && response) {
      const lastUser = [...recent].reverse().find((m) => m.role === 'user');
      const userText = (lastUser && lastUser.text && lastUser.text.trim()) || '';
      if (userText.length >= 12) {
        const original = response;
        const u = userText.toLowerCase();
        let prefixLen = 0;
        for (let i = 12; i <= Math.min(u.length, response.length); i++) {
          if (u.slice(0, i) === response.toLowerCase().slice(0, i)) prefixLen = i;
        }
        if (prefixLen >= 12 && response.length > prefixLen && response.slice(prefixLen).trim().length >= 3) {
          response = response.slice(prefixLen).trim();
        }
        prefixLen = 0;
        for (let i = 12; i <= Math.min(u.length, response.length); i++) {
          if (u.slice(0, i) === response.toLowerCase().slice(0, i)) prefixLen = i;
        }
        if (prefixLen >= 12 && response.length > prefixLen) {
          response = response.slice(prefixLen).trim();
        }
        if (!response || response.length < 2) response = original;
      }
    }

    const dedupeRepeatedStart = (text) => {
      const cleaned = text.replace(/\s+/g, ' ').trim();
      const parts = cleaned.split(/(?<=[.!?…])\s+/);
      if (parts.length >= 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
        return parts.slice(1).join(' ');
      }
      return cleaned;
    };

    // Quitar "reinicio truncado": cuando la respuesta repite el inicio a mitad (ej. "Uhm, entiendo que eso te Uhm, ent")
    const removeTruncatedRestart = (str) => {
      if (!str || str.length < 18) return str;
      const s = str.replace(/\s+/g, ' ').trim();
      for (let len = 8; len <= Math.min(40, Math.floor(s.length / 2)); len++) {
        const prefix = s.slice(0, len);
        const rest = s.slice(len);
        const idx = rest.indexOf(prefix);
        if (idx !== -1) {
          const cut = s.slice(0, len + idx).trim();
          if (cut.length >= 8) return cut;
        }
      }
      return s;
    };

    response = dedupeRepeatedStart(response);
    response = removeTruncatedRestart(response);

    response = response.replace(/^¡Hola!\s*/i, (match) => {
      return alreadyGreeted ? '' : match;
    }).trim();

    // Quitar del texto del chat cualquier "⚠️ **ALERTA DE SEGURIDAD**..." que haya puesto la IA
    // (la alerta se muestra en el recuadro dedicado con safetyAlert/safetyMessage)
    let didStripAlertText = false;
    if (response && (/⚠️\s*\*\*ALERTA/i.test(response) || /⚠️\s*\*\*ALER/i.test(response))) {
      didStripAlertText = true;
      // Quitar bloque completo desde el primer ⚠️ ALERTA/ALER hasta después de "He detectado..." o todo si está cortado
      response = response.replace(/^⚠️\s*\*\*ALERTA[^*]*\*\*:?\s*(?:He\s+[^.]*\.?)?\s*/i, '').trim();
      response = response.replace(/^⚠️\s*\*\*ALER[^*]*\*\*[^]*/i, '').trim();
      // Si sigue habiendo más ⚠️ ALERTA/ALER (ej. repetido o cortado), quitar también
      response = response.replace(/\s*⚠️\s*\*\*ALERTA[^*]*\*\*:?\s*(?:He\s+[^.]*\.?)?\s*/gi, ' ').trim();
      response = response.replace(/\s*⚠️\s*\*\*ALER[^*]*\*\*[^]*/gi, ' ').trim();
    }
    if (didStripAlertText && (!response || response.length < 10)) {
      response = language === 'en'
        ? 'If you need to talk or support, I\'m here. You can contact 016 or emergency services.'
        : 'Si necesitas hablar o apoyo, aquí estoy. Puedes contactar con el 016 si lo necesitas.';
    }

    // Asegurar que la respuesta termine en frase completa (evitar cortes)
    const endsWithPunctuation = /[.!?…]$/;
    const maxCompletionAttempts = 2;
    for (let attempt = 0; attempt < maxCompletionAttempts && response && !endsWithPunctuation.test(response.trim()); attempt++) {
      let toComplete = response.replace(/\s+[a-zA-ZáéíóúñÁÉÍÓÚÑ]{1,5}$/u, '').trim();
      if (toComplete.length < 8) toComplete = response;
      const fixPrompt =
        language === 'en'
          ? `Finish the previous reply in one complete sentence. Reply with ONLY the continuation, no repetition.`
          : `Termina la respuesta anterior en una sola frase. Responde SOLO con la continuación, sin repetir lo anterior.`;
      const fix = (await generateChatCompletion({
        systemPrompt: fixPrompt,
        messages: [{ role: 'user', text: `Respuesta anterior: ${toComplete}` }],
        temperature: 0.3,
        topP: 0.9,
        maxTokens: 150
      })).replace(/^[.,;]\s*/, '');
      if (fix) {
        response = `${toComplete} ${fix}`.trim();
      } else {
        break;
      }
    }
    // Si aun así no termina en puntuación, añadir punto para que no se vea cortada
    if (response && response.length > 2 && !endsWithPunctuation.test(response.trim())) {
      response = response.trim() + (response.trim().endsWith(',') || response.trim().endsWith(' y') ? '…' : '.');
    }

    // En modo pareja, revisar también lo que acaba de decir la IA (la "pareja") para disparar alerta
    let finalSafetyTrigger = hasSafetyTrigger || didStripAlertText;
    if (isPartnerMode && response) {
      const partnerResponseLower = response.toLowerCase();
      finalSafetyTrigger = finalSafetyTrigger || safetyKeywords.some((kw) =>
        partnerResponseLower.includes(kw.toLowerCase())
      );
    }

    res.json({
      response,
      ...(finalSafetyTrigger && {
        safetyAlert: true,
        safetyMessage: language === 'en'
          ? 'Possible signs of risk have been detected (in your messages or in the partner\'s). If you need help, contact 016 or emergency services.'
          : 'Se han detectado posibles signos de riesgo (en lo que escribes o en lo que dice la pareja). Si necesitas ayuda, contacta con el 016 o con emergencias.'
      })
    });
  } catch (error) {
    console.error('Chat error:', error);

    if (isOllamaConnectionError(error)) {
      return sendError(
        res,
        503,
        `No se puede conectar con Ollama en ${aiConfig.ollamaBaseUrl}. Comprueba VPN/Tailscale, túnel SSH o activa AI_FALLBACK_TO_GEMINI=true.`,
        [{ message: error?.cause?.code || error.message }]
      );
    }

    sendError(res, 500, 'Chat failed', [{ message: error?.message || 'unknown_error' }]);
  }
});

// Descarga de APK para exposición (opcional): copia tu app-debug.apk como server/Iris.apk
const apkPath = path.join(__dirname, 'Iris.apk');
if (fs.existsSync(apkPath)) {
  app.get('/app.apk', (_req, res) => {
    res.download(apkPath, 'Iris.apk', (err) => {
      if (err && !res.headersSent) sendError(res, 500, 'Error al descargar');
    });
  });
}

// Escuchar en todas las interfaces (0.0.0.0) para permitir conexiones desde la red local
app.listen(port, '0.0.0.0', () => {
  console.log(`IRIS server running on http://localhost:${port}`);
  console.log(`Also accessible from network: http://${localIP}:${port}`);
  console.log(`\n📱 Para usar en Android, configura la IP: ${localIP}`);
  if (fs.existsSync(apkPath)) {
    console.log(`\n📲 Descarga de app (QR): http://${localIP}:${port}/app.apk`);
  }
});
