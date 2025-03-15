export const category =
{
    kind: 'category',
    name: 'Components',
    contents: [
        {
            kind: 'category',
            name: 'Touch Sensor',
            contents: [ 
                {
                    kind: "block", 
                    type: "mrc_call_python_function", 
                    extraState: {"functionKind": "instance", 
                                 "MODULE_OR_CLASS": "touch",
                                 "returnType": "bool", 
                                 "args": [],
                                 "tooltip": "Returns if the touch sensor is pressed or not",
                    },
                    fields: {
                        FUNC: 'is_pressed',
                    },
                }
            ]
        },
        {
            kind: 'category',
            name: 'Smart Motor',
            contents: [ ]
        },
        {
            kind: 'category',
            name: 'Servo',
            contents: [ ]
        },
        {
            kind: 'category',
            name: 'Color Range Sensor',
            contents: [ ]
        }
    ],
}