import { model } from '../model.js'
import { screens } from '../constants.js'
import { db } from '../db.js'

export async function gotoSelectScreen () {
  model.state = {
    screen: screens.LOADING
  }
  Object.assign((await db).transaction(['repos']).objectStore('repos').getAllKeys(), {
    onsuccess: function (event) {
      model.state = {
        screen: screens.SELECT,
        repoList: event.target.result
      }
    }
  })
}
