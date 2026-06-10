const { GoogleGenerativeAI } = require('@google/generative-ai');

function getAiConfig() {
  const provider = (process.env.AI_PROVIDER || 'ollama').toLowerCase();

  return {
    provider,
    ollamaBaseUrl: (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, ''),
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1',
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro'
  };
}

function getAiConfigError(config = getAiConfig()) {
  if (!['ollama', 'gemini'].includes(config.provider)) {
    return `Invalid AI_PROVIDER: ${config.provider}. Use "ollama" or "gemini".`;
  }

  if (config.provider === 'gemini' && !config.geminiApiKey) {
    return 'Missing GEMINI_API_KEY';
  }

  return null;
}

function isAiConfigured() {
  return getAiConfigError() === null;
}

async function generateOllamaCompletion(config, { systemPrompt, messages, temperature, topP, maxTokens }) {
  const ollamaMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.text
    }))
  ];

  const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.ollamaModel,
      messages: ollamaMessages,
      stream: false,
      options: {
        temperature,
        top_p: topP,
        num_predict: maxTokens
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return (data.message?.content || '').trim();
}

async function generateGeminiCompletion(config, { systemPrompt, messages, temperature, topP, maxTokens }) {
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel });

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.text }]
    }))
  ];

  const result = await model.generateContent({
    contents,
    generationConfig: {
      temperature,
      topP,
      maxOutputTokens: maxTokens
    }
  });

  return (result.response?.text?.() || '').trim();
}

async function generateChatCompletion(options) {
  const config = getAiConfig();
  const configError = getAiConfigError(config);
  if (configError) {
    throw new Error(configError);
  }

  if (config.provider === 'ollama') {
    return generateOllamaCompletion(config, options);
  }

  return generateGeminiCompletion(config, options);
}

async function listAvailableModels() {
  const config = getAiConfig();
  const configError = getAiConfigError(config);
  if (configError) {
    throw new Error(configError);
  }

  if (config.provider === 'ollama') {
    const response = await fetch(`${config.ollamaBaseUrl}/api/tags`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama list models failed (${response.status}): ${text}`);
    }

    const data = await response.json();
    return (data.models || []).map((model) => ({
      name: model.name,
      displayName: model.name,
      size: model.size,
      modifiedAt: model.modified_at
    }));
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${config.geminiApiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();
  return (data.models || []).map((model) => ({
    name: model.name,
    displayName: model.displayName,
    supportedGenerationMethods: model.supportedGenerationMethods
  }));
}

module.exports = {
  getAiConfig,
  getAiConfigError,
  isAiConfigured,
  generateChatCompletion,
  listAvailableModels
};
