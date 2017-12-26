import fetch from '@/config/fetch'
import urls from './urls.js'
import { adaptFetch } from '@/config/adapt'

export let fetchDeptlist = (options) => {
	let res = fetch.get(urls.deptList, options)
	return res
}

export let fetchStafflist = (options) => {
	let res = adaptFetch('staffList', options.params)
	return res
}

export let fetchStaffDetail = (options) => {
	let res = adaptFetch('staffDetail', options)
	return res
}

/*export let searchStaffList = (options) => {
	let res = fetch.post(urls.staffList, options)
	return res
}

export let searchStaffList = (options) => {
	let res = adaptFetch('staffList', options)
	return res
}*/