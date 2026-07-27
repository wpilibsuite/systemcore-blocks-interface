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
 * @author alan@porpoiseful.com (Alan Smith)
 */
import {TabItem} from './Tabs';
import {TabType, TabTypeUtils } from '../types/TabType';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageProject from '../storage/project';

/** Represents a hidden module that can be reopened as a tab. */
interface HiddenModule {
  path: string;
  title: string;
  type: TabType;
}

/** Height of the scrollable list in pixels. */
const LIST_HEIGHT = 300;
const ITEM_HEIGHT = 45;
const EMPTY_HEIGHT = 60;

/** Computes the modules (robot, mechanisms, opmodes) that do not currently have an open tab. */
export function getHiddenModules(
    project: storageProject.Project | null, currentTabs: TabItem[]): HiddenModule[] {
  if (!project) {
    return [];
  }

  const robot = [{
    path: project.robot.modulePath,
    title: project.robot.className,
    type: TabType.ROBOT,
  }];
  const mechanisms = project.mechanisms.map((m) => ({
    path: m.modulePath,
    title: m.className,
    type: TabType.MECHANISM,
  }));
  const opModes = project.opModes.map((o) => ({
    path: o.modulePath,
    title: o.className,
    type: TabType.OPMODE,
  }));

  return [...robot, ...mechanisms, ...opModes].filter((item) =>
    !currentTabs.some((tab) => tab.key === item.path)
  );
}

/** Props for the HiddenTabsDialog component. */
interface HiddenTabsDialogProps {
  isOpen: boolean;
  onOk: (newTabs: TabItem[]) => void;
  onCancel: () => void;
  project: storageProject.Project | null;
  currentTabs: TabItem[];
}

/**
 * Dialog component that lists mechanisms and opmodes that do not currently
 * have an open tab, allowing the user to select any number of them to reopen.
 */
export default function HiddenTabsDialog(props: HiddenTabsDialogProps) {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const [selectedPaths, setSelectedPaths] = React.useState<Set<string>>(new Set());

  const hiddenModules = getHiddenModules(props.project, props.currentTabs);

  // Reset the selection whenever the dialog is opened.
  React.useEffect(() => {
    if (props.isOpen) {
      setSelectedPaths(new Set());
    }
  }, [props.isOpen]);

  const getListHeight = (): number => {
    return Math.max(EMPTY_HEIGHT, Math.min(LIST_HEIGHT, hiddenModules.length * ITEM_HEIGHT));
  };

  /** Toggles whether a hidden module is selected. */
  const toggleSelected = (path: string): void => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  /** Toggles whether all hidden modules are selected. */
  const toggleSelectAll = (): void => {
    setSelectedPaths((prev) =>
      prev.size === hiddenModules.length
        ? new Set()
        : new Set(hiddenModules.map((item) => item.path))
    );
  };

  /** Handles confirming the selected modules to reopen. */
  const handleOk = (): void => {
    const newTabs: TabItem[] = hiddenModules
      .filter((item) => selectedPaths.has(item.path))
      .map((item) => ({
        key: item.path,
        title: item.title,
        type: item.type,
      }));
    props.onOk(newTabs);
  };

  return (
    <Antd.Modal
      title={t('SELECT_HIDDEN')}
      open={props.isOpen}
      onCancel={props.onCancel}
      onOk={handleOk}
      okText={t('SHOW')}
      okButtonProps={{ disabled: selectedPaths.size === 0 }}
      cancelText={t('CANCEL')}
    >
      <p>{t('SHOW_HIDDEN_DESC')}</p>
      {hiddenModules.length > 0 && (
        <Antd.Checkbox
          checked={selectedPaths.size === hiddenModules.length}
          indeterminate={selectedPaths.size > 0 && selectedPaths.size < hiddenModules.length}
          onChange={toggleSelectAll}
        >
          {t('SELECT_ALL')}
        </Antd.Checkbox>
      )}
      <div
        style={{
          height: getListHeight(),
          overflow: 'auto',
          marginTop: 16,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '6px',
        }}
      >
        {hiddenModules.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: token.colorTextSecondary,
          }}>
            {t('NO_HIDDEN_TABS')}
          </div>
        ) : (
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}>
            {hiddenModules.map((item) => (
              <li
                key={item.path}
                onClick={() => toggleSelected(item.path)}
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = token.colorBgTextHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Antd.Checkbox
                  checked={selectedPaths.has(item.path)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelected(item.path)}
                />
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {TabTypeUtils.getIcon(item.type)}
                </span>
                <span style={{fontSize: '14px'}}>
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Antd.Modal>
  );
}
