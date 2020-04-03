/* global atob btoa */
import { h, render, proxy, mapEntries, showIfElse, after } from '/unpkg/horseless/horseless.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
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

// from https://github.com/primer/octicons
const _repoTemplate = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M12 8V1c0-.55-.45-1-1-1H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h2v2l1.5-1.5L6 16v-4H3v1H1v-2h7v-1H2V1h9v7h1zM4 2H3v1h1V2zM3 4h1v1H3V4zm1 2H3v1h1V6zm0 3H3V8h1v1zm6 3H8v2h2v2h2v-2h2v-2h-2v-2h-2v2z"/></svg>`
const _repoPush = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z"/></svg>`
const _repoPull = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13 8V6H7V4h6V2l3 3-3 3zM4 2H3v1h1V2zm7 5h1v6c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2h-1V1H2v9h9V7zm0 4H1v2h2v-1h3v1h5v-2zM4 6H3v1h1V6zm0-2H3v1h1V4zM3 9h1V8H3v1z"/></svg>`
const _repo = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"/></svg>`
const _gitMerge = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M10 7c-.73 0-1.38.41-1.73 1.02V8C7.22 7.98 6 7.64 5.14 6.98c-.75-.58-1.5-1.61-1.89-2.44A1.993 1.993 0 002 .99C.89.99 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2a1.993 1.993 0 001-3.72V7.67c.67.7 1.44 1.27 2.3 1.69.86.42 2.03.63 2.97.64v-.02c.36.61 1 1.02 1.73 1.02 1.11 0 2-.89 2-2 0-1.11-.89-2-2-2zm-6.8 6c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm8 6c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>`
const _gitBranch = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 00-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 00-1-3.72C.88 1 0 1.89 0 3a2 2 0 001 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>`
const _file = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"/></svg>`
const _filePlusFile = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9z M5 7 v-2 h2 v2 h2 v2 h-2 v2 h-2 v-2 h-2 v-2 z"/></svg>`
const _filePlusDirectory = () => h`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z M6 8 v-2 h2 v2 h2 v2 h-2 v2 h-2 v-2 h-2 v-2 z"/></svg>`

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
  model.files = []
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
  saveRepo('put')
}

const saveAs = el => e => {
  model.page = SAVE_AS
}

const download = el => e => {
  console.warn('TODO: implement')
}

const saveRepoAs = el => e => {
  e.preventDefault()
  const data = new window.FormData(el)
  model.name = data.get('reponame')
  saveRepo('add')
}

async function saveRepo (method) {
  model.page = WORKING
  const buffer = await encryptRepo()
  Object.assign(db.transaction(['repos'], 'readwrite').objectStore('repos')[method](buffer, model.name), {
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

async function encryptRepo () {
  const plaintext = encoder.encode(JSON.stringify(model.files))
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  const cleartext = encoder.encode(JSON.stringify({ iterations, salt, iv: ui8ToB64(iv) }))
  const ui8 = new Uint8Array(cleartext.byteLength + 1 + encrypted.byteLength)
  ui8.set(cleartext)
  ui8[cleartext.byteLength] = 0
  ui8.set(new Uint8Array(encrypted), cleartext.byteLength + 1)
  return ui8.buffer
}

const decryptRepo = el => async e => {
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
        model.files = JSON.parse(
          decoder.decode(
            await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToUi8(cleartext.iv) }, _key, ciphertext)
          )
        )
        iterations = cleartext.iterations
        salt = cleartext.salt
        key = _key
        model.page = MAIN
      } catch (e) {
        console.error(e)
        model.errorName = 'Decryption Error'
        model.errorMessage = 'Unable to decrypt repository'
        model.page = ERROR
      }
    },
    onerror: e => {
      console.error('error', e)
      model.error = e
      model.page = ERROR
    }
  })
}

const selectRepo = el => e => {
  model.name = el.attributes.name.value
  model.page = DECRYPT
}

const newRepo = el => e => {
  model.page = CREATE_NEW_REPO
}

const newFile = el => e => {
  model.files.unshift({ name: '', editingName: true, type: 'file', content: '' })
  model.modified = true
}

function renderFile (file) {
  const selfDestruct = el => e => model.files.splice(model.files.indexOf(file), 1)
  const completeEdit = el => e => {
    file.editingName = false
    const name = el.value.trim()
    if (name) {
      file.name = name
    } else {
      selfDestruct(el)(e) // 'unescape' and call event handler
    }
  }
  const handleEdit = el => e => {
    switch (e.keyCode) {
      case ENTER_KEY:
        completeEdit(el)(e) // 'unescape' and call event handler
        break
      case ESCAPE_KEY:
        file.editingName = false
        break
    }
  }
  if (file.editingName) {
    after(() => { document.querySelector('input[autofocus]').focus() })
    return h`<div class="repo"><input type="text" onblur=${completeEdit} onkeydown=${handleEdit} autofocus></input></div>`
  } else {
    return h`<div class="repo">${_file()}${file.name}</div>`
  }
}

render(document.querySelector('main'), () => {
  switch (model.page) {
    case WORKING: return h`<div class="status">working...</div>`
    case DECRYPT: return h`
      <h2>Decrypt ${model.name}</h2>
      <form onsubmit=${decryptRepo}>
        <label for="passphrase">Passphrase:</label>
        <input type="password" id="passphrase" name="passphrase" required>
        <input type="submit" value="DECRYPT">
      </form>
    `
    case REPO_SELECT: return h`
      <h2>Select Repository</h2>
      <div class="file" onclick=${newRepo}>${_repoTemplate()}[NEW]</div>
      <div class="file" onclick=${newRepo}>${_repoPush()}[UPLOAD]</div>
      ${mapEntries(model.repoList, reponame => h`<div class="file" onclick=${selectRepo} name=${reponame}>${_repo()}${reponame}</div>`)}
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
      ${mapEntries(model.files, renderFile)}
      <button class="new-file" type="button" onclick=${newFile}>${_filePlusFile}NEW FILE</button>
      ${showIfElse(() => model.modified && model.name, h`
        <button class="save" type="button" onclick=${save}>${_gitMerge}SAVE</button>
      `)}
      <button class="saveas" type="button" onclick=${saveAs}>${_gitBranch}SAVE AS</button>
      <button class="download" type="button" onclick=${download}>${_repoPull}DOWNLOAD</button>
    `
    case SAVE_AS: return h`
      <h2>Save Repository</h2>
      <form onsubmit=${saveRepoAs}>
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
