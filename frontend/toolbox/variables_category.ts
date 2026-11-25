// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import { Editor } from '../editor/editor';

const CUSTOM_CATEGORY_VARIABLES = 'MRC_VARIABLES';
const CREATE_VARIABLE_CALLBACK_KEY = 'CREATE_VARIABLE';
/**
 * The key of the callback for the button that deletes unused variables. TabContent registers it,
 * since the button opens a dialog.
 */
export const DELETE_UNUSED_VARIABLES_CALLBACK_KEY = 'DELETE_UNUSED_VARIABLES';

// Blockly's built-in variables category only shows untyped variables. Variables get their type
// from the values assigned to them, so this category shows the variables of all types.
export function getCategory(editor: Editor): toolboxItems.Category {
  const blocklyWorkspace = editor.getBlocklyWorkspace();

  // If this category hasn't been registered yet, do it now.
  if (!blocklyWorkspace.getToolboxCategoryCallback(CUSTOM_CATEGORY_VARIABLES)) {
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_VARIABLES, variablesFlyout);
    blocklyWorkspace.registerButtonCallback(CREATE_VARIABLE_CALLBACK_KEY, button => {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
    });
  }
  return {
    kind: 'category',
    categorystyle: 'variable_category',
    name: Blockly.Msg['MRC_CATEGORY_VARIABLES'],
    custom: CUSTOM_CATEGORY_VARIABLES,
  };
}

function variablesFlyout(workspace: Blockly.WorkspaceSvg): Blockly.utils.toolbox.FlyoutDefinition {
  return [
    new toolboxItems.Button(Blockly.Msg['NEW_VARIABLE'], CREATE_VARIABLE_CALLBACK_KEY),
    new toolboxItems.Button(
        Blockly.Msg['DELETE_UNUSED_VARIABLES'], DELETE_UNUSED_VARIABLES_CALLBACK_KEY),
    ...Blockly.Variables.jsonFlyoutCategoryBlocks(
        workspace, workspace.getVariableMap().getAllVariables(), /*includeChangeBlocks=*/ false),
  ];
}

/** Returns the variables that no block in the workspace uses, sorted by name. */
export function getUnusedVariables(
    workspace: Blockly.Workspace): Blockly.IVariableModel<Blockly.IVariableState>[] {
  return workspace.getVariableMap().getAllVariables()
      .filter(variable => isUnused(workspace, variable.getId()))
      .sort((a, b) => a.getName().localeCompare(b.getName()));
}

/**
 * Deletes the variables with the given ids, as one change that can be undone. A variable that
 * has been used since the list of unused variables was made is kept.
 */
export function deleteUnusedVariables(workspace: Blockly.Workspace, variableIds: string[]) {
  const variableMap = workspace.getVariableMap();
  Blockly.Events.setGroup(true);
  try {
    for (const id of variableIds) {
      const variable = variableMap.getVariableById(id);
      if (variable && isUnused(workspace, id)) {
        variableMap.deleteVariable(variable);
      }
    }
  } finally {
    Blockly.Events.setGroup(false);
  }
}

function isUnused(workspace: Blockly.Workspace, variableId: string): boolean {
  return Blockly.Variables.getVariableUsesById(workspace, variableId).length === 0;
}
