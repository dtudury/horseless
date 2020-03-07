import pkg from './package.json'
import uglify from 'rollup-plugin-uglify-es'

export default [{
  inlineDynamicImports: true,
  input: 'breakdown/index.js',
  plugins: [uglify()],
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
