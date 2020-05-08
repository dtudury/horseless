import { h, render, proxy } from '/unpkg/horseless/horseless.js'

const results = proxy({
  chained: 'not yet run',
  unchained: 'not yet run'
})
let highWaterMark

const returnTrue = () => {
  highWaterMark = Math.max(highWaterMark, window.performance.memory.usedJSHeapSize)
  return true
}
const arr = (new Array(1000)).fill(0)
const chainLength = 1000
const longChainExpression = `arr.${(new Array(chainLength).fill(0)).map(() => 'filter(returnTrue)').join('.')}.length`

const chained = el => e => {
  console.log(e.target.onclick)
  highWaterMark = 0
  const t0 = new Date()
  eval(longChainExpression)
  const dt = new Date() - t0
  results.chained = `memory "high water mark": ${highWaterMark} bytes, time running: ${dt}ms`
}

const unchained = el => e => {
  console.log(e.target.onclick)
  highWaterMark = 0
  const t0 = new Date()
  let temp = arr
  for (let i = 0; i < chainLength; i++) {
    temp = temp.filter(returnTrue)
  }
  const dt = new Date() - t0
  results.unchained = `memory "high water mark": ${highWaterMark} bytes, time running: ${dt}ms`
}

render(document.body, h`
  <button onclick=${chained}>call chained()</button> results: ${() => results.chained}
  <br>
  <button onclick=${unchained}>call unchained()</button> results: ${() => results.unchained}
`)
