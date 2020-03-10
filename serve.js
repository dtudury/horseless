const express = require('express')
const app = express()
const port = 5000

app.use('/unpkg', express.static('node_modules'))
app.use(express.static('breakdown'))

console.log(`starting app on port ${port}`)
app.listen(port)
