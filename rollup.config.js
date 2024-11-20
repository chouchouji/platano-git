import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import { fileURLToPath } from 'url'

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/bin.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  external: ['chalk', 'tinyexec', 'fs-extra', 'commander', '@inquirer/prompts'],
  plugins: [
    alias({
      entries: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
}
