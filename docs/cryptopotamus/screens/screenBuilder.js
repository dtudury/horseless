import { h, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconReply, iconArrowRight } from '../icons.js'
import { model } from '../model.js'

export function h2 (text, icon, back) {
  const goback = el => e => {
    model.page = back
  }
  return h`
    ${showIfElse(() => back, h`
      <span class="filler" onclick=${goback}>${iconReply}</span>
    `, h`
      <span class="filler"></span>
    `)}
    ${icon}
    <h2 class="auto">${text}</h2>
    <span class="filler"></span>
  `
}

export function h3 (text, icon) {
  return h`
    <span class="filler"></span>
    ${icon}
    <h3 class="auto">${text}</h3>
    <span class="filler"></span>
  `
}

export function link (text, icon) {
  return h`
    ${icon}
    <span class="auto">${text}</h2>
    <span class="filler"></span>
    ${iconArrowRight({ class: 'icon' })}
  `
}
