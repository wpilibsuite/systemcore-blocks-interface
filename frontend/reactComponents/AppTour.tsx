/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
import { useTranslation } from 'react-i18next';

/** Props for the AppTour component. */
export interface AppTourProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Returns a function that queries for a tour target element. */
const tourTarget = (selector: string): (() => HTMLElement) =>
  // Elements are guaranteed to be mounted when the tour is shown.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  () => document.querySelector<HTMLElement>(selector)!;

/**
 * Guided tour component that highlights key areas of the UI.
 * Shown automatically on first use and available via Help > Tour.
 */
const AppTour: React.FC<AppTourProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const steps: Antd.TourProps['steps'] = [
    {
      title: t('TOUR.WELCOME_TITLE'),
      description: t('TOUR.WELCOME_DESC'),
      target: null,
    },
    {
      title: t('TOUR.DEPLOY_TITLE'),
      description: t('TOUR.DEPLOY_DESC'),
      target: tourTarget('[data-menu-id$="-deploy"]'),
    },
    {
      title: t('TOUR.MANAGE_TITLE'),
      description: t('TOUR.MANAGE_DESC'),
      target: tourTarget('[data-menu-id$="-manage"]'),
    },
    {
      title: t('TOUR.EXPLORER_TITLE'),
      description: t('TOUR.EXPLORER_DESC'),
      target: tourTarget('[data-menu-id$="-explorer"]'),
    },
    {
      title: t('TOUR.SETTINGS_TITLE'),
      description: t('TOUR.SETTINGS_DESC'),
      target: tourTarget('[data-menu-id$="-settings"]'),
    },
    {
      title: t('TOUR.HELP_TITLE'),
      description: t('TOUR.HELP_DESC'),
      target: tourTarget('[data-menu-id$="-help"]'),
    },
    {
      title: t('TOUR.SIDEBAR_COLLAPSE_TITLE'),
      description: t('TOUR.SIDEBAR_COLLAPSE_DESC'),
      target: tourTarget('[data-tour="sider-collapse"]'),
    },
    {
      title: t('TOUR.MECHANISM_TABS_TITLE'),
      description: t('TOUR.MECHANISM_TABS_DESC'),
      target: tourTarget('[data-tour="tab-row-mechanisms"]'),
    },
    {
      title: t('TOUR.OPMODE_TABS_TITLE'),
      description: t('TOUR.OPMODE_TABS_DESC'),
      target: tourTarget('[data-tour="tab-row-opmodes"]'),
    },
    {
      title: t('TOUR.ADD_TAB_TITLE'),
      description: t('TOUR.ADD_TAB_DESC'),
      target: tourTarget('[data-tour="tab-row-mechanisms"] .ant-tabs-nav-add'),
    },
    {
      title: t('TOUR.WORKSPACE_TITLE'),
      description: t('TOUR.WORKSPACE_DESC'),
      target: tourTarget('[data-tour="blockly-workspace"]'),
    },
    {
      title: t('TOUR.CODE_PANEL_TITLE'),
      description: t('TOUR.CODE_PANEL_DESC'),
      target: tourTarget('[data-tour="code-panel"]'),
    },
  ];

  return (
    <Antd.Tour
      open={isOpen}
      onClose={onClose}
      onFinish={onClose}
      steps={steps}
    />
  );
};

export default AppTour;
