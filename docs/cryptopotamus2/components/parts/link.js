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
          padding-right: 1.5rem;
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
        div {
          visibility: hidden;
          display: flex;
          align-items: center;
        }
        :host(:hover) div {
          visibility: visible;
        }
        slot {
          display: flex;
          align-items: center;
          text-decoration: underline;
        }
      </style>
      <slot></slot>
      <div>
        <${OCTICON} arrow-right/>
        <slot name="icon"></slot>
      </div>
    `)
  }
}
