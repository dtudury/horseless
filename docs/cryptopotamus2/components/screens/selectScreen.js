import { h, render, showIfElse, mapEntries } from '/unpkg/horseless/horseless.js'
import { model } from '../../model.js'
import { CONTAINER, LINE } from '../components.js'

export function defineSelectScreen (name) {
  window.customElements.define(name, SelectScreen)
  return name
}

const savedRepos = mapEntries(() => model.state.repoList, reponame => {
  const selectRepo = el => e => {
    console.log(reponame)
  }
  return h`<${LINE} onclick=${selectRepo}>${reponame}</${LINE}>` // link(reponame, iconRepo, selectRepo)
})

class SelectScreen extends window.HTMLElement {
  constructor () {
    super()
    render(this.attachShadow({ mode: 'open' }), h`
      <style>
        :host {
          padding: 1rem;
        }
      </style>
      <${CONTAINER}>
        <${LINE} slot="header">Select Repository</${LINE}>
        <${LINE}>New Repository</${LINE}>
        <${LINE}>Upload Repository</${LINE}>
        ${showIfElse(() => (model.state.repoList.length), h`
          <${CONTAINER} collapsible>
            <${LINE} slot="header">Saved Repositories:</${LINE}>
            ${savedRepos}
          </${CONTAINER}>
        `)}
      </${CONTAINER}>
    `)
  }
}
