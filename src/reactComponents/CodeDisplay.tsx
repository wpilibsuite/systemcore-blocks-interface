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
//import React from 'react';
import * as Antd from 'antd';
import {CopyOutlined as CopyIcon} from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import type { MessageInstance } from 'antd/es/message/interface';
type StringFunctionVoid = (input: string) => void;

interface CodeDisplayProps {
    generatedCode : string;
    messageApi : MessageInstance;
    setAlertErrorMessage : StringFunctionVoid;
}
export default function CodeDisplay(props : CodeDisplayProps) {
    const handleCopyPythonClicked = () => {
        navigator.clipboard.writeText(props.generatedCode).then(
          () => {
            props.messageApi.open({
              type: 'success',
              content: 'Copy completed successfully.',
            });
          },
          (err) => {
            props.setAlertErrorMessage('Could not copy code: ' + err);
          }
        );
      };

    return (
        <Antd.Flex
            vertical gap="small"
        >
            <Antd.Space>
                <h3 style={{ color: '#fff', margin: 0 }}>Python Code</h3>
                <Antd.Tooltip title="Copy">
                    <Antd.Button
                        icon={<CopyIcon />}
                        size="small"
                        onClick={handleCopyPythonClicked}
                        style={{ color: 'white' }}
                    >
                    </Antd.Button>
                </Antd.Tooltip>
            </Antd.Space>
            <SyntaxHighlighter
                language="python"
                style={dracula}
                customStyle={{
                    backgroundColor: '#333',
                    width: '100%',
                    height: '100%',
                }}
            >
                {props.generatedCode}
            </SyntaxHighlighter>
        </Antd.Flex>
    )
}