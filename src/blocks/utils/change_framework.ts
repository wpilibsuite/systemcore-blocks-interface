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
 * @fileoverview Allow registering for specific callbacks
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

// The purpose of this is to allow blocks to register for changes only of their type and the events they care about
// warning - only one change listener per block type is allowed.   a second one will overwrite it.

type CallbackFunctionBlockType = (block: Blockly.BlockSvg, blockEvent : Blockly.Events.BlockBase) => void;

let registeredCallbacks = new Map<string, [string[], CallbackFunctionBlockType]>;

let blockEvents = [Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_DELETE, Blockly.Events.BLOCK_MOVE];

export function registerCallback(blockType : string, blockEvents : string[], func : CallbackFunctionBlockType){
    registeredCallbacks.set(blockType, [blockEvents, func]);
}

export function getParentOfType(block : Blockly.Block | null, type : string) : Blockly.Block | null{
    let parentBlock = block?.getParent(); 
    while(parentBlock){
        if (parentBlock.type == type){
            return parentBlock;
        }
        parentBlock = parentBlock.getParent();
    }
    return null
}

function changeListener(e: Blockly.Events.Abstract){
    if (blockEvents.includes(e.type as any)){
        let eventBlockBase = (e as Blockly.Events.BlockBase);
        let workspace = Blockly.Workspace.getById(eventBlockBase.workspaceId!)
        let block = (workspace?.getBlockById(eventBlockBase.blockId!)! as Blockly.BlockSvg)
        if (!block){
            return;
        }
        let callbackInfo = registeredCallbacks.get(block.type);
        if (!callbackInfo){
            return;
        }
        if (callbackInfo[0].includes(e.type)){
            callbackInfo[1](block, eventBlockBase);
        }            
    }
}

export const setup = function (workspace: Blockly.Workspace) {
    workspace.addChangeListener(changeListener);
}
