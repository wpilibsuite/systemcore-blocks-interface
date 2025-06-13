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
import { TabItem, TabType, TabTypeUtils } from "./Tabs";
import * as Antd from "antd";
import * as I18Next from "react-i18next";
import * as React from "react";
import * as commonStorage from "../storage/common_storage";
import ModuleNameComponent from './ModuleNameComponent';

type Module = {
    path: string;
    title: string;
    type: TabType;
}

type AddTabDialogProps = {
    isOpen: boolean;
    onOk: (newTabs: TabItem[]) => void;
    onCancel: () => void;
    project: commonStorage.Project | null;
    currentTabs: TabItem[];
    storage: commonStorage.Storage | null;
}

export default function AddTabDialog(props: AddTabDialogProps) {
    const { t } = I18Next.useTranslation();
    const [tabType, setTabType] = React.useState<TabType>(TabType.OPMODE);
    const [availableItems, setAvailableItems] = React.useState<Module[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<Module[]>([]);
    const [newItemName, setNewItemName] = React.useState("");
    const [searchText, setSearchText] = React.useState("");

    React.useEffect(() => {
        if (props.project) {
            // Initialize available items based on project data
            const mechanisms = props.project.mechanisms.map(m => ({
                path: m.modulePath,
                title: m.className,
                type: TabType.MECHANISM
            }));
            const opModes = props.project.opModes.map(o => ({
                path: o.modulePath,
                title: o.className,
                type: TabType.OPMODE
            }));

            const allItems = [...mechanisms, ...opModes];

            // Split items into available and selected based on currentTabs
            const availableModules = allItems.filter(item =>
                !props.currentTabs.some(tab => tab.key === item.path)
            );

            // Preserve the order from currentTabs for selectedModules
            const selectedModules = props.currentTabs
                .map(tab => allItems.find(item => item.path === tab.key))
                .filter(item => item !== undefined) as Module[];

            setAvailableItems(availableModules);
            setSelectedItems(selectedModules);
        }
    }, [props.project, props.currentTabs, props.isOpen]);

    const handleAddNewItem = async () => {
        let trimmedName = newItemName.trim();
        if (trimmedName) {
            // Check if there's an exact match in available items
            const matchingItem = availableItems.find(item =>
                item.title.toLowerCase() === trimmedName.toLowerCase()
            );

            if (matchingItem) {
                // Move the matching item to selected
                handleSelectItem(matchingItem);
                setNewItemName("");
            } else {
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

                setNewItemName("");
            }
        }
    };

    const handleSelectItem = (item: Module) => {
        const existingItem = selectedItems.find(i => i.path === item.path);
        if (!existingItem) {
            setSelectedItems([...selectedItems, item]);
            setAvailableItems(availableItems.filter(i => i.path !== item.path));
        }
    };

    const handleRemoveItem = (item: Module) => {
        setSelectedItems(selectedItems.filter(i => i !== item));
        setAvailableItems([...availableItems, item]);
    };

    // Filter available items based on search text
    const filteredAvailableItems = availableItems
        .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <Antd.Modal
            title={t("addTabDialog.title")}
            open={props.isOpen}
            onCancel={props.onCancel}
            onOk={() => {
                const newTabs = selectedItems.map(item => ({
                    key: item.path,
                    title: item.title,
                    type: item.type
                }));
                props.onOk(newTabs);
            }}
        >
            <div style={{ marginTop: 16 }}>
                <div style={{
                    marginBottom: 16,
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '12px'
                }}>
                    <Antd.Radio.Group
                        defaultValue="opmode"
                        buttonStyle="solid"
                        style={{ marginBottom: 8 }}
                        onChange={(e) => {
                            if (e.target.value === "opmode") {
                                setTabType(TabType.OPMODE);
                            }
                            else if (e.target.value === "mechanism") {
                                setTabType(TabType.MECHANISM);
                            }
                        }}
                    >
                        <Antd.Radio.Button value="mechanism">
                            {TabTypeUtils.getIcon(TabType.MECHANISM)} {t("mechanism")}
                        </Antd.Radio.Button>
                        <Antd.Radio.Button value="opmode">
                            {TabTypeUtils.getIcon(TabType.OPMODE)} {t("opmode")}
                        </Antd.Radio.Button>
                    </Antd.Radio.Group>
                    
                    <ModuleNameComponent
                        tabType={tabType}
                        newItemName={newItemName}
                        setNewItemName={setNewItemName}
                        onAddNewItem={handleAddNewItem}
                        project={props.project}
                        storage={props.storage}
                        buttonLabel={t("New")}
                    />
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>
                            {t("Available")}
                        </h4>
                        <Antd.Input
                            placeholder={t("addTabDialog.search")}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={() => {
                                if (filteredAvailableItems.length === 1) {
                                    // If only one item in filtered list, select it
                                    handleSelectItem(filteredAvailableItems[0]);
                                    setSearchText("");
                                } else {
                                    // If multiple items, look for exact match
                                    const matchingItem = filteredAvailableItems.find(item =>
                                        item.title.toLowerCase() === searchText.trim().toLowerCase()
                                    );

                                    if (matchingItem) {
                                        handleSelectItem(matchingItem);
                                        setSearchText("");
                                    }
                                }
                            }}
                            style={{ marginBottom: 8, width: '70%' }}
                            allowClear
                        />
                        <Antd.List
                            size="small"
                            bordered
                            style={{ height: 200, overflow: 'auto' }}
                            dataSource={filteredAvailableItems}
                            renderItem={(item) => (
                                <Antd.List.Item
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/json', JSON.stringify({
                                            type: 'available',
                                            item: item
                                        }));
                                    }}
                                    actions={[
                                        <Antd.Button
                                            size="small"
                                            onClick={() => handleSelectItem(item)}
                                        >
                                            →
                                        </Antd.Button>
                                    ]}
                                    style={{ cursor: 'grab' }}
                                >
                                    <Antd.List.Item.Meta
                                        avatar={TabTypeUtils.getIcon(item.type)}
                                        title={
                                            <Antd.Tooltip title={item.title}>
                                                <span 
                                                    style={{ 
                                                        fontSize: '12px',
                                                        display: 'block',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '120px'
                                                    }}
                                                >
                                                    {item.title}
                                                </span>
                                            </Antd.Tooltip>
                                        }
                                    />
                                </Antd.List.Item>
                            )}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>
                            {t("Shown")}
                        </h4>
                        <div style={{ height: 32, marginBottom: 8 }}></div>
                        <div 
                            style={{ height: 200, overflow: 'auto', border: '1px solid #d9d9d9' }}
                            onDragOver={(e) => {
                                e.preventDefault();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                try {
                                    const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
                                    if (dragData.type === 'available') {
                                        handleSelectItem(dragData.item);
                                    }
                                } catch (error) {
                                    // Handle reordering within shown list
                                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                    if (!isNaN(fromIndex)) {
                                        // This is a reorder operation within the shown list
                                        const items = Array.from(selectedItems);
                                        const [reorderedItem] = items.splice(fromIndex, 1);
                                        items.push(reorderedItem); // Add to end
                                        setSelectedItems(items);
                                    }
                                }
                            }}
                        >
                            {selectedItems.map((item, index) => (
                                <div
                                    key={item.path}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', index.toString());
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        
                                        // First check if it's an item from available list
                                        try {
                                            const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
                                            if (dragData.type === 'available') {
                                                // Insert the available item at this position
                                                const existingItem = selectedItems.find(i => i.path === dragData.item.path);
                                                if (!existingItem) {
                                                    const newItems = Array.from(selectedItems);
                                                    newItems.splice(index, 0, dragData.item);
                                                    setSelectedItems(newItems);
                                                    setAvailableItems(availableItems.filter(i => i.path !== dragData.item.path));
                                                }
                                                return;
                                            }
                                        } catch (error) {
                                            // Not JSON data, continue with reordering logic
                                        }
                                        
                                        // Handle reordering within shown list
                                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                        const toIndex = index;

                                        if (fromIndex !== toIndex && !isNaN(fromIndex)) {
                                            const items = Array.from(selectedItems);
                                            const [reorderedItem] = items.splice(fromIndex, 1);
                                            items.splice(toIndex, 0, reorderedItem);
                                            setSelectedItems(items);
                                        }
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        borderBottom: '1px solid #f0f0f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'move'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {TabTypeUtils.getIcon(item.type)}
                                        <Antd.Tooltip title={item.title}>
                                            <span 
                                                style={{ 
                                                    fontSize: '12px',
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '120px'
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                        </Antd.Tooltip>
                                    </div>
                                    <Antd.Button
                                        size="small"
                                        onClick={() => handleRemoveItem(item)}
                                    >
                                        ✕
                                    </Antd.Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Antd.Modal>
    );
}
