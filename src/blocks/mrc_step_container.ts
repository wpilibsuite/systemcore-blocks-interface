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
 * @fileoverview Mutator for steps.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';

export const STEP_CONTAINER_BLOCK_NAME = 'mrc_step_container';
const STEP_ITEM_BLOCK_NAME = 'mrc_step_item';

export const setup = function () {
  Blockly.Blocks[STEP_CONTAINER_BLOCK_NAME] = STEP_CONTAINER;
  Blockly.Blocks[STEP_ITEM_BLOCK_NAME] = STEP_ITEM;
};

// The step container block.

const INPUT_STACK = 'STACK';

export type StepContainerBlock = StepContainerMixin & Blockly.BlockSvg;
interface StepContainerMixin extends StepContainerMixinType {}
type StepContainerMixinType = typeof STEP_CONTAINER;

const STEP_CONTAINER = {
  init: function (this: StepContainerBlock) {
    this.appendDummyInput().appendField(Blockly.Msg.STEPS);
    this.appendStatementInput(INPUT_STACK);
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.contextMenu = false;
  },
  getStepItemBlocks: function (this: StepContainerBlock): StepItemBlock[] {
    const stepItemBlocks: StepItemBlock[] = [];
    let block = this.getInputTargetBlock(INPUT_STACK);
    while (block && !block.isInsertionMarker()) {
      if (block.type !== STEP_ITEM_BLOCK_NAME) {
       throw new Error('getItemNames: block.type should be ' + STEP_ITEM_BLOCK_NAME);
      }
      stepItemBlocks.push(block as StepItemBlock);
      block = block.nextConnection && block.nextConnection.targetBlock();
    }
    return stepItemBlocks;
  },
};

// The step item block.

const FIELD_NAME = 'NAME';

export type StepItemBlock = StepItemMixin & Blockly.BlockSvg;
interface StepItemMixin extends StepItemMixinType {
  originalName: string,
}

type StepItemMixinType = typeof STEP_ITEM;

const STEP_ITEM = {
  init: function (this: StepItemBlock) {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(''), FIELD_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.originalName = '';
    this.contextMenu = false;
  },
  makeNameLegal: function (this: StepItemBlock): void {
    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock) {
      const otherNames: string[] = []
      rootBlock!.getDescendants(true)?.forEach(itemBlock => {
        if (itemBlock != this) {
          otherNames.push(itemBlock.getFieldValue(FIELD_NAME));
        }
      });
      let currentName = this.getFieldValue(FIELD_NAME);
      while (otherNames.includes(currentName)) {
        // Check if currentName ends with a number
        const match = currentName.match(/^(.*?)(\d+)$/);
        if (match) {
          // If it ends with a number, increment it
          const baseName = match[1];
          const number = parseInt(match[2], 10);
          currentName = baseName + (number + 1);
        } else {
          // If it doesn't end with a number, append 2
          currentName = currentName + '2';
        }
      }
      this.setFieldValue(currentName, FIELD_NAME);
      updateMutatorFlyout(this.workspace);
    }
  },
  getName: function (this: StepItemBlock): string {
    return this.getFieldValue(FIELD_NAME);
  },
  getOriginalName: function (this: StepItemBlock): string {
    return this.originalName;
  },
  setOriginalName: function (this: StepItemBlock, originalName: string): void {
    this.originalName = originalName;
  },
}

/**
 * Updates the mutator's flyout so that it contains a single step item block
 * whose name is not a duplicate of an existing step item.
 *
 * @param workspace The mutator's workspace. This workspace's flyout is what is being updated.
 */
function updateMutatorFlyout(workspace: Blockly.WorkspaceSvg) {
  const usedNames: string[] = [];
  workspace.getBlocksByType(STEP_ITEM_BLOCK_NAME, false).forEach(block => {
    usedNames.push(block.getFieldValue(FIELD_NAME));
  });
  
  // Find the first unused number starting from 0
  let counter = 0;
  let uniqueName = counter.toString();
  while (usedNames.includes(uniqueName)) {
    counter++;
    uniqueName = counter.toString();
  }
  
  const jsonBlock = {
    kind: 'block',
    type: STEP_ITEM_BLOCK_NAME,
    fields: {
      NAME: uniqueName,
    },
  };

  workspace.updateToolbox({ contents: [jsonBlock] });
}

/**
 * The blockly event listener function for the mutator's workspace.
 */
function onChange(mutatorWorkspace: Blockly.Workspace, event: Blockly.Events.Abstract) {
  if (event.type === Blockly.Events.BLOCK_MOVE) {
    const blockMoveEvent = event as Blockly.Events.BlockMove;
    const reason: string[] = blockMoveEvent.reason ?? [];
    if (reason.includes('connect') && blockMoveEvent.blockId) {
      const block = mutatorWorkspace.getBlockById(blockMoveEvent.blockId);
      if (block && block.type === STEP_ITEM_BLOCK_NAME) {
        (block as StepItemBlock).makeNameLegal();
      }
    }
  } else if (event.type === Blockly.Events.BLOCK_CHANGE) {
    const blockChangeEvent = event as Blockly.Events.BlockChange;
    if (blockChangeEvent.blockId) {
      const block = mutatorWorkspace.getBlockById(blockChangeEvent.blockId);
      if (block && block.type === STEP_ITEM_BLOCK_NAME) {
        (block as StepItemBlock).makeNameLegal();
      }
    }
  }
}

/**
 * Called for mrc_event and mrc_class_method_def blocks when their mutator opesn.
 * Triggers a flyout update and adds an event listener to the mutator workspace.
 *
 * @param block The block whose mutator is open.
 */
export function onMutatorOpen(block: Blockly.BlockSvg) {
  const mutatorIcon = block.getIcon(Blockly.icons.MutatorIcon.TYPE) as Blockly.icons.MutatorIcon;
  const mutatorWorkspace = mutatorIcon.getWorkspace()!;
  updateMutatorFlyout(mutatorWorkspace);
  mutatorWorkspace.addChangeListener(event => onChange(mutatorWorkspace, event));
}

/**
 * Returns the MutatorIcon for the given block.
 */
export function getMutatorIcon(block: Blockly.BlockSvg): Blockly.icons.MutatorIcon {
  return new Blockly.icons.MutatorIcon([STEP_ITEM_BLOCK_NAME], block);
}

export function createMutatorBlocks(workspace: Blockly.Workspace, stepNames: string[]): Blockly.BlockSvg {
  // First create the container block.
  const containerBlock = workspace.newBlock(STEP_CONTAINER_BLOCK_NAME) as Blockly.BlockSvg;
  containerBlock.initSvg();

  // Then add one step item block for each step.
  let connection = containerBlock!.getInput(INPUT_STACK)!.connection;
  for (const stepName of stepNames) {
    const itemBlock = workspace.newBlock(STEP_ITEM_BLOCK_NAME) as StepItemBlock;
    itemBlock.initSvg();
    itemBlock.setFieldValue(stepName, FIELD_NAME);
    itemBlock.originalName = stepName;
    connection!.connect(itemBlock.previousConnection!);
    connection = itemBlock.nextConnection;
  }
  return containerBlock;
}
