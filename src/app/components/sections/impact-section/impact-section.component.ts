import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { ThemeService } from '../../../services/theme.service';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-impact-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './impact-section.component.html',
  styleUrl: './impact-section.component.scss'
})
export class ImpactSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  isDarkMode = false;
  
  @ViewChild('impactoChart') impactoChartRef!: ElementRef<HTMLCanvasElement>;
  private impactoChart?: Chart;
  private themeSub?: Subscription;

  constructor(
    public translationService: TranslationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.getCurrentTheme().subscribe(theme => {
      this.isDarkMode = theme === 'dark';
      this.updateChartColors();
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
    this.impactoChart?.destroy();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const ctx = this.impactoChartRef?.nativeElement.getContext('2d');
    if (ctx) {
      this.impactoChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.translationService.translate('chart_imp_labels').split(','),
          datasets: [
            { label: this.translationService.translate('chart_imp_datasets').split(',')[0], data: [22, 25, 20, 28], backgroundColor: '#9ca3af' },
            { label: this.translationService.translate('chart_imp_datasets').split(',')[1], data: [24, 78, 72, 81], backgroundColor: '#9333ea' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { 
                callback: (value: any) => value + '%',
                color: this.isDarkMode ? '#e5e7eb' : '#262626'
              },
              grid: { color: '#52525220' }
            },
            x: {
              ticks: { 
                color: this.isDarkMode ? '#e5e7eb' : '#262626'
              },
              grid: { display: false }
            }
          }
        }
      });
    }
  }

  private updateChartColors(): void {
    const textColor = this.isDarkMode ? '#e5e7eb' : '#262626';
    
    if (this.impactoChart) {
      this.impactoChart.options.plugins!.legend!.labels!.color = textColor;
      if (this.impactoChart.options.scales) {
        this.impactoChart.options.scales['y']!.ticks!.color = textColor;
        this.impactoChart.options.scales['x']!.ticks!.color = textColor;
      }
      this.impactoChart.update();
    }
  }
}
