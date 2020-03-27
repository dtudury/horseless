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

function attributesToObject (attributes) {
  const obj = {}
  for (let i = 0; i < attributes.length; i++) {
    obj[attributes[i].name] = attributes[i].value
  }
  return obj
}

describe('horseless', function () {
  it('returns an array of nodes when passed descriptions only', async function () {
    assert.instanceOf(render(h`abc`)[0], Text)
  })
  it('assigns functions', function () {
    function f1 () { }
    function f2 () {
      return f1
    }
    const element = h`<hr a="${f2}" b=${f2}>`
    render(sandbox, element)
    assert.equal(sandbox.firstChild.a, f1)
    assert.equal(sandbox.firstChild.b, f1)
  })
  it('renders attributes', function () {
    render(sandbox, h`
      <hr a=b c="d" e=${'f'} g ${'h'} ${null}>
      <hr ${['a', 'b']} ${{ c: 'd', e: 'f' }} ${() => 'g'}>
    `)
    assert.deepEqual({ a: 'b', c: 'd', e: 'f', g: 'g', h: 'h' }, attributesToObject(sandbox.children[0].attributes))
    assert.deepEqual({ a: 'a', b: 'b', c: 'd', e: 'f', g: 'g' }, attributesToObject(sandbox.children[1].attributes))
  })
  it('renders lack-of attributes', function () {
    render(sandbox, h`
      <hr ${null} a="z${null}z">
    `)
    assert.deepEqual(attributesToObject(sandbox.firstElementChild.attributes), { a: 'zz' })
  })
  it('updates attributes', async function () {
    const p = proxy({ a: 'a', b: 'b' })
    render(sandbox, h`test<span a="x-${() => p.a}" ${() => p.b || null}>asdf</span>`)
    const a = sandbox.firstElementChild.attributes.a
    const b = sandbox.firstElementChild.attributes.b
    assert.equal(a.value, 'x-a')
    assert(sandbox.firstElementChild.hasAttribute('b'))
    assert.equal(b.value, 'b')
    p.a = 'b'
    assert.equal(a.value, 'x-a')
    delete p.b
    await afterUpdate()
    assert.equal(a.value, 'x-b')
    assert(!sandbox.firstElementChild.hasAttribute('b'))
  })
  it('uses first of duplicate attributes', function () {
    render(sandbox, h`<hr a=1 a=1 ${'a'} ${{ a: 3 }}>`)
    assert.deepEqual(attributesToObject(sandbox.firstChild.attributes), { a: '1' })
  })
  it('handles svg', function () {
    render(sandbox, h`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50"/></svg>`)
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
    it('handles functions that return objects', async function () {
      const p = proxy([1, 2, 3, 4, 5, 6])
      render(sandbox, mapEntries(() => p.filter(v => v % 2), (value, name) => {
        return h`<div><span>value: ${value}</span> <span>name: ${name}</span></div>`
      }))
      assert.equal(sandbox.childElementCount, 3)
      p.splice(6, 0, 7, 8, 9)
      await afterUpdate()
      assert.equal(sandbox.childElementCount, 5)
      p.splice(0)
      await afterUpdate()
      assert.equal(sandbox.childElementCount, 0)
    })
  })
})
