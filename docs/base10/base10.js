import { h, render, proxy } from '/unpkg/horseless/horseless.js'
import { thousands, hundreds, tens, ones } from './boxes.js'
import { digits } from './digits.js'
const model = proxy({ v: Math.floor(Math.random() * 100), tics: 1 })

setInterval(() => ++model.tics)

function r (values, amount = 1) {
  if (Array.isArray(values)) {
    return values.map(value => r(value, amount))
  }
  return values + amount * Math.random() * 1 - 0.5
}

function arrow (x, y, v, sign) {
  const inc = Math.pow(10, v)
  const result = Math.min(9999, Math.max(0, model.v + sign * inc))
  const onclick = el => e => {
    model.v = result
  }
  const triangle = r([
    (x + 0.2) * 20, (y - sign * 0.5) * 20,
    (x + 0.5) * 20, (y - sign * 0.8) * 20,
    (x + 0.8) * 20, (y - sign * 0.5) * 20
  ], 2)
  if (sign === -1) {
    y += 2.5
  }
  if (result === model.v + sign * inc) {
    return h`
      <g onclick=${onclick} style="cursor: pointer; pointer-events: bounding-box;">
        <rect x=${x * 20 - 10} y=${y * 20 - 70} width=${40} height=${90} stroke-opacity="0"/>
        <path d="M${triangle.join(' ')}Z"/>
        ${digits(x - 0.20 * v, y - 0.9 - sign * 0.3, 0.3, (sign === 1 ? '+' : '-') + inc, 20, 1.3)}
      </g>
    `
  } else {
    return []
  }
}

function boxes (el) {
  // void (model.tics)
  return [
    thousands(2, 28, Math.floor(model.v / 1000)),
    hundreds(5, 23, Math.floor((model.v % 1000) / 100)),
    tens(18.5, 16, Math.floor((model.v % 100) / 10)),
    ones(29, 23, model.v % 10),
    arrow(20, 19, 2, 1),
    arrow(20, 21, 2, -1),
    arrow(22, 19, 1, 1),
    arrow(22, 21, 1, -1),
    arrow(24, 19, 0, 1),
    arrow(24, 21, 0, -1),
    h`<g stroke-width="2">
      ${digits(18, 21, 1, ('   ' + model.v).substr(-4), 20, 2)}
    </g>`
  ]
}

render(document.querySelector('main.card'), h`
  <svg viewBox="0 0 700 600" fill="none" stroke="#aa8866" stroke-linejoin="round" stroke-linecap="round" stroke-width="1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="250%">
        <feOffset in="SourceGraphic" dy="2" />
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
    ${boxes}
  </svg>
`)
