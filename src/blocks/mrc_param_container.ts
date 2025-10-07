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
import { BLOCK_NAME as MRC_CLASS_METHOD_DEF } from './mrc_class_method_def';
import { BLOCK_NAME as MRC_EVENT } from './mrc_event';

export const MUTATOR_BLOCK_NAME = 'methods_mutatorarg';
export const PARAM_CONTAINER_BLOCK_NAME = 'method_param_container';
import { getLegalName } from './utils/python';

export const setup = function () {
  Blockly.Blocks[MUTATOR_BLOCK_NAME] = METHODS_MUTATORARG;
  Blockly.Blocks[PARAM_CONTAINER_BLOCK_NAME] = METHOD_PARAM_CONTAINER;
};

const METHOD_PARAM_CONTAINER = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput("TITLE").appendField('Parameters');
    this.appendStatementInput('STACK');
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.contextMenu = false;
  },
};

export type MethodMutatorArgBlock = Blockly.Block & MethodMutatorArgMixin & Blockly.BlockSvg;
interface MethodMutatorArgMixin extends MethodMutatorArgMixinType {
  originalName: string,
}

type MethodMutatorArgMixinType = typeof METHODS_MUTATORARG;

function setName(block: Blockly.BlockSvg) {
  const parentBlock = ChangeFramework.getParentOfType(block, PARAM_CONTAINER_BLOCK_NAME);
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
    updateMutatorFlyout(block.workspace);
  }
}

const METHODS_MUTATORARG = {
  init: function (this: MethodMutatorArgBlock) {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(Blockly.Procedures.DEFAULT_ARG), 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setStyle(MRC_STYLE_CLASS_BLOCKS);
    this.originalName = '';
    this.contextMenu = false;
    ChangeFramework.registerCallback(MUTATOR_BLOCK_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
  },
  onBlockChanged: function (block: Blockly.BlockSvg, blockEvent: Blockly.Events.BlockBase) {
    if (blockEvent.type == Blockly.Events.BLOCK_MOVE) {
      const blockMoveEvent = blockEvent as Blockly.Events.BlockMove;
      if (blockMoveEvent.reason?.includes('connect')) {
        setName(block);
      }
    } else {
      if (blockEvent.type == Blockly.Events.BLOCK_CHANGE) {
        setName(block);
      }
    }
  },
}


/**
 * Updates the procedure mutator's flyout so that the arg block is not a
 * duplicate of another arg.
 *
 * @param workspace The procedure mutator's workspace. This workspace's flyout
 *     is what is being updated.
 */
function updateMutatorFlyout(workspace: Blockly.WorkspaceSvg) {
  const usedNames = [];
  const blocks = workspace.getBlocksByType(MUTATOR_BLOCK_NAME, false);
  for (let i = 0, block; (block = blocks[i]); i++) {
    usedNames.push(block.getFieldValue('NAME'));
  }
  const argValue = Blockly.Variables.generateUniqueNameFromOptions(
      Blockly.Procedures.DEFAULT_ARG,
      usedNames);
  const jsonBlock = {
    kind: 'block',
    type: MUTATOR_BLOCK_NAME,
    fields: {
      NAME: argValue,
    },
  };

  workspace.updateToolbox({ contents: [jsonBlock] });
}

/**
 * Listens for when a procedure mutator is opened. Then it triggers a flyout
 * update and adds a mutator change listener to the mutator workspace.
 *
 * @param e The event that triggered this listener.
 * @internal
 */
export function mutatorOpenListener(e: Blockly.Events.Abstract) {
  if (e.type != Blockly.Events.BUBBLE_OPEN) {
    return;
  }
  const bubbleEvent = e as Blockly.Events.BubbleOpen;
  if (!(bubbleEvent.bubbleType === 'mutator' && bubbleEvent.isOpen) ||
      !bubbleEvent.blockId) {
    return;
  }
  const workspaceId = bubbleEvent.workspaceId;
  const block = Blockly.common
      .getWorkspaceById(workspaceId)!
      .getBlockById(bubbleEvent.blockId) as Blockly.BlockSvg;

  if (block.type !== MRC_EVENT && block.type !== MRC_CLASS_METHOD_DEF) {
    return;
  }
  const mutatorIcon = block.getIcon(Blockly.icons.MutatorIcon.TYPE) as Blockly.icons.MutatorIcon;
  const workspace = mutatorIcon.getWorkspace()!;

  updateMutatorFlyout(workspace);
  ChangeFramework.setup(workspace);
}
