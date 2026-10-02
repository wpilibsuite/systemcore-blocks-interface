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
import {
    addConstructorBlocks,
    addInstanceVariableMethodBlocks,
    addModuleFunctionBlocks } from '../blocks/mrc_call_python_function';
import { createEnumBlock } from '../blocks/mrc_get_python_enum_value';
import { createTypedVariableSetterBlock } from '../blocks/mrc_set_typed_variable';
import { getClassData, getEnumData, getModuleData } from '../blocks/utils/python';
import { FunctionData } from '../blocks/utils/python_json_types';

const FUNCTION_NAME_GET_TABLE = 'get_table';

const MODULE_NAME_TELEMETRY = 'telemetry';
const CLASS_NAME_TELEMETRY_TABLE = MODULE_NAME_TELEMETRY + '.TelemetryTable';
// The telemetry module doesn't mark any functions as common, so these are shown first.
const TELEMETRY_COMMON_FUNCTION_NAMES = ['get_table', 'log'];
// The order of the telemetry blocks in the toolbox. Functions that aren't listed are shown last.
const TELEMETRY_FUNCTION_ORDER = [
  'get_table',
  'log',
  'keep_duplicates',
  'set_property',
  'set_type',
  'get_type',
  'has_type',
  'get_path',
];

const MODULE_NAME_TUNABLES = 'tunables';
const CLASS_NAME_TUNABLE_TABLE = MODULE_NAME_TUNABLES + '.TunableTable';
const CLASS_NAME_TUNABLE = MODULE_NAME_TUNABLES + '.Tunable';
// The tunables module doesn't mark any functions as common, so these are shown first.
const TUNABLES_COMMON_FUNCTION_NAMES = ['get_table', 'add', 'remove'];
// The order of the tunables table blocks in the toolbox. Functions that aren't listed are shown
// after these.
const TUNABLES_FUNCTION_ORDER = [
  'get_table',
  'add',
  'add_boolean',
  'add_int',
  'add_long',
  'add_float',
  'add_double',
  'publish',
  'remove',
  'get_path',
];
// The Tunable methods that are shown first, in this order.
const TUNABLE_COMMON_METHOD_NAMES = ['set', 'get'];

const CLASS_NAME_ALERT = 'wpiutil.Alert';
const ENUM_CLASS_NAME_ALERT_LEVEL = CLASS_NAME_ALERT + '.Level';
// The level plugged into the Alert constructor blocks.
const ALERT_DEFAULT_LEVEL = 'HIGH';
// The Alert methods that are shown first.
const ALERT_COMMON_METHOD_NAMES = ['set'];
// The order of the Alert methods in the toolbox. Methods that aren't listed are shown last.
const ALERT_METHOD_ORDER = ['set', 'set_text', 'get', 'get_text', 'get_level', 'close'];

// Telemetry can be logged by calling the telemetry module functions directly, or by getting a
// TelemetryTable (with telemetry.get_table), storing it in a variable, and calling methods on
// that variable. The module functions have the same names and arguments as the TelemetryTable
// methods, so there is one block for each, with a dropdown to choose "default" (the telemetry
// module) or a TelemetryTable variable.
export function getTelemetryCategory(): toolboxItems.Category {
  const commonContents: toolboxItems.ContentsType[] = [];
  const moreContents: toolboxItems.ContentsType[] = [];
  addTableBlocks(
      MODULE_NAME_TELEMETRY, CLASS_NAME_TELEMETRY_TABLE,
      TELEMETRY_FUNCTION_ORDER, TELEMETRY_COMMON_FUNCTION_NAMES,
      [CLASS_NAME_TELEMETRY_TABLE],
      commonContents, moreContents);

  const category = new toolboxItems.Category(
      Blockly.Msg['MRC_CATEGORY_TELEMETRY'], makeOneContents(commonContents, moreContents));
  category.tooltip = Blockly.Msg['MRC_CATEGORY_TELEMETRY_TOOLTIP'];
  return category;
}

// Tunables work like telemetry: the tunables module functions and the TunableTable methods
// share blocks, with a dropdown to choose "default" (the tunables module) or a TunableTable
// variable. The add functions return a Tunable, which is stored in a Tunable variable. The
// Tunable blocks (set and get) have a dropdown of the Tunable variables in the module.
export function getTunablesCategory(): toolboxItems.Category {
  const commonContents: toolboxItems.ContentsType[] = [];
  const moreContents: toolboxItems.ContentsType[] = [];
  addTableBlocks(
      MODULE_NAME_TUNABLES, CLASS_NAME_TUNABLE_TABLE,
      TUNABLES_FUNCTION_ORDER, TUNABLES_COMMON_FUNCTION_NAMES,
      [CLASS_NAME_TUNABLE_TABLE, CLASS_NAME_TUNABLE],
      commonContents, moreContents);
  const tunableClassData = getClassData(CLASS_NAME_TUNABLE);
  if (tunableClassData) {
    addInstanceVariableMethodBlocks(
        {
          ...tunableClassData,
          instanceMethods: markCommonFunctions(
              sortFunctions(tunableClassData.instanceMethods, TUNABLE_COMMON_METHOD_NAMES),
              TUNABLE_COMMON_METHOD_NAMES),
        },
        commonContents, moreContents);
  }

  const category = new toolboxItems.Category(
      Blockly.Msg['MRC_CATEGORY_TUNABLES'], makeOneContents(commonContents, moreContents));
  category.tooltip = Blockly.Msg['MRC_CATEGORY_TUNABLES_TOOLTIP'];
  return category;
}

