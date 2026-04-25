import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import yaml from '@rollup/plugin-yaml';
import { existsSync } from 'fs';
import { join } from 'path';

function servePublicDirectoryIndexes() {
  return {
    name: 'serve-public-directory-indexes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0].split('#')[0] ?? '';
        const normalized = url.endsWith('/') ? url : url + '/';
        const indexPath = join(process.cwd(), 'public', normalized, 'index.html');
        if (existsSync(indexPath)) req.url = normalized + 'index.html';
        next();
      });
    },
  };
}

export default defineConfig({
  site: 'https://learn.timdoseart.com',
  integrations: [mdx()],
  outDir: '_build',
  vite: {
    plugins: [yaml(), servePublicDirectoryIndexes()],
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
