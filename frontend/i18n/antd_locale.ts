// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview The Ant Design and dayjs locales for each of the app's languages, so that Ant
 * Design's own text (such as the date picker's months and buttons) and the dates it formats are
 * in the user's language.
 */
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/he';
import type { ConfigProviderProps } from 'antd';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import frFR from 'antd/locale/fr_FR';
import heIL from 'antd/locale/he_IL';

type Locale = NonNullable<ConfigProviderProps['locale']>;

/** The Ant Design locale for each language in frontend/i18n/locales/. */
const ANTD_LOCALES: {[language: string]: Locale} = {
  en: enUS,
  es: esES,
  fr: frFR,
  he: heIL,
};

/** The dayjs locale for each language. dayjs includes English. */
const DAYJS_LOCALES: {[language: string]: string} = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  he: 'he',
};

/** Returns the Ant Design locale for a language, or English if there isn't one. */
export function getAntdLocale(language: string): Locale {
  return ANTD_LOCALES[language] ?? enUS;
}

/**
 * Sets the language of the dates that dayjs formats and parses, which the date picker uses (for
 * example, the first day of the week). Unlike the Ant Design locale, this is global.
 */
export function setDayjsLocale(language: string): void {
  dayjs.locale(DAYJS_LOCALES[language] ?? 'en');
}
