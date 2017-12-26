<template>
    <div id="channel-msg-area">

        <div id="New-channelMsgTip" class="channelList-new " v-if="channelSpecialMsgList && channelSpecialMsgList.length === 0 && this.readSeqId > 0 && this.lastestTop > 10" @click='goOldMsgFirst'>{{this.lastestTop}}条新消息</div>
        <div id="At-channelMsgTip" class="channelList-new " v-if="channelSpecialMsg && channelSpecialMsg.length > 0 && channelSpecialMsg[channelSpecialMsg.length-1].specialMsgType === 1 " @click="goSpecialMsg">有人@我</div>
        <div id="Notice-channelMsgTip" class="channelList-new " v-if="channelSpecialMsg && channelSpecialMsg.length > 0 && channelSpecialMsg[channelSpecialMsg.length-1].specialMsgType === 4 " @click="goSpecialMsg">频道公告</div>
        <div id="Receipt-channelMsgTip" class="channelList-new " v-if="channelSpecialMsg && channelSpecialMsg.length > 0 && channelSpecialMsg[channelSpecialMsg.length-1].specialMsgType === 3 " @click="goSpecialMsg">回执消息</div>
        <div id="Current-channelMsgTip" class="channelList-new-current" v-if="goBottomStatus && this.newMsg > 0" @click="goCurrent">{{this.newMsg}}条新消息</div>
        <div id="GoBottom-channelMsgTip" class="channelList-channelMsgGoBottom " v-if="goBottomStatus && this.newMsg === 0 && channelSpecialMsgList.length === 0 && this.allRightBtnOk" @click="goBottom" ></div>
        <div class="chat-title channel-title" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <span class="icon-channel" v-if='$store.state.status.currentChannelSession.ChannelName'>#</span>
            <span class="channel-title-content">{{$store.state.status.currentChannelSession.ChannelName && $store.state.status.currentChannelSession.ChannelName}}</span>
            <span class="channel-title-count">{{$store.state.status.currentChannelSession.ChannelName && membersCount[$store.state.status.currentChannelSession.ChannelId] && '(' + membersCount[$store.state.status.currentChannelSession.ChannelId] + '人)'}}</span>
            <span class="offical-channel mac-offical-channel" v-if="$store.state.status.currentChannelSession.offical === 0">官方</span>
        </div>
        <div class="channel-menu" v-if="currentSession.ChannelName">
            <span class="channel-menu-item active">会话</span>
            <!--<span class="channel-menu-item">文件</span>-->
            <span></span>
            <span><img src="./icon打开遮层@2x.png" alt="" class="open-setting-btn" @click="openSetting" @mouseenter="tooltipIn('打开设置')" @mouseleave="tooltipOut"></span>
        </div>
        <div class="channel-msg-list" @scroll="loadMore">
            <div class="channel-msg-list-wrapper">
                <div class="list-more" v-if="currentSession.ChannelName && messageList.length > 0 && messageList.length >= 20 && currentSession.canLoadMoreMsg">
                    <a href="javascript:;" @click="loadMoreMsg" v-if="this.isConnnectLoadMore">查看更多消息</a>
                    <div v-if="!this.isConnnectLoadMore">
                        加载失败，请<a href="javascript:;" @click="loadMoreMsg">重试</a>
                    </div>
                </div>
                <Message v-for="(msg, index) in messageList"
                         :msg="msg"
                         :index="index"
                         :key="index"
                         :messageList="messageList"
                         @showChannelMsgContextMenu="showChannelMsgContextMenu"
                         @hideChannelMsgContextMenu="hideChannelMsgContextMenu"
                         @showListNameContextMenu = "showListNameContextMenu"
                >
                </Message>
                <!--<div class="list-more" v-if="!this.$store.state.status.connected">-->
                    <!--加载失败，请<a href="javascript:;" @click="loadMoreMsg">重试</a>-->
                <!--</div>-->
            </div>
        </div>
        <div class="no-record" v-if="!currentSession.ChannelName">
            <img src="../../../images/public/no-record.jpg" width="132" height="132">
        </div>
        <TextEditor v-if="currentSession.ChannelName" :module="'channel'"></TextEditor>
        <ChannelMsgContextMenu ref="channelMsgContextMenu" @showSendreturnTip="showSendreturn"></ChannelMsgContextMenu>
        <SimpleRightMenu v-if="this.rightMenuId === this.currentSimpleRightmenuId" :clientX="clientX" :clientY="clientY">
            <div class="newconversion" @click="newConversion">发起会话</div>
            <div class="aite" @click="insertAite">@TA</div>
        </SimpleRightMenu>
    </div>
