import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import az from "./locales/az.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export const LANGUAGE_KEY = "language";
export const SUPPORTED_LANGUAGES = ["az", "en", "ru"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const DEFAULT_LANGUAGE: Language = "az";

const isSupportedLanguage = (value: string | null): value is Language =>
  !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

i18n.use(initReactI18next).init({
  resources: {
    az: { translation: az },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

export const changeLanguage = async (language: Language) => {
  await i18n.changeLanguage(language);
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.log("language save error:", error);
  }
};

// Restore the language the user picked last time.
(async () => {
  try {
    const saved = (await AsyncStorage.getItem(LANGUAGE_KEY))?.toLowerCase() ?? null;
    if (isSupportedLanguage(saved) && saved !== i18n.language) {
      await i18n.changeLanguage(saved);
    }
  } catch (error) {
    console.log("language load error:", error);
  }
})();

export default i18n;
