import { findLesson, findQuiz, getContinent, getModule, lessons, modules, nextLessonId, nextSubTopic } from "@/lib/curriculum";

const currentLessonIds = new Set([
  ...modules.flatMap((module) => module.lessonIds),
  ...lessons.flatMap((lesson) => lesson.subTopics.map((topic) => topic.id)),
]);

export function currentCompletions(completed: readonly string[]) {
  return completed.filter((id) => currentLessonIds.has(id));
}

export function isSectionComplete(lessonId: string, completed: readonly string[]): boolean {
  if (lessonId === "europe-deserts") return true;
  const lesson = findLesson(lessonId);
  if (!lesson) return false;
  if (completed.includes(lessonId)) return true;
  return lesson.subTopics.every((topic) => completed.includes(topic.id));
}

export function completedSectionCount(moduleId: string, completed: readonly string[]) {
  return getModule(moduleId).lessonIds.filter((id) => isSectionComplete(id, completed)).length;
}

export function levelFromXp(xp: number) {
  return Math.floor(Math.max(0, xp) / 100) + 1;
}

export function xpIntoLevel(xp: number) {
  return Math.max(0, xp) % 100;
}

export function localDateISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftDateISO(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year || 1970, (month || 1) - 1, day || 1);
  date.setDate(date.getDate() + days);
  return localDateISO(date);
}

export function nextStreak(streak: number, lastActiveDate: string | null, today = localDateISO()) {
  if (lastActiveDate === today) {
    return { streak: Math.max(1, streak), lastActiveDate: today };
  }
  if (lastActiveDate === shiftDateISO(today, -1)) {
    return { streak: Math.max(0, streak) + 1, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}

export function isLessonUnlocked(lessonId: string, completed: readonly string[]): boolean {
  if (lessonId === "europe-deserts") return true;
  const lesson = findLesson(lessonId);
  if (!lesson) return false;
  const continent = getContinent(lesson.continentId);
  const index = continent.lessonIds.indexOf(lessonId);
  if (index < 0) return false;
  if (index === 0) return true;
  const previous = continent.lessonIds[index - 1];
  return previous ? isSectionComplete(previous, completed) : false;
}

export function isSubTopicUnlocked(subTopicId: string, completed: readonly string[]) {
  const quiz = findQuiz(subTopicId);
  if (!quiz) return false;
  if (!isLessonUnlocked(quiz.lesson.id, completed)) return false;
  const index = quiz.lesson.subTopics.findIndex((topic) => topic.id === subTopicId);
  if (index <= 0) return index === 0;
  if (completed.includes(quiz.lesson.id)) return true;
  const previous = quiz.lesson.subTopics[index - 1];
  return previous ? completed.includes(previous.id) : false;
}

export function isModuleFinished(moduleId: string, completed: readonly string[]) {
  return getModule(moduleId).lessonIds.every((id) => isSectionComplete(id, completed));
}

export type LessonVisualState = "locked" | "active" | "done";

export function lessonVisualState(lessonId: string, completed: readonly string[]): LessonVisualState {
  if (isSectionComplete(lessonId, completed)) return "done";
  if (!isLessonUnlocked(lessonId, completed)) return "locked";
  return "active";
}

export function lessonContinueHref(quizId: string, passed: boolean, completed: readonly string[]) {
  const quiz = findQuiz(quizId);
  if (!quiz) return "/";
  const sectionHref = `/continent/${quiz.lesson.continentId}/${quiz.lesson.id}`;
  if (!passed) return sectionHref;
  const nextTopic = nextSubTopic(quiz.subTopic.id);
  if (nextTopic) {
    return subTopicVisualState(nextTopic.id, completed) === "active"
      ? `${sectionHref}?focus=${nextTopic.id}`
      : sectionHref;
  }
  const nextSection = nextLessonId(quiz.lesson.id);
  if (nextSection && lessonVisualState(nextSection, completed) === "active") {
    return `/continent/${quiz.lesson.continentId}?focus=${nextSection}`;
  }
  return `/continent/${quiz.lesson.continentId}`;
}

export function subTopicVisualState(subTopicId: string, completed: readonly string[]): LessonVisualState {
  const quiz = findQuiz(subTopicId);
  if (!quiz) return "locked";
  if (completed.includes(subTopicId) || completed.includes(quiz.lesson.id)) return "done";
  if (!isSubTopicUnlocked(subTopicId, completed)) return "locked";
  return "active";
}
