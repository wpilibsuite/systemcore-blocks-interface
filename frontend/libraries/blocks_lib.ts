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
 *   python_data/*.json - optional python modules and classes, in the format of the generated
 *                        robotpy_data.json, that the library's blocks and components use
 *   samples/<SampleName>/*.json - optional sample projects that are shown with the built-in samples
 *   locales/<language>.json - optional translations for the strings that are shown to the user
 *
 * The backend has an equivalent parser in backend/blocks_lib.py. Keep them in sync.
 */

import JSZip from 'jszip';
import * as semver from 'semver';
import * as toolboxItems from '../toolbox/items';
import {
    ArgData,
    ClassData,
    FunctionData,
    ModuleData,
    PythonData } from '../blocks/utils/python_json_types';

declare const __APP_VERSION__: string;

export const BLOCKS_LIB_FILE_EXTENSION = '.blocks_lib';

const METADATA_FILE = 'metadata.json';
const WHEELS_DIR = 'wheels';
const TOOLBOXES_DIR = 'toolboxes';
const COMPONENTS_DIR = 'components';
const PYTHON_DATA_DIR = 'python_data';
const SAMPLES_DIR = 'samples';
const LOCALES_DIR = 'locales';

/** The locale that has to have every message, and that is used when a message isn't translated. */
export const DEFAULT_LOCALE = 'en';

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
const LOCALE_FILENAME_PATTERN = /^[a-z]{2,3}(-[A-Za-z0-9]+)?\.json$/;
// A string that is exactly %{KEY} is a reference to a message in the library's locale files. KEY is
// a dotted path into the JSON, like the keys in the app's locale files.
const REFERENCE_PATTERN = /^%\{([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*)\}$/;

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
   * Maps each python data filename to the python modules and classes it contains. These are the
   * modules, classes, and enums that the library's blocks and components use. Libraries installed
   * before python data was supported don't have this.
   */
  pythonData?: {[filename: string]: PythonData};
  /**
   * Maps each sample name to the sample's files. Each file is a project file, like
   * Robot.robot.json or project.info.json, or description.json, which has the description and tags
   * of the sample. Libraries installed before samples were supported don't have this.
   */
  samples?: {[sampleName: string]: {[filename: string]: any}};
  /**
   * Maps each language, like "en" or "es", to the library's messages in that language. Libraries
   * installed before translations were supported don't have this.
   */
  locales?: {[language: string]: LocaleMessages};
  /** The filenames of the wheels. */
  wheels: string[];
  /** The top level python packages and modules provided by the wheels. */
  pythonModules: string[];
}

