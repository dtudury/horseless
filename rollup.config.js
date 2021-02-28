import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'

export default [{
  input: 'horseless.js',
  inlineDynamicImports: true,
  plugins: [alias({ entries: [{ find: '/unpkg', replacement: './node_modules' }] }), terser()],
<<<<<<< HEAD
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
=======
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
>>>>>>> 58271de60d71b2fc776a281520dfbb150c569912
}]
