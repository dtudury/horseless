import { model } from './model.js'
import { REPO_SELECT, ERROR } from './constants.js'

let _db

Object.assign(window.indexedDB.open('crptptms'), {
  onupgradeneeded: function (event) {
    _db = event.target.result
    _db.createObjectStore('repos')
  },
  onsuccess: function (event) {
    _db = event.target.result
    Object.assign(_db.transaction(['repos']).objectStore('repos').getAllKeys(), {
      onsuccess: function (event) {
        model.repoList = event.target.result
        model.page = REPO_SELECT
      }
    })
  },
  onerror: function (event) {
    console.error(event)
    model.page = ERROR
    model.errorName = 'Database Error'
    model.errorMessage = 'Error opening database'
  }
})

export function db () {
  return _db
}
