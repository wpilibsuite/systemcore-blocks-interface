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
import * as commonStorage from '../storage/common_storage';
import * as React from 'react';

/** Function type for setting string values. */
type StringFunction = (input: string) => void;

/** Props for the Header component. */
interface HeaderProps {
  alertErrorMessage: string;
  setAlertErrorMessage: StringFunction;
  project: commonStorage.Project | null;
}

/** Height of the logo image in pixels. */
const LOGO_HEIGHT = '30px';

/** Font weight for the main title. */
const TITLE_FONT_WEIGHT = 1000;

/** Font size for text elements. */
const TEXT_FONT_SIZE = '20px';

/** Left padding for text elements. */
const TEXT_PADDING_LEFT = 20;

/**
 * Header component that displays the application logo, title, current project,
 * and any error messages.
 */
export default function Header(props: HeaderProps): React.JSX.Element {
  const { token } = Antd.theme.useToken();

  const isDarkTheme = token.colorBgLayout === '#000000';

  /** Handles clearing the error message. */
  const handleClearError = (): void => {
    props.setAlertErrorMessage('');
  };

  /** Renders the error alert if there is an error message. */
  const renderErrorAlert = (): React.JSX.Element | null => {
    if (props.alertErrorMessage === '') {
      return null;
    }

    return (
      <Antd.Alert
        type="error"
        message={props.alertErrorMessage}
        closable
        afterClose={handleClearError}
      />
    );
  };

  /** Gets the project name or fallback text. */
  const getProjectName = (): string => {
    return props.project?.className || 'No Project Selected';
  };

  return (
    <Antd.Flex vertical>
      <Antd.Flex style={{alignItems: 'center'}}>
        <img
          height={LOGO_HEIGHT}
          style={{objectFit: 'contain'}}
          src={isDarkTheme ? "/FIRST_HorzRGB_reverse.png" : "/FIRST_HorzRGB.png"}
          alt="FIRST Logo"
        />
        <Antd.Typography
          style={{
            paddingLeft: TEXT_PADDING_LEFT,
            fontSize: TEXT_FONT_SIZE,
            fontWeight: TITLE_FONT_WEIGHT,
          }}
        >
          Blocks
        </Antd.Typography>
        <Antd.Typography
          style={{
            paddingLeft: TEXT_PADDING_LEFT,
            fontSize: TEXT_FONT_SIZE,
            fontWeight: 'normal',
          }}
        >
          Project: {getProjectName()}
        </Antd.Typography>
        {renderErrorAlert()}
      </Antd.Flex>
    </Antd.Flex>
  );
}