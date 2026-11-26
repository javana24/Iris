import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Sección de impacto: reconocimientos reales y qué se medirá en el piloto.
// No muestra cifras de resultados hasta que existan datos medidos.
@Component({
  selector: 'app-impact-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './impact-section.component.html',
  styleUrl: './impact-section.component.scss'
})
export class ImpactSectionComponent {}
