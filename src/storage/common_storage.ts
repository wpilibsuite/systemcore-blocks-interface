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

import { Block } from '../toolbox/items';
import startingOpModeBlocks from '../modules/opmode_start.json';
import startingMechanismBlocks from '../modules/mechanism_start.json';
import startingRobotBlocks from '../modules/robot_start.json';

import { extendedPythonGenerator } from '../editor/extended_python_generator';
import { createGeneratorContext } from '../editor/generator_context';

// Types, constants, and functions related to modules, regardless of where the modules are stored.

export type Module = {
  modulePath: string,
  moduleType: string,
  projectName: string,
  moduleName: string,
  dateModifiedMillis: number,
  className: string,
};

export type Mechanism = Module;
export type OpMode = Module;

export type Project = Module & {
  mechanisms: Mechanism[]
  opModes: OpMode[],
};

export type Component = {
  name: string,
  className: string,
}

export const MODULE_TYPE_UNKNOWN = 'unknown';
export const MODULE_TYPE_PROJECT = 'project';
export const MODULE_TYPE_MECHANISM = 'mechanism';
export const MODULE_TYPE_OPMODE = 'opmode';

export const MODULE_NAME_PLACEHOLDER = '%module_name%';

const DELIMITER_PREFIX = 'BlocksContent';
const MARKER_BLOCKS_CONTENT = 'blocksContent: ';
const MARKER_EXPORTED_BLOCKS = 'exportedBlocks: ';
const MARKER_MODULE_TYPE = 'moduleType: ';
const MARKER_COMPONENTS = 'components: ';
const PARTS_INDEX_BLOCKS_CONTENT = 0;
const PARTS_INDEX_EXPORTED_BLOCKS = 1;
const PARTS_INDEX_MODULE_TYPE = 2;
const PARTS_INDEX_COMPONENTS = 3;
const NUMBER_OF_PARTS = 4;

export const UPLOAD_DOWNLOAD_FILE_EXTENSION = '.blocks';

export interface Storage {
  saveEntry(entryKey: string, entryValue: string): Promise<void>;
  fetchEntry(entryKey: string, defaultValue: string): Promise<string>;
  listModules(): Promise<Project[]>;
  fetchModuleContent(modulePath: string): Promise<string>;
  createModule(moduleType: string, modulePath: string, moduleContent: string): Promise<void>;
  saveModule(modulePath: string, moduleContent: string): Promise<void>;
  renameModule(moduleType: string, projectName: string, oldModuleName: string, newModuleName: string): Promise<void>;
  copyModule(moduleType: string, projectName: string, oldModuleName: string, newModuleName: string): Promise<void>;
  deleteModule(moduleType: string, modulePath: string): Promise<void>;
  downloadProject(projectName: string): Promise<string>;
  uploadProject(projectName: string, blobUrl: string): Promise<void>;
}

/**
 * Adds a new module to the project.
 * @param storage The storage interface to use for creating the module.
 * @param project The project to add the module to.
 * @param moduleType The type of the module (e.g., 'mechanism', 'opmode').
 * @param className The name of the class.
 */
export async function addModuleToProject(
  storage: Storage, project: Project, moduleType: string, className: string): Promise<void> {
  let newModuleName = classNameToModuleName(className);
  let newModulePath = makeModulePath(project.projectName, newModuleName);

  if (moduleType === MODULE_TYPE_MECHANISM) {
    const mechanismContent = newMechanismContent(project.projectName, newModuleName);
      await storage.createModule(MODULE_TYPE_MECHANISM, newModulePath, mechanismContent);
      project.mechanisms.push({
        modulePath: newModulePath,
        moduleType: MODULE_TYPE_MECHANISM,
        projectName: project.projectName, 
        moduleName: newModuleName, 
        className: className
      } as Mechanism);
  } else if (moduleType === MODULE_TYPE_OPMODE) {
    const opModeContent = newOpModeContent(project.projectName, newModuleName);
      await storage.createModule(MODULE_TYPE_OPMODE, newModulePath, opModeContent);
      project.opModes.push({
        modulePath: newModulePath,
        moduleType: MODULE_TYPE_OPMODE,
        projectName: project.projectName, 
        moduleName: newModuleName, 
        className: className
      } as OpMode);
  }
}

