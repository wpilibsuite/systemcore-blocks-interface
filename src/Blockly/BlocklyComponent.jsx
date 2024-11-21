import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import * as locale from 'blockly/msg/en';
import DarkTheme from '@blockly/theme-dark';
import { registerBlockDefinitions } from '../blocks/customblocks';

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.
// Import your generated toolbox
import toolboxJson from './toolboxb.json';
import toolboxJson2 from './toolboxwpilib.json';
function cleanToolboxNames(toolbox) {
  return {
    ...toolbox,
    contents: toolbox.contents.map(item => {
      if (item.name) {
        return {
          ...item,
          name: item.name
            .replace('wpilib._wpilib.', '')
            .replace('wpilib.drive._drive.', '')
        };
      }
      return item;
    })
  };
}
function combineToolboxes(toolbox1, toolbox2) {
  const cleanedToolbox2 = cleanToolboxNames(toolbox2);
  return {
    id: "toolbox-categories",
    style: "display: none",
    contents: [
      ...toolbox1.contents,
      { kind: "SEP" },
      ...cleanedToolbox2.contents
    ]
  };
}
function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const workspaceRef = useRef();

  // Initialize Blockly
  useEffect(() => {
    registerBlockDefinitions(combineToolboxes(toolboxJson,toolboxJson2));

    // Configure Blockly workspace
    const workspaceConfig = {
      theme: DarkTheme,
      horizontalLayout: false, // Forces vertical layout for the workspace

      toolbox: combineToolboxes(toolboxJson,toolboxJson2),
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      scrollbars: true,
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      ...props.workspaceConfiguration
    };

    // Set Blockly locale
    Blockly.setLocale(locale);

    // Create workspace
    const workspace = Blockly.inject(blocklyDiv.current, workspaceConfig);
    workspaceRef.current = workspace;

    // Load initial workspace content if provided
    if (props.initialXml) {
      try {
        const xml = Blockly.Xml.textToDom(props.initialXml);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (e) {
        console.error('Error loading initial workspace:', e);
      }
    }

    // Add change listener
    const onWorkspaceChange = (e) => {
      if (props.onWorkspaceChange) {
        const code = pythonGenerator.workspaceToCode(workspace);
        props.onWorkspaceChange(code);
      }
    };
    workspace.addChangeListener(onWorkspaceChange);

    // Configure Python generator
    //pythonGenerator.STATEMENT_PREFIX = 'self.highlight_block(%1);\n';
    pythonGenerator.addReservedWords('code', 'block', 'output');

    // Cleanup on unmount
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, [props.initialXml, props.workspaceConfiguration]);

  // Handle workspace resize
  useEffect(() => {
    if (blocklyDiv.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (workspaceRef.current) {
          Blockly.svgResize(workspaceRef.current);
        }
      });
      resizeObserver.observe(blocklyDiv.current);

      return () => {
        resizeObserver.unobserve(blocklyDiv.current);
      };
    }
  }, [blocklyDiv]);

  // Public methods exposed through ref
  const getWorkspace = () => workspaceRef.current;

  const generateCode = () => {
    if (workspaceRef.current) {
      return pythonGenerator.workspaceToCode(workspaceRef.current);
    }
    return '';
  };

  const saveWorkspace = () => {
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      return Blockly.Xml.domToText(xml);
    }
    return '';
  };

  const loadWorkspace = (xmlText) => {
    if (workspaceRef.current) {
      try {
        const xml = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      } catch (e) {
        console.error('Error loading workspace:', e);
      }
    }
  };

  const clear = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
    }
  };

  // Expose methods through ref
  React.useImperativeHandle(props.innerRef, () => ({
    getWorkspace,
    generateCode,
    saveWorkspace,
    loadWorkspace,
    clear
  }));

  return (
    <div
      className="blockly-workspace-container"
      style={{
        width: props.width || '100%',
        height: '100%',
        ...props.style,
      }}
    >
      <div
        ref={blocklyDiv}
        className="blockly-div"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      />
    </div>
  );
}

// Create a forwarded ref version of the component
const BlocklyComponentWithRef = React.forwardRef((props, ref) => (
  <BlocklyComponent {...props} innerRef={ref} />
));

export default BlocklyComponentWithRef;
