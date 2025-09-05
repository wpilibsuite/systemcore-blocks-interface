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
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import { BLOCK_NAME as  MRC_MECHANISM_NAME } from './mrc_mechanism';
import { OUTPUT_NAME as MECHANISM_OUTPUT } from './mrc_mechanism';
import { MechanismBlock } from './mrc_mechanism';
import { BLOCK_NAME as  MRC_COMPONENT_NAME } from './mrc_component';
import { OUTPUT_NAME as COMPONENT_OUTPUT } from './mrc_component';
import { ComponentBlock } from './mrc_component';
import { BLOCK_NAME as  MRC_EVENT_NAME } from './mrc_event';
import { OUTPUT_NAME as EVENT_OUTPUT } from './mrc_event';
import { EventBlock } from './mrc_event';

export const BLOCK_NAME = 'mrc_mechanism_component_holder';

const INPUT_MECHANISMS = 'MECHANISMS';
const INPUT_COMPONENTS = 'COMPONENTS';
const INPUT_PRIVATE_COMPONENTS = 'PRIVATE_COMPONENTS';
const INPUT_EVENTS = 'EVENTS';

export const TOOLBOX_UPDATE_EVENT = 'toolbox-update-requested';

type MechanismComponentHolderExtraState = {
  hideMechanisms?: boolean;
  hidePrivateComponents?: boolean;
}

export type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
interface MechanismComponentHolderMixin extends MechanismComponentHolderMixinType {
  mrcHideMechanisms: boolean;
  mrcHidePrivateComponents: boolean;
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
    const privateComponentsInput = this.appendStatementInput(INPUT_PRIVATE_COMPONENTS).setCheck(COMPONENT_OUTPUT).appendField(Blockly.Msg.PRIVATE_COMPONENTS);
    // Set tooltip on the private components field
    const privateComponentsField = privateComponentsInput.fieldRow[0];
    if (privateComponentsField) {
      privateComponentsField.setTooltip(Blockly.Msg.PRIVATE_COMPONENTS_TOOLTIP);
    }
    this.appendStatementInput(INPUT_EVENTS).setCheck(EVENT_OUTPUT).appendField(Blockly.Msg.EVENTS);
    
    // Update components tooltip based on private components visibility
    this.updateComponentsTooltip_();

