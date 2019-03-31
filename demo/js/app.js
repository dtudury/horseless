/* global customElements */
import h, { setChildren } from '../../lib'
import NewTodo from './views/NewTodo'
import TodoList from './views/TodoList'
import TodoCount from './views/TodoCount'
import FilterButton from './views/FilterButton'
import ClearCompleted from './views/ClearCompleted'
import { model, root } from './Model'
import './controller'

customElements.define('new-todo', NewTodo, { extends: 'input' })
customElements.define('todo-list', TodoList, { extends: 'ul' })
customElements.define('todo-count', TodoCount, { extends: 'span' })
customElements.define('filter-button', FilterButton, { extends: 'a' })
customElements.define('clear-completed', ClearCompleted, { extends: 'button' })

const todoApp = h`<section class="todoapp"/>`[0]

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
  <input is="new-todo" class="new-todo" placeholder="What needs to be done?" autofocus=""/>
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
      <a is="filter-button" href="#/">All</a>
    </li>
    <li>
      <a is="filter-button" href="#/active">Active</a>
    </li>
    <li>
      <a is="filter-button" href="#/completed">Completed</a>
    </li>
  </ul>
  <button is="clear-completed" class="clear-completed">Clear completed</button>
</footer>`

function update () {
  setChildren(todoApp, root.todos.length ? [header, main, footer] : [header])
}

model.watchAll(update)
update()
