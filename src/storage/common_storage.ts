/**
 * @license
 * Copyright 2024 Google LLC
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

import {Block} from "../toolbox/items";
import startingOpModeBlocks from '../modules/opmode_start.json'; 

import {extendedPythonGenerator} from '../editor/extended_python_generator';

// Types, constants, and functions related to modules, regardless of where the modules are stored.

export type Module = {
  modulePath: string,
  moduleType: string,
  workspaceName: string,
  moduleName: string,
  dateModifiedMillis: number,
};

export type OpMode = Module;
export type Mechanism = Module;

export type Workspace = Module & {
  opModes: OpMode[],
  mechanisms: Mechanism[]
};

export const MODULE_TYPE_WORKSPACE = 'workspace';
export const MODULE_TYPE_OPMODE = 'opmode';
export const MODULE_TYPE_MECHANISM = 'mechanism';

export const MODULE_NAME_PLACEHOLDER = '%module_name%';

/**
 * Returns the module with the given module path, or null if it is not found.
 */
export function findModule(modules: Workspace[], modulePath: string): Module | null {
  for (const workspace of modules) {
    if (workspace.modulePath === modulePath) {
      return workspace;
    }
    for (const opMode of workspace.opModes) {
      if (opMode.modulePath === modulePath) {
        return opMode;
      }
    }
  }

  return null;
}

/**
 * Returns true if the given name is a valid python module name.
 */
export function isValidPythonModuleName(name: string): boolean {
  if (name) {
    return /^[a-z_][a-z0-9_]*$/.test(name);
  }
  return false;
}

/**
 * Returns the module path for the given workspace and module names.
 */
export function makeModulePath(workspaceName: string, moduleName: string): string {
  return workspaceName + '/' + moduleName + '.py';
}

/**
 * Returns the workspace path for the given workspace names.
 */
export function makeWorkspacePath(workspaceName: string): string {
  return makeModulePath(workspaceName, workspaceName);
}

/**
 * Returns the workspace name for given module path.
 */
export function getWorkspaceName(modulePath: string): string {
  const regex = new RegExp('^([a-z_][a-z0-9_]*)/([a-z_][a-z0-9_]*).py$');
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the workspace name.');
  }
  return result[1];
}

/**
 * Returns the module name for given module path.
 */
export function getModuleName(modulePath: string): string {
  const regex = new RegExp('^([a-z_][a-z0-9_]*)/([a-z_][a-z0-9_]*).py$');
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the module name.');
  }
  return result[2];
}

/**
 * Returns the download file name for the given module path.
 */
export function makeDownloadFileName(modulePath: string): string {
  return getWorkspaceName(modulePath) + '-' + getModuleName(modulePath) + '.wpilib_blocks';
}

export function makeUploadWorkspaceName(uploadFileName: string): string {
  // Check if the name is <workspace name>-<workspace name>.
  const regex = new RegExp('^([a-z_][a-z0-9_]*)-([a-z_][a-z0-9_]*).wpilib_blocks$');
  const result = regex.exec(uploadFileName);
  if (!result || result[1] !== result[2]) {
    throw new Error(uploadFileName + ' is not a valid file name for uploading as a workspace');
  }
  return result[2];
}

/**
 * Returns the module content for a new Workspace.
 */
export function newWorkspaceContent(workspaceName: string): string {
  const pythonCode = '';
  const exportedBlocks = '[]';
  const blocksContent = '{}';
  return makeModuleContent(pythonCode, exportedBlocks, blocksContent);
}

/**
 * Returns the module content for a new OpMode.
 */
export function newOpModeContent(workspaceName: string, opModeName: string): string {
  const module: Module = {
    modulePath: makeModulePath(workspaceName, opModeName),
    moduleType: MODULE_TYPE_OPMODE,
    workspaceName: workspaceName,
    moduleName: opModeName,
    dateModifiedMillis: 0,
  };

  // Create a headless blockly workspace.
  const headlessBlocklyWorkspace = new Blockly.Workspace();
  headlessBlocklyWorkspace.options.oneBasedIndex = false;
  Blockly.serialization.workspaces.load(startingOpModeBlocks, headlessBlocklyWorkspace);
  
  extendedPythonGenerator.setCurrentModule(module);
  const pythonCode = extendedPythonGenerator.workspaceToCode(headlessBlocklyWorkspace);
  const exportedBlocks = JSON.stringify(extendedPythonGenerator.getExportedBlocks(headlessBlocklyWorkspace));
  const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(headlessBlocklyWorkspace));
  return makeModuleContent(pythonCode, exportedBlocks, blocksContent);
}

