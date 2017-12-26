<template>
    <div class="view-form">
        <header class="approve-form-top">
            <span class="go-back" @click="goBack">返回</span>
            <div class="approve-form-btns" v-if="$route.name === 'approval-wait'">
                <div class="approveAgree button">
                    <input type="button" value="同意" class="blue" @click="dialogAgreeVisible = true" />
                </div>
                <div class="approveRefuse button">
                    <input type="button" value="拒绝"  @click="dialogRefuseVisible = true"/>
                </div>
                <div class="approveTurnOver button">
                    <input type="button" value="转交" @click="dialogTurnoverVisible = true"/>
                </div>
            </div>
            <div class="approve-form-btns" v-if="$route.name === 'approval-launch'">
                <div class="approveTurnOver button" v-if="approves.status == 4 " >
                    <input type="button" value="重新提交" @click="resubmit"/>
                </div>
               <div class="approveTurnOver button" v-else>
                    <input type="button" value="撤销" @click="dialogRevokeVisible = true"/>
                </div>

            </div>
        </header>
        <div class="page-overflow">
          <div class="approve-form-content">
              <div class="approve-detail">
                  <div class="info-img clearFix" :style="{background: randomColor(approves.ownerName)}">{{ approves.ownerName | takeLastTwo}}</div>
                  <div class="info-icon">
                      <span class="approve-title">
                          <span>{{name}}{{title}}</span>
                          <span v-if="approves.urgencyLevel === 1" class="level-style level-color-1 ml10">较紧急</span>
                          <span v-else-if="approves.urgencyLevel === 2" class="level-style level-color-2 ml10">很紧急</span>
                      </span>

                      <span class="approve-ctime">{{ approves.ctime | formatDate }}</span>
                  </div>
              </div>
              <div v-for="value in values" :is="value.componentName + '-element'" :value="value" :key="value.orderCode"></div>
          </div>
          <span 
            class="status-common-icon" 
            :class="{'refused-icon' :approves.status == 3,
              'finished-icon' :approves.status == 2,
              'revoked-icon' :approves.status == 4}">
          </span>
          <!-- 流程 -->
          <flow-element :notes="notes" :ownInfo="ownInfo" :approves="approves" ></flow-element>

        </div>
        <!-- 同意 -->
        <kdialog
		      :visible="dialogAgreeVisible"
			    width="50%"
			    @update:visible="val =>dialogAgreeVisible = val"
			  >
          <div class="dialog-content">
              <div class="approve-agree-close ui-dialog-close" @click="dialogAgreeVisible = false"></div>
              <h6 id="approve-agree-title">审批意见</h6>
              <div class="ui-dialog-body approve-agree-body ">
                  <div class="agreeOpinion ui-input">
                      <textarea v-model="agreeOptionmsg" id="_opinion" name="opinion" placeholder="选填：意见说明" maxlength="5000" class="textarea"></textarea>
                  </div>
                  <span class="show-options-num"><b id="newNumberLength">{{agreeOptionmsg.length}}</b>/5000</span>
                  <div class="button-box clearfix">
                      <div class="cancel ui-button">
                          <input type="button" value="取消" class="small white dis-r-20" @click="dialogAgreeVisible = false">
                      </div>
                      <div class="confirm ui-button">
                          <input type="button" value="确认" class="small blue" @click="ido">
                      </div>
                  </div>
              </div>
          
          </div>
		    </kdialog>
        <!-- 拒绝 -->
        <kdialog
		      :visible="dialogRefuseVisible"
			    width="50%"
			    @update:visible="val =>dialogRefuseVisible = val"
			  >
          <div class="dialog-content">
              <div class="approve-agree-close ui-dialog-close" @click="dialogRefuseVisible = false"></div>
              <h6 id="approve-agree-title">拒绝原因</h6>
              <div class="ui-dialog-body approve-agree-body ">
                  <div class="radio-set">
                      <div class="wrap">
                          <div class="ui-label" @click="refruseType='填写内容有误'">填写内容有误</div>
                          <div class="clearfix clearfix-checked r1 ui-radio ui-radio-checked">
                              <KradioButton
                                  v-model="refruseType"
                                  label="填写内容有误"
                                  name="refruseType"
                                  class="radio-button"
                              >
                              </KradioButton>
                          </div>
                      </div>
                      <div class="wrap">
                          <div class="ui-label" @click="refruseType='审批流程有误'">审批流程有误</div>
                          <div class="clearfix r2 ui-radio">
                              <KradioButton
                                  v-model="refruseType"
                                  label="审批流程有误"
                                  name="refruseType"
                                  class="radio-button"
                              >
                              </KradioButton>
                          </div>
                      </div>
                      <div class="wrap">
                          <div class="ui-label" @click="refruseType='其他原因'">其他原因</div>
                          <div class="clearfix r3 ui-radio">
                              <KradioButton
                                  v-model="refruseType"
                                  label="其他原因"
                                  name="refruseType"
                                  class="radio-button"
                              >
                              </KradioButton>
                          </div>
                      </div>
                  </div>
                  <div class="agreeOpinion ui-input">
                      <textarea v-model="refuseOptionmsg" id="_opinion" name="opinion" placeholder="拒绝原因说明" maxlength="5000" class="textarea"></textarea>
                  </div>
                  <span class="show-options-num"><b id="newNumberLength">{{refuseOptionmsg.length}}</b>/5000</span>
                  <div class="button-box clearfix">
                      <div class="cancel ui-button">
                          <input type="button" value="取消" class="small white dis-r-20" @click="dialogRefuseVisible = false">
                      </div>
                      <div class="confirm ui-button">
                          <input type="button" value="确认" class="small blue" @click="irefuse">
                      </div>
                  </div>
              </div>
          
          </div>
		    </kdialog>
        <!-- 转交 -->
        <kdialog
		      :visible="dialogTurnoverVisible"
			    width="564px"
			    @update:visible="val =>dialogTurnoverVisible = val"
			  >
          <div class="dialog-content">
              <div class="approve-agree-close ui-dialog-close" @click="dialogTurnoverVisible = false"></div>
              <h6 id="approve-agree-title">添加审批人</h6>
              <div class="ui-dialog-body approve-agree-body ">
                  <staffSelect v-if="dialogTurnoverVisible" :staffs="staffsList" :depts="baseDeptInfo" :dept-staff="deptStaff" :init-staff="assigneeId" @pushSelectedValue="getSelectedValue"></staffSelect>
                    <div class="button-box clearfix">
                      <div class="cancel ui-button">
                          <input type="button" value="取消" class="small white dis-r-20" @click="dialogTurnoverVisible = false">
                      </div>
                      <div class="confirm ui-button">
                          <input type="button" value="确认" class="small blue" @click="showTurnTo">
                      </div>
                  </div>
              </div>
          </div>
		    </kdialog>
        <!-- 转交给xxx -->
        <kdialog
		      :visible="dialogTurnoverToVisible"
			    width="50%"
			    @update:visible="val =>dialogTurnoverToVisible = val"
			  >
          <div class="dialog-content">
              <div class="approve-agree-close ui-dialog-close" @click="dialogTurnoverToVisible = false"></div>
              <h6 id="approve-agree-title">转交给-{{assignInfo.name}}</h6>
              <div class="ui-dialog-body approve-agree-body ">
                  <div class="agreeOpinion ui-input">
                      <textarea v-model="agreeOptionmsg" id="_opinion" name="opinion" placeholder="告诉他/她转交理由(非必填)" maxlength="5000" class="textarea"></textarea>
                  </div>
                  <span class="show-options-num"><b id="newNumberLength">{{agreeOptionmsg.length}}</b>/5000</span>
                  <div class="button-box clearfix">
                      <div class="cancel ui-button">
                          <input type="button" value="取消" class="small white dis-r-20" @click="dialogTurnoverToVisible = false">
                      </div>
                      <div class="confirm ui-button">
                          <input type="button" value="确认" class="small blue" @click="iturnover">
                      </div>
                  </div>
              </div>
          
          </div>
		    </kdialog>
        <!-- 撤销 -->
        <kdialog
		      :visible="dialogRevokeVisible"
			    width="50%"
			    @update:visible="val =>dialogRevokeVisible = val"
			  >
          <div class="dialog-content">
              <div class="approve-agree-close ui-dialog-close" @click="dialogRevokeVisible = false"></div>
              <h6 id="approve-agree-title">请填写撤销原因</h6>
              <div class="ui-dialog-body approve-agree-body ">
                  <div class="agreeOpinion ui-input">
                      <textarea v-model="revokeOptionmsg" id="_opinion" name="opinion" placeholder="必填" maxlength="5000" class="textarea"></textarea>
                  </div>
                  <span class="show-options-num"><b id="newNumberLength">{{revokeOptionmsg.length}}</b>/5000</span>
                  <div class="button-box clearfix">
                      <div class="cancel ui-button">
                          <input type="button" value="取消" class="small white dis-r-20" @click="dialogRevokeVisible = false">
                      </div>
                      <div class="confirm ui-button">
                          <input type="button" value="确认" class="small blue" @click="irevoke">
                      </div>
                  </div>
              </div>
          
          </div>
		    </kdialog>
    </div>
