import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: './src/bin.js',
      },
      name: 'dist',
      formats: ['cjs'],
    },
  },
})
