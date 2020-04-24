import { h, render } from '/unpkg/horseless/horseless.js'
import { Containable } from './containable.js'
import { OCTICON } from '../tags.js'
import { model } from '../../model.js'

export function definePassphrase (name) {
  window.customElements.define(name, Passphrase)
  return name
}

const oninput = el => e => {
  model.state.passphrase = e.target.value
}

class Passphrase extends Containable {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: ${() => this.model.depth * 0.5 + 1}rem;
          padding-right: 1.5rem;
        }
        :host(:hover) {
          background: #00000010;
          border-color: #bbb;
          color: #666;
          fill: #666;
        }
        input {
          flex: 1 0;
          border: none;
          background: #bbb;
          padding: 0 0.5em;
          margin: 0 0.5em;
          outline: 1px solid #aaa;
          color: inherit;
        }
        :host(:hover) input {
          outline: 1px solid #666;
          background: none;
        }
        :host input:focus {
          outline: 1px solid #888;
          outline-offset: 0;
          background: #bbb;
          color: #666;
        }
        :host(:hover) input:focus {
          outline: 1px solid #666;
        }
      </style>
      <label for="passphrase">Passphrase:</label>
      <input type="password" id="passphrase" name="passphrase" value=${() => model.state.passphrase} oninput=${oninput}>
      <${OCTICON} key/>
    `)
  }
}
