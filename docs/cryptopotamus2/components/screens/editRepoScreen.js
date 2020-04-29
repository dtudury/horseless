import { h, render } from '/unpkg/horseless/horseless.js'
import { TOP_BAR, BOTTOM_BAR, CONTAINER, TITLE, OCTICON } from '../tags.js'
import { gotoSelectScreen } from '../../commands/gotoSelectScreen.js'

export function defineEditRepoScreen (name) {
  window.customElements.define(name, EditRepoScreen)
  return name
}

class EditRepoScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <${TOP_BAR} onclick=${el => gotoSelectScreen}>
        <${OCTICON} home/>
        <${OCTICON} arrow-left/>
      </${TOP_BAR}>
      <${CONTAINER}>
        <${TITLE} slot="header"><${OCTICON} repo/>Edit Repository</${TITLE}>
      </${CONTAINER}>
      <${BOTTOM_BAR}/>
    `)
  }
}
