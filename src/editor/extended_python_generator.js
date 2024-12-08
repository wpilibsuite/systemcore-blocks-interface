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

import * as Blockly from 'blockly/core';
import { PythonGenerator, pythonGenerator } from 'blockly/python';

// Extends the python generator to collect some information about functions and
// variables that have been defined.

class ExtendedPythonGenerator extends PythonGenerator {
  constructor() {
    super('Python');
  }
  init(workspace) {
    super.init(workspace);

    this.exportedProcedureMap = {};
    const allProcedures = Blockly.Procedures.allProcedures(workspace);
    const procedureTuples = allProcedures[0].concat(allProcedures[1]);
    for (let i = 0; i < procedureTuples.length; i++) {
    const procedureTuple = procedureTuples[i];
      const procedureName = procedureTuple[0];
      this.exportedProcedureMap[procedureName] = super.getProcedureName(procedureName);
    }

    this.exportedVariableMap = {};
    const variables = Blockly.Variables.allUsedVarModels(workspace);
    for (let i = 0; i < variables.length; i++) {
      const variableName = variables[i].name;
      this.exportedVariableMap[variableName] = super.getVariableName(variables[i].getId());
    }
  }
  finish(code) {
    return super.finish(code);
  }
  getActualProcedureName(name) {
    return this.exportedProcedureMap[name];
  }
  getActualVariableName(name) {
    return this.exportedVariableMap[name];
  }
}

function createExtendedPythonGenerator() {
  const extendedPythonGenerator = new ExtendedPythonGenerator();

  extendedPythonGenerator.forBlock = new Object();
  for (const property in pythonGenerator.forBlock) {
    extendedPythonGenerator.forBlock[property] = pythonGenerator.forBlock[property];
  }

  return extendedPythonGenerator;
}

export const extendedPythonGenerator = createExtendedPythonGenerator();
