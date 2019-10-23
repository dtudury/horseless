/* global HTMLLIElement */
import { h, render, watchFunction, unwatchFunction } from '../../lib/index.js'
import model from './Model.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27

export default class TodoItem extends HTMLLIElement {
  constructor () {
    super()

    // 'escaped' event handlers bound with arrow notation
    const edit = el => e => this.todo.editing = true
    const toggle = el => e => this.todo.completed = this.querySelector('.toggle').checked
    const selfDestruct = el => e => model.todos.splice(model.todos.indexOf(this.todo), 1)
    const onblur = el => e => {
      this.todo.editing = false
      const label = this.querySelector('.edit').value.trim()
      if (label) {
        this.todo.label = label
      } else {
        selfDestruct(el)(e) // 'unescape' and call event handler
      }
    }
    const onkeydown = el => e => {
      switch (e.keyCode) {
        case ENTER_KEY:
          onblur(el)(e) // 'unescape' and call event handler
          break
        case ESCAPE_KEY:
          this.todo.editing = false
          break
      }
    }

    this.elements = h`
      <div class="view" ondblclick=${edit}>
        <input class="toggle" type="checkbox" onchange=${toggle}/>
        <label>${() => this.todo.label}</label>
        <button class="destroy" onclick=${selfDestruct}></button>
      </div>
      <input class="edit" value=${() => this.todo.label} onblur=${onblur} onkeydown=${onkeydown}/>
    `

    // bound with arrow notation
    this.render = () => render(this, this.elements)
  }
  connectedCallback () {
    watchFunction(this.render)
  }
  disconnectedCallback () {
    unwatchFunction(this.render)
  }
}
