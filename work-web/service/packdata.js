const urlParse = require('./urlParse')
module.exports = (req, res, next) => {
	let obj = {}
	let url = req.originalUrl
	let query = urlParse.parse(url)
	if (/_page/gi.test(url)) {
		//获取分页相关参数
		let pageNo = query['_page'] || 1
		let pageSize = query['_limit'] || 20
   	    let totalRecord = parseInt(JSON.stringify(res._headers['x-total-count']))
		let totalPage = Math.ceil(totalRecord / pageSize)
		//由于傻逼后端的分页数据结构提供了三种，so模拟三种
		if(/\/notice\//gi.test(url)) {
			obj = {
				"code": 0,
				"msg": "OK",
				"data": {
					"currentPage": pageNo,
					"pageCount": totalPage,
					"pageSize": pageSize,
					"start": (pageNo - 1) * pageSize,
			      "total": totalRecord,
			      "totalCount": totalRecord,
			      "list": res.locals.data
				}
		   }
		} else if(/\/staff\//gi.test(url)) {
			obj = {
				"code": 0,
				"msg": "OK",
				"data": {
					"page": {
						"pageNo": pageNo,
						"pageSize": pageSize,
						"totalRecord": totalRecord,
						"totalPage": totalPage,
						"paraJson": "{}",
						"paraListJson": "{}"
					},
					"list": res.locals.data
				}
			}
		}else if(/approve\/act\/view/gi.test(url) || /approve\/act\/view/gi.test(url) || /approve\/add/gi.test(url) || /approve/gi.test(url)) {
			//获取参数
			obj = {
				"code": 0,
				"msg": "OK",
				"data" : res.locals.data[0]
			}
		} else {
			obj = res.locals.data
		}
		res.jsonp(obj)
	} else {
		res.jsonp(res.locals.data)
	}
}