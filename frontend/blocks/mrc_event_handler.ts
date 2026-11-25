// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A stub for event handler blocks, which are no longer supported.
 * The block is still defined so that projects and versions saved before events were removed can
 * be loaded. It is not in the toolbox, it is always disabled, it shows a warning, and it doesn't
 * generate any code.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';

import { Parameter } from './mrc_class_method_def';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_EVENT_HANDLER } from '../themes/styles';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';
import { NONDISABLEABLE_BLOCK } from './nondisableable_block';
import { disableBlockBecauseEventsWereRemoved } from './utils/events_removed';

export const BLOCK_NAME = 'mrc_event_handler';

const FIELD_SENDER = 'SENDER';
const FIELD_EVENT_NAME = 'EVENT_NAME';
const FIELD_PARAM_PREFIX = 'PARAM_';

const WARNING_ID_EVENTS_REMOVED = 'events removed';

enum SenderType {
  ROBOT = 'robot',
  MECHANISM = 'mechanism',
  COMPONENT = 'component'
}

export type EventHandlerBlock = Blockly.Block & EventHandlerMixin;

interface EventHandlerMixin extends EventHandlerMixinType {
  mrcSenderType: SenderType;
  mrcParameters: Parameter[];
  mrcEventId: string,
  mrcMechanismId: string,
}

type EventHandlerMixinType = typeof EVENT_HANDLER;

/** Extra state for serialising event handler blocks. */
interface EventHandlerExtraState {
  senderType: SenderType;
  /** The parameters of the event handler. */
  params: Parameter[];
  /** The mrcEventId of the mrc_event block that defined the event. */
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
  ...NONCOPYABLE_BLOCK,
  ...NONDISABLEABLE_BLOCK,

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
    this.mrcEventId = extraState.eventId;
    this.mrcMechanismId = extraState.mechanismId ? extraState.mechanismId : '';
    this.mrcParameters = [];
    extraState.params.forEach((param) => {
      this.mrcParameters.push({
        name: param.name,
        type: param.type,
      });
    });
    this.mrcUpdateParams();
    disableBlockBecauseEventsWereRemoved(this);
  },

  /**
   * Update the block to reflect the newly loaded extra state.
   */
  mrcUpdateParams(this: EventHandlerBlock): void {
    if (this.mrcParameters.length > 0) {
      const input = this.getInput('PARAMS');
      if (input) {
        this.mrcParameters.forEach((param) => {
          input.appendField(
              createFieldNonEditableText(param.name), FIELD_PARAM_PREFIX + param.name);
        });
      }
    } else {
      this.removeInput('PARAMS', true);
    }
  },

  /**
   * mrcOnLoad is called for each EventHandlerBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: EventHandlerBlock, _editor: Editor): void {
    this.mrcShowWarning();
  },
  /**
   * mrcOnCreate is called for each EventHandlerBlock when it is created.
   */
  mrcOnCreate: function(this: EventHandlerBlock, _editor: Editor): void {
    this.mrcShowWarning();
  },
  mrcShowWarning: function(this: EventHandlerBlock): void {
    this.setWarningText(Blockly.Msg.EVENT_HANDLER_EVENTS_REMOVED, WARNING_ID_EVENTS_REMOVED);
    const icon = this.getIcon(Blockly.icons.IconType.WARNING);
    if (icon) {
      icon.setBubbleVisible(true);
    }
  },
  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: EventHandlerBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcMechanismId && this.mrcMechanismId in oldIdToNewId) {
      this.mrcMechanismId = oldIdToNewId[this.mrcMechanismId];
    }
  },
  /**
   * Returns the names of the parameters, so that mrc_get_parameter blocks in this block don't get
   * warnings about parameters that don't exist.
   */
  mrcGetParameterNames: function(this: EventHandlerBlock): string[] {
    return this.mrcParameters.map(parameter => parameter.name);
  },
};

export function setup(): void {
  Blockly.Blocks[BLOCK_NAME] = EVENT_HANDLER;
}

export function pythonFromBlock(
    _block: EventHandlerBlock,
    _generator: ExtendedPythonGenerator,
): string {
  // Events are no longer supported.
  return '';
}
