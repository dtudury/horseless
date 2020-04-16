/* global describe it chai */

import { h } from '/unpkg/horseless/horseless.js'

const assert = chai.assert

describe('h', function () {
  describe('basic decoding', function () {
    it('should parse basic html-like strings', function () {
      assert.deepEqual(h`aaa`, [{ type: 'textnode', value: 'aaa' }])
      const decoded = h`<${0} a="b${0}c" ${0}>d${0}e</>${0}f${0}`
      assert.deepEqual(decoded, [{
        type: 'node',
        tag: 0,
        attributes: [
          {
            type: 'attribute',
            name: 'a',
            value: [{ type: 'part', value: 'b' }, 0, { type: 'part', value: 'c' }]
          },
          0
        ],
        children: [{ type: 'textnode', value: 'd' }, 0, { type: 'textnode', value: 'e' }]
      }, 0, { type: 'textnode', value: 'f' }, 0])
      assert.throws(function () { h`<a/Error` })
    })
    it('should parse html escaped strings', function () {
      const decoded = h`&amp;&apos;&gt;&lt;&quot;<a b="&amp;&apos;&gt;&lt;&quot;"/>`
      assert.equal(decoded[0].value, '&\'><"')
      assert.equal(decoded[1].attributes[0].value[0].value, '&\'><"')
      assert.throws(function () { h`&nope;` })
    })
    it('should parse elements with values for tags and attributes', function () {
      const f = () => 0
      const decoded = h`<${'a'} ${{ b: 'c' }} ${f} />`
      assert.deepEqual(decoded, [{ type: 'node', tag: 'a', attributes: [{ b: 'c' }, f], children: [] }])
      assert.throws(function () { h`<x =y>` })
    })
    it('should parse attributes with interpolated values', function () {
      const decoded = h`<a b="${1} 2 ${3}" c=${4}/>`
      assert.deepEqual(decoded, [{
        type: 'node',
        tag: 'a',
        attributes: [
          { type: 'attribute', name: 'b', value: [1, { type: 'part', value: ' 2 ' }, 3] },
          { type: 'attribute', name: 'c', value: 4 }
        ],
        children: []
      }])
    })
    it('should parse values as elements', function () {
      const decoded = h`${1}<a>${h`<b>c</b>`}</a>${null}`
      assert.equal(decoded[1].children[0][0].children[0].value, 'c')
      assert.equal(decoded.length, 2)
    })
    it('should parse fragment nodes', function () {
      const decoded = h`<>a</>`
      assert.equal(decoded[0].tag, '')
      assert.equal(decoded[0].children[0].value, 'a')
    })
  })
  describe('html special decoding', function () {
    it('should handle boolean attributes', function () {
      const expected = [{ type: 'node', tag: 'a', attributes: [{ type: 'attribute', name: 'b' }], children: [] }]
      assert.deepEqual(h`<a b/>`, expected)
      assert.deepEqual(h`<a b>`, expected)
      assert.deepEqual(h`<a b />`, expected)
      assert.deepEqual(h`<a b >`, expected)
    })
    it('should handle unquoted attributes', function () {
      const expected = [{ type: 'node', tag: 'a', attributes: [{ type: 'attribute', name: 'b', value: 'c' }], children: [] }]
      assert.deepEqual(h`<a b=c/>`, expected)
      assert.deepEqual(h`<a b = c />`, expected)
    })
    it('should handle void elements', function () {
      const decoded = h`<br><hr/></br>`
      assert.equal(decoded.length, 2)
    })
  })
})
