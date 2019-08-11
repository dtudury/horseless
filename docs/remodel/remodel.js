import { h, render, remodel } from '../lib/index.js'

const model = remodel({ seconds: 0 })
setInterval(() => model.seconds++, 1000)

render(document.querySelector('.count'), h`
  <span>seconds running: ${() => model.seconds.toString()}</span>
`)

// this renders remodel.js into the html pre tag and isn't really part of the example
// ----------------------------------------------------------------------------------
window.fetch('remodel.js').then(res => res.text()).then(text => {
  render(document.querySelector('pre'), h`${text}`)
})
