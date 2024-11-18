import React, { useState } from 'react';
import { Drawer, Checkbox, Typography } from 'antd';

const { Text } = Typography;

const CodeDrawer = ({ workspace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');

  const generatePythonCode = () => {
    if (workspace?.current) {
      // Note: You'll need to import the Python generator
      // This is a placeholder that returns JavaScript code for now
      const generatedCode = Blockly.JavaScript.workspaceToCode(workspace.current);
      setCode(generatedCode);
    }
  };

  const handleCheckboxChange = (checked) => {
    setIsOpen(checked);
    if (checked) {
      generatePythonCode();
    }
  };

  return (
    <>
      <Checkbox 
        checked={isOpen}
        onChange={(e) => handleCheckboxChange(e.target.checked)}
        style={{ marginRight: 8 }}
      >
        <Text style={{ color: 'white' }}>Show Code</Text>
      </Checkbox>

      <Drawer
        title="Generated Python Code"
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        width={400}
        styles={{
          header: {
            background: '#333',
            color: 'white',
          },
          body: {
            background: '#1f1f1f',
            padding: 0,
          },
          content: {
            background: '#1f1f1f',
          },
        }}
      >
        <pre
          style={{
            margin: 0,
            padding: 16,
            background: '#1f1f1f',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '14px',
            height: '100%',
            overflowX: 'auto',
          }}
        >
          {code || '# No code generated yet'}
        </pre>
      </Drawer>
    </>
  );
};

export default CodeDrawer;