<template>
    <div class="forwardMessage" @click="close_search" v-if="this.forwardInfo.show">
        <toast ref="toastComponent"></toast>
        <div class="choice-show clearFix">
            <div class="choice fl">
                <div class="forward-search" :class="{'high-light': !isSearch}">
                    <div class="onblur" v-show="isSearch" @click="searchClick"><i class="search_logo"></i></div>
                    <div class="focus" v-show="!isSearch">
                        <i class="search_logo"></i>
                        <input id="forward-input" type="text" placeholder="搜索" autofocus @keyup="check" @click.stop v-model="searchString" @contextmenu="showcontextmenu">
                    </div>
                </div>
                <div v-show="!searchString" class="forward-recent-session">
                    <h6>最近聊天</h6>
                    <ul v-if="listArr.length>0">
                        <li class='forward-search-item' v-for="(item,key) in listArr" @click="choose(item)">
                            <div v-if="item.module==='channel'">
                                <span class="list-face" style="font-size: 30px;"
                                      :style="{ backgroundColor: $util.getNickNameColor(Math.abs($util.hashCode(item.channelId)))}"
                                >
                                    <img class="channel-icon" src="../../../images/icon/Group 4 Copy 7@2x.png">
                                </span>
                                <span class="list-name">{{item.channelName}}</span>
                                <i class='noActive' :class='{Active: selectArr.indexOf(JSON.stringify(item)) !== -1}'></i>
                            </div>
                            <div v-else-if="item.module==='group'">
                                <span class="list-face"
                                      :style="{ backgroundColor: $util.getNickNameColor(Math.abs($util.hashCode(item.groupId)))}"
                                >
                                    <em class="iconn-46" style="font-size: 23px;"></em>
                                </span>
                                <span class="list-name">{{item.groupName}}</span>
                                <i class='noActive' :class='{Active: selectArr.indexOf(JSON.stringify(item)) !== -1}'></i>
                            </div>
                            <div v-else>
                                <span class="list-face" style="font-size: 14px;"
                                      :style="{ backgroundColor: $util.getNickNameColor(item.oaId) }"
                                >{{$util.getNickName(item.groupName)}}</span>
                                <span class="list-name">{{item.groupName}}</span>
                                <i class='noActive' :class='{Active: selectArr.indexOf(JSON.stringify(item)) !== -1}'></i>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="forward-recent-no-session">
                        <img src="../../../images/public/no-record.jpg" width="132" height="132">
                        <p>暂无最近聊天</p>
                    </div>
                </div>
                <div v-show="searchString" class="forward-search-result">
                    <div v-show="totalCount>0">
                        <SearchResult
                            :module="'contact'"
                            :searchString="searchString"
                            :selectArr="selectArr"
                            @choose="choose"
                            @setItemCount="setItemCount"
                        >
                        </SearchResult>
                        <SearchResult
                            :module="'channel'"
                            :searchString="searchString"
                            :selectArr="selectArr"
                            @choose="choose"
                            @setItemCount="setItemCount"
                        >
                        </SearchResult>
                        <SearchResult
                            :module="'group'"
                            :searchString="searchString"
                            :selectArr="selectArr"
                            @choose="choose"
                            @setItemCount="setItemCount"
                        >
                        </SearchResult>
                    </div>
                    <div v-show="totalCount===0" class="forward-search-no-result">
                        暂无搜索结果
                    </div>
                </div>

            </div>
            <div class="show fr">
                <p class="select_head">
                    <span class="selected">已选</span>
                    <span class="select_num">{{selectArr.length}}/99</span>
                    <span class="empty" @click='emptyAll' :class="{active: selectArr.length}"><i></i><span>清空</span></span>
                </p>
                <ul>
                    <li v-for="(item, key) in selectArr" class="forward-search-item">
                        <div v-if="JSON.parse(item).module==='channel'">
                            <span class="list-face" style="font-size: 30px;"
                                  :style="{ backgroundColor: $util.getNickNameColor(Math.abs($util.hashCode(JSON.parse(item).channelId))) }"
                            >
                                <img class="channel-icon" src="../../../images/icon/Group 4 Copy 7@2x.png">
                            </span>
                            <span class="list-name">{{JSON.parse(item).channelName}}</span>
                            <span class="close" :index='key' @click="deleteInList(item)"></span>
                        </div>
                        <div v-else-if="JSON.parse(item).module==='group'">
                            <span class="list-face"
                                  :style="{ backgroundColor: $util.getNickNameColor(Math.abs($util.hashCode(JSON.parse(item).groupId))) }"
                            >
                                <em class="iconn-46" style="font-size: 23px;"></em>
                            </span>
                            <span class="list-name">{{JSON.parse(item).groupName}}</span>
                            <span class="close" :index='key' @click="deleteInList(item)"></span>
                        </div>
                        <div v-else>
                            <span class="list-face" style="font-size: 14px;"
                                  :style="{ backgroundColor: $util.getNickNameColor(JSON.parse(item).oaId) }"
                            >{{$util.getNickName(JSON.parse(item).groupName)}}</span>
                            <span class="list-name">{{JSON.parse(item).groupName}}</span>
                            <span class="close" :index='key' @click="deleteInList(item)"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn-group">
            <button class="cancel" @click="hideComponent">取消</button>
            <button class="ensure" :class="{ disabled: isdisabled }" @click= 'sure'>确定</button>
        </div>
    </div>
