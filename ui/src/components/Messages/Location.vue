<template>
    <div class="clearfix kkmsg" :class="{ kkright: isMyMsg}">
    <div class="list-text location-msg">
        <div class="map" @click="showMap">
            <img :src="msg.LocaltionPicUrl">
            <p>{{msg.LocaltionContent}}</p>
        </div><slot></slot>
    </div>
    </div>
</template>

<script>
    export default {
        props: ['msg', 'isMyMsg'],
        methods: {
            showMap() {
                this.$api.showMap(this.msg.LocaltionLongitude, this.msg.LocaltionLatitude, this.msg.LocaltionContent);
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
