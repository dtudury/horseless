/* global customElements */

import { h, render } from '../../lib/index.js'
import TodoItem from './views/TodoItem.js'
import { clearCompleted, addTodo } from './controller.js'
import { onNewTodoChange, showIfTodos, memoizeTodos, itemsLeft, sIfPlural, filterButtonClass } from './display.js'

customElements.define('todo-item', TodoItem, { extends: 'li' })

addTodo('Taste JavaScript')
addTodo('Buy a unicorn')

render(document.body, h`
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" onchange=${onNewTodoChange} placeholder="What needs to be done?" autofocus=""/>
    </header>
    ${showIfTodos(() => h`
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox"/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
        ${memoizeTodos(todo => h`
          <li is="todo-item" todo=${todo}/>
        `)}
        </ul>
      </section>
      <footer class="footer">
        <span class="todo-count"><strong>${itemsLeft}</strong> item${sIfPlural} left</span>
        <ul class="filters">
          <li>
            <a class=${filterButtonClass} href="#/">All</a>
          </li>
          <li>
            <a class=${filterButtonClass} href="#/active">Active</a>
          </li>
          <li>
            <a class=${filterButtonClass} href="#/completed">Completed</a>
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
