import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'horseless.js',
    inlineDynamicImports: true,
    plugins: [terser()],
    output: [
      {
        file: `dist/horseless.${pkg.version}.min.esm.js`,
        format: 'es',
        sourcemap: true
      },
      { file: `dist/${pkg.version}.min.esm.js`, format: 'es', sourcemap: true },
      { file: pkg.module, format: 'es' }
    ]
  },
  {
    input: 'horseless.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.devmodule, format: 'es' }
    ]
  }
]
