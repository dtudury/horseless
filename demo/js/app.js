/* global customElements */
import h, { setChildren } from '../../lib'
import TodoList from './views/TodoList'
import model from './Model'
import { clearCompleted, addTodo } from './controller'
import { watchFunction } from '../../lib/functionWatcher'

customElements.define('todo-list', TodoList, { extends: 'ul' })

const todoApp = h`<section class="todoapp"></section>`[0]

const filterButtonClass = el => (model.hash === el.hash) ? 'selected' : ''
const itemsLeft = () => model.todos.filter(todo => !todo.completed).length

setChildren(document.body, h`
  ${todoApp}
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="http://todomvc.com">you</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
`)

const header = h`<header class="header">
  <h1>todos</h1>
  <input class="new-todo" onchange=${e => { addTodo(e.target.value); e.target.value = '' }} placeholder="What needs to be done?" autofocus=""/>
</header>`

const main = h`<section class="main">
  <input id="toggle-all" class="toggle-all" type="checkbox"/>
  <label for="toggle-all">Mark all as complete</label>
  <ul is="todo-list" class="todo-list">
  </ul>
</section>`

const footer = h`<footer class="footer">
  <span class="todo-count"><strong>${() => '' + itemsLeft()}</strong> item${() => itemsLeft() === 1 ? '' : 's'} left</span>
  <ul class="filters">
    <li>
      <a class=${filterButtonClass}href="#/">All</a>
    </li>
    <li>
      <a class=${filterButtonClass} href="#/active">Active</a>
    </li>
    <li>
      <a class=${filterButtonClass} href="#/completed">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" onclick=${clearCompleted}>Clear completed</button>
</footer>`

function update () {
  setChildren(todoApp, model.todos.length ? [header, main, footer] : [header])
}

watchFunction(update)

update()
