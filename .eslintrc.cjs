module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended' // ← ESLintとPrettierを統合
  ],
  plugins: ['svelte3', 'prettier'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  ignorePatterns: ['public/build/'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    'svelte3/preprocess': true
  }
};
