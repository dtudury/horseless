
import { h, mapEntries, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconRepo, iconRepoPush, iconRepoTemplate, iconRepoClone } from '../icons.js'
import { header, link } from './lineBuilder.js'
import { CREATE_NEW_REPO, DECRYPT, CONTAINER } from '../constants.js'
import { model } from '../model.js'

const newRepo = el => e => {
  model.page = CREATE_NEW_REPO
}

const savedRepos = mapEntries(() => model.repoList, reponame => {
  const selectRepo = el => e => {
    model.name = reponame
    model.page = DECRYPT
  }
  return link(reponame, iconRepo, selectRepo)
})

export const repoSelect = h`
  <${CONTAINER}>
    ${header('Select Repository', iconRepoClone, 'h2')}
    ${link('New Repository', iconRepoTemplate, newRepo)}
    ${link('Upload Repository', iconRepoPush, newRepo)}
    ${showIfElse(() => model.repoList.length, h`
      <${CONTAINER} collapsible>
        ${header('Saved Repositories:', iconRepoClone, 'h3')}
        ${savedRepos}
      </${CONTAINER}>
    `)}
  </${CONTAINER}>
`
