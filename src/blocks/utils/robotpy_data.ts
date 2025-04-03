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

import generatedRobotPyData from './generated/robotpy_data.json';

export class RobotPyData {
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
  classMethods: FunctionData[] = [];
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
}

export class ArgData {
  name: string = '';
  type: string = '';
  defaultValue: string = '';
}

export class EnumData {
  enumClassName: string = '';
  enumValues: string[] = [];    
  tooltip: string = '';
}

export const robotPyData = generatedRobotPyData as RobotPyData
