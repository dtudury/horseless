/* global HTMLAnchorElement */
import model from '../Model'
import { watchFunction } from '../../../lib/functionWatcher'

export default class FilterButton extends HTMLAnchorElement {
  constructor () {
    super()
    watchFunction(this.update.bind(this))
  }
  update () {
    if (model.hash === this.hash) {
      this.classList.add('selected')
    } else {
      this.classList.remove('selected')
    }
  }
}
