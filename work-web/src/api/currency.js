import fetch from '@/config/fetch'
import urls from './urls.js'
import { adaptFetch } from '@/config/adapt'
export let fetchBaseStaffInfos = (options) => {
	let res = fetch.get(urls.baseStaffInfo, options)
	return res
}
export let fetchLightList = (options) => {
	let res = fetch.get(urls.lightList, options)
	return res
}

export let fetchCacheStaffInfos = (options) => {
	let res = adaptFetch('staffList', options)
	return res
}