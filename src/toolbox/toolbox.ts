/**
 * @license
 * Copyright 2024 Google LLC
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

import * as generatedToolbox from './generated/toolbox';
import * as toolboxItems from '../toolbox/items';
import type { TreeDataNode } from 'antd';

export function getToolboxJSON(
    opt_includeExportedBlocksFromWorkspace: toolboxItems.ContentsType[],
    shownPythonToolboxCategories: Set<string>) {
  const contents: toolboxItems.ContentsType[] = generatedToolbox.getToolboxCategories();
  filterGeneratedCategories(contents, shownPythonToolboxCategories);

  if (opt_includeExportedBlocksFromWorkspace.length) {
    contents.push.apply(
      contents,
      [
        {
          kind: 'sep',
        },
        {
          kind: 'category',
          name: 'Workspace',
          contents: opt_includeExportedBlocksFromWorkspace,
        }
      ]);
  }
  contents.push.apply(
    contents,
    [
      {
        kind: 'sep',
      },
      {
        kind: 'category',
        name: 'Miscellaneous',
        contents: [
          {
            kind: 'block',
            type: 'mrc_misc_comment',
            fields: {
              COMMENT: 'Enter your comment here!',
            },
          },
          {
            kind: 'block',
            type: 'mrc_misc_evaluate_but_ignore_result',
          },
        ],
      },
      {
        kind: 'category',
        name: 'Logic',
        categorystyle: 'logic_category',
        contents: [
          {
            kind: 'block',
            type: 'controls_if',
          },
          {
            kind: 'block',
            type: 'controls_if',
            extraState: {
              hasElse: 'true',
            },
          },
          {
            kind: 'block',
            type: 'controls_if',
            extraState: {
              hasElse: 'true',
              elseIfCount: 1,
            },
          },
          {
            kind: 'block',
            type: 'logic_compare',
          },
          {
            kind: 'block',
            type: 'logic_operation',
          },
          {
            kind: 'block',
            type: 'logic_negate',
          },
          {
            kind: 'block',
            type: 'logic_boolean',
          },
          {
            kind: 'block',
            type: 'logic_null',
          },
          {
            kind: 'block',
            type: 'logic_ternary',
          },
        ],
      },
      {
        kind: 'category',
        name: 'Loops',
        categorystyle: 'loop_category',
        contents: [
          {
            kind: 'block',
            type: 'controls_repeat_ext',
            inputs: {
              TIMES: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'controls_whileUntil',
          },
          {
            kind: 'block',
            type: 'controls_for',
            inputs: {
              FROM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              TO: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
              BY: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'controls_forEach',
          },
          {
            kind: 'block',
            type: 'controls_flow_statements',
          },
        ],
      },
      {
        kind: 'category',
        name: 'Math',
        categorystyle: 'math_category',
        contents: [
          {
            kind: 'block',
            type: 'math_number',
          },
          {
            kind: 'block',
            type: 'math_arithmetic',
            fields: {
              OP: 'ADD',
            },
            inputs: {
              A: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              B: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_arithmetic',
            fields: {
              OP: 'MINUS',
            },
            inputs: {
              A: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              B: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_arithmetic',
            fields: {
              OP: 'MULTIPLY',
            },
            inputs: {
              A: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              B: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_arithmetic',
            fields: {
              OP: 'DIVIDE',
            },
            inputs: {
              A: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              B: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_arithmetic',
            fields: {
              OP: 'POWER',
            },
            inputs: {
              A: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              B: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_single',
            fields: {
              OP: 'NEG',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 9,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_single',
            fields: {
              OP: 'ABS',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 9,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_single',
            fields: {
              OP: 'ROOT',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 9,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_trig',
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 45,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_atan2',
            inputs: {
              X: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 20,
                  },
                },
              },
              Y: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 20,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_constant',
          },
          {
            kind: 'block',
            type: 'math_number_property',
            fields: {
              PROPERTY: 'EVEN',
            },
            inputs: {
              NUMBER_TO_CHECK: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 0,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_round',
            fields: {
              OP: 'ROUND',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 3.1,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'mrc_math_min_max',
          },
          {
            kind: 'block',
            type: 'math_on_list',
            fields: {
              OP: 'SUM',
            },
          },
          {
            kind: 'block',
            type: 'math_modulo',
            inputs: {
              DIVIDEND: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 64,
                  },
                },
              },
              DIVISOR: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_constrain',
            inputs: {
              VALUE: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 50,
                  },
                },
              },
              LOW: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              HIGH: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 100,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_random_int',
            inputs: {
              FROM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              TO: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 100,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'math_random_float',
          },
        ],
      },
      {
        kind: 'category',
        name: 'Text',
        categorystyle: 'text_category',
        contents: [
          {
            kind: 'block',
            type: 'text',
          },
          {
            kind: 'block',
            type: 'text_join',
          },
          {
            kind: 'block',
            type: 'text_append',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_length',
            inputs: {
              VALUE: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_isEmpty',
            inputs: {
              VALUE: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_indexOf',
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myText',
                    },
                  },
                },
              },
              FIND: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_charAt',
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myText',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_getSubstring',
            inputs: {
              STRING: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myText',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_changeCase',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_trim',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_count',
            inputs: {
              SUB: {
                shadow: {
                  type: 'text',
                },
              },
              TEXT: {
                shadow: {
                  type: 'text',
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_replace',
            inputs: {
              FROM: {
                shadow: {
                  type: 'text',
                },
              },
              TO: {
                shadow: {
                  type: 'text',
                },
              },
              TEXT: {
                shadow: {
                  type: 'text',
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_reverse',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'text_print',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
        ],
      },
      {
        kind: 'category',
        name: 'Lists',
        categorystyle: 'list_category',
        contents: [
          {
            kind: 'block',
            type: 'lists_create_empty',
          },
          {
            kind: 'block',
            type: 'lists_create_with',
            extraState: {
              itemCount: 3,
            },
          },
          {
            kind: 'block',
            type: 'lists_repeat',
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 5,
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_length',
          },
          {
            kind: 'block',
            type: 'lists_isEmpty',
          },
          {
            kind: 'block',
            type: 'mrc_list_add_item',
            inputs: {
              LIST: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myList',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_indexOf',
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myList',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_getIndex',
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myList',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_setIndex',
            inputs: {
              LIST: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myList',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_getSublist',
            inputs: {
              LIST: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myList',
                    },
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_split',
            inputs: {
              DELIM: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: ',',
                  },
                },
              },
            },
          },
          {
            kind: 'block',
            type: 'lists_sort',
            inputs: {
              LIST: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'myList',
                    },
                  },
                },
              },
            },
          },
        ],
      },
      {
        kind: 'sep',
      },
      {
        kind: 'category',
        name: 'Variables',
        categorystyle: 'variable_category',
        custom: 'VARIABLE',
      },
      {
        kind: 'category',
        name: 'Functions',
        categorystyle: 'procedure_category',
        custom: 'PROCEDURE',
      },
    ]);

  return {
    kind: 'categoryToolbox',
    contents: contents
  };
}

function filterGeneratedCategories(
    contents: toolboxItems.ContentsType[], shownPythonToolboxCategories: Set<string>) {
  console.log("HeyLiz - filterGeneratedCategories - " + Array.from(shownPythonToolboxCategories).sort());
  return;
  // TODO(lizlooney): Only fill categories whose moduleName/className is in shownPythonToolboxCategories.
  contents.forEach((item) => {
    if (item.kind === 'category') {
      const category = item as toolboxItems.Category;
      if ((category as toolboxItems.PythonModuleCategory).moduleName) {
        const moduleName = (item as toolboxItems.PythonModuleCategory).moduleName;
        if (!shownPythonToolboxCategories.has(moduleName)) {
          if (category.contents) {
            removeBlocks(category.contents);
          }
        }
      }
      if ((category as toolboxItems.PythonClassCategory).className) {
        const className = (item as toolboxItems.PythonClassCategory).className;
        if (!shownPythonToolboxCategories.has(className)) {
          if (category.contents) {
            removeBlocks(category.contents);
          }
        }
      }
    }
  });
}

function removeBlocks(contents: toolboxItems.ContentsType[]) {
  let i = 0;
  while (i < contents.length) {
    if (contents[i].kind !== 'block') {
      contents.splice(i, 1);
    } else {
      i++;
    }
  }
}
