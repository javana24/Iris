const DEFAULT_TIMEOUT_MS = 12000;

function getProviderConfig() {
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const fallbackProvider = (process.env.LLM_FALLBACK_PROVIDER || 'openai').toLowerCase();
  return { provider, fallbackProvider };
}

function createAbortSignal(timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
}

async function requestJson(url, options = {}) {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const { signal, clear } = createAbortSignal(timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    if (!response.ok) {
      const error = new Error(payload?.error?.message || payload?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  } finally {
    clear();
  }
}

function normalizeMessages(messages = []) {
  return messages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.trim()
    }));
}

class LLMAdapter {
  constructor() {
    const { provider, fallbackProvider } = getProviderConfig();
    this.provider = provider;
    this.fallbackProvider = fallbackProvider;
  }

  getActiveProviders() {
    return [this.provider, this.fallbackProvider].filter((value, index, self) => self.indexOf(value) === index);
  }

  hasProviderApiKey(name) {
    if (name === 'gemini') return Boolean(process.env.GEMINI_API_KEY);
    if (name === 'openai') return Boolean(process.env.OPENAI_API_KEY);
    if (name === 'deepseek') return Boolean(process.env.DEEPSEEK_API_KEY);
    return false;
  }

  hasAnyConfiguredProvider() {
    return this.getActiveProviders().some((provider) => this.hasProviderApiKey(provider));
  }

  async generate(params) {
    const providers = this.getActiveProviders();
    let lastError;

    for (const provider of providers) {
      if (!this.hasProviderApiKey(provider)) continue;
      try {
        return await this.generateWithProvider(provider, params);
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError) throw lastError;
    throw new Error('No LLM provider configured. Set GEMINI_API_KEY, DEEPSEEK_API_KEY or OPENAI_API_KEY.');
  }

  async generateWithProvider(provider, params) {
    if (provider === 'gemini') return this.generateGemini(params);
    if (provider === 'deepseek') return this.generateOpenAICompatible('deepseek', params);
    if (provider === 'openai') return this.generateOpenAICompatible('openai', params);
    throw new Error(`Unsupported provider: ${provider}`);
  }

  async generateGemini({
    systemPrompt,
    messages,
    temperature = 0.5,
    topP = 0.9,
    maxOutputTokens = 512
  }) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const userMessages = normalizeMessages(messages);
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt || '' }] },
      ...userMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const payload = await requestJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature,
          topP,
          maxOutputTokens
        }
      }),
      timeoutMs: Number(process.env.LLM_TIMEOUT_MS || DEFAULT_TIMEOUT_MS)
    });

    const candidate = payload?.candidates?.[0];
    const text = candidate?.content?.parts?.map((part) => part.text || '').join('').trim() || '';
    const usage = payload?.usageMetadata || {};

    return {
      provider: 'gemini',
      model,
      text,
      usage: {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0
      }
    };
  }

  async generateOpenAICompatible(kind, {
    systemPrompt,
    messages,
    temperature = 0.5,
    maxOutputTokens = 512
  }) {
    const isDeepSeek = kind === 'deepseek';
    const apiKey = isDeepSeek ? process.env.DEEPSEEK_API_KEY : process.env.OPENAI_API_KEY;
    const model = isDeepSeek
      ? (process.env.DEEPSEEK_MODEL || 'deepseek-chat')
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
    const baseUrl = isDeepSeek
      ? (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com')
      : (process.env.OPENAI_BASE_URL || 'https://api.openai.com');
    const url = `${baseUrl}/v1/chat/completions`;

    const payload = await requestJson(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxOutputTokens,
        messages: [
          { role: 'system', content: systemPrompt || '' },
          ...normalizeMessages(messages)
        ]
      }),
      timeoutMs: Number(process.env.LLM_TIMEOUT_MS || DEFAULT_TIMEOUT_MS)
    });

    const choice = payload?.choices?.[0];
    const usage = payload?.usage || {};

    return {
      provider: kind,
      model,
      text: choice?.message?.content?.trim() || '',
      usage: {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0
      }
    };
  }
}

module.exports = {
  LLMAdapter
};
