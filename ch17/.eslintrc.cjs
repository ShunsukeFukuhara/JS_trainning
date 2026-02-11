module.exports = {
  parser: '@babel/eslint-parser',

  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      configFile: false,
    },
    sourceType: 'module',
    ecmaVersion: 2022,
  },

  extends: ['google', 'plugin:flowtype/recommended'],

  babelOptions: {
    babelrc: false,
    configFile: false,
  },

  plugins: ['flowtype'],

  env: {
    es2022: true,
    node: true,
    jest: true,
    browser: true,
  },

  rules: {
    'object-curly-spacing': 'off',
    'space-before-function-paren': 'off',
    'require-jsdoc': 'off',
    'indent': 'off',
  },

  ignorePatterns: ['ch17/ex01/format_sample.js'],
  root: true,
};
