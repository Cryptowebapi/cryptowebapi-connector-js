// Global test setup
beforeEach(() => {
  // Reset any mocks
  jest.clearAllMocks();
});

// Mock console methods in tests to avoid noise
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
