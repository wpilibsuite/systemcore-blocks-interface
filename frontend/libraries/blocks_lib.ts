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
 * @fileoverview Types and parsing for third party .blocks_lib libraries.
 *
 * A .blocks_lib file is a zip file containing:
 *   metadata.json    - see LibraryMetadata
 *   wheels/*.whl     - python wheels installed on the robot when a project uses the library
 *   toolboxes/*.json - blockly toolbox categories, or flyout toolboxes whose blocks go directly
 *                      in the library's category, that are added to the toolbox
 *   components/*.json - optional component classes that are added to the components toolbox
 *   samples/<SampleName>/*.json - optional sample projects that are shown with the built in samples
 *
 * The backend has an equivalent parser in backend/blocks_lib.py. Keep them in sync.
 */

import JSZip from 'jszip';
import * as semver from 'semver';
import * as toolboxItems from '../toolbox/items';
import { ArgData, ClassData, FunctionData } from '../blocks/utils/python_json_types';

declare const __APP_VERSION__: string;

export const BLOCKS_LIB_FILE_EXTENSION = '.blocks_lib';

const METADATA_FILE = 'metadata.json';
const WHEELS_DIR = 'wheels';
const TOOLBOXES_DIR = 'toolboxes';
const COMPONENTS_DIR = 'components';
const SAMPLES_DIR = 'samples';

// The files in a sample are the files of a project, plus an optional description.json.
const SAMPLE_PROJECT_INFO_FILE = 'project.info.json';
const SAMPLE_DESCRIPTION_FILE = 'description.json';
const SAMPLE_ROBOT_FILE = 'Robot.robot.json';

export const SUPPORTED_FORMAT_VERSIONS = [1];

const LIBRARY_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$/;
const WHEEL_FILENAME_PATTERN = /^([A-Za-z0-9_.]+)-([^-]+)(-\d[^-]*)?-[^-]+-[^-]+-[^-]+\.whl$/;
const JSON_FILENAME_PATTERN = /^[A-Za-z0-9_.-]+\.json$/;
const PYTHON_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
// Sample names are used as project names, and sample files as project files. See storage/names.ts.
const SAMPLE_NAME_PATTERN = /^[A-Z][A-Za-z0-9_]*$/;
const SAMPLE_MODULE_FILENAME_PATTERN = /^[A-Z][A-Za-z0-9_]*\.(robot|mechanism|opmode)\.json$/;

export interface LibraryMetadata {
  /** The version of the .blocks_lib format. */
  formatVersion: number;
  /** Unique name of the library. Installing a library with the same name replaces it. */
  name: string;
  /** Name to show to the user. Defaults to name. */
  displayName?: string;
  /** The library's brand color, as #RRGGBB. Used for the library's categories in the toolbox. */
  color?: string;
  /** The version of the library. */
  version: string;
  author: string;
  /** One line description. */
  summary: string;
  /** Longer description. */
  details: string;
  /** A semver range of the versions of blocks that the library works with, for example ">=0.4.0". */
  blocksVersion: string;
}

/**
 * A toolbox file with no categories. Its contents go directly in the category named after the
 * library, for libraries that don't want subcategories.
 */
export interface FlyoutToolbox {
  kind: 'flyoutToolbox';
  contents: toolboxItems.ContentsType[];
}

export type LibraryToolboxFile = toolboxItems.Category | FlyoutToolbox;

export function isFlyoutToolbox(toolbox: LibraryToolboxFile): toolbox is FlyoutToolbox {
  return toolbox.kind === 'flyoutToolbox';
}

export interface Library {
  metadata: LibraryMetadata;
  /** Maps each toolbox filename to the category or flyout toolbox it contains. */
  toolboxes: {[filename: string]: LibraryToolboxFile};
  /**
   * Maps each component filename to the component class it contains. Libraries installed before
   * components were supported don't have this.
   */
  components?: {[filename: string]: ClassData};
  /**
   * Maps each sample name to the sample's files. Each file is a project file, like
   * Robot.robot.json or project.info.json, or description.json, which has the description and tags
   * of the sample. Libraries installed before samples were supported don't have this.
   */
  samples?: {[sampleName: string]: {[filename: string]: any}};
  /** The filenames of the wheels. */
  wheels: string[];
  /** The top level python packages and modules provided by the wheels. */
  pythonModules: string[];
}

