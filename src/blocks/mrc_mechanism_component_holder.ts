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
 * @fileoverview Blocks to hold mechanisms and containers
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { MRC_STYLE_MECHANISMS } from '../themes/styles';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { OUTPUT_NAME as MECHANISM_OUTPUT } from './mrc_mechanism';
import { OUTPUT_NAME as COMPONENT_OUTPUT } from './mrc_component';
import { createPlusField } from '../fields/field_plus';
import { createMinusField } from '../fields/field_minus';
import { Order } from 'blockly/python';


export const BLOCK_NAME = 'mrc_mechanism_component_holder';

export const MECHANISM = 'mechanism';
export const COMPONENT = 'component';

type MechanismComponentHolderExtraState = {
  numMechanismInputs?: number,
  numComponentInputs?: number,
}

type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
interface MechanismComponentHolderMixin extends MechanismComponentHolderMixinType {
  mrcNumMechanismInputs: number,
  mrcNumComponentInputs: number,
  lastMechanism: Blockly.Input,
  lastComponent: Blockly.Input
}
type MechanismComponentHolderMixinType = typeof MECHANISM_COMPONENT_HOLDER;

const MECHANISM_COMPONENT_HOLDER = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismComponentHolderBlock): void {
    this.setInputsInline(false);
    this.appendValueInput('MECHANISM_1')
      .appendField('Mechanisms')
      .appendField(createPlusField(MECHANISM), 'PLUS_MECHANISM')
      .setCheck(MECHANISM_OUTPUT);

    this.appendValueInput('COMPONENT_1')
      .appendField('Components')
      .appendField(createPlusField(COMPONENT), 'PLUS_COMPONENT')
      .setCheck(COMPONENT_OUTPUT);
    this.setOutput(false);
    this.setStyle(MRC_STYLE_MECHANISMS);
    this.mrcNumComponentInputs = 1;
    this.mrcNumMechanismInputs = 1;
  },
  plus: function (this: MechanismComponentHolderBlock, type: string): void {
    if (type == MECHANISM) {
      this.addMechanismPart_();
    } else if (type == COMPONENT) {
      this.addComponentPart_();
    }
  },
  addMechanismPart_: function (this: MechanismComponentHolderBlock): void {
    this.mrcNumMechanismInputs += 1;
    let newName = 'MECHANISM_' + this.mrcNumMechanismInputs;
    let lastLast = this.lastMechanism;
    this.lastMechanism = this.appendValueInput(newName)
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createMinusField(MECHANISM), 'MINUS_MECHANISM')
      .setCheck(MECHANISM_OUTPUT);
    this.moveInputBefore(newName, 'COMPONENT_1');
    if (lastLast) {
      lastLast.removeField('MINUS_MECHANISM');
    }
  },
  addComponentPart_: function (this: MechanismComponentHolderBlock): void {
    this.mrcNumComponentInputs += 1;
    let newName = 'COMPONENT_' + this.mrcNumComponentInputs;
    let lastLast = this.lastComponent;
    this.lastComponent = this.appendValueInput(newName)
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createMinusField(COMPONENT), 'MINUS_COMPONENT')
      .setCheck(COMPONENT_OUTPUT);
    if (lastLast) {
      lastLast.removeField('MINUS_COMPONENT');
    }
  },
  minus: function (this: MechanismComponentHolderBlock, type: string): void {
    if (type == MECHANISM) {
      this.subtractMechanismPart_();
    } else if (type == COMPONENT) {
      this.subtractComponentPart_();
    }
  },
  subtractMechanismPart_: function (this: MechanismComponentHolderBlock): void {
    if (this.mrcNumMechanismInputs > 1) {
      let name = 'MECHANISM_' + this.mrcNumMechanismInputs;
      this.removeInput(name);
      this.mrcNumMechanismInputs -= 1;
      if (this.mrcNumMechanismInputs > 1) {
        name = 'MECHANISM_' + this.mrcNumMechanismInputs;
        let lastInput = this.getInput(name);
        if (lastInput) {
          this.lastMechanism = lastInput.appendField(createMinusField(MECHANISM), 'MINUS_MECHANISM');
        }
      }
    }
  },
  subtractComponentPart_: function (this: MechanismComponentHolderBlock): void {
    if (this.mrcNumComponentInputs > 1) {
      let name = 'COMPONENT_' + this.mrcNumComponentInputs;
      this.removeInput(name);
      this.mrcNumComponentInputs -= 1;
      if (this.mrcNumComponentInputs > 1) {
        name = 'COMPONENT_' + this.mrcNumComponentInputs;
        let lastInput = this.getInput(name);
        if (lastInput) {
          this.lastMechanism = lastInput.appendField(createMinusField(COMPONENT), 'MINUS_COMPONENT');
        }
      }
    }
  },
  saveExtraState: function (this: MechanismComponentHolderBlock): MechanismComponentHolderExtraState {
    const extraState: MechanismComponentHolderExtraState = {
    };
    if (this.mrcNumComponentInputs != 1) {
      extraState.numComponentInputs = this.mrcNumComponentInputs;
    }
    if (this.mrcNumMechanismInputs != 1) {
      extraState.numMechanismInputs = this.mrcNumMechanismInputs;
    }
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: MechanismComponentHolderBlock, extraState: MechanismComponentHolderExtraState): void {
    this.mrcNumComponentInputs = (extraState.numComponentInputs == undefined) ? 1 : extraState.numComponentInputs;
    this.mrcNumMechanismInputs = (extraState.numMechanismInputs == undefined) ? 1 : extraState.numMechanismInputs;
    this.updateBlock_();
  },
  /**
     * Update the block to reflect the newly loaded extra state.
     */
  updateBlock_: function (this: MechanismComponentHolderBlock): void {
    let number = 1;
    while (this.getInput('MECHANISM_' + number)) {
      this.removeInput('MECHANISM_' + number);
      number += 1;
    }
    number = 1;
    while (this.getInput('COMPONENT_' + number)) {
      this.removeInput('COMPONENT_' + number);
      number += 1;
    }

    if (this.mrcNumMechanismInputs != 0) {
      this.appendValueInput('MECHANISM_1')
        .appendField('Mechanisms')
        .appendField(createPlusField(MECHANISM), 'PLUS_MECHANISM')
        .setCheck(MECHANISM_OUTPUT);
    }
    let remainingMechanisms = this.mrcNumMechanismInputs - 1;
    number = 1;
    while (remainingMechanisms > 0) {
      number += 1;
      let newName = 'MECHANISM_' + number;
      this.lastMechanism = this.appendValueInput(newName)
        .setAlign(Blockly.inputs.Align.RIGHT)
        .setCheck(MECHANISM_OUTPUT);
      if (remainingMechanisms == 1) {
        this.lastMechanism.appendField(createMinusField(MECHANISM), 'MINUS_MECHANISM')
      }      
      remainingMechanisms--;
    }

    if (this.mrcNumComponentInputs != 0) {
      this.appendValueInput('COMPONENT_1')
        .appendField('Components')
        .appendField(createPlusField(COMPONENT), 'PLUS_COMPONENT')
        .setCheck(COMPONENT_OUTPUT);
    }
    let remainingComponents = this.mrcNumComponentInputs - 1;
    number = 1;
    while (remainingComponents > 0) {
      let newName = 'COMPONENT_' + number;
      this.lastComponent = this.appendValueInput(newName)
        .setAlign(Blockly.inputs.Align.RIGHT)
        .setCheck(COMPONENT_OUTPUT);
      if (remainingComponents == 1) {
        this.lastComponent.appendField(createMinusField(COMPONENT), 'MINUS_COMPONENT')
      }      
      remainingComponents--;
    }
  }
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM_COMPONENT_HOLDER;
}

export const pythonFromBlock = function (
  block: MechanismComponentHolderBlock,
  generator: ExtendedPythonGenerator,
) {
  let code = 'def define_hardware(self):\n';

  let body = '';
  for(let i = 1; i <= block.mrcNumMechanismInputs; i++){
    const name = 'MECHANISM_' + i;
    if(block.getInput(name)){
      let mechanismCode = generator.valueToCode(block, name, Order.NONE) || '';
      if (mechanismCode != ''){
        body += generator.INDENT + mechanismCode + "\n";
      }
    }
  }
  for(let i = 1; i <= block.mrcNumComponentInputs; i++){
    const name = 'COMPONENT_' + i;
    if(block.getInput(name)){
      let componentCode = generator.valueToCode(block, name, Order.NONE) || '';
      if (componentCode != ''){
        body += generator.INDENT + componentCode + "\n";
      }
    }
  }
  
  if(body != ''){
    code += body;
  }else{
    code += generator.INDENT + 'pass';
  }

  generator.addClassMethodDefinition('define_hardware', code);
  return '';
}