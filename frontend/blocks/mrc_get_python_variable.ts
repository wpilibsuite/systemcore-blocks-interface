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


import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import {
    createModuleOrClassVariableSetterBlock,
    createInstanceVariableSetterBlock } from '../blocks/mrc_set_python_variable';
import {
    classNameToShowOnBlocks,
    getAllowedTypesForSetCheck,
    getClassData,
    getModuleData,
    getOutputCheck } from './utils/python';
import {
    ClassData,
    ModuleData,
    organizeVarDataByType,
    VariableGettersAndSetters } from './utils/python_json_types';
import * as variable from './utils/variable';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_VARIABLES } from '../themes/styles';
import * as toolboxItems from '../toolbox/items';
import { replaceTokens } from './tokens';


// A block to get a python variable.

export const BLOCK_NAME = 'mrc_get_python_variable';

export enum VariableKind {
  MODULE = 'module',
  CLASS = 'class',
  INSTANCE = 'instance',
}

const FIELD_MODULE_OR_CLASS_NAME = 'MODULE_OR_CLASS';
const FIELD_VARIABLE_NAME = 'VAR';

const WARNING_ID_VARIABLE_CHANGED = 'variable changed';

// Variables and functions used for populating the drop down field for the variable names.

const PythonVariableGetterNames = Object.create(null);
const PythonVariableGetterTooltips = Object.create(null);

function createKey(
    varKind: string, moduleOrClassName: string, varType: string): string {
  return varKind + ' ' + moduleOrClassName + ' ' + varType;
}

