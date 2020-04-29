import { proxy } from '/unpkg/horseless/horseless.js'
import { screens } from './constants.js'

export const model = proxy({
  state: { screen: screens.LOADING }
})

let _key
export function setKey (key) {
  _key = key
  console.log(_key)
}
export function getKey () {
  return _key
}
