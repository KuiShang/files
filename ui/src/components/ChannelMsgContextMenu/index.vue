<template>
    <div class="channel-msg-context-menu clearfix"
         v-if="show && !deletedMsg"
         :style="{ top: top, left: left }"
         ref="dom"
         @click.stop=""
    >
        <!--点赞-->
        <div class="channel-msg-context-menu-item channel-msg-praise" v-if="!praised" @click="praise" @mouseenter="tooltipIn('点赞')" @mouseleave="tooltipOut"></div>
        <!--取消点赞-->
        <div class="channel-msg-context-menu-item channel-msg-praised" v-else @click="cancelPraise"  @mouseenter="tooltipIn('取消点赞')" @mouseleave="tooltipOut"></div>
        <!--复制-->
        <div class="channel-msg-context-menu-item channel-msg-copy" @click="copyMsg" v-if="showCopy"  @mouseenter="tooltipIn('复制')" @mouseleave="tooltipOut"></div>
        <!--转发-->
        <div class="channel-msg-context-menu-item channel-msg-forward" @click="forwardMsg" v-if="showForward"  @mouseenter="tooltipIn('转发')" @mouseleave="tooltipOut"></div>

        <section v-if="true" class="hideList3">
            <!--更多-->
            <div class="channel-msg-context-menu-item channel-msg-more" @click="showMore" v-if="itemNum > 4 "  @mouseenter="tooltipIn('更多')" @mouseleave="tooltipOut"></div>
            <!--另存为-->
            <div class="channel-msg-context-menu-item channel-msg-saveas" @click="saveas" v-if="(FileStatus === 0 || msgtype === 3) && itemNum < 5 "  @mouseenter="tooltipIn('另存为')" @mouseleave="tooltipOut"></div>
            <!--回发-->
            <div class="channel-msg-context-menu-item channel-msg-sendreturn" @click="sendReturn" v-if="cansendReturn && itemNum < 5 "  @mouseenter="tooltipIn('文件回发')" @mouseleave="tooltipOut"></div>
            <!--在文件夹中打开-->
            <div class="channel-msg-context-menu-item channel-msg-openinfile" :class="{disabled: cannotopenInfile}" @click="openInfile" v-if="FileStatus === 2 && itemNum < 5 && !cannotopenInfile"  @mouseenter="tooltipIn('在文件夹中显示')" @mouseleave="tooltipOut"></div>
        </section>
        <!--删除-->
        <div class="channel-msg-context-menu-item channel-msg-delete" v-if="isMyMsg  && itemNum < 5 " @click="deleteMsg"  @mouseenter="tooltipIn('删除')" @mouseleave="tooltipOut"></div>

        <ul class="dropdown-container">
        <!--另存为-->
        <li class="dropdown-item channel-msg-saveas2" @click.stop="saveas" v-if="(FileStatus === 0 || msgtype === 3) && showmore">另存为</li>
        <!--回发-->
        <li class="dropdown-item channel-msg-sendreturn2" @click.stop="sendReturn" v-if="cansendReturn && showmore">文件回发</li>
        <!--在文件夹中打开-->
        <li class="dropdown-item channel-msg-openinfile2" :class="{disabled: cannotopenInfile}" @click.stop="openInfile" v-if="FileStatus === 2 && showmore">在文件夹中显示</li>
        <!--删除-->
        <li class="dropdown-item channel-msg-delete2" v-if="isMyMsg  && showmore" @click.stop="deleteMsg">删除</li>
        </ul>

    </div>
</template>

