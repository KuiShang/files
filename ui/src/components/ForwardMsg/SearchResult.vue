<template>
    <div class="forward-search-list">
        <div class="forward-search-title" @click="handleCollapse"><i :class="{'iconn-24': collapse, 'iconn-26': !collapse}"></i>{{title}}</div>
        <ul v-if="!collapse">
            <li v-for="item in list" v-if="module === 'group'" class="forward-search-item" @click="triggerChoose(item)">
                <span class="list-face"
                      :style="{ backgroundColor: $util.getNickNameColor(Math.abs($util.hashCode(item.groupId))) }"
                >
                    <em class="iconn-46" style="font-size: 23px;"></em>
                </span>
                <span class="list-name" v-html="handleName(item.groupName)"></span>
                <i class='noActive' :class='{Active: selectArr.indexOf(JSON.stringify(item)) !== -1}'></i>
            </li>
            <li v-for="item in list" v-if="module === 'channel'" class="forward-search-item" @click="triggerChoose(item)">
                <span class="list-face" style="font-size: 30px;"
                      :style="{ backgroundColor: $util.getNickNameColor(Math.abs($util.hashCode(item.channelId))) }"
                >
                    <img class="channel-icon" src="../../../images/icon/Group 4 Copy 7@2x.png">
                </span>
                <span class="list-name" v-html="handleName(item.channelName)"></span>
                <i class='noActive' :class='{Active: selectArr.indexOf(JSON.stringify(item)) !== -1}'></i>
            </li>
            <li v-for="item in list" v-if="module === 'contact'" class="forward-search-item" @click="triggerChoose(item)">
                <span class="list-face" style="font-size: 14px;"
                      :style="{ backgroundColor: $util.getNickNameColor(item.oaId) }"
                >{{$util.getNickName(item.groupName)}}</span>
                <span class="list-name" v-html="handleName(item.groupName)"></span>
                <i class='noActive' :class='{Active: selectArr.indexOf(JSON.stringify(item)) !== -1}'></i>
            </li>
        </ul>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        props: ['module', 'searchString', 'selectArr'],
        data() {
            return {
                list: [],
                collapse: false
            };
        },
        computed: {
            title() {
                switch (this.module) {
                    case 'contact':
                        return '联系人';
                    case 'group':
                        return '群聊';
                    case 'channel':
                        return '频道';
                    default:
                        return '';
                }
            },
            ...mapGetters({
                imUserId: 'imUserId'
            })
        },
        methods: {
            handleName(name) {
                return name.replace(new RegExp(this.searchString, 'gi'), '<strong class="key">$&</strong>');
            },
            triggerChoose(item) {
                console.log(item);
                this.$emit('choose', item);
            },
            isActive(item) {
                for (let i = 0; i < this.selectArr.length; i++) {
                    if (item.channelId && this.selectArr[i].channelId && item.channelId === this.selectArr[i].channelId) {
                        return true;
                    } else if (item.groupId && this.selectArr[i].groupId && item.groupId === this.selectArr[i].groupId) {
                        return true;
                    }
                }
                return false;
            },
            handleCollapse() {
                this.collapse = !this.collapse;
            },
            searchItem() {
                let s = this.searchString;
                if (this.module === 'group') {
                    if (!s) {
                        this.list = [];
                        this.$emit('setItemCount', 'group', 0);
                        return;
                    }
                    this.$api.searchGroups(s, 0, 1000).then(data => {
                        console.log(data);
                        this.list = data.group.map((item) => {
                            return {
                                module: 'group',
                                groupId: item.GroupId || item.GroupID,
                                groupName: item.GroupName || item.initname
                            };
                        });
                        this.$emit('setItemCount', 'group', this.list.length);
                    });
                } else if (this.module === 'channel') {
                    if (!s) {
                        this.list = [];
                        this.$emit('setItemCount', 'channel', 0);
                        return;
                    }
                    this.$api.searchChannels(s, 0, 1000).then(data => {
                        console.log(data);
                        this.list = data.Channel.map((item) => {
                            return {
                                module: 'channel',
                                channelId: item.ChannelId,
                                channelName: item.ChannelName
                            };
                        });
                        this.$emit('setItemCount', 'channel', this.list.length);
                    });
                } else if (this.module === 'contact') {
                    if (!s) {
                        this.list = [];
                        this.$emit('setItemCount', 'contact', 0);
                        return;
                    }
                    this.$api.searchMembers(s, 0, 1000).then(data => {
                        console.log(data);
                        let count = data.user.length;
                        while (count--) {
                            if (data.user[count].bActivated === false) {
                                data.user.splice(count, 1);
                            }
                        }
                        this.list = data.user.map((item) => {
                            let groupId = '';
                            if (item.imId > this.imUserId) {
                                groupId = this.imUserId + '_' + item.imId;
                            } else if (item.imId < this.imUserId) {
                                groupId = item.imId + '_' + this.imUserId;
                            } else {
                                groupId = item.imId + '_' + this.imUserId;
                            }
                            return {
                                module: 'member',
                                groupId: groupId,
                                groupName: item.MsgSendName,
                                imId: item.imId,
                                oaId: item.oaId,
                                deptName: item.deptName,
                                dutyName: item.dutyName
                            };
                        });
                        this.$emit('setItemCount', 'contact', this.list.length);
                    });
                }
            }
        },
        mounted() {
            this.$watch('searchString', this.$util.debounce(this.searchItem, 500));
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .forward-search-list li {
        position: relative;
        height: 30px;
        line-height: 30px;
        padding: 10px 0 10px 50px;
    }
    .forward-search-list .list-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 155px;
        display: inline-block;
    }
    .forward-search-list .list-face {
        position: absolute;
        left: 0;
        top: 5px;
        z-index: 1;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 5px;
        background: #68C6AA;
        font-size: 14px;
        color: #fff;
        margin-right: 10px;
    }
    .noActive {
        background: url(./yuan.png);
        background-size: 100% 100%;
    }
    .Active{
        background: url(./right.png);
        background-size: 100% 100%;
    }
    .forward-search-item i{
        display: inline-block;
        width:14px;
        height: 14px;
        float: right;
        position: absolute;      /*  父元素需要相对定位,子元素绝对定位 */
        top: 50%;
        right: 5px;
        margin-top:-7px ;
    }
    .forward-search-title {
        cursor: pointer;
        margin: 10px 0;
        i {
            color: #ccc;
            font-size: 12px;
            padding-right: 8px;
            font-weight: bold;
        }
    }
    .forward-search-item .key {
        color: #3E89F7;
    }
</style>
