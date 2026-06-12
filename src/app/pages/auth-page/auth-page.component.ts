import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { TrainingProfileService } from '../../services/training-profile.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent implements OnInit {
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  private readonly trainingProfileService = inject(TrainingProfileService);
  private readonly router = inject(Router);

  readonly isFirebaseAvailable = this.firebaseAuthService.isAvailable();

  mode: AuthMode = 'login';
  displayName = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.handleGoogleRedirect();
  }

  setMode(mode: AuthMode): void {
    this.mode = mode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  async submit(): Promise<void> {
    if (this.mode === 'register') {
      await this.register();
      return;
    }

    await this.login();
  }

  async login(): Promise<void> {
    if (!this.validateEmailPassword()) {
      return;
    }

    await this.runAuthAction(async () => {
      await this.firebaseAuthService.loginWithEmail({
        email: this.email,
        password: this.password
      });
    });
  }

  async register(): Promise<void> {
    if (!this.displayName.trim()) {
      this.errorMessage = 'Introduce un nombre visible.';
      return;
    }

    if (!this.validateEmailPassword()) {
      return;
    }

    await this.runAuthAction(async () => {
      await this.firebaseAuthService.registerWithEmail({
        displayName: this.displayName,
        email: this.email,
        password: this.password
      });
      this.trainingProfileService.setAliasFromAccount(this.displayName);
    });
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const user = await this.firebaseAuthService.loginWithGoogle();
      if (!user) {
        return;
      }

      const displayName = user?.displayName?.trim();
      if (displayName) {
        this.trainingProfileService.setAliasFromAccount(displayName);
      }

      await this.trainingProfileService.syncCurrentStateToFirebase();
      await this.router.navigateByUrl('/perfil');
    } catch (error) {
      this.errorMessage = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword(): Promise<void> {
    const cleanEmail = this.email.trim();
    if (!this.isValidEmail(cleanEmail)) {
      this.errorMessage = 'Escribe tu correo para enviarte el enlace de recuperación.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.firebaseAuthService.resetPassword(cleanEmail);
      this.successMessage = 'Te hemos enviado un correo para restablecer la contraseña.';
    } catch (error) {
      this.errorMessage = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async runAuthAction(action: () => Promise<void>): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await action();
      await this.trainingProfileService.syncCurrentStateToFirebase();
      await this.router.navigateByUrl('/perfil');
    } catch (error) {
      this.errorMessage = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleGoogleRedirect(): Promise<void> {
    this.isLoading = true;

    try {
      const user = await this.firebaseAuthService.getGoogleRedirectUser();
      if (!user) {
        return;
      }

      const displayName = user.displayName?.trim();
      if (displayName) {
        this.trainingProfileService.setAliasFromAccount(displayName);
      }

      await this.trainingProfileService.syncCurrentStateToFirebase();
      await this.router.navigateByUrl('/perfil');
    } catch (error) {
      this.errorMessage = this.firebaseAuthService.toUserMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateEmailPassword(): boolean {
    if (!this.isValidEmail(this.email.trim())) {
      this.errorMessage = 'Introduce un correo electrónico válido.';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    return true;
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
