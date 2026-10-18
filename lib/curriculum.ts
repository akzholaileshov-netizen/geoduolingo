import { haversineKm } from "@/lib/geo";

export type PlaceKind = "city" | "capital" | "sea" | "lake" | "river" | "mountain" | "range";

export type Place = {
  id: string;
  nameKk: string;
  accusativeKk: string;
  lat: number;
  lng: number;
  radiusKm: number;
  kind: PlaceKind;
};

export type Module = {
  id: string;
  titleKk: string;
  descriptionKk: string;
  emoji: string;
  center: [number, number];
  zoom: number;
  lessonIds: string[];
};

export type Lesson = {
  id: string;
  moduleId: string;
  titleKk: string;
  order: number;
  placeIds: [string, string, string, string];
};

export type PinpointQuestion = {
  id: string;
  type: "pinpoint";
  placeId: string;
  promptKk: string;
};

export type ChoiceQuestion = {
  id: string;
  type: "identify" | "pick";
  placeId: string;
  promptKk: string;
  optionIds: string[];
};

export type Question = PinpointQuestion | ChoiceQuestion;

export const places: Place[] = [
  { id: "caspian", nameKk: "Каспий теңізі", accusativeKk: "Каспий теңізін", lat: 45.0, lng: 50.7, radiusKm: 270, kind: "sea" },
  { id: "balkhash", nameKk: "Балқаш көлі", accusativeKk: "Балқаш көлін", lat: 46.2, lng: 75.5, radiusKm: 190, kind: "lake" },
  { id: "aral", nameKk: "Арал теңізі", accusativeKk: "Арал теңізін", lat: 46.3, lng: 60.8, radiusKm: 120, kind: "sea" },
  { id: "zaysan", nameKk: "Зайсан көлі", accusativeKk: "Зайсан көлін", lat: 48.0, lng: 83.93, radiusKm: 50, kind: "lake" },
  { id: "ile", nameKk: "Іле өзені", accusativeKk: "Іле өзенін", lat: 43.92, lng: 77.3, radiusKm: 70, kind: "river" },
  { id: "irtysh", nameKk: "Ертіс өзені", accusativeKk: "Ертіс өзенін", lat: 51.15, lng: 78.9, radiusKm: 220, kind: "river" },
  { id: "shu", nameKk: "Шу өзені", accusativeKk: "Шу өзенін", lat: 43.6, lng: 73.76, radiusKm: 80, kind: "river" },
  { id: "zhaiyk", nameKk: "Жайық өзені", accusativeKk: "Жайық өзенін", lat: 51.23, lng: 51.37, radiusKm: 100, kind: "river" },
  { id: "altai", nameKk: "Алтай таулары", accusativeKk: "Алтай тауларын", lat: 49.81, lng: 86.58, radiusKm: 100, kind: "range" },
  { id: "tianshan", nameKk: "Тянь-Шань", accusativeKk: "Тянь-Шаньды", lat: 42.8, lng: 77.35, radiusKm: 35, kind: "range" },
  { id: "astana", nameKk: "Астана", accusativeKk: "Астананы", lat: 51.128, lng: 71.43, radiusKm: 40, kind: "capital" },
  { id: "almaty", nameKk: "Алматы", accusativeKk: "Алматыны", lat: 43.24, lng: 76.93, radiusKm: 30, kind: "city" },
  { id: "tashkent", nameKk: "Ташкент", accusativeKk: "Ташкентті", lat: 41.311, lng: 69.279, radiusKm: 40, kind: "capital" },
  { id: "ulaanbaatar", nameKk: "Ұланбатыр", accusativeKk: "Ұланбатырды", lat: 47.921, lng: 106.918, radiusKm: 45, kind: "capital" },
  { id: "tehran", nameKk: "Тегеран", accusativeKk: "Тегеранді", lat: 35.689, lng: 51.389, radiusKm: 45, kind: "capital" },
  { id: "tokyo", nameKk: "Токио", accusativeKk: "Токионы", lat: 35.681, lng: 139.767, radiusKm: 45, kind: "capital" },
  { id: "beijing", nameKk: "Бейжің", accusativeKk: "Бейжіңді", lat: 39.904, lng: 116.407, radiusKm: 50, kind: "capital" },
  { id: "seoul", nameKk: "Сеул", accusativeKk: "Сеулді", lat: 37.566, lng: 126.978, radiusKm: 40, kind: "capital" },
  { id: "bangkok", nameKk: "Бангкок", accusativeKk: "Бангкокты", lat: 13.756, lng: 100.502, radiusKm: 45, kind: "capital" },
  { id: "delhi", nameKk: "Дели", accusativeKk: "Делиді", lat: 28.614, lng: 77.209, radiusKm: 45, kind: "capital" },
  { id: "ankara", nameKk: "Анкара", accusativeKk: "Анкараны", lat: 39.933, lng: 32.86, radiusKm: 45, kind: "capital" },
  { id: "riyadh", nameKk: "Эр-Рияд", accusativeKk: "Эр-Риядты", lat: 24.713, lng: 46.675, radiusKm: 50, kind: "capital" },
  { id: "jakarta", nameKk: "Джакарта", accusativeKk: "Джакартаны", lat: -6.175, lng: 106.827, radiusKm: 45, kind: "capital" },
  { id: "danube", nameKk: "Дунай", accusativeKk: "Дунайды", lat: 47.492, lng: 19.051, radiusKm: 140, kind: "river" },
  { id: "rhine", nameKk: "Рейн", accusativeKk: "Рейнді", lat: 50.357, lng: 7.598, radiusKm: 120, kind: "river" },
  { id: "volga", nameKk: "Еділ", accusativeKk: "Еділді", lat: 53.2, lng: 50.1, radiusKm: 220, kind: "river" },
  { id: "seine", nameKk: "Сена", accusativeKk: "Сенаны", lat: 48.856, lng: 2.352, radiusKm: 70, kind: "river" },
  { id: "thames", nameKk: "Темза", accusativeKk: "Темзаны", lat: 51.507, lng: -0.128, radiusKm: 50, kind: "river" },
  { id: "elbe", nameKk: "Эльба", accusativeKk: "Эльбаны", lat: 52.13, lng: 11.64, radiusKm: 120, kind: "river" },
  { id: "don", nameKk: "Дон", accusativeKk: "Донды", lat: 47.4, lng: 40.1, radiusKm: 150, kind: "river" },
  { id: "dnieper", nameKk: "Днепр", accusativeKk: "Днепрді", lat: 50.45, lng: 30.52, radiusKm: 90, kind: "river" },
  { id: "vistula", nameKk: "Висла", accusativeKk: "Висланы", lat: 52.24, lng: 21.01, radiusKm: 80, kind: "river" },
  { id: "po", nameKk: "По", accusativeKk: "По өзенін", lat: 45.0, lng: 10.5, radiusKm: 130, kind: "river" },
  { id: "loire", nameKk: "Луара", accusativeKk: "Луараны", lat: 47.9, lng: 1.9, radiusKm: 90, kind: "river" },
  { id: "dniester", nameKk: "Днестр", accusativeKk: "Днестрді", lat: 46.8, lng: 29.6, radiusKm: 100, kind: "river" },
  { id: "everest", nameKk: "Эверест", accusativeKk: "Эверестті", lat: 27.9881, lng: 86.925, radiusKm: 45, kind: "mountain" },
  { id: "himalaya", nameKk: "Гималай", accusativeKk: "Гималай тауларын", lat: 30.0, lng: 81.0, radiusKm: 250, kind: "range" },
  { id: "elbrus", nameKk: "Эльбрус", accusativeKk: "Эльбрусты", lat: 43.355, lng: 42.439, radiusKm: 50, kind: "mountain" },
  { id: "urals", nameKk: "Орал таулары", accusativeKk: "Орал тауларын", lat: 60.0, lng: 59.2, radiusKm: 220, kind: "range" },
  { id: "alps", nameKk: "Альпі", accusativeKk: "Альпі тауларын", lat: 46.5, lng: 10.0, radiusKm: 160, kind: "range" },
  { id: "carpathians", nameKk: "Карпат таулары", accusativeKk: "Карпат тауларын", lat: 47.0, lng: 25.5, radiusKm: 160, kind: "range" },
  { id: "atlas", nameKk: "Атлас таулары", accusativeKk: "Атлас тауларын", lat: 31.06, lng: -7.92, radiusKm: 130, kind: "range" },
  { id: "kilimanjaro", nameKk: "Килиманджаро", accusativeKk: "Килиманджароны", lat: -3.067, lng: 37.356, radiusKm: 45, kind: "mountain" },
  { id: "andes", nameKk: "Анд таулары", accusativeKk: "Анд тауларын", lat: -16.5, lng: -68.2, radiusKm: 650, kind: "range" },
  { id: "aconcagua", nameKk: "Аконкагуа", accusativeKk: "Аконкагуаны", lat: -32.653, lng: -70.011, radiusKm: 55, kind: "mountain" },
  { id: "rockies", nameKk: "Жартасты таулар", accusativeKk: "Жартасты тауларды", lat: 39.1, lng: -106.4, radiusKm: 250, kind: "range" },
  { id: "denali", nameKk: "Денали", accusativeKk: "Деналиді", lat: 63.069, lng: -151.007, radiusKm: 55, kind: "mountain" },
];

