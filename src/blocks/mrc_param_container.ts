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
 * @fileoverview Mutator for method and event parameters.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import * as ChangeFramework from './utils/change_framework'
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';
import { getLegalName } from './utils/python';

export const PARAM_CONTAINER_BLOCK_NAME = 'mrc_param_container';
const PARAM_ITEM_BLOCK_NAME = 'mrc_param_item';

export const setup = function () {
  Blockly.Blocks[PARAM_CONTAINER_BLOCK_NAME] = PARAM_CONTAINER;
  Blockly.Blocks[PARAM_ITEM_BLOCK_NAME] = PARAM_ITEM;
};

// The parameter container block.

const INPUT_STACK = 'STACK';

export type ParamContainerBlock = ParamContainerMixin & Blockly.BlockSvg;
interface ParamContainerMixin extends ParamContainerMixinType {}
type ParamContainerMixinType = typeof PARAM_CONTAINER;

const PARAM_CONTAINER = {
  init: function (this: ParamContainerBlock) {
    this.appendDummyInput().appendField(Blockly.Msg.PARAMETERS);
    this.appendStatementInput(INPUT_STACK);
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.contextMenu = false;
  },
  getParamItemBlocks: function (this: ParamContainerBlock): ParamItemBlock[] {
    const paramItemBlocks: ParamItemBlock[] = [];
    let block = this.getInputTargetBlock(INPUT_STACK);
    while (block && !block.isInsertionMarker()) {
      if (block.type !== PARAM_ITEM_BLOCK_NAME) {
       throw new Error('getItemNames: block.type should be ' + PARAM_ITEM_BLOCK_NAME);
      }
      paramItemBlocks.push(block as ParamItemBlock);
      block = block.nextConnection && block.nextConnection.targetBlock();
    }
    return paramItemBlocks;
  },
};

// The parameter item block.

const FIELD_NAME = 'NAME';

export type ParamItemBlock = ParamItemMixin & Blockly.BlockSvg;
interface ParamItemMixin extends ParamItemMixinType {
  originalName: string,
}

type ParamItemMixinType = typeof PARAM_ITEM;

const PARAM_ITEM = {
  init: function (this: ParamItemBlock) {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(''), FIELD_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.originalName = '';
    this.contextMenu = false;
    ChangeFramework.registerCallback(PARAM_ITEM_BLOCK_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
  },
  onBlockChanged: function (block: Blockly.BlockSvg, blockEvent: Blockly.Events.BlockBase) {
    if (blockEvent.type == Blockly.Events.BLOCK_MOVE) {
      const blockMoveEvent = blockEvent as Blockly.Events.BlockMove;
      if (blockMoveEvent.reason?.includes('connect')) {
        (block as ParamItemBlock).makeNameLegal();
      }
    } else {
      if (blockEvent.type == Blockly.Events.BLOCK_CHANGE) {
        (block as ParamItemBlock).makeNameLegal();
      }
    }
  },
  makeNameLegal: function (this: ParamItemBlock): void {
    const rootBlock: Blockly.Block | null = this.getRootBlock();
    if (rootBlock) {
      const otherNames: string[] = []
      rootBlock!.getDescendants(true)?.forEach(itemBlock => {
        if (itemBlock != this) {
          otherNames.push(itemBlock.getFieldValue(FIELD_NAME));
        }
      });
      const currentName = this.getFieldValue(FIELD_NAME);
      this.setFieldValue(getLegalName(currentName, otherNames), FIELD_NAME);
      updateMutatorFlyout(this.workspace);
    }
  },
  getName: function (this: ParamItemBlock): string {
    return this.getFieldValue(FIELD_NAME);
  },
  getOriginalName: function (this: ParamItemBlock): string {
    return this.originalName;
  },
  setOriginalName: function (this: ParamItemBlock, originalName: string): void {
    this.originalName = originalName;
  },
}

/**
 * Updates the mutator's flyout so that it contains a single param item block
 * whose name is not a duplicate of an existing param item.
 *
 * @param workspace The mutator's workspace. This workspace's flyout is what is being updated.
 */
function updateMutatorFlyout(workspace: Blockly.WorkspaceSvg) {
  const usedNames: string[] = [];
  workspace.getBlocksByType(PARAM_ITEM_BLOCK_NAME, false).forEach(block => {
    usedNames.push(block.getFieldValue(FIELD_NAME));
  });
  const uniqueName = Blockly.Variables.generateUniqueNameFromOptions(
      Blockly.Procedures.DEFAULT_ARG, usedNames);
  const jsonBlock = {
    kind: 'block',
    type: PARAM_ITEM_BLOCK_NAME,
    fields: {
      NAME: uniqueName,
    },
  };

  workspace.updateToolbox({ contents: [jsonBlock] });
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
  ChangeFramework.setup(mutatorWorkspace);
}

/**
 * Returns the MutatorIcon for the given block.
 */
export function getMutatorIcon(block: Blockly.BlockSvg): Blockly.icons.MutatorIcon {
  return new Blockly.icons.MutatorIcon([PARAM_ITEM_BLOCK_NAME], block);
}

export function createMutatorBlocks(workspace: Blockly.Workspace, parameterNames: string[]): Blockly.BlockSvg {
  // First create the container block.
  const containerBlock = workspace.newBlock(PARAM_CONTAINER_BLOCK_NAME) as Blockly.BlockSvg;
  containerBlock.initSvg();

  // Then add one param item block for each parameter.
  let connection = containerBlock!.getInput(INPUT_STACK)!.connection;
  for (const parameterName of parameterNames) {
    const itemBlock = workspace.newBlock(PARAM_ITEM_BLOCK_NAME) as ParamItemBlock;
    itemBlock.initSvg();
    itemBlock.setFieldValue(parameterName, FIELD_NAME);
    itemBlock.originalName = parameterName;
    connection!.connect(itemBlock.previousConnection!);
    connection = itemBlock.nextConnection;
  }
  return containerBlock;
}
