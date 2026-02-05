/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview Functions for generating Python code from Blockly projects.
 * This module uses headless Blockly to convert block-based projects into
 * Python code files and provides utilities for packaging them into downloadable zip files.
 */

import * as Blockly from 'blockly/core';
import * as workspaces from '../blocks/utils/workspaces';
import { extendedPythonGenerator } from '../editor/extended_python_generator';
import { Storage } from './common_storage';
import { Module } from './module';
import { parseModuleContentText } from './module_content';
import { Project } from './project';
import { pascalCaseToSnakeCase } from './names';
import JSZip from 'jszip';

/** Result of Python code generation for a single module */
interface ModulePythonResult {
  moduleName: string;
  pythonCode: string;
  success: boolean;
  error?: string;
}

/** Result of Python code generation for an entire project */
interface ProjectPythonResult {
  projectName: string;
  modules: ModulePythonResult[];
  success: boolean;
  errorCount: number;
}

/**
 * Generate Python code for a single module using headless Blockly
 * @param module The module containing Blockly JSON
 * @param storage The storage interface to fetch module content
 * @returns Result containing generated Python code or error
 */
async function generatePythonForModule(module: Module, storage: Storage): Promise<ModulePythonResult> {
  const moduleName = pascalCaseToSnakeCase(module.className);

  try {
    // Fetch the module content from storage
    const moduleContentText = await storage.fetchFileContentText(module.modulePath);
    const moduleContent = parseModuleContentText(moduleContentText);

    // Create a headless workspace
    const workspace = workspaces.createHeadlessWorkspace(module.moduleType);

    // Parse and load the JSON into the workspace
    const blocks = moduleContent.getBlocks();
    Blockly.serialization.workspaces.load(blocks, workspace);

    // Generate Python code.
    const generateErrorHandling = true;
    const pythonCode = extendedPythonGenerator.mrcWorkspaceToCode(workspace, module, generateErrorHandling);

    // Clean up the workspace
    workspaces.destroyHeadlessWorkspace(workspace);

    return {
      moduleName: moduleName,
      pythonCode,
      success: true,
    };
  } catch (error) {
    console.error('Error generating Python for module ', moduleName, ':', error);
    return {
      moduleName: moduleName,
      pythonCode: '',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate Python code for all modules in a project using headless Blockly
 * @param project The project containing multiple modules
 * @param storage The storage interface to fetch module content
 * @returns Result containing Python code for all modules
 */
async function generatePythonForProject(project: Project, storage: Storage): Promise<ProjectPythonResult> {
  const moduleResults: ModulePythonResult[] = [];
  let errorCount = 0;

  // Process the robot module
  const robotResult = await generatePythonForModule(project.robot, storage);
  moduleResults.push(robotResult);
  if (!robotResult.success) {
    errorCount++;
  }

  // Process all mechanism modules
  for (const mechanism of project.mechanisms) {
    const result = await generatePythonForModule(mechanism, storage);
    moduleResults.push(result);
    if (!result.success) {
      errorCount++;
    }
  }

  // Process all opmode modules
  for (const opMode of project.opModes) {
    const result = await generatePythonForModule(opMode, storage);
    moduleResults.push(result);
    if (!result.success) {
      errorCount++;
    }
  }

  return {
    projectName: project.projectName,
    modules: moduleResults,
    success: errorCount === 0,
    errorCount,
  };
}

/**
 * Generate Python files content as a map for easy file creation
 * @param project The project containing multiple modules
 * @param storage The storage interface to fetch module content
 * @returns Map of filename to Python code content
 */
async function generatePythonFilesMap(project: Project, storage: Storage): Promise<Map<string, string>> {
  const filesMap = new Map<string, string>();
  const result = await generatePythonForProject(project, storage);

  for (const moduleResult of result.modules) {
    if (moduleResult.success) {
      const filename = `${moduleResult.moduleName}.py`;
      filesMap.set(filename, moduleResult.pythonCode);
    }
  }

  return filesMap;
}

/**
 * Generate Python files for a project and create a downloadable zip blob
 * @param project The project containing multiple modules
 * @param storage The storage interface to fetch module content
 * @returns Promise that resolves to a blob URL for downloading the zip file
 */
export async function producePythonProjectBlob(project: Project, storage: Storage): Promise<string> {
  const pythonFilesMap = await generatePythonFilesMap(project, storage);

  if (pythonFilesMap.size === 0) {
    throw new Error('No Python files were generated successfully');
  }

  const zip = new JSZip();
  for (const [filename, pythonCode] of pythonFilesMap) {
    zip.file(filename, pythonCode);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const blobUrl = URL.createObjectURL(content);
  return blobUrl;
}
