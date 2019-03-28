
import { model, root } from './Model'

const setView = () => {
  root.hash = document.location.hash || '#/'
}
window.addEventListener('load', setView)
window.addEventListener('hashchange', setView)

export function addTodo (label) {
  root.todos.push(model.watchify({ label, completed: false }))
}

addTodo('Taste JavaScript')
addTodo('Buy a unicorn')
