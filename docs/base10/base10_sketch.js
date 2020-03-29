import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({ hundreds: 1, tens: 3, ones: 4 })

function r (coordinates, amount = 1) {
  if (Array.isArray(coordinates)) {
    return coordinates.map(coordinate => r(coordinate, amount))
  }
  return coordinates + amount * Math.random() * 2 - 1
}

function wiggleLine (x0, y0, x3, y3, amount) {
  const x1 = (x0 + 2 * x3) / 3
  const x2 = (2 * x0 + x3) / 3
  const y1 = (y0 + 2 * y3) / 3
  const y2 = (2 * y0 + y3) / 3
  return `M${r([x0, y0]).join(' ')}C${[...r([x1, y1, x2, y2], amount), ...r([x3, y3])].join(' ')}`
}

function cube (xOffset, yOffset, w, h, d, xSteps = 1, ySteps = 1, zSteps = 1) {
  let path = ''
  const wiggliness = 1 / 30
  for (let xStep = 0; xStep <= xSteps; xStep++) {
    const x = xOffset + w * xStep / xSteps
    path += wiggleLine(x, yOffset, x, yOffset + h, h * wiggliness)
    path += wiggleLine(x, yOffset, x + d, yOffset - d)
  }
  for (let yStep = 0; yStep <= ySteps; yStep++) {
    const y = yOffset + h * yStep / ySteps
    path += wiggleLine(xOffset, y, xOffset + w, y, w * wiggliness)
    if (yStep > 0) {
      path += wiggleLine(xOffset + w, y, xOffset + w + d, y - d)
    }
  }
  for (let zStep = 1; zStep <= zSteps; zStep++) {
    const z = d * zStep / zSteps
    path += wiggleLine(xOffset + z, yOffset - z, xOffset + w + z, yOffset - z, w * wiggliness)
    path += wiggleLine(xOffset + w + z, yOffset - z, xOffset + w + z, yOffset + h - z, h * wiggliness)
  }
  return path
}

function boxes (el) {
  let path = ''
  for (let one = 0; one < model.ones; one++) {
    path += cube(450, 200 + one * 26, 13, 13, 5)
  }
  for (let ten = 0; ten < model.tens; ten++) {
    path += cube(250 + ten * 26, 200 - ten * 26, 13, 130, 5, 1, 10)
  }
  for (let hundred = 0; hundred < model.hundreds; hundred++) {
    path += cube(50, 200, 130, 130, 50, 10, 10, 10)
  }
  return path
}

render(document.querySelector('main.card'), h`
  <svg width="100%" height="100%" viewBox="0 0 550 550" fill="none" stroke="#aa8866" stroke-width="1" xmlns="http://www.w3.org/2000/svg">
    <path d=${boxes}/>
  </svg>
`)
