import { h, render } from '../lib/index.js'

const astronaut = 'Dave'
const obj = { feeling: 'not sorry' }
const descriptions = h`I'm <custom-element actually=${obj}>sorry</custom-element> ${astronaut}, I'm afraid I can't do that`
console.log(JSON.stringify(descriptions, null, '  '))

render(document.querySelector('.output'), h`${JSON.stringify(descriptions, null, '  ')}`)

// this renders h.js into the html pre tag and isn't really part of the example
// ----------------------------------------------------------------------------
window.fetch('h.js').then(res => res.text()).then(text => {
  render(document.querySelector('.source'), h`${text}`)
})
