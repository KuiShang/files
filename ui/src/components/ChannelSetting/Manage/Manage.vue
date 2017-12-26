<template lang="html">
        <div class="manage">
            <transition name="showRouter2">
            <section v-if="this.flag === 'default'" class="one" key="one">
                <div class="shaixuancontainer">
                    <div class="shaixuan">
                        <span>筛选条件</span>
                        <span class="arrow" @click="showTiaoJian('shaixuan')">
                        <img src="./筛选条件@2x.png" alt="">
                    </span>
                    </div>
                    <div class="setting" v-show="isMemberLessHundred">
                        <span>频道成员接收普通消息提醒</span>
                        <sbutton :open="open" @changeType="changeType" class="sbutton"></sbutton>
                    </div>
                </div>


                <div class="transfer-authority">
                    <span>管理员权限转让</span>
                    <span class="arrow" @click="showSelectPeople">
                        <img src="./筛选条件@2x.png" alt="">
                    </span>
                </div>
            </section >
            <div v-if="this.flag === 'shaixuan'" class="two"  key="two">
                    <span class="title">筛选条件</span>
                    <div class="content">
                        <span>组织节点</span>
                        <span  @mouseover="mouseover" @mouseout="mouseout">{{deptName}}</span>
                    </div>
                    <span class="return" @click="showTiaoJian('default')">返回</span>
             </div>
            </transition>

        </div>
</template>
<script type="text/ecmascript-6">
    import sbutton from '../common/SwitchButton.vue';
    import {mapGetters} from 'vuex';
    import * as types from '../../../store/mutation-types';
    export default{
        name: 'manage',
        components: {sbutton},
        data() {
            return {
                flag: 'default',
                timer: ''
            };
        },
        computed: {
            ...mapGetters({
                receiveCommonMsg: 'receiveCommonMsg',
                deptName: 'deptName',
                members: 'members',
                currentChannelId: 'currentChannelId'
            }),
            open() {
                return this.receiveCommonMsg === 0;
            },
            isMemberLessHundred() {
                let id = this.currentChannelId;
                let arr = this.members[id];
                let len = 0;
                if (arr) {
                    arr.forEach(obj => {
                        if (!obj.isLeter) {
                            len++;
                        }
                    });
                }
                return len <= 100;
            }
        },
        methods: {
            showTiaoJian(flag) {
                this.flag = flag;
            },
            changeType(code) {
                this.$store.commit(types.SET_CURRENT_CHANNEL_SESSION_COMMOB_MSG_CONFIG, code);
                this.$api.ModifyReceiveCommonMsgConfig(this.currentChannelId, code);
            },
            mouseover() {
                this.$api.SetTip(this.deptName, timer => {
                    this.timer = timer;
                });
            },
            mouseout() {
                this.$api.HideTip(this.timer);
            },
            showSelectPeople() {
                this.$store.commit(types.SHOW_SELECT_PEOPLE, true);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .showRouter2-enter-active {
        transition: all .4s ease;
    }
    .showRouter2-leave-active {
        transition: all 0s ease;
    }
    .showRouter2-enter, .showRouter2-leave-active {
        transform: translateX(450px);
        opacity: 0;
    }
    .transfer-authority {
        margin-top: 15px;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .manage {
        margin-top: 50px;
        .shaixuancontainer {
            border: 1px solid #EEEEEE;
            border-radius: 5px;
        }
        .one {
            .shaixuan {
                border-bottom: 1px solid #EEEEEE;
            }
            .shaixuan, .transfer-authority {
                background: #F9F9F9;
                padding: 0 20px 0;
                line-height: 50px;
                box-sizing: border-box;
                height: 50px;
                display: flex;
                justify-content: space-between;

                span:first-of-type {
                    font-size: 14px;
                    color: #323232;
                }
                .arrow {
                    padding-left: 20px;
                    cursor: pointer;
                    img {
                        height: 19px;
                    }
                }

            }
            .setting {
                display: flex;
                justify-content: space-between;
                height: 50px;
                background: #f9f9f9;
                padding: 16px 20px 0;
                box-sizing: border-box;
                .sbutton{
                    top:-5px;
                }
            }
        }
        .two {
            .title {
                font-size: 14px;
                color: #323232;
                padding-bottom: 20px;
                display: block;
            }
            .content {
                border: 1px solid #EEEEEE;
                border-radius: 5px;
                background: #F9F9F9;
                height: 72px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                padding-left: 20px;
                span:first-of-type {
                    font-size: 12px;
                    color: #A8A8A8;
                    padding-bottom: 5px;
                }
                span:last-of-type {
                    font-size: 14px;
                    color: #4A4C5B;
                }
            }
            .return {
                float: right;
                font-size: 14px;
                color: #323232;
                cursor: pointer;
                padding: 12px 0 12px 12px;
            }
        }

    }
</style>
