import React from 'react';

import * as Antd from 'antd';
import * as I18Next from "react-i18next";

import * as Blockly from 'blockly/core';

import { createGeneratorContext, GeneratorContext } from './editor/generator_context';

import Header from './reactComponents/Header';
import Footer from './reactComponents/Footer';
import ModuleOutline from './reactComponents/ModuleOutline';
import CodeDisplay from './reactComponents/CodeDisplay';
import BlocklyComponent, { BlocklyComponentType } from './reactComponents/BlocklyComponent';
import ToolboxSettingsModal from './reactComponents/ToolboxSettings';

import * as commonStorage from './storage/common_storage';
import * as clientSideStorage from './storage/client_side_storage';
import * as editor from './editor/editor';

import * as CustomBlocks from './blocks/setup_custom_blocks';
import { initialize as initializeGeneratedBlocks } from './blocks/utils/generated/initialize';

import { pythonGenerator } from 'blockly/python';
import { extendedPythonGenerator } from './editor/extended_python_generator'

import * as ChangeFramework from './blocks/utils/change_framework'
import { mutatorOpenListener } from './blocks/mrc_class_method_def'

const App: React.FC = () => {
  const { t } = I18Next.useTranslation();
  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [storage, setStorage] = React.useState<commonStorage.Storage | null>(null);
  const [currentModule, setCurrentModule] = React.useState<commonStorage.Module | null>(null);

  const [messageApi, contextHolder] = Antd.message.useMessage();
  const [generatedCode, setGeneratedCode] = React.useState<string>('');
  const [toolboxSettingsModalIsOpen, setToolboxSettingsModalIsOpen] = React.useState(false);
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] = React.useState<Set<string>>(new Set());
  const blocksEditor = React.useRef<editor.Editor | null>(null);
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = React.useState(0);
  const generatorContext = React.useRef<GeneratorContext | null>(null);


  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);

  // When the app is loaded, open storage and initialize the blocks we provide.
  React.useEffect(() => {
    openStorage();
    initializeBlocks();
    //testAllBlocksInToolbox(toolbox.getToolboxJSON([], []).contents);
  }, []);

  React.useEffect(() => {
    if (generatorContext.current) {
      generatorContext.current.setModule(currentModule);
    }
  }, [currentModule]);

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

  const initializeShownPythonToolboxCategories = async () => {
    if (!storage) {
      return;
    }
    try {
      const value = await storage.fetchEntry('shownPythonToolboxCategories', '[]');
      const shownCategories: string[] = JSON.parse(value);
      setShownPythonToolboxCategories(new Set(shownCategories));
    } catch (e) {
      console.log('Failed to fetch shownPythonToolboxCategories. Caught the following error...');
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [shownPythonToolboxCategories]);

  const handleToolboxSettingsOk = async (updatedShownCategories: Set<string>) => {
    if (!storage) {
      return;
    }
    setShownPythonToolboxCategories(updatedShownCategories);
    const array = Array.from(updatedShownCategories);
    array.sort();
    storage.saveEntry('shownPythonToolboxCategories', JSON.stringify(array));
  };

  React.useEffect(() => {
    if (!blocklyComponent.current || !storage) {
      return;
    }
    const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
    if (blocklyWorkspace) {
      ChangeFramework.setup(blocklyWorkspace);
      blocklyWorkspace.addChangeListener(mutatorOpenListener);
      blocklyWorkspace.addChangeListener(handleBlocksChanged);
    }
    generatorContext.current = createGeneratorContext();
    if (currentModule) {
      generatorContext.current.setModule(currentModule);
    }
    blocksEditor.current = new editor.Editor(blocklyWorkspace, generatorContext.current, storage);
  }, [blocklyComponent, storage]);

  React.useEffect(() => {
    if (currentModule && blocklyComponent.current && generatorContext.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      setGeneratedCode(extendedPythonGenerator.mrcWorkspaceToCode(
        blocklyWorkspace, generatorContext.current));
    } else {
      setGeneratedCode('');
    }
  }, [currentModule, triggerPythonRegeneration, blocklyComponent]);

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
    setTriggerPythonRegeneration(Date.now());
  };
  
  React.useEffect(() => {
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [currentModule, shownPythonToolboxCategories]);

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
              blocksEditor={blocksEditor.current}
              initializeShownPythonToolboxCategories={initializeShownPythonToolboxCategories}
              currentModule={currentModule}
              setCurrentModule={setCurrentModule}
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
      <ToolboxSettingsModal
        isOpen={toolboxSettingsModalIsOpen}
        shownCategories={shownPythonToolboxCategories}
        onOk={(updatedShownCategories: Set<string>) => {
          setToolboxSettingsModalIsOpen(false);
          handleToolboxSettingsOk(updatedShownCategories);
        }}
        onCancel={() => setToolboxSettingsModalIsOpen(false)}
      />
    </Antd.ConfigProvider>
  );
};

export default App;
