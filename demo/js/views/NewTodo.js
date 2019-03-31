/* global HTMLInputElement */
import { addTodo } from '../controller'

export default class NewTodo extends HTMLInputElement {
  constructor () {
    super()
    this.addEventListener('change', this)
  }
  handleEvent (e) {
    this['on' + e.type](e)
  }
  onchange (e) {
    addTodo(this.value.trim())
    this.value = ''
  }
}
