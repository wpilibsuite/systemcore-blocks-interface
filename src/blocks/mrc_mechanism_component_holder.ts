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
import * as ChangeFramework from './utils/change_framework';
import { getLegalName } from './utils/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import * as commonStorage from '../storage/common_storage';
import { OUTPUT_NAME as MECHANISM_OUTPUT } from './mrc_mechanism';
import { BLOCK_NAME as  MRC_MECHANISM_NAME } from './mrc_mechanism';
import { BLOCK_NAME as  MRC_COMPONENT_NAME } from './mrc_component';
import * as  Component from './mrc_component';
import { OUTPUT_NAME as COMPONENT_OUTPUT } from './mrc_component';
import { BLOCK_NAME as  MRC_EVENT_NAME } from './mrc_event';
import { OUTPUT_NAME as EVENT_OUTPUT } from './mrc_event';

export const BLOCK_NAME = 'mrc_mechanism_component_holder';

export const MECHANISM = 'mechanism';
export const COMPONENT = 'component';

export const TOOLBOX_UPDATE_EVENT = 'toolbox-update-requested';

type MechanismComponentHolderExtraState = {
  hideMechanisms?: boolean;
}

type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
interface MechanismComponentHolderMixin extends MechanismComponentHolderMixinType {
  mrcHideMechanisms: boolean;
}
type MechanismComponentHolderMixinType = typeof MECHANISM_COMPONENT_HOLDER;

function setName(block: Blockly.BlockSvg){
    const parentBlock = ChangeFramework.getParentOfType(block, BLOCK_NAME);
    if (parentBlock) {
        const variableBlocks = parentBlock!.getDescendants(true)
        const otherNames: string[] = []
        variableBlocks?.forEach(function (variableBlock) {
            if (variableBlock != block) {
                otherNames.push(variableBlock.getFieldValue('NAME'));
            }
        });
        const currentName = block.getFieldValue('NAME');       
        block.setFieldValue(getLegalName(currentName, otherNames), 'NAME');
    }
}

const MECHANISM_COMPONENT_HOLDER = {
  /**
    * Block initialization.
    */
  init: function (this: MechanismComponentHolderBlock): void {
    this.setInputsInline(false);
    this.appendStatementInput('MECHANISMS').setCheck(MECHANISM_OUTPUT).appendField('Mechanisms');
    this.appendStatementInput('COMPONENTS').setCheck(COMPONENT_OUTPUT).appendField('Components');
    this.appendStatementInput('EVENTS').setCheck(EVENT_OUTPUT).appendField('Events');


    this.setOutput(false);
    this.setStyle(MRC_STYLE_MECHANISMS);
    ChangeFramework.registerCallback(MRC_COMPONENT_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
    ChangeFramework.registerCallback(MRC_MECHANISM_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
    ChangeFramework.registerCallback(MRC_EVENT_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
  },
  saveExtraState: function (this: MechanismComponentHolderBlock): MechanismComponentHolderExtraState {
    const extraState: MechanismComponentHolderExtraState = {
    };
    if (this.mrcHideMechanisms == true) {
      extraState.hideMechanisms = this.mrcHideMechanisms;
    }
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: MechanismComponentHolderBlock, extraState: MechanismComponentHolderExtraState): void {
    this.mrcHideMechanisms = (extraState.hideMechanisms == undefined) ? false : extraState.hideMechanisms;
    this.updateBlock_();
  },
  /**
     * Update the block to reflect the newly loaded extra state.
     */
  updateBlock_: function (this: MechanismComponentHolderBlock): void {
    if (this.mrcHideMechanisms) {
      if (this.getInput('MECHANISMS')) {
        this.removeInput('MECHANISMS')
      }
    }
    else {
      if (this.getInput('MECHANISMS') == null) {
        this.appendStatementInput('MECHANISMS').setCheck(MECHANISM_OUTPUT).appendField('Mechanisms');
        this.moveInputBefore('MECHANISMS', 'COMPONENTS')
      }
    }
  },
  onBlockChanged: function (block: Blockly.BlockSvg, blockEvent: Blockly.Events.BlockBase) {
    if (blockEvent.type == Blockly.Events.BLOCK_MOVE) {
      let blockMoveEvent = blockEvent as Blockly.Events.BlockMove;
      if (blockMoveEvent.reason?.includes('connect')) {
        setName(block);
        updateToolboxAfterDelay();
      }
    }
    else {
      if (blockEvent.type == Blockly.Events.BLOCK_CHANGE) {
        setName(block);
        updateToolboxAfterDelay();
      }
    }
  },
  getComponents: function (this: MechanismComponentHolderBlock): commonStorage.Component[] {
    const components: commonStorage.Component[] = []

    // Get component blocks from the COMPONENTS input
    const componentsInput = this.getInput('COMPONENTS');
    if (componentsInput && componentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = componentsInput.connection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME) {
          const componentName = componentBlock.getFieldValue(Component.FIELD_NAME);
          const componentType = componentBlock.getFieldValue(Component.FIELD_TYPE);

          if (componentName && componentType) {
            components.push({
              name: componentName,
              className: componentType,
            });
          }
        }
        // Move to the next block in the chain
        componentBlock = componentBlock.getNextBlock();
      }
    }

    return components;
  },
}

let toolboxUpdateTimeout: NodeJS.Timeout | null = null;
export function updateToolboxAfterDelay(){
  if (toolboxUpdateTimeout) {
    clearTimeout(toolboxUpdateTimeout);
  }
  toolboxUpdateTimeout = setTimeout(() => {
    const event = new CustomEvent(TOOLBOX_UPDATE_EVENT, {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(event);
    toolboxUpdateTimeout = null;
  }, 100);
}

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM_COMPONENT_HOLDER;
}

function pythonFromBlockInRobot(block: MechanismComponentHolderBlock, generator: ExtendedPythonGenerator) {
  let code = 'def define_hardware(self):\n' + generator.INDENT + 'self.hardware = []\n';

  let mechanisms = '';
  let components = '';

  mechanisms = generator.statementToCode(block, 'MECHANISMS');
  components = generator.statementToCode(block, 'COMPONENTS');

  const body = mechanisms + components;
  if (body != '') {
    code += body;
  } 

  generator.addClassMethodDefinition('define_hardware', code);
}

function pythonFromBlockInMechanism(block: MechanismComponentHolderBlock, generator: ExtendedPythonGenerator) {
  let components = '';

  components = generator.statementToCode(block, 'COMPONENTS');

  let code = 'def define_hardware(self' + generator.getListOfPorts(false) + '):\n' +
    generator.INDENT + 'self.hardware = []\n';

  if (components != '') {
    code += components;
  } 
  generator.addClassMethodDefinition('define_hardware', code);
}

export const pythonFromBlock = function (
  block: MechanismComponentHolderBlock,
  generator: ExtendedPythonGenerator,
) {
  if (block.getInput('MECHANISMS')) {
    pythonFromBlockInRobot(block, generator);
  }
  else {
    pythonFromBlockInMechanism(block, generator);
  }
  return ''
}
