<template>
    <div class="clearfix">
        <div class="clearfix kkmsg" :class="{ kkright: isMyMsg}">
            <div class="list-text text-msg" :class="{'acknowledge-content': acknowledgeContent, 'at-me-msg': isAtMeMsg,'clannel-announce-msg': announceMsg }">
                <pre v-html="msgText"></pre><slot></slot>
            </div>
        </div>
        <div class="acknowledge-d" v-if="acknowledgeContent">
            <span>回执消息：</span>
            <span v-if="!isMyMsg">已读</span>
            <span v-else @click="showMembers">
                <span class="acknowledge-unread-num" v-if="typeof unReadCount !== 'undefined' && unReadCount > 0">{{unReadCount}}人未读</span>
                <span v-if="typeof unReadCount !== 'undefined' && unReadCount === 0" @click.stop>全部已读</span>
            </span>
        </div>
        <div class="announce-tab" v-if="isAnnounce">
            <span>频道公告</span>
        </div>
        <slot name="praise"></slot>
    </div>
</template>

<script>
    export default {
        props: ['msg', 'isMyMsg'],
        data() {
            return {
                unReadCount: undefined
            };
        },
        computed: {
            acknowledgeContent() {
                return this.msg.specialMsgType === 3;
            },
            isAnnounce() {
                return this.msg.specialMsgType === 4;
            },
            isAtMeMsg() {
                return this.msg.specialMsgType === 1 && this.msg.altUids && this.msg.altUids.split(',').indexOf(this.$store.state.myInfo.info.imUserId.toString()) !== -1;
            },
            announceMsg() {
                return this.msg.specialMsgType === 4;
            },
            msgText() {
                let msgBody = this.msg.msgbody || this.msg.msgBody || '';
                msgBody = msgBody.replace(/&/g, '&amp;');
                msgBody = msgBody.replace(/</g, '&lt;');
                msgBody = msgBody.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g, function(s, $1, index) {
                    if (faces.indexOf(getFaceEng($1.replace('[', '').replace(']', ''))) !== -1) {
                        return '<img class="input-face" src="../images/face/' + getFaceEng($1.replace('[', '').replace(']', '')) + '.png">';
                    } else {
                        return $1;
                    }
                });
                msgBody = msgBody.replace(/((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w-.,@?^=%()&:/~+#;\u4e00-\u9fa5]*[\w-@?^=%&/~+)#;\u4e00-\u9fa5])?/g, function(s, $1, index) {
                    if (s.indexOf('http://') !== -1 || s.indexOf('https://') !== -1) {
                        return '<a class="url-link" onclick="publicObject.openUrl(0,\'' + s + '\')">' + s + '</a>';
                    } else {
                        return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://' + s + '\')">' + s + '</a>';
                    }
                });
                return msgBody;
            }
        },
        methods: {
            showMembers() {
                mainObject.showReadAndUnreadMemberInfo();
                mainObject.getMsgReadAndUnReadMembers(this.msg.channelId, this.msg.msgId, true);
            }
        },
        mounted() {
            if (this.acknowledgeContent && this.isMyMsg) {
                this.$api.getChannelOrUnReadAsync({
                    channelId: this.msg.channelId,
                    msgId: this.msg.msgId
                });
            }
        },
        watch: {
            msg: {
                handler() {
                    if (this.msg.specialMsgType === 3) {
                        this.unReadCount = typeof (this.msg.unRreadUids) !== 'undefined' ? this.msg.unRreadUids.length : undefined;
                    }
                },
                deep: true
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .acknowledge-d, .announce-tab {
        clear: both;
        padding-top: 5px;
        padding-right: 10px;
        font-size: 12px;
        color: #999;
    }
    .list-left .acknowledge-d, .list-left .announce-tab {
        float: left;
    }
    .list-right .acknowledge-d, .list-right .announce-tab {
        float: right;
    }
    .acknowledge-unread-num {
        color: #3E89F7;
        cursor: pointer;
    }

    .kkmsg {
        display: flex;
        justify-content: flex-start;

    }
    .kkright {
        justify-content: flex-end;
    }
    .list-text {
        float: none !important;
    }
    .list-text pre {
        word-break: break-word;
        white-space: pre-wrap;
    }
    .list-text pre .url-link {
        word-break: break-word;
        white-space: pre-wrap;
    }
</style>
