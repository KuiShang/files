import * as types from './mutation-types';
import API from '../API';
import VueApp from '../main';

export const getMyInfo = ({
    commit
}, info) => {
    let myInfo = {};

    myInfo.imUserId = info.imUserid;
    myInfo.imId = info.imUserid;
    myInfo.imToken = info.imtoken;
    myInfo.imTokenExpirationTime = info.imtokenExpirationTime;
    myInfo.oaId = info.myid;
    myInfo.name = info.myname;
    myInfo.phone = info.myphone;
    myInfo.token = info.token;
    myInfo.tokenExpirationTime = info.tokenExpirationTime;
    myInfo.companyId = info.companyId;

    commit(types.GET_MY_INFO, myInfo);
};

export const setHotKey = ({ commit }, data) => {
    commit(types.SET_HOT_KEY, data);
};

export const setGlobalStatus = ({ commit }, data) => {
    commit(types.SET_GLOBAL_STATUS, data);
};

// export const getSession = ({
//     commit
// }, sessions) => {
//     commit(types.GET_SESSION, sessions);
// };
//
// export const getMsgList = ({
//     commit
// }, groupId) => {
//     window.mainObject.GetMsglist(groupId, 0, 20, function(msgs) {
//         console.log('历史消息', msgs);
//         commit(types.GET_MSG_LIST, {
//             msgs,
//             groupId
//         });
//     });
// };
//
// export const setCurrentSession = ({
//     commit
// }, groupId) => {
//     commit(types.SET_CURRENT_SESSION, groupId);
// };

// 设置当前频道回话
export const setCurrentChannelSession = ({commit, getters}, channel) => {
    if (typeof channel === 'string') {
        getters.channelSessionList.forEach(item => {
            item.ChannelId === channel && commit(types.SET_CURRENT_CHANNEL_SESSION, item);
        });
        return;
    }
    commit(types.SET_CURRENT_CHANNEL_SESSION, channel);
};

// 获取频道列表
export const getChannels = ({commit, getters, state}, {channels, flag}) => {
    let currentStatus = {
        channelId: getters.currentChannelId,
        loadingSeqId: getters.currentChannelSession.loadingSeqId
    };
    if (flag === 1) {
        if (getters.currentChannelId) {
            if (getters.haveFault) {
                commit(types.CHANGE_RECONNECTED_STATUS, {getNearMsg: true});
            }
            let config = {
                bSpecialMsg: false,
                channelId: getters.currentChannelId,
                msgSeqId: getters.currentChannelSession.maxSeqId + 1,
                pageSize: 20,
                upOrDown: 1
            };
            API.reloadDownChannelMsg(config);
            // commit(types.SET_FAULT_MESSAGE, {currentChannelId: getters.currentChannelId, msgs: getters.msgMap[getters.currentChannelId]});
        }
        channels.forEach((channel) => {
            if (getters.unConnectedReadedCount && getters.unConnectedReadedCount[channel.ChannelId]) {
                channel.readSeqId = getters.unConnectedReadedCount[channel.ChannelId].readSeqId;
                channel.sepcialMsgCount = channel.sepcialMsgCount - getters.unConnectedReadedCount[channel.ChannelId].sepcialMsgCount;
                API.submitReadSeqId({
                    uid: getters.imUserId,
                    channelId: channel.ChannelId,
                    readSeqId: channel.readSeqId
                });
            }
            // getters.channelSessionList.forEach(function(item) {
            //     if (channel.ChannelId === item.ChannelId && channel.readSeqId < item.readSeqId) {
            //         channel.readSeqId = item.readSeqId;
            //         channel.sepcialMsgCount = 0;
            //         API.submitReadSeqId({
            //             uid: getters.imUserId,
            //             channelId: channel.ChannelId,
            //             readSeqId: channel.readSeqId
            //         });
            //     }
            // });
            if (channel.ChannelId === getters.currentChannelId && getters.globalStatus === 'channel' && getters.visible === true) {
                channel.readSeqId = channel.maxSeqId;
                channel.sepcialMsgCount = 0;
                setTimeout(() => {
                    API.submitReadSeqId({
                        uid: getters.imUserId,
                        channelId: channel.ChannelId,
                        readSeqId: channel.maxSeqId
                    });
                }, 1000);
                if (channel.maxSeqId !== getters.currentChannelSession.maxSeqId) {
                    commit(types.CHANGE_RECONNECTED_STATUS, {flag: true, channelId: getters.currentChannelId, seqId: getters.currentChannelSession.maxSeqId, unReadNum: channel.maxSeqId - getters.currentChannelSession.maxSeqId});
                }
                // commit(types.SET_CURRENT_CHANNEL_SESSION, channel);
            } else {
                commit(types.CLEAR_CHANNEL_MSG_LIST, channel.ChannelId);
            }
        });
        commit(types.CLEAR_UNCONNECT_READED_COUNT);
    }
    commit(types.GET_CHANNELS, {channels, currentStatus});
    channels.forEach((item) => {
        if (item.ChannelId === getters.currentChannelId) {
            commit(types.SET_CURRENT_CHANNEL_SESSION, item);
        }
        if (typeof getters.msgMap[item.ChannelId] === 'undefined') {
            commit(types.GET_CHANNEL_MSG_LIST, {channelId: item.ChannelId, msgs: []});
            API.getChannelMsgList({
                sendTime: item.lastMsgTime,
                channelId: item.ChannelId,
                msgSeqId: item.maxSeqId
            });
        }
        // commit(types.GET_CHANNEL_MSG_LIST, {channelId: item.ChannelId, msgs: []});
    });
};

