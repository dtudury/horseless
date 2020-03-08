const express = require('express')
const app = express()

app.use('/unpkg', express.static('node_modules'))
app.use(express.static('breakdown'))

app.listen(5000)
