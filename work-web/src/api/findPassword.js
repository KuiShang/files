import { adaptFetch } from '@/config/adapt'
import urls from './urls.js'
export let sendSmsCaptcha = (options) => {
	let res = adaptFetch('sendSmsCaptcha', options, {}, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	   	}
	})
	return res
}

export let verifyPwdSmsCaptcha = ( options ) => {
	let res = adaptFetch('verifyPwdSmsCaptcha', options, {}, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	   	}
	})
	return res
}