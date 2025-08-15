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
 * @fileoverview Blocks for event handlers
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';
import {Order} from 'blockly/python';

import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldFlydown } from '../fields/field_flydown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_EVENT_HANDLER } from '../themes/styles';
import * as toolboxItems from '../toolbox/items';
import * as storageModuleContent from '../storage/module_content';

export const BLOCK_NAME = 'mrc_event_handler';

const FIELD_SENDER = 'SENDER';
const FIELD_EVENT_NAME = 'EVENT_NAME';

export enum SenderType {
  ROBOT = 'robot',
  MECHANISM = 'mechanism',
  COMPONENT = 'component'
}

export interface Parameter {
  name: string;
  type?: string;
}

const WARNING_ID_EVENT_CHANGED = 'event changed';

export type EventHandlerBlock = Blockly.Block & EventHandlerMixin & Blockly.BlockSvg;

interface EventHandlerMixin extends EventHandlerMixinType {
  mrcSenderType: SenderType;
  mrcParameters: Parameter[];
  mrcOtherBlockId: string,
  mrcMechanismBlockId: string,
}

type EventHandlerMixinType = typeof EVENT_HANDLER;

/** Extra state for serialising event handler blocks. */
export interface EventHandlerExtraState {
  senderType: SenderType;
  /** The parameters of the event handler. */
  params: Parameter[];
  /** The id of the mrc_event block that defines the event. */
  otherBlockId: string,
  /**
   * The id of the mrc_mechanism block that adds the mechanism to the robot.
   * Specified only if the sender type is MECHANISM.
   */
  mechanismBlockId?: string,
}

