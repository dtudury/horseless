/* global before after describe it */

import { h, render } from '/unpkg/horseless/horseless.js'

const sandbox = document.querySelector('#sandbox')

it('top level', function () {
  console.log('maybe')
  // throw new Error('asdf')
})

describe('nest', function () {
  describe('again', function () {
    this.timeout(5000)
    it('sandbox', function () {
      render(sandbox, h`test<span b="a">asdf</span>`)
    })
  })
})
