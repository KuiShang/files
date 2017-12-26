<template lang="html">
    <div class="channelsetting">
        <span class="close" @click="close"  @mouseenter="tooltipIn('关闭设置')" @mouseleave="tooltipOut"></span>
        <ul class="header">
            <li :class="{link: linkBorderIndex === 1}" @click="changeLinkBorderIndex(1)">资料</li>
            <li :class="{link: linkBorderIndex === 2}" @click="changeLinkBorderIndex(2)">成员</li>
            <li :class="{link: linkBorderIndex === 3}" @click="changeLinkBorderIndex(3)">设置</li>
            <li :class="{link: linkBorderIndex === 4}" @click="changeLinkBorderIndex(4)"  v-show="adminId === oaId">管理</li>
        </ul>
        <Information v-show="linkBorderIndex === 1"></Information>
        <keep-alive>
            <Member v-if="linkBorderIndex === 2"></Member>
        </keep-alive>
        <Remind v-show="linkBorderIndex === 3"></Remind>
        <Manage v-show="linkBorderIndex === 4 && adminId === oaId"></Manage>
    </div>
</template>
<script type="text/ecmascript-6">
    import Information from './Information/Information.vue';
    import Member from './Member/Member.vue';
    import Manage from './Manage/Manage.vue';
    import Remind from './Remind/Remind.vue';
    import { mapGetters } from 'vuex';
    import tooltip from '../mixin/tooltips';
    export default{
        name: 'channelSetting',
        components: {
            Information,
            Member,
            Manage,
            Remind
        },
        mixins: [tooltip],
        computed: {
            ...mapGetters({
                adminId: 'adminId',
                members: 'members',
                imUserId: 'imUserId',
                currentChannelId: 'currentChannelId',
                oaId: 'oaId'
            }),
            imUserId2() {
                return 1;
            },
            linkBorderIndex() {
                return this.$store.state.channelSetting.linkBorderIndex;
            }
        },
        mounted() {
            console.log(this.$store.state.channelSetting);
            console.log(this.$store.state);
        },
        methods: {
            changeLinkBorderIndex(idx) {
                this.$store.commit('changeLinkBorderIndex', idx);
//                if (idx === 2 && !this.members) {
//                    this.$api.getChannelMembers(this.$store.getters.currentChannelId);
//                    console.log('加载频道成员');
//                }
            },
            close() {
                this.$store.commit('openSetting', false);
            }
        },
        watch: {
            currentChannelId(channelId) {
                console.log(channelId);
                !this.members[channelId] && this.$api.getChannelMembers(channelId);
                this.$store.state.channelSetting.linkBorderIndex = 1;
            },
            adminId(newAdminId) {
                if (newAdminId !== this.oaId) {
                    this.$store.commit('changeLinkBorderIndex', 1);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .channelsetting {
        padding: 0 50px;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        .close{
            background-image: url("./icon关闭聊天文件列表@2x.png");
            background-size: 22px;
            height: 22px;
            width: 22px;
            right: 20px;
            background-repeat: no-repeat;
            background-position: right;
            position: absolute;
            cursor: pointer;
        }

        ul.header {
            display: flex;
            justify-content: center;
            border-bottom: 1px solid #eee;
            padding-top: 25px;
            li {
                box-sizing: border-box;
                height: 50px;
                padding: 16px 10px 11px;
                text-align: center;
                font-size: 14px;
                color: #999999;
                min-width: 48px;
                cursor: pointer;
                /*transition: all .3s ease-in-out;*/
                line-height: 14px;
            }
            li.link {
                color: #4590E4;
                border-bottom: 4px solid #4590E4;
            }
            li + li {
                margin-left: 20px;
            }
        }
    }

</style>
