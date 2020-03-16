/* global describe it */

import { h, render } from '/unpkg/horseless/horseless.js'

const sandbox = document.querySelector('#sandbox')

it('basic rendering', function () {
})

describe('nest', function () {
  describe('again', function () {
    this.timeout(5000)
    it('sandbox', function () {
      render(sandbox, h`test<span b="a">asdf</span>`)
    })
  })
})
