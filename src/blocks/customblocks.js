import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

// Module Function Call Block
Blockly.Blocks['module_function_call'] = {
    init: function() {
      const blockData = JSON.parse(this.data || '{}');
      
      const args0 = [];
      const messageParts = [`${blockData.module}.${blockData.func}`];
      
      // Add inputs dynamically
      if (blockData.inputs) {
        Object.entries(blockData.inputs).forEach(([name, input]) => {
          messageParts.push(`%${args0.length + 1}`);
          args0.push({
            type: 'input_value',
            name: name,
            check: input.type
          });
        });
      }
      
      const blockConfig = {
        type: 'module_function_call',
        message0: messageParts.join(' '),
        args0: args0,
        colour: blockData.colour || 270,
        tooltip: blockData.tooltip || '',
        inputsInline: true
      };
      
      // Set output or statement
      if (blockData.output) {
        blockConfig.output = blockData.output;
      } else {
        blockConfig.previousStatement = null;
        blockConfig.nextStatement = null;
      }
      
      this.jsonInit(blockConfig);
    }
  };

// Constructor Call Block
Blockly.Blocks['constructor_call'] = {
  init: function() {
    const blockData = this.data || {};
    
    this.jsonInit({
      type: 'constructor_call',
      message0: 'new %1',
      args0: [
        {
          type: 'field_label',
          text: blockData.CLASS || '',
        }
      ],
      output: blockData.output || null,
      colour: 300,
      tooltip: blockData.tooltip || ''
    });

    // Add inputs if specified
    if (blockData.inputs) {
      Object.entries(blockData.inputs).forEach(([name, input]) => {
        this.appendValueInput(name)
            .setCheck(input.type)
            .appendField(name);
      });
    }
  }
};

// Instance Variable Blocks
Blockly.Blocks['instance_variable_get'] = {
  init: function() {
    const blockData = this.data || {};
    
    this.jsonInit({
      type: 'instance_variable_get',
      message0: '%1.%2',
      args0: [
        {
          type: 'input_value',
          name: 'INSTANCE',
          check: blockData.CLASS || null
        },
        {
          type: 'field_label',
          text: blockData.VAR || ''
        }
      ],
      output: blockData.output || null,
      colour: 120,
      tooltip: blockData.tooltip || ''
    });
  }
};

