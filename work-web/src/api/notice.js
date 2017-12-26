import urls from './urls.js'
import { adaptFetch } from '@/config/adapt'

export let fetchNoticeList = (options) => {
	let custom = options.hascollect < 0 ? null : { hascollect: options.hascollect }
	let res = adaptFetch('noticeList', options, custom)
	return res
}

export let fetchNoticeDetail = (options) => {
	/*
	let api = urls.noticeDetail
	let url = api.pathById ? (api.url + options.noticeId) : api.url
	let res = fetch[api.method](url)
	*/
	let res = adaptFetch('noticeDetail', options)
	return res
}

export let fetchNoticeStore = (options) => {
	/*
	let api = urls.noticeStore
	let params = packParams(api.keys, options)
	// 自定义处理的特殊param
	params.hascollect = !!options.hascollect ? 0 : 1
	
	let url = api.pathById ? (api.url + options.id) : api.url
	let res = fetch[api.method](url, params)
	*/
	let custom = {
		hascollect: !!options.hascollect ? 0 : 1
	}
	let res = adaptFetch('noticeStore', options, custom)
	return res
}