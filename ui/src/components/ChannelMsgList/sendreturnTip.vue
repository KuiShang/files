<template lang="html">
    <div class="sendReturn  animatehide2">
        <p class="title">确认向"{{channelName()}}"回发此文件？</p>
        <div class="body">
          <!--  <img class="pic" src="../../../images/file/EXCEL40@2x.png">-->
            <img class="pic" :src="fimgsrc">
            <div class="content">
                <p class="filename"   @mouseenter="tooltipIn(msg.fname)" @mouseleave="tooltipOut">{{msg.fname}}</p>
                <p class="localtion"  @mouseenter="tooltipIn(msg.filePath)" @mouseleave="tooltipOut">位置：{{msg.filePath}}</p>
                <p class="time">修改时间：{{getDate()}}</p>
            </div>
        </div>
        <div class="btn">
            <span class="cancle" @click="cancle">取消</span>
            <span class="confirm" @click="confirm">确认</span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import tooltip from '../mixin/tooltips';
    export default{
        data() {
            return {
                fileThumbnailSrc: {
                    PDF: 'PDF',
                    PPT: 'PPT',
                    TXT: 'TXT',
                    WORD: 'WORD',
                    OTHER: 'other',
                    EXCEL: 'EXCEL',
                    Video: 'video',
                    Audio: 'sound'
                },
                fileThumbnail: {
                    PDF: ['pdf'],
                    PPT: ['ppt', 'pptx', 'ppsx'],
                    TXT: ['txt', 'pps'],
                    WORD: ['doc', 'docx', 'dotx'],
                    OTHER: ['vsd', 'pot', 'rtf', 'wps', 'et', 'dps', 'epub', 'potx', 'dot'],
                    EXCEL: ['xls', 'xlsx', 'xlt', 'xltx'],
                    Video: ['mp4', 'avi', 'rm', 'asf', 'wmv', 'mov', '3gp', 'rmvb', 'avs', 'flv', 'mkv', 'mpg', 'dat', 'ogm', 'vob', 'rm', 'ts', 'tp', 'ifo', 'nsv', 'm2ts', 'swf'],
                    Audio: ['wav', 'mp3', 'ra', 'rma', 'wma', 'ogg', 'ape', 'flac', 'acc', 'mpc', 'aac', 'au', 'aiff', 'ape', 'mod', 'asf', 'cda', 'mid', 'mka', 'mpa', 'ofr', 'wv', 'tta', 'ac3', 'dts']
                }
            };
        },
        props: ['msg'],
        mixins: [tooltip],
        computed: {
            ...mapGetters({
                showSendreturnTip: 'showSendreturnTip'
            }),
            currentSession() {
                return this.$store.state.status.currentChannelSession;
            },
            myInfo() {
                return this.$store.state.myInfo.info;
            },
            fimgsrc() {
                let fileType = this._getFileType(this.msg.fname);
                return `../images/file/${this._getFileThumbnailSrc(fileType)}40@2x.png`;
            }
        },
        methods: {
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
            getDate() {
                let date = new Date();
                return date.pattern('yyyy-MM-dd HH:mm:ss');
            },
            channelName() {
                let name = this.msg.channelname;
                return name.length > 13 ? name.substring(0, 13) + '...' : name;
            },
            cancle() {
                this.$emit('hideSendreturnTip');
            },
            confirm() {
                this.$emit('hideSendreturnTip');
                let sendArr = [];
                sendArr.push({
                    channelId: this.currentSession.ChannelId,
                    channelType: this.currentSession.type,
                    channelName: this.currentSession.ChannelName,
                    msgtype: this.msg.msgtype,
                    fromUid: this.myInfo.imId,
                    fromName: this.myInfo.name,
                    msgId: Math.uuid(),
                    specialMsgType: this.msg.specialMsgType,
                    msgBody: this.msg.msgbody,
                    picPath: this.msg.picPath,
                    filePath: this.msg.filePath,
                    from: 2000000,
                    fsize: this.msg.fsize,
                    fname: this.msg.fname,
                    FileStatus: 1,
                    senderId: this.myInfo.imId,
                    'extra_aite_im_ids': ''
                });
                this.$api.sendChannelMessageList(sendArr);
                sendArr.forEach((item) => {
                    item.sendtime = Date.parse(new Date());
                    item.id = this.$store.state.myInfo.info.oaId;
                    item.status = 0;
                    item.praiseCount = 0;
                    item.praiseUids = [];
                });
                console.log('-----------------------');
                console.log(sendArr);
                console.log(this.msg);
                this.$store.dispatch('addSentMsg', sendArr);
                this.$nextTick(() => {
                    var msgHeight = $('.channel-msg-list-wrapper').height();
                    $('.channel-msg-list').scrollTop(msgHeight);
                });
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.animatehide{
    opacity: 0;
    transform:scale(0);
}
.animateshow{
    opacity: 1;
    transform:scale(1);
}

 .sendReturn {
     width: 416px;
     height: 254px;
     background: #FFFFFF;
     border: 1px solid #999999;
     box-shadow: 0 0 10px 0 rgba(0,0,0,0.30);
     border-radius: 4px;
     position: absolute;
     z-index: 202;
     left:50%;
     top:50%;
     margin-left: -243px;
     margin-top: -127px;
     padding: 40px;
     box-sizing: border-box;
     transition: all .1s ease;
     .body{
         overflow: hidden;
         .pic {
             float: left;
             width: 56px;
             height: 56px;
             margin-top: 30px;
         }
         .content{
             float: left;
             margin-top: 30px;
             margin-left: 20px;
             width: 258px;
             box-sizing: border-box;
             .localtion, .filename{
                 white-space:nowrap;
                 text-overflow:ellipsis;
                 overflow:hidden;
                 span {
                     color: #999;
                 }
             }
             .time {
                 margin-top: 5px;
                 font-size: 12px;
                 color: #666666;
                 margin-top: 10px;
                 white-space:nowrap;
                 text-overflow:ellipsis;
                 overflow:hidden;
                 span {
                     color: #999;
                 }
             }
         }
     }
     .btn{
         position: absolute;
         bottom: 40px;
         left: 130px;
         text-align: center;
         span{
             width: 64px;
             height: 30px;
             border: 1px solid #CCCCCC;
             border-radius: 4px;
             display: inline-block;
             line-height: 30px;
             cursor: pointer;
         }
         .cancle{
             background: #FFFFFF;
             color: #999999;
         }
         .confirm{
             background: #4A4C5B;
             color: #FFFFFF;
             margin-left: 20px;
         }
     }
 }
</style>
