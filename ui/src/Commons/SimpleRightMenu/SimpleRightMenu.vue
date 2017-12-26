<template lang="html">
    <div ref="root"
        :style="{top: clientY, left: clientX}"
        class="simple-right-menu">
        <slot>
            只有在没有要分发的内容时才会显示。
        </slot>
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        name: 'SimpleRightMenu',
        props: ['clientX', 'clientY'],
        methods: {
            tipConfirm() {
                this.$emit('tipConfirm');
            },
            cancel() {
                this.$emit('cancel');
            }
        },
        mounted() {
            console.log('mounted');
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .simple-right-menu {
        position: fixed;
        z-index: 250;
        background: #FFF;
        border: 1px solid #CCC;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
        line-height: 30px;
        border-radius: 4px;
        div {
            cursor: pointer;
            padding: 0 30px;
            font-size: 12px;
        }
        div:hover {
            background-color: #ECF4FC;
        }
    }
</style>
