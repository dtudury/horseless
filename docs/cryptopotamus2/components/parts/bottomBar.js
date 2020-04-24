import { h, render } from '/unpkg/horseless/horseless.js'

export function defineBottomBar (name) {
  window.customElements.define(name, BottomBar)
  return name
}

class BottomBar extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          display: block;
          height: 1rem;
          padding: 0.5rem;
          border-top: 1px solid #bbb;
        }
      </style>
      <slot/>
    `)
  }
}
