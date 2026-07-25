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
const USER_SHOW_SIMPLE_CLASS_NAMES_KEY = 'userShowSimpleClassNames';
const USER_RENDERER_KEY = 'userRenderer';
/** Stores the most recently used zoom level across all modules. */
const USER_LAST_ZOOM_KEY = 'userLastZoom';

/** Default values for user settings. */
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_THEME = 'dark';
export const DEFAULT_SHOW_SIMPLE_CLASS_NAMES = true;
export const DEFAULT_RENDERER = 'zelos';
/** The zoom level (e.g. 1.0 = 100%) used when the user has never set a zoom level. */
export const DEFAULT_ZOOM = 1.0;

/** Sentinel returned by fetchEntry when a module has no zoom level saved yet. */
const NO_SAVED_MODULE_ZOOM = '__no_saved_module_zoom__';

/** Sentinel returned by fetchEntry when a module has no scroll position saved yet. */
const NO_SAVED_MODULE_SCROLL = '__no_saved_module_scroll__';

/** Helper function to generate project-specific storage key for open tabs. */
const getUserOptionsKey = (projectName: string): string => `user_options_${projectName}`;

/** Helper function to generate the storage key for a module's saved zoom level. */
const getModuleZoomKey = (modulePath: string): string => `userZoom_${modulePath}`;

/** Helper function to generate the storage key for a module's saved scroll position. */
const getModuleScrollKey = (modulePath: string): string => `userScroll_${modulePath}`;

/** A workspace scroll position (the coordinates of the upper-left corner of the view). */
export interface ModuleScroll {
  x: number;
  y: number;
}

/** The scroll position used for a module that has no scroll position saved. */
export const DEFAULT_MODULE_SCROLL: ModuleScroll = { x: 0, y: 0 };

/** User settings interface. */
export interface UserSettings {
  language: string;
  theme: string;
  showSimpleClassNames: boolean;
  renderer: string;
}

