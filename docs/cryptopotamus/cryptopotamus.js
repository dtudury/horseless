/* global atob btoa */
import { h, render, mapEntries, showIfElse, after } from '/unpkg/horseless/horseless.js'
import { iconGitBranch, iconGitMerge, iconFile, iconFilePlusFile, iconRepo, iconRepoPull, iconRepoPush, iconRepoTemplate, iconDatabase, iconRepoClone, iconArrowRight, iconReply } from './icons.js'
import { ENTER_KEY, ESCAPE_KEY, CREATE_NEW_REPO, DECRYPT, ERROR, MAIN, REPO_SELECT, SAVE_AS, WORKING } from './constants.js'
import { model } from './model.js'
import { db } from './db.js'
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const b64ToUi8 = b64 => new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)))
const ui8ToB64 = ui8 => btoa(String.fromCharCode.apply(null, ui8))
let key
let salt
let iterations

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

  Object.assign(db().transaction(['repos']).objectStore('repos').get(model.name), {
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
    return h`<div class="repo">${iconFile()}${file.name}</div>`
  }
}

render(document.querySelector('main'), () => {
  switch (model.page) {
    case WORKING: return h`<div class="status">working...</div>`
    case DECRYPT: return h`
      <h2>Open ${model.name}</h2>
      <form onsubmit=${decryptRepo}>
        <label for="passphrase">Passphrase:</label>
        <input type="password" id="passphrase" name="passphrase" required>
        <input type="submit" value="OPEN">
      </form>
    `
    case REPO_SELECT: return h`
    <hr>
      <div class="nesting">
        <h2 class="line"><span class="fill">${iconReply()}</span>${iconRepoClone}<span>Repositories</span><span class="fill"></span></h2>
        <div class="nested">
          <div class="file line" onclick=${newRepo}>${iconRepoTemplate()}<span>New Repository</span>${iconArrowRight({ class: 'hover' })}</div>
          <div class="file line" onclick=${newRepo}>${iconRepoPush()}<span>Upload Repository</span>${iconArrowRight({ class: 'hover' })}</div>
          ${showIfElse(() => model.repoList.length, h`
            <div class="nesting">
              <h3 class="line">${iconDatabase()}<span>Saved Repositories:</span></h3>
              <div class="nested">
                ${mapEntries(model.repoList, reponame => h`<div class="file line" onclick=${selectRepo} name=${reponame}>${iconRepo()}<span>${reponame}</span>${iconArrowRight({ class: 'hover' })}</div>`)}
              </div>
            </div>
          `)}
        </div>
      </div>
    <hr>
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
      <button class="new-file" type="button" onclick=${newFile}>${iconFilePlusFile}NEW FILE</button>
      ${showIfElse(() => model.modified && model.name, h`
        <button class="save" type="button" onclick=${save}>${iconGitMerge}SAVE</button>
      `)}
      <button class="saveas" type="button" onclick=${saveAs}>${iconGitBranch}SAVE AS</button>
      <button class="download" type="button" onclick=${download}>${iconRepoPull}DOWNLOAD</button>
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
