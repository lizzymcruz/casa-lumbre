import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://casa-lumbre.pages.dev',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  image: { responsiveStyles: true },
  build: { inlineStylesheets: 'always' },
});
