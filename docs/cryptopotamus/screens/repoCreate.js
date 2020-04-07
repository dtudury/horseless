import { h } from '/unpkg/horseless/horseless.js'
import { MAIN, WORKING, REPO_SELECT } from '../constants.js'
import { model, setKey } from '../model.js'
import { iconRepoTemplate, iconReply, iconLock, iconKey } from '../icons.js'
import { title } from './screenBuilder.js'

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

export const repoCreate = h`
  ${title('Create New Repository', iconRepoTemplate, REPO_SELECT)}
  <form class="nesting" onsubmit=${createNewRepository}>
    <div class="nested">
      <div class="bracket" style="left: 16px; z-index: 1;"></div>

      <div class="line">
        ${iconKey}
        <span class="narrow"><label for="passphrase">Passphrase:</label></span>
        <input type="password" id="passphrase" name="passphrase" required>
      </div>
      <div class="line">
        <span class="info">
          <span class="important">WARNING!</span>: Passphrases are NOT saved and can NOT be recovered.
          Forgetting your passphrase (or mistyping it here) will
          <span class="important">PERMANENTLY lock you out</span> of your repository.
        </span>
      </div>

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

    </div>
  </form>

`
