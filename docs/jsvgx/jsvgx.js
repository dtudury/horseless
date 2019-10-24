import { h, render, remodel, mapList, mapObject } from '../../lib/index.js'
const model = remodel(
  h`<svg style="background:lightgray;" width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="100"/></svg>`
)
window.model = model

function renderChildren (children, isTopLevel) {
  return h`
    <ul title="${isTopLevel ? '' : 'children'}">
      ${mapList(() => children, child => h`<li>${renderChild(child)}</li>`)}
      <li><button>+</button></li>
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
  return h`
    <dl title="attributes">
      ${mapObject(() => attributes, (name, value) => h`<div><dt>${name}</dt></dd>${value}</dd></div>`)}
      <div><button>+</button></div>
    </dl>
  `
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
