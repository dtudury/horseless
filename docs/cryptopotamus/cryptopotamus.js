/* global atob btoa */
import { h, render, proxy, mapEntries, showIfElse } from '/unpkg/horseless/horseless.js'
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const b64ToUi8 = b64 => new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)))
const ui8ToB64 = ui8 => btoa(String.fromCharCode.apply(null, ui8))
const WORKING = 'working'
const REPO_SELECT = 'repo-select'
const CREATE_NEW_REPO = 'create-new-repo'
const MAIN = 'main'
const SAVE_AS = 'save-as'
const DECRYPT = 'decrypt'
const ERROR = 'error'
let db
let key
let salt
let iterations

const model = window.model = proxy({
  page: WORKING
})

Object.assign(window.indexedDB.open('crptptms'), {
  onupgradeneeded: function (event) {
    db = event.target.result
    db.createObjectStore('repos')
  },
  onsuccess: function (event) {
    db = event.target.result
    Object.assign(db.transaction(['repos']).objectStore('repos').getAllKeys(), {
      onsuccess: function (event) {
        model.data = event.target.result
        model.repoList = event.target.result
        if (model.repoList.length) {
          model.page = REPO_SELECT
        } else {
          model.page = CREATE_NEW_REPO
        }
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

const createNewRepository = el => async e => {
  e.preventDefault()
  const data = new window.FormData(el)
  el.reset()
  model.page = WORKING
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(data.get('passphrase')),
    { name: 'PBKDF2' }, false, ['deriveKey']
  )
  data.delete('passphrase')
  salt = data.get('salt')
  iterations = Number(data.get('iterations'))
  key = await window.crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: encoder.encode(salt),
    iterations,
    hash: 'SHA-256'
  }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  model.repos = []
  model.modified = true
  model.page = MAIN
}

function defaultSalt () {
  let salt = ''
  while (salt.length < 32) {
    salt += [...window.crypto.getRandomValues(new Uint8Array(32))].filter(v => v % 128 >= 32).map(v => String.fromCharCode(v % 128)).join('')
  }
  return salt.substring(0, 32)
}

const save = el => e => {
  console.warn('TODO: implement')
  model.modified = false
}

const saveAs = el => e => {
  model.page = SAVE_AS
}

const download = el => e => {
  console.warn('TODO: implement')
}

const saveFile = el => async e => {
  e.preventDefault()
  model.page = WORKING
  const data = new window.FormData(el)
  model.name = data.get('reponame')
  const plaintext = encoder.encode(JSON.stringify(model.repos))
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  const cleartext = encoder.encode(JSON.stringify({ iterations, salt, iv: ui8ToB64(iv) }))
  console.log(encrypted)
  console.log(cleartext)
  const ui8 = new Uint8Array(cleartext.byteLength + 1 + encrypted.byteLength)
  ui8.set(cleartext)
  ui8[cleartext.byteLength] = 0
  ui8.set(new Uint8Array(encrypted), cleartext.byteLength + 1)

  console.log(ui8)

  Object.assign(db.transaction(['repos'], 'readwrite').objectStore('repos').add(ui8.buffer, model.name), {
    onsuccess: e => {
      console.log('success', e)
    },
    onerror: e => {
      console.error('error', e)
      model.errorName = 'Save Error'
      model.errorMessage = e.target.error.message
      model.page = ERROR
    }
  })

  model.modified = false
  model.page = MAIN
}

const decryptFile = el => async e => {
  e.preventDefault()
  const data = new window.FormData(el)
  el.reset()

  model.page = WORKING
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(data.get('passphrase')),
    { name: 'PBKDF2' }, false, ['deriveKey']
  )
  data.delete('passphrase')

  Object.assign(db.transaction(['repos']).objectStore('repos').get(model.name), {
    onsuccess: async e => {
      try {
        const result = new Uint8Array(e.target.result)
        const i = result.indexOf(0)
        const cleartext = JSON.parse(decoder.decode(result.subarray(0, i)))
        const _key = await window.crypto.subtle.deriveKey({
          name: 'PBKDF2',
          salt: encoder.encode(cleartext.salt),
          iterations: cleartext.iterations,
          hash: 'SHA-256'
        }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
        const ciphertext = result.subarray(i + 1)
        model.repos = JSON.parse(
          decoder.decode(
            await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToUi8(cleartext.iv) }, _key, ciphertext)
          )
        )
        iterations = cleartext.iterations
        salt = cleartext.salt
        key = _key
        console.log(JSON.stringify(model.repos))
        model.page = MAIN
      } catch (e) {
        console.log(e.message)
        console.log(e.name)
        console.error(e)
        model.errorName = 'Decryption Error'
        model.errorMessage = 'Unable to decrypt repository'
        model.page = ERROR
      }
    },
    onerror: e => {
      console.error('error', e)
      console.log(JSON.stringify(e))
      model.error = e
      model.page = ERROR
    }
  })
}

const selectRepo = el => e => {
  console.log(el, e)
  console.log(el.attributes.name.value)
  model.name = el.attributes.name.value
  model.page = DECRYPT
}

const newFile = el => e => {
}

const newDirectory = el => e => {
}

render(document.querySelector('main'), () => {
  switch (model.page) {
    case WORKING: return h`<div class="status">working...</div>`
    case DECRYPT: return h`
      <h2>Decrypt ${model.name}</h2>
      <form onsubmit=${decryptFile}>
        <label for="passphrase">Passphrase:</label>
        <input type="password" id="passphrase" name="passphrase" required>
        <input type="submit" value="DECRYPT">
      </form>
    `
    case REPO_SELECT: return h`
      <h2>Select Repository</h2>
      ${mapEntries(model.repoList, reponame => h`<div class="repo" onclick=${selectRepo} name=${reponame}>${reponame}</div>`)}
    `
    case CREATE_NEW_REPO: return h`
      <h2>Create New Repository</h2>
      <form onsubmit=${createNewRepository}>
        <label for="passphrase">Passphrase:</label>
        <input type="password" id="passphrase" name="passphrase" required>
        <span class="info">
          <span class="important">WARNING!</span>: Passphrases are NOT saved and can NOT be recovered.
          Forgetting your passphrase (or mistyping it here) will
          <span class="important">PERMANENTLY lock you out</span> of your repository.
        </span>
        <input type="submit" value="CREATE">
        <span class="advanced-toggle" onclick=${el => e => { model.showAdvanced = !model.showAdvanced }}>
          ${() => model.showAdvanced ? '▿' : '▹'} Advanced
        </span>
        <span class="advanced-settings" ${() => model.showAdvanced ? null : { style: 'display: none;' }}>
          <label for="salt">Salt:</label>
          <input type="text" id="salt" name="salt" value="${defaultSalt}">
          <label for="iterations">Iterations:</label>
          <input type="text" id="iterations" name="iterations" value="1000000">
          <span class="info">
            Cryptopotamus uses <a href="https://en.wikipedia.org/wiki/PBKDF2">PBKDF2</a> to turn passphrases 
            into cryptographic keys and make attacks against passphrases more difficult.
            A random "Salt" value and "Iterations" count are used by PBKDF2 to change the strength of the result.
            Neither is a secret and both are stored as cleartext in saved repositories.
          </span>
        </span>
      </form>
    `
    case MAIN: return h`
      <h2>${() => model.name || '[Unnamed Repository]'}</h2>
      <button class="new-file" type="button" onclick=${newFile}>NEW FILE</button>
      <button class="new-directory" type="button" onclick=${newDirectory}>NEW DIRECTORY</button>
      ${showIfElse(() => model.modified && model.name, h`
        <button class="save" type="button" onclick=${save}>SAVE</button>
      `)}
      <button class="saveas" type="button" onclick=${saveAs}>SAVE AS</button>
      <button class="download" type="button" onclick=${download}>DOWNLOAD</button>
    `
    case SAVE_AS: return h`
      <h2>Save Repository</h2>
      <form onsubmit=${saveFile}>
        <label for="reponame">Repository Name:</label>
        <input type="text" id="reponame" name="reponame" required>
        <input type="submit" value="SAVE">
      </form>
    `
    case ERROR: return h`
      <h2>${model.errorName}</h2>
      ${model.errorMessage}
    `
  }
})
