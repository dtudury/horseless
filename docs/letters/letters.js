
import { render } from '/unpkg/horseless/horseless.js'

// const letters = 'ETAOINSRHDLUCMFYWGPBVKXQJZ'
const letters = 'pqdb'
// const r = Math.floor(Math.pow(Math.random(), 3) * letters.length)
// const letters = 'g'
const r = Math.floor(Math.pow(Math.random(), 1) * letters.length)
let letter = letters[r].toLowerCase()
/*
if (Math.random() > 0.5) {
  letter = letter.toLowerCase()
}
*/

render(document.body, letter)
