import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/bin.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  external: ['chalk', 'tinyexec', 'fs-extra', 'commander', '@inquirer/prompts'],
  plugins: [
    typescript(),
    nodeResolve({
      preferBuiltins: true,
    }),
    terser(),
  ],
}
