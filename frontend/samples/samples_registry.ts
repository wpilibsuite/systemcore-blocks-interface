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

import * as storageNames from '../storage/names';

// Each sample lives in its own directory under frontend/samples/, in the same file format as a
// stored project (project.info.json, Robot.robot.json, *.mechanism.json, *.opmode.json), plus a
// description.json that isn't part of the normal project format.

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

function buildSamples(): Sample[] {
  const samplesByName: { [sampleName: string]: Sample } = {};

  for (const path in globbedFiles) {
    const match = /^\.\/([^/]+)\/([^/]+)$/.exec(path);
    if (!match) {
      continue;
    }
    const [, sampleName, fileName] = match;
    if (!samplesByName[sampleName]) {
      samplesByName[sampleName] = {
        sampleName,
        description: '',
        tags: [],
        files: {},
        moduleFiles: [],
      };
    }
    const sample = samplesByName[sampleName];
    const content = globbedFiles[path].default;

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

  const samples = Object.values(samplesByName);
  samples.forEach((sample) => {
    sample.moduleFiles.sort((a, b) => a.className.localeCompare(b.className));
  });
  samples.sort((a, b) => a.sampleName.localeCompare(b.sampleName));
  return samples;
}

const samples: Sample[] = buildSamples();

/** Returns the list of available samples. */
export function listSamples(): Sample[] {
  return samples;
}
