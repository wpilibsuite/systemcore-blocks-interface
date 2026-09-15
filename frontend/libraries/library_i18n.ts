/**
 * @license
 * Copyright 2026 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Translates the strings from third party libraries.
 *
 * A string in a library that is exactly %{KEY} is a reference to a message in the library's
 * locales/<language>.json files. See blocks_lib.getReferenceKey.
 */

import i18n from 'i18next';
import {
    DEFAULT_LOCALE,
    getDisplayName,
    getReferenceKey,
    Library,
    lookupMessage,
    parseQualifiedReference } from './blocks_lib';
import { getInstalledLibrary } from './library_registry';

/** Returns the language that the app is currently shown in. */
export function getCurrentLanguage(): string {
  return i18n.language || DEFAULT_LOCALE;
}

/**
 * Returns the text translated into the given language, if it is a reference to a message in the
 * library's locales. Otherwise returns the text unchanged. A message that isn't translated into
 * the language, like "es-MX", falls back to its base language, like "es", then to the default
 * locale, and then to the key.
 */
export function localizeLibraryText(
    library: Library | undefined, text: string, language: string = getCurrentLanguage()): string {
  const key = getReferenceKey(text);
  if (!key) {
    return text;
  }
  const languages = [language, language.split('-')[0], DEFAULT_LOCALE];
  for (const lng of languages) {
    const message = lookupMessage(library?.locales?.[lng], key);
    if (message !== undefined) {
      return message;
    }
  }
  return key;
}

/** Returns the name of the library that is shown to the user, in the given language. */
export function getLocalizedDisplayName(
    library: Library, language: string = getCurrentLanguage()): string {
  return localizeLibraryText(library, getDisplayName(library.metadata), language);
}

/**
 * Returns the text translated into the current language, if it is a qualified reference to a
 * message in an installed library, like the tooltips saved in blocks. If the library isn't
 * installed, returns the key. Otherwise returns the text unchanged.
 */
export function localizeInstalledLibraryText(text: string): string {
  const reference = parseQualifiedReference(text);
  if (!reference) {
    return text;
  }
  return localizeLibraryText(
      getInstalledLibrary(reference.libraryName), `%{${reference.key}}`, getCurrentLanguage());
}
