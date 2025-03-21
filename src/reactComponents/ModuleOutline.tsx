import React from 'react';
import * as Antd from 'antd';
import ModuleButtons from './ModuleButtons';
import * as commonStorage from '../storage/common_storage';
import * as I18Next from "react-i18next";
import * as NewProjectNameModal from './NewProjectNameModal';
import * as NewModuleNameModal from './/NewModuleNameModal';
import * as editor from '../editor/editor';
import type { MessageInstance } from 'antd/es/message/interface';

interface ModuleOutlineProps {
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  messageApi : MessageInstance;
}

export default function ModuleOutline(props: ModuleOutlineProps) {
  const { t } = I18Next.useTranslation();

  const [currentModulePath, setCurrentModulePath] = React.useState('');
  const [treeData, setTreeData] = React.useState<Antd.TreeDataNode[]>([]);
  const [treeExpandedKeys, setTreeExpandedKeys] = React.useState<React.Key[]>([]);
  const [treeSelectedKey, setTreeSelectedKey] = React.useState<React.Key>('');
  const [renameTooltip, setRenameTooltip] = React.useState('Rename');
  const [copyTooltip, setCopyTooltip] = React.useState('Copy');
  const [deleteTooltip, setDeleteTooltip] = React.useState('Delete');
  const [modules, setModules] = React.useState<commonStorage.Project[]>([]);
  const [currentModule, setCurrentModule] = React.useState<commonStorage.Module | null>(null);
  const blocksEditor = React.useRef<editor.Editor | null>(null);

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

  // TODO(Alan): Clean this up
  const PURPOSE_NEW_PROJECT = 'NewProject';
  const PURPOSE_RENAME_PROJECT = 'RenameProject';
  const PURPOSE_COPY_PROJECT = 'CopyProject';

  const PURPOSE_NEW_MECHANISM = 'NewMechanism';
  const PURPOSE_NEW_OPMODE = 'NewOpMode';
  const PURPOSE_RENAME_MODULE = 'RenameModule';
  const PURPOSE_COPY_MODULE = 'CopyModule';

  //TODO(Alan): Clean this up
  const [popconfirmTitle, setPopconfirmTitle] = React.useState('');
  const [popconfirmDescription, setPopconfirmDescription] = React.useState('');
  const [openPopconfirm, setOpenPopconfirm] = React.useState(false);
  const afterPopconfirmOk = React.useRef<() => void>(() => { });
  const [popconfirmLoading, setPopconfirmLoading] = React.useState(false);


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

  const getProjectNames = (): string[] => {
    const projectNames: string[] = [];
    modules.forEach((project) => {
      projectNames.push(project.projectName);
    });
    return projectNames;
  };

  const getProjectClassNames = (): string[] => {
    const projectClassNames: string[] = [];
    modules.forEach((project) => {
      projectClassNames.push(project.className);
    });
    return projectClassNames;
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

  const handleNewModuleNameOk = async (newModuleClassName: string) => {
    if (!props.storage || !currentModule) {
      return;
    }
    const newModuleName = commonStorage.classNameToModuleName(newModuleClassName);
    const newModulePath = commonStorage.makeModulePath(currentModule.projectName, newModuleName);
    if (newModuleNameModalPurpose === PURPOSE_NEW_MECHANISM) {
      const mechanismContent = commonStorage.newMechanismContent(
        currentModule.projectName, newModuleName);
      try {
        await props.storage.createModule(
          commonStorage.MODULE_TYPE_MECHANISM, newModulePath, mechanismContent);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to create a new mechanism. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to create a new mechanism.');
      }
    } else if (newModuleNameModalPurpose === PURPOSE_NEW_OPMODE) {
      const opModeContent = commonStorage.newOpModeContent(currentModule.projectName, newModuleName);
      try {
        await props.storage.createModule(
          commonStorage.MODULE_TYPE_OPMODE, newModulePath, opModeContent);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to create a new OpMode. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to create a new OpMode');
      }
    } else if (newModuleNameModalPurpose === PURPOSE_RENAME_MODULE) {
      try {
        await props.storage.renameModule(
          currentModule.moduleType, currentModule.projectName,
          currentModule.moduleName, newModuleName);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to rename the module. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to rename the module.');
      }
    } else if (newModuleNameModalPurpose === PURPOSE_COPY_MODULE) {
      try {
        await props.storage.copyModule(
          currentModule.moduleType, currentModule.projectName,
          currentModule.moduleName, newModuleName);
        await fetchListOfModules();
        setCurrentModulePath(newModulePath);
      } catch (e) {
        console.log('Failed to copy the module. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to copy the module.');
      }
    }
  }
  const handleNewProjectNameOk = async (newProjectClassName: string) => {
    if (!props.storage || !currentModule) {
      return;
    }
    const newProjectName = commonStorage.classNameToModuleName(newProjectClassName);
    const newProjectPath = commonStorage.makeProjectPath(newProjectName);
    if (newProjectNameModalPurpose === PURPOSE_NEW_PROJECT) {
      const projectContent = commonStorage.newProjectContent(newProjectName);
      try {
        await props.storage.createModule(
          commonStorage.MODULE_TYPE_PROJECT, newProjectPath, projectContent);
        await fetchListOfModules();
        setCurrentModulePath(newProjectPath);
      } catch (e) {
        console.log('Failed to create a new project. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to create a new project.');
      }
    } else if (newProjectNameModalPurpose === PURPOSE_RENAME_PROJECT) {
      try {
        await props.storage.renameModule(
          currentModule.moduleType, currentModule.projectName,
          currentModule.moduleName, newProjectName);
        await fetchListOfModules();
        setCurrentModulePath(newProjectPath);
      } catch (e) {
        console.log('Failed to rename the project. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to rename the project.');
      }
    } else if (newProjectNameModalPurpose === PURPOSE_COPY_PROJECT) {
      try {
        await props.storage.copyModule(
          currentModule.moduleType, currentModule.projectName,
          currentModule.moduleName, newProjectName);
        await fetchListOfModules();
        setCurrentModulePath(newProjectPath);
      } catch (e) {
        console.log('Failed to copy the project. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to copy the project.');
      }
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
        if (!props.storage || !currentModule) {
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
            await props.storage.deleteModule(moduleTypeToDelete, modulePathToDelete);
            await fetchListOfModules();
          } catch (e) {
            console.log('Failed to delete the project. Caught the following error...');
            console.log(e);
            props.setAlertErrorMessage('Failed to delete the project.');
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
            await props.storage.deleteModule(moduleTypeToDelete, modulePathToDelete);
            await fetchListOfModules();
          } catch (e) {
            console.log('Failed to delete the module. Caught the following error...');
            console.log(e);
            props.setAlertErrorMessage('Failed to delete the module.');
          }
        }
      });
    };
    setOpenPopconfirm(true);
  };

  const fetchListOfModules = async (): Promise<commonStorage.Project[]> => {
    return new Promise(async (resolve, reject) => {
      if (!props.storage) {
        reject(new Error());
        return;
      }
      try {
        const array = await props.storage.listModules();
        setModules(array)
        resolve(array);
      } catch (e) {
        console.log('Failed to load the list of modules. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage(t("fail_list_modules"));
        reject(new Error(t("fail_list_modules")));
      }
    });
  };

  const handlePopconfirmOk = () => {
    const callback = afterPopconfirmOk.current;
    afterPopconfirmOk.current = () => { };
    callback();
  };

  const uploadProps: Antd.UploadProps = {
    accept: commonStorage.UPLOAD_DOWNLOAD_FILE_EXTENSION,
    beforeUpload: (file) => {
      const isBlocks = file.name.endsWith(commonStorage.UPLOAD_DOWNLOAD_FILE_EXTENSION)
      if (!isBlocks) {
        props.setAlertErrorMessage(file.name + ' is not a blocks file');
        return false;
      }
      return isBlocks || Antd.Upload.LIST_IGNORE;
    },
    customRequest: ({ file, onSuccess, onError }) => {
      if (!onSuccess || !onError) {
        return;
      }
      const fileObject = file as File;
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result;
        if (!props.storage || !dataUrl) {
          return;
        }
        const uploadProjectName = commonStorage.makeUploadProjectName(fileObject.name, getProjectNames());
        try {
          await props.storage.uploadProject(uploadProjectName, dataUrl as string);
          onSuccess('Upload successful');
          await fetchListOfModules();
          const uploadProjectPath = commonStorage.makeProjectPath(uploadProjectName);
          setCurrentModulePath(uploadProjectPath);
        } catch (e) {
          console.log('Failed to upload the project. Caught the following error...');
          console.log(e);
          onError(new Error('Failed to upload the project.'));
          props.setAlertErrorMessage('Failed to upload the project');
        }
      };
      reader.onerror = (error) => {
        console.log('Failed to upload the project. reader.onerror called with the following error...');
        console.log(error);
        onError(new Error('Failed to upload the project.'));
        props.setAlertErrorMessage('Failed to upload the project');
      };
      reader.readAsDataURL(fileObject);
    },
  };

  const handleDownloadClicked = () => {
    checkIfBlocksWereModified(async () => {
      if (!props.storage || !currentModule) {
        return;
      }
      try {
        const url = await props.storage.downloadProject(currentModule.projectName);
        const link = document.createElement('a');
        link.href = url;
        link.download = currentModule.projectName + commonStorage.UPLOAD_DOWNLOAD_FILE_EXTENSION;
        link.click();
      } catch (e) {
        console.log('Failed to download the project. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to download the project.');
      }
    });
  };
  const handleModuleSelected: Antd.TreeProps['onSelect'] = (a: React.Key[]) => {
    if (a.length === 1) {
      checkIfBlocksWereModified(() => {
        setTreeSelectedKey(a[0]);
      });
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
        props.messageApi.open({
          type: 'success',
          content: 'Save completed successfully.',
        });
        resolve(true);
      } catch (e) {
        console.log('Failed to save the blocks. Caught the following error...');
        console.log(e);
        props.setAlertErrorMessage('Failed to save the blocks.');
        reject(new Error('Failed to save the blocks.'));
      }

    });
  };

  return (
    <Antd.Flex vertical gap="small"
      style={{
        height: '100%',
      }}
    >
      <ModuleButtons
        currentModulePath={currentModulePath}
        handleNewProjectClicked={handleNewProjectClicked}
        handleNewMechanismClicked={handleNewMechanismClicked}
        handleNewOpModeClicked={handleNewOpModeClicked}
        handleSaveClicked={handleSaveClicked}
        handleRenameClicked={handleRenameClicked}
        handleCopyClicked={handleCopyClicked}
        handleDeleteClicked={handleDeleteClicked}
        handleDownloadClicked={handleDownloadClicked}

        renameTooltip={renameTooltip}
        copyTooltip={copyTooltip}
        deleteTooltip={deleteTooltip}
        uploadProps={uploadProps}
      />
      <Antd.Tree
        showIcon
        blockNode
        treeData={treeData}
        expandedKeys={treeExpandedKeys}
        onExpand={setTreeExpandedKeys}
        selectedKeys={[treeSelectedKey]}
        onSelect={handleModuleSelected}
      />
      <NewProjectNameModal.default
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
      <NewModuleNameModal.default
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
      <Antd.Popconfirm
        title={popconfirmTitle}
        description={popconfirmDescription}
        open={openPopconfirm}
        onConfirm={handlePopconfirmOk}
        okButtonProps={{ loading: popconfirmLoading }}
        onCancel={() => setOpenPopconfirm(false)}
      >
      </Antd.Popconfirm>
    </Antd.Flex>
  )
}