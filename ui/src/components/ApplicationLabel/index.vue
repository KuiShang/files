<template>
    <div class="application-label" :class="{active: appDetail.active !== false}" @click="open">
        <img :src="this.appDetail.image" class="application-label-img">
        <div class="application-label-title">{{this.appDetail.title}}</div>
        <span class="app-unread-num" v-if="this.appDetail.unReadNum > 0">{{unReadNum}}</span>
        <!--<div class="application-label-disabled" v-if="appDetail.active === false">即将推出</div>-->
    </div>
</template>

<script>
    export default {
        props: ['appDetail'],
        computed: {
            unReadNum() {
                return this.appDetail.unReadNum > 99 ? '99+' : this.appDetail.unReadNum;
            },
            myInfo() {
                return this.$store.state.myInfo.info;
            }
        },
        methods: {
            open() {
                if (this.appDetail.active !== false) {
                    let url = '';
                    if (this.appDetail.official) {
//                        url = this.appDetail[this.$store.state.status.environment] + `~companyId=${this.myInfo.companyId}~ownerId=${this.myInfo.oaId}~staffName=${this.myInfo.name}`;
                        url = this.appDetail[this.$store.state.status.environment];
                    } else {
                        url = this.appDetail.url;
                    }
                    this.$api.openURL(url);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .application-label {
        position: relative;
        display: block;
        float: left;
        width: 81px;
        height: 87px;
        margin: 10px 50px 10px 0;
        overflow: hidden;
    }
    .application-label.active {
        cursor: pointer;
        overflow: inherit;
    }
    .application-label.active:hover {
        background-color: rgba(216, 216, 216, .2);
        border-radius: 5px;
    }
    .application-label-img {
        display: block;
        margin: 10px auto;
        width: 41px;
    }
    .application-label-title {
        text-align: center;
        font-size: 12px;
        color: #666;
    }
    .app-unread-num {
        position: absolute;
        display: block;
        min-width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #FA4042;
        color: #fff;
        text-align: center;
        top: 5px;
        left: 53px;
        font-size: 12px;
        padding: 0 4px;
        box-sizing: border-box;
    }
    .application-label-disabled {
        position: absolute;
        transform: rotate(45deg);
        top: 11px;
        right: -16px;
        width: 70px;
        text-align: center;
        font-size: 12px;
        background-color: #ccc;
        color: #fff;
    }
    .application-label:not(.active) {
        background-image: url('../../../images/icon/即将推出@2x.png');
        background-size: 81px 87px;
    }
</style>
