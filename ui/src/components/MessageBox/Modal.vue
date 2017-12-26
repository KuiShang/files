<template>
    <transition name="fade">
        <div class="modal-container"  v-if="visible">
            <div class="modal">
                <p class="toast-title">{{message}}</p>
                <div class="btn">
                    <span class="cancel" @click="closeModal">{{cancelText}}</span>
                    <span class="confirm" @click="modalConfirm">{{confirmText}}</span>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        data() {
            return {
                visible: false,
                confirmText: '确定',
                cancelText: '取消',
                message: '默认消息',
                confirmFn: null,
                cancelFn: null
            };
        },
        methods: {
            showModal(config) {
                this.setConfig(config);
                this.visible = true;
            },
            closeModal() {
                this.visible = false;
            },
            modalConfirm() {
                console.log('confirm');
                this.confirmFn();
                this.closeModal();
            },
            setConfig(config) {
                this.confitmText = config.confitmText || '确定';
                this.cancelText = config.cancelText || '取消';
                this.message = config.message || '默认';
                this.confirmFn = config.confirmFn || this.closeModal;
                this.cancelFn = config.cancelFn || this.closeModal;
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .modal-container {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal {
        background: #FFFFFF;
        border: 1px solid #999999;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.30);
        border-radius: 4px;
        min-width: 368px;
        max-width: 500px;
        height: 156px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .toast-title{
            margin: 0 20px 40px;
            font-size: 12px;
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
        .cancel{
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
</style>
