import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { NavigationService } from '../../services/navigation.service';
import { ProfileGreetingService } from '../../services/profile-greeting.service';
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
  isMobileMenuOpen = false;
  activeSection = 'inicio';
  readonly greetingAlias$;
  
  private subscriptions = new Subscription();
  private isScrollTicking = false;

  constructor(
    public themeService: ThemeService,
    private navigationService: NavigationService,
    private router: Router,
    private profileGreetingService: ProfileGreetingService
  ) {
    this.greetingAlias$ = this.profileGreetingService.alias$;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.themeService.getCurrentTheme().subscribe(theme => {
        this.isDarkMode = theme === 'dark';
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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateTo(section: string): void {
    this.isMobileMenuOpen = false;

    if (this.router.url.split('?')[0] !== '/') {
      this.router.navigateByUrl('/').then(() => {
        requestAnimationFrame(() => this.navigationService.scrollToSection(section));
      });
      return;
    }

    this.navigationService.scrollToSection(section);
  }

  goToProfile(): void {
    this.isMobileMenuOpen = false;
    this.router.navigateByUrl('/perfil');
  }

  goToAuth(): void {
    this.isMobileMenuOpen = false;
    this.router.navigateByUrl('/auth');
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  isProfileRoute(): boolean {
    return this.router.url.startsWith('/perfil');
  }

  isAuthRoute(): boolean {
    return this.router.url.startsWith('/auth');
  }
}
