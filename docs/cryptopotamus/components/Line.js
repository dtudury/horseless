import { h, render, proxy } from '/unpkg/horseless/horseless.js'
import { countContainers } from './Container.js'

export function defineLine (name) {
  window.customElements.define(name, Line)
  return name
}

class Line extends window.HTMLElement {
  constructor () {
    super()
    this.model = proxy({ depth: 0 })
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :host(.link) {
          cursor: pointer;
        }
        :host(.link) :hover {
          background: #ddd;
        }
        slot {
          display: flex;
          align-items: center;
          padding-right: 20px;
          padding-left: ${() => this.model.depth * 10 + 20}px;
        }
        :host(.h2) slot {
          justify-content: center;
        }
        :host([slot="header"]) slot {
          padding-left: ${() => this.model.depth * 10 + 10}px;
        }
      </style>
      <slot></slot>
    `)
  }

  connectedCallback () {
    this.model.depth = countContainers(this)
  }
}
