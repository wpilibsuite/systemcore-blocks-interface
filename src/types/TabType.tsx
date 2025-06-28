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