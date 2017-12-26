<template>
    <div class="formlist-container">
        <ul class="formlist">
            <li class="category clearfix"  v-for="(category, index) in modules" :key="index">
                <div class="category-title">
                    <p class="group">{{ category.name | ifTooLong }}
                        <span class="num">({{category.flows.length}})</span>
                    </p>
                </div>
                <ul class="cate-content">
                    <li 
                    v-for="(flow, idx) in category.flows" :key="idx"
                    @click="gotoCreateForm(flow)"
 
                    class="module" >
                        <div class="content">
                            <img :src="require('../../../assets/imgs/approve/form/' + flow.icon + '.png')" class="imgs"/>
                            <p class="flow-name">{{ flow.name | ifMoreThan5 }}</p>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import { getFlowList } from "@/api/approve";
export default {
  name: "formlist",
  data() {
    return {
      modules: [],
      baseUrl: "../../../assets/imgs/approve/form/",
      png: ".png"
    };
  },
  async created() {
    const companyId = sessionStorage.getItem('companyId')
    let res = await getFlowList({
      companyId: companyId,
      pageNo: 1,
      pageSize: 100
    });
    let code = res && res.data && res.data.code;
    if (code === 0) {
      this.modules = res.data.data.list;
      var appgroup = new Array()
      appgroup.push({value:"", label:"全部审批组"})
      for (var i=0; i < this.modules.length; i++ ) 
           if(this.modules[i] != undefined){
              var obj = new Object()
              appgroup.push({value:this.modules[i].id, label:this.modules[i].name})
           }  
      }
      sessionStorage.setItem('approveGroup', JSON.stringify(appgroup))
  },
  methods: {
    gotoCreateForm(flow) {
      this.$router.push({
        name: "createForm",
        query: {
          flowId: flow.id,
          key: flow.procdefId,
          formId: flow.formId
        },
        params: {
           flowId: flow.id,
          key: flow.procdefId,
          formId: flow.formId
        }
      });
    }
  },
  filters: {
    ifMoreThan5(name) {
      return name.length > 5 ? name.substring(0, 4) + "..." : name;
    },
    ifTooLong(name) {
      return name.length > 15 ? name.substring(0, 14) + "..." : name;
    }
  }
};
</script>
<style lang="scss" scoped>
.formlist-container {
  height: 100%;
  overflow-y: scroll;
  .category {
    margin: 40px 40px 0 40px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 28px;
    .category-title {
      color: #333;
      font-size: 18px;
      display: block;
      margin-bottom: 28px;
      line-height: 25px;
      text-align: left;
    }
    .cate-content {
      .module {
        width: 94px;
        height: 94px;
        margin-right: 20px;
        float: left;
        cursor: pointer;
        text-align: center;
        border-radius: 3px;
        margin-bottom: 28px;
        .imgs {
          width: 44px;
          height: 44px;
          display: block;
          border-radius: 3px;
          margin: 12px auto 10px;
        }
        .flow-name {
          color: #333;
          font-size: 12px;
          display: block;
          line-height: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 70px;
          margin: 0 auto;
        }
        &:hover {
          background: rgba(225, 225, 225, 0.5);
        }
      }
    }
  }
}
</style>
  

