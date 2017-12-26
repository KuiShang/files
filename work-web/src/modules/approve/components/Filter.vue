<template>
    <div class="block clearfix">
        <div class="search-unit time-control">
            <el-date-picker
                class="fl"
                v-model="valueDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="chengeDate"
            >
            </el-date-picker>
        </div>
        <div class="search-unit" v-for="(item, index) in optionData" :key="index">
            <!-- 下拉框展示  -->
            <is-select class="fl" :selectData="item" @selectChange="getSelectChange"></is-select>
        </div>
        <div class="search-unit">
            <input type="text" placeholder="请填写员工姓名" v-model="searchData.authName" />
        </div>
        <div class="search-unit condition-search-btn">
            <a @click="searchSure" href="javascript:;">搜索</a>
        </div>
    </div>
</template>

<script>
import isSelect from "@/components/Select.vue"

export default {
  props: {
    optionData: {
        type: Array,
        default: []
    }
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      valueDate: "",
      searchData:{
          startDate: '',
          endDate: '',
          authName: '',

      }
    };
  },
  components: {
      "is-select": isSelect
  },
  methods: {
        searchSure() {
            this.$emit('getSearchList', this.searchData)
        },
        getSelectChange(data){
            this.searchData[data.name] = data.value;
        },
        chengeDate(){
            this.searchData.startDate = Date.parse(this.valueDate[0]);
            this.searchData.endDate = Date.parse(this.valueDate[1]);
        }
    }
};
</script>

<style lang="scss" scoped>
    .block {
        margin: 20px 40px;
        box-sizing: border-box;
        min-height: 40px;
        line-height: 40px;
        display: flex;

        .search-unit {
            width: 10.6%;
            flex: 1;
            input {
                width: 100%;
                height: 100%;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #bfcbd9;
                box-sizing: border-box;
                color: #1f2d3d;
                display: block;
                font-size: inherit;
                height: 36px;
                line-height: 1;
                outline: 0;
                padding: 3px 10px;
                transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            }
        }
        .time-control {
            width: 31.8%;
        }
        .condition-search-btn a{
            display: block;
            border-radius: 3px;
            background: #4590E4;
            color: #fff;
            text-align: center;
            height: 100%;
            line-height: 40px;
            cursor: pointer;
            font-size: 14px;
        }
    }
</style>

