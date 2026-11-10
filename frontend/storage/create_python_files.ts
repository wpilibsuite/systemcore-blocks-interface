// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Functions for generating Python code from Blockly projects.
 * This module uses headless Blockly to convert block-based projects into
 * Python code files and provides utilities for packaging them into downloadable zip files.
 */

import * as Blockly from 'blockly/core';
import * as workspaces from '../blocks/utils/workspaces';
import { extendedPythonGenerator } from '../editor/extended_python_generator';
import { getOpModeDetailsFromBlocksJson } from '../blocks/mrc_opmode_details';
import { Storage } from './common_storage';
import { Module } from './module';
import { ModuleContent, parseModuleContentText } from './module_content';
import { Project } from './project';
import { pascalCaseToSnakeCase } from './names';
import { createUsageReport } from './usage_report';
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
 * @param module The module
 * @param moduleContent The content of the module, or an error if it couldn't be fetched
 * @returns Result containing generated Python code or error
 */
function generatePythonForModule(
    module: Module, moduleContent: ModuleContent | Error): ModulePythonResult {
  const moduleName = pascalCaseToSnakeCase(module.className);

  try {
    if (moduleContent instanceof Error) {
      throw moduleContent;
    }

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
 * Fetches the content of each module in the project.
 * @returns Maps the moduleId of each module to its content, or to the error if it couldn't be
 * fetched or parsed.
 */
async function fetchModuleContents(
    project: Project, storage: Storage): Promise<Map<string, ModuleContent | Error>> {
  const modules: Module[] = [project.robot, ...project.mechanisms, ...project.opModes];
  const contents = await Promise.all(modules.map(async (module): Promise<ModuleContent | Error> => {
    try {
      return parseModuleContentText(await storage.fetchFileContentText(module.modulePath));
    } catch (error) {
      return error instanceof Error ? error : new Error(String(error));
    }
  }));
  const moduleContents = new Map<string, ModuleContent | Error>();
  modules.forEach((module, i) => moduleContents.set(module.moduleId, contents[i]));
  return moduleContents;
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

  const moduleContents = await fetchModuleContents(project, storage);
  const validModuleContents = new Map<string, ModuleContent>();
  for (const [moduleId, moduleContent] of moduleContents) {
    if (!(moduleContent instanceof Error)) {
      validModuleContents.set(moduleId, moduleContent);
    }
  }

  // Extract opmode details from all opmode modules and set on the generator
  // so the robot constructor can emit RegisterOpMode calls.
  const allOpModeDetails = project.opModes.map((opMode) => {
    const moduleContent = moduleContents.get(opMode.moduleId);
    if (!moduleContent || moduleContent instanceof Error) {
      throw moduleContent || new Error(`Missing content for ${opMode.className}`);
    }
    return getOpModeDetailsFromBlocksJson(moduleContent.getBlocks(), opMode.className);
  });
  extendedPythonGenerator.setAllOpModeDetails(
    allOpModeDetails.filter((d): d is NonNullable<typeof d> => d !== null)
  );

  // The robot code reports usage with wpiutil.report_usage.
  extendedPythonGenerator.setUsageReportJson(
      JSON.stringify(createUsageReport(project, validModuleContents)));
  try {
    for (const module of [project.robot, ...project.mechanisms, ...project.opModes]) {
      const result = generatePythonForModule(module, moduleContents.get(module.moduleId)!);
      moduleResults.push(result);
      if (!result.success) {
        errorCount++;
      }
    }
  } finally {
    extendedPythonGenerator.setUsageReportJson(null);
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