/** Thrown when a .blocks_lib file is not valid. */
export class BlocksLibError extends Error {}

const REQUIRED_METADATA_FIELDS: {[field: string]: 'number' | 'string'} = {
  formatVersion: 'number',
  name: 'string',
  version: 'string',
  author: 'string',
  summary: 'string',
  details: 'string',
  blocksVersion: 'string',
};

export function getDisplayName(metadata: LibraryMetadata): string {
  return metadata.displayName || metadata.name;
}

export function getBlocksVersion(): string {
  return __APP_VERSION__;
}

/** Returns true if the library works with this version of blocks. */
export function isCompatible(metadata: LibraryMetadata): boolean {
  const range = semver.validRange(metadata.blocksVersion);
  const version = semver.coerce(getBlocksVersion());
  if (!range || !version) {
    return false;
  }
  return semver.satisfies(version, range);
}

/**
 * Returns the key used to identify a library, or a category within a library, in the set of
 * hidden toolbox keys. categoryNames is the path of category names from the top level category in
 * the toolbox file down to the category.
 *
 * Library keys have one element, the components group has two, and categories and components have
 * three or more. Toolbox filenames end with .json, so they can't be confused with
 * COMPONENTS_KEY_ELEMENT.
 */
export function getToolboxKey(
    libraryName: string, toolboxFilename?: string, categoryNames: string[] = []): string {
  if (toolboxFilename === undefined) {
    return JSON.stringify([libraryName]);
  }
  return JSON.stringify([libraryName, toolboxFilename, ...categoryNames]);
}

const COMPONENTS_KEY_ELEMENT = ':components';

/** Returns the key for the group of all components in a library. */
export function getComponentsGroupKey(libraryName: string): string {
  return JSON.stringify([libraryName, COMPONENTS_KEY_ELEMENT]);
}

/** Returns the key for a component in a library. */
export function getComponentKey(libraryName: string, componentFilename: string): string {
  return JSON.stringify([libraryName, COMPONENTS_KEY_ELEMENT, componentFilename]);
}

function validateMetadata(metadata: any): LibraryMetadata {
  if (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata)) {
    throw new BlocksLibError(`${METADATA_FILE} must contain a JSON object`);
  }
  for (const field in REQUIRED_METADATA_FIELDS) {
    const expectedType = REQUIRED_METADATA_FIELDS[field];
    if (typeof metadata[field] !== expectedType ||
        (expectedType === 'number' && !Number.isInteger(metadata[field]))) {
      throw new BlocksLibError(`${METADATA_FILE} is missing "${field}" or it is not a ${expectedType}`);
    }
  }
  if (!SUPPORTED_FORMAT_VERSIONS.includes(metadata.formatVersion)) {
    throw new BlocksLibError(`Unsupported formatVersion ${metadata.formatVersion}`);
  }
  if (!LIBRARY_NAME_PATTERN.test(metadata.name)) {
    throw new BlocksLibError(`Invalid library name "${metadata.name}"`);
  }
  if ('displayName' in metadata && typeof metadata.displayName !== 'string') {
    throw new BlocksLibError(`"displayName" in ${METADATA_FILE} must be a string`);
  }
  if ('color' in metadata && (typeof metadata.color !== 'string' || !COLOR_PATTERN.test(metadata.color))) {
    throw new BlocksLibError(`"color" in ${METADATA_FILE} must be a color like "#1E88E5"`);
  }
  return metadata as LibraryMetadata;
}

function validateToolbox(toolbox: any, filename: string): LibraryToolboxFile {
  if (typeof toolbox === 'object' && toolbox !== null && toolbox.kind === 'flyoutToolbox') {
    if (!Array.isArray(toolbox.contents) ||
        toolbox.contents.some((item: any) => !item || item.kind === 'category')) {
      throw new BlocksLibError(`${filename} must have "contents" without any categories`);
    }
    return toolbox as FlyoutToolbox;
  }
  if (typeof toolbox !== 'object' || toolbox === null || toolbox.kind !== 'category') {
    throw new BlocksLibError(
        `${filename} must contain a JSON object with "kind": "category" or "kind": "flyoutToolbox"`);
  }
  if (typeof toolbox.name !== 'string' || !toolbox.name) {
    throw new BlocksLibError(`${filename} must have a "name"`);
  }
  return toolbox as toolboxItems.Category;
}

