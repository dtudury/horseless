import { h, render, remodel, mapList, mapObject } from '../../lib/index.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const model = remodel(
  h`<svg style="background:lightgray; display:block;" width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="100"/></svg>`
)
window.model = model

function renderChildren (children, isTopLevel) {
  return h`
    <ul title="${isTopLevel ? '' : 'children'}">
      ${ /* eslint-disable indent */
    mapList(() => children, child => {
      const state = remodel({
        expanded: false
      })
      function expanded (el) {
        return state.expanded ? 'expanded' : ''
      }
      const toggleExpanded = el => e => {
        state.expanded = !state.expanded
        e.stopPropagation()
        return false
      }
      return h`<li class="${expanded}" onclick="${toggleExpanded}">${renderChild(child)}</li>`
    })
      /* eslint-enable indent */}
      <li><a>+</a></li>
    </ul>
  `
}
function renderChild (model, isTopLevel) {
  return h`
    <label class="${model.tag}">${model.tag}
      <svg class="collapser" width="17" height="9" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0.5 0.5 L 8.5 8.5 L 16.5 0.5" fill="none" stroke="black" stroke-width="1"></path>
      </svg>
      ${() => renderChildren(model.children)}
      ${() => renderAttributes(model.attributes)}
    </label>
  `
}
function renderAttributes (attributes, isTopLevel) {
  return h`<ul title="attributes">
  ${mapObject(() => attributes, (name, value) => {
    const liveEdit = el => e => { attributes[name] = el.value.trim() }
    const handleEditKeyDown = el => e => {
      switch (e.keyCode) {
        case ENTER_KEY:
        case ESCAPE_KEY:
          el.blur()
          break
      }
    }
    return h`<li><label>${name}<input value=${value} oninput=${liveEdit} onkeydown=${handleEditKeyDown} /></label></li>`
  })}
  <div><button>+</button></div>
</ul>`
}

render(document.body, h`
<header class="app">
  <svg class="hamburger" onclick="" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
  <h1>
    JSVGX
  </h1>
</header>

<nav class="app">
  ${renderChildren(model, true)}
</nav>

<main class="app">
  ${model}
</main>

<footer class="app">
  Copyright © 2019 David Tudury
</footer>
`)
