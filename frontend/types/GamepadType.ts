// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as storageProject from '../storage/project';
import * as GenericGamepad from './hid_devices/gamepad_generic';
import * as GenericHID from './hid_devices/generic_hid';
import * as Hids from './hid_devices/first_ds_hids';
import * as None from './hid_devices/none';

/**
 * A gamepad controller type. This is what is saved in the project's gamepad config, and what is
 * shown to the user, so the values of existing types must not change.
 */
export type GamepadType = string;

/** The type for a port that has no controller. */
export const GAMEPAD_TYPE_NONE: GamepadType = 'None';

/** The type used when the saved type is not one that we know. */
const GAMEPAD_TYPE_GENERIC_GAMEPAD: GamepadType = 'Generic Gamepad';

interface GamepadConfigModule {
  getButtonConfig: () => Map<string, GenericGamepad.ConfigEntry> | null;
  getAxisConfig: () => Map<string, GenericGamepad.ConfigEntry> | null;
  getRumbleConfig: () => Map<string, GenericGamepad.RumbleConfigEntry> | null;
  getLEDConfig: () => Map<string, GenericGamepad.ConfigEntry> | null;
}

interface GamepadTypeInfo {
  type: GamepadType;
  icon: string;
  /** The name of the wpilib class that is instantiated for the type, or null if there is none. */
  wpilibClassName: string | null;
  config: GamepadConfigModule;
}

/**
 * Makes the info for a type whose buttons, axes, and capabilities come from first_ds_hids.json.
 * hidClassName is the ClassName of the controller in that file. The wpilib class is the ClassName
 * followed by 'Controller'.
 */
function makeHidInfo(type: GamepadType, hidClassName: string): GamepadTypeInfo {
  return {
    type,
    icon: '🎮',
    wpilibClassName: hidClassName + 'Controller',
    config: Hids.forClass(hidClassName),
  };
}

/** All of the types, in the order they are shown to the user. */
const GAMEPAD_TYPES: GamepadTypeInfo[] = [
  { type: GAMEPAD_TYPE_NONE, icon: '❌', wpilibClassName: null, config: None },
  { type: GAMEPAD_TYPE_GENERIC_GAMEPAD, icon: '🎮', wpilibClassName: 'Gamepad', config: GenericGamepad },
  makeHidInfo('Logitech F310', 'LogitechF310'),
  makeHidInfo('XBOX Gamepad', 'Xbox'),
  makeHidInfo('PlayStation 4 Gamepad', 'DualShock4'),
  makeHidInfo('PlayStation 5 Gamepad', 'DualSense'),
  makeHidInfo('Steam Controller', 'Steam'),
  makeHidInfo('Switch Pro Controller', 'SwitchPro'),
  makeHidInfo('Switch 2 Pro Controller', 'Switch2Pro'),
  { type: 'Generic HID', icon: '🕹️', wpilibClassName: 'GenericHID', config: GenericHID },
];

const GAMEPAD_TYPE_INFOS = new Map<GamepadType, GamepadTypeInfo>(
    GAMEPAD_TYPES.map((info) => [info.type, info]));

/** Utility functions for working with gamepad types. */
export const GamepadTypeUtils = {
  /** Gets all of the types, in the order they are shown to the user. */
  getAllTypes(): GamepadType[] {
    return GAMEPAD_TYPES.map((info) => info.type);
  },

  getGamepad(port: number, gamepadConfig: storageProject.GamepadConfig): GamepadType {
    const value = gamepadConfig[port];
    if (value) {
      // Validate that the value is actually a known type.
      if (GAMEPAD_TYPE_INFOS.has(value)) {
        return value;
      }
      // If invalid, map to the generic gamepad.
      return GAMEPAD_TYPE_GENERIC_GAMEPAD;
    }
    return GAMEPAD_TYPE_NONE;
  },

  /** Gets the name of the wpilib class that is instantiated for the given type, or null for NONE. */
  getWpilibClassName(type: GamepadType): string | null {
    return GAMEPAD_TYPE_INFOS.get(type)?.wpilibClassName ?? null;
  },

  /** Gets icon for gamepad type. */
  getGamepadIcon(type: GamepadType): string {
    return GAMEPAD_TYPE_INFOS.get(type)?.icon ?? '🎮';
  },

  /** Removes all NONE entries from gamepad config. */
  removeNoneEntries(gamepadConfig: storageProject.GamepadConfig): storageProject.GamepadConfig {
    const cleaned: storageProject.GamepadConfig = {};
    for (const port in gamepadConfig) {
      if (gamepadConfig[port] !== GAMEPAD_TYPE_NONE) {
        cleaned[port] = gamepadConfig[port];
      }
    }
    return cleaned;
  },

  /** Default gamepad configuration. */
  getDefaultGamepadConfig(): storageProject.GamepadConfig {
    const config: storageProject.GamepadConfig = {};

    config[0] = 'Logitech F310'; // Default to Logitech F310 on port 0
    config[1] = 'Logitech F310'; // Default to Logitech F310 on port 1
    return config;
  },

  getPortsWithControllers(gamepadConfig: storageProject.GamepadConfig): number[] {
    const ports: number[] = [];
    for (const port in gamepadConfig) {
      if (gamepadConfig[port] !== GAMEPAD_TYPE_NONE) {
        ports.push(Number(port));
      }
    }
    return ports;
  },

  /** Gets button configuration for the specified gamepad type. */
  getButtonConfig(type: GamepadType): Map<string, GenericGamepad.ConfigEntry> | null {
    return GAMEPAD_TYPE_INFOS.get(type)?.config.getButtonConfig() ?? null;
  },

  /** Gets axis configuration for the specified gamepad type. */
  getAxisConfig(type: GamepadType): Map<string, GenericGamepad.ConfigEntry> | null {
    return GAMEPAD_TYPE_INFOS.get(type)?.config.getAxisConfig() ?? null;
  },

  /** Gets rumble configuration for the specified gamepad type. */
  getRumbleConfig(type: GamepadType): Map<string, GenericGamepad.RumbleConfigEntry> | null {
    return GAMEPAD_TYPE_INFOS.get(type)?.config.getRumbleConfig() ?? null;
  },

  /** Gets LED configuration for the specified gamepad type. */
  getLEDConfig(type: GamepadType): Map<string, GenericGamepad.ConfigEntry> | null {
    return GAMEPAD_TYPE_INFOS.get(type)?.config.getLEDConfig() ?? null;
  },
};
