export const category =
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
}