module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:import/recommended',
    // 'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '*.css', '.d.ts'],
      },
    },
  },
  plugins: ['jest', '@typescript-eslint', 'react', 'prettier'],
  rules: {
    'import/extensions': ['warn', { css: 'never', ts: 'never', tsx: 'never' }],
    'import/prefer-default-export': 'off',
    'no-nested-ternary': 'off',
    'no-await-in-loop': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: __dirname,
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-param-reassign': 'off',
    'no-promise-executor-return': 'off',
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'default-param-last': 'off',
    'import/no-unresolved': 'off',
  },
};
