import { proxy } from '/unpkg/horseless/horseless.js'
import { WORKING } from './constants.js'

export const model = window.model = proxy({
  page: WORKING
})
