import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const model = proxy({ seconds: 0 })
setInterval(() => model.seconds++, 1000)

render(document.querySelector('.count'), h`
  <span>seconds running: ${() => model.seconds.toString()}</span>
`)

// this renders proxy.js into the html pre tag and isn't really part of the example
// ----------------------------------------------------------------------------------
window.fetch('proxy.js').then(res => res.text()).then(text => {
  render(document.querySelector('pre'), h`${text}`)
})
