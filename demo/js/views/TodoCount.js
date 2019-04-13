/* global HTMLSpanElement */
import model from '../Model'
import h, { setChildren } from '../../../lib'
import { watchFunction, unwatchFunction } from '../../../lib/functionWatcher'

export default class TodoCount extends HTMLSpanElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
  }
  update (e) {
    const itemsLeft = model.todos.filter(todo => !todo.completed).length
    setChildren(this, h`<strong>${'' + itemsLeft}</strong> item${itemsLeft === 1 ? '' : 's'} left`)
  }
  connectedCallback () {
    watchFunction(this._update)
  }
  disconnectedCallback () {
    unwatchFunction(this._update)
  }
}
