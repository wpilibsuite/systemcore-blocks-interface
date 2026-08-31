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
import { makeLegalName } from './utils/validator';
import * as workspaces from './utils/workspaces';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import { NONCOPYABLE_BLOCK } from './noncopyable_block';
import { createMechanismBlock, BLOCK_NAME as MRC_MECHANISM_NAME } from './mrc_mechanism';
import { OUTPUT_NAME as MECHANISM_OUTPUT } from './mrc_mechanism';
import { MechanismBlock } from './mrc_mechanism';
import { BLOCK_NAME as MRC_COMPONENT_NAME } from './mrc_component';
import { FIELD_NAME as MRC_COMPONENT_FIELD_NAME, FIELD_TYPE as MRC_COMPONENT_FIELD_TYPE } from './mrc_component';
import { OUTPUT_NAME as COMPONENT_OUTPUT } from './mrc_component';
import { ComponentBlock } from './mrc_component';
import { BLOCK_NAME as MRC_EVENT_NAME } from './mrc_event';
import { OUTPUT_NAME as EVENT_OUTPUT } from './mrc_event';
import { EventBlock } from './mrc_event';

export const BLOCK_NAME = 'mrc_mechanism_component_holder';

const INPUT_MECHANISMS = 'MECHANISMS';
const INPUT_COMPONENTS = 'COMPONENTS';
const INPUT_PRIVATE_COMPONENTS = 'PRIVATE_COMPONENTS';
const INPUT_EVENTS = 'EVENTS';

type MechanismComponentHolderExtraState = {
  hideMechanisms?: boolean;
  hidePrivateComponents?: boolean;
}

export type MechanismComponentHolderBlock = Blockly.Block & MechanismComponentHolderMixin;
interface MechanismComponentHolderMixin extends MechanismComponentHolderMixinType {
  mrcHideMechanisms: boolean;
  mrcHidePrivateComponents: boolean;

  mrcMechanismBlockIds: string,
  mrcComponentBlockIds: string,
  mrcPrivateComponentBlockIds: string,
  mrcEventBlockIds: string,
}
type MechanismComponentHolderMixinType = typeof MECHANISM_COMPONENT_HOLDER;

