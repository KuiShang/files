/*
 * @Author: shangkui 
 * @Date: 2017-10-27 15:18:58 
 * @Last Modified by: shangkui
 * @Last Modified time: 2017-11-07 20:00:07
 */
import { adaptFetch } from '@/config/adapt'

//生成一张 图片验证码,这个接口是以文件形式访问服务端，所以没有返回值，不能按照一般的的ajax访问
export let getCaptchaPicUrl = (options) => {
    let url = `http://10.112.178.22/v1/user/send_pic_captcha?uuid=${options.uuid}&time=${options.time}`
	return url
}
//获取手机验证码
export let acquireSmsCaptcha =  (options) => {
    let res = adaptFetch('acquireSmsCaptcha', options)
	return res
}
//校验手机号、图形验证码、短信验证码
export let validateRegisterInfo =  (options) => {
    let res = adaptFetch('validateRegisterInfo', options)
	return res
}
//创建公司 - 设置密码
export let setRegisterPassword =  (options) => {
    let res = adaptFetch('setRegisterPassword', options)
	return res
}
//创建公司
export let registerCompany =  (options) => {
    let res = adaptFetch('registerCompany', options)
	return res
}
//找回密码
export let setRetsetPassword =  (options) => {
    let res = adaptFetch('setRetsetPassword', options)
	return res
}
//校验手机号、图形验证码、短信验证码
export let verifySmsCaptcha =  (options) => {
    let res = adaptFetch('verifySmsCaptcha', options)
	return res
}
//修改密码
export let modifyPassword =  (options) => {
    let res = adaptFetch('modifyPassword', options)
	return res
}







