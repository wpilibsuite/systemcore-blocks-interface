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

export const BLOCK_NAME = 'mrc_mechanism_component_holder';

export const MECHANISM = 'mechanism';
export const COMPONENT = 'component';

type MechanismComponentHolderExtraState = {
  hideMechanims?: boolean;
}

type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
interface MechanismComponentHolderMixin extends MechanismComponentHolderMixinType {
  mrcHideMechanisms : boolean;
}
type MechanismComponentHolderMixinType = typeof MECHANISM_COMPONENT_HOLDER;

const MECHANISM_COMPONENT_HOLDER = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismComponentHolderBlock): void {
    this.setInputsInline(false);
    this.appendStatementInput('MECHANISMS').setCheck(MECHANISM_OUTPUT).appendField('Mechanisms');
    this.appendStatementInput('COMPONENTS').setCheck(COMPONENT_OUTPUT).appendField('Components');

    this.setOutput(false);
    this.setStyle(MRC_STYLE_MECHANISMS);
  },
  saveExtraState: function (this: MechanismComponentHolderBlock): MechanismComponentHolderExtraState {
    const extraState: MechanismComponentHolderExtraState = {
    };
    if (this.mrcHideMechanisms == true) {
      extraState.hideMechanims = this.mrcHideMechanisms;
    }
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: MechanismComponentHolderBlock, extraState: MechanismComponentHolderExtraState): void {
    this.mrcHideMechanisms = (extraState.hideMechanims == undefined) ? 1 : extraState.hideMechanims;
    this.updateBlock_();
  },
  /**
     * Update the block to reflect the newly loaded extra state.
     */
  updateBlock_: function (this: MechanismComponentHolderBlock): void {
    if(this.mrcHideMechanisms){
      if(this.getInput('MECHANISMS')){
        this.removeInput('MECHANISMS')
      }    
    }
    else{
      if(!this.getInput('MECHANISMS')){
        this.appendStatementInput('MECHANISMS').setCheck(MECHANISM_OUTPUT).appendField('Mechanisms');
        this.moveInputBefore('MECHANISMS', 'COMPONENTS')
      }
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
  let code = 'def define_hardware(self):\n' + generator.INDENT + 'self.hardware = []\n';

  let mechanisms = '';
  let components = '';

  if (block.getInput('MECHANISMS')) {
    mechanisms = generator.statementToCode(block, 'MECHANISMS');
  }
  if (block.getInput('COMPONENTS')) {
    components = generator.statementToCode(block, 'COMPONENTS');
  }
  const body = mechanisms + components;
  if(body != ''){
    code += body;
  }else{
    code += generator.INDENT + 'pass';
  }

  generator.addClassMethodDefinition('define_hardware', code);
  return '';
}