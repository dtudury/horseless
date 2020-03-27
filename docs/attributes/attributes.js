import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({ a: 0, b: 0, c: 0, d: 0 })
const wrap = (prefix, i, mod) => prefix + i % mod

setInterval(() => model.a++, 1000)
setInterval(() => model.b++, 555)
setInterval(() => model.c++, 505)
setInterval(() => model.d++, 455)

render(document.querySelector('.attributes'), h`
  <span class="${() => wrap('b', model.b, 3)} ${() => wrap('c', model.c, 3)} ${() => wrap('d', model.d, 4)}">seconds running: ${() => model.a.toString()}</span>
`)
