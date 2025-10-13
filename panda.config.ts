import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  jsxFramework: 'angular',
  outdir: 'styled-system',

  include: ['./src/**/*.{ts,html}'],
  exclude: ['./node_modules/**/*', './dist/**/*'],

  theme: {
    extend: {
      tokens: {
        colors: {
          primary: {
            200: { value: '#e0e0ff' },
            700: { value: '#4e46dc' },
          },
          neutral: {
            400: { value: '#a1a1aa' },
            700: { value: '#3f3f46' },
          },
          sidebar: {
            bg: { value: '##00000000' },
            hover: { value: '#232323' },
          },
        },
      },
    },
  },
});