// 获取频道消息
export const getChannelMsgList = ({commit, getters, state}, {data, channelId}) => {
    let msgs = data;
    commit(types.GET_CHANNEL_MSG_LIST, {channelId, msgs, currentId: getters.currentChannelId});
    if (msgs.length < 20) {
        commit(types.SET_LOAD_MORE_MSG, channelId);
    }
    if (getters.gettingReconnectedMsg.flag && getters.gettingReconnectedMsg.channelId === channelId) {
        let i = 0,
            length = getters.channelSessionList.length;
        for (; i < length; i++) {
            if (getters.channelSessionList[i].ChannelId === channelId) {
                if (msgs[msgs.length - 1].msgSeqId === getters.channelSessionList[i].maxSeqId && msgs[msgs.length - 1].sendtime === getters.channelSessionList[i].lastMsgTime) {
                    setTimeout(() => {
                        commit(types.CHANGE_RECONNECTED_STATUS, {flag: false, channelId: '', seqId: 0});
                    });
                }
            }
        }
    }
    // commit(types.SET_LOADING_SEQ_ID, {data, channelId});
    msgs.forEach((msg) => {
        if (msg.specialMsgType === 3 && getters.imUserId === msg.senderId) {
            API.getChannelOrUnReadAsync({
                channelId: msg.channelId,
                msgId: msg.msgId
            });
        }
    });
};

// 收到消息
export const receiveChannelMsg = ({ commit, getters }, msg) => {
    let channelId = msg.channelId || msg.channelId;

    if (msg.msgType === 98 || msg.msgType === 99) {
        if (msg.type === 7 && msg.state === 0 && msg.userIdList.indexOf(getters.imUserId) !== -1) {
            if (msg.channelId === getters.currentChannelSession.ChannelId) {
                commit(types.SET_CURRENT_CHANNEL_SESSION, {});
                commit(types.CHANGE_RECONNECTED_STATUS, {flag: false, channelId: '', seqId: 0});
                let channelInfo = $('.new-channel-conversation').data();
                if (channelInfo && channelInfo.ChannelId === msg.channelId) {
                    $('#channel-detail').addClass('hideList');
                    $('#members-no-record').removeClass('hideList');
                }
            }
            commit(types.CLEAR_CHANNEL_MSG_LIST, channelId);
            return;
        }
        commit(types.HANDLE_TRANSPARENT_MESSAGE, {msg, imId: getters.imUserId, currentChannelSession: getters.currentChannelSession});
    }
    if (getters.gettingReconnectedMsg.flag) {
        if (getters.currentChannelId !== getters.gettingReconnectedMsg.channelId) {
            commit(types.RECEIVE_CHANNEL_MSG, {channelId, msg});
        }
    } else {
        commit(types.RECEIVE_CHANNEL_MSG, {channelId, msg});
    }
    if (msg.specialMsgType === 3 && msg.id === getters.myInfo.oaId) {
        API.getChannelOrUnReadAsync({
            channelId: msg.channelId,
            msgId: msg.msgId
        });
    }
    if (msg.msgType !== 98 && msg.msgType !== 99) {
        commit(types.ADD_MAX_SEQ_ID, {channelId, seqId: msg.msgSeqId});
    }
    if (!msg.type || msg.type === 6 || msg.type === 7 || msg.type === 10) {
        commit(types.SET_LAST_MSG_TIME, {timestamp: msg.sendtime, channelId});
    }
};

// 发送消息后显示到将消息添加到vuex中
export const addSentMsg = ({commit}, msgArr) => {
    let channelId = msgArr[0].channelId;
    commit(types.ADD_SENT_MSG, {channelId, msgArr});
    commit(types.SET_LAST_MSG_TIME, {timestamp: Date.parse(new Date()), channelId});
};

