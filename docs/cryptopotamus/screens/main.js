import { h, mapEntries, showIfElse, after } from '/unpkg/horseless/horseless.js'
import { model, saveRepo } from '../model.js'
import { iconGitBranch, iconGitMerge, iconFile, iconFilePlusFile, iconRepoPull } from '../icons.js'
import { ENTER_KEY, ESCAPE_KEY, SAVE_AS } from '../constants.js'

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

const save = el => e => {
  saveRepo('put')
}

const saveAs = el => e => {
  model.page = SAVE_AS
}

const download = el => e => {
  console.warn('TODO: implement')
}

const newFile = el => e => {
  model.files.unshift({ name: '', editingName: true, type: 'file', content: '' })
  model.modified = true
}

export const main = h`
  <h2>${() => model.name || '[Unnamed Repository]'}</h2>
  ${mapEntries(() => model.files, renderFile)}
  <button class="new-file" type="button" onclick=${newFile}>${iconFilePlusFile}NEW FILE</button>
  ${showIfElse(() => model.modified && model.name, h`
    <button class="save" type="button" onclick=${save}>${iconGitMerge}SAVE</button>
  `)}
  <button class="saveas" type="button" onclick=${saveAs}>${iconGitBranch}SAVE AS</button>
  <button class="download" type="button" onclick=${download}>${iconRepoPull}DOWNLOAD</button>
`
