import { h, render, proxy } from '/unpkg/horseless/horseless.js'

export function defineTopBar (name) {
  window.customElements.define(name, TopBar)
  return name
}

class TopBar extends window.HTMLElement {
  constructor () {
    super()
    this.model = proxy({ onclick: false })
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          display: flex;
          height: 1rem;
          padding: 0.5rem;
          border-bottom: 1px solid #bbb;
          ${() => this.model.onclick ? 'cursor: pointer;' : ''}
        }
        :host(:hover) {
          ${() => this.model.onclick ? 'background: #00000010;' : ''}
        }
      </style>
      <slot/>
    `)
  }

  connectedCallback () {
    this.model.onclick = !!this.onclick
  }
}
