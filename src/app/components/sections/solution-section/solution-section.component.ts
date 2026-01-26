import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-solution-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-section.component.html',
  styleUrl: './solution-section.component.scss'
})
export class SolutionSectionComponent {
  constructor(public translationService: TranslationService) {}
}
