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
import {TabType, TabTypeUtils } from '../types/TabType';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import ClassNameComponent from './ClassNameComponent';
import ManageTable from './ManageTable';

/** Represents a module in the file management system. */
interface Module {
  path: string;
  name: string;
  type: TabType;
}

/** Props for the FileManageModal component. */
interface FileManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: storageProject.Project | null;
  onProjectChanged: () => Promise<void>;
  gotoTab: (path: string) => void;
  closeTab: (path: string) => void;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  tabType: TabType;
}

/** Modal width in pixels. */
const MODAL_WIDTH = 800;

/**
 * Modal component for managing files (mechanisms and opmodes) within a project.
 * Provides functionality to create, rename, copy, and delete modules.
 */
export default function FileManageModal(props: FileManageModalProps) {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const [modules, setModules] = React.useState<Module[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [currentRecord, setCurrentRecord] = React.useState<Module | null>(null);
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!props.project || props.tabType === null || !props.isOpen) {
      setModules([]);
      return;
    }

    let moduleList: Module[] = [];

    if (props.tabType === TabType.MECHANISM) {
      moduleList = props.project.mechanisms.map((m) => ({
        path: m.modulePath,
        name: m.className,
        type: TabType.MECHANISM,
      }));
    } else if (props.tabType === TabType.OPMODE) {
      moduleList = props.project.opModes.map((o) => ({
        path: o.modulePath,
        name: o.className,
        type: TabType.OPMODE,
      }));
    }

    // Sort modules alphabetically by name
    moduleList.sort((a, b) => a.name.localeCompare(b.name));
    setModules(moduleList);
  }, [props.project, props.tabType, props.isOpen]);

  /** Handles renaming a module. */
  const handleRename = async (origModule: Module, newClassName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    try {
      const newModulePath = await storageProject.renameModuleInProject(
          props.storage,
          props.project,
          newClassName,
          origModule.path
      );
      await props.onProjectChanged();

      // Close the rename modal first
      setRenameModalOpen(false);
      
      // Automatically select and open the renamed module
      props.gotoTab(newModulePath);
      props.onClose();

    } catch (error) {
      console.error('Error renaming module:', error);
      props.setAlertErrorMessage(t('FAILED_TO_RENAME_MODULE'));
      setRenameModalOpen(false);
    }
  };

  /** Handles copying a module. */
  const handleCopy = async (origModule: Module, newClassName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    try {
      const newModulePath = await storageProject.copyModuleInProject(
          props.storage,
          props.project,
          newClassName,
          origModule.path
      );
      await props.onProjectChanged();

      const originalModule = modules.find((module) => module.path === origModule.path);
      if (!originalModule) {
        console.error('Original module not found for copying:', origModule.path);
        props.setAlertErrorMessage(t('MODULE_NOT_FOUND_FOR_COPYING'));
        return;
      }

      const newModule = {
        path: newModulePath,
        name: newClassName,
        type: originalModule.type,
      };

      const newModules = [...modules];
      newModules.push(newModule);

      setModules(newModules);
      
      // Close the copy modal first
      setCopyModalOpen(false);
      
      // Automatically select and open the newly created module
      props.gotoTab(newModulePath);
      props.onClose();
    } catch (error) {
      console.error('Error copying module:', error);
      props.setAlertErrorMessage(t('FAILED_TO_COPY_MODULE'));
      setCopyModalOpen(false);
    }
  };

  /** Handles adding a new module. */
  const handleAddNewItem = async (): Promise<void> => {
    const newClassName = newItemName.trim();
    if (!newClassName || !props.storage || !props.project) {
      return;
    }

    const moduleType = (props.tabType === TabType.MECHANISM)
      ? storageModule.ModuleType.MECHANISM
      : storageModule.ModuleType.OPMODE;

    await storageProject.addModuleToProject(
        props.storage,
        props.project,
        moduleType,
        newClassName
    );
    await props.onProjectChanged();

    const newModule = storageProject.findModuleByClassName(props.project, newClassName);
    if (newModule) {
      const module: Module = {
        path: newModule.modulePath,
        name: newModule.className,
        type: props.tabType,
      };
      setModules([...modules, module]);
    }

    setNewItemName('');
    if(newModule){
      props.gotoTab(newModule.modulePath);
    }

    props.onClose();
  };

  /** Handles delete confirmation for a module. */
  const handleDeleteConfirm = async (record: Module): Promise<void> => {
    const newModules = modules.filter((m) => m.path !== record.path);
    setModules(newModules);

    if (props.storage && props.project) {
      // Close the tab before removing the module
      props.closeTab(record.path);
      
      await storageProject.removeModuleFromProject(
          props.storage,
          props.project,
          record.path
      );
      await props.onProjectChanged();
    }
  };

  /** Handles selection to open module in tab. */
  const handleSelect = (record: Module): void => {
    props.gotoTab(record.path);
    props.onClose();
  };

  /** Opens the rename modal for a specific module. */
  const openRenameModal = (record: Module): void => {
    setCurrentRecord(record);
    setName(record.name);
    setRenameModalOpen(true);
  };

  /** Opens the copy modal for a specific module. */
  const openCopyModal = (record: Module): void => {
    setCurrentRecord(record);
    setName(t('COPY_SUFFIX', { name: record.name }));
    setCopyModalOpen(true);
  };

  /** Gets the modal title based on module type. */
  const getModalTitle = (): string => {
    return t('TYPE_MANAGEMENT', { type: TabTypeUtils.toString(props.tabType) });
  };

  /** Gets the rename modal title. */
  const getRenameModalTitle = (): string => {
    if (!currentRecord) {
      return t('RENAME');
    }
    return t('RENAME_TYPE_TITLE', { 
      type: TabTypeUtils.toString(currentRecord.type), 
      title: currentRecord.name 
    });
  };

  /** Gets the copy modal title. */
  const getCopyModalTitle = (): string => {
    if (!currentRecord) {
      return t('COPY');
    }
    return t('COPY_TYPE_TITLE', { 
      type: TabTypeUtils.toString(currentRecord.type), 
      title: currentRecord.name 
    });
  };

  /** Gets the empty table text based on tab type. */
  const getEmptyText = (): string => {
    const tabTypeString = TabTypeUtils.toString(props.tabType || TabType.OPMODE);
    return t('NO_FILES_FOUND', { type: tabTypeString.toLowerCase() });
  };

  const getModuleFromName = (name: string): Module => {
    const module = modules.find((m) => m.name === name);
    if (!module) {
      throw new Error('Module not found for name: ' + name);
    }
    return module;
  }

  return (
    <>
      <Antd.Modal
        title={getRenameModalTitle()}
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            handleRename(currentRecord, name);
          }
        }}
        okText={t('Rename')}
        cancelText={t('Cancel')}
      >
        {currentRecord && (
          <ClassNameComponent
            tabType={currentRecord.type}
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleRename(currentRecord, name);
              }
            }}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={getCopyModalTitle()}
        open={copyModalOpen}
        onCancel={() => setCopyModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            handleCopy(currentRecord, name);
          }
        }}
        okText={t('Copy')}
        cancelText={t('Cancel')}
      >
        {currentRecord && (
          <ClassNameComponent
            tabType={currentRecord.type}
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleCopy(currentRecord, name);
              }
            }}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={getModalTitle()}
        open={props.isOpen}
        onCancel={props.onClose}
        footer={null}
        width={MODAL_WIDTH}
      >
          <ManageTable
            textOnEmpty={getEmptyText()}
            records={modules}
            showDelete={true}
            deleteDialogTitle="DELETE_PROJECT_CONFIRM"
            onSelect={(record) => handleSelect(getModuleFromName(record.name))}
            onRename={(record) => openRenameModal(getModuleFromName(record.name))}
            onCopy={(record) => openCopyModal(getModuleFromName(record.name))}
            onDelete={(record) => handleDeleteConfirm(getModuleFromName(record.name))}
          />
        <br />
        <h4 style={{margin: '0 0 8px 0'}}>
          {t('CREATE_NEW', { type: TabTypeUtils.toString(props.tabType) })}
        </h4>
        <div style={{
          marginBottom: 16,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '6px',
          padding: '12px',
        }}>
        <ClassNameComponent
            tabType={props.tabType}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleAddNewItem}
            project={props.project}
            storage={props.storage}
            buttonLabel={t('CREATE')}
          />
        </div>        
      </Antd.Modal>
    </>
  );
}