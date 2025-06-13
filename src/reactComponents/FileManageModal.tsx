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
import { TabType, TabTypeUtils } from "./Tabs";
import * as Antd from "antd";
import * as I18Next from "react-i18next";
import * as React from "react";
import * as commonStorage from "../storage/common_storage";
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import ModuleNameComponent from "./ModuleNameComponent";

type Module = {
    path: string;
    title: string;
    type: TabType;
}

type FileManageModalProps = {
    isOpen: boolean;
    onCancel: () => void;
    project: commonStorage.Project | null;
    setProject: (project: commonStorage.Project | null) => void;
    setAlertErrorMessage: (message: string) => void;
    storage: commonStorage.Storage | null;
    moduleType: TabType;
}

export default function FileManageModal(props: FileManageModalProps) {
    const { t } = I18Next.useTranslation();
    const [modules, setModules] = React.useState<Module[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [newItemName, setNewItemName] = React.useState('');
    const [currentRecord, setCurrentRecord] = React.useState<Module | null>(null);
    const [renameModalOpen, setRenameModalOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [copyModalOpen, setCopyModalOpen] = React.useState(false);

    React.useEffect(() => {
        if (props.project && props.moduleType !== null) {
            let moduleList: Module[] = [];

            if (props.moduleType === TabType.MECHANISM) {
                moduleList = props.project.mechanisms.map(m => ({
                    path: m.modulePath,
                    title: m.className,
                    type: TabType.MECHANISM
                }));
            } else if (props.moduleType === TabType.OPMODE) {
                moduleList = props.project.opModes.map(o => ({
                    path: o.modulePath,
                    title: o.className,
                    type: TabType.OPMODE
                }));
            }

            // Sort modules alphabetically by title
            moduleList.sort((a, b) => a.title.localeCompare(b.title));

            setModules(moduleList);
        } else {
            setModules([]);
        }
    }, [props.project, props.moduleType]);

    const handleDelete = async (module: Module) => {
        if (props.storage && props.project) {
            setLoading(true);
            try {
                await commonStorage.removeModuleFromProject(props.storage, props.project, module.path);
                // Remove from local state
                setModules(modules.filter(m => m.path !== module.path));
            } catch (error) {
                console.error('Error deleting module:', error);
                Antd.message.error('Failed to delete module');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRename = async (origModule: Module, newName: string) => {
        if (props.storage && props.project) {
            try {
                let newPath = await commonStorage.renameModuleInProject(
                    props.storage,
                    props.project,
                    newName,
                    origModule.path
                );
                const newModules = modules.map((module) => {
                    if (module.path === origModule.path) {
                        return { ...module, title: newName, path: newPath };
                    }
                    return module;
                });
                setModules(newModules);
                props.setProject({ ...props.project });
            } catch (error) {
                console.error('Error renaming module:', error);
                props.setAlertErrorMessage('Failed to rename module');
            }
        }
        setRenameModalOpen(false);
    };
    const handleCopy = async (origModule: Module, newName: string) => {
        if (props.storage && props.project) {
            try {
                let newPath = await commonStorage.copyModuleInProject(
                    props.storage,
                    props.project,
                    newName,
                    origModule.path
                );
                const newModules = [...modules];

                // find the original module to copy its type
                const originalModule = modules.find(module => module.path === origModule.path);
                if (!originalModule) {
                    console.error('Original module not found for copying:', origModule.path);
                    props.setAlertErrorMessage('Original module not found for copying');
                    return;
                }
                // Add the new module with the copied name and type
                newModules.push({ path: newPath, title: newName, type: originalModule.type });

                setModules(newModules);
                props.setProject({ ...props.project, });
            } catch (error) {
                console.error('Error copying module:', error);
                props.setAlertErrorMessage('Failed to copy module');
            }
        }
        setCopyModalOpen(false);
    };

    const handleAddNewItem = async () => {
        let trimmedName = newItemName.trim();
        if (trimmedName) {
            /*
            if (props.storage && props.project) {
                let storage_type = tabType == TabType.MECHANISM ? commonStorage.MODULE_TYPE_MECHANISM : commonStorage.MODULE_TYPE_OPMODE;
                await commonStorage.addModuleToProject(props.storage,
                    props.project, storage_type, trimmedName);
                let m = commonStorage.getClassInProject(props.project, trimmedName);
                // add the new item to selected items
                if (m) {
                    const module: Module = {
                        path: m.modulePath,
                        title: m.className,
                        type: tabType
                    };
                    setSelectedItems([...selectedItems, module]);
                }
            }
*/
            setNewItemName("");
            //          setProject(null); // Reset project to null to trigger re-fetch
        }
    };
    const columns: Antd.TableProps<Module>['columns'] = [
        {
            title: 'Name',
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
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record: Module) => (
                <Antd.Space size="small">
                    <Antd.Tooltip title={t("Rename")}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCurrentRecord(record);
                                setName(record.title);
                                setRenameModalOpen(true);
                            }}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t("Copy")}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => {
                                setCurrentRecord(record);
                                setName(record.title + 'Copy');
                                setCopyModalOpen(true);
                            }}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t("Delete")}>
                        <Antd.Popconfirm
                            title={`Delete ${record.title}?`}
                            description="This action cannot be undone."
                            onConfirm={async () => {
                                const newModules = modules.filter(m => m.path !== record.path);
                                setModules(newModules);

                                if (props.storage && props.project) {
                                    await commonStorage.removeModuleFromProject(props.storage, props.project, record.path);
                                    props.setProject({ ...props.project });
                                }
                            }}

                            okText={t("Delete")}
                            cancelText={t("Cancel")}
                            okType="danger"

                        >
                            <Antd.Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                danger
                            />
                        </Antd.Popconfirm>
                    </Antd.Tooltip>
                </Antd.Space>
            ),
        },
    ];

    const getModalTitle = () => {
        if (props.moduleType === null) {
            return 'Project Management';
        }
        return `${TabTypeUtils.toString(props.moduleType)} Management`;
    };

    return (
        <>
            <Antd.Modal
                title={`Rename ${currentRecord ? TabTypeUtils.toString(currentRecord.type) : ''}: ${currentRecord ? currentRecord.title : ''}`}
                open={renameModalOpen}
                onCancel={() => setRenameModalOpen(false)}
                onOk={() => {
                    if (currentRecord) {
                        handleRename(currentRecord, name);
                    }
                }}
                okText={t("Rename")}
                cancelText={t("Cancel")}
            >
                {currentRecord && (
                    <ModuleNameComponent
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
                title={`Copy ${currentRecord ? TabTypeUtils.toString(currentRecord.type) : ''}: ${currentRecord ? currentRecord.title : ''}`}
                open={copyModalOpen}
                onCancel={() => setCopyModalOpen(false)}
                onOk={() => {
                    if (currentRecord) {
                        handleCopy(currentRecord, name);
                    }
                }}
                okText={t("Copy")}
                cancelText={t("Cancel")}
            >
                {currentRecord && (
                    <ModuleNameComponent
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
                onCancel={props.onCancel}
                footer={[
                    <Antd.Button key="close" onClick={props.onCancel}>
                        {t("Close")}
                    </Antd.Button>
                ]}
                width={800}
            >
                <div style={{
                    marginBottom: 16,
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '12px'
                }}>
                    <ModuleNameComponent
                        tabType={props.moduleType}
                        newItemName={newItemName}
                        setNewItemName={setNewItemName}
                        onAddNewItem={handleAddNewItem}
                        project={props.project}
                        storage={props.storage}
                        buttonLabel={t("New")}
                    />
                </div>
                <Antd.Table<Module>
                    columns={columns}
                    dataSource={modules}
                    rowKey="path"
                    loading={loading}
                    size="small"
                    pagination={modules.length > 5 ? {
                        pageSize: 5,
                        showSizeChanger: false,
                        showQuickJumper: false,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    } : false}
                    bordered
                    locale={{
                        emptyText: `No ${TabTypeUtils.toString(props.moduleType || TabType.OPMODE).toLowerCase()} files found`
                    }}
                />
            </Antd.Modal>
        </>
    );
}