export const lessons: Lesson[] = [
  { id: "kz-1", moduleId: "kz", titleKk: "Теңіздер мен көлдер", order: 1, placeIds: ["caspian", "balkhash", "aral", "zaysan"] },
  { id: "kz-2", moduleId: "kz", titleKk: "Өзендер", order: 2, placeIds: ["ile", "irtysh", "shu", "zhaiyk"] },
  { id: "kz-3", moduleId: "kz", titleKk: "Таулар мен қалалар", order: 3, placeIds: ["altai", "tianshan", "astana", "almaty"] },
  { id: "asia-1", moduleId: "asia", titleKk: "Орталық және Батыс Азия", order: 1, placeIds: ["astana", "tashkent", "tehran", "ankara"] },
  { id: "asia-2", moduleId: "asia", titleKk: "Шығыс Азия", order: 2, placeIds: ["tokyo", "beijing", "seoul", "ulaanbaatar"] },
  { id: "asia-3", moduleId: "asia", titleKk: "Оңтүстік Азия", order: 3, placeIds: ["delhi", "bangkok", "jakarta", "riyadh"] },
  { id: "eu-1", moduleId: "eu", titleKk: "Батыс Еуропа", order: 1, placeIds: ["seine", "thames", "rhine", "loire"] },
  { id: "eu-2", moduleId: "eu", titleKk: "Орталық Еуропа", order: 2, placeIds: ["danube", "elbe", "po", "vistula"] },
  { id: "eu-3", moduleId: "eu", titleKk: "Шығыс Еуропа", order: 3, placeIds: ["volga", "don", "dnieper", "dniester"] },
  { id: "world-1", moduleId: "world", titleKk: "Азия таулары", order: 1, placeIds: ["everest", "himalaya", "elbrus", "urals"] },
  { id: "world-2", moduleId: "world", titleKk: "Еуропа мен Африка", order: 2, placeIds: ["alps", "carpathians", "atlas", "kilimanjaro"] },
  { id: "world-3", moduleId: "world", titleKk: "Америка таулары", order: 3, placeIds: ["andes", "aconcagua", "rockies", "denali"] },
];

