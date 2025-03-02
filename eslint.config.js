import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.output/',
      '.data/',
      '.cache/',
      '.idea/',
      '.fleet/',
      '.DS_Store/',
      'dist/',
      'node_modules/',
      '**/logs/',
      '**/*.log',
      '.env',
      '.env.*',
    ],
  },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    extends: [
      eslint.configs.recommended,
    ],
    rules: {
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'constructor-super': 'error',
      'getter-return': ['error', {
        allowImplicit: true,
      }],
      'no-await-in-loop': 'off',
      'no-console': 'off',
      'no-const-assign': 'error',
      'no-continue': 'off',
      'no-debugger': 'off',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-irregular-whitespace': 'off',
      'no-new-symbol': 'error',
      'no-obj-calls': 'error',
      'no-plusplus': 'off',
      'no-redeclare': 'error',
      'no-setter-return': 'error',
      'no-shadow': 'off',
      'no-this-before-super': 'error',
      'no-undef': 'off',
      'no-underscore-dangle': ['error', {
        allowAfterThis: true,
      }],
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'no-use-before-define': 'off',
      'no-useless-return': 'off',
      'valid-typeof': ['error', {
        requireStringLiterals: true,
      }],
    },
  },
  {
    extends: [
      eslintPluginUnicorn.configs['flat/recommended'],
    ],
    rules: {
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-static-only-class': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.ts', '.vue'] },
        typescript: {},
      },
    },
    rules: {
      'import/extensions': 'off',
      'import/no-cycle': 'off',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '*.{js,cjs,ts}',
          'tests/**',
          'spec/**',
          '**/*spec.{js,ts}',
        ],
        optionalDependencies: false,
      }],
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          [
            'parent',
            'sibling',
            'index',
          ],
        ],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
          {
            pattern: '~~/**',
            group: 'internal',
          },
          {
            pattern: '#**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
      'import/no-named-as-default-member': 'off',
      'import/prefer-default-export': 'off',
    },
  },
  {
    extends: [
      tseslint.configs.recommended,
      tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/prefer-function-type': 'off',
    },
  },
  {
    extends: [
      stylistic.configs.customize({
        arrowParens: true,
        blockSpacing: true,
        braceStyle: '1tbs',
        commaDangle: 'always-multiline',
        flat: true,
        indent: 2,
        jsx: false,
        quoteProps: 'as-needed',
        quotes: 'single',
        semi: true,
      }),
    ],
    rules: {
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/function-paren-newline': ['error', 'multiline'],
      '@stylistic/lines-between-class-members': ['error', 'always', {
        exceptAfterSingleLine: true,
        exceptAfterOverload: true,
      }],
      '@stylistic/multiline-comment-style': ['error', 'separate-lines'],
      '@stylistic/max-len': ['error', {
        code: 120,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      '@stylistic/newline-per-chained-call': ['error', {
        ignoreChainWithDepth: 2,
      }],
      '@stylistic/no-confusing-arrow': ['error', {
        allowParens: true,
        onlyOneSimpleParam: false,
      }],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          consistent: true,
        },
      }],
      '@stylistic/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true,
      }],
      '@stylistic/one-var-declaration-per-line': ['error', 'always'],
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/switch-colon-spacing': ['error', {
        after: true,
        before: false,
      }],
    },
  },
  {
    files: ['**/*.js'],
    extends: [
      tseslint.configs.disableTypeChecked,
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',

      'unicorn/prefer-module': 'off',
    },
  },
);
