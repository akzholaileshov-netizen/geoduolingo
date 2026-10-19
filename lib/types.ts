export type Profile = {
  id: string;
  email: string;
  displayName: string;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  completedLessonIds: string[];
  avatarFlag: string | null;
};

export type AnswerMark = "pending" | "correct" | "wrong";

export type Selection =
  | { type: "pinpoint"; regionId: string }
  | { type: "choice"; optionId: string };

export type CheckResult = {
  correct: boolean;
  distanceKm?: number;
};

export type LessonSession = {
  lessonId: string;
  moduleId: string;
  index: number;
  hearts: number;
  xpEarned: number;
  mistakes: number;
  status: "active" | "passed" | "failed";
  checked: boolean;
  selected: Selection | null;
  lastResult: CheckResult | null;
  answers: AnswerMark[];
  streakBefore: number;
};

export type AuthResult =
  | { ok: true }
  | { ok: false; message: string; needsConfirmation?: boolean };

export const XP_PER_CORRECT = 10;
export const MAX_HEARTS = 5;
