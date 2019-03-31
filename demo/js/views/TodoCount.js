/* global HTMLSpanElement */
import { model, root } from '../Model'
import h, { setChildren } from '../../../lib'

export default class TodoCount extends HTMLSpanElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
  }
  update (e) {
    const itemsLeft = root.todos.filter(todo => !todo.completed).length
    setChildren(this, h`<strong>${'' + itemsLeft}</strong> item${itemsLeft === 1 ? '' : 's'} left`)
  }
  connectedCallback () {
    this.update()
    model.watchAll(this._update)
  }
  disconnectedCallback () {
    model.unwatchAll(this._update)
  }
}
