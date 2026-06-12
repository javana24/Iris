import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';
import { TrainingProfileService } from '../../../services/training-profile.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';

@Component({
  selector: 'app-user-panel-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel-section.component.html',
  styleUrl: './user-panel-section.component.scss'
})
export class UserPanelSectionComponent implements OnDestroy {
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly trainingProfileService = inject(TrainingProfileService);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  private readonly subscriptions = new Subscription();

  readonly state$ = this.trainingProfileService.state$;
  readonly currentUser$ = this.firebaseAuthService.currentUser$;
  aliasDraft = this.trainingProfileService.getSnapshot().profile.alias;
  authError = '';
  saveMessage = '';
  accountActionMessage = '';
  isSigningOut = false;
  isSendingPasswordReset = false;
  isDeletingAccount = false;
  showDeleteConfirm = false;
  private saveMessageTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.subscriptions.add(
      this.trainingProfileService.state$.subscribe((state) => {
        this.aliasDraft = state.profile.alias;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.saveMessageTimer) {
      clearTimeout(this.saveMessageTimer);
    }
  }

  saveAlias(): void {
    this.trainingProfileService.updateAlias(this.aliasDraft);
    this.showTemporarySaveMessage('Progreso guardado');
  }

  navigateToLandingSection(sectionId: string): void {
    this.router.navigateByUrl('/').then(() => {
      requestAnimationFrame(() => this.navigationService.scrollToSection(sectionId));
    });
  }

  goToAuth(): void {
    this.router.navigateByUrl('/auth');
  }

  async logout(): Promise<void> {
    this.isSigningOut = true;
    this.authError = '';

    try {
      await this.firebaseAuthService.logout();
    } catch (error) {
      this.authError = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isSigningOut = false;
    }
  }

  async sendPasswordReset(): Promise<void> {
    this.isSendingPasswordReset = true;
    this.authError = '';
    this.accountActionMessage = '';

    try {
      await this.firebaseAuthService.sendPasswordResetForCurrentUser();
      this.accountActionMessage = 'Te hemos enviado un correo para cambiar la contraseña.';
    } catch (error) {
      this.authError = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isSendingPasswordReset = false;
    }
  }

  requestAccountDeletion(): void {
    this.showDeleteConfirm = true;
    this.authError = '';
    this.accountActionMessage = '';
  }

  cancelAccountDeletion(): void {
    this.showDeleteConfirm = false;
  }

  async deleteAccount(): Promise<void> {
    this.isDeletingAccount = true;
    this.authError = '';
    this.accountActionMessage = '';

    try {
      await this.trainingProfileService.deleteSavedProfile();
      await this.firebaseAuthService.deleteCurrentAccount();
      this.trainingProfileService.resetLocalProfile();
      await this.router.navigateByUrl('/');
    } catch (error) {
      this.authError = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isDeletingAccount = false;
      this.showDeleteConfirm = false;
    }
  }

  private showTemporarySaveMessage(message: string): void {
    this.saveMessage = message;

    if (this.saveMessageTimer) {
      clearTimeout(this.saveMessageTimer);
    }

    this.saveMessageTimer = setTimeout(() => {
      this.saveMessage = '';
    }, 3200);
  }
}
