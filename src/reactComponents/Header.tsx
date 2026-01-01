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
import * as storageProject from '../storage/project';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useAutosave } from './AutosaveManager';

/** Function type for setting string values. */
type StringFunction = (input: string) => void;

/** Props for the Header component. */
interface HeaderProps {
  alertErrorMessage: string;
  setAlertErrorMessage: StringFunction;
  project: storageProject.Project | null;
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
  const { t } = useTranslation();
  const autosave = useAutosave();

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
        title={props.alertErrorMessage}
        closable={{ closeIcon: true, onClose: handleClearError }}
      />
    );
  };

  /** Gets the project name or fallback text. */
  const getProjectName = (): string => {
    return props.project?.projectName || t('NO_PPROJECT_SELECTED');
  };

  /** Renders the unsaved changes indicator. */
  const renderUnsavedIndicator = (): React.JSX.Element | null => {
    if (!autosave.hasUnsavedChanges) {
      return null;
    }

    return (
      <Antd.Typography.Text
        style={{
          marginLeft: 8,
          fontSize: TEXT_FONT_SIZE,
          color: token.colorWarning,
          fontStyle: 'italic',
        }}
      >
        *
      </Antd.Typography.Text>
    );
  };

  return (
    <Antd.Flex vertical>
      <Antd.Flex style={{alignItems: 'center'}}>
        <img
          height={LOGO_HEIGHT}
          style={{objectFit: 'contain'}}
          src={import.meta.env.BASE_URL + (isDarkTheme ? "/FIRST_HorzRGB_reverse.png" : "/FIRST_HorzRGB.png")}
          alt="FIRST Logo"
        />
        <Antd.Typography
          style={{
            paddingLeft: TEXT_PADDING_LEFT,
            fontSize: TEXT_FONT_SIZE,
            fontWeight: TITLE_FONT_WEIGHT,
          }}
        >
          {t("BLOCKS")}
        </Antd.Typography>
        <Antd.Typography
          style={{
            paddingLeft: TEXT_PADDING_LEFT,
            fontSize: TEXT_FONT_SIZE,
            fontWeight: 'normal',
          }}
        >
          {t("PROJECT")}: {getProjectName()}
          {renderUnsavedIndicator()}
        </Antd.Typography>
        {renderErrorAlert()}
      </Antd.Flex>
    </Antd.Flex>
  );
}