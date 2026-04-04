import { render } from 'vitest-browser-react';
import App from '../src/App.tsx';
import { beforeAll, /*expect,*/ test } from "vitest";
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

beforeAll(() => {
  // Initialize i18next with a basic configuration for testing
  i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {}
        }
      }
    });
});

test('renders app', async () => {
  render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>);
  // TODO: Add some expect statements.
});
