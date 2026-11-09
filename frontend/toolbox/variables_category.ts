// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import { Editor } from '../editor/editor';

const CUSTOM_CATEGORY_VARIABLES = 'MRC_VARIABLES';
const CREATE_VARIABLE_CALLBACK_KEY = 'CREATE_VARIABLE';

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
    ...Blockly.Variables.jsonFlyoutCategoryBlocks(
        workspace, workspace.getVariableMap().getAllVariables(), /*includeChangeBlocks=*/ false),
  ];
}
