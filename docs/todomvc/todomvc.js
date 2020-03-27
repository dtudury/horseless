import { h, render, mapConditional, mapEntries, proxy, after } from '/unpkg/horseless/horseless.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const model = window.model = proxy({
  todos: [
    { label: 'Taste Javascript', completed: false },
    { label: 'Buy a unicorn', completed: false }
  ]
})

// event handlers
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

// model transformations
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

// routing
const setView = () => {
  model.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

render(document.body, h`
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" onchange=${newTodoChange} placeholder="What needs to be done?" autofocus=""/>
    </header>
    ${mapConditional(() => model.todos.length, h`
      <section class="main">
        <input id="toggle-all" class="toggle-all" onchange=${toggleAll} type="checkbox" checked=${() => incompletedCount() === 0}/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          ${ /* eslint-disable indent */
            mapEntries(visibleTodosList, todo => {
              // event handlers
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
              const handleEditKeyDown = el => e => {
                switch (e.keyCode) {
                  case ENTER_KEY:
                    completeEdit(el)(e) // 'unescape' and call event handler
                    break
                  case ESCAPE_KEY:
                    todo.editing = false
                    break
                }
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

              return h`
                <li ${completedAndOrEditing}>
                  <div class="view" ondblclick=${editLabel}>
                    <input class="toggle" type="checkbox" checked=${() => todo.completed} onchange=${toggleComplete}/>
                    <label>${() => todo.label}</label>
                    <button class="destroy" onclick=${selfDestruct}></button>
                  </div>
                  <input class="edit" value=${() => todo.label} onblur=${completeEdit} onkeydown=${handleEditKeyDown}/>
                </li>
              `
            })
          /* eslint-enable indent */ }
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
        ${mapConditional(() => model.todos.some(todo => todo.completed), h`
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
