<template>
    <div class="clearfix kkmsg" :class="{ kkright: isMyMsg}">
    <div class="file-msg list-text file-wrapper padding-0 on " :class="fileBgColor" @click="changeState">
        <div class="content clearfix">
            <div class="file-class">
                <img :src="fimgsrc" alt="">
                <div class="shadow">
                    <canvas class="canvas" width="56" height="56"  ref="canvas">不支持canvas</canvas>
                </div>
                <div class="prompt-content file-pause" v-if="currentState === 4">已暂停</div>
                <div class="prompt-content file-deleted"  v-if="currentState === 101">已删除</div>
            </div>
            <p><span id="file-title"  @mouseenter="tooltipIn(msg.fname)" @mouseleave="tooltipOut">{{msg.fname}}</span></p>
        </div>
        <div class="down">
            <span class="data-size">{{$util.bytesToSize(msg.fsize)}}</span>
            <span class="data-from">{{sourceFromObj[from]}}</span>
        </div>
        <div class="icon-wrapper">
            <em :class="iconwraper"></em>
        </div>
    </div>
    </div>
</template>

<script>
    import tooltip from '../mixin/tooltips';
    export default {
        props: ['msg', 'isMyMsg'],
        mixins: [tooltip],
        data() {
            return {
                sourceFromObj: {
                    '0': 'Aeromind移动端', // android
                    '1': 'Aeromind移动端', // ios
                    '2': 'Aeromind桌面端'
                },
                fileThumbnailSrc: {
                    PDF: 'PDF',
                    PPT: 'PPT',
                    TXT: 'TXT',
                    WORD: 'WORD',
                    OTHER: 'other',
                    EXCEL: 'EXCEL',
                    Video: 'video',
                    Audio: 'sound',
                    VSD: 'vsd',
                    RAR: 'rar',
                    ZIP: 'zip'
                },
                fileThumbnail: {
                    PDF: ['pdf'],
                    PPT: ['ppt', 'pptx', 'ppsx'],
                    TXT: ['txt', 'pps'],
                    WORD: ['doc', 'docx', 'dotx'],
                    OTHER: ['pot', 'rtf', 'wps', 'et', 'dps', 'epub', 'potx', 'dot'],
                    EXCEL: ['xls', 'xlsx', 'xlt', 'xltx'],
                    Video: ['mp4', 'avi', 'rm', 'asf', 'wmv', 'mov', '3gp', 'rmvb', 'avs', 'flv', 'mkv', 'mpg', 'dat', 'ogm', 'vob', 'rm', 'ts', 'tp', 'ifo', 'nsv', 'm2ts', 'swf'],
                    Audio: ['wav', 'mp3', 'ra', 'rma', 'wma', 'ogg', 'ape', 'flac', 'acc', 'mpc', 'aac', 'au', 'aiff', 'ape', 'mod', 'asf', 'cda', 'mid', 'mka', 'mpa', 'ofr', 'wv', 'tta', 'ac3', 'dts'],
                    VSD: ['vsd'],
                    RAR: ['rar'],
                    ZIP: ['zip']
                },
                fileBgColorClassNameObj: {
                    PDF: 'pdf-bac-color',
                    TXT: 'txt-bac-color',
                    PPT: 'ppt-bac-color',
                    EXCEL: 'excel-bac-color',
                    OTHER: 'other-bac-color',
                    WORD: 'doc-bac-color',
                    Video: 'video-bac-color',
                    Audio: 'audio-bac-color',
                    VSD: 'vsd-bac-color on ',
                    RAR: 'rar-bac-color on ',
                    ZIP: 'zip-bac-color on '
                },
                sendObj: {
                    // buyinggaichuxian
                    '0': {
                        statenName: '复制的文件在发送，需要下载',
                        stateIcon: 'iconn-icon-download',
                        action: () => {
                            this.currentObj = this.receiveObj;
                            console.log(this.msg);
                            this.msg.FileStatus = 1;
                            let fileType = this.msg.msgtype;
                            let channelId = this.msg.channelId;
                            let msgId = this.msg.msgId;
                            let url = this.msg.fpath;
                            let fileName = this.msg.fname;
                            let tempobj = {
                                fileType,
                                channelId,
                                msgId,
                                url,
                                fileName
                            };
                            this.$api.downloadChannelFile(tempobj);
                            console.log('未下载->下载');
                            console.log(tempobj);
                        }
                    },
                    // 上传中
                    '1': {
                        statenName: '上传中',
                        stateIcon: 'iconn-icon-stop',
                        action: () => {
                            console.log('上传中->暂停');
                            this.msg.FileStatus = 4;
                            let channelId = this.msg.channelId;
                            let msgId = this.msg.msgId;
                            this.$api.cannelUpDownloadfile({
                                channelId,
                                msgId
                            });
                        }
                    },
                    // 上传完成
                    '2': {
                        statenName: '上传完成',
                        stateIcon: '',
                        action: () => {
                            console.log('上传完成');
                            let msg = this.msg;
                            let channelId = msg.channelId;
                            let msgId = msg.msgId;
                            let filePath = msg.filePath;
                            this.$api.preveiwFile(channelId, msgId, filePath);
                        }
                    },
                    // 暂停
                    '4': {
                        statenName: '上传暂停',
                        stateIcon: 'iconn-icon-upload',
                        action: () => {
                            this.msg.FileStatus = 1;
                            console.log('上传暂停-》上传中');
                            this.$api.sendChannelMessageList([this.msg]);
                        }
                    },
                    // 失败
                    '100': {
                        statenName: '上传失败',
                        stateIcon: 'iconn-34',
                        action: () => {
                            this.msg.FileStatus = 1;
                            console.log('上传失败-》上传中');
                            this.$api.sendChannelMessageList([this.msg]);
                        }
                    },
                     // 失败
                    '101': {
                        statenName: '已经删除',
                        stateIcon: '',
                        action: () => {
                            console.log('已经删除');
                        }
                    }
                },
                receiveObj: {
                    // 未下载
                    '0': {
                        statenName: '未下载',
                        stateIcon: 'iconn-icon-download',
                        action: () => {
                            console.log(this.msg);
                            this.msg.FileStatus = 1;
                            let fileType = this.msg.msgtype;
                            let channelId = this.msg.channelId;
                            let msgId = this.msg.msgId;
                            let url = this.msg.fpath;
                            let fileName = this.msg.fname;
                            let tempobj = {
                                fileType,
                                channelId,
                                msgId,
                                url,
                                fileName
                            };
                            this.$api.downloadChannelFile(tempobj);
                            console.log('未下载->下载');
                            console.log(tempobj);
                        }
                    },
                    // 下载中
                    '1': {
                        statenName: '下载中',
                        stateIcon: 'iconn-icon-stop',
                        action: () => {
                            console.log('下载中->暂停');
                            this.msg.FileStatus = 4;
                            let channelId = this.msg.channelId;
                            let msgId = this.msg.msgId;
                            this.$api.cannelUpDownloadfile({
                                channelId,
                                msgId
                            });
                        }
                    },
                    // 下载完成
                    '2': {
                        statenName: '下载完成',
                        stateIcon: '',
                        action: () => {
                            console.log('下载finish');
                            let msg = this.msg;
                            let channelId = msg.channelId;
                            let msgId = msg.msgId;
                            let filePath = msg.filePath;
                            this.$api.preveiwFile(channelId, msgId, filePath);
                        }
                    },
                    // 暂停
                    '4': {
                        statenName: '下载暂停',
                        stateIcon: 'iconn-icon-download',
                        action: () => {
                            this.msg.FileStatus = 1;
                            let fileType = this.msg.msgtype;
                            let channelId = this.msg.channelId;
                            let msgId = this.msg.msgId;
                            let url = this.msg.fpath;
                            let tempobj = {
                                fileType,
                                channelId,
                                msgId,
                                url
                            };
                            this.$api.downloadChannelFile(tempobj);
                            console.log('下载暂停->下载');
                        }
                    },
                    // 失败
                    '100': {
                        statenName: '下载失败',
                        stateIcon: 'iconn-34',
                        action: () => {
                            this.msg.FileStatus = 1;
                            let fileType = this.msg.msgtype;
                            let channelId = this.msg.channelId;
                            let msgId = this.msg.msgId;
                            let url = this.msg.fpath;
                            let fileName = this.msg.fname;
                            let tempobj = {
                                fileType,
                                channelId,
                                msgId,
                                url,
                                fileName
                            };
                            this.$api.downloadChannelFile(tempobj);
                            console.log('下载失败->下载');
                        }
                    },
                    // 失败
                    '101': {
                        statenName: '已经删除',
                        stateIcon: '',
                        action: () => {
                            console.log('已经删除');
                        }
                    }
                },
                currentObj: {}
            };
        },
        computed: {
            myInfo() {
                return this.$store.state.myInfo.info;
            },
            from() {
                return parseInt(this.msg.from / 1000000);
            },
            fimgsrc() {
                let fileType = this._getFileType(this.msg.fname);
                return `../images/file/${this._getFileThumbnailSrc(fileType)}56@2x.png`;
            },
            fileBgColor() {
                let fileType = this._getFileType(this.msg.fname);
                return this._getFileBgColorClassName(fileType);
            },
            iconwraper() {
                return this.currentObj[this.msg.FileStatus] && this.currentObj[this.msg.FileStatus].stateIcon;
            },
            percent() {
                return this.msg.percent;
            },
            ctx() {
                return this.$refs.canvas.getContext('2d');
            },
            currentState() {
                return parseInt(this.msg.FileStatus);
            }
        },
        created() {
            // 补充： 此处FileStatus只是自己发送消息时候自己组装上的并且为1，其他一律情况都需要下载
//            this.currentState = parseInt(this.msg.FileStatus);
            this.$set(this.msg, 'percent', 0);
            let state = parseInt(this.msg.FileStatus);
            if (state === 1) {
                this.currentObj = this.sendObj;
            } else {
                this.currentObj = this.receiveObj;
            }
        },
        methods: {
            changeState() {
                console.log('changestate--');
                let key = this.currentState;
                this.currentObj[key].action();
            },
            _getFileType(str = '') {
                /* eslint-disable */
                let d=/\.([^\.]+$)/.exec(str);
                return d ? d[1] : '';
            },
            _getFileThumbnailSrc(fileType) {
                let type = fileType.toLowerCase();
                for (let key in this.fileThumbnail) {
                    if (this.fileThumbnail[key].includes(type)) {
                        return this.fileThumbnailSrc[key];
                    }
                }
                return this.fileThumbnailSrc['OTHER'];
            },
            _getFileBgColorClassName(fileType) {
                let type = fileType.toLowerCase();
                for (let key in this.fileThumbnail) {
                    if (this.fileThumbnail[key].includes(type)) {
                        return this.fileBgColorClassNameObj[key];
                    }
                }
                return this.fileBgColorClassNameObj['OTHER'];
            }
        },
        watch: {
            percent(data) {
                if(data === 0) {
                    return;
                }
                if(typeof(data) === "undefined") {
                    return;
                }
                this.ctx.sector(56 / 2, 56 / 2, 56, 'rgba(0, 0, 0, 0.2)', 0, Math.PI * 2 * data, true).fill();
                if(data === 1) {
                    this.ctx.clearRect(0, 0, 56, 56);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .file-content {
        padding: 10px;

    }
    .file-msg {
        user-select: none;
        width: 240px;
        height: 108px;
        box-sizing: border-box;
        p {
            float: left;
            margin-left: 10px;
            #file-title {
                font-style:normal;
                float: none;
            }
        }

    }
    .file-img {
        float: left;
        width: 56px;
        height: 56px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .file-bottom {
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        background-color: #fff;
    }



    .kkmsg {
        display: flex;
        justify-content: flex-start;

    }
    .kkright {
        justify-content: flex-end;
    }
    .list-text {
        float: none !important;
    }
</style>
