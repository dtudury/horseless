import { h, render, proxy, showIfElse } from '/unpkg/horseless/horseless.js'
const LOADING = 'loading'
const FILE_SELECT = 'file-select'
const CREATE_NEW_FILE = 'create-new-file'
const MAIN = 'main'
const SAVE_AS = 'save-as'

const model = proxy({
  page: LOADING
})

const db = Object.assign(window.indexedDB.open('crptptms'), {
  onupgradeneeded: function (event) {
    console.log('upgradeneeded')
    const db = event.target.result
    db.createObjectStore('files', { keyPath: 'name' })
  },
  onsuccess: function (event) {
    console.log('success')
    const db = event.target.result
    console.log(db)
    Object.assign(db.transaction(['files']).objectStore('files').getAllKeys(), {
      onsuccess: function (event) {
        console.log(event)
        console.log(event.target.result)
        model.data = event.target.result
        if (event.target.result.length) {
          model.page = FILE_SELECT
        } else {
          model.page = CREATE_NEW_FILE
        }
      }
    })
  },
  onerror: function (event) {
    console.error(event)
    console.error(`Database error: ${event.target.errorCode}`)
  }
})

const createNewFile = el => async e => {
  e.preventDefault()
  const data = new window.FormData(el)
  el.reset()
  const keyData = (new TextEncoder()).encode(data.get('passphrase'))
  data.delete('passphrase')
  const keyMaterial = await window.crypto.subtle.importKey('raw', keyData, { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey'])
  model.salt = data.get('salt')
  model.iterations = Number(data.get('iterations'))
  model.bits = await window.crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new Uint8Array(model.salt), iterations: model.iterations, hash: 'SHA-256' }, keyMaterial, 256)
  model.files = []
  model.modified = true
  model.page = MAIN
}

function saltDefault () {
  let salt = ''
  while (salt.length < 32) {
    salt += [...window.crypto.getRandomValues(new Uint8Array(32))].filter(v => v % 128 >= 32).map(v => String.fromCharCode(v % 128)).join('')
  }
  return salt.substring(0, 32)
}

const save = el => e => {
  console.log('TODO: implement')
  model.modified = false
}

const saveAs = el => e => {
  model.page = SAVE_AS
}

const download = el => e => {
  console.log('TODO: implement')
}

const saveFile = el => e => {
  e.preventDefault()
  const data = new window.FormData(el)
  model.name = data.get('filename')
  model.page = MAIN
}

render(document.querySelector('main'), () => {
  switch (model.page) {
    case LOADING: return h`<div class="status">loading...</div>`
    case FILE_SELECT: return h`select`
    case CREATE_NEW_FILE: return h`
      <h2>Create New File</h2>
      <form onsubmit=${createNewFile}>
        <label for="passphrase">Passphrase:</label>
        <input type="password" id="passphrase" name="passphrase" required>
        <span class="info">
          <span class="important">WARNING!</span>: Passphrases are NOT saved and can NOT be recovered.
          Forgetting your passphrase (or mistyping it here) will
          <span class="important">PERMANENTLY lock you out</span> of your file.
        </span>
        <input type="submit" value="CREATE">
        <span class="advanced-toggle" onclick=${el => e => { model.showAdvanced = !model.showAdvanced }}>
          ${() => model.showAdvanced ? '▿' : '▹'} Advanced
        </span>
        <span class="advanced-settings" ${() => model.showAdvanced ? null : { style: 'display: none;' }}>
          <label for="salt">Salt:</label>
          <input type="text" id="salt" name="salt" value="${saltDefault}">
          <label for="iterations">Iterations:</label>
          <input type="text" id="iterations" name="iterations" value="100000">
          <span class="info">
            Cryptopotamus uses <a href="https://en.wikipedia.org/wiki/PBKDF2">PBKDF2</a> to turn passphrases 
            into cryptographic keys and make attacks against passphrases more difficult.
            A random "Salt" value and "Iterations" count are used by PBKDF2 to change the strength of the result.
            Neither is a secret and both are stored as cleartext in saved files.
          </span>
        </span>
      </form>
    `
    case MAIN: return h`
      <h2>${() => model.name || '[Unnamed File]'}</h2>
      <button class="save" type="button" onclick=${save} ${() => (model.modified && model.name) ? null : { style: 'display: none;' }}>SAVE</button>
      <button class="saveas" type="button" onclick=${saveAs}>SAVE AS</button>
      <button class="download" type="button" onclick=${download}>DOWNLOAD</button>
    `
    case SAVE_AS: return h`
      <h2>Save File</h2>
      <form onsubmit=${saveFile}>
        <label for="filename">Filename:</label>
        <input type="text" id="filename" name="filename" required>
        <input type="submit" value="SAVE">
      </form>
    `
  }
})
