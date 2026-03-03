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
import {
  RobotOutlined,
  CodeOutlined,
  BlockOutlined,
} from '@ant-design/icons';

/** Enumeration of tab types. */
export enum TabType {
  ROBOT,
  MECHANISM,
  OPMODE,
}

/** Utility functions for working with TabType enum. */
export const TabTypeUtils = {
  /**
   * Converts a TabType to its string representation.
   */
  toString(type: TabType): string {
    switch (type) {
      case TabType.ROBOT:
        return 'Robot';
      case TabType.MECHANISM:
        return 'Mechanism';
      case TabType.OPMODE:
        return 'OpMode';
      default:
        return '';
    }
  },

  /**
   * Gets the appropriate icon for a given TabType.
   */
  getIcon(type: TabType): React.JSX.Element {
    switch (type) {
      case TabType.ROBOT:
        return <RobotOutlined />;
      case TabType.MECHANISM:
        return <BlockOutlined />;
      case TabType.OPMODE:
        return <CodeOutlined />;
      default:
        return <></>;
    }
  },
};