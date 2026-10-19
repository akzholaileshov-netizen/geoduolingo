import { haversineKm } from "@/lib/geo";
import { featureShape, landShape } from "@/lib/map-regions";
import { pdfPlaces, subTopicsByLesson } from "@/lib/regional-topics";

export type PlaceKind =
  | "country"
  | "island"
  | "peninsula"
  | "range"
  | "plain"
  | "river"
  | "lake"
  | "sea"
  | "gulf"
  | "desert"
  | "city"
  | "capital"
  | "mountain";

export type ContinentId = "asia" | "europe";

export type Place = {
  id: string;
  nameKk: string;
  accusativeKk: string;
  lat: number;
  lng: number;
  radiusKm: number;
  kind: PlaceKind;
  continent: ContinentId;
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

export type Continent = {
  id: ContinentId;
  moduleId: "eurasia";
  titleKk: string;
  descriptionKk: string;
  emoji: string;
  lessonIds: string[];
};

export type SubTopic = {
  id: string;
  titleKk: string;
  order: number;
  placeIds: string[];
};

export type Lesson = {
  id: string;
  moduleId: string;
  continentId: ContinentId;
  titleKk: string;
  order: number;
  placeIds: string[];
  subTopics: SubTopic[];
};

export type Quiz = {
  lesson: Lesson;
  subTopic: SubTopic;
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

export const places: Place[] = pdfPlaces;

const lessonTitles = ["Мемлекеттер", "Аралдар", "Түбектер", "Таулар", "Жазықтар", "Өзендер", "Көлдер", "Теңіздер", "Шығанақтар", "Шөлдер"] as const;

function withSubTopics(seed: {
  id: string;
  moduleId: string;
  continentId: ContinentId;
  titleKk: string;
  order: number;
  placeIds: string[];
}): Lesson {
  const plans = subTopicsByLesson[seed.id];
  if (!plans?.length) throw new Error(`Missing subtopics for ${seed.id}`);
  const subTopics = plans.map((plan, index) => ({
    id: plan.id,
    titleKk: plan.titleKk,
    order: index + 1,
    placeIds: [...plan.placeIds],
  }));
  return {
    id: seed.id,
    moduleId: seed.moduleId,
    continentId: seed.continentId,
    titleKk: seed.titleKk,
    order: seed.order,
    subTopics,
    placeIds: subTopics.flatMap((topic) => topic.placeIds),
  };
}

export const lessons: Lesson[] = ([
  {
    id: "asia-states",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Мемлекеттер",
    order: 1,
    placeIds: ["kazakhstan", "china", "india", "japan", "turkey", "iran", "mongolia", "south-korea", "saudi-arabia", "indonesia"],
  },
  {
    id: "asia-islands",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Аралдар",
    order: 2,
    placeIds: ["sakhalin", "sri-lanka", "honshu", "sumatra", "cyprus", "hainan", "taiwan", "kalimantan"],
  },
  {
    id: "asia-peninsulas",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Түбектер",
    order: 3,
    placeIds: ["kamchatka", "korean-peninsula", "arabian-peninsula", "indochina", "anatolian-peninsula", "malay-peninsula", "sinai", "chukotka"],
  },
  {
    id: "asia-mountains",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Таулар",
    order: 4,
    placeIds: ["himalayas", "tien-shan", "altai", "hindu-kush", "zagros", "caucasus", "sayan", "elburz"],
  },
  {
    id: "asia-plains",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Жазықтар",
    order: 5,
    placeIds: ["west-siberian-plain", "great-chinese-plain", "indo-gangetic-plain", "turan-plain", "mesopotamian-plain", "manchurian-plain", "sichuan", "mekong-plain"],
  },
  {
    id: "asia-rivers",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Өзендер",
    order: 6,
    placeIds: ["yangtze", "yellow-river", "ob", "yenisei", "lena", "ganges", "indus", "mekong"],
  },
  {
    id: "asia-lakes",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Көлдер",
    order: 7,
    placeIds: ["caspian", "baikal", "balkhash", "aral", "issyk-kul", "qinghai", "van", "khanka"],
  },
  {
    id: "asia-seas",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Теңіздер",
    order: 8,
    placeIds: ["arabian-sea", "south-china-sea", "sea-of-japan", "okhotsk", "bering", "red-sea", "east-china-sea", "philippine-sea"],
  },
  {
    id: "asia-gulfs",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Шығанақтар",
    order: 9,
    placeIds: ["persian-gulf", "bay-of-bengal", "gulf-of-thailand", "bohai", "gulf-of-aden", "anadyr-gulf", "gulf-of-oman", "tonkin"],
  },
  {
    id: "asia-deserts",
    moduleId: "eurasia",
    continentId: "asia",
    titleKk: "Шөлдер",
    order: 10,
    placeIds: ["gobi", "karakum", "taklamakan", "thar", "arabian-desert", "kyzylkum", "syrian-desert", "lut"],
  },
  {
    id: "europe-states",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Мемлекеттер",
    order: 1,
    placeIds: ["france", "germany", "italy", "spain", "poland", "ukraine", "united-kingdom", "romania", "greece", "sweden"],
  },
  {
    id: "europe-islands",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Аралдар",
    order: 2,
    placeIds: ["great-britain", "iceland", "sicily", "ireland", "sardinia", "crete", "majorca", "zealand"],
  },
  {
    id: "europe-peninsulas",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Түбектер",
    order: 3,
    placeIds: ["scandinavian-peninsula", "iberian-peninsula", "crimea", "balkan-peninsula", "italian-peninsula", "brittany", "jutland", "kola"],
  },
  {
    id: "europe-mountains",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Таулар",
    order: 4,
    placeIds: ["alps", "carpathians", "pyrenees", "urals", "apennines", "scandes", "dinaric", "highlands"],
  },
  {
    id: "europe-plains",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Жазықтар",
    order: 5,
    placeIds: ["east-european-plain", "hungarian-plain", "north-german-plain", "padan-plain", "paris-basin", "wallachian-plain", "english-lowlands", "andalusian-plain"],
  },
  {
    id: "europe-rivers",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Өзендер",
    order: 6,
    placeIds: ["volga", "danube", "rhine", "seine", "vistula", "dnieper", "loire", "po"],
  },
  {
    id: "europe-lakes",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Көлдер",
    order: 7,
    placeIds: ["ladoga", "onega", "vanern", "geneva", "balaton", "constance", "peipus", "garda"],
  },
  {
    id: "europe-seas",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Теңіздер",
    order: 8,
    placeIds: ["mediterranean", "black-sea", "baltic", "north-sea", "barents", "norwegian-sea", "adriatic", "aegean"],
  },
  {
    id: "europe-gulfs",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Шығанақтар",
    order: 9,
    placeIds: ["gulf-of-finland", "biscay", "bothnia", "riga", "lion", "genoa", "venice", "cadiz"],
  },
] satisfies Array<{
  id: string;
  moduleId: string;
  continentId: ContinentId;
  titleKk: string;
  order: number;
  placeIds: string[];
}>).map((seed) => withSubTopics(seed));

export const continents: Continent[] = [
  {
    id: "asia",
    moduleId: "eurasia",
    titleKk: "Азия",
    descriptionKk: "Азияның мемлекеті мен жер бедері",
    emoji: "🏯",
    lessonIds: lessons.filter((lesson) => lesson.continentId === "asia").map((lesson) => lesson.id),
  },
  {
    id: "europe",
    moduleId: "eurasia",
    titleKk: "Еуропа",
    descriptionKk: "Еуропаның мемлекеті мен жер бедері",
    emoji: "🏰",
    lessonIds: lessons.filter((lesson) => lesson.continentId === "europe").map((lesson) => lesson.id),
  },
];

export const modules: Module[] = [
  {
    id: "eurasia",
    titleKk: "Еуразия",
    descriptionKk: "Азия және Еуропа",
    emoji: "🌏",
    center: [50, 70],
    zoom: 3,
    lessonIds: continents.flatMap((continent) => continent.lessonIds),
  },
];

const placeMap = new Map(places.map((place) => [place.id, place]));
const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const quizMap = new Map<string, Quiz>(
  lessons.flatMap((lesson) => lesson.subTopics.map((subTopic) => [subTopic.id, { lesson, subTopic }] as const)),
);
const moduleMap = new Map(modules.map((module) => [module.id, module]));
const continentMap = new Map<string, Continent>(continents.map((continent) => [continent.id, continent]));

export function getPlace(id: string): Place {
  const place = placeMap.get(id);
  if (!place) throw new Error(`Unknown place: ${id}`);
  return place;
}

export function findLesson(id: string): Lesson | undefined {
  return lessonMap.get(id);
}

export function findQuiz(id: string): Quiz | undefined {
  return quizMap.get(id);
}

export function nextSubTopic(subTopicId: string): SubTopic | null {
  const quiz = quizMap.get(subTopicId);
  if (!quiz) return null;
  const index = quiz.lesson.subTopics.findIndex((topic) => topic.id === subTopicId);
  if (index < 0) return null;
  return quiz.lesson.subTopics[index + 1] ?? null;
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

export function findContinent(id: string): Continent | undefined {
  return continentMap.get(id);
}

export function getContinent(id: string): Continent {
  const continent = continentMap.get(id);
  if (!continent) throw new Error(`Unknown continent: ${id}`);
  return continent;
}

export function placesInModule(moduleId: string): Place[] {
  const ids = new Set<string>();
  for (const lessonId of getModule(moduleId).lessonIds) {
    for (const placeId of getLesson(lessonId).placeIds) ids.add(placeId);
  }
  return [...ids].map((id) => getPlace(id));
}

const identifyPrompt: Record<PlaceKind, string> = {
  country: "Бұл қай ел?",
  island: "Бұл қай арал?",
  peninsula: "Бұл қай түбек?",
  range: "Бұл қай тау?",
  plain: "Бұл қай жазық?",
  river: "Бұл қай өзен?",
  lake: "Бұл қай көл?",
  sea: "Бұл қай теңіз?",
  gulf: "Бұл қай шығанақ?",
  desert: "Бұл қай шөл?",
  city: "Бұл қай қала?",
  capital: "Бұл қай астана?",
  mountain: "Бұл қай тау?",
};

function identifyPromptFor(place: Place) {
  const name = place.nameKk;
  if (name.includes("мұхит")) return "Бұл қай мұхит?";
  if (name.includes("бұғаз")) return "Бұл қай бұғаз?";
  if (name.includes("канал")) return "Бұл қай канал?";
  if (name.includes("мүйіс")) return "Бұл қай мүйіс?";
  if (name.includes("жанартау")) return "Бұл қай жанартау?";
  if (name.includes("шың")) return "Бұл қай шың?";
  if (name.includes("қырат")) return "Бұл қай қырат?";
  if (name.includes("үстірт")) return "Бұл қай үстірт?";
  if (name.includes("жота")) return "Бұл қай жота?";
  if (name.includes("ойыс")) return "Бұл қай ойыс?";
  if (name.includes("топарал")) return "Бұл қай топарал?";
  return identifyPrompt[place.kind];
}

function optionIds(correctId: string, poolIds: readonly string[], salt: number): string[] {
  const correct = getPlace(correctId);
  const ranked = poolIds
    .filter((id) => id !== correctId)
    .map((id) => getPlace(id))
    .sort((a, b) => {
      const distance = haversineKm(b, correct) - haversineKm(a, correct);
      if (distance !== 0) return distance;
      return a.id.localeCompare(b.id);
    });
  const take = Math.min(3, ranked.length);
  const start = ranked.length ? salt % ranked.length : 0;
  const rotated = [...ranked.slice(start), ...ranked.slice(0, start)];
  const picked = rotated.slice(0, take).map((place) => place.id);
  const merged = [correctId, ...picked];
  const shift = salt % merged.length;
  return [...merged.slice(shift), ...merged.slice(0, shift)];
}

export function questionsForLesson(quizId: string): Question[] {
  const quiz = findQuiz(quizId);
  if (!quiz) throw new Error(`Unknown quiz: ${quizId}`);
  const placeIds = quiz.subTopic.placeIds;
  if (!placeIds.length) return [];
  const pool = quiz.lesson.placeIds;
  const target = Math.min(10, Math.max(5, placeIds.length));
  const questions: Question[] = [];
  let cursor = 0;
  while (questions.length < target) {
    const placeId = placeIds[cursor % placeIds.length];
    if (!placeId) break;
    const place = getPlace(placeId);
    if (questions.length % 2 === 0) {
      questions.push({
        id: `${quizId}-q${questions.length + 1}`,
        type: "pinpoint",
        placeId,
        promptKk: `${place.accusativeKk} картадан тап`,
      });
    } else {
      questions.push({
        id: `${quizId}-q${questions.length + 1}`,
        type: "identify",
        placeId,
        promptKk: identifyPromptFor(place),
        optionIds: optionIds(placeId, pool, cursor + 1),
      });
    }
    cursor += 1;
  }
  return questions;
}

export function nextLessonId(lessonId: string): string | null {
  const lesson = findLesson(lessonId);
  if (!lesson) return null;
  const continent = getContinent(lesson.continentId);
  const index = continent.lessonIds.indexOf(lessonId);
  if (index < 0 || index >= continent.lessonIds.length - 1) return null;
  return continent.lessonIds[index + 1] ?? null;
}

const kindByTitle: Record<(typeof lessonTitles)[number], PlaceKind> = {
  Мемлекеттер: "country",
  Аралдар: "island",
  Түбектер: "peninsula",
  Таулар: "range",
  Жазықтар: "plain",
  Өзендер: "river",
  Көлдер: "lake",
  Теңіздер: "sea",
  Шығанақтар: "gulf",
  Шөлдер: "desert",
};

function validateCurriculum() {
  if (placeMap.size !== places.length) throw new Error("Duplicate place id");
  if (lessonMap.size !== lessons.length) throw new Error("Duplicate lesson id");
  if (modules.length !== 1 || modules[0]?.id !== "eurasia" || modules[0]?.titleKk !== "Еуразия") {
    throw new Error("Expected one Eurasia module");
  }
  if (continents.length !== 2) throw new Error("Expected Asia and Europe");
  const expectedLessons = [
    "asia-states",
    "asia-islands",
    "asia-peninsulas",
    "asia-mountains",
    "asia-plains",
    "asia-rivers",
    "asia-lakes",
    "asia-seas",
    "asia-gulfs",
    "asia-deserts",
    "europe-states",
    "europe-islands",
    "europe-peninsulas",
    "europe-mountains",
    "europe-plains",
    "europe-rivers",
    "europe-lakes",
    "europe-seas",
    "europe-gulfs",
  ];
  if (modules[0]?.lessonIds.join(",") !== expectedLessons.join(",")) throw new Error("Unexpected lesson list");
  const retired = [
    "kz-1",
    "kz-2",
    "kz-3",
    "asia-1",
    "asia-2",
    "asia-3",
    "eu-1",
    "eu-2",
    "eu-3",
    "world-1",
    "world-2",
    "world-3",
    "eurasia-states",
    "eurasia-islands",
    "eurasia-peninsulas",
    "eurasia-mountains",
    "eurasia-plains",
    "eurasia-rivers",
    "eurasia-lakes",
    "eurasia-seas",
    "eurasia-gulfs",
    "eurasia-deserts",
    "europe-deserts",
  ];
  const used = new Set<string>();
  for (const continent of continents) {
    const expectedCount = continent.id === "europe" ? 9 : 10;
    if (continent.lessonIds.length !== expectedCount) throw new Error(`${continent.id} lesson count`);
    continent.lessonIds.forEach((lessonId, index) => {
      const lesson = getLesson(lessonId);
      if (lesson.continentId !== continent.id) throw new Error(`${lessonId} continent`);
      if (lesson.titleKk !== lessonTitles[index]) throw new Error(`${lessonId} title`);
      if (lesson.order !== index + 1) throw new Error(`${lessonId} order`);
    });
  }
  for (const lesson of lessons) {
    if (retired.includes(lesson.id)) throw new Error(`Retired lesson id ${lesson.id}`);
    if (lesson.moduleId !== "eurasia") throw new Error(`${lesson.id} module`);
    if (lesson.continentId === "europe" && lesson.titleKk === "Шөлдер") throw new Error("Europe has no deserts section");
    if (lesson.subTopics.length < 1 || lesson.subTopics.length > 5) throw new Error(`${lesson.id} subtopic count`);
    if (new Set(lesson.placeIds).size !== lesson.placeIds.length) throw new Error(`Duplicate place in ${lesson.id}`);
    const expectedKind = kindByTitle[lesson.titleKk as (typeof lessonTitles)[number]];
    if (lesson.titleKk === "Мемлекеттер") {
      const expected =
        lesson.continentId === "asia"
          ? ["Оңтүстік-Шығыс Азия", "Шығыс Азия", "Оңтүстік Азия", "Орталық Азия", "Таяу Шығыс"]
          : ["Солтүстік Еуропа", "Батыс Еуропа", "Оңтүстік Еуропа", "Шығыс Еуропа", "Орталық Еуропа"];
      if (lesson.subTopics.map((topic) => topic.titleKk).join("|") !== expected.join("|")) {
        throw new Error(`${lesson.id} state order`);
      }
    }
    const seenTopics = new Set<string>();
    for (const topic of lesson.subTopics) {
      if (seenTopics.has(topic.id) || quizMap.get(topic.id)?.lesson.id !== lesson.id) throw new Error(`Bad subtopic ${topic.id}`);
      seenTopics.add(topic.id);
      if (topic.placeIds.length < 1 || topic.placeIds.length > 16) throw new Error(`${topic.id} size`);
      if (!topic.titleKk.trim()) throw new Error(`${topic.id} title`);
      const features = topic.placeIds.map((placeId) => {
        const place = getPlace(placeId);
        if (used.has(placeId)) throw new Error(`Shared place ${placeId}`);
        used.add(placeId);
        if (place.continent !== lesson.continentId) throw new Error(`${placeId} is on the wrong continent`);
        if (place.kind !== expectedKind) throw new Error(`${placeId} kind`);
        if (place.lat < -11 || place.lat > 82 || place.lng < -30 || place.lng > 180) throw new Error(`${placeId} is outside the map`);
        if (place.continent === "europe" && (place.lng < -25 || place.lng > 62 || place.lat < 34)) {
          throw new Error(`${placeId} is not in Europe`);
        }
        if (place.continent === "asia" && place.lng < 26 && place.lat > 12) throw new Error(`${placeId} is not in Asia`);
        if (place.radiusKm < 5) throw new Error(`${placeId} radius`);
        if (place.kind === "country") {
          if (!landShape(place.id)) throw new Error(`Missing country outline ${place.id}`);
        } else if (!featureShape(place.id)) {
          throw new Error(`Missing hotspot ${place.id}`);
        }
        if (place.kind === "island" || place.kind === "peninsula") {
          const outline = featureShape(place.id);
          if (!outline || /[aA]/.test(outline.d)) throw new Error(`${place.id} must be a filled outline, not a circle`);
        }
        return place;
      });
      const filled = new Set<PlaceKind>(["country", "island", "peninsula"]);
      if (features.some((place) => !filled.has(place.kind))) {
        for (let i = 0; i < features.length; i += 1) {
          for (let j = i + 1; j < features.length; j += 1) {
            const left = features[i];
            const right = features[j];
            if (!left || !right) continue;
            const distance = haversineKm(left, right);
            if (distance <= left.radiusKm || distance <= right.radiusKm) {
              throw new Error(`${left.id} and ${right.id} overlap (${Math.round(distance)} km)`);
            }
          }
        }
      }
      const questions = questionsForLesson(topic.id);
      if (questions.length < 5 || questions.length > 10) throw new Error(`${topic.id} question count ${questions.length}`);
      const types = new Set(questions.map((question) => question.type));
      if (!types.has("pinpoint") || !types.has("identify")) throw new Error(`${topic.id} needs both task types`);
      for (const question of questions) {
        if (question.type === "pinpoint") {
          if (!question.promptKk.endsWith("картадан тап")) throw new Error(`Bad pinpoint ${question.id}`);
          continue;
        }
        if (!question.promptKk.startsWith("Бұл қай ")) throw new Error(`Bad identify ${question.id}`);
        if (question.optionIds.length < 2 || question.optionIds.length > 4 || new Set(question.optionIds).size !== question.optionIds.length) {
          throw new Error(`Bad options ${question.id}`);
        }
        if (!question.optionIds.includes(question.placeId)) throw new Error(`Missing answer ${question.id}`);
      }
    }
  }
  if (used.size !== places.length) throw new Error("Unused place");
  const asiaDeserts = new Set(getLesson("asia-deserts").placeIds);
  for (const id of ["kyzylkum", "karakum", "gobi", "taklamakan", "thar", "rub-al-khali", "arabian-desert", "great-nefud", "little-nefud"]) {
    if (!asiaDeserts.has(id)) throw new Error(`Asia deserts missing ${id}`);
  }
}

validateCurriculum();
