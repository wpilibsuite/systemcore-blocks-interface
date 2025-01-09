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

export class Block extends Item {
  /** The block type. */
  type: string;

  // For mutating the block.
  extraState?: {[key: string]: any};
  fields?: {[key: string]: any};
  inputs?: {[key: string]: any};

  constructor(
      type: string,
      extraState: {[key: string]: any},
      fields: {[key: string]: any},
      inputs: {[key: string]: any}) {
    super('block');
    this.type = type;
    this.extraState = extraState;
    this.fields = fields;
    this.inputs = inputs;
  }
}

export class Category extends Item  {
  /** The category name. */
  name: string;
  categorystyle?: string;
  custom?: string;

  /** The blocks for this category. */
  contents?: Item[];

  constructor(name: string, contents: Item[], categorystyle: string, custom: string) {
    super('category');
    this.name = name;
    this.categorystyle = categorystyle;
    this.custom = custom;
    this.contents = contents;
  }
}