</template>

<script>
    import SimpleRightMenu from '../../Commons/SimpleRightMenu/SimpleRightMenu.vue';
    import TextEditor from '../TextEditor';
    import { mapGetters } from 'vuex';
    import Message from '../Messages';
    import ChannelMsgContextMenu from '../ChannelMsgContextMenu';
    import dbclick from '../mixin/fordbclick';
    import tooltip from '../mixin/tooltips';
    import * as types from '../../store/mutation-types';
    export default {
        data() {
            return {
                rightMenuId: Symbol('LIST_NAME'),
                listNameRightMenuMsg: {},
                clientX: 0,
                clientY: 0,
                newMsg: 0,
                goBottomStatus: false,
                newUnReadMsg: {},
                topAndBottomArray: [],
                specialMsgLoad: false,
                readSeqId: 0,
                allRightBtnOk: false,
                currentMsgLoad: false,
                loadBottomMsg: false,
                maxSeqId: 0,
                receiptNums: [],
                showSendreturnTip: false,
                isConnnectLoadMore: true,
                showMoreClick: true
            };
        },
        computed: {
            ...mapGetters({
                currentSimpleRightmenuId: 'currentSimpleRightmenuId',
                msgMap: 'msgMap',
                msgUpdateFlag: 'msgUpdateFlag',
                receiveChannelId: 'receiveChannelId',
                receiveFlag: 'receiveFlag',
                receiveMsg: 'receiveMsg',
                channelSpecialMsgList: 'channelSpecialMsgList',
		        currentChannelId: 'currentChannelId',
                members: 'members',
                isGetMsg: 'isGetMsg',
                imUserId: 'imUserId',
                membersCount: 'membersCount',
                visible: 'visible',
                globalStatus: 'globalStatus',
                readedSpecialMsgList: 'readedSpecialMsgList',
                haveFault: 'haveFault',
                isClickSpecialMsgMap: 'isClickSpecialMsgMap',
                specialMsgMap: 'specialMsgMap',
                isGettingDownMsg: 'isGettingDownMsg',
                unConnectedReadedCount: 'unConnectedReadedCount',
                connected: 'connected'
            }),
            currentSession() {
                return this.$store.state.status.currentChannelSession;
            },
            messageList() {
                if (this.haveFault === true) {
                    return this.specialMsgMap[this.currentSession.ChannelId];
                } else if (this.haveFault === false) {
                    return this.msgMap[this.currentSession.ChannelId];
                }
            },
            channelSpecialMsg() {
                let msgListAry = this.channelSpecialMsgList;
                for (let i = 0; i < msgListAry.length; i++) {
                    let offsetTop = $('#msg-' + msgListAry[i].msgId)[0] ? $('#msg-' + msgListAry[i].msgId)[0].offsetTop : undefined;
                    let scrollTop = $('.channel-msg-list').scrollTop();
                    if (offsetTop && offsetTop >= scrollTop) {
                        msgListAry.splice(i, 1);
                        i--;
                        // console.log("在屏幕内-1",msgListAry)
                    }
                }
                return msgListAry;
            },
            lastestTop() {
                // console.log(this.messageList, "2321312312")
                if (this.isGetMsg) {
                    if (this.topAndBottomArray.length > 0 && this.channelSpecialMsg.length === 0) {
                        if (typeof this.messageList === 'undefined') {
                            return;
                        }
                        let theLastTop = this.messageList[0].msgSeqId;
                        if ((theLastTop - this.readSeqId) <= 1) {
                            this.allRightBtnOk = true;
                        } else {
                            return theLastTop - this.readSeqId + 9;
                        }
                    } else if (this.topAndBottomArray.length === 0 && this.channelSpecialMsg.length === 0) {
                        if (this.maxSeqId - this.readSeqId > 10) {
                            return this.maxSeqId - this.readSeqId;
                        }
                    }
                }
            },
            gettingReconnectedMsgFlag() {
                return this.$store.state.messages.gettingReconnectedMsg.flag;
            }
        },
        components: { TextEditor, Message, ChannelMsgContextMenu, SimpleRightMenu },
        mixins: [dbclick, tooltip],
        methods: {
            showListNameContextMenu(msg, x, y) {
                this.$store.commit(types.SET_CURRENT_SIMPLE_RIGHTMENU_ID, this.rightMenuId);
                this.clientX = x;
                this.clientY = y;
                this.listNameRightMenuMsg = msg;
                console.log(msg, x, y);
            },
            insertAite() {
                this.$api.getPicturePromise('@' + this.listNameRightMenuMsg.staffName).then(pic => {
                    let img = document.createElement('img'),
                        picHeight = pic.picHeight;
                    img.className = 'input-msg-at';
                    img.setAttribute('data-at-name', '@' + this.listNameRightMenuMsg.staffName);
                    img.setAttribute('im-id', this.listNameRightMenuMsg.imUserId);
                    img.src = pic.picPath;
                    if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
                        picHeight = picHeight / 2;
                    }
                    img.style.height = picHeight + 'px';
                    insertImg(img.outerHTML + ' ');
                });
                console.log('insertAite');
            },
            newConversion() {
                let groupId = getGroupId(this.listNameRightMenuMsg.imUserId, this.imUserId);
                newConversation({
                    imid: this.listNameRightMenuMsg.imUserId,
                    staffName: this.listNameRightMenuMsg.staffName,
                    groupType: 1,
                    dutyName: this.listNameRightMenuMsg.dutyName,
                    deptName: this.listNameRightMenuMsg.deptName
                }, true, function() {
                    $('#session').parent().scrollTop(document.querySelector('#session-' + groupId).offsetTop);
                });
                console.log('newConversion');
            },
            showSendreturn(msg) {
                this.$emit('showSendreturnTip', msg);
            },
            loadMoreMsg() {
                if (this.showMoreClick === false) {
                    return;
                }
                this.showMoreClick = false;
                this.$api.getChannelMsgList({
                    sendTime: this.messageList[0].sendTime || this.messageList[0].sendtime,
                    channelId: this.currentChannelId,
                    msgSeqId: this.messageList[0].msgSeqId,
                    upOrDown: 0
                });
                this.oldScrollHeight = $('.channel-msg-list-wrapper')[0].scrollHeight;
                setTimeout(() => {
                    this.isConnnectLoadMore = this.$store.state.status.connected;
                }, 1000);
            },
	        openSetting() {
                // !this.members[this.currentChannelId] && this.$api.getChannelMembers(this.currentChannelId);
                this.$api.getChannelMembers(this.currentChannelId);
                this.$store.commit('openSetting', true);
            },
            goBottom() {
                this.$store.state.messages.haveFault = false;
                this.$nextTick(() => {
                    let msgHeight = $('.channel-msg-list-wrapper').height();
                    $('.channel-msg-list').scrollTop(msgHeight);
                    this.goBottomStatus = false;
                    this.allRightBtnOk = false;
                    this.topAndBottomArray = [];
                    this.readSeqId = this.messageList[this.messageList.length - 1].msgSeqId;
                });
            },
            goCurrent() {
                this.$store.state.messages.haveFault = false;
                this.$nextTick(() => {
                    let firstMsgTopHeight = $('.' + this.newUnReadMsg.msgSeqId)[0].offsetTop;
                    let firstMsgHeight = $('.' + this.newUnReadMsg.msgSeqId)[0].scrollHeight;
                    let msgBoxHeight = $('.channel-msg-list')[0].offsetHeight - 10;
                    $('.channel-msg-list').scrollTop(firstMsgTopHeight - msgBoxHeight + firstMsgHeight);
                    this.goBottomStatus = false;
                    this.newMsg = 0;
                    this.currentMsgLoad = true;
                    this.allRightBtnOk = false;
                    if (this.channelSpecialMsgList.length === 0) {
                        this.readSeqId = this.newUnReadMsg.msgSeqId;
                    }
                });
            },
            goSpecialMsg() {
                if (this.topAndBottomArray.length === 0) {
                    let top = this.messageList[0].msgSeqId;
                    let bottom = this.messageList[this.messageList.length - 1].msgSeqId;
                    this.topAndBottomArray.push({
                        'top': top,
                        'bottom': bottom
                    });
                }
                let lastMsg = $('#msg-' + this.channelSpecialMsg[this.channelSpecialMsg.length - 1].msgId).length > 0;
                if (lastMsg) {
                    let msgTop = $('#msg-' + this.channelSpecialMsg[this.channelSpecialMsg.length - 1].msgId)[0].offsetTop;
                    $('.channel-msg-list').scrollTop(msgTop);
                    for (let i = 0; i < this.messageList.length; i++) {
                        if (this.messageList[i].msgSeqId === this.channelSpecialMsg[this.channelSpecialMsg.length - 1].seqId && (this.channelSpecialMsg[this.channelSpecialMsg.length - 1].specialMsgType === 1 || this.channelSpecialMsg[this.channelSpecialMsg.length - 1].specialMsgType === 3 || this.channelSpecialMsg[this.channelSpecialMsg.length - 1].specialMsgType === 4)) {
                            if (this.readedSpecialMsgList.indexOf(this.messageList[i].msgId) === -1 && this.messageList[i].senderId !== this.imUserId) {
                                let specialMsgData = {
                                    fromUid: this.messageList[i].senderId,
                                    channelId: this.messageList[i].channelId,
                                    readUid: this.$store.state.myInfo.info.imUserId,
                                    msgId: this.messageList[i].msgId,
                                    specialMsgType: this.messageList[i].specialMsgType
                                };
                                console.log('特殊上报', this.messageList[i].msgId);
                                this.$api.sendReadChannelMsgReport(specialMsgData);
                                this.readedSpecialMsgList.push(this.messageList[i].msgId);
                            }
                        }
                    }
                    this.channelSpecialMsg.pop();
                } else {
                    this.specialMsgLoad = true;
                    this.$store.state.messages.haveFault = true;
                    this.$store.state.messages.isClickSpecialMsgMap = true;
                    let config = {
                        channelId: this.currentChannelId,
                        msgSeqId: this.channelSpecialMsg[this.channelSpecialMsg.length - 1].seqId,
                        sendTime: this.channelSpecialMsg[this.channelSpecialMsg.length - 1].sendTime,
                        pageSize: 20,
                        upOrDown: 2
                    };
                    this.$api.getChannelSpecialMsgList(config);
                }
            },
            showChannelMsgContextMenu(component, rect) {
                this.$refs.channelMsgContextMenu.showComponent(component, rect);
            },
            hideChannelMsgContextMenu() {
                this.$refs.channelMsgContextMenu.hideComponent();
            },
            goOldMsgFirst() {
                if (this.topAndBottomArray.length === 0) {
                    let top = this.messageList[0].msgSeqId;
                    let bottom = this.messageList[this.messageList.length - 1].msgSeqId;
                    this.topAndBottomArray.push({
                        'top': top,
                        'bottom': bottom
                    });
                }
                let lastMsg = $('.' + (this.readSeqId + 1)).length > 0;
                if (lastMsg) {
                    let msgTop = $('.' + (this.readSeqId + 1))[0].offsetTop;
                    $('.channel-msg-list').scrollTop(msgTop);
                } else {
                    this.specialMsgLoad = true;
                    this.$store.state.messages.haveFault = true;
                    this.$store.state.messages.isClickSpecialMsgMap = true;
                    let config = {
                        channelId: this.currentChannelId,
                        msgSeqId: this.readSeqId + 1,
                        pageSize: 20,
                        upOrDown: 2
                    };
                    this.$api.getChannelSpecialMsgList(config);
                }
            }
        },
        watch: {
            globalStatus(val) {
                if (val === 'channel') {
                    this.goBottomStatus = true;
                }
            },
            msgUpdateFlag() {
                this.showMoreClick = true;
                if (this.loadBottomMsg) {
                    this.loadBottomMsg = false;
                    return;
                }
                if (this.$store.state.messages.gettingReconnectedMsg.flag) {

                } else {
                    this.$nextTick(() => {
                        // console.log('加载特殊');
                        if (this.specialMsgLoad === true) {
                            this.specialMsgLoad = false;
                            if (this.channelSpecialMsg.length > 0) {
                                for (let i = 0; i < this.messageList.length; i++) {
                                    if (this.messageList[i].msgSeqId === this.channelSpecialMsg[this.channelSpecialMsg.length - 1].seqId && (this.channelSpecialMsg[this.channelSpecialMsg.length - 1].specialMsgType === 1 || this.channelSpecialMsg[this.channelSpecialMsg.length - 1].specialMsgType === 3 || this.channelSpecialMsg[this.channelSpecialMsg.length - 1].specialMsgType === 4)) {
                                        if (this.readedSpecialMsgList.indexOf(this.messageList[i].msgId) === -1 && this.messageList[i].senderId !== this.imUserId) {
                                            let specialMsgData = {
                                                fromUid: this.messageList[i].senderId,
                                                channelId: this.messageList[i].channelId,
                                                readUid: this.$store.state.myInfo.info.imUserId,
                                                msgId: this.messageList[i].msgId,
                                                specialMsgType: this.messageList[i].specialMsgType
                                            };
                                            console.log('特殊2上报', this.messageList[i].msgId);
                                            this.$api.sendReadChannelMsgReport(specialMsgData);
                                            this.readedSpecialMsgList.push(this.messageList[i].msgId);
                                        }
                                    }
                                }
                            }
                            if (this.channelSpecialMsg.length === 0) {
                                let msgLastTop = $('.' + (this.readSeqId + 1))[0].offsetTop;
                                $('.channel-msg-list').scrollTop(msgLastTop);
                                this.allRightBtnOk = true;
                            } else {
                                let msgTop = $('#msg-' + this.channelSpecialMsg[this.channelSpecialMsg.length - 1].msgId)[0].offsetTop;
                                $('.channel-msg-list').scrollTop(msgTop);
                                this.channelSpecialMsg.pop();
                            }
                        } else if (this.currentMsgLoad === true) {
                            let firstMsgTopHeight = $('.' + this.newUnReadMsg.msgSeqId)[0].offsetTop;
                            let firstMsgHeight = $('.' + this.newUnReadMsg.msgSeqId)[0].scrollHeight;
                            let msgBoxHeight = $('.channel-msg-list')[0].offsetHeight;
                            $('.channel-msg-list').scrollTop(firstMsgTopHeight - msgBoxHeight + firstMsgHeight);
                            this.currentMsgLoad = false;
                        } else {
                            if (!this.$store.state.messages.isGettingDownMsg) {
                                var newScrollHeight = $('.channel-msg-list-wrapper')[0].scrollHeight;
                                $('.channel-msg-list').scrollTop(newScrollHeight - this.oldScrollHeight);
                            } else {
                                this.$store.state.messages.isGettingDownMsg = false;
                            }
                        }
                    });
                }
            },
            receiveFlag() {
                // 添加未读
                if (this.receiveMsg.imUserId !== this.imUserId && (this.visible === false || this.$store.state.status.globalStatus !== 'channel' || this.receiveChannelId !== this.currentSession.ChannelId)) {
                    let { receiveMsg, receiveChannelId, imUserId } = this;
                    if (receiveMsg.msgType !== 98 && receiveMsg.msgType !== 99) {
                        this.$store.dispatch('addUnreadNum', { receiveMsg, receiveChannelId, imUserId });
                    }
                    if (this.receiveChannelId === this.currentSession.ChannelId) {
                        let msgHeight = $('.channel-msg-list')[0].scrollHeight;
                        let st = $('.channel-msg-list').scrollTop();
                        let wrapperHeight = $('.channel-msg-list').height();
                        if (msgHeight - st <= wrapperHeight + 20 && st !== 0) {
                            this.$nextTick(function() {
                                $('.channel-msg-list').scrollTop(msgHeight);
                            });
                        } else {
                            if (receiveMsg.msgType !== 98 && receiveMsg.msgType !== 99) {
                                this.newMsg ++;
                                if (this.newMsg === 1) {
                                    this.newUnReadMsg = this.receiveMsg;
                                }
                            }
                        }
                    }
                    return;
                }
                let config = {
                    uid: this.$store.state.myInfo.info.imUserId,
                    channelId: this.currentSession.ChannelId,
                    readSeqId: this.currentSession.maxSeqId,
                    delay: true
                };
                this.$api.submitReadSeqId(config);
                this.currentSession.readSeqId = this.currentSession.maxSeqId;
                let msgHeight = $('.channel-msg-list')[0].scrollHeight;
                let st = $('.channel-msg-list').scrollTop();
                let wrapperHeight = $('.channel-msg-list').height();
                if (msgHeight - st <= wrapperHeight + 20) {
                    this.$nextTick(function() {
                        $('.channel-msg-list').scrollTop(msgHeight);
                    });
                } else {
                    if (this.receiveMsg.msgType !== 98 && this.receiveMsg.msgType !== 99) {
                        this.newMsg ++;
                        if (this.newMsg === 1) {
                            this.newUnReadMsg = this.receiveMsg;
                        }
                    }
                }
            },
            currentSession(channel, oldChannel) {
                if (typeof oldChannel !== 'undefined' && channel.ChannelId === oldChannel.ChannelId) {
                    return;
                }
                oldChannel.canLoadMoreMsg = true;
                this.$api.setCurrentSessionId(this.currentChannelId);
                this.$store.state.messages.haveFault = false;
                this.showMoreClick = true;
                this.$store.state.status.forward.show = false;
                if (this.$store.state.messages.gettingReconnectedMsg.flag) {
                    let config = {
                        bSpecialMsg: false,
                        channelId: this.$store.state.messages.gettingReconnectedMsg.channelId,
                        msgSeqId: this.$store.state.messages.gettingReconnectedMsg.seqId + 1,
                        pageSize: oldChannel.maxSeqId - this.$store.state.messages.gettingReconnectedMsg.seqId,
                        upOrDown: 1
                    };
                    this.$api.reloadDownChannelMsg(config);
                    this.$store.commit('CHANGE_RECONNECTED_STATUS', {flag: false, channelId: '', seqId: '', unReadNum: 0});
                }
                if (this.currentSession.unReadMsgCount > 0) {
                    this.currentSession.unReadMsgCount = 0;
                    this.$api.getChannelSpecialMsg(this.currentSession.ChannelId);
                    let config = {
                        uid: this.$store.state.myInfo.info.imUserId,
                        channelId: this.currentSession.ChannelId,
                        readSeqId: this.currentSession.maxSeqId
                    };
                    setTimeout(() => {
                        this.$api.submitReadSeqId(config);
                    }, 1000);
                }
                if (!this.connected && (!this.unConnectedReadedCount || !this.unConnectedReadedCount[this.currentChannelId])) {
                    this.unConnectedReadedCount[this.currentChannelId] = {};
                    this.unConnectedReadedCount[this.currentChannelId].sepcialMsgCount = channel.sepcialMsgCount;
                    this.unConnectedReadedCount[this.currentChannelId].readSeqId = channel.maxSeqId;
                }
                this.currentSession.sepcialMsgCount = 0;
                this.$store.dispatch('cutMessages', this.currentSession.ChannelId);
                this.readSeqId = channel.readSeqId;
                this.maxSeqId = channel.maxSeqId;
                // console.log(this.readSeqId)
                channel.readSeqId = channel.maxSeqId;
                this.$api.setMsgReaded(channel.ChannelId, true);
                if (channel.ChannelId !== oldChannel.ChannelId) {
                    this.$nextTick(() => {
                        var msgHeight = $('.channel-msg-list-wrapper').height();
                        $('.channel-msg-list').scrollTop(msgHeight);
                        $('.channel-input-container').focus();
                        this.newMsg = 0;
                        this.goBottomStatus = false;
                        this.newUnReadMsg = {};
                        this.topAndBottomArray = [];
                        this.$store.state.messages.channelSpecialMsgList = [];
                        this.currentMsgLoad = false;
                        this.specialMsgLoad = false;
                        this.allRightBtnOk = false;
                    });
                }
            },
            messageList() {
                if (typeof this.messageList === 'undefined') {
                    return;
                }
                let allMsgList = this.messageList;
                this.receiptNums = [];
                if (allMsgList && allMsgList.length > 0) {
                    for (let i = 0; i < allMsgList.length; i++) {
                        if (allMsgList[i].specialMsgType === 3 || allMsgList[i].specialMsgType === 1 || allMsgList[i].specialMsgType === 4) {
                            this.receiptNums.push(allMsgList[i]);
                        }
                    }
                }
            },
            gettingReconnectedMsgFlag() {
                // console.log('----------------', this.goBottomStatus, this.newMsg, this.$store.state.messages.gettingReconnectedMsg.unReadNum, this.$store.state.messages.gettingReconnectedMsg.seqId, this.gettingReconnectedMsgFlag);
                if (this.$store.state.messages.gettingReconnectedMsg.unReadNum > 0 && this.gettingReconnectedMsgFlag === true) {
                    this.goBottomStatus = true;
                    if (this.newMsg === 0) {
                        this.newUnReadMsg.msgSeqId = this.$store.state.messages.gettingReconnectedMsg.seqId + 1;
                        // console.log(this.newUnReadMsg.msgSeqId, '----------------')
                    }
                    this.newMsg += this.$store.state.messages.gettingReconnectedMsg.unReadNum;
                }
            }
        },
        mounted() {
            this.loadMore = this.$util.throttle((e) => {
                for (let j = 0; j < this.receiptNums.length; j++) {
                    let receiptTop = $('.' + this.receiptNums[j].msgSeqId).length > 0 ? $('.' + this.receiptNums[j].msgSeqId)[0].offsetTop : undefined;
                    let scrollTop = $('.channel-msg-list').scrollTop();
                    if (receiptTop && receiptTop >= scrollTop) {
//                         console.log('回执上报',this.receiptNums[j].msgSeqId,this.receiptNums.length)
                        if (this.readedSpecialMsgList.indexOf(this.receiptNums[j].msgId) === -1) {
                            if (this.receiptNums[j].specialMsgType === 1 && this.receiptNums[j].altUids && this.receiptNums[j].altUids.split(',').indexOf(this.$store.state.myInfo.info.imUserId.toString()) === -1) {
                                // @消息，但并不是@我的消息
                            } else if (this.receiptNums[j].senderId !== this.imUserId) {
                                let receiptData = {
                                    fromUid: this.receiptNums[j].senderId,
                                    channelId: this.receiptNums[j].channelId,
                                    readUid: this.$store.state.myInfo.info.imUserId,
                                    msgId: this.receiptNums[j].msgId,
                                    specialMsgType: this.receiptNums[j].specialMsgType
                                };
                                console.log('特殊消息上报', this.receiptNums[j].msgId);
                                this.readedSpecialMsgList.push(this.receiptNums[j].msgId);
                                this.$api.sendReadChannelMsgReport(receiptData);
                                this.receiptNums.splice(j, 1);
                                j--;
                            }
                        }
                    }
                }
                let msgListAry = this.channelSpecialMsgList;
                for (let i = 0; i < msgListAry.length; i++) {
                    let offsetTop = $('#msg-' + msgListAry[i].msgId)[0] ? $('#msg-' + msgListAry[i].msgId)[0].offsetTop : undefined;
                    let scrollTop = $('.channel-msg-list').scrollTop();
                    if (offsetTop && offsetTop >= scrollTop) {
                        // console.log('特殊消息: ' + msgListAry[i].msgId + ' 滚动查看' + msgListAry[i].seqId + " 个数 " + this.channelSpecialMsgList.length + this.channelSpecialMsgList[this.channelSpecialMsgList.length-1].seqId);
                        msgListAry.splice(i, 1);
                        i--;
                    }
                }
                this.channelSpecialMsg = msgListAry;

                if (e.target.scrollTop === 0 && this.$store.state.status.connected) {
                    this.loadMoreMsg();
                }
                // console.log(e.target.scrollTop,e.target.scrollHeight,$('.channel-msg-list')[0].offsetHeight)
                var msgBoxHeight = $('.channel-msg-list')[0].offsetHeight;
                var msgScrollTop = e.target.scrollTop;
                var msgScrollHeight = e.target.scrollHeight;
                if (this.haveFault === false) {
                    if ($('.channel-msg-list-wrapper').height() <= $('.channel-msg-list').scrollTop() + $('.channel-msg-list').height() && this.$store.state.messages.gettingReconnectedMsg.flag) {
                        let config = {
                            sendTime: this.messageList[this.messageList.length - 1].sendtime,
                            channelId: this.currentChannelId,
                            msgSeqId: this.messageList[this.messageList.length - 1].msgSeqId,
                            pageSize: 20,
                            upOrDown: 1
                        };
                        this.$api.reloadDownChannelMsg(config);
                        this.loadBottomMsg = true;
                    }
                    if ((msgScrollHeight - msgBoxHeight - 10) > msgScrollTop) {
                        this.goBottomStatus = true;
                    } else {
                        this.goBottomStatus = false;
                        this.allRightBtnOk = false;
                        this.newMsg = 0;
                    }
                } else {
                    this.goBottomStatus = true;
                    if ((msgScrollHeight - msgBoxHeight - 10) <= msgScrollTop) {
                        let msgArray = this.specialMsgMap[this.currentChannelId],
                            config = {
                                sendTime: msgArray[msgArray.length - 1].sendtime,
                                channelId: this.currentChannelId,
                                msgSeqId: msgArray[msgArray.length - 1].msgSeqId,
                                upOrDown: 1
                            };
                        this.$api.getChannelMsgList(config);
                        this.$store.state.messages.isGettingDownMsg = true;
                    }
                }
            }, 300);
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    #channel-msg-area{

    }

    .channel-msg-list {
        position: absolute;
        left: 0;
        right: 0;
        top: 90px;
        bottom: 157px;
        padding: 10px 20px;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .chat-title {
        height: 20px;
        line-height: 21px;
        padding-top: 20px;
        color: #323232;
        font-size: 16px;
        padding-left: 20px;
        display: flex;
        padding-bottom: 10px;
    }

    .channel-menu {
        height: 40px;
        border-bottom: 1px solid #eee;
        .open-setting-btn{
            height: 22px;
            float: right;
            padding-right: 20px;
            padding-top: 10px;
            cursor: pointer;
        }

    }

    .channel-menu-item {
        display: inline-block;
        width: 48px;
        margin-left: 20px;
        line-height: 36px;
        font-size: 14px;
        border-bottom: 4px solid #fff;
        text-align: center;
        cursor: pointer;
    }

    .channel-menu-item.active {
        border-bottom: 4px solid #4590E4;
        color: #4590E4;
    }

    .channelList-new{
        height: 26px;
        line-height: 26px;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 18px;
        color: #fff;
        position: absolute;
        top: 107px;
        right: -30px;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
        padding: 0 30px 0 16px;
        z-index: 200;
        cursor: pointer;
        font-size: 12px;
    }

    .channelList-new-current{
        bottom: 175px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 18px;
        color: #fff;
        position: absolute;
        right: -30px;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
        padding: 0 30px 0 15px;
        z-index: 200;
        cursor: pointer;
        font-size: 12px;
    }

    .channelList-channelMsgGoBottom{
        bottom: 175px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 18px;
        color: #fff;
        position: absolute;
        right: 0px;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
        padding: 0 18px 0 18px;
        z-index: 200;
        cursor: pointer;
        font-size: 12px;
    }

    .channelList-new:after {
        content: '';
        width: 9px;
        height: 9px;
        position: absolute;
        background: url("../../../images/icon/上箭头@2x.png") no-repeat;
        background-size: 9px 9px;
        top: 8px;
        right: 12px;
    }

    .channelList-new-current:after {
        content: '';
        width: 9px;
        height: 9px;
        position: absolute;
        background: url("../../../images/icon/下箭头@2x.png") no-repeat;
        background-size: 9px 9px;
        top: 8px;
        right: 12px;
    }

    .channelList-channelMsgGoBottom:after {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        background: url("../../../images/icon/置底快捷键@2x.png") no-repeat;
        background-size: 10px 10px;
        z-index: 201;
        top: 8px;
        right: 13px;
    }

    .channel-title {
        max-width: 70%;
        padding-right: 30%;
        display: flex;
    }
    .channel-title-content {
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        -webkit-box-flex: 1;
        padding-right: 6px;
        word-break:break-all;
     }
    .channel-title-count {
        white-space: nowrap;
    }
    .channel-title , .channel-menu {
        position: relative;
        /*left: 5px;*/
        z-index: 100;
        background-color: #fff;
    }

    .offical-channel{
        border: 1px solid #F1B955;
        border-radius: 3px;
        color: #F1B955;
        font-size: 11px;
        display: inline-block;
        height: 16px;
        text-align: center;
        line-height: 16px;
        margin-left: 5px;
        margin-top: 3px;
        padding: 0 3px;
        white-space: nowrap;
    }

    .icon-channel{
        font-size: 20px;
        padding: 1px 3px 0px 0px;
    }
</style>
