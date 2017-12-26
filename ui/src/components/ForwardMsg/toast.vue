<template>
    <transition name="fade" v-if="show">
        <div class="pop_warp" >
            <div class="content" transition='fade'>
               <i></i>
               <span>{{message}}</span>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
                message: '发布失败，请稍后再试'
            };
        },
        methods: {
            showComponent(config) {
                this.show = true;
                this.message = config.message;
            },
            hideComponent() {
                this.show = true;
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
        background-image: url("../../../images/icon/成功复制@2x.png");
        background-size: 12px 12px;
        vertical-align: middle;
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
