import { addTodo } from './controller.js'
import model from './Model.js'

export function onNewTodoChange (e) {
  addTodo(e.target.value)
  e.target.value = ''
}

export function filterButtonClass (el) {
  return (model.hash === el.hash) ? 'selected' : ''
}

export function itemsLeft () {
  return model.todos.filter(todo => !todo.completed).length.toString()
}

export function sIfPlural () {
  return itemsLeft() === '1' ? '' : 's'
}

export function visibleTodos () {
  return model.todos.filter(todo => model.hash === '#/active' ? !todo.completed : model.hash === '#/completed' ? todo.completed : true)
}

let _mainElements
export function showIfTodos (f) {
  return () => {
    _mainElements = _mainElements || f()
    return model.todos.length ? _mainElements : []
  }
}

const _todosMap = new Map()
export function memoizeTodos (f) {
  return () => {
    return visibleTodos().map(todo => {
      if (!_todosMap.has(todo)) {
        _todosMap.set(todo, f(todo))
      }
      return _todosMap.get(todo)
    })
  }
}
