import { h, render, proxy } from '/unpkg/horseless/horseless.js'

export function defineBusyScreen (name) {
  window.customElements.define(name, BusyScreen)
  return name
}

const dots = proxy({ dots: '...' })

setInterval(() => {
  if (dots.dots.length < 3) {
    dots.dots += '.'
  } else {
    dots.dots = ''
  }
}, 1000)

class BusyScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          display: block;
          padding: 1rem;
        }
      </style>
      <slot/>${() => dots.dots}
    `)
  }
}
