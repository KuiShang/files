<template>
    <ul class="session-context-menu"
        v-if="show"
        :style="{top: top, left: left}"
    >
        <li @click="setSessionTop" v-if="showSetSessionTop">置顶</li>
        <li @click="cancelSessionTop" v-if="showCancelSessionTop">取消置顶</li>
    </ul>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
                top: 0,
                left: 0,
                channel: null,
                e: null
            };
        },
        computed: {
            showSetSessionTop() {
                return !this.channel.top;
            },
            showCancelSessionTop() {
                return this.channel.top;
            }
        },
        methods: {
            showComponent(channel, e) {
                this.channel = channel;
                this.e = e;
                this.show = true;
                this.top = e.clientY + 'px';
                this.left = e.clientX + 'px';
            },
            setSessionTop() {
                this.$api.channelTop(this.channel.ChannelId, 1);
            },
            cancelSessionTop() {
                this.$api.channelTop(this.channel.ChannelId, 0);
            }
        },
        mounted() {
            document.addEventListener('click', () => {
                this.show = false;
            });
            document.addEventListener('contextmenu', () => {
                this.show = false;
            });
        },
        updated() {
            this.$nextTick(() => {
                if (this.e.clientY + $('.session-context-menu').height() > window.innerHeight) {
                    this.top = this.e.clientY - $('.session-context-menu').height() + 'px';
                }
            });
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .session-context-menu {
        position: fixed;
        z-index: 250;
        /*width: 100px;*/
        background: #FFF;
        border: 1px solid #CCC;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
        line-height: 30px;
        border-radius: 4px;
        li {
            cursor: pointer;
            padding: 0 30px;
            font-size: 12px;
        }
        li:hover {
            background-color: #ECF4FC;
        }
    }
</style>
