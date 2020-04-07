import { h, render } from '/unpkg/horseless/horseless.js'
import { model } from './model.js'
import { digits } from './digits.js'
import { box } from './boxes.js'

model.x = Math.floor(Math.random() * 11 + 2)
model.y = Math.floor(Math.random() * 11 + 2)

const screenWidth = 700 - 100
const screenHeight = 600 - 150 - 40
const screenRatio = screenWidth / screenHeight

function boxes (el) {
  void (model.tics)
  const str = `${model.x}*${model.y}`
  const frontWidth = model.x * 1.5 - 0.5
  const width = frontWidth + model.y / 2 - 0.5 + 1 / 3
  const height = model.y * 1.5 / 2 + 1.5 / 2
  const ratio = width / height
  let scale
  if (ratio > screenRatio) {
    scale = screenWidth / width
  } else {
    scale = screenHeight / height
  }
  const xOffset = (700 - scale * width) / 2
  const yOffset = ((600 - 90) - scale * height) / 2
  const boxArray = [...new Array(model.x)].map((_, x) => {
    return [...new Array(model.y)].map((_, y) => {
      return box(xOffset / scale + x * 1.5, yOffset / scale + 0.75 + model.y * 0.75, y * 1.5, 1, 1, 1, 'none', scale)
    }).reverse()
  })
  return [
    digits((xOffset + frontWidth * scale / 2) / 20 - (str.length * 1.5 - 0.5) / 2, (yOffset + scale * height + 40 + 20) / 20, 1, str),
    boxArray
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
