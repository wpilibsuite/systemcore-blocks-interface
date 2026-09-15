/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Dialog for uploading, removing, and choosing the visibility of third party
 * libraries.
 */

import * as Antd from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import * as React from 'react';
import * as I18Next from 'react-i18next';
import { DeleteOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';

import * as blocksLib from '../libraries/blocks_lib';
import * as libraryTree from '../libraries/library_tree';
import { simpleClassName } from '../blocks/utils/python';

type LibrariesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  libraries: blocksLib.Library[];
  hiddenKeys: Set<string>;
  onInstall: (filename: string, data: ArrayBuffer) => Promise<void>;
  onRemove: (libraryName: string) => Promise<void>;
  onHiddenKeysChange: (hiddenKeys: Set<string>) => void;
};

/** Height of the tree and details panes. */
const PANE_HEIGHT = 360;

function errorToString(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

const LibrariesModal: React.FC<LibrariesModalProps> = (props) => {
  const { t } = I18Next.useTranslation();
  const [modal, modalContextHolder] = Antd.Modal.useModal();
  const [messageApi, messageContextHolder] = Antd.message.useMessage();
  const [selectedLibraryName, setSelectedLibraryName] = React.useState<string>('');
  // The libraries start out collapsed.
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [busy, setBusy] = React.useState(false);

  // Keep a library selected whenever there are libraries.
  React.useEffect(() => {
    if (!props.libraries.some(l => l.metadata.name === selectedLibraryName)) {
      setSelectedLibraryName(props.libraries.length ? props.libraries[0].metadata.name : '');
    }
  }, [props.libraries, selectedLibraryName]);

  const tree = React.useMemo(() => libraryTree.buildLibraryTree(props.libraries), [props.libraries]);

  // Not memoized, so that the remove buttons always call the current handleRemoveClick.
  const makeTreeData = (): TreeDataNode[] => {
    const makeTitle = (node: libraryTree.LibraryTreeNode): React.ReactNode => {
      switch (node.kind) {
        case libraryTree.LibraryTreeNodeKind.LIBRARY:
          return (
            <Antd.Flex justify="space-between" align="center" gap="small" style={{ width: '100%' }}>
              <Antd.Tooltip title={node.library.metadata.summary}>
                <Antd.Space size={4}>
                  <span>{node.name}</span>
                  {!blocksLib.isCompatible(node.library.metadata) && (
                    <Antd.Tag color="warning" icon={<WarningOutlined />}>
                      {t('LIBRARIES.INCOMPATIBLE')}
                    </Antd.Tag>
                  )}
                </Antd.Space>
              </Antd.Tooltip>
              <Antd.Tooltip title={t('LIBRARIES.REMOVE')}>
                <Antd.Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  aria-label={t('LIBRARIES.REMOVE')}
                  disabled={busy}
                  onClick={(e) => {
                    // Don't select the library in the tree.
                    e.stopPropagation();
                    handleRemoveClick(node.library);
                  }}
                />
              </Antd.Tooltip>
            </Antd.Flex>
          );
        case libraryTree.LibraryTreeNodeKind.COMPONENTS:
          return t('LIBRARIES.COMPONENTS');
        case libraryTree.LibraryTreeNodeKind.COMPONENT:
          return simpleClassName(node.name);
        case libraryTree.LibraryTreeNodeKind.CATEGORY:
          return node.name;
      }
    };
    const makeTreeDataNode = (node: libraryTree.LibraryTreeNode): TreeDataNode => ({
      key: node.key,
      title: makeTitle(node),
      // An incompatible library isn't in the toolbox, so there's nothing to show or hide.
      disableCheckbox: !blocksLib.isCompatible(node.library.metadata),
      children: node.children.map(makeTreeDataNode),
    });
    return tree.roots.map(makeTreeDataNode);
  };

  const checkedKeys = React.useMemo((): { checked: React.Key[], halfChecked: React.Key[] } => {
    const checked: React.Key[] = [];
    const halfChecked: React.Key[] = [];
    libraryTree.getCheckStates(tree, props.hiddenKeys).forEach((state, key) => {
      if (!blocksLib.isCompatible(tree.nodes.get(key)!.library.metadata)) {
        return;
      }
      if (state === libraryTree.CheckState.CHECKED) {
        checked.push(key);
      } else if (state === libraryTree.CheckState.HALF_CHECKED) {
        halfChecked.push(key);
      }
    });
    return { checked, halfChecked };
  }, [tree, props.hiddenKeys]);

  const handleCheck: TreeProps['onCheck'] = (_checked, info) => {
    props.onHiddenKeysChange(
        libraryTree.toggleNode(tree, props.hiddenKeys, info.node.key as string));
  };

  const handleSelect: TreeProps['onSelect'] = (_selectedKeys, info) => {
    // The first element of every key is the library name.
    const path: string[] = JSON.parse(info.node.key as string);
    setSelectedLibraryName(path[0]);
  };

  const showError = (title: string, content?: string) => {
    modal.error({ title, content });
  };

  const installFile = async (file: File): Promise<void> => {
    const extension = blocksLib.BLOCKS_LIB_FILE_EXTENSION;
    if (!file.name.endsWith(extension)) {
      showError(t('LIBRARIES.WRONG_EXTENSION', { filename: file.name, extension }));
      return;
    }

    const data = await file.arrayBuffer();
    let library: blocksLib.Library;
    try {
      library = await blocksLib.parseBlocksLib(data);
    } catch (e) {
      showError(t('LIBRARIES.INVALID_FILE', { filename: file.name }), errorToString(e));
      return;
    }

    const metadata = library.metadata;
    const name = blocksLib.getDisplayName(metadata);
    if (!blocksLib.isCompatible(metadata)) {
      showError(t('LIBRARIES.INCOMPATIBLE_VERSION', {
        name,
        range: metadata.blocksVersion,
        version: blocksLib.getBlocksVersion(),
      }));
      return;
    }

    const existing = props.libraries.find(l => l.metadata.name === metadata.name);
    if (existing) {
      const confirmed = await modal.confirm({
        title: t('LIBRARIES.REPLACE_TITLE', { name }),
        content: t('LIBRARIES.REPLACE_MESSAGE', {
          oldVersion: existing.metadata.version,
          newVersion: metadata.version,
        }),
        okText: t('LIBRARIES.REPLACE'),
        cancelText: t('CANCEL'),
      });
      if (!confirmed) {
        return;
      }
    }

    setBusy(true);
    try {
      await props.onInstall(file.name, data);
      setSelectedLibraryName(metadata.name);
      messageApi.success(t('LIBRARIES.INSTALLED', { name, version: metadata.version }));
    } catch (e) {
      showError(t('LIBRARIES.INSTALL_FAILED'), errorToString(e));
    } finally {
      setBusy(false);
    }
  };

  const handleUploadClick = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = blocksLib.BLOCKS_LIB_FILE_EXTENSION;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        installFile(file);
      }
    };
    input.click();
  };

  const handleRemoveClick = async (library: blocksLib.Library): Promise<void> => {
    const name = blocksLib.getDisplayName(library.metadata);
    const confirmed = await modal.confirm({
      title: t('LIBRARIES.REMOVE_TITLE', { name }),
      content: t('LIBRARIES.REMOVE_MESSAGE'),
      okText: t('LIBRARIES.REMOVE'),
      okType: 'danger',
      cancelText: t('CANCEL'),
    });
    if (!confirmed) {
      return;
    }
    setBusy(true);
    try {
      await props.onRemove(library.metadata.name);
      messageApi.success(t('LIBRARIES.REMOVED', { name }));
    } catch (e) {
      showError(t('LIBRARIES.REMOVE_FAILED'), errorToString(e));
    } finally {
      setBusy(false);
    }
  };

  const renderDetails = (): React.JSX.Element => {
    const library = props.libraries.find(l => l.metadata.name === selectedLibraryName);
    if (!library) {
      return <Antd.Empty description={t('LIBRARIES.SELECT_LIBRARY')} />;
    }
    const metadata = library.metadata;
    return (
      <Antd.Flex vertical gap="small">
        <div>
          <Antd.Flex justify="space-between" align="baseline" gap="small">
            <Antd.Typography.Title level={5} style={{ margin: 0 }}>
              {blocksLib.getDisplayName(metadata)}
            </Antd.Typography.Title>
            <Antd.Typography.Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
              {metadata.version}
            </Antd.Typography.Text>
          </Antd.Flex>
          <Antd.Typography.Text type="secondary">{metadata.author}</Antd.Typography.Text>
        </div>
        {!blocksLib.isCompatible(metadata) && (
          <Antd.Alert
            type="warning"
            showIcon
            title={t('LIBRARIES.INCOMPATIBLE_HIDDEN', { version: blocksLib.getBlocksVersion() })}
          />
        )}
        <Antd.Typography.Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
          {metadata.details}
        </Antd.Typography.Paragraph>
      </Antd.Flex>
    );
  };

  return (
    <Antd.Modal
      title={t('LIBRARIES.TITLE')}
      open={props.isOpen}
      onCancel={props.onClose}
      width={860}
      footer={[
        <Antd.Button key="ok" onClick={props.onClose}>
          {t('OK')}
        </Antd.Button>,
      ]}
    >
      {modalContextHolder}
      {messageContextHolder}
      <Antd.Spin spinning={busy}>
        <Antd.Flex vertical gap="middle">
          <Antd.Flex gap="middle" align="center" wrap>
            <Antd.Button type="primary" icon={<UploadOutlined />} onClick={handleUploadClick}>
              {t('LIBRARIES.UPLOAD')}
            </Antd.Button>
            <Antd.Typography.Text type="secondary" style={{ flex: '1 1 240px' }}>
              {t('LIBRARIES.UPLOAD_HINT', { extension: blocksLib.BLOCKS_LIB_FILE_EXTENSION })}
            </Antd.Typography.Text>
          </Antd.Flex>
          {props.libraries.length === 0 ? (
            <Antd.Empty description={t('LIBRARIES.NO_LIBRARIES')} />
          ) : (
            <Antd.Flex gap="middle" wrap>
              <div style={{ flex: '1 1 280px', height: PANE_HEIGHT, overflow: 'auto' }}>
                <Antd.Tree
                  blockNode
                  checkable
                  checkStrictly
                  showLine
                  treeData={makeTreeData()}
                  checkedKeys={checkedKeys}
                  onCheck={handleCheck}
                  expandedKeys={expandedKeys}
                  onExpand={setExpandedKeys}
                  selectedKeys={selectedLibraryName ? [blocksLib.getToolboxKey(selectedLibraryName)] : []}
                  onSelect={handleSelect}
                />
              </div>
              <div style={{ flex: '1 1 320px', height: PANE_HEIGHT, overflow: 'auto' }}>
                {renderDetails()}
              </div>
            </Antd.Flex>
          )}
        </Antd.Flex>
      </Antd.Spin>
    </Antd.Modal>
  );
};

export default LibrariesModal;
