/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Lets an mrc_component block ask the react layer to open the dialog for moving
 * the component into a mechanism. The block cannot call the react layer (or the code that
 * performs the move) directly without creating an import cycle, so the react layer registers a
 * handler here for each robot workspace it creates.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

/**
 * A handler that opens the move-component-to-mechanism dialog for the given component block.
 */
export type MoveComponentHandler = (componentBlock: Blockly.Block) => void;

const workspaceIdToHandler: {[workspaceId: string]: MoveComponentHandler} = {};

export function registerMoveComponentHandler(
    workspaceId: string, handler: MoveComponentHandler): void {
  workspaceIdToHandler[workspaceId] = handler;
}

export function unregisterMoveComponentHandler(workspaceId: string): void {
  if (workspaceId in workspaceIdToHandler) {
    delete workspaceIdToHandler[workspaceId];
  }
}

export function getMoveComponentHandler(
    workspace: Blockly.Workspace): MoveComponentHandler | null {
  if (workspace.id in workspaceIdToHandler) {
    return workspaceIdToHandler[workspace.id];
  }
  return null;
}
