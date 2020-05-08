import { h, render, objToDeclarations, proxy, mapSwitch } from '/unpkg/horseless/horseless.js'
import { model } from '../../model.js'
import { screens } from '../../constants.js'
import { BUSY_SCREEN, SELECT_SCREEN, NEW_REPO_SCREEN, EDIT_REPO_SCREEN } from '../tags.js'
const _noise = proxy({ image: '' })

export function defineMainApp (name) {
  window.customElements.define(name, MainApp)
  return name
}

const divStyle = {
  style: objToDeclarations({
    'pointer-events': 'none',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    'box-shadow': 'inset 0 0.1rem 0.7rem 0.2rem #666',
    'border-radius': '0.5rem'
  })
}

const screen = mapSwitch(() => model.state.screen, screen => {
  switch (screen) {
    case screens.LOADING: return h`<${BUSY_SCREEN}>loading</${BUSY_SCREEN}>`
    case screens.WORKING: return h`<${BUSY_SCREEN}>working</${BUSY_SCREEN}>`
    case screens.SELECT: return h`<${SELECT_SCREEN}/>`
    case screens.NEW_REPO: return h`<${NEW_REPO_SCREEN}/>`
    case screens.EDIT_REPO: return h`<${EDIT_REPO_SCREEN}/>`
    default:
      console.error(`unhandled screen: ${String(model.state.screen)}`)
      return `unhandled screen: ${String(model.state.screen)}`
  }
})

// make tv static
const size = 128
const colorBase = 0xffcccccc
const range = 5
const rRange = range
const gRange = range
const bRange = range
const canvas = render(h`<canvas width="${size}" height="${size}"/>`)[0]
var context = canvas.getContext('2d', { alpha: false })
var imageData = context.createImageData(canvas.width, canvas.height)
var uint32Array = new Uint32Array(imageData.data.buffer)
const images = []
function updateNoise () {
  let image
  do {
    const index = Math.floor(Math.random() * 32)
    if (!images[index]) {
      uint32Array.forEach((v, i) => {
        uint32Array[i] = colorBase +
          Math.round(2 * Math.random() * rRange - rRange) +
          Math.round(2 * Math.random() * gRange - gRange) * 0x100 +
          Math.round(2 * Math.random() * bRange - bRange) * 0x10000
      })
      context.putImageData(imageData, 0, 0)
      images[index] = `url(${canvas.toDataURL()})`
    }
    image = images[index]
  } while (image === _noise.image)
  _noise.image = image
  // window.requestAnimationFrame(updateNoise)
}
updateNoise()

class MainApp extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          display: block;
          position: relative;
          background: #ccc;
          color: #666;
          fill: #666;
          border-radius: 0.6rem;
          box-shadow: inset 0px 0.1rem 1rem 0.5rem #fff, inset 0.3rem 0.1rem 0.2rem 0.1rem #0ff, inset -0.1rem 0.1rem 0.2rem 0.4rem #ff0;
          background-image: ${() => _noise.image};
        }
      </style>
      ${screen}
      <div ${divStyle}/>
    `)
  }
}
