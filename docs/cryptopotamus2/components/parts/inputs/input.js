import { h, render } from '/unpkg/horseless/horseless.js'
import { inputStyle } from './inputCommon.js'

export function defineInput (name) {
  window.customElements.define(name, Input)
  return name
}

const eatOnclick = el => e => {
  e.stopPropagation()
}

class Input extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    render(this.shadowRoot, h`
      ${inputStyle}
      <style>
        :host(:hover) {
          background: unset;
        }
      </style>
      <input type="text" onclick=${eatOnclick}>
    `)
  }

  get value () {
    return this.shadowRoot.querySelector('input').value
  }

  set value (value) {
    this.shadowRoot.querySelector('input').value = value
  }
}