</template>

<script>
import kdialog from "@/components/dialog/component.vue";
import KradioButton from "@/components/KradioButton/KradioButton.vue";
import {
  getViewFormData,
  doApproveTask,
  myApproveCount,
  approveTransfer,
  approveUndo
} from "@/api/approve";
import { fetchCacheStaffInfos } from "@/api/currency";
import { format } from "@/utils/dateFormat";
import groupDateElement from "./groupDateElement.vue";
import textareaElement from "./textareaElement.vue";
import flowElement from "./flowElement.vue";
import { mapGetters } from "vuex";
import * as types from "@/store/mutation-types";
import staffSelect from "@/components/StaffSelect";
import { fetchDeptlist } from "@/api/contact";
import mixin from "@/modules/approve/mixin";
export default {
  name: "viewForm",
  data() {
    return {
      approveId: null,
      formData: {},
      approves: {},
      curApproveId: null,
      approveFlow: "",
      title: "",
      status: "",
      values: [],
      ownInfo: {
        staffInfoToUser: [],
        staffName: "",
        id: ""
      },
      options: {
        pageNo: 1,
        pageSize: 20,
        companyId: 1
      },
      ownerId: "",
      staffsList: {}, //全量员工信息
      assignInfo: {}, //选人控件选中的员工信息
      baseDeptInfo: {}, //全量部门信息
      dialogAgreeVisible: false,
      dialogRefuseVisible: false,
      dialogTurnoverVisible: false,
      dialogTurnoverToVisible: false,
      dialogRevokeVisible: false,
      agreeOptionmsg: "",
      refuseOptionmsg: "",
      refruseType: "填写内容有误",
      assigneeId: "", //流程节点的审批人id
      revokeOptionmsg: "", //撤销原因
      notes: [] // 渲染flow组件的流程
    };
  },
  components: {
    kdialog: kdialog,
    groupDateElement: groupDateElement,
    textareaElement: textareaElement,
    flowElement: flowElement,
    KradioButton: KradioButton,
    staffSelect: staffSelect
  },
  mixins: [mixin],
  async created() {
    this.getBaseDeptInfo();
    // this.baseDeptInfo = JSON.parse(
    //   sessionStorage.getItem("deptList")
    // ).data.dept;
    this.approveId = this.$route.params.approveId;
    this.staffsList = await this.getStaffInfo();
    this.getformDataFromServer();
  },
  methods: {
    getBaseDeptInfo() {
      let deptList = sessionStorage.getItem("deptList");
      if (deptList) {
        this.baseDeptInfo = JSON.parse(deptList).dept;
      } else {
        let dept = this.getDeptList();
        this.baseDeptInfo = dept;
      }
    },
    async getDeptList() {
      let options = {
        params: {
           companyId: sessionStorage.getItem('companyId'),
          tag: new Date().getTime()
        }
      };
      let res = await fetchDeptlist(options);
      //存储部门树到sessionStorage
      sessionStorage.setItem("deptList", JSON.stringify(res.data.data));
      let dept = res.data.data.dept;
      return dept;
    },
    // 元素排序
    compare(property) {
      return function(a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    },
    randomColor(name) {
      if (name) {
        let colorArr = [
          "#b2dbf3",
          "#81dbee",
          "#a6e6c2",
          "#68c6aa",
          "#f8b186",
          "#f693bf",
          "#b5b4e3",
          "#c280d3"
        ];
        let index = Math.floor(Math.random() * colorArr.length);

        return colorArr[index];
      } else {
        return "#eeeeee";
      }
    },
    async getStaffInfo() {
      return JSON.parse(sessionStorage.getItem("cacheStaffInfos"));
      // if (!sessionStorage.getItem("cacheStaffInfos")) {
      //   let staffInfos = await fetchCacheStaffInfos({
      //       companyId:sessionStorage.getItem('companyId')
      //   });
      //   sessionStorage.setItem(
      //     "cacheStaffInfos",
      //     JSON.stringify(staffInfos.data)
      //   );
      //   return staffInfos.data;
      // } else {
      //   return JSON.parse(sessionStorage.getItem("cacheStaffInfos"));
      // }
    },
    goBack() {
      this.$router.back();
    },
    // 重新提交
    resubmit() {
      this.$router.push({
        name: "approval-resubmit",
        params: {
          formId: this.approves.formId,
          typeId : this.approves.typeId,
          approveId : this.approveId,
          deleted: this.approveFlow.deleted,
          status:this.approveFlow.status,
        }
      });
    },
    // 同意审批
    async ido() {
      let res = await doApproveTask({
         companyId: sessionStorage.getItem('companyId'),
        approveId: [Number(this.$route.params.approveId)],
        result: true,
        reason: "",
        opinion: this.agreeOptionmsg,
        isSingle: true
      });
      this.dialogAgreeVisible = false;
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$toast({
          success: true,
          message: "审批已同意"
        });
        setTimeout(() => {
          this.$router.push({ name: "wait-approval" });
        }, 10);

        this.getMyApproveCount();
      } else {
        this.$toast({
          success: false,
          message: res.msg
        });
      }
    },
    // 拒绝审批
    async irefuse() {
      let res = await doApproveTask({
         companyId: sessionStorage.getItem('companyId'),
        approveId: [Number(this.$route.params.approveId)],
        result: false,
        reason: this.refruseType,
        opinion: this.refuseOptionmsg,
        isSingle: true
      });
      this.dialogRefuseVisible = false;
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$toast({
          success: false,
          message: "审批已拒绝"
        });
        setTimeout(() => {
          this.$router.push({ name: "wait-approval" });
        }, 10);
        this.getMyApproveCount();
      } else {
        this.$toast({
          success: false,
          message: res.msg
        });
      }
    },
    showTurnTo() {
      if (this.assigneeId) {
        this.dialogTurnoverVisible = false;
        this.dialogTurnoverToVisible = true;
      } else {
        this.$toast({
          success: false,
          message: "请选择要转交的流程审批人"
        });
      }
    },
    // 转交审批
    async iturnover() {
      let res = await approveTransfer({
        companyId: sessionStorage.getItem('companyId'),
        approveId: Number(this.$route.params.approveId),
        assignNow: this.assigneeId +'',
        opinion: this.agreeOptionmsg
      });
      this.dialogTurnoverToVisible = false;
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$toast({
          success: true,
          message: "审批已转交"
        });
        setTimeout(() => {
          this.$router.push({ name: "wait-approval" });
        }, 10);
        this.getMyApproveCount();
      } else {
        this.$toast({
          success: false,
          message: res.msg
        });
      }
    },
    // 撤销审批
    async irevoke() {
      if (this.revokeOptionmsg.trim().length == 0) {
        this.$toast({
          success: false,
          message: "请填写撤销理由"
        });
        return;
      }
      let res = await approveUndo({
         companyId: sessionStorage.getItem('companyId'),
        approveId: [Number(this.$route.params.approveId)],
        opinion: this.revokeOptionmsg
      });
      this.dialogRevokeVisible = false;
      let code = res && res.data && res.data.code;
      if (code === 0) {
        this.$toast({
          success: true,
          message: "审批已撤销"
        });
        //  TODO 刷新本页面
        this.getMyApproveCount();
        this.getformDataFromServer();
      } else {
        this.$toast({
          success: false,
          message: res.msg
        });
      }
    },
    /**
    * 获取选人控件选中的值
    * option 选中的员工对象
    */
    getSelectedValue(option) {
      this.assignInfo = option;
      this.assigneeId = this.assignInfo.id;
    },
    // 获取表单数据
    async getformDataFromServer() {
      let res = await getViewFormData({
        approveId: this.approveId,
        companyId: this.options.companyId
      });
      let formData = res.data;
      if (formData.code === 0) {
        this.title = formData.data.approves.formName;
        this.approves = formData.data.approves || {};
        // 操作按钮预处理
        // if (this.$route.name === "approval-wait") {
        //   this.curApproveId = JSON.parse(
        //     formData.data.approves.curApprovers
        //   ).staffId;
        // }
        this.approveFlow = formData.data.approveFlow;
        this.ownerId = formData.data.approves.ownerId || "";
        let notes = formData.data.notes || [];
        for (let i = 0; i < notes.length; i++) {
          // 匹配代理人信息
          let notesItem = notes[i];
          notesItem.staffInfoToUser = [];

          if (this.staffsList) {
            for (let j = 0; j < this.staffsList.length; j++) {
              let staffItem = this.staffsList[j];

              // 当前节点已经处理过 节点审批人信息
              if (notesItem.id) {
                if (Number(notesItem.ownerId) === Number(staffItem.id)) {
                  notesItem.staffName = staffItem.staffName;
                  if (staffItem.partTime === 0) {
                    // 主职位
                    notesItem.staffInfoToUser.unshift(staffItem);
                  } else {
                    // 兼职
                    notesItem.staffInfoToUser.push(staffItem);
                  }
                }
                // 当前节点未处理 节点审批人信息
              } else {
                if (Number(notesItem.assignNow) === Number(staffItem.id)) {
                  notesItem.staffName = staffItem.staffName;
                  if (staffItem.partTime === 0) {
                    // 主职位
                    notesItem.staffInfoToUser.unshift(staffItem);
                  } else {
                    // 兼职
                    notesItem.staffInfoToUser.push(staffItem);
                  }
                }
              }

              // 发起表单人的个人信息
              if (formData.data.approves.ownerId == staffItem.id) {
                this.ownInfo.staffName = staffItem.staffName;
                this.ownInfo.id = staffItem.id;
                if (staffItem.partTime === 0) {
                  // 主职位
                  this.ownInfo.staffInfoToUser.unshift(staffItem);
                } else {
                  // 兼职
                  this.ownInfo.staffInfoToUser.push(staffItem);
                }
              }
            }
          }
        }
        this.notes = notes;
        this.status = Number(formData.data.approves.status); // 获取表单状态
        let values = formData.data.values.map(function(value) {
          if (value.typeName === "groupDate") {
            value.componentName = "groupDate";
          } else {
            value.componentName = "textarea";
          }
          return value;
        });

        this.values = values.sort(this.compare("orderCode")); // 排序后的元素
      }
    }
  },
  filters: {
    takeLastTwo(name) {
      if (name) {
        return name.substr(-2);
      } else {
        return "";
      }
    },
    formatDate(date) {
      if (date) {
        return format(new Date(Number(date)), "yyyy/MM/dd HH:mm");
      } else {
        return "";
      }
    }
  },
  computed: {
    ifStamp() {
      return (
        Number(this.approves.status) === 2 ||
        Number(this.approves.status) === 3 ||
        Number(this.approves.status) === 4
      );
    },
    name() {
      if (
        this.$route.name === "approval-done" ||
        this.$route.name === "approval-wait"
      ) {
        return this.approves.ownerName ? this.approves.ownerName + "的" : "";
      } else {
        return this.approves.ownerName ? "我的" : "";
      }
    },
    ...mapGetters(["waitApprovalCount"]),
    deptStaff() {
      let deptStaff = {};
      for (let i = 0, length = this.staffsList.length; i < length; i++) {
        let staff = this.staffsList[i];

        if (!deptStaff[staff.deptId]) {
          deptStaff[staff.deptId] = [];
        }
        deptStaff[staff.deptId].push(staff);
      }
      return deptStaff;
    }
  }
};
</script>

