import { proxy } from '/unpkg/horseless/horseless.js'
import { WORKING } from './constants.js'

export const model = window.model = proxy({
  repoList: [],
  page: WORKING
})

let _key
export function setKey (key) {
  _key = key
}
export function getKey () {
  return _key
}
