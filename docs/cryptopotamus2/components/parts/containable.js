import { proxy } from '/unpkg/horseless/horseless.js'
import { CONTAINER } from '../tags.js'

function countContainers (el) {
  let count = 0
  while (el) {
    if (el.tagName && el.tagName.toUpperCase() === CONTAINER.toUpperCase()) {
      ++count
    }
    el = el.parentNode
  }
  return count
}

export class Containable extends window.HTMLElement {
  constructor () {
    super()
    this.model = proxy({ depth: 0 })
  }

  connectedCallback () {
    this.model.depth = countContainers(this)
  }
}
