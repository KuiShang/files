<template lang="html">
    <div class="button_switch" :class="{change_to_open: open}"  @click="changeType">
        <div class="circel_button" :class="{trans_to_right: open}"></div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        name: 'switchbutton',
        props: ['open'],
        methods: {
            changeType() {
                console.log(this.newMsgRemind);
                console.log(this.open);
                let code = this.open ? 1 : 0;
                this.$emit('changeType', code);
                // this.$store.commit(types.SET_CURRENT_CHANNEL_SESSION_NEW_MSG_REMIND, code);
                // console.log(this.open);
                // this.$api.ModifyNewMsgRemindConfig(this.$store.getters.currentChannelId, code);
            }
        }
    };
</script>-
<style rel="stylesheet/scss" lang="scss" scoped>
    .button_switch {
        background-color: #fff;
        cursor: pointer;
        display: flex;
        justify-content: center;
        border-radius: 100px;
        border: 2px solid #E5E5E5;
        width: 40px;
        height: 24px;
        position: relative;
        /*top: -5px;*/
        box-sizing: border-box;
        .circel_button{
            transition: all .3s;
            position: absolute;
            z-index: 1;
            top: 0px;
            left:0px;
            width: 20px;
            height: 20px;
            background: #FFFFFF;
            box-shadow: 0 0 4px 0 rgba(0,0,0,0.20);
            border-radius: 50%;
            cursor: pointer;
        }
        .trans_to_right{
            transform: translateX(15px);
        }
    }
    .change_to_open{
        background: #4DD865;
        border: 2px solid #4DD865;
    }
</style>
