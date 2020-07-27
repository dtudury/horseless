import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'

export default [{
  input: 'horseless.js',
  inlineDynamicImports: true,
  plugins: [alias({ entries: [{ find: '/unpkg', replacement: './node_modules' }] }), terser()],
  output: [{
    file: pkg.module, format: 'es'
  }, {
    file: 'docs/esm/' + pkg.version + '.min.js', format: 'es'
  }]
}, {
  input: 'horseless.js',
  plugins: [alias({ entries: [{ find: '/unpkg', replacement: './node_modules' }] })],
  output: [{
    file: pkg.main, format: 'cjs'
  }, {
    file: pkg.devmodule, format: 'es'
  }, {
    file: 'docs/esm/' + pkg.version + '.js', format: 'es'
  }]
}]
