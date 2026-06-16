import { environment } from '../../environments/environment';


function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

function getBrowserOverride(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(API_CONFIG.STORAGE_OVERRIDE_KEY);
  } catch {
    return null;
  }
}

export const API_CONFIG = {
  PRODUCTION_URL: 'https://iris-node.vercel.app',
  LOCAL_URL: 'http://localhost:3001',
  STORAGE_OVERRIDE_KEY: 'IRIS_API_BASE_URL',

  get BASE_URL(): string {
    const override = getBrowserOverride();
    if (override?.trim()) {
      return normalizeBaseUrl(override);
    }

    return normalizeBaseUrl(environment.apiBaseUrl || this.PRODUCTION_URL);
  }
};
