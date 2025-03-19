import React from 'react';

import * as Antd from 'antd';
import * as I18Next from "react-i18next";

import Header from './reactComponents/Header';
import Footer from './reactComponents/Footer';
import ModuleOutline from './reactComponents/ModuleOutline';
import CodeDisplay from './reactComponents/CodeDisplay';
import NewProjectNameModal from './reactComponents/NewProjectNameModal';
import NewModuleNameModal from './reactComponents/NewModuleNameModal';
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
  const [modules, setModules] = React.useState<commonStorage.Project[]>([]);


  // TODO(Alan): Clean this up
  const [newProjectNameModalPurpose, setNewProjectNameModalPurpose] = React.useState('');
  const [newProjectNameModalInitialValue, setNewProjectNameModalInitialValue] = React.useState('');
  const [newProjectNameModalTitle, setNewProjectNameModalTitle] = React.useState('');
  const [newProjectNameModalMessage, setNewProjectNameModalMessage] = React.useState('');
  const [newProjectNameModalIsOpen, setNewProjectNameModalIsOpen] = React.useState(false);


  // TODO(Alan): Clean this up
  const [newModuleNameModalPurpose, setNewModuleNameModalPurpose] = React.useState('');
  const [newModuleNameModalInitialValue, setNewModuleNameModalInitialValue] = React.useState('');
  const [newModuleNameModalTitle, setNewModuleNameModalTitle] = React.useState('');
  const [newModuleNameModalExample, setNewModuleNameModalExample] = React.useState('');
  const [newModuleNameModalLabel, setNewModuleNameModalLabel] = React.useState('');
  const [newModuleNameModalIsOpen, setNewModuleNameModalIsOpen] = React.useState(false);

  const [messageApi, contextHolder] = Antd.message.useMessage();

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

  const getProjectClassNames = (): string[] => {
    const projectClassNames: string[] = [];
    modules.forEach((project) => {
      projectClassNames.push(project.className);
    });
    return projectClassNames;
  };

  const getProjectNames = (): string[] => {
    const projectNames: string[] = [];
    modules.forEach((project) => {
      projectNames.push(project.projectName);
    });
    return projectNames;
  };
  const handleNewModuleNameOk = async (newModuleClassName: string) => {
    /*
    if (!storage || !currentModule) {
    return;
    */
  }
  const handleNewProjectNameOk = async (newProjectClassName: string) => {
    /*
    if (!storage || !currentModule) {
      return;
    }
    const newProjectName = commonStorage.classNameToModuleName(newProjectClassName);
    const newProjectPath = commonStorage.makeProjectPath(newProjectName);
    if (newProjectNameModalPurpose === PURPOSE_NEW_PROJECT) {
      const projectContent = commonStorage.newProjectContent(newProjectName);
      try {
        await storage.createModule(
            commonStorage.MODULE_TYPE_PROJECT, newProjectPath, projectContent);
        await fetchListOfModules();
        setCurrentModulePath(newProjectPath);
      } catch (e) {
        console.log('Failed to create a new project. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to create a new project.');
        setAlertErrorVisible(true);
      }
    } else if (newProjectNameModalPurpose === PURPOSE_RENAME_PROJECT) {
      try {
        await storage.renameModule(
            currentModule.moduleType, currentModule.projectName,
            currentModule.moduleName, newProjectName);
        await fetchListOfModules();
        setCurrentModulePath(newProjectPath);
      } catch (e) {
        console.log('Failed to rename the project. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to rename the project.');
        setAlertErrorVisible(true);
      }
    } else if (newProjectNameModalPurpose === PURPOSE_COPY_PROJECT) {
      try {
        await storage.copyModule(
          currentModule.moduleType, currentModule.projectName,
          currentModule.moduleName, newProjectName);
        await fetchListOfModules();
        setCurrentModulePath(newProjectPath);
      } catch (e) {
        console.log('Failed to copy the project. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to copy the project.');
        setAlertErrorVisible(true);
      }
    }
    */
  };
  // Provide a callback so the NewModuleNameModal will know what the current
  // project name is.
  const getCurrentProjectName = (): string => {
    return '';
    //return currentModule ? currentModule.projectName : '';
  };

  // Provide a callback so the NewModuleNameModal will know what the existing
  // module class names are in the current project.
  const getModuleClassNames = (projectName: string): string[] => {
    const moduleClassNames: string[] = [];
    for (const project of modules) {
      if (project.projectName === projectName) {
        project.mechanisms.forEach((mechanism) => {
          moduleClassNames.push(mechanism.className);
        });
        project.opModes.forEach((opMode) => {
          moduleClassNames.push(opMode.className);
        });
        break;
      }
    }
    return moduleClassNames;
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
              setAlertErrorMessage={setAlertErrorMessage}
            />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%' defaultSize='50%'>
            <BlocklyComponent ref={blocklyComponent} />
          </Antd.Splitter.Panel>
          <Antd.Splitter.Panel min='2%'>
            <CodeDisplay generatedCode=""
              messageApi={messageApi}
              setAlertErrorMessage={setAlertErrorMessage}
            />
          </Antd.Splitter.Panel>
        </Antd.Splitter>
      </Antd.Flex>
      <Footer />
      <NewProjectNameModal
        title={newProjectNameModalTitle}
        message={newProjectNameModalMessage}
        isOpen={newProjectNameModalIsOpen}
        initialValue={newProjectNameModalInitialValue}
        getProjectClassNames={getProjectClassNames}
        onOk={(newName) => {
          setNewProjectNameModalIsOpen(false);
          handleNewProjectNameOk(newName);
        }}
        onCancel={() => setNewProjectNameModalIsOpen(false)}
      />
      <NewModuleNameModal
        title={newModuleNameModalTitle}
        example={newModuleNameModalExample}
        label={newModuleNameModalLabel}
        isOpen={newModuleNameModalIsOpen}
        initialValue={newModuleNameModalInitialValue}
        getCurrentProjectName={getCurrentProjectName}
        getModuleClassNames={getModuleClassNames}
        onOk={(newName) => {
          setNewModuleNameModalIsOpen(false);
          handleNewModuleNameOk(newName);
        }}
        onCancel={() => setNewModuleNameModalIsOpen(false)}
      />
    </Antd.ConfigProvider>
  );
};

export default App;
