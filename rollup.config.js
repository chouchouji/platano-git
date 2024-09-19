import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/bin.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  // external chalk because its content (supports-color/browser.js) includes navigator
  external: ['node:child_process', 'node:fs', 'chalk'],
  plugins: [
    commonjs(),
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    terser(),
  ],
}
