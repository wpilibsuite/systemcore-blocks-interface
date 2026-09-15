/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Keeps track of the python modules and component classes provided by installed
 * third party libraries, so that blocks can tell whether the modules and classes they use exist.
 */

import { setLibraryClasses } from '../blocks/utils/python';
import { Library, normalizeComponentClass } from './blocks_lib';

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
  setLibraryClasses(libraries.flatMap(library => Object.values(library.components || {}).map(
      component => normalizeComponentClass(component, library.metadata.name))));
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
