import React from 'react';

import * as Antd from 'antd';
import * as I18Next from "react-i18next";
import * as Blockly from 'blockly/core';

import Header from './reactComponents/Header';
import Footer from './reactComponents/Footer';
import ModuleOutline from './reactComponents/ModuleOutline';
import CodeDisplay from './reactComponents/CodeDisplay';

// TODO: ALAN - Move this to reactComponents, and fix to be typescript
import BlocklyComponent from './Blockly/BlocklyComponent';
type BlocklyComponentType = {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg,
};


const App: React.FC = () => {
  const { t } = I18Next.useTranslation();
  const [alertErrorMessage, setAlertErrorMessage] = React.useState('error');

  const [messageApi, contextHolder] = Antd.message.useMessage();

  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);

  return (
    <Antd.ConfigProvider
      theme={{
        algorithm: Antd.theme.darkAlgorithm,
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
      { contextHolder }
      <Header 
          alertErrorMessage={alertErrorMessage}
          setAlertErrorMessage={setAlertErrorMessage}
      />
      <Antd.Flex vertical
        style={{
          background: '#000',
          height: '100vh',
        }}
      >
        <Antd.Splitter
          style={{
            height: '100vh',
          }}
        >
          <Antd.Splitter.Panel min='2%' defaultSize='15%'>
            <ModuleOutline />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%' defaultSize='50%'>
            <BlocklyComponent ref={blocklyComponent} />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%'>
            <CodeDisplay generatedCode="" messageApi={messageApi}/>
          </Antd.Splitter.Panel>
        </Antd.Splitter>
      </Antd.Flex>
      <Footer />
    </Antd.ConfigProvider>
  );
};

export default App;
