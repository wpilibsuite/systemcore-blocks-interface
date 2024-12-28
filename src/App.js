import React, { useEffect, useState, useRef } from 'react';
import { Button, ConfigProvider, Divider, Flex, Input, Modal, Space, Table, Typography, theme } from 'antd';
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BlocklyComponent from './Blockly';
import * as storage from './storage/client_side_storage.js';
import * as commonStorage from './storage/common_storage.js';

// TODO(lizlooney) - Make the UI for the list of Workspaces.
// When a workspace is selected, the bottom shows the list of opmodes in that workspace.
// The user can open the workspace or an opmode and then it opens the blockly editor.
// If an opmode is opened, the exported blocks from the workspace are shown in the toolbox.

const NewWorkspaceModal = ({ workspaces, isOpen, onOk, onCancel }) => {
  const [workspaceNames, setWorkspaceNames] = useState([]);
  const [value, setValue] = useState('');

  return (
    <Modal
      title="New Workspace"
      open={isOpen}
      afterOpenChange={(open) => {
        if (open) {
          const workspaceNames = [];
          for (let i = 0; i < workspaces.length; i++) {
            workspaceNames.push(workspaces[i].name);
          }
          setWorkspaceNames(workspaceNames);
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ marginBottom: '8px' }}>Workspace Name</div>
          <Input
            style={{ width: '100%' }}
            value={value}
            onChange={(e) => setValue(e.target.value.toLowerCase())}
          />
        </div>
      </div>
    </Modal>
  );
};

const BlocksEditorModal = ({ moduleTypeArg, moduleFilePathArg, isOpen, onBack }) => {
  const [moduleType, setModuleType] = useState('');
  const [moduleFilePath, setModuleFilePath] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [showCode, setShowCode] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');
  const blocklyComponent = useRef();

  useEffect(() => {
    if (moduleFilePath) {
      setWorkspaceName(commonStorage.getWorkspaceName(moduleFilePath));
      setModuleName(commonStorage.getModuleName(moduleFilePath));
    }
  }, [moduleFilePath]);

  useEffect(() => {
    if (moduleType && moduleFilePath) {
      blocklyComponent.current.loadBlocks(moduleType, moduleFilePath);
    }
  }, [moduleType, moduleFilePath]);

  const handleSave = () => {
    if (moduleType && moduleFilePath) {
      blocklyComponent.current.saveBlocks(moduleType, moduleFilePath);
    }
  };

  const handleDownload = () => {
    console.log('Download clicked');
  };

  const toggleCodeWindow = () => {
    setShowCode(!showCode);
  };

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
    <Modal
      title="Blocks Editor"
      open={isOpen}
      afterOpenChange={(open) => {
        if (open) {
          setModuleType(moduleTypeArg);
          setModuleFilePath(moduleFilePathArg);
        }
      }}
      onCancel={onBack}
      width="4000"
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <header
          style={{
            background: '#333',
            padding: '8px 16px',
            filter: 'drop-shadow(0px 0px 5px #000)',
            zIndex: 100
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'white', fontWeight: 500 }}>Blocks</span>
              <Button
                icon={<CloseOutlined />}
                onClick={() => {
                  // TODO(lizlooney): Check whether the blocks should be saved before going back.
                  onBack();
                }}
                style={{ color: 'white' }}
              >
              </Button>
                {workspaceName}/{moduleName}
              <Button
                icon={<SaveOutlined />}
                onClick={handleSave}
                style={{ color: 'white' }}
              >
                Save
              </Button>
            </div>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                style={{ color: 'white' }}
              >
                Download
              </Button>
              <Button
                onClick={toggleCodeWindow}
                style={{ color: 'white' }}
              >
                {showCode ? 'Hide Python Code' : 'Show Python Code'}
              </Button>
            </Space>
          </div>
        </header>

        <div style={{ flexGrow: 1, display: 'flex', height: '0' }}>
          <BlocklyComponent
            ref={blocklyComponent}
            onGeneratedCodeChanged={(code) => {
              setGeneratedCode(code);
            }}
            type="workspace"
            style={{ flexGrow: 1 }}
          />
          {showCode && (
            <div
              className="code-viewer"
              style={{
                width: '30%',
                backgroundColor: '#1e1e1e',
                padding: '17px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '2px rgb(20,20,20) solid'
              }}
            >
              <div
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h3 style={{ color: '#fff', margin: 0 }}>Python Code</h3>
                <Button
                  icon={<CopyOutlined />}
                  onClick={copyCodeToClipboard}
                  size="small"
                  style={{ color: 'white' }}
                >
                  Copy
                </Button>
              </div>
              <div
                style={{
                  flexGrow: 1,
                  overflowY: 'auto',
                }}
              >
                <SyntaxHighlighter
                  language="python"
                  style={dracula}
                  customStyle={{
                    backgroundColor: '#333',
                  }}
                >
                  {generatedCode}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const App = () => {
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesDataSource, setWorkspacesDataSource] = useState([]);
  const workspacesColumns = [
    {
      title: 'Workspace Name',
      dataIndex: 'workspaceName',
      sorter: (a, b) => {return a.workspaceName.localeCompare(b.workspaceName)},
      render: (text, record) => (
        <Button
          type="text"
          size="small"
          style={{
            
          }}
          onClick={()=> onWorkspaceNameClicked(text, record)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Date Modified',
      dataIndex: 'dateModified',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.dateModifiedMillis - b.dateModifiedMillis,
    },
  ];
  const [workspacesSelectedRowKeys, setWorkspacesSelectedRowKeys] = useState([]);
  const [blocksEditorModuleType, setBlocksEditorModuleType] = useState('');
  const [blocksEditorModuleFilePath, setBlocksEditorModuleFilePath] = useState('');
  const [isBlocksEditorModalOpen, setIsBlocksEditorModalOpen] = useState(false);

  useEffect(() => {
    listWorkspaces();
  }, []);

  useEffect(() => {
    const array = [];
    for (let i = 0; i < workspaces.length; i++) {
      array.push({
        key: String(i),
        workspaceName: workspaces[i].name,
        dateModifiedMillis: workspaces[i].dateModifiedMillis,
        dateModified: new Date(workspaces[i].dateModifiedMillis).toLocaleString(),
      });
    }
    setWorkspacesDataSource(array);
  }, [workspaces]);

  const listWorkspaces = () => {
    storage.listWorkspaces((array, error) => {
      if (array) {
        setWorkspaces(array)
      } else if (error) {
        console.log(error);
      }
    });
  };

  const newWorkspace = (workspaceName, callback) => {
    const workspaceFileContent = commonStorage.newModuleFileContent();
    const workspaceFilePath = commonStorage.makeModuleFilePath(workspaceName, workspaceName);
    storage.saveModule(
        commonStorage.MODULE_TYPE_WORKSPACE, workspaceFilePath, workspaceFileContent,
        callback);
  };

  const handleUpload = () => {
    console.log('Upload Workspace clicked');
  };

  const handleDownloadSelectedWorkspaces = () => {
    console.log('Download clicked - selected row keys are ' + workspacesSelectedRowKeys);
  };

  const handleEditSelectedWorkspace = () => {
    console.log('Edit Selected Workspace clicked - selected row keys are ' + workspacesSelectedRowKeys);
    const index = parseInt(workspacesSelectedRowKeys[0]);
    const workspaceName = workspaces[index].name;
    console.log('workspaceName is ' + workspaceName);
    setBlocksEditorModuleType(commonStorage.MODULE_TYPE_WORKSPACE);
    setBlocksEditorModuleFilePath(commonStorage.makeModuleFilePath(workspaceName, workspaceName));
    setIsBlocksEditorModalOpen(true);
  };

  const handleRenameSelectedWorkspace = () => {
    console.log('Rename Selected Workspace clicked - selected row keys are ' + workspacesSelectedRowKeys);
  };

  const handleCopySelectedWorkspace = () => {
    console.log('Copy Selected Workspace clicked - selected row keys are ' + workspacesSelectedRowKeys);
  };

  const handleDeleteSelectedWorkspaces = () => {
    console.log('Delete Selected Workspaces clicked - selected row keys are ' + workspacesSelectedRowKeys);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setWorkspacesSelectedRowKeys(newSelectedRowKeys);
  };

  const onWorkspaceNameClicked = (text, record) => {
    console.log('Workspace name clicked - text is ' + text + ', record is...');
    console.log(record);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Flex
        vertical
        style={{
          background: '#333',
          height: '100vh'
        }}
      >
        <Typography.Paragraph
          strong={true}
          underline={true}
          style={{
            color: 'cyan',
          }}
        >
          WPILib Blocks
        </Typography.Paragraph>
        <Divider
          orientation="left"
          orientationMargin="2px"
          style={{
            color: 'cyan',
          }}
        >
          My Workspaces
        </Divider>
        <Flex gap="small">
          <Button
            icon={<FolderAddOutlined />} 
            onClick={() => {
              // TODO(lizlooney): Check whether the blocks need to be saved before we open a new file.
              setIsNewWorkspaceModalOpen(true);
            }}
            style={{ color: 'white' }}
          >
            New Worksapce
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={handleUpload}
            style={{ color: 'white' }}
          >
            Upload
          </Button>
          <Button
            icon={<DownloadOutlined />}
            disabled={workspacesSelectedRowKeys.length === 0}
            onClick={handleDownloadSelectedWorkspaces}
            style={{ color: 'white' }}
          >
            Download
          </Button>
        </Flex>
        <Flex>
          <Table
            size="small"
            rowSelection={{
              type: "radio",
              workspacesSelectedRowKeys,
              onChange: onSelectChange,
            }}
            showSorterTooltip={false}
            columns={workspacesColumns}
            dataSource={workspacesDataSource}
            pagination={{ hideOnSinglePage: true }}
          />
        </Flex>
        <Flex gap="small">
          <Button
            disabled={workspacesSelectedRowKeys.length !== 1}
            onClick={handleEditSelectedWorkspace}
            style={{ color: 'white' }}
          >
            Edit
          </Button>
          <Button
            disabled={workspacesSelectedRowKeys.length !== 1}
            onClick={handleRenameSelectedWorkspace}
            style={{ color: 'white' }}
          >
            Rename
          </Button>
          <Button
            icon={<CopyOutlined />}
            disabled={workspacesSelectedRowKeys.length !== 1}
            onClick={handleCopySelectedWorkspace}
            style={{ color: 'white' }}
          >
            Copy
          </Button>
          <Button
            icon={<DeleteOutlined />}
            disabled={workspacesSelectedRowKeys.length === 0}
            onClick={handleDeleteSelectedWorkspaces}
            style={{ color: 'white' }}
          >
            Delete
          </Button>
        </Flex>
      </Flex>

      <NewWorkspaceModal
        workspaces={workspaces}
        isOpen={isNewWorkspaceModalOpen}
        onOk={(w) => {
          setIsNewWorkspaceModalOpen(false);
          newWorkspace(w, (success, error) => {
            if (success) {
              listWorkspaces();
            } else if (error) {
              console.log(error);
            }
          });
        }}
        onCancel={() => setIsNewWorkspaceModalOpen(false)}
      />
      <BlocksEditorModal
        moduleTypeArg={blocksEditorModuleType}
        moduleFilePathArg={blocksEditorModuleFilePath}
        isOpen={isBlocksEditorModalOpen}
        onBack={() => {
          setIsBlocksEditorModalOpen(false);
          listWorkspaces();
        }}
      />
    </ConfigProvider>
  );
};

export default App;
