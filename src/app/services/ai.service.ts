import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export type SimulatorMode = 'iris' | 'partner';
export type PartnerDifficulty = 'sutil' | 'moderada' | 'intensa';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  text: string;
}

export interface RedFlag {
  tactic: string;
  label: string;
  explanation: string;
}

export interface ChatResponse {
  response: string;
  redFlags?: RedFlag[];
  riskLevel?: 'none' | 'concern' | 'urgent';
  safetyAlert?: boolean;
  safetyMessage?: string;
  provider?: string;
}

export interface AnalysisReport {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  tacticsDetected: { tactic: string; label: string; example: string }[];
  betterResponses: { partnerMessage: string; suggestion: string }[];
}

// El backend prueba primero el Spark y luego Groq: puede tardar algo más de 40 s en el peor caso.
const REQUEST_TIMEOUT_MS = 55000;

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly baseUrl = API_CONFIG.BASE_URL;

  constructor(private http: HttpClient) {}

  chat(
    messages: ChatMessagePayload[],
    language: 'es' | 'en',
    simulatorMode: SimulatorMode = 'iris',
    difficulty: PartnerDifficulty = 'moderada'
  ): Observable<ChatResponse> {
    return this.http
      .post<ChatResponse>(`${this.baseUrl}/api/chat`, { messages, language, simulatorMode, difficulty })
      .pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  analyze(
    messages: ChatMessagePayload[],
    language: 'es' | 'en',
    difficulty: PartnerDifficulty
  ): Observable<AnalysisReport> {
    return this.http
      .post<AnalysisReport>(`${this.baseUrl}/api/analyze`, { messages, language, difficulty })
      .pipe(timeout(REQUEST_TIMEOUT_MS));
  }
}
