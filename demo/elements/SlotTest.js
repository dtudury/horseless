/* global HTMLElement */
import horsy from '../../lib'
import { setChildren } from '../../lib/nodeCreators'

export default class SlotTest extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.paragraph = horsy`<p>
      This is a slot: <slot name='test'>boring text</slot><br />
      If there's something other than 'boring text" then it's working
    </p>`
  }
  update () {
    if (!this.config) {
      return
    }
    const style = horsy`<style>
      p {
        color: ${this.config.color};
        background: ${this.config.background};
        animation: bounce 1s ease-in-out 3;
      }
      @keyframes bounce {
        0% { color: ${this.config.color}; background: ${this.config.background}}
        50% { color: ${this.config.background}; background: ${this.config.color}}
        100% { color: ${this.config.color}; background: ${this.config.background}}
      }
    </style>`
    setChildren(this.shadow, [style, this.paragraph])
  }
  setAttributes (attributes) {
    Object.assign(this, attributes)
    this.update()
  }
}
