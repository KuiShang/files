// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store';
import util from './util';
import API from './API';
import MessageBox from './components/MessageBox';
import guidepage from './components/GuidePage';
import moremenu from './components/MoreMenu';
import { mapGetters } from 'vuex';

import channelcontent from './containers/ChannelContent';
import applicationcontent from './containers/ApplicationContent';

Vue.prototype.$util = util;
Vue.prototype.$api = API;
Vue.prototype.$modal = MessageBox.showModal;
Vue.prototype.$toast = MessageBox.showToast;

// Vue.use(Meiban);

window.VueApp = new Vue({
    store,
    components: { channelcontent, guidepage, moremenu, applicationcontent },
    data() {
        return {
            unreadChannelMsgNum: 0,
            unreadChannelCommonMsgNum: 0,
            showMenu: false
        };
    },
    methods: {
        isShowMenu() {
            this.showMenu = !this.showMenu;
            // console.log(this.showMenu);
        },
        changeShow(type) {
            this.showMenu = type;
        }
    },
    computed: {
        ...mapGetters({
            visible: 'visible',
            currentChannelSession: 'currentChannelSession',
            updateStatus: 'updateStatus',
            totalAppUnReadNum: 'totalAppUnReadNum'
        }),
        globalStatus() {
            return this.$store.state.status.globalStatus;
        },
        channelSessionArr() {
            return this.$store.state.channels.channelSessionList;
        },
        totalAppUnReadNumStr() {
            return this.totalAppUnReadNum > 99 ? '99+' : this.totalAppUnReadNum.toString();
        }
        // visible() {
        //     return this.$store.state.status.visible;
        // }
    },
    watch: {
        channelSessionArr: {
            handler(list) {
                let num = 0,
                    commonNum = 0;
                list.forEach((item) => {
                    if (item.newMsgRemind) {
                        return;
                    }
                    commonNum += item.unReadMsgCount;
                    if (item.receiveCommonMsg || this.$store.state.channelSetting.membersCount[item.ChannelId] > 100) {
                        num += item.sepcialMsgCount;
                    } else {
                        num += item.unReadMsgCount;
                    }
                });
                this.unreadChannelMsgNum = num > 999 ? 999 : num;
                this.unreadChannelCommonMsgNum = commonNum;
                this.$api.setMacBadge(num.toString(), true);
            },
            deep: true
        },
        globalStatus(val) {
            this.$store.state.status.forward.show = false;
            if (val === 'channel') {
                this.$api.setCurrentSessionId(this.currentChannelSession.ChannelId || '');
                try {
                    if (window.getSelection().type !== 'None') {
                        this.chatRange = window.chatRange = window.getSelection().getRangeAt(0);
                    }
                } catch (e) {}
                let channel = this.$store.state.status.currentChannelSession;
                channel.readSeqId = channel.maxSeqId;
                if (channel.unReadMsgCount > 0) {
                    channel.unReadMsgCount = 0;
                    this.$api.setMsgReaded(channel.ChannelId ? channel.ChannelId : '', true);
                    let config = {
                        uid: this.$store.state.myInfo.info.imUserId,
                        channelId: channel.ChannelId,
                        readSeqId: channel.maxSeqId
                    };
                    this.$api.submitReadSeqId(config);
                }
                channel.sepcialMsgCount = 0;
            } else if (val === 'chat') {
                this.$api.setCurrentSessionId(CHATOBJ.groupId || '');
                try {
                    if (window.getSelection().type !== 'None') {
                        this.channelRange = window.channelRange = window.getSelection().getRangeAt(0);
                    }
                } catch (e) {}
                if ($('#session-' + CHATOBJ.groupId).length > 0) {
                    this.$api.readedSeqIDReport(CHATOBJ.groupId, $('#session-' + CHATOBJ.groupId).data().msgSeqId);
                    this.$api.setMsgReaded(CHATOBJ.groupId);
                }
            }
            this.$nextTick(() => {
                var sel = window.getSelection();
                if (val === 'channel' && this.channelRange) {
                    this.channelRange.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(this.channelRange);
                    this.channelRange = window.channelRange = '';
                } else if (val === 'chat' && this.chatRange) {
                    this.chatRange.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(this.chatRange);
                    this.chatRange = window.chatRange = '';
                }
            });
        },
        visible() {
            if (this.visible && this.globalStatus === 'channel' && this.currentChannelSession.unReadMsgCount > 0) {
                this.currentChannelSession.unReadMsgCount = 0;
                this.currentChannelSession.sepcialMsgCount = 0;
                // this.$api.getChannelSpecialMsg(this.currentChannelSession.ChannelId);
                let config = {
                    uid: this.$store.state.myInfo.info.imUserId,
                    channelId: this.currentChannelSession.ChannelId,
                    readSeqId: this.currentChannelSession.maxSeqId
                };
                setTimeout(() => {
                    this.$api.submitReadSeqId(config);
                }, 1000);
            }
        }
    }
}).$mount('#app');

export default window.VueApp;
