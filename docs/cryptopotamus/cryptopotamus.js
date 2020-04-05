/* global btoa */
import { h, render, mapEntries, showIfElse, after } from '/unpkg/horseless/horseless.js'
import { iconGitBranch, iconGitMerge, iconFile, iconFilePlusFile, iconRepoPull } from './icons.js'
import { ENTER_KEY, ESCAPE_KEY, CREATE_NEW_REPO, DECRYPT, ERROR, MAIN, REPO_SELECT, SAVE_AS, WORKING } from './constants.js'
import { model, getKey } from './model.js'
import { db } from './db.js'
import { repoSelect } from './screens/repoSelect.js'
import { repoDecrypt } from './screens/repoDecrypt.js'
import { repoCreate } from './screens/repoCreate.js'

const encoder = new TextEncoder()
const ui8ToB64 = ui8 => btoa(String.fromCharCode.apply(null, ui8))

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
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, getKey(), plaintext)
  const cleartext = encoder.encode(JSON.stringify({ iterations: model.iterations, salt: model.salt, iv: ui8ToB64(iv) }))
  const ui8 = new Uint8Array(cleartext.byteLength + 1 + encrypted.byteLength)
  ui8.set(cleartext)
  ui8[cleartext.byteLength] = 0
  ui8.set(new Uint8Array(encrypted), cleartext.byteLength + 1)
  return ui8.buffer
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

render(document.querySelector('main'), h`
  <hr>
  ${() => {
    switch (model.page) {
      case WORKING: return h`<div class="status">working...</div>`
      case DECRYPT: return repoDecrypt
      case REPO_SELECT: return repoSelect
      case CREATE_NEW_REPO: return repoCreate
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
  }}
  <hr>
`)
