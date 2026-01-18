module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  extends: ['google'],
  env: {
    es2022: true,
    node: true,
    jest: true,
    browser: true,
  },
  rules: {
    // 課題の解答上ウザい設定は無効化する
    'object-curly-spacing': 'off',
    'space-before-function-paren': 'off',
    'require-jsdoc': 'off',
    'indent': 'off',
  },
  ignorePatterns: ['ch17/ex01/format_sample.js'],
  root: true,
};
