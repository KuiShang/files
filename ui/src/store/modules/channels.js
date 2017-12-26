/**
 * Created by lixiaohu on 2017/5/27.
 */

import * as types from '../mutation-types';
import API from '../../API';
import Vue from 'vue';

const state = {
    channelSessionList: [],
    finishInit: false,
    isRebuildConnect: false
};

const mutations = {
    [types.GET_CHANNELS](state, {channels, currentStatus}) {
        channels.forEach((channel) => {
            channel.unReadMsgCount = channel.maxSeqId - channel.readSeqId;
            channel.canLoadMoreMsg = true;
            // if (currentStatus.channelId && currentStatus.channelId === channel.ChannelId) {
            //     channel.loadingSeqId = currentStatus.loadingSeqId;
            // } else {
            //     channel.loadingSeqId = channel.maxSeqId;
            // }
        });
        state.channelSessionList = channels;
        state.finishInit = true;
    },
    // [types.SET_LOADING_SEQ_ID](state, {data, channelId}) {
    //     doSomethingAtChannel(state, channelId, function(channel) {
    //         let id = channel.loadingSeqId;
    //         data.forEach(msg => {
    //             if (msg.msgSeqId && msg.msgSeqId < id) {
    //                 id = msg.msgSeqId;
    //             }
    //         });
    //         channel.loadingSeqId = id - 1;
    //     });
    // },
    [types.ADD_MAX_SEQ_ID](state, {channelId, seqId}) {
        doSomethingAtChannel(state, channelId, function(channel) {
            seqId ? channel.maxSeqId = seqId : channel.maxSeqId++;
        });
    },
    [types.SET_LAST_MSG_TIME](state, {timestamp, channelId}) {
        if (!timestamp) {
            return;
        }
        doSomethingAtChannel(state, channelId, function(channel) {
            channel.lastMsgTime = timestamp;
        });
    },
    [types.ADD_UNREAD_NUM](state, { receiveMsg, receiveChannelId, imUserId }) {
        doSomethingAtChannel(state, receiveChannelId, function(channel) {
            channel.unReadMsgCount++;
            if (receiveMsg.specialMsgType === 1 && receiveMsg.altUids && receiveMsg.altUids.split(',').indexOf(imUserId.toString()) === -1) {
                return;
            }
            if (receiveMsg.specialMsgType) {
                channel.sepcialMsgCount++;
            }
        });
    },
    [types.CUT_MESSAGES_CHANNEL](state, {channelId, msgs}) {
        doSomethingAtChannel(state, channelId, function(channel) {
            let id;
            msgs.forEach(msg => {
                if (typeof id === 'undefined' && msg.msgSeqId) {
                    id = msg.msgSeqId;
                }
                if (msg.msgSeqId && msg.msgSeqId < id) {
                    id = msg.msgSeqId;
                }
            });
            // channel.loadingSeqId = id ? id - 1 : channel.maxSeqId;
        });
    },
    [types.GET_MEMBERS_COUNT](state, data) {
        let channelId = Object.keys(data);
        doSomethingAtChannel(state, channelId[0], function(channel) {
            Vue.set(channel, 'memberCount', data[channelId]);
        });
    },
    [types.HANDLE_TRANSPARENT_MESSAGE](state, {msg, imId, currentChannelSession}) {
        let channelId = msg.channelId;
        var channelInfo = $('.new-channel-conversation').data();
        switch (msg.type) {
            case 1:
            case 2:
                break;
            case 3:
                doSomethingAtChannel(state, channelId, function(channel) {
                    let flag = msg.state === 1;
                    channel.top = flag;
                });
                break;
            case 4:
                doSomethingAtChannel(state, channelId, function(channel) {
                    channel.newMsgRemind = msg.state;
                });
                break;
            case 5:
                doSomethingAtChannel(state, channelId, function(channel) {
                    channel.receiveCommonMsg = msg.state;
                });
                break;
            case 6:
                doSomethingAtChannel(state, channelId, function(channel) {
                    channel.ChannelName = msg.channelName;
                    channel.deptName = msg.deptName;
                    $('#channel-' + channelId).data({
                        ChannelName: msg.channelName
                    });
                    $('#channel-' + channelId).find('p').html(msg.channelName);
                });
                if (channelInfo && channelInfo.ChannelId === channelId) {
                    var index = $('#channel-detail-title p').html().lastIndexOf('(');
                    var html = msg.channelName + $('#channel-detail-title p').html().split('').splice(index).join('');
                    $('#channel-detail-title p').html(html);
                }
                break;
            case 7:
                API.getChannelMembers(msg.channelId);
                break;
            case 8:
                doSomethingAtChannel(state, channelId, function(channel) {
                    channel.notice = msg.content;
                    $('#channel-' + channelId).data({
                        notice: msg.content
                    });
                });
                if (channelInfo && channelInfo.ChannelId === channelId) {
                    $('#channel-bulletin').html(msg.content);
                }
                break;
            case 9:
                doSomethingAtChannel(state, channelId, function(channel) {
                    channel.ChannelDesc = msg.channelDesc;
                    $('#channel-' + channelId).data({
                        ChannelDesc: msg.channelDesc
                    });
                });
                if (channelInfo && channelInfo.ChannelId === channelId) {
                    $('#channel-name').html(msg.channelDesc);
                }
                break;
            case 10:
                doSomethingAtChannel(state, channelId, function(channel) {
                    channel.adminId = msg.adminId;
                });
                API.getChannelMembers(channelId);
                break;
            default:
                break;
        }
    },
    [types.SYNC_UNREAD_MSG](state, data) {
        let channelId = data.channelId;
        doSomethingAtChannel(state, channelId, function(channel) {
            if (channel.readSeqId < data.readSeqId) {
                channel.readSeqId = data.readSeqId;
                channel.unReadMsgCount = 0;
                channel.sepcialMsgCount = 0;
            }
        });
    },
    [types.SET_LOAD_MORE_MSG](state, channelId) {
        console.log('SET_LOAD_MORE_MSG');
        doSomethingAtChannel(state, channelId, function(channel) {
            channel.canLoadMoreMsg = false;
        });
    }
};

function doSomethingAtChannel(state, channelId, fn) {
    let i = 0,
        length = state.channelSessionList.length;
    for (; i < length; i++) {
        if (state.channelSessionList[i].ChannelId === channelId) {
            fn(state.channelSessionList[i], i);
            return;
        }
    }
}

const getters = {
    topChannels: state => {
        let arr = [];
        state.channelSessionList.forEach((data) => {
            data.top && arr.push(data);
        });
        arr.sort((a1, a2) => {
            let time1 = a1.lastMsgTime || (a1.ctime * 1000);
            let time2 = a2.lastMsgTime || (a2.ctime * 1000);
            return time2 - time1;
        });
        return arr;
    },
    unTopChannels: state => {
        let arr = [];
        state.channelSessionList.forEach((data) => {
            !data.top && arr.push(data);
        });
        arr.sort((a1, a2) => {
            let time1 = a1.lastMsgTime || (a1.ctime * 1000);
            let time2 = a2.lastMsgTime || (a2.ctime * 1000);
            return time2 - time1;
        });
        return arr;
    },
    channelSessionList: state => state.channelSessionList
};

export default {
    state,
    mutations,
    getters
};
