import axios from 'axios'
import main from '../main'
//请求之前拦截处理
axios.interceptors.request.use((req) => {
	if (process.env.DATA_ENV) {
		req.url = '/api' + req.url
	}
	if (process.env.DATA_ENV === 'mock') {
		let type = req.headers['Content-Type']
		if (type && type.indexOf('application/x-www-form-urlencoded') > -1) {
			return req
		}
		let params = null
		let method = req.method.toLowerCase()
		if (method === 'get') {
			params = req.params
		} else if (method === 'post') {
			params = req.data
		}
		if (!params) {
			return req
		}
		//处理Json-server需要识别的字段		
		let obj = rewriteField(params, req)
		if (method === 'get') {
			req.params = obj
		} else if (method === 'post') {
			req.data = obj
		}
	}
	return req
}, (err) => {
	return Promise.reject(err)
})
//响应之后拦截处理
axios.interceptors.response.use((res) => {
	let code = res.data.code
	if (code === 0) {
		// 正确不作处理
	} else if (code < 10999) {
		// TODO：系统级的错误提示
		alert('SYS ERROR ' + code);
	} else if (code < 11999) {
		// TODO：系统级的错误提示
		alert('SYS ERROR ' + code);
	} else if (code < 12999 || code === 12011) {
		// 分支3.5：登录相关的错误
		main.$router.push('/entry/login')
	}
	return res
}, (err) => {
	return Promise.reject(err)
})

/*
 *修改Json-server识别的字段
 *params {Object} 传递的参数
 *req {Object} 请求报文对象
 *return 返回处理后的对象
 */
function rewriteField(params, req) {
	let obj = {}
	let staffFlag = req.url.indexOf('staff/list') > -1
	for (let key in params) {
		if (key === 'pageNo') {
			obj['_page'] = params[key]
		} else if (key === 'pageSize') {
			obj['_limit'] = params[key]
		} else if (staffFlag && key === 'deptId') {
			obj[key + 's_like'] = ',' + params[key] + ','
		} else if (staffFlag && key === 'staffName') {
			obj[key + '_like'] = params[key]
		} else {
			obj[key] = params[key]
		}
	}
	return obj
}

export default axios