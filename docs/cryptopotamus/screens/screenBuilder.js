import { h, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconReply } from '../icons.js'
import { model } from '../model.js'

export function bracket (depth) {
  return h`<div class="bracket" style="left: ${16 + depth * 5}px; z-index: ${100 - depth};"></div>`
}

export function lines (depth, elements) {
  return () => {
    elements.forEach(element => {
      if (typeof element === 'function') {
        element = element()
      }
      if (element && element.type === 'node') {
        element.attributes.unshift({
          type: 'attribute',
          name: 'style',
          value: `padding-left: ${21 + depth * 5}px; z-index: ${100 - depth};`
        })
      }
    })
    return h`<div style="position: relative;">${elements}</div>`
  }
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
