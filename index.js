'use strict'

const express = require('express')
const path = require('path')

const app = express()
app.use('/build', express.static(path.join(__dirname, 'build')))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
app.listen(8888, function (err) {
	if (err) throw err
	console.log('Listening on port', 8888)
})
