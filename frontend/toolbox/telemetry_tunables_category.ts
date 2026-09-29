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

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import { makeOneContents } from './python_data_toolbox';
import { addInstanceVariableMethodBlocks, addModuleFunctionBlocks } from '../blocks/mrc_call_python_function';
import { createTypedVariableSetterBlock } from '../blocks/mrc_set_typed_variable';
import {
  CLASS_NAME_TELEMETRY_TABLE,
  MODULE_NAME_TELEMETRY,
  TELEMETRY_COMMON_FUNCTION_NAMES,
  TELEMETRY_FUNCTION_ORDER,
  getClassData,
  getModuleData } from '../blocks/utils/python';
import { FunctionData } from '../blocks/utils/python_json_types';

// Telemetry can be logged by calling the telemetry module functions directly, or by getting a
// TelemetryTable (with telemetry.get_table), storing it in a variable, and calling methods on
// that variable. The module functions have the same names and arguments as the TelemetryTable
// methods, so there is one block for each, with a dropdown to choose "default" (the telemetry
// module) or a TelemetryTable variable.
export function getTelemetryCategory(): toolboxItems.Category {
  const commonContents: toolboxItems.ContentsType[] = [];
  const moreContents: toolboxItems.ContentsType[] = [];
  const moduleData = getModuleData(MODULE_NAME_TELEMETRY);
  const tableClassData = getClassData(CLASS_NAME_TELEMETRY_TABLE);
  const tableMethodNames = new Set<string>();
  if (tableClassData) {
    const tableCommon: toolboxItems.ContentsType[] = [];
    const tableMore: toolboxItems.ContentsType[] = [];
    addInstanceVariableMethodBlocks(
        {
          ...tableClassData,
          instanceMethods: markCommonFunctions(
              sortFunctions(tableClassData.instanceMethods, TELEMETRY_FUNCTION_ORDER),
              TELEMETRY_COMMON_FUNCTION_NAMES),
        },
        tableCommon, tableMore, moduleData ?? undefined);
    // get_table returns a TelemetryTable, which is stored in a TelemetryTable variable.
    const storeTables = (item: toolboxItems.ContentsType) =>
        returnsType(item as toolboxItems.Block, CLASS_NAME_TELEMETRY_TABLE)
            ? storeInTypedVariable(item as toolboxItems.Block, CLASS_NAME_TELEMETRY_TABLE)
            : item;
    commonContents.push(...tableCommon.map(storeTables));
    moreContents.push(...tableMore.map(storeTables));
    tableClassData.instanceMethods.forEach(f => tableMethodNames.add(f.functionName));
  }
  if (moduleData) {
    // Add blocks for any module functions that don't have a TelemetryTable method.
    addModuleFunctionBlocks(
        {
          ...moduleData,
          functions: markCommonFunctions(
              moduleData.functions.filter(f => !tableMethodNames.has(f.functionName)),
              TELEMETRY_COMMON_FUNCTION_NAMES),
        },
        commonContents, moreContents);
  }

  const category = new toolboxItems.Category(
      Blockly.Msg['MRC_CATEGORY_TELEMETRY'], makeOneContents(commonContents, moreContents));
  category.tooltip = Blockly.Msg['MRC_CATEGORY_TELEMETRY_TOOLTIP'];
  return category;
}

export function getTunablesCategory(): toolboxItems.Category {
  const category = new toolboxItems.Category(Blockly.Msg['MRC_CATEGORY_TUNABLES'], []);
  category.tooltip = Blockly.Msg['MRC_CATEGORY_TUNABLES_TOOLTIP'];
  return category;
}

// Blocks for functions that return an object are wrapped in a variables_set block. This replaces
// that with a block that sets a variable of the given type, so the variable can be chosen from
// the dropdowns of blocks that get a variable of that type.
function storeInTypedVariable(block: toolboxItems.Block, varType: string): toolboxItems.Block {
  const valueBlock = (block.type === 'variables_set') ? block.inputs?.['VALUE']?.block : block;
  return createTypedVariableSetterBlock(varType, valueBlock);
}

// Returns copies of the given functions with isCommon set for the given function names.
function markCommonFunctions(functions: FunctionData[], commonNames: string[]): FunctionData[] {
  return functions.map(f => ({
    ...f,
    isCommon: f.isCommon || commonNames.includes(f.functionName),
  }));
}

// Returns the given functions sorted by the position of their names in the given order. Functions
// that aren't in the order keep their relative order and are put last.
function sortFunctions(functions: FunctionData[], order: string[]): FunctionData[] {
  const position = (f: FunctionData) => {
    const index = order.indexOf(f.functionName);
    return (index === -1) ? order.length : index;
  };
  return [...functions].sort((a, b) => position(a) - position(b));
}

// Returns true if the given block (or the block plugged into its variables_set wrapper) calls a
// function that returns the given type.
function returnsType(block: toolboxItems.Block, type: string): boolean {
  const callBlock = (block.type === 'variables_set') ? block.inputs?.['VALUE']?.block : block;
  return callBlock?.extraState?.returnType === type;
}
