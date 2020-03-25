/* global describe it chai Text */

// import { assert } from '/unpkg/chai/chai.js'
import { h, mapConditional, mapEntries, render, proxy, after } from '/unpkg/horseless/horseless.js'

const assert = chai.assert

const sandbox = document.querySelector('#sandbox')

function afterUpdate () {
  return new Promise(resolve => {
    after(resolve)
  })
}

describe('horseless', function () {
  this.timeout(5000)
  it('returns an array of nodes when passed descriptions only', async function () {
    assert.instanceOf(render(h`abc`)[0], Text)
  })
  it('updates attributes', async function () {
    const p = proxy({ a: 'a' })
    render(sandbox, h`test<span id="attribute-test" a="x-${() => p.a}">asdf</span>`)
    const a = document.querySelector('#attribute-test').attributes.a
    assert.equal(a.value, 'x-a')
    p.a = 'b'
    assert.equal(a.value, 'x-a')
    await afterUpdate()
    assert.equal(a.value, 'x-b')
  })
  it('handles svg', function () {
    render(sandbox, h('http://www.w3.org/2000/svg')`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>`)
    assert.equal(document.querySelector('circle').getPointAtLength(0).x, 100)
  })
  it('updates children', async function () {
    const p = proxy([1, 2, 3])
    render(sandbox, h`<ul id="number-list">${() => p.map(n => h`<li>${n}</li>`)}</ul>`)
    const ul = document.querySelector('#number-list')
    assert.equal(ul.childElementCount, 3)
    p.push(4)
    await afterUpdate()
    assert.equal(ul.childElementCount, 4)
  })
  it('wraps single element descriptions in arrays', function () {
    render(sandbox, 'test')
    assert(sandbox.firstChild instanceof Text)
  })
  it('expands fragments', function () {
    render(sandbox, h`<>${[1, 2, 3].map(n => h`<span>${n}</span>`)}</>`)
    assert.equal(sandbox.childElementCount, 3)
  })
  describe('helpers', function () {
    it('handles conditionals', async function () {
      const p = proxy({ v: true })
      render(sandbox, mapConditional(() => p.v, h`<span>true</span>`, h`<span>false</span>`))
      const trueSpan = sandbox.firstChild
      p.v = false
      await afterUpdate()
      assert.notEqual(trueSpan, sandbox.firstChild)
      p.v = true
      await afterUpdate()
      assert.equal(trueSpan, sandbox.firstChild)
    })
    it('handles Objects', async function () {
      const p = proxy([1, 2])
      render(sandbox, mapEntries(p, (value, name) => {
        return h`<div><span>value: ${value}</span> <span>name: ${name}</span></div>`
      }))
      const cn1 = [...sandbox.childNodes]
      p.splice(0, p.length, 2, 1)
      await afterUpdate()
      const cn2 = [...sandbox.childNodes]
      p.splice(0)
      await afterUpdate()
      assert.equal(cn1[0], cn2[1])
      assert.equal(cn1[1], cn2[0])
    })
  })
})