// 发送消息成功回调
export const sendChannelMsgSuccess = ({ commit, getters }, data) => {
    if (data.nReason === 200000) {
        let seqId;
        getters.channelSessionList.forEach(channel => {
            if (channel.ChannelId === data.channelId) {
                seqId = channel.maxSeqId + 1;
            }
        });
        commit(types.SEND_CHANNEL_MSG_SUCCESS, {data, seqId: seqId});
        commit(types.ADD_MAX_SEQ_ID, {channelId: data.channelId});
        if (data.specialMsgType === 3) {
            API.getChannelOrUnReadAsync({
                channelId: data.channelId,
                msgId: data.msgId
            });
        }
    } else {
        commit(types.SEND_CHANNEL_MSG_FAILED, data);
    }
};

// 增加未读数量
export const addUnreadNum = ({ commit }, data) => {
    commit(types.ADD_UNREAD_NUM, data);
};

// 重进频道时剪掉最新的20条消息以外的消息
export const cutMessages = ({ commit, getters }, channelId) => {
    if (!channelId) {
        return;
    }
    commit(types.CUT_MESSAGES, channelId);
    commit(types.CUT_MESSAGES_CHANNEL, {channelId, msgs: getters.msgMap[channelId]});
};

// 获得频道特殊消息列表
export const getChannelSpecialMsgList = ({ commit }, data) => {
    commit(types.GET_CHANNEL_SPECIAL_MSG_LIST, data);
    // API.submitReadSeqId({
    //     uid: getters.imUserId,
    //     channelId: data[0].ChannelId,
    //     readSeqId: data[0].maxSeqId
    // });
};

// 消息点赞回调
export const receiveMsgPraisedSignal = ({ commit }, data) => {
    commit(types.RECEIVE_MSG_PRAISED_SIGNAL, data);
};

// 上传文件成功失败回调
export const fileUpChannelReal = ({ commit }, data) => {
    commit(types.FILE_UP_CHANNEL_REAL, data);
};

// 上传文件成功失败回调
export const fileDownloadChannelReal = ({ commit }, data) => {
    commit(types.FILE_DOWNLOAD_CHANNEL_REAL, data);
};

// 上传文件成功失败回调
export const fileUpDownChannelProcess = ({ commit }, data) => {
    commit(types.FILE_UPDOWNLOAD_CHANNEL_PROCESS, data);
};
// 上传下载文件状态回调
export const sigChannelStatus = ({ commit }, obj) => {
    commit(types.SIG_CHANNEL_STATUS, obj);
};
// 频道成员添加到vuex中
export const getChannelMembers = ({commit}, {members, channelId, count}) => {
    const ret = [];
    for (let k of Object.keys(members)) {
        let tempKeyObj = {
            'isLeter': k
        };
        members[k].length && ret.push(tempKeyObj);
        members[k].forEach(item => ret.push(item));
    }
    commit(types.GET_MEMBERS, {
        [channelId]: ret
    });
    commit(types.GET_MEMBERS_COUNT, {[channelId]: count});
};

// 语音播放完成
export const soundPlayFinish = ({ commit }, data) => {
    commit(types.SOUND_PLAY_FINISH, data);
};

