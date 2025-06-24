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

import {ExtendedPythonGenerator} from '../editor/extended_python_generator';
import {createFieldFlydown} from '../fields/field_flydown';
import {createFieldNonEditableText} from '../fields/FieldNonEditableText';
import {MRC_STYLE_EVENT_HANDLER} from '../themes/styles';

export const BLOCK_NAME = 'mrc_event_handler';

export enum SenderType {
  ROBOT = 'robot',
  MECHANISM = 'mechanism',
  COMPONENT = 'component'
}

export interface Parameter {
  name: string;
  type?: string;
}

export type EventHandlerBlock = Blockly.Block & EventHandlerMixin & Blockly.BlockSvg;

interface EventHandlerMixin extends EventHandlerMixinType {
  mrcPathOfSender: string;
  mrcTypeOfSender: SenderType;
  mrcParameters: Parameter[];
}

type EventHandlerMixinType = typeof EVENT_HANDLER;

/** Extra state for serialising event handler blocks. */
export interface EventHandlerExtraState {
  pathOfSender: string;
  typeOfSender: SenderType;
  /** The parameters of the event handler. */
  params: Parameter[];
}

const EVENT_HANDLER = {
  /**
   * Block initialization.
   */
  init(this: EventHandlerBlock): void {
    this.appendDummyInput('TITLE')
        .appendField('When')
        .appendField(createFieldNonEditableText('sender'), 'SENDER')
        .appendField(createFieldNonEditableText('eventName'), 'EVENT_NAME');
    this.appendDummyInput('PARAMS')
        .appendField('with');
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
      pathOfSender: this.mrcPathOfSender,
      typeOfSender: this.mrcTypeOfSender,
      params: [],
    };
    
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
    this.mrcParameters = [];
    this.mrcPathOfSender = extraState.pathOfSender;
    this.mrcTypeOfSender = extraState.typeOfSender;

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
};

export function setup(): void {
  Blockly.Blocks[BLOCK_NAME] = EVENT_HANDLER;
}

export function pythonFromBlock(
    block: EventHandlerBlock,
    generator: ExtendedPythonGenerator,
): string {
  const blocklyName = `${block.getFieldValue('SENDER')}_${block.getFieldValue('EVENT_NAME')}`;
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
  generator.addEventHandler(
      block.getFieldValue('SENDER'),
      block.getFieldValue('EVENT_NAME'),
      funcName);

  return '';
}