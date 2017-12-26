/**
 * Created by shangkuikui on 2017/5/27.
 */
import * as types from '../mutation-types';
import createLogger from 'vuex/dist/logger';
const state = {
    linkBorderIndex: 1,
    settingOpen: false,
    members: {},
    membersCount: {},
    currentPage: 1,
    SelectPeopleCurrentPage: 1
};

const mutations = {
    changeLinkBorderIndex(state, index) {
        state.linkBorderIndex = index;
    },
    changeInstruction(state, draft) {
        state.instruction = draft;
    },
    changeNotice(state, draft) {
        state.notice = draft;
    },
    openSetting(state, flag) {
        state.settingOpen = flag;
    },
    [types.CHANGE_LINKBORDERINDEX](state, index) {
        state.linkBorderIndex = index;
    },
    [types.OPEN_SETTING](state, flag) {
        state.settingOpen = flag;
    },
    [types.GET_MEMBERS](state, Peoples = {}) {
        let key = Object.keys(Peoples);
        // state.members[key] = Peoples[key];
        state.members = Object.assign({}, state.members, {[key]: Peoples[key]});
    },
    [types.GET_MEMBERS_COUNT](state, data) {
        let key = Object.keys(data);
        state.membersCount = Object.assign({}, state.membersCount, {[key]: data[key]});
    },
    [types.CHANGE_CURRENT_PAGE](state, currentPage = 1) {
        state.currentPage = currentPage;
    },
    [types.SHOW_CONFIRM](state, flag) {
        state.showConfirmTip = flag;
    }
};

const getters = {
    openSetting: state => state.openSetting,
    linkBorderIndex: state => state.linkBorderIndex,
    members: state => state.members,
    membersCount: state => state.membersCount,
    currentPage: state => state.currentPage,
    SelectPeopleCurrentPage: state => state.SelectPeopleCurrentPage,
    // scrollMembers: state => state.members.slice(0, 100 * state.currentPage),
    settingOpen: state => state.settingOpen
};

const debug = process.env.NODE_ENV !== 'production';
export default {
    state,
    mutations,
    getters,
    strict: debug,
    plugins: [createLogger()]
};
