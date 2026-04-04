/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview Create a mechanism with a name of a certain type
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import { MRC_STYLE_MECHANISMS } from '../themes/styles'
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { makeLegalName } from './utils/validator';
import { valueForComponentArgInput } from './utils/value';
import * as toolboxItems from '../toolbox/items';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as storageNames from '../storage/names';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';
import {
    BLOCK_NAME as MRC_MECHANISM_COMPONENT_HOLDER,
    MechanismComponentHolderBlock,
    mrcDescendantsMayHaveChanged } from './mrc_mechanism_component_holder';
import { renameMethodCallers } from './mrc_call_python_function'
import { getMechanismInitArgName } from './mrc_component'
import { renameMechanismName as renameMechanismNameInEventHandlers } from './mrc_event_handler'
import { getAllowedTypesForSetCheck } from './utils/python';
import { isPortType, upgradePortTypeString } from './utils/python_json_types';

export const BLOCK_NAME = 'mrc_mechanism';
export const OUTPUT_NAME = 'mrc_mechansim';

export const FIELD_NAME = 'NAME';
export const FIELD_TYPE = 'TYPE';
const INPUT_ARG_PREFIX = 'ARG';
const FIELD_COMPONENT_NAME_PREFIX = 'COMPONENT'
const FIELD_ARG_NAME_PREFIX = 'ARGNAME';

type Parameter = {
  name: string,
  type: string,
  defaultValue?: string,
  componentId?: string,
  componentName?: string,
  componentArgsIndex?: number,  // The zero-based number when iterating through component.args.
};

type MechanismExtraState = {
  mechanismModuleId?: string,
  mechanismId?: string,
  importModule?: string,
  parameters?: Parameter[],
}

const WARNING_ID_NOT_IN_HOLDER = 'not in holder';
const WARNING_ID_MECHANISM_CHANGED = 'mechanism changed';

export type MechanismBlock = Blockly.Block & MechanismMixin;
interface MechanismMixin extends MechanismMixinType {
  mrcMechanismModuleId: string
  mrcMechanismId: string,
  mrcImportModule: string,
  mrcParameters: Parameter[],

  /**
   * mrcHasNotInHolderWarning is set to true if we set the NOT_IN_HOLDER warning text on the block.
   * It is checked to avoid adding a warning if there already is one. Otherwise, if we get two move
   * events (one for drag and one for snap), and we call setWarningText for both events, we get a
   * detached warning balloon.
   * See https://github.com/wpilibsuite/systemcore-blocks-interface/issues/248.
   */
  mrcHasNotInHolderWarning: boolean,
}
type MechanismMixinType = typeof MECHANISM;

