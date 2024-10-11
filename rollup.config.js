import { nodeResolve } from '@rollup/plugin-node-resolve'
// eslint-disable-next-line import/no-extraneous-dependencies
import alias from '@rollup/plugin-alias'
import { fileURLToPath } from 'url'
import path from 'path'

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
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      },
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
}
