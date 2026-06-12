import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatResponse {
  response: string;
  safetyAlert?: boolean;
  safetyMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = API_CONFIG.BASE_URL;
    console.log('[IRIS API] Backend configurado:', this.baseUrl);
  }

  chat(messages: ChatMessagePayload[], language: 'es' | 'en', simulatorMode: 'iris' | 'partner' = 'iris'): Observable<ChatResponse> {
    const url = `${this.baseUrl}/api/chat`;
    console.log('[IRIS API] Enviando petición de chat:', { url, simulatorMode });
    
    return this.http.post<ChatResponse>(url, {
      messages,
      language,
      simulatorMode
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[IRIS API] Error en petición HTTP:');
        console.error('  URL:', url);
        console.error('  Status:', error.status);
        console.error('  Status Text:', error.statusText);
        console.error('  Error:', error.message);
        
        if (error.status === 0) {
          console.error('Error de conexión: el backend IRIS no está accesible.');
          console.error(`Para desarrollo local puedes definir ${API_CONFIG.STORAGE_OVERRIDE_KEY} en localStorage.`);
        }
        
        return throwError(() => error);
      })
    );
  }

  // Método público para obtener la URL actual (útil para debug)
  getCurrentUrl(): string {
    return this.baseUrl;
  }
}
