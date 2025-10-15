/** Jest configuration for TypeScript using ts-jest */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  // only map relative imports that include .js extension (e.g. './foo.js' or '../bar.js')
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testTimeout: 20000,
};
