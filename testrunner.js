const puppeteer = require('puppeteer')
const pti = require('puppeteer-to-istanbul')
const app = require('./server')

const server = app.listen()
const port = server.address().port

  ; (async function () {
    const browser = await puppeteer.launch()
    /*
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100
    })
    */
    const page = await browser.newPage()
    await page.goto(`http://localhost:${port}/test/`)
    await page.coverage.startJSCoverage()
    const count = await page.evaluate(() => {
      return runTests()
    })
    console.log(count)
    // await page.waitFor(100)
    const jsCoverage = await page.coverage.stopJSCoverage()
    pti.write(jsCoverage.filter(item => item.url.match(/\/horseless/)))
    await browser.close()
    server.close()
    process.exitCode = count.failed
  })()
