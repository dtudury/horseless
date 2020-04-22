import { h, render, objToDeclarations, proxy } from '/unpkg/horseless/horseless.js'
import { model } from '../../model.js'
import { screens } from '../../constants.js'
import { LOADING_SCREEN, SELECT_SCREEN } from '../components.js'
const _noise = proxy({ image: '' })

export function defineMainApp (name) {
  window.customElements.define(name, MainApp)
  return name
}

const hrStyle = {
  style: objToDeclarations({
    border: 'none',
    'border-top': '1px solid #ccc',
    'z-index': '1'
  })
}

const divStyle = {
  style: objToDeclarations({
    'pointer-events': 'none',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    'box-shadow': 'inset 0px 0.2rem 0.5rem #666',
    'border-radius': '0.5rem'
  })
}

function screen () {
  switch (model.state.screen) {
    case screens.LOADING: return h`<${LOADING_SCREEN}/>`
    case screens.SELECT: return h`<${SELECT_SCREEN}/>`
    default: return `unhandled screen: ${String(model.state.screen)}`
  }
}

// make tv static
const canvas = render(h`<canvas width="32" height="32"/>`)[0]
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
        uint32Array[i] = 0xffafafaf +
          Math.floor(Math.random() * 0x20) +
          Math.floor(Math.random() * 0x20) * 0x100 +
          Math.floor(Math.random() * 0x20) * 0x10000
      })
      context.putImageData(imageData, 0, 0)
      images[index] = `url(${canvas.toDataURL()})`
    }
    image = images[index]
  } while (image === _noise.image)
  _noise.image = image
  window.requestAnimationFrame(updateNoise)
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
          border-radius: 0.5rem;
          padding: 1em 0;
          box-shadow: inset 0px 0.1rem 3rem #fff;
          background-image: ${() => _noise.image};
        }
      </style>
      <hr ${hrStyle}>
      ${screen}
      <hr ${hrStyle}>
      <div ${divStyle}/>
    `)
  }
}