const MECHANISM = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismBlock): void {
    this.mrcHasNotInHolderWarning = false;
    this.setStyle(MRC_STYLE_MECHANISMS);
    const nameField = new Blockly.FieldTextInput('')
    nameField.setValidator(this.mrcNameFieldValidator.bind(this, nameField));
    this.appendDummyInput()
      .appendField(nameField, FIELD_NAME)
      .appendField(Blockly.Msg['OF_TYPE'])
      .appendField(createFieldNonEditableText(''), FIELD_TYPE);
    this.setPreviousStatement(true, OUTPUT_NAME);
    this.setNextStatement(true, OUTPUT_NAME);
  },
  ...NONCOPYABLE_BLOCK,

  /**
    * Returns the state of this block as a JSON serializable object.
    */
  saveExtraState: function (this: MechanismBlock): MechanismExtraState {
    const extraState: MechanismExtraState = {
      mechanismModuleId: this.mrcMechanismModuleId,
      mechanismId: this.mrcMechanismId,
    };
    extraState.parameters = [];
    this.mrcParameters.forEach((arg) => {
      extraState.parameters!.push({...arg});
    });
    if (this.mrcImportModule) {
      extraState.importModule = this.mrcImportModule;
    }
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: MechanismBlock, extraState: MechanismExtraState): void {
    this.mrcMechanismModuleId = extraState.mechanismModuleId ? extraState.mechanismModuleId : '';
    this.mrcMechanismId = extraState.mechanismId ? extraState.mechanismId : this.id;
    this.mrcImportModule = extraState.importModule ? extraState.importModule : '';
    this.mrcParameters = [];
    if (extraState.parameters) {
      extraState.parameters.forEach((arg) => {
        // Prior to version 0.0.10, Parameter had a field named componentPortsIndex instead of componentArgsIndex.
        if ('componentPortsIndex' in arg && arg['componentPortsIndex'] != undefined) {
          arg.componentArgsIndex = arg['componentPortsIndex'] as number;
          delete arg.componentPortsIndex;
        }
        const upgradedArgType = upgradePortTypeString(arg.type);
        if (upgradedArgType !== arg.type) {
          const upgradedArg = {...arg};
          upgradedArg.type = upgradedArgType;
          this.mrcParameters.push(upgradedArg);
        } else {
          this.mrcParameters.push({...arg});
        }
      });
    }
    // Create input sockets for the arguments.
    for (let i = 0; i < this.mrcParameters.length; i++) {
      this.appendValueInput(INPUT_ARG_PREFIX + i)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField('', FIELD_COMPONENT_NAME_PREFIX + i)
          .appendField('', FIELD_ARG_NAME_PREFIX + i);
    }
  },
  mrcNameFieldValidator(this: MechanismBlock, nameField: Blockly.FieldTextInput, name: string): string {
    // Strip leading and trailing whitespace.
    name = name.trim();

    if (this.isInFlyout) {
      // Flyouts can have multiple methods with identical names.
      return name;
    }

    const otherNames: string[] = [];
    this.workspace.getBlocksByType(BLOCK_NAME)
        .filter(block => block.id !== this.id)
        .forEach((block) => {
          otherNames.push(block.getFieldValue(FIELD_NAME));
        });

    const legalName = makeLegalName(name, otherNames, /* mustBeValidPythonIdentifier */ true);
    const oldName = nameField.getValue();
    if (oldName && oldName !== name && oldName !== legalName) {
      // Rename any callers.
      renameMethodCallers(this.workspace, this.mrcMechanismId, legalName);
      // Rename any event handlers
      renameMechanismNameInEventHandlers(this.workspace, this.mrcMechanismId, legalName);
    }
    return legalName;
  },
  getMechanism: function (this: MechanismBlock): storageModuleContent.MechanismInRobot | null {
    const mechanismName = this.getFieldValue(FIELD_NAME);
    const mechanismType = this.mrcImportModule + '.' + this.getFieldValue(FIELD_TYPE);
    return {
      moduleId: this.mrcMechanismModuleId,
      mechanismId: this.mrcMechanismId,
      name: mechanismName,
      className: mechanismType,
    };
  },

  /**
   * mrcOnModuleCurrent is called for each MechanismBlock when the module becomes the current module.
   */
  mrcOnModuleCurrent: function(this: MechanismBlock, editor: Editor): void {
    this.checkMechanism(editor);
  },
  /**
   * mrcOnLoad is called for each MechanismBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: MechanismBlock, editor: Editor): void {
    this.checkBlockIsInHolder();
    this.checkMechanism(editor);
  },
  /**
   * mrcOnCreate is called for each MechanismBlock when it is created.
   */
  mrcOnCreate: function(this: MechanismBlock, editor: Editor): void {
    this.checkBlockIsInHolder();
    this.checkMechanism(editor);
  },
  /**
   * mrcOnMove is called when a MechanismBlock is moved.
   */
  mrcOnMove: function(this: MechanismBlock, editor: Editor, reason: string[]): void {
    this.checkBlockIsInHolder();
    if (reason.includes('connect')) {
      const rootBlock: Blockly.Block | null = this.getRootBlock();
      if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
        (rootBlock as MechanismComponentHolderBlock).setNameOfChildBlock(this);
      }
    }
    mrcDescendantsMayHaveChanged(this.workspace, editor);
  },
  checkBlockIsInHolder: function(this: MechanismBlock): void {
    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
      // If the root block is the mechanism_component_holder, the mechanism block is allowed to stay.
      // Remove any previous warning.
      this.setWarningText(null, WARNING_ID_NOT_IN_HOLDER);
      this.mrcHasNotInHolderWarning = false;
    } else {
      // Otherwise, add a warning to the block.
      if (!this.mrcHasNotInHolderWarning) {
        this.setWarningText(Blockly.Msg.WARNING_MECHANISM_NOT_IN_HOLDER, WARNING_ID_NOT_IN_HOLDER);
        const icon = this.getIcon(Blockly.icons.IconType.WARNING);
        if (icon) {
          icon.setBubbleVisible(true);
        }
        this.mrcHasNotInHolderWarning = true;
      }
    }
  },
  /**
   * checkMechanism checks the block, updates it, and/or adds a warning balloon if necessary.
   * It is called from mrcOnModuleCurrent and mrcOnLoad above.
   */
  checkMechanism: function(this: MechanismBlock, editor: Editor): void {
    const warnings: string[] = [];

    // Find the mechanism.
    let foundMechanism: storageModule.Mechanism | null = null;

    if (this.mrcMechanismModuleId) {
      // Find the mechanism by module id.
      for (const mechanism of editor.getMechanisms()) {
        if (mechanism.moduleId === this.mrcMechanismModuleId) {
          foundMechanism = mechanism;
          break;
        }
      }
    } else {
      // Find the mechanism by class name.
      const className = this.getFieldValue(FIELD_TYPE);
      for (const mechanism of editor.getMechanisms()) {
        if (mechanism.className === className) {
          // Grap the mechanism module id, so we have it for next time.
          this.mrcMechanismModuleId = mechanism.moduleId;
          foundMechanism = mechanism;
          break;
        }
      }
    }

    if (foundMechanism) {
      // Here we need all the components (regular and private) from the mechanism because we need
      // to create parameters for all the components.
      const components = editor.getAllComponentsFromMechanism(foundMechanism);

      // If the mechanism class name has changed, update this blcok.
      if (this.getFieldValue(FIELD_TYPE) !== foundMechanism.className) {
        this.setFieldValue(foundMechanism.className, FIELD_TYPE);
      }
      const importModule = storageNames.pascalCaseToSnakeCase(foundMechanism.className);
      if (this.mrcImportModule !== importModule) {
        this.mrcImportModule = importModule;
      }

      // Save the old parameters and the blocks that are connected to their sockets.
      const oldParameters: Parameter[] = [];
      const oldConnectedBlocks: (Blockly.Block | null)[] = [];
      for (let i = 0; i < this.mrcParameters.length; i++) {
        oldParameters[i] = this.mrcParameters[i];
        oldConnectedBlocks[i] = null;
        const argInput = this.getInput(INPUT_ARG_PREFIX + i);
        if (argInput) {
          argInput.setCheck(null);
          if (argInput.connection && argInput.connection.targetBlock()) {
            oldConnectedBlocks[i] = argInput.connection.targetBlock();
          }
        }
      }

      // Regenerate mrc_parameters and create new inputs if necessary.
      const foundOldParameter: boolean[] = [];
      this.mrcParameters = [];
      let parametersIndex = 0;
      components.forEach(component => {
        let componentArgsIndex = 0;
        component.args.forEach((componentArg) => {
          const argName = componentArg.name;
          this.mrcParameters.push({
            name: argName,
            type: componentArg.type,
            defaultValue: componentArg.defaultValue,
            componentId: component.componentId,
            componentName: component.name,
            componentArgsIndex,
          });
          let argInput = this.getInput(INPUT_ARG_PREFIX + parametersIndex);
          if (argInput) {
            // Update field values for component name and parameter name
            this.setFieldValue(component.name, FIELD_COMPONENT_NAME_PREFIX + parametersIndex);
            this.setFieldValue(argName, FIELD_ARG_NAME_PREFIX + parametersIndex);
          } else {
            // Add new input.
            argInput = this.appendValueInput(INPUT_ARG_PREFIX + parametersIndex)
                .setAlign(Blockly.inputs.Align.RIGHT)
                .appendField(component.name, FIELD_COMPONENT_NAME_PREFIX + parametersIndex)
                .appendField(argName, FIELD_ARG_NAME_PREFIX + parametersIndex);
          }
          // Look in oldParameters to find the matching parameter.
          let foundOldParameterIndex = -1;
          for (let j = 0; j < oldParameters.length; j++) {
            if (oldParameters[j].componentId === this.mrcParameters[parametersIndex].componentId &&
                oldParameters[j].componentArgsIndex === this.mrcParameters[parametersIndex].componentArgsIndex) {
              foundOldParameterIndex = j;
              break;
            }
          }
          foundOldParameter.push((foundOldParameterIndex !== -1));
          if (foundOldParameterIndex !== -1) {
            foundOldParameter[parametersIndex] = true;
            if (foundOldParameterIndex === parametersIndex) {
              // The old connected block is already connected to this input.
              oldConnectedBlocks[foundOldParameterIndex] = null;
            } else {
              // Move the old connected block to this input.
              const oldConnectedBlock = oldConnectedBlocks[foundOldParameterIndex];
              if (oldConnectedBlock && oldConnectedBlock.outputConnection && argInput.connection) {
                argInput.connection.connect(oldConnectedBlock.outputConnection);
                oldConnectedBlocks[foundOldParameterIndex] = null;
              }
            }
          } else {
            // Disconnect the old connected block.
            if (argInput.connection && argInput.connection.targetBlock()) {
              argInput.connection.disconnect();
            }
          }
          argInput.setCheck(getAllowedTypesForSetCheck(this.mrcParameters[parametersIndex].type));

          componentArgsIndex++;
          parametersIndex++;
        });
      });

      // Remove extra inputs.
      for (let i = this.mrcParameters.length; this.getInput(INPUT_ARG_PREFIX + i); i++) {
        this.removeInput(INPUT_ARG_PREFIX + i);
      }

      // Remove old blocks that are no longer connected to input sockets.
      for (let i = 0; i < oldConnectedBlocks.length; i++) {
        const oldConnectedBlock = oldConnectedBlocks[i];
        if (oldConnectedBlock && oldConnectedBlock.outputConnection) {
          if (!oldConnectedBlock.outputConnection.isConnected()) {
            oldConnectedBlock.dispose();
          }
        }
      }

      // Add blocks to inputs for new parameters.
      for (let i = 0; i < this.mrcParameters.length; i++) {
        if (foundOldParameter[i]) {
          continue;
        }
        let defaultValue: string;
        if (this.mrcParameters[i].defaultValue) {
          defaultValue = this.mrcParameters[i].defaultValue as string;
        } else {
          defaultValue = '';
        }
        const value = valueForComponentArgInput(this.mrcParameters[i].type, defaultValue);
        if (value) {
          // Connect the new block to the input.
          const newBlockState = value.block;
          const newBlock = this.workspace.newBlock(newBlockState.type) as Blockly.BlockSvg;
          if (newBlockState.extraState && newBlock.loadExtraState) {
            newBlock.loadExtraState(newBlockState.extraState);
          }
          if (newBlockState.fields) {
            const keys = Object.keys(newBlockState.fields);
            for (let i = 0; i < keys.length; i++) {
              const fieldName = keys[i];
              const field = newBlock.getField(fieldName);
              if (field) {
                field.loadState(newBlockState.fields[fieldName]);
              }
            }
          }
          newBlock.initSvg();
          const argInput = this.getInput(INPUT_ARG_PREFIX + i);
          if (argInput && argInput.connection) {
            argInput.connection.connect(newBlock.outputConnection);
          }
        }
      }
    } else {
      // Did not find the mechanism.
      warnings.push(Blockly.Msg['MECHANISM_NOT_FOUND_WARNING']);
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_MECHANISM_CHANGED);
      const icon = this.getIcon(Blockly.icons.IconType.WARNING);
      if (icon) {
        icon.setBubbleVisible(true);
      }
      if (this.rendered) {
        (this as unknown as Blockly.BlockSvg).bringToFront();
      }
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_MECHANISM_CHANGED);
    }
  },
  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: MechanismBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcMechanismId in oldIdToNewId) {
      this.mrcMechanismId = oldIdToNewId[this.mrcMechanismId];
    }
  },
  mrcGetFullLabel: function(this: MechanismBlock): string {
    return this.getFieldValue(FIELD_NAME) + ' ' + Blockly.Msg.OF_TYPE + ' ' + this.getFieldValue(FIELD_TYPE);
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM;
}

