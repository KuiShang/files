const path = require('path')
const config = require('./config')
const jsonServer = require('json-server')
const dbfile = require(config.DB_FILE)
const rules = require('./routes')
const bodyParser = require('body-parser')
const superagent = require('superagent')
const urlParse = require('./urlParse')
const packdata = require('./packdata')

const ip = config.SERVER
const port = config.PORT

const server = jsonServer.create()
const router = jsonServer.router(dbfile())
const middlewares = jsonServer.defaults()

server.use(jsonServer.bodyParser)
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
	extended: false
}))

/*
server.use((req, res, next) => {
	res.header('X-Hello', 'World')
	next()
})
*/

/*
const rewriteQuerys = require('./rewriteQuerys')
server.use((req, res , next) => {
	let method = req.method.toLowerCase()
	let obj = rewriteQuerys(req)
	if(method === 'get') {
		let search = ''
		for(let key in obj) {
			search += `&${key}=${obj[key]}`
		}
		req.originalUrl = encodeURI(req.path + '?' + search.slice(1))
	} else if(method === 'post') {
		req.body.params = obj
	}
	next()
})
*/

server.use(middlewares)

/*
 * 处理POST方式查询员工列表
 */
server.post('/api/v1/staff/list', (req, res) => {
	let url = `http://${ip}:${port}` + req.originalUrl
	let query = req.body
	superagent.get(url)
	.query(query)
	.end((err, response) => {
		res.jsonp(response.body)
	})
})

/*
 * 处理POST方式员工登录
 */