    this.setOutput(false);
    this.setStyle(MRC_STYLE_MECHANISMS);
    ChangeFramework.registerCallback(MRC_COMPONENT_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
    ChangeFramework.registerCallback(MRC_MECHANISM_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
    ChangeFramework.registerCallback(MRC_EVENT_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
    // TODO: We also need an event handler for when a mechanism, component, or event is deleted or
    // disconnected from the holder.
  },
  saveExtraState: function (this: MechanismComponentHolderBlock): MechanismComponentHolderExtraState {
    const extraState: MechanismComponentHolderExtraState = {
    };
    if (this.mrcHideMechanisms == true) {
      extraState.hideMechanisms = this.mrcHideMechanisms;
    }
    if (this.mrcHidePrivateComponents == true) {
      extraState.hidePrivateComponents = this.mrcHidePrivateComponents;
    }
    return extraState;
  },
  /**
  * Applies the given state to this block.
  */
  loadExtraState: function (this: MechanismComponentHolderBlock, extraState: MechanismComponentHolderExtraState): void {
    this.mrcHideMechanisms = (extraState.hideMechanisms == undefined) ? false : extraState.hideMechanisms;
    this.mrcHidePrivateComponents = (extraState.hidePrivateComponents == undefined) ? false : extraState.hidePrivateComponents;
    this.updateBlock_();
  },
  /**
   * Update the components tooltip based on private components visibility.
   */
  updateComponentsTooltip_: function (this: MechanismComponentHolderBlock): void {
    const componentsInput = this.getInput(INPUT_COMPONENTS);
    if (componentsInput && componentsInput.fieldRow[0]) {
      const componentsField = componentsInput.fieldRow[0];
      // Only show tooltip if private components are also visible (not hidden)
      if (!this.mrcHidePrivateComponents) {
        componentsField.setTooltip(Blockly.Msg.COMPONENTS_TOOLTIP);
      } else {
        componentsField.setTooltip('');
      }
    }
  },
  /**
     * Update the block to reflect the newly loaded extra state.
     */
  updateBlock_: function (this: MechanismComponentHolderBlock): void {
    // Handle mechanisms input visibility
    if (this.mrcHideMechanisms) {
      if (this.getInput(INPUT_MECHANISMS)) {
        this.removeInput(INPUT_MECHANISMS)
      }
    }
    else {
      if (this.getInput(INPUT_MECHANISMS) == null) {
        this.appendStatementInput(INPUT_MECHANISMS).setCheck(MECHANISM_OUTPUT).appendField(Blockly.Msg.MECHANISMS);
        this.moveInputBefore(INPUT_MECHANISMS, INPUT_COMPONENTS)
      }
    }

    // Handle private components input visibility
    if (this.mrcHidePrivateComponents) {
      if (this.getInput(INPUT_PRIVATE_COMPONENTS)) {
        this.removeInput(INPUT_PRIVATE_COMPONENTS)
      }
    }
    else {
      if (this.getInput(INPUT_PRIVATE_COMPONENTS) == null) {
        const privateComponentsInput = this.appendStatementInput(INPUT_PRIVATE_COMPONENTS).setCheck(COMPONENT_OUTPUT).appendField(Blockly.Msg.PRIVATE_COMPONENTS);
        // Set tooltip on the field
        const privateComponentsField = privateComponentsInput.fieldRow[0];
        if (privateComponentsField) {
          privateComponentsField.setTooltip(Blockly.Msg.PRIVATE_COMPONENTS_TOOLTIP);
        }
        this.moveInputBefore(INPUT_PRIVATE_COMPONENTS, INPUT_EVENTS)
      }
    }
    
    // Update components tooltip based on private components visibility
    this.updateComponentsTooltip_();
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
  getMechanisms: function (this: MechanismComponentHolderBlock): storageModuleContent.MechanismInRobot[] {
    const mechanisms: storageModuleContent.MechanismInRobot[] = []

    // Get mechanism blocks from the MECHANISMS input
    const mechanismsInput = this.getInput(INPUT_MECHANISMS);
    if (mechanismsInput && mechanismsInput.connection) {
      // Walk through all connected mechanism blocks.
      let mechanismBlock = mechanismsInput.connection.targetBlock();
      while (mechanismBlock) {
        if (mechanismBlock.type === MRC_MECHANISM_NAME) {
          const mechanism = (mechanismBlock as MechanismBlock).getMechanism();
          if (mechanism) {
            mechanisms.push(mechanism);
          }
        }
        // Move to the next block in the chain
        mechanismBlock = mechanismBlock.getNextBlock();
      }
    }

    return mechanisms;
  },
  getComponents: function (this: MechanismComponentHolderBlock): storageModuleContent.Component[] {
    const components: storageModuleContent.Component[] = []

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
  getPrivateComponents: function (this: MechanismComponentHolderBlock): storageModuleContent.Component[] {
    const components: storageModuleContent.Component[] = []

    // Get component blocks from the PRIVATE_COMPONENTS input
    const privateComponentsInput = this.getInput(INPUT_PRIVATE_COMPONENTS);
    if (privateComponentsInput && privateComponentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = privateComponentsInput.connection.targetBlock();
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
  getEvents: function (this: MechanismComponentHolderBlock): storageModuleContent.Event[] {
    const events: storageModuleContent.Event[] = []

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
  const privateComponents = generator.statementToCode(block, INPUT_PRIVATE_COMPONENTS);

  const body = components + privateComponents;
  if (body) {
    code += body;
    generator.addClassMethodDefinition('define_hardware', code);
  }
}

export const pythonFromBlock = function (
    block: MechanismComponentHolderBlock,
    generator: ExtendedPythonGenerator) {
  switch (generator.getModuleType()) {
    case storageModule.ModuleType.ROBOT:
      pythonFromBlockInRobot(block, generator);
      break;
    case storageModule.ModuleType.MECHANISM:
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
    // Check regular components
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

    // Check private components
    const privateComponentsInput = block.getInput(INPUT_PRIVATE_COMPONENTS);
    if (privateComponentsInput && privateComponentsInput.connection) {
      // Walk through all connected private component blocks.
      let componentBlock = privateComponentsInput.connection.targetBlock();
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

    // Also include private components for port collection
    const privateComponentsInput = block.getInput(INPUT_PRIVATE_COMPONENTS);
    if (privateComponentsInput && privateComponentsInput.connection) {
      // Walk through all connected private component blocks.
      let componentBlock = privateComponentsInput.connection.targetBlock();
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

export function getMechanisms(
    workspace: Blockly.Workspace,
    mechanisms: storageModuleContent.MechanismInRobot[]): void {
  // Get the holder block and ask it for the mechanisms.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const mechanismsFromHolder: storageModuleContent.MechanismInRobot[] =
      (block as MechanismComponentHolderBlock).getMechanisms();
    mechanisms.push(...mechanismsFromHolder);
  });
}

export function getComponents(
    workspace: Blockly.Workspace,
    components: storageModuleContent.Component[]): void {
  // Get the holder block and ask it for the components.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const componentsFromHolder: storageModuleContent.Component[] =
      (block as MechanismComponentHolderBlock).getComponents();
    components.push(...componentsFromHolder);
  });
}

export function getPrivateComponents(
    workspace: Blockly.Workspace,
    components: storageModuleContent.Component[]): void {
  // Get the holder block and ask it for the private components.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const privateComponentsFromHolder: storageModuleContent.Component[] =
      (block as MechanismComponentHolderBlock).getPrivateComponents();
    components.push(...privateComponentsFromHolder);
  });
}

export function getAllComponents(
    workspace: Blockly.Workspace,
    components: storageModuleContent.Component[]): void {
  // Get both regular and private components for when creating a mechanism
  getComponents(workspace, components);
  getPrivateComponents(workspace, components);
}

export function getEvents(
    workspace: Blockly.Workspace,
    events: storageModuleContent.Event[]): void {
  // Get the holder block and ask it for the events.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const eventsFromHolder: storageModuleContent.Event[] =
      (block as MechanismComponentHolderBlock).getEvents();
    events.push(...eventsFromHolder);
  });
}