</template>
<script>
    import toast from './toast.vue';
    import SearchResult from './SearchResult';
    import { mapGetters } from 'vuex';
    export default{
        name: '',
        data() {
            return {
                toastState: false,
                listArr: [],
                selectArr: [],
                isSearch: true,
                searchString: '',
                channelItemCount: 0,
                groupItemCount: 0,
                contactItemCount: 0
            };
        },
        computed: {
            isdisabled() {
                if (this.selectArr.length === 0) {
                    return true;
                } else {
                    return false;
                }
            },
            forwardInfo() {
                return this.$store.state.status.forward;
            },
            forwardMsgId() {
                return this.$store.state.status.forward.msg && this.$store.state.status.forward.msg.msgId;
            },
            ...mapGetters({
                imUserId: 'imUserId',
                myInfo: 'myInfo'
            }),
            totalCount() {
                return this.channelItemCount + this.groupItemCount + this.contactItemCount;
            }
        },
        methods: {
            showcontextmenu(e) {
                e.stopPropagation();
            },
            hideComponent() {
                this.$store.state.status.forward.show = false;
                this.$store.state.status.forward.msg = {};
                this.isSearch = true;
                this.selectArr = [];
            },
            close_search(ev) {
                let className = ev.target.className;
                if (!document.getElementById('forward-input')) {
                    this.isSearch = true;
                    return;
                }
                let value = document.getElementById('forward-input').value;
                if (className !== 'focus' && className !== 'search_logo' && className !== 'onblur' && value.length === 0) {
                    this.isSearch = true;
                }
            },
            check() {
            },
            setItemCount(module, count) {
                switch (module) {
                    case 'channel':
                        this.channelItemCount = count;
                        break;
                    case 'group':
                        this.groupItemCount = count;
                        break;
                    case 'contact':
                        this.contactItemCount = count;
                        break;
                    default:
                        break;
                }
            },
            choose(item) {
                let s = JSON.stringify(item);
                if (this.selectArr.indexOf(s) === -1) {
                    this.selectArr.push(s);
                } else {
                    this.selectArr.splice(this.selectArr.indexOf(s), 1);
                }
            },
            searchClick(ev) {
                let className = ev.target.className;
                if (className === 'onblur' || className === 'search_logo') {
                    this.isSearch = false;
                }
            },
            toast() {
                this.toastState = true;
                setTimeout(() => {
                    this.toastState = false;
                }, 2000);
            },
            changeActive(ev) {
                let className = ev.target.className;
                let index = ev.target.getAttribute('index');
                if (className === 'noActive') {
                    ev.target.className = 'Active';
                    this.selectArr.push(this.listArr[index]);
                } else {
                    ev.target.className = 'noActive';
                    let clickName = this.listArr[index].name;
                    let len = this.selectArr.length;
                    for (let i = 0; i < len; i++) {
                        if (clickName === this.selectArr[i].name) {
                            this.selectArr.splice(i, 1);
                        }
                    }
                }
            },
            delete_list(ev) {
                let index = ev.target.getAttribute('index');
                let closeName = this.selectArr[index].name;
                this.selectArr.splice(index, 1);

                let len = this.listArr.length;
                for (let i = 0; i < len; i++) {
                    if (closeName === this.listArr[i].name) {
                        let listname = document.getElementsByClassName('left_list');
                        listname[i].lastChild.className = 'noActive';
                    }
                }
            },
            deleteInList(item) {
                this.selectArr.splice(this.selectArr.indexOf(item), 1);
            },
            emptyAll() {
                this.selectArr = [];
                let listname = document.getElementsByClassName('left_list');
                let len = listname.length;
                for (var i = 0; i < len; i++) {
                    listname[i].lastChild.className = 'noActive';
                }
            },
            sure(ev) {
                if (ev.target.className === 'ensure') {
                    if (this.$store.state.status.connected === false) {
                        this.$toast({
                            message: '当前处于断网状态，转发失败！',
                            success: false
                        });
                        return;
                    } else {
                        this.$toast('转发成功!');
                    }
                    let msg = this.$store.state.status.forward.msg,
                        sessionArr = this.selectArr,
                        lastMsgContent = '';

                    if (msg.msgType === 1 || msg.msgtype === 1) {
                        lastMsgContent = msg.msgbody || msg.msgBody;
                        let str = window.getSelection().toString();
                        if (str) {
                            lastMsgContent = str;
                        }
                        sessionArr.forEach((item) => {
                            let session = JSON.parse(item);
                            if (session.module === 'channel') {
                                let message = {
                                    channelId: session.channelId,
                                    channelName: session.channelName,
                                    msgtype: 1,
                                    specialMsgType: 0,
                                    msgId: Math.uuid(),
                                    fromUid: this.myInfo.imId,
                                    fromName: this.myInfo.name,
                                    msgBody: lastMsgContent,
                                    senderId: this.myInfo.imId
                                };
                                this.$api.sendChannelMessageList([message]);
                                message.sendtime = Date.parse(new Date());
                                message.id = this.$store.state.myInfo.info.oaId;
                                message.status = 0;
                                this.$store.dispatch('addSentMsg', [message]);
                                if (this.$store.state.status.globalStatus === 'channel' && session.channelId === this.$store.state.status.currentChannelSession.ChannelId) {
                                    this.$nextTick(() => {
                                        var msgHeight = $('.channel-msg-list-wrapper').height();
                                        $('.channel-msg-list').scrollTop(msgHeight);
                                    });
                                }
                            } else {
                                let groupType = session.groupId.indexOf('_') === -1 ? 2 : 1;

                                let temp = lastMsgContent.replace(/&/g, '&amp;');
                                temp = temp.replace(/</g, '&lt;');
                                temp = temp.replace(/(\[[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]+\]?)/g, function(s, $1, index) {
                                    if (faces.indexOf(getFaceEng($1.replace('[', '').replace(']', ''))) !== -1) {
                                        return '<img class="input-face" src="../images/face/' + getFaceEng($1.replace('[', '').replace(']', '')) + '.png">';
                                    } else {
                                        return $1;
                                    }
                                });
                                let message = {
                                        draft: lastMsgContent,
                                        html: temp,
                                        msgBody: lastMsgContent,
                                        msgType: 1,
                                        groupId: session.groupId, // 类型string
                                        groupType: groupType
                                    },
                                    msgArr = [message];
                                msgArr.safe = true;
                                sendMsg(true, msgArr);
                            }
                        });
                    } else if (msg.msgType === 3 || msg.msgtype === 3) { // 图片
                        lastMsgContent = '[图片]';
                        sessionArr.forEach((item) => {
                            let session = JSON.parse(item);
                            if (session.module === 'channel') {
                                let message = {
                                    channelId: session.channelId,
                                    channelName: session.channelName,
                                    msgtype: 3,
                                    specialMsgType: 0,
                                    picPath: msg.picurl || msg.picPath,
                                    picwidth: msg.picwidth || msg.width,
                                    picheight: msg.picheight || msg.height,
                                    picsize: msg.picsize || 0,
                                    msgId: Math.uuid(),
                                    fromUid: this.myInfo.imId,
                                    fromName: this.myInfo.name,
                                    msgBody: msg.msgbody || msg.msgBody,
                                    senderId: this.myInfo.imId
                                };
                                this.$api.sendChannelMessageList([message]);
                                message.sendtime = Date.parse(new Date());
                                message.id = this.$store.state.myInfo.info.oaId;
                                message.status = 0;
                                this.$store.dispatch('addSentMsg', [message]);
                                if (this.$store.state.status.globalStatus === 'channel' && session.channelId === this.$store.state.status.currentChannelSession.ChannelId) {
                                    this.$nextTick(() => {
                                        var msgHeight = $('.channel-msg-list-wrapper').height();
                                        $('.channel-msg-list').scrollTop(msgHeight);
                                    });
                                }
                            } else {
                                let groupType = session.groupId.indexOf('_') === -1 ? 2 : 1;
                                let message = {
                                        draft: '',
                                        html: '',
                                        msgBody: '你收到一张图片',
                                        msgType: 3,
                                        groupId: session.groupId, // 类型string
                                        groupType: groupType,
                                        msgId: Math.uuid(),
                                        picwidth: msg.picwidth || msg.width,
                                        picheight: msg.picheight || msg.height,
                                        picsize: msg.picsize || 0,
                                        picPath: msg.picurl || msg.picPath
                                    },
                                    msgArr = [message];
                                msgArr.safe = true;
                                sendMsg(true, msgArr);
                            }
                        });
                    } else if (msg.msgType === 6 || msg.msgtype === 6) {
                        lastMsgContent = '[文件]';
                        sessionArr.forEach((item) => {
                            let session = JSON.parse(item);
                            if (session.module === 'channel') {
                                let message = {
                                    channelId: session.channelId,
                                    channelName: session.channelName,
                                    msgtype: 6,
                                    specialMsgType: 0,
                                    picPath: msg.picurl || msg.picPath,
                                    msgId: Math.uuid(),
                                    fromUid: this.myInfo.imId,
                                    fromName: this.myInfo.name,
                                    msgBody: msg.msgbody || msg.msgBody,
                                    senderId: this.myInfo.imId,
                                    filePath: msg.fname,
                                    fid: msg.fid,
                                    fpath: msg.fpath,
                                    fsize: msg.fsize,
                                    fname: msg.fname,
                                    FileStatus: 0
                                };
                                this.$api.sendChannelMessageList([message]);
                                message.sendtime = Date.parse(new Date());
                                message.id = this.$store.state.myInfo.info.oaId;
                                message.status = 0;
                                message.from = 2000000;
                                this.$store.dispatch('addSentMsg', [message]);
                                if (this.$store.state.status.globalStatus === 'channel' && session.channelId === this.$store.state.status.currentChannelSession.ChannelId) {
                                    this.$nextTick(() => {
                                        var msgHeight = $('.channel-msg-list-wrapper').height();
                                        $('.channel-msg-list').scrollTop(msgHeight);
                                    });
                                }
                            } else {
                                let groupType = session.groupId.indexOf('_') === -1 ? 2 : 1;
                                let message = {
                                        draft: '',
                                        html: '',
                                        msgBody: '你收到一个文件',
                                        msgType: 6,
                                        fileName: msg.fname,
                                        fileAllName: msg.fname,
                                        filePath: msg.filePath || msg.fname,
                                        safe: 'true',
                                        size: msg.fsize,
                                        groupId: session.groupId, // 类型string
                                        groupType: groupType,
                                        fid: msg.fid,
                                        fsize: msg.fsize,
                                        fname: msg.fname,
                                        FileStatus: msg.filePath ? 2 : 0,
                                        picPath: getFileThumbnailSrc(getFileType(msg.fname)),
                                        needToDownload: !msg.filePath
                                    },
                                    msgArr = [message];
                                msgArr.safe = true;
                                sendMsg(true, msgArr);
                            }
                        });
                    } else if (msg.msgType === 5 || msg.msgtype === 5) {
                        lastMsgContent = '[位置]';
                        sessionArr.forEach((item) => {
                            let session = JSON.parse(item);
                            if (session.module === 'channel') {
                                let message = {
                                    channelId: session.channelId,
                                    channelName: session.channelName,
                                    msgtype: 5,
                                    specialMsgType: 0,
                                    msgId: Math.uuid(),
                                    fromUid: this.myInfo.imId,
                                    fromName: this.myInfo.name,
                                    msgBody: msg.msgbody || msg.msgBody,
                                    senderId: this.myInfo.imId,
                                    LocaltionLongitude: msg.LocaltionLongitude,
                                    LocaltionLatitude: msg.LocaltionLatitude,
                                    LocaltionPicUrl: msg.LocaltionPicUrl.split('/').pop(),
                                    LocaltionContent: msg.LocaltionContent
                                };
                                console.log(_deepClone(message));
                                this.$api.sendChannelMessageList([message]);
                                message.LocaltionPicUrl = msg.LocaltionPicUrl;
                                message.sendtime = Date.parse(new Date());
                                message.id = this.$store.state.myInfo.info.oaId;
                                message.status = 0;
                                this.$store.dispatch('addSentMsg', [message]);
                                if (this.$store.state.status.globalStatus === 'channel' && session.channelId === this.$store.state.status.currentChannelSession.ChannelId) {
                                    this.$nextTick(() => {
                                        var msgHeight = $('.channel-msg-list-wrapper').height();
                                        $('.channel-msg-list').scrollTop(msgHeight);
                                    });
                                }
                            } else {
                                let groupType = session.groupId.indexOf('_') === -1 ? 2 : 1;
                                let message = {
                                        draft: msg.msgbody || msg.msgBody,
                                        html: msg.msgbody || msg.msgBody || '',
                                        msgBody: msg.msgbody || msg.msgBody,
                                        msgType: 5,
                                        groupId: session.groupId, // 类型string
                                        groupType: groupType,
                                        LocaltionLongitude: msg.LocaltionLongitude,
                                        LocaltionLatitude: msg.LocaltionLatitude,
                                        LocaltionPicUrl: msg.LocaltionPicUrl,
                                        LocaltionContent: msg.LocaltionContent
                                    },
                                    msgArr = [message];
                                msgArr.safe = true;
                                sendMsg(true, msgArr);
                            }
                        });
                    }
                    sessionArr.forEach(item => {
                        let session = JSON.parse(item);
                        if (session.module === 'channel') {
                            return;
                        }
                        if ($('#session-' + session.groupId).length > 0) {
                            return;
                        }
                        let groupType = session.groupId.indexOf('_') === -1 ? 2 : 1,
                            config;
                        if (groupType === 2) {
                            config = {
                                groupId: session.groupId,
                                groupName: session.groupName,
                                groupType: groupType,
                                lastMsgContent: lastMsgContent,
                                lastMsgTime: this.$util.formatMsgTime(Date.parse(new Date()))
                            };
                        } else {
                            config = {
                                groupId: session.groupId,
                                staffName: session.groupName,
                                groupType: groupType,
                                imid: session.imId,
                                id: session.oaId,
                                oaId: session.oaId,
                                deptName: session.deptName,
                                dutyName: session.dutyName,
                                lastMsgContent: lastMsgContent,
                                lastMsgTime: this.$util.formatMsgTime(Date.parse(new Date()))
                            };
                        }
                        newConversation(config, false);
                    });
                }
                this.hideComponent();
            }
        },
        components: { toast, SearchResult },
        watch: {
            isSearch() {
                if (this.isSearch === false) {
                    this.$nextTick(() => {
                        $('#forward-input').focus();
                    });
                }
            },
            forwardMsgId: {
                handler() {
//                    if (false) {
                    if (this.forwardInfo.show === true) {
                        this.$api.getLatelyContactList().then((data) => {
                            console.log('最近会话', data);
                            this.listArr = data.map((item) => {
                                if (item.ChannelId) {
                                    return {
                                        module: 'channel',
                                        channelId: item.ChannelId,
                                        channelName: item.ChannelName
                                    };
                                } else if (item.GroupId.indexOf('_') !== -1) {
                                    let idArr = item.GroupId.split('_');
                                    idArr.splice(idArr.indexOf(this.imUserId), 1);
                                    return {
                                        module: 'member',
                                        groupId: item.GroupId,
                                        groupName: item.MsgSendName,
                                        imId: parseInt(idArr[0]),
                                        oaId: parseInt(item.oaId),
                                        deptName: item.deptName,
                                        dutyName: item.dutyName
                                    };
                                } else {
                                    return {
                                        module: 'group',
                                        groupId: item.GroupId,
                                        groupName: item.GroupName
                                    };
                                }
                            }).reverse();
                        });
                    } else {
                        this.searchString = '';
                    }
                },
                deep: true
            }
        }
    };
