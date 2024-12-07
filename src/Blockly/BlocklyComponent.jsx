import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import * as locale from 'blockly/msg/en';
import DarkTheme from '@blockly/theme-dark';

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.

import * as toolbox from '../editor/toolbox.js';

import '../blocks/misc';   // Defines a few miscellaneous blocks like a comment block.
import '../blocks/python'; // Defines blocks for accessing code in python (like wpilib, etc).

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const workspaceRef = useRef();

  // Initialize Blockly
  useEffect(() => {
    // Configure Blockly workspace
    const workspaceConfig = {
      theme: DarkTheme,
      horizontalLayout: false, // Forces vertical layout for the workspace

      toolbox: toolbox.getToolboxJSON(),
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
      trashcan: false,
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

    // Add change listener
    const onWorkspaceChange = (e) => {
      if (props.onWorkspaceChange) {
        const code = pythonGenerator.workspaceToCode(workspace);
        props.onWorkspaceChange(code);
      }
    };
    workspace.addChangeListener(onWorkspaceChange);

    // Configure Python generator
    // TODO(lizlooney): Figure out if we have to should reserved words for
    // wpilib module names.
    // pythonGenerator.addReservedWords(???);

    // Cleanup on unmount
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, [props.workspaceConfiguration]);

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
    console.log("HeyLiz - generateCode");
    if (workspaceRef.current) {
      return pythonGenerator.workspaceToCode(workspaceRef.current);
    }
    return '';
  };

  const saveWorkspace = () => {
    // TODO(lizlooney): replace this.
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      return Blockly.Xml.domToText(xml);
    }
    return '';
  };

  const loadWorkspace = (xmlText) => {
    // TODO(lizlooney): replace this.
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
    // TODO(lizlooney): replace or remove this.
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
