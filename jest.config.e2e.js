module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/e2e/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/e2e/setup.ts'],
  testTimeout: 10000,
};
