export const category =
{
    kind: 'category',
    name: 'Mechanisms',
    contents: [
        {
            kind: 'block',
            type: 'mrc_mechanism',
            fields: {
                NAME: 'my_servo',
                TYPE: 'Servo'
            },
            extraState: {
                importModule : 'Servo',
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
        {
            kind: 'block',
            type: 'mrc_mechanism',
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