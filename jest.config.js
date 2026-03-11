module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@xenova/transformers)/',
  ],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "test-artifacts", outputName: "junit.xml" }]
  ]
};
