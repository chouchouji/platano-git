import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/bin.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  external: ['chalk', 'tinyexec', 'fs-extra', 'commander', '@inquirer/prompts'],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
}
