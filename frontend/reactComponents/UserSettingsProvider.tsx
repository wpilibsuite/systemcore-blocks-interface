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
import * as userSettings from '../storage/user_settings';
import { FIRST_BLOCKS_STYLE_RENDERER_NAME } from '../themes/first_blocks_style';

/** Default values for user settings. */
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_THEME = 'dark';
export const DEFAULT_SHOW_SIMPLE_CLASS_NAMES = true;
export const DEFAULT_RENDERER = FIRST_BLOCKS_STYLE_RENDERER_NAME;
/** The zoom level (e.g. 1.0 = 100%) used when the user has never set a zoom level. */
export const DEFAULT_ZOOM = 1.0;

/** A workspace scroll position (the coordinates of the upper-left corner of the view). */
export type ModuleScroll = userSettings.ModuleScroll;

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
  /** Saves the moduleIds of a project's open tabs. */
  updateOpenTabs: (projectId: string, moduleIds: string[]) => Promise<void>;
  /** Gets the moduleIds of a project's saved open tabs. */
  getOpenTabs: (projectId: string) => Promise<string[]>;
  /** Gets the saved zoom level for a module, or DEFAULT_ZOOM if none is saved. */
  getModuleZoom: (projectId: string, moduleId: string) => Promise<number>;
  /** Saves the zoom level for a module. */
  updateModuleZoom: (projectId: string, moduleId: string, zoom: number) => Promise<void>;
  /** Gets the saved scroll position for a module, or DEFAULT_MODULE_SCROLL if none is saved. */
  getModuleScroll: (projectId: string, moduleId: string) => Promise<ModuleScroll>;
  /** Saves the scroll position for a module, or deletes the saved one if it's (0, 0). */
  updateModuleScroll: (projectId: string, moduleId: string, x: number, y: number) => Promise<void>;
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

        const savedSettings = await userSettings.fetchUserSettings(validStorage);

        setSettings({
          language: savedSettings.language ?? DEFAULT_LANGUAGE,
          theme: savedSettings.theme ?? DEFAULT_THEME,
          showSimpleClassNames:
              savedSettings.showSimpleClassNames ?? DEFAULT_SHOW_SIMPLE_CLASS_NAMES,
          renderer: savedSettings.renderer ?? DEFAULT_RENDERER,
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
        await userSettings.updateUserSettings(storage, saved => {
          saved.language = language;
        });
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
        await userSettings.updateUserSettings(storage, saved => {
          saved.theme = theme;
        });
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
        await userSettings.updateUserSettings(storage, saved => {
          saved.renderer = renderer;
        });
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
  const getModuleZoom = async (projectId: string, moduleId: string): Promise<number> => {
    try {
      if (!storage) {
        return DEFAULT_ZOOM;
      }

      const { zoom } = await userSettings.fetchModuleSettings(storage, projectId, moduleId);
      if (typeof zoom === 'number' && !Number.isNaN(zoom)) {
        return zoom;
      }

      const { lastZoom } = await userSettings.fetchUserSettings(storage);
      return (typeof lastZoom === 'number' && !Number.isNaN(lastZoom)) ? lastZoom : DEFAULT_ZOOM;
    } catch (err) {
      console.error(`Error loading zoom for module ${moduleId}:`, err);
      return DEFAULT_ZOOM;
    }
  };

  /** Save the zoom level for a module, and remember it as the most recently used zoom level. */
  const updateModuleZoom = async (projectId: string, moduleId: string, zoom: number): Promise<void> => {
    try {
      if (storage) {
        await Promise.all([
          userSettings.updateModuleSettings(storage, projectId, moduleId, saved => {
            saved.zoom = zoom;
          }),
          userSettings.updateUserSettings(storage, saved => {
            saved.lastZoom = zoom;
          }),
        ]);
      } else {
        console.warn('No storage available, cannot save zoom for module');
      }
    } catch (err) {
      console.error(`Error saving zoom for module ${moduleId}:`, err);
      throw err;
    }
  };

  /** Get the saved scroll position for a module, or DEFAULT_MODULE_SCROLL if none is saved. */
  const getModuleScroll = async (projectId: string, moduleId: string): Promise<ModuleScroll> => {
    try {
      if (!storage) {
        return DEFAULT_MODULE_SCROLL;
      }

      const { scroll } = await userSettings.fetchModuleSettings(storage, projectId, moduleId);
      if (scroll && typeof scroll.x === 'number' && typeof scroll.y === 'number') {
        return { x: scroll.x, y: scroll.y };
      }
      return DEFAULT_MODULE_SCROLL;
    } catch (err) {
      console.error(`Error loading scroll position for module ${moduleId}:`, err);
      return DEFAULT_MODULE_SCROLL;
    }
  };

  /**
   * Save the scroll position for a module. (0, 0) is the default, so instead of saving it, any
   * previously saved position is deleted.
   */
  const updateModuleScroll = async (
      projectId: string, moduleId: string, x: number, y: number): Promise<void> => {
    try {
      if (!storage) {
        console.warn('No storage available, cannot save scroll position for module');
        return;
      }

      await userSettings.updateModuleSettings(storage, projectId, moduleId, saved => {
        saved.scroll = (x === 0 && y === 0) ? undefined : { x, y };
      });
    } catch (err) {
      console.error(`Error saving scroll position for module ${moduleId}:`, err);
      throw err;
    }
  };

  /** Update showSimpleClassNames setting. */
  const updateShowSimpleClassNames = async (showSimpleClassNames: boolean): Promise<void> => {
    try {
      setError(null);
      if (storage) {
        await userSettings.updateUserSettings(storage, saved => {
          saved.showSimpleClassNames = showSimpleClassNames;
        });
        setSettings(prev => ({ ...prev, showSimpleClassNames }));
      }
    } catch (err) {
      setError(`Failed to save showPackageName setting: ${err}`);
      console.error('Error saving showPackageName setting:', err);
      throw err;
    }
  };

  /** Update open tabs for a specific project. */
  const updateOpenTabs = async (projectId: string, moduleIds: string[]): Promise<void> => {
    try {
      setError(null);

      if (storage) {
        await userSettings.saveOpenTabs(storage, projectId, moduleIds);
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
  const getOpenTabs = async (projectId: string): Promise<string[]> => {
    try {
      if (!storage) {
        return [];
      }
      return await userSettings.fetchOpenTabs(storage, projectId);
    } catch (err) {
      console.error(`Error loading open tabs for project ${projectId}:`, err);
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
