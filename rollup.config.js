import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'

export default [{
  input: 'horseless.js',
  inlineDynamicImports: true,
  plugins: [alias({ entries: [{ find: '/unpkg', replacement: './node_modules' }] }), terser()],
  output: [
    { file: `dist/horseless.${pkg.version}.min.esm.js`, format: 'es', sourcemap: true },
    { file: `dist/${pkg.version}.min.esm.js`, format: 'es', sourcemap: true },
    { file: pkg.module, format: 'es' }
  ]
}, {
  input: 'horseless.js',
  plugins: [alias({ entries: [{ find: '/unpkg', replacement: './node_modules' }] })],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.devmodule, format: 'es' }
  ]
}]