const MECHANISM_COMPONENT_HOLDER = {
  /**
   * Block initialization.
   */
  init: function (this: MechanismComponentHolderBlock): void {
    this.setInputsInline(false);
    this.setOutput(false);
    this.setStyle(MRC_STYLE_MECHANISMS);
    this.mrcMechanismBlockIds = '';
    this.mrcComponentBlockIds = '';
    this.mrcPrivateComponentBlockIds = '';
    this.mrcEventBlockIds = '';
  },
  ...NONCOPYABLE_BLOCK,
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
   * Update the block to reflect the newly loaded extra state.
   */
  updateBlock_: function (this: MechanismComponentHolderBlock): void {
    // Handle mechanisms input visibility
    if (!this.mrcHideMechanisms) {
      this.appendStatementInput(INPUT_MECHANISMS)
        .setCheck(MECHANISM_OUTPUT)
        .appendField(Blockly.Msg.MECHANISMS);
    }

    const componentsField = new Blockly.FieldLabel(Blockly.Msg.COMPONENTS);
    this.appendStatementInput(INPUT_COMPONENTS)
      .setCheck(COMPONENT_OUTPUT)
      .appendField(componentsField);

    // Handle private components input visibility
    if (!this.mrcHidePrivateComponents) {
      const privateComponentsField = new Blockly.FieldLabel(Blockly.Msg.PRIVATE_COMPONENTS);
      this.appendStatementInput(INPUT_PRIVATE_COMPONENTS)
        .setCheck(COMPONENT_OUTPUT)
        .appendField(privateComponentsField);
      // Set tooltips on both componentsField and privateComponentsField.
      componentsField.setTooltip(Blockly.Msg.COMPONENTS_TOOLTIP);
      privateComponentsField.setTooltip(Blockly.Msg.PRIVATE_COMPONENTS_TOOLTIP);
    }

    this.appendStatementInput(INPUT_EVENTS)
      .setCheck(EVENT_OUTPUT)
      .appendField(Blockly.Msg.EVENTS);
  },
  /**
   * mrcOnLoad is called for each MechanismComponentHolderBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function (this: MechanismComponentHolderBlock, editor: Editor): void {
    this.collectDescendants(editor, false);
  },
  /**
   * mrcOnDescendantDisconnect is called for each MechanismComponentHolderBlock when any descendant is
   * disconnected.
   */
  mrcOnDescendantDisconnect: function (this: MechanismComponentHolderBlock, editor: Editor): void {
    this.collectDescendants(editor, true);
  },
  mrcDescendantsMayHaveChanged: function (this: MechanismComponentHolderBlock, editor: Editor): void {
    this.collectDescendants(editor, true);
  },
  collectDescendants: function (
    this: MechanismComponentHolderBlock, editor: Editor, updateToolboxIfDescendantsChanged: boolean): void {
    let mechanismBlockIds = '';
    let componentBlockIds = '';
    let privateComponentBlockIds = '';
    let eventBlockIds = '';

    const mechanismsInput = this.getInput(INPUT_MECHANISMS);
    if (mechanismsInput && mechanismsInput.connection) {
      // Walk through all connected mechanism blocks.
      let mechanismBlock = mechanismsInput.connection.targetBlock();
      while (mechanismBlock) {
        if (mechanismBlock.type === MRC_MECHANISM_NAME) {
          mechanismBlockIds += mechanismBlock.id;
        }
        // Move to the next block in the stack.
        mechanismBlock = mechanismBlock.getNextBlock();
      }
    }
    const componentsInput = this.getInput(INPUT_COMPONENTS);
    if (componentsInput && componentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = componentsInput.connection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME) {
          componentBlockIds += componentBlock.id;
        }
        // Move to the next block in the stack.
        componentBlock = componentBlock.getNextBlock();
      }
    }
    const privateComponentsInput = this.getInput(INPUT_PRIVATE_COMPONENTS);
    if (privateComponentsInput && privateComponentsInput.connection) {
      // Walk through all connected component blocks.
      let componentBlock = privateComponentsInput.connection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME) {
          privateComponentBlockIds += componentBlock.id;
        }
        // Move to the next block in the stack.
        componentBlock = componentBlock.getNextBlock();
      }
    }
    const eventsInput = this.getInput(INPUT_EVENTS);
    if (eventsInput && eventsInput.connection) {
      // Walk through all connected event blocks.
      let eventBlock = eventsInput.connection.targetBlock();
      while (eventBlock) {
        if (eventBlock.type === MRC_EVENT_NAME) {
          eventBlockIds += eventBlock.id;
        }
        // Move to the next block in the stack.
        eventBlock = eventBlock.getNextBlock();
      }
    }

    if (updateToolboxIfDescendantsChanged) {
      if (mechanismBlockIds !== this.mrcMechanismBlockIds ||
        componentBlockIds !== this.mrcComponentBlockIds ||
        privateComponentBlockIds !== this.mrcPrivateComponentBlockIds ||
        eventBlockIds !== this.mrcEventBlockIds) {
        editor.updateToolboxAfterDelay();
      }
    }

    this.mrcMechanismBlockIds = mechanismBlockIds;
    this.mrcComponentBlockIds = componentBlockIds;
    this.mrcPrivateComponentBlockIds = privateComponentBlockIds;
    this.mrcEventBlockIds = eventBlockIds;
  },
  /**
   * setNameOfChildBlock is called from mrc_mechanism, mrc_component, and mrc_event blocks when they
   * connect to this mrc_mechanism_component_holder block.
   */
  setNameOfChildBlock(this: MechanismComponentHolderBlock, child: Blockly.Block): void {
    const otherNames: string[] = []
    this.getDescendants(true)
      .filter(descendant =>
        descendant.type === MRC_MECHANISM_NAME ||
        descendant.type === MRC_COMPONENT_NAME ||
        descendant.type === MRC_EVENT_NAME)
      .filter(descendant => descendant.id !== child.id)
      .forEach(descendant => {
        otherNames.push(descendant.getFieldValue('NAME'));
      });
    const currentName = child.getFieldValue('NAME');
    // mechanism and component names must be valid python identifiers.
    // event names do not need to be valid python identifiers.
    const mustBeValidPythonIdentifier = (child.type === MRC_MECHANISM_NAME || child.type === MRC_COMPONENT_NAME);
    const legalName = makeLegalName(currentName, otherNames, mustBeValidPythonIdentifier);
    if (legalName !== currentName) {
      child.setFieldValue(legalName, 'NAME');
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

export const setup = function () {
  Blockly.Blocks[BLOCK_NAME] = MECHANISM_COMPONENT_HOLDER;
}

function pythonFromBlockInRobot(block: MechanismComponentHolderBlock, generator: ExtendedPythonGenerator) {
  let code = 'def defineHardware(self):\n';

  const mechanisms = generator.statementToCode(block, INPUT_MECHANISMS);
  const components = generator.statementToCode(block, INPUT_COMPONENTS);

  const body = mechanisms + components;
  if (body) {
    code += body;
  } else {
    code += generator.INDENT + 'pass\n';
  }

  generator.addClassMethodDefinition('defineHardware', code);
}

function pythonFromBlockInMechanism(block: MechanismComponentHolderBlock, generator: ExtendedPythonGenerator) {
  let code = 'def defineHardware(self';
  const mechanismInitArgNames: string[] = generator.getMechanismInitArgNames();
  if (mechanismInitArgNames.length) {
    code += ', ' + mechanismInitArgNames.join(', ');
  }
  code += '):\n';

  const components = generator.statementToCode(block, INPUT_COMPONENTS);
  const privateComponents = generator.statementToCode(block, INPUT_PRIVATE_COMPONENTS);

  const allComponents = components + privateComponents;
  if (allComponents) {
    code += allComponents;
    generator.addClassMethodDefinition('defineHardware', code);
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

/**
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
 * Collects the args for the mechanism's constructor and defineHardware method.
 */
export function getMechanismInitArgNames(workspace: Blockly.Workspace, mechanismInitArgNames: string[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const inputConnections: Blockly.Connection[] = [];
    const componentsInput = block.getInput(INPUT_COMPONENTS);
    if (componentsInput && componentsInput.connection) {
      inputConnections.push(componentsInput.connection);
    }
    const privateComponentsInput = block.getInput(INPUT_PRIVATE_COMPONENTS);
    if (privateComponentsInput && privateComponentsInput.connection) {
      inputConnections.push(privateComponentsInput.connection);
    }

    // Walk through all connected component blocks.
    inputConnections.forEach((inputConnection) => {
      let componentBlock = inputConnection.targetBlock();
      while (componentBlock) {
        if (componentBlock.type === MRC_COMPONENT_NAME && componentBlock.isEnabled()) {
          mechanismInitArgNames.push((componentBlock as ComponentBlock).getMechanismInitArgName());
        }
        // Move to the next block in the chain
        componentBlock = componentBlock.getNextBlock();
      }
    });
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

export function mrcDescendantsMayHaveChanged(workspace: Blockly.Workspace, editor: Editor): void {
  // Get the holder block and call its mrcDescendantsMayHaveChanged method.
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    (block as MechanismComponentHolderBlock).mrcDescendantsMayHaveChanged(editor);
  });
}

// This is called to add a mechanism block to the robot's workspace when a new mechanism is created
// since we aren't guaranteed that the robot has a live workspace at this time, we have to work in JSON.
export function mrcAddMechanismBlockToRobotContent(robotContent: storageModuleContent.ModuleContent,
  mechanism: storageModule.Mechanism): void {
  const blocks = robotContent.getBlocks();
  mrcAddMechanismBlockToRobotBlocks(blocks, mechanism);
  robotContent.setBlocks(blocks);
}

// Same as mrcAddMechanismBlockToRobotContent, but works directly on the JSON produced by
// Blockly.serialization.workspaces.save, which is what a live workspace can provide.
export function mrcAddMechanismBlockToRobotBlocks(blocks: {[key: string]: any},
  mechanism: storageModule.Mechanism): void {
  const mechanismBlock = createMechanismBlock(mechanism, [], false);

  // Build the plain JSON object for the new mechanism block (Blockly serialization format).
  const mechanismBlockJson: {[key: string]: unknown} = { type: mechanismBlock.type };
  if (mechanismBlock.extraState) {
    mechanismBlockJson['extraState'] = mechanismBlock.extraState;
  }
  if (mechanismBlock.fields) {
    mechanismBlockJson['fields'] = mechanismBlock.fields;
  }
  if (mechanismBlock.inputs) {
    mechanismBlockJson['inputs'] = mechanismBlock.inputs;
  }

  // Mutate the JSON blocks directly (no live workspace needed).
  const topBlocks: {[key: string]: any}[] = blocks?.blocks?.blocks ?? [];

  for (const block of topBlocks) {
    if (block.type !== BLOCK_NAME) {
      continue;
    }
    if (!block.inputs) {
      block.inputs = {};
    }
    if (!block.inputs[INPUT_MECHANISMS]) {
      block.inputs[INPUT_MECHANISMS] = { block: mechanismBlockJson };
    } else {
      // Walk to the last block in the chain and append.
      let lastBlock = block.inputs[INPUT_MECHANISMS].block;
      while (lastBlock.next?.block) {
        lastBlock = lastBlock.next.block;
      }
      lastBlock.next = { block: mechanismBlockJson };
    }
  }
}

/**
 * Adds an mrc_component block for the given component to the given mechanism's module content.
 * Since we aren't guaranteed that the mechanism has a live workspace at this time, the block is
 * added to a headless workspace. The headless workspace must be a mechanism workspace because an
 * mrc_component block only has input sockets for its constructor args when it is in the robot.
 *
 * Returns the component as it was actually added, since its name may have been changed to avoid
 * colliding with a name that is already used in the mechanism.
 */
export function mrcAddComponentBlockToMechanismContent(
  mechanismContent: storageModuleContent.ModuleContent,
  component: storageModuleContent.Component,
  importModule: string,
  tooltip: string): storageModuleContent.Component {
  const workspace = workspaces.createHeadlessWorkspace(storageModule.ModuleType.MECHANISM);
  try {
    Blockly.serialization.workspaces.load(mechanismContent.getBlocks(), workspace);

    const holderBlocks = workspace.getBlocksByType(BLOCK_NAME);
    if (!holderBlocks.length) {
      throw new Error('mrcAddComponentBlockToMechanismContent: the mechanism has no ' + BLOCK_NAME + ' block.');
    }
    const holder = holderBlocks[0] as MechanismComponentHolderBlock;
    const componentsInput = holder.getInput(INPUT_COMPONENTS);
    if (!componentsInput || !componentsInput.connection) {
      throw new Error('mrcAddComponentBlockToMechanismContent: the ' + BLOCK_NAME + ' block has no ' +
          INPUT_COMPONENTS + ' input.');
    }

    // Make sure the component's name doesn't collide with a name that the mechanism already uses.
    const otherNames: string[] = [];
    holder.getDescendants(true)
      .filter(descendant =>
        descendant.type === MRC_MECHANISM_NAME ||
        descendant.type === MRC_COMPONENT_NAME ||
        descendant.type === MRC_EVENT_NAME)
      .forEach(descendant => {
        otherNames.push(descendant.getFieldValue('NAME'));
      });
    const name = makeLegalName(component.name, otherNames, /* mustBeValidPythonIdentifier */ true);

    const newBlock = Blockly.serialization.blocks.append(
      {
        type: MRC_COMPONENT_NAME,
        extraState: {
          componentId: component.componentId,
          importModule: importModule,
          className: component.className,
          tooltip: tooltip,
          params: component.args.map(arg => ({
            name: arg.name,
            type: arg.type,
            defaultValue: arg.defaultValue ? arg.defaultValue : '',
          })),
        },
        fields: {
          [MRC_COMPONENT_FIELD_NAME]: name,
          [MRC_COMPONENT_FIELD_TYPE]: component.className,
        },
      },
      workspace);

    // Connect the new block at the end of the stack of component blocks.
    let lastConnection: Blockly.Connection = componentsInput.connection;
    let blockInStack = lastConnection.targetBlock();
    while (blockInStack) {
      if (!blockInStack.nextConnection) {
        throw new Error('mrcAddComponentBlockToMechanismContent: a block in the ' + INPUT_COMPONENTS +
            ' stack has no next connection.');
      }
      lastConnection = blockInStack.nextConnection;
      blockInStack = blockInStack.getNextBlock();
    }
    if (!newBlock.previousConnection) {
      throw new Error('mrcAddComponentBlockToMechanismContent: the new block has no previous connection.');
    }
    lastConnection.connect(newBlock.previousConnection);

    mechanismContent.setBlocks(Blockly.serialization.workspaces.save(workspace));
    const components: storageModuleContent.Component[] = [];
    getComponents(workspace, components);
    mechanismContent.setComponents(components);

    return {
      componentId: component.componentId,
      name: name,
      className: component.className,
      args: component.args,
    };
  } finally {
    workspaces.destroyHeadlessWorkspace(workspace);
  }
}
