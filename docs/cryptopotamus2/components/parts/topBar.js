import { h, render } from '/unpkg/horseless/horseless.js'

export function defineTopBar (name) {
  window.customElements.define(name, TopBar)
  return name
}

class TopBar extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          display: flex;
          height: 1rem;
          padding: 0.5rem;
          border-bottom: 1px solid #bbb;
        }
        :host(:hover) {
          background: #00000010;
        }
      </style>
      <slot/>
    `)
  }
}
