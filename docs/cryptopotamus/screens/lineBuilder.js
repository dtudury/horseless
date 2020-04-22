import { h, objToDeclarations } from '/unpkg/horseless/horseless.js'
import { model } from '../model.js'
import { iconReply, iconKey, iconIssueOpened, iconInfo } from '../icons.js'
import { LINE, ICON_ATTRIBUTES } from '../constants.js'

export function backButton (back) {
  return h`
    <${LINE} class="top" onclick=${back}>
      ${iconReply}
    </${LINE}>
  `
}

export function header (text, icon, hN = 'h3') {
  const headerStyle = {
    style: objToDeclarations({
      margin: 0
    })
  }
  return h`
    <${LINE} slot="header" class=${hN}>
      ${icon(ICON_ATTRIBUTES)}
      <${hN} class="auto" ${headerStyle}>${text}</${hN}>
    </${LINE}>
  `
}

export function link (text, icon, onclick, enabled = () => false) {
  return h`
    <${LINE} class="link" onclick=${onclick} ${() => enabled() ? 'enabled' : null}>
      ${icon(ICON_ATTRIBUTES)}
      <span>${text}</span>
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
      ${iconKey(ICON_ATTRIBUTES)}
      <label for="passphrase">Passphrase:</label>
      <input type="password" id="passphrase" name="passphrase" required oninput=${oninput}>
    </${LINE}>
  `
})()

export const salt = (function () {
  const onclick = el => e => el.querySelector('#salt').focus()
  const oninput = el => e => {
    console.log(e.target.value)
    model.salt = e.target.value
  }
  return h`
    <${LINE} onclick=${onclick}>
      ${iconKey(ICON_ATTRIBUTES)}
      <label for="salt">Salt:</label>
      <input type="text" id="salt" name="salt" required oninput=${oninput}>
    </${LINE}>
  `
})()

export const iterations = (function () {
  const onclick = el => e => el.querySelector('#iterations').focus()
  const oninput = el => e => {
    console.log(e.target.value)
    model.iterations = e.target.value
  }
  return h`
    <${LINE} onclick=${onclick}>
      ${iconKey(ICON_ATTRIBUTES)}
      <label for="iterations">Iterations:</label>
      <input type="number" id="iterations" name="iterations" required oninput=${oninput}>
    </${LINE}>
  `
})()

export function warning (text) {
  const warningStyle = {
    style: objToDeclarations({
      flex: '1',
      'font-size': '0.85em'
    })
  }
  return h`
    <${LINE} class="info">
      ${iconIssueOpened(ICON_ATTRIBUTES)}
      <span ${warningStyle}>${text}</span>
    </${LINE}>
  `
}

export function info (text) {
  const infoStyle = {
    style: objToDeclarations({
      flex: '1',
      'font-size': '0.85em'
    })
  }
  return h`
    <${LINE} class="info">
      ${iconInfo(ICON_ATTRIBUTES)}
      <span ${infoStyle}>${text}</span>
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
