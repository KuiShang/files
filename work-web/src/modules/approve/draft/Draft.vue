<template>
    <div class="draft-list">
        <div class="header">
            <span>审批草稿</span>
        </div>
        <div class="approve-right">
            <div class="approve-right-wrap">
                <div class="approve-head">
                    <ul class="approve-sheet">
                        <li class="approve-type type-special">审批单名称</li>
                        <li class="approve-peo">保存时间</li>
                        <li class="approve-time">操作</li>
                    </ul>
                </div>
                <div class="page-overflow">
                    <div class="scroll-content">
                        <div id="approveListBox">
                            <ul @click="gotoViewform(approve)" class="sline " v-for="(approve, index) in list " :key="index">
                     
                                <li class="approve-type type-special" :title="approve.approves.formName">
                                    {{ approve.approves.typeName }}
                                </li>
                                <li class="approve-peo" :title="time(approve.approves.time)">
                                {{ time(approve.approves.utime) }}
                                </li>
                                <li  class="approve-operta"
                                    @click.prevent.stop="showDelModal(approve)"
                                >
                                    删除
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <kdialog
            :visible="dialogDelVisible"
            width="476px"
            @update:visible="val =>dialogDelVisible = val"
        >
            <div class="approve-delete ">
                <div class="approve-delete-close " @click="dialogDelVisible = false" ></div>
                <h6 class="approve-delete-title">提示</h6>
                <div class=" approve-delete-body ">
                    <p>是否删除审批草稿，在本页删除后将不可恢复!</p>
                    <div class="button-box clearfix">
                        <div class=" cancel ui-button" @click="dialogDelVisible = false">
                            <input type="button" value="取消" class="small white dis-r-10" >
                        </div>
                        <div class=" confirm ui-button" @click="delApprove">
                            <input type="button" value="确认" class="small blue">
                        </div>
                    </div>
                </div>
            </div>
        </kdialog>
    </div>
</template>
<script>
import { fetchDraftlist, approveDel } from "@/api/approve";
import CONSTANT from "@/modules/approve/constant";
import kdialog from "@/components/dialog/component.vue";
export default {
  name: "draftlist",
  data() {
    return {
      list: [],
      dialogDelVisible: false,
      intentToDel_approveId: ""
    };
  },
  components: {
    kdialog: kdialog
  },
  created() {
    // 获取数据，赋值给data.list
    this.getDraft();
  },
  //给当前组件提供方法 挂载this上面。
  methods: {
    async getDraft() {
      let res = await fetchDraftlist({
        typeId: CONSTANT.DRAFT,
        companyId: sessionStorage.getItem("companyId")
      });
      this.list = res.data.data.list;
    },
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
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    gotoViewform(approve) {
      //let path = `/approval/draft/${approve.approveId}`
      this.$router.push({
        name: "apply-redraft",
        params: { approveId: approve.approveId },
        query: { approveId: approve.approveId }
      });
    },
    showDelModal(approve) {
      console.log(approve);
      this.intentToDel_approveId = approve.approveId;
      this.dialogDelVisible = true;
    },
    async delApprove() {
      let res = await approveDel({
        companyId: sessionStorage.getItem("companyId"),
        approveId: this.intentToDel_approveId
      });
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$toast({
          success: true,
          message: "删除成功"
        });
        this.getDraft();
      } else {
        this.$toast({
          success: true,
          message: res.data.msg
        });
      }
      this.dialogDelVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.draft-list {
  height: 100%;
  background-color: #fff;

  .header {
    height: 61px;
    margin: 0 40px;
    line-height: 61px;
    text-align: left;
    margin-bottom: 20px;
    span {
      vertical-align: text-top;
      line-height: 61px;
      font-family: "microsoft yahei";
    }
  }
}
.approve-right {
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  height: 100%;
  .approve-right-wrap {
    height: 100%;
    position: relative;
    .approve-head {
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #d2d2d2;
      background-color: #f7f7f7;
      line-height: 61px;
      position: relative;
      overflow: hidden;
    }
    /*列表标题头部样式开始 */
    .approve-sheet {
      width: 98%;
      position: absolute;
      padding: 0 1%;
      color: #333;
      li {
        float: left;
        text-align: left;
      }
    }
    .approve-type {
      width: 57%;
      margin-right: 5%;
      position: relative;
    }
    .approve-peo {
      width: 14%;
      margin-right: 7%;
      position: relative;
      float: left;
    }
    .approve-operta {
      width: 16%;
      margin-right: 0.25%;
      position: relative;
      float: left;
    }
    .approve-operta:hover {
      color: #4590e4;
    }
    .type-special {
      text-indent: 10px;
    }
    /*列表头部样式结束*/
    /* 详情列表样式开始 */
    .page-overflow {
      position: absolute;
      overflow-x: hidden;
      overflow-y: auto;
      width: 100%;
      top: 61px;
      bottom: 0;
    }
    .myapprove-status {
      color: #333;
    }
    .sline {
      height: 50px;
      padding-left: 10px;
      line-height: 51px;
      width: 98%;
      font-size: 14px;
      border-bottom: 1px solid #efefef;
      background-color: #fff;
      margin-left: 1%;
      position: relative;
      font-size: 14px;
      cursor: pointer;
      li {
        float: left;
        text-align: left;
      }
    }
    .sline:hover {
      background: #e4f2ff;
    }
    /* 详情列表样式结束 */
  }
  .blueword {
    color: #4590e4;
  }
  .redword {
    color: #f41935;
  }
  .blackword {
    color: #333;
  }
}

.approve-delete {
  width: 476px;
  border: none !important;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  .approve-delete-close {
    width: 13px;
    height: 13px;
    background: url(../../../assets/imgs/close.png) 0 0 no-repeat;
    float: right;
    top: 20px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    &:hover {
      background: url(../../../assets/imgs/close-hover.png) 0 0 no-repeat;
    }
  }
  .approve-delete-title {
    height: 20px;
    background: transparent !important;
    border-bottom: none !important;
    font-family: "microsoft yahei";
    font-size: 18px;
    font-weight: normal;
    color: #333333;
    padding: 40px 0 0 40px;
  }
  .approve-delete-body {
    p {
      width: 100%;
      text-align: center;
      height: 108px;
      line-height: 98px;
      font-size: 18px;
    }
    .button-box {
      height: 56px;
      text-align: center;
      font-size: 0;
      .ui-button {
        display: inline-block;
      }
    }

    .small {
      cursor: pointer;
      width: 90px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #000;
    }
    .white {
      background: #ffffff;
      border-color: #d9dadc;
      color: #666666;
    }
    .dis-r-10 {
      margin-right: 40px;
    }
    .blue {
      background: #4590e4;
      border-color: #4590e4;
      color: #ffffff;
    }
  }
}
</style>