<script>
    import Vue from 'vue';
    import tooltip from '../mixin/tooltips';
    export default {
        data() {
            return {
                msg: {},
                show: false,
                praised: false,
                top: 0,
                left: 0,
                cansendReturn: false,
                cannotopenInfile: false,
                itemNum: 0,
                showmore: false,
                itemNum2: 0,
                component: null
            };
        },
        mixins: [tooltip],
        computed: {
            currentSession() {
                return this.$store.state.status.currentChannelSession;
            },
            myInfo() {
                return this.$store.state.myInfo.info;
            },
            isMyMsg() {
                return this.msg.id === this.$store.state.myInfo.info.oaId;
            },
            showCopy() {
                if (this.msg.msgtype === 6 || this.msg.msgType === 6) {
                    return true;
//                    return typeof (this.msg.filePath) !== 'undefined';
                } else if (this.msg.msgtype === 1 || this.msg.msgType === 1 || this.msg.msgType === 3 || this.msg.msgtype === 3) {
                    return true;
                } else {
                    return false;
                }
            },
            showDelete() {
                return this.isMyMsg && this.msgType !== -1;
            },
            deletedMsg() {
                return this.msg.isDelete === 1;
            },
            showForward() {
                return this.msg.msgType === 1 || this.msg.msgtype === 1 || this.msg.msgType === 3 || this.msg.msgtype === 3 || this.msg.msgType === 6 || this.msg.msgtype === 6 || this.msg.msgType === 5 || this.msg.msgtype === 5;
            },
            FileStatus() {
                return this.msg.FileStatus;
            },
            msgtype() {
                return this.msg.msgtype;
            }
        },
        methods: {
            async updateAll() {
                let [, , sendReturn, openInfile] = await Promise.all([this.updateShowMore(), this.updateItemNum(), this.updateCansendReturn(), this.updateCanopenInfile()]);
                // console.log('sendReturn:', sendReturn);
                // console.log(openInfile);
                // console.log(this.itemNum);
                sendReturn && this.itemNum++;
                openInfile && this.itemNum++;
                // console.log(this.itemNum);
            },
            updateCansendReturn() {
                if (this.isMyMsg) {
                    this.cansendReturn = false;
                    return false;
                }
                if (!(this.msgtype === 6 && this.FileStatus === 2)) {
                    this.cansendReturn = false;
                    return false;
                }
                let path = this.msg.filePath;
                let lastModifyTime = this.msg.lastModifyTime;
                return new Promise(resolve => {
                    this.$api.getFileMd5(path, md5 => {
                        console.log('md5', md5);
                        if (!md5) {
                            this.cansendReturn = false;
                            resolve(false);
                            return false;
                        }
                        if (md5 === lastModifyTime) {
                            this.cansendReturn = false;
                            resolve(false);
                        } else {
                            this.cansendReturn = true;
                            resolve(true);
                        }
                    });
                });
            },
            updateCanopenInfile() {
                if (this.msgtype === 6 && this.FileStatus === 2) {
                    let path = this.msg.filePath;
                    return new Promise(resolve => {
                        this.$api.isFileExist(path).then(flag => {
                            this.cannotopenInfile = !flag;
                            resolve(true);
                        });
                    });
                } else {
                    return false;
                }
            },
            updateItemNum() {
                this.itemNum = 0;
                // 从1开始 点赞和取消点赞必有一个
                let num = 1;
                !!this.showForward && num++;
                !!this.showCopy && num++;
                if (this.msg.FileStatus === 0 || this.msg.msgtype === 3) {
                    num++;
                }
                !!this.isMyMsg && num++;
                this.itemNum = this.itemNum + num;
                return this.itemNum;
            },
            updateShowMore() {
                this.showmore = false;
            },
            showComponent(component, rect) {
                if (this.show === true) {
                    return;
                }
//                console.log('showomponent');
                this.component = component;
                this.msg = component.msg;
                this.updateAll();
                this.show = true;
                this.$nextTick(() => {
                    if (!this.$refs.dom) {
                        return;
                    }
                    this.top = rect.top - 27 + 'px';
                    let offsetWidth = this.$refs.dom.offsetWidth;
                    offsetWidth = offsetWidth > 130 ? 130 : offsetWidth;
                    if (component.msg.id === this.$store.state.myInfo.info.oaId) {
                        this.left = rect.left - 330 - offsetWidth + 20 + 'px';
                    } else {
                        this.left = rect.left + rect.width - 20 - 330 + 'px';
                    }
//                    console.log('----------------------------------');
//                    console.log('left:', this.left);
//                    console.log('top:', this.top);
//                    console.log('this.$refs.dom.offsetWidth:', this.$refs.dom.offsetWidth);
//                    console.log('rect.left:', rect.left);
                });
            },
            hideComponent() {
                this.show = false;
                this.msg = {};
//                console.log('hideComponent');
            },
            test() {
                console.log(this.itemNum);
            },
            praise() {
                this.msg.praiseUids || Vue.set(this.msg, 'praiseUids', []);
                this.msg.praiseCount || Vue.set(this.msg, 'praiseCount', 0);
                this.praiseApi();
            },
            cancelPraise() {
                console.log(this.itemNum);
                this.praiseApi();
            },
            praiseApi() {
                this.$api.thumbSupChannelMessage({
                    msgId: this.msg.msgId,
                    channelId: this.msg.channelId
                });
                this.component.$refs.praise1 && this.component.$refs.praise1.handleAnimation();
                this.component.$refs.praise2 && this.component.$refs.praise2.handleAnimation();
            },
            _isSelected() {
                let selectionObj = window.getSelection();
                let rangeObj;
                try {
                    rangeObj = selectionObj.getRangeAt(0);
                } catch (e) {
                    return '';
                }
                console.log(rangeObj);
                if (rangeObj.commonAncestorContainer !== document.querySelector('#msg-' + this.msg.msgId) && $(rangeObj.commonAncestorContainer).parents('#msg-' + this.msg.msgId).length === 0) {
                    return '';
                }
                let docFragment = rangeObj.cloneContents();
                let tempDiv = document.createElement('div');
                tempDiv.appendChild(docFragment);
                return tempDiv.innerHTML;
            },
            copyMsg() {
                if (this.msg.msgtype === 1 || this.msg.msgType === 1) {
                    let selectedTxt = this._isSelected();
                    const sel = window.getSelection();
                    const range = document.createRange();
                    if (!selectedTxt) {
                        range.selectNode(document.querySelector('#msg-' + this.msg.msgId + ' .list-text pre'));
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    document.execCommand('copy');
                    sel.removeAllRanges();
                } else if (this.msg.msgtype === 6 || this.msg.msgType === 6) {
//                    if (this.msg.filePath) {
//                        mainObject.setClipboardInfo(this.msg.filePath);
//                    } else {
                    let options = {
                        fid: this.msg.fid,
                        fpath: this.msg.fpath,
                        fname: this.msg.fname,
                        fsize: this.msg.fsize
                    };
                    mainObject.setClipboardInfo(JSON.stringify(options));
//                    }
                } else if (this.msg.msgType === 3 || this.msg.msgtype === 3) {
                    console.log(this.msg);
                    if (this.msg.picPath) {
                        console.log('picpath');
                        mainObject.setClipboardInfo(JSON.stringify({picpath: this.msg.picPath, picwidth: this.msg.picwidth, picheight: this.msg.picheight, picsize: this.msg.picsize}));
                    } else {
                        console.log('picurl');
                        mainObject.setClipboardInfo(JSON.stringify({picpath: this.msg.picurl, picwidth: this.msg.picwidth, picheight: this.msg.picheight, picsize: this.msg.picsize}));
                    }
                    // mainObject.setClipboardInfo(JSON.stringify({picpath: this.msg.picurl, picwidth: this.msg.picwidth, picheight: this.msg.picheight}));
                }
                this.$toast({
                    message: '已复制',
                    success: true
                });
            },
            forwardMsg() {
                this.$store.state.status.forward.show = true;
                this.$store.state.status.forward.msg = this.msg;
                this.hideComponent();
            },
            deleteMsg() {
                this.$modal({
                    message: '删除这条消息，频道其他成员将无法看到，确定删除？',
                    confirmFn: () => {
                        this.$api.deleteChannelMessage({
                            channelId: this.$store.state.status.currentChannelSession.ChannelId,
                            msgId: this.msg.msgId,
                            uid: this.$store.state.myInfo.info.imUserId
                        });
                    }
                });
            },
            showMore() {
                this.showmore = !this.showmore;
            },
            async saveas() {
                if (this.msgtype === 3) {
                    let path = this.msg.picurl || this.msg.picPath;
                    this.$api.saveImageToLocal(path);
                } else {
                    // this.msg.FileStatus = 1;
                    let fileType = this.msg.msgtype;
                    let channelId = this.msg.channelId;
                    let msgId = this.msg.msgId;
                    let url = this.msg.fpath;
                    let fileName = this.msg.fname;
                    let filePath = '';
                    let tempobj = {
                        fileType,
                        channelId,
                        msgId,
                        url,
                        fileName,
                        filePath
                    };
                    let flag = await this.$api.downloadChannelFile(tempobj);
                    console.log(flag);
                    if (flag) {
                        this.msg.FileStatus = 1;
                    }
                    console.log('未下载->下载');
                }
            },
            sendReturn() {
                this.$emit('showSendreturnTip', this.msg);
                this.show = false;
            },
            openInfile() {
                if (this.cannotopenInfile) {
                    return;
                }
                this.show = false;
                let path = this.msg.filePath;
                this.$api.openInfile(path);
            }
        },
        watch: {
            msg: {
                handler() {
                    let num = this.msg.praiseUids ? this.msg.praiseUids.length : 0;
                    while (num--) {
                        if (this.msg.praiseUids[num] === this.$store.state.myInfo.info.imUserId) {
                            this.praised = true;
                            return;
                        }
                    }
                    this.praised = false;
                },
                deep: true
            },
            show(flag) {
                if (!flag) {
                    this.showmore = false;
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    @import '../../style/constant.scss';
    .channel-msg-context-menu {
        position: absolute;
        border: 1px solid #eee;
        border-radius: 5px;
        height: 30px;
        background-color: #fff;
        padding: 0 4px;
        display: flex;
        .channel-msg-context-menu-item {
            height: 22px;
            width: 22px;
            margin: 4px;
            background-size: 22px 22px;
            cursor: pointer;

        }
        img {
            width: 22px;
            height: 22px;
        }

        .dropdown-container{
            position: absolute;
            z-index: $z-channel-contextmenu-dropdown-menu;
            top:30px;
            left: 100px;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
            border-radius: 4px;
            .dropdown-item {
                height: 30px;
                line-height: 30px;
                padding: 0 30px;
                white-space:nowrap;
                cursor: pointer;
                background: #FFFFFF;
                &:hover {
                    background: #ECF4FC;
                }
            }
            li + li{
                border-top: 1px solid #eee;
            }

        }
    }
    .channel-msg-praise {
        background-image: url('../../../images/icon/praise-default.png');
    }
    .channel-msg-praise:hover {
        background-image: url('../../../images/icon/praise-hover.png');
    }
    .channel-msg-praised {
        background-image: url('../../../images/icon/praised.png');
    }
    .channel-msg-copy {
        background-image: url('../../../images/icon/copy-default.png');
    }
    .channel-msg-copy:hover {
        background-image: url('../../../images/icon/copy-hover.png');
    }
    .channel-msg-forward {
        background-image: url('../../../images/icon/forward-default.png');
    }
    .channel-msg-forward:hover {
        background-image: url('../../../images/icon/forward-hover.png');
    }
    .channel-msg-delete {
        background-image: url('../../../images/icon/delete-msg-default.png');
    }
    .channel-msg-delete:hover {
        background-image: url('../../../images/icon/delete-msg-hover.png');
    }
    .channel-msg-openinfile2.disabled {
        color: #ccc;
    }
    .channel-msg-more {
        background-image: url('../../../images/icon/更多 copy@2x.png');
    }
    .channel-msg-more:hover {
        background-image: url('../../../images/icon/更多@2x.png');
    }
    .channel-msg-saveas {
        background-image: url('../../../images/icon/另存为@2x.png');
    }
    .channel-msg-saveas:hover {
        background-image: url('../../../images/icon/另存为 hover@2x.png');
    }
    .channel-msg-openinfile {
        background-image: url('../../../images/icon/在文件夹中打开@2x.png');
    }
    .channel-msg-openinfile:hover {
        background-image: url('../../../images/icon/在文件夹中打开 hover@2x.png');
    }
</style>
