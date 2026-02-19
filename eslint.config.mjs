/**
 * @see https://nextjs.org/docs/app/api-reference/config/eslint
 */
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactCompiler from 'eslint-plugin-react-compiler';
import testingLibrary from 'eslint-plugin-testing-library';

const eslintConfig = defineConfig([
  // Next.js 공식 설정 (React, Hooks, Next.js 규칙 포함)
  ...nextVitals,
  ...nextTs,

  // Prettier와의 충돌 방지
  prettier,

  // React Compiler
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },

  // Import Plugin 설정
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      // Import 분석/정확성
      'import/no-unresolved': 'error',
      'import/named': 'off', // TypeScript가 체크함
      'import/default': 'error',
      'import/export': 'error',

      // Import 경고
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'warn',

      // Import 순서
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/newline-after-import': 'warn',

      // TypeScript 관련
      'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],

      // Next.js 호환성
      'import/no-default-export': 'off',
    },
  },

  // 프로젝트별 커스텀 규칙
  {
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // 일반
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // Testing Library (테스트 파일에만 적용)
  {
    files: ['**/*.test.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },

  // 무시할 파일
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    '.pnpm-store/**',
    'next-env.d.ts',
    'commitlint.config.mjs',
    'cli/**',
  ]),
]);

export default eslintConfig;
