import { h, render, showIfElse } from '/unpkg/horseless/horseless.js'
import { TOP_BAR, OCTICON, TITLE, CONTAINER, BOTTOM_BAR, PASSPHRASE, BUTTON, INFO, HEADER, SALT } from '../tags.js'
import { gotoSelectScreen } from '../../commands/gotoSelectScreen.js'
import { model } from '../../model.js'

export function defineNewRepoScreen (name) {
  window.customElements.define(name, NewRepoScreen)
  return name
}

const toggleAdvanced = el => e => {
  model.state.closeAdvanced = !model.state.closeAdvanced
}

class NewRepoScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <${TOP_BAR} onclick=${el => gotoSelectScreen}>
        <${OCTICON} home/>
        <${OCTICON} arrow-left/>
      </${TOP_BAR}>
      <${CONTAINER}>
        <${TITLE} slot="header"><${OCTICON} repo-template/>Create New Repository</${TITLE}>
        <${INFO}><${OCTICON} issue-opened/>Passphrases are NOT saved and can NOT be recovered!</${INFO}>
        <${PASSPHRASE}/>
        ${showIfElse(() => model.state.passphrase, h`
          <${BUTTON} onclick=${[]}><${OCTICON} repo slot="icon"/>Create Repository</${BUTTON}>
        `)}
        <${CONTAINER} ${() => model.state.closeAdvanced ? 'closed' : null}>
          <${HEADER} slot="header" onclick=${toggleAdvanced}>
            <${OCTICON} style="width: 10px;" ${() => model.state.closeAdvanced ? 'chevron-right' : 'chevron-down'}/>
            <${OCTICON} gear/>
            Advanced
          </${HEADER}>
          <${INFO}><${OCTICON} info/>Cryptopotamus uses PBKDF2 to turn passphrases into cryptographic keys and make attacks against passphrases more difficult. A random "Salt" value and "Iterations" count are used by PBKDF2 to change the strength of the result. Neither value is a secret and both are stored as cleartext in saved repositories.</${INFO}>
          <${SALT}/>
          <${PASSPHRASE}/>
        </${CONTAINER}>
      </${CONTAINER}>
      <${BOTTOM_BAR}/>
    `)
  }
}
