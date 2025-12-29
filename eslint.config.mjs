import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(["dist/*"]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      '@stylistic': stylistic,
    },
		rules: {
      '@stylistic/no-trailing-spaces': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      'no-var': 'error',
      'prefer-const': 'error',
		},
	},
]);
