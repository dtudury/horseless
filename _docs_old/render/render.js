import { h, render } from '../lib/index.js'

function fourFiveSix () {
  return h`<div>4</div><div>5</div><div>6</div>`
}

render(document.querySelector('.count'), h`
  <div>0</div>
  <>
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </>
  ${fourFiveSix}
  ${[7, 8, 9].map(v => h`<div>${v}</div>`)}
`)

// this renders render.js into the html pre tag and isn't really part of the example
// ---------------------------------------------------------------------------------
window.fetch('render.js').then(res => res.text()).then(text => {
  render(document.querySelector('pre'), h`${text}`)
})
