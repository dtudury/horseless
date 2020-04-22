import { h, render } from '/unpkg/horseless/horseless.js'
import { HEADER_TITLE, MAIN_APP } from './components/components.js'
import { updateRepoList } from './commands/updateRepoList.js'

updateRepoList()

render(document.body, h`
  <${HEADER_TITLE}>cryptopotamus</${HEADER_TITLE}>
  <${MAIN_APP}/>
`)
