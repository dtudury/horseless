import { h, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconReply, iconArrowRight } from '../icons.js'
import { LINE } from '../constants.js'

export function header (text, icon, hN = 'h3', back) {
  return h`
    <${LINE} slot="header" class=${hN}>
      ${showIfElse(() => back, h`<span class="filler" onclick=${back}>${iconReply}</span>`)}
      ${icon({ class: 'icon' })}
      <${hN} class="auto">${text}</${hN}>
    </${LINE}>
  `
}

export function link (text, icon, onclick) {
  return h`
    <${LINE} onclick=${onclick}>
      ${icon({ class: 'icon' })}
      <span class="filler">${text}</h2>
      ${iconArrowRight({ class: 'reveal' })}
    </${LINE}>
  `
}
