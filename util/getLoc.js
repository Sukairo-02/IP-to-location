const fs = require('fs')

function loadList(path) {
	const list = fs.readFileSync(path, { encoding: 'utf-8' }).split('\r\n')
	list.pop()
	return list.map((e) => e.split(','))
}

function killQuotes(str) {
	return str.substring(1, str.length - 1)
}

function ip2int(ip) {
	return (
		ip.split('.').reduce(function (ipInt, octet) {
			return (ipInt << 8) + parseInt(octet, 10)
		}, 0) >>> 0
	)
}

function getLoc(IP, list) {
	if (IP[0] === ':') {
		IP = '127.0.0.1'
	}

	let ipNum = ip2int(IP)

	let [l, h] = [0, list.length - 1]
	let i = h / 2
	let [beg, end] = [
		parseInt(killQuotes(list[i][0])),
		parseInt(killQuotes(list[i][1])),
	]

	while (ipNum < beg || ipNum > end) {
		if (ipNum < beg) {
			h = i
			i = ~~(h / 2)
		} else {
			l = i
			i = ~~((h - l) / 2) + l
		}
		;[beg, end] = [
			parseInt(killQuotes(list[i][0])),
			parseInt(killQuotes(list[i][1])),
		]
	}

	return {
		short: killQuotes(list[i][2]),
		full: killQuotes(list[i][3]),
		range: [killQuotes(list[i][0]), killQuotes(list[i][1])],
	}
}

module.exports = { getLoc, loadList }
