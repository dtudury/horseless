import { h, render } from '/unpkg/horseless/horseless.js'
import { InputCommon } from './inputCommon.js'
import { OCTICON } from '../../tags.js'
import { model } from '../../../model.js'

export function defineIterations (name) {
  window.customElements.define(name, Iterations)
  return name
}

class Iterations extends InputCommon {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.shadowRoot, h`
      ${this.styleElement}
      <label for="iterations">Iterations:</label>
      <input type="number" id="iterations" name="iterations" value=${() => model.state.iterations}>
      <${OCTICON} shield/>
    `)
  }
}
