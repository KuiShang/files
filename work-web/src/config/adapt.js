import _ from 'underscore'
import urls from '@/api/urls.js'
import fetch from '@/config/fetch'


// 不同API环境的params转换关系对象
let relations = {}
if(process.env.DATA_ENV === 'mock') {
	relations = {
		'pageNo': '_page',
		'pageSize': '_limit'
	}
} else if (process.env.DATA_ENV === 'dev') {
	relations = {

	}
}

/*
 * 组装api无需自定义的params
 * keys api配置的params的键集合
 * options 业务对象(包含api的params所需要的所有信息)
 */
function packParams(keys, options) {
	let params = {}
	for(let key in options) {
		if(keys.indexOf(key) === -1) {
			continue
		}
		if(Object.keys(relations).indexOf(key) > -1) {
			params[relations[key]] = options[key]
		} else {
			params[key] = options[key]
		}
	}
	return params
}
/*
 * api配置调用相关信息
 * apiKey api配置的键
 * options 业务对象(包含api的params所需要的所有信息)
 * custom api的params中需要自定义部分的对象
 * other request设置的其他信息对象 例如header等
 */
export let adaptFetch = function(apiKey, options, custom, other) {
	let api = urls[apiKey]
	let url = api.url
	if(api.pathById) {//path contain id?
		let flag = api.url.lastIndexOf('/') === api.url.length - 1
		url = api.url + (flag ? '' : '/') + options[api.pathById]
	}
	let params
	if(api.nojson){
		params = options
	}else{
		params = (api.keys && api.keys.length > 0) ? packParams(api.keys, options) : {}
	}
	//merge custom
	if(custom && Object.keys(custom).length > 0) {
		params = _.extend({}, params, custom);
	}

	let method = api.method.toLowerCase()
	if(params || Object.keys(params).length > 0 ) {
		if(method === 'get'){
			return fetch[method](url,{ params: params })
		}else{
			return fetch[method](url, params, other)
		}
		//return fetch[method](url, method === 'get' ? { params: params } : params,other)
	}
	return fetch[method](url)
}

