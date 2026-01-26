import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NavigationItem {
  id: string;
  label: string;
  target: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private activeSection$ = new BehaviorSubject<string>('inicio');

  getActiveSection(): Observable<string> {
    return this.activeSection$.asObservable();
  }

  setActiveSection(section: string): void {
    this.activeSection$.next(section);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      this.setActiveSection(sectionId);
    }
  }

  updateActiveSectionOnScroll(): void {
    const sections = ['inicio', 'problema', 'solucion', 'simuladores', 'alineacion', 'modelo', 'impacto', 'contacto'];
    const scrollPosition = window.pageYOffset + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.setActiveSection(sections[i]);
          break;
        }
      }
    }
  }
}
