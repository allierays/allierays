// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://allierays.com',
  integrations: [mdx(), sitemap(), react()],
  vite: {
    optimizeDeps: {
      include: ['@xyflow/react', '@xyflow/system', 'react', 'react-dom'],
    },
    ssr: {
      noExternal: ['@xyflow/react', '@xyflow/system'],
    },
  },
});