// An Alert is created with its constructor and stored in an Alert variable. The Alert blocks
// (set, set_text, etc.) have a dropdown of the Alert variables in the module.
export function getAlertsCategory(showSimpleClassNames: boolean): toolboxItems.Category {
  const commonContents: toolboxItems.ContentsType[] = [];
  const moreContents: toolboxItems.ContentsType[] = [];
  const alertClassData = getClassData(CLASS_NAME_ALERT);
  if (alertClassData) {
    const constructorCommon: toolboxItems.ContentsType[] = [];
    const constructorMore: toolboxItems.ContentsType[] = [];
    addConstructorBlocks(
        {
          ...alertClassData,
          // The constructor without a group is the common one.
          constructors: alertClassData.constructors.map(f => ({
            ...f,
            isCommon: f.isCommon || !f.args.some(arg => arg.name === 'group'),
          })),
        },
        constructorCommon, constructorMore, showSimpleClassNames);
    const storeAlert = (item: toolboxItems.ContentsType) => {
      const block = storeInTypedVariable(item as toolboxItems.Block, CLASS_NAME_ALERT);
      plugDefaultAlertLevel(block.inputs!['VALUE'].block, showSimpleClassNames);
      return block;
    };
    commonContents.push(...constructorCommon.map(storeAlert));
    moreContents.push(...constructorMore.map(storeAlert));
    addInstanceVariableMethodBlocks(
        {
          ...alertClassData,
          instanceMethods: markCommonFunctions(
              sortFunctions(alertClassData.instanceMethods, ALERT_METHOD_ORDER),
              ALERT_COMMON_METHOD_NAMES),
        },
        commonContents, moreContents);
  }

  const category = new toolboxItems.Category(
      Blockly.Msg['MRC_CATEGORY_ALERTS'], makeOneContents(commonContents, moreContents));
  category.tooltip = Blockly.Msg['MRC_CATEGORY_ALERTS_TOOLTIP'];
  return category;
}

// Plugs a level enum block into the level argument of the given Alert constructor block, so the
// level can be chosen with the dropdown.
function plugDefaultAlertLevel(block: toolboxItems.Block, showSimpleClassNames: boolean) {
  const args = block.extraState?.args as {name: string, type: string}[] | undefined;
  const levelArgIndex = args?.findIndex(arg => arg.type === ENUM_CLASS_NAME_ALERT_LEVEL) ?? -1;
  const enumData = getEnumData(ENUM_CLASS_NAME_ALERT_LEVEL);
  if (levelArgIndex !== -1 && enumData) {
    block.inputs = block.inputs ?? {};
    block.inputs['ARG' + levelArgIndex] = {
      block: createEnumBlock(ALERT_DEFAULT_LEVEL, enumData, showSimpleClassNames),
    };
  }
}

/**
 * Adds blocks for the methods of the given table class. Methods that have a module function with
 * the same name and arguments also have a "default" option that calls the module function.
 * Blocks for functions that return one of the storedTypes are wrapped in a block that stores the
 * result in a variable of that type.
 */
function addTableBlocks(
    moduleName: string,
    tableClassName: string,
    functionOrder: string[],
    commonFunctionNames: string[],
    storedTypes: string[],
    commonContents: toolboxItems.ContentsType[],
    moreContents: toolboxItems.ContentsType[]) {
  const moduleData = getModuleData(moduleName);
  const tableClassData = getClassData(tableClassName);
  const tableMethodNames = new Set<string>();
  if (tableClassData) {
    // A table's get_table returns a table, but it isn't always declared that way.
    const instanceMethods = tableClassData.instanceMethods.map(f =>
        (f.functionName === FUNCTION_NAME_GET_TABLE) ? {...f, returnType: tableClassName} : f);
    const tableCommon: toolboxItems.ContentsType[] = [];
    const tableMore: toolboxItems.ContentsType[] = [];
    addInstanceVariableMethodBlocks(
        {
          ...tableClassData,
          instanceMethods: markCommonFunctions(
              sortFunctions(instanceMethods, functionOrder), commonFunctionNames),
        },
        tableCommon, tableMore, moduleData ?? undefined);
    const storeResult = (item: toolboxItems.ContentsType) => {
      const block = item as toolboxItems.Block;
      const storedType = storedTypes.find(type => returnsType(block, type));
      return storedType ? storeInTypedVariable(block, storedType) : item;
    };
    commonContents.push(...tableCommon.map(storeResult));
    moreContents.push(...tableMore.map(storeResult));
    tableClassData.instanceMethods.forEach(f => tableMethodNames.add(f.functionName));
  }
  if (moduleData) {
    // Add blocks for any module functions that don't have a table method.
    addModuleFunctionBlocks(
        {
          ...moduleData,
          functions: markCommonFunctions(
              moduleData.functions.filter(f => !tableMethodNames.has(f.functionName)),
              commonFunctionNames),
        },
        commonContents, moreContents);
  }
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
