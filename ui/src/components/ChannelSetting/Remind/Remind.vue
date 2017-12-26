<template lang="html">
        <div class="remind">
            <div class="title">
                <span>消息提醒设置</span>
                <sbutton :open="open" @changeType="changeType" class="sbutton"></sbutton>
            </div>
            <p class="tips">关闭新消息提醒，频道将不提醒任何消息</p>
        </div>
</template>
<script type="text/ecmascript-6">
    import sbutton from '../common/SwitchButton.vue';
    import { mapGetters } from 'vuex';
    import * as types from '../../../store/mutation-types';
    export default{
        name: 'remind',
        components: {sbutton},
        data() {
            return {
                test: false
            };
        },
        computed: {
            ...mapGetters({
                newMsgRemind: 'newMsgRemind'
            }),
            open() {
                return this.newMsgRemind === 0;
            }
        },
        methods: {
            changeType(code) {
                // console.log(this.newMsgRemind);
                // console.log(this.open);
                // let code = this.open ? 1 : 0;
                this.$store.commit(types.SET_CURRENT_CHANNEL_SESSION_NEW_MSG_REMIND, code);
                // console.log(this.open);
                this.$api.ModifyNewMsgRemindConfig(this.$store.getters.currentChannelId, code);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .remind {
        padding-top: 50px;
        .title {
            border: 1px solid #EEEEEE;
            background-color: #f9f9f9;
            border-radius: 5px;
            height: 50px;
            display: flex;
            box-sizing: border-box;
            padding: 16px 20px 0;
            justify-content: space-between;
            .sbutton{
                top:-5px;
            }
        }
        .tips {
            padding-top: 10px;
            font-size: 12px;
            color: #CCCCCC;
        }
    }
</style>
