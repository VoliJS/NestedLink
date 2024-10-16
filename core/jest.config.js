module.exports = {
    testEnvironment: 'node',
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node",
    ],
    testRegex: '/tests/.+\\.(test|spec)\\.(ts|js)x?$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{ts,tsx,js,jsx}',
      '!src/**/*.d.ts',
    ],
    globals: {
      'ts-jest': {
        tsConfig: './tsconfig.json'
      }
    }
  };