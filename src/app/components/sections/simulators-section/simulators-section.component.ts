import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../services/translation.service';
import { ThemeService } from '../../../services/theme.service';
import { ChatSimulatorComponent } from '../chat-simulator/chat-simulator.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-simulators-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatSimulatorComponent],
  templateUrl: './simulators-section.component.html',
  styleUrl: './simulators-section.component.scss'
})
export class SimulatorsSectionComponent implements OnInit, OnDestroy {
  selectedSimulator: 'iris' | 'partner' = 'iris';
  currentTime = '';
  currentLevel = 1;
  hasDetectedRisk = false;
  isDarkMode = false;
  private timeInterval?: ReturnType<typeof setInterval>;
  private themeSub?: Subscription;

  constructor(
    public translationService: TranslationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);
    this.themeSub = this.themeService.getCurrentTheme().subscribe(t => {
      this.isDarkMode = t === 'dark';
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) clearInterval(this.timeInterval);
    this.themeSub?.unsubscribe();
  }

  private updateTime(): void {
    const d = new Date();
    const lang = this.translationService.getCurrentLanguageValue();
    const locale = lang === 'en' ? 'en-US' : 'es-ES';
    this.currentTime = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  onSafetyAlert(): void {
    this.hasDetectedRisk = true;
  }

  selectSimulator(mode: 'iris' | 'partner'): void {
    this.selectedSimulator = mode;
  }
}
