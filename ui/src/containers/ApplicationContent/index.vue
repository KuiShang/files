<template>
    <div class="application-content">
        <div class="application-content-title">应用中心</div>
        <div class="application-content-main">
            <div class="application-group clearfix">
                <div class="application-group-title">官方应用</div>
                <ApplicationLabel v-for="(item, index) in officialApp" :appDetail="item" :key="index"></ApplicationLabel>
            </div>
            <div class="application-group clearfix">
                <div class="application-group-title">第三方应用</div>
                <ApplicationLabel v-for="(item, index) in thirdPartyApp" :appDetail="item" :key="index"></ApplicationLabel>
            </div>
        </div>
    </div>
</template>

<script>
    import ApplicationLabel from '../../components/ApplicationLabel';
    import { mapGetters } from 'vuex';

    export default {
        components: { ApplicationLabel },
        computed: {
            ...mapGetters({
                officialApp: 'officialApp',
                thirdPartyApp: 'thirdPartyApp'
            })
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
    .application-content {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 30001;
        background-color: #fff;
    }
    .application-content-title {
        height: 59px;
        border-bottom: 1px solid #EEE;
        color: #323232;
        font-size: 16px;
        line-height: 60px;
        padding-left: 20px;
    }
    .application-content-main {
        margin-top: 20px;
    }
    .application-group {
        padding: 20px 40px 0;
    }
    .application-group-title {
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;
        clear: both;
    }
</style>
