import { h } from '/unpkg/horseless/horseless.js'
import { MAIN, WORKING, REPO_SELECT, CONTAINER } from '../constants.js'
import { model, setKey } from '../model.js'
import { iconRepoTemplate, iconKey, iconRepo } from '../icons.js'
import { header, backButton, passphrase, warning, info, link, salt, iterations } from './lineBuilder.js'

const encoder = new TextEncoder()

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
  model.salt = data.get('salt')
  model.iterations = Number(data.get('iterations'))
  setKey(await window.crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: encoder.encode(model.salt),
    iterations: model.iterations,
    hash: 'SHA-256'
  }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']))
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

const onclick = el => e => {
  console.log(el, e)
}

function validInputs () {
  return model.passphrase
}

const back = el => e => { model.page = REPO_SELECT }

export const repoCreate = h`
  ${backButton(back)}
  <${CONTAINER}>
    ${header('Create New Repository', iconRepoTemplate, 'h2')}
    ${passphrase}
    ${warning('Passphrases are NOT saved and can NOT be recovered!')}
    ${link('Create Repository', iconRepo, onclick, validInputs)}
    <${CONTAINER} collapsible>
      ${header('Advanced', iconKey, 'h3')}
      ${salt}
      ${iterations}
      ${info(`
        Cryptopotamus uses PBKDF2 to turn passphrases 
        into cryptographic keys and make attacks against passphrases more difficult.
        A random "Salt" value and "Iterations" count are used by PBKDF2 to change the strength of the result.
        Neither is a secret and both are stored as cleartext in saved repositories.
      `)}
    </${CONTAINER}>
  </${CONTAINER}>
`
