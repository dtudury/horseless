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
          padding: 2px;
          padding-left: ${() => this.model.depth * 0.5 + 0.5}rem;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        }
        :host([onclick]:hover) {
          cursor: pointer;
          background: #00000010;
          border-color: #bbb;
          color: #666;
          fill: #666;
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
