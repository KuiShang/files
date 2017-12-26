<template>
    <li class="channel-item"
        @click="setCurrentChannelSession"
        @contextmenu="openChannelContextMenu"
        :class="{ active: active }"
        :id = "'channel-'+ this.channel.ChannelId"
        >
        <span class="top" v-if="top"></span>
        <div class="list-name" :style="{ backgroundColor: backgroundColor }" style="font-size: 30px;">
            <img class="channel-icon" src="../../../images/icon/Group 4 Copy 7@2x.png">
            <span class="unread-num" v-show="showBigIcon">{{unReadString}}</span>
            <span class="unread-num-s" v-show="showSmallIcon"></span>
        </div>
        <div class="list-text">
            <h2 class="channel-title-name">
                <span class="channel-name">{{channel.ChannelName}}</span>
                <span class="channel-offical" v-if="channel.offical === 0" >官方</span>
            </h2>
            <span class="channel-state">
                    <span class="time">{{sessionTime}}</span>
                    <span v-if="channel.newMsgRemind" class="channel-remind"></span>
            </span>
        </div>
    </li>
</template>

<script>
    export default {
        props: ['channel', 'top'],
        computed: {
            active() {
                return this.channel.ChannelId === this.$store.state.status.currentChannelSession.ChannelId;
            },
            unReadNum() {
                if (this.channel.receiveCommonMsg || this.membersCount > 100) {
                    return this.channel.sepcialMsgCount;
                } else {
                    return this.channel.unReadMsgCount;
                }
            },
            unReadCommonMsgNum() {
                return this.channel.unReadMsgCount;
            },
            showBigIcon() {
                return !this.channel.newMsgRemind && this.unReadNum;
            },
            showSmallIcon() {
                return (this.channel.newMsgRemind && this.unReadCommonMsgNum) || (!this.channel.newMsgRemind && !this.unReadNum && this.unReadCommonMsgNum);
            },
            unReadString() {
                this.setMessageBox();
                return this.unReadNum > 999 ? '999+' : this.unReadNum;
            },
            backgroundColor() {
                return this.$util.getNickNameColor(Math.abs(this.$util.hashCode(this.channel.ChannelId)));
            },
            sessionTime() {
                let time = this.channel.lastMsgTime || (this.channel.ctime * 1000);
                return this.$util.formatSessionTime(time);
            },
            membersCount() {
                return this.$store.state.channelSetting.membersCount[this.channel.ChannelId];
            }
        },
        methods: {
            setCurrentChannelSession() {
                this.$store.commit('openSetting', false);
                if (this.channel.ChannelId === this.$store.state.status.currentChannelSession.ChannelId) {
                    return;
                }
                this.$store.dispatch('setCurrentChannelSession', this.channel);
            },
            openChannelContextMenu(e) {
                this.$emit('openChannelContextMenu', this.channel, e);
                e.preventDefault();
            },
            setMessageBox() {
                if (!this.channel.newMsgRemind) {
                    let unReadBoxData = {
                        'type': 3,
                        'id': this.channel.ChannelId,
                        'name': this.channel.ChannelName,
                        'sessionid': this.channel.ChannelId,
                        'unreadmsgcount': this.unReadNum,
                        'sendTime': this.channel.lastMsgTime
                    };
                    // console.log('频道未读上报', unReadBoxData);
                    this.$api.messageBoxUnreadMsgSet(unReadBoxData);
                }
            }
        }
        // watch: {
        //     unReadNum: function(newVal, oldVal) {
        //         console.log(this.channel.ChannelName, newVal, oldVal);
        //         this.setMessageBox();
        //     }
        // },
        // mounted() {
        //     if (this.showBigIcon) {
        //         this.setMessageBox();
        //     }
        // }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .channel-item {
        .list-text h2 {
            line-height: 40px;
            height: 40px;
        }
    }
    .channel-state {
        display: flex;
        flex-flow: column;
        line-height: 15px;
        justify-content: center;
        align-items: flex-end;
        color: #ccc;
        font-size: 12px;
        position: absolute;
        top: 12px;
        right: 0px;

    }
    .channel-remind {
        background-image: url("../../../images/icon/icon-mute.svg");
        width: 12px;
        height: 12px;
        margin-top: 5px;
    }
    .unread-num {
        position: absolute;
        right: -8px;
        top: -8px;
        background-color: #FA4042;
        border-radius: 8px;
        height: 16px;
        font-size: 12px;
        line-height: 16px;
        padding: 0 5px;
    }
    .unread-num-s {
        position: absolute;
        right: -5px;
        top: -5px;
        background-color: #FA4042;
        border-radius: 5px;
        width: 10px;
        height: 10px;
        line-height: 10px;
    }
    .channel-icon{
        width: 24px;
        height: 22px;
        position: absolute;
        top: 9px;
        left: 8px;
    }
    .channel-title-name{
        max-width: 76%;
        display: flex !important;
    }
    .channel-offical{
        border: 1px solid #f1b955;
        border-radius: 3px;
        color: #f1b955;
        font-size: 11px;
        display: inline-block;
        height: 16px;
        text-align: center;
        line-height: 16px;
        margin-left: 5px;
        margin-top: 12px;
        padding: 0 3px;
        white-space: nowrap;
    }
</style>
