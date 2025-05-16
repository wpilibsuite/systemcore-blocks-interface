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
  RobotOutlined,
  CodeOutlined,
  BlockOutlined,
  FileOutlined,
  ProjectOutlined
} from '@ant-design/icons';


import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

import Header from './reactComponents/Header';
import Footer from './reactComponents/Footer';
import ModuleOutline from './reactComponents/ModuleOutline';
import CodeDisplay from './reactComponents/CodeDisplay';
import BlocklyComponent, { BlocklyComponentType } from './reactComponents/BlocklyComponent';
import ToolboxSettingsModal from './reactComponents/ToolboxSettings';
import * as Tabs from "./reactComponents/Tabs";

import { createGeneratorContext, GeneratorContext } from './editor/generator_context';
import * as editor from './editor/editor';
import { extendedPythonGenerator } from './editor/extended_python_generator'

import * as commonStorage from './storage/common_storage';
import * as clientSideStorage from './storage/client_side_storage';

import * as CustomBlocks from './blocks/setup_custom_blocks';
import { initialize as initializePythonBlocks } from './blocks/utils/python';
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

  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);

  // When the app is loaded, open storage and initialize the blocks we provide.
  React.useEffect(() => {
    openStorage();
    initializeBlocks();
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
    initializePythonBlocks();
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
  const areBlocksModified = (): boolean => {
    if (blocksEditor.current) {
      return blocksEditor.current.isModified();
    }
    return false;
  }

  const myTabs: Tabs.TabItem[] = [
    { key: 'tab1', title: 'Robot', type: Tabs.TabType.ROBOT },
    { key: 'tab2', title: 'Claw', type: Tabs.TabType.MECHANISM },
    { key: 'tab3', title: 'ThreeSpecimenAuto', type: Tabs.TabType.OPMODE },
    { key: 'tab4', title: 'FieldRelativeTeleop', type: Tabs.TabType.OPMODE },
  ];
  type MenuItem = Required<Antd.MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  function getDivider() : MenuItem {
    return {
        type: 'divider', // Must have
      } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem('Files', 'files', <FileOutlined/>,[
      getItem('Manage...', 'manage'),
      getDivider(),
      getItem('Robot', '1', <RobotOutlined/>),
      getItem('Mechanisms', '2', <BlockOutlined/>, [
        getItem('Arm', '10'),
        getItem('Drive', '11'),
      ]),
      getItem('Opmodes', '3', <CodeOutlined/>, [
        getItem('Auto', '40'),
        getItem('Teleop', '41'),
      ]),
    ]),
    getItem('Project', '100', <ProjectOutlined/>, [
      getItem('New...', '14'),
      getItem('Rename...', '100'),
      getItem('Delete...', '101'),
      getItem('Switch...', '102'),
      getItem('Upload...', '103'),
      getItem('Download...', '104')
   ]),
    
    getItem('Settings', '4', <SettingOutlined/>,[
      getItem('WPI toolbox', '41')
    ]),
  ];

  const { Sider } = Antd.Layout;

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
      <Antd.Layout
        style={{
          background: '#000',
          height: '100vh',
        }}
      >
        <Sider collapsible collapsed={leftCollapsed} onCollapse={(value: any) => setLeftCollapsed(value)}>
          <Antd.Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Antd.Layout>

          <Tabs.Component tabList={myTabs} />

          <Antd.Splitter
            style={{
              height: '100vh',
            }}
          >
            <Antd.Splitter.Panel min='0%' defaultSize='15%'>
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
              {/*
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
              */}
              <BlocklyComponent ref={blocklyComponent} />
            </Antd.Splitter.Panel>
            <Antd.Splitter.Panel min='0%' collapsible={true}>
              <CodeDisplay generatedCode={generatedCode}
                messageApi={messageApi}
                setAlertErrorMessage={setAlertErrorMessage}
              />
            </Antd.Splitter.Panel>
          </Antd.Splitter>
        </Antd.Layout>
      </Antd.Layout>
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
