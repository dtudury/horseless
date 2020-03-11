const express = require('express')
const app = express()
const port = 5000

app.use('/unpkg/horseless/', express.static('lib'))
app.use('/unpkg/', express.static('node_modules'))
app.use(express.static('docs'))

console.log(`starting app on port ${port}`)
app.listen(port)
