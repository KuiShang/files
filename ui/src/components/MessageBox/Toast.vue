<template>
    <transition name="fade" v-if="visible">
        <!--<div class="pop_warp">-->
            <div class="content" transition='fade'>
                <i :class="{ 'toast-success': success }"></i>
                <span>{{message}}</span>
            </div>
        <!--</div>-->
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                success: true,
                time: 2000,
                message: '发布失败，请稍后再试',
                timer: null
            };
        },
        methods: {
            showToast(config) {
                this.setConfig(config);
                console.log(this.success);
                this.visible = true;
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.hideToast();
                }, 2000);
            },
            hideToast() {
                this.visible = false;
            },
            setConfig(config) {
                this.message = config.message || '发布失败，请稍后再试';
                this.success = typeof (config.success) !== 'undefined' ? config.success : true;
                this.time = config.time || 2000;
            }
        }
    };
</script>
<style scoped>

    .pop_warp {
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
    }

    .content {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0 auto;
        padding: 6px 41px 8px 42px;
        background: rgba(0,0,0,0.60);
        border-radius: 3px;
        font-size: 12px;
        color: #FFFFFF;
    }
    .content i{
        display: inline-block;
        width: 12px;
        height: 12px;
        background-image: url('../../../images/icon/warning@2x.png');
        background-size: 12px 12px;
        vertical-align: middle;
    }
    .content .toast-success {
        background-image: url('../../../images/icon/成功复制@2x.png');
    }
    .content span{
        vertical-align: middle;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }


</style>
