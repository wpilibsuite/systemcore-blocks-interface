import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import * as locale from 'blockly/msg/en';
import DarkTheme from '@blockly/theme-dark';

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.
import '../blocks/misc';   // Defines a few miscellaneous blocks like a comment block.
import '../blocks/python'; // Defines blocks for accessing code in python (like wpilib, etc).

import { extendedPythonGenerator } from '../editor/extended_python_generator.js';
import * as toolbox from '../editor/toolbox.js';
//import { testAllBlocksInToolbox } from '../editor/toolbox_tests.js';
import * as editor from '../editor/editor.js';
import * as storage from '../editor/client_side_storage.js'

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const workspaceRef = useRef();
  const extendedPythonGeneratorRef = useRef();

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
      oneBasedIndex: false,
    };

    // Set Blockly locale
    Blockly.setLocale(locale);

    // Create workspace
    const workspace = Blockly.inject(blocklyDiv.current, workspaceConfig);
    workspaceRef.current = workspace;

    // Create extended python generator
    extendedPythonGeneratorRef.current = extendedPythonGenerator;
    // TODO(lizlooney): Figure out if we have to should reserved words for
    // wpilib module names.
    // extendedPythonGenerator.addReservedWords(???);

    //testAllBlocksInToolbox(workspace);

    // Add change listener
    const onWorkspaceChange = (event) => {
      if (event.isUiEvent) {
        // UI events are things like scrolling, zooming, etc.
        // No need to regenerate python code after one of these.
        return;
      }
      if (workspace.isDragging()) {
        // Don't regenerate python code mid-drag.
        return;
      }
      if (props.onGeneratedCodeChanged) {
        const code = extendedPythonGenerator.workspaceToCode(workspace);
        props.onGeneratedCodeChanged(code);
      }
    };
    workspace.addChangeListener(onWorkspaceChange);

    // Cleanup on unmount
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

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

  const getCurrentWorkspaceName = (callback) => {
    storage.fetchEntry('currentWorkspaceName', (name, error) => {
      callback(name);
    });
  };

  const listWorkspaces = (callback) => {
    storage.listWorkspaces(callback);
  };

  const newWorkspace = (name, callback) => {
    storage.newWorkspace(name, callback);
  };

  const getBlocklyWorkspace = () => workspaceRef.current;

  const generateCode = () => {
    if (workspaceRef.current && extendedPythonGeneratorRef.current) {
      return extendedPythonGeneratorRef.current.workspaceToCode(workspaceRef.current);
    }
    return '';
  };

  const saveBlocks = (typeOfModule, name) => {
    if (workspaceRef.current) {
      if (typeOfModule == "workspace") {
        editor.saveWorkspaceBlocks(workspaceRef.current, name);
      }
    }
  };

  const loadBlocks = (typeOfModule, name) => {
    if (workspaceRef.current) {
      if (typeOfModule == "workspace") {
        storage.saveEntry('currentWorkspaceName', name);
        editor.loadWorkspaceBlocks(workspaceRef.current, name);
      }
    }
  };

  // Expose methods through ref
  React.useImperativeHandle(props.innerRef, () => ({
    getCurrentWorkspaceName,
    listWorkspaces,
    newWorkspace,
    getBlocklyWorkspace,
    generateCode,
    saveBlocks,
    loadBlocks,
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
