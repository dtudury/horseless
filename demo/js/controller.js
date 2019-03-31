
import { model, root } from './Model'

const setView = () => {
  root.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

export function addTodo (label) {
  root.todos.push(model.watchify({ label, completed: false }))
}

export function destroy (todo) {
  root.todos.splice(root.todos.indexOf(todo), 1)
}

export function clearCompleted () {
  root.todos = root.todos.filter(todo => !todo.completed)
}

addTodo('Taste JavaScript')
addTodo('Buy a unicorn')
