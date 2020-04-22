import { h, render } from '/unpkg/horseless/horseless.js'
import { iconArrowRight } from '../../icons.js'
import { Containable } from './containable.js'

export function defineLine (name) {
  window.customElements.define(name, Line)
  return name
}

class Line extends Containable {
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
          padding-right: 20px;
          padding-left: ${() => this.model.depth * 10 + 20}px;
        }
        :host([slot="header"]) {
          padding-left: ${() => this.model.depth * 10 + 10}px;
        }
        slot {
          display: flex;
          align-items: center;
        }
      </style>
      <slot></slot>
      ${iconArrowRight}
    `)
  }
}