export const pythonFromBlock = function (
  block: MechanismBlock,
  generator: ExtendedPythonGenerator,
) {
  if (block.mrcImportModule) {
    generator.importModule(block.mrcImportModule);
  }

  const mechanismName = block.getFieldValue(FIELD_NAME);
  const mechanismType = block.mrcImportModule + '.' + block.getFieldValue(FIELD_TYPE);
  let code = 'self.' + mechanismName + ' = ' + mechanismType + '(\n';

  let previousComponentId: string | undefined = undefined;
  for (let i = 0; i < block.mrcParameters.length; i++) {
    // We pass a tuple of parameters for each component in the mechanism.
    if (block.mrcParameters[i].componentId !== previousComponentId) {
      const componentName = block.mrcParameters[i].componentName;
      if (componentName) {
        const argName = getMechanismInitArgName(componentName);
        code += generator.INDENT + argName + ' = (\n';
      }
    }

    let argCode = generator.valueToCode(block, INPUT_ARG_PREFIX + i, Order.NONE);
    // mrc_port blocks generate python code where each port parameter is followed by a comma, a
    // comment, and a newline. But other blocks don't do that.
    if (!isPortType(block.mrcParameters[i].type)) {
      argCode += ', # ' + block.mrcParameters[i].name + '\n';
    }
    code += generator.prefixLines(argCode, generator.INDENT.repeat(2));

    const nextComponentId = (i + 1 < block.mrcParameters.length)
        ? block.mrcParameters[i + 1].componentId
        : '';
    if (block.mrcParameters[i].componentId !== nextComponentId) {
      code += generator.INDENT + '),\n';
    }
    previousComponentId = block.mrcParameters[i].componentId;
  }
  code += ')\n';
  code += 'self.mechanisms.append(self.' + mechanismName + ')\n';

  return generator.addErrorHandlingCode(block, block.mrcGetFullLabel(), code);
}

