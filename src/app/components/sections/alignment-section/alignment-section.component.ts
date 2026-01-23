import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-alignment-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alignment-section.component.html',
  styleUrl: './alignment-section.component.scss'
})
export class AlignmentSectionComponent {
  constructor(public translationService: TranslationService) {}
}
