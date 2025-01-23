export const category =
{
  kind: 'category',
  name: 'Math',
  categorystyle: 'math_category',
  contents: [
    {
      kind: 'block',
      type: 'math_number',
      fields: {
        NUM: 0,
      },
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
}