export function createMechanismBlock(
    mechanism: storageModule.Mechanism, components: storageModuleContent.Component[]): toolboxItems.Block {
  const snakeCaseName = storageNames.pascalCaseToSnakeCase(mechanism.className);
  const mechanismName = 'my_' + snakeCaseName;
  const extraState: MechanismExtraState = {
    mechanismModuleId: mechanism.moduleId,
    importModule: snakeCaseName,
    parameters: [],
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_NAME] = mechanismName;
  fields[FIELD_TYPE] = mechanism.className;
  const inputs: {[key: string]: any} = {};
  let i = 0;
  components.forEach(component => {
    let componentArgsIndex = 0;
    component.args.forEach((componentArg) => {
      extraState.parameters?.push({
        name: componentArg.name,
        type: componentArg.type,
        defaultValue: componentArg.defaultValue,
        componentId: component.componentId,
        componentName: component.name,
        componentArgsIndex,
      });
      fields[FIELD_COMPONENT_NAME_PREFIX + i] = component.name;
      fields[FIELD_ARG_NAME_PREFIX + i] = componentArg.name;
      let defaultValue: string;
      if (componentArg.defaultValue) {
        defaultValue = componentArg.defaultValue as string;
      } else {
        defaultValue = '';
      }
      const input = valueForComponentArgInput(componentArg.type, defaultValue);
      if (input) {
        inputs[INPUT_ARG_PREFIX + i] = input;
      }
      componentArgsIndex++;
      i++;
    });
  });
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, inputs);
}
