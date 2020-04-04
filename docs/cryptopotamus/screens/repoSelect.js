
import { h, mapEntries, showIfElse } from '/unpkg/horseless/horseless.js'
import { iconRepo, iconRepoPush, iconRepoTemplate, iconDatabase, iconRepoClone, iconArrowRight } from '../icons.js'
import { CREATE_NEW_REPO, DECRYPT } from '../constants.js'
import { model } from '../model.js'

const newRepo = el => e => {
  model.page = CREATE_NEW_REPO
}

const selectRepo = el => e => {
  model.name = el.attributes.name.value
  model.page = DECRYPT
}

const savedRepos = mapEntries(() => model.repoList,
  reponame => h`
    <div class="file line" onclick=${selectRepo} name=${reponame}>
      ${iconRepo}
      <span>${reponame}</span>
      ${iconArrowRight({ class: 'hover' })}
    </div>
  `
)

export const repoSelect = h`
  <hr>
  <h2 class="line">
    <span></span>
    ${iconRepoClone}
    <span>Repositories</span>
    <span></span>
  </h2>
  <div class="nesting">
    <div class="nested">
      <div class="bracket" style="left: 16px; z-index: 1;"></div>
      <div class="file line" onclick=${newRepo}>
        ${iconRepoTemplate}
        <span>New Repository</span>
        ${iconArrowRight({ class: 'hover' })}
      </div>
      <div class="file line" onclick=${newRepo}>
        ${iconRepoPush}
        <span>Upload Repository</span>
        ${iconArrowRight({ class: 'hover' })}
      </div>
      ${showIfElse(() => model.repoList.length, h`
        <div class="nesting">
          <h3 class="line">${iconDatabase}<span>Saved Repositories:</span></h3>
          <div class="nested">
            <div class="bracket" style="left: 21px;"></div>
            ${savedRepos}
          </div>
        </div>
      `)}
    </div>
  </div>
  <hr>
`
