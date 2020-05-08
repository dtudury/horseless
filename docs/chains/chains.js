import { h, render, proxy } from 'https://unpkg.com/horseless@0.3.0/dist/horseless.min.esm.js'

const results = proxy({
  chained: 'not yet run (click button and wait a bit)',
  unchained: 'not yet run (click button and wait a bit)'
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
  eval(longChainExpression) // eslint-disable-line no-eval
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
  chained() does something like arr.filter(...).filter(...).filter(...)...
  <br>
  <button onclick=${chained}>call chained()</button>
  <br>
  results: ${() => results.chained}
  <br>
  <br>
  unchained() does something like arr = arr.filter(...); arr = arr.filter(...);...
  <br>
  <button onclick=${unchained}>call unchained()</button>
  <br>
  results: ${() => results.unchained}
  <br>
  <br>
  <a href="./chains.js">(script)</a>
`)