function validateComponent(component: any, filename: string): ClassData {
  if (typeof component !== 'object' || component === null || Array.isArray(component)) {
    throw new BlocksLibError(`${filename} must contain a JSON object`);
  }
  if (typeof component.moduleName !== 'string' || !component.moduleName ||
      typeof component.className !== 'string' ||
      !component.className.startsWith(component.moduleName + '.')) {
    throw new BlocksLibError(
        `${filename} must have a "moduleName" and a "className" that starts with the moduleName`);
  }
  if (!Array.isArray(component.constructors) ||
      !component.constructors.some((c: any) => c && c.isComponent === true && Array.isArray(c.componentArgs))) {
    throw new BlocksLibError(
        `${filename} must have a constructor with "isComponent": true and "componentArgs"`);
  }
  for (const field of ['instanceMethods', 'staticMethods', 'instanceVariables', 'classVariables', 'enums']) {
    if (field in component && !Array.isArray(component[field])) {
      throw new BlocksLibError(`"${field}" in ${filename} must be an array`);
    }
  }
  return component as ClassData;
}

function isSampleFilename(filename: string): boolean {
  return filename === SAMPLE_PROJECT_INFO_FILE || filename === SAMPLE_DESCRIPTION_FILE ||
      SAMPLE_MODULE_FILENAME_PATTERN.test(filename);
}

function validateSamples(samples: {[sampleName: string]: {[filename: string]: any}}): void {
  for (const sampleName in samples) {
    const files = samples[sampleName];
    for (const filename of [SAMPLE_PROJECT_INFO_FILE, SAMPLE_ROBOT_FILE]) {
      if (!(filename in files)) {
        throw new BlocksLibError(`${SAMPLES_DIR}/${sampleName} must have a ${filename} file`);
      }
    }
    for (const filename in files) {
      const content = files[filename];
      if (typeof content !== 'object' || content === null || Array.isArray(content)) {
        throw new BlocksLibError(`${SAMPLES_DIR}/${sampleName}/${filename} must contain a JSON object`);
      }
    }
  }
}

function normalizeArgs(args: any): ArgData[] {
  return (args || []).map((arg: any) => ({
    name: arg.name,
    type: arg.type || '',
    defaultValue: arg.defaultValue || '',
  }));
}

function normalizeFunction(functionData: any, className: string, returnType: string): FunctionData {
  return {
    ...functionData,
    tooltip: functionData.tooltip || '',
    returnType: functionData.returnType || returnType,
    args: normalizeArgs(functionData.args),
    declaringClassName: functionData.declaringClassName || className,
    ...(functionData.componentArgs ? {componentArgs: normalizeArgs(functionData.componentArgs)} : {}),
  };
}

/**
 * Returns a copy of the component class from a library, with the optional fields filled in so
 * that it can be used like the classes generated from RobotPy.
 */
export function normalizeComponentClass(component: ClassData): ClassData {
  const className = component.className;
  return {
    ...component,
    classVariables: component.classVariables || [],
    instanceVariables: component.instanceVariables || [],
    constructors: component.constructors.map(f => normalizeFunction(f, className, className)),
    instanceMethods: (component.instanceMethods || []).map(f => normalizeFunction(f, className, 'None')),
    staticMethods: (component.staticMethods || []).map(f => normalizeFunction(f, className, 'None')),
    enums: component.enums || [],
    isComponent: true,
  };
}

async function parseJson(zip: JSZip, path: string): Promise<any> {
  const text = await zip.file(path)!.async('string');
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new BlocksLibError(`${path} is not valid JSON: ${e instanceof Error ? e.message : e}`);
  }
}

/**
 * Returns the prefix of the directory in the zip that contains metadata.json. Zipping a folder
 * puts everything inside a single top level directory, so allow that too.
 */
