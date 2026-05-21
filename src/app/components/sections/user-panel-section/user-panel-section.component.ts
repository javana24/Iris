import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { TrainingProfileService } from '../../../services/training-profile.service';

@Component({
  selector: 'app-user-panel-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel-section.component.html',
  styleUrl: './user-panel-section.component.scss'
})
export class UserPanelSectionComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly trainingProfileService = inject(TrainingProfileService);

  readonly state$ = this.trainingProfileService.state$;
  aliasDraft = this.trainingProfileService.getSnapshot().profile.alias;

  saveAlias(): void {
    this.trainingProfileService.updateAlias(this.aliasDraft);
  }

  navigateToLandingSection(sectionId: string): void {
    this.router.navigateByUrl('/').then(() => {
      requestAnimationFrame(() => this.navigationService.scrollToSection(sectionId));
    });
  }
}
