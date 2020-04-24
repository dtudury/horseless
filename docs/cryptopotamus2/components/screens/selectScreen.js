import { h, render, showIfElse, mapEntries } from '/unpkg/horseless/horseless.js'
import { model } from '../../model.js'
import { TOP_BAR, BOTTOM_BAR, CONTAINER, TITLE, LINK, HEADER, OCTICON } from '../tags.js'
import { gotoNewRepository } from '../../commands/gotoNewRepository.js'
import { gotoUploadRepository } from '../../commands/gotoUploadRepository.js'
import { gotoSavedRepository } from '../../commands/gotoSavedRepository.js'

export function defineSelectScreen (name) {
  window.customElements.define(name, SelectScreen)
  return name
}

const savedRepos = mapEntries(() => model.state.repoList, reponame => {
  const selectRepo = el => e => {
    gotoSavedRepository(reponame)
  }
  return h`<${LINK} onclick=${selectRepo}><${OCTICON} repo/>${reponame}</${LINK}>`
})

class SelectScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <${TOP_BAR}/>
      <${CONTAINER}>
        <${TITLE} slot="header"><${OCTICON} home/>Select Repository</${TITLE}>
        <${LINK} onclick=${el => gotoNewRepository}><${OCTICON} repo-template/>New Repository</${LINK}>
        <${LINK} onclick=${el => gotoUploadRepository}><${OCTICON} repo-push/>Upload Repository</${LINK}>
        ${showIfElse(() => (model.state.repoList && model.state.repoList.length), h`
          <${CONTAINER} collapsible>
            <${HEADER} slot="header"><${OCTICON} database/>Saved Repositories:</${HEADER}>
            ${savedRepos}
          </${CONTAINER}>
        `)}
      </${CONTAINER}>
      <${BOTTOM_BAR}/>
    `)
  }
}
