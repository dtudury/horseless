/* global customElements */
import h, { setChildren } from '../../lib'
import TodoList from './views/TodoList'
import TodoCount from './views/TodoCount'
import model from './Model'
import { clearCompleted, addTodo } from './controller'
import { watchFunction } from '../../lib/functionWatcher'

customElements.define('todo-list', TodoList, { extends: 'ul' })
customElements.define('todo-count', TodoCount, { extends: 'span' })

const todoApp = h`<section class="todoapp"></section>`[0]

const filterButtonClassUpdater = el => (model.hash === el.hash) ? 'selected' : ''

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
  <span is="todo-count" class="todo-count" />
  <ul class="filters">
    <li>
      <a class=${filterButtonClassUpdater}href="#/">All</a>
    </li>
    <li>
      <a class=${filterButtonClassUpdater} href="#/active">Active</a>
    </li>
    <li>
      <a class=${filterButtonClassUpdater} href="#/completed">Completed</a>
    </li>
  </ul>
  <button class="clear-completed" onclick=${clearCompleted}>Clear completed</button>
</footer>`

function update () {
  setChildren(todoApp, model.todos.length ? [header, main, footer] : [header])
}

watchFunction(update)

update()
