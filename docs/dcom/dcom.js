import { h, render, proxy, showIfElse } from './horseless.0.4.0.min.esm.js'

const model = proxy({
})

render(document.body, showIfElse(() => !model.api, h`
  doesn't have api
`, h`
  has api
`))
