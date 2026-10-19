export type FlagOption = {
  code: string;
  nameKk: string;
};

export const flagOptions: FlagOption[] = [
  { code: "kz", nameKk: "Қазақстан" },
  { code: "cn", nameKk: "Қытай" },
  { code: "in", nameKk: "Үндістан" },
  { code: "jp", nameKk: "Жапония" },
  { code: "tr", nameKk: "Түркия" },
  { code: "ir", nameKk: "Иран" },
  { code: "mn", nameKk: "Моңғолия" },
  { code: "kr", nameKk: "Оңтүстік Корея" },
  { code: "sa", nameKk: "Сауд Арабиясы" },
  { code: "id", nameKk: "Индонезия" },
  { code: "ru", nameKk: "Ресей" },
  { code: "uz", nameKk: "Өзбекстан" },
  { code: "kg", nameKk: "Қырғызстан" },
  { code: "tj", nameKk: "Тәжікстан" },
  { code: "tm", nameKk: "Түрікменстан" },
  { code: "az", nameKk: "Әзербайжан" },
  { code: "am", nameKk: "Армения" },
  { code: "ge", nameKk: "Грузия" },
  { code: "by", nameKk: "Беларусь" },
  { code: "pk", nameKk: "Пәкістан" },
  { code: "fr", nameKk: "Франция" },
  { code: "de", nameKk: "Германия" },
  { code: "it", nameKk: "Италия" },
  { code: "es", nameKk: "Испания" },
  { code: "pl", nameKk: "Польша" },
  { code: "ua", nameKk: "Украина" },
  { code: "gb", nameKk: "Ұлыбритания" },
  { code: "ro", nameKk: "Румыния" },
  { code: "gr", nameKk: "Грекия" },
  { code: "se", nameKk: "Швеция" },
  { code: "no", nameKk: "Норвегия" },
  { code: "fi", nameKk: "Финляндия" },
  { code: "nl", nameKk: "Нидерланд" },
  { code: "pt", nameKk: "Португалия" },
  { code: "at", nameKk: "Австрия" },
  { code: "cz", nameKk: "Чехия" },
  { code: "hu", nameKk: "Мажарстан" },
  { code: "bg", nameKk: "Болгария" },
  { code: "rs", nameKk: "Сербия" },
  { code: "hr", nameKk: "Хорватия" },
];

const flagCodes = new Set(flagOptions.map((flag) => flag.code));

export function isFlagCode(value: unknown): value is string {
  return typeof value === "string" && flagCodes.has(value);
}
