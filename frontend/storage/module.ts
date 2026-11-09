// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

// Types, constants, and functions related to modules, regardless of where the modules are stored.

export enum ModuleType {
  ROBOT = 'robot',
  MECHANISM = 'mechanism',
  OPMODE = 'opmode',
}

export type Module = {
  modulePath: string,
  moduleType: ModuleType,
  moduleId: string,
  projectName: string, // For example, WackyWheelerRobot
  className: string,   // For example, GamePieceShooter.
};

export type Robot = Module;
export type Mechanism = Module;
export type OpMode = Module;


export function stringToModuleType(str: string): ModuleType {
  const moduleType = Object.values(ModuleType).find((value) => value == str);
  if (moduleType) {
    return moduleType;
  }
  throw new Error('Unable to convert string "' + str + '" to module type.');
}
