export const category =
{
    kind: 'category',
    name: 'Mechanims',
    contents: [
        {
            kind: 'block',
            type: 'mrc_mechanism',
            fields: {
                NAME: 'my_servo',
                TYPE: 'Servo'
            },
        },
        {
            kind: 'block',
            type: 'mrc_mechanism',
            fields: {
                NAME: 'my_motor',
                TYPE: 'DcMotor'
            },
        },
    ],
}