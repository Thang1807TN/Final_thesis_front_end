import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import pl from "./locales/pl";

// lấy từ localStorage
const savedLanguage = localStorage.getItem("app_language");

// detect browser nếu chưa có
const browserLang = navigator.language?.startsWith("pl") ? "pl" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },

  lng: savedLanguage || browserLang, // 👈 ưu tiên saved → fallback browser
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

  // 👇 QUAN TRỌNG: normalize en-US -> en
  load: "languageOnly",

  // 👇 tránh render lỗi lúc load
  react: {
    useSuspense: false,
  },
});

export default i18n;
