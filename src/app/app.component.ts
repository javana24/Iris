import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { QuickExitButtonComponent } from './components/quick-exit-button/quick-exit-button.component';

const QUICK_EXIT_FLAG = 'iris.quick-exit.active';
const EXIT_URL = 'https://www.google.com';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    QuickExitButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Proyecto IRIS';

  private readonly handlePageShow = (): void => {
    this.redirectIfQuickExitIsActive();
  };

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.redirectIfQuickExitIsActive();
    window.addEventListener('pageshow', this.handlePageShow);
    this.themeService.initTheme();
  }

  ngOnDestroy(): void {
    window.removeEventListener('pageshow', this.handlePageShow);
  }

  private redirectIfQuickExitIsActive(): void {
    if (sessionStorage.getItem(QUICK_EXIT_FLAG) === 'true') {
      window.location.replace(EXIT_URL);
    }
  }
}
