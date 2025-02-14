import React, { useEffect, useState, useRef } from 'react';

import {
  Alert,
  Button,
  ConfigProvider,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Splitter,
  Tooltip,
  Tree,
  Typography,
  theme
} from 'antd';
import type { InputRef } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import {
  AppstoreAddOutlined as MechanismAddOutlined,
  AppstoreOutlined as MechanismOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileAddOutlined as OpModeAddOutlined,
  FileOutlined as OpModeOutlined,
  FolderAddOutlined as WorkspaceAddOutlined,
  FolderOutlined as WorkspaceOutlined,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python'

import BlocklyComponent from './Blockly';

import * as CustomBlocks from './blocks/setup_custom_blocks';
import { initialize as initializeGeneratedBlocks } from './blocks/utils/generated/initialize';

import * as editor from './editor/editor';
import { extendedPythonGenerator } from './editor/extended_python_generator';

import * as toolboxItems from './toolbox/items';
import * as toolbox from './toolbox/toolbox';
//import { testAllBlocksInToolbox } from './toolbox/toolbox_tests';
import ToolboxSettingsModal from './toolbox/settings';

import * as storage from './storage/client_side_storage';
import * as commonStorage from './storage/common_storage';

import * as ChangeFramework from './blocks/utils/change_framework'
import {mutatorOpenListener}  from './blocks/mrc_class_method_def'


type NewWorkspaceNameModalProps = {
  title: string;
  isOpen: boolean;
  initialValue: string;
  getWorkspaceNames: () => string[];
  onOk: (newName: string) => void;
  onCancel: () => void;
}

const NewWorkspaceNameModal: React.FC<NewWorkspaceNameModalProps> = ({ title, isOpen, initialValue, getWorkspaceNames, onOk, onCancel }) => {
  const inputRef = useRef<InputRef>(null);
  const [message, setMessage] = useState('');
  const [value, setValue] = useState('');
  const [workspaceNames, setWorkspaceNames] = useState<string[]>([]);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);

  const afterOpenChange = (open: boolean) => {
    if (open) {
      setValue(initialValue);
      const w = getWorkspaceNames();
      if (w.length === 0) {
        setMessage('Let\'s create your first workspace. You just need to give it a name.');
      }
      setWorkspaceNames(w);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setValue('');
      setMessage('');
    }
  };

  const handleOk = () => {
    if (!commonStorage.isValidPythonModuleName(value)) {
      setAlertErrorMessage(value + ' is not a valid blocks module name');
      setAlertErrorVisible(true);
      return;
    }
    if (workspaceNames.includes(value)) {
      setAlertErrorMessage('There is already a workspace named ' +  value);
      setAlertErrorVisible(true);
      return;
    }
    onOk(value);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      afterOpenChange={afterOpenChange}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}> Cancel </Button>,
        <Button key="ok" onClick={handleOk}> OK </Button>
      ]}
    >
      <Flex vertical gap="small">
        <Typography.Paragraph
          style={message.length === 0 ? { display: 'none' } : { }}
        >{message}</Typography.Paragraph>
        <Typography.Paragraph> Workspace Name </Typography.Paragraph>
        <Input
          ref={inputRef}
          value={value}
          onPressEnter={handleOk}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
        {alertErrorVisible && (
          <Alert
            type="error"
            message={alertErrorMessage}
            closable
            afterClose={() => setAlertErrorVisible(false)}
          />
        )}
      </Flex>
    </Modal>
  );
};


type NewModuleNameModalProps = {
  title: string;
  isOpen: boolean;
  initialValue: string;
  getCurrentWorkspaceName: () => string;
  getModuleNames: (workspaceName: string) => string[];
  onOk: (newName: string) => void;
  onCancel: () => void;
}

