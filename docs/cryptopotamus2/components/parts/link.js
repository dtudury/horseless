import { h, render } from '/unpkg/horseless/horseless.js'
import { Containable } from './containable.js'
import { OCTICON } from '../tags.js'

export function defineLink (name) {
  window.customElements.define(name, Link)
  return name
}

class Link extends Containable {
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
          padding-left: ${() => this.model.depth * 0.5 + 1}rem;
          color: #888;
          fill: #888;
          cursor: pointer;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        }
        :host(:hover) {
          background: #00000010;
          border-color: #bbb;
          color: #666;
          fill: #666;
        }
        ${OCTICON} {
          visibility: hidden;
        }
        :host(:hover) ${OCTICON} {
          visibility: visible;
        }
        slot {
          display: flex;
          align-items: center;
        }
      </style>
      <slot></slot>
      <${OCTICON} arrow-right/>
    `)
  }
}
