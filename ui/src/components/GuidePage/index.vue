<template>
    <div class="guide-page" v-if="show">
        <div class="page-guide-wrapper">
            <img src="./频道引导背景@2x.png" class="guide-page-image">
            <div class="guide-page-dialog">
                <div class="page-guide-close iconn-11" @click="closeGuidePage"></div>
                <div v-if="leftShow" class="guide-page-msg-left list-left" :class="{'guide-page-msg-left-animation': leftShow}">
                    <div class="list-name">问</div>
                    <div class="msg-list-content clearfix">
                        <div class="list-full-name">问先生</div>
                        <div class="list-text">
                            <p>咦，这是什么？</p>
                        </div>
                    </div>
                </div>
                <div v-if="rightShow" class="guide-page-msg-right list-right" :class="{'guide-page-msg-right-animation': rightShow}">
                    <div class="list-name">答</div>
                    <div class="msg-list-content clearfix">
                        <div class="list-text">
                            <p>这是频道，专为企业场景量身设计的新型多人沟通及协作方式哦～</p>
                        </div>
                        <div class="guide-loading" v-if="loadingShow">
                            <img src="../../../images/public/loading.gif" width="28" height="8">
                        </div>
                    </div>
                </div>
                <a @click="openURL" v-if="btnShow" class="page-guide-btn" :class="{'page-guide-btn-animation': btnShow}">
                    了解更多
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                leftShow: false,
                rightShow: false,
                btnShow: false,
                loadingShow: true,
                show: false,
                url: ''
            };
        },
        methods: {
            closeGuidePage() {
                this.show = false;
            },
            openURL() {
                this.$api.openURL(this.url);
            }
        },
        mounted() {
            setTimeout(() => {
                this.$api.isShowNavigation().then(({status, environment}) => {
                    this.$store.state.status.environment = environment;
                    if (status === 1) {
                        this.show = true;
                        setTimeout(() => {
                            this.leftShow = true;
                        }, 2000);
                        setTimeout(() => {
                            this.rightShow = true;
                            setTimeout(() => {
                                this.loadingShow = false;
                            }, 2000);
                        }, 3000);
                        setTimeout(() => {
                            this.btnShow = true;
                        }, 5000);
                    }
                    if (/macintosh|mac os x/i.test(navigator.userAgent)) {
                        if (environment === 'pro') {
                            this.url = 'https://work.gomeplus.com/statics/detail/mac-1.1.0.html';
                        } else if (environment === 'pre') {
                            this.url = 'https://work.pre.gomeplus.com/statics/detail/mac-1.1.0.html';
                        }
                    } else {
                        if (environment === 'pro') {
                            this.url = 'https://work.gomeplus.com/statics/detail/windows-v1.2.0.html';
                        } else if (environment === 'pre') {
                            this.url = 'https://work.pre.gomeplus.com/statics/detail/windows-v1.2.0.html';
                        }
                    }
                });
            }, 0);
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .guide-page {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .7);
        z-index: 20000;

        .msg-list-content {
            padding-top: 0;
        }
    }
    .guide-page-image {
        position: absolute;
        width: 900px;
        height: 600px;
        animation: btnOpacity 1s linear 1;
    }
    .guide-page-dialog {
        position: absolute;
        left: 157px;
        top: 104px;
        width: 392px;
        height: 273px;
        box-sizing: border-box;
        padding: 30px;
        overflow: hidden;
        animation: btnOpacity 1s linear 1;
    }
    .page-guide-btn {
        display: block;
        width: 90px;
        height: 30px;
        border: 2px solid #4A4C5B;
        color: #4A4C5B;
        text-align: center;
        line-height: 26px;
        border-radius: 5px;
        box-sizing: border-box;
        cursor: pointer;
        margin-top: 30px;
        margin-left: 121px;
    }
    .page-guide-btn:hover {
        border: 2px solid #4590e4;
        color: #4590e4;
    }
    .page-guide-close {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 30px;
        top: 30px;
        font-size: 16px;
        color: #cdcdcd;
        cursor: pointer;
        z-index: 2;
        &:hover {
            color: #aaa;
        }
    }
    .guide-loading {
        padding-top: 25px;
        padding-left: 5px;
    }
    .guide-page-msg-left .list-name {
        font-size: 14px;
        background-color: #C280D3;
    }
    .guide-page-msg-left .list-full-name {
        color: #999;
    }
    .guide-page-msg-right .list-name {
        font-size: 14px;
        background-color: #F693BF;
    }
    .guide-page-msg-right .list-text {
        max-width: 77%;
    }
    .guide-page-msg-left-animation {
        left: 0;
        animation: btnOpacity .5s linear 1;
    }
    .guide-page-msg-right-animation {
        right: 0;
        animation: btnOpacity .5s linear 1;
    }
    .page-guide-btn-animation {
        animation: btnOpacity .5s linear 1;
    }
    @keyframes slideLeft {
        0% {
            left: -300px;
        }
        100% {
            left: 0;
        }
    }
    @keyframes slideRight {
        0% {
            right: -300px;
        }
        100% {
            right: 0;
        }
    }
    @keyframes btnOpacity {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
