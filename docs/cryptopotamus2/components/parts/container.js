import { h, render } from '/unpkg/horseless/horseless.js'
import { Containable } from './containable.js'

export function defineContainer (name) {
  window.customElements.define(name, Container)
  return name
}

export function countContainers (el) {
  let count = 0
  while (el) {
    console.log(el, el.tagName, el instanceof Container)
    if (el instanceof Container) {
      ++count
    }
    el = el.parentNode
  }
  return count
}

class Container extends Containable {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :host {
          color: #888;
          fill: #888;
        }
        :host([closed]) .body {
          display: none;
        }
        :host(:hover) {
          color: #666;
          fill: #666;
        }
        .body {
          position: relative;
          margin: 0.5rem 0;
        }
        .bracket {
          content: "";
          width: 0.2rem;
          height: 100%;
          border: 1px solid #aaa;
          border-right: none;
          position: absolute;
          top: -1px;
          left: ${() => this.model.depth * 0.5 + 0.5}rem;
          z-index: 1;
          pointer-events: none;
        }
        :host(:hover) .bracket {
          border-color: #666;
        }
        .header {
          padding-top: 0.5rem;
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
}
