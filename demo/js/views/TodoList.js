/* global customElements HTMLUListElement */
import model from '../Model'
import h, { setChildren } from '../../../lib'
import TodoItem from './TodoItem'
import { watchFunction, unwatchFunction } from '../../../lib/functionWatcher'

customElements.define('todo-item', TodoItem, { extends: 'li' })

export default class TodoList extends HTMLUListElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
    this.todosMap = new Map()
  }
  update () {
    setChildren(this, model.todos
      .filter(todo => {
        switch (model.hash) {
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
    watchFunction(this._update)
  }
  disconnectedCallback () {
    unwatchFunction(this._update)
  }
}