const EVENT_HANDLER = {
  /**
   * Block initialization.
   */
  init(this: EventHandlerBlock): void {
    this.appendDummyInput('TITLE')
        .appendField(Blockly.Msg.WHEN)
        .appendField(createFieldNonEditableText(''), FIELD_SENDER)
        .appendField(createFieldNonEditableText(''), FIELD_EVENT_NAME);
    this.appendDummyInput('PARAMS')
        .appendField(Blockly.Msg.WITH);
    this.setOutput(false);
    this.setStyle(MRC_STYLE_EVENT_HANDLER);
    this.appendStatementInput('STACK').appendField('');
    this.mrcParameters = [];
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  },

  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState(this: EventHandlerBlock): EventHandlerExtraState {
    const extraState: EventHandlerExtraState = {
      senderType: this.mrcSenderType,
      params: [],
      otherBlockId: this.mrcOtherBlockId,
    };
    if (this.mrcMechanismBlockId) {
      extraState.mechanismBlockId = this.mrcMechanismBlockId;
    }

    this.mrcParameters.forEach((param) => {
      extraState.params.push({
        name: param.name,
        type: param.type,
      });
    });

    return extraState;
  },

  /**
   * Applies the given state to this block.
   */
  loadExtraState(this: EventHandlerBlock, extraState: EventHandlerExtraState): void {
    this.mrcSenderType = extraState.senderType;
    this.mrcParameters = [];
    this.mrcOtherBlockId = extraState.otherBlockId;
    this.mrcMechanismBlockId = extraState.mechanismBlockId
        ? extraState.mechanismBlockId : '';

    extraState.params.forEach((param) => {
      this.mrcParameters.push({
        name: param.name,
        type: param.type,
      });
    });
    this.mrcUpdateParams();
  },

  /**
   * Update the block to reflect the newly loaded extra state.
   */
  mrcUpdateParams(this: EventHandlerBlock): void {
    if (this.mrcParameters.length > 0) {
      const input = this.getInput('PARAMS');
      if (input) {
        this.removeParameterFields(input);
        this.mrcParameters.forEach((param) => {
          const paramName = `PARAM_${param.name}`;
          input.appendField(createFieldFlydown(param.name, false), paramName);
        });
      }
    } else {
      this.removeInput('PARAMS', true);
    }
  },

  /**
   * Removes parameter fields from the given input.
   */
  removeParameterFields(input: Blockly.Input): void {
    const fieldsToRemove = input.fieldRow
        .filter(field => field.name?.startsWith('PARAM_'))
        .map(field => field.name!);

    fieldsToRemove.forEach(fieldName => {
      input.removeField(fieldName);
    });
  },

  /**
   * mrcOnLoad is called for each EventHandlerBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: EventHandlerBlock): void {
    const warnings: string[] = [];

    const editor = Editor.getEditorForBlocklyWorkspace(this.workspace);
    if (editor) {
      if (this.mrcSenderType === SenderType.ROBOT) {
        // This block is an event handler for a robot event.
        // Check whether the robot event still exists and whether it has been changed.
        // If the robot event doesn't exist, put a visible warning on this block.
        // If the robot event has changed, update the block if possible or put a
        // visible warning on it.
        let foundRobotEvent = false;
        const robotEvents = editor.getEventsFromRobot();
        for (const robotEvent of robotEvents) {
          if (robotEvent.blockId === this.mrcOtherBlockId) {
            foundRobotEvent = true;
            if (this.getFieldValue(FIELD_EVENT_NAME) !== robotEvent.name) {
              this.setFieldValue(robotEvent.name, FIELD_EVENT_NAME);
            }
            this.mrcParameters = [];
            robotEvent.args.forEach(arg => {
              this.mrcParameters.push({
                name: arg.name,
                type: arg.type,
              });
            });
            this.mrcUpdateParams();

            // Since we found the robot event, we can break out of the loop.
            break;
          }
        }
        if (!foundRobotEvent) {
          warnings.push('This block is an event handler for an event that no longer exists.');
        }
      }

      if (this.mrcSenderType === SenderType.MECHANISM) {
        // This block is an event handler for a mechanism event.
        // Check whether the mechanism still exists, whether it has been
        // changed, whether the event still exists, and whether the event has
        // been changed.
        // If the mechanism doesn't exist, put a visible warning on this block.
        // If the mechanism has changed, update the block if possible or put a
        // visible warning on it.
        // If the event doesn't exist, put a visible warning on this block.
        // If the event has changed, update the block if possible or put a
        // visible warning on it.
        let foundMechanism = false;
        const mechanismsInRobot = editor.getMechanismsFromRobot();
        for (const mechanismInRobot of mechanismsInRobot) {
          if (mechanismInRobot.blockId === this.mrcMechanismBlockId) {
            foundMechanism = true;

            // If the mechanism name has changed, we can handle that.
            if (this.getFieldValue(FIELD_SENDER) !== mechanismInRobot.name) {
              this.setFieldValue(mechanismInRobot.name, FIELD_SENDER);
            }

            let foundMechanismEvent = false;
            const mechanism = editor.getMechanism(mechanismInRobot);
            const mechanismEvents: storageModuleContent.Event[] = mechanism
                ? editor.getEventsFromMechanism(mechanism) : [];
            for (const mechanismEvent of mechanismEvents) {
              if (mechanismEvent.blockId === this.mrcOtherBlockId) {
                foundMechanismEvent = true;
                if (this.getFieldValue(FIELD_EVENT_NAME) !== mechanismEvent.name) {
                  this.setFieldValue(mechanismEvent.name, FIELD_EVENT_NAME);
                }

                this.mrcParameters = [];
                mechanismEvent.args.forEach(arg => {
                  this.mrcParameters.push({
                    name: arg.name,
                    type: arg.type,
                  });
                });
                this.mrcUpdateParams();

                // Since we found the mechanism event, we can break out of the loop.
                break;
              }
            }
            if (!foundMechanismEvent) {
              warnings.push('This block is an event handler for an event that no longer exists.');
            }

            // Since we found the mechanism, we can break out of the loop.
            break;
          }
        }
        if (!foundMechanism) {
          warnings.push('This block is an event handler for an event in a mechanism that no longer exists.');
        }
      }
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_EVENT_CHANGED);
      this.getIcon(Blockly.icons.IconType.WARNING)!.setBubbleVisible(true);
      this.bringToFront();
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_EVENT_CHANGED);
    }
  },
  getEventBlockId: function(this: EventHandlerBlock): string {
    return this.mrcOtherBlockId;
  },
  renameMechanismName: function(this: EventHandlerBlock, mechanismBlockId: string, newName: string): void {
    // renameMechanismName is called when a mechanism block in the same module is modified.
    if (this.mrcSenderType === SenderType.MECHANISM &&
        mechanismBlockId === this.mrcMechanismBlockId) {
      this.setFieldValue(newName, FIELD_SENDER);
    }
  },
};

export function setup(): void {
  Blockly.Blocks[BLOCK_NAME] = EVENT_HANDLER;
}

export function pythonFromBlock(
    block: EventHandlerBlock,
    generator: ExtendedPythonGenerator,
): string {
  const sender = block.getFieldValue(FIELD_SENDER);
  const eventName = block.getFieldValue(FIELD_EVENT_NAME);

  const blocklyName = `${sender}_${eventName}`;
  const funcName = generator.getProcedureName(blocklyName);

  let xfix1 = '';
  if (generator.STATEMENT_PREFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_PREFIX, block);
  }
  if (generator.STATEMENT_SUFFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = generator.prefixLines(xfix1, generator.INDENT);
  }

  let loopTrap = '';
  if (generator.INFINITE_LOOP_TRAP) {
    loopTrap = generator.prefixLines(
        generator.injectId(generator.INFINITE_LOOP_TRAP, block),
        generator.INDENT,
    );
  }

  let branch = '';
  if (block.getInput('STACK')) {
    branch = generator.statementToCode(block, 'STACK');
  }

  let returnValue = '';
  if (block.getInput('RETURN')) {
    returnValue = generator.valueToCode(block, 'RETURN', Order.NONE) || '';
  }

  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }

  if (returnValue) {
    returnValue = `${generator.INDENT}return ${returnValue}\n`;
  } else if (!branch) {
    branch = generator.PASS;
  }

  const params = block.mrcParameters;
  let paramString = 'self';

  if (params.length !== 0) {
    block.mrcParameters.forEach((param) => {
      paramString += `, ${param.name}`;
    });
  }

  let code = `def ${funcName}(${paramString}):\n`;
  code += xfix1 + loopTrap + branch + xfix2 + returnValue;
  code = generator.scrub_(block, code);

  generator.addClassMethodDefinition(funcName, code);
  generator.addEventHandler(sender, eventName, funcName);

  return '';
}

// Functions used for creating blocks for the toolbox.

export function addRobotEventHandlerBlocks(
    events: storageModuleContent.Event[],
    contents: toolboxItems.ContentsType[]) {
  events.forEach(event => {
    contents.push(createRobotEventHandlerBlock(event));
  });
}

function createRobotEventHandlerBlock(
    event: storageModuleContent.Event): toolboxItems.Block {
  const extraState: EventHandlerExtraState = {
    senderType: SenderType.ROBOT,
    params: [],
    otherBlockId: event.blockId,
  };
  event.args.forEach(arg => {
    extraState.params.push({
      name: arg.name,
      type: arg.type,
    });
  });
  const fields: {[key: string]: any} = {};
  fields[FIELD_SENDER] = 'robot';
  fields[FIELD_EVENT_NAME] = event.name;
  const inputs: {[key: string]: any} = {};
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
}

export function addMechanismEventHandlerBlocks(
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    events: storageModuleContent.Event[],
    contents: toolboxItems.ContentsType[]) {
  events.forEach(event => {
    contents.push(createMechanismEventHandlerBlock(mechanismInRobot, event));
  });
}

function createMechanismEventHandlerBlock(
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    event: storageModuleContent.Event): toolboxItems.Block {
  const extraState: EventHandlerExtraState = {
    senderType: SenderType.MECHANISM,
    params: [],
    otherBlockId: event.blockId,
    mechanismBlockId: mechanismInRobot.blockId,
  };
  event.args.forEach(arg => {
    extraState.params.push({
      name: arg.name,
      type: arg.type,
    });
  });
  const fields: {[key: string]: any} = {};
  fields[FIELD_SENDER] = mechanismInRobot.name;
  fields[FIELD_EVENT_NAME] = event.name;
  const inputs: {[key: string]: any} = {};
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
}

// Misc

export function getHasAnyEnabledEventHandlers(workspace: Blockly.Workspace): boolean {
  return workspace.getBlocksByType(BLOCK_NAME).filter(block => {
    return block.isEnabled();
  }).length > 0;
}

export function getRobotEventHandlerBlocks(
    workspace: Blockly.Workspace,
    blocks: EventHandlerBlock[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const eventHandlerBlock = block as EventHandlerBlock;
    if (eventHandlerBlock.mrcSenderType == SenderType.ROBOT) {
      blocks.push(eventHandlerBlock);
    }
  });
}

export function getMechanismEventHandlerBlocks(
    workspace: Blockly.Workspace,
    mechanismBlockId: string,
    blocks: EventHandlerBlock[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const eventHandlerBlock = block as EventHandlerBlock;
    if (eventHandlerBlock.mrcSenderType == SenderType.MECHANISM) {
      if (eventHandlerBlock.mrcMechanismBlockId === mechanismBlockId) {
        blocks.push(eventHandlerBlock);
      }
    }
  });
}

export function renameMechanismName(workspace: Blockly.Workspace, mechanismBlockId: string, newName: string): void {
  const eventHandlerBlocks: EventHandlerBlock[] = [];
  getMechanismEventHandlerBlocks(workspace, mechanismBlockId, eventHandlerBlocks);
  eventHandlerBlocks.forEach(block => {
    (block as EventHandlerBlock).renameMechanismName(mechanismBlockId, newName);
  });
}