/**
 * Make the module content from the given python code and blocks content.
 */
export function makeModuleContent(pythonCode: string, exportedBlocks: string, blocksContent: string): string {
  let delimiter = 'BlocksContent';
  while (blocksContent.includes(delimiter) || exportedBlocks.includes(delimiter)) {
    delimiter += '.';
  }
  return (
      '# This file was generated by the Blocks editor.\n\n' +
      pythonCode + '\n\n\n' +
      '"""\n' +
      delimiter + '\n' +
      exportedBlocks + '\n' +
      delimiter + '\n' +
      blocksContent + '\n' +
      delimiter + '\n' +
      '"""\n');
}

/**
 * Extract the blocks content from the given module content.
 */
export function extractBlocksContent(moduleContent: string): string {
  // The last line is """.
  const lastChars = '\n"""\n';
  if (!moduleContent.endsWith(lastChars) || moduleContent.length <= lastChars.length) {
    throw new Error('Unable to extract the blocks content.');
  }
  // The line before that is the delimiter.
  const iEndOfDelimiter = moduleContent.length - lastChars.length;
  const iPreviousNewLine = moduleContent.lastIndexOf('\n', iEndOfDelimiter - 1);
  if (iPreviousNewLine === -1) {
    throw new Error('Unable to extract the blocks content.');
  }
  const iEndOfBlocksContent = iPreviousNewLine;
  const iStartOfDelimiter = iPreviousNewLine + 1;
  const delimiter = moduleContent.substring(iStartOfDelimiter, iEndOfDelimiter);
  // Now, find the previous delimiter.
  const iStartOfPreviousDelimiter = moduleContent.lastIndexOf(delimiter, iPreviousNewLine - 1);
  if (iStartOfPreviousDelimiter === -1) {
    throw new Error('Unable to extract the blocks content.');
  }
  // The blocks content is between the two delimiters.
  const iStartOfBlocksContent = iStartOfPreviousDelimiter + delimiter.length + 1;
  return moduleContent.substring(iStartOfBlocksContent, iEndOfBlocksContent);
}

/**
 * Extract the exportedBlocks from the given module content.
 */
export function extractExportedBlocks(moduleName: string, moduleContent: string): Block[] {
  // The last line is """.
  const lastChars = '\n"""\n';
  if (!moduleContent.endsWith(lastChars) || moduleContent.length <= lastChars.length) {
    throw new Error('Unable to extract the exportedBlocks.');
  }
  // The line before that is the delimiter.
  const iEndOfDelimiter = moduleContent.length - lastChars.length;
  const iPreviousNewLine = moduleContent.lastIndexOf('\n', iEndOfDelimiter - 1);
  if (iPreviousNewLine === -1) {
    throw new Error('Unable to extract the exportedBlocks.');
  }
  const iStartOfDelimiter = iPreviousNewLine + 1;
  const delimiter = moduleContent.substring(iStartOfDelimiter, iEndOfDelimiter);
  // Now, find the previous delimiter.
  let iStartOfPreviousDelimiter = moduleContent.lastIndexOf(delimiter, iPreviousNewLine - 1);
  if (iStartOfPreviousDelimiter === -1) {
    throw new Error('Unable to extract the exportedBlocks.');
  }
  const iEndOfExportedBlocks = iStartOfPreviousDelimiter - 1;
  // Now, find the previous delimiter before that.
  iStartOfPreviousDelimiter = moduleContent.lastIndexOf(delimiter, iStartOfPreviousDelimiter - 1);
  if (iStartOfPreviousDelimiter === -1) {
    throw new Error('Unable to extract the exportedBlocks.');
  }
  // The exportedBlocks content is between the two delimiters.
  const iStartOfExportedBlocks = iStartOfPreviousDelimiter + delimiter.length + 1;
  const exportedBlocksContent = moduleContent.substring(iStartOfExportedBlocks, iEndOfExportedBlocks);
  const exportedBlocks: Block[] = JSON.parse(exportedBlocksContent);
  exportedBlocks.forEach((block) => {
    if (block.extraState?.importModule === MODULE_NAME_PLACEHOLDER) {
      block.extraState.importModule = moduleName;
    }
    if (block.fields?.MODULE_OR_CLASS === MODULE_NAME_PLACEHOLDER) {
      block.fields.MODULE_OR_CLASS = moduleName;
    }
  });
  return exportedBlocks;
}
