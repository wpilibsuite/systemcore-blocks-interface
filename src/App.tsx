import React, { useEffect, useState, useRef } from 'react';

import {
  Alert,
  Button,
  ConfigProvider,
  Flex,
  message,
  Popconfirm,
  Space,
  Splitter,
  Tooltip,
  Tree,
  Typography,
  theme,
  Upload
} from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import type { UploadProps } from 'antd';
import {
  AppstoreAddOutlined as MechanismAddOutlined,
  AppstoreOutlined as MechanismOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileAddOutlined as OpModeAddOutlined,
  FileOutlined as OpModeOutlined,
  FolderAddOutlined as ProjectAddOutlined,
  FolderOutlined as ProjectOutlined,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { useTranslation } from "react-i18next";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python';

import BlocklyComponent from './Blockly';

import * as NewProjectNameModal from './modal/NewProjectNameModal';
import * as NewModuleNameModal from './modal/NewModuleNameModal';

import * as CustomBlocks from './blocks/setup_custom_blocks';
import { initialize as initializeGeneratedBlocks } from './blocks/utils/generated/initialize';

import * as editor from './editor/editor';
import { extendedPythonGenerator } from './editor/extended_python_generator';
import { createGeneratorContext, GeneratorContext } from './editor/generator_context';

//import { testAllBlocksInToolbox } from './toolbox/toolbox_tests';
import ToolboxSettingsModal from './toolbox/settings';

import * as clientSideStorage from './storage/client_side_storage';
import * as commonStorage from './storage/common_storage';

import * as ChangeFramework from './blocks/utils/change_framework'
import {mutatorOpenListener}  from './blocks/mrc_class_method_def'


type BlocklyComponentType = {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg,
};

const App: React.FC = () => {
  const renderCounter = useRef(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);
  const [storage, setStorage] = useState<commonStorage.Storage | null>(null);
  const [mostRecentModulePath, setMostRecentModulePath] = useState<string | null>(null);
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<commonStorage.Project[]>([]);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<React.Key[]>([]);
  const [treeSelectedKey, setTreeSelectedKey] = useState<React.Key>('');
  const [currentModulePath, setCurrentModulePath] = useState('');
  const [currentModule, setCurrentModule] = useState<commonStorage.Module | null>(null);
  const [renameTooltip, setRenameTooltip] = useState('Rename');
  const [copyTooltip, setCopyTooltip] = useState('Copy');
  const [deleteTooltip, setDeleteTooltip] = useState('Delete');
  const blocklyComponent = useRef<BlocklyComponentType | null>(null);
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = useState(0);
  const generatorContext = useRef<GeneratorContext | null>(null);
  const blocksEditor = useRef<editor.Editor | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [newProjectNameModalPurpose, setNewProjectNameModalPurpose] = useState('');
  const [newProjectNameModalInitialValue, setNewProjectNameModalInitialValue] = useState('');
  const [newProjectNameModalTitle, setNewProjectNameModalTitle] = useState('');
  const [newProjectNameModalMessage, setNewProjectNameModalMessage] = useState('');
  const [newProjectNameModalIsOpen, setNewProjectNameModalIsOpen] = useState(false);
  const [newModuleNameModalPurpose, setNewModuleNameModalPurpose] = useState('');
  const [newModuleNameModalInitialValue, setNewModuleNameModalInitialValue] = useState('');
  const [newModuleNameModalTitle, setNewModuleNameModalTitle] = useState('');
  const [newModuleNameModalExample, setNewModuleNameModalExample] = useState('');
  const [newModuleNameModalLabel, setNewModuleNameModalLabel] = useState('');
  const [newModuleNameModalIsOpen, setNewModuleNameModalIsOpen] = useState(false);
  const [toolboxSettingsModalIsOpen, setToolboxSettingsModalIsOpen] = useState(false);
  const [popconfirmTitle, setPopconfirmTitle] = useState('');
  const [popconfirmDescription, setPopconfirmDescription] = useState('');
  const [openPopconfirm, setOpenPopconfirm] = useState(false);
  const afterPopconfirmOk = useRef<() => void>(() => {});
  const [popconfirmLoading, setPopconfirmLoading] = useState(false);

  const PURPOSE_NEW_PROJECT = 'NewProject';
  const PURPOSE_NEW_MECHANISM = 'NewMechanism';
  const PURPOSE_NEW_OPMODE = 'NewOpMode';
  const PURPOSE_RENAME_PROJECT = 'RenameProject';
  const PURPOSE_COPY_PROJECT = 'CopyProject';
  const PURPOSE_RENAME_MODULE = 'RenameModule';
  const PURPOSE_COPY_MODULE = 'CopyModule';

  const { t } = useTranslation();

  const ignoreEffect = () => {
    if (!import.meta.env.MODE || import.meta.env.MODE === 'development') {
      // Development mode.
      return (renderCounter.current < 2);
    }
    return false;
  }

  // When the app is loaded, open storage and initialize the blocks we provide.
  useEffect(() => {
    renderCounter.current = renderCounter.current + 1;
    if (ignoreEffect()) {
      return;
    }

    openStorage();
    initializeBlocks();
    //testAllBlocksInToolbox();
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

  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    if (!storage) {
      return;
    }
    fetchMostRecentModulePath();
    initializeShownPythonToolboxCategories();
    initializeModules();
  }, [storage]);

  const fetchMostRecentModulePath = async () => {
    if (!storage) {
      return;
    }
    try {
      const value = await storage.fetchEntry('mostRecentModulePath', '');
      setMostRecentModulePath(value);
    } catch (e) {
      console.log('Failed to fetch mostRecentModulePath. Caught the following error...');
      console.log(e);
    }
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

  const initializeModules = async () => {
    const array = await fetchListOfModules();
    if (array.length === 0) {
       setNewProjectNameModalPurpose(PURPOSE_NEW_PROJECT);
       setNewProjectNameModalInitialValue('');
       setNewProjectNameModalTitle(NewProjectNameModal.TITLE_WELCOME);
       setNewProjectNameModalMessage(NewProjectNameModal.MESSAGE_WELCOME);
       setNewProjectNameModalIsOpen(true);
    }
  };

  const fetchListOfModules = async (): Promise<commonStorage.Project[]> => {
    return new Promise(async (resolve, reject) => {
      if (!storage) {
        reject(new Error());
        return;
      }
      try {
        const array = await storage.listModules();
        setModules(array)
        resolve(array);
      } catch (e) {
        console.log('Failed to load the list of modules. Caught the following error...');
        console.log(e);
        setAlertErrorMessage(t("fail_list_modules"));
        setAlertErrorVisible(true);
        reject(new Error(t("fail_list_modules")));
      }
    });
  };

  // When the list of modules is set, update the treeData and treeExpandedKeys.
  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    if (modules.length === 0 && treeData.length === 0) {
      return;
    }
    let foundCurrentModulePath = false;
    let foundMostRecentModulePath = false;
    const data: TreeDataNode[] = [];
    const expandedKeys: React.Key[] = []
    modules.forEach((project) => {
      if (project.modulePath === currentModulePath) {
        foundCurrentModulePath = true;
      }
      if (project.modulePath === mostRecentModulePath) {
        foundMostRecentModulePath = true;
      }
      const children: TreeDataNode[] = [];
      project.mechanisms.forEach((mechanism) => {
        if (mechanism.modulePath === currentModulePath) {
          foundCurrentModulePath = true;
        }
        if (mechanism.modulePath === mostRecentModulePath) {
          foundMostRecentModulePath = true;
        }
        const child: TreeDataNode = {
          key: mechanism.modulePath,
          title: mechanism.className,
          icon: <MechanismOutlined />,
        };
        children.push(child);
      });
      project.opModes.forEach((opMode) => {
        if (opMode.modulePath === currentModulePath) {
          foundCurrentModulePath = true;
        }
        if (opMode.modulePath === mostRecentModulePath) {
          foundMostRecentModulePath = true;
        }
        const child: TreeDataNode = {
          key: opMode.modulePath,
          title: opMode.className,
          icon: <OpModeOutlined />,
        };
        children.push(child);
      });
      const parent: TreeDataNode = {
        key: project.modulePath,
        title: project.className,
        children: children,
        icon: <ProjectOutlined />,
      };
      data.push(parent);
      expandedKeys.push(parent.key);
    });
    setTreeData(data);
    setTreeExpandedKeys([...expandedKeys]);

    if (foundCurrentModulePath) {
      setTreeSelectedKey(currentModulePath as React.Key);
    } else if (foundMostRecentModulePath) {
      setTreeSelectedKey(mostRecentModulePath as React.Key);
    } else if (modules.length) {
      setTreeSelectedKey(modules[0].modulePath as React.Key);
    } else {
      setTreeSelectedKey('' as React.Key);
    }
  }, [modules]);

  // When a module path has become the current module path (either by fetching
  // the most recent module path (soon after the app is loaded) or by the user
  // selecting it in the tree, set the current module, update some tooltips, and
  // load the module into the blockly editor.
  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    if (!storage) {
      return;
    }
    const module = (modules.length > 0 && currentModulePath)
        ? commonStorage.findModule(modules, currentModulePath)
        : null;
    setCurrentModule(module);
    if (generatorContext.current) {
      generatorContext.current.setModule(module);
    }

    if (module != null) {
      if (module.moduleType == commonStorage.MODULE_TYPE_PROJECT) {
        setRenameTooltip(t("project_rename"));
        setCopyTooltip(t("project_copy"));
        setDeleteTooltip(t("project_delete"));
      } else if (module.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        setRenameTooltip(t("mechanism_rename"));
        setCopyTooltip(t("mechanism_copy"));
        setDeleteTooltip(t("mechanism_delete"));
      } else if (module.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        setRenameTooltip(t("opmode_rename"));
        setCopyTooltip(t("opmode_copy"));
        setDeleteTooltip(t("opmode_delete"));
      }

      storage.saveEntry('mostRecentModulePath', currentModulePath);
      if (blocksEditor.current) {
        blocksEditor.current.loadModuleBlocks(module);
      }
    } else {

      setRenameTooltip('Rename');
      setCopyTooltip('Copy');
      setDeleteTooltip('Delete');

      storage.saveEntry('mostRecentModulePath', '');
      if (blocksEditor.current) {
        blocksEditor.current.loadModuleBlocks(null);
      }
    }
  }, [currentModulePath]);

  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    if (currentModule && blocklyComponent.current && generatorContext.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      setGeneratedCode(extendedPythonGenerator.mrcWorkspaceToCode(
          blocklyWorkspace, generatorContext.current));
    } else {
      setGeneratedCode('');
    }
  }, [currentModule, triggerPythonRegeneration, blocklyComponent]);

  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [currentModulePath, shownPythonToolboxCategories]);

  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
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
    blocksEditor.current = new editor.Editor(blocklyWorkspace, generatorContext.current, storage);
  }, [blocklyComponent, storage]);

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

  const handlePopconfirmOk = () => {
    const callback = afterPopconfirmOk.current;
    afterPopconfirmOk.current = () => {};
    callback();
  };

  const checkIfBlocksWereModified = (callback: () => void) => {
    if (blocksEditor.current) {
      if (!currentModulePath) {
        callback();
        return;
      }
      if (!blocksEditor.current.isModified()) {
        callback();
        return;
      }

      // Show a bubble confirmation box to ask the user if they want to save the blocks.
      setPopconfirmTitle('Blocks have been modified!');
      setPopconfirmDescription('Press ok to save and continue');
      // Set the function to be executed if the user clicks 'ok'.
      afterPopconfirmOk.current = async () => {
        setPopconfirmLoading(true);
        const success = await saveBlocks();
        setOpenPopconfirm(false);
        setPopconfirmLoading(false);
        if (success) {
          callback();
        }
      };
      setOpenPopconfirm(true);
    }
  };

  const handleNewProjectClicked = () => {
    checkIfBlocksWereModified(() => {
      setNewProjectNameModalPurpose(PURPOSE_NEW_PROJECT);
      setNewProjectNameModalInitialValue('');
      setNewProjectNameModalTitle(NewProjectNameModal.TITLE_NEW_PROJECT);
      setNewProjectNameModalMessage('');
      setNewProjectNameModalIsOpen(true);
    });
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

  const handleNewProjectNameOk = async (newProjectClassName: string) => {
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
  };

  const handleNewMechanismClicked = () => {
    checkIfBlocksWereModified(() => {
      setNewModuleNameModalPurpose(PURPOSE_NEW_MECHANISM);
      setNewModuleNameModalInitialValue('');
      setNewModuleNameModalTitle(NewModuleNameModal.TITLE_NEW_MECHANISM);
      setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_MECHANISM);
      setNewModuleNameModalLabel(NewModuleNameModal.LABEL_MECHANISM);
      setNewModuleNameModalIsOpen(true);
    });
  };

  const handleNewOpModeClicked = () => {
    checkIfBlocksWereModified(() => {
      setNewModuleNameModalPurpose(PURPOSE_NEW_OPMODE);
      setNewModuleNameModalInitialValue('');
      setNewModuleNameModalTitle(NewModuleNameModal.TITLE_NEW_OPMODE);
      setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_OPMODE);
      setNewModuleNameModalLabel(NewModuleNameModal.LABEL_OPMODE);
      setNewModuleNameModalIsOpen(true);
    });
  };

  // Provide a callback so the NewModuleNameModal will know what the current
  // project name is.
  const getCurrentProjectName = (): string => {
    return currentModule ? currentModule.projectName : '';
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

  const handleNewModuleNameOk = async (newModuleClassName: string) => {
    if (!storage || !currentModule) {
    return;
  }
  const newModuleName = commonStorage.classNameToModuleName(newModuleClassName);
    const newModulePath = commonStorage.makeModulePath(currentModule.projectName, newModuleName);
    if (newModuleNameModalPurpose === PURPOSE_NEW_MECHANISM) {
      const mechanismContent = commonStorage.newMechanismContent(
          currentModule.projectName, newModuleName);
      try {
        await storage.createModule(
            commonStorage.MODULE_TYPE_MECHANISM, newModulePath, mechanismContent);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to create a new mechanism. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to create a new mechanism.');
        setAlertErrorVisible(true);
      }
    } else if (newModuleNameModalPurpose === PURPOSE_NEW_OPMODE) {
      const opModeContent = commonStorage.newOpModeContent(currentModule.projectName, newModuleName);
      try {
        await storage.createModule(
            commonStorage.MODULE_TYPE_OPMODE, newModulePath, opModeContent);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to create a new OpMode. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to create a new OpMode');
        setAlertErrorVisible(true);
      }
    } else if (newModuleNameModalPurpose === PURPOSE_RENAME_MODULE) {
      try {
        await storage.renameModule(
            currentModule.moduleType, currentModule.projectName,
            currentModule.moduleName, newModuleName);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to rename the module. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to rename the module.');
        setAlertErrorVisible(true);
      }
    } else if (newModuleNameModalPurpose === PURPOSE_COPY_MODULE) {
      try {
        await storage.copyModule(
            currentModule.moduleType, currentModule.projectName,
            currentModule.moduleName, newModuleName);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to copy the module. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to copy the module.');
        setAlertErrorVisible(true);
      }
    }
  };

  const handleSaveClicked = async () => {
    saveBlocks();
  };

  const saveBlocks = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!blocksEditor.current || !currentModulePath) {
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
        setAlertErrorVisible(true);
        reject(new Error('Failed to save the blocks.'));
      }
    });
  };

  const handleRenameClicked = () => {
    checkIfBlocksWereModified(() => {
      if (!currentModule) {
        return;
      }
      if (currentModule.moduleType == commonStorage.MODULE_TYPE_PROJECT) {
        // This is a Project.
        setNewProjectNameModalPurpose(PURPOSE_RENAME_PROJECT);
        setNewProjectNameModalInitialValue(commonStorage.moduleNameToClassName(currentModule.projectName));
        setNewProjectNameModalTitle(NewProjectNameModal.TITLE_RENAME_PROJECT);
        setNewProjectNameModalMessage('');
        setNewProjectNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        // This is a Mechanism.
        setNewModuleNameModalPurpose(PURPOSE_RENAME_MODULE);
        setNewModuleNameModalInitialValue(currentModule.className);
        setNewModuleNameModalTitle(NewModuleNameModal.TITLE_RENAME_MECHANISM);
        setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_MECHANISM);
        setNewModuleNameModalLabel(NewModuleNameModal.LABEL_MECHANISM);
        setNewModuleNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        // This is an OpMode.
        setNewModuleNameModalPurpose(PURPOSE_RENAME_MODULE);
        setNewModuleNameModalInitialValue(currentModule.className);
        setNewModuleNameModalTitle(NewModuleNameModal.TITLE_RENAME_OPMODE);
        setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_OPMODE);
        setNewModuleNameModalLabel(NewModuleNameModal.LABEL_OPMODE);
        setNewModuleNameModalIsOpen(true);
      }
    });
  };

  const handleCopyClicked = () => {
    checkIfBlocksWereModified(() => {
      if (!currentModule) {
        return;
      }
      if (currentModule.moduleType == commonStorage.MODULE_TYPE_PROJECT) {
        // This is a Project.
        setNewProjectNameModalPurpose(PURPOSE_COPY_PROJECT);
        setNewProjectNameModalInitialValue(commonStorage.moduleNameToClassName(currentModule.projectName) + 'Copy');
        setNewProjectNameModalTitle(NewProjectNameModal.TITLE_COPY_PROJECT);
        setNewProjectNameModalMessage('');
        setNewProjectNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        // This is a Mechanism.
        setNewModuleNameModalPurpose(PURPOSE_COPY_MODULE);
        setNewModuleNameModalInitialValue(currentModule.className + 'Copy');
        setNewModuleNameModalTitle(NewModuleNameModal.TITLE_COPY_MECHANISM);
        setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_MECHANISM);
        setNewModuleNameModalLabel(NewModuleNameModal.LABEL_MECHANISM);
        setNewModuleNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        // This is an OpMode.
        setNewModuleNameModalPurpose(PURPOSE_COPY_MODULE);
        setNewModuleNameModalInitialValue(currentModule.className + 'Copy');
        setNewModuleNameModalTitle(NewModuleNameModal.TITLE_COPY_OPMODE);
        setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_OPMODE);
        setNewModuleNameModalLabel(NewModuleNameModal.LABEL_OPMODE);
        setNewModuleNameModalIsOpen(true);
      }
    });
  };

  const handleDeleteClicked = () => {
    if (!currentModule) {
      return;
    }
    // Show a bubble confirmation box to ask the user if they are sure.
    setPopconfirmTitle('Are you sure?');
    if (currentModule.moduleType == commonStorage.MODULE_TYPE_PROJECT) {
      setPopconfirmDescription('Press ok to delete this Project');
    } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
      setPopconfirmDescription('Press ok to delete this Mechanism');
    } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
      setPopconfirmDescription('Press ok to delete this OpMode');
    }
    // Set the function to be executed if the user clicks 'ok'.
    afterPopconfirmOk.current = () => {
      setOpenPopconfirm(false);
      checkIfBlocksWereModified(async () => {
        if (!storage || !currentModule) {
          return;
        }
        if (currentModule.moduleType == commonStorage.MODULE_TYPE_PROJECT) {
          // This is a Project.
          // Before deleting it, select another project, if there is one.
          // Put the module type and path into local variables before we select another project.
          const moduleTypeToDelete = currentModule.moduleType;
          const modulePathToDelete = currentModulePath;
          let foundAnotherProject = false;
          for (const project of modules) {
            if (project.modulePath !== modulePathToDelete) {
              setCurrentModulePath(project.modulePath);
              foundAnotherProject = true;
              break;
            }
          }
          if (!foundAnotherProject) {
            setCurrentModulePath('');
          }
          try {
            await storage.deleteModule(moduleTypeToDelete, modulePathToDelete);
            await fetchListOfModules();
          } catch (e) {
            console.log('Failed to delete the project. Caught the following error...');
            console.log(e);
            setAlertErrorMessage('Failed to delete the project.');
            setAlertErrorVisible(true);
          }
        } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM
            || currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
          // This is a Mechanism or an OpMode.
          // Before deleting it, select its project.
          // Put the module type and path into local variables before we select its project.
          const moduleTypeToDelete = currentModule.moduleType;
          const modulePathToDelete = currentModulePath;
          const projectPath = commonStorage.makeProjectPath(currentModule.projectName);
          setCurrentModulePath(projectPath);
          try {
            await storage.deleteModule(moduleTypeToDelete, modulePathToDelete);
            await fetchListOfModules();
          } catch (e) {
            console.log('Failed to delete the module. Caught the following error...');
            console.log(e);
            setAlertErrorMessage('Failed to delete the module.');
            setAlertErrorVisible(true);
          }
        }
      });
    };
    setOpenPopconfirm(true);
  };

  const uploadProps: UploadProps = {
    accept: commonStorage.UPLOAD_DOWNLOAD_FILE_EXTENSION,
    beforeUpload: (file) => {
      const isBlocks = file.name.endsWith(commonStorage.UPLOAD_DOWNLOAD_FILE_EXTENSION)
      if (!isBlocks) {
        setAlertErrorMessage(file.name + ' is not a blocks file');
        setAlertErrorVisible(true);
        return false;
      }
      return isBlocks || Upload.LIST_IGNORE;
    },
    customRequest: ({ file, onSuccess, onError }) => {
      if (!onSuccess || !onError) {
        return;
      }
      const fileObject = file as File;
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result;
        if (!storage || !dataUrl) {
          return;
        }
        const uploadProjectName = commonStorage.makeUploadProjectName(fileObject.name, getProjectNames());
        try {
          await storage.uploadProject(uploadProjectName, dataUrl as string);
          onSuccess('Upload successful');
          await fetchListOfModules();
          const uploadProjectPath = commonStorage.makeProjectPath(uploadProjectName);
          setCurrentModulePath(uploadProjectPath);
        } catch (e) {
          console.log('Failed to upload the project. Caught the following error...');
          console.log(e);
          onError(new Error('Failed to upload the project.'));
          setAlertErrorMessage('Failed to upload the project');
          setAlertErrorVisible(true);
        }
      };
      reader.onerror = (error) => {
        console.log('Failed to upload the project. reader.onerror called with the following error...');
        console.log(error);
        onError(new Error('Failed to upload the project.'));
        setAlertErrorMessage('Failed to upload the project');
        setAlertErrorVisible(true);
      };
      reader.readAsDataURL(fileObject);
    },
  };

  const handleDownloadClicked = () => {
    checkIfBlocksWereModified(async () => {
      if (!storage || !currentModule) {
        return;
      }
      try {
        const url = await storage.downloadProject(currentModule.projectName);
        const link = document.createElement('a');
        link.href = url;
        link.download = currentModule.projectName + commonStorage.UPLOAD_DOWNLOAD_FILE_EXTENSION;
        link.click();
      } catch (e) {
        console.log('Failed to download the project. Caught the following error...');
        console.log(e);
        setAlertErrorMessage('Failed to download the project.');
        setAlertErrorVisible(true);
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

  const handleModuleSelected: TreeProps['onSelect'] = (a: React.Key[]) => {
    if (a.length === 1) {
      checkIfBlocksWereModified(() => {
        setTreeSelectedKey(a[0]);
      });
    }
  };

  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    // When a module is selected in the tree, make it the current module.
    const modulePath = treeSelectedKey as string;
    if (modulePath !== currentModulePath) {
      checkIfBlocksWereModified(() => {
        setCurrentModulePath(modulePath);
      });
    }
  }, [treeSelectedKey]);

  const handleCopyPythonClicked = () => {
    navigator.clipboard.writeText(generatedCode).then(
      () => {
        messageApi.open({
          type: 'success',
          content: 'Copy completed successfully.',
        });
      },
      (err) => {
        setAlertErrorMessage('Could not copy code: ' + err);
        setAlertErrorVisible(true);
      }
    );
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
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
      <Flex vertical
        style={{
          background: '#000',
          height: '100vh',
        }}
      >
        <Flex vertical>
          <Typography.Paragraph
            strong={true}
            underline={true}
            style={{
              color: '#aaf',
            }}
          >
            WPILib Blocks
          </Typography.Paragraph>
          {alertErrorVisible && (<Alert
            type="error"
            message={alertErrorMessage}
            closable
            afterClose={() => setAlertErrorVisible(false)}
          />)}
        </Flex>
        <Splitter
          style={{
            height: '100vh',
          }}
        >
          <Splitter.Panel min='2%' defaultSize='15%'>
            <Flex vertical gap="small"
              style={{
                height: '100%',
              }}
            >
              <Flex vertical gap="small">
                <Space>
                  <Tooltip title="New Project"
                      placement="bottomRight"
                  >
                    <Button
                      icon={<ProjectAddOutlined />}
                      size="small"
                      onClick={handleNewProjectClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title="New Mechanism">
                    <Button
                      icon={<MechanismAddOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleNewMechanismClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title="New OpMode">
                    <Button
                      icon={<OpModeAddOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleNewOpModeClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title="Save">
                    <Button
                      icon={<SaveOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleSaveClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                </Space>
                <Space>
                  <Tooltip title={renameTooltip}
                      placement="topRight"
                  >
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleRenameClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title={copyTooltip}>
                    <Button
                      icon={<CopyOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleCopyClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title={deleteTooltip}>
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleDeleteClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title="Upload Project">
                    <Upload
                      {...uploadProps}
                      showUploadList={false}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        size="small"
                        style={{ color: 'white' }}
                      >
                      </Button>
                    </Upload>
                  </Tooltip>
                  <Tooltip title="Download Project">
                    <Button
                      icon={<DownloadOutlined />}
                      size="small"
                      disabled={!currentModulePath}
                      onClick={handleDownloadClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                </Space>
              </Flex>
              <Tree
                showIcon
                blockNode
                treeData={treeData}
                expandedKeys={treeExpandedKeys}
                onExpand={setTreeExpandedKeys}
                selectedKeys={[treeSelectedKey]}
                onSelect={handleModuleSelected}
              />
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel min='2%' defaultSize='50%'>
            <Flex
              vertical gap="small"
              style={modules.length === 0 ? { display: 'none'} : { height: '100%' }}
            >
              <Space>
                <Tooltip title="Toolbox Settings">
                  <Button
                    icon={<SettingOutlined />}
                    size="small"
                    onClick={handleToolboxSettingsClicked}
                    style={{ color: 'white' }}
                  >
                  </Button>
                </Tooltip>
              </Space>
              <Popconfirm
                title={popconfirmTitle}
                description={popconfirmDescription}
                open={openPopconfirm}
                onConfirm={handlePopconfirmOk}
                okButtonProps={{ loading: popconfirmLoading }}
                onCancel={() => setOpenPopconfirm(false)}
              >
                <Flex
                  style={{
                    height: '100%'
                  }}
                >
                  <BlocklyComponent ref={blocklyComponent} />
                </Flex>
              </Popconfirm>
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel min='2%'>
            <Flex
              vertical gap="small"
              style={modules.length === 0 ? { display: 'none'} : { height: '100%' }}
            >
              <Space>
                <h3 style={{ color: '#fff', margin: 0 }}>Python Code</h3>
                <Tooltip title="Copy">
                  <Button
                    icon={<CopyOutlined />}
                    size="small"
                    onClick={handleCopyPythonClicked}
                    style={{ color: 'white' }}
                  >
                  </Button>
                </Tooltip>
              </Space>
              <SyntaxHighlighter
                language="python"
                style={dracula}
                customStyle={{
                  backgroundColor: '#333',
                  width: '100%',
                  height: '100%',
                }}
              >
                {generatedCode}
              </SyntaxHighlighter>
            </Flex>
          </Splitter.Panel>
        </Splitter>
      </Flex>

      <NewProjectNameModal.NewProjectNameModal
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
      <NewModuleNameModal.NewModuleNameModal
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
      <ToolboxSettingsModal
        isOpen={toolboxSettingsModalIsOpen}
        shownCategories={shownPythonToolboxCategories}
        onOk={(updatedShownCategories: Set<string>) => {
          setToolboxSettingsModalIsOpen(false);
          handleToolboxSettingsOk(updatedShownCategories);
        }}
        onCancel={() => setToolboxSettingsModalIsOpen(false)}
      />
    </ConfigProvider>
  );
};

export default App;
