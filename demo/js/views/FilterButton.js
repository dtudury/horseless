/* global HTMLAnchorElement */
import { model, root } from '../Model'

export default class CustomizedTest extends HTMLAnchorElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
  }
  update () {
    if (root.hash === this.hash) {
      this.classList.add('selected')
    } else {
      this.classList.remove('selected')
    }
  }
  connectedCallback () {
    this.update()
    model.watch(root, this._update, 'hash')
  }
  disconnectedCallback () {
    model.unwatch(root, this._update, 'hash')
  }
}