export function initializeModuleVariableGetter(
    moduleName: string, varType: string, varNames: string[], tooltips: string[]): void {
  const key = createKey(VariableKind.MODULE, moduleName, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeClassVariableGetter(
    className: string, varType: string, varNames: string[], tooltips: string[]): void {
  const key = createKey(VariableKind.CLASS, className, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

export function initializeInstanceVariableGetter(
    className: string, varType: string, varNames: string[], tooltips: string[]): void {
  const key = createKey(VariableKind.INSTANCE, className, varType);
  PythonVariableGetterNames[key] = varNames;
  PythonVariableGetterTooltips[key] = tooltips;
}

type GetPythonVariableBlock = Blockly.Block & GetPythonVariableMixin;
interface GetPythonVariableMixin extends GetPythonVariableMixinType {
  mrcVarKind: VariableKind,
  mrcModuleOrClassName: string,
  mrcVarType: string,
  mrcSelfLabel: string,
  mrcSelfType: string,
  mrcImportModule: string,
  mrcActualVariableName: string,
  mrcKey: string,
}
type GetPythonVariableMixinType = typeof GET_PYTHON_VARIABLE;

/** Extra state for serialising mrc_get_python_variable blocks. */
type GetPythonVariableExtraState = {
  /**
   * The kind of variable: module, class, or instance.
   */
  varKind: string,
  /**
   * The module name (if varKind is module) or class name (if varKind is class or instance).
   */
  moduleOrClassName: string,
  /**
   * Specified if the type of the variable is known.
   */
  varType?: string,
  /**
   * The label for the self socket. Specified only for instance variables.
   */
  selfLabel?: string,
  /**
   * The type of the self input. Specified only for instance variables.
   */
  selfType?: string,
  /**
   * Specified if an import statement is needed for the generated python code.
   */
  importModule?: string,
  /**
   * Specified if the actual variable name is different than the name given in
   * the FIELD_VARIABLE_NAME field.
   */
  actualVariableName?: string,
};

const GET_PYTHON_VARIABLE = {
  /**
   * Block initialization.
   */
  init: function(this: GetPythonVariableBlock): void {
    this.appendDummyInput('VAR')
        .appendField(Blockly.Msg['GET'])
        .appendField(createFieldNonEditableText(''), FIELD_MODULE_OR_CLASS_NAME)
        .appendField('.');
    this.setStyle(MRC_STYLE_VARIABLES);
    this.setTooltip(() => {
      const varName = this.getFieldValue(FIELD_VARIABLE_NAME);
      let tooltip: string;
      switch (this.mrcVarKind) {
        case VariableKind.MODULE: {
          const moduleName = this.mrcModuleOrClassName;
          tooltip = replaceTokens(Blockly.Msg['GET_MODULE_VARIABLE_TOOLTIP'], {
            moduleName: moduleName,
            varName: varName
          });
          break;
        }
        case VariableKind.CLASS: {
          const className = this.mrcModuleOrClassName;
          tooltip = replaceTokens(Blockly.Msg['GET_CLASS_VARIABLE_TOOLTIP'], {
            className: className,
            varName: varName
          });
          break;
        }
        case VariableKind.INSTANCE: {
          const className = this.mrcModuleOrClassName;
          tooltip = replaceTokens(Blockly.Msg['GET_INSTANCE_VARIABLE_TOOLTIP'], {
            varName: varName,
            className: className
          });
          break;
        }
        default:
          throw new Error(Blockly.Msg['VAR_KIND_MUST_BE_MODULE_CLASS_OR_INSTANCE']);
      }
      const varTooltips = PythonVariableGetterTooltips[this.mrcKey];
      if (varTooltips) {
        const varNames = PythonVariableGetterNames[this.mrcKey];
        for (let i = 0; i < varNames.length; i++) {
          if (varNames[i] === varName) {
            const varTooltip = varTooltips[i];
            if (varTooltip) {
              tooltip += '\n\n' + varTooltip;
              break;
            }
          }
        }
      }
      return tooltip;
    });
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(
      this: GetPythonVariableBlock): GetPythonVariableExtraState {
    const extraState: GetPythonVariableExtraState = {
      varKind: this.mrcVarKind,
      moduleOrClassName: this.mrcModuleOrClassName,
    };
    if (this.mrcVarType) {
      extraState.varType = this.mrcVarType;
    }
    if (this.mrcSelfLabel) {
      extraState.selfLabel = this.mrcSelfLabel;
    }
    if (this.mrcSelfType) {
      extraState.selfType = this.mrcSelfType;
    }
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    if (this.mrcActualVariableName) {
      extraState.actualVariableName = this.mrcActualVariableName;
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: GetPythonVariableBlock,
      extraState: GetPythonVariableExtraState
  ): void {
    this.mrcVarKind = extraState.varKind as VariableKind;
    this.mrcModuleOrClassName = extraState.moduleOrClassName;
    this.mrcVarType = extraState.varType ? extraState.varType : '';
    this.mrcSelfLabel = extraState.selfLabel ? extraState.selfLabel : '';
    this.mrcSelfType = extraState.selfType ? extraState.selfType : '';
    this.mrcImportModule = extraState.importModule
        ? extraState.importModule : '';
    this.mrcActualVariableName = extraState.actualVariableName
        ? extraState.actualVariableName : '';
    this.mrcKey = createKey(this.mrcVarKind, this.mrcModuleOrClassName, this.mrcVarType);
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function(this: GetPythonVariableBlock): void {
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    const outputCheck = getOutputCheck(this.mrcVarType);
    if (outputCheck) {
      this.setOutput(true, outputCheck);
    } else {
      this.setOutput(true);
    }
    const input = this.getInput('VAR');
    if (input) {
      const varNames = PythonVariableGetterNames[this.mrcKey];
      if (varNames) {
        // Create the drop-down with the variable names.
        input.appendField(createFieldDropdown(varNames), FIELD_VARIABLE_NAME);
      } else {
        input.appendField(createFieldNonEditableText(''), FIELD_VARIABLE_NAME);
      }
    }
    // Add input socket for self, if necessary.
    if (this.mrcSelfLabel && this.mrcSelfType) {
      this.appendValueInput('SELF')
          .setCheck(getAllowedTypesForSetCheck(this.mrcSelfType))
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(this.mrcSelfLabel);
    }
  },

  /**
   * mrcOnLoad is called for each GetPythonVariableBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: GetPythonVariableBlock, _editor: Editor): void {
    this.checkBlock();
  },
  checkBlock: function(this: GetPythonVariableBlock): void {
    const warnings: string[] = [];

    switch (this.mrcVarKind) {
      case VariableKind.MODULE:
        this.checkModuleVariable(warnings);
        break;
      case VariableKind.CLASS:
        this.checkClassVariable(warnings);
        break;
      case VariableKind.INSTANCE:
        this.checkInstanceVariable(warnings);
        break;
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_VARIABLE_CHANGED);
      const icon = this.getIcon(Blockly.icons.IconType.WARNING);
      if (icon) {
        icon.setBubbleVisible(true);
      }
      if (this.rendered) {
        (this as unknown as Blockly.BlockSvg).bringToFront();
      }
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_VARIABLE_CHANGED);
    }
  },
  checkModuleVariable: function(this: GetPythonVariableBlock, warnings: string[]): void {
    // If this block is getting a module variable, check whether the module and variable still
    // exist. If the module or variable doesn't exist, put a visible warning on this block.
    const moduleName = this.mrcModuleOrClassName;
    const moduleData = getModuleData(moduleName);
    if (moduleData) {
      let foundVariable = false;
      const blockVarName = this.getFieldValue(FIELD_VARIABLE_NAME);
      for (const varData of moduleData.moduleVariables) {
        if (blockVarName === varData.name &&
            this.mrcVarType === varData.type) {
          foundVariable = true;
          break;
        }
      }
      if (!foundVariable) {
        warnings.push(Blockly.Msg.WARNING_GET_MODULE_VARIABLE_MISSING_VARIABLE);
      }
    } else {
      warnings.push(Blockly.Msg.WARNING_GET_MODULE_VARIABLE_MISSING_MODULE);
    }
  },
  checkClassVariable: function(this: GetPythonVariableBlock, warnings: string[]): void {
    // If this block is getting a class variable, check whether the class and variable still
    // exist. If the class or variable doesn't exist, put a visible warning on this block.
    const className = this.mrcModuleOrClassName;
    const classData = getClassData(className);
    if (classData) {
      let foundVariable = false;
      const blockVarName = this.getFieldValue(FIELD_VARIABLE_NAME);
      for (const varData of classData.classVariables) {
        if (blockVarName === varData.name &&
            this.mrcVarType === varData.type) {
          foundVariable = true;
          break;
        }
      }
      if (!foundVariable) {
        warnings.push(Blockly.Msg.WARNING_GET_CLASS_VARIABLE_MISSING_VARIABLE);
      }
    } else {
      warnings.push(Blockly.Msg.WARNING_GET_CLASS_VARIABLE_MISSING_CLASS);
    }
  },
  checkInstanceVariable: function(this: GetPythonVariableBlock, warnings: string[]): void {
    // If this block is getting an instance variable, check whether the class and variable still
    // exist. If the class or variable doesn't exist, put a visible warning on this block.
    const className = this.mrcModuleOrClassName;
    const classData = getClassData(className);
    if (classData) {
      let foundVariable = false;
      const blockVarName = this.getFieldValue(FIELD_VARIABLE_NAME);
      for (const varData of classData.instanceVariables) {
        if (blockVarName === varData.name &&
            this.mrcVarType === varData.type) {
          foundVariable = true;
          break;
        }
      }
      if (!foundVariable) {
        warnings.push(Blockly.Msg.WARNING_GET_INSTANCE_VARIABLE_MISSING_VARIABLE);
      }
    } else {
      warnings.push(Blockly.Msg.WARNING_GET_INSTANCE_VARIABLE_MISSING_CLASS);
    }
  },

  /**
   * mrcShowSimpleClassNames is called for each GetPythonVariableBlock:
   * 1. after a block is loaded in the blockly workspace
   * 2. after a block is created
   * 3. when showSimpleClassNames has been changed
   */
  mrcShowSimpleClassNames: function(this: GetPythonVariableBlock, _editor: Editor, showSimpleClassNames: boolean): void {
    if (this.mrcVarKind === VariableKind.CLASS ||
        this.mrcVarKind === VariableKind.INSTANCE) {
      this.setFieldValue(
          classNameToShowOnBlocks(this.mrcModuleOrClassName, showSimpleClassNames),
          FIELD_MODULE_OR_CLASS_NAME);
    }
  },
};

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = GET_PYTHON_VARIABLE;
};

export const pythonFromBlock = function(
    block: GetPythonVariableBlock,
    generator: ExtendedPythonGenerator,
) {
  const varName = block.mrcActualVariableName
      ? block.mrcActualVariableName
      : block.getFieldValue(FIELD_VARIABLE_NAME);
  switch (block.mrcVarKind) {
    case VariableKind.MODULE: {
      const moduleName = block.mrcModuleOrClassName;
      if (block.mrcImportModule) {
        generator.importModule(block.mrcImportModule);
      }
      const code = moduleName + '.' + varName;
      return [code, Order.MEMBER];
    }
    case VariableKind.CLASS: {
      const className = block.mrcModuleOrClassName;
      if (block.mrcImportModule) {
        generator.importModule(block.mrcImportModule);
      }
      const code = className + '.' + varName;
      return [code, Order.MEMBER];
    }
    case VariableKind.INSTANCE: {
      const selfValue = generator.valueToCode(block, 'SELF', Order.MEMBER);
      const code = selfValue + '.' + varName;
      return [code, Order.MEMBER];
    }
    default:
      throw new Error(Blockly.Msg['VAR_KIND_MUST_BE_MODULE_CLASS_OR_INSTANCE']);
  }
};

// Functions used for creating blocks for the toolbox.

export function addModuleVariableBlocks(
    moduleData: ModuleData,
    contents: toolboxItems.ContentsType[]) {
  if (moduleData.moduleVariables.length) {
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(moduleData.moduleVariables);
    addModuleOrClassVariableBlocks(
        VariableKind.MODULE,
        moduleData.moduleName,
        moduleData.moduleName,
        varsByType,
        contents,
        false);
  }
}

export function addClassVariableBlocks(
    classData: ClassData,
    contents: toolboxItems.ContentsType[],
    showSimpleClassNames: boolean) {
  if (classData.classVariables.length) {
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(classData.classVariables);
    addModuleOrClassVariableBlocks(
        VariableKind.CLASS,
        classData.moduleName,
        classData.className,
        varsByType,
        contents,
        showSimpleClassNames);
  }
}

function addModuleOrClassVariableBlocks(
    varKind: VariableKind, 
    importModule: string,
    moduleOrClassName: string,
    varsByType: {[key: string]: VariableGettersAndSetters},
    contents: toolboxItems.ContentsType[],
    showSimpleClassNames: boolean) {
  for (const varType in varsByType) {
    const variableGettersAndSetters = varsByType[varType];
    for (let i = 0; i < variableGettersAndSetters.varNamesForGetter.length; i++) {
      const varName = variableGettersAndSetters.varNamesForGetter[i];
      const getterBlock = createModuleOrClassVariableGetterBlock(
          varKind, importModule, moduleOrClassName, varType, varName, showSimpleClassNames);
      contents.push(getterBlock);
      if (variableGettersAndSetters.varNamesForSetter.includes(varName)) {
        const setterBlock = createModuleOrClassVariableSetterBlock(
            varKind, importModule, moduleOrClassName, varType, varName, showSimpleClassNames);
        contents.push(setterBlock);
      }
    }
  }
}

function createModuleOrClassVariableGetterBlock(
    varKind: VariableKind,
    importModule: string,
    moduleOrClassName: string,
    varType: string,
    varName: string,
    showSimpleClassNames: boolean): toolboxItems.Block {
  const extraState: GetPythonVariableExtraState = {
    varKind: varKind,
    moduleOrClassName: moduleOrClassName,
    varType: varType,
    importModule: importModule,
  };
  const fields: {[key: string]: any} = {};
  if (varKind === VariableKind.MODULE) {
    fields[FIELD_MODULE_OR_CLASS_NAME] = moduleOrClassName;
  } else {
    fields[FIELD_MODULE_OR_CLASS_NAME] = classNameToShowOnBlocks(moduleOrClassName, showSimpleClassNames);
  }
  fields[FIELD_VARIABLE_NAME] = varName;
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, null);
}

export function addInstanceVariableBlocks(
    classData: ClassData,
    contents: toolboxItems.ContentsType[],
    showSimpleClassNames: boolean) {
  if (classData.instanceVariables.length) {
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(classData.instanceVariables);
    for (const varType in varsByType) {
      const variableGettersAndSetters = varsByType[varType];
      for (let i = 0; i < variableGettersAndSetters.varNamesForGetter.length; i++) {
        const varName = variableGettersAndSetters.varNamesForGetter[i];
        const getterBlock = createInstanceVariableGetterBlock(classData.className, varType, varName, showSimpleClassNames);
        contents.push(getterBlock);
        if (variableGettersAndSetters.varNamesForSetter.includes(varName)) {
          const setterBlock = createInstanceVariableSetterBlock(classData.className, varType, varName, showSimpleClassNames);
          contents.push(setterBlock);
        }
      }
    }
  }
}

function createInstanceVariableGetterBlock(
    className: string,
    varType: string,
    varName: string,
    showSimpleClassNames: boolean): toolboxItems.Block {
  const selfLabel = variable.getSelfArgName(className);
  const extraState: GetPythonVariableExtraState = {
    varKind: VariableKind.INSTANCE,
    moduleOrClassName: className,
    varType: varType,
    selfLabel: selfLabel,
    selfType: className,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MODULE_OR_CLASS_NAME] = classNameToShowOnBlocks(className, showSimpleClassNames);
  fields[FIELD_VARIABLE_NAME] = varName;
  const inputs: {[key: string]: any} = {};
  const selfVarName = variable.varNameForType(className);
  if (selfVarName) {
    inputs['SELF'] = variable.createVariableGetterBlockValue(selfVarName);
  }
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
}