</script>
<style rel="stylesheet/scss" type="text/css" scoped>
    ul li{
        list-style-type:none;
    }
    .clearFix:after{
        content: "";
        display: block;
        clear: both;
    }
    .clearFix{zoom:1;}
    .fl{float: left;}
    .fr{float: right;}
    .forwardMessage{
        box-sizing: border-box;
        width: 650px;
        height: 490px;
        padding: 21px 20px 0;
        background-color: #fff;
        -webkit-border-radius: 0 0 4px 4px;
        -moz-border-radius: 0 0 4px 4px;
        border-radius: 0 0 4px 4px;
        border: 1px solid #C3CAD4;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
        position: fixed;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 30001;
    }
    .choice,.show{
        width: 300px;
        height: 380px;
        overflow-y: auto;
        border: 1px solid rgba(0,0,0,0.10);
    }
    .choice{
        width: 258px;
        height: 360px;
        padding: 20px 20px 0;
        float: left;
    }
    .choice h6{
        margin-bottom: 10px;
        font-size: 14px;
        color: #4A4C5B;
    }
    .forward-search{
        height: 30px;
        line-height: 30px;
        border: 2px solid #fff;
        background-color: #f3f4f5;
        border-radius: 30px;
        padding-left: 10px;
        margin-bottom: 20px;
    }
    .forward-search i{
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        background: url(../../Commons/KsearchInput/glass.png);
        background-size: 100% 100%;
    }
    .forward-search-result, .forward-recent-session {
        width: 275px;
        height: 300px;
        overflow-y: auto;
    }
    .onblur{
        text-align: center;
    }
    .focus input {
        display: inline-block;
        vertical-align: middle;
        width: 210px;
        border:none;
        outline:none
    }
    .btn-group{
        margin-top: 29px;
        text-align: center;
    }
    .btn-group button{
        padding: 5px 21px;
        background-color: #fff;
        font-size: 14px;
        color: #4A4C5B;
        line-height:19px;
        border-radius: 4px;
        cursor: pointer;
        outline:none;
    }
    .btn-group .cancel {
        border: 1px solid #CCCCCC;
    }
    .btn-group .ensure{
        background: #3E89F7;
        color: #fff;
        margin-left: 15px;
    }
    .list{
        width: 100%;
        height: 40px;
        position: relative;
        margin: 5px 0;
    }
    .list span {
        display: inline-block;
    }
    .head-pic{
        width: 40px;
        height: 40px;
        background: red;
        border-radius: 5px;
        vertical-align: middle;
        float: left;
    }
    .name{
        height: 40px;
        color:#323232;
        font-size: 14px;
        vertical-align: middle;
        float:left;
        line-height: 40px;
        margin-left: 10px;
    }
    .list i{
        display: inline-block;
        width:14px;
        height: 14px;
        float: right;
        position: absolute;      /*  父元素需要相对定位,子元素绝对定位 */
        top: 50%;
        right: 0;
        margin-top:-7px ;
    }
    .list .noActive {
        background: url(./yuan.png);
        background-size: 100% 100%;
    }
    .Active{
        background: url(./right.png);
        background-size: 100% 100%;
    }
    .btn-group .disabled{
        background: rgba(62,137,247,0.20);
        border: none;
    }
    .forward-search-item .close {
        width:14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        font-size: 14px;
        color: #ccc;
        float: right;
        position: absolute;      /*  父元素需要相对定位,子元素绝对定位 */
        top: 50%;
        right: 0;
        margin-top:-7px ;

        background: url(./close.png);
        background-size: 100% 100%;
        cursor: pointer;
    }
    .show{
        padding: 10px 20px;
        box-sizing: border-box;
    }
    .selected{
        font-size: 12px;
        color: #4A4C5B;
        width: 24px;
        height: 30px;
        line-height: 30px;
    }
    .select_num{
        font-size: 14px;
        color: #4A4C5B;
        width: 28px;
        height: 30px;
        margin-left: 4px;
        line-height: 30px;
    }
    .empty{
        float: right;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
    }
    .empty i{
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: middle;
        background: url('../../../images/icon/清空／不可用@2x.png');
        background-size: 100% 100%;
    }
    .empty.active i {
        background: url('../../../images/icon/清空@2x.png');
        background-size: 100% 100%;
    }
    .empty span{
        font-size: 12px;
        color: #ccc;
        vertical-align: middle;
        margin-left: 2px;
    }
    .empty.active span {
        color: #aaa;
    }
    .empty.active:hover span {
        color: #4590e4;
    }
    .empty.active:hover i {
        background: url('../../../images/icon/清空－hover@2x.png');
        background-size: 100% 100%;
    }
    #forward-input {
        background-color: #f3f4f5;
    }
    .forward-search-list li {
        position: relative;
        height: 30px;
        line-height: 30px;
        padding: 10px 0 10px 70px;
    }
    .list-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 155px;
        display: inline-block;
    }
    .list-face {
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
    .forward-search-item {
        position: relative;
        width: 212px;
        height: 30px;
        line-height: 30px;
        padding: 10px 0 10px 50px;
    }
    .forward-recent-no-session {
        text-align: center;
        margin-top: 50px;
    }
    .forward-recent-no-session p {
        padding-top: 10px;
    }
    .forward-search-no-result {
        text-align: center;
        padding-top: 100px;
        font-size: 12px;
        color: #ccc;
    }
    .high-light {
        border: 2px solid rgba(62,137,247,0.50);
    }
</style>
