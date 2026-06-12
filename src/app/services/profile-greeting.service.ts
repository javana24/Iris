import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'iris.training-profile.v1';
export const PROFILE_UPDATED_EVENT = 'iris.profile.updated';

interface StoredProfile {
  profile?: {
    alias?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileGreetingService {
  private readonly aliasSubject = new BehaviorSubject<string>(this.readAlias());
  readonly alias$ = this.aliasSubject.asObservable();

  constructor(private ngZone: NgZone) {
    window.addEventListener('storage', this.handleExternalUpdate);
    window.addEventListener(PROFILE_UPDATED_EVENT, this.handleExternalUpdate);
  }

  refresh(): void {
    this.aliasSubject.next(this.readAlias());
  }

  private readonly handleExternalUpdate = (): void => {
    this.ngZone.run(() => this.refresh());
  };

  private readAlias(): string {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return '';
      const state = JSON.parse(raw) as StoredProfile;
      const alias = state.profile?.alias?.trim();
      return alias && alias !== 'Invitada IRIS' ? alias : '';
    } catch {
      return '';
    }
  }
}
