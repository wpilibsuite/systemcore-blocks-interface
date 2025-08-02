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
import { OUTPUT_NAME as COMPONENT_OUTPUT } from './mrc_component';
import { ComponentBlock } from './mrc_component';
import { BLOCK_NAME as  MRC_EVENT_NAME } from './mrc_event';
import { OUTPUT_NAME as EVENT_OUTPUT } from './mrc_event';
import { EventBlock } from './mrc_event';

export const BLOCK_NAME = 'mrc_mechanism_component_holder';

const INPUT_MECHANISMS = 'MECHANISMS';
const INPUT_COMPONENTS = 'COMPONENTS';
const INPUT_EVENTS = 'EVENTS';

export const TOOLBOX_UPDATE_EVENT = 'toolbox-update-requested';

type MechanismComponentHolderExtraState = {
  hideMechanisms?: boolean;
}

export type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
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
    this.appendStatementInput(INPUT_MECHANISMS).setCheck(MECHANISM_OUTPUT).appendField(Blockly.Msg.MECHANISMS);
    this.appendStatementInput(INPUT_COMPONENTS).setCheck(COMPONENT_OUTPUT).appendField(Blockly.Msg.COMPONENTS);
    this.appendStatementInput(INPUT_EVENTS).setCheck(EVENT_OUTPUT).appendField(Blockly.Msg.EVENTS);


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
      if (this.getInput(INPUT_MECHANISMS)) {
        this.removeInput(INPUT_MECHANISMS)
      }
    }
    else {
      if (this.getInput(INPUT_MECHANISMS) == null) {
        this.appendStatementInput(INPUT_MECHANISMS).setCheck(MECHANISM_OUTPUT).appendField('Mechanisms');
        this.moveInputBefore(INPUT_MECHANISMS, INPUT_COMPONENTS)
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
    const componentsInput = this.getInput(INPUT_COMPONENTS);
    if (componentsInput && componentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = componentsInput.connection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME) {
          const component = (componentBlock as ComponentBlock).getComponent();
          if (component) {
            components.push(component);
          }
        }
        // Move to the next block in the chain
        componentBlock = componentBlock.getNextBlock();
      }
    }

    return components;
  },
  getEvents: function (this: MechanismComponentHolderBlock): commonStorage.Event[] {
    const events: commonStorage.Event[] = []

    // Get event blocks from the EVENTS input
    const eventsInput = this.getInput(INPUT_EVENTS);
    if (eventsInput && eventsInput.connection) {
      // Walk through all connected event blocks.
      let eventBlock = eventsInput.connection.targetBlock();
      while (eventBlock) {
        if (eventBlock.type === MRC_EVENT_NAME) {
          const event = (eventBlock as EventBlock).getEvent();
          if (event) {
            events.push(event);
          }
        }
        // Move to the next block in the chain
        eventBlock = eventBlock.getNextBlock();
      }
    }

    return events;
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
  let code = 'def define_hardware(self):\n';

  const mechanisms = generator.statementToCode(block, INPUT_MECHANISMS);
  const components = generator.statementToCode(block, INPUT_COMPONENTS);

  const body = mechanisms + components;
  if (body) {
    code += body;
    generator.addClassMethodDefinition('define_hardware', code);
  }
}

function pythonFromBlockInMechanism(block: MechanismComponentHolderBlock, generator: ExtendedPythonGenerator) {
  let code = 'def define_hardware(self';
  const ports: string[] = generator.getComponentPortParameters();
  if (ports.length) {
    code += ', ' + ports.join(', ');
  }
  code += '):\n';

  const components = generator.statementToCode(block, INPUT_COMPONENTS);

  if (components) {
    code += components;
    generator.addClassMethodDefinition('define_hardware', code);
  }
}

export const pythonFromBlock = function (
    block: MechanismComponentHolderBlock,
    generator: ExtendedPythonGenerator) {
  switch (generator.getModuleType()) {
    case commonStorage.MODULE_TYPE_ROBOT:
      pythonFromBlockInRobot(block, generator);
      break;
    case commonStorage.MODULE_TYPE_MECHANISM:
      pythonFromBlockInMechanism(block, generator);
      break;
  }
  return ''
}

// Misc

/**n
 * Returns true if the given workspace has a mrc_mechanism_component_holder
 * block that contains at least one component.
 */
export function hasAnyComponents(workspace: Blockly.Workspace): boolean {
  for (const block of workspace.getBlocksByType(BLOCK_NAME)) {
    const componentsInput = block.getInput(INPUT_COMPONENTS);
    if (componentsInput && componentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = componentsInput.connection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME && componentBlock.isEnabled()) {
          return true;
        }
        // Move to the next block in the chain
        componentBlock = componentBlock.getNextBlock();
      }
    }
  }
  return false;
}

/**
 * Collects the ports for components plugged into the mrc_mechanism_component_holder block.
 */
export function getComponentPorts(workspace: Blockly.Workspace, ports: {[key: string]: string}): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach( block => {
    const componentsInput = block.getInput(INPUT_COMPONENTS);
    if (componentsInput && componentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = componentsInput.connection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME && componentBlock.isEnabled()) {
          (componentBlock as ComponentBlock).getComponentPorts(ports);
        }
        // Move to the next block in the chain
        componentBlock = componentBlock.getNextBlock();
      }
    }
  });
}

export function getComponents(
    workspace: Blockly.Workspace,
    components: commonStorage.Component[]): void {
  // Get the holder block and ask it for the components.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const componentsFromHolder: commonStorage.Component[] =
      (block as MechanismComponentHolderBlock).getComponents();
    components.push(...componentsFromHolder);
  });
}

export function getEvents(
    workspace: Blockly.Workspace,
    events: commonStorage.Event[]): void {
  // Get the holder block and ask it for the events.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const eventsFromHolder: commonStorage.Event[] =
      (block as MechanismComponentHolderBlock).getEvents();
    events.push(...eventsFromHolder);
  });
}
