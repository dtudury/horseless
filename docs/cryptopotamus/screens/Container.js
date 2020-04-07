import { h, render } from '/unpkg/horseless/horseless.js'

export function defineContainer (name) {
  window.customElements.define(name, Container)
  return name
}

class Container extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`asdf`)
  }
}
