<template>
    <div id="channel-content">
        <div class="disconnected" v-if="!connected">
            <em class="iconn-28"></em>
            <span>{{this.connectedText}}</span>
        </div>
        <div class="right-list">
            <ChannelSessionList @openChannelContextMenu="openChannelContextMenu"></ChannelSessionList>
        </div>
        <div class="right-con">
            <ChannelMsgList  @showSendreturnTip="showSendreturn"></ChannelMsgList>
        </div>
        <transition name="show">
            <div class="right-con channel-setting"   v-if = "settingOpen">
                <ChannelSetting></ChannelSetting>
            </div>
        </transition>
        <ForwardMsg></ForwardMsg>
        <sendreturnTip v-if="showSendreturnTip" :msg="msg" @hideSendreturnTip="hideSendreturn"></sendreturnTip>
        <SessionContextMenu ref="sessionContextMenu" v-show="this.currentSimpleRightmenuId === this.rightMenuId"></SessionContextMenu>

            <SelectPeople v-if="showSelectPeople"></SelectPeople>

    </div>
</template>

<script>
    import SelectPeople from '../../Commons/SelectPeople/SelectPeople.vue';
    import sendreturnTip from '../../components/ChannelMsgList/sendreturnTip.vue';
    import ChannelSessionList from '../../components/ChannelSessionList';
    import ChannelMsgList from '../../components/ChannelMsgList';
    import ChannelSetting from '../../components/ChannelSetting/ChannelSetting';
    import ForwardMsg from '../../components/ForwardMsg';
    import { mapGetters } from 'vuex';
    import SessionContextMenu from '../../components/SessionContextMenu';
    import * as types from '../../store/mutation-types';
    export default {
        data() {
            return {
                rightMenuId: Symbol('SESSION_CONTEXT_MENU'),
                msg: {},
                showSendreturnTip: false
            };
        },
        components: {SelectPeople, ChannelSessionList, ChannelMsgList, ChannelSetting, ForwardMsg, sendreturnTip, SessionContextMenu},
        computed: {
            ...mapGetters({
                showSelectPeople: 'showSelectPeople',
                settingOpen: 'settingOpen',
                currentSimpleRightmenuId: 'currentSimpleRightmenuId',
                connected: 'connected',
                connectedText: 'connectedText'
            })
        },
        mounted() {
            document.addEventListener('click', () => {
                this.$store.commit(types.SET_CURRENT_SIMPLE_RIGHTMENU_ID, '');
            });
            document.addEventListener('contextmenu', () => {
                this.$store.commit(types.SET_CURRENT_SIMPLE_RIGHTMENU_ID, '');
            });
        },
        methods: {
            showSendreturn(msg) {
                console.log(msg);
                this.showSendreturnTip = true;
                this.msg = msg;
            },
            hideSendreturn() {
                this.showSendreturnTip = false;
            },
            openChannelContextMenu(channel, e) {
                e.stopPropagation();
                this.$store.commit(types.SET_CURRENT_SIMPLE_RIGHTMENU_ID, this.rightMenuId);
                this.$refs.sessionContextMenu.showComponent(channel, e);
                console.log(this.currentSimpleRightmenuId);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import '../../style/constant.scss';
    #channel-content .channel-setting {
        top: 59px;
        background-color: #fff;
        z-index: $z-channel-set;
        box-shadow: inset 1px -1px 1px -1px rgba(0,0,0,.1);
        bottom:0;
        box-sizing: border-box;
    }
    .show-enter-active {
        transition: all .3s ease;
    }
    .show-leave-active {
        transition: all .2s ease-in;
    }
    .show-enter, .show-leave-active {
        transform: translateX(200px);
        opacity: 0;
    }
</style>
