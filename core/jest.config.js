module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
    '^.+.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'node',
    'ts',
    'tsx',
  ],
  testRegex: '/tests/.+\\.(test|spec)\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
}