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

import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python'

import BlocklyComponent from './Blockly';

import './blocks/misc';
import './blocks/python_enum';
import './blocks/python_function';
import './blocks/python_variable';
import { initialize as initializeBlocks } from './blocks/utils/generated/initialize';

import * as editor from './editor/editor';
import { extendedPythonGenerator } from './editor/extended_python_generator';
import { getToolboxJSON } from './toolbox/toolbox';
//import { testAllBlocksInToolbox } from './toolbox/toolbox_tests';

import * as storage from './storage/client_side_storage';
import * as commonStorage from './storage/common_storage';


type NewWorkspaceModalProps = {
  isOpen: boolean;
  getWorkspaceNames: () => string[];
  onOk: (w: string) => void;
  onCancel: () => void;
}

const NewWorkspaceModal: React.FC<NewWorkspaceModalProps> = ({ isOpen, getWorkspaceNames, onOk, onCancel }) => {
  const [value, setValue] = useState('');
  const [workspaceNames, setWorkspaceNames] = useState<string[]>([]);

  return (
    <Modal
      title="New Workspace"
      open={isOpen}
      afterOpenChange={(open: boolean) => {
        setValue('');
        if (open) {
          setWorkspaceNames(getWorkspaceNames());
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


type NewOpModeModalProps = {
  isOpen: boolean;
  getCurrentWorkspaceName: () => string;
  getOpModeNames: (workspaceName: string) => string[];
  onOk: (w: string, o: string) => void;
  onCancel: () => void;
}

const NewOpModeModal: React.FC<NewOpModeModalProps> = ({ isOpen, getCurrentWorkspaceName, getOpModeNames, onOk, onCancel }) => {
  const [value, setValue] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [opModeNames, setOpModeNames] = useState<string[]>([]);

  return (
    <Modal
      title="New OpMode"
      open={isOpen}
      afterOpenChange={(open: boolean) => {
        setValue('');
        if (open) {
          const currentWorkspaceName = getCurrentWorkspaceName();
          setWorkspaceName(currentWorkspaceName);
          setOpModeNames(getOpModeNames(currentWorkspaceName));
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

type BlocklyComponentType = {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg,
};

type TreeKey = string | number | bigint;

interface TreeData {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: TreeData[];
}

const App: React.FC = () => {
  const isFirstRender = useRef(true);
  const [triggerListModules, setTriggerListModules] = useState(false);
  const [modules, setModules] = useState<commonStorage.Workspace[]>([]);
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  const [treeExpandedKeys, setTreeExpandedKeys] = React.useState<string[]>([]);
  const [pathToExpand, setPathToExpand] = React.useState('');
  const [treeSelectedPath, setTreeSelectedPath] = useState('');
  const [currentModulePath, setCurrentModulePath] = useState('');
  const blocklyComponent = useRef<BlocklyComponentType | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [isNewOpModeModalOpen, setIsNewOpModeModalOpen] = useState(false);

  // When the app is loaded, initialize the blocks we provide.
  useEffect(() => {
    if (isFirstRender.current) {
      initializeBlocks();
      Object.assign(extendedPythonGenerator.forBlock, pythonGenerator.forBlock);
      //testAllBlocksInToolbox(getToolboxJSON([]).contents);
      isFirstRender.current = false;
    }
  }, []);

  // Fetch the list of modules from storage.
  useEffect(() => {
    storage.listModules((array: commonStorage.Workspace[] | null, error: string) => {
      if (error) {
        console.log(error);
        return
      }
      if (array != null) {
        setModules(array)
      }
    });
  }, [triggerListModules]);

  useEffect(() => {
    if (blocklyComponent.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      if (blocklyWorkspace) {
        // Show generated python code.
        blocklyWorkspace.addChangeListener(handleBlocksChanged);

        // Set the toolbox.
        const toolboxJSON = getToolboxJSON([]);
        blocklyWorkspace.updateToolbox(toolboxJSON);
      }
    }
  }, [blocklyComponent]);

  const handleBlocksChanged = (event: Blockly.Events.Abstract) => {
    if (event.isUiEvent) {
      // UI events are things like scrolling, zooming, etc.
      // No need to regenerate python code after one of these.
      return;
    }
    if (!event.workspaceId) {
      return;
    }
    const blocklyWorkspace = Blockly.common.getWorkspaceById(event.workspaceId);
    if (!blocklyWorkspace) {
      return;
    }
    if ((blocklyWorkspace as Blockly.WorkspaceSvg).isDragging()) {
      // Don't regenerate python code mid-drag.
      return;
    }
    const code = extendedPythonGenerator.workspaceToCode(blocklyWorkspace);
    setGeneratedCode(code);
  };

  // When the list of modules has been fetched, fill the tree.
  useEffect(() => {
    const treeDataArray: TreeData[] = [];
    modules.forEach((workspace) => {
      const children: TreeData[] = [];
      workspace.opModes.forEach((opMode) => {
        const child: TreeData = {
          key: opMode.modulePath,
          title: opMode.moduleName,
          icon: <FileOutlined />,
        };
        children.push(child);
      });
      const parent: TreeData = {
        key: workspace.modulePath,
        title: workspace.workspaceName,
        children: children,
        icon: <FolderOutlined />,
      };
      treeDataArray.push(parent);
    });
    setTreeData(treeDataArray);

    if (!currentModulePath) {
      storage.fetchEntry('currentModulePath', (modulePath: string | null, error: string) => {
        if (error) {
          console.log(error);
          return;
        }
        if (modulePath != null) {
          if (!currentModulePath) {
            setCurrentModulePath(modulePath);
          }
        } 
      });
    }
  }, [modules, currentModulePath]);

  const handleNewWorkspaceOk = (workspaceName: string, callback: (success: boolean, error: string) => void) => {
    const workspaceContent = commonStorage.newModuleContent();
    const workspacePath = commonStorage.makeModulePath(workspaceName, workspaceName);
    storage.createModule(
        commonStorage.MODULE_TYPE_WORKSPACE, workspacePath, workspaceContent,
        callback);
  };

  const getWorkspaceNames = (): string[] => {
    const workspaceNames: string[] = [];
    modules.forEach((workspace) => {
      workspaceNames.push(workspace.workspaceName);
    });
    return workspaceNames;
  };

  const getCurrentWorkspaceName = (): string => {
    return commonStorage.getWorkspaceName(currentModulePath);
  };

  const getOpModeNames = (workspaceName: string): string[] => {
    const opModeNames: string[] = [];
    for (const workspace of modules) {
      if (workspace.workspaceName === workspaceName) {
        workspace.opModes.forEach((opMode) => {
          opModeNames.push(opMode.moduleName);
        });
        break;
      }
    }
    return opModeNames;
  };

  const handleNewOpModeOk = (workspaceName: string, opModeName: string, callback: (success: boolean, error: string) => void) => {
    const opModeContent = commonStorage.newModuleContent();
    const opModePath = commonStorage.makeModulePath(workspaceName, opModeName);
    storage.createModule(
        commonStorage.MODULE_TYPE_OPMODE, opModePath, opModeContent,
        callback);
  };

  const handleSave = () => {
    if (currentModulePath && blocklyComponent.current) {
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

  const handleModuleExpanded = (expandedKeys: TreeKey[], info: { node: never; expanded: boolean; nativeEvent: MouseEvent; }) => {
    const stringKeys: string[] = [];
    expandedKeys.forEach((key) => {
      stringKeys.push(key as string);
    });
    setTreeExpandedKeys(stringKeys);
  };

  const handleModuleSelected = (selectedKeys: TreeKey[], info: { event: "select"; selected: boolean; node: never; selectedNodes: never[]; nativeEvent: MouseEvent; }) => {
    if (selectedKeys.length === 1) {
      // TODO(lizlooney): Before loading different module, check whether the
      // blocks need to be saved.
      const modulePath = selectedKeys[0] as string;
      setCurrentModulePath(modulePath);
    }
  };

  // When a module path has become the current module path (either by fetching
  // the most recent module path (soon after the app is loaded) or by the user
  // selecting it in the tree, set the current workspace, expend the
  // workspace node in the tree.
  useEffect(() => {
    if (currentModulePath) {
      setTreeSelectedPath(currentModulePath);
      const workspaceName = commonStorage.getWorkspaceName(currentModulePath);
      const workspacePath = commonStorage.makeModulePath(workspaceName, workspaceName);

      setPathToExpand(workspacePath);

      storage.saveEntry('currentModulePath', currentModulePath);
      if (blocklyComponent.current) {
        editor.loadModuleBlocks(blocklyComponent.current.getBlocklyWorkspace(), currentModulePath);
      }
    }
  }, [currentModulePath]);

  useEffect(() => {
    if (pathToExpand) {
      setTreeExpandedKeys(treeExpandedKeys.concat(pathToExpand));
      setPathToExpand('');
    }
  }, [pathToExpand, treeExpandedKeys]);

  const handleCopy = () => {
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
                disabled={!currentModulePath}
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
              treeData={treeData}
              expandedKeys={treeExpandedKeys}
              onExpand={handleModuleExpanded}
              selectedKeys={[treeSelectedPath]}
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
                    onClick={handleCopy}
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
        isOpen={isNewWorkspaceModalOpen}
        getWorkspaceNames={getWorkspaceNames}
        onOk={(w) => {
          setIsNewWorkspaceModalOpen(false);
          handleNewWorkspaceOk(w, (success: boolean, error: string) => {
            if (success) {
              setTriggerListModules(!triggerListModules);
            } else if (error) {
              console.log(error);
            }
          });
        }}
        onCancel={() => setIsNewWorkspaceModalOpen(false)}
      />
      <NewOpModeModal
        isOpen={isNewOpModeModalOpen}
        getCurrentWorkspaceName={getCurrentWorkspaceName}
        getOpModeNames={getOpModeNames}
        onOk={(w, o) => {
          setIsNewOpModeModalOpen(false);
          handleNewOpModeOk(w, o, (success: boolean, error: string) => {
            if (success) {
              setTriggerListModules(!triggerListModules);
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
