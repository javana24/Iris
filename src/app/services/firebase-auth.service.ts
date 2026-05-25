import { Injectable, OnDestroy } from '@angular/core';
import { User, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseAppService } from './firebase-app.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService implements OnDestroy {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly unsubscribeAuth?: () => void;

  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private firebaseAppService: FirebaseAppService) {
    const auth = this.firebaseAppService.getAuthInstance();
    if (!auth) {
      return;
    }

    this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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
}
