import './App.css';
import BlocklyComponent, { Block, Value, Field, Shadow } from './Blockly';
import './blocks/customblocks';
import './generator/generator';
import { useState,useRef } from 'react';
import { Tabs, Button, Space,ConfigProvider,Checkbox } from 'antd';
import { 
  DownloadOutlined, 
  UploadOutlined, 
  SaveOutlined, 
  ExportOutlined,
  HomeOutlined,
  CodeOutlined
} from '@ant-design/icons';
let llDropShadow =
{
  filter: "drop-shadow(0px 0px 5px #000)",
  zIndex:100,
  height:"50px"
};
function App() {
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const primaryWorkspace = useRef();
  const handleExport = () => {
    // Add export logic here
    console.log("Export clicked");
  };

  const handleSave = () => {
    // Add save logic here
    console.log("Save clicked");
  };

  const handleDownload = () => {
    // Add download logic here
    console.log("Download clicked");
  };

  const handleUpload = () => {
    // Add upload logic here
    console.log("Upload clicked");
  };
  const generateCode = () => {
    if (primaryWorkspace?.current) {
      // Replace with Python generator when ready
    //  const code = Blockly.JavaScript.workspaceToCode(primaryWorkspace.current);
     // setGeneratedCode(code);
    }
  };

  // Update code when checkbox changes
  const handleCodeToggle = (checked) => {
    setShowCode(checked);
    if (checked) {
      generateCode();
    }
  };
  const items = [
    {
      key: 'blocks',
      label: (
        <span>
          <HomeOutlined /> Blocks Home
        </span>
      ),
    },
    {
      key: 'code',
      label: (
        <span>
          <CodeOutlined /> Code View
        </span>
      ),
    },
  ];

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
            Menu: {
                colorBgContainer: 'fff',
            },
            Table: {},
        },
    }}
>
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ background: '#333', padding: '8px 16px',  ...llDropShadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            items={items}
            defaultActiveKey="blocks"
            style={{ marginBottom: 0 }}
          />
          <Space>
          <Checkbox 
                checked={showCode} 
                onChange={(e) => handleCodeToggle(e.target.checked)}
                style={{ color: 'white' }}
              >
                Show Code
              </Checkbox>
            <Button 
              icon={<UploadOutlined />}
              onClick={handleUpload}
            >
              Upload
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button 
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              Export As...
            </Button>
          </Space>
        </div>
      </header>

        <BlocklyComponent
          readOnly={false}
          trashcan={true}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          initialXml={``}
        >
          <Block type="test_react_field" />
          <Block type="controls_ifelse" />
          <Block type="logic_compare" />
          <Block type="logic_operation" />
          <Block type="controls_repeat_ext">
            <Value name="TIMES">
              <Shadow type="math_number">
                <Field name="NUM">10</Field>
              </Shadow>
            </Value>
          </Block>
          <Block type="logic_operation" />
          <Block type="logic_negate" />
          <Block type="logic_boolean" />
          <Block type="logic_null" disabled="true" />
          <Block type="logic_ternary" />
          <Block type="text_charAt">
            <Value name="VALUE">
              <Block type="variables_get">
                <Field name="VAR">text</Field>
              </Block>
            </Value>
          </Block>
        </BlocklyComponent>
    </div>
    </ConfigProvider>
  );
}

export default App;