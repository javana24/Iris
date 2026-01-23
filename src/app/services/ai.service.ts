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
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // Detectar si está en móvil y usar la IP correcta
    this.baseUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    // Detectar si está en móvil (Capacitor) verificando si window.Capacitor existe
    // o si estamos en un entorno nativo
    const isNative = this.isNativePlatform();
    
    if (isNative) {
      const mobileUrl = API_CONFIG.MOBILE_URL;
      console.log('📱 Modo móvil detectado');
      console.log('📍 URL configurada:', mobileUrl);
      console.log('⚠️ Si no funciona, verifica que la IP en api.config.ts sea correcta');
      return mobileUrl;
    }
    
    // Si está en web, usa localhost
    console.log('🌐 Modo web detectado, usando:', API_CONFIG.WEB_URL);
    return API_CONFIG.WEB_URL;
  }

  private isNativePlatform(): boolean {
    // Verificar si Capacitor está disponible
    if (typeof window !== 'undefined') {
      // @ts-ignore - Capacitor puede no estar disponible en web
      const capacitor = (window as any).Capacitor;
      if (capacitor && capacitor.isNativePlatform) {
        const isNative = capacitor.isNativePlatform();
        console.log('🔍 Capacitor detectado, isNativePlatform:', isNative);
        return isNative;
      }
    }
    
    // Verificar user agent como fallback
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
      console.log('🔍 User Agent detectado:', ua.substring(0, 50) + '...', 'isMobile:', isMobile);
      return isMobile;
    }
    
    return false;
  }

  chat(messages: ChatMessagePayload[], language: 'es' | 'en'): Observable<ChatResponse> {
    const url = `${this.baseUrl}/api/chat`;
    console.log('🚀 Enviando petición a:', url);
    
    return this.http.post<ChatResponse>(url, {
      messages,
      language
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en petición HTTP:');
        console.error('  URL:', url);
        console.error('  Status:', error.status);
        console.error('  Status Text:', error.statusText);
        console.error('  Error:', error.message);
        
        if (error.status === 0) {
          console.error('⚠️ Error de conexión - El servidor no está accesible');
          console.error('   Verifica:');
          console.error('   1. Que el servidor esté corriendo (node server.js)');
          console.error('   2. Que la IP en api.config.ts sea correcta:', API_CONFIG.LOCAL_IP);
          console.error('   3. Que el móvil y el ordenador estén en la misma red WiFi');
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
