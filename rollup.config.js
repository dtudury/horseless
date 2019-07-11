import pkg from './package.json'
import uglify from 'rollup-plugin-uglify-es'

export default [
  {
    input: 'lib/index.js',
    plugins: [uglify()],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
]