export const modules: Module[] = [
  {
    id: "kz",
    titleKk: "Қазақстанның физикалық географиясы",
    descriptionKk: "Теңіз, көл, өзен, тау және қала",
    emoji: "🇰🇿",
    center: [48.5, 66],
    zoom: 4,
    lessonIds: ["kz-1", "kz-2", "kz-3"],
  },
  {
    id: "asia",
    titleKk: "Азия астаналары",
    descriptionKk: "Азия елдерінің астаналарын тап",
    emoji: "🏯",
    center: [32, 95],
    zoom: 3,
    lessonIds: ["asia-1", "asia-2", "asia-3"],
  },
  {
    id: "eu",
    titleKk: "Еуропа өзендері",
    descriptionKk: "Еуропаның басты өзендері",
    emoji: "🌊",
    center: [50, 15],
    zoom: 4,
    lessonIds: ["eu-1", "eu-2", "eu-3"],
  },
  {
    id: "world",
    titleKk: "Дүние жүзі таулары",
    descriptionKk: "Материктердің биік шыңдары",
    emoji: "🏔️",
    center: [20, 10],
    zoom: 2,
    lessonIds: ["world-1", "world-2", "world-3"],
  },
];

const placeMap = new Map(places.map((place) => [place.id, place]));
const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const moduleMap = new Map(modules.map((module) => [module.id, module]));

export function getPlace(id: string): Place {
  const place = placeMap.get(id);
  if (!place) throw new Error(`Unknown place: ${id}`);
  return place;
}

export function findLesson(id: string): Lesson | undefined {
  return lessonMap.get(id);
}

export function getLesson(id: string): Lesson {
  const lesson = lessonMap.get(id);
  if (!lesson) throw new Error(`Unknown lesson: ${id}`);
  return lesson;
}

