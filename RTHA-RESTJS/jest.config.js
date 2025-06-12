module.exports = {
    rootDir: '.',
    testMatch: ['**/test/**/*.spec.ts', '**/test/**/*.e2e-spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
};
