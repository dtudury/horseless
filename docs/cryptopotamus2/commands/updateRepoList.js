import { db } from '../db.js'
import { model } from '../model.js'
import { screens } from '../constants.js'

export async function updateRepoList () {
  Object.assign((await db).transaction(['repos']).objectStore('repos').getAllKeys(), {
    onsuccess: function (event) {
      model.state = {
        screen: screens.SELECT,
        repoList: event.target.result
      }
    }
  })
}
