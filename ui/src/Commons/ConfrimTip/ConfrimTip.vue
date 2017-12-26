<template lang="html">
    <transition name="fade">
        <div class="toast-container">
            <div class="toast"
                 :class="{width392: (width == 392)}"
            >
                <p class="toast-title">{{confirmText}}</p>
                <div class="btn">
                    <span class="cancle" @click="cancel">取消</span>
                    <span class="confirm" @click="tipConfirm">确定</span>
                </div>
            </div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default{
        name: 'confirmTip',
        props: ['confirmText', 'width'],
        methods: {
            tipConfirm() {
                this.$emit('tipConfirm');
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .fade-enter-active {
        transition: all .3s ease; }

    .fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); }

    .fade-enter, .fade-leave-active {
        transform: translateY(10px);
        opacity: 0;
    }
    .toast-container{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
        display: flex;
        justify-content: center;
        align-items: center;

        .toast{
            background: #FFFFFF;
            border: 1px solid #999999;
            box-shadow: 0 0 10px 0 rgba(0,0,0,0.30);
            border-radius: 4px;
            width: 328px;
            height: 156px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            .toast-title{
                margin-bottom: 30px;
                font-size: 12px;
                color: #323232;
                max-width: 390px;
                text-overflow: ellipsis;
                white-space:nowrap;
            }
            .btn{

            }
            span{
                border-radius: 4px;
                font-size: 12px;
                line-height: 30px;
                width: 64px;
                height: 30px;
                display: inline-block;
                cursor: pointer;
                text-align: center;
            }
            .cancle{
                background: #FFFFFF;
                border: 1px solid #CCCCCC;
                color: #999999;
            }
            .confirm{
                background: #4A4C5B;
                color: #FFFFFF;
                margin-left: 20px;
            }

        }
        .width392 {
            width: 392px;
        }
    }
</style>
