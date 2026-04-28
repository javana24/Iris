import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-model-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-section.component.html',
  styleUrl: './model-section.component.scss'
})
export class ModelSectionComponent {
  constructor(public translationService: TranslationService) {}
}
