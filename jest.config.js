// jest.config.js
module.exports = {
    roots: [
        "<rootDir>/src"
    ],
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
    transformIgnorePatterns: ["/node_modules/"],
    moduleNameMapper: {
        "~src/(.*)": "<rootDir>/src/$1",
        "\\.(svg)$": "<rootDir>/src/tests/svgMock.js",
        "\\.(css)$": "<rootDir>/src/tests/__mocks__/Login.css"
    },
    transform: {
        '^.+\\.(jsx|js|tsx|ts)$': 'babel-jest'
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
  };
  