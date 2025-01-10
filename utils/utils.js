const crypto = require('crypto')

const generateId = function (length = 16) {
	return crypto.randomBytes(length).toString('hex')
}

module.exports = generateId

