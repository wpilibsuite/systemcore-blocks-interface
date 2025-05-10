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

import { addEnumBlocks } from '../blocks/mrc_get_python_enum_value';
import {
    addClassVariableBlocks,
    addInstanceVariableBlocks,
    addModuleVariableBlocks } from '../blocks/mrc_get_python_variable';
import {
    addConstructorBlocks,
    addInstanceMethodBlocks,
    addModuleFunctionBlocks,
    addStaticMethodBlocks } from '../blocks/mrc_call_python_function';
import { robotPyData } from '../blocks/utils/robotpy_data';
import {
    ClassData,
    ModuleData,
    organizeVarDataByType,
    VariableGettersAndSetters } from '../blocks/utils/python_json_types';
import * as toolboxItems from './items';


export function getToolboxCategories(): toolboxItems.Category[] {
  const contents: toolboxItems.Category[] = [];

  const allCategories: {[key: string]: toolboxItems.Category} = {};
  const moduleCategories: {[key: string]: toolboxItems.Category} = {};
  const classCategories: {[key: string]: toolboxItems.Category} = {};

  // Process RobotPy modules.
  for (const moduleData of robotPyData.modules) {
    const path = moduleData.moduleName;
    const lastDot = path.lastIndexOf('.');
    const name = (lastDot != -1) ? path.substring(lastDot + 1) : path;

    const moduleCategory: toolboxItems.PythonModuleCategory = {
      kind: 'category',
      name: name,
      moduleName: moduleData.moduleName,
    };
    moduleCategory.contents = [];
    addModuleBlocks(moduleData, moduleCategory.contents);
    allCategories[path] = moduleCategory;
    moduleCategories[path] = moduleCategory;
  }

  // Process RobotPy classes.
  for (const classData of robotPyData.classes) {
    const path = classData.className;
    const lastDot = path.lastIndexOf('.');
    const name = (lastDot != -1) ? path.substring(lastDot + 1) : path;

    const classCategory: toolboxItems.PythonClassCategory = {
      kind: 'category',
      name: name,
      className: classData.className,
    };
    classCategory.contents = [];
    addClassBlocks(classData, classCategory.contents);
    allCategories[path] = classCategory;
    classCategories[path] = classCategory;
  }

  // Build the tree.
  // First add each class category to its parent.
  addCategoriesToParents(classCategories, allCategories, contents);
  // Then add module categories.
  addCategoriesToParents(moduleCategories, allCategories, contents);

  recursivelyRemoveEmptyCategories(contents);

  return contents;
}

function addModuleBlocks(moduleData: ModuleData, contents: toolboxItems.ContentsType[]) {
  // Module variable blocks.
  if (moduleData.moduleVariables.length) {
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(moduleData.moduleVariables);
    addModuleVariableBlocks(moduleData.moduleName, varsByType, contents);
  }

  // Module function blocks
  if (moduleData.functions.length) {
    addModuleFunctionBlocks(moduleData.moduleName, moduleData.functions, contents);
  }

  // Enum blocks
  if (moduleData.enums.length) {
    addEnumBlocks(moduleData.enums, contents);
  }
}

function addClassBlocks(classData: ClassData, contents: toolboxItems.ContentsType[]) {
  // Function blocks (constructors, instance methods, static methods)
  if (classData.constructors.length) {
    addConstructorBlocks(classData.moduleName, classData.constructors, contents);
  }
  if (classData.instanceMethods.length) {
    addInstanceMethodBlocks(classData.instanceMethods, contents);
  }
  if (classData.staticMethods.length) {
    addStaticMethodBlocks(classData.moduleName, classData.staticMethods, contents);
  }

  // Instance variable blocks
  if (classData.instanceVariables.length) {
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(classData.instanceVariables);
    addInstanceVariableBlocks(classData.className, varsByType, contents);
  }

  // Class variable blocks.
  if (classData.classVariables.length) {
    const varsByType: {[key: string]: VariableGettersAndSetters} =
        organizeVarDataByType(classData.classVariables);
    addClassVariableBlocks(classData.moduleName, classData.className, varsByType, contents);
  }

  // Enum blocks
  if (classData.enums.length) {
    addEnumBlocks(classData.enums, contents);
  }
}

function addCategoriesToParents(
    categoriesToProcess: {[key: string]: toolboxItems.Category},
    allCategories: {[key: string]: toolboxItems.Category},
    contents: toolboxItems.Category[]) {
  for (const path in categoriesToProcess) {
    const category = categoriesToProcess[path];
    const lastDot = path.lastIndexOf('.');
    const parentPath = (lastDot != -1) ? path.substring(0, lastDot) : '';
    if (parentPath) {
      const parentCategory = allCategories[parentPath];
      if (parentCategory.contents) {
        parentCategory.contents.push(category);
      }
    } else {
      contents.push(category);
    }
  }
}

function recursivelyRemoveEmptyCategories(contents: toolboxItems.ContentsType[]) {
  for (let i = contents.length - 1; i >= 0; i--) {
    if (contents[i].kind === 'category') {
      const category = contents[i] as toolboxItems.Category;
      if (category.contents) {
        if (category.contents.length) {
          recursivelyRemoveEmptyCategories(category.contents);
        }
        if (category.contents.length == 0) {
          contents.splice(i, 1);
        }
      }
    }
  }
}
