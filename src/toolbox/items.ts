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

// author lizlooney@google.com (Liz Looney)

export class Item {
  kind: string;

  constructor(kind: string) {
    this.kind = kind;
  }
}

export class Sep extends Item {
  constructor() {
    super('sep');
  }
}

export class Label extends Item {
  text: string;

  constructor(text: string) {
    super('label');
    this.text = text;
  }
}

export class Block extends Item {
  /** The block type. */
  type: string;

  // For mutating the block.
  extraState?: {[key: string]: any};
  fields?: {[key: string]: any};
  inputs?: {[key: string]: any};

  constructor(
      type: string,
      extraState: {[key: string]: any} | null,
      fields: {[key: string]: any} | null,
      inputs: {[key: string]: any} | null) {
    super('block');
    this.type = type;
    if (extraState) {
      this.extraState = extraState;
    }
    if (fields) {
      this.fields = fields;
    }
    if (inputs) {
      this.inputs = inputs;
    }
  }
}

export type ContentsType = Sep | Label | Block | Category;

export class Category extends Item  {
  /** The category name. */
  name: string;
  categorystyle?: string;
  custom?: string;

  /** The blocks for this category. */
  contents: ContentsType[] = [];

  constructor(name: string, contents: ContentsType[], categorystyle?: string, custom?: string) {
    super('category');
    this.name = name;
    if (contents) {
      this.contents = contents;
    }
    if (categorystyle) {
      this.categorystyle = categorystyle;
    }
    if (custom) {
      this.custom = custom;
    }
  }
}

export class PythonModuleCategory extends Category {
  moduleName: string;

  constructor(moduleName: string, name: string, contents: ContentsType[], categorystyle?: string, custom?: string) {
    super(name, contents);
    if (categorystyle) {
      this.categorystyle = categorystyle;
    }
    if (custom) {
      this.custom = custom;
    }
    this.moduleName = moduleName;
  }
}

export class PythonClassCategory extends Category {
  className: string;

  constructor(className: string, name: string, contents: ContentsType[]);
  constructor(className: string, name: string, contents: ContentsType[], categorystyle?: string, custom?: string) {
    super(name, contents);
    if (categorystyle) {
      this.categorystyle = categorystyle;
    }
    if (custom) {
      this.custom = custom;
    }
    this.className = className;
  }
}
