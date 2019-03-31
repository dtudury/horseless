/* global customElements HTMLUListElement */
import { model, root } from '../Model'
import h, { setChildren } from '../../../lib'
import TodoItem from './TodoItem'

customElements.define('todo-item', TodoItem, { extends: 'li' })

export default class TodoList extends HTMLUListElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
    this.todosMap = new Map()
  }
  update () {
    setChildren(this, root.todos
      .filter(todo => {
        switch (root.hash) {
          case '#/active':
            return !todo.completed
          case '#/completed':
            return todo.completed
          default:
            return true
        }
      })
      .map(todo => {
        if (!this.todosMap.has(todo)) {
          this.todosMap.set(todo, h`<li is="todo-item" todo=${todo}/>`)
        }
        return this.todosMap.get(todo)
      }))
  }
  connectedCallback () {
    this.update()
    model.watchAll(this._update)
  }
  disconnectedCallback () {
    model.unwatchAll(this._update)
  }
}
