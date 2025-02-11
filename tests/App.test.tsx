import { render } from "vitest-browser-react";
import App from "../src/App.tsx";
import { expect, test } from "vitest";

test("renders modal", async () => {
  const { getByText } = render(<App />);

  await expect.element(getByText("Welcome to WPILib Blocks!")).toBeVisible();
});
