/* global customElements */

import { h, render, showIf, mapList } from '../../lib/index.js'
import TodoItem from './TodoItem.js'
import model from './Model.js'

// event handlers
const newTodoChange = el => e => {
  model.todos.push({ label: e.target.value.trim(), completed: false })
  e.target.value = ''
}
const clearCompleted = el => e => {
  model.todos = model.todos.filter(todo => !todo.completed)
}

// model transformations
function selected (el) {
  return (model.hash === el.hash) ? 'selected' : ''
}
function completed (el) {
  return (el && el.todo && el.todo.completed) ? 'completed' : ''
}
function editing (el) {
  return (el && el.todo && el.todo.editing) ? 'editing' : ''
}
function classCallback(el) {
  if (el.classList.contains('editing')) {
    // el is display:none unless .editing is set (so we can't set focus until after)
    el.querySelector('.edit').focus()
  }
}
function incompletedCount () {
  return model.todos.filter(todo => !todo.completed).length
}
function s () {
  return incompletedCount() === 1 ? '' : 's'
}
function visibleTodosList () {
  return model.todos.filter(todo => model.hash === '#/active' ? !todo.completed : model.hash === '#/completed' ? todo.completed : true)
}

const setView = () => {
  model.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

customElements.define('todo-item', TodoItem, { extends: 'li' })

render(document.body, h`
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" onchange=${newTodoChange} placeholder="What needs to be done?" autofocus=""/>
    </header>
    ${showIf(() => model.todos.length, () => h`
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox"/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
        ${mapList(visibleTodosList, todo => h`
          <li is="todo-item" todo=${todo} class="${completed} ${editing}" __callback__class=${classCallback}/>
        `)}
        </ul>
      </section>
      <footer class="footer">
        <span class="todo-count"><strong>${incompletedCount}</strong> item${s} left</span>
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
        <button class="clear-completed" onclick=${clearCompleted}>Clear completed</button>
      </footer>
    `)}
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="http://todomvc.com">you</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
`)
