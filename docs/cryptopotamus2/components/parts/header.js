import { h, render } from '/unpkg/horseless/horseless.js'
import { Containable } from './containable.js'

export function defineHeader (name) {
  window.customElements.define(name, Header)
  return name
}

class Header extends Containable {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: ${() => this.model.depth * 0.5 + 0.5}rem;
        }
        slot {
          display: flex;
          align-items: center;
        }
      </style>
      <slot></slot>
    `)
  }
}
