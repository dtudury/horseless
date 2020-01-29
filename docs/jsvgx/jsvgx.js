import { h, render, remodel, mapList, mapObject } from '../../lib/index.js'
import { decodePathData, encodePathData } from './pathData.js'
import ExpandableElement from './ExpandableElement.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const model = remodel(
  h`<svg id="smiley" style="display:block;" width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <style>
      svg#smiley {
        fill: red;
        stroke: none;
        filter: drop-shadow( 0px 5px 15px rgba(200, 0, 0, 1));
      }
    </style>
    <circle id="face" cx="150" cy="150" r="100" fill="pink" stroke="red" stroke-width="30"/>
    <circle id="left-eye" class="eye" cx="110" cy="130" r="15"/>
    <circle id="right-eye" class="eye" cx="190" cy="130" r="15"/>
    <path class="smile" d="M 100,170 A 60,70 0 0 0 200,170 z" stroke="none" stroke-width="0"/>
  </svg>`
)
window.model = model

const svg = ` M 10 315
L 110 215
A 30 50 0 01162.55 162.45
L 172.55 152.45
A 30 50-45 0 1 215.1 109.9
L 315 10 `
// console.log(JSON.stringify(decodePathData(svg), null, '  '))
console.log(encodePathData(decodePathData(svg)))

/* global customElements */
customElements.define('expandable-element', ExpandableElement)

function renderChildren (model) {
  const addChild = el => e => {
    const xmlns = model.xmlns && model.xmlns.join('')
    model.children.push(h(xmlns)`<${el.parentNode.querySelector('input').value}/>`[0])
  }
  const children = h`
      <ul slot="expandable">
        ${mapList(() => model.children, child => renderChild(child))}
        <li>
          <label><input /><button onclick=${addChild} >+ Child</button></label>
        </li>
      </ul>
  `
  if (model.tag) {
    return h`
      <expandable-element class="children">
        <span slot="clickable">children</span>
        ${children}
      </expandable-element>
    `
  } else {
    return children
  }
}

function renderTextNode (model) {
  if (!model.value.trim().length) {
    return null
  }
  const liveEdit = el => e => {
    model.value = el.value.trim()
  }
  const handleEditKeyDown = el => e => {
    switch (e.keyCode) {
      case ENTER_KEY:
      case ESCAPE_KEY:
        el.blur()
        break
    }
  }
  return h`
    <li class="textnode">
      <expandable-element>
        <div slot="clickable">textnode</div>
        <div slot="expandable">
          <textarea rows="8" oninput=${liveEdit} onkeydown=${handleEditKeyDown}>${() => model.value}</textarea>
        </div>
      </expandable-element>
    </li>
  `
}

function renderNode (model) {
  function longName () {
    const nameParts = [model.tag]
    if (model.attributes.obj.id) {
      nameParts.push(`#${model.attributes.obj.id}`)
    }
    if (model.attributes.obj.class) {
      nameParts.push(`.${String(model.attributes.obj.class).split(/\s+/).join('.')}`)
    }
    return nameParts.join('')
  }
  return h`
    <li class=${model.tag}>
      <expandable-element>
        <div slot="clickable">${longName}</div>
        <div slot="expandable">
          ${() => renderAttributes(model)}
          ${() => renderChildren(model)}
        </div>
      </expandable-element>
    </li>
  `
}

function renderChild (model) {
  switch (model.type) {
    case 'node':
      return renderNode(model)
    case 'textnode':
      return renderTextNode(model)
    default:
      return null
  }
}
function renderAttributes (model) {
  const addAttribute = el => e => {
    model.attributes.obj[el.parentNode.querySelector('input').value] = ''
  }
  const attributes = mapObject(() => model.attributes.obj, (value, name) => {
    const liveEdit = el => e => { model.attributes.obj[name] = el.value.trim() }
    const handleEditKeyDown = el => e => {
      switch (e.keyCode) {
        case ENTER_KEY:
        case ESCAPE_KEY:
          el.blur()
          break
      }
    }
    return h`
      <li class="attribute">
        <label>
          ${name}
          <input value=${value} oninput=${liveEdit} onkeydown=${handleEditKeyDown} />
        </label>
      </li>
    `
  })
  return h`
    <expandable-element class="attributes">
      <div slot="clickable">attributes</div>
      <ul slot="expandable">
        ${attributes}
        <li>
          <label><input /><button onclick=${addAttribute} >+ Attribute</button></label>
        </li>
      </ul>
    </expandable-element>
  `
}

render(document.body, h`
<header class="app">
  <svg class="hamburger" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
  <h1>JSVGX</h1>
</header>

<nav class="app">
  ${renderChildren({ children: model })}
</nav>

<main class="app">
  ${model}
</main>

<footer class="app">
  Copyright © 2019 David Tudury
</footer>
`)
