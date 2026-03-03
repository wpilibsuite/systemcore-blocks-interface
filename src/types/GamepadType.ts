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
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as storageProject from '../storage/project';
import * as GenericGamepad from './hid_devices/gamepad_generic';
import * as GenericHID from './hid_devices/generic_hid';
import * as PS5 from './hid_devices/gamepad_ps5';
import * as PS4 from './hid_devices/gamepad_ps4';
import * as LogitechF310 from './hid_devices/gamepad_logitech_f310';
import * as Xbox from './hid_devices/gamepad_xbox';
import * as None from './hid_devices/none';

/** Gamepad controller types. */
export enum GamepadType {
  NONE = 'None',
  GAMEPAD_GENERIC = 'Generic Gamepad',
  GAMEPAD_LOGITECH_F310 = 'Logitech F310',
  GAMEPAD_XBOX = 'XBOX Gamepad',
  GAMEPAD_PS4 = 'PlayStation 4 Gamepad',
  GAMEPAD_PS5 = 'PlayStation 5 Gamepad',
  GENERIC_HID = 'Generic HID',
}

interface GamepadConfigModule {
  getButtonConfig: () => Map<string, GenericGamepad.ConfigEntry> | null;
  getAxisConfig: () => Map<string, GenericGamepad.ConfigEntry> | null;
  getRumbleConfig: () => Map<string, GenericGamepad.RumbleConfigEntry> | null;
  getLEDConfig: () => Map<string, GenericGamepad.ConfigEntry> | null;
}

const configMap = new Map<GamepadType, GamepadConfigModule>([
    [GamepadType.GAMEPAD_LOGITECH_F310, LogitechF310],
    [GamepadType.GAMEPAD_PS4, PS4],
    [GamepadType.GAMEPAD_PS5, PS5],
    [GamepadType.GAMEPAD_XBOX, Xbox],
    [GamepadType.GENERIC_HID, GenericHID],
    [GamepadType.GAMEPAD_GENERIC, GenericGamepad],
    [GamepadType.NONE, None],
]);

/** Utility functions for working with GamepadType enum. */
export const GamepadTypeUtils = {
  getGamepad(port: number, gamepadConfig: storageProject.GamepadConfig): GamepadType {
    const value = gamepadConfig[port];
    if (value) {
      // Validate that the value is actually a valid GamepadType enum value
      if (Object.values(GamepadType).includes(value as GamepadType)) {
        return value as GamepadType;
      }
      // If invalid, map to GAMEPAD_GENERIC
      return GamepadType.GAMEPAD_GENERIC;
    }
    return GamepadType.NONE;
  },

  /** Gets icon for gamepad type. */
  getGamepadIcon(type: GamepadType): string {
    switch (type) {
      case GamepadType.GENERIC_HID:
        return '🕹️'; // Joystick icon
      case GamepadType.NONE:
        return '❌'; // No controller        
      case GamepadType.GAMEPAD_GENERIC:
      case GamepadType.GAMEPAD_LOGITECH_F310:        
      case GamepadType.GAMEPAD_XBOX:
      case GamepadType.GAMEPAD_PS4:
      case GamepadType.GAMEPAD_PS5:        
      default:
        return '🎮'; // Generic gamepad icon
    }
  },

  /** Removes all NONE entries from gamepad config. */
  removeNoneEntries(gamepadConfig: storageProject.GamepadConfig): storageProject.GamepadConfig {
    const cleaned: storageProject.GamepadConfig = {};
    for (const port in gamepadConfig) {
      if (gamepadConfig[port] !== GamepadType.NONE) {
        cleaned[port] = gamepadConfig[port];
      }
    }
    return cleaned;
  },

  /** Default gamepad configuration. */
  getDefaultGamepadConfig(): storageProject.GamepadConfig {
    const config: storageProject.GamepadConfig = {};

    config[0] = GamepadType.GAMEPAD_LOGITECH_F310; // Default to Logitech F310 on port 0
    config[1] = GamepadType.GAMEPAD_LOGITECH_F310; // Default to Logitech F310 on port 1
    return config;
  },

  getPortsWithControllers(gamepadConfig: storageProject.GamepadConfig): number[] {
    const ports: number[] = [];
    for (const port in gamepadConfig) {
      if (gamepadConfig[port] !== GamepadType.NONE) {
        ports.push(Number(port));
      }
    }
    return ports;
  },

  /** Gets button configuration for the specified gamepad type. */
  getButtonConfig(type: GamepadType): Map<string, GenericGamepad.ConfigEntry> | null {
    const config = configMap.get(type);
    return config ? config.getButtonConfig() : null;
  },

  /** Gets axis configuration for the specified gamepad type. */
  getAxisConfig(type: GamepadType): Map<string, GenericGamepad.ConfigEntry> | null {
    const config = configMap.get(type);
    return config ? config.getAxisConfig() : null;
  },        

  /** Gets rumble configuration for the specified gamepad type. */
  getRumbleConfig(type: GamepadType): Map<string, GenericGamepad.RumbleConfigEntry> | null {
    const config = configMap.get(type);
    return config ? config.getRumbleConfig() : null;
  },

  /** Gets LED configuration for the specified gamepad type. */
  getLEDConfig(type: GamepadType): Map<string, GenericGamepad.ConfigEntry> | null {
    const config = configMap.get(type);
    return config ? config.getLEDConfig() : null;
  },
};