const NewModuleNameModal: React.FC<NewModuleNameModalProps> = ({ title, isOpen, initialValue, getCurrentWorkspaceName, getModuleNames, onOk, onCancel }) => {
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [moduleNames, setModuleNames] = useState<string[]>([]);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);

  const afterOpenChange = (open: boolean) => {
    if (open) {
      setValue(initialValue);
      const currentWorkspaceName = getCurrentWorkspaceName();
      setWorkspaceName(currentWorkspaceName);
      setModuleNames(getModuleNames(currentWorkspaceName));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setValue('');
    }
  };

  const handleOk = () => {
    if (!commonStorage.isValidPythonModuleName(value)) {
      setAlertErrorMessage(value + ' is not a valid blocks module name');
      setAlertErrorVisible(true);
      return;
    }
    if (workspaceName === value) {
      setAlertErrorMessage('The workspace is already named ' + value);
      setAlertErrorVisible(true);
      return;
    }
    if (moduleNames.includes(value)) {
      setAlertErrorMessage('Another module is already named ' +  value);
      setAlertErrorVisible(true);
      return;
    }
    onOk(value);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      afterOpenChange={afterOpenChange}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}> Cancel </Button>,
        <Button key="ok" onClick={handleOk}> OK </Button>
      ]}
    >
      <Flex vertical gap="small">
        <Typography.Paragraph> Name </Typography.Paragraph>
        <Input
          ref={inputRef}
          value={value}
          onPressEnter={handleOk}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
        {alertErrorVisible && (
          <Alert
            type="error"
            message={alertErrorMessage}
            closable
            afterClose={() => setAlertErrorVisible(false)}
          />
        )}
      </Flex>
    </Modal>
  );
};

type BlocklyComponentType = {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg,
};

