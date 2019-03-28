/* global customElements */
import h, { setChildren } from '../lib'
import SlotTest from './elements/SlotTest'
import CustomizedTest from './elements/CustomizedTest'

const configuration = { background: 'lightgreen', color: 'darkgreen' }
const st = 'slot-test'
customElements.define(st, SlotTest)
customElements.define('customized-test', CustomizedTest, { extends: 'div' })

let textNode = h`${st} ${st} ${st} text node`
let aa = h`${[h`a`, h`a`]}`
let bb = h`${[h`b`, h`b`]}`

setChildren(document.body, h`
  <svg version='1.1' baseProfile='full' width='300' height='200' viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'>
    <>
      <rect width='100%' height='100%' fill='red' />
      <circle cx='150' cy='100' r='80' fill='green' />
      <text x='150' y='125' font-size='60' text-anchor='middle' fill='white'>SVG</text>
    </>
  </svg >

  <${st} config=${configuration}><b slot='test'>thrilling bold text</b></${st}>

  <slot-test config=${{ background: 'black', color: 'white' }}><i slot='test'>fascinating italic text</i></slot-test>

  ${textNode}
  &amp;
  &quot;
  &apos;
  &lt;
  &gt;
  <div is='customized-test' a='1' b='1'><i>This is a customized div, it console.log's itself on click</i></div>

  ${[aa, bb]}
`)
