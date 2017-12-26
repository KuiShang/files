import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('@/modules/entry/login')
const home = () => import('@/components/Layout')
const contact = () => import('@/modules/contact/Contact')
const attach = () => import('@/modules/attach/attach')
const notice = () => import('@/modules/notice/notice')
const noticeDetail = () => import('@/modules/notice/noticeDetail')
const approve = () => import('@/modules/approve/Approve')
const formList = () => import('@/modules/approve/formList/formList')
const approveForm = () => import('@/modules/approve/newApprove/Form')
const archive = () => import('@/modules/approve/archive/Archive')
const draft = () => import('@/modules/approve/draft/Draft')
const myApprove = () => import('@/modules/approve/myApprove/MyApprove')
const myFinishedTask = () => import('@/modules/approve/myFinishedTask/MyFinishedTask')
const waitApprove = () => import('@/modules/approve/waitApprove/WaitApprove')
const viewForm = () => import('@/modules/approve/viewForm/ViewForm')
const center = () => import('@/modules/center/center')
const findPassword = () => import('@/modules/entry/findPassword')
const modifyPassword = () => import('@/modules/entry/modifyPassword')
const createCompany = () => import('@/modules/entry/createCompany')
const temporyMain = () => import('@/modules/entry/temporyMain')
const entry = () => import('@/modules/entry/entry')
Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/temporyMain',
			component: temporyMain,
		},
		{
			path: '/entry',
			component: entry,
			// alias: '/',
			children: [
				{
					path: 'login',
					name: 'login',
					component: login
				},
				{
					path: 'findPassword',
					name: 'findPassword',
					component: findPassword
				},
				{
					path: 'modifyPassword',
					component: modifyPassword
				},
				{
					path: 'createCompany',
					component: createCompany
				},
			]
		},
		/*
		* 公告详情页用的弹窗方式，所以路由暂隐去
		*/
		// {
		// 	path: '/notice/detail',
		// 	component: noticeDetail
		// },
		{
			path: '/',
			component: home,
			children: [
				{
					path: '',
					redirect: 'contact'
				},
				{
					path: 'contact',
					component: contact
				},
				{
					path: 'attach',
					component: attach
				},
				{
					path: 'notice/:active',
					component: notice,
					name: 'notice'
				},
				{
					path: 'approval',
					component: approve,
					name : 'approval',
					children: [
						{
							path: 'approvallist',
							component: formList,
							name: 'approvalList',
							alias: '/'
						},
						{
							path: 'approvallist/create',
							component: approveForm,
							name: 'createForm'
						},
						{
							path: 'waitApprove',
							component: waitApprove,
							name: 'wait-approval'
						},
						{
							path: 'myFinishedTask',
							component: myFinishedTask
						},
						// 我发起的
						{
							path: 'myApprove',
							component: myApprove
						},
						{
							path: 'draft',
							component: draft
						},
						{
							path: 'archive',
							component: archive
						},
						// 待我审批 详情页面
						{
							path: 'waitApprove/:approveId',
							name: 'approval-wait',
							component: viewForm
						},
						// 我已审批 详情页面
						{
							path: 'myFinishedTask/:approveId',
							name: 'approval-done',
							component: viewForm
						},
						// 我发起的 详情页面
						{
							path: 'myApprove/:approveId', // 我发起的 查看表单页
							name: 'approval-launch',
							component: viewForm
						},	
						// 我发起的 重新提交
						{
							path: 'myApprove/:approveId/resubmit', 
							name: 'approval-resubmit',
							component: approveForm
						},	
						// 草稿 详情页面
						{
							path: 'draft/:approveId', // 重新编辑草稿
							name: 'apply-redraft',
							component: approveForm
						},	
						{
							path: 'archive/:approveId', // 已归档 查看表单页
							name: 'apply-filed',
							component: viewForm
						},			
					]
				},
				{
					path: 'center',
					component: center
				}
			]
		}
	]
})
