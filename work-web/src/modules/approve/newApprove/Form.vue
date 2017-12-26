<template>
	<div class="approve-fr-box">
		<!--表单上面按钮-->
		<div class="form-btns">
			<span class="go-back" @click="goBack">返回</span>
			<div class="btns-right">
				<el-button @click="saveForm">保存</el-button>
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
			</div>
		</div>
		<!--表单内容-->
		<div class="form-contens">
			<!--表单名-->
			<div class="form-title">
				<p class="title">{{approveForm.formName}}</p>
				<p class="form-owner">{{userInfo.name}}<span class="form-owner-sup">{{getDeptAndDutyName}}</span></p>
			</div>
			<!--表单项-->
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
				<template v-for="(element,index) in formElements" >
					<!--文本输入框-->
					<el-form-item v-if="element.typeName=='text'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-input :placeholder="element.placeholder" v-model="ruleForm[element.id]"></el-input>
					</el-form-item>

					<!--数字输入框-->
					<el-form-item v-else-if="element.typeName=='number'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-input :placeholder="element.placeholder" v-model="ruleForm[element.id]"></el-input>
					</el-form-item>

					<!--文本域-->
					<el-form-item v-else-if="element.typeName=='textarea'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-input type="textarea" :rows="5" :placeholder="element.placeholder" v-model="ruleForm[element.id]">
					</el-input>
					</el-form-item>

					<!--单选框-->
					<el-form-item v-else-if="element.typeName=='radio'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-radio-group v-model="ruleForm[element.id]">
					    <el-radio v-for="item in element.items" :label="item.id.toString()" :key="item.id">{{item.item}}</el-radio>
					</el-radio-group>
					</el-form-item>

					<!--多选框-->
					<el-form-item v-else-if="element.typeName=='checkbox'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-checkbox-group v-model="ruleForm[element.id]">
					    <el-checkbox v-for="item in element.items" :label="item.id" :key="item.id">{{item.item}}</el-checkbox>
					  </el-checkbox-group>
					</el-form-item>

					<!--单日历-无时间-->
					<el-form-item v-else-if="element.typeName=='date' && element.format=='yyyy-MM-dd'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-date-picker type="date"  :placeholder="element.placeholder" :format="element.format" :editable="false" class="size" v-model="ruleForm[element.id]">
				    </el-date-picker>
					</el-form-item>

					<!--单日历-有时间-->
					<el-form-item v-else-if="element.typeName=='date' && element.format=='yyyy-MM-dd HH:mm'" :label="element.title" :prop="element.id+''" key="element.id" :key="index">
						<el-date-picker type="datetime"
				      :placeholder="element.placeholder" :format="element.format" :editable="false" class="size" v-model="ruleForm[element.id]">
				    </el-date-picker>
					</el-form-item>

					<!--双日历-无时间-->
					<template v-else-if="element.typeName=='groupDate' && element.format=='yyyy-MM-dd'">
						<el-form-item :label="element.title" :prop="element.id+''" key="element.id" :key="index">
								<el-date-picker  type="daterange" :placeholder="element.placeholder" :editable="false" class="size" range-separator="    至    " :format="element.format" v-model="ruleForm[element.id]" @change="groupDateChange(element,index)"></el-date-picker>
						</el-form-item>
						<el-form-item label="总时长" :key="index">
							<input class="input-reset" v-model="element.days" @keydown="formatKeyDown($event)" @keyup="formatKeyUp($event,element,'days',3,index)" />
							<span class="input-text">天</span>
							<input class="input-reset" v-model="element.hours" @keydown="formatKeyDown($event)" @keyup="formatKeyUp($event,element,'hours',2,index)" />
							<span class="input-text">时</span>
							<input class="input-reset" v-model="element.minutes" @keydown="formatKeyDown($event)" @keyup="formatKeyUp($event,element,'minutes',2,index)"/>
							<span class="input-text">分</span>
						</el-form-item>
					</template>

					<!--双日历-有时间-->
					<template v-else-if="element.typeName=='groupDate' && element.format=='yyyy-MM-dd HH:mm'">
						<el-form-item  :label="element.title" :prop="element.id+''" key="element.id" :key="index">
								<el-date-picker  type="datetimerange" :placeholder="element.placeholder"  :editable="false" class="size" range-separator="    至    " :format="element.format" v-model="ruleForm[element.id]" @change="groupDateChange(element,index)"></el-date-picker>
						</el-form-item>
						<el-form-item label="总时长" :key="index">
							<input class="input-reset" v-model="element.days" @keydown="formatKeyDown($event)" @keyup="formatKeyUp($event,element,'days',3,index)" />
							<span class="input-text">天</span>
							<input class="input-reset" v-model="element.hours" @keydown="formatKeyDown($event)" @keyup="formatKeyUp($event,element,'hours',2,index)" />
							<span class="input-text">时</span>
							<input class="input-reset" v-model="element.minutes" @keydown="formatKeyDown($event)" @keyup="formatKeyUp($event,element,'minutes',2,index)"/>
							<span class="input-text">分</span>
						</el-form-item>
					</template>
				</template>

				<!--紧急程度-->
				<el-form-item>
					<el-select v-model="urgencyValue" placeholder="请选择">
						<el-option
						v-for="item in urgencyOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<!--流程节点-->
			<div class="form-flows">
				<p class="title">审批流程<span class="supplement">( 审批人显示为该员工的主部门职务 )</span></p>
				<div v-for="(flow,index) in flows" class="flow" :class="flow.flowError ? 'flow-error': ''" :key="index">
					<div class="flow-contents">
						<p class="flow-name">{{flow.name}}</p>
            <div class="info-name-dept">
              <div class = "info-img" :style="{backgroundColor: flow.iconColor}">{{  takeLastTwo(flow.staffName)}}</div>
                <p class="info-content" v-if="flow.assignee == ''">请添加审批人</p>
                <p class="info-content" v-else>
                  <span class="name">{{flow.staffName}}</span>
                  <span class="dept-duty" >
                    <template v-for="(item,index) in flow.deptDutys">
                      {{item.deptDuty}}
                      <span class="part-time" v-if="item.partTime==1" :key="index">兼</span>
                      <span v-if="index!=flow.deptDutys.length-1" :key="index">,</span>
                    </template>
                  </span>
                </p>
            </div>
					</div>
					<div class="flow-btns">
						<template v-if="flow.assignee == ''">
              <input type="button" value="添加" title="添加" class=" fl-btn flow-new-btn " @click="chooseApprover(flow,index)">
						</template>
						<template v-else> 
              <input type="button" :disabled="flow.isAssigneeChoice ? false : true " value="编辑" title="编辑" class="fl-btn flow-new-btn " :class="{disabled : !flow.isAssigneeChoice}" @click="chooseApprover(flow,index)">
						</template>
						<input type="button" :disabled="flow.isPromoterDelete ? false : true " value="删除" title="删除" class="fl-btn flow-del-btn" :class="{disabled : !flow.isPromoterDelete}"  @click="deleteApprover(index)">
						<!-- <el-button :disabled="flow.isPromoterDelete ? false : true " class="flow-btn" @click="deleteApprover(index)">删除</el-button> -->
					</div>
					<p class="under-line" :class="index+1==flows.length ? 'line-hide': ''"></p>
					<div class="flow-icon">
						<div :class="index==0 ? 'up-line' : ''"></div>
						<div class="flow-dot"></div>
						<div :class="index+1==flows.length ? 'down-line' : ''"></div>
					</div>

				</div>
			</div>
		</div>
		<!--添加或编辑审批人的dialog-->
		<el-dialog :visible.sync="approverDialogVisible" custom-class="select-dialog">
			<staffSelect :staffs="staffInfos" :depts="baseDeptInfo" :dept-staff="deptStaff" :init-staff="assigneeId" @pushSelectedValue="getSelectedValue"></staffSelect>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="approverDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="selectedConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>
