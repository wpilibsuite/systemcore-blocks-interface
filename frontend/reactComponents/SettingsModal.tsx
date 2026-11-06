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
 * @fileoverview Settings dialog, with a tab for each setting. Changes made in the tabs are
 * applied together when OK is clicked.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import {
  BgColorsOutlined,
  BuildOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  SettingOutlined,
  ToolOutlined,
} from '@ant-design/icons';

import ToolboxSettings from './ToolboxSettings';
import ThemeSettings from './ThemeSettings';
import RendererSettings from './RendererSettings';
import LanguageSettings from './LanguageSettings';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  renderer: string;
  onRendererChange: (renderer: string) => void;
  showSimpleClassNames: boolean;
  onShowSimpleClassNamesChange: (show: boolean) => void;
  shownPythonToolboxCategories: Set<string>;
  onShownPythonToolboxCategoriesChange: (shownCategories: Set<string>) => void;
}

/** Returns a tab label with an icon. */
function tabLabel(icon: React.ReactNode, label: string): React.ReactNode {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      {label}
    </span>
  );
}

export default function SettingsModal(props: SettingsModalProps): React.JSX.Element {
  const {t, i18n} = I18Next.useTranslation();

  const [theme, setTheme] = React.useState(props.theme);
  const [renderer, setRenderer] = React.useState(props.renderer);
  const [showSimpleClassNames, setShowSimpleClassNames] = React.useState(props.showSimpleClassNames);
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] =
      React.useState(props.shownPythonToolboxCategories);
  const [language, setLanguage] = React.useState(i18n.language);

  // Start from the current settings each time the dialog is opened.
  React.useEffect(() => {
    if (props.isOpen) {
      setTheme(props.theme);
      setRenderer(props.renderer);
      setShowSimpleClassNames(props.showSimpleClassNames);
      setShownPythonToolboxCategories(props.shownPythonToolboxCategories);
      setLanguage(i18n.language);
    }
  }, [props.isOpen]);

  const handleOk = (): void => {
    if (shownPythonToolboxCategories !== props.shownPythonToolboxCategories) {
      props.onShownPythonToolboxCategoriesChange(shownPythonToolboxCategories);
    }
    if (showSimpleClassNames !== props.showSimpleClassNames) {
      props.onShowSimpleClassNamesChange(showSimpleClassNames);
    }
    if (theme !== props.theme) {
      props.onThemeChange(theme);
    }
    if (renderer !== props.renderer) {
      props.onRendererChange(renderer);
    }
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
    props.onClose();
  };

  const tabItems: Antd.TabsProps['items'] = [
    {
      key: 'theme',
      label: tabLabel(<BgColorsOutlined />, t('THEME')),
      children: (
        <ThemeSettings theme={theme} renderer={renderer} onThemeChange={setTheme} />
      ),
    },
    {
      key: 'renderer',
      label: tabLabel(<BuildOutlined />, t('STYLE')),
      children: (
        <RendererSettings renderer={renderer} theme={theme} onRendererChange={setRenderer} />
      ),
    },
    {
      key: 'class_names',
      label: tabLabel(<FontSizeOutlined />, t('CLASS_NAMES')),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Antd.Checkbox
            checked={showSimpleClassNames}
            onChange={(e) => setShowSimpleClassNames(e.target.checked)}
          >
            {t('SHOW_SIMPLE_CLASS_NAMES')}
          </Antd.Checkbox>
        </div>
      ),
    },
    {
      key: 'wpi_toolbox',
      label: tabLabel(<ToolOutlined />, t('WPI_TOOLBOX')),
      children: (
        <ToolboxSettings
          shownCategories={shownPythonToolboxCategories}
          onShownCategoriesChange={setShownPythonToolboxCategories}
        />
      ),
    },
    {
      key: 'language',
      label: tabLabel(<GlobalOutlined />, t('LANGUAGE')),
      children: (
        <LanguageSettings language={language} onLanguageChange={setLanguage} />
      ),
    },
  ];

  return (
    <Antd.Modal
      title={tabLabel(<SettingOutlined />, t('SETTINGS'))}
      open={props.isOpen}
      onCancel={props.onClose}
      onOk={handleOk}
      okText={t('OK')}
      cancelText={t('CANCEL')}
      width={800}
      destroyOnHidden
    >
      {/* Inactive tabs are destroyed so that the block previews are created when they are visible. */}
      <Antd.Tabs
        tabPlacement="start"
        items={tabItems}
        destroyOnHidden
      />
    </Antd.Modal>
  );
}
