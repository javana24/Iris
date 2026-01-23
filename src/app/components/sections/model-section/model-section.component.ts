import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { ThemeService } from '../../../services/theme.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-model-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-section.component.html',
  styleUrl: './model-section.component.scss'
})
export class ModelSectionComponent implements OnInit, AfterViewInit {
  isDarkMode = false;
  
  @ViewChild('costosChart') costosChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosChart') ingresosChartRef!: ElementRef<HTMLCanvasElement>;
  
  private costosChart?: Chart;
  private ingresosChart?: Chart;

  constructor(
    public translationService: TranslationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.getCurrentTheme().subscribe(theme => {
      this.isDarkMode = theme === 'dark';
      this.updateChartColors();
    });
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    // Chart de Costos
    const costosCtx = this.costosChartRef?.nativeElement.getContext('2d');
    if (costosCtx) {
      this.costosChart = new Chart(costosCtx, {
        type: 'doughnut',
        data: {
          labels: ['Desarrollo App', 'Costes IA', 'Contenido', 'Difusión'],
          datasets: [{
            data: [40, 30, 15, 15],
            backgroundColor: ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Chart de Ingresos
    const ingresosCtx = this.ingresosChartRef?.nativeElement.getContext('2d');
    if (ingresosCtx) {
      this.ingresosChart = new Chart(ingresosCtx, {
        type: 'doughnut',
        data: {
          labels: ['Licencias Institutos', 'Subvenciones', 'Suscripciones'],
          datasets: [{
            data: [60, 30, 10],
            backgroundColor: ['#d97706', '#f59e0b', '#fbbf24']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }

  private updateChartColors(): void {
    const textColor = this.isDarkMode ? '#e5e7eb' : '#262626';
    
    if (this.costosChart) {
      this.costosChart.options.plugins!.legend!.labels!.color = textColor;
      this.costosChart.update();
    }
    
    if (this.ingresosChart) {
      this.ingresosChart.options.plugins!.legend!.labels!.color = textColor;
      this.ingresosChart.update();
    }
  }
}