export function getModule(id: string): Module {
  const skillModule = moduleMap.get(id);
  if (!skillModule) throw new Error(`Unknown module: ${id}`);
  return skillModule;
}

export function placesInModule(moduleId: string): Place[] {
  const ids = new Set<string>();
  for (const lessonId of getModule(moduleId).lessonIds) {
    for (const placeId of getLesson(lessonId).placeIds) ids.add(placeId);
  }
  return [...ids].map((id) => getPlace(id));
}

export function focusZoom(place: Place) {
  if (place.kind === "capital" || place.kind === "city" || place.kind === "lake") return 6;
  if (place.kind === "mountain" || place.kind === "sea" || place.kind === "river") return 5;
  return 4;
}

function optionIds(correctId: string, moduleId: string, salt: number): string[] {
  const correct = getPlace(correctId);
  const ranked = placesInModule(moduleId)
    .filter((place) => place.id !== correctId)
    .sort((a, b) => {
      const distance = haversineKm(b, correct) - haversineKm(a, correct);
      if (distance !== 0) return distance;
      return a.id.localeCompare(b.id);
    });
  const start = salt % ranked.length;
  const rotated = [...ranked.slice(start), ...ranked.slice(0, start)];
  const picked = rotated.slice(0, 3).map((place) => place.id);
  const merged = [correctId, ...picked];
  const shift = salt % merged.length;
  return [...merged.slice(shift), ...merged.slice(0, shift)];
}

export function questionsForLesson(lessonId: string): Question[] {
  const lesson = getLesson(lessonId);
  const [first, second, third, fourth] = lesson.placeIds;
  const a = getPlace(first);
  const b = getPlace(second);
  const c = getPlace(third);
  const d = getPlace(fourth);
  return [
    { id: `${lessonId}-q1`, type: "pinpoint", placeId: a.id, promptKk: `${a.accusativeKk} картадан тап` },
    {
      id: `${lessonId}-q2`,
      type: "identify",
      placeId: b.id,
      promptKk: "Картадағы белгі қай нысан?",
      optionIds: optionIds(b.id, lesson.moduleId, 1),
    },
    { id: `${lessonId}-q3`, type: "pinpoint", placeId: c.id, promptKk: `${c.accusativeKk} картадан тап` },
    {
      id: `${lessonId}-q4`,
      type: "pick",
      placeId: d.id,
      promptKk: `«${d.nameKk}» қай жерде? Әріпті таңда.`,
      optionIds: optionIds(d.id, lesson.moduleId, 2),
    },
    { id: `${lessonId}-q5`, type: "pinpoint", placeId: b.id, promptKk: `${b.accusativeKk} картадан тап` },
    {
      id: `${lessonId}-q6`,
      type: "identify",
      placeId: a.id,
      promptKk: "Бұл нысан қалай аталады?",
      optionIds: optionIds(a.id, lesson.moduleId, 4),
    },
  ];
}

export function nextLessonId(lessonId: string): string | null {
  const ordered = modules.flatMap((module) => module.lessonIds);
  const index = ordered.indexOf(lessonId);
  if (index < 0 || index >= ordered.length - 1) return null;
  return ordered[index + 1] ?? null;
}

function validateCurriculum() {
  if (placeMap.size !== places.length) throw new Error("Duplicate place id");
  for (const skillModule of modules) {
    const ids = new Set<string>();
    for (const lessonId of skillModule.lessonIds) {
      const lesson = getLesson(lessonId);
      if (lesson.moduleId !== skillModule.id) throw new Error(`Lesson ${lessonId} is in the wrong module`);
      for (const placeId of lesson.placeIds) ids.add(placeId);
      const questions = questionsForLesson(lessonId);
      if (questions.length < 5 || questions.length > 8) throw new Error(`Lesson ${lessonId} question count`);
      const types = new Set(questions.map((question) => question.type));
      if (!types.has("pinpoint") || (!types.has("identify") && !types.has("pick"))) {
        throw new Error(`Lesson ${lessonId} needs both task types`);
      }
      for (const question of questions) {
        if (question.type === "pinpoint") continue;
        if (question.optionIds.length !== 4 || new Set(question.optionIds).size !== 4) {
          throw new Error(`Bad options for ${question.id}`);
        }
        if (!question.optionIds.includes(question.placeId)) throw new Error(`Missing answer for ${question.id}`);
      }
    }
    if (ids.size < 8 || ids.size > 12) throw new Error(`${skillModule.id} has ${ids.size} places`);
  }
}

validateCurriculum();
