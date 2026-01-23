import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-section.component.html',
  styleUrl: './problem-section.component.scss'
})
export class ProblemSectionComponent {
  activeTab = 'usuarios';

  constructor(public translationService: TranslationService) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
