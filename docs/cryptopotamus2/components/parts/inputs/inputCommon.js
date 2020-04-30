import { h } from '/unpkg/horseless/horseless.js'
import { Containable } from '../containable.js'
import { OCTICON } from '../../tags.js'

export const inputStyle = () => h`
  <style>
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3px;
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
    ${OCTICON} {
      width: 16px;
    }
  </style>
`

export class InputCommon extends Containable {
  constructor () {
    super()
    this.styleElement = () => h`
      ${inputStyle}
      <style>
        :host {
          padding-left: ${this.model.depth * 0.5 + 1}rem;
        }
      </style>
    `
  }

  get value () {
    return this.shadowRoot.querySelector('input').value
  }

  set value (value) {
    this.shadowRoot.querySelector('input').value = value
  }
}
