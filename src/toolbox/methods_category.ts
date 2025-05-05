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
import { MRC_CATEGORY_STYLE_METHODS } from '../themes/styles'
import { mechanism_class_blocks } from './mechanism_class_methods';
import { opmode_class_blocks } from './opmode_class_methods';
import { robot_class_blocks } from './robot_class_methods';
import { ClassMethodDefBlock } from '../blocks/mrc_class_method_def'


const CUSTOM_CATEGORY_METHODS = 'METHODS';

export const category = {
  kind: 'category',
  categorystyle: MRC_CATEGORY_STYLE_METHODS,
  name: 'Methods',
  custom: CUSTOM_CATEGORY_METHODS,
};

export class MethodsCategory {
  private currentModule: commonStorage.Module | null = null;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_METHODS, this.methodsFlyout.bind(this));
  }

  public setCurrentModule(currentModule: commonStorage.Module | null) {
    this.currentModule = currentModule;
  }

  public methodsFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    // Add blocks for defining any methods that can be defined in the current
    // module. For example, if the current module is an OpMode, add blocks to
    // define the methods declared in the OpMode class.
    if (this.currentModule) {
      // Collect the method names for mrc_class_method_def blocks that are
      // already in the blockly workspace.
      const methodNamesAlreadyUsed: string[] = [];
      workspace.getBlocksByType('mrc_class_method_def', false).forEach((block) => {
        const classMethodDefBlock = block as ClassMethodDefBlock;
        if (!classMethodDefBlock.mrcCanChangeSignature) {
          methodNamesAlreadyUsed.push(classMethodDefBlock.getFieldValue('NAME'));
        }
      });
    
      if (this.currentModule.moduleType == commonStorage.MODULE_TYPE_PROJECT) {
        // Add the methods for a Project (Robot).
        this.addClassBlocksForCurrentModule(
            'More Robot Methods', robot_class_blocks,
            methodNamesAlreadyUsed, contents);
      } else if (this.currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        // Add the methods for a Mechanism.
        this.addClassBlocksForCurrentModule(
            'More Mechanism Methods', mechanism_class_blocks,
            methodNamesAlreadyUsed, contents);
      } else if (this.currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        // Add the methods for an OpMode.
        this.addClassBlocksForCurrentModule(
            'More OpMode Methods', opmode_class_blocks,
            methodNamesAlreadyUsed, contents);
      }
    }

    // Add a block that lets the user define a new method.
    contents.push(
      {
        kind: 'block',
        type: 'mrc_mechanism_container_holder',
      },
      {
        kind: 'label',
        text: 'Custom Methods',
      },
      {
        kind: 'block',
        type: 'mrc_class_method_def',
        fields: {NAME: "my_method"},
        extraState: {
          canChangeSignature: true,
          canBeCalledWithinClass: true,
          canBeCalledOutsideClass: true,
          canDelete: true,
          returnType: 'None',
          params: [],
        },
      });

    // For each mrc_class_method_def block in the blockly workspace, check if it
    // can be called from within the class, and if so, add a
    // mrc_call_python_function block.
    workspace.getBlocksByType('mrc_class_method_def', false).forEach((block) => {
      const classMethodDefBlock = block as ClassMethodDefBlock;
      if (classMethodDefBlock.mrcCanBeCalledWithinClass) {
        const callPythonFunctionBlock: toolboxItems.Block = {
          kind: 'block',
          type: 'mrc_call_python_function',
          extraState: {
            functionKind: 'instance_within',
            returnType: classMethodDefBlock.mrcReturnType,
            args: [],
            importModule: '',
          },
          fields: {
            FUNC: classMethodDefBlock.getFieldValue('NAME'),
          },
        };
        classMethodDefBlock.mrcParameters.forEach((param) => {
          if (callPythonFunctionBlock.extraState) {
            callPythonFunctionBlock.extraState.args.push(
              {
                name: param.name,
                type: param.type ?? '',
              });
            }
          });
        contents.push(callPythonFunctionBlock);
      }
    });

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }

  private addClassBlocksForCurrentModule(
      label: string, class_blocks: toolboxItems.Block[],
      methodNamesAlreadyUsed: string[], contents: toolboxItems.ContentsType[]) {
    let labelAdded = false;
    class_blocks.forEach((blockInfo) => {
      if (blockInfo.fields) {
        const methodName = blockInfo.fields['NAME'];
        if (!methodNamesAlreadyUsed.includes(methodName)) {
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
    });
  }
}
