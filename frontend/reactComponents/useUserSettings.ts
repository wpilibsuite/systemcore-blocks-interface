// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Custom hooks for accessing user settings.
 */

import * as React from 'react';
import { UserSettings, UserSettingsContextType, UserSettingsContext } from './UserSettingsProvider';

/** Hook to use user settings context. */
export const useUserSettings = (): UserSettingsContextType => {
  const context = React.useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

/** Hook to access user settings data only (without update functions). */
export const useUserSettingsData = (): UserSettings => {
  const { settings } = useUserSettings();
  return settings;
};
