import { proxy } from '/unpkg/horseless/horseless.js'
import { db } from './db.js'
import { WORKING, MAIN, ERROR } from './constants.js'

export const model = window.model = proxy({
  repoList: [],
  page: WORKING
})

let _key
export function setKey (key) {
  _key = key
}

export async function saveRepo (method) {
  model.page = WORKING
  const buffer = await _encryptRepo()
  Object.assign(db().transaction(['repos'], 'readwrite').objectStore('repos')[method](buffer, model.name), {
    onsuccess: e => {
      model.modified = false
      model.page = MAIN
    },
    onerror: e => {
      console.error('error', e)
      model.errorName = 'Save Error'
      model.errorMessage = e.target.error.message
      model.page = ERROR
    }
  })
}

const _encoder = new TextEncoder()
const _ui8ToB64 = ui8 => window.btoa(String.fromCharCode.apply(null, ui8))
async function _encryptRepo () {
  const plaintext = _encoder.encode(JSON.stringify(model.files))
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, _key, plaintext)
  const cleartext = _encoder.encode(JSON.stringify({ iterations: model.iterations, salt: model.salt, iv: _ui8ToB64(iv) }))
  const ui8 = new Uint8Array(cleartext.byteLength + 1 + encrypted.byteLength)
  ui8.set(cleartext)
  ui8[cleartext.byteLength] = 0
  ui8.set(new Uint8Array(encrypted), cleartext.byteLength + 1)
  return ui8.buffer
}
