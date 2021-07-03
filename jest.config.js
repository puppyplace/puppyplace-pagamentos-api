const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  testRegex: "test/.*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "src/**/modules/**/*.{js,ts}",
    "!**/node_modules/**",
    "!**/entity/**/*.ts",
    "!**/dto/**/*.ts",
    "!**/*Module.ts"
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' })
}