import { h, render, remodel } from '../../lib/index.js'

/* global HTMLElement */
export default class extends HTMLElement {
  constructor () {
    super()
    this.state = remodel({ hidden: true })
    const shadow = this.attachShadow({ mode: 'open' })
    render(shadow, h(this)`
      <style>
        div.container {
          display: grid;
          overflow: hidden;
          grid-template-rows: min-content 1fr;
          grid-template-columns: 1fr 50px;
        }
        div.collapser {
          text-align: center;
          transition: all 0.2s ease-out;
        }
        div:not(.hidden) div.collapser {
          transform: rotate(180deg);
        }
        div.expandable {
          grid-column: 1/3;
          overflow: hidden;
        }
        div.hidden div.expandable {
          display: none;
        }
      </style>
      <div class="container ${this.getClassList}">
        <slot name="clickable" onclick="${this.toggleExpanded}">clickable element goes here</slot>
        <div class="collapser">
          <slot name="collapser">
            <svg width="17" height="9" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0.5 0.5 L 8.5 8.5 L 16.5 0.5" fill="none" stroke="black" stroke-width="1"></path>
            </svg>
          </slot>
        </div>
        <div class="expandable">
          <slot name="expandable">expandable element goes here</slot>
        </div>
      </div>
    `)
  }

  getClassList () {
    return this.state.hidden ? 'hidden' : ''
  }

  toggleExpanded (el) {
    return e => {
      this.state.hidden = !this.state.hidden
      e.stopPropagation()
      return false
    }
  }
}
