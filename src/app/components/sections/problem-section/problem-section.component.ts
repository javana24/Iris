import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-section.component.html',
  styleUrl: './problem-section.component.scss'
})
export class ProblemSectionComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private sub?: Subscription;

  problems: Array<{ icon: string; titleKey: string; descKey: string; hoverBorderClass: string }> = [
    { icon: '🔴', titleKey: 'problem_card_1_title', descKey: 'problem_card_1_desc', hoverBorderClass: 'hover:border-red-500' },
    { icon: '🟠', titleKey: 'problem_card_2_title', descKey: 'problem_card_2_desc', hoverBorderClass: 'hover:border-amber-500' },
    { icon: '🩷', titleKey: 'problem_card_3_title', descKey: 'problem_card_3_desc', hoverBorderClass: 'hover:border-pink-500' }
  ];

  examples: Array<{ typeKey: string; quoteKey: string; whyKey: string }> = [
    { typeKey: 'problem_example_1_type', quoteKey: 'problem_example_1_quote', whyKey: 'problem_example_1_why' },
    { typeKey: 'problem_example_2_type', quoteKey: 'problem_example_2_quote', whyKey: 'problem_example_2_why' }
  ];

  constructor(
    public translationService: TranslationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.sub = this.themeService.getCurrentTheme().subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
