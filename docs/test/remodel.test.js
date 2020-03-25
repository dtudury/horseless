/* global requestAnimationFrame describe it chai */

import { proxy, watchFunction, unwatchFunction, after } from '/unpkg/horseless/horseless.js'

const assert = chai.assert

function afterUpdate () {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

describe('proxy', function () {
  it('should handle basic property manipulation', function () {
    const p = proxy()
    assert.equal('a' in p, false)
    assert.equal(Object.keys(p).length, 0)
    p.a = 1
    assert.equal('a' in p, true)
    assert.equal(p.a, 1)
    assert.equal(Object.keys(p).length, 1)
    p.a = 2
    assert.equal(p.a, 2)
    delete p.a
    assert.equal('a' in p, false)
    assert.equal(Object.keys(p).length, 0)
  })
  it('should notify watching function when array or object changed', async function () {
    const p = proxy({ a: [], o: {} })
    const values = []
    function f () {
      values.push([p.a.length, Object.keys(p.o).length])
    }
    watchFunction(f)
    p.a.push(1)
    await afterUpdate()
    p.a.push(2)
    await afterUpdate()
    p.o.a = true
    await afterUpdate()
    p.o.a = false
    await afterUpdate()
    p.o.b = true
    await afterUpdate()
    p.a.push(3)
    await afterUpdate()
    delete p.o.a
    await afterUpdate()
    assert.deepEqual(values, [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [3, 2], [3, 1]])
  })
  it('should notify watching function when value changed', async function () {
    const p = proxy({ a: 1, b: { a: 1 }, c: 1 })
    const acValues = []
    const cValues = []
    function f1 () {
      acValues.push([p.a, p.c])
      void (p.a)
    }
    function f2 () {
      cValues.push([p.c, p.b.a])
    }
    watchFunction(f1)
    watchFunction(f1)
    watchFunction(f2)
    p.b.b = { a: 1 }
    await afterUpdate()
    p.b.a = 2
    p.c = 2
    await afterUpdate()
    p.a = 1
    await afterUpdate()
    p.a = 2
    await afterUpdate()
    p.c = 3
    await afterUpdate()
    delete p.a
    await afterUpdate()
    delete p.a
    await afterUpdate()
    unwatchFunction(f1)
    await afterUpdate()
    p.a = 4
    await afterUpdate()
    assert.deepEqual(acValues, [[1, 1], [1, 2], [2, 2], [2, 3], [undefined, 3]])
    assert.deepEqual(cValues, [[1, 1], [2, 2], [3, 2]])
  })
  it('should handle after events', async function () {
    const p = proxy()
    const logs = []
    watchFunction(() => {
      logs.push(`x: ${p.x}`)
    })
    watchFunction(() => {
      logs.push(`keys: ${JSON.stringify(Object.keys(p))}`)
    })
    after(() => {
      logs.push(`after ${JSON.stringify(p)}`)
    })
    await afterUpdate()
    p.x = 1
    await afterUpdate()
    p.x = 2
    await afterUpdate()
    assert.deepEqual(logs, [
      'x: undefined',
      'keys: []',
      'keys: ["x"]',
      'x: 1',
      'after {"x":1}',
      'x: 2'
    ])
  })
})
