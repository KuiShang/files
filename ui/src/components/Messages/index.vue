<template>
    <div :id="'msg-'+this.msg.msgId"  :class="' '+this.msg.msgSeqId">
        <div v-if="!messageComponent">
            <TransparentMsg :msg="msg" :showTime="showTime"></TransparentMsg>
        </div>
        <div v-else>
            <div class="list-time" v-if="showTime">{{$util.formatMsgTime(msg.sendtime)}}</div>
            <div class="clearfix" :class="classPosition">
                <div class="list-name"
                     @contextmenu="showContextmenu"
                     :style="{backgroundColor: backgroundColor}"
                     @click="showMemberInfo">
                    {{nickName}}
                </div>
                <div class="msg-list-content clearfix"
                     ref="msg"
                     @mouseover="showChannelMsgContextMenu"
                     @mouseout="hideChannelMsgContextMenu"
                >
                    <div class="list-full-name" v-if="!isMyMsg">{{msg.staffName}}</div>
                    <component :is="messageComponent"
                               :msg="msg"
                               :isMyMsg="isMyMsg"
                    >
                        <em class="iconn-34 failed-icon" v-if="this.msg.status === 2" @click="resendMsg">
                        </em><em class="loading" v-if="this.msg.status === 0">
                            <img src="../../../images/public/loading-ms.gif" alt="">
                        </em>
                        <Praise v-if="this.msgType === 1" slot="praise" :msg="this.msg" ref="praise1"></Praise>
                    </component>
                </div>
                <Praise v-if="this.msgType !== 1" :msg="this.msg" ref="praise2"></Praise>
            </div>
        </div>
    </div>

</template>

<script>
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import TextMsg from './Text';
    import ImageMsg from './Image';
    import VoiceMsg from './Voice';
    import LocationMsg from './Location';
    import FileMsg from './File';
    import TransparentMsg from './TransparentMsg';
    import DeletedMsg from './DeletedMsg';
    import Praise from './Praise';
    export default {
        props: ['msg', 'index', 'messageList'],
        components: { TextMsg, ImageMsg, VoiceMsg, LocationMsg, FileMsg, TransparentMsg, DeletedMsg, Praise },
        computed: {
            ...mapGetters({
                msgMap: 'msgMap',
                imUserId: 'imUserId'
            }),
            msgType() {
                return this.msg.msgtype || this.msg.msgType;
            },
            messageComponent() {
                if (this.msg.isDelete === 1) {
                    return 'DeletedMsg';
                }
                switch (this.msgType) {
                    case 1:
                        return 'TextMsg';
                    case 2:
                        Vue.set(this.msg, 'playing', false);
                        return 'VoiceMsg';
                    case 3:
                        return 'ImageMsg';
                    case 4:
                        return 'VideoMsg';
                    case 5:
                        return 'LocationMsg';
                    case 6:
                        return 'FileMsg';
                    default:
                        return false;
                }
            },
            isMyMsg() {
                return this.msg.id === this.$store.state.myInfo.info.oaId;
            },
            nickName() {
                if (this.isMyMsg) {
                    return '我';
                }
                return this.$util.getNickName(this.msg.staffName);
            },
            classPosition() {
                return (this.msg.imUserId || this.msg.fromUid) === this.$store.state.myInfo.info.imUserId ? 'list-right' : 'list-left';
            },
            showTime() {
                if (this.index === 0) {
                    return true;
                }
                return (this.messageList[this.index].sendtime - this.messageList[this.index - 1].sendtime) / 1000 > 300;
            },
            backgroundColor() {
                return this.$util.getNickNameColor(this.msg.id);
            },
            praised() {
                let num = this.msg.praiseUids.length;
                while (num--) {
                    if (this.msg.praiseUids[num] === this.$store.state.myInfo.info.imUserId) {
                        return true;
                    }
                }
                return false;
            }
        },
        data() {
            return {
                clientX: 0,
                clientY: 0
            };
        },
        methods: {
            showContextmenu(e) {
                console.log(e);
                if (this.imUserId === this.msg.senderId) {
                    return;
                }
                this.clientX = e.clientX + 'px';
                this.clientY = e.clientY + 'px';
                this.$emit('showListNameContextMenu', this.msg, this.clientX, this.clientY);
                e.stopPropagation();
                e.preventDefault();
            },
            showMemberInfo() {
                this.$api.showMemberInfo(this.msg.senderId, this.msg.staffName);
            },
            handlePraise() {
                this.$api.thumbSupChannelMessage({
                    msgId: this.msg.msgId,
                    channelId: this.msg.channelId
                });
            },
            contains(a, b) {
                return a.contains ? a !== b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
            },
            showChannelMsgContextMenu(e) {
                if ($(e.target).hasClass('list-text') || $(e.target).parents('.list-text').length > 0) {
                    let dom = $(e.target).hasClass('list-text') ? $(e.target) : $(e.target).parents('.list-text').eq(0);
                    let rect = dom[0].getBoundingClientRect();
                    this.$emit('showChannelMsgContextMenu', this, rect);
                }
            },
            hideChannelMsgContextMenu(e) {
                if ($(e.relatedTarget).hasClass('channel-msg-context-menu') || $(e.relatedTarget).hasClass('channel-msg-context-menu-item')) {
                    return;
                }
                if (this.$refs.msg !== e.relatedTarget && !this.contains(this.$refs.msg, e.relatedTarget)) {
                    this.$emit('hideChannelMsgContextMenu');
                }
            },
            resendMsg() {
                this.msg.status = 0;
                this.msg.sendtime = Date.parse(new Date());
                this.$api.sendChannelMessageList([this.msg]);
            }
        },
        mounted() {
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .msg-list-content {
        user-select: initial;
        padding-top: 10px;
    }
    .list-text {
        /*user-select: initial;*/
    }
    .list-full-name {
        font-size: 12px;
        color: #999;
        height: 20px;
        line-height: 16px;
        margin-left: -8px;
    }
    .list-right .failed-icon {
        position: absolute;
        left: -30px;
        top: 50%;
        font-size: 22px;
        margin-top: -11px;
        color: #EF6868;
        cursor: pointer;
    }
</style>
