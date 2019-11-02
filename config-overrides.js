const { addBabelPlugins, override, useEslintRc, disableEsLint } = require('customize-cra')

module.exports = override(
  addBabelPlugins(
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal"}],
    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    "@babel/plugin-proposal-logical-assignment-operators",
    "@babel/plugin-proposal-do-expressions"
  ),
  (
    (process.env['LINT'] || '').toLowerCase() === 'no'
      ? disableEsLint()
      : useEslintRc()
  )
);
