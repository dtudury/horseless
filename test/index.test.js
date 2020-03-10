/* global before after describe it */

import { assert } from 'chai'
import puppeteer from 'puppeteer'

let browser
let page

describe('render', function () {
  this.timeout(5000)
  before(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100
    })
    page = await browser.newPage()
  })

  after(() => {
    if (!process.env.DEBUG) {
      browser.close()
    }
  })
  it('sandbox', async function (done) {
    console.log(page)
    done()
  })
})
