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
 * @fileoverview Autosave manager that tracks unsaved changes and triggers saves.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as React from 'react';

/** Delay in milliseconds before auto-saving after a change. */
const AUTOSAVE_DELAY_MS = 5000;

/** Context for autosave state. */
interface AutosaveContextType {
  /** Whether the current tab has unsaved changes. */
  hasUnsavedChanges: boolean;
  /** Mark the current tab as having unsaved changes. */
  markAsModified: () => void;
  /** Mark the current tab as saved. */
  markAsSaved: () => void;
  /** Trigger an immediate save of the current tab. */
  triggerSave: () => Promise<void>;
}

const AutosaveContext = React.createContext<AutosaveContextType | null>(null);

/** Props for AutosaveProvider. */
interface AutosaveProviderProps {
  children: React.ReactNode;
  /** Function to save the current active tab. */
  saveCurrentTab: () => Promise<void>;
  /** Current active tab key. */
  activeTabKey: string;
}

/**
 * Provider component that manages autosave state and triggers.
 * Handles debounced auto-save after changes.
 */
export function AutosaveProvider({ children, saveCurrentTab, activeTabKey }: AutosaveProviderProps): React.JSX.Element {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [lastActiveTabKey, setLastActiveTabKey] = React.useState(activeTabKey);
  const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  /** Clears any pending autosave timer. */
  const clearSaveTimer = React.useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  }, []);

  /** Marks the current tab as having unsaved changes and schedules an autosave. */
  const markAsModified = React.useCallback(() => {
    setHasUnsavedChanges(true);
    
    // Clear any existing timer
    clearSaveTimer();
    
    // Schedule a new autosave
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveCurrentTab();
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Autosave failed:', error);
        // Keep hasUnsavedChanges true on error
      }
    }, AUTOSAVE_DELAY_MS);
  }, [saveCurrentTab, clearSaveTimer]);

  /** Marks the current tab as saved. */
  const markAsSaved = React.useCallback(() => {
    setHasUnsavedChanges(false);
    clearSaveTimer();
  }, [clearSaveTimer]);

  /** Triggers an immediate save. */
  const triggerSave = React.useCallback(async () => {
    clearSaveTimer();
    try {
      await saveCurrentTab();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Manual save failed:', error);
      throw error;
    }
  }, [saveCurrentTab, clearSaveTimer]);

  // When tab changes, clear unsaved state for the new tab
  React.useEffect(() => {
    if (activeTabKey !== lastActiveTabKey) {
      setHasUnsavedChanges(false);
      setLastActiveTabKey(activeTabKey);
    }
  }, [activeTabKey, lastActiveTabKey]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearSaveTimer();
    };
  }, [clearSaveTimer]);

  const contextValue: AutosaveContextType = {
    hasUnsavedChanges,
    markAsModified,
    markAsSaved,
    triggerSave,
  };

  return (
    <AutosaveContext.Provider value={contextValue}>
      {children}
    </AutosaveContext.Provider>
  );
}

/**
 * Hook to access autosave context.
 * @returns Autosave context value.
 * @throws Error if used outside of AutosaveProvider.
 */
export function useAutosave(): AutosaveContextType {
  const context = React.useContext(AutosaveContext);
  if (!context) {
    throw new Error('useAutosave must be used within AutosaveProvider');
  }
  return context;
}
