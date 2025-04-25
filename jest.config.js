/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"], // Look for test files in the 'test' directory ending with .test.ts
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json)
    // Example: '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Optional: Setup files to run before each test file
  // setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
