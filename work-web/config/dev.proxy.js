// 开发环境的代理配置
let proxy = {}
let dataEnv = require('./dev.env').DATA_ENV
if (dataEnv === '"online"') {
	proxy = {
		'/api': {
			target: 'http://10.112.178.20:8888',
			changeOrigin: true,
			pathRewrite: {
				'^/api': ''
			}
		}
	}
} else if (dataEnv === '"mock"') {
	proxy = {
		'/api': {
			target: 'http://127.0.0.1:3003',
			changeOrigin: true
		},
	}
}
module.exports = proxy