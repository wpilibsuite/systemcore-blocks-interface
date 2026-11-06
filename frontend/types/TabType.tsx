// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as React from 'react';
import {
  RobotOutlined,
  ToolOutlined,
  AimOutlined,
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
        return <ToolOutlined />;
      case TabType.OPMODE:
        return <AimOutlined />;
      default:
        return <></>;
    }
  },
};