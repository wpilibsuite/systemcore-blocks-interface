import React, { useEffect, useState } from 'react';
import { Button, Flex, Modal, Splitter, Tree, Typography } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

import * as toolboxItems from './items';
import * as toolbox from './toolbox';
import * as generatedToolbox from './generated/toolbox';


// Throughout this file the term module refers to a python module that appears
// as a category in the blockly toolbox. Similarly, the term class refers to a
// python class that appears as a category in the blockly toolbox.

type ToolboxSettingsModalProps = {
  isOpen: boolean;
  shownCategories: Set<string>;
  onOk: (shownCategories: Set<string>) => void;
  onCancel: () => void;
}

const ToolboxSettingsModal: React.FC<ToolboxSettingsModalProps> = ({ isOpen, shownCategories, onOk, onCancel }) => {
  const [generatedCategories, setGeneratedCategories] = useState<toolboxItems.ContentsType[]>([]);
  const [shownModuleCategories, setShownModuleCategories] = useState<string[]>([]);
  const [moduleTreeData, setModuleTreeData] = useState<TreeDataNode[]>([]);
  const [moduleTreeKeys, setModuleTreeKeys] = useState<React.Key[]>([]);
  const [moduleTreeExpandedKeys, setModuleTreeExpandedKeys] = useState<React.Key[]>([]);
  const [moduleTreeCheckedKeys, setModuleTreeCheckedKeys] = useState<React.Key[]>([]);
  const [moduleTreeSelectedKey, setModuleTreeSelectedKey] = useState<React.Key>('');
  const [shownClassCategories, setShownClassCategories] = useState<string[]>([]);
  const [classTreeData, setClassTreeData] = useState<TreeDataNode[]>([]);
  const [classTreeKeys, setClassTreeKeys] = useState<React.Key[]>([]);
  const [classTreeExpandedKeys, setClassTreeExpandedKeys] = useState<React.Key[]>([]);
  const [classTreeCheckedKeys, setClassTreeCheckedKeys] = useState<React.Key[]>([]);

  const afterOpenChange = (open: boolean) => {
    // When the modal is opened, update the generatedCategories.
    if (open) {
      setGeneratedCategories(generatedToolbox.getToolboxCategories());
    }
  };

  useEffect(() => {
    // When generatedCategories is set, update the moduleTreeData, moduleTreeKeys,
    // moduleTreeExpandedKeys, and moduleTreeSelectedKey.
    if (generatedCategories.length) {
      const nodes: TreeDataNode[] = [];
      const keys: React.Key[] = [];
      collectTreeData(true, false, generatedCategories, nodes, keys);
      setModuleTreeData(nodes);
      setModuleTreeKeys([...keys]);
      setModuleTreeExpandedKeys([...keys]);
      if (nodes.length) {
        setModuleTreeSelectedKey(nodes[0].key);
      } else {
        setModuleTreeSelectedKey('');
      }
    }
  }, [generatedCategories]);

  useEffect(() => {
    // When the moduleTreeKeys is set, figure out which shownCategories are
    // modules and which are classes.
    if (moduleTreeKeys.length) {
      const shownModules: string[] = [];
      const shownClasses: string[] = [];
      shownCategories.forEach((category) => {
        if (moduleTreeKeys.includes(category as React.Key)) {
          shownModules.push(category);
        } else {
          shownClasses.push(category);
        }
      });
      setShownModuleCategories(shownModules);
      setShownClassCategories(shownClasses);
    }
  }, [moduleTreeKeys]);

  useEffect(() => {
    // When the moduleTreeKeys or shownModuleCategories are set, update the 
    // moduleTreeCheckedKeys.
    const checkedKeys: React.Key[] = [];
    moduleTreeKeys.forEach((key) => {
      if (shownModuleCategories.includes(key as string)) {
        checkedKeys.push(key);
      }
    });
    setModuleTreeCheckedKeys(checkedKeys);
  }, [moduleTreeKeys, shownModuleCategories]);

  useEffect(() => {
    // When a python module is selected, fill the python class tree with the
    // classes in that module.
    const nodes: TreeDataNode[] = [];
    const keys: React.Key[] = [];
    if (moduleTreeSelectedKey) {
      const found = getModuleCategory(
          moduleTreeSelectedKey as string, generatedCategories);
      if (found) {
        const category = found as toolboxItems.Category;
        if (category.contents) {
          collectTreeData(false, true, category.contents, nodes, keys);
        }
      }
    }
    setClassTreeData(nodes);
    setClassTreeKeys([...keys]);
    setClassTreeExpandedKeys([...keys]);
  }, [moduleTreeSelectedKey]);

  useEffect(() => {
    // When the classTreeKeys or shownClassCategories are set, update the 
    // classTreeCheckedKeys.
    const checkedKeys: React.Key[] = [];
    classTreeKeys.forEach((key) => {
      if (shownClassCategories.includes(key as string)) {
        checkedKeys.push(key);
      }
    });
    setClassTreeCheckedKeys(checkedKeys);
  }, [classTreeData, shownClassCategories]);

  const addShownModuleCategory = (categoryToAdd: string) => {
    setShownModuleCategories([...shownModuleCategories, categoryToAdd]);
  };

  const removeShownModuleCategory = (categoryToRemove: string) => {
    const newShownModuleCategories = shownModuleCategories.filter((str) => str !== categoryToRemove);
    setShownModuleCategories(newShownModuleCategories);
  };

  const addShownClassCategory = (categoryToAdd: string) => {
    setShownClassCategories([...shownClassCategories, categoryToAdd]);
  };

  const removeShownClassCategory = (categoryToRemove: string) => {
    const newShownClassCategories = shownClassCategories.filter((str) => str !== categoryToRemove);
    setShownClassCategories(newShownClassCategories);
  };

  const handleModuleTreeChecked: TreeProps['onCheck'] = (a: any, e) => {
    if (e.checked) {
      a.checked.forEach((key: any) => {
        if (!moduleTreeCheckedKeys.includes(key)) {
          // This module category should be shown.
          const moduleName = key as string;
          addShownModuleCategory(moduleName);
        }
      });
    } else {
      moduleTreeCheckedKeys.forEach((key: any) => {
        if (!a.checked.includes(key)) {
          // This module category should be not shown.
          const moduleName = key as string;
          removeShownModuleCategory(moduleName);
        }
      });
    }
  };

  const handleClassTreeChecked: TreeProps['onCheck'] = (a: any, e) => {
    if (e.checked) {
      a.checked.forEach((key: any) => {
        if (!classTreeCheckedKeys.includes(key)) {
          // This class category should be shown.
          const className = key as string;
          addShownClassCategory(className);
        }
      });
    } else {
      classTreeCheckedKeys.forEach((key: any) => {
        if (!a.checked.includes(key)) {
          // This class category should be not shown.
          const className = key as string;
          removeShownClassCategory(className);
        }
      });
    }
  };

  const handleModuleTreeSelected: TreeProps['onSelect'] = (a: React.Key[], e) => {
    if (a.length === 1) {
      setModuleTreeSelectedKey(a[0]);
    }
  };

  const handleOkClicked = () => {
    const shownCategories: Set<string> = new Set();
    shownModuleCategories.forEach((category) => {
      shownCategories.add(category);
    });
    shownClassCategories.forEach((category) => {
      shownCategories.add(category);
    });
    onOk(shownCategories);
  };

  const collectTreeData = (
      modulesOnly: boolean, classesOnly: boolean,
      categories: toolboxItems.ContentsType[],
      nodes: TreeDataNode[], keys: React.Key[]) => {
    categories.forEach((item) => {
      if (item.kind === 'category') {
        const category = item as toolboxItems.Category;
        let key = '';
        if (modulesOnly) {
          if ((category as toolboxItems.PythonModuleCategory).moduleName) {
            key = (category as toolboxItems.PythonModuleCategory).moduleName;
          }
        } else if (classesOnly) {
          if ((category as toolboxItems.PythonClassCategory).className) {
            key = (category as toolboxItems.PythonClassCategory).className;
          }
        }
        if (key) {
          keys.push(key as React.Key);
          const children: TreeDataNode[] = []
          if (category.contents) {
            collectTreeData(modulesOnly, classesOnly,
                category.contents, children, keys);
          }
          const node: TreeDataNode = {
            title: category.name,
            key: key,
            children: children,
          };
          nodes.push(node);
        }
      }
    });
  };

  const getModuleCategory = (
      moduleName: string,
      categories: toolboxItems.ContentsType[]
  ): toolboxItems.ContentsType | null => {
    for (const item of categories) {
      if (item.kind === 'category') {
        const category = item as toolboxItems.Category;
        if ((category as toolboxItems.PythonModuleCategory).moduleName == moduleName) {
          return category;
        }
        if (category.contents) {
          const found = getModuleCategory(moduleName, category.contents);
          if (found) {
            return found;
          }
        }
      }
    }
    return null;
  };

  return (
    <Modal
      title="Toolbox Settings"
      open={isOpen}
      afterOpenChange={afterOpenChange}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="ok"
          onClick={handleOkClicked}
        >
          OK
        </Button>
      ]}
    >
      <Splitter
      >
        <Flex
          vertical
          gap="0"
        >
          <Typography.Paragraph>
             Python Modules
          </Typography.Paragraph>
          <div
            style={{
              height: 300,
              overflow: 'auto',
            }}
          >
            <Tree
              blockNode
              checkable
              checkStrictly
              expandedKeys={moduleTreeExpandedKeys}
              onExpand={setModuleTreeExpandedKeys}
              checkedKeys={moduleTreeCheckedKeys}
              onCheck={handleModuleTreeChecked}
              selectedKeys={[moduleTreeSelectedKey]}
              onSelect={handleModuleTreeSelected}
              treeData={moduleTreeData}
            />
          </div>
        </Flex>
        <Flex
          vertical
          gap="0"
        >
          <Typography.Paragraph>
             Python Classes
          </Typography.Paragraph>
          <div
            style={{
              height: 300,
              overflow: 'auto',
            }}
          >
            <Tree
              blockNode
              checkable
              checkStrictly
              expandedKeys={classTreeExpandedKeys}
              onExpand={setClassTreeExpandedKeys}
              checkedKeys={classTreeCheckedKeys}
              onCheck={handleClassTreeChecked}
              treeData={classTreeData}
            />
          </div>
        </Flex>
      </Splitter>
    </Modal>
  );
};

export default ToolboxSettingsModal;
