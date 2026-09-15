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
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as blocksLib from '../libraries/blocks_lib';
import * as storageNames from '../storage/names';

// Each sample lives in its own directory under frontend/samples/, in the same file format as a
// stored project (project.info.json, Robot.robot.json, *.mechanism.json, *.opmode.json), plus a
// description.json that isn't part of the normal project format. Third party libraries can also
// have samples, in the same format, in their samples/ directory.

/** A single module file within a sample (e.g. a mechanism or opmode). */
export interface SampleModuleFile {
  fileName: string;
  className: string;
  moduleType: string; // storageModule.ModuleType, kept as a plain string to avoid a circular import.
}

/** A sample robot that can be previewed, copied as a new project, or mined for mechanisms. */
export interface Sample {
  sampleName: string;
  description: string;
  tags: string[];
  // fileName (e.g. 'Robot.robot.json') -> file content text, as it would be stored in a project
  // directory. Includes project.info.json and every module file, but not description.json.
  files: { [fileName: string]: string };
  moduleFiles: SampleModuleFile[];
  // The metadata of the library that the sample came from, or undefined for a built in sample.
  library?: blocksLib.LibraryMetadata;
}

interface DescriptionJson {
  description?: string;
  tags?: string[];
}

const DESCRIPTION_FILE_NAME = 'description.json';

// Eagerly bundle every JSON file under each sample's directory at build time so that no runtime
// directory listing (which the Storage abstraction doesn't support for this static content) is
// needed.
const globbedFiles = import.meta.glob('./*/*.json', { eager: true }) as {
  [path: string]: { default: unknown };
};

/** Returns the sample made from the given files, keyed by file name, with their parsed contents. */
function buildSample(sampleName: string, filesContent: { [fileName: string]: unknown }): Sample {
  const sample: Sample = {
    sampleName,
    description: '',
    tags: [],
    files: {},
    moduleFiles: [],
  };
  for (const fileName in filesContent) {
    const content = filesContent[fileName];

    if (fileName === DESCRIPTION_FILE_NAME) {
      const description = content as DescriptionJson;
      sample.description = description.description || '';
      sample.tags = description.tags || [];
      continue;
    }

    sample.files[fileName] = JSON.stringify(content, null, 2);

    if (storageNames.isValidModuleFileName(fileName)) {
      sample.moduleFiles.push({
        fileName,
        className: storageNames.getClassName(fileName),
        moduleType: storageNames.getModuleType(fileName),
      });
    }
  }
  sample.moduleFiles.sort((a, b) => a.className.localeCompare(b.className));
  return sample;
}

function compareSamples(a: Sample, b: Sample): number {
  return a.sampleName.localeCompare(b.sampleName);
}

function buildSamples(): Sample[] {
  const filesBySampleName: { [sampleName: string]: { [fileName: string]: unknown } } = {};

  for (const path in globbedFiles) {
    const match = /^\.\/([^/]+)\/([^/]+)$/.exec(path);
    if (!match) {
      continue;
    }
    const [, sampleName, fileName] = match;
    filesBySampleName[sampleName] = filesBySampleName[sampleName] || {};
    filesBySampleName[sampleName][fileName] = globbedFiles[path].default;
  }

  return Object.entries(filesBySampleName)
      .map(([sampleName, files]) => buildSample(sampleName, files))
      .sort(compareSamples);
}

const samples: Sample[] = buildSamples();

/**
 * Returns the list of available samples: the built in samples, followed by the samples of the
 * given libraries. Samples from libraries that don't work with this version of blocks are left
 * out.
 */
export function listSamples(libraries: blocksLib.Library[] = []): Sample[] {
  const librarySamples = libraries
      .filter((library) => blocksLib.isCompatible(library.metadata))
      .flatMap((library) => Object.entries(library.samples || {}).map(([sampleName, files]) => ({
        ...buildSample(sampleName, files),
        library: library.metadata,
      })))
      .sort(compareSamples);
  return [...samples, ...librarySamples];
}
