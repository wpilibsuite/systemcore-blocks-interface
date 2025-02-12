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
            },              
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
            },              
        },
    ],
}