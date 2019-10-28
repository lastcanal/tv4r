const { useBabelRc, override, useEslintRc, disableEsLint } = require('customize-cra')

module.exports = override(
  useBabelRc(),
  (
    (process.env['LINT'] || '').toLowerCase() === 'no'
      ? disableEsLint()
      : useEslintRc()
  )
);
