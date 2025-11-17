/**
 * @license
 * Copyright 2025 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import * as storageModule from '../storage/module';
import { MRC_CATEGORY_STYLE_METHODS } from '../themes/styles';
import {
    CLASS_NAME_MECHANISM,
    CLASS_NAME_OPMODE,
    CLASS_NAME_ROBOT_BASE,
    MECHANISM_METHOD_NAMES_NOT_OVERRIDEABLE,
    OPMODE_METHOD_NAMES_NOT_OVERRIDEABLE,
    ROBOT_METHOD_NAMES_NOT_OVERRIDEABLE } from '../blocks/utils/python';
import { addInstanceWithinBlocks } from '../blocks/mrc_call_python_function';
import {
    createCustomMethodBlock,
    createCustomMethodBlockWithReturn,
    getBaseClassBlocks } from '../blocks/mrc_class_method_def';
import { createStepsBlock } from '../blocks/mrc_steps';
import { Editor } from '../editor/editor';


const CUSTOM_CATEGORY_METHODS = 'MRC_METHODS';

export function getCategory(editor: Editor): toolboxItems.Category {
  const blocklyWorkspace = editor.getBlocklyWorkspace();

  // If this category hasn't been register yet, do it now.
  if (!blocklyWorkspace.getToolboxCategoryCallback(CUSTOM_CATEGORY_METHODS)) {
    const category = new MethodsCategory();
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_METHODS, category.methodsFlyout.bind(category));
  }
  return {
    kind: 'category',
    categorystyle: MRC_CATEGORY_STYLE_METHODS,
    name: Blockly.Msg['MRC_CATEGORY_METHODS'],
    custom: CUSTOM_CATEGORY_METHODS,
  };
}

class MethodsCategory {
  public methodsFlyout(workspace: Blockly.WorkspaceSvg) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (!editor) {
      throw new Error('No editor for blockly workspace');
    }

    const contents: toolboxItems.ContentsType[] = [];

    // Add blocks for defining any methods that can be defined in the current
    // module. For example, if the current module is an OpMode, add blocks to
    // define the methods declared in the OpMode class.

    // Collect the method names that are already overridden in the blockly workspace.
    const methodNamesAlreadyOverridden = editor.getMethodNamesAlreadyOverriddenInWorkspace();

    switch (editor.getModuleType()) {
      case storageModule.ModuleType.ROBOT:
        // Add the methods for a Robot.
        this.addBaseClassBlocksForCurrentModule(
            workspace, Blockly.Msg['MORE_ROBOT_METHODS_LABEL'], CLASS_NAME_ROBOT_BASE,
            ROBOT_METHOD_NAMES_NOT_OVERRIDEABLE, methodNamesAlreadyOverridden, contents);
        break;
      case storageModule.ModuleType.MECHANISM:
        // Add the methods for a Mechanism.
        this.addBaseClassBlocksForCurrentModule(
            workspace, Blockly.Msg['MORE_MECHANISM_METHODS_LABEL'], CLASS_NAME_MECHANISM,
            MECHANISM_METHOD_NAMES_NOT_OVERRIDEABLE, methodNamesAlreadyOverridden, contents);
        break;
      case storageModule.ModuleType.OPMODE:
        const hasSteps = editor.isStepsInWorkspace();
        if (!hasSteps) {
          contents.push(createStepsBlock());
        }
        // Add the methods for an OpMode.
        this.addBaseClassBlocksForCurrentModule(
            workspace, Blockly.Msg['MORE_OPMODE_METHODS_LABEL'], CLASS_NAME_OPMODE,
            OPMODE_METHOD_NAMES_NOT_OVERRIDEABLE, methodNamesAlreadyOverridden, contents);
        break;
    }

    // Add a block that lets the user define a new method.
    contents.push(
        new toolboxItems.Label(Blockly.Msg['CUSTOM_METHODS_LABEL']),
        createCustomMethodBlock(),
        createCustomMethodBlockWithReturn());

    // Get blocks for calling methods defined in the current workspace.
    const methodsFromWorkspace = editor.getMethodsForWithinFromWorkspace();
    addInstanceWithinBlocks(methodsFromWorkspace, contents);

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }

  private addBaseClassBlocksForCurrentModule(
      workspace: Blockly.WorkspaceSvg, label: string, baseClassName: string,
      methodNamesNotOverrideable: string[], methodNamesAlreadyOverridden: string[],
      contents: toolboxItems.ContentsType[]) {
    const baseClassBlocks: toolboxItems.ContentsType[] = getBaseClassBlocks(
        workspace, baseClassName, methodNamesNotOverrideable, methodNamesAlreadyOverridden);
    if (baseClassBlocks.length) {
      contents.push(
          new toolboxItems.Label(label),
          ...baseClassBlocks);
    }
  }
}
