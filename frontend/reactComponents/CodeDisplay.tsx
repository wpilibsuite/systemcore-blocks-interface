// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as React from 'react';
import { CopyOutlined as CopyIcon } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import SiderCollapseTrigger from './SiderCollapseTrigger';
import { dracula, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import type { MessageInstance } from 'antd/es/message/interface';
import { useTranslation } from 'react-i18next';

/** Function type for setting string values. */
type StringFunction = (input: string) => void;

/** Props for the CodeDisplay component. */
interface CodeDisplayProps {
  generatedCode: string;
  theme: string;
  messageApi: MessageInstance;
  setAlertErrorMessage: StringFunction;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * Component that displays syntax-highlighted code with copy functionality.
 * Shows generated Python code in a dark theme with a copy button.
 */
export default function CodeDisplay(props: CodeDisplayProps): React.JSX.Element {
  const syntaxHighligherFromTheme = (theme: string) => {
    const isDarkTheme = theme.endsWith('-dark') || theme === 'dark';
    
    if (isDarkTheme){
      return dracula
    }
    return oneLight
  }

  const { token } = Antd.theme.useToken();
  const { t } = useTranslation();
  const syntaxStyle = syntaxHighligherFromTheme(props.theme);

  /** Handles copying the generated code to clipboard. */
  const handleCopyCode = (): void => {
    navigator.clipboard.writeText(props.generatedCode).then(
      () => {
        props.messageApi.open({
          type: 'success',
          content: t('COPY_CODE_SUCCESS'),
        });
      },
      (err) => {
        props.setAlertErrorMessage(t('COPY_CODE_FAILED', { error: String(err) }));
      }
    );
  };

  /** Creates the custom style object for the syntax highlighter. */
  const getSyntaxHighlighterStyle = (): React.CSSProperties => ({
    backgroundColor: token.colorBgContainer,
    width: '100%',
    overflowX: 'auto',
    overflowY: 'auto',
  });

  /** Renders the header section with title and copy button. */
  const renderHeader = (): React.JSX.Element => (
    <Antd.Space align="center">
      <Antd.Typography.Title level={3} style={{ margin: 0 }}>{t("CODE")}</Antd.Typography.Title>
      <Antd.Tooltip title={t("COPY")}>
        <Antd.Button
          icon={<CopyIcon />}
          size="small"
          onClick={handleCopyCode}
        />
      </Antd.Tooltip>
    </Antd.Space>
  );

  /** Renders the syntax-highlighted code block. */
  const renderCodeBlock = (): React.JSX.Element => (
    <SyntaxHighlighter
      language="python"
      style={syntaxStyle}
      customStyle={getSyntaxHighlighterStyle()}
    >
      {props.generatedCode}
    </SyntaxHighlighter>
  );

  /** Renders the collapse/expand trigger at the bottom center of the panel. */
  const renderCollapseTrigger = (): React.JSX.Element | null => {
    if (!props.onToggleCollapse) return null;
    
    return (
      <SiderCollapseTrigger
        collapsed={props.isCollapsed || false}
        onToggle={props.onToggleCollapse}
        isRightPanel={true}
      />
    );
  };

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Antd.Flex vertical gap="small" style={{ height: '100%' }}>
        {renderHeader()}
        {renderCodeBlock()}
      </Antd.Flex>
      {renderCollapseTrigger()}
    </div>
  );
}
