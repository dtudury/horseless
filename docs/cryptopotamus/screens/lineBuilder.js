import { h } from '/unpkg/horseless/horseless.js'
import { model } from '../model.js'
import { iconReply, iconArrowRight, iconKey, iconIssueOpened } from '../icons.js'
import { LINE } from '../constants.js'

export function backButton (back) {
  return iconReply({ class: 'back-button', onclick: back })
}

export function header (text, icon, hN = 'h3', back) {
  return h`
    <${LINE} slot="header" class=${hN}>
      ${icon({ class: 'icon' })}
      <${hN} class="auto">${text}</${hN}>
    </${LINE}>
  `
}

export function link (text, icon, onclick, enabled = () => false) {
  return h`
    <${LINE} class="link" onclick=${onclick} ${() => enabled() ? 'enabled' : null}>
      ${icon({ class: 'icon' })}
      <span class="filler">${text}</span>
      ${iconArrowRight({ class: 'reveal' })}
    </${LINE}>
  `
}

export const passphrase = (function () {
  const onclick = el => e => el.querySelector('#passphrase').focus()
  const oninput = el => e => {
    console.log(e.target.value)
    model.passphrase = e.target.value
  }
  return h`
    <${LINE} onclick=${onclick}>
      ${iconKey({ class: 'icon' })}
      <label for="passphrase">Passphrase:</label>
      <input type="password" id="passphrase" name="passphrase" required oninput=${oninput}>
    </${LINE}>
  `
})()

export function warning (text) {
  return h`
    <${LINE} class="info">
      ${iconIssueOpened({ class: 'icon' })}
      <span class="filler">${text}</span>
    </${LINE}>
  `
}

export function button (text) {
  return h`
    <${LINE} class="button">
      <button>${text}</button>
    </${LINE}>
  `
}
