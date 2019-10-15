import { h, render, remodel } from '../lib/index.js'

const model = remodel({ a: 0, b: 0, c: 0, d: 0 })
const wrap = (prefix, i, mod) => prefix + i % mod

setInterval(() => model.a++, 1000)
setInterval(() => model.b++, 500)
setInterval(() => model.c++, 250)
setInterval(() => model.d++, 125)

render(document.querySelector('.attributes'), h`
  <span class="${() => wrap('b', model.b, 3)} ${() => wrap('c', model.c, 3)} ${() => wrap('d', model.d, 4)}">seconds running: ${() => model.a.toString()}</span>
`)
