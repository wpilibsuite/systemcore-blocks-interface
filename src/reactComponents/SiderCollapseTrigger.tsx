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
import * as React from 'react';
import * as Antd from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

/** Props for the SiderCollapseTrigger component. */
interface SiderCollapseTriggerProps {
  collapsed: boolean;
  onToggle: () => void;
  isRightPanel?: boolean;
}

/**
 * Custom collapse trigger for Sider that matches the right panel's appearance.
 */
export default function SiderCollapseTrigger(props: SiderCollapseTriggerProps): React.JSX.Element {
  const { token } = Antd.theme.useToken();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isHovered ? token.colorBgTextHover : token.colorBgContainer,
        border: `1px solid ${token.colorBorder}`,
        borderBottom: 'none',
        borderRadius: '6px 6px 0 0',
        padding: '2px 6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '24px',
        height: '22px',
        color: isHovered ? token.colorText : token.colorTextSecondary,
        transition: 'all 0.2s',
        zIndex: 1,
      }}
      onClick={props.onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Antd.Tooltip title={props.collapsed ? t("EXPAND") : t("COLLAPSE")}>
        {props.isRightPanel ? (
          // Right panel: reversed arrows
          props.collapsed ? 
            <LeftOutlined style={{ fontSize: '12px', color: 'inherit' }} /> : 
            <RightOutlined style={{ fontSize: '12px', color: 'inherit' }} />
        ) : (
          // Left panel: normal arrows
          props.collapsed ? 
            <RightOutlined style={{ fontSize: '12px', color: 'inherit' }} /> : 
            <LeftOutlined style={{ fontSize: '12px', color: 'inherit' }} />
        )}
      </Antd.Tooltip>
    </div>
  );
}