<style lang="scss" scoped>
.view-form {
  height: 100%;
  background: #fff;
  position: relative;
  .approve-form-top {
    height: 60px;
    border-bottom: 1px solid #d2d2d2;
    background-color: #f7f7f7;
    font: 14px/1.4 "Microsoft YaHei";
    text-align: center;
    position: relative;
    .go-back {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      color: #666;
      background: url(../../../assets/imgs/approveForm-view.png) no-repeat -100px -22px;
      margin: 15px 316px 15px 25px;
      position: absolute;
      top: 0;
      left: 0;
      padding-left: 12px;
    }
    .approve-form-btns {
      position: absolute;
      right: 0;
      top: 14px;
      font-size: 0;
      .button {
        display: inline-block;
        input {
          width: 100px;
          height: 34px;
          border-radius: 3px;
          line-height: 32px;
          border: 1px solid #000;
          background-color: #fff;
          text-align: center;
          outline: none;
          font-size: 14px;
          cursor: pointer;
          margin-right: 20px;
        }
        .blue {
          background-color: #4590e4;
          border-color: #4590e4;
          color: #fff;
        }
      }
    }
  }
  .page-overflow {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    top: 61px;
    bottom: 0;
    min-width: 724px;
    position: absolute;
    .approve-form-content {
      padding: 50px 0 55px 0;
      background-color: #fff;
      box-sizing: border-box;
      .approve-detail {
        overflow: hidden;
        margin-left: 50px;
        .info-img {
          width: 60px;
          height: 60px;
          line-height: 60px;
          float: left;
          border-radius: 4px;
          background-color: transparent;
          color: #fff;
          text-align: center;
        }
        .info-icon {
          width: 50%;
          float: left;
          padding-left: 20px;
          text-align: left;
          .approve-title {
            font-size: 20px;
            line-height: 26px;
            color: #333;
            margin: 0;
            margin-bottom: 10px;
            display: inline-table;
            width: 100%;
            font-weight: bold;
          }
          .approve-ctime {
            font-size: 14px;
            line-height: 16px;
            color: #999;
          }
        }
      }
      // .approve-form-list {
      //     margin-top: 56px;
      //     .approve-line {
      //         width: 100%;
      //         margin-top: 48px;
      //         text-align: left;
      //         .item-title {
      //             color: #333;
      //             font-weight: bold;
      //             font-size: 16px;
      //             margin-left: 50px;
      //             margin-bottom: 19px;
      //             line-height: 20px;
      //         }
      //         .item-value{
      //             margin: 0 50px;
      //             line-height: 20px;
      //             color: #333;
      //             font-size: 14px;
      //         }
      //     }
      // }
    }
  }
  .flow-table {
    width: 100%;
    overflow: hidden;
    .flow-thead {
      margin: 0 50px;
      margin-bottom: 10px;
      border-bottom: 1px solid #d2d2d2;
      font-family: "微软雅黑";
      font-size: 16px;
      color: #333333;
      height: 40px;
      font-weight: bold;
      text-align: left;
    }
    .flow-item {
      width: 100%;
      min-height: 83px;
      font-size: 14px;
      color: #333333;
      position: relative;
      float: left;
      height: auto;
      li {
        height: 100%;
        list-style: none;
        margin: 0 50px 0 56px;
        padding: 0;
        .fitem-title {
          height: 100%;
          border-left: 1px solid #d2d2d2;
          position: relative;
          overflow: hidden;
          padding: 10px 0px;
          .approve-view-process {
            overflow: hidden;
            margin-bottom: 13px;
            margin-top: 13px;
            float: right;
            .view-process-status {
              margin-left: 27px;
              font-size: 16px;
              color: #333;
              text-align: right;
              margin-bottom: 10px;
            }
            .view-process-time {
              float: right;
              font-size: 12px;
              color: #999;
            }
          }
          .view-process-user-dept {
            line-height: 24px;
            margin-bottom: 10px;
            color: #333;
            font-size: 16px;
            margin-left: 27px;
            width: 80%;
            margin-top: 10px;
            .info-img {
              height: 44px;
              width: 44px;
              line-height: 44px;
              float: left;
              border-radius: 4px;
              background: transparent;
              color: #fff;
              text-align: center;
            }
            .info-content {
              float: left;
              width: 86%;
              padding-left: 10px;
              text-align: left;
              .name {
                display: block;
                max-width: 15%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                padding-right: 10px;
              }
              .additional {
                display: inline-block;
                // width: 83%;
                vertical-align: top;
                font-size: 12px;
                color: #999;
                text-align: left;
              }
            }
          }
          .under-line {
            margin-left: 27px;
            border-bottom: 1px solid #e8e8e8;
          }
        }
      }
    }
  }
}

