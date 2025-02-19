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

import JSZip from 'jszip';

import * as Blockly from 'blockly/core';

import {Block} from "../toolbox/items";
import startingOpModeBlocks from '../modules/opmode_start.json'; 
import startingMechanismBlocks from '../modules/mechanism_start.json';
import startingRobotBlocks from '../modules/robot_start.json';

import {extendedPythonGenerator} from '../editor/extended_python_generator';

// Types, constants, and functions related to modules, regardless of where the modules are stored.

export type Module = {
  modulePath: string,
  moduleType: string,
  projectName: string,
  moduleName: string,
  dateModifiedMillis: number,
};

export type Mechanism = Module;
export type OpMode = Module;

export type Project = Module & {
  mechanisms: Mechanism[]
  opModes: OpMode[],
};

export const MODULE_TYPE_UNKNOWN = 'unknown';
export const MODULE_TYPE_PROJECT = 'project';
export const MODULE_TYPE_MECHANISM = 'mechanism';
export const MODULE_TYPE_OPMODE = 'opmode';

export const MODULE_NAME_PLACEHOLDER = '%module_name%';

const DELIMITER_PREFIX = 'BlocksContent';
const MARKER_MODULE_TYPE = 'moduleType: ';
const MARKER_EXPORTED_BLOCKS = 'exportedBlocks: ';
const MARKER_BLOCKS_CONTENT = 'blocksContent: ';
const PARTS_INDEX_BLOCKS_CONTENT = 0;
const PARTS_INDEX_EXPORTED_BLOCKS = 1;
const PARTS_INDEX_MODULE_TYPE = 2;
const NUMBER_OF_PARTS = 3;

export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

/**
 * Returns the module with the given module path, or null if it is not found.
 */
