export const category =
{
  kind: 'category',
  name: 'Hardware',
  contents: [
    {
      kind: 'label',
      text: 'Components',
    },
    {
      kind: 'block',
      type: 'mrc_component',
      fields: {
        NAME: 'my_motor',
        TYPE: 'SmartMotor'
      },
      extraState: {
        importModule: 'smart_motor',
        params: [{ name: 'motor_port', type: 'int' }],
        hideParams: true
      },
    },
    {
      kind: 'block',
      type: 'mrc_component',
      fields: {
        NAME: 'my_color_range_sensor',
        TYPE: 'ColorRangeSensor'
      },
      extraState: {
        importModule: 'color_range_sensor',
        params: [{ name: 'i2c_port', type: 'int' }],
        hideParams: true
      },
    },
    {
      kind: 'block',
      type: 'mrc_component',
      fields: {
        NAME: 'my_touch_sensor',
        TYPE: 'RevTouchSensor'
      },
      extraState: {
        importModule: 'rev_touch_sensor',
        params: [{ name: 'smartIO_port', type: 'int' }],
        hideParams: true
      },
    },
  ],
}