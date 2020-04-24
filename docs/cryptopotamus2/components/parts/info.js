import { h, render } from '/unpkg/horseless/horseless.js'
import { Containable } from './containable.js'

export function defineInfo (name) {
  window.customElements.define(name, Info)
  return name
}

class Info extends Containable {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: ${() => this.model.depth * 0.5 + 1}rem;
          font-size: 0.8rem;
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
