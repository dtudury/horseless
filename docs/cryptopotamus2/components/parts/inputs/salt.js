import { h, render } from '/unpkg/horseless/horseless.js'
import { InputCommon } from './inputCommon.js'
import { OCTICON } from '../../tags.js'
import { model } from '../../../model.js'

export function defineSalt (name) {
  window.customElements.define(name, Salt)
  return name
}

class Salt extends InputCommon {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      ${this.styleElement}
      <label for="salt">Salt:</label>
      <input type="text" id="salt" name="salt" value=${() => model.state.salt}>
      <${OCTICON} north-star/>
    `)
  }
}
