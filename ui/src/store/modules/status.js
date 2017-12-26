import * as types from '../mutation-types';

const state = {
    showSelectPeople: false,
    currentSimpleRightmenuId: '',
    globalStatus: 'channel',
    currentSession: {},
    currentChannelSession: {},
    hotKey: 0,
    forward: {
        show: false,
        msg: {},
        component: null
    },
    connected: true,
    connectedText: '',
    visible: true,
    updateStatus: false,
    environment: ''
};

const mutations = {
    [types.SET_CURRENT_SIMPLE_RIGHTMENU_ID](state, id) {
        state.currentSimpleRightmenuId = id;
    },
    [types.SHOW_SELECT_PEOPLE](state, flag) {
        state.showSelectPeople = flag;
    },
    [types.SET_CURRENT_SESSION](state, groupId) {
        state.currentSession = groupId;
    },
    [types.SET_GLOBAL_STATUS](state, data) {
        if (data === state.globalStatus) {
            return;
        }
        document.querySelector('.im-left .active').className = document.querySelector('.im-left .active').className.replace(' active', '');
        document.querySelector('.im-left .im-' + data).className += ' active';
        state.globalStatus = data;
    },
    [types.SET_CURRENT_CHANNEL_SESSION](state, channel) {
        state.currentChannelSession = channel;
    },
    [types.SET_HOT_KEY](state, key) {
        state.hotKey = key;
    },
    [types.SET_CURRENT_CHANNEL_SESSION_NEW_MSG_REMIND](state, code) {
        state.currentChannelSession.newMsgRemind = code;
    },
    [types.SET_CURRENT_CHANNEL_SESSION_COMMOB_MSG_CONFIG](state, code) {
        state.currentChannelSession.receiveCommonMsg = code;
    },
    [types.CHANGE_INSTRUCTION](state, draft) {
        state.currentChannelSession.ChannelDesc = draft;
    },
    [types.CHANGE_NOTICE](state, draft) {
        state.currentChannelSession.notice = draft;
    },
    [types.CHANGE_CONNECTED_STATUS](state, {data, text}) {
        state.connected = data;
        state.connectedText = text;
    },
    [types.SET_WINDOW_VISIBILITY](state, data) {
        state.visible = data;
    },
    [types.SET_UPDATE_STATUS](state, data) {
        state.updateStatus = data;
    }
};
const getters = {
    showSelectPeople: state => state.showSelectPeople,
    currentSimpleRightmenuId: state => state.currentSimpleRightmenuId,
    instruction: state => state.currentChannelSession.ChannelDesc,
    notice: state => state.currentChannelSession.notice,
    adminId: state => state.currentChannelSession.adminId,
    currentChannelId: state => state.currentChannelSession.ChannelId,
    currentChannelSession: state => state.currentChannelSession,
    ChannelName: state => state.currentChannelSession.ChannelName,
    deptName: state => state.currentChannelSession.deptName,
    newMsgRemind: state => state.currentChannelSession.newMsgRemind,
    receiveCommonMsg: state => state.currentChannelSession.receiveCommonMsg,
    timer: state => state.timer,
    connected: state => state.connected,
    connectedText: state => state.connectedText,
    visible: state => state.visible,
    globalStatus: state => state.globalStatus,
    updateStatus: state => state.updateStatus
};

export default {
    state,
    mutations,
    getters
};
