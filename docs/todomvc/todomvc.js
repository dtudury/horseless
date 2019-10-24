import { h, render, showIf, mapList, remodel } from '../lib/index.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const model = window.model = remodel({
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

// model transformations
function selected (el) {
  return (model.hash === el.hash) ? 'selected' : ''
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
    ${showIf(() => model.todos.length, () => h`
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox"/>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          ${ /* eslint-disable indent */
            mapList(visibleTodosList, todo => {
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

              // model transformations
              function completed (el) {
                return todo.completed ? 'completed' : ''
              }
              function editing (el) {
                return todo.editing ? 'editing' : ''
              }

              // callback
              function classCallback (el) {
                // actual input is display:none unless .editing is set (so we can't set focus until after)
                if (el.classList.contains('editing')) {
                  el.querySelector('.edit').focus()
                }
              }

              return h`
                <li class="${completed} ${editing}" __callback__class=${classCallback}>
                  <div class="view" ondblclick=${editLabel}>
                    <input class="toggle" type="checkbox" onchange=${toggleComplete}/>
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
