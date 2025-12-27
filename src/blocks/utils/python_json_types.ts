/**
 * @license
 * Copyright 2025 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

// Types and functions used when reading generated/*.json

export class PythonData {
  modules: ModuleData[] = [];
  classes: ClassData[] = [];
  aliases: {[key: string]: string} = {};
  subclasses: {[key: string]: string[]} = {};
}

export class ModuleData {
  moduleName: string = '';
  moduleVariables: VarData[] = [];
  functions: FunctionData[] = [];
  enums: EnumData[] = [];
}

export class ClassData {
  className: string = '';
  moduleName: string = '';
  classVariables: VarData[] = [];
  instanceVariables: VarData[] = [];
  constructors: FunctionData[] = [];
  instanceMethods: FunctionData[] = [];
  staticMethods: FunctionData[] = [];
  enums: EnumData[] = [];
  isComponent: boolean = false;
}

export class VarData {
  name: string = '';
  type: string = '';
  writable: boolean = false;
  tooltip: string = '';
}

export class FunctionData {
  functionName: string = '';
  tooltip: string = '';
  returnType: string = '';
  args: ArgData[] = [];
  declaringClassName?: string = '';
  isComponent?: boolean = false;
  componentArgs?: ArgData[] = [];
}

export class ArgData {
  name: string = '';
  type: string = '';
  defaultValue: string = '';
}

export class EnumData {
  enumClassName: string = '';
  moduleName: string = '';
  enumValues: string[] = [];
  tooltip: string = '';
}

export class VariableGettersAndSetters {
  varNamesForGetter: string[] = [];
  tooltipsForGetter: string[] = [];
  varNamesForSetter: string[] = [];
  tooltipsForSetter: string[] = [];
}

export function organizeVarDataByType(vars: VarData[]): {[key: string]: VariableGettersAndSetters} {
  const varsByType: {[key: string]: VariableGettersAndSetters} = {}
  for (const varData of vars) {
    let variableGettersAndSetters: VariableGettersAndSetters;
    if (varData.type in varsByType) {
       variableGettersAndSetters = varsByType[varData.type];
    } else {
       variableGettersAndSetters = new VariableGettersAndSetters();
       varsByType[varData.type] = variableGettersAndSetters;
    }
    variableGettersAndSetters.varNamesForGetter.push(varData.name);
    variableGettersAndSetters.tooltipsForGetter.push(varData.tooltip);
    if (varData.writable) {
      variableGettersAndSetters.varNamesForSetter.push(varData.name);
      variableGettersAndSetters.tooltipsForSetter.push(varData.tooltip);
    }
  }
  return varsByType;
}

function isSuperFunction(f1: FunctionData, f2: FunctionData): boolean {
  if (f1.functionName !== f2.functionName ||
      f1.returnType !== f2.returnType ||
      f1.args.length !== f2.args.length) {
    return false;
  }

  for (let i = 0; i < f1.args.length; i++) {
    if (f1.args[i].name !== f2.args[i].name) {
      return false;
    }
    if (f1.args[i].name === 'self') {
      // Don't compare the types of the self arguments.
      continue;
    }
    if (f1.args[i].type !== f2.args[i].type) {
      return false;
    }
  }
  return true;
}

export function findSuperFunctionData(functionData: FunctionData, superClassFunctions: FunctionData[]): FunctionData | null {
  for (const superClassFunctionData of superClassFunctions) {
    if (isSuperFunction(superClassFunctionData, functionData)) {
      return superClassFunctionData;
    }
  }
  return null;
}

export enum PortType {
  // Ports on the Systemcore.
  SYSTEMCORE_CAN_PORT,
  SYSTEMCORE_SMART_IO_PORT,
  SYSTEMCORE_I2C_PORT,
  SYSTEMCORE_USB_PORT,
  // Ports on other devices that can be connected to the Systemcore.
  EXPANSION_HUB_MOTOR_PORT,
  EXPANSION_HUB_SERVO_PORT,
  MOTIONCORE_DEVICE_PORT,
  MOTIONCORE_ENCODER_PORT,
  USB_HUB_PORT,
}

const PORT_TYPE_DELIMITER = '__';

export function stringToPortType(s: string): PortType | null {
  return Object.prototype.hasOwnProperty.call(PortType, s)
      ? (PortType as any)[s] as PortType
      : null;
}

export function portTypeToString(portType: PortType): string {
  return PortType[portType];
}

export function isPortType(str: string): boolean {
  let hasAtLeastOnePortType = false;
  for (const s of str.split(PORT_TYPE_DELIMITER)) {
    if (stringToPortType(s)) {
      hasAtLeastOnePortType = true;
    } else {
      return false;
    }
  }
  return hasAtLeastOnePortType;
}

/**
 * Parses the given string into an array of PortType.
 *
 * @param str A single string consisting of one or more port types.
 * Multiple port types are separated by __ (two underscores). Each port type
 * matches one of the PortType enum values.
 */
export function stringToPortTypeArray(str: string): PortType[] {
  const portTypeArray: PortType[] = [];
  for (const s of str.split(PORT_TYPE_DELIMITER)) {
    const portType = stringToPortType(s);
    if (portType) {
      portTypeArray.push(portType);
    }
  }
  return portTypeArray;
}

export function portTypeArrayToString(portTypeArray: PortType[]): string {
  return portTypeArray
      .map(portType => PortType[portType])
      .join(PORT_TYPE_DELIMITER);
}

/**
 * Upgrades the given port type string.
 *
 * @param str a port type string stored in version 0.0.8 and earlier.
 * @returns A single string consisting of one or more port types.
 * Multiple port types are separated by __ (two underscores). Each port type
 * matches one of the PortType enum values.
 */
export function upgradePortTypeString(str: string): string {
  switch (str) {
    case 'CAN_PORT':
      return portTypeArrayToString([PortType.SYSTEMCORE_CAN_PORT]);
    case 'SMART_IO_PORT':
      return portTypeArrayToString([PortType.SYSTEMCORE_SMART_IO_PORT]);
    case 'I2C_PORT':
      return portTypeArrayToString([PortType.SYSTEMCORE_I2C_PORT]);
    case 'USB_PORT':
      return portTypeArrayToString([PortType.SYSTEMCORE_USB_PORT]);
    case 'USB_HUB':
      return portTypeArrayToString([PortType.SYSTEMCORE_USB_PORT, PortType.USB_HUB_PORT]);
    case 'EXPANSION_HUB_MOTOR':
      return portTypeArrayToString([PortType.SYSTEMCORE_USB_PORT, PortType.EXPANSION_HUB_MOTOR_PORT]);
    case 'EXPANSION_HUB_SERVO':
      return portTypeArrayToString([PortType.SYSTEMCORE_USB_PORT, PortType.EXPANSION_HUB_SERVO_PORT]);
    case 'SMART_MOTOR_PORT':
      return portTypeArrayToString([PortType.SYSTEMCORE_USB_PORT, PortType.MOTIONCORE_DEVICE_PORT]);
  }
  return str;
}
