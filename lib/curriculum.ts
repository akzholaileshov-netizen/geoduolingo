import { haversineKm } from "@/lib/geo";
import { featureShape, landShape } from "@/lib/map-regions";

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

export type Lesson = {
  id: string;
  moduleId: string;
  continentId: ContinentId;
  titleKk: string;
  order: number;
  placeIds: string[];
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
  { id: "kazakhstan", nameKk: "Қазақстан", accusativeKk: "Қазақстанды", lat: 48.5, lng: 66.9, radiusKm: 520, kind: "country", continent: "asia" },
  { id: "china", nameKk: "Қытай", accusativeKk: "Қытайды", lat: 34.3, lng: 108.9, radiusKm: 940, kind: "country", continent: "asia" },
  { id: "india", nameKk: "Үндістан", accusativeKk: "Үндістанды", lat: 22.5, lng: 79, radiusKm: 820, kind: "country", continent: "asia" },
  { id: "japan", nameKk: "Жапония", accusativeKk: "Жапонияны", lat: 36.2, lng: 138, radiusKm: 340, kind: "country", continent: "asia" },
  { id: "turkey", nameKk: "Түркия", accusativeKk: "Түркияны", lat: 39.2, lng: 34.2, radiusKm: 380, kind: "country", continent: "asia" },
  { id: "iran", nameKk: "Иран", accusativeKk: "Иранды", lat: 32.8, lng: 53.8, radiusKm: 460, kind: "country", continent: "asia" },
  { id: "mongolia", nameKk: "Моңғолия", accusativeKk: "Моңғолияны", lat: 46.9, lng: 103.4, radiusKm: 460, kind: "country", continent: "asia" },
  { id: "south-korea", nameKk: "Оңтүстік Корея", accusativeKk: "Оңтүстік Кореяны", lat: 36.5, lng: 127.9, radiusKm: 160, kind: "country", continent: "asia" },
  { id: "saudi-arabia", nameKk: "Сауд Арабиясы", accusativeKk: "Сауд Арабиясын", lat: 24, lng: 45, radiusKm: 400, kind: "country", continent: "asia" },
  { id: "indonesia", nameKk: "Индонезия", accusativeKk: "Индонезияны", lat: -2.2, lng: 117.5, radiusKm: 520, kind: "country", continent: "asia" },
  { id: "france", nameKk: "Франция", accusativeKk: "Францияны", lat: 46.6, lng: 2.4, radiusKm: 300, kind: "country", continent: "europe" },
  { id: "germany", nameKk: "Германия", accusativeKk: "Германияны", lat: 51.16, lng: 10.45, radiusKm: 270, kind: "country", continent: "europe" },
  { id: "italy", nameKk: "Италия", accusativeKk: "Италияны", lat: 42.8, lng: 12.5, radiusKm: 240, kind: "country", continent: "europe" },
  { id: "spain", nameKk: "Испания", accusativeKk: "Испанияны", lat: 40.2, lng: -3.7, radiusKm: 240, kind: "country", continent: "europe" },
  { id: "poland", nameKk: "Польша", accusativeKk: "Польшаны", lat: 52, lng: 19.5, radiusKm: 220, kind: "country", continent: "europe" },
  { id: "ukraine", nameKk: "Украина", accusativeKk: "Украинаны", lat: 49, lng: 32, radiusKm: 300, kind: "country", continent: "europe" },
  { id: "united-kingdom", nameKk: "Ұлыбритания", accusativeKk: "Ұлыбританияны", lat: 54.2, lng: -2.5, radiusKm: 260, kind: "country", continent: "europe" },
  { id: "romania", nameKk: "Румыния", accusativeKk: "Румынияны", lat: 45.8, lng: 24.7, radiusKm: 170, kind: "country", continent: "europe" },
  { id: "greece", nameKk: "Грекия", accusativeKk: "Грекияны", lat: 39, lng: 22, radiusKm: 180, kind: "country", continent: "europe" },
  { id: "sweden", nameKk: "Швеция", accusativeKk: "Швецияны", lat: 62.5, lng: 16, radiusKm: 300, kind: "country", continent: "europe" },
  { id: "sakhalin", nameKk: "Сахалин аралы", accusativeKk: "Сахалин аралын", lat: 50.4, lng: 143, radiusKm: 430, kind: "island", continent: "asia" },
  { id: "sri-lanka", nameKk: "Шри-Ланка", accusativeKk: "Шри-Ланканы", lat: 7.6, lng: 80.7, radiusKm: 130, kind: "island", continent: "asia" },
  { id: "honshu", nameKk: "Хонсю аралы", accusativeKk: "Хонсю аралын", lat: 36.3, lng: 138.4, radiusKm: 260, kind: "island", continent: "asia" },
  { id: "sumatra", nameKk: "Суматра аралы", accusativeKk: "Суматра аралын", lat: -0.6, lng: 101.7, radiusKm: 360, kind: "island", continent: "asia" },
  { id: "cyprus", nameKk: "Кипр аралы", accusativeKk: "Кипр аралын", lat: 35.05, lng: 33.25, radiusKm: 70, kind: "island", continent: "asia" },
  { id: "hainan", nameKk: "Хайнань аралы", accusativeKk: "Хайнань аралын", lat: 19.15, lng: 109.7, radiusKm: 130, kind: "island", continent: "asia" },
  { id: "taiwan", nameKk: "Тайвань аралы", accusativeKk: "Тайвань аралын", lat: 23.7, lng: 121, radiusKm: 175, kind: "island", continent: "asia" },
  { id: "kalimantan", nameKk: "Калимантан аралы", accusativeKk: "Калимантан аралын", lat: 0.8, lng: 114, radiusKm: 320, kind: "island", continent: "asia" },
  { id: "great-britain", nameKk: "Ұлыбритания аралы", accusativeKk: "Ұлыбритания аралын", lat: 53.76, lng: -0.36, radiusKm: 280, kind: "island", continent: "europe" },
  { id: "iceland", nameKk: "Исландия аралы", accusativeKk: "Исландия аралын", lat: 64.9, lng: -18.6, radiusKm: 210, kind: "island", continent: "europe" },
  { id: "sicily", nameKk: "Сицилия аралы", accusativeKk: "Сицилия аралын", lat: 37.55, lng: 14.15, radiusKm: 110, kind: "island", continent: "europe" },
  { id: "ireland", nameKk: "Ирландия аралы", accusativeKk: "Ирландия аралын", lat: 53.35, lng: -8, radiusKm: 120, kind: "island", continent: "europe" },
  { id: "sardinia", nameKk: "Сардиния аралы", accusativeKk: "Сардиния аралын", lat: 40.05, lng: 9, radiusKm: 90, kind: "island", continent: "europe" },
  { id: "crete", nameKk: "Крит аралы", accusativeKk: "Крит аралын", lat: 35.2, lng: 24.9, radiusKm: 100, kind: "island", continent: "europe" },
  { id: "majorca", nameKk: "Мальорка аралы", accusativeKk: "Мальорка аралын", lat: 39.6, lng: 3, radiusKm: 50, kind: "island", continent: "europe" },
  { id: "zealand", nameKk: "Зеландия аралы", accusativeKk: "Зеландия аралын", lat: 55.5, lng: 11.8, radiusKm: 70, kind: "island", continent: "europe" },
  { id: "kamchatka", nameKk: "Камчатка түбегі", accusativeKk: "Камчатка түбегін", lat: 55.2, lng: 159.5, radiusKm: 360, kind: "peninsula", continent: "asia" },
  { id: "korean-peninsula", nameKk: "Корей түбегі", accusativeKk: "Корей түбегін", lat: 37, lng: 127.4, radiusKm: 200, kind: "peninsula", continent: "asia" },
  { id: "arabian-peninsula", nameKk: "Араб түбегі", accusativeKk: "Араб түбегін", lat: 23.5, lng: 45, radiusKm: 480, kind: "peninsula", continent: "asia" },
  { id: "indochina", nameKk: "Үндіқытай түбегі", accusativeKk: "Үндіқытай түбегін", lat: 16, lng: 104, radiusKm: 380, kind: "peninsula", continent: "asia" },
  { id: "anatolian-peninsula", nameKk: "Анадолы түбегі", accusativeKk: "Анадолы түбегін", lat: 39, lng: 33.5, radiusKm: 280, kind: "peninsula", continent: "asia" },
  { id: "malay-peninsula", nameKk: "Малакка түбегі", accusativeKk: "Малакка түбегін", lat: 6, lng: 101.2, radiusKm: 200, kind: "peninsula", continent: "asia" },
  { id: "sinai", nameKk: "Синай түбегі", accusativeKk: "Синай түбегін", lat: 29.5, lng: 33.8, radiusKm: 70, kind: "peninsula", continent: "asia" },
  { id: "chukotka", nameKk: "Чукотка түбегі", accusativeKk: "Чукотка түбегін", lat: 66, lng: 174, radiusKm: 180, kind: "peninsula", continent: "asia" },
  { id: "scandinavian-peninsula", nameKk: "Скандинавия түбегі", accusativeKk: "Скандинавия түбегін", lat: 63, lng: 15, radiusKm: 380, kind: "peninsula", continent: "europe" },
  { id: "iberian-peninsula", nameKk: "Пиреней түбегі", accusativeKk: "Пиреней түбегін", lat: 40.2, lng: -3.8, radiusKm: 260, kind: "peninsula", continent: "europe" },
  { id: "crimea", nameKk: "Қырым түбегі", accusativeKk: "Қырым түбегін", lat: 45.3, lng: 34.1, radiusKm: 80, kind: "peninsula", continent: "europe" },
  { id: "balkan-peninsula", nameKk: "Балқан түбегі", accusativeKk: "Балқан түбегін", lat: 42, lng: 22.5, radiusKm: 220, kind: "peninsula", continent: "europe" },
  { id: "italian-peninsula", nameKk: "Апеннин түбегі", accusativeKk: "Апеннин түбегін", lat: 42.5, lng: 13, radiusKm: 160, kind: "peninsula", continent: "europe" },
  { id: "brittany", nameKk: "Бретань түбегі", accusativeKk: "Бретань түбегін", lat: 48.2, lng: -4.2, radiusKm: 80, kind: "peninsula", continent: "europe" },
  { id: "jutland", nameKk: "Ютландия түбегі", accusativeKk: "Ютландия түбегін", lat: 56.4, lng: 9.3, radiusKm: 90, kind: "peninsula", continent: "europe" },
  { id: "kola", nameKk: "Кола түбегі", accusativeKk: "Кола түбегін", lat: 67.5, lng: 36.5, radiusKm: 150, kind: "peninsula", continent: "europe" },
  { id: "himalayas", nameKk: "Гималай таулары", accusativeKk: "Гималай тауларын", lat: 28.3, lng: 84.5, radiusKm: 380, kind: "range", continent: "asia" },
  { id: "tien-shan", nameKk: "Тянь-Шань", accusativeKk: "Тянь-Шаньды", lat: 42.1, lng: 80.2, radiusKm: 240, kind: "range", continent: "asia" },
  { id: "altai", nameKk: "Алтай таулары", accusativeKk: "Алтай тауларын", lat: 49.5, lng: 87.5, radiusKm: 180, kind: "range", continent: "asia" },
  { id: "hindu-kush", nameKk: "Гиндукуш", accusativeKk: "Гиндукушты", lat: 35.4, lng: 70.2, radiusKm: 180, kind: "range", continent: "asia" },
  { id: "zagros", nameKk: "Загрос таулары", accusativeKk: "Загрос тауларын", lat: 32.2, lng: 50.5, radiusKm: 240, kind: "range", continent: "asia" },
  { id: "caucasus", nameKk: "Кавказ таулары", accusativeKk: "Кавказ тауларын", lat: 42.7, lng: 44.2, radiusKm: 180, kind: "range", continent: "asia" },
  { id: "sayan", nameKk: "Саян таулары", accusativeKk: "Саян тауларын", lat: 53.2, lng: 94.8, radiusKm: 120, kind: "range", continent: "asia" },
  { id: "elburz", nameKk: "Эльбурс таулары", accusativeKk: "Эльбурс тауларын", lat: 36.2, lng: 52.1, radiusKm: 80, kind: "range", continent: "asia" },
  { id: "alps", nameKk: "Альпі таулары", accusativeKk: "Альпі тауларын", lat: 46.4, lng: 9.2, radiusKm: 220, kind: "range", continent: "europe" },
  { id: "carpathians", nameKk: "Карпат таулары", accusativeKk: "Карпат тауларын", lat: 47.2, lng: 25.2, radiusKm: 170, kind: "range", continent: "europe" },
  { id: "pyrenees", nameKk: "Пиреней таулары", accusativeKk: "Пиреней тауларын", lat: 42.7, lng: 0.7, radiusKm: 110, kind: "range", continent: "europe" },
  { id: "urals", nameKk: "Орал таулары", accusativeKk: "Орал тауларын", lat: 60, lng: 59.2, radiusKm: 280, kind: "range", continent: "europe" },
  { id: "apennines", nameKk: "Апеннин таулары", accusativeKk: "Апеннин тауларын", lat: 42.8, lng: 13.2, radiusKm: 100, kind: "range", continent: "europe" },
  { id: "scandes", nameKk: "Скандинавия таулары", accusativeKk: "Скандинавия тауларын", lat: 62.5, lng: 8.2, radiusKm: 180, kind: "range", continent: "europe" },
  { id: "dinaric", nameKk: "Динар таулары", accusativeKk: "Динар тауларын", lat: 43.5, lng: 18.3, radiusKm: 90, kind: "range", continent: "europe" },
  { id: "highlands", nameKk: "Шотландия таулығы", accusativeKk: "Шотландия таулығын", lat: 57.1, lng: -4.7, radiusKm: 90, kind: "range", continent: "europe" },
  { id: "west-siberian-plain", nameKk: "Батыс Сібір жазығы", accusativeKk: "Батыс Сібір жазығын", lat: 61, lng: 74, radiusKm: 480, kind: "plain", continent: "asia" },
  { id: "great-chinese-plain", nameKk: "Ұлы Қытай жазығы", accusativeKk: "Ұлы Қытай жазығын", lat: 35, lng: 115.5, radiusKm: 260, kind: "plain", continent: "asia" },
  { id: "indo-gangetic-plain", nameKk: "Үнді-Ганг жазығы", accusativeKk: "Үнді-Ганг жазығын", lat: 26.5, lng: 81.5, radiusKm: 320, kind: "plain", continent: "asia" },
  { id: "turan-plain", nameKk: "Тұран жазығы", accusativeKk: "Тұран жазығын", lat: 42.5, lng: 59.5, radiusKm: 280, kind: "plain", continent: "asia" },
  { id: "mesopotamian-plain", nameKk: "Месопотамия жазығы", accusativeKk: "Месопотамия жазығын", lat: 32.8, lng: 44.6, radiusKm: 160, kind: "plain", continent: "asia" },
  { id: "manchurian-plain", nameKk: "Маньчжур жазығы", accusativeKk: "Маньчжур жазығын", lat: 45.2, lng: 125.3, radiusKm: 200, kind: "plain", continent: "asia" },
  { id: "sichuan", nameKk: "Сычуань алабы", accusativeKk: "Сычуань алабын", lat: 30.6, lng: 104.2, radiusKm: 100, kind: "plain", continent: "asia" },
  { id: "mekong-plain", nameKk: "Меконг жазығы", accusativeKk: "Меконг жазығын", lat: 10.7, lng: 105.6, radiusKm: 90, kind: "plain", continent: "asia" },
  { id: "east-european-plain", nameKk: "Шығыс Еуропа жазығы", accusativeKk: "Шығыс Еуропа жазығын", lat: 54.5, lng: 38, radiusKm: 420, kind: "plain", continent: "europe" },
  { id: "hungarian-plain", nameKk: "Ұлы Мажар жазығы", accusativeKk: "Ұлы Мажар жазығын", lat: 47, lng: 20.2, radiusKm: 120, kind: "plain", continent: "europe" },
  { id: "north-german-plain", nameKk: "Солтүстік Германия жазығы", accusativeKk: "Солтүстік Германия жазығын", lat: 53, lng: 11, radiusKm: 140, kind: "plain", continent: "europe" },
  { id: "padan-plain", nameKk: "Падан жазығы", accusativeKk: "Падан жазығын", lat: 45.1, lng: 10.9, radiusKm: 80, kind: "plain", continent: "europe" },
  { id: "paris-basin", nameKk: "Париж алабы", accusativeKk: "Париж алабын", lat: 48.6, lng: 2.3, radiusKm: 80, kind: "plain", continent: "europe" },
  { id: "wallachian-plain", nameKk: "Валахия жазығы", accusativeKk: "Валахия жазығын", lat: 44.5, lng: 26.4, radiusKm: 90, kind: "plain", continent: "europe" },
  { id: "english-lowlands", nameKk: "Англия ойпаты", accusativeKk: "Англия ойпатын", lat: 52.2, lng: -1.2, radiusKm: 80, kind: "plain", continent: "europe" },
  { id: "andalusian-plain", nameKk: "Андалусия жазығы", accusativeKk: "Андалусия жазығын", lat: 37.4, lng: -5, radiusKm: 80, kind: "plain", continent: "europe" },
  { id: "yangtze", nameKk: "Янцзы өзені", accusativeKk: "Янцзы өзенін", lat: 30.58, lng: 114.3, radiusKm: 90, kind: "river", continent: "asia" },
  { id: "yellow-river", nameKk: "Хуанхэ өзені", accusativeKk: "Хуанхэ өзенін", lat: 34.95, lng: 113.65, radiusKm: 80, kind: "river", continent: "asia" },
  { id: "ob", nameKk: "Обь өзені", accusativeKk: "Обь өзенін", lat: 55.01, lng: 82.94, radiusKm: 110, kind: "river", continent: "asia" },
  { id: "yenisei", nameKk: "Енисей өзені", accusativeKk: "Енисей өзенін", lat: 56.02, lng: 92.87, radiusKm: 110, kind: "river", continent: "asia" },
  { id: "lena", nameKk: "Лена өзені", accusativeKk: "Лена өзенін", lat: 62.03, lng: 129.73, radiusKm: 120, kind: "river", continent: "asia" },
  { id: "ganges", nameKk: "Ганг өзені", accusativeKk: "Ганг өзенін", lat: 25.32, lng: 83.01, radiusKm: 80, kind: "river", continent: "asia" },
  { id: "indus", nameKk: "Үнді өзені", accusativeKk: "Үнді өзенін", lat: 27.7, lng: 68.86, radiusKm: 90, kind: "river", continent: "asia" },
  { id: "mekong", nameKk: "Меконг өзені", accusativeKk: "Меконг өзенін", lat: 17.96, lng: 102.62, radiusKm: 80, kind: "river", continent: "asia" },
  { id: "volga", nameKk: "Еділ өзені", accusativeKk: "Еділ өзенін", lat: 53.2, lng: 50.1, radiusKm: 110, kind: "river", continent: "europe" },
  { id: "danube", nameKk: "Дунай өзені", accusativeKk: "Дунай өзенін", lat: 47.49, lng: 19.05, radiusKm: 70, kind: "river", continent: "europe" },
  { id: "rhine", nameKk: "Рейн өзені", accusativeKk: "Рейн өзенін", lat: 50.9, lng: 6.9, radiusKm: 60, kind: "river", continent: "europe" },
  { id: "seine", nameKk: "Сена өзені", accusativeKk: "Сена өзенін", lat: 48.85, lng: 2.35, radiusKm: 45, kind: "river", continent: "europe" },
  { id: "vistula", nameKk: "Висла өзені", accusativeKk: "Висла өзенін", lat: 52.2, lng: 21, radiusKm: 55, kind: "river", continent: "europe" },
  { id: "dnieper", nameKk: "Днепр өзені", accusativeKk: "Днепр өзенін", lat: 48.4, lng: 33.8, radiusKm: 70, kind: "river", continent: "europe" },
  { id: "loire", nameKk: "Луара өзені", accusativeKk: "Луара өзенін", lat: 47.4, lng: 0.7, radiusKm: 50, kind: "river", continent: "europe" },
  { id: "po", nameKk: "По өзені", accusativeKk: "По өзенін", lat: 45, lng: 11, radiusKm: 40, kind: "river", continent: "europe" },
  { id: "caspian", nameKk: "Каспий теңізі", accusativeKk: "Каспий теңізін", lat: 42, lng: 50.6, radiusKm: 320, kind: "lake", continent: "asia" },
  { id: "baikal", nameKk: "Байкал көлі", accusativeKk: "Байкал көлін", lat: 53.55, lng: 108.2, radiusKm: 180, kind: "lake", continent: "asia" },
  { id: "balkhash", nameKk: "Балқаш көлі", accusativeKk: "Балқаш көлін", lat: 46.2, lng: 75, radiusKm: 140, kind: "lake", continent: "asia" },
  { id: "aral", nameKk: "Арал теңізі", accusativeKk: "Арал теңізін", lat: 45.4, lng: 59.6, radiusKm: 120, kind: "lake", continent: "asia" },
  { id: "issyk-kul", nameKk: "Ыстықкөл", accusativeKk: "Ыстықкөлді", lat: 42.42, lng: 77.25, radiusKm: 50, kind: "lake", continent: "asia" },
  { id: "qinghai", nameKk: "Цинхай көлі", accusativeKk: "Цинхай көлін", lat: 36.88, lng: 100.14, radiusKm: 45, kind: "lake", continent: "asia" },
  { id: "van", nameKk: "Ван көлі", accusativeKk: "Ван көлін", lat: 38.63, lng: 42.85, radiusKm: 40, kind: "lake", continent: "asia" },
  { id: "khanka", nameKk: "Ханка көлі", accusativeKk: "Ханка көлін", lat: 45, lng: 132.4, radiusKm: 40, kind: "lake", continent: "asia" },
  { id: "ladoga", nameKk: "Ладога көлі", accusativeKk: "Ладога көлін", lat: 60.85, lng: 31.5, radiusKm: 70, kind: "lake", continent: "europe" },
  { id: "onega", nameKk: "Онега көлі", accusativeKk: "Онега көлін", lat: 61.7, lng: 35.5, radiusKm: 70, kind: "lake", continent: "europe" },
  { id: "vanern", nameKk: "Венерн көлі", accusativeKk: "Венерн көлін", lat: 58.9, lng: 13.3, radiusKm: 40, kind: "lake", continent: "europe" },
  { id: "geneva", nameKk: "Женева көлі", accusativeKk: "Женева көлін", lat: 46.45, lng: 6.55, radiusKm: 25, kind: "lake", continent: "europe" },
  { id: "balaton", nameKk: "Балатон көлі", accusativeKk: "Балатон көлін", lat: 46.85, lng: 17.75, radiusKm: 30, kind: "lake", continent: "europe" },
  { id: "constance", nameKk: "Боден көлі", accusativeKk: "Боден көлін", lat: 47.6, lng: 9.4, radiusKm: 25, kind: "lake", continent: "europe" },
  { id: "peipus", nameKk: "Чуд көлі", accusativeKk: "Чуд көлін", lat: 58.7, lng: 27.4, radiusKm: 40, kind: "lake", continent: "europe" },
  { id: "garda", nameKk: "Гарда көлі", accusativeKk: "Гарда көлін", lat: 45.65, lng: 10.7, radiusKm: 20, kind: "lake", continent: "europe" },
  { id: "arabian-sea", nameKk: "Араб теңізі", accusativeKk: "Араб теңізін", lat: 16, lng: 64.5, radiusKm: 420, kind: "sea", continent: "asia" },
  { id: "south-china-sea", nameKk: "Оңтүстік Қытай теңізі", accusativeKk: "Оңтүстік Қытай теңізін", lat: 13.5, lng: 114.5, radiusKm: 420, kind: "sea", continent: "asia" },
  { id: "sea-of-japan", nameKk: "Жапон теңізі", accusativeKk: "Жапон теңізін", lat: 40, lng: 135, radiusKm: 260, kind: "sea", continent: "asia" },
  { id: "okhotsk", nameKk: "Охот теңізі", accusativeKk: "Охот теңізін", lat: 54.5, lng: 149.5, radiusKm: 360, kind: "sea", continent: "asia" },
  { id: "bering", nameKk: "Беринг теңізі", accusativeKk: "Беринг теңізін", lat: 57.5, lng: 175, radiusKm: 380, kind: "sea", continent: "asia" },
  { id: "red-sea", nameKk: "Қызыл теңіз", accusativeKk: "Қызыл теңізді", lat: 20.5, lng: 38.5, radiusKm: 180, kind: "sea", continent: "asia" },
  { id: "east-china-sea", nameKk: "Шығыс Қытай теңізі", accusativeKk: "Шығыс Қытай теңізін", lat: 29.5, lng: 125.2, radiusKm: 150, kind: "sea", continent: "asia" },
  { id: "philippine-sea", nameKk: "Филиппин теңізі", accusativeKk: "Филиппин теңізін", lat: 18, lng: 133, radiusKm: 170, kind: "sea", continent: "asia" },
  { id: "mediterranean", nameKk: "Жерорта теңізі", accusativeKk: "Жерорта теңізін", lat: 35.5, lng: 18, radiusKm: 400, kind: "sea", continent: "europe" },
  { id: "black-sea", nameKk: "Қара теңіз", accusativeKk: "Қара теңізді", lat: 43.3, lng: 34.2, radiusKm: 240, kind: "sea", continent: "europe" },
  { id: "baltic", nameKk: "Балтық теңізі", accusativeKk: "Балтық теңізін", lat: 58, lng: 20, radiusKm: 200, kind: "sea", continent: "europe" },
  { id: "north-sea", nameKk: "Солтүстік теңіз", accusativeKk: "Солтүстік теңізді", lat: 56.5, lng: 3.5, radiusKm: 180, kind: "sea", continent: "europe" },
  { id: "barents", nameKk: "Баренц теңізі", accusativeKk: "Баренц теңізін", lat: 74, lng: 38, radiusKm: 300, kind: "sea", continent: "europe" },
  { id: "norwegian-sea", nameKk: "Норвег теңізі", accusativeKk: "Норвег теңізін", lat: 68, lng: 3, radiusKm: 160, kind: "sea", continent: "europe" },
  { id: "adriatic", nameKk: "Адрия теңізі", accusativeKk: "Адрия теңізін", lat: 43, lng: 15.5, radiusKm: 70, kind: "sea", continent: "europe" },
  { id: "aegean", nameKk: "Эгей теңізі", accusativeKk: "Эгей теңізін", lat: 38.5, lng: 25.2, radiusKm: 80, kind: "sea", continent: "europe" },
  { id: "persian-gulf", nameKk: "Парсы шығанағы", accusativeKk: "Парсы шығанағын", lat: 27, lng: 51.2, radiusKm: 180, kind: "gulf", continent: "asia" },
  { id: "bay-of-bengal", nameKk: "Бенгал шығанағы", accusativeKk: "Бенгал шығанағын", lat: 15, lng: 88, radiusKm: 380, kind: "gulf", continent: "asia" },
  { id: "gulf-of-thailand", nameKk: "Тай шығанағы", accusativeKk: "Тай шығанағын", lat: 10.2, lng: 100.8, radiusKm: 180, kind: "gulf", continent: "asia" },
  { id: "bohai", nameKk: "Бохай шығанағы", accusativeKk: "Бохай шығанағын", lat: 38.7, lng: 119.6, radiusKm: 120, kind: "gulf", continent: "asia" },
  { id: "gulf-of-aden", nameKk: "Аден шығанағы", accusativeKk: "Аден шығанағын", lat: 12.4, lng: 48, radiusKm: 180, kind: "gulf", continent: "asia" },
  { id: "anadyr-gulf", nameKk: "Анадыр шығанағы", accusativeKk: "Анадыр шығанағын", lat: 64.2, lng: 178.2, radiusKm: 130, kind: "gulf", continent: "asia" },
  { id: "gulf-of-oman", nameKk: "Оман шығанағы", accusativeKk: "Оман шығанағын", lat: 24.6, lng: 58.8, radiusKm: 140, kind: "gulf", continent: "asia" },
  { id: "tonkin", nameKk: "Тонкин шығанағы", accusativeKk: "Тонкин шығанағын", lat: 20, lng: 108, radiusKm: 90, kind: "gulf", continent: "asia" },
  { id: "gulf-of-finland", nameKk: "Фин шығанағы", accusativeKk: "Фин шығанағын", lat: 60, lng: 26.5, radiusKm: 80, kind: "gulf", continent: "europe" },
  { id: "biscay", nameKk: "Бискай шығанағы", accusativeKk: "Бискай шығанағын", lat: 45.2, lng: -3.8, radiusKm: 160, kind: "gulf", continent: "europe" },
  { id: "bothnia", nameKk: "Ботния шығанағы", accusativeKk: "Ботния шығанағын", lat: 62.3, lng: 19.8, radiusKm: 150, kind: "gulf", continent: "europe" },
  { id: "riga", nameKk: "Рига шығанағы", accusativeKk: "Рига шығанағын", lat: 57.6, lng: 23.7, radiusKm: 50, kind: "gulf", continent: "europe" },
  { id: "lion", nameKk: "Лион шығанағы", accusativeKk: "Лион шығанағын", lat: 42.9, lng: 4.2, radiusKm: 55, kind: "gulf", continent: "europe" },
  { id: "genoa", nameKk: "Генуя шығанағы", accusativeKk: "Генуя шығанағын", lat: 44.2, lng: 8.9, radiusKm: 40, kind: "gulf", continent: "europe" },
  { id: "venice", nameKk: "Венеция шығанағы", accusativeKk: "Венеция шығанағын", lat: 45.3, lng: 12.8, radiusKm: 35, kind: "gulf", continent: "europe" },
  { id: "cadiz", nameKk: "Кадис шығанағы", accusativeKk: "Кадис шығанағын", lat: 36.6, lng: -7, radiusKm: 50, kind: "gulf", continent: "europe" },
  { id: "gobi", nameKk: "Гоби шөлі", accusativeKk: "Гоби шөлін", lat: 42.6, lng: 103.8, radiusKm: 220, kind: "desert", continent: "asia" },
  { id: "karakum", nameKk: "Қарақұм", accusativeKk: "Қарақұмды", lat: 39.4, lng: 59.6, radiusKm: 160, kind: "desert", continent: "asia" },
  { id: "taklamakan", nameKk: "Такла-Макан шөлі", accusativeKk: "Такла-Макан шөлін", lat: 39, lng: 82.6, radiusKm: 180, kind: "desert", continent: "asia" },
  { id: "thar", nameKk: "Тар шөлі", accusativeKk: "Тар шөлін", lat: 27.2, lng: 71.2, radiusKm: 150, kind: "desert", continent: "asia" },
  { id: "arabian-desert", nameKk: "Араб шөлі", accusativeKk: "Араб шөлін", lat: 23.2, lng: 45.2, radiusKm: 240, kind: "desert", continent: "asia" },
  { id: "kyzylkum", nameKk: "Қызылқұм", accusativeKk: "Қызылқұмды", lat: 43.6, lng: 63.5, radiusKm: 90, kind: "desert", continent: "asia" },
  { id: "syrian-desert", nameKk: "Сирия шөлі", accusativeKk: "Сирия шөлін", lat: 33.2, lng: 38.4, radiusKm: 110, kind: "desert", continent: "asia" },
  { id: "lut", nameKk: "Деште-Лут шөлі", accusativeKk: "Деште-Лут шөлін", lat: 30.5, lng: 58.8, radiusKm: 70, kind: "desert", continent: "asia" },
  { id: "tabernas", nameKk: "Табернас шөлі", accusativeKk: "Табернас шөлін", lat: 37.02, lng: -2.45, radiusKm: 40, kind: "desert", continent: "europe" },
  { id: "bardenas", nameKk: "Барденас шөлейті", accusativeKk: "Барденас шөлейтін", lat: 42.2, lng: -1.45, radiusKm: 35, kind: "desert", continent: "europe" },
  { id: "accona", nameKk: "Аккона шөлі", accusativeKk: "Аккона шөлін", lat: 43.18, lng: 11.55, radiusKm: 30, kind: "desert", continent: "europe" },
  { id: "oltenia", nameKk: "Олтения шөлейті", accusativeKk: "Олтения шөлейтін", lat: 43.95, lng: 23.6, radiusKm: 45, kind: "desert", continent: "europe" },
  { id: "bledow", nameKk: "Блендув шөлейті", accusativeKk: "Блендув шөлейтін", lat: 50.35, lng: 19.52, radiusKm: 30, kind: "desert", continent: "europe" },
  { id: "oleshky", nameKk: "Олешки шөлі", accusativeKk: "Олешки шөлін", lat: 46.55, lng: 32.95, radiusKm: 45, kind: "desert", continent: "europe" },
  { id: "sprengisandur", nameKk: "Спренгисандур шөлі", accusativeKk: "Спренгисандур шөлін", lat: 64.75, lng: -18, radiusKm: 50, kind: "desert", continent: "europe" },
  { id: "svalbard-desert", nameKk: "Свальбард шөлі", accusativeKk: "Свальбард шөлін", lat: 78.2, lng: 16, radiusKm: 60, kind: "desert", continent: "europe" },
];

