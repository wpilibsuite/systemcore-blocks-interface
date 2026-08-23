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
 * @fileoverview A small sample block layout, wrapped as module content text, used by
 * ThemeModal and RendererModal to preview how blocks look with a given theme/renderer via
 * ReadOnlyBlocklyPreview.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';

const SAMPLE_PREVIEW_BLOCKS: {[key: string]: any} = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: 'mrc_class_method_def',
        id: 'sample_preview_method',
        x: 20,
        y: 20,
        extraState: {
          methodId: 'sample_preview_method',
          canChangeSignature: true,
          canBeCalledWithinClass: true,
          canBeCalledOutsideClass: true,
          returnType: 'None',
          params: [],
        },
        fields: { NAME: 'sample' },
        inputs: {
          STACK: {
            block: {
              type: 'controls_if',
              inputs: {
                IF0: {
                  block: {
                    type: 'logic_compare',
                    fields: { OP: 'EQ' },
                    inputs: {
                      A: { block: { type: 'math_number', fields: { NUM: 1 } } },
                      B: { block: { type: 'math_number', fields: { NUM: 1 } } },
                    },
                  },
                },
                DO0: {
                  block: {
                    type: 'text_print',
                    inputs: {
                      TEXT: { block: { type: 'text', fields: { TEXT: 'Hello' } } },
                    },
                  },
                },
              },
              next: {
                block: {
                  type: 'controls_repeat_ext',
                  inputs: {
                    TIMES: { block: { type: 'math_number', fields: { NUM: 10 } } },
                    DO: {
                      block: {
                        type: 'text_print',
                        inputs: {
                          TEXT: { block: { type: 'text', fields: { TEXT: 'Hi' } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

/**
 * Module content text wrapping SAMPLE_PREVIEW_BLOCKS, suitable for ReadOnlyBlocklyPreview.
 * There is no real module behind this preview, so mechanisms/components/events/methods are
 * all empty.
 */
export const SAMPLE_PREVIEW_MODULE_CONTENT_TEXT: string = new storageModuleContent.ModuleContent(
    storageModule.ModuleType.OPMODE, 'preview', SAMPLE_PREVIEW_BLOCKS, [], [], [], [], [])
    .getModuleContentText();
