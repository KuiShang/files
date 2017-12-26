/**
 * Created by lixiaohu on 2017/6/14.
 */

let API = {
    getChannels: function(flag) {
        flag = flag || 0;
        console.log('getChannels', flag);
        window.mainObject.getChannelListInfo(flag);
    },
    // 获取频道历史消息
    getChannelMsgList: function(conf) {
        var config = {
            sendTime: conf.sendTime,
            channelId: conf.channelId,
            msgSeqId: conf.msgSeqId,
            pageSize: 20,
            upOrDown: conf.upOrDown
        };
        window.mainObject.getChannelMsgList(config);
    },
    // 发送频道消息
    sendChannelMessageList: function(sendArr) {
        window.mainObject.sendChannelMessageList(sendArr);
    },
    // 选择图片
    OpenFileDialog: function() {
        window.mainObject.OpenFileDialog();
    },
    // 选择文件
    selectFiles: function() {
        window.qFileTransferObj.selectFiles();
    },
    // 截图
    printScreen: function() {
        window.publicObject.loadScreenShot();
    },
    // 个人详情弹窗
    showMemberInfo: function(imId, staffName = '') {
        window.mainObject.showMemberInfo(2, imId, staffName);
    },
    // 地图弹窗
    showMap: function(x, y, positionName) {
        window.publicObject.showGeneralDlg(104);
        window.publicObject.initGeneralDlg({'GeneralDlgId': 104, 'x': x, 'y': y, 'positionName': positionName});
    },
    // 播放语音
    playSound: function(channelId, msgId, attachUrl) {
        window.mainObject.PlayVoiceMsg(channelId, msgId, attachUrl);
    },
    // 停止语音
    stopSound: function(channelId, msgId) {
        window.mainObject.StopVoiceMsg(channelId, msgId);
    },
    // 预览图片
    showPic: function(config) {
        console.log(config);
        window.mainObject.StartViewPic(config);
    },
    // 获取生成的图片
    getPicturePromise: function(text) {
        let dpr = window.devicePixelRatio;
        return new Promise(function(resolve) {
            window.publicObject.convertNameToPicture(text, dpr, function(obj) {
                resolve(obj);
            });
        });
    },
    // 获取频道特殊消息
    getChannelSpecialMsg: function(channelId) {
        window.mainObject.getChannelSpecialMsg(channelId);
    },
    // 点赞
    thumbSupChannelMessage: function(config) {
        window.mainObject.thumbSupChannelMessage(config);
    },
    // 上报已读
    submitReadSeqId: function(config) {
        window.mainObject.submitReadSeqId(config);
    },
    readedSeqIDReport: function(groupId, msgSeqId) {
        window.mainObject.readedSeqIDReport(groupId, msgSeqId);
    },
    // 获取at列表
    getChannelAtMembers: function(channelId, searchString) {
        return new Promise(function(resolve) {
            window.mainObject.searchChannelMemberWhenAT(channelId, searchString, function(data) {
                resolve(data);
            });
        });
    },

    // 删除消息
    deleteChannelMessage: function(config) {
        window.mainObject.deleteChannelMessage(config);
    },

    // 修改频道公告
    changeNotice: function(channelId, draft) {
        window.mainObject.ModifyChannelNotice(channelId, draft);
    },
    // 修改频道说明
    changeInstruction: function(channelId, draft) {
        window.mainObject.ModifyChannelDesc(channelId, draft);
    },

    // 频道成员
    getChannelMembers: function(channelId) {
        window.mainObject.getChannelMembers(channelId);
    },

    // 频道新消息提醒设置
    ModifyNewMsgRemindConfig: function(channelId, code) {
        window.mainObject.ModifyNewMsgRemindConfig(channelId, code);
    },
    // 频道接受普通消息设置
    ModifyReceiveCommonMsgConfig: function(channelId, code) {
        window.mainObject.ModifyReceiveCommonMsgConfig(channelId, code);
    },
    // 取消上传 或下载 接口
    cannelUpDownloadfile: function(obj) {
        window.mainObject.cannelUpDownloadfile(obj);
    },

    // 下载 接口
    downloadChannelFile: function(obj) {
        return new Promise(resolve => {
            window.mainObject.downloadChannelFile(obj, flag => resolve(flag));
        });
    },
    // 预览文件 接口
    preveiwFile: function(cid, msgid, path) {
        window.qFileTransferObj.channelPreveiwFile(cid, msgid, path);
    },
    // 在文件夹中显示
    openInfile: function(path) {
        window.qFileTransferObj.openDirOfFile(path);
    },
    // 获取文件md5
    getFileMd5: function(path, cb) {
        window.publicObject.getFileMd5(path, md5 => cb(md5));
    },
    // 图片另存为
    saveImageToLocal: function(path) {
        window.qFileTransferObj.saveImageToLocal(path);
    },
    // 文件是否存在
    isFileExist: function(path) {
        return new Promise(resolve => {
            window.qFileTransferObj.isFileExist(path, flag => {
                resolve(flag);
            });
        });
    },
    // 显示弹窗
    SetTip: function(msg = '', cb) {
        let timer = setTimeout(function() {
            publicObject.setTip(msg);
        }, 800);
        cb(timer);
    },
    // 隐藏弹窗
    HideTip: function(timer) {
        timer && window.clearTimeout(timer);
        publicObject.hideTip();
    },

    // 加载特殊定位
    getChannelSpecialMsgList: function(config) {
        console.log(config);
        window.mainObject.getChannelMsgList(config);
    },
    // 获取最近的会话列表（转发用）
    getLatelyContactList: function() {
        return new Promise((resolve) => {
            window.mainObject.getLatelyContactList((data) => {
                resolve(data);
            });
        });
    },
    // 获取回执消息已读未读列表
    getChannelOrUnReadAsync: function(config) {
        // console.log('getChannelOrUnReadAsync', config);
        window.mainObject.getChannelOrUnReadAsync(config);
    },
    // 向下加载消息
    reloadDownChannelMsg: function(config) {
        console.log('向下加载config', config);
        window.mainObject.getChannelMsgList(config);
    },
    // 特殊消息已读
    sendReadChannelMsgReport: function(data) {
        // console.log('回执上报已读', data);
        window.mainObject.sendReadChannelMsgReport(data);
    },
    // 设置频道未读数
    setMacBadge: function(num, flag) {
        window.mainObject.setMacBadge(num, flag);
    },
    // 双击全屏--奇葩的调用方式
    forDbclickEnter: function() {
        window.mainObject.enter_topbar();
    },
    // 双击全屏--奇葩的调用方式
    forDbclickOut: function() {
        window.mainObject.leave_topbar();
    },
    // 设置当前频道回话
    setMsgReaded: function(id, flag) {
        mainObject.setMsgReaded(id, flag);
    },
    // tooltip show
    setTip: function(str) {
        window.publicObject.setTip(str);
    },
    // tooltip hide
    hideTip: function() {
        window.publicObject.hideTip();
    },
    // 搜索频道
    searchChannels: function(s, start, length) {
        return new Promise((resolve) => {
            window.mainObject.searchChannelName(s, start, length, (data) => {
                console.log(data);
                resolve(data);
            });
        });
    },
    // 搜索群组
    searchGroups: function(s, start, length) {
        return new Promise((resolve) => {
            window.mainObject.searchGroupName(s, start, length, (data) => {
                console.log(data);
                resolve(data);
            });
        });
    },
    // 搜索用户
    searchMembers: function(s, start, length) {
        return new Promise(resolve => {
            window.mainObject.searchAddressBook(s, start, length, data => {
                resolve(data);
            });
        });
    },
    // 置顶
    channelTop: function(channelId, topFlag) {
        window.mainObject.ChannelTop(channelId, topFlag);
    },
    // 打开链接
    openURL: function(url) {
        window.publicObject.openUrl(0, url);
    },
    // 判断是否第一次打开
    isShowNavigation: function() {
        return new Promise(resolve => {
            window.publicObject.isShowNavigation(function(data) {
                resolve(data);
            });
        });
    },
    // 下载手机版
    openPhoneDownLoad: function() {
        window.mainObject.showDownloadPhoneVersionDlg();
    },
    // 上报未读数
    messageBoxUnreadMsgSet: function(data) {
        window.mainObject.messageBoxUnreadMsgSet(data);
    },
    // 设置当前活动的session
    setCurrentSessionId: function(id) {
        window.mainObject.setCurrentSessionId(id);
    },
    // 搜索频道成员for修改频道管理员
    searchChannelMembers: async function(channelID, query, page, pageSize) {
        return new Promise((resolve) => {
            window.mainObject.searchChannelMember(channelID, query, page, pageSize, (data) => {
                resolve(data);
            });
        });
    },
    // 修改频道管理员
    transferChannelAdmin: function(channelID, id) {
        window.mainObject.transferChannelAdmin(channelID, id);
    }
};

export default API;
