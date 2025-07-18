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

import * as commonStorage from '../storage/common_storage';
import { CLASS_NAME_ROBOT_BASE, CLASS_NAME_OPMODE, CLASS_NAME_MECHANISM } from '../blocks/utils/python';


export function createGeneratorContext(): GeneratorContext {
  return new GeneratorContext();
}

export class GeneratorContext {
  private module: commonStorage.Module | null = null;

  // Has mechanisms (ie, needs in init)
  private hasHardware = false;

  setModule(module: commonStorage.Module | null) {
    this.module = module;
    this.clear();
  }

  getModuleType(): string | null {
    if (this.module) {
      return this.module.moduleType;
    }
    return null;
  }

  clear(): void {
    this.hasHardware= false;
  }

  setHasHardware():void{
    this.hasHardware = true;
  }

  getHasHardware():boolean{
    return this.hasHardware;
  }

  getClassName(): string {
    if (!this.module) {
      throw new Error('getClassName: this.module is null.');
    }
    return this.module.className;
  }

  getBaseClassName(): string {
    if (!this.module) {
      throw new Error('getParentClassName: this.module is null.');
    }
    if (this.module.moduleType === commonStorage.MODULE_TYPE_ROBOT) {
      return CLASS_NAME_ROBOT_BASE;
    }
    if (this.module.moduleType === commonStorage.MODULE_TYPE_OPMODE) {
      return CLASS_NAME_OPMODE;
    }
    if (this.module.moduleType === commonStorage.MODULE_TYPE_MECHANISM) {
      return CLASS_NAME_MECHANISM;
    }
    return '';
  }
}
