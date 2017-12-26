import fetch from '@/config/fetch'
import urls from './urls.js'
import { adaptFetch } from '@/config/adapt'




export let fetchApproveFormElements = (options) => {
	let res = adaptFetch('approveFormElements', options)
	return res
}
export let fetchApproveFormFlows = (options) => {
	let res = adaptFetch('approveFormFlows', options)
	return res
}
export let postApproveForm = (options) => {
	let res = fetch.post(urls.saveApproveForm, options)
	return res
}

//审批表单详情页
export let getViewFormData =  (options) => {
  let res = adaptFetch('getViewFormData', options)
  return res
}
//同意审批
export let doApproveTask =  (options) => {
  let res = adaptFetch('doApproveTask', options)
  return res
}
//查询待我审批的数量
export let myApproveCount =  (options) => {
  let res = adaptFetch('myApproveCount', options)
  return res
}

//转交审批
export let approveTransfer =  (options) => {
  let res = adaptFetch('approveTransfer', options)
  return res
}
//转交审批
export let approveUndo =  (options) => {
  let res = adaptFetch('approveUndo', options)
  return res
}
//获取全部可新建的审批单
export let getFlowList =  (options) => {
  let res = adaptFetch('flowList', options)
  return res
}
//审批单的更新
export let approveApdate =  (options) => {
  let res = adaptFetch('approveApdate', options)
  return res
}

//获取待我审批的数量
export let fetchWaitApprovelist =  (options) => {
  let res = adaptFetch('approveWaitList', options)
  return res
}
//获取我已经审批的列表
export let fetchApproveFinshedlist = (options) => {
  let res = adaptFetch('approveFinshedlist', options)
  return res
}
//获取我发起的审批的列表
export let fetchMyApprovelist = (options) => {
  let res = adaptFetch('approveMylis', options)
  return res
}
//获取草稿审批的列表
export let fetchDraftlist = (options) => {
  let res = adaptFetch('approveDraftList', options)
  return res
}
//获取已归档审批的列表
export let fetchApproveArchivelist = (options) => {
  let res = adaptFetch('approveArchiveList', options)
  return res
}

//删除审批草稿
export let approveDel = (options) => {
  let res = adaptFetch('approveDel', options)
  return res
}

//审批撤销后重新提交
export let approveModify = (options) => {
  let res = adaptFetch('approveModify', options)
  return res
}






