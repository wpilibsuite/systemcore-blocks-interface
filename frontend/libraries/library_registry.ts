// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Keeps track of the python modules, component classes, and python data provided by
 * installed third party libraries, so that blocks can tell whether the modules and classes they use
 * exist.
 */

import { setLibraryPythonData } from '../blocks/utils/python';
import { PythonData } from '../blocks/utils/python_json_types';
import { Library, normalizeComponentClass, normalizePythonData } from './blocks_lib';

const libraryPythonModules: Set<string> = new Set();
const librariesByName: Map<string, Library> = new Map();

export function setInstalledLibraries(libraries: Library[]): void {
  libraryPythonModules.clear();
  librariesByName.clear();
  for (const library of libraries) {
    library.pythonModules.forEach(m => libraryPythonModules.add(m));
    librariesByName.set(library.metadata.name, library);
  }
  // All installed component classes are registered, even the ones the user has hidden, so that
  // component blocks that are already in the user's projects keep working.
  setLibraryPythonData(collectPythonData(libraries));
}

/**
 * Returns the component classes and python data of the given libraries, combined into one
 * PythonData.
 */
export function collectPythonData(libraries: Library[]): PythonData {
  const pythonData = new PythonData();
  for (const library of libraries) {
    for (const component of Object.values(library.components || {})) {
      pythonData.classes.push(normalizeComponentClass(component, library.metadata.name));
    }
    for (const data of Object.values(library.pythonData || {}).map(normalizePythonData)) {
      pythonData.modules.push(...data.modules);
      pythonData.classes.push(...data.classes);
      Object.assign(pythonData.aliases, data.aliases);
      for (const [className, subclassNames] of Object.entries(data.subclasses)) {
        pythonData.subclasses[className] = [...(pythonData.subclasses[className] || []), ...subclassNames];
      }
    }
  }
  return pythonData;
}

/** Returns all installed libraries. */
export function getInstalledLibraries(): Library[] {
  return [...librariesByName.values()];
}

/** Returns the installed library with the given name, or undefined if it isn't installed. */
export function getInstalledLibrary(name: string): Library | undefined {
  return librariesByName.get(name);
}

/**
 * Returns true if the given module name, or dotted module/class name, belongs to a python package
 * or module provided by an installed library.
 */
export function isLibraryPythonModule(name: string): boolean {
  return libraryPythonModules.has(name.split('.')[0]);
}
