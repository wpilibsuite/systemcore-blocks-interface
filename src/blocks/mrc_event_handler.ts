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

import type { MessageInstance } from 'antd/es/message/interface';
import { Parameter } from './mrc_class_method_def';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createParameterFieldFlydown } from '../fields/field_flydown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_EVENT_HANDLER } from '../themes/styles';
import * as toolboxItems from '../toolbox/items';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import { findConnectedBlocksOfType } from './utils/find_connected_blocks';

export const BLOCK_NAME = 'mrc_event_handler';

const BUTTON_CALLBACK_KEY = 'EVENT_HANDLER_ALREADY_ON_WORKSPACE';
const BUTTON_STYLE_PREFIX = 'eventHandlerButtonStyle_';

const FIELD_SENDER = 'SENDER';
const FIELD_EVENT_NAME = 'EVENT_NAME';

export enum SenderType {
  ROBOT = 'robot',
  MECHANISM = 'mechanism',
  COMPONENT = 'component'
}

const SENDER_VALUE_ROBOT = 'robot';
const WARNING_ID_EVENT_CHANGED = 'event changed';

export type EventHandlerBlock = Blockly.Block & EventHandlerMixin;

interface EventHandlerMixin extends EventHandlerMixinType {
  mrcSenderType: SenderType;
  mrcParameters: Parameter[];
  mrcEventId: string,
  mrcMechanismId: string,
}

type EventHandlerMixinType = typeof EVENT_HANDLER;

