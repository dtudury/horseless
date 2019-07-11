/* global HTMLLIElement */
import { destroy } from '../controller.js'
import { h, setChildren, watchFunction, unwatchFunction } from '//unpkg.com/horseless/dist/horseless.esm.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27

export default class TodoItem extends HTMLLIElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
    this.elements = h`<div class="view" ondblclick=${this.edit.bind(this)}>
      <input class="toggle" type="checkbox" onchange=${this.toggle.bind(this)}/>
      <label>${() => this.todo.label}</label>
      <button class="destroy" onclick=${() => destroy(this.todo)}></button>
    </div>
    <input class="edit" value=${() => this.todo.label} onblur=${this.editBlur.bind(this)} onkeydown=${this.editKeyDown.bind(this)}/>`
  }
  update () {
    setChildren(this, this.elements)
    if (this.todo.completed) {
      this.classList.add('completed')
    } else {
      this.classList.remove('completed')
    }
  }
  edit (e) {
    this.todo.editing = true
    this.classList.add('editing')
    this.querySelector('.edit').focus()
  }
  toggle () {
    this.todo.completed = this.querySelector('.toggle').checked
  }
  editBlur (e) {
    this.todo.editing = false
    this.classList.remove('editing')
    const label = this.querySelector('.edit').value.trim()
    if (!label) {
      destroy(this.todo)
    } else {
      this.todo.label = label
    }
  }
  editKeyDown (e) {
    if (e.keyCode === ENTER_KEY) {
      this.editBlur()
    } else if (e.keyCode === ESCAPE_KEY) {
      this.classList.remove('editing')
      this.update()
    }
  }
  connectedCallback () {
    watchFunction(this._update)
  }
  disconnectedCallback () {
    unwatchFunction(this._update)
  }
}