/*
    * Returns true if the given class name is a valid class name and if not, why not.
    */
  export function isClassNameOk(project: Project, proposedName: string) {
    let ok = true;
    let error = '';

    if (!isValidClassName(proposedName)) {
      ok = false;
      error = proposedName + ' is not a valid name. Please enter a different name.';
    }
    else if (proposedName == project.className) {
      ok = false;
      error = 'The project is already named ' + proposedName + '. Please enter a different name.';
    }
    else if (getClassInProject(project, proposedName) != null) {
      ok = false;
      error = 'Another Mechanism or OpMode is already named ' + proposedName + '. Please enter a different name.'
    }

    return {
      ok: ok,
      error: error
    }
  }

  /**
   * Returns true if the given classname is in the project
   */
  export function getClassInProject(project: Project, name: string): Module | null {
    for (const mechanism of project.mechanisms) {
      if (mechanism.className === name) {
        return mechanism;
      }
    }
    for (const opMode of project.opModes) {
      if (opMode.className === name) {
        return opMode;
      }
    }
    return null;
  }

  /**
   * Returns the module with the given module path, or null if it is not found.
   */
  export function findModule(modules: Project[], modulePath: string): Module | null {
    for (const project of modules) {
      const result = findModuleInProject(project, modulePath);
      if (result) {
        return result;
      }
    }

    return null;
  }

  /**
   * Returns the module with the given module path inside the given project, or null if it is not found.
   */
  export function findModuleInProject(project: Project, modulePath: string): Module | null {
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
    return null;
  }


  /**
   * Makes the given name a valid class name.
   */
  export function onChangeClassName(name: string): string {
    let newName = '';

    // Force the first character to be an upper case letter
    let i = 0;
    for (; i < name.length; i++) {
      const firstChar = name.charAt(0);
      if (firstChar >= 'A' && firstChar <= 'Z') {
        newName += firstChar;
        i++;
        break;
      } else if (firstChar >= 'a' && firstChar <= 'z') {
        newName += firstChar.toUpperCase();
        i++;
        break;
      }
    }

    for (; i < name.length; i++) {
      const char = name.charAt(i);
      if ((char >= 'A' && char <= 'Z') ||
        (char >= 'a' && char <= 'z') ||
        (char >= '0' && char <= '9')) {
        newName += char;
      }
    }

    return newName;
  }

  /**
   * Returns true if the given name is a valid class name.
   */
  export function isValidClassName(name: string): boolean {
    if (name) {
      return /^[A-Z][A-Za-z0-9]*$/.test(name);
    }
    return false;
  }

  /**
   * Returns the module name for the given class name.
   */
  export function classNameToModuleName(className: string): string {
    let moduleName = '';
    for (let i = 0; i < className.length; i++) {
      const char = className.charAt(i);
      if (char >= 'A' && char <= 'Z') {
        if (i > 0) {
          moduleName += '_';
        }
        moduleName += char.toLowerCase();
      } else {
        moduleName += char;
      }
    }
    return moduleName;
  }

  /**
   * Returns the class name for the given module name.
   */
  export function moduleNameToClassName(moduleName: string): string {
    let className = '';
    let nextCharUpper = true;
    for (let i = 0; i < moduleName.length; i++) {
      const char = moduleName.charAt(i);
      if (char !== '_') {
        className += nextCharUpper ? char.toUpperCase() : char;
      }
      nextCharUpper = (char === '_');
    }
    return className;
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

  function startingBlocksToModuleContent(
    module: Module, startingBlocks: { [key: string]: any }) {
    // Create a headless blockly workspace.
    const headlessBlocklyWorkspace = new Blockly.Workspace();
    headlessBlocklyWorkspace.options.oneBasedIndex = false;
    Blockly.serialization.workspaces.load(startingBlocks, headlessBlocklyWorkspace);

    const generatorContext = createGeneratorContext();
    generatorContext.setModule(module);

    const pythonCode = extendedPythonGenerator.mrcWorkspaceToCode(
      headlessBlocklyWorkspace, generatorContext);
    const exportedBlocks = JSON.stringify(generatorContext.getExportedBlocks());
    const blocksContent = JSON.stringify(
      Blockly.serialization.workspaces.save(headlessBlocklyWorkspace));
    const components = '[]';
    return makeModuleContent(
      module, pythonCode, blocksContent, exportedBlocks, components);
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
      className: moduleNameToClassName(projectName),
    };

    return startingBlocksToModuleContent(module, startingRobotBlocks);
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
      className: moduleNameToClassName(mechanismName),
    };

    return startingBlocksToModuleContent(module, startingMechanismBlocks);
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
      className: moduleNameToClassName(opModeName),
    };

    return startingBlocksToModuleContent(module, startingOpModeBlocks);
  }

  /**
   * Make the module content from the given python code and blocks content.
   */
  export function makeModuleContent(
    module: Module,
    pythonCode: string,
    blocksContent: string,
    exportedBlocks: string,
    components: string): string {
    let delimiter = DELIMITER_PREFIX;
    while (blocksContent.includes(delimiter) || exportedBlocks.includes(delimiter) || module.moduleType.includes(delimiter)) {
      delimiter += '.';
    }
    return (
      '# This file was generated by the Blocks editor.\n\n' +
      pythonCode + '\n\n\n' +
      '"""\n' +
      delimiter + '\n' +
      MARKER_COMPONENTS + components + '\n' +
      delimiter + '\n' +
      MARKER_MODULE_TYPE + module.moduleType + '\n' +
      delimiter + '\n' +
      MARKER_EXPORTED_BLOCKS + exportedBlocks + '\n' +
      delimiter + '\n' +
      MARKER_BLOCKS_CONTENT + blocksContent + '\n' +
      delimiter + '\n' +
      '"""\n');
  }

  function getParts(moduleContent: string): string[] {
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
      const s = split.pop();
      if (s) {
        parts.push(s.trim());
      }
    }
    if (parts.length <= PARTS_INDEX_EXPORTED_BLOCKS) {
      parts.push('[]');
    }
    if (parts.length <= PARTS_INDEX_MODULE_TYPE) {
      // This module was saved without the module type.
      // This module is either a Project or an OpMode, but we don't know which from just the content.
      parts.push(MODULE_TYPE_UNKNOWN);
    }
    if (parts.length <= PARTS_INDEX_COMPONENTS) {
      // This module was saved without components.
      parts.push('');
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
  export function extractModuleType(moduleContent: string): string {
    const parts = getParts(moduleContent);
    let moduleType = parts[PARTS_INDEX_MODULE_TYPE];
    if (moduleType.startsWith(MARKER_MODULE_TYPE)) {
      moduleType = moduleType.substring(MARKER_MODULE_TYPE.length);
    }
    return moduleType;
  }

  /**
   * Extract the components from the given module content.
   */
  export function extractComponents(moduleContent: string): Component[] {
    const parts = getParts(moduleContent);
    let componentsContent = parts[PARTS_INDEX_COMPONENTS];
    if (componentsContent.startsWith(MARKER_COMPONENTS)) {
      componentsContent = componentsContent.substring(MARKER_COMPONENTS.length);
    }
    const components: Component[] = JSON.parse(componentsContent);
    return components;
  }

  /**
   * Produce the blob for downloading a project.
   */
  export async function produceDownloadProjectBlob(
    projectName: string, moduleContents: { [key: string]: string }): Promise<string> {
    const zip = new JSZip();
    for (const moduleName in moduleContents) {
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
      className: moduleNameToClassName(moduleName),
    };

    // Clear out the python content and exported blocks.
    const pythonCode = '';
    const exportedBlocks = '[]';
    const components = '[]';
    return makeModuleContent(
      module, pythonCode, blocksContent, exportedBlocks, components);
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
      let nameClash = false;
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
    : Promise<[{ [key: string]: string }, { [key: string]: string }]> {
    const prefix = 'data:application/octet-stream;base64,';
    if (!blobUrl.startsWith(prefix)) {
      throw new Error('blobUrl does not have the expected prefix.');
    }
    const data = blobUrl.substring(prefix.length);

    const zip = await JSZip.loadAsync(data, { base64: true });
    const promises: { [key: string]: Promise<string> } = {};
    zip.forEach((moduleName, zipEntry) => {
      promises[moduleName] = zipEntry.async('text');
    });

    // Wait for all promises to resolve.
    const files: { [key: string]: string } = {}; // key is file name, value is content
    await Promise.all(
      Object.entries(promises).map(async ([filename, promise]) => {
        files[filename] = await promise;
      })
    );

    // Process each module's content.
    const moduleTypes: { [key: string]: string } = {}; // key is module name, value is module type
    const moduleContents: { [key: string]: string } = {}; // key is module name, value is module content
    for (const filename in files) {
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
      className: moduleNameToClassName(moduleName),
    };

    // Generate the python content and exported blocks.
    // Create a headless blockly workspace.
    const headlessBlocklyWorkspace = new Blockly.Workspace();
    headlessBlocklyWorkspace.options.oneBasedIndex = false;
    Blockly.serialization.workspaces.load(
      JSON.parse(blocksContent), headlessBlocklyWorkspace);

    const generatorContext = createGeneratorContext();
    generatorContext.setModule(module);

    const pythonCode = extendedPythonGenerator.mrcWorkspaceToCode(
      headlessBlocklyWorkspace, generatorContext);
    const exportedBlocks = JSON.stringify(generatorContext.getExportedBlocks());
    const components = '[]';
    const moduleContent = makeModuleContent(
      module, pythonCode, blocksContent, exportedBlocks, components);
    return [moduleName, moduleType, moduleContent];
  }
