const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
        '<rootDir>/tests/unit/**/*.test.[jt]s?(x)',
    ],
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/app/components/$1',
        '^@/lib/(.*)$': '<rootDir>/app/lib/$1',
        '^@/api/(.*)$': '<rootDir>/app/api/$1',
    },
}

module.exports = createJestConfig(customJestConfig)