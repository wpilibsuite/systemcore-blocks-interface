import React, { useEffect, useState, useRef } from 'react';
import { Button, ConfigProvider, Input, Modal, Select, Space } from 'antd';
import {
  CopyOutlined,
  DownloadOutlined,
  FileOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BlocklyComponent from './Blockly';


/**
 * Returns true if the given name is a valid python module name.
 */
const isValidPythonModuleName = (name) => {
  if (name) {
    return /^[a-z_][a-z0-9_]*$/.test(name);
  }
  return false;
};

const NewWorkspace = ({ workspaces, isOpen, onOk, onClose }) => {
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
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
        >
          Cancel
        </Button>,
        <Button
          key="ok"
          onClick={() => {
            if (!isValidPythonModuleName(value)) {
              alert(value + " is not a valid python module name");
              return;
            }
            if (workspaceNames.includes(value)) {
              alert("There is already a workspace named " +  value);
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

const WorkspaceSelector = ({ workspaces, workspaceName, isOpen, onSelect, onClose }) => {
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState('');

  return (
    <Modal
      title="Select Workspace"
      open={isOpen}
      afterOpenChange={(open) => {
        if (open) {
          const workspaceItems = [];
          for (let i = 0; i < workspaces.length; i++) {
            workspaceItems.push({ label: workspaces[i].name, value: workspaces[i].name });
          }
          setWorkspaceItems(workspaceItems);
          setSelectedWorkspaceName(workspaceName)
        }
      }}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
        >
          Cancel
        </Button>,
        <Button
          key="select"
          onClick={() => {
            onSelect(selectedWorkspaceName);
          }}
        >
          Select
        </Button>
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ marginBottom: '8px' }}>Workspace</div>
          <Select
            style={{ width: '100%' }}
            value={selectedWorkspaceName}
            onChange={(value) => setSelectedWorkspaceName(value)}
            options={workspaceItems}
          />
        </div>
      </div>
    </Modal>
  );
};
let llDropShadow = {
  filter: 'drop-shadow(0px 0px 5px #000)',
  zIndex: 100,
  height: '30px',
};

const App = () => {
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState(false);
  const [isWorkspaceSelectorOpen, setIsWorkspaceSelectorOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [showCode, setShowCode] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');
  const blocklyComponent = useRef();

  useEffect(() => {
    blocklyComponent.current.getCurrentWorkspaceName((currentWorkspaceName) => {
      if (currentWorkspaceName) {
        setWorkspaceName(currentWorkspaceName);
      }
    });
    listWorkspaces();
  }, []);

  useEffect(() => {
    if (workspaceName) {
      blocklyComponent.current.loadBlocks("workspace", workspaceName);
    }
  }, [workspaceName]);

  const listWorkspaces = () => {
    blocklyComponent.current.listWorkspaces((array, error) => {
      if (array) {
        setWorkspaces(array)
      } else if (error) {
        console.log(error);
      }
    });
  };

  const handleSave = () => {
    if (workspaceName) {
      blocklyComponent.current.saveBlocks("workspace", workspaceName);
    }
  };

  const handleDownload = () => {
    console.log('Download clicked');
  };

  const handleUpload = () => {
    console.log('Upload clicked');
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#66bf0d',
          colorBgBase: '#66bf0d',
          colorText: 'rgba(255, 255, 255, 0.85)',
          colorBorder: '#000',
          colorBgLayout: '#222',
          colorBgSpotlight: '#111',
          colorBgMask: '#111',
          colorBgElevated: '#111',
          colorBgContainer: '#191919',
          colorBorderSecondary: '#000',
        },
        components: {
          Radio: {
            colorPrimary: '#00b96b',
          },
          Checkbox: {
            colorPrimary: '#ff4d4f',
          },
          Layout: {
            headerBg: '#333',
            triggerBg: 'transparent',
            siderBg: '#444',
          },
          Select:{
            optionSelectedBg:'#555',
            optionActiveBg:'#444'
          },
          Menu: {
            colorBgContainer: '#fff',
          },
        },
      }}
    >
      <div
        className="App"
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <header style={{ background: '#333', padding: '8px 16px', filter: 'drop-shadow(0px 0px 5px #000)', zIndex: 100 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'white', fontWeight: 500 }}>Blocks</span>
              <span style={{ color: 'white' }}>|</span>
              <Button
                onClick={() => {
                  // TODO(lizlooney): Check whether the blocks need to be saved before we open a new file.
                  setIsNewWorkspaceOpen(true);
                }}
                style={{ color: 'white' }}
              >
                New Worksapce
              </Button>
              <Button
                icon={<FileOutlined />}
                onClick={() => {
                  // TODO(lizlooney): Check whether the blocks need to be saved before we open a new file.
                  if (workspaces.length) {
                    setIsWorkspaceSelectorOpen(true);
                  }
                }}
                style={{ color: 'white' }}
              >
                {workspaceName}
              </Button>
            </div>
            <Space>
              <Button onClick={toggleCodeWindow}  style={{ color: 'white' }}>
                {showCode ? 'Hide Python Code' : 'Show Python Code'}
              </Button>
              <Button icon={<UploadOutlined />} onClick={handleUpload}  style={{ color: 'white' }}>
                Upload
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}  style={{ color: 'white' }}>
                Download
              </Button>
              <Button icon={<SaveOutlined />} onClick={handleSave}  style={{ color: 'white' }}>
                Save
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

        <NewWorkspace
          isOpen={isNewWorkspaceOpen}
          workspaces={workspaces}
          onOk={(w) => {
            setIsNewWorkspaceOpen(false);
            blocklyComponent.current.newWorkspace(w, (success, error) => {
              if (success) {
                listWorkspaces();
                setWorkspaceName(w);
              } else if (error) {
                console.log(error);
              }
            });
          }}
          onClose={() => setIsNewWorkspaceOpen(false)}
        />
        <WorkspaceSelector
          isOpen={isWorkspaceSelectorOpen}
          workspaces={workspaces}
          workspaceName={workspaceName}
          onSelect={(w, o) => { // HeyLiz - try removing the o parameter here.
            setIsWorkspaceSelectorOpen(false);
            setWorkspaceName(w);
          }}
          onClose={() => setIsWorkspaceSelectorOpen(false)}
        />
      </div>
    </ConfigProvider>
  );
};

export default App;
