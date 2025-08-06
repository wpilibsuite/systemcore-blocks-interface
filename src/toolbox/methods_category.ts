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
import * as commonStorage from '../storage/common_storage';
import { MRC_CATEGORY_STYLE_METHODS } from '../themes/styles';
import { CLASS_NAME_ROBOT_BASE, CLASS_NAME_OPMODE, CLASS_NAME_MECHANISM } from '../blocks/utils/python';
import { addInstanceWithinBlocks } from '../blocks/mrc_call_python_function';
import { createCustomMethodBlock, getBaseClassBlocks, FIELD_METHOD_NAME } from '../blocks/mrc_class_method_def';
import { Editor } from '../editor/editor';


const CUSTOM_CATEGORY_METHODS = 'METHODS';

export const getCategory = () => ({
  kind: 'category',
  categorystyle: MRC_CATEGORY_STYLE_METHODS,
  name: Blockly.Msg['MRC_CATEGORY_METHODS'],
  custom: CUSTOM_CATEGORY_METHODS,
});

export class MethodsCategory {
  private robotClassBlocks = getBaseClassBlocks(CLASS_NAME_ROBOT_BASE);
  private mechanismClassBlocks = getBaseClassBlocks(CLASS_NAME_MECHANISM);
  private opmodeClassBlocks = getBaseClassBlocks(CLASS_NAME_OPMODE);

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_METHODS, this.methodsFlyout.bind(this));
  }

  public methodsFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    // Add blocks for defining any methods that can be defined in the current
    // module. For example, if the current module is an OpMode, add blocks to
    // define the methods declared in the OpMode class.

    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor) {
      // Collect the method names that are already overridden in the blockly workspace.
      const methodNamesAlreadyOverridden = editor.getMethodNamesAlreadyOverriddenInWorkspace();

      switch (editor.getCurrentModuleType()) {
        case commonStorage.MODULE_TYPE_ROBOT:
          // TODO(lizlooney): We need a way to mark a method in python as not overridable.
          // For example, in RobotBase, define_hardware, register_event_handler,
          // unregister_event_handler, and fire_event should not be overridden in a user's robot.
          const methodNamesNotOverrideable: string[] = [
            'define_hardware',
            'fire_event',
            'register_event_handler',
            'unregister_event_handler',
          ];
          // Add the methods for a Robot.
          this.addClassBlocksForCurrentModule(
              'More Robot Methods', this.robotClassBlocks, methodNamesNotOverrideable,
              methodNamesAlreadyOverridden, contents);
          break;
        case commonStorage.MODULE_TYPE_MECHANISM:
          // Add the methods for a Mechanism.
          this.addClassBlocksForCurrentModule(
              'More Mechanism Methods', this.mechanismClassBlocks, [],
              methodNamesAlreadyOverridden, contents);
          break;
        case commonStorage.MODULE_TYPE_OPMODE:
          // Add the methods for an OpMode.
          this.addClassBlocksForCurrentModule(
              'More OpMode Methods', this.opmodeClassBlocks, [],
              methodNamesAlreadyOverridden, contents);
          break;
      }
    }

    // Add a block that lets the user define a new method.
    contents.push(
      {
        kind: 'label',
        text: 'Custom Methods',
      },
      createCustomMethodBlock(),
    );

    // Get blocks for calling methods defined in the current workspace.
    if (editor) {
      const methodsFromWorkspace = editor.getMethodsForWithinFromWorkspace();
      addInstanceWithinBlocks(methodsFromWorkspace, contents);
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }

  private addClassBlocksForCurrentModule(
      label: string, classBlocks: toolboxItems.Block[],
      methodNamesNotOverrideable: string[],
      methodNamesAlreadyOverridden: string[], contents: toolboxItems.ContentsType[]) {
    let labelAdded = false;
    for (const blockInfo of classBlocks) {
      if (blockInfo.fields) {
        const methodName = blockInfo.fields[FIELD_METHOD_NAME];
        if (methodNamesNotOverrideable.includes(methodName)) {
          continue;
        }
        if (methodNamesAlreadyOverridden.includes(methodName)) {
          continue;
        }
        if (!labelAdded) {
          contents.push(
            {
              kind: 'label',
              text: label,
            },
          );
          labelAdded = true;
        }
        contents.push(blockInfo);
      }
    }
  }
}
