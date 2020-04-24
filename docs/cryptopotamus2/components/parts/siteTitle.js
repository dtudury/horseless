import { h, render } from '/unpkg/horseless/horseless.js'

export function defineSiteTitle (name) {
  window.customElements.define(name, SiteTitle)
  return name
}

class SiteTitle extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          display: block;
          padding: 1rem;
          font-size: 2rem;
          font-weight: 900;
          text-align: center;
          background-color: #444;
          color: transparent;
          letter-spacing: .5em;
          text-shadow: 0.1rem -0.1rem 0.3rem #aaa;
          background-clip: text;
          -webkit-background-clip: text;
          -moz-background-clip: text;
          user-select: none;
        }
      </style>
      <slot/>
    `)
  }
}
