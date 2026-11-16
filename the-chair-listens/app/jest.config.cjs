const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>', '<rootDir>/../tests'],
  // Unit tests live in ../tests (project root) and in app/tests (admin auth tests).
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.[jt]s?(x)',
    '<rootDir>/../tests/unit/**/*.test.[jt]s?(x)',
    '<rootDir>/../tests/lib/**/*.test.[jt]s?(x)',
  ],
  // The tests live outside app/, so tell Jest where the packages are.
  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

module.exports = createJestConfig(customJestConfig);
