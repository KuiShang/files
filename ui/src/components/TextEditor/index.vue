<template>
    <div class="input-wrapper">
        <div class="input-tools">
            <em class="selectFace iconn-1" @click.stop="selectFace" @mouseenter="tooltipIn('选择表情')" @mouseleave="tooltipOut"></em>
            <em class="print-screen iconn-print-screen" @click="printScreen" @mouseenter="tooltipIn('屏幕截图（Alt+s）')" @mouseleave="tooltipOut"></em>
            <em class="selectPic iconn-22" @click="selectPic" @mouseenter="tooltipIn('发送图片')" @mouseleave="tooltipOut"></em>
            <em class="selectFile iconn-icon-file" @click="selectFile" @mouseenter="tooltipIn('发送文件')" @mouseleave="tooltipOut"></em>
            <em class="sendAckMsg iconn-icon-ack" @click="handleAckSignal" @mouseenter="tooltipIn('回执消息')" @mouseleave="tooltipOut"></em>
            <Emoji v-show="showEmoji" @hideEmoji="hideEmoji"></Emoji>
        </div>
        <VueAt :members="members" name-key="name" @atSomeone="atSomeone">
            <pre class="input-container edit-container"
                 :class="{'channel-input-container': module === 'channel', 'chat-input-container': module === 'chat'}"
                 contenteditable="true"
                 @keydown="handleKeyDown"
                 ref="input"
            ></pre>
            <template slot="item" scope="s">
                <span v-text="s.item.staffName" :imid="s.item.imId"></span>
            </template>
        </VueAt>
        <div class="input-error-tip" v-if="errorTipVisible">{{errorReason}}</div>
        <div class="input-ctrl">
            <button class="send-msg-btn" @click="sendMsg">发送</button>
        </div>
    </div>
</template>

