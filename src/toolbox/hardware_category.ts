const category_robot =
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
        importModule: 'DriveMecanum',
        params: [{ name: 'front_left_drive', type: 'int' },
        { name: 'front_right_drive', type: 'int' },
        { name: 'back_left_drive', type: 'int' },
        { name: 'back_right_drive', type: 'int' },
        ]
      },
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 1
            },
          },
        },
        ARG1: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 2
            },
          },
        },
        ARG2: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 3
            },
          },
        },
        ARG3: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 4
            },
          },
        },
      }
    },
    {
      kind: 'block',
      type: 'mrc_mechanism',
      fields: {
        NAME: 'my_claw',
        TYPE: 'Claw'
      },
      extraState: {
        importModule: 'claw',
        params: [{ name: 'port_gripper', type: 'int' },
        { name: 'port_piece_sensor', type: 'int' },
        ]
      },
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 1
            },
          },
        },
        ARG1: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartIO',
              PORT_NUM: 1
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
        TYPE: 'SmartMotor'
      },
      extraState: {
        importModule: 'smart_motor',
        params: [{ name: 'motorPort', type: 'int' }]
      },
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartMotor',
              PORT_NUM: 1
            },
          },
        },
      }
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
        params: [{ name: 'I2CPort', type: 'int' }]
      },
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'I2C',
              PORT_NUM: 1
            },
          },
        },
      }
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
        params: [{ name: 'SmartIOPort', type: 'int' }]
      },
      inputs: {
        ARG0: {
          shadow: {
            type: 'mrc_port',
            fields: {
              TYPE: 'SmartIO',
              PORT_NUM: 1
            },
          },
        },
      }
    },
  ],
}

const category_mechanism =
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
        params: [{ name: 'motorPort', type: 'int' }],
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
        params: [{ name: 'I2CPort', type: 'int' }],
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
        params: [{ name: 'SmartIOPort', type: 'int' }],
        hideParams: true
      },
    },
  ],
}
export const category = category_robot;