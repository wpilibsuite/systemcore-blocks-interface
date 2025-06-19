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
import { Order } from 'blockly/python';

import { MRC_STYLE_EVENTS } from '../themes/styles'
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { MUTATOR_BLOCK_NAME } from './mrc_class_method_def'

export const BLOCK_NAME = 'mrc_event';
export const OUTPUT_NAME = 'mrc_event';

export type Parameter = {
  name: string,
  type?: string,
};

type EventExtraState = {
  params?: Parameter[],
}

type EventBlock = Blockly.Block & EventMixin & Blockly.BlockSvg;

interface EventMixin extends EventMixinType {
  mrcParams: Parameter[],
}
type EventMixinType = typeof EVENT;

const EVENT = {
  /**
    * Block initialization.
    */
  init: function (this: EventBlock): void {
    this.setStyle(MRC_STYLE_EVENTS);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('my_event'), 'NAME');
    this.setPreviousStatement(true, OUTPUT_NAME);
    this.setNextStatement(true, OUTPUT_NAME);
    this.setMutator(new Blockly.icons.MutatorIcon([MUTATOR_BLOCK_NAME], this));
  },

  /**
    * Returns the state of this block as a JSON serializable object.
    */
  saveExtraState: function (this: EventBlock): EventExtraState {
    const extraState: EventExtraState = {
    };
    extraState.params = [];
    if (this.mrcParams) {
      this.mrcParams.forEach((arg) => {
        extraState.params!.push({
          'name': arg.name,
          'type': arg.type,
        });
      });
    }
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: EventBlock, extraState: EventExtraState): void {
    this.mrcParams = [];

    if (extraState.params) {
      extraState.params.forEach((arg) => {
        this.mrcParams.push({
          'name': arg.name,
          'type': arg.type,
        });
      });
    }
    this.mrcParams = extraState.params ? extraState.params : [];
    this.updateBlock_();
  },
  /**
     * Update the block to reflect the newly loaded extra state.
     */
  updateBlock_: function (this: EventBlock): void {
  }
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = EVENT;
}

export const pythonFromBlock = function (
  block: EventBlock,
  generator: ExtendedPythonGenerator,
) {
  //TODO (Alan): What should this do here??
  return '';
}
