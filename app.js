'use strict'
const express = require('express')
const { getLoc, loadList } = require('./util/getLoc')

const app = express()
app.enable('trust proxy')
app.use(express.json({ extended: true }))
const PORT = 3000

const router = new express.Router()

let list

router.get('/getLocation', (req, res) => {
	const IP = req.headers['x-forwarded-for']
		? req.headers['x-forwarded-for'].split(',')[0]
		: req.socket
		? req.socket.remoteAddress
		: req.connection
		? req.connection.remoteAddress
		: null
	list = list || loadList('./util/list/IP2L.CSV')
	const result = getLoc(IP, list)
	return res.status(200).json({
		IP,
		short: result.short,
		full: result.full,
		range: result.range,
	})
})

app.use('/', router)

function start() {
	try {
		app.listen(PORT, () => {
			console.log(`Server has been started at port: ${PORT}\n`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()
