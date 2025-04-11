import { render } from 'vitest-browser-react';
import App from '../src/App.tsx';
import { /*expect,*/ test } from "vitest";

test('renders app', async () => {
  render(<App />);
  // TODO: Add some expect statements.
});
