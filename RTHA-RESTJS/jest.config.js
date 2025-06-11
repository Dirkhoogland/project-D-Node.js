module.exports = {
    rootDir: '.',
    testMatch: ['**/test/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'node',
};
