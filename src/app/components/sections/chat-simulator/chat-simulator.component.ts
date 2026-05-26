import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../services/translation.service';
import { AiService } from '../../../services/ai.service';

type ChatRole = 'user' | 'assistant';

export interface SimulatorChatMessage {
  role: ChatRole;
  text: string;
  timestamp: string;
  isSafetyAlert?: boolean;
}

@Component({
  selector: 'app-chat-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-simulator.component.html',
  styleUrl: './chat-simulator.component.scss'
})
export class ChatSimulatorComponent {
  @Input() mode: 'iris' | 'partner' = 'iris';
  @Output() safetyAlertTriggered = new EventEmitter<void>();
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  inputText = '';
  messages: SimulatorChatMessage[] = [];
  isLoading = false;
  errorMessage = '';
  private shouldAutoScroll = false;

  constructor(
    public translationService: TranslationService,
    private aiService: AiService
  ) {}

  get otherRoleLabel(): string {
    return this.mode === 'partner'
      ? this.translationService.translate('sim_partner_role')
      : this.translationService.translate('chat_role_ai');
  }

  get emptyHintKey(): string {
    return this.mode === 'partner' ? 'sim_empty_partner' : 'sim_empty_iris';
  }

  get loadingKey(): string {
    return this.mode === 'partner' ? 'ai_loading_partner' : 'ai_loading';
  }

  private buildTimestamp(): string {
    const lang = this.translationService.getCurrentLanguageValue();
    const locale = lang === 'en' ? 'en-US' : 'es-ES';
    return new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    const userMsg: SimulatorChatMessage = {
      role: 'user',
      text,
      timestamp: this.buildTimestamp()
    };
    this.messages = [...this.messages, userMsg];
    this.shouldAutoScroll = true;
    this.scrollToBottom();
    this.inputText = '';
    this.errorMessage = '';
    this.isLoading = true;

    const payload = this.messages
      .filter((m) => !m.isSafetyAlert)
      .map((m) => ({ role: m.role, text: m.text }));

    const lang = this.translationService.getCurrentLanguageValue();
    this.aiService.chat(payload, lang, this.mode).subscribe({
      next: (res) => {
        const responseText = res.response?.trim() || this.translationService.translate('ai_response_fallback');
        const response: SimulatorChatMessage = {
          role: 'assistant',
          text: responseText,
          timestamp: this.buildTimestamp()
        };
        this.messages = [...this.messages, response];
        this.shouldAutoScroll = true;
        if (res.safetyAlert) {
          const safetyMsg = res.safetyMessage || this.translationService.translate('safety_alert_message');
          this.messages = [...this.messages, {
            role: 'assistant',
            text: safetyMsg,
            timestamp: this.buildTimestamp(),
            isSafetyAlert: true
          }];
          this.shouldAutoScroll = true;
          this.safetyAlertTriggered.emit();
        }
        this.errorMessage = '';
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('ChatSimulator error:', err);
        this.errorMessage = this.resolveErrorMessage(err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  clearChat(): void {
    this.messages = [];
    this.inputText = '';
    this.errorMessage = '';
  }

  private resolveErrorMessage(error: unknown): string {
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status?: unknown }).status)
      : 0;

    if (status === 503) {
      return this.translationService.translate('ai_configuration_error');
    }

    return this.translationService.translate('ai_response_error');
  }

  private scrollToBottom(): void {
    if (!this.shouldAutoScroll || !this.messagesContainer?.nativeElement) {
      return;
    }

    queueMicrotask(() => {
      const container = this.messagesContainer?.nativeElement;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
      this.shouldAutoScroll = false;
    });
  }
}
