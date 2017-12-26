<template>
    <div class="wait-approve">
        <div class="header">
            <span @click="ttt">待我审批</span>
        </div>
        <div>
            <search-criteria @getSearchList="getSearchList" :optionData="optionData"></search-criteria>
        </div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="box-container">
                <el-checkbox v-for="city in approveIds" :label="city" :key="city" class="box"></el-checkbox>
            </el-checkbox-group>   
        <gome-table 
            class="approve-right"
            :list-data="list"
            :total-record="totalRecord"
            @size-change="sizeChange"
            @current-change="currentChange">
            <template slot="table-top"></template>
            
            <template slot="table-header">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="checkall"></el-checkbox>
                <ul class="approve-sheet" v-if="checkedCities.length == 0">
                    <li class="approve-type">
                        审批单名称
                        </li>
                    <li class="approve-peo">摘要</li>
                    <li class="approve-time">申请时间</li>
                </ul>
                <div v-else class="approve-sheet">
                  <span>已选择{{checkedCities.length}}个审批单</span>
                  <el-button @click="doApproveTask">同意</el-button>
                </div>
            </template>

      

            <template slot="table-item" scope="props">
                <ul  tag="ul" class="sline clearfix" @click="test(props)">
                        <li class="approve-type " :title="props.item.approves.formName">
                            {{ props.item.approves.typeName }}
                        </li>
                        <li class="approve-peo" :title="props.item.approves.ownerName">
                        {{ props.item.approves.ownerName }}
                        </li>
                        <li class="approve-time" :title="time(props.item.approves.ctime)">
                            {{ time(props.item.approves.ctime) }}
                        </li>
                </ul>
            </template>

            <template slot="table-nodata">
                <div class = "no-container">
                    <i class="no-approval"></i>
                    <span class="no-txt">暂无数据</span> 
                </div>
            </template>
        </gome-table>
          
    </div>
</template>
<script>
import { fetchWaitApprovelist, doApproveTask } from "@/api/approve";

import gomeTable from "@/components/table";
import searchCriteria from "@/modules/approve/components/Filter.vue";
import filterData from "@/modules/approve/filterConst";
import mixin from "@/modules/approve/mixin";
export default {
  name: "waitApprove",
  data() {
    return {
      list: [],
      totalRecord: 0,
      optionData: filterData.optionData,
      isIndeterminate: true,
      checkAll: false,
      approveIds: [],
      checkedCities: []
    };
  },
  components: {
    "search-criteria": searchCriteria,
    gomeTable
  },
  created() {
    // 获取数据，赋值给data.list
    console.log("WaitApprove.vue created");
    this.getWait({
      companyId: sessionStorage.getItem("companyId")
    });
  },
  mixins: [mixin],
  //给当前组件提供方法 挂载this上面。
  methods: {
    ttt() {
           //const url = this.$getConfig().bundleUrl;
        console.log(this)
        debugger
    },
    test(props) {
      //let path = `/approval/wait/${props.item.approveId}`
      //this.$router.push(path)
      this.$router.push({
        name: "approval-wait",
        params: { approveId: props.item.approveId }
      });
      // console.log(item)
    },
    sizeChange(size) {
      console.log(size);
    },
    currentChange(currentPage) {
      console.log(currentPage);
    },
    async getWait(data) {
      let list = await fetchWaitApprovelist(data);
      this.list = list.data.data.list;
      list.data.data.list.forEach(item => {
        this.approveIds.push(item.approveId);
      });

      this.totalRecord = this.list.length;
    },
    //时间获取以及格式设置
    time(timer) {
      let date = new Date(timer);
      let minutes = date.getMinutes();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let val =
        date.getFullYear() +
        "-" +
        this.checkTime(month) +
        "-" +
        this.checkTime(day) +
        " " +
        this.checkTime(hour) +
        ":" +
        this.checkTime(minutes);
      return val;
    },
    // 时间小于10 前面加0
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    // 筛选结果后请求list
    getSearchList(data) {
      console.log("筛选结果后请求list", data);
      let option = Object.assign(
        {
          companyId: sessionStorage.getItem("companyId")
        },
        data
      );
      this.getWait(option);
    },
    handleCheckAllChange(event) {
        let arr = []
        this.approveIds.forEach(item => arr.push(item))
        this.checkedCities = event.target.checked  ? arr : [];
        this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.approveIds.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.approveIds.length;
    },
    async doApproveTask() {
      let arr = this.checkedCities
      let res = await doApproveTask({
        companyId: sessionStorage.getItem("companyId"),
        approveId: arr, //todo
        result: true,
        reason: "",
        opinion: "",
        isSingle: false
      });
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$toast({
          success: true,
          message: "审批已同意"
        });
        this.getMyApproveCount();
      } else {
        this.$toast({
          success: false,
          message: res.msg
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.checkall {
  position: absolute;
  left: 20px;
    top: 22px;
}
.box-container {
  position: absolute;
  height: 100%;
  display: flex;
  top: 201px;
      left: 20px;
  flex-direction: column;
          width: 18px;
    overflow: hidden;
  .el-checkbox {
    height: 50px !important;
    margin-left: 0 !important;
    padding-top: 15px;
    box-sizing: border-box;

  }
}
.no-container {
  margin: 200px auto;
  width: 130px;
  height: 112px;
  .no-approval {
    display: block;
    width: 100%;
    height: 115px;
    margin-bottom: 20px;
    background: url(../../../assets/imgs/no_approve.png) no-repeat;
  }
  .no-txt {
    font-size: 14px;
    color: #333;
    text-align: center;
    display: inline-block;
    width: 100%;
    padding-left: 15px;
  }
}

.wait-approve {
  position: relative;
  background-color: #fff;

  .header {
    height: 61px;
    margin: 0 40px;
    line-height: 61px;
    text-align: left;

    span {
      vertical-align: text-top;
      line-height: 61px;
      font-family: "microsoft yahei";
    }
  }
}
.approve-right {
    height: 100%;
  position: relative;
  .sline {
    width: 98%;
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    cursor: pointer;
    color: #333;
    margin-left: 1%;
    padding-left: 50px;
    li {
      overflow: hidden;
      border-bottom: 1px solid #efefef;
      box-sizing: border-box;
      height: 50px;
      float: left;
      text-align: left;
    }
  }
  .sline:hover {
    background: #e4f2ff;
  }
  .approve-sheet {
    
    height: 60px;
    line-height: 61px;
    border-bottom: 1px solid #d2d2d2;
    background-color: #f7f7f7;
    overflow: hidden;
    width: 98%;
    padding: 0 1%;
    color: #333;
    padding-left: 50px;

    li {
      float: left;
      box-sizing: border-box;
      text-align: left;
    }
  }
  .approve-type {
    width: 61%;
    padding-right: 5%;
  }
  .approve-peo {
    width: 21%;
    padding-right: 7%;
  }
  .approve-time {
    width: 18%;
    min-width: 120px;
  }
}
</style>