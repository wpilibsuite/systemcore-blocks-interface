// Import our block definitions before anything else. Otherwise the
// extendedPythonGenerator doesn't copy them from the blockly python
// generator.
// TODO(lizlooney): fix that.
import './blocks/python'; // Defines blocks for accessing code in python (like wpilib, etc).
import './blocks/misc';   // Defines a few miscellaneous blocks like a comment block.

import React, { useEffect, useState, useRef } from 'react';

import { Button, ConfigProvider, Flex, Input, Modal, Space, Splitter, Tooltip, Tree, Typography, theme } from 'antd';
import {
  CopyOutlined,
  DownloadOutlined,
  FileAddOutlined,
  FileOutlined,
  FolderAddOutlined,
  FolderOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import BlocklyComponent from './Blockly';

//import { testAllBlocksInToolbox } from '../editor/toolbox_tests.js';
import * as editor from './editor/editor.js';
import * as storage from './storage/client_side_storage.js';
import * as commonStorage from './storage/common_storage.js';

import * as toolbox from './editor/toolbox.js';
import { extendedPythonGenerator } from './editor/extended_python_generator.js';


const NewWorkspaceModal = ({ workspaceNamesArg, isOpen, onOk, onCancel }) => {
  const [workspaceNames, setWorkspaceNames] = useState([]);
  const [value, setValue] = useState('');

  return (
    <Modal
      title="New Workspace"
      open={isOpen}
      afterOpenChange={(open) => {
        setValue('');
        if (open) {
          setWorkspaceNames(workspaceNamesArg);
        }
      }}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="ok"
          onClick={() => {
            if (!commonStorage.isValidPythonModuleName(value)) {
              alert(value + ' is not a valid python module name');
              return;
            }
            if (workspaceNames.includes(value)) {
              alert('There is already a workspace named ' +  value);
              return;
            }
            onOk(value);
          }}
        >
          OK
        </Button>
      ]}
    >
      <Flex
        vertical
        gap="small"
      >
        <Typography.Paragraph>
          Workspace Name
        </Typography.Paragraph>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
      </Flex>
    </Modal>
  );
};

const NewOpModeModal = ({ workspaceNameArg, opModeNamesArg, isOpen, onOk, onCancel }) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [opModeNames, setOpModeNames] = useState([]);
  const [value, setValue] = useState('');

  return (
    <Modal
      title="New OpMode"
      open={isOpen}
      afterOpenChange={(open) => {
        setValue('');
        if (open) {
          setWorkspaceName(workspaceNameArg);
          setOpModeNames(opModeNamesArg);
        }
      }}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="ok"
          onClick={() => {
            if (!commonStorage.isValidPythonModuleName(value)) {
              alert(value + ' is not a valid python module name');
              return;
            }
            if (workspaceName === value) {
              alert('An OpMode cannot have the same name as its workspace.');
              return;
            }
            if (opModeNames.includes(value)) {
              alert('There is already an OpMode named ' +  value);
              return;
            }
            onOk(workspaceName, value);
          }}
        >
          OK
        </Button>
      ]}
    >
      <Flex
        vertical
        gap="small"
      >
        <Typography.Paragraph>
          OpMode Name
        </Typography.Paragraph>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
      </Flex>
    </Modal>
  );
};

