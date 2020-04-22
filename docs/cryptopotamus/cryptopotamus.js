import { h, render, objToDeclarations } from '/unpkg/horseless/horseless.js'
import { APP, CREATE_NEW_REPO, DECRYPT, ERROR, MAIN, REPO_SELECT, SAVE_AS, WORKING } from './constants.js'
import { model } from './model.js'
import { repoSelect } from './screens/repoSelect.js'
import { repoDecrypt } from './screens/repoDecrypt.js'
import { repoCreate } from './screens/repoCreate.js'
import { saveAs } from './screens/saveAs.js'
import { main } from './screens/main.js'
import { errorScreen } from './screens/errorScreen.js'

const headerStyle = {
  style: objToDeclarations({
    'text-align': 'center',
    'background-color': '#444',
    color: 'transparent',
    'letter-spacing': '.5em',
    'text-shadow': '0.1rem -0.1rem 0.3rem #aaa',
    'background-clip': 'text',
    '-webkit-background-clip': 'text',
    '-moz-background-clip': 'text',
    'user-select': 'none'
  })
}

const hrStyle = {
  style: objToDeclarations({
    border: 'none',
    'border-top': '1px solid #ccc',
    'z-index': '1'
  })
}

function screen () {
  switch (model.page) {
    case WORKING: return h`<div class="status">working...</div>`
    case DECRYPT: return repoDecrypt
    case REPO_SELECT: return repoSelect
    case CREATE_NEW_REPO: return repoCreate
    case MAIN: return main
    case SAVE_AS: return saveAs
    case ERROR: return errorScreen
  }
}

render(document.body, h`
  <h1 ${headerStyle}>cryptopotamus</h1>
  <${APP}>
    <hr ${hrStyle}>
    ${screen}
    <hr ${hrStyle}>
  </${APP}>
`)