/** Extra state for serialising event handler blocks. */
export interface EventHandlerExtraState {
  senderType: SenderType;
  /** The parameters of the event handler. */
  params: Parameter[];
  /** The mrcEventId of the mrc_event block that defines the event. */
  eventId: string,
  /**
   * The mrcMechanismId of the mrc_mechanism block that adds the mechanism to the robot.
   * Specified only if the sender type is MECHANISM.
   */
  mechanismId?: string,
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
      eventId: this.mrcEventId,
    };
    if (this.mrcMechanismId) {
      extraState.mechanismId = this.mrcMechanismId;
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
    this.mrcEventId = extraState.eventId;
    this.mrcMechanismId = extraState.mechanismId ? extraState.mechanismId : '';

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
          input.appendField(createParameterFieldFlydown(param.name, false), paramName);
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
   * mrcOnModuleCurrent is called for each EventHandlerBlock when the module becomes the current module.
   */
  mrcOnModuleCurrent: function(this: EventHandlerBlock, editor: Editor): void {
    this.checkEvent(editor);
  },
  /**
   * mrcOnLoad is called for each EventHandlerBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: EventHandlerBlock, editor: Editor): void {
    this.checkEvent(editor);
  },
  /**
   * mrcOnCreate is called for each EventHandlerBlock when it is created.
   */
  mrcOnCreate: function(this: EventHandlerBlock, editor: Editor): void {
    this.checkEvent(editor);
  },
  /**
   * checkEvent checks the block, updates it, and/or adds a warning balloon if necessary.
   * It is called from mrcOnModuleCurrent, mrcOnLoad, and mrcCreate above.
   */
  checkEvent: function(this: EventHandlerBlock, editor: Editor): void {
    const warnings: string[] = [];

    if (this.mrcSenderType === SenderType.ROBOT) {
      // This block is an event handler for a robot event.
      // Check whether the robot event still exists and whether it has been changed.
      // If the robot event doesn't exist, put a visible warning on this block.
      // If the robot event has changed, update the block if possible or put a
      // visible warning on it.
      let foundRobotEvent = false;
      const robotEvents = editor.getEventsFromRobot();
      for (const robotEvent of robotEvents) {
        if (robotEvent.eventId === this.mrcEventId) {
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
        warnings.push(Blockly.Msg.EVENT_HANDLER_ROBOT_EVENT_NOT_FOUND);
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
        if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
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
            if (mechanismEvent.eventId === this.mrcEventId) {
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
              // Update all mrc_get_parameter blocks to recheck validity
              this.mrcCheckParameterBlocks();              
              // Update all mrc_get_parameter blocks to recheck validity
              this.mrcCheckParameterBlocks();

              // Since we found the mechanism event, we can break out of the loop.
              break;
            }
          }
          if (!foundMechanismEvent) {
            warnings.push(Blockly.Msg.EVENT_HANDLER_MECHANISM_EVENT_NOT_FOUND);
          }

          // Since we found the mechanism, we can break out of the loop.
          break;
        }
      }
      if (!foundMechanism) {
        warnings.push(Blockly.Msg.EVENT_HANDLER_MECHANISM_NOT_FOUND);
      }
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_EVENT_CHANGED);
      const icon = this.getIcon(Blockly.icons.IconType.WARNING);
      if (icon) {
        icon.setBubbleVisible(true);
      }
      if (this.rendered) {
        (this as unknown as Blockly.BlockSvg).bringToFront();
      }
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_EVENT_CHANGED);
    }
  },
  getEventId: function(this: EventHandlerBlock): string {
    return this.mrcEventId;
  },
  renameMechanismName: function(this: EventHandlerBlock, mechanismId: string, newName: string): void {
    // renameMechanismName is called when a mechanism block in the same module is modified.
    if (this.mrcSenderType === SenderType.MECHANISM &&
        this.mrcMechanismId === mechanismId) {
      this.setFieldValue(newName, FIELD_SENDER);
    }
  },
  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: EventHandlerBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcEventId && this.mrcEventId in oldIdToNewId) {
      this.mrcEventId = oldIdToNewId[this.mrcEventId];
    }
    if (this.mrcMechanismId && this.mrcMechanismId in oldIdToNewId) {
      this.mrcMechanismId = oldIdToNewId[this.mrcMechanismId];
    }
  },
  mrcGetParameterNames: function(this: EventHandlerBlock): string[] {
    const parameterNames: string[] = [];
    this.mrcParameters.forEach(parameter => {
      parameterNames.push(parameter.name);
    });
    return parameterNames;
  },

  /**
   * Checks all mrc_get_parameter blocks within this event handler to revalidate
   * that their parameter names are still valid.
   */
  mrcCheckParameterBlocks: function(this: EventHandlerBlock): void {
    const MRC_GET_PARAMETER_BLOCK_NAME = 'mrc_get_parameter';
    const nextBlock = this.getInput('DO')?.connection?.targetBlock();
    if (nextBlock) {
      const paramBlocks = findConnectedBlocksOfType(nextBlock, MRC_GET_PARAMETER_BLOCK_NAME);
      paramBlocks.forEach((block) => {
        if ('mrcCheckParameter' in block && typeof block.mrcCheckParameter === 'function') {
          block.mrcCheckParameter();
        }
      });
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
  generateRegisterEventHandler(block, generator, sender, eventName, funcName);

  return '';
}

function generateRegisterEventHandler(
    block: EventHandlerBlock,
    generator: ExtendedPythonGenerator,
    sender: string,
    eventName: string,
    funcName: string) {
  // Create the line of code that will register this event handler.
  let fullSender = '';
  if (block.mrcSenderType === SenderType.ROBOT) {
    fullSender = 'self.' + sender;
  } else if (block.mrcSenderType === SenderType.MECHANISM) {
    switch (generator.getModuleType()) {
      case storageModule.ModuleType.ROBOT:
        fullSender = 'self.' + sender;
        break;
      case storageModule.ModuleType.OPMODE:
        fullSender = 'self.robot.' + sender;
        break;
    }
  }
  if (fullSender) {
    generator.addRegisterEventHandlerStatement(
        fullSender + '.register_event_handler(\'' + eventName + '\', self.' + funcName + ')\n');
  }
}

// Functions used for creating blocks for the toolbox.

export function addRobotEventHandlerBlocks(
    workspace: Blockly.WorkspaceSvg,
    events: storageModuleContent.Event[],
    eventHandlerBlocks: EventHandlerBlock[],
    contents: toolboxItems.ContentsType[]) {
  // Collect the ids of events for which there is already an event handler.
  const eventIds: string[] = [];
  eventHandlerBlocks.forEach(eventHandlerBlock => {
    eventIds.push(eventHandlerBlock.getEventId());
  });
  events.forEach(event => {
    if (eventIds.includes(event.eventId)) {
      // If there is already an event handler for this event, put a button in the toolbox.
      contents.push(createButton(workspace, SENDER_VALUE_ROBOT, event.name));
    } else {
      contents.push(createRobotEventHandlerBlock(event));
    }
  });
}

function createRobotEventHandlerBlock(
    event: storageModuleContent.Event): toolboxItems.Block {
  const extraState: EventHandlerExtraState = {
    senderType: SenderType.ROBOT,
    params: [],
    eventId: event.eventId,
  };
  event.args.forEach(arg => {
    extraState.params.push({
      name: arg.name,
      type: arg.type,
    });
  });
  const fields: {[key: string]: any} = {};
  fields[FIELD_SENDER] = SENDER_VALUE_ROBOT;
  fields[FIELD_EVENT_NAME] = event.name;
  const inputs: {[key: string]: any} = {};
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, Object.keys(inputs).length ? inputs : null);
}