.level-style {
  font-weight: normal;
  border: solid 1px;
  border-radius: 2px;
  font-size: 10px;
  text-align: center;
  display: inline-block;
  height: 15px;
  line-height: 13px;
  padding: 0 5px;
  width: 48px;
  box-sizing: border-box;
}
.level-color-1 {
  color: #f1b20b;
}
.level-color-2 {
  color: #fe6800;
}
.ml10 {
  margin-left: 10px !important;
}
.agreeOpinion {
  border: 1px solid #d9dadc;
  border-radius: 3px;
  line-height: 28px;
  background: #fff;
  .textarea {
    width: 100%;
    height: 160px;
    display: block;
    font-family: "microsoft yahei";
    font-size: 14px;
    color: #999999;
    box-sizing: border-box;
    background: none;
    overflow-y: auto;
    border: none;
    resize: none;
    outline: none;
    padding: 8px 0 0 10px;
  }
}
.dialog-content {
  position: relative;
  .ui-dialog-close {
    position: absolute;
    width: 13px;
    height: 13px;
    background: url(../../../assets/imgs/close.png) 0 0 no-repeat;
    float: right;
    top: 20px;
    right: 20px;
    cursor: pointer;
    &:hover {
      background: url(../../../assets/imgs/close-hover.png) 0 0 no-repeat;
    }
  }
  #approve-agree-title {
    text-align: left;
    height: 20px;
    padding: 40px 0 0 40px;
    color: #333;
    font-size: 18px;
    font-weight: normal;
  }
  .ui-dialog-body {
    padding: 40px;
    padding-bottom: 10px;
  }
  .show-options-num {
    display: inline-block;
    width: 100%;
    text-align: right;
    color: #cccccc;
    padding-top: 5px;
    font-size: 12px;
  }
  .show-options-num b {
    font-weight: 400 !important;
  }
  .button-box {
    height: 56px;
    font-size: 0;
    text-align: right !important;
    margin-top: 30px;
  }
  .ui-button {
    display: inline-block;
    input {
      border-radius: 2px;
      text-align: center;
      background: none;
      border: none;
      outline: none;
      font-family: "microsoft yahei";
      font-size: 14px;
      cursor: pointer;
      padding: 0;
    }
    .dis-r-20 {
      margin-right: 20px;
    }

    .small {
      width: 90px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #000;
    }
    .white {
      background: #ffffff;
      border-color: #d9dadc;
      color: #666666;
      &:hover {
        border-color: #999999;
      }
    }
    .blue {
      background: #4590e4;
      border-color: #4590e4;
      color: #ffffff;
      &:hover {
        background: #419ce3;
        border-color: #419ce3;
      }
    }
  }
  .radio-set {
    margin-bottom: 15px;
    .wrap {
      position: relative;
      padding-bottom: 6px;
      .ui-label {
        float: none;
        text-align: left;
        color: #666;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
      }
      .ui-radio {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
.status-common-icon {
  position: absolute;
  top: 34px;
  width: 120px;
  height: 80px;
  right: 0;
}
.refused-icon {
  background: url(../../../assets/imgs/approveForm-view.png) no-repeat 0 -512px;
}
.revoked-icon {
  background: url(../../../assets/imgs/approveForm-view.png) no-repeat 0 -440px;
}
.finished-icon {
  background: url(../../../assets/imgs/approveForm-view.png) no-repeat -136px -440px;
}
</style>
