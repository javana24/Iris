import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  AuthError,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseAppService } from './firebase-app.service';

export interface RegisterCredentials {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService implements OnDestroy {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly unsubscribeAuth?: () => void;
  private readonly auth: Auth | null;

  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private firebaseAppService: FirebaseAppService) {
    this.auth = this.firebaseAppService.getAuthInstance();
    if (!this.auth) {
      return;
    }

    this.unsubscribeAuth = onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAuth?.();
  }

  isAvailable(): boolean {
    return this.firebaseAppService.isConfigured();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async loginWithEmail({ email, password }: LoginCredentials): Promise<User> {
    const auth = this.requireAuth();
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  }

  async registerWithEmail({ displayName, email, password }: RegisterCredentials): Promise<User> {
    const auth = this.requireAuth();
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const cleanDisplayName = displayName.trim();

    if (cleanDisplayName) {
      await updateProfile(credential.user, { displayName: cleanDisplayName });
      this.currentUserSubject.next(auth.currentUser);
    }

    return auth.currentUser ?? credential.user;
  }

  async loginWithGoogle(): Promise<User | null> {
    const auth = this.requireAuth();
    const provider = this.createGoogleProvider();

    try {
      const credential = await signInWithPopup(auth, provider);
      return credential.user;
    } catch (error) {
      if (this.shouldFallbackToRedirect(error)) {
        await signInWithRedirect(auth, provider);
        return null;
      }

      throw error;
    }
  }

  async getGoogleRedirectUser(): Promise<User | null> {
    const auth = this.requireAuth();
    const credential = await getRedirectResult(auth);
    return credential?.user ?? null;
  }

  async resetPassword(email: string): Promise<void> {
    const auth = this.requireAuth();
    await sendPasswordResetEmail(auth, email.trim());
  }

  async sendPasswordResetForCurrentUser(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user?.email) {
      throw new Error('No hay correo asociado a esta cuenta.');
    }

    await this.resetPassword(user.email);
  }

  async deleteCurrentAccount(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No hay una sesión activa.');
    }

    await deleteUser(user);
    this.currentUserSubject.next(null);
  }

  async logout(): Promise<void> {
    const auth = this.requireAuth();
    await signOut(auth);
  }

  toUserMessage(error: unknown): string {
    const code = (error as AuthError | undefined)?.code;

    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con ese correo.';
      case 'auth/invalid-email':
        return 'Introduce un correo electrónico válido.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo o contraseña incorrectos.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return '';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/network-request-failed':
        return 'No se pudo conectar. Revisa tu conexión.';
      case 'auth/operation-not-allowed':
        return 'El acceso con Google no está activado todavía.';
      case 'auth/unauthorized-domain':
        return 'Este dominio todavía no está autorizado para iniciar sesión.';
      case 'auth/popup-blocked':
        return 'El navegador ha bloqueado la ventana de acceso. Inténtalo de nuevo.';
      case 'auth/requires-recent-login':
        return 'Por seguridad, cierra sesión, vuelve a entrar y repite la acción.';
      default:
        if (error instanceof Error && error.message === 'Firebase Auth no está configurado.') {
          return 'El acceso con cuenta no está disponible ahora mismo.';
        }

        if (error instanceof Error && error.message) {
          return error.message;
        }
        return 'No se pudo completar la autenticación. Inténtalo de nuevo.';
    }
  }

  private createGoogleProvider(): GoogleAuthProvider {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
  }

  private shouldFallbackToRedirect(error: unknown): boolean {
    const code = (error as AuthError | undefined)?.code;
    return code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user';
  }

  private requireAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase Auth no está configurado.');
    }

    return this.auth;
  }
}
