export type BeltId = 'white' | 'yellow' | 'purple' | 'black';

export interface UserProfile {
  alias: string;
  avatarInitials: string;
  preferredLanguage: 'es' | 'en';
  notificationsEnabled: boolean;
  dailyReminder: string;
}

export interface TrainingProgress {
  totalXp: number;
  level: number;
  rank: string;
  streakDays: number;
  calmMinutes: number;
  dailyProgressPercent: number;
  completedBelts: BeltId[];
  currentBeltId: BeltId;
  lastActivityDate: string | null;
}

export interface TrainingProfileState {
  profile: UserProfile;
  progress: TrainingProgress;
}
