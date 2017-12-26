<template>
    <div class="select">
        <el-select v-model="value" :placeholder="title" @change="change()">
            <el-option
                v-for="item in selectData.data"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select>
    </div>
  
</template>

<script>
  export default {
    props: {
        selectData: {
            type: Object,
            default: {}
        }
    },
    data() {
      return {
        value: ''
      }
    },
    computed: {
        title(){
            return this.selectData.title.label
        }
    },
    methods: {
        change() {
            this.$emit('selectChange', {name: this.selectData.title.value,value:this.value})
        }
    }
  }
</script>
<style scoped lang="scss">
    .select{ margin-left: 15px; }
</style>
