import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlignmentSectionComponent } from '../../components/sections/alignment-section/alignment-section.component';
import { ContactSectionComponent } from '../../components/sections/contact-section/contact-section.component';
import { HeroSectionComponent } from '../../components/sections/hero-section/hero-section.component';
import { ImpactSectionComponent } from '../../components/sections/impact-section/impact-section.component';
import { ManipulationSectionComponent } from '../../components/sections/manipulation-section/manipulation-section.component';
import { ProblemSectionComponent } from '../../components/sections/problem-section/problem-section.component';
import { SimulatorsSectionComponent } from '../../components/sections/simulators-section/simulators-section.component';
import { SolutionSectionComponent } from '../../components/sections/solution-section/solution-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    ProblemSectionComponent,
    SolutionSectionComponent,
    SimulatorsSectionComponent,
    ManipulationSectionComponent,
    AlignmentSectionComponent,
    ImpactSectionComponent,
    ContactSectionComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {}