/** User settings context interface. */
export interface UserSettingsContextType {
  settings: UserSettings;
  updateLanguage: (language: string) => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
  updateShowSimpleClassNames: (showSimpleClassNames: boolean) => Promise<void>;
  updateRenderer: (renderer: string) => Promise<void>;
  updateOpenTabs: (projectName: string, tabPaths: string[]) => Promise<void>;
  getOpenTabs: (projectName: string) => Promise<string[]>;
  /** Gets the saved zoom level for a module, or DEFAULT_ZOOM if none is saved. */
  getModuleZoom: (modulePath: string) => Promise<number>;
  /** Saves the zoom level for a module. */
  updateModuleZoom: (modulePath: string, zoom: number) => Promise<void>;
  /** Gets the saved scroll position for a module, or DEFAULT_MODULE_SCROLL if none is saved. */
  getModuleScroll: (modulePath: string) => Promise<ModuleScroll>;
  /** Saves the scroll position for a module, unless it's (0, 0). */
  updateModuleScroll: (modulePath: string, x: number, y: number) => Promise<void>;
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
    showSimpleClassNames: DEFAULT_SHOW_SIMPLE_CLASS_NAMES,
    renderer: DEFAULT_RENDERER,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  /** Load user settings from storage on component mount. */
  React.useEffect(() => {
    const loadSettings = async (validStorage: Storage): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const [language, theme, showSimpleClassNames, renderer] = await Promise.all([
          validStorage.fetchEntry(USER_LANGUAGE_KEY, DEFAULT_LANGUAGE),
          validStorage.fetchEntry(USER_THEME_KEY, DEFAULT_THEME),
          validStorage.fetchEntry(USER_SHOW_SIMPLE_CLASS_NAMES_KEY, DEFAULT_SHOW_SIMPLE_CLASS_NAMES.toString()),
          validStorage.fetchEntry(USER_RENDERER_KEY, DEFAULT_RENDERER),
        ]);

        setSettings({
          language,
          theme,
          showSimpleClassNames: showSimpleClassNames.toLowerCase() === "true",
          renderer,
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

  /** Update renderer setting. */
  const updateRenderer = async (renderer: string): Promise<void> => {
    try {
      setError(null);
      if (storage) {
        await storage.saveEntry(USER_RENDERER_KEY, renderer);
        setSettings(prev => ({ ...prev, renderer }));
      }
    } catch (err) {
      setError(`Failed to save renderer setting: ${err}`);
      console.error('Error saving renderer setting:', err);
      throw err;
    }
  };

  /**
   * Get the saved zoom level for a module. If the module has no zoom level of its own yet
   * (e.g. it was just created), returns the zoom level the user most recently used for any
   * module, since that's most likely what they expect. Falls back to DEFAULT_ZOOM if the user
   * has never set a zoom level at all.
   */
  const getModuleZoom = async (modulePath: string): Promise<number> => {
    try {
      if (!storage) {
        return DEFAULT_ZOOM;
      }

      const storageKey = getModuleZoomKey(modulePath);
      const zoomString = await storage.fetchEntry(storageKey, NO_SAVED_MODULE_ZOOM);
      if (zoomString !== NO_SAVED_MODULE_ZOOM) {
        const zoom = parseFloat(zoomString);
        if (!Number.isNaN(zoom)) {
          return zoom;
        }
      }

      const lastZoomString = await storage.fetchEntry(USER_LAST_ZOOM_KEY, DEFAULT_ZOOM.toString());
      const lastZoom = parseFloat(lastZoomString);
      return Number.isNaN(lastZoom) ? DEFAULT_ZOOM : lastZoom;
    } catch (err) {
      console.error(`Error loading zoom for module ${modulePath}:`, err);
      return DEFAULT_ZOOM;
    }
  };

  /** Save the zoom level for a module, and remember it as the most recently used zoom level. */
  const updateModuleZoom = async (modulePath: string, zoom: number): Promise<void> => {
    try {
      if (storage) {
        const storageKey = getModuleZoomKey(modulePath);
        await Promise.all([
          storage.saveEntry(storageKey, zoom.toString()),
          storage.saveEntry(USER_LAST_ZOOM_KEY, zoom.toString()),
        ]);
      } else {
        console.warn('No storage available, cannot save zoom for module');
      }
    } catch (err) {
      console.error(`Error saving zoom for module ${modulePath}:`, err);
      throw err;
    }
  };

  /** Get the saved scroll position for a module, or DEFAULT_MODULE_SCROLL if none is saved. */
  const getModuleScroll = async (modulePath: string): Promise<ModuleScroll> => {
    try {
      if (!storage) {
        return DEFAULT_MODULE_SCROLL;
      }

      const storageKey = getModuleScrollKey(modulePath);
      const scrollJson = await storage.fetchEntry(storageKey, JSON.stringify(DEFAULT_MODULE_SCROLL));
      const parsed = JSON.parse(scrollJson);
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
        return { x: parsed.x, y: parsed.y };
      }
      return DEFAULT_MODULE_SCROLL;
    } catch (err) {
      console.error(`Error loading scroll position for module ${modulePath}:`, err);
      return DEFAULT_MODULE_SCROLL;
    }
  };

  /**
   * Save the scroll position for a module. For the common case of (0, 0) on a module that has
   * nothing saved yet, skips the write - there's nothing worth persisting. But if (0, 0) is
   * reached after a different position had been saved, that old position must be explicitly
   * overwritten back to (0, 0); otherwise the next load would incorrectly restore it instead of
   * using the origin, since there's no way to delete a saved entry outright.
   */
  const updateModuleScroll = async (modulePath: string, x: number, y: number): Promise<void> => {
    try {
      if (!storage) {
        console.warn('No storage available, cannot save scroll position for module');
        return;
      }

      const storageKey = getModuleScrollKey(modulePath);
      if (x === 0 && y === 0) {
        const existing = await storage.fetchEntry(storageKey, NO_SAVED_MODULE_SCROLL);
        if (existing === NO_SAVED_MODULE_SCROLL) {
          return;
        }
      }
      await storage.saveEntry(storageKey, JSON.stringify({ x, y }));
    } catch (err) {
      console.error(`Error saving scroll position for module ${modulePath}:`, err);
      throw err;
    }
  };

  /** Update showSimpleClassNames setting. */
  const updateShowSimpleClassNames = async (showSimpleClassNames: boolean): Promise<void> => {
    try {
      setError(null);
      if (storage) {
        await storage.saveEntry(USER_SHOW_SIMPLE_CLASS_NAMES_KEY, showSimpleClassNames.toString());
        setSettings(prev => ({ ...prev, showSimpleClassNames }));
      }
    } catch (err) {
      setError(`Failed to save showPackageName setting: ${err}`);
      console.error('Error saving showPackageName setting:', err);
      throw err;
    }
  };

  /** Update open tabs for a specific project. */
  const updateOpenTabs = async (projectName: string, tabPaths: string[]): Promise<void> => {
    try {
      setError(null);
      
      if (storage) {
        const storageKey = getUserOptionsKey(projectName);
        await storage.saveEntry(storageKey, JSON.stringify(tabPaths));
      } else {
        console.warn('No storage available, cannot save open tabs');
      }
    } catch (err) {
      setError(`Failed to save open tabs: ${err}`);
      console.error('Error saving open tabs:', err);
      throw err;
    }
  };

  /** Get open tabs for a specific project. */
  const getOpenTabs = async (projectName: string): Promise<string[]> => {
    try {
      if (!storage) {
        return [];
      }
      
      const storageKey = getUserOptionsKey(projectName);
      const tabsJson = await storage.fetchEntry(storageKey, JSON.stringify([]));
      
      try {
        return JSON.parse(tabsJson);
      } catch (error) {
        console.warn(`Failed to parse open tabs for project ${projectName}, using default:`, error);
        return [];
      }
    } catch (err) {
      console.error(`Error loading open tabs for project ${projectName}:`, err);
      return [];
    }
  };

  const contextValue: UserSettingsContextType = {
    settings,
    updateLanguage,
    updateTheme,
    updateShowSimpleClassNames,
    updateRenderer,
    updateOpenTabs,
    getOpenTabs,
    getModuleZoom,
    updateModuleZoom,
    getModuleScroll,
    updateModuleScroll,
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

/** Custom hook to use user settings context. */
export const useUserSettings = (): UserSettingsContextType => {
  const context = React.useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};