export function findModule(modules: Project[], modulePath: string): Module | null {
  for (const project of modules) {
    if (project.modulePath === modulePath) {
      return project;
    }
    for (const mechanism of project.mechanisms) {
      if (mechanism.modulePath === modulePath) {
        return mechanism;
      }
    }
    for (const opMode of project.opModes) {
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
 * Returns the module path for the given project and module names.
 */
export function makeModulePath(projectName: string, moduleName: string): string {
  return projectName + '/' + moduleName + '.py';
}

/**
 * Returns the project path for the given project names.
 */
export function makeProjectPath(projectName: string): string {
  return makeModulePath(projectName, projectName);
}

/**
 * Returns the project name for given module path.
 */
export function getProjectName(modulePath: string): string {
  const regex = new RegExp('^([a-z_][a-z0-9_]*)/([a-z_][a-z0-9_]*).py$');
  const result = regex.exec(modulePath)
  if (!result) {
    throw new Error('Unable to extract the project name.');
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
 * Returns the module content for a new Project.
 */
export function newProjectContent(projectName: string): string {
  const module: Module = {
    modulePath: makeProjectPath(projectName),
    moduleType: MODULE_TYPE_PROJECT,
    projectName: projectName,
    moduleName: projectName,
    dateModifiedMillis: 0,
  };

  // Create a headless blockly workspace.
  const headlessBlocklyWorkspace = new Blockly.Workspace();
  headlessBlocklyWorkspace.options.oneBasedIndex = false;
  Blockly.serialization.workspaces.load(startingRobotBlocks, headlessBlocklyWorkspace);

  extendedPythonGenerator.setCurrentModule(module);
  const pythonCode = extendedPythonGenerator.workspaceToCode(headlessBlocklyWorkspace);
  const exportedBlocks = JSON.stringify(extendedPythonGenerator.getExportedBlocks(headlessBlocklyWorkspace));
  const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(headlessBlocklyWorkspace));
  return makeModuleContent(module, pythonCode, exportedBlocks, blocksContent);
}

/**
 * Returns the module content for a new Mechanism.
 */
export function newMechanismContent(projectName: string, mechanismName: string): string {
  const module: Module = {
    modulePath: makeModulePath(projectName, mechanismName),
    moduleType: MODULE_TYPE_MECHANISM,
    projectName: projectName,
    moduleName: mechanismName,
    dateModifiedMillis: 0,
  };

  // Create a headless blockly workspace.
  const headlessBlocklyWorkspace = new Blockly.Workspace();
  headlessBlocklyWorkspace.options.oneBasedIndex = false;
  Blockly.serialization.workspaces.load(startingMechanismBlocks, headlessBlocklyWorkspace);

  extendedPythonGenerator.setCurrentModule(module);
  const pythonCode = extendedPythonGenerator.workspaceToCode(headlessBlocklyWorkspace);
  const exportedBlocks = JSON.stringify(extendedPythonGenerator.getExportedBlocks(headlessBlocklyWorkspace));
  const blocksContent = JSON.stringify(Blockly.serialization.workspaces.save(headlessBlocklyWorkspace));
  return makeModuleContent(module, pythonCode, exportedBlocks, blocksContent);
}

/**
 * Returns the module content for a new OpMode.
 */
export function newOpModeContent(projectName: string, opModeName: string): string {
  const module: Module = {
    modulePath: makeModulePath(projectName, opModeName),
    moduleType: MODULE_TYPE_OPMODE,
    projectName: projectName,
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
  return makeModuleContent(module, pythonCode, exportedBlocks, blocksContent);
}

/**
 * Make the module content from the given python code and blocks content.
 */
export function makeModuleContent(module: Module, pythonCode: string, exportedBlocks: string, blocksContent: string): string {
  let delimiter = DELIMITER_PREFIX;
  while (blocksContent.includes(delimiter) || exportedBlocks.includes(delimiter) || module.moduleType.includes(delimiter)) {
    delimiter += '.';
  }
  return (
      '# This file was generated by the Blocks editor.\n\n' +
      pythonCode + '\n\n\n' +
      '"""\n' +
      delimiter + '\n' +
      MARKER_MODULE_TYPE + module.moduleType + '\n' +
      delimiter + '\n' +
      MARKER_EXPORTED_BLOCKS + exportedBlocks + '\n' +
      delimiter + '\n' +
      MARKER_BLOCKS_CONTENT + blocksContent + '\n' +
      delimiter + '\n' +
      '"""\n');
}

function getParts(moduleContent: string): string {
  // The last line is """.
  const lastChars = '\n"""\n';
  if (!moduleContent.endsWith(lastChars) || moduleContent.length <= lastChars.length) {
    throw new Error('Unable to parse the module content.');
  }
  // The line before that is the delimiter.
  const iEndOfDelimiter = moduleContent.length - lastChars.length;
  const iPreviousNewLine = moduleContent.lastIndexOf('\n', iEndOfDelimiter - 1);
  if (iPreviousNewLine === -1) {
    throw new Error('Unable to parse the module content.');
  }
  const iStartOfDelimiter = iPreviousNewLine + 1;
  const delimiter = moduleContent.substring(iStartOfDelimiter, iEndOfDelimiter);
  const split = moduleContent.split(delimiter);
  split.pop(); // The last element is the """ that closes the python comment.
  const parts = [];
  // Pop the elements off of the split array and push them onto the parts array
  // so they end up in the reverse order that they were in the module content.
  // Ignore the first (index 0) element of the split array, which is the python
  // code.
  while (split.length > 1 && parts.length < NUMBER_OF_PARTS) {
    parts.push(split.pop().trim());
  }
  if (parts.length < 2) {
    throw new Error('Unable to parse the module content.');
  }
  if (parts.length == 2) {
    // This module was saved without the module type, which was added to the module content when we introduced mechanisms.
    // This module is either a Project or an OpMode, but we don't know which from just the content.
    parts.push(MODULE_TYPE_UNKNOWN);
  }
  return parts;
}

/**
 * Extract the blocks content from the given module content.
 */
export function extractBlocksContent(moduleContent: string): string {
  const parts = getParts(moduleContent);
  let blocksContent = parts[PARTS_INDEX_BLOCKS_CONTENT];
  if (blocksContent.startsWith(MARKER_BLOCKS_CONTENT)) {
    blocksContent = blocksContent.substring(MARKER_BLOCKS_CONTENT.length);
  }
  return blocksContent;
}

/**
 * Extract the exportedBlocks from the given module content.
 */
export function extractExportedBlocks(moduleName: string, moduleContent: string): Block[] {
  const parts = getParts(moduleContent);
  let exportedBlocksContent = parts[PARTS_INDEX_EXPORTED_BLOCKS];
  if (exportedBlocksContent.startsWith(MARKER_EXPORTED_BLOCKS)) {
    exportedBlocksContent = exportedBlocksContent.substring(MARKER_EXPORTED_BLOCKS.length);
  }

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

/**
 * Extract the moduleType from the given module content.
 */
export function extractModuleType(moduleName: string, moduleContent: string): Block[] {
  const parts = getParts(moduleContent);
  let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
  if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
    moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
  }
  return moduleType;
}

/**
 * Produce the blob for downloading a project.
 */
export async function produceDownloadProjectBlob(
    projectName: string, moduleContents: {[key: string]: string}): string {
  const zip = new JSZip();
  for (let moduleName in moduleContents) {
    const moduleContent = moduleContents[moduleName];
    const moduleContentForDownload = _processModuleContentForDownload(
        projectName, moduleName, moduleContent);
    zip.file(moduleName, moduleContentForDownload);
  }
  const content = await zip.generateAsync({ type: "blob" });
  const blobUrl = URL.createObjectURL(content);
  return blobUrl;
}

/**
 * Process the module content so it can be downloaded.
 */
function _processModuleContentForDownload(
    projectName: string, moduleName: string, moduleContent: string): string {
  const parts = getParts(moduleContent);
  let blocksContent = parts[PARTS_INDEX_BLOCKS_CONTENT];
  if (blocksContent.startsWith(MARKER_BLOCKS_CONTENT)) {
    blocksContent = blocksContent.substring(MARKER_BLOCKS_CONTENT.length);
  }
  let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
  if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
    moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
  }

  const module: Module = {
    modulePath: makeModulePath(projectName, moduleName),
    moduleType: moduleType,
    projectName: projectName,
    moduleName: moduleName,
    dateModifiedMillis: 0,
  };

  // Clear out the python content and exported blocks.
  const pythonCode = '';
  const exportedBlocks = '[]';
  return makeModuleContent(module, pythonCode, exportedBlocks, blocksContent);
}

/**
 * Make a unique project name for an uploaded project.
 */
export function makeUploadProjectName(
    uploadFileName: string, existingProjectNames: string[]): string {
  const preferredName = uploadFileName.substring(
      0, uploadFileName.length - UPLOAD_DOWNLOAD_FILE_EXTENSION.length);
  let name = preferredName; // No suffix.
  let suffix = 0;
  while (true) {
    var nameClash = false;
    for (const existingProjectName of existingProjectNames) {
      if (name == existingProjectName) {
        nameClash = true;
        break;
      }
    }
    if (!nameClash) {
      return name;
    }
    suffix++;
    name = preferredName + suffix;
  }
}

/**
 * Process the uploaded blob to get the module types and contents.
 */
export async function processUploadedBlob(
    projectName: string, blobUrl: string)
    : [{[key: string]: string}, {[key: string]: string}] {
  const prefix = 'data:application/octet-stream;base64,';
  if (!blobUrl.startsWith(prefix)) {
    throw new Error('blobUrl does not have the expected prefix.');
  }
  const data = blobUrl.substring(prefix.length);

  const zip = await JSZip.loadAsync(data, {base64: true});
  const promises = {};
  zip.forEach((moduleName, zipEntry) => {
    promises[moduleName] = zipEntry.async('text');
  });

  // Wait for all promises to resolve.
  const files: {[key: string]: string} = {}; // key is file name, value is content
  await Promise.all(
    Object.entries(promises).map(async ([filename, promise]) => {
      files[filename] = await promise;
    })
  );

  // Process each module's content.
  const moduleTypes: {[key: string]: string} = {}; // key is module name, value is module type
  const moduleContents: {[key: string]: string} = {}; // key is module name, value is module content
  for (let filename in files) {
    const uploadedContent = files[filename];
    let [moduleName, moduleType, moduleContent] = _processUploadedModule(
        projectName, filename, uploadedContent);

    moduleTypes[moduleName] = moduleType;
    moduleContents[moduleName] = moduleContent;
  }

  return [moduleTypes, moduleContents];
}

/**
 * Processes an uploaded module to get the module name, type, and content.
 */
export function _processUploadedModule(
    projectName: string, filename: string, uploadedContent: string)
    : [string, string, string] {
  const parts = getParts(uploadedContent);
  let blocksContent = parts[PARTS_INDEX_BLOCKS_CONTENT];
  if (blocksContent.startsWith(MARKER_BLOCKS_CONTENT)) {
    blocksContent = blocksContent.substring(MARKER_BLOCKS_CONTENT.length);
  }
  let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
  if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
    moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
  }

  const moduleName = (moduleType === MODULE_TYPE_PROJECT)
      ? projectName : filename;

  const module: Module = {
    modulePath: makeModulePath(projectName, moduleName),
    moduleType: moduleType,
    projectName: projectName,
    moduleName: moduleName,
    dateModifiedMillis: 0,
  };

  // Generate the python content and exported blocks.
  // Create a headless blockly workspace.
  const headlessBlocklyWorkspace = new Blockly.Workspace();
  headlessBlocklyWorkspace.options.oneBasedIndex = false;
  Blockly.serialization.workspaces.load(
      JSON.parse(blocksContent), headlessBlocklyWorkspace);
  extendedPythonGenerator.setCurrentModule(module);
  const pythonCode = extendedPythonGenerator.workspaceToCode(
      headlessBlocklyWorkspace);
  const exportedBlocks = JSON.stringify(
      extendedPythonGenerator.getExportedBlocks(headlessBlocklyWorkspace));
  const moduleContent = makeModuleContent(
      module, pythonCode, exportedBlocks, blocksContent);
  return [moduleName, moduleType, moduleContent];
}