const App: React.FC = () => {
  const renderCounter = useRef(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);
  const [mostRecentModulePath, setMostRecentModulePath] = useState<string | null>(null);
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] = useState<Set<string>>(new Set());
  const [triggerListModules, setTriggerListModules] = useState(false);
  const afterListModulesSuccess = useRef<() => void>(() => {});
  const [modules, setModules] = useState<commonStorage.Workspace[]>([]);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<React.Key[]>([]);
  const [treeSelectedKey, setTreeSelectedKey] = useState<React.Key>('');
  const [currentModulePath, setCurrentModulePath] = useState('');
  const [currentModule, setCurrentModule] = useState<commonStorage.Module | null>(null);
  const [renameTooltip, setRenameTooltip] = useState('Rename');
  const [copyTooltip, setCopyTooltip] = useState('Copy');
  const [deleteTooltip, setDeleteTooltip] = useState('Delete');
  const blocklyComponent = useRef<BlocklyComponentType | null>(null);
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = useState(false);
  const blocksEditor = useRef<editor.Editor | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [newWorkspaceNameModalPurpose, setNewWorkspaceNameModalPurpose] = useState('');
  const [newWorkspaceNameModalInitialValue, setNewWorkspaceNameModalInitialValue] = useState('');
  const [newWorkspaceNameModalTitle, setNewWorkspaceNameModalTitle] = useState('');
  const [newWorkspaceNameModalIsOpen, setNewWorkspaceNameModalIsOpen] = useState(false);
  const [newModuleNameModalPurpose, setNewModuleNameModalPurpose] = useState('');
  const [newModuleNameModalInitialValue, setNewModuleNameModalInitialValue] = useState('');
  const [newModuleNameModalTitle, setNewModuleNameModalTitle] = useState('');
  const [newModuleNameModalIsOpen, setNewModuleNameModalIsOpen] = useState(false);
  const [toolboxSettingsModalIsOpen, setToolboxSettingsModalIsOpen] = useState(false);
  const [popconfirmTitle, setPopconfirmTitle] = useState('');
  const [popconfirmDescription, setPopconfirmDescription] = useState('');
  const [openPopconfirm, setOpenPopconfirm] = useState(false);
  const afterPopconfirmOk = useRef<() => void>(() => {});
  const [popconfirmLoading, setPopconfirmLoading] = useState(false);

  const PURPOSE_NEW_WORKSPACE = 'NewWorkspace';
  const PURPOSE_NEW_MECHANISM = 'NewMechanism';
  const PURPOSE_NEW_OPMODE = 'NewOpMode';
  const PURPOSE_RENAME_WORKSPACE = 'RenameWorkspace';
  const PURPOSE_COPY_WORKSPACE = 'CopyWorkspace';
  const PURPOSE_RENAME_MODULE = 'RenameModule';
  const PURPOSE_COPY_MODULE = 'CopyModule';

  const ignoreEffect = () => {
    if (!import.meta.env.MODE || import.meta.env.MODE === 'development') {
      // Development mode.
      return (renderCounter.current < 2);
    }
    return false;
  }

  // When the app is loaded, initialize the blocks we provide.
  useEffect(() => {
    renderCounter.current = renderCounter.current + 1;

    if (ignoreEffect()) {
      return;
    }

    fetchMostRecentModulePath();
    initializeShownPythonToolboxCategories();
    initializeBlocks();
    //testAllBlocksInToolbox(toolbox.getToolboxJSON([], []).contents);
  }, []);

  const fetchMostRecentModulePath = () => {
    storage.fetchEntry(
        'mostRecentModulePath', '',
        (value: string | null, errorMessage: string) => {
      if (value) {
        setMostRecentModulePath(value);
      } else {
        // There is no most recent module path.
        setMostRecentModulePath('');
      }
    });
  };

  const initializeShownPythonToolboxCategories = () => {
    storage.fetchEntry(
        'shownPythonToolboxCategories', '[]',
        (value: string | null, errorMessage: string) => {
      if (value) {
        const shownCategories: string[] = JSON.parse(value);
        setShownPythonToolboxCategories(new Set(shownCategories));
      }
    });
  };

  const initializeBlocks = () => {
    // Initialize blocks and extended python generator.
    const forBlock = Object.create(null);
    CustomBlocks.setup(forBlock);
    Object.assign(pythonGenerator.forBlock, forBlock);
    Object.assign(extendedPythonGenerator.forBlock, pythonGenerator.forBlock);
    initializeGeneratedBlocks();
  };

  // Fetch the list of modules from storage.
  useEffect(() => {
    if (ignoreEffect()) {
      return;
    }
    // mostRecentModulePath hasn't been fetched yet. Try agagin in a bit.
    if (mostRecentModulePath == null) {
      setTimeout(() => {
        setTriggerListModules(!triggerListModules);
      }, 50);
      return;
    }

    storage.listModules((array: commonStorage.Workspace[] | null, errorMessage: string) => {
      if (errorMessage) {
        setAlertErrorMessage('Unable to load the list of modules: ' + errorMessage);
        setAlertErrorVisible(true);
        return
      }
      if (array != null) {
        setModules(array)
        const callback = afterListModulesSuccess.current;
        afterListModulesSuccess.current = () => {};
        callback();

        if (array.length === 0) {
          setNewWorkspaceNameModalPurpose(PURPOSE_NEW_WORKSPACE);
          setNewWorkspaceNameModalInitialValue('');
          setNewWorkspaceNameModalTitle('Welcome to WPILib Blocks!');
          setNewWorkspaceNameModalIsOpen(true);
        }
      }
    });
  }, [triggerListModules]);

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
    modules.forEach((workspace) => {
      if (workspace.modulePath === currentModulePath) {
        foundCurrentModulePath = true;
      }
      if (workspace.modulePath === mostRecentModulePath) {
        foundMostRecentModulePath = true;
      }
      const children: TreeDataNode[] = [];
      workspace.mechanisms.forEach((mechanism) => {
        if (mechanism.modulePath === currentModulePath) {
          foundCurrentModulePath = true;
        }
        if (mechanism.modulePath === mostRecentModulePath) {
          foundMostRecentModulePath = true;
        }
        const child: TreeDataNode = {
          key: mechanism.modulePath,
          title: mechanism.moduleName,
          icon: <MechanismOutlined />,
        };
        children.push(child);
      });
      workspace.opModes.forEach((opMode) => {
        if (opMode.modulePath === currentModulePath) {
          foundCurrentModulePath = true;
        }
        if (opMode.modulePath === mostRecentModulePath) {
          foundMostRecentModulePath = true;
        }
        const child: TreeDataNode = {
          key: opMode.modulePath,
          title: opMode.moduleName,
          icon: <OpModeOutlined />,
        };
        children.push(child);
      });
      const parent: TreeDataNode = {
        key: workspace.modulePath,
        title: workspace.workspaceName,
        children: children,
        icon: <WorkspaceOutlined />,
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
    const module = (modules.length > 0 && currentModulePath)
        ? commonStorage.findModule(modules, currentModulePath)
        : null;
    setCurrentModule(module);

    if (module != null) {
      if (module.moduleType == commonStorage.MODULE_TYPE_WORKSPACE) {
        setRenameTooltip('Rename Workspace');
        setCopyTooltip('Copy Workspace');
        setDeleteTooltip('Delete Workspace');
      } else if (module.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        setRenameTooltip('Rename Mechanism');
        setCopyTooltip('Copy Mechanism');
        setDeleteTooltip('Delete Mechanism');
      } else if (module.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        setRenameTooltip('Rename OpMode');
        setCopyTooltip('Copy OpMode');
        setDeleteTooltip('Delete OpMode');
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
    if (blocklyComponent.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      extendedPythonGenerator.setCurrentModule(currentModule);
      setGeneratedCode(extendedPythonGenerator.workspaceToCode(blocklyWorkspace));
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
    if (blocklyComponent.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      if (blocklyWorkspace) {
        ChangeFramework.setup(blocklyWorkspace);
        blocklyWorkspace.addChangeListener(mutatorOpenListener);

        // Show generated python code.
        blocklyWorkspace.addChangeListener(handleBlocksChanged);
      }

      blocksEditor.current = new editor.Editor(blocklyWorkspace);
    }
  }, [blocklyComponent]);

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
    setTriggerPythonRegeneration(!triggerPythonRegeneration);
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
      afterPopconfirmOk.current = () => {
        setPopconfirmLoading(true);
        saveModule((success) => {
          setOpenPopconfirm(false);
          setPopconfirmLoading(false);
          if (success) {
            callback();
          }
        });
      };
      setOpenPopconfirm(true);
    }
  };

  const handleNewWorkspaceClicked = () => {
    checkIfBlocksWereModified(() => {
      setNewWorkspaceNameModalPurpose(PURPOSE_NEW_WORKSPACE);
      setNewWorkspaceNameModalInitialValue('');
      setNewWorkspaceNameModalTitle('New Workspace');
      setNewWorkspaceNameModalIsOpen(true);
    });
  };

  const getWorkspaceNames = (): string[] => {
    const workspaceNames: string[] = [];
    modules.forEach((workspace) => {
      workspaceNames.push(workspace.workspaceName);
    });
    return workspaceNames;
  };

  const handleNewWorkspaceNameOk = (newWorkspaceName: string) => {
    const newWorkspacePath = commonStorage.makeWorkspacePath(newWorkspaceName);
    if (newWorkspaceNameModalPurpose === PURPOSE_NEW_WORKSPACE) {
      const workspaceContent = commonStorage.newWorkspaceContent(newWorkspaceName);
      storage.createModule(
          commonStorage.MODULE_TYPE_WORKSPACE, newWorkspacePath, workspaceContent,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newWorkspacePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to create a new Workspace: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    } else if (newWorkspaceNameModalPurpose === PURPOSE_RENAME_WORKSPACE) {
      storage.renameModule(
          currentModule.moduleType, currentModule.workspaceName,
          currentModule.moduleName, newWorkspaceName,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newWorkspacePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to rename the Workspace: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    } else if (newWorkspaceNameModalPurpose === PURPOSE_COPY_WORKSPACE) {
      storage.copyModule(
          currentModule.moduleType, currentModule.workspaceName,
          currentModule.moduleName, newWorkspaceName,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newWorkspacePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to copy the Workspace: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    }
  };

  const handleNewMechanismClicked = () => {
    checkIfBlocksWereModified(() => {
      setNewModuleNameModalPurpose(PURPOSE_NEW_MECHANISM);
      setNewModuleNameModalInitialValue('');
      setNewModuleNameModalTitle('New Mechanism');
      setNewModuleNameModalIsOpen(true);
    });
  };

  const handleNewOpModeClicked = () => {
    checkIfBlocksWereModified(() => {
      setNewModuleNameModalPurpose(PURPOSE_NEW_OPMODE);
      setNewModuleNameModalInitialValue('');
      setNewModuleNameModalTitle('New OpMode');
      setNewModuleNameModalIsOpen(true);
    });
  };

  // Provide a callback so the NewModuleNameModal will know what the current
  // workspace name is.
  const getCurrentWorkspaceName = (): string => {
    return currentModule ? currentModule.workspaceName : '';
  };

  // Provide a callback so the NewModuleNameModal will know what the existing
  // module names are in the current workspace.
  const getModuleNames = (workspaceName: string): string[] => {
    const moduleNames: string[] = [];
    for (const workspace of modules) {
      if (workspace.workspaceName === workspaceName) {
        workspace.mechanisms.forEach((mechanism) => {
          moduleNames.push(mechanism.moduleName);
        });
        workspace.opModes.forEach((opMode) => {
          moduleNames.push(opMode.moduleName);
        });
        break;
      }
    }
    return moduleNames;
  };

  const handleNewModuleNameOk = (newModuleName: string) => {
    const newModulePath = commonStorage.makeModulePath(currentModule.workspaceName, newModuleName);
    if (newModuleNameModalPurpose === PURPOSE_NEW_MECHANISM) {
      const mechanismContent = commonStorage.newMechanismContent(currentModule.workspaceName, newModuleName);
      storage.createModule(
          commonStorage.MODULE_TYPE_MECHANISM, newModulePath, mechanismContent,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newModulePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to create a new Mechanism: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    } else if (newModuleNameModalPurpose === PURPOSE_NEW_OPMODE) {
      const opModeContent = commonStorage.newOpModeContent(currentModule.workspaceName, newModuleName);
      storage.createModule(
          commonStorage.MODULE_TYPE_OPMODE, newModulePath, opModeContent,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newModulePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to create a new OpMode: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    } else if (newModuleNameModalPurpose === PURPOSE_RENAME_MODULE) {
      storage.renameModule(
          currentModule.moduleType, currentModule.workspaceName,
          currentModule.moduleName, newModuleName,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newModulePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to rename the module: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    } else if (newModuleNameModalPurpose === PURPOSE_COPY_MODULE) {
      storage.copyModule(
          currentModule.moduleType, currentModule.workspaceName,
          currentModule.moduleName, newModuleName,
          (success: boolean, errorMessage: string) => {
            if (success) {
              afterListModulesSuccess.current = () => {
                setCurrentModulePath(newModulePath);
              };
              setTriggerListModules(!triggerListModules);
            } else if (errorMessage) {
              setAlertErrorMessage('Failed to copy the module: ' + errorMessage);
              setAlertErrorVisible(true);
            }
          });
    }
  };

  const handleSaveClicked = () => {
    saveModule((success) => {});
  };

  const saveModule = (callback: (success: boolean) => void) => {
    if (blocksEditor.current && currentModulePath) {
      blocksEditor.current.saveModule((success, errorMessage) => {
        if (errorMessage) {
          setAlertErrorMessage(errorMessage);
          setAlertErrorVisible(true);
        } else {
          messageApi.open({
            type: 'success',
            content: 'Save completed successfully.',
          });
        }
        callback(success);
      });
    }
  };

  const handleRenameClicked = () => {
    checkIfBlocksWereModified(() => {
      if (!currentModule) {
        return;
      }
      if (currentModule.moduleType == commonStorage.MODULE_TYPE_WORKSPACE) {
        // This is a Workspace.
        setNewWorkspaceNameModalPurpose(PURPOSE_RENAME_WORKSPACE);
        setNewWorkspaceNameModalInitialValue(currentModule.workspaceName);
        setNewWorkspaceNameModalTitle('Rename Workspace');
        setNewWorkspaceNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        // This is a Mechanism.
        setNewModuleNameModalPurpose(PURPOSE_RENAME_MODULE);
        setNewModuleNameModalInitialValue(currentModule.moduleName);
        setNewModuleNameModalTitle('Rename Mechanism');
        setNewModuleNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        // This is an OpMode.
        setNewModuleNameModalPurpose(PURPOSE_RENAME_MODULE);
        setNewModuleNameModalInitialValue(currentModule.moduleName);
        setNewModuleNameModalTitle('Rename OpMode');
        setNewModuleNameModalIsOpen(true);
      }
    });
  };

  const handleCopyClicked = () => {
    checkIfBlocksWereModified(() => {
      if (!currentModule) {
        return;
      }
      if (currentModule.moduleType == commonStorage.MODULE_TYPE_WORKSPACE) {
        // This is a Workspace.
        setNewWorkspaceNameModalPurpose(PURPOSE_COPY_WORKSPACE);
        setNewWorkspaceNameModalInitialValue(currentModule.workspaceName + '_copy');
        setNewWorkspaceNameModalTitle('Copy Workspace');
        setNewWorkspaceNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
        // This is a Mechanism.
        setNewModuleNameModalPurpose(PURPOSE_COPY_MODULE);
        setNewModuleNameModalInitialValue(currentModule.moduleName + '_copy');
        setNewModuleNameModalTitle('Copy Mechanism');
        setNewModuleNameModalIsOpen(true);
      } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
        // This is an OpMode.
        setNewModuleNameModalPurpose(PURPOSE_COPY_MODULE);
        setNewModuleNameModalInitialValue(currentModule.moduleName + '_copy');
        setNewModuleNameModalTitle('Copy OpMode');
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
    if (currentModule.moduleType == commonStorage.MODULE_TYPE_WORKSPACE) {
      setPopconfirmDescription('Press ok to delete this Workspace');
    } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM) {
      setPopconfirmDescription('Press ok to delete this Mechanism');
    } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
      setPopconfirmDescription('Press ok to delete this OpMode');
    }
    // Set the function to be executed if the user clicks 'ok'.
    afterPopconfirmOk.current = () => {
      setOpenPopconfirm(false);
      checkIfBlocksWereModified(() => {
        if (!currentModule) {
          return;
        }
        if (currentModule.moduleType == commonStorage.MODULE_TYPE_WORKSPACE) {
          // This is a Workspace.
          // Before deleting it, select another workspace, if there is one.
          // Put the module type and path into local variables before we select another workspace.
          const moduleTypeToDelete = currentModule.moduleType;
          const modulePathToDelete = currentModulePath;
          let foundAnotherWorkspace = false;
          for (const workspace of modules) {
            if (workspace.modulePath !== modulePathToDelete) {
              setCurrentModulePath(workspace.modulePath);
              foundAnotherWorkspace = true;
              break;
            }
          }
          if (!foundAnotherWorkspace) {
            setCurrentModulePath('');
          }
          storage.deleteModule(moduleTypeToDelete, modulePathToDelete,
            (success: boolean, errorMessage: string) => {
              if (success) {
                setTriggerListModules(!triggerListModules);
              } else if (errorMessage) {
                setAlertErrorMessage('Failed to delete the Workspace: ' + errorMessage);
                setAlertErrorVisible(true);
              }
            });
        } else if (currentModule.moduleType == commonStorage.MODULE_TYPE_MECHANISM
            || currentModule.moduleType == commonStorage.MODULE_TYPE_OPMODE) {
          // This is a Mechanism or an OpMode.
          // Before deleting it, select its workspace.
          // Put the module type and path into local variables before we select its workspace.
          const moduleTypeToDelete = currentModule.moduleType;
          const modulePathToDelete = currentModulePath;
          const workspacePath = commonStorage.makeWorkspacePath(currentModule.workspaceName);
          setCurrentModulePath(workspacePath);
          storage.deleteModule(moduleTypeToDelete, modulePathToDelete,
            (success: boolean, errorMessage: string) => {
              if (success) {
                setTriggerListModules(!triggerListModules);
              } else if (errorMessage) {
                setAlertErrorMessage('Failed to delete the module: ' + errorMessage);
                setAlertErrorVisible(true);
              }
            });
        }
      });
    };
    setOpenPopconfirm(true);
  };

  const handleUploadClicked = () => {
    messageApi.open({
      type: 'success',
      content: 'Not implemented yet .',
    });
  };

  const handleDownloadClicked = () => {
    messageApi.open({
      type: 'success',
      content: 'Not implemented yet .',
    });
  };

  const handleToolboxSettingsClicked = () => {
    setToolboxSettingsModalIsOpen(true);
  };

  const handleToolboxSettingsOk = (updatedShownCategories: Set<string>) => {
    setShownPythonToolboxCategories(updatedShownCategories);
    const array = Array.from(updatedShownCategories);
    array.sort();
    storage.saveEntry('shownPythonToolboxCategories', JSON.stringify(array));
  };

  const handleModuleSelected: TreeProps['onSelect'] = (a: React.Key[], e) => {
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
                  <Tooltip title="New Workspace"
                      placement="bottomRight"
                  >
                    <Button
                      icon={<WorkspaceAddOutlined />}
                      size="small"
                      onClick={handleNewWorkspaceClicked}
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
                  <Tooltip title="Upload">
                    <Button
                      icon={<UploadOutlined />}
                      size="small"
                      onClick={handleUploadClicked}
                      style={{ color: 'white' }}
                    >
                    </Button>
                  </Tooltip>
                  <Tooltip title="Download">
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

      <NewWorkspaceNameModal
        title={newWorkspaceNameModalTitle}
        isOpen={newWorkspaceNameModalIsOpen}
        initialValue={newWorkspaceNameModalInitialValue}
        getWorkspaceNames={getWorkspaceNames}
        onOk={(newName) => {
          setNewWorkspaceNameModalIsOpen(false);
          handleNewWorkspaceNameOk(newName);
        }}
        onCancel={() => setNewWorkspaceNameModalIsOpen(false)}
      />
      <NewModuleNameModal
        title={newModuleNameModalTitle}
        isOpen={newModuleNameModalIsOpen}
        initialValue={newModuleNameModalInitialValue}
        getCurrentWorkspaceName={getCurrentWorkspaceName}
        getModuleNames={getModuleNames}
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
