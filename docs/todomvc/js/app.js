/* global customElements */

import { h, render, showIf, mapList } from '../../lib/index.js'
import TodoItem from './TodoItem.js'
import model from './Model.js'

function addTodo (label) {
  model.todos.push({ label: label.trim(), completed: false })
}
function destroy (todo) {
  model.todos.splice(model.todos.indexOf(todo), 1)
}
function clearCompleted () {
  model.todos = model.todos.filter(todo => !todo.completed)
}
function onNewTodoChange (e) {
  addTodo(e.target.value)
  e.target.value = ''
}
function selected (el) {
  return (model.hash === el.hash) ? 'selected' : ''
}
function completed (el) {
  return (el && el.todo && el.todo.completed) ? 'completed' : ''
}
function editing (el) {
  return (el && el.todo && el.todo.editing) ? 'editing' : ''
}
function editingCallback(el) {
  if (el.classList.contains('editing')) {
    // el is display:none until after .editing is set (so we can't set focus until the DOM updates)
    el.querySelector('.edit').focus()
  }
}
function itemsLeft () {
  return model.todos.filter(todo => !todo.completed).length.toString()
}
function sIfPlural () {
  return itemsLeft() === '1' ? '' : 's'
}
function visibleTodos () {
  return model.todos.filter(todo => model.hash === '#/active' ? !todo.completed : model.hash === '#/completed' ? todo.completed : true)
}

const setView = () => {
  model.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

customElements.define('todo-item', TodoItem, { extends: 'li' })

addTodo('Taste JavaScript')
addTodo('Buy a unicorn')

render(document.body, h`
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" onchange=${() => onNewTodoChange} placeholder="What needs to be done?" autofocus=""/>
    </header>
    ${showIf(() => model.todos.length, () => h`
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox"/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
        ${mapList(visibleTodos, todo => h`
          <li is="todo-item" todo=${todo} class="${completed} ${editing}" __callback__class=${editingCallback}/>
        `)}
        </ul>
      </section>
      <footer class="footer">
        <span class="todo-count"><strong>${itemsLeft}</strong> item${sIfPlural} left</span>
        <ul class="filters">
          <li>
            <a class="${selected}" href="#/">All</a>
          </li>
          <li>
            <a class="${selected}" href="#/active">Active</a>
          </li>
          <li>
            <a class="${selected}" href="#/completed">Completed</a>
          </li>
        </ul>
        <button class="clear-completed" onclick=${() => clearCompleted}>Clear completed</button>
      </footer>
    `)}
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="http://todomvc.com">you</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
`)
