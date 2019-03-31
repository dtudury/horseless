/* global HTMLButtonElement */
import { clearCompleted } from '../controller'

export default class ClearCompleted extends HTMLButtonElement {
  constructor () {
    super()
    this.addEventListener('click', this)
  }
  handleEvent (e) {
    this['on' + e.type](e)
  }
  onclick (e) {
    clearCompleted()
  }
}
