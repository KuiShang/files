<template>
    <div class="clearfix kkmsg" :class="{ kkright: isMyMsg}">
        <div class="list-text text-msg" :class="{'acknowledge-content': acknowledgeContent}">
            <p class="deleted-msg">该消息已被删除</p><slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['msg', 'isMyMsg']
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .deleted-msg {
        color: rgba(50, 50, 50, .3);
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
