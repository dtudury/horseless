import { h, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconReply } from '../icons.js'
import { model } from '../model.js'

export function screen (lines, depth = 0) {
}

export function title (text, icon, back) {
  const goback = el => e => {
    model.page = back
  }
  return h`
    <h2 class="line">
      ${showIfElse(() => back, h`
        <span class="back" onclick=${goback}>${iconReply}</span>
      `, h`
        <span></span>
      `)}
      ${icon}
      <span class="title">${text}</span>
      <span></span>
    </h2>
  `
}
