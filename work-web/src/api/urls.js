import _ from 'underscore'
let config = {
	'deptList': '/v1/dept/list',
	'staffList': {
		url: '/v1/staff/list',
		method: 'get',
		keys: ['companyId', 'pageNo', 'pageSize', 'deptId', 'staffName']
	},
	'staffDetail': {
		url: '/v1/staff/detail',
		method: 'get',
		keys: ['id']
	},
	'userInfo': '/v1/user/user_info',
	'noticeNum':'/notice/queryUserNoticeMsgCount',
	'logout': '/v1/logout',
	'userDetail': '/v1/staff/detail',
	'userLogin': '/v1/login',
	'approveFormElements2': '/approve/act/view',
	'approveFormFlows': {
		url: '/approve/act/view',
		method: 'get',
		keys: ['flowId', 'companyId', 'key']
	},
	'approveFormElements': {
		url: '/approve/approveForms/view',
		method: 'get',
		keys: ['formId']
	},
	'saveApproveForm': '/approve/add',
   'approveWaitList':{
	    url:'/approve/myTasks',
	    method: 'get',
	    keys: ['pageNo', 'pageSize','startDate','endDate','companyId','ownerId', 'authName']
   },
   'approveFinshedlist': {
		url:'/approve/myFinishedTask',
		method: 'get',
		keys: ['pageNo', 'pageSize','startDate','endDate','companyId','ownerId', 'authName']
   },
   'approveMylis': {
		url:'/approve/list',
		method: 'get',
		keys: ['typeId','companyId']
   },
   'approveDraftList': {
		url:'/approve/list',
		method: 'get',
		keys: ['typeId','companyId']
   },
   'approveArchiveList': {
		url:'/approve/list',
		method: 'get',
		keys: ['typeId','companyId']
   },
	 'accessAuthorize': {
		url: '/v1/access_authorize',
		method: 'get',
		keys: ['companyId']
	 },
	'staffListUrl':
	{
		url:'/v1/staff/list',
		method: 'post',
		keys: ['pageNo', 'pageSize','companyId']
	},
	'myApproveFinshed': {
		url: '/approve/myFinishedTask',
		method: 'get',
		keys: ['pageNo', 'pageSize','startDate','endDate','companyId','ownerId', 'authName']
	 },
	'myApproved': {
		url: '/approve/list',
		method: 'get',
		keys: ['pageNo', 'pageSize','startDate','endDate','companyId','ownerId', 'authName']
	 },
	'noticeList': {
		url: '/notice/queryNoticeStaffInfo',
		method: 'get',
		keys: ['pageNo', 'pageSize']
	},
	'noticeDetail': {
		url: '/notice/queryUserNoticeById/',
		method: 'get',
		pathById: 'noticeId'
	},
	'noticeStore': {
		url: '/notice/collectNotice',
		method: 'put',
		keys: ['id', 'noticeId']
	},
	'acquireSmsCaptcha': {
		url: '/v1/company/acquire_sms_captcha/',
		method: 'post',
		keys: ['uuid', 'mobile', 'pictureCaptcha']
	},
	'validateRegisterInfo': {
		url: '/v1/company/validate_register_info/',
		method: 'post',
		keys: ['mobile', 'smsCaptcha', 'pictureCaptcha', 'uuid']
	},
	'setRegisterPassword': {
		url: '/v1/company/set_register_password/',
		method: 'post',
		keys: ['password', 'verifyPassword', 'uuid']
	},
	'registerCompany': {
		url: '/v1/company/register_company/',
		method: 'post',
		keys: ['companyName', 'scale', 'industry', 'region', 'adminName', 'adminEmail', 'uuid']
	},
	'setRetsetPassword': {
		url: '/v1/user/reset_pwd/',
		method: 'post',
		keys: ['password', 'verifyPassword', 'uuid']
	},
	'verifySmsCaptcha': {
		url: '/v1/user/verify_sms_captcha/',
		method: 'post',
		keys: ['mobile', 'smsCaptcha', 'pictureCaptcha', 'uuid']
	},
	'modifyPassword': {
		url: '/v1/user/modifyPassword/',
		method: 'post',
		keys: ['oldPwd', 'newPwd', 'verifypwd']
	},
	'getViewFormData': {
		url: '/approve/view/',
		method: 'get',
		keys: ['companyId', 'approveId']
	},
	'doApproveTask': {
		url: '/approve/doApproveTask/',
		method: 'post',
		keys: ['approveId', 'companyId', 'result', 'opinion', 'reason', 'isSingle']
	},
	'myApproveCount': {
		url: '/message/appTotalCount/',
		method: 'get',
		keys: ['cid']
	},
	'approveTransfer': {
		url: '/approve/approveTransfer/',
		method: 'post',
		keys: ['companyId', 'approveId', 'assignNow', 'opinion']
	},
	'approveUndo': {
		url: '/approve/undo/',
		method: 'post',
		keys: ['companyId', 'approveId', 'opinion']
	},
	'flowList': {
		url: '/approve/setting/flow/list/',
		method: 'get',
		keys: ['companyId', 'pageNo', 'pageSize']
	},
	'sendSmsCaptcha': {
		url: '/v1/user/send_sms_captcha',
		method: 'post',
		keys: ['mobile', 'picCaptcha', 'uuid'],
		nojson: true
	},
	'verifyPwdSmsCaptcha': {
		url: '/v1/user/verify_sms_captcha/',
		method: 'post',
		keys: ['mobile', 'smsCaptcha', 'picCaptcha', 'uuid'],
		nojson: true
	},
	'approveApdate': {
		url: '/approve/update/',
		method: 'post',
		keys: ['isSubmit', 'approves', 'assigneeInfo', 'values']
	},
	'approveModify': {
		url: '/approve/modify/',
		method: 'post',
		keys: ['isSubmit', 'approves', 'assigneeInfo', 'values']
	},
	'approveDel': {
		url: '/approve/delete/',
		method: 'get',
		keys: ['companyId', 'approveId']
	}
}
let custom = {}

if (process.env.DATA_ENV === 'online') {
	custom = {
		'staffList': {
			method: 'post'
		}
	}
} else if (process.env.NODE_ENV === 'production') {
	custom = {
		'staffList': {
			method: 'post'
		}
	}
}
/*
 * 用自定义配置项 扩展+覆盖 基础配置项
 * source 基础配置项
 * target 自定义配置项
 */
function merge (source, target) {
	if (!(source && Object.keys(source).length > 0)) {
		throw new TypeError('source is not an object')
	}
	if (!(target && Object.keys(target).length > 0)) {
		return source
	}
	let tarKeys = Object.keys(target)
	for(let key in source) {
		if(tarKeys.indexOf(key) === -1) {
			continue
		}
		for(let k in target[key]) {
			source[key][k] = target[key][k]
		}		
	}
	return source
}
export default merge(config, custom)
