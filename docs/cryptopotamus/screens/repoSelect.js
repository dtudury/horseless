
import { h, mapEntries, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconRepo, iconRepoPush, iconRepoTemplate, iconDatabase, iconRepoClone, iconArrowRight } from '../icons.js'
import { h2, link, h3 } from './screenBuilder.js'
import { CREATE_NEW_REPO, DECRYPT, CONTAINER, LINE } from '../constants.js'
import { model } from '../model.js'

const newRepo = el => e => {
  model.page = CREATE_NEW_REPO
}


const savedRepos = mapEntries(() => model.repoList, reponame => {
  const selectRepo = el => e => {
    model.name = reponame
    model.page = DECRYPT
  }
  return h`
    <${LINE} onclick=${selectRepo}>
      ${link(reponame, iconRepo)}
    </${LINE}>
  `
})

export const repoSelect = h`
  <${CONTAINER}>
    <${LINE} slot="header">
      ${h2('Select Repository', iconRepoClone)}
    </${LINE}>
    <${LINE} onclick=${newRepo}>
      ${link('New Repository', iconRepoTemplate)}
    </${LINE}>
    <${LINE} onclick=${newRepo}>
      ${link('Upload Repository', iconRepoPush)}
    </${LINE}>
    ${showIfElse(() => model.repoList.length, h`
      <${CONTAINER} collapsible>
        <${LINE} slot="header">
          ${h3('Saved Repositories', iconRepoClone)}
        </${LINE}>
        ${savedRepos}
      </${CONTAINER}>
    `)}
  </${CONTAINER}>
`
