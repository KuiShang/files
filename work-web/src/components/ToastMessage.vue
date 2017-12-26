<template>
    <div class="toast-content" v-show="toastState">
        <div class="message-content">
            <p class="message" ref="message" v-text="message"></p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'toastMesage',
    data() {
        return {
            toastState: false
        }
    },
    props: {
        message: {
            type: String,
            default: '^_^'
        },
        bgColor: {
            type: String,
            default: 'rgb(92, 92, 92)'
        }
    },
    mounted() {
        this.$refs.message.style.backgroundColor = this.bgColor
    },
    methods: {
        changeToastState(){
            this.toastState = true
            setTimeout(()=>{
                this.toastState = false
            },1000)
        }
    }
}
</script>

<style lang="scss" scoped>
    .toast-content{
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 12345;
        //background-color: rgba(0,0,0,.5);//弹层大背景颜色

        .message-content{
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            text-align: center;

            .message{
                display: inline-block;
                padding: 0 15px;
                line-height: 58px;
                border-radius: 3px;
                font-size: 16px;
                color: #fff;
                opacity: 1;
                -webkit-transition: all 0.5s;
                transition: all 0.5s;
                -webkit-animation: disappear 1s linear 1s;
                animation: disappear 1s linear 1s;
            }
        }
    }
</style>
