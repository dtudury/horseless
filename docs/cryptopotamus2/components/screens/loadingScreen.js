import { h, render, proxy } from '/unpkg/horseless/horseless.js'

export function defineLoadingScreen (name) {
  window.customElements.define(name, LoadingScreen)
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

class LoadingScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          padding: 1rem;
        }
      </style>
      loading${() => dots.dots}
    `)
  }
}
