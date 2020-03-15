/* global before after describe it */

import { h, render } from '/unpkg/horseless/index.js'

describe('render', function () {
  this.timeout(5000)

  it('sandbox', function () {
    const sandbox = document.querySelector('#sandbox')
    render(sandbox, h`test<span b="a">asdf</span>`)
  })
})