/** The messages in a locale file. Messages can be grouped in nested objects. */
export interface LocaleMessages {
  [key: string]: string | LocaleMessages;
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

/**
 * Returns the name of the library that is shown to the user, before it is translated. Use
 * library_i18n.getLocalizedDisplayName to show it.
 */
export function getDisplayName(metadata: LibraryMetadata): string {
  return metadata.displayName || metadata.name;
}

/** Returns the key if the text is a reference to a message, like %{KEY}, otherwise null. */
export function getReferenceKey(text: unknown): string | null {
  if (typeof text !== 'string') {
    return null;
  }
  const match = REFERENCE_PATTERN.exec(text);
  return match ? match[1] : null;
}

// A reference that also has the name of the library whose locale files have the message, like
// %{library_name:KEY}. Tooltips are saved in the blocks in users' projects, so they are saved as
// qualified references and translated when they are shown.
const QUALIFIED_REFERENCE_PATTERN =
    /^%\{([A-Za-z0-9][A-Za-z0-9_.-]{0,99}):([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*)\}$/;

/**
 * Returns the text with a reference to a message, like %{KEY}, changed to a reference that also has
 * the library name, like %{library_name:KEY}. Other text is returned unchanged.
 */
export function qualifyReference(libraryName: string, text: string): string {
  const key = getReferenceKey(text);
  return key ? `%{${libraryName}:${key}}` : text;
}

/** Returns the library name and key of a qualified reference, or null if the text isn't one. */
export function parseQualifiedReference(text: string): {libraryName: string, key: string} | null {
  const match = QUALIFIED_REFERENCE_PATTERN.exec(text);
  return match ? {libraryName: match[1], key: match[2]} : null;
}

/** Returns the message with the given dotted key, or undefined if there isn't one. */
export function lookupMessage(messages: LocaleMessages | undefined, key: string): string | undefined {
  let value: string | LocaleMessages | undefined = messages;
  for (const part of key.split('.')) {
    if (typeof value !== 'object' || value === null) {
      return undefined;
    }
    value = value[part];
  }
  return typeof value === 'string' ? value : undefined;
}

/**
 * Returns a copy of the toolbox or component class with the given function applied to each string
 * that can be translated: the "name" of each category, the "text" of each label, and every
 * "tooltip". The function is also given the name of the property, like "tooltip".
 */
export function mapTranslatableStrings<T>(
    value: T, map: (text: string, property: string) => string): T {
  if (Array.isArray(value)) {
    return value.map(item => mapTranslatableStrings(item, map)) as T;
  }
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  const source = value as any;
  const result: any = {};
  for (const key in source) {
    const child = source[key];
    if (typeof child === 'string' && (key === 'tooltip' ||
        (key === 'name' && source.kind === 'category') ||
        (key === 'text' && source.kind === 'label'))) {
      result[key] = map(child, key);
    } else {
      result[key] = mapTranslatableStrings(child, map);
    }
  }
  return result;
}

/** Returns the keys of the messages that the library refers to. */
export function getReferencedKeys(library: Library): Set<string> {
  const keys = new Set<string>();
  const add = (text: unknown) => {
    const key = getReferenceKey(text);
    if (key) {
      keys.add(key);
    }
  };
  const metadata = library.metadata;
  [metadata.displayName, metadata.summary, metadata.details].forEach(add);
  const visit = (text: string) => {
    add(text);
    return text;
  };
  mapTranslatableStrings(library.toolboxes, visit);
  mapTranslatableStrings(library.components || {}, visit);
  for (const files of Object.values(library.samples || {})) {
    const description = files[SAMPLE_DESCRIPTION_FILE];
    if (description) {
      add(description.description);
      (Array.isArray(description.tags) ? description.tags : []).forEach(add);
    }
  }
  return keys;
}

function validateLocale(messages: any, filename: string): LocaleMessages {
  const check = (value: any): boolean =>
      typeof value === 'string' ||
      (typeof value === 'object' && value !== null && !Array.isArray(value) &&
       Object.values(value).every(check));
  if (typeof messages !== 'object' || messages === null || Array.isArray(messages) || !check(messages)) {
    throw new BlocksLibError(`${filename} must contain a JSON object whose values are strings or objects`);
  }
  return messages as LocaleMessages;
}

/** Checks that every message the library refers to is in the default locale. */
function validateReferences(library: Library): void {
  const defaultMessages = library.locales?.[DEFAULT_LOCALE];
  for (const key of getReferencedKeys(library)) {
    if (!defaultMessages) {
      throw new BlocksLibError(
          `The library refers to the message "${key}", but it doesn't have ${LOCALES_DIR}/${DEFAULT_LOCALE}.json`);
    }
    if (lookupMessage(defaultMessages, key) === undefined) {
      throw new BlocksLibError(`"${key}" is missing from ${LOCALES_DIR}/${DEFAULT_LOCALE}.json`);
    }
  }
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

function isJsonObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Checks that classData is a class in the format of the generated python data. */
function validateClass(classData: any, where: string): void {
  if (!isJsonObject(classData)) {
    throw new BlocksLibError(`${where} must contain a JSON object`);
  }
  if (typeof classData.moduleName !== 'string' || !classData.moduleName ||
      typeof classData.className !== 'string' ||
      !classData.className.startsWith(classData.moduleName + '.')) {
    throw new BlocksLibError(
        `${where} must have a "moduleName" and a "className" that starts with the moduleName`);
  }
  for (const field of ['constructors', 'instanceMethods', 'staticMethods', 'instanceVariables',
      'classVariables', 'enums']) {
    if (field in classData && !Array.isArray(classData[field])) {
      throw new BlocksLibError(`"${field}" in ${where} must be an array`);
    }
  }
}

function validateComponent(component: any, filename: string): ClassData {
  validateClass(component, filename);
  if (!Array.isArray(component.constructors) ||
      !component.constructors.some((c: any) => c && c.isComponent === true && Array.isArray(c.componentArgs))) {
    throw new BlocksLibError(
        `${filename} must have a constructor with "isComponent": true and "componentArgs"`);
  }
  return component as ClassData;
}

/** Checks that the python data is in the format of the generated robotpy_data.json. */
function validatePythonData(pythonData: any, filename: string): PythonData {
  if (!isJsonObject(pythonData)) {
    throw new BlocksLibError(`${filename} must contain a JSON object`);
  }
  for (const field of ['modules', 'classes']) {
    if (field in pythonData && !Array.isArray(pythonData[field])) {
      throw new BlocksLibError(`"${field}" in ${filename} must be an array`);
    }
  }
  (pythonData.modules || []).forEach((module: any, index: number) => {
    const where = `modules[${index}] in ${filename}`;
    if (!isJsonObject(module)) {
      throw new BlocksLibError(`${where} must contain a JSON object`);
    }
    if (typeof module.moduleName !== 'string' || !module.moduleName) {
      throw new BlocksLibError(`${where} must have a "moduleName"`);
    }
    for (const field of ['functions', 'moduleVariables', 'enums']) {
      if (field in module && !Array.isArray(module[field])) {
        throw new BlocksLibError(`"${field}" in ${where} must be an array`);
      }
    }
  });
  (pythonData.classes || []).forEach((classData: any, index: number) => {
    validateClass(classData, `classes[${index}] in ${filename}`);
  });
  const aliases = pythonData.aliases ?? {};
  if (!isJsonObject(aliases) || !Object.values(aliases).every(value => typeof value === 'string')) {
    throw new BlocksLibError(`"aliases" in ${filename} must be an object whose values are strings`);
  }
  const subclasses = pythonData.subclasses ?? {};
  if (!isJsonObject(subclasses) || !Object.values(subclasses).every(value =>
      Array.isArray(value) && value.every(name => typeof name === 'string'))) {
    throw new BlocksLibError(
        `"subclasses" in ${filename} must be an object whose values are arrays of strings`);
  }
  return pythonData as PythonData;
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
 * Returns a copy of the component class from the library with the given name, with the optional
 * fields filled in so that it can be used like the classes generated from RobotPy, and with the
 * references to messages in its tooltips qualified with the library name.
 */
export function normalizeComponentClass(component: ClassData, libraryName: string): ClassData {
  component = mapTranslatableStrings(component, text => qualifyReference(libraryName, text));
  return {
    ...normalizeClass(component),
    isComponent: true,
  };
}

/**
 * Returns a copy of the python data from a library with the optional fields filled in, so that it
 * can be used like the python data generated from RobotPy. Its classes aren't components, since a
 * library's components are in its components directory.
 */
export function normalizePythonData(pythonData: PythonData): PythonData {
  return {
    modules: (pythonData.modules || []).map((moduleData): ModuleData => ({
      ...moduleData,
      moduleVariables: moduleData.moduleVariables || [],
      functions: (moduleData.functions || []).map(f => normalizeFunction(f, '', 'None')),
      enums: moduleData.enums || [],
    })),
    classes: (pythonData.classes || []).map(classData => ({
      ...normalizeClass(classData),
      isComponent: false,
    })),
    aliases: pythonData.aliases || {},
    subclasses: pythonData.subclasses || {},
  };
}

function normalizeClass(classData: ClassData): ClassData {
  const className = classData.className;
  return {
    ...classData,
    classVariables: classData.classVariables || [],
    instanceVariables: classData.instanceVariables || [],
    constructors: (classData.constructors || []).map(f => normalizeFunction(f, className, className)),
    instanceMethods: (classData.instanceMethods || []).map(f => normalizeFunction(f, className, 'None')),
    staticMethods: (classData.staticMethods || []).map(f => normalizeFunction(f, className, 'None')),
    enums: classData.enums || [],
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
  const pythonData: {[filename: string]: PythonData} = {};
  const samples: {[sampleName: string]: {[filename: string]: any}} = {};
  const locales: {[language: string]: LocaleMessages} = {};
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
    } else if (directory === LOCALES_DIR && LOCALE_FILENAME_PATTERN.test(filename)) {
      locales[filename.substring(0, filename.length - '.json'.length)] =
          validateLocale(await parseJson(zip, name), `${LOCALES_DIR}/${filename}`);
    } else if (directory === COMPONENTS_DIR && JSON_FILENAME_PATTERN.test(filename)) {
      components[filename] = validateComponent(await parseJson(zip, name), `${COMPONENTS_DIR}/${filename}`);
    } else if (directory === PYTHON_DATA_DIR && JSON_FILENAME_PATTERN.test(filename)) {
      pythonData[filename] = validatePythonData(await parseJson(zip, name), `${PYTHON_DATA_DIR}/${filename}`);
    }
  }

  if (Object.keys(toolboxes).length === 0 && Object.keys(components).length === 0 &&
      Object.keys(samples).length === 0) {
    throw new BlocksLibError(
        `The library must contain at least one ${TOOLBOXES_DIR}/*.json, ${COMPONENTS_DIR}/*.json, ` +
        `or ${SAMPLES_DIR}/<SampleName>/*.json file`);
  }
  validateSamples(samples);

  const library: Library = {
    metadata,
    toolboxes,
    components,
    pythonData,
    samples,
    locales,
    wheels,
    pythonModules: [...pythonModules].sort(),
  };
  validateReferences(library);
  return library;
}
