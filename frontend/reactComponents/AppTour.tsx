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
import { useTranslation } from 'react-i18next';

/** Props for the AppTour component. */
export interface AppTourProps {
  isOpen: boolean;
  onClose: () => void;
  siderRef: React.RefObject<HTMLDivElement>;
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
const AppTour: React.FC<AppTourProps> = ({ isOpen, onClose, siderRef }) => {
  const { t } = useTranslation();

  const steps: Antd.TourProps['steps'] = [
    {
      title: t('TOUR.WELCOME_TITLE'),
      description: t('TOUR.WELCOME_DESC'),
      target: null,
    },
    {
      title: t('TOUR.SIDEBAR_TITLE'),
      description: t('TOUR.SIDEBAR_DESC'),
      target: () => siderRef.current as HTMLElement,
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
