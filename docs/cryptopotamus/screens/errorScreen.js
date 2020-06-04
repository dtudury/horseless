
import { h } from '/unpkg/horseless/horseless.js'
import { model } from '../model.js'

export const errorScreen = h`
  <h2>${model.errorName}</h2>
  ${model.errorMessage}
`
