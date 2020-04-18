import { h, render, proxy, mapEntries } from '/unpkg/horseless/horseless.js'
const ENTER_KEY = 13
const ESCAPE_KEY = 27
const model = proxy(
  h`<svg id="hypnoface" style="background:lightgray; display:block;" width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <circle id="face" cx="150" cy="150" r="100" fill="yellow" stroke="black" stroke-width="30"/>
    <circle id="left-eye" class="eye" cx="110" cy="130" r="15" fill="black"/>
    <circle id="right-eye" class="eye" cx="190" cy="130" r="15" fill="black"/>
    <line class="mouth" x1="110" x2="190" y1="170" y2="170" stroke="black" stroke-width="30" stroke-linecap="round"/>
  </svg>`
)
window.model = model

const clickEater = el => e => {
  e.stopPropagation()
  return false
}

function _children (model) {
  const addChild = el => e => {
    const xmlns = model.xmlns && model.xmlns.join('')
    model.children.push(h(xmlns)`<${el.parentNode.querySelector('input').value}/>`[0])
  }
  return h`
    <ul ${{ title: model.tag ? 'children' : '' }} onclick="${clickEater}">
      ${mapEntries(() => model.children, child => _child(child))}
      <li>
        <label><input /><button onclick=${addChild} >+ Child</button></label>
      </li>
    </ul>
  `
}

function _renderAttributes (model) {
  const node = render(model)[0]
  const obj = {}
  if (node.attributes) {
    Array.prototype.forEach.call(node.attributes, att => {
      obj[att.name] = att.value
    })
  }
  return obj
}

function _child (model, isTopLevel) {
  if (!model.tag) {
    return null
  }
  const state = proxy({
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
  function longName () {
    const nameParts = [model.tag]
    const attributes = _renderAttributes(model)
    if (attributes.id) {
      nameParts.push(`#${attributes.id}`)
    }
    if (attributes.class) {
      nameParts.push(`.${attributes.class}`)
    }
    return nameParts.join('')
  }
  return h`
    <li class="${expanded}" onclick="${toggleExpanded}">
      <label class="${model.tag}">${longName}
        <svg class="collapser" width="17" height="9" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0.5 0.5 L 8.5 8.5 L 16.5 0.5" fill="none" stroke="black" stroke-width="1"></path>
        </svg>
      </label>
      ${() => _attributes(model)}
      ${() => _children(model)}
    </li>
  `
}

function _attributes (model) {
  const addAttribute = el => e => {
    console.log(JSON.parse(JSON.stringify(model.attributes)))
    model.attributes.push({ type: 'attribute', name: el.parentNode.querySelector('input').value, value: [] })
  }
  return h`
    <ul title="attributes" onclick="${clickEater}">
      ${ /* eslint-disable indent */
    mapEntries(() => _renderAttributes(model), (value, name) => {
      const liveEdit = el => e => { model.attributes.obj[name] = el.value.trim() }
      const handleEditKeyDown = el => e => {
        switch (e.keyCode) {
          case ENTER_KEY:
          case ESCAPE_KEY:
            el.blur()
            break
        }
      }
      return h`<li><label>${name}<input value=${value} oninput=${liveEdit} onkeydown=${handleEditKeyDown} /></label></li>`
    })
      /* eslint-enable indent */}
      <li>
        <label><input /><button onclick=${addAttribute} >+ Attribute</button></label>
      </li>
    </ul>
  `
}

render(document.body, h`
  <header class="app">
    <svg class="hamburger" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
    </svg>
    <h1>
      JSVGX
    </h1>
  </header>

  <nav class="app">
    ${_children({ children: model })}
  </nav>

  <main class="app">
    ${model}
  </main>

  <footer class="app">
    Copyright © 2019 David Tudury
  </footer>
`)
