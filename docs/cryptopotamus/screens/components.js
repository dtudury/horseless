import { h, render, proxy } from '/unpkg/horseless/horseless.js'

export function defineContainer (name) {
  window.customElements.define(name, Container)
  return name
}

export function defineLine (name) {
  window.customElements.define(name, Line)
  return name
}

function _countContainers (el) {
  let count = 0
  while (el) {
    if (el instanceof Container) {
      ++count
    }
    el = el.parentNode
  }
  return count
}

class Container extends window.HTMLElement {
  constructor () {
    super()
    this.model = proxy({ depth: 0 })
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        .body {
          position: relative;
          padding: 10px 0 5px;
        }
        .bracket {
          content: "";
          width: 5px;
          height: 100%;
          border-color: #ccc;
          border: 1px solid;
          border-right: none;
          position: absolute;
          top: 0;
          left: ${() => this.model.depth * 10 + 10}px;
          z-index: 1;
          pointer-events: none;
        }
        :host(:hover) .bracket {
          border-color: #666;
        }
        .header {
          padding-top: 10px;
        }
      </style>
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="body">
        <div class="bracket"></div>
        <slot></slot>
      </div>
    `)
  }

  connectedCallback () {
    this.model.depth = _countContainers(this)
  }
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
    this.model.depth = _countContainers(this)
  }
}
