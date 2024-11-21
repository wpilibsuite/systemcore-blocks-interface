import React, { useState, useRef } from 'react';
import { Button, Space, ConfigProvider, Modal, Select } from 'antd';
import { 
  DownloadOutlined, 
  UploadOutlined, 
  SaveOutlined, 
  ExportOutlined,
  CopyOutlined,
  FileOutlined 
} from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BlocklyComponent from './Blockly';

const ProjectSelector = ({ isOpen, onClose }) => {
  const [selectedProject, setSelectedProject] = useState('FTCRobot');
  const [selectedComponent, setSelectedComponent] = useState('Autonomous 0');

  const fakeProjects = [
    { label: 'FTCRobot', value: 'FTCRobot' },
    { label: 'ClassroomA', value: 'ClassroomA' },
    { label: 'HomeProject', value: 'HomeProject' }
  ];

  const fakeComponents = [
    { label: 'Autonomous 0', value: 'Autonomous 0' },
    { label: 'Autonomous 1', value: 'Autonomous 1' },
    { label: 'TeleOp Main', value: 'TeleOp Main' },
    { label: 'Test Component', value: 'Test Component' }
  ];

  return (
    <Modal 
      title="Select Project and Component" 
      open={isOpen} 
      
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="select" onClick={onClose}>
          Select
        </Button>
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ marginBottom: '8px' }}>Project</div>
          <Select
            style={{ width: '100%' }}
            value={selectedProject}
            onChange={(value) => setSelectedProject(value)}
            options={fakeProjects}
          />
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>Component</div>
          <Select
            style={{ width: '100%' }}
            value={selectedComponent}
            onChange={(value) => setSelectedComponent(value)}
            options={fakeComponents}
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
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const primaryWorkspace = useRef();

  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
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
                
                icon={<FileOutlined />}
                onClick={() => setIsFileMenuOpen(true)}
                style={{ color: 'white' }}
              >
                FTCRobot - Autonomous 0
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
              <Button icon={<ExportOutlined />} onClick={handleExport}  style={{ color: 'white' }}>
                Export As...
              </Button>
            </Space>
          </div>
        </header>

        <div style={{ flexGrow: 1, display: 'flex', height: '0' }}>
          <BlocklyComponent
            ref={primaryWorkspace}
            onWorkspaceChange={(code) => setGeneratedCode(code)}
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
                <h3 style={{ color: '#fff', margin: 0 }}>Code</h3>
                <Button
                  icon={<CopyOutlined />}
                  onClick={copyCodeToClipboard}
                  size="small"
                  
                  style={{ color: 'white' }}
                >
                  Copy Code
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

        <ProjectSelector 
          isOpen={isFileMenuOpen} 
          onClose={() => setIsFileMenuOpen(false)} 
        />
      </div>
    </ConfigProvider>
  );
};

export default App;