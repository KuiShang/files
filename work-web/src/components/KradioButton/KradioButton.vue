<template lang="html">
    <div class="k-radio-button">
        <i class='k-radio__inner noactive'
           :class='{ active:  model === label}'>
        </i>
        <input
            class="k-radio__original"
            :value="label"
            type="radio"
            v-model="model"
            :name="name">
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        name: 'KradioButton',
        props: {
            value: {},
            label: {},
            name: String
        },
        computed: {
            model: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .k-radio-button {
        position: relative;
    }
    .k-radio__inner {
        position: relative;
        left: 20px;
        display: inline-block;
        width: 14px;
        height: 14px;
        cursor: pointer;
    }
    .noactive {
        background: url(./yuan.png);
        background-size: 100% 100%;
    }
    .active{
        background: url(./right.png);
        background-size: 100% 100%;
    }
    .k-radio__original {
        opacity: 0;
        text-align: left;
        cursor: pointer;
    }

</style>
