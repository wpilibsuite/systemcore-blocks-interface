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
import {TabItem, TabType, TabTypeUtils} from './Tabs';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import ModuleNameComponent from './ModuleNameComponent';

/** Represents a module item in the dialog. */
interface Module {
  path: string;
  title: string;
  type: TabType;
}

/** Props for the AddTabDialog component. */
interface AddTabDialogProps {
  isOpen: boolean;
  onOk: (newTabs: TabItem[]) => void;
  onCancel: () => void;
  project: commonStorage.Project | null;
  setProject: (project: commonStorage.Project | null) => void;
  currentTabs: TabItem[];
  storage: commonStorage.Storage | null;
}

/** Height of the scrollable lists in pixels. */
const LIST_HEIGHT = 200;

/** Maximum width for truncated text in pixels. */
const MAX_TEXT_WIDTH = 120;

/** Search input width as a percentage. */
const SEARCH_INPUT_WIDTH = '70%';

/**
 * Dialog component for adding new tabs to the workspace.
 * Allows users to create new modules or select from existing ones.
 */
export default function AddTabDialog(props: AddTabDialogProps) {
  const {t} = I18Next.useTranslation();
  const [tabType, setTabType] = React.useState<TabType>(TabType.OPMODE);
  const [availableItems, setAvailableItems] = React.useState<Module[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Module[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    if (!props.project) {
      return;
    }

    // Initialize available items based on project data
    const mechanisms = props.project.mechanisms.map((m) => ({
      path: m.modulePath,
      title: m.className,
      type: TabType.MECHANISM,
    }));
    const opModes = props.project.opModes.map((o) => ({
      path: o.modulePath,
      title: o.className,
      type: TabType.OPMODE,
    }));

    const allItems = [...mechanisms, ...opModes];

    // Split items into available and selected based on currentTabs
    const availableModules = allItems.filter((item) =>
      !props.currentTabs.some((tab) => tab.key === item.path)
    );

    // Preserve the order from currentTabs for selectedModules
    const selectedModules = props.currentTabs
        .map((tab) => allItems.find((item) => item.path === tab.key))
        .filter((item) => item !== undefined) as Module[];

    setAvailableItems(availableModules);
    setSelectedItems(selectedModules);
  }, [props.project, props.currentTabs]);

  const triggerProjectUpdate = (): void => {
    if (props.project) {
      props.setProject({...props.project});
    }
  }

  /** Handles adding a new item or selecting an existing one. */
  const handleAddNewItem = async (): Promise<void> => {
    const trimmedName = newItemName.trim();
    if (!trimmedName) {
      return;
    }

    // Check if there's an exact match in available items
    const matchingItem = availableItems.find((item) =>
      item.title.toLowerCase() === trimmedName.toLowerCase()
    );

    if (matchingItem) {
      // Move the matching item to selected
      handleSelectItem(matchingItem);
      setNewItemName('');
      return;
    }

    if (!props.storage || !props.project) {
      return;
    }

    const storageType = tabType === TabType.MECHANISM ?
      commonStorage.MODULE_TYPE_MECHANISM :
      commonStorage.MODULE_TYPE_OPMODE;

    await commonStorage.addModuleToProject(
        props.storage, props.project, storageType, trimmedName);

    const newModule = commonStorage.getClassInProject(props.project, trimmedName);
    if (newModule) {
      const module: Module = {
        path: newModule.modulePath,
        title: newModule.className,
        type: tabType,
      };
      setSelectedItems([...selectedItems, module]);
      triggerProjectUpdate();
    }


    setNewItemName('');
  };

  /** Moves an item from available to selected list. */
  const handleSelectItem = (item: Module): void => {
    const existingItem = selectedItems.find((i) => i.path === item.path);
    if (existingItem) {
      return;
    }

    setSelectedItems([...selectedItems, item]);
    setAvailableItems(availableItems.filter((i) => i.path !== item.path));
  };

  /** Moves an item from selected back to available list. */
  const handleRemoveItem = (item: Module): void => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
    setAvailableItems([...availableItems, item]);
  };

  /** Handles radio button change for tab type selection. */
  const handleTabTypeChange = (e: any): void => {
    if (e.target.value === 'opmode') {
      setTabType(TabType.OPMODE);
    } else if (e.target.value === 'mechanism') {
      setTabType(TabType.MECHANISM);
    }
  };

  /** Handles search input enter key press. */
  const handleSearchEnter = (): void => {
    if (filteredAvailableItems.length === 1) {
      // If only one item in filtered list, select it
      handleSelectItem(filteredAvailableItems[0]);
      setSearchText('');
      return;
    }

    // If multiple items, look for exact match
    const matchingItem = filteredAvailableItems.find((item) =>
      item.title.toLowerCase() === searchText.trim().toLowerCase()
    );

    if (matchingItem) {
      handleSelectItem(matchingItem);
      setSearchText('');
    }
  };

  /** Handles drag start for available items. */
  const handleAvailableDragStart = (e: React.DragEvent, item: Module): void => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'available',
      item: item,
    }));
  };

  /** Handles drag start for selected items. */
  const handleSelectedDragStart = (e: React.DragEvent, index: number): void => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  /** Handles drop events for the selected items container. */
  const handleSelectedDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (dragData.type === 'available') {
        handleSelectItem(dragData.item);
      }
    } catch (error) {
      // Handle reordering within shown list
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!isNaN(fromIndex)) {
        // This is a reorder operation within the shown list
        const items = Array.from(selectedItems);
        const [reorderedItem] = items.splice(fromIndex, 1);
        items.push(reorderedItem); // Add to end
        setSelectedItems(items);
      }
    }
  };

  /** Handles drop events for individual selected items. */
  const handleSelectedItemDrop = (e: React.DragEvent, index: number): void => {
    e.preventDefault();
    e.stopPropagation();

    // First check if it's an item from available list
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (dragData.type === 'available') {
        // Insert the available item at this position
        const existingItem = selectedItems.find((i) => i.path === dragData.item.path);
        if (!existingItem) {
          const newItems = Array.from(selectedItems);
          newItems.splice(index, 0, dragData.item);
          setSelectedItems(newItems);
          setAvailableItems(availableItems.filter((i) => i.path !== dragData.item.path));
        }
        return;
      }
    } catch (error) {
      // Not JSON data, continue with reordering logic
    }

    // Handle reordering within shown list
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const toIndex = index;

    if (fromIndex !== toIndex && !isNaN(fromIndex)) {
      const items = Array.from(selectedItems);
      const [reorderedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, reorderedItem);
      setSelectedItems(items);
    }
  };

  /** Handles the OK button click. */
  const handleOk = (): void => {
    const newTabs = selectedItems.map((item) => ({
      key: item.path,
      title: item.title,
      type: item.type,
    }));
    props.onOk(newTabs);
  };

  // Filter available items based on search text
  const filteredAvailableItems = availableItems
      .filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Antd.Modal
      title={t('addTabDialog.title')}
      open={props.isOpen}
      onCancel={props.onCancel}
      onOk={handleOk}
    >
      <div style={{marginTop: 16}}>
        <div style={{
          marginBottom: 16,
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '12px',
        }}>
          <Antd.Radio.Group
            defaultValue="opmode"
            buttonStyle="solid"
            style={{marginBottom: 8}}
            onChange={handleTabTypeChange}
          >
            <Antd.Radio.Button value="mechanism">
              {TabTypeUtils.getIcon(TabType.MECHANISM)} {t('mechanism')}
            </Antd.Radio.Button>
            <Antd.Radio.Button value="opmode">
              {TabTypeUtils.getIcon(TabType.OPMODE)} {t('opmode')}
            </Antd.Radio.Button>
          </Antd.Radio.Group>

          <ModuleNameComponent
            tabType={tabType}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleAddNewItem}
            project={props.project}
            storage={props.storage}
            buttonLabel={t('New')}
          />
        </div>

        <div style={{display: 'flex', gap: 16}}>
          <div style={{flex: 1}}>
            <h4 style={{margin: '0 0 8px 0'}}>
              {t('Available')}
            </h4>
            <Antd.Input
              placeholder={t('addTabDialog.search')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearchEnter}
              style={{marginBottom: 8, width: SEARCH_INPUT_WIDTH}}
              allowClear
            />
            <Antd.List
              size="small"
              bordered
              style={{height: LIST_HEIGHT, overflow: 'auto'}}
              dataSource={filteredAvailableItems}
              renderItem={(item) => (
                <Antd.List.Item
                  draggable
                  onDragStart={(e) => handleAvailableDragStart(e, item)}
                  actions={[
                    <Antd.Button
                      key="select"
                      size="small"
                      onClick={() => handleSelectItem(item)}
                    >
                      →
                    </Antd.Button>,
                  ]}
                  style={{cursor: 'grab'}}
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
                            maxWidth: `${MAX_TEXT_WIDTH}px`,
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

          <div style={{flex: 1}}>
            <h4 style={{margin: '0 0 8px 0'}}>
              {t('Shown')}
            </h4>
            <div style={{height: 32, marginBottom: 8}}></div>
            <div
              style={{height: LIST_HEIGHT, overflow: 'auto', border: '1px solid #d9d9d9'}}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleSelectedDrop}
            >
              {selectedItems.map((item, index) => (
                <div
                  key={item.path}
                  draggable
                  onDragStart={(e) => handleSelectedDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleSelectedItemDrop(e, index)}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'move',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    {TabTypeUtils.getIcon(item.type)}
                    <Antd.Tooltip title={item.title}>
                      <span
                        style={{
                          fontSize: '12px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: `${MAX_TEXT_WIDTH}px`,
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