export function addMechanismEventHandlerBlocks(
    workspace: Blockly.WorkspaceSvg,
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    events: storageModuleContent.Event[],
    eventHandlerBlocks: EventHandlerBlock[],
    contents: toolboxItems.ContentsType[]) {
  // Collect the ids of events for which there is already an event handler.
  const eventIds: string[] = [];
  eventHandlerBlocks.forEach(eventHandlerBlock => {
    eventIds.push(eventHandlerBlock.getEventId());
  });
  events.forEach(event => {
    if (eventIds.includes(event.eventId)) {
      // If there is already an event handler for this event, put a button in the toolbox.
      contents.push(createButton(workspace, mechanismInRobot.name, event.name));
    } else {
      contents.push(createMechanismEventHandlerBlock(mechanismInRobot, event));
    }
  });
}

function createButton(
    workspace: Blockly.WorkspaceSvg, senderName: string, eventName: string): toolboxItems.Button {
  // Use non-breakable spaces so it looks more like an event handler block.
  const spaces = '\u00A0\u00A0';
  const text = workspace.RTL
      ? (spaces + eventName + spaces + senderName + spaces + Blockly.Msg.WHEN + spaces)
      : (spaces + Blockly.Msg.WHEN + spaces + senderName + spaces + eventName + spaces);
  const style = BUTTON_STYLE_PREFIX + workspace.getTheme().name;
  return new toolboxItems.Button(text, BUTTON_CALLBACK_KEY, style);
}

function createMechanismEventHandlerBlock(
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    event: storageModuleContent.Event): toolboxItems.Block {
  const extraState: EventHandlerExtraState = {
    senderType: SenderType.MECHANISM,
    params: [],
    eventId: event.eventId,
    mechanismId: mechanismInRobot.mechanismId,
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
    mechanismId: string,
    blocks: EventHandlerBlock[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const eventHandlerBlock = block as EventHandlerBlock;
    if (eventHandlerBlock.mrcSenderType == SenderType.MECHANISM) {
      if (eventHandlerBlock.mrcMechanismId === mechanismId) {
        blocks.push(eventHandlerBlock);
      }
    }
  });
}

export function renameMechanismName(workspace: Blockly.Workspace, mechanismId: string, newName: string): void {
  const eventHandlerBlocks: EventHandlerBlock[] = [];
  getMechanismEventHandlerBlocks(workspace, mechanismId, eventHandlerBlocks);
  eventHandlerBlocks.forEach(block => {
    (block as EventHandlerBlock).renameMechanismName(mechanismId, newName);
  });
}

export function registerToolboxButton(workspace: Blockly.WorkspaceSvg, messageApi: MessageInstance) {
  workspace.registerButtonCallback(BUTTON_CALLBACK_KEY, function (_button) {
    messageApi.info(Blockly.Msg.EVENT_HANDLER_ALREADY_ON_WORKSPACE);
  });
}
