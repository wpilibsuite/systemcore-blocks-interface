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
 * @fileoverview This is a block that allows your code to use a parameter
 * that is passed to a method.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import {Order} from 'blockly/python';

import { Editor } from '../editor/editor';
import {ExtendedPythonGenerator} from '../editor/extended_python_generator';
import {MRC_STYLE_VARIABLES} from '../themes/styles';
import {BLOCK_NAME as MRC_CLASS_METHOD_DEF, ClassMethodDefBlock} from './mrc_class_method_def';
import {BLOCK_NAME as MRC_EVENT_HANDLER, EventHandlerBlock } from './mrc_event_handler';
import { findConnectedBlocksOfType } from './utils/find_connected_blocks';
import { CustomDropdownWithoutValidation } from '../fields/FieldDropdown';


export const BLOCK_NAME = 'mrc_get_parameter';
export const OUTPUT_NAME = 'mrc_get_parameter_output';

const FIELD_PARAMETER_NAME = 'PARAMETER_NAME';

const WARNING_ID_NOT_IN_METHOD = 'not in method';


type GetParameterBlock = Blockly.Block & GetParameterMixin;

interface GetParameterMixin extends GetParameterMixinType {
  // TODO(lizlooney): currently mrcParameterType is never set to anything other than '' because
  // setNameAndType is never called. If we add code that uses setNameAndType, we will probably
  // need to save and load extra state that includes the parameter type.
  /**
   * mrcParameterType is initialized in init to ''. It can be set by calling setNameAndType.
   */
  mrcParameterType: string,

  /**
   * mrcHasWarning is set to true if we set the warning text on the block. It is checked to avoid
   * adding a warning if there already is one. Otherwise, if we get two move events (one for drag
   * and one for snap), and we call setWarningText for both events, we get a detached warning
   * balloon. See https://github.com/wpilibsuite/systemcore-blocks-interface/issues/248.
   */
  mrcHasWarning: boolean,
}

type GetParameterMixinType = typeof GET_PARAMETER_BLOCK;

