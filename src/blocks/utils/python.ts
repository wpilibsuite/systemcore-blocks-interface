/**
 * @license
 * Copyright 2024 Google LLC
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

import { ClassData, PythonData, ModuleData, organizeVarDataByType, VariableGettersAndSetters } from './python_json_types';
import generatedExternalSamplesData from './generated/external_samples_data.json';
import generatedRobotPyData from './generated/robotpy_data.json';
import generatedServerPythonScripts from './generated/server_python_scripts.json';

import * as PythonEnum from "../mrc_get_python_enum_value";
import * as GetPythonVariable from "../mrc_get_python_variable";
import * as SetPythonVariable from "../mrc_set_python_variable";


// Utilities related to blocks for python modules and classes, including those from RobotPy, external samples, etc.

export const MODULE_NAME_BLOCKS_BASE_CLASSES = 'blocks_base_classes';
export const CLASS_NAME_ROBOT_BASE = MODULE_NAME_BLOCKS_BASE_CLASSES + '.RobotBase';
export const CLASS_NAME_MECHANISM = MODULE_NAME_BLOCKS_BASE_CLASSES + '.Mechanism';

// TODO(lizlooney): what about PeriodicOpMode and LinearOpMode?
export const CLASS_NAME_OPMODE = MODULE_NAME_BLOCKS_BASE_CLASSES + '.OpMode';
// TODO(lizlooney): Make sure to update the value of PERIODIC_METHOD_NAME when we update wpilib.
export const PERIODIC_METHOD_NAME = 'loop';

export const robotPyData = generatedRobotPyData as PythonData;
const externalSamplesData = generatedExternalSamplesData as PythonData
const serverPythonScripts = generatedServerPythonScripts as PythonData;


const allPythonData: PythonData[] = [];
allPythonData.push(robotPyData);
allPythonData.push(externalSamplesData);
allPythonData.push(serverPythonScripts);


// Initializes enum and variable blocks for python modules and classes.
export function initialize() {
  for (const pythonData of allPythonData) {
    // Process modules.
    for (const moduleData of pythonData.modules) {
      // Initialize enums.
      for (const enumData of moduleData.enums) {
        PythonEnum.initializeEnum(enumData.enumClassName, enumData.enumValues, enumData.tooltip);
      }

      // Initialize module variables.
      const varsByType: {[key: string]: VariableGettersAndSetters} =
          organizeVarDataByType(moduleData.moduleVariables);
      for (const varType in varsByType) {
        const variableGettersAndSetters = varsByType[varType];
        GetPythonVariable.initializeModuleVariableGetter(
            moduleData.moduleName,
            varType,
            variableGettersAndSetters.varNamesForGetter,
            variableGettersAndSetters.tooltipsForGetter);
        if (variableGettersAndSetters.varNamesForSetter.length) {
          SetPythonVariable.initializeModuleVariableSetter(
              moduleData.moduleName,
              varType,
              variableGettersAndSetters.varNamesForSetter,
              variableGettersAndSetters.tooltipsForSetter);
        }
      }
    }

    // Process classes.
    for (const classData of pythonData.classes) {
      // Initialize enums.
      for (const enumData of classData.enums) {
        PythonEnum.initializeEnum(enumData.enumClassName, enumData.enumValues, enumData.tooltip);
      }

      // Initialize instance variables.
      if (classData.instanceVariables.length) {
        const varsByType: {[key: string]: VariableGettersAndSetters} =
            organizeVarDataByType(classData.instanceVariables);
        for (const varType in varsByType) {
          const variableGettersAndSetters = varsByType[varType];
          GetPythonVariable.initializeInstanceVariableGetter(
              classData.className,
              varType,
              variableGettersAndSetters.varNamesForGetter,
              variableGettersAndSetters.tooltipsForGetter);
          if (variableGettersAndSetters.varNamesForSetter.length) {
            SetPythonVariable.initializeInstanceVariableSetter(
                classData.className,
                varType,
                variableGettersAndSetters.varNamesForSetter,
                variableGettersAndSetters.tooltipsForSetter);
          }
        }
      }

      // Initialize class variables.
      if (classData.classVariables.length) {
        const varsByType: {[key: string]: VariableGettersAndSetters} =
            organizeVarDataByType(classData.classVariables);
        for (const varType in varsByType) {
          const variableGettersAndSetters = varsByType[varType];
          GetPythonVariable.initializeClassVariableGetter(
              classData.className,
              varType,
              variableGettersAndSetters.varNamesForGetter,
              variableGettersAndSetters.tooltipsForGetter);
          if (variableGettersAndSetters.varNamesForSetter.length) {
            SetPythonVariable.initializeClassVariableSetter(
                classData.className,
                varType,
                variableGettersAndSetters.varNamesForSetter,
                variableGettersAndSetters.tooltipsForSetter);
          }
        }
      }
    }
  }
}

// Returns the ClassData for the given class name.
export function getClassData(className: string): ClassData | null {
  for (const pythonData of allPythonData) {
    for (const classData of pythonData.classes) {
      if (classData.className === className) {
        return classData;
      }
    }
  }
  return null;
}

// Returns the ModuleData for the given module name.
export function getModuleData(moduleName: string): ModuleData | null {
  for (const pythonData of allPythonData) {
    for (const moduleData of pythonData.modules) {
      if (moduleData.moduleName === moduleName) {
        return moduleData;
      }
    }
  }
  return null;
}

// If the given type is a type alias, returns the value of the type alias.
// For example, if type is 'wpimath.units.nanoseconds', this function will return 'float'
export function getAlias(type: string): string | null {
  for (const pythonData of allPythonData) {
    const aliases: {[key: string]: string} = pythonData.aliases;
    for (const className in aliases) {
      if (type === className) {
        return aliases[className];
      }
    }
  }
  return null;
}

// Returns the list of subclass names for the given type.
// For example, if type is 'wpilib.drive.RobotDriveBase', this function will
// return ['wpilib.drive.DifferentialDrive', 'wpilib.drive.MecanumDrive'].
export function getSubclassNames(type: string): string[] {
  for (const pythonData of allPythonData) {
    for (const className in pythonData.subclasses) {
      if (type === className) {
        return pythonData.subclasses[className];
      }
    }
  }
  return [];
}

// Returns the array of allowed types for the given string.
// This function is used by multiple blocks to set the check for an input socket.
export function getAllowedTypesForSetCheck(type: string): string[] {
  // For the given python type, returns an array of compatible input types.

  const allowedTypes: string[] = [];
  collectAllowedTypesForSetCheck(type, allowedTypes);
  return allowedTypes;
}

function collectAllowedTypesForSetCheck(type: string, allowedTypes: string[]) {
  // Built-in python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    allowedTypes.push(check);
    return;
  }

  // Not a built-in python type.
  allowedTypes.push(type);

  // Type Aliases
  const alias = getAlias(type);
  if (alias) {
    collectAllowedTypesForSetCheck(alias, allowedTypes);
  }

  // Subclasses
  const subclassNames = getSubclassNames(type);
  if (subclassNames) {
    for (const subclassName of subclassNames) {
      collectAllowedTypesForSetCheck(subclassName, allowedTypes);
    }
  }
}

// If type is a built-in python type, this function returns the blockly check for it.
function getCheckForBuiltInType(type: string): string {
  if (type === 'bool') {
    return 'Boolean';
  }
  if (type === 'str') {
    return 'String';
  }
  if (type === 'float' || type === 'int') {
    return 'Number';
  }
  if (type.startsWith('tuple[') && type.endsWith(']')) {
    return 'Tuple';
  }
  if (type.startsWith('dict[') && type.endsWith(']')) {
    return 'Dict';
  }
  if (type.startsWith('Optional[') && type.endsWith(']')) {
    return type.substring('Optional['.length, type.length-1);
  }
  // If type is not a built-in python type, return empty string.
  return '';
}

// Returns the output check for the given type.
export function getOutputCheck(type: string): string {
  // For the given python type, returns the output type.
  if (type === 'None') {
    return '';
  }

  // Type Aliases
  const alias = getAlias(type);
  if (alias) {
    return getOutputCheck(alias);
  }

  // Built-in python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    return check;
  }

  return type;
}

// Function to return a legal name based off of proposed names and making sure it doesn't conflict
// This is a legal name for python methods and variables. 
export function getLegalName(proposedName: string, existingNames: string[]){
  let newName = proposedName.trim().replace(' ', '_');

  // TODO: Allow the user to put numbers in the name.
  
  if (!/^[A-Za-z_]/.test(newName)){
      newName = "_" + newName;
  }
      
  while (existingNames.includes(newName)){
      const match = /(.*?)(\d+)$/.exec(newName)

      if (match) {
          let lastNumber  = +match[2]
          newName = match[1] + (lastNumber + 1)
      } else {
          newName += "2"
      }
  }
  return newName;
}

export function isExistingPythonModule(moduleName: string): boolean {
  for (const pythonData of allPythonData) {
    // Process modules.
    for (const moduleData of pythonData.modules) {
      if (moduleData.moduleName === moduleName) {
        return true;
      }
    }
  }
  return false;
}
