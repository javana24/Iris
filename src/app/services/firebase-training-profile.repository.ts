import { Injectable } from '@angular/core';
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { BeltId, TrainingProfileState } from '../models/training-profile.model';
import { FirebaseAppService } from './firebase-app.service';
import { FirebaseAuthService } from './firebase-auth.service';

const USERS_COLLECTION = 'usuarios';
const DOJO_MODULES_COLLECTION = 'modulos_dojo';

@Injectable({
  providedIn: 'root'
})
export class FirebaseTrainingProfileRepository {
  constructor(
    private firebaseAppService: FirebaseAppService,
    private firebaseAuthService: FirebaseAuthService
  ) {}

  isAvailable(): boolean {
    return Boolean(
      this.firebaseAppService.getFirestoreInstance() &&
      this.firebaseAuthService.getCurrentUser()
    );
  }

  async loadProfile(): Promise<TrainingProfileState | null> {
    const firestore = this.firebaseAppService.getFirestoreInstance();
    const user = this.firebaseAuthService.getCurrentUser();
    if (!firestore || !user) {
      return null;
    }

    const userRef = doc(firestore, USERS_COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data();
    const dojoSnap = await getDocs(collection(userRef, DOJO_MODULES_COLLECTION));
    const completedBelts = dojoSnap.docs
      .filter((moduleDoc) => moduleDoc.data()['estado'] === 'COMPLETED')
      .map((moduleDoc) => this.toBeltId(moduleDoc.id))
      .filter((belt): belt is BeltId => Boolean(belt));

    return {
      profile: {
        alias: this.readString(data['nombre_perfil'], user.displayName || 'Invitada IRIS'),
        avatarInitials: this.buildInitials(this.readString(data['nombre_perfil'], user.displayName || 'Invitada IRIS')),
        preferredLanguage: 'es',
        notificationsEnabled: false,
        dailyReminder: '20:00'
      },
      progress: {
        totalXp: this.readNumber(data['experiencia_total'], 0),
        level: this.readNumber(data['nivel'], 1),
        rank: this.readString(data['rango'], 'Primer paso'),
        streakDays: this.readNumber(data['racha_actual'], 0),
        calmMinutes: this.readNumber(data['minutos_calma_total'], 12),
        dailyProgressPercent: Math.min(100, completedBelts.length * 25),
        completedBelts,
        currentBeltId: this.getCurrentBeltId(completedBelts),
        lastActivityDate: null
      }
    };
  }

  async saveProfile(state: TrainingProfileState): Promise<void> {
    const firestore = this.firebaseAppService.getFirestoreInstance();
    const user = this.firebaseAuthService.getCurrentUser();
    if (!firestore || !user) {
      return;
    }

    const userRef = doc(firestore, USERS_COLLECTION, user.uid);
    await setDoc(userRef, {
      nombre_perfil: state.profile.alias,
      correo_electronico: user.email ?? '',
      url_foto_perfil: user.photoURL ?? null,
      rango: state.progress.rank,
      experiencia_total: state.progress.totalXp,
      racha_actual: state.progress.streakDays,
      nivel: state.progress.level,
      minutos_calma_total: state.progress.calmMinutes,
      actualizado_en: serverTimestamp()
    }, { merge: true });

    await Promise.all(state.progress.completedBelts.map((beltId, index) => {
      const moduleRef = doc(userRef, DOJO_MODULES_COLLECTION, beltId);
      return setDoc(moduleRef, {
        id_modulo: beltId,
        titulo: this.getBeltTitle(beltId),
        descripcion: this.getBeltDescription(beltId),
        tipo_icono: 'EYE',
        estado: 'COMPLETED',
        orden: index + 1,
        xp_recompensa: this.getBeltXp(beltId),
        completado_en_ms: Date.now(),
        actualizado_en: serverTimestamp()
      }, { merge: true });
    }));
  }

  async deleteProfile(): Promise<void> {
    const firestore = this.firebaseAppService.getFirestoreInstance();
    const user = this.firebaseAuthService.getCurrentUser();
    if (!firestore || !user) {
      return;
    }

    const userRef = doc(firestore, USERS_COLLECTION, user.uid);
    const dojoSnap = await getDocs(collection(userRef, DOJO_MODULES_COLLECTION));

    await Promise.all(dojoSnap.docs.map((moduleDoc) => deleteDoc(moduleDoc.ref)));
    await deleteDoc(userRef);
  }

  private readString(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim() ? value : fallback;
  }

  private readNumber(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  }

  private toBeltId(value: string): BeltId | null {
    return ['white', 'yellow', 'purple', 'black'].includes(value)
      ? value as BeltId
      : null;
  }

  private buildInitials(alias: string): string {
    return alias
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'IR';
  }

  private getCurrentBeltId(completedBelts: BeltId[]): BeltId {
    const order: BeltId[] = ['white', 'yellow', 'purple', 'black'];
    const nextIndex = Math.min(completedBelts.length, order.length - 1);
    return order[nextIndex];
  }

  private getBeltTitle(beltId: BeltId): string {
    const titles: Record<BeltId, string> = {
      white: 'Reconociendo la Manipulación',
      yellow: 'Límites Saludables',
      purple: 'Comunicación Asertiva',
      black: 'Espacio Seguro'
    };
    return titles[beltId];
  }

  private getBeltDescription(beltId: BeltId): string {
    const descriptions: Record<BeltId, string> = {
      white: 'Identifica manipulación, chantaje y maltrato verbal.',
      yellow: 'Practica privacidad, límites y control de ubicación.',
      purple: 'Entrena comunicación asertiva frente al gaslighting.',
      black: 'Refuerza recursos de seguridad y autonomía personal.'
    };
    return descriptions[beltId];
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
}
