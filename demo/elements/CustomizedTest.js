/* global HTMLDivElement */

export default class CustomizedTest extends HTMLDivElement {
  constructor () {
    super()
    this.addEventListener('click', this)
    Object.assign(this.style, { color: 'red' })
  }
  handleEvent (e) {
    this['on' + e.type](e)
  }
  onclick (e) {
    console.log('CustomizedTest onclick', this, e)
  }
  connectedCallback () {
    console.log('CustomizedTest connectedCallback', this.childNodes)
    Array.from(this.childNodes).forEach(elem => {
      console.log(elem.getClientRects())
    })
  }
  disconnectedCallback () {
    console.log('CustomizedTest disconnectedCallback')
  }
  attributeChangedCallback (name, oldValue, newValue) {
    console.log('CustomizedTest attributeChangedCallback', name, oldValue, newValue)
  }
  static get observedAttributes () {
    return ['a', 'b']
  }
}
