<template>
    <div class="clearfix kkmsg" :class="{ kkright: isMyMsg}">
    <div class="voice-msg list-text" @click="playSound">
        <div :style="{ width: width }" class="clearfix">
            <div class="voice-con" id="voice-con">
                <div class="voice-box" v-if="playing"></div>
                <em class="iconn-2" v-else></em>
            </div>
            <span>{{msg.playTime + "\""}}</span>
        </div><div class="new-m" v-if="false"></div>
    </div>
    </div>
</template>

<script>
//    import Vue from 'vue';
    export default {
        props: ['msg', 'isMyMsg'],
        computed: {
            width() {
                return this.msg.playTime < 20 ? 80 + 'px' : 80 + (this.msg.playTime - 20) + 'px';
            },
            unRead() {
                return this.msg.senderId !== this.$store.state.myInfo.info.imUserid && this.msg.VoiceBePlayed === 0;
            },
            playing() {
                return this.msg.playing;
            }
        },
        methods: {
            playSound() {
                if (this.msg.playing === false) {
                    this.msg.VoiceBePlayed = 1;
                    this.$api.playSound(this.msg.channelId, this.msg.msgId, this.msg.attachUrl);
                } else {
                    this.$api.stopSound(this.msg.channelId, this.msg.msgId);
                }
                this.msg.playing = !this.msg.playing;
                console.log(this.msg);
            }
        }
//        created() {
//            Vue.set(this.msg, 'playing', false);
//        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .voice-msg {
        cursor: pointer;
    }
    .kkmsg {
        display: flex;
        justify-content: flex-start;

    }
    .kkright {
        justify-content: flex-end;
    }
    .list-text {
        float: none !important;
    }
</style>
