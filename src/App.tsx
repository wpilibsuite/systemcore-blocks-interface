/**
 * @license
 * Copyright 2025 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import React from 'react';
import * as Antd from 'antd';

import {
  SettingOutlined,
} from '@ant-design/icons';


import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

import Header from './reactComponents/Header';
import Footer from './reactComponents/Footer';
import ModuleOutline from './reactComponents/ModuleOutline';
import CodeDisplay from './reactComponents/CodeDisplay';
import BlocklyComponent, { BlocklyComponentType } from './reactComponents/BlocklyComponent';
import ToolboxSettingsModal from './reactComponents/ToolboxSettings';

import { createGeneratorContext, GeneratorContext } from './editor/generator_context';
import * as editor from './editor/editor';
import { extendedPythonGenerator } from './editor/extended_python_generator'

import * as commonStorage from './storage/common_storage';
import * as clientSideStorage from './storage/client_side_storage';

import * as CustomBlocks from './blocks/setup_custom_blocks';
import { initialize as initializeGeneratedBlocks } from './blocks/utils/generated/initialize';
import * as ChangeFramework from './blocks/utils/change_framework'
import { mutatorOpenListener } from './blocks/mrc_class_method_def'

const App: React.FC = () => {
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
    if (blocksEditor.current) {
      blocksEditor.current.loadModuleBlocks(currentModule);
    }
  }, [currentModule]);

  React.useEffect(() => {
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [shownPythonToolboxCategories]);

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

  React.useEffect(() => {
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [currentModule, shownPythonToolboxCategories]);

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

  const saveBlocks = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!blocksEditor.current) {
        reject(new Error());
        return;
      }
      try {
        await blocksEditor.current.saveBlocks();
        messageApi.open({
          type: 'success',
          content: 'Save completed successfully.',
        });
        resolve(true);
      } catch (e) {
        console.log('Failed to save the blocks. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to save the blocks.');
        reject(new Error('Failed to save the blocks.'));
      }
    });
  };

  const handleToolboxSettingsClicked = () => {
    setToolboxSettingsModalIsOpen(true);
  };

  const handleToolboxSettingsOk = async (updatedShownCategories: Set<string>) => {
    if (!storage) {
      return;
    }
    setShownPythonToolboxCategories(updatedShownCategories);
    const array = Array.from(updatedShownCategories);
    array.sort();
    storage.saveEntry('shownPythonToolboxCategories', JSON.stringify(array));
  };
  const areBlocksModified = () : boolean => {
    if(blocksEditor.current){
      return blocksEditor.current.isModified();
    }
    return false;
  }

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
              saveBlocks={saveBlocks}
              areBlocksModified={areBlocksModified}
              initializeShownPythonToolboxCategories={initializeShownPythonToolboxCategories}
              currentModule={currentModule}
              setCurrentModule={setCurrentModule}
            />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%' defaultSize='50%'>
            <Antd.Space>
              <Antd.Tooltip title="Toolbox Settings">
                <Antd.Button className="smallButton"
                  icon={<SettingOutlined />}
                  size="small"
                  onClick={handleToolboxSettingsClicked}
                >
                </Antd.Button>
              </Antd.Tooltip>
            </Antd.Space>
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
