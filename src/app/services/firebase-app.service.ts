import { Injectable } from '@angular/core';
import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAppService {
  private app: FirebaseApp | null = null;

  isConfigured(): boolean {
    const config = environment.firebase as FirebaseOptions;
    return Boolean(
      config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId
    );
  }

  getAppInstance(): FirebaseApp | null {
    if (!this.isConfigured()) {
      return null;
    }

    if (this.app) {
      return this.app;
    }

    this.app = getApps().length > 0
      ? getApp()
      : initializeApp(environment.firebase as FirebaseOptions);

    return this.app;
  }

  getAuthInstance(): Auth | null {
    const app = this.getAppInstance();
    return app ? getAuth(app) : null;
  }

  getFirestoreInstance(): Firestore | null {
    const app = this.getAppInstance();
    return app ? getFirestore(app) : null;
  }
}
