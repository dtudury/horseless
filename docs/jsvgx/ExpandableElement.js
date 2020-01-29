import { h, render, remodel } from '../../lib/index.js'

/* global HTMLElement */
export default class extends HTMLElement {
  constructor () {
    super()
    this.state = remodel({ hidden: false })
    const shadow = this.attachShadow({ mode: 'open' })
    render(shadow, h(this)`
      <style>
        div.container {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        div.top-bar {
          display: flex;
          cursor: pointer;
          align-items: center;
        }
        div.clickable {
          flex: 1;
        }
        div.collapser {
          flex: 0 0 50px;
          text-align: center;
          transition: all 0.2s ease-out;
        }
        div.container:not(.hidden) div.collapser {
          transform: rotate(180deg);
        }
        div.hidden div.expandable {
          display: none;
        }
      </style>
      <div class="container ${this.getClassList}">
        <div class="top-bar" onclick="${this.toggleExpanded}">
          <div class="clickable">
            <slot name="clickable">clickable element goes here</slot>
          </div>
          <div class="collapser">
            <slot name="collapser">
              <svg width="17" height="9" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0.5 0.5 L 8.5 8.5 L 16.5 0.5" fill="none" stroke="black" stroke-width="1"></path>
              </svg>
            </slot>
          </div>
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
