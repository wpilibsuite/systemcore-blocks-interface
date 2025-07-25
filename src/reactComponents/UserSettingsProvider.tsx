/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview React component for managing user settings data.
 * This component uses the storage interface to persist user preferences.
 */

import * as React from 'react';
import { Storage } from '../storage/common_storage';

/** Storage keys for user settings. */
const USER_LANGUAGE_KEY = 'userLanguage';
const USER_THEME_KEY = 'userTheme';
const USER_OPEN_TABS_KEY_PREFIX = 'userOpenTabs';

/** Default values for user settings. */
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_THEME = 'dark';
const DEFAULT_OPEN_TABS: string[] = [];

/** User settings interface. */
export interface UserSettings {
  language: string;
  theme: string;
  openTabs: string[];
}

/** User settings context interface. */
export interface UserSettingsContextType {
  settings: UserSettings;
  updateLanguage: (language: string) => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
  updateOpenTabs: (tabs: string[]) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  storage: Storage | null;
}

/** User settings context. */
export const UserSettingsContext = React.createContext<UserSettingsContextType | null>(null);

/** Props for UserSettingsProvider component. */
export interface UserSettingsProviderProps {
  storage?: Storage | null; // Optional storage, can be provided for testing
  currentProjectName?: string | null;
  children: React.ReactNode;
}

/** User settings provider component. */
export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({
  storage,
  currentProjectName,
  children,
}) => {
  const [settings, setSettings] = React.useState<UserSettings>({
    language: DEFAULT_LANGUAGE,
    theme: DEFAULT_THEME,
    openTabs: DEFAULT_OPEN_TABS,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  /** Generate project-specific storage key for open tabs. */
  const getOpenTabsKey = (projectName: string | null | undefined): string => {
    if (!projectName) {
      return `${USER_OPEN_TABS_KEY_PREFIX}_default`;
    }
    return `${USER_OPEN_TABS_KEY_PREFIX}_${projectName}`;
  };

  /** Load user settings from storage on component mount. */
  React.useEffect(() => {
    const loadSettings = async (validStorage: Storage): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const openTabsKey = getOpenTabsKey(currentProjectName);
        const [language, theme, openTabsJson] = await Promise.all([
          validStorage.fetchEntry(USER_LANGUAGE_KEY, DEFAULT_LANGUAGE),
          validStorage.fetchEntry(USER_THEME_KEY, DEFAULT_THEME),
          validStorage.fetchEntry(openTabsKey, JSON.stringify(DEFAULT_OPEN_TABS)),
        ]);

        let openTabs: string[];
        try {
          openTabs = JSON.parse(openTabsJson);
          if (!Array.isArray(openTabs)) {
            openTabs = DEFAULT_OPEN_TABS;
          }
        } catch {
          openTabs = DEFAULT_OPEN_TABS;
        }

        setSettings({
          language,
          theme,
          openTabs,
        });
      } catch (err) {
        setError(`Failed to load user settings: ${err}`);
        console.error('Error loading user settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (storage) {
      loadSettings(storage);
    } else {
      // If no storage is available, we're still "loaded" with default values
      setIsLoading(false);
    }
  }, [storage, currentProjectName]);

  /** Update language setting. */
  const updateLanguage = async (language: string): Promise<void> => {
    try {
      setError(null);
      if (storage) {
        await storage.saveEntry(USER_LANGUAGE_KEY, language);
        setSettings(prev => ({ ...prev, language }));
      } else {
        console.warn('No storage available, cannot save language');
      }
    } catch (err) {
      setError(`Failed to save language setting: ${err}`);
      console.error('Error saving language setting:', err);
      throw err;
    }
  };

  /** Update theme setting. */
  const updateTheme = async (theme: string): Promise<void> => {
    try {
      setError(null);
      if (storage) {
        await storage.saveEntry(USER_THEME_KEY, theme);
        setSettings(prev => ({ ...prev, theme }));
      }
    } catch (err) {
      setError(`Failed to save theme setting: ${err}`);
      console.error('Error saving theme setting:', err);
      throw err;
    }
  };

  /** Update open tabs setting. */
  const updateOpenTabs = async (tabs: string[]): Promise<void> => {
    try {
      setError(null);
      const openTabsKey = getOpenTabsKey(currentProjectName);
      if (storage) {
        await storage.saveEntry(openTabsKey, JSON.stringify(tabs));
        setSettings(prev => ({ ...prev, openTabs: tabs }));        
      }
    } catch (err) {
      setError(`Failed to save open tabs setting: ${err}`);
      console.error('Error saving open tabs setting:', err);
      throw err;
    }
  };

  const contextValue: UserSettingsContextType = {
    settings,
    updateLanguage,
    updateTheme,
    updateOpenTabs,
    isLoading,
    error,
    storage: storage || null,
  };

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
};
