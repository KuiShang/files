import * as types from '../mutation-types';

const state = {
    sessionList: []
};

const mutations = {
    [types.GET_SESSION](state, sessions) {
        console.log('store', sessions);
        state.sessionList = sessions;
    }
};

const getters = {
    sessions: state => state.sessions
};

export default {
    state,
    mutations,
    getters
};
