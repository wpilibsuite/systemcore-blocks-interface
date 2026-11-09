// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Configuration for i18n
 * @author alan@porpoiseful.com (Alan Smith)
 * 
 * This is mostly borrowed with a few adaptations from 
 * https://phrase.com/blog/posts/localizing-react-apps-with-i18next/
 */
import i18n from "i18next";      
import HttpApi from "i18next-http-backend";                
import { initReactI18next } from "react-i18next";

i18n
  // Add backend as a plugin so we can load the needed translation at runtime
  .use(HttpApi)
  // Add React bindings as a plugin so it will re-render when language changes
  .use(initReactI18next)
  .init({
    // Config options

    // Specifies the default language (locale) used
    // when a user visits our site for the first time.
    lng: "en",

    // Fallback locale used when a translation is missing.
    fallbackLng: "en",

    // Normally, we want `escapeValue: true` as it ensures that i18next escapes any code in
    // translation messages, safeguarding against XSS (cross-site scripting) attacks. However,
    // React does this escaping itself, so we turn it off in i18next.
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Path to the translation files
      loadPath: import.meta.env.BASE_URL + "locales/{{lng}}.json",
    },
  });

export default i18n;