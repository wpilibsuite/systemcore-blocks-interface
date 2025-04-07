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

import { robotPyData, organizeVarDataByType, VariableGettersAndSetters } from './robotpy_data';

import * as pythonEnum from "../mrc_get_python_enum_value";
import * as getPythonVariable from "../mrc_get_python_variable";
import * as setPythonVariable from "../mrc_set_python_variable";

export function initialize() {
  // Process RobotPy modules.
  for (const moduleData of robotPyData.modules) {
    // Initialize enums.
    for (const enumData of moduleData.enums) {
      pythonEnum.initializeEnum(enumData.enumClassName, enumData.enumValues, enumData.tooltip);
    }

    // Initialize module variables.
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(moduleData.moduleVariables);
    for (const varType in varsByType) {
      const variableGettersAndSetters = varsByType[varType];
      getPythonVariable.initializeModuleVariableGetter(
          moduleData.moduleName,
          varType,
          variableGettersAndSetters.varNamesForGetter,
          variableGettersAndSetters.tooltipsForGetter);
      if (variableGettersAndSetters.varNamesForSetter.length) {
        setPythonVariable.initializeModuleVariableSetter(
            moduleData.moduleName,
            varType,
            variableGettersAndSetters.varNamesForSetter,
            variableGettersAndSetters.tooltipsForSetter);
      }
    }
  }

  // Process RobotPy classes.
  for (const classData of robotPyData.classes) {
    // Initialize enums.
    for (const enumData of classData.enums) {
      pythonEnum.initializeEnum(enumData.enumClassName, enumData.enumValues, enumData.tooltip);
    }

    // Initialize instance variables.
    if (classData.instanceVariables.length) {
      const varsByType: {[key: string]: VariableGettersAndSetters} =
          organizeVarDataByType(classData.instanceVariables);
      for (const varType in varsByType) {
        const variableGettersAndSetters = varsByType[varType];
        getPythonVariable.initializeInstanceVariableGetter(
            classData.className,
            varType,
            variableGettersAndSetters.varNamesForGetter,
            variableGettersAndSetters.tooltipsForGetter);
        if (variableGettersAndSetters.varNamesForSetter.length) {
          setPythonVariable.initializeInstanceVariableSetter(
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
        getPythonVariable.initializeClassVariableGetter(
            classData.className,
            varType,
            variableGettersAndSetters.varNamesForGetter,
            variableGettersAndSetters.tooltipsForGetter);
        if (variableGettersAndSetters.varNamesForSetter.length) {
          setPythonVariable.initializeClassVariableSetter(
              classData.className,
              varType,
              variableGettersAndSetters.varNamesForSetter,
              variableGettersAndSetters.tooltipsForSetter);
        }
      }
    }
  }
}
