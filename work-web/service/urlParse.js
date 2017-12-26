const build_url = require('url')
function parse(url) {
	let obj = {}
	let query = build_url.parse(url).query
	if(!query) {
		return obj
	}
	let querys = query.split('&')
	for(let i = 0, length = querys.length; i < length; i++) {
		let item = querys[i].split('=')
		obj[item[0]] = item[1]
	}
	return obj
}
module.exports = {
	parse: parse
}