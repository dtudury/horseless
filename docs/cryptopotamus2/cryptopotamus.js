import { h, render } from '/unpkg/horseless/horseless.js'
import { SITE_TITLE, MAIN_APP } from './components/tags.js'
import { updateRepoList } from './commands/updateRepoList.js'

updateRepoList()

render(document.body, h`
  <${SITE_TITLE}>cryptopotamus</${SITE_TITLE}>
  <${MAIN_APP}/>
`)