const App = () => {
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [isNewOpModeModalOpen, setIsNewOpModeModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [workspaceNames, setWorkspaceNames] = useState([]);
  const [treeData, setTreeData] = useState([])
  const [currentModulePath, setCurrentModulePath] = useState('');
  const [currentWorkspaceName, setCurrentWorkspaceName] = useState('');
  const [opModeNames, setOpModeNames] = useState([]); // Names of opmodes in the current workspace.
  const [generatedCode, setGeneratedCode] = useState('');
  const blocklyComponent = useRef(null);

  useEffect(() => {
    listModules();
    initializeBlockly();
  }, []);

  const listModules = () => {
    storage.listModules((array, error) => {
      if (array) {
        setModules(array)
      } else if (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    const workspaceNames = []
    const treeData = [];
    for (const workspace of modules) {
      workspaceNames.push(workspace.workspaceName);
      const parent = {
        title: workspace.workspaceName,
        key: workspace.modulePath,
        icon: <FolderOutlined />,
        children: [],
      };
      for (const opMode of workspace.opModes) {
        const child = {
          title: opMode.moduleName,
          key: opMode.modulePath,
          icon: <FileOutlined />,
        };
        parent.children.push(child);
      }
      treeData.push(parent);
    }
    setWorkspaceNames(workspaceNames);
    setTreeData(treeData);
  }, [modules]);

  const initializeBlockly = () => {
    if (blocklyComponent.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      if (blocklyWorkspace) {
        // Show generated python code.
        blocklyWorkspace.addChangeListener((event) => {
          if (event.isUiEvent) {
            // UI events are things like scrolling, zooming, etc.
            // No need to regenerate python code after one of these.
            return;
          }
          if (blocklyWorkspace.isDragging()) {
            // Don't regenerate python code mid-drag.
            return;
          }
          const code = extendedPythonGenerator.workspaceToCode(blocklyWorkspace);
          setGeneratedCode(code);
        });
        // Set the toolbox.
        blocklyWorkspace.updateToolbox(toolbox.getToolboxJSON());
        //testAllBlocksInToolbox(workspace);
      }
    }
  };

  const handleNewWorkspaceOk = (workspaceName, callback) => {
    const workspaceContent = commonStorage.newModuleContent();
    const workspacePath = commonStorage.makeModulePath(workspaceName, workspaceName);
    storage.createModule(
        commonStorage.MODULE_TYPE_WORKSPACE, workspacePath, workspaceContent,
        callback);
  };

  const handleNewOpModeOk = (workspaceName, opModeName, callback) => {
    const opModeContent = commonStorage.newModuleContent();
    const opModePath = commonStorage.makeModulePath(workspaceName, opModeName);
    storage.createModule(
        commonStorage.MODULE_TYPE_OPMODE, opModePath, opModeContent,
        callback);
  };

  const handleSave = () => {
    if (currentModulePath) {
      editor.saveModule(
        blocklyComponent.current.getBlocklyWorkspace(),
        currentModulePath);
    }
  };

  const handleUpload = () => {
    console.log('Upload clicked');
  };

  const handleDownload = () => {
    console.log('Download clicked');
  };

  const handleModuleSelected = (selectedKeys, e) => {
    // e:{selected: boolean, selectedNodes, node, event}
    if (selectedKeys.length === 1) {
      // TODO(lizlooney): Before loading different module, check whether the
      // blocks need to be saved.
      setCurrentModulePath('');
      const modulePath = selectedKeys[0];
      setCurrentModulePath(modulePath);
    }
  };

  useEffect(() => {
    if (currentModulePath) {
      setCurrentWorkspaceName(commonStorage.getWorkspaceName(currentModulePath));
      const opModeNames = [];
      for (const workspace of modules) {
        if (workspace.workspaceName === currentWorkspaceName) {
          for (const opMode of workspace.opModes) {
            opModeNames.push(opMode.moduleName);
          }
          break;
        }
      }
      setOpModeNames(opModeNames);

      storage.saveEntry('currentModulePath', currentModulePath);
      editor.loadModuleBlocks(blocklyComponent.current.getBlocklyWorkspace(), currentModulePath);
    }
  }, [currentModulePath]);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(
      () => {
        console.log('Code copied to clipboard');
      },
      (err) => {
        console.error('Could not copy code: ', err);
      }
    );
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Tree: {
            directoryNodeSelectedBg: '#1677ff',
            directoryNodeSelectedColor: '#fff',
            nodeSelectedBg: '#1677ff',
            nodeSelectedColor: '#fff',
            nodeHoverBg: '#333',
            nodeHoverColor: '#fff',
          },
        },
      }}
    >
      <Flex
        vertical
        style={{
          background: '#000',
          height: '100vh',
        }}
      >
        <Flex vertical>
          <Typography.Paragraph
            strong={true}
            underline={true}
            style={{
              color: '#aaf',
            }}
          >
            WPILib Blocks
          </Typography.Paragraph>
          <Space>
            <Tooltip title="New Workspace">
              <Button
                icon={<FolderAddOutlined />} 
                onClick={() => {
                  // TODO(lizlooney): Before showing the New Worksapce modal,
                  // check whether the blocks need to be saved.
                  setIsNewWorkspaceModalOpen(true);
                }}
                style={{ color: 'white' }}
              >
              </Button>
            </Tooltip>
            <Tooltip title="New OpMode">
              <Button
                icon={<FileAddOutlined />} 
                onClick={() => {
                  // TODO(lizlooney): Before showing the New OpMode modal,
                  // check whether the blocks need to be saved.
                  setIsNewOpModeModalOpen(true);
                }}
                style={{ color: 'white' }}
              >
              </Button>
            </Tooltip>
            <Tooltip title="Save">
              <Button
                icon={<SaveOutlined />} 
                disabled={!currentModulePath}
                onClick={handleSave}
                style={{ color: 'white' }}
              >
              </Button>
            </Tooltip>
            <Tooltip title="Upload">
              <Button
                icon={<UploadOutlined />}
                onClick={handleUpload}
                style={{ color: 'white' }}
              >
              </Button>
            </Tooltip>
            <Tooltip title="Download">
              <Button
                icon={<DownloadOutlined />}
                disabled={!currentModulePath}
                onClick={handleDownload}
                style={{ color: 'white' }}
              >
              </Button>
            </Tooltip>
          </Space>
        </Flex>
        <Splitter
          style={{
            height: '100vh',
          }}
        >
          <Splitter.Panel min='2%' defaultSize='15%'>
            <Tree
              showIcon
              blockNode
              autoExpandParent
              defaultExpandAll
              defaultExpandParent
              treeData={treeData}
              onSelect={handleModuleSelected}
            />
          </Splitter.Panel>
          <Splitter.Panel min='2%' defaultSize='50%'>
            <BlocklyComponent
              ref={blocklyComponent}
            />
          </Splitter.Panel>
          <Splitter.Panel min='2%'>
            <Flex
              vertical
              style={{
                paddingLeft: '5px',
                height: '100%',
              }}
            >
              <Space>
                <h3 style={{ color: '#fff', margin: 0 }}>Python Code</h3>
                <Tooltip title="Copy">
                  <Button
                    icon={<CopyOutlined />}
                    onClick={copyCodeToClipboard}
                    size="small"
                    style={{ color: 'white' }}
                  >
                  </Button>
                </Tooltip>
              </Space>
              <SyntaxHighlighter
                language="python"
                style={dracula}
                customStyle={{
                  backgroundColor: '#333',
                  width: '100%',
                  height: '100%',
                }}
              >
                {generatedCode}
              </SyntaxHighlighter>
            </Flex>
          </Splitter.Panel>
        </Splitter>
      </Flex>

      <NewWorkspaceModal
        workspaceNamesArg={workspaceNames}
        isOpen={isNewWorkspaceModalOpen}
        onOk={(w) => {
          setIsNewWorkspaceModalOpen(false);
          handleNewWorkspaceOk(w, (success, error) => {
            if (success) {
              listModules();
            } else if (error) {
              console.log(error);
            }
          });
        }}
        onCancel={() => setIsNewWorkspaceModalOpen(false)}
      />
      <NewOpModeModal
        workspaceNameArg={currentWorkspaceName}
        opModeNamesArg={opModeNames}
        isOpen={isNewOpModeModalOpen}
        onOk={(w, o) => {
          setIsNewOpModeModalOpen(false);
          handleNewOpModeOk(w, o, (success, error) => {
            if (success) {
              listModules();
            } else if (error) {
              console.log(error);
            }
          });
        }}
        onCancel={() => setIsNewOpModeModalOpen(false)}
      />
    </ConfigProvider>
  );
};

export default App;
