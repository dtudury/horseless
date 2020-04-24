import { model } from '../model.js'
import { screens } from '../constants.js'

export function gotoNewRepository () {
  let salt = ''
  while (salt.length < 32) {
    salt += [...window.crypto.getRandomValues(new Uint8Array(32))].filter(v => v % 128 >= 32).map(v => String.fromCharCode(v % 128)).join('')
  }
  model.state = {
    screen: screens.NEW_REPO,
    passphrase: '',
    salt: salt.substring(0, 32),
    iterations: 25000
  }
}
