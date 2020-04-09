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
        :host {
          background: gray;
        }
        .body {
          position: relative;
          padding: 5px 0;
        }
        .bracket {
          content: "";
          width: 5px;
          height: 100%;
          border: 1px solid black;
          border-right: none;
          position: absolute;
          left: ${() => this.model.depth * 10}px;
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
    console.log(this.getAttribute('collapsible'))
    this.model.depth = _countContainers(this)
  }
}

class Line extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :hover {
          background: #ddd;
        }
        slot {
          display: flex;
          align-items: center;
          width: 100%;
        }
      </style>
      <slot></slot>
    `)
  }

  connectedCallback () {
    console.log(this.getAttribute('slot'))
    console.log(_countContainers(this))
  }
}
