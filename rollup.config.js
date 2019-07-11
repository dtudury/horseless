export default [
  {
    input: 'lib/index.js',
    output: {
      name: 'horseless',
      file: 'dist/horseless.umd.js',
      format: 'umd'
    }
  },
  {
    input: 'lib/index.js',
    output: [
      { file: 'dist/horseless.cjs.js', format: 'cjs' },
      { file: 'dist/horseless.esm.js', format: 'es' }
    ]
  }
]