<script>
import { mapMutations } from "vuex";
import dateRangeValue from "./mixins/dateRangeValue";
import {
  fetchApproveFormElements,
  fetchApproveFormFlows,
  postApproveForm,
  getViewFormData,
  approveApdate,
  approveModify
} from "@/api/approve";
import staffSelect from "@/components/StaffSelect";
import { fetchCacheStaffInfos } from "@/api/currency";
import { fetchDeptlist } from "@/api/contact";
import { userInfo } from "@/api/gome-header";
import mixin from "@/modules/approve/mixin";
export default {
  mixins: [dateRangeValue, mixin],
  components: { staffSelect },
  created() {
    this.formId = this.$route.params.formId || "";
    this.approveId = this.$route.params.approveId || "";
    this.flowId = this.$route.params.flowId || "";
    this.getUserInfo();
    this.getBaseDeptInfo();
    this.getStaffInfo();
    if (this.$route.name == "createForm") {
      this.getFormElements();
      this.getFormFlows();
      // this.setIconColor()
    } else if (
      this.$route.name == "apply-redraft" ||
      this.$route.name == "approval-resubmit"
    ) {
      this.approveId = this.$route.params.approveId || "";
      this.getDraftData();
    }
  },
  data() {
    return {
      urgencyValue: "0",
      urgencyOptions: [
        {
          value: "0",
          label: "一般"
        },
        {
          value: "1",
          label: "较紧急"
        },
        {
          value: "2",
          label: "很紧急"
        }
      ],
      userInfo: {},
      formElements: [],
      flows: [], //审批流程节点数组
      approveForm: {}, //表单的值
      rules: {}, //form表单的验证规则
      ruleForm: {}, //存取form表单值
      flowId: "",
      formId: "", //新建审批单时的表单id
      approveId: "", //草稿编辑时的审批单id
      assignInfo: {}, //选人控件选中的员工信息
      staffInfos: [], //全量员工信息
      lightList: [], //全量职务信息
      baseDeptInfo: {}, //全量部门信息
      approverDialogVisible: false, //添加审批人dialog是否显示 false-不显示 true-显示
      deptStaff: {}, //部门与对应员工组成的对象
      assigneeId: "", //流程节点的审批人id
      flowIndex: -1 //添加或编辑审批节点时对应的流程节点的index值
    };
  },
  mounted() {},
  computed: {
    getDeptAndDutyName() {
      let staffId = this.userInfo.staffs[0].id;
      let cacheStaffs = JSON.parse(sessionStorage.cacheStaffInfos);
      if (cacheStaffs && staffId) {
        for (let i = 0; i < cacheStaffs.length; i++) {
          if (cacheStaffs[i].id == staffId) {
            let deptDutyName = "";
            if (cacheStaffs[i].deptName && cacheStaffs[i].dutyName) {
              deptDutyName =
                cacheStaffs[i].deptName + " - " + cacheStaffs[i].dutyName;
            } else if (cacheStaffs[i].deptName && !cacheStaffs[i].dutyName) {
              deptDutyName = cacheStaffs[i].deptName;
            } else if (!cacheStaffs[i].deptName && cacheStaffs[i].dutyName) {
              deptDutyName = cacheStaffs[i].dutyName;
            } else {
              deptDutyName = "";
            }
            return deptDutyName;
          }
        }
      }
      return "";
    }
  },
  methods: {
    async getDraftData() {
      let res = await getViewFormData({
        approveId: this.approveId,
        companyId: 1
      });
      let formData = res.data;
      if (formData.code === 0) {
        this.approveForm = formData.data.approveForms;
        this.formElements = formData.data.values;
        this.flows = JSON.parse(formData.data.assigneeInfo.assigneeInfo);
        this.urgencyValue = formData.data.approves.urgencyLevel + "";
        this.formElementsInit();
        this.dtaftFlowsInit();
      }
    },
    dtaftFlowsInit() {
      this.flows.forEach(item => {
        item.assignee = item.value;
      });
      this.flowsInit();
    },

    /**
	  * 新建或编辑表单时获取表单元素数据
	  */
    async getFormElements() {
      let formElements;
      if (this.formId) {
        formElements = await fetchApproveFormElements({
          formId: this.formId
        });
        this.formElements = formElements.data.data.elements;
        this.approveForm = formElements.data.data.approveForms;
      }
      // if (this.approveId) {
      //   formElements = await fetchApproveFormElements({
      //     approveId: this.approveId
      //   });
      //   this.formElements = formElements.data.data.values;
      //   this.approveForm = formElements.data.data.approves;
      // }
      this.formElementsInit();
      this.flowsInit();
    },
    /** 
	  * 获取审批流程节点
	  */
    async getFormFlows() {
      if (this.flowId) {
        let flows = await fetchApproveFormFlows({
          flowId: this.flowId,
          companyId: sessionStorage.getItem("companyId"),
          key: this.$route.query.key
        });
        console.log(flows);
        this.flows = flows.data.data.process.userTasks;
        this.typeId = flows.data.data.flowId;
        this.setIconColor();
        this.flowsInit();
      }
    },
    /**
	  * 对表单元素数据的处理
	  */
    formElementsInit() {
      //对元素按照orderCode进行排序
      this.formElements.sort(function(element1, element2) {
        return element1.orderCode - element2.orderCode;
      });

      for (let i = 0, length = this.formElements.length; i < length; i++) {
        let formElement = this.formElements[i];
        let formElementId = formElement.id || formElement.formElementId;
        formElement.id = formElementId.toString();
        //如果元素的extral存在转换为json格式
        if (formElement.extra1) {
          formElement.extra1 = JSON.parse(formElement.extra1);
        }
        //根据表单元素创建表单验证规则对象
        let rule = [],
          ruleObj = {};
        if (formElement.isMust) {
          ruleObj.required = true;
        } else {
          ruleObj.required = false;
        }
        ruleObj.trigger = "change";
        //对于输入框设置
        if (
          formElement.typeName == "text" ||
          formElement.typeName == "textarea" ||
          formElement.typeName == "number"
        ) {
          ruleObj.message = "请输入" + formElement.title;
          this.$set(this.ruleForm, formElement.id, "");
          if (formElement.value) {
            this.$set(this.ruleForm, formElement.id, formElement.value);
          } else {
            this.$set(this.ruleForm, formElement.id, "");
          }
        }
        //对于radio的设置
        if (formElement.typeName == "radio") {
          ruleObj.message = "请选择" + formElement.title;
          if (formElement.value) {
            this.$set(this.ruleForm, formElement.id, formElement.value);
          } else {
            this.$set(this.ruleForm, formElement.id, "");
          }
        }
        //对于checkbox的设置
        if (formElement.typeName == "checkbox") {
          ruleObj.message = "请至少选择一个" + formElement.title;
          ruleObj.type = "array";
          this.$set(this.ruleForm, formElement.id, []);
          if (formElement.value) {
            let valueArr = formElement.value
              .split(",")
              .map(item => Number(item));
            this.$set(this.ruleForm, formElement.id, valueArr);
          } else {
            this.$set(this.ruleForm, formElement.id, []);
          }
        }
        //对于单日历的设置
        if (formElement.typeName == "date") {
          ruleObj.message = "请选择" + formElement.title;
          ruleObj.type = "date";
          if (formElement.value) {
            this.$set(
              this.ruleForm,
              formElement.id,
              new Date(Number(formElement.value))
            );
          } else {
            this.$set(this.ruleForm, formElement.id, "");
          }
        }
        //对于双日历的设置
        if (formElement.typeName == "groupDate") {
          ruleObj.message = "请选择" + formElement.title;
          ruleObj.type = "array";
          //设置总时长的默认值
          formElement.days = 0;
          formElement.hours = 0;
          formElement.minutes = 0;
          if (formElement.value) {
            this.$set(
              this.ruleForm,
              formElement.id,
              this.jsonToTime(JSON.parse(formElement.value))
            );
            formElement.days = JSON.parse(formElement.value).days;
            formElement.hours = JSON.parse(formElement.value).hours;
            formElement.minutes = JSON.parse(formElement.value).minutes;
          } else {
            this.$set(this.ruleForm, formElement.id, [new Date(), new Date()]);
          }
        }
        rule.push(ruleObj);
        this.rules[formElement.id] = rule;
      }
    },
    /**
	  * 对流程节点数据进行处理,如果有审批人配置审批人部门与职务信息
	  */
    flowsInit() {
      for (let i = 0, length = this.flows.length; i < length; i++) {
        let flow = this.flows[i];
        flow.deptDutys = [];
        flow.flowError = false;
        if (flow.assignee || flow.assignNow) {
          this.staffInfoHandle(flow.assignee, flow);
        }
      }
    },
    /**
	  * 保存或提交时，处理并封装表单元素数据
	  */
    getElementsValue() {
      for (let i = 0, length = this.formElements.length; i < length; i++) {
        let formElement = this.formElements[i];
        if (formElement.typeName == "checkbox") {
          formElement.value = this.ruleForm[formElement.id].toString();
        } else if (formElement.typeName == "date") {
          formElement.value = new Date(this.ruleForm[formElement.id]).getTime();
        } else if (formElement.typeName == "groupDate") {
          let groupDateValue = JSON.parse(
            this.timeToJson(this.ruleForm[formElement.id])
          );
          groupDateValue.days = formElement.days;
          groupDateValue.hours = formElement.hours;
          groupDateValue.minutes = formElement.minutes;
          formElement.value = JSON.stringify(groupDateValue);
          // delete formElement.days
          // delete formElement.hours
          // delete formElement.minutes
        } else {
          formElement.value = this.ruleForm[formElement.id];
        }
        formElement.id = Number(formElement.id);
      }
    },
    /**
	  * 保存或提交时，处理流程节点数据
	  */
    getFlowsValue() {
      let assignees = [];
      for (let i = 0, length = this.flows.length; i < length; i++) {
        let flow = this.flows[i];
        let assignee = {};
        assignee.name = flow.name;
        assignee.assignee = "${" + flow.id + "}";
        assignee.isPromoterDelete = flow.isPromoterDelete;
        assignee.isAssigneeChoice = flow.isAssigneeChoice;
        assignee.taskId = flow.id;
        assignee.iconColor = flow.iconColor;
        assignee.colorFont = this.takeLastTwo(flow.staffName);
        assignee.value = flow.assignee;
        assignees.push(assignee);
      }
      return assignees;
    },
    /**
	  * 保存或提交时，拼接成向后端传输的数据
	  * type 表示是保存还是提交 1-保存为草稿 2-提交并启动流程
	  */
    composeData(type) {
      let data = {};
      if (type == 1) {
        data.isSubmit = false;
      } else {
        data.isSubmit = true;
      }
      let typeId = "typeId";
      let typeIdVal = "";
      if (this.$route.name == "createForm") {
        typeId = "typeId";
        typeIdVal = this.flowId;
      } else if (this.$route.name == "apply-redraft") {
        typeId = "id";
        typeIdVal = this.approveId;
      } else if (this.$route.name == "approval-resubmit") {
        typeId = "id";
        typeIdVal = this.approveId;
      }
      data.approves = {
        [typeId]: typeIdVal,
        cid: this.approveForm.cid,
        urgencyLevel: Number(this.urgencyValue)
      };
      if (this.$route.name == "approval-resubmit") {
        data.approves.status = 4;
        data.approves.deleted = this.$route.params.deleted;
        data.approves.ownerId = Number(sessionStorage.userId);
        data.approves.typeId = this.$route.params.typeId;
      }
      data.assigneeInfo = {
        assigneeInfo: JSON.stringify(this.getFlowsValue())
      };
      this.getElementsValue();
      // data.values = this.formElements;
      let values = this.formElements;
      let ar = [];
      values.forEach(v => {
        let s = {
          formId: v.formId,
          elementId: v.elementId,
          title: v.title,
          placeholder: v.placeholder,
          isMust: v.isMust,
          format: v.format,
          orderCode: v.orderCode,
          formElementId: v.id,
          formElementCode: v.formElementCode,
          valueId: v.valueId,
          value: v.value
        };
        ar.push(s);
      });
      data.values = ar;
      //console.log(JSON.stringify(data))
      return data;
    },
    /**
	  * 保存或提交时，与服务端请求
	  */
    async postForm(options) {
      let res;
      if (this.$route.name == "apply-redraft") {
        res = await approveApdate(options);
      } else if (this.$route.name == "createForm") {
        res = await postApproveForm(options);
      } else if (this.$route.name == "approval-resubmit") {
        res = await approveModify(options);
      }

      if (res.data.code == 0) {
        this.getMyApproveCount();
      }
      if (res.data.code == 0) {
        let msg = "已成功保存到审批草稿";
        let target = "apply-redraft";
        if (options.isSubmit) {
          msg = "提交成功";
          target = "approval-launch";
        }
        this.$toast({
          success: true,
          message: msg
        });
        this.$router.push({
          name: target,
          params: { approveId: res.data.data.approveId }
        });
      }
    },
    /** 
	  * 提交按钮对表单数据验证
	  */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //封装数据并发送请求
          // this.getElementsValue()
          //判断审批流程节点是否添加审批人
          if (!this.flowsEnableCheck()) {
            return false;
          } else if (!this.flowsSelectedCheck()) {
            this.$toast({
              success: false,
              message: "请添加审批人"
            });
            return false;
          } else {
            // let isDraft = false;
            // if (this.$route.name == "apply-redraft") {
            //   isDraft = true;
            // }
            // let obj = {
            //   'isDraft':isDraft
            // }
            let data = this.composeData(2);
            this.postForm(data);
          }
        } else {
          return false;
        }
      });
    },
    /**
	  * 保存审批单
	  */
    saveForm() {
      // if (this.$route.name == "apply-redraft") {
      //   this.updateDraft(1);
      //   return;
      // }
      //判断审批流程节点是否添加审批人
      if (!this.flowsEnableCheck()) {
        return false;
      } else if (!this.flowsSelectedCheck()) {
        this.$toast({
          success: false,
          message: "请添加审批人"
        });
        return false;
      } else {
        //组装数据
        let data = this.composeData(1);
        // let isDraft = false;
        // if (this.$route.name == "apply-redraft") {
        //   isDraft = true;
        // }
        this.postForm(data);
      }
    },
    // 草稿的保存或者提交
    updateDraft(composeDataFlag) {
      //TODO
      // 新建和编辑 表单 的头像
      // 已完成已拒绝图片
    },
    /**
		* 验证不可编辑不可删除的节点是否选择审批人
		*/
    flowsEnableCheck() {
      let flag = true;
      for (let i = 0, length = this.flows.length; i < length; i++) {
        let flow = this.flows[i];
        if (
          !flow.isPromoterDelete &&
          !flow.isAssigneeChoice &&
          !flow.assignee
        ) {
          flow.flowError = true;
          this.flows.splice(i, 1, flow);
          flag = false;
        }
      }
      return flag;
    },
    /**
		* 验证所有的审批节点是否有添加审批人
		*/
    flowsSelectedCheck() {
      for (let i = 0, length = this.flows.length; i < length; i++) {
        let flow = this.flows[i];
        if (!flow.assignee) {
          return false;
        }
      }
      return true;
    },
    /**
		* 添加或编辑审批人
		*/
    chooseApprover(flow, index) {
      this.CHANGE_APPROVE_TREE_SELECTED(-1);
      this.assigneeId = flow.assignee;
      this.flowIndex = index;
      if (!this.assigneeId) {
        this.assignInfo = {};
      }
      if (JSON.stringify(this.deptStaff) == "{}") {
        let deptStaff = {};
        for (let i = 0, length = this.staffInfos.length; i < length; i++) {
          let staff = this.staffInfos[i];

          if (!deptStaff[staff.deptId]) {
            deptStaff[staff.deptId] = [];
          }
          deptStaff[staff.deptId].push(staff);
        }
        this.deptStaff = deptStaff;
      }
      this.approverDialogVisible = true;
    },
    /**
		* 删除审批节点
		*/
    deleteApprover(index) {
      this.flows.splice(index, 1);
    },
    /**
		* 获取选人控件选中的值
		* option 选中的员工对象
		*/
    getSelectedValue(option) {
      this.assignInfo = option;
      this.assigneeId = this.assignInfo.id;
    },
    /**
	  * 选人控件dialog的确定按钮点击作用 修改流程数组中对应流程节点的审批人
	  */
    selectedConfirm() {
      if (JSON.stringify(this.assignInfo) == "{}") {
        this.$toast({
          success: false,
          message: "不能为空"
        });
        return false;
      } else {
        let flow = this.flows[this.flowIndex];
        flow.deptDutys = [];
        flow.assignee = this.assignInfo.id;
        flow.flowError = false;
        this.flows.splice(this.flowIndex, 1, flow);
        this.staffInfoHandle(this.assignInfo.id, this.flows[this.flowIndex]);
        this.approverDialogVisible = false;
      }
    },
    /**
	  * 处理审批人信息的显示，包括姓名 部门 职务
	  * staffId 员工id
	  * flow 流程节点对象
	  */
    staffInfoHandle(staffId, flow) {
      let deptDutyInfo = "";
      for (let j in this.staffInfos) {
        let staffInfo = this.staffInfos[j];
        if (staffInfo.id != staffId) {
          continue;
        }
        flow.staffName = staffInfo.staffName;
        if (staffInfo.deptName && staffInfo.dutyName) {
          deptDutyInfo = staffInfo.deptName + " - " + staffInfo.dutyName;
        } else if (staffInfo.deptName && !staffInfo.dutyName) {
          deptDutyInfo = staffInfo.deptName;
        } else if (!staffInfo.deptName && staffInfo.dutyName) {
          deptDutyInfo = staffInfo.dutyName;
        } else {
          deptDutyInfo = "";
        }
        if (staffInfo.partTime == 1) {
          flow.deptDutys.push({
            deptDuty: deptDutyInfo,
            partTime: staffInfo.partTime
          });
        } else {
          flow.deptDutys.unshift({
            deptDuty: deptDutyInfo,
            partTime: staffInfo.partTime
          });
        }
      }
    },
    /**
		* 双日历的change事件
		*/
    groupDateChange(element, index) {
      let dateObj = JSON.parse(this.timeToJson(this.ruleForm[element.id]));
      element.days = dateObj.days;
      element.hours = dateObj.hours;
      element.minutes = dateObj.minutes;
      this.formElements.splice(index, 1, element);
    },
    /**
		* 总时长的输入框绑定keydown事件
		*/
    formatKeyDown(event) {
      let keycode, keychar;
      event = event || window.event;
      keycode = event.which || event.keycode;
      if (keycode == 8) {
        //Backspace 键
        return true;
      }
      //暂时通过keyCode对应键码值来将数字键盘数字进行区分
      if (96 <= keycode < 105) {
        return true;
      }
      keychar = String.fromCharCode(keycode);
      let reg = new RegExp(/^\+?[0-9]*$/);
      return reg.test(keychar);
    },
    /**
		* 总时长的输入框绑定keyup事件
		* element 该表单元素对象
		* attr  对应的时长中的属性 days hours minutes
		* number 整数的位数
		* index 该表单元素对象在整个表单数组中的index值
		*/
    formatKeyUp(event, element, attr, number, index) {
      let keycode, keychar;
      event = event || window.event;
      keycode = event.which || event.keycode;
      if (keycode == 8) {
        //Backspace 键
        return true;
      }
      // let regStr=/^0[1-9]{}
      var reg = new RegExp(/^\+?[0-9][0-9]*$/);
      if (!reg.test(element[attr])) {
        element[attr] = 0;
        this.formElements.splice(index, 1, element);
      } else {
        if (element[attr].substr(0, 1) == 0) {
          element[attr] = element[attr].substr(1, number);
          this.formElements.splice(index, 1, element);
        } else {
          element[attr] = element[attr].substr(0, number);
          this.formElements.splice(index, 1, element);
        }
      }
    },
    async getUserInfo() {
      if (!sessionStorage.getItem("userInfo")) {
        const res = await userInfo();
        this.userInfo = res.data.data;
        sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
      } else {
        this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      }
    },
    async getStaffInfo() {
      this.staffInfos = JSON.parse(sessionStorage.getItem("cacheStaffInfos"));
      // if (!sessionStorage.getItem("cacheStaffInfos")) {
      //   let staffInfos = await fetchCacheStaffInfos({
      //       companyId:sessionStorage.getItem('companyId')
      //   });
      //   this.staffInfos = staffInfos.data;
      //   sessionStorage.setItem(
      //     "cacheStaffInfos",
      //     JSON.stringify(staffInfos.data)
      //   );
      // } else {
      //   this.staffInfos = JSON.parse(sessionStorage.getItem("cacheStaffInfos"));
      // }
    },
    // 其他方法
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
          companyId: 1,
          tag: new Date().getTime()
        }
      };
      let res = await fetchDeptlist(options);
      //存储部门树到sessionStorage
      sessionStorage.setItem("deptList", JSON.stringify(res.data.data));
      let dept = res.data.data.dept;
      return dept;
    },
    goBack() {
      this.$router.back();
    },
    takeLastTwo(name) {
      if (name) {
        return name.substr(-2);
      } else {
        return "";
      }
    },
    setIconColor() {
      this.flows.forEach(flow => {
        let color = this.randomColor(Number(flow.assignee));
        this.$set(flow, "iconColor", color);
      });
    },
    ...mapMutations(["CHANGE_APPROVE_TREE_SELECTED"])
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$img-path: "../../../assets/imgs";
@mixin size($width:auto,$height:auto) {
  width: $width;
  height: $height;
}
.go-back {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  color: #666;
  background: url("#{$img-path}/approveForm-view.png") no-repeat -100px -22px;
  margin: 15px 316px 15px 25px;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 12px;
}
.approve-fr-box {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: left;
  min-width: 724px;
  .form-btns {
    position: absolute;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #d2d2d2;
    background-color: #f7f7f7;
    font: 14px/1.4 "Microsoft YaHei";
    .btns-right {
      float: right;
      margin: 14px 16px;
    }
  }
  //表单样式
  .form-contens {
    position: absolute;
    overflow-y: auto;
    width: 100%;
    top: 61px;
    bottom: 0;
    padding: 0 50px 0 50px;
    box-sizing: border-box;
    .form-title {
      margin: 50px 0 56px;
      .title {
        margin-bottom: 26px;
        font-size: 22px;
        font-weight: bold;
      }
    }
    .form-owner {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      .form-owner-sup {
        padding-left: 15px;
        font-size: 14px;
        color: #999;
      }
    }
    .input-reset {
      border: none;
      width: 30px;
      text-align: center;
      padding: 0;
      height: 17px;
      color: #4590e4;
      border-bottom: 2px solid #333;
      border-radius: 0;
      margin-top: 10px;
    }
    .input-text {
      float: left;
      font-size: 16px;
    }
  }
  //覆写element ui的checkbox等样式
  .el-form-item {
    margin-bottom: 48px;
    .el-checkbox {
      width: 100%;
    }
    .size {
      width: 355px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  //流程节点样式
  .form-flows {
    margin-bottom: 100px;
    border-bottom: 1px solid #e8e8e8;
    .title {
      height: 40px;
      border-bottom: 1px solid #d2d2d2;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      .supplement {
        color: #999;
        font-weight: 100;
        padding-left: 5px;
        font-size: 14px;
      }
    }
    .flow {
      position: relative;
      overflow: hidden;
      height: 100%;
      // border-left: 1px solid #d2d2d2;
    }
    .flow-error {
      box-shadow: 0 0 2px red;
    }
    .flow-contents {
      width: 77%;
      float: left;
      padding: 27px 0 24px;
      position: relative;
      z-index: 49;
      margin-left: 7px;
      .flow-name {
        margin-left: 27px;
        font-size: 18px;
        color: #333;
        margin-bottom: 13px;
      }
      .info-content {
        float: left;
        width: 86%;
        padding-left: 10px;
        .name {
          max-width: 30%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          display: block;
        }
        .dept-duty {
          width: 83%;
          vertical-align: top;
        }
        .part-time {
          padding: 2px 4px;
          margin-right: 10px;
          border-radius: 4px;
          background-color: #f0a522;
          color: #fff;
          font-size: 12px;
        }
      }
    }
    .flow-btns {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -17px;
      .flow-btn {
        width: 100px;
        height: 34px;
        padding: 0;
        background: #f7f7f7;
        border-color: #d9dadc;
        color: #666666;
        &:hover {
          background: #fff;
        }
      }
      .is-disabled:hover {
        background: #f7f7f7;
      }
    }
    .under-line {
      float: left;
      width: 100%;
      margin-left: 27px;
      height: 1px;
      background: #e8e8e8;
    }
    .line-hide {
      display: none;
    }
    .flow-icon {
      width: 20px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 6px;
      bottom: 0;
      border-left: 1px solid #d2d2d2;
      .flow-dot {
        position: absolute;
        background-color: #ffffff;
        left: -7px;
        top: 34px;
        height: 9px;
        width: 9px;
        border-radius: 50%;
        border: solid 2px #cccccc;
        z-index: 50;
      }
      .up-line {
        width: 1px;
        height: 34px;
        background: #fff;
        margin-left: -1px;
      }
      .down-line {
        width: 1px;
        position: absolute;
        top: 41px;
        bottom: 0;
        background: #fff;
        margin-left: -1px;
      }
    }
  }
}
</style>
<style lang="scss">
$img-path: "../../../assets/imgs";
.approve-fr-box {
  .el-form-item__label {
    width: 100%;
    margin-bottom: 10px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  //选人dialog样式
  .select-dialog {
    width: 562px;
    height: 630px;
  }
  //
  .input-reset {
    width: 30px;
    float: left;
    .el-input__inner {
      border: none;
      width: 30px;
      text-align: center;
      padding: 0;
      height: 17px;
      color: #4590e4;
      border-bottom: 2px solid #333;
      border-radius: 0;
    }
  }
  .input-text {
    float: left;
    font-size: 16px;
  }
  .fl-btn {
    height: 44px;
    line-height: 32px;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    width: 44px;
    border-radius: 50%;
    border: none;
    color: transparent;
    margin-right: 40px;
  }
  .flow-new-btn {
    background: url("#{$img-path}/appicon.png") no-repeat -47px -7px;
    &:hover {
      background: url("#{$img-path}/appicon.png") no-repeat -103px -7px;
    }
    &.disabled {
      cursor: not-allowed;
      background: url("#{$img-path}/appicon.png") no-repeat -270px -65px;
    }
  }
  .flow-del-btn {
    background: url("#{$img-path}/appicon.png") no-repeat -158px -8px;
    &:hover {
      background: url("#{$img-path}/appicon.png") no-repeat -214px -9px;
    }
    &.disabled {
      cursor: not-allowed;
      background: url("#{$img-path}/appicon.png") no-repeat -327px -65px;
    }
  }
  .info-name-dept {
    line-height: 24px;
    color: #333;
    font-size: 12px;
    margin-left: 27px;
    word-break: break-all;
    overflow: hidden;
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
    // .info-content {
    //   float: left;
    //   width: 86%;
    //   padding-left: 10px;
    // }
  }
}
</style>
