import React from 'react';

import * as Antd from 'antd';
import * as I18Next from "react-i18next";

import Header from './reactComponents/Header';
import Footer from './reactComponents/Footer';
import ModuleOutline from './reactComponents/ModuleOutline';
import CodeDisplay from './reactComponents/CodeDisplay';
import BlocklyComponent, { BlocklyComponentType } from './reactComponents/BlocklyComponent';

import * as commonStorage from './storage/common_storage';
import * as clientSideStorage from './storage/client_side_storage';

import * as CustomBlocks from './blocks/setup_custom_blocks';
import { initialize as initializeGeneratedBlocks } from './blocks/utils/generated/initialize';

import { pythonGenerator } from 'blockly/python';
import { extendedPythonGenerator } from './editor/extended_python_generator'

const App: React.FC = () => {
  const { t } = I18Next.useTranslation();
  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [storage, setStorage] = React.useState<commonStorage.Storage | null>(null);
  const [messageApi, contextHolder] = Antd.message.useMessage();
  const [generatedCode, setGeneratedCode] = React.useState<string>('');

  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);

  // When the app is loaded, open storage and initialize the blocks we provide.
  React.useEffect(() => {
    openStorage();
    initializeBlocks();
    //testAllBlocksInToolbox(toolbox.getToolboxJSON([], []).contents);
  }, []);

  const openStorage = async () => {
    try {
      const c = await clientSideStorage.openClientSideStorage();
      setStorage(c);
    } catch (e) {
      console.log('Failed to open client side storage. Caught the following error...');
      console.log(e);
    }
  };

  const initializeBlocks = () => {
    // Initialize blocks and extended python generator.
    const forBlock = Object.create(null);
    CustomBlocks.setup(forBlock);
    Object.assign(pythonGenerator.forBlock, forBlock);
    Object.assign(extendedPythonGenerator.forBlock, pythonGenerator.forBlock);
    initializeGeneratedBlocks();
  };

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
      {contextHolder}
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
            <ModuleOutline
              storage={storage}
              messageApi={messageApi}
              setAlertErrorMessage={setAlertErrorMessage}
              setGeneratedCode={setGeneratedCode}
              blocklyComponent={blocklyComponent.current}
            />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%' defaultSize='50%'>
            <BlocklyComponent ref={blocklyComponent} />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%'>
            <CodeDisplay generatedCode={generatedCode}
              messageApi={messageApi}
              setAlertErrorMessage={setAlertErrorMessage}
            />
          </Antd.Splitter.Panel>
        </Antd.Splitter>
      </Antd.Flex>
      <Footer />
    </Antd.ConfigProvider>
  );
};

export default App;
