<template>
    <div>
        <ul class="clearfix name-list name-show" v-if="channelSessionList.length > 0">
            <!--<ChannelSessionItem v-for="(channel, idx) in channelSessionList" :channel="channel" :key="idx"></ChannelSessionItem>-->
            <ChannelSessionItem v-for="(channel, idx) in topChannels"
                                :channel="channel"
                                :top="true"
                                @openChannelContextMenu="openChannelContextMenu"
            >
            </ChannelSessionItem>
            <ChannelSessionItem v-for="(channel, idx) in unTopChannels"
                                :channel="channel"
                                :top="false"
                                @openChannelContextMenu="openChannelContextMenu"
            >
            </ChannelSessionItem>
        </ul>
        <div class="session-loading" v-if="!finishInit">
            <img src="../../../images/public/loading-ms.gif">
        </div>
        <div id="channel-session-no-record" class="no-record" v-if="finishInit && channelSessionList.length === 0">
            <img src="../../../images/public/no-record.jpg" width="132" height="132">
            <p>没有会话记录</p>
            <span>快联系你的小伙伴吧</span>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ChannelSessionItem from './ChannelSessionItem';

    export default {
        components: { ChannelSessionItem },
        computed: {
            ...mapGetters({
                topChannels: 'topChannels',
                unTopChannels: 'unTopChannels',
                connected: 'connected',
                receiveMsg: 'receiveMsg',
                receiveFlag: 'receiveFlag'
            }),
            channelSessionList() {
                return this.$store.state.channels.channelSessionList;
            },
            finishInit() {
                return this.$store.state.channels.finishInit;
            }
        },
        methods: {
            openChannelContextMenu(channel, e) {
                this.$emit('openChannelContextMenu', channel, e);
            }
        },
        watch: {
            unTopChannels() {
                this.$nextTick(() => {
                    if ($('#channel-' + this.receiveMsg.channelId).hasClass('active')) {
                        var sessionTop = $('#channel-' + this.receiveMsg.channelId)[0].offsetTop;
                        var sessionScrollTop = $('#channel-' + this.receiveMsg.channelId).parent().parent().parent().scrollTop();
                        if (sessionTop < sessionScrollTop) {
                            $('#channel-' + this.receiveMsg.channelId).parent().parent().parent().scrollTop(sessionTop);
                        }
                    }
                });
            },
            receiveFlag() {
                this.$nextTick(() => {
                    if ($('#channel-' + this.receiveMsg.channelId).hasClass('active')) {
                        var sessionTop = $('#channel-' + this.receiveMsg.channelId)[0].offsetTop;
                        var sessionScrollTop = $('#channel-' + this.receiveMsg.channelId).parent().parent().parent().scrollTop();
                        if (sessionTop < sessionScrollTop) {
                            $('#channel-' + this.receiveMsg.channelId).parent().parent().parent().scrollTop(sessionTop);
                        }
                    }
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .disconnected {
        position: fixed;
        top: 60px;
        left: 70px;
        width: 260px;
        height: 30px;
        line-height: 30px;
        background: rgba(73, 76, 91, 0.7);
        text-align: center;
        font-size: 12px;
        color: #fff;
        z-index: 10;
    }

    .disconnected em{
        font-size: 16px;
        margin-right: 2px;
    }
</style>
