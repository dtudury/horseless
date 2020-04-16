import { h, render } from '/unpkg/horseless/horseless.js'
import { model } from './model.js'
import { ones } from './boxes.js'

model.v = Math.floor(Math.random() * 4 + 6)

function boxes (el) {
  void (model.tics)
  return ones(5.5, 10, model.v % 10, 50)
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