server.post('/api/v1/login', (req, res) => {
	let query = req.body
	if(/^11\d{9}/g.test(query.username)) {
		res.jsonp({"code": 12001, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(/^12\d{9}/g.test(query.username)) {
		res.jsonp({"code": 12002, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})

/*
 * 处理POST方式注册公司 1验证手机号图形验证码 2获取短信验证码
 */
server.post('/api/v1/company/acquire_sms_captcha/', (req, res) => {
	let query = req.body
	if(query.mobile == '11111111111') {
		res.jsonp({"code": 200019, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(query.pictureCaptcha == '1111') {
		res.jsonp({"code": 200040, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else if('9527' == query.pictureCaptcha) {
		res.jsonp({"code": 200011, "msg": "验证码错误，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})

/*
 * 处理POST方式注册公司 创建公司 - 校验手机号、图形验证码、短信验证码
 */
server.post('/api/v1/company/validate_register_info/', (req, res) => {
	let query = req.body
	if(query.mobile == '11111111111') {
		res.jsonp({"code": 200009, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(query.smsCaptcha == '111111') {
		res.jsonp({"code": 200014, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else if('1111' == query.pictureCaptcha) {
		res.jsonp({"code": 200009, "msg": "验证码错误，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})
/*
 * 创建公司 - 设置密码
 */
server.post('/api/v1/company/set_register_password/', (req, res) => {
	let query = req.body
	if(query.password == 'aaa111') {
		res.jsonp({"code": 200009, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(query.verifyPassword == 'aaa111') {
		res.jsonp({"code": 200014, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else if('aaa222' == query.verifyPassword) {
		res.jsonp({"code": 200009, "msg": "验证码错误，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})
/*
 * 创建公司
 */
server.post('/api/v1/company/register_company/', (req, res) => {
	let query = req.body
	if(query.companyName == 'aaaa') {
		res.jsonp({"code": 200009, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(query.adminName == 'aaaa') {
		res.jsonp({"code": 200014, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else if('bbbb' == query.companyName) {
		res.jsonp({"code": 200009, "msg": "验证码错误，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})

/*
 * 找回密码
 */
server.post('/api/v1/user/reset_pwd/', (req, res) => {
	let query = req.body
	if(query.password == 'aaa111') {
		res.jsonp({"code": 200009, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(query.verifyPassword == 'aaa111') {
		res.jsonp({"code": 200014, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else if('aaa222' == query.verifyPassword) {
		res.jsonp({"code": 200009, "msg": "验证码错误，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})

/*
 * 处理POST方式注册公司 创建公司 - 校验手机号、图形验证码、短信验证码
 */
server.post('/api/v1/user/verify_sms_captcha/', (req, res) => {
	let query = req.body
	if(query.mobile == '11111111111') {
		res.jsonp({"code": 200009, "msg": "手机号与密码不匹配，请重新输入", "data": {}})
	} else if(query.smsCaptcha == '111111') {
		res.jsonp({"code": 200014, "msg": "手机号码不存在，请重新输入", "data": {}})
	} else if('1111' == query.pictureCaptcha) {
		res.jsonp({"code": 200009, "msg": "验证码错误，请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}
})

/*
 * 处理POST方式修改密码
 */
server.post('/api/v1/user/modifyPassword/', (req, res) => {
	let query = req.body
	if(query.oldPwd == 'aaa111') {
		res.jsonp({"code": 200009, "msg": "请重新输入", "data": {}})
	} else if(query.newPwd == 'aaa111') {
		res.jsonp({"code": 200014, "msg": "请重新输入", "data": {}})
	} else if('aaa112' == query.verifypwd) {
		res.jsonp({"code": 200009, "msg": "请重新输入", "data": {}})
	} else {
		res.jsonp({"code": 0, "msg": "OK", "data": {}})
	}

})

/*
 * 处理POST方式同意审批
 */
server.post('/api/approve/doApproveTask/', (req, res) => {
	res.jsonp({"code":0,"msg":"OK","data":{"list":[683]}})
})

/*
 * 处理POST方式转交审批
 */
server.post('/api/approve/approveTransfer/', (req, res) => {
	res.jsonp({"code":0,"msg":"OK","data":{"list":[683]}})
})

/*
 * 处理POST方式审批撤销
 */
server.post('/api/approve/undo/', (req, res) => {
	res.jsonp({"code":0,"msg":"OK","data":{"approveId":695,"approves":{"id":695,"procInstId":"292591","formId":1110,"formName":"请假","typeId":941,"typeName":"请假","code":"","status":4,"ownerId":3906,"ownerName":"朱元璋","cid":1,"ctime":1511232357904,"utime":1511259530094,"deleted":true,"curApprovers":"{\"name\":\"杨杰\",\"staffId\":\"3029\"}","summary":"","urgencyLevel":0},"approveFlow":{"id":941,"name":"请假","formId":1110,"formName":"请假","procdefId":"process-1-3531-1509518457124","typeId":314,"typeName":"1031","icon":"icon-4","cid":1,"ctime":1509518347462,"utime":1509518347462,"deleted":true,"summary":"","status":true,"orderCode":1000,"enableTime":1509518369342,"disableTime":"","isDeployed":true},"approveFlowTypes":{"id":314,"name":"1031","cid":1,"ctime":1509517910691,"utime":1509517910691,"deleted":true,"icon":"","status":true,"orderCode":7,"enableTime":1509517910691,"disableTime":"","isBind":true,"ruleCode":1},"approveForms":{"id":1110,"formName":"请假","des":"","cid":1,"ctime":1509518347465,"utime":1509518347465,"deleted":true},"values":[{"formId":1110,"elementId":1,"title":"主题","placeholder":"请假请慎重","isMust":1,"format":"yyyy-MM-dd","orderCode":1,"valueId":1382,"approveId":695,"formElementId":17866,"value":"撒地方","typeName":"text","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":2,"title":"原因","placeholder":"你为啥要请假？","isMust":0,"format":"yyyy-MM-dd","orderCode":2,"valueId":1383,"approveId":695,"formElementId":17867,"value":"撒地方","typeName":"textarea","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":3,"title":"原因类型","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd","orderCode":3,"valueId":1384,"approveId":695,"formElementId":17868,"value":"1519","typeName":"radio","items":[{"id":1518,"formElementId":17868,"item":"公事","rule":""},{"id":1519,"formElementId":17868,"item":"私事","rule":""},{"id":1520,"formElementId":17868,"item":"人生大事","rule":""},{"id":1521,"formElementId":17868,"item":"其他","rule":""}],"formElementCode":"","extra1":""},{"formId":1110,"elementId":4,"title":"请假后做什么","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd","orderCode":4,"valueId":1385,"approveId":695,"formElementId":17869,"value":"-1,-1,1524,-1,-1","typeName":"checkbox","items":[{"id":1522,"formElementId":17869,"item":"吃饭","rule":""},{"id":1523,"formElementId":17869,"item":"睡觉","rule":""},{"id":1524,"formElementId":17869,"item":"打豆豆","rule":""},{"id":1525,"formElementId":17869,"item":"看UFO","rule":""},{"id":1526,"formElementId":17869,"item":"打小人","rule":""}],"formElementCode":"","extra1":""},{"formId":1110,"elementId":8,"title":"日期组件-慎重","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd HH:mm","orderCode":5,"valueId":1386,"approveId":695,"formElementId":17870,"value":"{\"beginDate\":\"20171121\",\"beginTime\":\"1044\",\"endDate\":\"20171122\",\"endTime\":\"0900\",\"days\":\"0\",\"hours\":\"22\",\"minutes\":\"16\"}","typeName":"groupDate","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":9,"title":"急迫程度","placeholder":"N次方","isMust":1,"format":"yyyy-MM-dd","orderCode":6,"valueId":1387,"approveId":695,"formElementId":17871,"value":"1","typeName":"number","items":[],"formElementCode":"","extra1":"{\"unit\":\"N次方\"}"}],"notes":[{"id":583,"approveId":695,"procInstId":"292591","taskId":"292597","note":"{\"reason\":\"\",\"opinion\":\"\"}","ownerId":3906,"ownerName":"朱元璋","resultCode":0,"assignNow":3906,"ctime":1511232270305,"utime":1511232270305,"taskName":""},{"id":608,"approveId":695,"procInstId":"292591","taskId":"290061","note":"{\"reason\":\"\",\"opinion\":\"gha\"}","ownerId":3906,"ownerName":"朱元璋","resultCode":3,"assignNow":3906,"ctime":1511259530094,"utime":1511259530094,"taskName":""}],"assigneeInfo":{"id":698,"approveId":695,"assigneeInfo":"[{\"name\":\"部门秘书\",\"assignee\":\"${usertask1}\",\"isPromoterDelete\":false,\"isAssigneeChoice\":true,\"iconColor\":\"#a992d4\",\"colorFont\":\"元璋\",\"taskId\":\"usertask1\",\"value\":\"3906\"},{\"name\":\"项目经理\",\"assignee\":\"${usertask2}\",\"isPromoterDelete\":true,\"isAssigneeChoice\":true,\"iconColor\":\"#b5b5e2\",\"colorFont\":\"杨杰\",\"taskId\":\"usertask2\",\"value\":\"3029\"},{\"name\":\"部门负责人\",\"assignee\":\"${usertask3}\",\"isPromoterDelete\":true,\"isAssigneeChoice\":true,\"iconColor\":\"#b3dbf2\",\"colorFont\":\"邹骁\",\"taskId\":\"usertask3\",\"value\":\"2027\"}]"}}})
})

/*
 * 处理POST方式新建审批
 */
server.post('/api/approve/add/', (req, res) => {
	res.jsonp({"code":0,"msg":"OK","data":{"approveId":1357,"approves":{"id":1357,"procInstId":"331395","formId":1110,"formName":"请假","typeId":941,"typeName":"请假","code":"","status":1,"ownerId":3906,"ownerName":"朱元璋","cid":1,"ctime":1511516632420,"utime":1511516632420,"deleted":true,"curApprovers":"{\"name\":\"陀莉\",\"staffId\":\"3417\"}","summary":"","urgencyLevel":1},"approveFlow":{"id":941,"name":"请假","formId":1110,"formName":"请假","procdefId":"process-1-3531-1509518457124","typeId":314,"typeName":"1031","icon":"icon-4","cid":1,"ctime":1509518347462,"utime":1509518347462,"deleted":true,"summary":"","status":true,"orderCode":1000,"enableTime":1509518369342,"disableTime":"","isDeployed":true},"approveFlowTypes":{"id":314,"name":"1031","cid":1,"ctime":1509517910691,"utime":1509517910691,"deleted":true,"icon":"","status":true,"orderCode":7,"enableTime":1509517910691,"disableTime":"","isBind":true,"ruleCode":1},"approveForms":{"id":1110,"formName":"请假","des":"","cid":1,"ctime":1509518347465,"utime":1509518347465,"deleted":true},"values":[{"formId":1110,"elementId":1,"title":"主题","placeholder":"请假请慎重","isMust":1,"format":"yyyy-MM-dd","orderCode":1,"valueId":2999,"approveId":1357,"formElementId":17866,"value":"啧啧啧","typeName":"text","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":2,"title":"原因","placeholder":"你为啥要请假？","isMust":0,"format":"yyyy-MM-dd","orderCode":2,"valueId":3000,"approveId":1357,"formElementId":17867,"value":"也一样","typeName":"textarea","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":3,"title":"原因类型","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd","orderCode":3,"valueId":3001,"approveId":1357,"formElementId":17868,"value":"1519","typeName":"radio","items":[{"id":1518,"formElementId":17868,"item":"公事","rule":""},{"id":1519,"formElementId":17868,"item":"私事","rule":""},{"id":1520,"formElementId":17868,"item":"人生大事","rule":""},{"id":1521,"formElementId":17868,"item":"其他","rule":""}],"formElementCode":"","extra1":""},{"formId":1110,"elementId":4,"title":"请假后做什么","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd","orderCode":4,"valueId":3002,"approveId":1357,"formElementId":17869,"value":"1522,-1,1524,1525,-1","typeName":"checkbox","items":[{"id":1522,"formElementId":17869,"item":"吃饭","rule":""},{"id":1523,"formElementId":17869,"item":"睡觉","rule":""},{"id":1524,"formElementId":17869,"item":"打豆豆","rule":""},{"id":1525,"formElementId":17869,"item":"看UFO","rule":""},{"id":1526,"formElementId":17869,"item":"打小人","rule":""}],"formElementCode":"","extra1":""},{"formId":1110,"elementId":8,"title":"日期组件-慎重","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd HH:mm","orderCode":5,"valueId":3003,"approveId":1357,"formElementId":17870,"value":"{\"beginDate\":\"20171124\",\"beginTime\":\"1741\",\"endDate\":\"20171125\",\"endTime\":\"0900\",\"days\":\"0\",\"hours\":\"15\",\"minutes\":\"19\"}","typeName":"groupDate","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":9,"title":"急迫程度","placeholder":"N次方","isMust":1,"format":"yyyy-MM-dd","orderCode":6,"valueId":3004,"approveId":1357,"formElementId":17871,"value":"2","typeName":"number","items":[],"formElementCode":"","extra1":"{\"unit\":\"N次方\"}"}],"notes":[{"id":"","approveId":"","procInstId":"","taskId":"","note":"","ownerId":"","ownerName":"","resultCode":"","assignNow":3417,"ctime":"","utime":"","taskName":"部门秘书"},{"id":"","approveId":"","procInstId":"","taskId":"","note":"","ownerId":"","ownerName":"","resultCode":"","assignNow":3029,"ctime":"","utime":"","taskName":"项目经理"},{"id":"","approveId":"","procInstId":"","taskId":"","note":"","ownerId":"","ownerName":"","resultCode":"","assignNow":2027,"ctime":"","utime":"","taskName":"部门负责人"}],"assigneeInfo":{"id":1360,"approveId":1357,"assigneeInfo":"[{\"name\":\"部门秘书\",\"assignee\":\"${usertask1}\",\"isPromoterDelete\":false,\"isAssigneeChoice\":true,\"iconColor\":\"#a8e5c2\",\"colorFont\":\"陀莉\",\"taskId\":\"usertask1\",\"value\":\"3417\"},{\"name\":\"项目经理\",\"assignee\":\"${usertask2}\",\"isPromoterDelete\":true,\"isAssigneeChoice\":true,\"iconColor\":\"#b5b5e2\",\"colorFont\":\"杨杰\",\"taskId\":\"usertask2\",\"value\":\"3029\"},{\"name\":\"部门负责人\",\"assignee\":\"${usertask3}\",\"isPromoterDelete\":true,\"isAssigneeChoice\":true,\"iconColor\":\"#b3dbf2\",\"colorFont\":\"邹骁\",\"taskId\":\"usertask3\",\"value\":\"2027\"}]"}}})

})


/*
 * 处理POST方式审批表单更新
 */
server.post('/api/approve/update', (req, res) => {
	res.jsonp({"code":0,"msg":"OK","data":{"approveId":2232,"approves":{"id":2232,"procInstId":"","formId":1110,"formName":"请假","typeId":941,"typeName":"请假","code":"","status":0,"ownerId":3906,"ownerName":"朱元璋","cid":1,"ctime":1511851352776,"utime":1511851359008,"deleted":true,"curApprovers":"","summary":"","urgencyLevel":1},"approveFlow":{"id":941,"name":"请假","formId":1110,"formName":"请假","procdefId":"process-1-3531-1509518457124","typeId":314,"typeName":"1031","icon":"icon-4","cid":1,"ctime":1509518347462,"utime":1509518347462,"deleted":true,"summary":"","status":true,"orderCode":1000,"enableTime":1509518369342,"disableTime":"","isDeployed":true},"approveFlowTypes":{"id":314,"name":"1031","cid":1,"ctime":1509517910691,"utime":1509517910691,"deleted":true,"icon":"","status":true,"orderCode":7,"enableTime":1509517910691,"disableTime":"","isBind":true,"ruleCode":1},"approveForms":{"id":1110,"formName":"请假","des":"","cid":1,"ctime":1509518347465,"utime":1509518347465,"deleted":true},"values":[{"formId":1110,"elementId":1,"title":"主题","placeholder":"请假请慎重","isMust":1,"format":"yyyy-MM-dd","orderCode":1,"valueId":4271,"approveId":2232,"formElementId":17866,"value":"123","typeName":"text","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":2,"title":"原因","placeholder":"你为啥要请假？","isMust":0,"format":"yyyy-MM-dd","orderCode":2,"valueId":4272,"approveId":2232,"formElementId":17867,"value":"aaa","typeName":"textarea","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":3,"title":"原因类型","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd","orderCode":3,"valueId":4273,"approveId":2232,"formElementId":17868,"value":"1521","typeName":"radio","items":[{"id":1518,"formElementId":17868,"item":"公事","rule":""},{"id":1519,"formElementId":17868,"item":"私事","rule":""},{"id":1520,"formElementId":17868,"item":"人生大事","rule":""},{"id":1521,"formElementId":17868,"item":"其他","rule":""}],"formElementCode":"","extra1":""},{"formId":1110,"elementId":4,"title":"请假后做什么","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd","orderCode":4,"valueId":4274,"approveId":2232,"formElementId":17869,"value":"-1,-1,-1,1525,1526","typeName":"checkbox","items":[{"id":1522,"formElementId":17869,"item":"吃饭","rule":""},{"id":1523,"formElementId":17869,"item":"睡觉","rule":""},{"id":1524,"formElementId":17869,"item":"打豆豆","rule":""},{"id":1525,"formElementId":17869,"item":"看UFO","rule":""},{"id":1526,"formElementId":17869,"item":"打小人","rule":""}],"formElementCode":"","extra1":""},{"formId":1110,"elementId":8,"title":"日期组件-慎重","placeholder":"请输入","isMust":1,"format":"yyyy-MM-dd HH:mm","orderCode":5,"valueId":4275,"approveId":2232,"formElementId":17870,"value":"{\"beginDate\":\"20171118\",\"beginTime\":\"0130\",\"endDate\":\"20171230\",\"endTime\":\"0400\",\"days\":\"42\",\"hours\":\"2\",\"minutes\":\"30\"}","typeName":"groupDate","items":[],"formElementCode":"","extra1":""},{"formId":1110,"elementId":9,"title":"急迫程度","placeholder":"N次方","isMust":1,"format":"yyyy-MM-dd","orderCode":6,"valueId":4276,"approveId":2232,"formElementId":17871,"value":"666","typeName":"number","items":[],"formElementCode":"","extra1":"{\"unit\":\"N次方\"}"}],"notes":[{"id":"","approveId":"","procInstId":"","taskId":"","note":"","ownerId":"","ownerName":"","resultCode":"","assignNow":3417,"ctime":"","utime":"","taskName":"部门秘书"},{"id":"","approveId":"","procInstId":"","taskId":"","note":"","ownerId":"","ownerName":"","resultCode":"","assignNow":3029,"ctime":"","utime":"","taskName":"项目经理"},{"id":"","approveId":"","procInstId":"","taskId":"","note":"","ownerId":"","ownerName":"","resultCode":"","assignNow":2027,"ctime":"","utime":"","taskName":"部门负责人"}],"assigneeInfo":{"id":2235,"approveId":2232,"assigneeInfo":"[{\"name\":\"部门秘书\",\"assignee\":\"${usertask1}\",\"isPromoterDelete\":false,\"isAssigneeChoice\":true,\"iconColor\":\"#a8e5c2\",\"colorFont\":\"陀莉\",\"taskId\":\"usertask1\",\"value\":\"3417\"},{\"name\":\"项目经理\",\"assignee\":\"${usertask2}\",\"isPromoterDelete\":true,\"isAssigneeChoice\":true,\"iconColor\":\"#b5b5e2\",\"colorFont\":\"杨杰\",\"taskId\":\"usertask2\",\"value\":\"3029\"},{\"name\":\"部门负责人\",\"assignee\":\"${usertask3}\",\"isPromoterDelete\":true,\"isAssigneeChoice\":true,\"iconColor\":\"#b3dbf2\",\"colorFont\":\"邹骁\",\"taskId\":\"usertask3\",\"value\":\"2027\"}]"}}})
})

/*
 * 处理包装分页等特殊响应报文内容
 */
router.render = packdata

// server.use("/api",router)
server.use(jsonServer.rewriter(rules))
server.use(router)

server.listen({
	host: ip,
	port: port,
}, function() {
	console.log(`JSON Server is running in http://${ip}:${port}`)
})