<script>
    import Emoji from './Emoji';
    import VueAt from '../At/At';
    import tooltip from '../mixin/tooltips';
    export default {
        props: ['module'],
        components: { Emoji, VueAt },
        data() {
            return {
                inputHTML: '',
                showEmoji: false,
                errorReason: '最多只能发送十张图片',
                errorTipVisible: false
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
            members() {
                return [];
            }

        },
        methods: {
            formatMsg() {
                let msgArr = [],
                    container = document.querySelector('.channel-input-container'),
                    rContainer = document.createElement('div'),
                    vContainer = document.createElement('div'),
                    nodeArr,
                    combineText = '',
                    combineHTML = '',
                    shouldCombine = false,
                    msgLength = 0,
                    extraAtImIds = '',
                    isAcknowledgementMsg = false;
                msgArr.safe = true;
                vContainer.innerHTML = rContainer.innerHTML = container.innerHTML;

                nodeArr = [].slice.call(vContainer.childNodes, 0);
                nodeArr.forEach((item) => {
                    console.log(this.module);
                    if (item.nodeType === 8) {
                        return;
                    } else if (item.nodeType === 3) {
                        var text = item.nodeValue;
//                        var html_ = '';
//                        html_ = text.replace(/((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%()&:/~+#]*[\w\-@?^=%&/~+)#])?/g, function(s, $1, index) {
//                            if (/^(\d+)(\.\d+){1,2}$/.test(s)) {
//                                return s;
//                            }
//                            if (s.indexOf('http://') !== -1 || s.indexOf('https://') !== -1) {
//                                return '<a class="url-link" onclick="publicObject.openUrl(0,\'' + s + '\')">' + s + '</a>';
//                            } else {
//                                return '<a class="url-link" onclick="publicObject.openUrl(0,\'http://' + s + '\')">' + s + '</a>';
//                            }
//                        });
                        combineText += text;
                        combineHTML += replaceAll(replaceAll(replaceAll(text, '&', '&amp;'), '<', '&lt;'), '>', '&gt;');
                        shouldCombine = true;
                        msgLength += text.length;
                    } else if (item.className === 'input-file') {
                        let safeModule = item.dataset.safe;
                        let tempHtml = item.outerHTML;
                        let msg = {
                            'html': tempHtml,
                            'msgType': 6,
                            'filePath': decodeURI(item.dataset.path),
                            'msgBody': '你收到一个文件',
                            'draft': '[文件]',
                            'fileName': decodeURI($(item).attr('data-file-name')),
                            'fname': decodeURI(item.dataset.fileallname) || item.dataset.fname,
                            'picPath': decodeURI(item.dataset.picpath) || getFileThumbnailSrc(getFileType(item.dataset.fname)),
                            'safe': safeModule,
                            'fsize': item.dataset.size,
                            'FileStatus': item.dataset.fid ? 0 : 1,
                            fid: item.dataset.fid,
                            fpath: item.dataset.fid,
                            needToDownload: !item.dataset.filePath
                        };

                        if (safeModule === 'false') {
                            msgArr.safe = false;
                        } else if (msg.fsize > 500 * 1024 * 1024) {
                            msgArr.overSize = true;
                        }
                        if (shouldCombine) {
                            addCombinedMsg.bind(this)();
                            addChannelCombinedMsg.bind(this)();
                        }
                        msgArr.push(msg);
                    } else if (item.className === 'input-img') {
                        let tempHtml = item.outerHTML;
                        let msg = {
                            'html': tempHtml,
                            'msgType': 3,
                            'picPath': item.getAttribute('src'),
                            'msgBody': '你收到一张图片',
                            'draft': '[图片]',
                            'picwidth': parseInt(item.getAttribute('data-picwidth')),
                            'picheight': parseInt(item.getAttribute('data-picheight')),
                            'picsize': parseInt(item.getAttribute('data-picsize'))
                        };
                        if (shouldCombine) {
                            addCombinedMsg.bind(this)();
                            addChannelCombinedMsg.bind(this)();
                        }
                        msgArr.push(msg);
                    } else if (item.className === 'input-msg-at') { // @消息
                        var imId = $(item).attr('im-id');
                        extraAtImIds += imId + ',';

                        let tempHtml = item.outerHTML;
                        let text = $(item).attr('data-at-name') + ' ';
                        combineText += text;
                        combineHTML += tempHtml;
                        shouldCombine = true;
                    } else if (item.className === 'input-AcknowledgementMsg') { // 回执消息
                        var tempHtml = item.outerHTML;
                        combineHTML += tempHtml;
                        shouldCombine = true;
                        isAcknowledgementMsg = true;
                    } else {
                        let text = item.outerHTML;
                        var msgBody_ = '';
                        if (text.indexOf('<img') !== -1) {
                            msgBody_ = '[' + facesMap[text.replace('<img class="input-face" src="../images/face/', '').replace('.png">', '')] + ']';
                        } else {
                            msgBody_ = text;
                        }
                        combineText += msgBody_;
                        combineHTML += text;
                        shouldCombine = true;
                    }
                });

                if (shouldCombine) {
                    addCombinedMsg.bind(this)();
                    addChannelCombinedMsg.bind(this)();
                }

                console.log(msgArr);
                function addCombinedMsg() {
                    if (this.module !== 'chat') {
                        return;
                    }
                    if (combineText.toString().trim() === '') {
                        if (!isAcknowledgementMsg) {
                            return;
                        }
                    }

                    var msgType = 1;
                    var msg = '';
                    // @消息
                    if (extraAtImIds.length > 0) {
                        msgType = 100002;
                    }
                    // 回执消息
                    if (isAcknowledgementMsg) {
                        msgType = 100001;
                        combineHTML = combineHTML.trim();
                    }
                    console.log('combineHTML', combineHTML);
                    msg = {
                        'html': combineHTML,
                        'msgType': msgType,
                        msgBody: combineText,
                        draft: decodeStr(combineText),
                        extra_aite_im_ids: extraAtImIds.substring(0, extraAtImIds.length - 1)
                    };
                    msgArr.push(msg);
                    console.log(msg);
                    combineText = '';
                    combineHTML = '';
                    shouldCombine = false;
                    extraAtImIds = '';// 清空
                }

                function addChannelCombinedMsg() {
                    if (this.module !== 'channel') {
                        return;
                    }
                    if (combineText.toString().trim() === '') {
                        if (!isAcknowledgementMsg) {
                            return;
                        }
                    }

                    let msgType = 1,
                        specialMsgType = 0,
                        msg;
                    // @消息
                    if (extraAtImIds.length > 0) {
                        specialMsgType = 1;
                        extraAtImIds = Array.from(new Set(extraAtImIds.split(','))).join(',');
                    }
                    // 回执消息
                    if (isAcknowledgementMsg) {
                        specialMsgType = 3;
                        combineHTML = combineHTML.trim();
                    }
                    console.log('combineHTML', combineHTML);
                    msg = {
                        'html': combineHTML,
                        'msgType': msgType,
                        msgBody: combineText,
                        draft: decodeStr(combineText),
                        extra_aite_im_ids: extraAtImIds.substring(0, extraAtImIds.length - 1),
                        specialMsgType: specialMsgType
                    };
                    msgArr.push(msg);
                    combineText = '';
                    combineHTML = '';
                    shouldCombine = false;
                    extraAtImIds = '';// 清空

                    console.log(specialMsgType);
                }

                $(container).html('');

                console.log('切分后的消息内容：', msgArr);
                return {
                    msgArr: msgArr,
                    dom: vContainer,
                    msgLength: msgLength
                };
            },
            async sendMsg() {
                let msgObj = this.formatMsg(),
                    msgArr = msgObj.msgArr,
                    msgLength = msgObj.msgLength,
                    sendArr = [],
                    picCount = 0,
                    fileCount = 0,
                    isAcknowledgementMsg = false,
                    acknowledgemsgmsgBody = '';

                if (msgArr.length === 0) {
                    this.showTips(msgObj, '消息不能为空');
                    return;
                }

                if (msgLength > 2000) {
                    this.showTips(msgObj, '最多发送2000字');
                    return;
                }

                for (var i = 0; i < msgArr.length; i++) {
                    if (msgArr[i].msgType === 3) {
                        picCount += 1;
                    } else if (msgArr[i].msgType === 6) {
                        fileCount += 1;
                    } else if (msgArr[i].specialMsgType === 3) { // 回执消息
                        isAcknowledgementMsg = true;
                        acknowledgemsgmsgBody = msgArr[i].msgBody.trim();
                    }
                }

                if (isAcknowledgementMsg) {
                    if (fileCount > 0 || picCount > 0) {
                        this.showTips(msgObj, '回执消息只支持文本消息');
                        return;
                    }
                    if (!acknowledgemsgmsgBody) {
                        this.showTips(msgObj, '不能发送空回执消息');
                        return;
                    }
                }
                if (fileCount > 10) {
                    this.showTips(msgObj, '最多支持10个文件一起发送');
                    return;
                } else if (picCount > 10) {
                    this.showTips(msgObj, '最多支持10个图片一起发送');
                    return;
                } else {
                    if (!msgArr.safe) {
                        this.showTips(msgObj, '限制部分特殊文件格式如.COM .BAT等，请转换其他格式发送');
                        return;
                    }
                    if (msgArr.overSize) {
                        this.showTips(msgObj, '不允许发送500MB以上文件');
                        return;
                    }
                }
                let fileArr = msgArr.filter(item => {
                    return item.msgType === 6;
                });
                let filedelete;
                for (let i = 0; i < fileArr.length; i++) {
                    let file = fileArr[i];
                    console.log(file);
                    if (!file.fid) {
                        let ret = await this.$api.isFileExist(file.filePath);
                        if (!ret) {
                            this.showTips(msgObj, '文件不存在');
                            filedelete = true;
                            break;
                        }
                    }
                }
                if (filedelete) {
                    filedelete = false;
                    return;
                }
                msgArr.forEach((item) => {
                    sendArr.push({
                        channelId: this.currentSession.ChannelId,
                        channelType: this.currentSession.type,
                        channelName: this.currentSession.ChannelName,
                        msgtype: item.msgType,
                        fromUid: this.myInfo.imId,
                        fromName: this.myInfo.name,
                        msgId: Math.uuid(),
                        specialMsgType: item.specialMsgType || 0,
                        msgBody: item.msgBody,
                        picPath: item.picPath,
                        filePath: item.filePath,
                        from: 2000000,
                        fsize: item.fsize,
                        fname: item.fname,
                        FileStatus: item.FileStatus,
                        senderId: this.myInfo.imId,
                        fid: item.fid,
                        fpath: item.fid,
                        'extra_aite_im_ids': item['extra_aite_im_ids'],
                        picwidth: item.picwidth,
                        picheight: item.picheight,
                        picsize: item.picsize
                    });
                });
                if (this.$store.state.messages.gettingReconnectedMsg.flag) {
                    let config = {
                        bSpecialMsg: false,
                        channelId: this.$store.state.messages.gettingReconnectedMsg.channelId,
                        msgSeqId: this.$store.state.messages.gettingReconnectedMsg.seqId + 1,
                        pageSize: this.currentSession.maxSeqId - this.$store.state.messages.gettingReconnectedMsg.seqId,
                        upOrDown: 1
                    };
                    this.$api.reloadDownChannelMsg(config);
                    this.$store.commit('CHANGE_RECONNECTED_STATUS', {flag: false, channelId: '', seqId: '', unReadNum: 0});
                }
                console.log(_deepClone(sendArr));
                this.$api.sendChannelMessageList(sendArr);
                sendArr.forEach((item) => {
                    item.sendtime = Date.parse(new Date());
                    item.id = this.$store.state.myInfo.info.oaId;
                    item.status = 0;
                    item.praiseCount = 0;
                    item.praiseUids = [];
                });
                this.$store.dispatch('addSentMsg', sendArr);
                this.$nextTick(() => {
                    var msgHeight = $('.channel-msg-list-wrapper').height();
                    $('.channel-msg-list').scrollTop(msgHeight);
                    if ($('#channel-' + sendArr[0].channelId).hasClass('active')) {
                        var sessionTop = $('#channel-' + sendArr[0].channelId)[0].offsetTop;
                        var sessionScrollTop = $('#channel-' + sendArr[0].channelId).parent().parent().parent().scrollTop();
                        if (sessionTop < sessionScrollTop) {
                            $('#channel-' + sendArr[0].channelId).parent().parent().parent().scrollTop(sessionTop);
                        }
                    }
                });
            },
            showTips(msgObj, tip) {
                this.errorReason = tip;
                this.errorTipVisible = true;
                setTimeout(() => {
                    this.errorTipVisible = false;
                }, 2000);
                $('.channel-input-container').html(msgObj.dom.innerHTML);
            },
            inputEvent(e) {
                this.inputHTML = e.target.innerHTML;
            },
            selectFace() {
                this.showEmoji = true;
            },
            printScreen() {
                this.tooltipOut();
                this.$api.printScreen();
            },
            selectPic() {
                this.tooltipOut();
                this.$api.OpenFileDialog();
            },
            selectFile() {
                this.tooltipOut();
                this.$api.selectFiles();
            },
            handleAckSignal() {
                let ackDom = this.$refs.input.querySelector('.input-AcknowledgementMsg');

                if (ackDom) {
                    ackDom.parentNode.removeChild(ackDom);
                    return;
                }

                this.$api.getPicturePromise('[回执消息]').then(obj => {
                    let img = document.createElement('img'),
                        input = this.$refs.input,
                        picHeight = obj.picHeight;
                    img.className = 'input-AcknowledgementMsg';
                    img.src = obj.picPath;
                    if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
                        picHeight = picHeight / 2;
                    }
                    img.style.height = picHeight + 'px';
                    input.insertBefore(img, input.childNodes[0]);
                    this.$refs.input.focus();
                    window.getSelection().setPosition(input, input.childNodes.length);
                });
            },
            atSomeone(obj) {
                console.log(obj);
                this.$api.getPicturePromise('@' + obj.staffName).then(pic => {
                    let img = document.createElement('img'),
//                        input = this.$refs.input,
                        picHeight = pic.picHeight;
                    img.className = 'input-msg-at';
                    img.setAttribute('data-at-name', '@' + obj.staffName);
                    img.setAttribute('im-id', obj.imid);
                    img.src = pic.picPath;
                    if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
                        picHeight = picHeight / 2;
                    }
                    img.style.height = picHeight + 'px';
                    insertImg(img.outerHTML + ' ');
//                    input.insertBefore(img, input.childNodes[0]);
//                    window.getSelection().setPosition(input, input.childNodes.length);
                });
            },
            hideEmoji() {
                this.showEmoji = false;
            },
            handleKeyDown(e) {
                if (e.ctrlKey && e.keyCode === 67) {
                    console.log('组织组织');

                    document.execCommand('Copy', 'false', null);
                    e.preventDefault();
                }
                let currentOsIsMac = /macintosh|mac os x/i.test(navigator.userAgent),
                    input = this.module === 'channel' ? $('.channel-input-container') : $('#input-content'),
                    oldScrollHeight, newScrollHeight, oldScrollTop;
                if (this.$store.state.status.hotKey === 0) {
                    if (!currentOsIsMac && e.ctrlKey && e.keyCode === 13) {
                        oldScrollHeight = input[0].scrollHeight;
                        oldScrollTop = input.scrollTop();
                        input.blur();
                        var a = input.html();
                        insertImg('\r\n');
                        if (a.lastIndexOf('\n') !== a.length - 1) {
                            insertImg('\r\n');
                        }

                        newScrollHeight = input[0].scrollHeight;
                        input.scrollTop(newScrollHeight - oldScrollHeight + oldScrollTop);
                    } else if (currentOsIsMac && e.metaKey && e.keyCode === 13) {
                        oldScrollHeight = input[0].scrollHeight;
                        oldScrollTop = input.scrollTop();
                        input.blur();
                        a = input.html();
                        insertImg('\r\n');
                        if (a.lastIndexOf('\n') !== a.length - 1) {
                            insertImg('\r\n');
                        }

                        newScrollHeight = input[0].scrollHeight;
                        input.scrollTop(newScrollHeight - oldScrollHeight + oldScrollTop);
                    } else if (e.keyCode === 13) {
                        e.preventDefault();
                        if ($('.atwho-view').length > 0) {
                            return;
                        }
                        this.sendMsg();
                    }
                } else {
                    if (!currentOsIsMac && e.ctrlKey && e.keyCode === 13) {
                        e.preventDefault();
                        if ($('.atwho-view').length > 0) {
                            return;
                        }
                        this.sendMsg();
                    } else if (currentOsIsMac && e.metaKey && e.keyCode === 13) {
                        e.preventDefault();
                        this.sendMsg();
                    } else if (e.keyCode === 13) {
                        e.preventDefault();
                        oldScrollHeight = input[0].scrollHeight;
                        oldScrollTop = input.scrollTop();
                        input.blur();
                        a = input.html();
                        insertImg('\r\n');
                        if (a.lastIndexOf('\n') !== a.length - 1) {
                            insertImg('\r\n');
                        }

                        newScrollHeight = input[0].scrollHeight;
                        input.scrollTop(newScrollHeight - oldScrollHeight + oldScrollTop);
                    }
                }

                // 粘贴截图等ctrl+v操作
                if (currentOsIsMac) {
                    if (e.metaKey && e.keyCode === 86) {
                        e.preventDefault();
                        mainObject.getClipboardInfo(function(data) {
                            pasteToInput(data);
                        });
                    }
                } else {
                    if (e.ctrlKey && e.keyCode === 86) {
                        e.preventDefault();
                        mainObject.getClipboardInfo(function(data) {
                            pasteToInput(data);
                        });
                    }
                }
            }
        },
        mounted() {
            document.addEventListener('click', () => {
                this.showEmoji = false;
            });
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {
                    if (!(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
                        e.preventDefault();
                    }
                }
                if (e.ctrlKey && e.keyCode === 86) {
                    if (!(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
                        e.preventDefault();
                    }
                }
            });
        },
        watch: {
            currentSession: {
                handler(newSession, oldSession) {
                    if (newSession.ChannelId === oldSession.ChannelId) {
                        return;
                    }
                    let html = $('.edit-container').html();
                    if (html !== '') {
                        console.log('草稿', html);
                        var msgArr = this.formatMsg().msgArr;
                        if (msgArr) {
                            console.log('草稿数据', msgArr);
                            var draftHtml = '';
                            var draftTrueHtml = '';
                            for (var i = 0; i < msgArr.length; i++) {
                                draftHtml += msgArr[i].draft;
                                draftTrueHtml += msgArr[i].html;
                            }
                            this.$store.state.messages.receiptMap[oldSession.ChannelId] = {'draft': draftHtml, 'html': draftTrueHtml};
                        }
                        $('.edit-container').html('');
                    } else {
                        this.$store.state.messages.receiptMap[oldSession.ChannelId] = '';
                    }
                    if (this.$store.state.messages.receiptMap[newSession.ChannelId]) {
                        $('.edit-container').html(this.$store.state.messages.receiptMap[newSession.ChannelId].html);
                        var obj = $('.edit-container')[0];
                        window.getSelection().setPosition(obj, obj.childNodes.length);
                    }
                },
                deep: true
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .input-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 157px;
        box-sizing: border-box;
        border-top: 1px solid #eee;
        width: 100%;
    }
    .input-tools {
        height: 40px;
        line-height: 40px;
        position: relative;
        -webkit-user-select: none;
        cursor: default;
        color: #4A4C5B;
    }
    .input-tools em {
        font-size: 24px;
        margin-left: 20px;
        cursor: pointer;
        vertical-align: middle;
    }
    .input-tools em:hover {
        color: #4590e4;
    }
    .sendAckMsg {
        width: 24px;
        height: 40px;
        margin-left: 20px;
        background: url('../../../images/icon/回执消息@2x.png') no-repeat 50% 50%;
        background-size: 24px 24px;
    }
    .sendAckMsg:hover {
        background: url('../../../images/im/回执消息－hover@2x.png') no-repeat 50% 50%;
        background-size: 24px 24px;
    }
    .iconn-print-screen {
        width: 24px;
        height: 40px;
        margin-left: 20px;
        background: url('../../../images/im/裁剪 copy@2x (2).png') no-repeat 50% 50%;
        background-size: 24px 24px;
    }
    .iconn-print-screen:hover {
        background: url('../../../images/im/裁剪 copy@2x.png') no-repeat 50% 50%;
        background-size: 24px 24px;
    }
    .edit-container {
        height: 60px;
        overflow-y: auto;
        line-height: 20px;
        padding: 3px 10px;
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
    }
    .input-ctrl {
        text-align: right;
        padding: 5px 20px 20px 0;
    }
    .send-msg-btn {
        display: inline-block;
        color: #fff;
        height: 30px;
        line-height: 30px;
        width: 70px;
        text-align: center;
        background: #4A4C5B;
        border-radius: 20px 20px 0px 20px;
        -webkit-user-select: none;
        cursor: pointer;
    }
    .send-msg-btn:hover {
        background-color: #4590e4;
    }
    #app .atwho-li img {
        width: 10px;
        height: 10px;
    }
    .input-error-tip {
        padding: 5px 10px;
        border: 1px solid #999999;
        border-radius: 5px;
        text-align: center;
        position: absolute;
        right: 10px;
        bottom: 60px;
        font-size: 12px;
        background-color: #fff;
    }
    .input-error-tip:after {
        position: absolute;
        left: 50%;
        bottom: -9px;
        content: '';
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 8px solid #bbb;
        transform: translate(-50%, 0);
        z-index: 1;
    }

    .input-error-tip:before {
        position: absolute;
        left: 50%;
        bottom: -7px;
        content: '';
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 8px solid #fff;
        transform: translate(-50%, 0);
        z-index: 2;
    }

</style>
