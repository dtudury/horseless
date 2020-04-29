import { h, render, proxy, showIfElse } from '/unpkg/horseless/horseless.js'
import { TOP_BAR, OCTICON, TITLE, CONTAINER, BOTTOM_BAR, PASSPHRASE, BUTTON, INFO, HEADER, SALT, ITERATIONS } from '../tags.js'
import { gotoSelectScreen } from '../../commands/gotoSelectScreen.js'
import { createNewRepository } from '../../commands/createNewRepository.js'
import { ENTER_KEY } from '../../constants.js'

export function defineNewRepoScreen (name) {
  window.customElements.define(name, NewRepoScreen)
  return name
}

class NewRepoScreen extends window.HTMLElement {
  constructor () {
    super()
    this.model = proxy({ closeAdvanced: true, showSubmit: false })

    const submit = el => e => {
      const passphrase = this.shadowRoot.querySelector(PASSPHRASE).value
      this.shadowRoot.querySelector(PASSPHRASE).value = ''
      const salt = this.shadowRoot.querySelector(SALT).value
      const iterations = this.shadowRoot.querySelector(ITERATIONS).value
      createNewRepository(passphrase, salt, iterations)
    }

    const toggleAdvanced = el => e => {
      this.model.closeAdvanced = !this.model.closeAdvanced
    }

    const passphraseKeydown = el => e => {
      if (e.keyCode === ENTER_KEY) {
        submit(el)(e)
      }
    }

    const editPassphrase = el => e => {
      this.model.showSubmit = !!el.value
    }

    render(this.attachShadow({ mode: 'open' }), h`
      <${TOP_BAR} onclick=${el => gotoSelectScreen}>
        <${OCTICON} home/>
        <${OCTICON} arrow-left/>
      </${TOP_BAR}>
      <${CONTAINER}>
        <${TITLE} slot="header"><${OCTICON} repo-template/>Create New Repository</${TITLE}>
        <${INFO}><${OCTICON} issue-opened/>Passphrases are NOT saved and can NOT be recovered!</${INFO}>
        <${PASSPHRASE} oninput=${editPassphrase} onkeydown=${passphraseKeydown}/>
        ${showIfElse(() => this.model.showSubmit, h`
          <${BUTTON} onclick=${submit}><${OCTICON} repo slot="icon"/>Create Repository</${BUTTON}>
        `)}
        <${CONTAINER} ${() => this.model.closeAdvanced ? 'closed' : null}>
          <${HEADER} slot="header" onclick=${toggleAdvanced}>
            <${OCTICON} style="width: 10px;" ${() => this.model.closeAdvanced ? 'chevron-right' : 'chevron-down'}/>
            <${OCTICON} gear/>
            Advanced
          </${HEADER}>
          <${INFO}><${OCTICON} info/>Cryptopotamus uses PBKDF2 to turn passphrases into cryptographic keys and make attacks against passphrases more difficult. A random "Salt" value and "Iterations" count are used by PBKDF2 to change the strength of the result. Neither value is a secret and both are stored as cleartext in saved repositories.</${INFO}>
          <${SALT}/>
          <${ITERATIONS}/>
        </${CONTAINER}>
      </${CONTAINER}>
      <${BOTTOM_BAR}/>
    `)
  }
}
