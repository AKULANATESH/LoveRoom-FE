import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { environmentConfigMock } from "./src/environment/mocks/environmentConfigMock";
import { mockApiServer } from "./src/mocks/server";

beforeAll(async () => {
  mockApiServer.listen({ onUnhandledRequest: "error" });

  vi.mock("./src/environment", async () => {
    const actualEnvironment: Record<string, unknown> = await vi.importActual("./src/environment");

    return {
      ...actualEnvironment,
      environmentConfig: environmentConfigMock,
    };
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  vi.mock("@mui/material", async () => {
    const actualMuiImport: Record<string, unknown> = await vi.importActual("@mui/material");

    return {
      ...actualMuiImport,
      useMediaQuery: () => false,
    };
  });
});

afterAll(() => {
  mockApiServer.close();
});

afterEach(() => {
  mockApiServer.resetHandlers();

  vi.resetAllMocks();
});

afterEach(() => {
  cleanup();
});
