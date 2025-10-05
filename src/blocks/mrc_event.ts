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
 * @fileoverview Creates an event that can be fired
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { MRC_STYLE_EVENTS } from '../themes/styles'
import { Parameter } from './mrc_class_method_def';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MUTATOR_BLOCK_NAME, PARAM_CONTAINER_BLOCK_NAME, MethodMutatorArgBlock } from './mrc_param_container'
import {
    BLOCK_NAME as MRC_MECHANISM_COMPONENT_HOLDER,
    MechanismComponentHolderBlock,
    mrcDescendantsMayHaveChanged } from './mrc_mechanism_component_holder';
import * as toolboxItems from '../toolbox/items';
import * as storageModuleContent from '../storage/module_content';
import { renameMethodCallers, mutateMethodCallers } from './mrc_call_python_function'

export const BLOCK_NAME = 'mrc_event';
export const OUTPUT_NAME = 'mrc_event';

const INPUT_TITLE = 'TITLE';
const FIELD_EVENT_NAME = 'NAME';
const FIELD_PARAM_PREFIX = 'PARAM_';

const WARNING_ID_NOT_IN_HOLDER = 'not in holder';

type EventExtraState = {
  eventId?: string,
  params?: Parameter[],
}

export type EventBlock = Blockly.Block & EventMixin & Blockly.BlockSvg;

