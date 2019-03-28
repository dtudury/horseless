/* global HTMLUListElement */
import { model, root } from '../Model'
import h, { setChildren } from '../../../lib'

export default class CustomizedTest extends HTMLUListElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
    this.todosMap = new Map()
  }
  update () {
    setChildren(this, root.todos.map(todo => {
      if (!this.todosMap.has(todo)) {
        this.todosMap.set(todo, h`
          <li>
            <div class="view">
              <input class="toggle" type="checkbox"/>
              <label>${todo.label}</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value="Rule the web"/>
          </li>
        `)
      }
      return this.todosMap.get(todo)
    }))
  }
  connectedCallback () {
    this.update()
    model.watch(root, this._update, 'todos')
  }
  disconnectedCallback () {
    model.unwatch(root, this._update, 'todos')
  }
}
