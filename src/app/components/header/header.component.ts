import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ThemeService } from '../../services/theme.service';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  currentLang = 'es';
  isMobileMenuOpen = false;
  activeSection = 'inicio';
  
  private subscriptions = new Subscription();
  private isScrollTicking = false;

  constructor(
    public translationService: TranslationService,
    public themeService: ThemeService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.themeService.getCurrentTheme().subscribe(theme => {
        this.isDarkMode = theme === 'dark';
      })
    );

    this.subscriptions.add(
      this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLang = lang;
      })
    );

    this.subscriptions.add(
      this.navigationService.getActiveSection().subscribe(section => {
        this.activeSection = section;
      })
    );

    // Update active section on scroll
    this.navigationService.updateActiveSectionOnScroll();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isScrollTicking) return;
    this.isScrollTicking = true;
    requestAnimationFrame(() => {
      this.navigationService.updateActiveSectionOnScroll();
      this.isScrollTicking = false;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translationService.setLanguage(newLang);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateTo(section: string): void {
    this.navigationService.scrollToSection(section);
    this.isMobileMenuOpen = false;
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }
}
