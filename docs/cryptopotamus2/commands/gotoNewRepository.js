import { model } from '../model.js'
import { screens } from '../constants.js'

export function gotoNewRepository () {
  model.state = {
    screen: screens.NEW_REPO
  }
}
