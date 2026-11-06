// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Finds the component classes that a project uses but that don't exist, for
 * example because the third party library that they come from isn't installed. These are the
 * classes that put "missing component class" warnings on component blocks and on the blocks that
 * call component methods.
 */

import * as callPythonFunctionBlock from '../mrc_call_python_function';
import * as commonStorage from '../../storage/common_storage';
import * as componentBlock from '../mrc_component';
import * as storageModuleContent from '../../storage/module_content';
import * as storageProject from '../../storage/project';
import { getClassData } from './python';

/** A component class that doesn't exist, and the modules that use it. */
export type MissingComponentClass = {
  className: string,
  /** The class names of the modules that use the component class, for example 'Robot'. */
  moduleNames: string[],
};

/**
 * Returns the names of the component classes used by the given blocks, which are in the Blockly
 * serialization format. Disabled blocks, and the blocks inside them, are left out, since they
 * don't produce any code.
 */
export function collectComponentClassNamesFromBlocksJson(blocks: {[key: string]: any}): Set<string> {
  const classNames = new Set<string>();
  const walk = (blockJson: any): void => {
    if (!blockJson || typeof blockJson !== 'object') {
      return;
    }
    const isDisabled = Array.isArray(blockJson.disabledReasons) &&
        blockJson.disabledReasons.length > 0;
    if (!isDisabled) {
      const extraState = blockJson.extraState || {};
      if (blockJson.type === componentBlock.BLOCK_NAME && extraState.className) {
        classNames.add(extraState.className);
      }
      if (blockJson.type === callPythonFunctionBlock.BLOCK_NAME && extraState.componentClassName) {
        classNames.add(extraState.componentClassName);
      }
      for (const inputName in blockJson.inputs || {}) {
        walk(blockJson.inputs[inputName]?.block);
      }
    }
    // The next block isn't inside this block, so it is checked even if this block is disabled.
    walk(blockJson.next?.block);
  };
  storageModuleContent.getTopLevelBlocksJson(blocks).forEach(walk);
  return classNames;
}

/**
 * Returns the component classes that are used by the given modules but don't exist, sorted by
 * class name. moduleNameToBlocks maps the class name of each module to its blocks.
 */
export function findMissingComponentClasses(
    moduleNameToBlocks: {[moduleName: string]: {[key: string]: any}}): MissingComponentClass[] {
  const classNameToModuleNames: {[className: string]: string[]} = {};
  for (const moduleName in moduleNameToBlocks) {
    for (const className of collectComponentClassNamesFromBlocksJson(moduleNameToBlocks[moduleName])) {
      if (!getClassData(className)) {
        (classNameToModuleNames[className] ??= []).push(moduleName);
      }
    }
  }
  return Object.keys(classNameToModuleNames).sort().map(className => ({
    className,
    moduleNames: classNameToModuleNames[className],
  }));
}

/**
 * Returns the component classes that are used by the given project but don't exist. The modules
 * are read from storage, so save the open modules first.
 */
export async function findProjectMissingComponentClasses(
    project: storageProject.Project,
    storage: commonStorage.Storage): Promise<MissingComponentClass[]> {
  const moduleNameToBlocks: {[moduleName: string]: {[key: string]: any}} = {};
  for (const module of [project.robot, ...project.mechanisms, ...project.opModes]) {
    const moduleContentText = await storage.fetchFileContentText(module.modulePath);
    moduleNameToBlocks[module.className] =
        storageModuleContent.parseModuleContentText(moduleContentText).getBlocks();
  }
  return findMissingComponentClasses(moduleNameToBlocks);
}
