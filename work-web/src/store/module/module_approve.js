import * as types from '../mutation-types';
const state = {
  waitApprovalCount: 0
}
const mutations = {
    [types.SET_WAIT_APPROVE_NUM](state, count = 0 ) {
        if (count < 0) {
            return
        }
        state.waitApprovalCount =  count
    }
}
const getters = {
    waitApprovalCount: state => state.waitApprovalCount
}
export default {
  state,
  mutations,
  getters
}