function findRootPrefix(names: string[]): string {
  if (names.includes(METADATA_FILE)) {
    return '';
  }
  const candidates = names.filter(name =>
      name.endsWith('/' + METADATA_FILE) &&
      name.split('/').length === 2 &&
      !name.startsWith('__MACOSX/'));
  if (candidates.length === 1) {
    return candidates[0].substring(0, candidates[0].length - METADATA_FILE.length);
  }
  throw new BlocksLibError(`${METADATA_FILE} was not found in the library`);
}

async function getWheelTopLevelModules(wheelData: ArrayBuffer): Promise<string[]> {
  const wheel = await JSZip.loadAsync(wheelData);
  const modules = new Set<string>();
  for (const name of Object.keys(wheel.files)) {
    const parts = name.split('/');
    let top = parts[0];
    if (top.endsWith('.dist-info') || top.endsWith('.data')) {
      continue;
    }
    if (parts.length === 1) {
      if (!top.endsWith('.py')) {
        continue;
      }
      top = top.substring(0, top.length - '.py'.length);
    }
    if (PYTHON_IDENTIFIER_PATTERN.test(top)) {
      modules.add(top);
    }
  }
  return [...modules];
}

/** Parses and validates the contents of a .blocks_lib file. */
export async function parseBlocksLib(data: ArrayBuffer): Promise<Library> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch (e) {
    throw new BlocksLibError('The library is not a valid zip file');
  }
  const names = Object.keys(zip.files).filter(name => !zip.files[name].dir);
  const prefix = findRootPrefix(names);
  const metadata = validateMetadata(await parseJson(zip, prefix + METADATA_FILE));

  const toolboxes: {[filename: string]: LibraryToolboxFile} = {};
  const components: {[filename: string]: ClassData} = {};
  const samples: {[sampleName: string]: {[filename: string]: any}} = {};
  const wheels: string[] = [];
  const pythonModules = new Set<string>();

  for (const name of [...names].sort()) {
    if (!name.startsWith(prefix)) {
      continue;
    }
    const parts = name.substring(prefix.length).split('/');
    if (parts.length === 3 && parts[0] === SAMPLES_DIR) {
      const [, sampleName, filename] = parts;
      if (SAMPLE_NAME_PATTERN.test(sampleName) && isSampleFilename(filename)) {
        samples[sampleName] = samples[sampleName] || {};
        samples[sampleName][filename] = await parseJson(zip, name);
      }
      continue;
    }
    if (parts.length !== 2) {
      continue;
    }
    const [directory, filename] = parts;
    if (directory === WHEELS_DIR && filename.endsWith('.whl')) {
      if (!WHEEL_FILENAME_PATTERN.test(filename)) {
        throw new BlocksLibError(`Invalid wheel filename "${filename}"`);
      }
      wheels.push(filename);
      const wheelData = await zip.file(name)!.async('arraybuffer');
      try {
        (await getWheelTopLevelModules(wheelData)).forEach(m => pythonModules.add(m));
      } catch (e) {
        throw new BlocksLibError(`${filename} is not a valid wheel`);
      }
    } else if (directory === TOOLBOXES_DIR && JSON_FILENAME_PATTERN.test(filename)) {
      toolboxes[filename] = validateToolbox(await parseJson(zip, name), `${TOOLBOXES_DIR}/${filename}`);
    } else if (directory === COMPONENTS_DIR && JSON_FILENAME_PATTERN.test(filename)) {
      components[filename] = validateComponent(await parseJson(zip, name), `${COMPONENTS_DIR}/${filename}`);
    }
  }

  if (Object.keys(toolboxes).length === 0 && Object.keys(components).length === 0 &&
      Object.keys(samples).length === 0) {
    throw new BlocksLibError(
        `The library must contain at least one ${TOOLBOXES_DIR}/*.json, ${COMPONENTS_DIR}/*.json, ` +
        `or ${SAMPLES_DIR}/<SampleName>/*.json file`);
  }
  validateSamples(samples);

  return {
    metadata,
    toolboxes,
    components,
    samples,
    wheels,
    pythonModules: [...pythonModules].sort(),
  };
}