const lessonTitles = ["Мемлекеттер", "Аралдар", "Түбектер", "Таулар", "Жазықтар", "Өзендер", "Көлдер", "Теңіздер", "Шығанақтар", "Шөлдер"] as const;

export const lessons: Lesson[] = [
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
  {
    id: "europe-deserts",
    moduleId: "eurasia",
    continentId: "europe",
    titleKk: "Шөлдер",
    order: 10,
    placeIds: ["tabernas", "bardenas", "accona", "oltenia", "bledow", "oleshky", "sprengisandur", "svalbard-desert"],
  },
];

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
  const start = salt % ranked.length;
  const rotated = [...ranked.slice(start), ...ranked.slice(0, start)];
  const picked = rotated.slice(0, 3).map((place) => place.id);
  const merged = [correctId, ...picked];
  const shift = salt % merged.length;
  return [...merged.slice(shift), ...merged.slice(0, shift)];
}

const questionPattern = ["pinpoint", "identify", "pinpoint", "pick", "pinpoint", "identify", "pinpoint", "pick"] as const;

export function questionsForLesson(lessonId: string): Question[] {
  const lesson = getLesson(lessonId);
  return questionPattern.map((type, index) => {
    const placeId = lesson.placeIds[index];
    if (!placeId) throw new Error(`Lesson ${lessonId} needs at least 8 places`);
    const place = getPlace(placeId);
    const id = `${lessonId}-q${index + 1}`;
    if (type === "pinpoint") {
      return { id, type, placeId, promptKk: `${place.accusativeKk} картадан тап` };
    }
    if (type === "identify") {
      const named =
        place.kind === "country" ? "Бұл қай ел?" : place.kind === "island" ? "Бұл қай арал?" : place.kind === "peninsula" ? "Бұл қай түбек?" : null;
      return {
        id,
        type,
        placeId,
        promptKk: named ?? (index === 1 ? "Картадағы белгі қай нысан?" : "Бұл нысан қалай аталады?"),
        optionIds: optionIds(placeId, lesson.placeIds, index),
      };
    }
    return {
      id,
      type,
      placeId,
      promptKk: `«${place.nameKk}» қай жерде? Әріпті таңда.`,
      optionIds: optionIds(placeId, lesson.placeIds, index + 3),
    };
  });
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
    "europe-deserts",
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
  ];
  const used = new Set<string>();
  for (const continent of continents) {
    if (continent.lessonIds.length !== 10) throw new Error(`${continent.id} lesson count`);
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
    if (lesson.placeIds.length < 8 || lesson.placeIds.length > 12) throw new Error(`${lesson.id} size`);
    if (new Set(lesson.placeIds).size !== lesson.placeIds.length) throw new Error(`Duplicate place in ${lesson.id}`);
    const expectedKind = kindByTitle[lesson.titleKk as (typeof lessonTitles)[number]];
    const features = lesson.placeIds.map((placeId) => {
      const place = getPlace(placeId);
      if (used.has(placeId)) throw new Error(`Shared place ${placeId}`);
      used.add(placeId);
      if (place.continent !== lesson.continentId) throw new Error(`${placeId} is on the wrong continent`);
      if (place.kind !== expectedKind) throw new Error(`${placeId} kind`);
      if (place.lat < -11 || place.lat > 82 || place.lng < -30 || place.lng > 180) throw new Error(`${placeId} is outside the map`);
      if (place.continent === "europe" && (place.lng < -25 || place.lng > 62 || place.lat < 34)) {
        throw new Error(`${placeId} is not in Europe`);
      }
      if (place.continent === "asia" && place.lng < 32 && place.lat > 12) throw new Error(`${placeId} is not in Asia`);
      if (place.radiusKm < 20) throw new Error(`${placeId} radius`);
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
    const questions = questionsForLesson(lesson.id);
    if (questions.length !== 8) throw new Error(`${lesson.id} question count`);
    const types = new Set(questions.map((question) => question.type));
    if (!types.has("pinpoint") || (!types.has("identify") && !types.has("pick"))) {
      throw new Error(`${lesson.id} needs both task types`);
    }
    for (const question of questions) {
      if (question.type === "pinpoint") continue;
      if (question.optionIds.length !== 4 || new Set(question.optionIds).size !== 4) throw new Error(`Bad options ${question.id}`);
      if (!question.optionIds.includes(question.placeId)) throw new Error(`Missing answer ${question.id}`);
    }
  }
  if (used.size !== places.length) throw new Error("Unused place");
  const asiaDeserts = new Set(getLesson("asia-deserts").placeIds);
  for (const id of ["gobi", "karakum", "taklamakan", "thar", "arabian-desert"]) {
    if (!asiaDeserts.has(id)) throw new Error(`Asia deserts missing ${id}`);
  }
  for (const placeId of getLesson("europe-deserts").placeIds) {
    const name = getPlace(placeId).nameKk;
    if (!name.includes("шөл") && !name.includes("шөлейт")) throw new Error(`${placeId} needs a desert label`);
  }
}

validateCurriculum();
