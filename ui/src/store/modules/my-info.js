import * as types from '../mutation-types';

const state = {
    info: {
        imUserId: '',
        imToken: '',
        imTokenExpirationTime: '',
        oaId: '',
        name: '',
        phone: '',
        token: '',
        tokenExpirationTime: '',
        companyId: ''
    }
};

const mutations = {
    [types.GET_MY_INFO](state, info) {
        state.info = info;
    }
};
const getters = {
    imUserId: state => state.info.imUserId,
    oaId: state => state.info.oaId,
    myInfo: state => state.info
};
export default {
    state,
    mutations,
    getters
};
