import { h, render } from '/unpkg/horseless/horseless.js'
import { InputCommon } from './inputCommon.js'
import { OCTICON } from '../../tags.js'

export function definePassphrase (name) {
  window.customElements.define(name, Passphrase)
  return name
}

class Passphrase extends InputCommon {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      ${this.styleElement}
      <label for="passphrase">Passphrase:</label>
      <input type="password" id="passphrase" name="passphrase" autofocus>
      <${OCTICON} key/>
    `)
  }
}
