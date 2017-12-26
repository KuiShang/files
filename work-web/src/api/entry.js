import fetch from '@/config/fetch'
import { adaptFetch } from '@/config/adapt'
import urls from './urls.js'
import qs from 'qs'
 
export let userLogin = (options) => {
	let res = fetch.post(urls.userLogin, options, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	   }
	})
	return res
}

