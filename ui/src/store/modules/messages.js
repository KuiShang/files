import * as types from '../mutation-types';
import Vue from 'vue';
// import VueApp from '../../main';
// import util from '../../util';

const state = {
    msgMap: {},
    msgUpdateFlag: false,
    receiveFlag: false,
    receiveChannelId: '',
    receiveMsg: {},
    channelSpecialMsgList: [],
    receiptMap: {},
    isGetMsg: false,
    readedSpecialMsgList: [],
    specialMsgMap: {},
    haveFault: false,
    isClickSpecialMsgMap: false,
    isGettingDownMsg: false,
    gettingReconnectedMsg: {
        flag: false,
        getNearMsg: false,
        channelId: '',
        seqId: 0,
        unReadNum: 0,
        loadingSeqId: 0
    },
    unConnectedReadedCount: {}
};

const mutations = {
    [types.CLEAR_CHANNEL_MSG_LIST](state, channelId) {
        state.msgMap[channelId] = undefined;
    },
    [types.GET_CHANNEL_MSG_LIST](state, {channelId, msgs, currentId}) {
        let msgArr = state.msgMap[channelId];
        let specialMsgArr = state.specialMsgMap[channelId];
        if (state.haveFault === false || channelId !== currentId) {
            if (typeof msgArr !== 'undefined') {
                msgArr.unshift(...msgs);
            } else {
                Vue.set(state.msgMap, channelId, msgs);
                msgArr = state.msgMap[channelId];
            }
        } else {
            if (state.gettingReconnectedMsg.getNearMsg) {
                state.gettingReconnectedMsg.getNearMsg = false;
                msgArr.unshift(...msgs);
            } else if (typeof specialMsgArr !== 'undefined') {
                if (state.isClickSpecialMsgMap === true) {
                    Vue.set(state.specialMsgMap, channelId, msgs);
                    specialMsgArr = state.specialMsgMap[channelId];
                    state.isClickSpecialMsgMap = false;
                } else if (state.isClickSpecialMsgMap === false) {
                    specialMsgArr.unshift(...msgs);
                }
            } else {
                Vue.set(state.specialMsgMap, channelId, msgs);
                specialMsgArr = state.specialMsgMap[channelId];
                state.isClickSpecialMsgMap = false;
            }
            specialMsgArr.sort((a1, a2) => {
                return a1.sendtime - a2.sendtime;
            });
            for (let i = 0; i < specialMsgArr.length - 1; i++) {
                if (specialMsgArr[i].msgSeqId === specialMsgArr[i + 1].msgSeqId && specialMsgArr[i].sendtime === specialMsgArr[i + 1].sendtime) {
                    specialMsgArr.splice(i, 1);
                }
            }
            if (specialMsgArr[specialMsgArr.length - 1].msgSeqId === msgArr[msgArr.length - 1].msgSeqId && specialMsgArr[specialMsgArr.length - 1].sendtime === msgArr[msgArr.length - 1].sendtime) {
                Vue.set(state.msgMap, channelId, specialMsgArr);
                state.haveFault = false;
            }
        }
        msgArr.sort((a1, a2) => {
            return a1.sendtime - a2.sendtime;
        });
        for (let i = 0; i < msgArr.length - 1; i++) {
            if (msgArr[i].msgSeqId === msgArr[i + 1].msgSeqId && msgArr[i].sendtime === msgArr[i + 1].sendtime) {
                msgArr.splice(i, 1);
            }
        }
        if (channelId === currentId || channelId === '') {
            if (msgs.length > 1) {
                state.msgUpdateFlag = !state.msgUpdateFlag;
            }
        }
    },
    [types.SET_FAULT_MESSAGE](state, {currentChannelId, msgs}) {
        state.haveFault = true;
        state.specialMsgMap[currentChannelId] = msgs;
    },
    [types.RECEIVE_CHANNEL_MSG](state, {msg, channelId}) {
        state.msgMap[channelId].push(msg);
        state.receiveFlag = !state.receiveFlag;
        state.receiveChannelId = channelId;
        state.receiveMsg = msg;
        state.msgMap[channelId].sort((a1, a2) => {
            return a1.sendtime - a2.sendtime;
        });
    },
    [types.ADD_SENT_MSG](state, {channelId, msgArr}) {
        if (!state.msgMap[channelId]) {
            Vue.set(state.msgMap, channelId, []);
        }
        state.msgMap[channelId].push(...msgArr);
        state.msgMap[channelId].sort((a1, a2) => {
            return a1.sendtime - a2.sendtime;
        });
        state.haveFault = false;
    },
    [types.SEND_CHANNEL_MSG_SUCCESS](state, {data, seqId}) {
        let channelId = data.channelId;
        let msgList = state.msgMap[channelId];
        msgList.forEach((msg) => {
            if (msg.msgId === data.msgId) {
                msg.status = 1;
                msg.sendtime = data.sendTime;
                msg.msgSeqId = seqId;
            }
        });
        state.msgMap[channelId].sort((a1, a2) => {
            return a1.sendtime - a2.sendtime;
        });
    },
    [types.SEND_CHANNEL_MSG_FAILED](state, data) {
        let channelId = data.channelId;
        let msgList = state.msgMap[channelId];
        msgList.forEach((msg) => {
            if (msg.msgId === data.msgId) {
                msg.status = 2;
            }
        });
        state.msgMap[channelId].sort((a1, a2) => {
            return a1.sendtime - a2.sendtime;
        });
    },
    [types.CUT_MESSAGES](state, channelId) {
        if (state.msgMap[channelId].length > 20) {
            state.msgMap[channelId] = state.msgMap[channelId].slice(-20);
        }
    },
    [types.GET_CHANNEL_SPECIAL_MSG_LIST](state, data) {
        if (state.channelSpecialMsgList.length > 0) {
            state.channelSpecialMsgList = [];
        }
        if (data) {
            state.isGetMsg = true;
        }
        state.channelSpecialMsgList.push(...data);
    },
    [types.RECEIVE_MSG_PRAISED_SIGNAL](state, data) {
        let channelId = data.channelId;
        let msgList = state.msgMap[channelId];
        if (!msgList) {
            return;
        }
        msgList.forEach((msg) => {
            if (msg.msgId === data.msgId) {
                Vue.set(msg, 'praiseCount', data.count);
                Vue.set(msg, 'praiseUids', data.likeUids);
            }
        });
    },
    [types.SOUND_PLAY_FINISH](state, { channelId, msgId }) {
        let msgList = state.msgMap[channelId];
        if (msgList) {
            msgList.forEach((msg) => {
                if (msg.msgId === msgId) {
                    msg.playing = false;
                }
            });
        }
    },
    [types.GET_UNREAD_LIST](state, data) {
        let msgList = state.msgMap[data.channelId];
        if (msgList) {
            msgList.forEach((msg) => {
                if (msg.msgId === data.msgId) {
                    msg.readUids = data.readUids;
                    // Vue.set(msg, 'readUids', data.readUids);
                    Vue.set(msg, 'unRreadUids', data.unRreadUids);
                }
            });
        }
    },
    [types.READ_ACK_MSG](state, data) {
        let msgList = state.msgMap[data.channelId];
        if (msgList) {
            msgList.forEach((msg) => {
                if (msg.msgId === data.msgId) {
                    if (typeof (msg.readUids) !== 'undefined' && typeof (msg.unRreadUids) !== 'undefined') {
                        msg.readUids.push(data.readUid);
                        msg.unRreadUids.splice(msg.unRreadUids.indexOf(data.readUid), 1);
                    }
                }
            });
        }
    },
    [types.DELETE_MESSAGE](state, { data, imUserId }) {
        let msgList = state.msgMap[data.channelId];
        if (msgList) {
            msgList.forEach((msg) => {
                if (msg.msgId === data.msgId) {
                    Vue.set(msg, 'isDelete', 1);
                    Vue.set(msg, 'msgbody', '该消息已被删除');
                    Vue.set(msg, 'status', 1);
                }
            });
        }
    },
     // 上传完成
    [types.FILE_UP_CHANNEL_REAL](state, {channelId, msgId, reason, fpath, fid, fname, fsize}) {
        let msgList = state.msgMap[channelId];
        msgList.forEach((msg) => {
            if (msg.msgId === msgId) {
                if (reason === 0) {
                    msg.FileStatus = 2;
                    msg.percent = 1;
                    msg.fpath = fpath;
                    msg.fid = fid;
                    msg.fname = fname;
                    msg.fsize = fsize;
                } else {
                    msg.FileStatus = 100;
                }
            }
        });
    },
    // 下载完成
    [types.FILE_DOWNLOAD_CHANNEL_REAL](state, {channelId, msgId, reason, filePath, lastModifyTime}) {
        let msgList = state.msgMap[channelId];
        msgList.forEach((msg) => {
            if (msg.msgId === msgId) {
                if (reason === 0) {
                    msg.FileStatus = 2;
                    msg.filePath = filePath;
                    msg.percent = 1;
                    msg.lastModifyTime = lastModifyTime;
                } else {
                    msg.FileStatus = 100;
                }
            }
        });
    },
    // 文件状态回调
    [types.SIG_CHANNEL_STATUS](state, {channelId, msgId, FileStatus}) {
        let msgList = state.msgMap[channelId];
        msgList.forEach((msg) => {
            if (msg.msgId === msgId) {
                if (FileStatus === 101) {
                    msg.FileStatus = 101;
                }
            }
        });
    },
    [types.FILE_UPDOWNLOAD_CHANNEL_PROCESS](state, {channelId, msgId, nProcessSize, nTotal}) {
        let msgList = state.msgMap[channelId];
        msgList.forEach((msg) => {
            if (msg.msgId === msgId) {
                msg.percent = nProcessSize / nTotal;
            }
        });
    },
    [types.CHANGE_RECONNECTED_STATUS](state, {flag, channelId, seqId, unReadNum, loadingSeqId, getNearMsg}) {
        typeof flag !== 'undefined' && (state.gettingReconnectedMsg.flag = flag);
        typeof channelId !== 'undefined' && (state.gettingReconnectedMsg.channelId = channelId);
        typeof seqId !== 'undefined' && (state.gettingReconnectedMsg.seqId = seqId);
        typeof unReadNum !== 'undefined' && (state.gettingReconnectedMsg.unReadNum = unReadNum);
        typeof loadingSeqId !== 'undefined' && (state.gettingReconnectedMsg.loadingSeqId = loadingSeqId);
        typeof getNearMsg !== 'undefined' && (state.gettingReconnectedMsg.getNearMsg = getNearMsg);
    },
    [types.CLEAR_UNCONNECT_READED_COUNT](state) {
        state.unConnectedReadedCount = {};
    }
};
const getters = {
    msgMap: state => state.msgMap,
    msgUpdateFlag: state => state.msgUpdateFlag,
    receiveFlag: state => state.receiveFlag,
    receiveChannelId: state => state.receiveChannelId,
    receiveMsg: state => state.receiveMsg,
    channelSpecialMsgList: state => state.channelSpecialMsgList,
    isGetMsg: state => state.isGetMsg,
    readedSpecialMsgList: state => state.readedSpecialMsgList,
    specialMsgMap: state => state.specialMsgMap,
    haveFault: state => state.haveFault,
    isClickSpecialMsgMap: state => state.isClickSpecialMsgMap,
    isGettingDownMsg: state => state.isGettingDownMsg,
    gettingReconnectedMsg: state => state.gettingReconnectedMsg,
    unConnectedReadedCount: state => state.unConnectedReadedCount
};
export default {
    state,
    mutations,
    getters
};

