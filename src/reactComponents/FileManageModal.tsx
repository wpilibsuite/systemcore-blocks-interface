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
import {EditOutlined, DeleteOutlined, CopyOutlined} from '@ant-design/icons';
import ClassNameComponent from './ClassNameComponent';

/** Represents a module in the file management system. */
interface Module {
  path: string;
  title: string;
  type: TabType;
}

/** Props for the FileManageModal component. */
interface FileManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: storageProject.Project | null;
  setProject: (project: storageProject.Project | null) => void;
  gotoTab: (path: string) => void;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  tabType: TabType;
}

/** Default page size for table pagination. */
const DEFAULT_PAGE_SIZE = 5;

/** Modal width in pixels. */
const MODAL_WIDTH = 800;

/** Actions column width in pixels. */
const ACTIONS_COLUMN_WIDTH = 120;

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

  const triggerProjectUpdate = (): void => {
    if (props.project) {
      props.setProject({...props.project});
    }
  }
  React.useEffect(() => {
    if (!props.project || props.tabType === null) {
      setModules([]);
      return;
    }

    let moduleList: Module[] = [];

    if (props.tabType === TabType.MECHANISM) {
      moduleList = props.project.mechanisms.map((m) => ({
        path: m.modulePath,
        title: m.className,
        type: TabType.MECHANISM,
      }));
    } else if (props.tabType === TabType.OPMODE) {
      moduleList = props.project.opModes.map((o) => ({
        path: o.modulePath,
        title: o.className,
        type: TabType.OPMODE,
      }));
    }

    // Sort modules alphabetically by title
    moduleList.sort((a, b) => a.title.localeCompare(b.title));
    setModules(moduleList);
  }, [props.project, props.tabType]);

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

      const newModules = modules.map((module) => {
        if (module.path === origModule.path) {
          return {...module, title: newClassName, path: newModulePath};
        }
        return module;
      });

      setModules(newModules);
      triggerProjectUpdate();
    } catch (error) {
      console.error('Error renaming module:', error);
      props.setAlertErrorMessage(t('FAILED_TO_RENAME_MODULE'));
    }

    setRenameModalOpen(false);
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

      const originalModule = modules.find((module) => module.path === origModule.path);
      if (!originalModule) {
        console.error('Original module not found for copying:', origModule.path);
        props.setAlertErrorMessage(t('MODULE_NOT_FOUND_FOR_COPYING'));
        return;
      }

      const newModules = [...modules];
      newModules.push({
        path: newModulePath,
        title: newClassName,
        type: originalModule.type,
      });

      setModules(newModules);
      triggerProjectUpdate();
    } catch (error) {
      console.error('Error copying module:', error);
      props.setAlertErrorMessage(t('FAILED_TO_COPY_MODULE'));
    }

    setCopyModalOpen(false);
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

    const newModule = storageProject.findModuleByClassName(props.project, newClassName);
    if (newModule) {
      const module: Module = {
        path: newModule.modulePath,
        title: newModule.className,
        type: props.tabType,
      };
      setModules([...modules, module]);
    }

    setNewItemName('');
    if(newModule){
      props.gotoTab(newModule.modulePath);
    }
    triggerProjectUpdate();
    props.onClose();
  };

  /** Handles delete confirmation for a module. */
  const handleDeleteConfirm = async (record: Module): Promise<void> => {
    const newModules = modules.filter((m) => m.path !== record.path);
    setModules(newModules);

    if (props.storage && props.project) {
      await storageProject.removeModuleFromProject(
          props.storage,
          props.project,
          record.path
      );
      triggerProjectUpdate();
    }
  };

  /** Handles button click events to prevent row selection. */
  const handleButtonClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  /** Handles row double-click to open module in tab. */
  const handleRowDoubleClick = (record: Module): void => {
    props.gotoTab(record.path);
    props.onClose();
  };

  /** Opens the rename modal for a specific module. */
  const openRenameModal = (record: Module): void => {
    setCurrentRecord(record);
    setName(record.title);
    setRenameModalOpen(true);
  };

  /** Opens the copy modal for a specific module. */
  const openCopyModal = (record: Module): void => {
    setCurrentRecord(record);
    setName(t('COPY_SUFFIX', { name: record.title }));
    setCopyModalOpen(true);
  };

  /** Table column configuration. */
  const columns: Antd.TableProps<Module>['columns'] = [
    {
      title: t('NAME'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: {
        showTitle: false,
      },
      render: (title: string) => (
        <Antd.Tooltip title={title}>
          {title}
        </Antd.Tooltip>
      ),
    },
    {
      title: t('ACTIONS'),
      key: 'actions',
      width: ACTIONS_COLUMN_WIDTH,
      render: (_, record: Module) => (
        <Antd.Space size="small">
          <Antd.Tooltip title={t('RENAME')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                handleButtonClick(e);
                openRenameModal(record);
              }}
            />
          </Antd.Tooltip>
          <Antd.Tooltip title={t('COPY')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={(e) => {
                handleButtonClick(e);
                openCopyModal(record);
              }}
            />
          </Antd.Tooltip>
          <Antd.Tooltip title={t('Delete')}>
            <Antd.Popconfirm
              title={t('DELETE_MODULE_CONFIRM', { title: record.title })}
              description={t('DELETE_CANNOT_BE_UNDONE')}
              onConfirm={() => handleDeleteConfirm(record)}
              okText={t('Delete')}
              cancelText={t('Cancel')}
              okType="danger"
            >
              <Antd.Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={handleButtonClick}
              />
            </Antd.Popconfirm>
          </Antd.Tooltip>
        </Antd.Space>
      ),
    },
  ];

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
      title: currentRecord.title 
    });
  };

  /** Gets the copy modal title. */
  const getCopyModalTitle = (): string => {
    if (!currentRecord) {
      return t('COPY');
    }
    return t('COPY_TYPE_TITLE', { 
      type: TabTypeUtils.toString(currentRecord.type), 
      title: currentRecord.title 
    });
  };

  /** Gets the empty table text based on tab type. */
  const getEmptyText = (): string => {
    const tabTypeString = TabTypeUtils.toString(props.tabType || TabType.OPMODE);
    return t('NO_FILES_FOUND', { type: tabTypeString.toLowerCase() });
  };

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
        <Antd.Table<Module>
          columns={columns}
          dataSource={modules}
          rowKey="path"
          size="small"
          pagination={modules.length > DEFAULT_PAGE_SIZE ? {
            pageSize: DEFAULT_PAGE_SIZE,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) =>
              t('PAGINATION_TOTAL', { start: range[0], end: range[1], total }),
          } : false}
          bordered
          locale={{
            emptyText: getEmptyText(),
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleRowDoubleClick(record),
          })}
        />
        <div style={{
          marginBottom: 16,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '6px',
          padding: '12px',
        }}>
          <br />
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