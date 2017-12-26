import {
	CHANGE_SELECTEDID,
	CHANGE_DEPT_LIST,
	CHANGE_STAFF_LIST,
	CHANGE_CONTACT_PAGENO,
	CHANGE_CONTACT_PAGESIZE,
	CHANGE_APPROVE_TREE_SELECTED,
} from './mutation-types'

export default {
	[CHANGE_SELECTEDID] (state, id) {
		state.treeSelectedId = id
	},
	[CHANGE_DEPT_LIST] (state, deptList) {
		state.deptList = deptList
	},
	[CHANGE_STAFF_LIST] (state, staffInfo) {
		state.staffInfo = staffInfo
	},
	[CHANGE_CONTACT_PAGENO] (state, pageNo) {
		state.staffInfo.page.pageNo = pageNo
	},
	[CHANGE_CONTACT_PAGESIZE] (state, pageSize) {
		state.staffInfo.page.pageSize = pageSize
	},
	[CHANGE_APPROVE_TREE_SELECTED] (state, id) {
		state.approveTreeSelected = id
	}
}