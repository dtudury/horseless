import { h, render, showIfElse, mapEntries, proxy, after, watchFunction } from '/unpkg/horseless/horseless.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const model = window.model = proxy({
  todos: JSON.parse(window.localStorage.getItem('todos-horseless') || 'false') || [
    { label: 'Taste Javascript', completed: false },
    { label: 'Buy a unicorn', completed: false }
  ]
})

// persist model
watchFunction(() => {
  window.localStorage.setItem('todos-horseless', JSON.stringify(model.todos))
})

// routing
const setView = () => {
  model.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

// event -> model
const newTodoChange = el => e => {
  model.todos.push({ label: e.target.value.trim(), completed: false })
  e.target.value = ''
}
const clearCompleted = el => e => {
  model.todos = model.todos.filter(todo => !todo.completed)
}
const toggleAll = el => e => {
  const completed = !!incompletedCount()
  model.todos.forEach(todo => { todo.completed = completed })
}

// model -> view
function selected (el) {
  return (el && el.hash === model.hash) ? 'selected' : ''
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
function isToggleAllChecked () {
  return incompletedCount() === 0
}
function hasTodos () {
  return model.todos.length
}
function isPartiallyCompleted () {
  return model.todos.some(todo => todo.completed)
}
function todoBuilder (todo) {
  // event -> model
  const editLabel = el => e => { todo.editing = true }
  const toggleComplete = el => e => { todo.completed = !todo.completed }
  const selfDestruct = el => e => model.todos.splice(model.todos.indexOf(todo), 1)
  const completeEdit = el => e => {
    todo.editing = false
    const label = el.value.trim()
    if (label) {
      todo.label = label
    } else {
      selfDestruct(el)(e) // 'unescape' and call event handler
    }
  }
  const handleEdit = el => e => {
    switch (e.keyCode) {
      case ENTER_KEY:
        completeEdit(el)(e) // 'unescape' and call event handler
        break
      case ESCAPE_KEY:
        todo.editing = false
        break
    }
  }
  // model -> view
  function isComplete () {
    return todo.completed
  }
  function label () {
    return todo.label
  }
  function completedAndOrEditing (el) {
    const classes = []
    if (todo.completed) {
      classes.push('completed')
    }
    if (todo.editing) {
      after(() => { el.querySelector('.edit').focus() })
      classes.push('editing')
    }
    if (classes.length) {
      return { class: classes.join(' ') }
    }
  }

  // todo view
  return h`
    <li ${completedAndOrEditing}>
      <div class="view" ondblclick=${editLabel}>
        <input class="toggle" type="checkbox" checked=${isComplete} onchange=${toggleComplete}/>
        <label>${label}</label>
        <button class="destroy" onclick=${selfDestruct}></button>
      </div>
      <input class="edit" value=${label} onblur=${completeEdit} onkeydown=${handleEdit}/>
    </li>
  `
}

// app view
render(document.body, h`
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" onchange=${newTodoChange} placeholder="What needs to be done?" autofocus=""/>
    </header>
    ${showIfElse(hasTodos, h`
      <section class="main">
        <input id="toggle-all" class="toggle-all" onchange=${toggleAll} type="checkbox" checked=${isToggleAllChecked}/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          ${mapEntries(visibleTodosList, todoBuilder)}
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
        ${showIfElse(isPartiallyCompleted, h`
          <button class="clear-completed" onclick=${clearCompleted}>Clear completed</button>
        `)}
      </footer>
    `)}
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="https://github.com/dtudury/horseless">David</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
`)
