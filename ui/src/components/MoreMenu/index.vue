<template>
    <div class="im-more-list" v-if="showmenu">
        <a @click.stop="moreOfficialWebsite">官网</a>
        <a @click.stop="moreDownload">下载手机版</a>
        <a @click.stop="moreSet">设置<span class="dot-xs" v-show="updateStatus" style="display: none"></span></a>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
                isShow: this.showmenu
            };
        },
        computed: {
            ...mapGetters({
                updateStatus: 'updateStatus'
            })
        },
        props: ['showmenu'],
        methods: {
            moreOfficialWebsite() {
                this.$api.openURL('https://work.gomeplus.com');
                this.isShow = !this.showmenu;
                this.$emit('change-show', this.isShow);
            },
            moreDownload() {
                this.isShow = !this.showmenu;
                this.$emit('change-show', this.isShow);
                this.$api.openPhoneDownLoad();
            },
            moreSet() {
                mainObject.showAppsetDialog();
                this.isShow = !this.showmenu;
                this.$emit('change-show', this.isShow);
            }
        },
        mounted() {
            document.addEventListener('click', () => {
                this.isShow = false;
                this.$emit('change-show', this.isShow);
            });
            document.addEventListener('contextmenu', () => {
                this.isShow = false;
                this.$emit('change-show', this.isShow);
            });
        }
    };
</script>

<style  rel="stylesheet/scss" lang="scss">
    .im-more-list{
      position: absolute;
      left: 70px;
      bottom: 20px;
      background: #5A5C66;
      border-radius: 4px;
      width: 108px;
      height: 108px;
      z-index: 99999;
    }

    .im-more-list a{
        display:block;
        clear: both;
        width: 68px;
        height: 36px;
        margin: 0px;
        font-size: 12px;
        color: #ccc;
        line-height: 36px;
        text-align: left;
        padding: 0px 20px 0px 20px;
        cursor: pointer;
        position: relative;
    }

    .im-more-list a:hover{
        background: rgba(0,0,0,0.10);
    }

    .dot-xs {
        position: absolute;
        left: 40px;
        top: 8px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #FA4042;
    }
</style>
