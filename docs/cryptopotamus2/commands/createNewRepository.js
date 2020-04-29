import { model, setKey } from '../model.js'
import { screens } from '../constants.js'

export async function createNewRepository (passphrase, salt, iterations) {
  const encoder = new TextEncoder()
  passphrase = encoder.encode(passphrase)
  salt = encoder.encode(salt)
  iterations = Number(iterations)
  model.state = { screen: screens.WORKING }
  const keyMaterial = await window.crypto.subtle.importKey('raw', passphrase, { name: 'PBKDF2' }, false, ['deriveKey'])
  setKey(await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  ))
  model.state = {
    screen: screens.EDIT_REPO,
    salt,
    iterations,
    files: []
  }
}