Blockly.Blocks['instance_variable_set'] = {
  init: function() {
    const blockData = this.data || {};
    
    this.jsonInit({
      type: 'instance_variable_set',
      message0: 'set %1.%2 to %3',
      args0: [
        {
          type: 'input_value',
          name: 'INSTANCE',
          check: blockData.CLASS || null
        },
        {
          type: 'field_label',
          text: blockData.VAR || ''
        },
        {
          type: 'input_value',
          name: 'VALUE',
          check: blockData.inputs?.VALUE?.type || null
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 120,
      tooltip: blockData.tooltip || ''
    });
  }
};

// Module Variable Block
Blockly.Blocks['module_variable_get'] = {
  init: function() {
    const blockData = this.data || {};
    
    this.jsonInit({
      type: 'module_variable_get',
      message0: '%1.%2',
      args0: [
        {
          type: 'field_label',
          text: blockData.MODULE || ''
        },
        {
          type: 'field_label',
          text: blockData.VAR || ''
        }
      ],
      output: blockData.output || null,
      colour: 120,
      tooltip: blockData.tooltip || ''
    });
  }
};

// Python Generators
pythonGenerator.forBlock['module_function_call'] = function(block) {
    const blockData = JSON.parse(block.data || '{}');
    const module = blockData.module || '';
    const func = blockData.func || '';
    const args = [];
  
    if (blockData.inputs) {
      // Sort inputs by ARG number to ensure correct order
      const sortedInputs = Object.keys(blockData.inputs).sort((a, b) => {
        const aNum = parseInt(a.replace('ARG', ''));
        const bNum = parseInt(b.replace('ARG', ''));
        return aNum - bNum;
      });
  
      sortedInputs.forEach(name => {
        const arg = pythonGenerator.valueToCode(block, name, pythonGenerator.ORDER_ATOMIC) || 'None';
        args.push(arg);
      });
    }
  
    const code = `${module}.${func}(${args.join(', ')})`;
  
    if (blockData.output) {
      return [code, pythonGenerator.ORDER_FUNCTION_CALL];
    }
    return code + '\n';
  };
pythonGenerator.forBlock['constructor_call'] = function(block) {
  const blockData = block.data || {};
  const args = [];
  
  if (blockData.inputs) {
    Object.keys(blockData.inputs).forEach(name => {
      const arg = pythonGenerator.valueToCode(block, name, pythonGenerator.ORDER_ATOMIC) || 'None';
      args.push(arg);
    });
  }

  const code = `${blockData.CLASS}(${args.join(', ')})`;
  return [code, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['instance_variable_get'] = function(block) {
  const instance = pythonGenerator.valueToCode(block, 'INSTANCE', pythonGenerator.ORDER_MEMBER) || 'self';
  const varName = block.data?.VAR || '';
  return [`${instance}.${varName}`, pythonGenerator.ORDER_MEMBER];
};

pythonGenerator.forBlock['instance_variable_set'] = function(block) {
  const instance = pythonGenerator.valueToCode(block, 'INSTANCE', pythonGenerator.ORDER_MEMBER) || 'self';
  const varName = block.data?.VAR || '';
  const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_ATOMIC) || 'None';
  return `${instance}.${varName} = ${value}\n`;
};

pythonGenerator.forBlock['module_variable_get'] = function(block) {
  const blockData = block.data || {};
  return [`${blockData.MODULE}.${blockData.VAR}`, pythonGenerator.ORDER_MEMBER];
};

// Main registration function
export function registerBlockDefinitions(toolbox) {
    if (!toolbox?.contents) return;
    
    toolbox.contents.forEach(category => {
      if (category.contents) {
        category.contents.forEach(blockDef => {
          // For module function calls, create a specific block definition
          if (blockDef.type === 'module_function_call') {
            const uniqueType = `${blockDef.fields.MODULE}_${blockDef.fields.FUNC}`;
            
            // Create the block configuration
            const blockConfig = {
              type: uniqueType,
              message0: `${blockDef.fields.MODULE}.${blockDef.fields.FUNC}`,
              args0: [],
              colour: blockDef.colour || 270,
              tooltip: blockDef.tooltip || '',
              inputsInline: true
            };
  
            // Add inputs to the configuration
            if (blockDef.inputs) {
              Object.entries(blockDef.inputs).forEach(([name, input]) => {
                blockConfig.message0 += ` %${blockConfig.args0.length + 1}`;
                blockConfig.args0.push({
                  type: "input_value",
                  name: name,
                  check: input.type
                });
              });
            }
  
            // Set output or statement connections
            if (blockDef.output) {
              blockConfig.output = blockDef.output;
            } else {
              blockConfig.previousStatement = null;
              blockConfig.nextStatement = null;
            }
  
            // Register the block
            Blockly.Blocks[uniqueType] = {
              init: function() {
                this.jsonInit(blockConfig);
              }
            };
  
            // Register the generator for this specific block type
            pythonGenerator.forBlock[uniqueType] = function(block) {
              const args = [];
              if (blockDef.inputs) {
                Object.keys(blockDef.inputs).forEach(name => {
                  const arg = pythonGenerator.valueToCode(
                    block, 
                    name,
                    pythonGenerator.ORDER_ATOMIC
                  ) || 'None';
                  args.push(arg);
                });
              }
  
              const code = `${blockDef.fields.MODULE}.${blockDef.fields.FUNC}(${args.join(', ')})`;
              return blockDef.output ? 
                [code, pythonGenerator.ORDER_FUNCTION_CALL] : 
                code + '\n';
            };
          }
          // ... handle other block types similarly
        });
      }
    });
  }