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
import { getAllowedTypesForSetCheck } from './utils/python';
import * as toolboxItems from '../toolbox/items';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as storageNames from '../storage/names';
import { renameMethodCallers } from './mrc_call_python_function'
import { renameMechanismName as renameMechanismNameInEventHandlers } from './mrc_event_handler'
import { createPort } from './mrc_port';

export const BLOCK_NAME = 'mrc_mechanism';
export const OUTPUT_NAME = 'mrc_mechansim';

export const FIELD_NAME = 'NAME';
export const FIELD_TYPE = 'TYPE';

type Parameter = {
  name: string,
  type: string,
};

type MechanismExtraState = {
  mechanismModuleId?: string,
  mechanismId?: string,
  importModule?: string,
  parameters?: Parameter[],
}

const WARNING_ID_MECHANISM_CHANGED = 'mechanism changed';

export type MechanismBlock = Blockly.Block & MechanismMixin & Blockly.BlockSvg;
interface MechanismMixin extends MechanismMixinType {
  mrcMechanismModuleId: string
  mrcMechanismId: string,
  mrcImportModule: string,
  mrcParameters: Parameter[],
}
type MechanismMixinType = typeof MECHANISM;

const MECHANISM = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismBlock): void {
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
      extraState.parameters!.push({
        'name': arg.name,
        'type': arg.type,
      });
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
        this.mrcParameters.push({
          name: arg.name,
          type: arg.type,
        });
      });
    }
    this.updateBlock_();
  },
  /**
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function (this: MechanismBlock): void {
    // Update input sockets for the arguments.
    for (let i = 0; i < this.mrcParameters.length; i++) {
      const argName = this.mrcParameters[i].name;
      let argInput = this.getInput('ARG' + i);
      const argField = this.getField('ARGNAME' + i);
      if (argInput && argField) {
        // Ensure argument name is up to date. No need to fire a change event.
        Blockly.Events.disable();
        try {
          argField.setValue(argName);
        } finally {
          Blockly.Events.enable();
        }
      } else {
        // Add new input.
        argInput = this.appendValueInput('ARG' + i)
            .setAlign(Blockly.inputs.Align.RIGHT)
            .appendField(argName, 'ARGNAME' + i);
      }
      if (this.mrcParameters[i].type) {
        argInput.setCheck(getAllowedTypesForSetCheck(this.mrcParameters[i].type));
      }
    }
    // Remove deleted inputs.
    for (let i = this.mrcParameters.length; this.getInput('ARG' + i); i++) {
      this.removeInput('ARG' + i);
    }
  },
  mrcNameFieldValidator(this: MechanismBlock, nameField: Blockly.FieldTextInput, name: string): string {
    // Strip leading and trailing whitespace.
    name = name.trim();

    const legalName = name;
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
   * mrcOnLoad is called for each MechanismBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: MechanismBlock): void {
    this.mrcValidate();
  },
  /**
   * mrcValidate checks the block, updates it, and/or adds a warning balloon if necessary.
   * It is called from mrcOnLoad above and from Editor.makeCurrent.
   */
  mrcValidate: function(this: MechanismBlock): void {
    const warnings: string[] = [];

    const editor = Editor.getEditorForBlocklyWorkspace(this.workspace, true /* returnCurrentIfNotFound */);
    if (editor) {
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
        // to create port parameters for all the components.
        const components = editor.getAllComponentsFromMechanism(foundMechanism);

        // If the mechanism class name has changed, update this blcok.
        if (this.getFieldValue(FIELD_TYPE) !== foundMechanism.className) {
          this.setFieldValue(foundMechanism.className, FIELD_TYPE);
        }
        const importModule = storageNames.pascalCaseToSnakeCase(foundMechanism.className);
        if (this.mrcImportModule !== importModule) {
          this.mrcImportModule = importModule;
        }
        this.mrcParameters = [];
        components.forEach(component => {
          for (const port in component.ports) {
            this.mrcParameters.push({
              name: port,
              type: component.ports[port],
            });
          }
        });
        this.updateBlock_();
      } else {
        // Did not find the mechanism.
        warnings.push(Blockly.Msg['MECHANISM_NOT_FOUND_WARNING']);
      }
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_MECHANISM_CHANGED);
      this.getIcon(Blockly.icons.IconType.WARNING)!.setBubbleVisible(true);
      this.bringToFront();
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
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM;
}

export const pythonFromBlock = function (
  block: MechanismBlock,
  generator: ExtendedPythonGenerator,
) {
  if (block.mrcImportModule) {
    generator.addImport(block.mrcImportModule);
  }
  let code = 'self.' + block.getFieldValue(FIELD_NAME) + ' = ' + block.mrcImportModule + '.' + block.getFieldValue(FIELD_TYPE) + '(';

  for (let i = 0; i < block.mrcParameters.length; i++) {
    const fieldName = 'ARG' + i;
    if (i != 0) {
      code += ', '
    }
    code += block.mrcParameters[i].name + ' = ' + generator.valueToCode(block, fieldName, Order.NONE);
  }
  code += ')\n' + "self.hardware.append(self." + block.getFieldValue(FIELD_NAME) + ")\n";

  return code;
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
  const inputs: {[key: string]: any} = {};
  let i = 0;
  components.forEach(component => {
    for (const port in component.ports) {
      const parameterType = component.ports[port];
      extraState.parameters?.push({
        name: port,
        type: parameterType,
      });
      inputs['ARG' + i] = createPort(parameterType);
      i++;
    }
  });
  const fields: {[key: string]: any} = {};
  fields[FIELD_NAME] = mechanismName;
  fields[FIELD_TYPE] = mechanism.className;
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, inputs);
}
