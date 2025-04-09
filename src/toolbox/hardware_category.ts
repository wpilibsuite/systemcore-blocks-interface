export const category =
{
    kind: 'category',
    name: 'Hardware',
    contents: [
        {
           kind: 'label',
           text: 'Mechanisms',
        },
        {
            kind: 'block',
            type: 'mrc_mechanism',
            fields: {
                NAME: 'my_drive',
                TYPE: 'DriveMecanum'
            },
            extraState: {
                importModule : 'DriveMecanum',
                params: [{name:'front_left_drive',type:'int'},
                         {name:'front_right_drive',type:'int'},
                         {name:'back_left_drive',type:'int'},
                         {name:'back_right_drive',type:'int'},
                ]
            },              
            inputs: {
                ARG0: {
                  shadow: {
                    type: 'math_number',
                    fields: {
                      NUM: 1,
                    },
                  },
                },  
                ARG1: {
                  shadow: {
                    type: 'math_number',
                    fields: {
                      NUM: 2,
                    },
                  },
                },  
                ARG2: {
                  shadow: {
                    type: 'math_number',
                    fields: {
                      NUM: 3,
                    },
                  },
                },  
                ARG3: {
                  shadow: {
                    type: 'math_number',
                    fields: {
                      NUM: 4,
                    },
                  },
                },  
            } 
        },
        {
          kind: 'label',
          text: 'Components',
       },
        {
            kind: 'block',
            type: 'mrc_component',
            fields: {
                NAME: 'my_motor',
                TYPE: 'DcMotor'
            },
            extraState: {
                importModule : 'DcMotor',
                params: [{name:'port',type:'int'}]
            },    
            inputs: {
                ARG0: {
                  shadow: {
                    type: 'math_number',
                    fields: {
                      NUM: 1,
                    },
                  },
                },  
            } 
        },
    ],
}