<template>
    <div class="clearfix kkmsg" :class="{ kkright: isMyMsg}">
        <div class="list-text image-msg">
            <p @click="showPic">
                <img :src="msg.picurl || msg.picPath" :width="this.width" :height="this.height" style="max-width:150px;max-height:150px;">
            </p><slot></slot>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['msg', 'isMyMsg'],
        data() {
            return {
                width: this.msg.picwidth,
                height: this.msg.picheight
            };
        },
        methods: {
            showPic() {
                let config;
                if (this.msg.picPath) {
                    config = {
                        channelId: this.msg.channelId,
                        msgId: this.msg.msgId,
                        sendPicPath: this.msg.picPath
                    };
                } else {
                    config = {
                        channelId: this.msg.channelId,
                        msgId: this.msg.msgId,
                        attachUrl: this.msg.attachUrl
                    };
                }
                this.$api.showPic(config);
            }
        },
        created() {
            if (this.width > this.height && this.width > 150) {
                this.height = this.height / this.width * 150;
                this.width = 150;
            } else if (this.height > this.width && this.height > 150) {
                this.width = this.width / this.height * 150;
                this.height = 150;
            }
        },
        watch: {
            msg: {
                handler() {
                    if (this.msg.picwidth > this.msg.picheight && this.msg.picwidth > 150) {
                        this.height = this.msg.picheight / this.msg.picwidth * 150;
                        this.width = 150;
                    } else if (this.msg.picheight > this.msg.picwidth && this.msg.picheight > 150) {
                        this.width = this.msg.picwidth / this.msg.picheight * 150;
                        this.height = 150;
                    }
                },
                deep: true
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
    .image-msg img {
        cursor: pointer;
    }
</style>
