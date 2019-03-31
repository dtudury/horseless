/* global HTMLAnchorElement */
import { model, root } from '../Model'

export default class FilterButton extends HTMLAnchorElement {
  constructor () {
    super()
    model.watch(root, this.update.bind(this), 'hash')
  }
  update () {
    if (root.hash === this.hash) {
      this.classList.add('selected')
    } else {
      this.classList.remove('selected')
    }
  }
}
