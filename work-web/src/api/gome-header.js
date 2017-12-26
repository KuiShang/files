import fetch from '@/config/fetch'
import urls from './urls.js'
import { adaptFetch } from '@/config/adapt'

export let userInfo = (options) => {
	let res = fetch.get(urls.userInfo, options)
	return res
}

export let accessAuthorize = (options) => {
	let res = adaptFetch('accessAuthorize', options)
	return res
}

export let noticeNum = (options) => {
	let res = fetch.get(urls.noticeNum, options)
	return res
}

export let logout = (options) => {
	let res = fetch.get(urls.logout, options)
	return res
}

export let userDetail = (options) => {
	let res = fetch.get(urls.userDetail, options)
	return res
}