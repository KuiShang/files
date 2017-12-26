<template lang="html">
        <div class="member" @scroll="scroll($event)">
            <div class="title">
                <p>组织节点</p>
                <p class="deptname" @mouseover="mouseover" @mouseout="mouseout">{{deptName}}</p>
            </div>
            <ul class="members">
                <li v-for="(item, idx) in scrollMembers" :key="idx" class="item" :class="{'people-item' : !item.isLeter}">
                    <p v-if="item.isLeter" class="leter">{{item.isLeter.toUpperCase()}}</p>
                    <div v-else="" class="people">
                        <p class="left">
                            <span class="avator" :style="{backgroundColor: $util.getNickNameColor(item.id)}" @click="showMemberInfo(item.imid, item.staffName)">{{$util.getNickName(item.staffName)}}</span>
                            <span class="name">{{item.staffName}}</span>
                            <span v-if="adminId === item.id" class="manager">频道管理员</span>
                        </p>
                        <span class="right">{{item.dutyName}}</span>
                    </div>
                </li>
            </ul>
        </div>
</template>
<script type="text/ecmascript-6">
    import * as types from '../../../store/mutation-types';
    import {mapGetters} from 'vuex';
    export default{
        name: 'member',
        data() {
            return {
                pagesize: 30,
                test1: '',
                over: false,
                timer: ''
            };
        },
        computed: {
            ...mapGetters({
                // scrollMembers: 'scrollMembers',
                ChannelName: 'ChannelName',
                deptName: 'deptName',
                adminId: 'adminId',
                currentChannelId: 'currentChannelId',
                currentPage: 'currentPage',
                members: 'members'
            }),
            deptName2() {
                return '本文字-本文字本文字-本文字本文字-本文字本文字-本文字-本文字本文字-本文字-本文字-本文字-本文字';
            },
            scrollMembers() {
                let currentId = this.currentChannelId;
                if (!currentId) {
                    return [];
                }
                return this.members[currentId] && this.members[currentId].slice(0, this.pagesize * this.currentPage);
            }
        },
        mounted() {
            console.log(this.$store.getters.currentChannelId);
        },
        methods: {
            scroll(event) {
                if (!this.over) {
                    let flag = event.target.clientHeight + event.target.scrollTop === event.target.scrollHeight;
                    if (flag) {
                        console.log('加载更多频道成员----');
                        this.$store.commit(types.CHANGE_CURRENT_PAGE, ++this.currentPage);
                    }
                }
            },
            showMemberInfo(imId, staffName) {
                this.$api.showMemberInfo(imId, staffName);
            },
            mouseover() {
                this.$api.SetTip(this.deptName, timer => {
                    this.timer = timer;
                });
            },
            test2(id) {
                console.log(id);
                console.log(this.adminId);
            },
            mouseout() {
                this.$api.HideTip(this.timer);
            }
        },
        filters: {
            nickName(staffName) {
                return this.$util.getNickName(staffName);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .member {
        /* padding-top: 50px;*/
        position: absolute;
        bottom: 0;
        left: 50px;
        right: 50px;
        top: 76px;
        padding-top: 50px;
        overflow: scroll;
        box-sizing: border-box;
        .title {
            padding-left: 10px;
            p:first-of-type {
                font-size: 12px;
                color: #A8A8A8;
                padding-bottom: 5px;
            }
            p:last-of-type {
                font-size: 14px;
                color: #4A4C5B;
                padding-bottom: 20px;
                max-height: 20px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                overflow: hidden;
            }
        }
        .members {
            .item {

                .leter {
                    border-bottom: 1px solid #EEEEEE;
                    font-size: 16px;
                    color: #4A4C5B;
                    padding-bottom: 9px;
              /*      margin-bottom: 10px;*/
                    padding-left: 10px;
                }
                .people {
                    padding-left: 10px;
                    padding-right: 10px;
                    display: flex;
                    padding-bottom: 10px;
                    padding-top: 10px;
                    .right {
                        flex: 1.3;
                        line-height: 35px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .left {
                        flex: 3;
                        overflow: hidden;
                        .avator {
                            border-radius: 3px;
                            width: 35px;
                            height: 35px;
                            display: inline-block;
                            line-height: 35px;
                            text-align: center;
                            font-size: 12px;
                            color: #FFFFFF;
                            cursor: pointer;
                        }
                        .name {
                            padding-left: 10px;
                            color: #323232;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            max-width: 50%;
                            display: inline-block;
                            position: relative;
                            top:5px;
                        }
                        .manager{
                            font-size: 12px;
                            color: #999999;
                            padding-left: 10px;
                        }
                    }
                }
            }
            .people-item:hover {
                background: #F3F4F5;
            }

        }
    }

</style>
