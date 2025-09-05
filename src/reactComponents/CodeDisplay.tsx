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
import * as Antd from 'antd';
import * as React from 'react';
import { CopyOutlined as CopyIcon } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
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
}

/** Success message for copy operation. */
const COPY_SUCCESS_MESSAGE = 'Copy completed successfully.';

/** Error message prefix for copy failures. */
const COPY_ERROR_MESSAGE_PREFIX = 'Could not copy code: ';

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
          content: COPY_SUCCESS_MESSAGE,
        });
      },
      (err) => {
        props.setAlertErrorMessage(COPY_ERROR_MESSAGE_PREFIX + err);
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

  return (
    <Antd.Flex vertical gap="small" style={{ height: '100%' }}>
      {renderHeader()}
      {renderCodeBlock()}
    </Antd.Flex>
  );
}