interface EventMixin extends EventMixinType {
  mrcEventId: string,
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
type EventMixinType = typeof EVENT;

const EVENT = {
  /**
   * Block initialization.
   */
  init: function (this: EventBlock): void {
    this.mrcHasNotInHolderWarning = false;
    this.setStyle(MRC_STYLE_EVENTS);
    this.appendDummyInput(INPUT_TITLE)
      .appendField(new Blockly.FieldTextInput('my_event'), FIELD_EVENT_NAME);
    this.setPreviousStatement(true, OUTPUT_NAME);
    this.setNextStatement(true, OUTPUT_NAME);
    this.setMutator(new Blockly.icons.MutatorIcon([MUTATOR_BLOCK_NAME], this));
  },

  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function (this: EventBlock): EventExtraState {
    const extraState: EventExtraState = {
      eventId: this.mrcEventId,
    };
    extraState.params = [];
    if (this.mrcParameters) {
      this.mrcParameters.forEach((arg) => {
        extraState.params!.push({
          name: arg.name,
          type: arg.type,
        });
      });
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function (this: EventBlock, extraState: EventExtraState): void {
    this.mrcEventId = extraState.eventId ? extraState.eventId : this.id;
    this.mrcParameters = [];
    if (extraState.params) {
      extraState.params.forEach((arg) => {
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
  updateBlock_: function (this: EventBlock): void {
    const name = this.getFieldValue(FIELD_EVENT_NAME);
    const input = this.getInput(INPUT_TITLE);
    if (!input) {
      return;
    }
    input.removeField(FIELD_EVENT_NAME);

    const nameField = new Blockly.FieldTextInput(name);
    input.insertFieldAt(0, nameField, FIELD_EVENT_NAME);
    this.setMutator(new Blockly.icons.MutatorIcon([MUTATOR_BLOCK_NAME], this));
    nameField.setValidator(this.mrcNameFieldValidator.bind(this, nameField));

    this.mrcUpdateParams();
  },
  compose: function (this: EventBlock, containerBlock: any) {
    // Parameter list.
    this.mrcParameters = [];

    let paramBlock = containerBlock.getInputTargetBlock('STACK');
    while (paramBlock) {
      const param: Parameter = {
        name: paramBlock.getFieldValue('NAME'),
        type: ''
      }
      if (paramBlock.originalName) {
        // This is a mutator arg block, so we can get the original name.
        paramBlock.originalName = param.name;
      }
      this.mrcParameters.push(param);
      paramBlock = paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();
    }
    this.mrcUpdateParams();
    mutateMethodCallers(this.workspace, this.mrcEventId, this.getEvent());
  },
  decompose: function (this: EventBlock, workspace: Blockly.Workspace) {
    // This is a special sub-block that only gets created in the mutator UI.
    // It acts as our "top block"
    const topBlock = workspace.newBlock(PARAM_CONTAINER_BLOCK_NAME);
    (topBlock as Blockly.BlockSvg).initSvg();

    // Then we add one sub-block for each item in the list.
    let connection = topBlock!.getInput('STACK')!.connection;

    for (let i = 0; i < this.mrcParameters.length; i++) {
      const itemBlock = workspace.newBlock(MUTATOR_BLOCK_NAME);
      (itemBlock as Blockly.BlockSvg).initSvg();
      itemBlock.setFieldValue(this.mrcParameters[i].name, 'NAME');
      (itemBlock as MethodMutatorArgBlock).originalName = this.mrcParameters[i].name;

      connection!.connect(itemBlock.previousConnection!);
      connection = itemBlock.nextConnection;
    }
    return topBlock;
  },
  mrcUpdateParams: function (this: EventBlock) {
    if (this.mrcParameters.length > 0) {
      const input = this.getInput(INPUT_TITLE);
      if (input) {
        this.removeParameterFields(input);
        this.mrcParameters.forEach((param) => {
          const paramName = FIELD_PARAM_PREFIX + param.name;
          const field = new Blockly.FieldTextInput(param.name);
          field.EDITABLE = false;
          input.appendField(field, paramName);
        });
      }
    }
  },
  removeParameterFields: function (input: Blockly.Input) {
    const fieldsToRemove = input.fieldRow
      .filter(field => field.name?.startsWith(FIELD_PARAM_PREFIX))
      .map(field => field.name!);

    fieldsToRemove.forEach(fieldName => {
      input.removeField(fieldName);
    });
  },
  mrcNameFieldValidator(this: EventBlock, nameField: Blockly.FieldTextInput, name: string): string {
    // Strip leading and trailing whitespace.
    name = name.trim();

    const legalName = name;
    const oldName = nameField.getValue();
    if (oldName && oldName !== name && oldName !== legalName) {
      // Rename any callers.
      renameMethodCallers(this.workspace, this.mrcEventId, legalName);
    }
    return legalName;
  },
  /**
   * mrcOnLoad is called for each EventBlock when the blocks are loaded in the blockly workspace.
   */
  mrcOnLoad: function(this: EventBlock): void {
    this.checkBlockIsInHolder();
  },
  /**
   * mrcOnMove is called when an EventBlock is moved.
   */
  mrcOnMove: function(this: EventBlock, reason: string[]): void {
    this.checkBlockIsInHolder();
    if (reason.includes('connect')) {
      const rootBlock: Blockly.Block | null = this.getRootBlock();
      if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
        (rootBlock as MechanismComponentHolderBlock).setNameOfChildBlock(this);
      }
    }
    mrcDescendantsMayHaveChanged(this.workspace);
  },
  checkBlockIsInHolder: function(this: EventBlock): void {
    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock && rootBlock.type === MRC_MECHANISM_COMPONENT_HOLDER) {
      // If the root block is the mechanism_component_holder, the event block is allowed to stay.
      // Remove any previous warning.
      this.setWarningText(null, WARNING_ID_NOT_IN_HOLDER);
      this.mrcHasNotInHolderWarning = false;
    } else {
      // Otherwise, add a warning to the block.
      if (!this.mrcHasNotInHolderWarning) {
        this.setWarningText(Blockly.Msg.WARNING_EVENT_NOT_IN_HOLDER, WARNING_ID_NOT_IN_HOLDER);
        const icon = this.getIcon(Blockly.icons.IconType.WARNING);
        if (icon) {
          icon.setBubbleVisible(true);
        }
        this.mrcHasNotInHolderWarning = true;
      }
    }
  },
  getEvent: function (this: EventBlock): storageModuleContent.Event {
    const event: storageModuleContent.Event = {
      eventId: this.mrcEventId,
      name: this.getFieldValue(FIELD_EVENT_NAME),
      args: [],
    };
    this.mrcParameters.forEach(param => {
      event.args.push({
        name: param.name,
        type: param.type ? param.type : '',
      });
    });
    return event;
  },
  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: EventBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcEventId in oldIdToNewId) {
      this.mrcEventId = oldIdToNewId[this.mrcEventId];
    }
  },
};

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = EVENT;
}

export const pythonFromBlock = function (
    _block: EventBlock,
    _generator: ExtendedPythonGenerator) {
  // TODO (Alan): What should this do here??
  return '';
}

// Functions used for creating blocks for the toolbox.

export function createCustomEventBlock(name: string): toolboxItems.Block {
  const extraState: EventExtraState = {
    params: [],
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_EVENT_NAME] = name;
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, null);
}
