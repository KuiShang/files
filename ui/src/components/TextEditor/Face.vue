<template>
    <img :src="url" alt=""  @click="insertFace" @mouseenter="tooltipIn(cName)" @mouseleave="tooltipOut">
</template>

<script>
    import tooltip from '../mixin/tooltips';
    export default {
        props: ['name', 'cName'],
        mixins: [tooltip],
        computed: {
            url() {
                return '../images/face/' + this.name + '.png';
            }
        },
        methods: {
            insertFace() {
                var html = '<img class="input-face" src="' + this.url + '">';
                insertImg(html);
                this.$emit('hideEmoji');
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
