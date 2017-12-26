<template lang="html">
        <div class="information">
            <div class="instruction"  v-show="instructionFlag" :class="{mb0:edit === 'instruction'}">
                <p class="title">频道说明</p>
                <p v-if="edit !== 'instruction'" class="for-copy">
                    <span class="ftsz12 txt-select" @contextmenu="showContextmenu" id="instruction" ref="instruction">{{instruction}}</span>
                    <img src="./编辑@2x.png" alt="" v-show="adminId == oaId" @click="changeInstruction">
                    <!--     <textarea name="" id="instruction" cols="30" rows="10" v-show="editing = 'instruction'">{{instruction}}</textarea>-->
                </p>
            </div>
            <div class="notice"  v-show="noticeFlag">
                <p class="title">频道公告</p>
                <p   v-if="edit !== 'notice'" class="for-copy">
                    <span class="ftsz12 txt-select" @contextmenu="showContextmenu"  id="notice" ref="notice">{{notice}}</span>
                    <img src="./编辑@2x.png" alt="" v-show="adminId == oaId" @click="changeNotice">
                    <!-- <textarea name="" id="notice" cols="30" rows="10" v-show ="editing = 'notice'">{{notice}}</textarea>-->
                </p>
            </div>
            <transition name="showEditer666">
                <div class="editing opacity0"  :class="{opacity1 : edit}">
                    <!--<p class="title">{{editTitle}}</p>-->
                    <textarea name=""  cols="30" rows="10" v-model.lazy="draft" maxlength="500" class="ftsz12 trans_hide transition" :class="{trans_show: edit }" @contextmenu="showSystemcontextmenu"></textarea>
                    <div class="btn">
                        <span class="cancle" @click="cancle">取消</span>
                        <span class="save" @click="save">{{confirmTxt}}</span>
                    </div>
                </div>
            </transition>

            <SimpleRightMenu v-if="this.currentSimpleRightmenuId === this.rightMenuId" :clientX="clientX" :clientY="clientY">
                <div class="copy" @click="copy">复制</div>
            </SimpleRightMenu>
        </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import * as types from '../../../store/mutation-types';
    import SimpleRightMenu from '../../../Commons/SimpleRightMenu/SimpleRightMenu.vue';
    export default{
        name: 'information',
        data() {
            return {
                rightMenuId: Symbol('CHANNEL_SETTING_INFORMATION'),
                clientX: 0,
                clientY: 0,
                edit: false,
                draft: '',
                editTitle: '',
                showToast: false
            };
        },
        components: { SimpleRightMenu },
        computed: {
            ...mapGetters({
                currentSimpleRightmenuId: 'currentSimpleRightmenuId',
                instruction: 'instruction',
                notice: 'notice',
                adminId: 'adminId',
                imUserId: 'imUserId',
                currentChannelSession: 'currentChannelSession',
                myInfo: 'myInfo',
                oaId: 'oaId',
                currentChannelId: 'currentChannelId'
            }),
            instructionFlag() {
                return this.edit !== 'notice';
            },
            noticeFlag() {
                return this.edit !== 'instruction';
            },
            imUserId2() {
                return 1;
            },
            editing() {
                return !(this.edit === 'false');
            },
            confirmTxt() {
                if (this.edit === 'instruction') {
                    return '保存';
                } else if (this.edit === 'notice') {
                    return '发布';
                }
            }
        },
        methods: {
            showSystemcontextmenu(e) {
                e.stopPropagation();
            },
            copy(e) {
                document.execCommand('Copy', 'false', null);
            },
            changeInstruction() {
                if (this.adminId !== this.oaId) {
                    console.error('非法操作！');
                    return;
                }
                this.edit = 'instruction';
                this.editTitle = '频道说明';
                this.draft = this.instruction;
            },
            changeNotice() {
                if (this.adminId !== this.oaId) {
                    console.error('非法操作！');
                    return;
                }
                this.edit = 'notice';
                this.editTitle = '频道公告';
                this.draft = this.notice;
            },
            test2() {
                console.log(this.myInfo);
                console.log(this.adminId);
            },
            save() {
                if (this.edit === 'notice') {
                    this.$modal({
                        message: '该公告会发布至频道中，是否发布？',
                        confirmFn: this.toastConfirm
                    });
                } else if (this.edit === 'instruction') {
                    this.$store.commit(types.CHANGE_INSTRUCTION, this.draft);
                    this.$api.changeInstruction(this.currentChannelId, this.draft);
                    this.edit = '';
                }
            },
            toastConfirm() {
                this.showToast = false;
                this.edit = '';
                this.$store.commit(types.CHANGE_NOTICE, this.draft);
                this.$api.changeNotice(this.currentChannelId, this.draft);
                if (this.draft.trim() === '') {
                    return;
                }
                let msg = {
                    channelId: this.currentChannelId,
                    channelType: this.currentChannelSession.type,
                    channelName: this.currentChannelSession.ChannelName,
                    msgtype: 1,
                    specialMsgType: 4,
                    msgId: Math.uuid(),
                    fromUid: this.myInfo.imId,
                    fromName: this.myInfo.name,
                    msgBody: this.draft
                };
                this.$api.sendChannelMessageList([msg]);
                msg.sendtime = Date.parse(new Date());
                msg.id = this.$store.state.myInfo.info.oaId;
                msg.status = 0;
                msg.praiseCount = 0;
                msg.praiseUids = [];
                this.$store.dispatch('addSentMsg', [msg]);
                this.$nextTick(() => {
                    var msgHeight = $('.channel-msg-list-wrapper').height();
                    $('.channel-msg-list').scrollTop(msgHeight);
                });
            },
            cancle() {
                this.edit = '';
                this.draft = '';
            },
            _documentSelectElement(element) {
                let sel = window.getSelection();
                let range = document.createRange();
                range.selectNode(element);
                sel.removeAllRanges();
                sel.addRange(range);
            },
            showContextmenu(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log(e);
                this.$store.commit(types.SET_CURRENT_SIMPLE_RIGHTMENU_ID, this.rightMenuId);
                this.clientX = e.clientX + 'px';
                this.clientY = e.clientY + 'px';
                let str = window.getSelection().toString();
                let currentDom = '';
                if (e.srcElement.id === 'instruction') {
                    currentDom = this.$refs.instruction;
                } else {
                    currentDom = this.$refs.notice;
                }
                if (!str) {
                    this._documentSelectElement(currentDom);
                }
                currentDom = '';
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .opacity0 {
        opacity: 0;
    }
    .opacity1 {
        opacity: 1;
    }
    .trans_hide {
        height: 0px;
        opacity: 0;
    }
    .transition {
        transition: all 0.5s ease;
    }
    .trans_show {
        height: 166px;
        opacity: 100;
    }
    .ftsz12 {
        font-size: 12px;
    }
    .txt-select {
        user-select: text;
    }
    .txt-select::selection {
        color: #323232;
        background-color:rgba(62,137,247,0.3);
    }
    .showEditer-enter-active {
        transition: all .4s ease;
    }
    .showEditer-leave-active {
        transition: all .2s ease;
    }

    .showEditer-enter, .showEditer-leave-active {
        opacity: 0;
    }

    img {
        width: 14px;
        cursor: pointer;
    }

    .information {
        transition: all 0.5s ease-in-out;
        bottom: 0;
        left: 50px;
        right: 50px;
        top: 76px;
        padding-top: 50px;
        overflow: scroll;
        box-sizing: border-box;
        position: absolute;
        .instruction {
            transition: all .4s ease-in-out;
            margin-bottom: 30px;
        }
        .mb0 {
            margin-bottom: 0;
        }
        .notice {
           /* padding-top: 30px;*/
            transition: all 0.5s ease-in-out;
        }
        .editing {
            span {
                cursor: pointer;
            }
            textarea {
                border: 1px solid #EEEEEE;
                border-radius: 2px;
                width: 98%;
                padding: 2px;
            }
            textarea::selection {
                color: #323232;
                background-color:rgba(62,137,247,0.3);
            }
            .btn {
                display: flex;
                justify-content: flex-end;
                .save {
                    font-size: 14px;
                    color: #4590E4;
                    margin-left: 10px;
                }

            }
        }
        .title {
            font-size: 14px;
            color: #999999;
            padding-bottom: 10px;
        }

    }
</style>
