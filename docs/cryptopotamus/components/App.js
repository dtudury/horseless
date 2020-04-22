import { h, render, proxy } from '/unpkg/horseless/horseless.js'

export function defineApp (name) {
  window.customElements.define(name, App)
  return name
}

const model = proxy({ noise: '' })

class App extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
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
          background-image: ${() => model.noise};
        }
        :host div {
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: inset 0px 0.2rem 0.5rem #666;
          border-radius: 0.5rem;
        }
      </style>
      <slot/>
      <div/>
    `)
  }
}

const canvas = render(h`<canvas width="32" height="32"/>`)[0]
var context = canvas.getContext('2d', { alpha: false }) // context without alpha channel.
var imageData = context.createImageData(canvas.width, canvas.height) // create image data
var uint32Array = new Uint32Array(imageData.data.buffer) // get 32-bit view

const noises = []
  ;
(function loop () {
  let noise
  do {
    const index = Math.floor(Math.random() * 32)
    if (!noises[index]) {
      uint32Array.forEach((v, i) => {
        uint32Array[i] = 0xffafafaf +
          Math.floor(Math.random() * 0x20) +
          Math.floor(Math.random() * 0x20) * 256 +
          Math.floor(Math.random() * 0x20) * 256 * 256
      })
      context.putImageData(imageData, 0, 0)
      noises[index] = `url(${canvas.toDataURL()})`
    }
    noise = noises[index]
  } while (noise === model.noise)
  model.noise = noise
  window.requestAnimationFrame(loop)
})()
