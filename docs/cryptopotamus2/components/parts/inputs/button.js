import { h, render } from '/unpkg/horseless/horseless.js'
import { OCTICON } from '../../tags.js'

export function defineButton (name) {
  window.customElements.define(name, Button)
  return name
}

class Button extends window.HTMLElement {
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
          margin-left: 0.5rem
        }
        :host(:hover) div {
          visibility: visible;
        }
        slot {
          display: flex;
          align-items: center;
          text-decoration: underline;
          flex: 1;
          justify-content: flex-end;
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
