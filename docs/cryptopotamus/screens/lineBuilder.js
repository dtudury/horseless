import { h, objToStyle } from '/unpkg/horseless/horseless.js'
import { model } from '../model.js'
import { iconReply, iconArrowRight, iconKey, iconIssueOpened } from '../icons.js'
import { LINE } from '../constants.js'

export function backButton (back) {
  return iconReply({ class: 'back-button', onclick: back })
}

export function header (text, icon, hN = 'h3', back) {
  const headerStyle = objToStyle({
    margin: 0
  })
  return h`
    <${LINE} slot="header" class=${hN}>
      ${icon({ class: 'icon' })}
      <${hN} class="auto" ${headerStyle}>${text}</${hN}>
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

export const salt = (function () {
  const onclick = el => e => el.querySelector('#salt').focus()
  const oninput = el => e => {
    console.log(e.target.value)
    model.salt = e.target.value
  }
  return h`
    <${LINE} onclick=${onclick}>
      ${iconKey({ class: 'icon' })}
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
      ${iconKey({ class: 'icon' })}
      <label for="iterations">Iterations:</label>
      <input type="number" id="iterations" name="iterations" required oninput=${oninput}>
    </${LINE}>
  `
})()

export function warning (text) {
  const warningStyle = objToStyle({
    'font-size': '0.85em'
  })
  return h`
    <${LINE} class="info">
      ${iconIssueOpened({ class: 'icon' })}
      <span class="filler" ${warningStyle}>${text}</span>
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
