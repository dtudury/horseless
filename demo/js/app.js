/* global customElements */
import { h } from '../../lib'
import TodoItem from './views/TodoItem'
import model from './Model'
import { clearCompleted, addTodo } from './controller'

customElements.define('todo-item', TodoItem, { extends: 'li' })

const filterButtonClass = el => (model.hash === el.hash) ? 'selected' : ''
const itemsLeft = () => model.todos.filter(todo => !todo.completed).length.toString()
const visibleTodos = () => model.todos.filter(todo => model.hash === '#/active' ? !todo.completed : model.hash === '/#completed' ? todo.completed : true)
let mainElements
const showIfTodos = f => el => {
  mainElements = mainElements || f()
  return model.todos.length ? mainElements : []
}
const todosMap = new Map()
const memoizeTodos = f => el => {
  return visibleTodos().map(todo => {
    if (!todosMap.has(todo)) {
      todosMap.set(todo, f(todo))
    }
    return todosMap.get(todo)
  })
}

h(document.body)`
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" onchange=${e => { addTodo(e.target.value); e.target.value = '' }} placeholder="What needs to be done?" autofocus=""/>
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
        <span class="todo-count"><strong>${itemsLeft}</strong> item${() => itemsLeft() === '1' ? '' : 's'} left</span>
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
`
