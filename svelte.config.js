import { sveltePreprocess } from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html'
    })
  },
  preprocess: sveltePreprocess({
    postcss: true
  })
};

export default config;
