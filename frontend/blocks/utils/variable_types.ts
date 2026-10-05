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
 * @fileoverview Infers the type of each variable from the values assigned to it.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';

/** The variable type for lists. It is the output check of Blockly's list blocks. */
export const VARIABLE_TYPE_LIST = 'Array';
/** The variable type for tuples. It is the output check of python functions that return tuples. */
export const VARIABLE_TYPE_TUPLE = 'Tuple';
/**
 * The variable type for dictionaries. It is the output check of python functions that return
 * dictionaries.
 */
export const VARIABLE_TYPE_DICT = 'Dict';

/**
 * The output checks of built-in values that a variable can have as its type. Other variable
 * types are python class names, like telemetry.TelemetryTable.
 */
export const BUILT_IN_VARIABLE_TYPES = [
  'Number',
  'Boolean',
  'String',
  VARIABLE_TYPE_LIST,
  VARIABLE_TYPE_TUPLE,
  VARIABLE_TYPE_DICT,
];

// The prefixes of the output checks of python functions that return a list, a tuple, or a
// dictionary, and the variable types for them. The types of the items, keys, and values aren't
// part of the variable type.
const GENERIC_TYPE_PREFIXES: [string, string][] = [
  ['list[', VARIABLE_TYPE_LIST],
  ['List[', VARIABLE_TYPE_LIST],
  ['tuple[', VARIABLE_TYPE_TUPLE],
  ['Tuple[', VARIABLE_TYPE_TUPLE],
  ['dict[', VARIABLE_TYPE_DICT],
  ['Dict[', VARIABLE_TYPE_DICT],
];

const BLOCK_TYPE_VARIABLES_GET = 'variables_get';
const BLOCK_TYPE_VARIABLES_SET = 'variables_set';
const FIELD_VAR = 'VAR';
const INPUT_VALUE = 'VALUE';
const WARNING_ID_DIFFERENT_TYPE = 'MRC_VARIABLE_DIFFERENT_TYPE';

/**
 * A variable map that doesn't create a second variable with the name of an existing variable.
 *
 * Blockly looks up variables that are referenced by name (like the variables in toolbox blocks)
 * by name and type. Since a variable's type changes when it is assigned a value, a lookup with
 * the variable's old type would otherwise create another variable with the same name.
 */
class MrcVariableMap extends Blockly.VariableMap {
  override createVariable(
      name: string, type?: string, id?: string): Blockly.IVariableModel<Blockly.IVariableState> {
    if (!id || !this.getVariableById(id)) {
      const existing = this.getAllVariables().find(v => Blockly.Names.equals(v.getName(), name));
      if (existing) {
        return existing;
      }
    }
    return super.createVariable(name, type, id);
  }
}

/** Registers the variable map. This must be called before any workspaces are created. */
export function registerVariableMap(): void {
  Blockly.registry.register(
      Blockly.registry.Type.VARIABLE_MAP, Blockly.registry.DEFAULT, MrcVariableMap, true);
}

/** Returns true if the given event can change the type of a variable. */
export function canChangeVariableTypes(event: Blockly.Events.Abstract): boolean {
  if (event.isUiEvent) {
    return false;
  }
  if (event instanceof Blockly.Events.VarTypeChange) {
    return true;
  }
  switch (event.type) {
    case Blockly.Events.BLOCK_CREATE:
    case Blockly.Events.BLOCK_DELETE:
    case Blockly.Events.BLOCK_MOVE:
    case Blockly.Events.VAR_CREATE:
      return true;
    case Blockly.Events.BLOCK_CHANGE:
      return (event as Blockly.Events.BlockChange).element === 'field';
  }
  return false;
}

/**
 * Sets the type of each variable in the given workspace from the values assigned to it, and puts
 * a warning on each block that assigns a variable a value of a different type.
 *
 * Values that don't have a type are ignored, since they might be of any type. A variable keeps
 * its type as long as some value of that type is assigned to it, so assigning a value of another
 * type gets a warning instead of changing the variable's type. Otherwise, the variable gets the
 * type of the first value that has a type. If none of the values assigned to a variable have a
 * type, the variable is untyped. If no values are assigned to a variable, its type is left
 * unchanged.
 *
 * Changing a variable's type isn't recorded as an undoable action because the types are
 * inferred again after an undo.
 */
