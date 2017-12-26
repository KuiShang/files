<template>
    <div class="praise-count"
         v-if="this.msg.isDelete !== 1 && this.msg.praiseCount > 0 || showOffAnimate || showOnAnimate"
         @click="handlePraise"
    >
        <span class="praise-animate praise-animate-on" v-show="showOnAnimate"></span>
        <span class="praise-animate praise-animate-off" v-show="showOffAnimate"></span>
        <img src="../../../images/icon/praise-sm.png" ref="image1" width="14" height="14" v-if="praised && !showOnAnimate">
        <img src="../../../images/icon/praise-sm-n.png" ref="image2" width="14" height="14" v-if="!praised && !showOffAnimate">
        <span class="fr praise-num" v-if="this.msg.praiseCount">{{this.msg.praiseCount}}</span>
    </div>
</template>

<script>
    export default {
        props: ['msg'],
        data() {
            return {
                timer: null,
                showOnAnimate: false,
                showOffAnimate: false
            };
        },
        computed: {
            praised() {
                let num = this.msg.praiseUids.length;
                while (num--) {
                    if (this.msg.praiseUids[num] === this.$store.state.myInfo.info.imUserId) {
                        return true;
                    }
                }
                return false;
            }
        },
        methods: {
            handlePraise() {
                this.handleAnimation();
                this.$api.thumbSupChannelMessage({
                    msgId: this.msg.msgId,
                    channelId: this.msg.channelId
                });
            },
            handleAnimation() {
                if (this.praised === false) {
                    clearTimeout(this.timer);
                    this.showOnAnimate = true;
                    this.showOffAnimate = false;
                    this.timer = setTimeout(() => {
                        this.showOnAnimate = false;
                    }, 300);
                } else {
                    clearTimeout(this.timer);
                    this.showOnAnimate = false;
                    this.showOffAnimate = true;
                    this.timer = setTimeout(() => {
                        this.showOffAnimate = false;
                    }, 300);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .praise-count {
        position: relative;
        font-size: 12px;
        margin: 4px 10px -5px;
        vertical-align: middle;
        cursor: pointer;
        min-width: 29px;
        height: 17px;
        img {
            user-select: none;
            margin-right: 4px;
        }
        span {
            margin-right: 4px;
        }
    }
    .list-left .praise-count{
        float: left;
    }
    .list-right .praise-count{
        float: right;
    }
    .praise-animate {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 0px;
        left: -2px;
        overflow: hidden;
    }
    .praise-animate-on {
        display: block;
        background: url('../../../images/icon/点赞动画.png') 0 0 no-repeat;
        background-size: 500%;
        animation: animate steps(4) 0.3s infinite both;
    }
    .praise-animate-off {
        display: block;
        background: url('../../../images/icon/取消点赞动画.png') 0 0 no-repeat;
        background-size: 500%;
        animation: animate steps(4) 0.3s infinite both;
    }
    @keyframes animate {
        0% {
            background-position: 0%;
        }
        100% {
            background-position: 100%;
        }
    }
    .praise-num {
        position: absolute;
        left: 18px;
    }
</style>
