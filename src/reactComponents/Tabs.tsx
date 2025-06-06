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
import React from 'react';
import * as Antd from 'antd';
import * as commonStorage from '../storage/common_storage';
import type { MessageInstance } from 'antd/es/message/interface';
import * as I18Next from "react-i18next";

import {
  RobotOutlined,
  CodeOutlined,
  BlockOutlined
} from '@ant-design/icons';

export enum TabType {
  ROBOT,
  MECHANISM,
  OPMODE
}

export interface TabItem {
  key: string;
  title: string;
  type: TabType;
}

export interface TabsProps {
  tabList: TabItem[];
  setAlertErrorMessage: (message: string) => void;
  currentModule: commonStorage.Module | null; 
  setCurrentModule: (module: commonStorage.Module | null) => void;
}

function getIcon(type: TabType) {
  if (type == TabType.ROBOT) {
    return (<RobotOutlined />);
  }
  else if (type == TabType.MECHANISM) {
    return (<BlockOutlined />);
  }
  return (<CodeOutlined />);
}

export function Component(props: TabsProps) {
  const { t } = I18Next.useTranslation();
  
  const [items, setItems] = React.useState<TabsProps['tabList']>(props.tabList);
  const [activeKey, setActiveKey] = React.useState('1');
 
  const onChange = (key: string) => {
    console.log(key);
  }

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      if (!items) return;
      const targetIndex = items.findIndex((item) => item.key === targetKey);
      const newItems = items.filter((item) => item.key !== targetKey);

      if (newItems.length && targetKey === activeKey) {
        const newActiveKey =
          newItems[targetIndex === newItems.length ? targetIndex - 1 : targetIndex].key;
        setActiveKey(newActiveKey);
      }

      setItems(newItems);
    };
  };


  return (
    <Antd.Tabs type="editable-card"
      onChange={onChange}
      onEdit={onEdit}
      defaultActiveKey={props.tabList[0].key}
      tabBarStyle={{ padding: 0, margin: 0 }}
      hideAdd={false}
      items={props.tabList.map((tab) => {
        return {
          key: tab.key,
          label: tab.title,
          icon: getIcon(tab.type),
          closable: (tab.type == TabType.ROBOT) ? false : true,
        }
      })}
    />
  );
};