/* global HTMLLIElement */
import { model } from '../Model'
import { destroy } from '../controller'
import h, { setChildren } from '../../../lib'
const ENTER_KEY = 13
const ESCAPE_KEY = 27

export default class TodoItem extends HTMLLIElement {
  constructor () {
    super()
    this._update = this.update.bind(this)
    this.elements = h`<div class="view" ondblclick=${this.edit.bind(this)}>
      <input class="toggle" type="checkbox" onchange=${this.toggle.bind(this)}/>
      <label/>
      <button class="destroy" onclick=${this.destroy.bind(this)}></button>
    </div>
    <input class="edit" onblur=${this.editBlur.bind(this)} onkeydown=${this.editKeyDown.bind(this)}/>`
  }
  update () {
    setChildren(this, this.elements)
    this.querySelector('label').innerText = this.todo.label
    this.querySelector('.edit').value = this.todo.label
    if (this.todo.completed) {
      this.classList.add('completed')
    } else {
      this.classList.remove('completed')
    }
  }
  edit () {
    this.classList.add('editing')
    this.querySelector('.edit').focus()
  }
  toggle () {
    this.todo.completed = this.querySelector('.toggle').checked
  }
  destroy () {
    destroy(this.todo)
  }
  editBlur () {
    this.classList.remove('editing')
    const label = this.querySelector('.edit').value.trim()
    if (!label) {
      this.destroy()
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
    this.update()
    model.watch(this.todo, this._update)
  }
  disconnectedCallback () {
    model.unwatch(this.todo, this._update)
  }
}
