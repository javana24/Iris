import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroSectionComponent } from './components/sections/hero-section/hero-section.component';
import { ProblemSectionComponent } from './components/sections/problem-section/problem-section.component';
import { SolutionSectionComponent } from './components/sections/solution-section/solution-section.component';
import { AlignmentSectionComponent } from './components/sections/alignment-section/alignment-section.component';
import { ModelSectionComponent } from './components/sections/model-section/model-section.component';
import { ImpactSectionComponent } from './components/sections/impact-section/impact-section.component';

import { ContactSectionComponent } from './components/sections/contact-section/contact-section.component';
import { ManipulationSectionComponent } from './components/sections/manipulation-section/manipulation-section.component';
import { SimulatorsSectionComponent } from './components/sections/simulators-section/simulators-section.component';
import { ThemeService } from './services/theme.service';
import { QuickExitButtonComponent } from './components/quick-exit-button/quick-exit-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    HeroSectionComponent,
    ProblemSectionComponent,
    SolutionSectionComponent,
    AlignmentSectionComponent,
    ModelSectionComponent,
    ImpactSectionComponent,

    ContactSectionComponent,
    ManipulationSectionComponent,
    SimulatorsSectionComponent,
    QuickExitButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Proyecto IRIS';

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
