import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BeltId, TrainingProfileState } from '../models/training-profile.model';
import { FirebaseAuthService } from './firebase-auth.service';
import { FirebaseTrainingProfileRepository } from './firebase-training-profile.repository';
import { PROFILE_UPDATED_EVENT } from './profile-greeting.service';

const STORAGE_KEY = 'iris.training-profile.v1';

@Injectable({
  providedIn: 'root'
})
export class TrainingProfileService implements OnDestroy {
  private readonly defaultState: TrainingProfileState = {
    profile: {
      alias: 'Invitada IRIS',
      avatarInitials: 'IR',
      preferredLanguage: 'es',
      notificationsEnabled: false,
      dailyReminder: '20:00'
    },
    progress: {
      totalXp: 0,
      level: 1,
      rank: 'Primer paso',
      streakDays: 0,
      calmMinutes: 12,
      dailyProgressPercent: 0,
      completedBelts: [],
      currentBeltId: 'white',
      lastActivityDate: null
    }
  };

  private stateSubject = new BehaviorSubject<TrainingProfileState>(this.loadState());
  readonly state$ = this.stateSubject.asObservable();
  private readonly subscriptions = new Subscription();
  private hasHydratedFromRemote = false;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private firebaseProfileRepository: FirebaseTrainingProfileRepository
  ) {
    this.subscriptions.add(
      this.firebaseAuthService.currentUser$.subscribe((user) => {
        if (!user) {
          this.hasHydratedFromRemote = false;
          return;
        }

        if (user && !this.hasHydratedFromRemote) {
          this.hasHydratedFromRemote = true;
          this.hydrateFromFirebase();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getSnapshot(): TrainingProfileState {
    return this.stateSubject.value;
  }

  updateAlias(alias: string): void {
    const cleanAlias = alias.trim().slice(0, 32);
    if (!cleanAlias) return;

    this.persist(this.buildStateWithAlias(cleanAlias));
  }

  setAliasFromAccount(alias: string): void {
    const cleanAlias = alias.trim().slice(0, 32);
    if (!cleanAlias) return;

    const nextState = this.buildStateWithAlias(cleanAlias);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    this.stateSubject.next(nextState);
    this.notifyProfileUpdate();
  }

  private buildStateWithAlias(cleanAlias: string): TrainingProfileState {
    const nextState: TrainingProfileState = {
      ...this.stateSubject.value,
      profile: {
        ...this.stateSubject.value.profile,
        alias: cleanAlias,
        avatarInitials: this.buildInitials(cleanAlias)
      }
    };

    return nextState;
  }

  recordDojoCompletion(beltId: BeltId): void {
    const state = this.stateSubject.value;
    if (state.progress.completedBelts.includes(beltId)) {
      return;
    }

    const completedBelts = [...state.progress.completedBelts, beltId];
    const totalXp = state.progress.totalXp + this.getBeltXp(beltId);
    const level = this.calculateLevel(totalXp);
    const nextState: TrainingProfileState = {
      ...state,
      progress: {
        ...state.progress,
        totalXp,
        level,
        rank: this.getRank(level),
        streakDays: this.calculateStreak(state.progress.lastActivityDate),
        calmMinutes: 12 + completedBelts.length * 6,
        dailyProgressPercent: Math.min(100, completedBelts.length * 25),
        completedBelts,
        currentBeltId: this.getNextBeltId(beltId),
        lastActivityDate: this.todayKey()
      }
    };

    this.persist(nextState);
  }

  syncCurrentStateToFirebase(): Promise<void> {
    return this.firebaseProfileRepository.saveProfile(this.stateSubject.value);
  }

  deleteSavedProfile(): Promise<void> {
    return this.firebaseProfileRepository.deleteProfile();
  }

  resetLocalProfile(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.stateSubject.next(this.defaultState);
    this.notifyProfileUpdate();
  }

  private loadState(): TrainingProfileState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.defaultState;
      return this.normalizeState(JSON.parse(raw) as Partial<TrainingProfileState>);
    } catch {
      return this.defaultState;
    }
  }

  private normalizeState(state: Partial<TrainingProfileState>): TrainingProfileState {
    return {
      profile: {
        ...this.defaultState.profile,
        ...state.profile
      },
      progress: {
        ...this.defaultState.progress,
        ...state.progress,
        completedBelts: (state.progress?.completedBelts ?? []).filter((belt): belt is BeltId =>
          ['white', 'yellow', 'purple', 'black'].includes(belt)
        )
      }
    };
  }

  private persist(state: TrainingProfileState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    this.stateSubject.next(state);
    this.notifyProfileUpdate();
    this.firebaseProfileRepository.saveProfile(state).catch((error) => {
      console.error('No se pudo sincronizar el perfil con Firebase:', error);
    });
  }

  private hydrateFromFirebase(): void {
    this.firebaseProfileRepository.loadProfile()
      .then((remoteState) => {
        if (!remoteState) return;
        const normalizedState = this.normalizeState(remoteState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
        this.stateSubject.next(normalizedState);
        this.notifyProfileUpdate();
      })
      .catch((error) => {
        console.error('No se pudo cargar el perfil desde Firebase:', error);
      });
  }

  private buildInitials(alias: string): string {
    return alias
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'IR';
  }

  private getBeltXp(beltId: BeltId): number {
    const xpByBelt: Record<BeltId, number> = {
      white: 120,
      yellow: 180,
      purple: 260,
      black: 400
    };
    return xpByBelt[beltId];
  }

  private calculateLevel(totalXp: number): number {
    if (totalXp <= 0) return 1;
    let level = 1;
    while (level < 500 && this.xpForLevel(level + 1) <= totalXp) {
      level++;
    }
    return level;
  }

  private getRank(level: number): string {
    if (level >= 350) return 'Referente IRIS';
    if (level >= 240) return 'Guía avanzada';
    if (level >= 160) return 'Protección experta';
    if (level >= 100) return 'Confianza alta';
    if (level >= 50) return 'Avance firme';
    if (level >= 25) return 'Buen progreso';
    if (level >= 10) return 'En aprendizaje';
    return 'Primer paso';
  }

  private xpForLevel(level: number): number {
    const safeLevel = Math.min(Math.max(level, 1), 500);
    return Math.floor(120 * Math.pow(safeLevel, 1.35));
  }

  private getNextBeltId(beltId: BeltId): BeltId {
    const order: BeltId[] = ['white', 'yellow', 'purple', 'black'];
    const index = order.indexOf(beltId);
    return order[Math.min(index + 1, order.length - 1)];
  }

  private calculateStreak(lastActivityDate: string | null): number {
    if (!lastActivityDate) return 1;
    if (lastActivityDate === this.todayKey()) return this.stateSubject.value.progress.streakDays;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = this.formatDateKey(yesterday);

    return lastActivityDate === yesterdayKey
      ? this.stateSubject.value.progress.streakDays + 1
      : 1;
  }

  private todayKey(): string {
    return this.formatDateKey(new Date());
  }

  private formatDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private notifyProfileUpdate(): void {
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }
}
