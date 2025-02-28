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

import { Block } from "../toolbox/items";
import * as commonStorage from '../storage/common_storage';


export function createGeneratorContext(): GeneratorContext {
  return new GeneratorContext();
}

export class GeneratorContext {
  private module: commonStorage.Module | null = null;

  // The exported blocks for the current module.
  private exportedBlocks: Block[] = [];

  // Key is the mrc_class_method_def block's NAME field, value is the python method name.
  private classMethodNames: {[key: string]: string} = Object.create(null);

  setModule(module: commonStorage.Module | null) {
    this.module = module;
    this.clear();
  }

  clear(): void {
    this.clearExportedBlocks();
    this.clearClassMethodNames();
  }

  getClassName(): string {
    if (this.module.moduleType === commonStorage.MODULE_TYPE_PROJECT) {
      return 'Robot';
    }

    // TODO(lizlooney): className should be a field in commonStorage.Module.
    // Until that happens, we'll figure it out now from the module name.

    let className = '';
    let nextCharUpper = true;
    for (let i = 0; i < this.module.moduleName.length; i++) {
      const char = this.module.moduleName.charAt(i);
      if (char !== '_') {
        className += nextCharUpper ? char.toUpperCase() : char;
      }
      nextCharUpper = (char === '_');
    }
    return className;
  }

  getClassParent(): string {
    if (this.module.moduleType === commonStorage.MODULE_TYPE_PROJECT) {
      return 'RobotBase';
    }
    if (this.module.moduleType === commonStorage.MODULE_TYPE_OPMODE) {
      return 'OpMode';
    }
    if (this.module.moduleType === commonStorage.MODULE_TYPE_MECHANISM) {
      return 'Mechanism';
    }
    return '';
  }

  clearExportedBlocks() {
    this.exportedBlocks.length = 0;
  }

  setExportedBlocks(exportedBlocks: Blocks[]) {
    this.exportedBlocks.length = 0;
    this.exportedBlocks.push(...exportedBlocks);
  }

  getExportedBlocks(): Block[] {
    return this.exportedBlocks;
  }

  clearClassMethodNames() {
    this.classMethodNames = Object.create(null);
  }

  addClassMethodName(nameFieldValue: string, methodName: string) {
    if (nameFieldValue !== methodName) {
      this.classMethodNames[nameFieldValue] = methodName;
    }
  }

  getClassMethodName(nameFieldValue: string): string | null {
    if (this.classMethodNames[nameFieldValue]) {
      return this.classMethodNames[nameFieldValue];
    }
    return nameFieldValue;
  }
}
