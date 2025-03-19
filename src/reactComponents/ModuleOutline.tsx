import React from 'react';
import * as Antd from 'antd';
import ModuleButtons from './ModuleButtons';
import * as commonStorage from '../storage/common_storage';
import * as I18Next from "react-i18next";

interface ModuleOutlineProps {
    storage : commonStorage.Storage | null;
    setAlertErrorMessage : (message : string) => void;
}

export default function ModuleOutline(props : ModuleOutlineProps) {
      const { t } = I18Next.useTranslation();
    
    const [currentModulePath, setCurrentModulePath] = React.useState('');
    const [treeData, setTreeData] = React.useState<Antd.TreeDataNode[]>([]);
    const [treeExpandedKeys, setTreeExpandedKeys] = React.useState<React.Key[]>([]);
    const [treeSelectedKey, setTreeSelectedKey] = React.useState<React.Key>('');
    const [renameTooltip, setRenameTooltip] = React.useState('Rename');
    const [copyTooltip, setCopyTooltip] = React.useState('Copy');
    const [deleteTooltip, setDeleteTooltip] = React.useState('Delete');
    const [modules, setModules] = React.useState<commonStorage.Project[]>([]);
    
    const getProjectNames = (): string[] => {
        const projectNames: string[] = [];
        modules.forEach((project) => {
          projectNames.push(project.projectName);
        });
        return projectNames;
      };

    const handleNewProjectClicked = () => {
        /*
        checkIfBlocksWereModified(() => {
          setNewProjectNameModalPurpose(PURPOSE_NEW_PROJECT);
          setNewProjectNameModalInitialValue('');
          setNewProjectNameModalTitle(NewProjectNameModal.TITLE_NEW_PROJECT);
          setNewProjectNameModalMessage('');
          setNewProjectNameModalIsOpen(true);
        });
        */
    };
    const handleNewMechanismClicked = () => {
        /*
          checkIfBlocksWereModified(() => {
            setNewModuleNameModalPurpose(PURPOSE_NEW_MECHANISM);
            setNewModuleNameModalInitialValue('');
            setNewModuleNameModalTitle(NewModuleNameModal.TITLE_NEW_MECHANISM);
            setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_MECHANISM);
            setNewModuleNameModalLabel(NewModuleNameModal.LABEL_MECHANISM);
            setNewModuleNameModalIsOpen(true);
          });
          */
    };

    const handleNewOpModeClicked = () => {
        /*
      checkIfBlocksWereModified(() => {
        setNewModuleNameModalPurpose(PURPOSE_NEW_OPMODE);
        setNewModuleNameModalInitialValue('');
        setNewModuleNameModalTitle(NewModuleNameModal.TITLE_NEW_OPMODE);
        setNewModuleNameModalExample(NewModuleNameModal.EXAMPLE_OPMODE);
        setNewModuleNameModalLabel(NewModuleNameModal.LABEL_OPMODE);
        setNewModuleNameModalIsOpen(true);
      });
      */
    };
    const handleRenameClicked = () => {
        /*
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
        */
    };
    const handleCopyClicked = () => {
        /*
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
        */
    };

    const handleDeleteClicked = () => {
        /*
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
        */
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
        /*
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
        */
    };
    const handleModuleSelected: Antd.TreeProps['onSelect'] = (a: React.Key[]) => {
        /*
        if (a.length === 1) {
          checkIfBlocksWereModified(() => {
            setTreeSelectedKey(a[0]);
          });
        }
          */
    };
    const handleSaveClicked = async () => {
        saveBlocks();
    };

    const saveBlocks = async (): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            /*            
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
            */
        });
    };
    const handleNewModuleNameOk = async (newModuleClassName: string) => {
        /*
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
        */
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
        </Antd.Flex>
    )
}