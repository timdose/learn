import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://learn.timdoseart.com',
  integrations: [mdx()],
  outDir: '_build',
  vite: {
    plugins: [yaml()],
    optimizeDeps: {
      exclude: ['workshops'],
      entries: ['src/**/*.{astro,mdx}'],
    },
    server: {
      watch: {
        ignored: ['**/workshops/**'],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin'],
          includePaths: ['src/styles'],
        },
      },
    },
  },
});
