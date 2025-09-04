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
  // TODO: Make this less hacky...
  expectedPortType?: string = '';
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
