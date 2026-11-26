import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../services/translation.service';
import {
  AiService,
  AnalysisReport,
  ChatMessagePayload,
  PartnerDifficulty,
  RedFlag,
  SimulatorMode
} from '../../../services/ai.service';

type ChatRole = 'user' | 'assistant';

export interface SimulatorChatMessage {
  role: ChatRole;
  text: string;
  timestamp: string;
  isSafetyAlert?: boolean;
  /** Aviso suave (nivel "preocupación"): señales de control que conviene vigilar. */
  isConcernNotice?: boolean;
  redFlags?: RedFlag[];
}

const MIN_USER_MESSAGES_FOR_ANALYSIS = 2;

@Component({
  selector: 'app-chat-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-simulator.component.html',
  styleUrl: './chat-simulator.component.scss'
})
export class ChatSimulatorComponent implements OnInit, OnDestroy {
  @Input() mode: SimulatorMode = 'iris';
  @Output() safetyAlertTriggered = new EventEmitter<void>();
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  readonly difficulties: { value: PartnerDifficulty; labelKey: string; descKey: string }[] = [
    { value: 'sutil', labelKey: 'sim_difficulty_sutil', descKey: 'sim_difficulty_sutil_desc' },
    { value: 'moderada', labelKey: 'sim_difficulty_moderada', descKey: 'sim_difficulty_moderada_desc' },
    { value: 'intensa', labelKey: 'sim_difficulty_intensa', descKey: 'sim_difficulty_intensa_desc' }
  ];

  inputText = '';
  messages: SimulatorChatMessage[] = [];
  isLoading = false;
  errorMessage = '';
  difficulty: PartnerDifficulty = 'moderada';

  isAnalyzing = false;
  analysis: AnalysisReport | null = null;
  analysisError = '';

  private chatSub?: Subscription;
  private analysisSub?: Subscription;
  private shouldAutoScroll = false;

  constructor(
    public translationService: TranslationService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.resetConversation();
  }

  ngOnDestroy(): void {
    this.chatSub?.unsubscribe();
    this.analysisSub?.unsubscribe();
  }

  get isPartner(): boolean {
    return this.mode === 'partner';
  }

  get otherRoleLabel(): string {
    return this.isPartner
      ? this.translationService.translate('sim_partner_name')
      : this.translationService.translate('sim_counselor_role');
  }

  get emptyHintKey(): string {
    return this.isPartner ? 'sim_partner_intro' : 'sim_empty_iris';
  }

  get loadingKey(): string {
    return this.isPartner ? 'ai_loading_partner' : 'ai_loading';
  }

  get userMessageCount(): number {
    return this.messages.filter((m) => m.role === 'user' && !m.isSafetyAlert && !m.isConcernNotice).length;
  }

  get canAnalyze(): boolean {
    return this.isPartner && !this.isLoading && !this.isAnalyzing && this.userMessageCount >= MIN_USER_MESSAGES_FOR_ANALYSIS;
  }

  get scoreColor(): string {
    const score = this.analysis?.score ?? 0;
    if (score >= 75) return 'text-emerald-400';
    if (score >= 45) return 'text-amber-300';
    return 'text-[#F1A6A6]';
  }

  setDifficulty(value: PartnerDifficulty): void {
    if (this.difficulty === value) return;
    this.difficulty = value;
    this.resetConversation();
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    this.messages = [...this.messages, { role: 'user', text, timestamp: this.buildTimestamp() }];
    this.inputText = '';
    this.errorMessage = '';
    this.isLoading = true;
    this.requestScroll();

    const lang = this.translationService.getCurrentLanguageValue();
    this.chatSub = this.aiService.chat(this.buildPayload(), lang, this.mode, this.difficulty).subscribe({
      next: (res) => {
        const responseText = res.response?.trim() || this.translationService.translate('ai_response_fallback');
        const reply: SimulatorChatMessage = {
          role: 'assistant',
          text: responseText,
          timestamp: this.buildTimestamp(),
          redFlags: this.isPartner ? res.redFlags ?? [] : []
        };
        this.messages = [...this.messages, reply];

        if (res.safetyAlert) {
          this.messages = [
            ...this.messages,
            {
              role: 'assistant',
              text: res.safetyMessage || this.translationService.translate('safety_alert_message'),
              timestamp: this.buildTimestamp(),
              isSafetyAlert: true
            }
          ];
          this.safetyAlertTriggered.emit();
        } else if (!this.isPartner && res.riskLevel === 'concern' && !this.messages.some((m) => m.isConcernNotice)) {
          // Señales de control: aviso suave con recursos, una vez por conversación para no saturar.
          this.messages = [
            ...this.messages,
            {
              role: 'assistant',
              text: this.translationService.translate('concern_notice_message'),
              timestamp: this.buildTimestamp(),
              isConcernNotice: true
            }
          ];
        }

        this.isLoading = false;
        this.requestScroll();
      },
      error: (err) => {
        console.error('ChatSimulator error:', err);
        this.errorMessage = this.resolveErrorMessage(err);
        this.isLoading = false;
      }
    });
  }

  analyzeConversation(): void {
    if (!this.canAnalyze) return;

    this.isAnalyzing = true;
    this.analysisError = '';
    const lang = this.translationService.getCurrentLanguageValue();
    this.analysisSub = this.aiService.analyze(this.buildPayload(), lang, this.difficulty).subscribe({
      next: (report) => {
        this.analysis = report;
        this.isAnalyzing = false;
      },
      error: (err) => {
        console.error('Analysis error:', err);
        this.analysisError = this.resolveErrorMessage(err);
        this.isAnalyzing = false;
      }
    });
  }

  closeAnalysis(): void {
    this.analysis = null;
  }

  clearChat(): void {
    this.resetConversation();
  }

  private resetConversation(): void {
    this.chatSub?.unsubscribe();
    this.analysisSub?.unsubscribe();
    this.isLoading = false;
    this.isAnalyzing = false;
    this.analysis = null;
    this.analysisError = '';
    this.inputText = '';
    this.errorMessage = '';
    // En el simulador la pareja abre la conversación; ese mensaje se envía al modelo como su primer turno.
    this.messages = this.isPartner
      ? [{ role: 'assistant', text: this.translationService.translate(`sim_partner_opening_${this.difficulty}`), timestamp: this.buildTimestamp() }]
      : [];
  }

  private buildPayload(): ChatMessagePayload[] {
    return this.messages.filter((m) => !m.isSafetyAlert && !m.isConcernNotice).map((m) => ({ role: m.role, text: m.text }));
  }

  private buildTimestamp(): string {
    const lang = this.translationService.getCurrentLanguageValue();
    return new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  private resolveErrorMessage(error: unknown): string {
    const status =
      typeof error === 'object' && error !== null && 'status' in error ? Number((error as { status?: unknown }).status) : 0;
    const isTimeout = typeof error === 'object' && error !== null && (error as { name?: string }).name === 'TimeoutError';

    if (status === 429) {
      return this.translationService.translate('ai_rate_limited');
    }
    if (status === 503 || status === 0 || isTimeout) {
      return this.translationService.translate('ai_configuration_error');
    }
    return this.translationService.translate('ai_response_error');
  }

  private requestScroll(): void {
    this.shouldAutoScroll = true;
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;
      if (!this.shouldAutoScroll || !container) return;
      container.scrollTop = container.scrollHeight;
      this.shouldAutoScroll = false;
    });
  }
}
