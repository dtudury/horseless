import { proxy } from '/unpkg/horseless/horseless.js'
import { screens } from './constants.js'

export const model = proxy({
  state: { screen: screens.LOADING },
  keySet: 0
})

let _key
export function setKey (key) {
  if (_key !== key) {
    _key = key
    model.keySet++
  }
}
export function getKey () {
  if (model.keySet) return _key
}
