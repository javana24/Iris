import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BeltId, TrainingProfileState } from '../models/training-profile.model';

const STORAGE_KEY = 'iris.training-profile.v1';

@Injectable({
  providedIn: 'root'
})
export class TrainingProfileService {
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
      rank: 'Aprendiz de defensa emocional',
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

  getSnapshot(): TrainingProfileState {
    return this.stateSubject.value;
  }

  updateAlias(alias: string): void {
    const cleanAlias = alias.trim().slice(0, 32);
    if (!cleanAlias) return;

    const nextState: TrainingProfileState = {
      ...this.stateSubject.value,
      profile: {
        ...this.stateSubject.value.profile,
        alias: cleanAlias,
        avatarInitials: this.buildInitials(cleanAlias)
      }
    };

    this.persist(nextState);
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
    return Math.max(1, Math.floor(totalXp / 250) + 1);
  }

  private getRank(level: number): string {
    if (level >= 5) return 'Guardiana de límites';
    if (level >= 3) return 'Detectora de patrones';
    return 'Aprendiz de defensa emocional';
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
}
