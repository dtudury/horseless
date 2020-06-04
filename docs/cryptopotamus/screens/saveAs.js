import { h } from '/unpkg/horseless/horseless.js'
import { model, saveRepo } from '../model.js'

const saveRepoAs = el => e => {
  e.preventDefault()
  const data = new window.FormData(el)
  model.name = data.get('reponame')
  saveRepo('add')
}

export const saveAs = h`
  <h2>Save Repository</h2>
  <form onsubmit=${saveRepoAs}>
    <label for="reponame">Repository Name:</label>
    <input type="text" id="reponame" name="reponame" required>
    <input type="submit" value="SAVE">
  </form>
`
