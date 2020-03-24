const express = require('express')
const app = express()

app.use('/unpkg/horseless/', express.static('.'))
app.use('/unpkg/', express.static('node_modules'))
app.use(express.static('docs'))

module.exports = app

if (require.main === module) {
  const port = +process.argv[2]
  const server = app.listen(port || undefined)
  console.log(`app started on port ${server.address().port}`)
}
