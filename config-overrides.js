const { useBabelRc, override, useEslintRc, disableEsLint } = require('customize-cra')

module.exports = override(
  useBabelRc(),
  (process.env['LINT'] === 'no' ? disableEsLint() : useEslintRc())
);
