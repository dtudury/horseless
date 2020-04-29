import { h, render, showIfElse, mapEntries } from '/unpkg/horseless/horseless.js'
import { model } from '../../model.js'
import { TOP_BAR, BOTTOM_BAR, CONTAINER, TITLE, LINK, HEADER, OCTICON } from '../tags.js'
import { gotoNewRepository } from '../../commands/gotoNewRepository.js'
import { gotoUploadRepository } from '../../commands/gotoUploadRepository.js'
import { gotoSavedRepository } from '../../commands/gotoSavedRepository.js'

export function defineSelectRepoScreen (name) {
  window.customElements.define(name, SelectRepoScreen)
  return name
}

const savedRepos = mapEntries(() => model.state.repoList, reponame => {
  const selectRepo = el => e => {
    gotoSavedRepository(reponame)
  }
  return h`<${LINK} onclick=${selectRepo}><${OCTICON} repo slot="icon"/>${reponame}</${LINK}>`
})

const toggleSavedRepos = el => e => {
  model.state.closeSavedRepos = !model.state.closeSavedRepos
}

class SelectRepoScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <${TOP_BAR}/>
      <${CONTAINER}>
        <${TITLE} slot="header"><${OCTICON} home/>Select Repository</${TITLE}>
        <${LINK} onclick=${el => gotoNewRepository}><${OCTICON} repo-template slot="icon"/>New Repository</${LINK}>
        <${LINK} onclick=${el => gotoUploadRepository}><${OCTICON} repo-push slot="icon"/>Upload Repository</${LINK}>
        ${showIfElse(() => (model.state.repoList && model.state.repoList.length), h`
          <${CONTAINER} ${() => model.state.closeSavedRepos ? 'closed' : null}>
            <${HEADER} slot="header" onclick=${toggleSavedRepos}>
              <${OCTICON} style="width: 10px;" ${() => model.state.closeSavedRepos ? 'chevron-right' : 'chevron-down'}/>
              <${OCTICON} database/>
              Saved Repositories:
            </${HEADER}>
            ${savedRepos}
          </${CONTAINER}>
        `)}
      </${CONTAINER}>
      <${BOTTOM_BAR}/>
    `)
  }
}
