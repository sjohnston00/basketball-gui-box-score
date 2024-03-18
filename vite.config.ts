import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const BASENAME = '/basketball-gui-box-score/'

export default defineConfig({
  base: BASENAME,
  plugins: [
    remix({
      basename: BASENAME,
      ssr: false,
    }),
    tsconfigPaths(),
  ],
})

