<template lang="html">
    <transition name="loading">
        <div class="selectPeople">
            <div class="select">
                <ConfrimTip
                    v-if="secondConfrim"
                    width="392"
                    :confirmText="selectedPelple.staffName+'将成为新的频道管理员，你将自动放弃频道管理员身份'"
                    @cancel="cancleSecondConfrim"
                    @tipConfirm="SureSecondConfrim"
                ></ConfrimTip>

                <h6 class="title">选择新管理员</h6>
                <Loading v-show="loading" class="loading"></Loading>
                <KsearchInput  v-model="searchString"></KsearchInput>
                <ul v-show="listArr.length>0" class="members"  @scroll="scrollSearchRet($event)">
                    <li class='item people-item' v-for="(item,idx) in listArr" :key="idx" >
                        <div class="people ">
                            <p class="left">
                                <span class="avator" :style="{backgroundColor: $util.getNickNameColor(item.id)}"
                                      @click="showMemberInfo(item.imid, item.staffName)">{{$util.getNickName(item.staffName)}}</span>
                                <span class="name" v-html="handleName(item.staffName)"></span>
                            </p>
                            <span class="right">{{item.dutyName}}</span>
                            <KradioButton
                                v-model="selectedPelple"
                                :label="item"
                                name="selectPeople"
                                class="radio-button"
                            >
                            </KradioButton>
                        </div>

                    </li>
                </ul>
                <div v-show="listArr.length === 0 && searchString.trim().length !== 0 && !firstSearch"
                     class="no-result members">
                    <span>暂无搜索结果</span>
                </div>

                <ul v-show="searchString.trim().length === 0" class="members" @scroll="scroll($event)">
                    <li
                        v-for="(item, idx) in scrollMembers"
                        :key="idx"
                        class="item"
                        :class="{'people-item' : !item.isLeter}">
                        <p v-if="item.isLeter" class="leter" @click="test">{{item.isLeter.toUpperCase()}}</p>
                        <div v-else="" class="people">
                            <p class="left">
                                <span class="avator" :style="{backgroundColor: $util.getNickNameColor(item.id)}"
                                      @click="showMemberInfo(item.imid, item.staffName)">{{$util.getNickName(item.staffName)}}</span>
                                <span class="name">{{item.staffName}}</span>
                            </p>
                            <span class="right">{{item.dutyName}}</span>
                            <KradioButton
                                v-model="selectedPelple"
                                :label="item"
                                name="selectPeople"
                                class="radio-button"
                            >
                            </KradioButton>
                        </div>
                    </li>
                </ul>

                <div class="btn-group">
                    <button class="btn cancel" @click="hideComponent">取消</button>
                    <button class="btn ensure" :class="{ disabled: !selectedPelple }" @click='sure'>确定</button>
                </div>
            </div>
            <div class="bg"></div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    import KradioButton from '../KradioButton/KradioButton.vue';
    import KsearchInput from '../KsearchInput/KsearchInput.vue';
    import ConfrimTip from '../ConfrimTip/ConfrimTip.vue';
    import Loading from '../Loading/Loading.vue';
    import {mapGetters} from 'vuex';
    import * as types from '../../store/mutation-types';
    export default{
        name: 'selectpeople',
        data() {
            return {
                searchRetPageSize: 20,
                searchRetCurrentPage: 0,
                firstSearch: true,
                over: false,
                secondConfrim: false,
                loading: false,
                searchString: '',
                selectedPelple: '',
                listArr: []
            };
        },
        components: { KradioButton, KsearchInput, Loading, ConfrimTip },
        computed: {
            ...mapGetters({
                adminId: 'adminId',
                currentChannelId: 'currentChannelId',
                currentPage: 'currentPage',
                members: 'members'
            }),
            scrollMembers() {
                let currentId = this.currentChannelId;
                if (!currentId) {
                    return [];
                }
                let membersWithoutMe = this.members[currentId].filter(member => {
                    return member.id !== this.adminId;
                });
                return membersWithoutMe.slice(0, this.searchRetPageSize * this.currentPage);
            }
        },
        methods: {
            test() {
                // console.log(this.selectedPelple);
                console.log(this.adminId);
            },
            handleName(name) {
                return name.replace(new RegExp(this.searchString, 'gi'), '<strong class="key" style="color: #3E89F7;">$&</strong>');
            },
            scroll(event) {
                if (!this.over) {
                    let flag = event.target.clientHeight + event.target.scrollTop === event.target.scrollHeight;
                    if (flag) {
                        console.log('加载更多成员----');
                        this.$store.commit(types.CHANGE_CURRENT_PAGE, ++this.currentPage);
                    }
                }
            },
            async scrollSearchRet() {
                let flag = event.target.clientHeight + event.target.scrollTop === event.target.scrollHeight;
                if (flag) {
                    this.loading = true;
                    let ret = await this.$api.searchChannelMembers(this.currentChannelId, this.searchString, ++this.searchRetCurrentPage, this.searchRetPageSize);
                    console.log('加载更多成员----', ret);
                    this.listArr = this.listArr.concat(ret);
                    this.loading = false;
                }
            },
            hideComponent() {
                this.$store.commit(types.SHOW_SELECT_PEOPLE, false);
            },
            sure() {
                if (!this.selectedPelple.id) {
                    return;
                }
                this.secondConfrim = true;
            },
            cancleSecondConfrim() {
                this.secondConfrim = false;
            },
            SureSecondConfrim() {
                this.$api.transferChannelAdmin(this.currentChannelId, this.selectedPelple.id);
                console.log('修改', this.selectedPelple);
                this.secondConfrim = false;
                this.$store.commit(types.SHOW_SELECT_PEOPLE, false);
            }
        },
        watch: {
            async searchString(query) {
                if (query.length === 0) {
                    this.firstSearch = true;
                    this.listArr = [];
                    return false;
                }
                this.firstSearch = true;
                this.loading = true;
                let ret = await this.$api.searchChannelMembers(this.currentChannelId, query, 0, this.searchRetPageSize);
                console.log(ret);
                this.listArr = ret;
                this.loading = false;
                this.$nextTick(() => {
                    this.firstSearch = false;
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

    .loading-enter-active {
        transition: all .3s ease;
    }
    .loading-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .loading-enter, .loading-leave-active {
        opacity: 0;
    }
    .loading {
        position: absolute;
        left: 50%;
        top:50%;
        transform:translate(-50%, -50%);
    }
    .no-result {
        display: flex;
        justify-content: center;
        align-items:center;
        font-size: 12px;
        color: #ccc;
    }

    .select {
        box-sizing: border-box;
        padding: 30px;
        padding-top: 20px;
        width: 400px;
        height: 490px;
        background: #FFFFFF;
        border: 1px solid #C3CAD3;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
        border-radius: 0 0 4px 4px;
        position: fixed;
        top: -1px;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        z-index: 30001;
        .title {
            font-size: 14px;
            color: #999999;
            text-align: center;
        }

        .members {
            height: 310px;
            overflow-y: auto;
            margin-bottom: 6px;
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
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: right;
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
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            max-width: 50%;
                            display: inline-block;
                            position: relative;
                            top: 5px;
                            .key {
                                color: #3E89F7;
                            }
                        }
                    }
                    .radio-button {
                        flex: 0.5;
                        padding-top: 10px;
                    }
                }
            }
            .people-item:hover {
                background: #F3F4F5;
            }

        }
        .btn-group {
            text-align: center;
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            .btn {
                padding: 5px 21px;
                background-color: #fff;
                font-size: 14px;
                color: #4a4c5b;
                line-height: 19px;
                border-radius: 4px;
                cursor: pointer;
                outline: none;
            }
            .cancel {
                border: 1px solid #ccc;
            }
            .ensure {
                background: #3e89f7;
                color: #fff;
                margin-left: 15px;
            }
            .disabled {
                background: rgba(62, 137, 247, .2);
                border: none;
            }

        }
    }

    .bg {
        position: fixed;
        z-index: 3000;
        /*width: 100%;*/
        /*height: 100%;*/
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        opacity: 0;
    }

</style>