// 获取回执消息已读未读列表
export const getUnreadList = ({ commit }, data) => {
    // if (data.nReason === 1) {
    //     return;
    // }
    commit(types.GET_UNREAD_LIST, data);
};
// 双击托盘打开最新一条未读消息
export const openUnreadChannelOrSenssion = ({commit, state}) => {
    console.log(state);
    let globalStatus = state.status.globalStatus;
    let channelSessionList = state.channels.channelSessionList;
    let first = true;
    if (globalStatus === 'chat' || globalStatus === 'contact' || globalStatus === 'application') {
        if (hasUnreadSenssion()) {
            openUnreadSenssion();
            commit(types.SET_GLOBAL_STATUS, 'chat');
        } else if (hasUnreadChannelMsg(channelSessionList)) {
            commit(types.SET_GLOBAL_STATUS, 'channel');
            VueApp.$store.dispatch('openUnreadChannelOrSenssion');
        }
    } else if (globalStatus === 'channel' || globalStatus === 'contact' || globalStatus === 'application') {
        channelSessionList.forEach(channel => {
            if (channel.unReadMsgCount === 0) {
                return false;
            }
            if (!first) {
                return;
            }
            commit(types.SET_GLOBAL_STATUS, 'channel');
            if (channel.unReadMsgCount > 0) {
                channel.unReadMsgCount = 0;
                channel.sepcialMsgCount = 0;
                var config = {
                    uid: state.myInfo.info.imUserId,
                    channelId: channel.ChannelId,
                    readSeqId: channel.maxSeqId
                };
                setTimeout(() => {
                    API.submitReadSeqId(config);
                }, 1000);
            }
            setCurrentChannelSession({commit}, channel);
            window.mainObject.getChannelSpecialMsg(channel.channelId);
            API.setMsgReaded(channel.channelId, true);
            first = false;
        });
        if (first && hasUnreadSenssion()) {
            openUnreadSenssion();
            commit(types.SET_GLOBAL_STATUS, 'chat');
        }
    }
};
// 点击消息盒子某一项
export const openMsgBoxChannelOrSession = ({commit, state}, data) => {
    console.log(data);
    let channelSessionList = state.channels.channelSessionList;
    let type = data.type;
    let sessionsId = data.sessionid;
    if (type === '1') {
        openMsgBoxSession(sessionsId);
        commit(types.SET_GLOBAL_STATUS, 'chat');
    } else if (type === '2') {
        openMsgBoxSession(sessionsId);
        commit(types.SET_GLOBAL_STATUS, 'chat');
    } else if (type === '3') {
        channelSessionList.forEach(channel => {
            if (channel.ChannelId === sessionsId) {
                commit(types.SET_GLOBAL_STATUS, 'channel');
                channel.unReadMsgCount = 0;
                channel.sepcialMsgCount = 0;
                var config = {
                    uid: state.myInfo.info.imUserId,
                    channelId: channel.ChannelId,
                    readSeqId: channel.maxSeqId
                };
                setTimeout(() => {
                    API.submitReadSeqId(config);
                }, 1000);
                setTimeout(() => {
                    if ($('#channel-' + channel.ChannelId).hasClass('active')) {
                        var sessionTop = $('#channel-' + channel.ChannelId)[0].offsetTop;
                        var sessionScrollTop = $('#channel-' + channel.ChannelId).parent().parent().parent().scrollTop();
                        var sessionHeight = $('#channel-' + channel.ChannelId)[0].offsetHeight;
                        var sessionBoxHeight = $('#channel-' + channel.ChannelId).parent().parent().parent()[0].offsetHeight;
                        if (sessionTop < sessionScrollTop) {
                            $('#channel-' + channel.ChannelId).parent().parent().parent().scrollTop(sessionTop);
                        }
                        if ((sessionTop + sessionHeight) > (sessionScrollTop + sessionBoxHeight)) {
                            var newTop = sessionTop + sessionHeight - sessionBoxHeight;
                            $('#channel-' + channel.ChannelId).parent().parent().parent().scrollTop(newTop);
                        }
                    }
                }, 300);
                setCurrentChannelSession({commit}, channel);
                window.mainObject.getChannelSpecialMsg(channel.channelId);
                API.setMsgReaded(channel.channelId, true);
            }
        });
    }
};
// 删除消息
export const deleteMessage = ({ commit, getters }, data) => {
    commit(types.DELETE_MESSAGE, {data, imUserId: getters.imUserId});
};

// 设置断网状态
export const changeConnectedStatus = ({ commit }, {data, text}) => {
    console.log(data, text);
    commit(types.CHANGE_CONNECTED_STATUS, {data, text});
    if (data) {
        API.getChannels(1);
    }
};

// 设置窗口可见
export const setWindowVisibility = ({ commit }, data) => {
    commit(types.SET_WINDOW_VISIBILITY, data);
};

// 设置应用页未读数
export const setApplicationUnreadNum = ({ commit }, data) => {
    let json = JSON.parse(data);
    if (json.code !== 0) {
        console.log('set application unread num failed', json.code);
        return;
    }
    let numMap = json.data;
    commit(types.SET_APPLICATION_UNREAD_NUM, numMap);
};

//
export const receiveApplicationNotify = ({ commit }, data) => {
    let msg = JSON.parse(data);
    let config;
    if (msg.type === 2) {
        config = {
            type: msg.type,
            count: JSON.parse(msg.extra).count
        };
        commit(types.RECEIVE_APPLICATION_NOTIFY, config);
    } else if (msg.type === 3) {
        config = {
            type: msg.type,
            handleCount: JSON.parse(msg.extra).handleCount
        };
        commit(types.RECEIVE_APPLICATION_NOTIFY, config);
    }
};

// 频道管理员修改回调
export const transferChannelAdmin = ({ commit }, flag) => {
    if (flag) {
        commit(types.OPEN_SETTING, false);
    }
};

function hasUnreadChannelMsg(channelSessionList) {
    let flag = false;
    channelSessionList.forEach(channel => {
        if (channel.unReadMsgCount > 0) {
            flag = true;
        }
    });
    return flag;
}