export function updateVariableTypes(workspace: Blockly.Workspace): void {
  if (workspace.isFlyout) {
    return;
  }
  const variableMap = workspace.getVariableMap();
  const variables = variableMap.getAllVariables();
  const oldRecordUndo = Blockly.Events.getRecordUndo();
  try {
    Blockly.Events.setRecordUndo(false);
    // Repeat because a variable can be assigned the value of another variable whose type
    // changed.
    for (let i = 0; i <= variables.length; i++) {
      let changed = false;
      for (const variable of variables) {
        const newType = inferVariableType(workspace, variable);
        if (newType !== null && newType !== variable.getType()) {
          variableMap.changeVariableType(variable, newType);
          changed = true;
        }
      }
      if (!changed) {
        break;
      }
    }
  } finally {
    Blockly.Events.setRecordUndo(oldRecordUndo);
  }
  updateSetterWarnings(workspace);
}

/**
 * Returns the type of the given variable based on the values assigned to it, or null if no
 * values are assigned to it.
 */
function inferVariableType(
    workspace: Blockly.Workspace,
    variable: Blockly.IVariableModel<Blockly.IVariableState>): string | null {
  const valueBlocks = Blockly.Variables.getVariableUsesById(workspace, variable.getId())
      .filter(block => block.type === BLOCK_TYPE_VARIABLES_SET)
      .map(block => block.getInputTargetBlock(INPUT_VALUE))
      .filter(valueBlock => valueBlock !== null);
  if (!valueBlocks.length) {
    return null;
  }
  const valueTypes = valueBlocks.map(getValueType).filter(type => type !== '');
  if (!valueTypes.length) {
    return '';
  }
  return valueTypes.includes(variable.getType()) ? variable.getType() : valueTypes[0];
}

/**
 * Puts a warning on each variables_set block that assigns its variable a value whose type is
 * different from the variable's type, and clears the warning on the other variables_set blocks.
 */
function updateSetterWarnings(workspace: Blockly.Workspace): void {
  for (const block of workspace.getBlocksByType(BLOCK_TYPE_VARIABLES_SET, false)) {
    block.setWarningText(getDifferentTypeWarning(block), WARNING_ID_DIFFERENT_TYPE);
  }
}

/**
 * Returns the warning for the given variables_set block if it assigns its variable a value whose
 * type is different from the variable's type, or null if it doesn't.
 */
export function getDifferentTypeWarning(block: Blockly.Block): string | null {
  const variable = (block.getField(FIELD_VAR) as Blockly.FieldVariable | null)?.getVariable();
  const valueBlock = block.getInputTargetBlock(INPUT_VALUE);
  const valueType = valueBlock ? getValueType(valueBlock) : '';
  if (!variable || !variable.getType() || !valueType || valueType === variable.getType()) {
    return null;
  }
  return Blockly.Msg['WARNING_SET_VARIABLE_DIFFERENT_TYPE']
      .replace('{{variableName}}', variable.getName())
      .replace('{{valueType}}', valueType)
      .replace('{{variableType}}', variable.getType());
}

/** Returns the type of the value of the given block, or '' if it doesn't have a type. */
function getValueType(block: Blockly.Block): string {
  if (block.type === BLOCK_TYPE_VARIABLES_GET) {
    const field = block.getField(FIELD_VAR) as Blockly.FieldVariable | null;
    return field?.getVariable()?.getType() ?? '';
  }
  const check = block.outputConnection?.getCheck();
  if (check && check.length === 1) {
    const type = check[0];
    const genericTypePrefix = GENERIC_TYPE_PREFIXES.find(([prefix]) => type.startsWith(prefix));
    if (genericTypePrefix) {
      return genericTypePrefix[1];
    }
    // A class name has a dot in it.
    if (BUILT_IN_VARIABLE_TYPES.includes(type) || type.includes('.')) {
      return type;
    }
  }
  return '';
}
