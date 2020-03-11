/* global before after describe it */

// import { assert } from 'chai'
import puppeteer from 'puppeteer'
import { h, render } from '../breakdown/index.js'

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
  it('sandbox', async function () {
    const content = await page.content()
    console.log(content)
    render(content.body, h`test`)
    await page.waitFor(10)
    console.log(content)
  })
})
