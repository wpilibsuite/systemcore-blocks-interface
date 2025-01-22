import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import * as locale from 'blockly/msg/en';
import * as MrcTheme from '../themes/mrc_theme_dark'

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.


function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const workspaceRef = useRef();

  // Initialize Blockly
  useEffect(() => {
    // Configure Blockly workspace
    const workspaceConfig = {
      theme: MrcTheme.theme,
      horizontalLayout: false, // Forces vertical layout for the workspace

      // Start with an empty (but not null) toolbox. It will be replaced later.
      toolbox: {
        kind: 'categoryToolbox',
        contents: [],
      },
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

    // Cleanup on unmount
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // Handle workspace resize
  useEffect(() => {
    const div = blocklyDiv.current;
    if (div) {
      const resizeObserver = new ResizeObserver(() => {
        if (workspaceRef.current) {
          Blockly.svgResize(workspaceRef.current);
        }
      });
      resizeObserver.observe(div);

      return () => {
        resizeObserver.unobserve(div);
      };
    }
  }, [blocklyDiv]);

  // Public methods exposed through ref

  const getBlocklyWorkspace = () => workspaceRef.current;

  // Expose methods through ref
  React.useImperativeHandle(props.innerRef, () => ({
    getBlocklyWorkspace,
  }));

  return (
    <div
      className="blockly-workspace-container"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div
        ref={blocklyDiv}
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