const GET_PARAMETER_BLOCK = {
  /**
   * Block initialization.
   */
  init: function(this: GetParameterBlock): void {
    this.mrcParameterType = '';
    this.mrcHasWarning = false;

    this.setStyle(MRC_STYLE_VARIABLES);
    
    const blockRef = this;
    // Use a dummy initial option - it will be replaced when setValue is called
    const dropdown: Blockly.Field = new CustomDropdownWithoutValidation(
      function() {
        // This function will be called to regenerate options when dropdown opens
        return blockRef.getParameterOptions();
      }
    );
    
    dropdown.setValidator(this.validateParameterSelection.bind(this));
    
    this.appendDummyInput()
        .appendField(Blockly.Msg.PARAMETER)
        .appendField(dropdown, FIELD_PARAMETER_NAME);
    this.setOutput(true, this.mrcParameterType);
  },
  getParameterOptions: function(this: GetParameterBlock): [string, string][] {
    const legalParameterNames: string[] = [];

    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock && rootBlock.type === MRC_CLASS_METHOD_DEF) {
      const classMethodDefBlock = rootBlock as ClassMethodDefBlock;
      legalParameterNames.push(...classMethodDefBlock.mrcGetParameterNames());
    } else if (rootBlock && rootBlock.type === MRC_EVENT_HANDLER) {
      const eventHandlerBlock = rootBlock as EventHandlerBlock;
      legalParameterNames.push(...eventHandlerBlock.mrcGetParameterNames());
    }

    // Get the field to check its value
    const field = this.getField(FIELD_PARAMETER_NAME) as Blockly.FieldDropdown | null;
    const currentValue = field?.getValue();
    
    // Always include the current field value if it exists and isn't already in the list
    if (currentValue && currentValue !== '' && !legalParameterNames.includes(currentValue)) {
      legalParameterNames.unshift(currentValue);
    }

    if (legalParameterNames.length === 0) {
      return [['(no parameters)', '']];
    }

    return legalParameterNames.map(name => [name, name]);
  },
  validateParameterSelection: function(this: GetParameterBlock, newValue: string): string {
    // Clear any previous warnings
    this.setWarningText(null, WARNING_ID_NOT_IN_METHOD);
    this.mrcHasWarning = false;
    
    // Options will be regenerated automatically on next dropdown open
    // via the function passed to the CustomParameterDropdown constructor
    
    return newValue;
  },
  setNameAndType: function(this: GetParameterBlock, name: string, type: string): void {
    this.setFieldValue(name, FIELD_PARAMETER_NAME);
    this.mrcParameterType = type;
    this.setOutput(true, [OUTPUT_NAME, type]);
  },
  /**
   * mrcOnMove is called when an EventBlock is moved.
   */
  mrcOnMove: function(this: GetParameterBlock, _editor: Editor, _reason: string[]): void {
    this.checkBlockPlacement();
  },
  mrcOnAncestorMove: function(this: GetParameterBlock): void {
    this.checkBlockPlacement();
  },
  checkBlockPlacement: function(this: GetParameterBlock): void {
    const legalParameterNames: string[] = [];

    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock.type === MRC_CLASS_METHOD_DEF) {
      // This block is within a class method definition.
      const classMethodDefBlock = rootBlock as ClassMethodDefBlock;
      // Add the method's parameter names to legalParameterNames.
      legalParameterNames.push(...classMethodDefBlock.mrcGetParameterNames());
    } else if (rootBlock.type === MRC_EVENT_HANDLER) {
      // This block is within an event handler.
      const eventHandlerBlock = rootBlock as EventHandlerBlock;
      // Add the method's parameter names to legalParameterNames.
      legalParameterNames.push(...eventHandlerBlock.mrcGetParameterNames());
    }

    const currentParameterName = this.getFieldValue(FIELD_PARAMETER_NAME);
    
    if (legalParameterNames.includes(currentParameterName)) {
      // If this blocks's parameter name is in legalParameterNames, it's good.
      this.setWarningText(null, WARNING_ID_NOT_IN_METHOD);
      this.mrcHasWarning = false;
    } else {
      // Otherwise, add a warning to this block.
      if (!this.mrcHasWarning) {
        // Provide a more specific message depending on the situation
        let warningMessage: string;
        if (rootBlock.type === MRC_CLASS_METHOD_DEF || rootBlock.type === MRC_EVENT_HANDLER) {
          // We're in a method/handler but the parameter doesn't exist
          if (currentParameterName && currentParameterName !== '') {
            const messageTemplate = rootBlock.type === MRC_CLASS_METHOD_DEF 
              ? Blockly.Msg.PARAMETER_DOES_NOT_EXIST_IN_METHOD
              : Blockly.Msg.PARAMETER_DOES_NOT_EXIST_IN_EVENT_HANDLER;
            warningMessage = messageTemplate.replace('%1', currentParameterName);
          } else {
            warningMessage = Blockly.Msg.NO_PARAMETER_SELECTED;
          }
        } else {
          // We're not even in a method/handler
          warningMessage = Blockly.Msg.PARAMETERS_CAN_ONLY_GO_IN_THEIR_METHODS_BLOCK;
        }
        
        this.setWarningText(warningMessage, WARNING_ID_NOT_IN_METHOD);
        this.getIcon(Blockly.icons.IconType.WARNING)!.setBubbleVisible(true);
        this.mrcHasWarning = true;
      }
    }
  },
  /**
   * Called to recheck parameter validity. Used when method parameters change.
   */
  mrcCheckParameter: function(this: GetParameterBlock): void {
    this.checkBlockPlacement();
  },
};

/*
 * Rechecks all Get Parameter blocks connected to the target block.
 */
export function checkParameterBlocks(targetBlock: Blockly.Block | null): void {
  if (targetBlock) {
    findConnectedBlocksOfType(targetBlock, BLOCK_NAME).forEach((block) => {
      const getParameterBlock = block as GetParameterBlock;
      getParameterBlock.mrcCheckParameter();
    });
  }
}

export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = GET_PARAMETER_BLOCK;
};

export const pythonFromBlock = function(
    block: GetParameterBlock,
    _generator: ExtendedPythonGenerator,
) {
  // TODO (Alan) : Specify the type here as well
  const code = block.getFieldValue(FIELD_PARAMETER_NAME);

  return [code, Order.ATOMIC];
};
