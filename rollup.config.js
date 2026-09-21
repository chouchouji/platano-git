import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
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
  external: ['chalk', 'tinyexec', 'commander'],
  plugins: [
    commonjs(),
    typescript(),
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
  ],
}
