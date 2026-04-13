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
