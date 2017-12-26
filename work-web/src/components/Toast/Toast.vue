<template>
    <transition name="fade" v-if="visible">
        <div class="content" :class="{ 'toast-success': success }" transition='fade'>
            <span>{{message}}</span>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                success: true,
                time: 2000,
                message: '',
                timer: null
            };
        },
        methods: {
            showToast(config) {
                this.setConfig(config)
                console.log(this.success)
                this.visible = true
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    this.hideToast();
                }, 2000);
            },
            hideToast() {
                this.visible = false
            },
            setConfig(config) {
                this.message = config.message || 'SUCESS'
                this.success = typeof (config.success) !== 'undefined' ? config.success : true
                this.time = config.time || 2000
            }
        }
    };
</script>
<style scoped>
    .content {
        min-width: 299px;
        height: 58px;
        line-height: 58px;
        border-radius: 3px;
        font-size: 16px;
        text-align: center;
        position: fixed;
        z-index: 99999;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.5s;
        margin: 0 auto;
        background-color: #f41a34;
        color: #FFFFFF;
    }
    .content.toast-success {
        background-color: #5c5c5c;
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
