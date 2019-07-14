import model from './Model.js'

const setView = () => {
  model.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

export function addTodo (label) {
  model.todos.push({ label: label.trim(), completed: false })
}

export function destroy (todo) {
  model.todos.splice(model.todos.indexOf(todo), 1)
}

export function clearCompleted () {
  model.todos = model.todos.filter(todo => !todo.completed)
}
