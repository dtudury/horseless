import { h, render } from '/unpkg/horseless/horseless.js'

export function defineScreenTitle (name) {
  window.customElements.define(name, ScreenTitle)
  return name
}

class ScreenTitle extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          padding: 0.5em;
          font-weight: 900;
        }
      </style>
      <slot></slot>
    `)
  }
}
