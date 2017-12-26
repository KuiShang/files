import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import module_notice from './module/module_notice'
import module_approve from './module/module_approve'

Vue.use(Vuex)

const state = {
	treeSelectedId: -1,
	approveTreeSelected:-1,
	userInfo:{
	}
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules: {
		notice: module_notice,
		approve: module_approve
	}
})