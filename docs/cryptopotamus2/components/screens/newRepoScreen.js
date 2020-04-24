import { h, render } from '/unpkg/horseless/horseless.js'
import { TOP_BAR, OCTICON, TITLE, LINK, CONTAINER, BOTTOM_BAR } from '../tags.js'

export function defineNewRepoScreen (name) {
  window.customElements.define(name, NewRepoScreen)
  return name
}

class NewRepoScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <${TOP_BAR}>
        <${OCTICON} home/>
        <${OCTICON} arrow-left/>
      </${TOP_BAR}>
      <${CONTAINER}>
        <${TITLE} slot="header"><${OCTICON} repo-template/>Create New Repository</${TITLE}>
        <${LINK} onclick=${el => {}}><${OCTICON} repo-template/>New Repository</${LINK}>
        <${LINK} onclick=${el => {}}><${OCTICON} repo-push/>Upload Repository</${LINK}>
      </${CONTAINER}>
      <${BOTTOM_BAR}/>
    `)
  }
}
