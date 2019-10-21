import { h, remodel } from '../../lib/index.js'

const model = remodel({
  root: h`<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">`[0]
})

window.model = model

export default model
