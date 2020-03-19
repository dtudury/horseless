/* global describe it chai */

// import { assert } from '/unpkg/chai/chai.js'
import { h, render, proxy, after } from '/unpkg/horseless/horseless.js'

const assert = chai.assert

const sandbox = document.querySelector('#sandbox')

function afterUpdate () {
  return new Promise(resolve => {
    after(resolve)
  })
}

describe('horseless', function () {
  this.timeout(5000)
  it('sandbox', async function () {
    const p = proxy({ a: 'a' })
    render(sandbox, h`test<span id="attribute-test" a="${() => p.a}">asdf</span>`)
    const a = document.querySelector('#attribute-test').attributes.a
    assert.equal(a.value, 'a')
    p.a = 'b'
    assert.equal(a.value, 'a')
    await afterUpdate()
    assert.equal(a.value, 'b')
  })
})
