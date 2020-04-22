import { h, render, proxy } from '/unpkg/horseless/horseless.js'
import { countContainers } from './Container.js'
import { iconArrowRight } from '../icons.js'

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
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px;
          padding-right: 20px;
          padding-left: ${() => this.model.depth * 10 + 20}px;
        }
        .reveal {
          visibility: hidden;
        }
        :host(.link:hover) .reveal {
          visibility: visible;
        }
        slot {
          display: flex;
          align-items: center;
        }
        :host(.h2) {
          justify-content: center;
        }
        :host([slot="header"]) {
          padding-left: ${() => this.model.depth * 10 + 10}px;
        }
        :host(.link) {
          color: #888;
          fill: #888;
          cursor: pointer;
        }
        :host(.top) {
          width: 100%;
          height: 23px;
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          padding: 7px calc(100% - 26px) 0 10px;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          cursor: pointer;
        }
        :host(.link:hover),
        :host(.top:hover) {
          color: #666;
          fill: #666;
          background: #ddd;
        }
      </style>
      <slot></slot>
      ${iconArrowRight({ class: 'reveal' })}
    `)
  }

  connectedCallback () {
    this.model.depth = countContainers(this)
  }
}
