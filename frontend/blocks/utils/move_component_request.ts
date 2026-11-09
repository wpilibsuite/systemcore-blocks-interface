// Copyright (c) FIRST and other WPILib contributors.

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
