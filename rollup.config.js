import pkg from './package.json'
import uglify from 'rollup-plugin-uglify-es'
import alias from '@rollup/plugin-alias'

export default [{
  input: 'breakdown/index.js',
  plugins: [alias({ entries: [{ find: './unpkg', replacement: './node_modules' }] }), uglify()],
  output: [{ file: pkg.module, format: 'es' }]
  /*
}, {
  input: 'lib/index.js',
  plugins: [uglify()],
  output: [{ file: pkg.module, format: 'es' }]
}, {
  input: 'lib/index.js',
  output: [{
    file: pkg.main, format: 'cjs'
  }, {
    file: pkg.devmodule, format: 'es'
  }]
  */
}]
