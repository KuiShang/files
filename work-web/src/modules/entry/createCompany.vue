<template>
    <div class="login-container">

        <!-- 注册公司第一步 -->
        <form method="post" v-if='first' autocomplete="on" class="forgetPass-content ">
            <div class="tip-login">
                <p class="active-text">注册企业账号</p>
                <span class="setTip">注册一个企业账号，享受各平台同步服务</span>
            </div>
            <div class="tip-form">
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="usernameCheck" @focus="inputFocus('activeUsername')" v-model="username" type="text" :class="['login-form-input', { 'warn-input': !usernameValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeUsername, 'warn-msg': !usernameValid }]" v-html="usernameMsg" @click="redriectToLogin"></span>
                </div>
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="captchaCheck" @focus="inputFocus('activeCaptcha')" v-model="captcha" type="text" :class="['login-form-input', { 'warn-input': !captchaValid }]" autocomplete="off" />
                        <img :src="captchaImgSrc" alt="" class="captcha" @click="getCaptchaPicFromServer">
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeCaptcha, 'warn-msg': !captchaValid }]">{{ captchaMsg }}</span>
                </div>
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="phoneMessageCheck" @focus="inputFocus('activePhoneMessage')" v-model="phoneMessage" type="text" :class="['login-form-input', { 'warn-input': !phoneMessageValid }]" autocomplete="off" />
                        <p class="get-message" :class="{'enable': getSmsCodeTipFlag }" @click="getVerificationCode">{{getSmsCodeTip}}</p>
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activePhoneMessage, 'warn-msg': !phoneMessageValid }]">{{ phoneMessageMsg }}</span>
                </div>
                <div class="agreement">
                    <span>点击“下一步”即代表您同意</span>
                    <a href="" target="_blank">《美办用户协议及隐私政策》</a>
                </div>
                <div class="mess">
                    <a href="javascript:;" v-on:click="nextStep" >下一步</a>
                    <span class="cue">&nbsp;还有两步</span>
                </div>
            </div>
        </form>

        <!-- 注册公司第二步 -->
        <form method="post" v-if='two' autocomplete="on" class="forgetPass-content ">
            <div class="tip-login">
                <p class="active-text">设置密码</p>
            </div>
            <div class="tip-form">
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="setPasswordCheck" @focus="inputFocus('activeSetPassword')" v-model="setPassword" type="password" :class="['login-form-input', { 'warn-input': !setPasswordValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeSetPassword, 'warn-msg': !setPasswordValid }]">{{ setPasswordMsg }}</span>
                </div>
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="echoPassCheck" @focus="inputFocus('activeEchoPass')" v-model="echoPass" type="password" :class="['login-form-input', { 'warn-input': !echoPassValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeEchoPass, 'warn-msg': !echoPassValid }]">{{ echoPassMsg }}</span>
                </div>
                <div class="mess">
                    <a href="javascript:;" v-on:click="nextTwoStep" >下一步</a>
                    <span class="cue">&nbsp;还有一步</span>
                </div>
            </div>
        </form>
        <!-- 注册公司第三步 -->
        <form method="post" v-if='showThree' autocomplete="on" class="forgetPass-content"  v-loading.body="loading">
            <div class="tip-login">
                <p class="active-text">创建公司</p>
                <span class="setTip">新用户需要激活账号</span>
            </div>
            <div class="tip-form">
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="companynameCheck" @focus="inputFocus('activeCompanyname')" v-model="companyname" type="text" :class="['login-form-input', { 'warn-input': !companynameValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeCompanyname, 'warn-msg': !companynameValid }]">{{ companynameMsg }}</span>
                </div>
                <div class="login-form-item">
                    <el-select v-model="sizeValue" @visible-change="sizeCheck">
                        <el-option v-for="item in size" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeSize, 'warn-msg': !sizeValid }]">{{ sizeMsg }}</span>
                </div>
                <div class="login-form-item">
                    <el-select v-model="industryValue" @visible-change="industryCheck">
                        <el-option v-for="item in industry" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeIndustry, 'warn-msg': !industryValid }]">{{ industryMsg }}</span>
                </div>
                <div class="login-form-item">
                    <cascader @visible-change="areaCheck"></cascader>
                    <!-- <el-select v-model="areaValue" @visible-change="areaCheck">
                        <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select> -->

                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeArea, 'warn-msg': !areaValid }]">{{ areaMsg }}</span>
                </div>
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="nameCheck" @focus="inputFocus('activeName')" v-model="name" type="text" :class="['login-form-input', { 'warn-input': !nameValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeName, 'warn-msg': !nameValid }]">{{ nameMsg }}</span>
                </div>
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="emaliCheck" @focus="inputFocus('activeEmali')" v-model="emali" type="text" :class="['login-form-input', { 'warn-input': !emaliValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeEmali, 'warn-msg': !emaliValid }]">{{ emaliMsg }}</span>
                </div>
                <div class="mess">
                    <input type="button" class="confirm" value="完成" @click="complete">
                </div>
            </div>
        </form>

    </div>
</template>
<script>
    import { validateRegisterInfo, setRegisterPassword, registerCompany } from '@/api/createCompany'
    import cascader from '@/components/cascader.vue'
    import commonMethods from './mixin/commonMethods';
    const sizeOptions = [{value: '选项1',label: '0~20'}, {value: '选项2',label: '21~100'},{value: '选项2',label: '101~500'},{value: '选项2',label: '501~3000'},{value: '选项2',label: '3000以上'}]
    const industry = [{value:'选项1',label:'医疗业'},{value:'选项2',label:'教育业'},{value:'选项3',label:'互联网/游戏/软件'},{value:'选项4',label:'能源/化工/环保'},{value:'选项5',label:'房地产/建筑/物业'},{value:'选项6',label:'农林畜牧业'},{value:'选项7',label:'电子/通讯/硬件'},{value:'选项8',label:'政府及非营利组织'},{value:'选项9',label:'汽车/机械/制造'},{value:'选项10',label:'金融业'},{value:'选项11',label:'零售业'},{value:'选项12',label:'服务/外包/中介'},{value:'选项13',label:'广告/传媒/文化'},{value:'选项14',label:'交通/贸易/物流'},]
    const area = [{value:'选项1',label:'北京市'}]
    export default{
        data(){
            return {
                username: '',
                usernameMsg: '请输入手机号码',
                usernameValid:true,
                captcha:'',
                captchaMsg:'请输入图形验证码',
                captchaValid:true,
                phoneMessage:'',
                phoneMessageMsg:'请输入短信验证码',
                phoneMessageValid:true,
                setPassword: '',
                setPasswordMsg: '设置密码(6~20字符，必须包含字母、数字)',
                setPasswordValid:true,
                echoPass: '',
                echoPassMsg: '再次输入密码',
                echoPassValid: true,
                companyname: '',
                companynameMsg: '企业名称(不超过20个字)',
                companynameValid:true,
                sizeValue:'',
                sizeMsg: '企业规模',
                sizeValid:true,
                industryValue:'',
                industryMsg:'所属行业',
                industryValid:true,
                areaValue:'',
                areaMsg:'所在地区',
                areaValid:true,
                name:'',
                nameMsg:"管理员姓名",
                nameValid:true,
                emali:'',
                emaliMsg:'请填写邮箱',
                emaliValid:true,
                activeCompanyname:false,
                activeUsername: false,
                activeCaptcha:false,
                activePhoneMessage:false,
                activeSetPassword:false,
                activeEchoPass:false,
                activeName:false,
                activeEmali:false,
                activeSize:false,
                activeIndustry:false,
                activeArea:false,
                first:true,
                showThree:false,
                two:false,
                size: sizeOptions,
                industry : industry,
                area: area,
                uuid: '',
                captchaImgSrc : '',
                getSmsCodeTip: '获取验证码',
                getSmsCodeTipFlag: true,
                redriectFlag : false,
                loading : false
            }
        },
        created () {
            this.getCaptchaPicFromServer()
            if(this.username){
                this.activeUsername = true
                this.activeCaptcha = true
                this.activePhoneMessage = true
                this.activeSetPassword = true
                this.activeEchoPass = true
                this.activeName = true
                this.activeEmali = true
                this.activeSize = true
                this.activeIndustry = true
                this.activeArea =true
            }
        },
        components: {
            'cascader': cascader
        },
        mixins: [commonMethods],
        methods: {
            // 点击登录跳转到 登录界面
            redriectToLogin (e) {
                if (!this.redriectFlag) {
                    return
                }
                if (e.srcElement.innerText === '登录') {
                    this.$router.push('/login')
                }
            },
            // 下一步
            async nextStep () {
                this.usernameCheck()
                this.captchaCheck()
                this.phoneMessageCheck()
                if (!(this.captchaValid && this.usernameValid && this.phoneMessageValid)) {
                    return
                }
                let res = await validateRegisterInfo({
                    "mobile" : this.username,
                    "smsCaptcha":this.phoneMessage,
                    "pictureCaptcha" : this.captcha,
                    "uuid" : this.uuid
                })
                let code = res && res.data && res.data.code
                if(code === 0) {
                    this.first = false
                    this.two = true
                } else if(code === 200009) {
                    this.phoneMessageMsg = '输入的验证码有误'
                    this.phoneMessageValid = false
                } else if(code === 200014) {
                    this.captchaMsg = '图形验证码无效，请重新输入'
                    this.captchaValid = false
                }
            },
            async nextTwoStep () {
                this.setPasswordCheck()
                this.echoPassCheck()
                if (!(this.setPasswordValid && this.echoPassValid)) {
                    return
                }
                let res = await setRegisterPassword({
                    "password":this.setPassword,
                    "verifyPassword" : this.echoPass,
                    "uuid" : this.uuid
                })
                let code = res && res.data && res.data.code
                if(code === 0) {
                    this.showThree = true
                    this.two = false
                } else {
                    this.$toast({
                        'success' : false,
                        'message' : '密码重置失败，请稍后再试'
                    })
                }
               
            },
            // 公司名称验证
            companynameCheck () {
                this.companyname=this.companyname.trim()
               if(!this.companyname) {
                    this.companynameMsg = '请输入企业名称'
                    this.companynameValid = false
                    return false
                }
                if(!/^.{0,20}$/.test(this.companyname)){
                    this.companynameMsg ='企业名称(不超过20字)'
                    this.companynameValid && (this.companynameValid = false)
                    return false
                }
                !this.companynameValid && (this.companynameValid = true)
                this.companynameMsg = '请输入企业名称'
                return true
            },
            // 姓名验证
            nameCheck () {
                this.name=this.name.trim()
                if(!this.name) {
                    this.nameMsg = '请填写姓名'
                    this.nameValid = false
                    return false
                }
                if(!/^([\u4e00-\u9fa5\x21-\x7e\s]).{1,10}$/.test(this.name)){
                    this.nameMsg = '姓名不能超过10个字'
                    this.nameValid && (this.nameValid = false)
                    return false
                }
                !this.nameValid && (this.nameValid = true)
                this.nameMsg = '请填写姓名'
                return true
            },
            // 公司规模验证
            sizeCheck (value) {
                if(value==false){
                    if(this.sizeValue==''){
                        this.sizeValid = false
                        this.activeSize = false
                        this.sizeMsg = '请选择企业规模'
                    }else{
                        this.sizeValid = true
                    }
                    this.activeSize = true
                }
                return true
            },
            // 所属行业验证
            industryCheck (value) {
               if(value==false){
                    if(this.industryValue==''){
                        this.industryValid = false
                        this.activeIndustry = false
                        this.industryMsg = '请选择所属行业'
                    }else{
                        this.industryValid = true
                    }
                    this.activeIndustry = true
                }
                return true
            },
            // 所在地区验证
            areaCheck (dist = this.areaValue) {
                let value = dist.code
                this.activeArea = true
                if (value) {
                    this.areaValid = true
                    this.areaValue = value
                } else {
                    if (this.areaValue) {
                        return
                    }
                    this.areaValue = ''
                    this.areaValid = false
                    this.areaMsg = '请选择所在地区'
                }
                return true
            },
            // 邮箱验证
            emaliCheck () {
                this.emali=this.emali.trim()
                if(!this.emali) {
                    this.emaliMsg = '请填写邮箱'
                    this.emaliValid = false
                    return false
                }
                if(!/^.{0,30}$/.test(this.emali)){
                    this.emaliMsg ='邮箱长度不能超过30位'
                    this.emaliValid && (this.emaliValid = false)
                    return false
                }
                if(!/^[A-Za-z0-9][\w\-\.].{1,60}@([\w\\-]+\.)+[\w].{2,7}$/.test(this.emali)){
                    this.emaliMsg ='邮箱格式不正确'
                    this.emaliValid && (this.emaliValid = false)
                    return false
                }
                !this.emaliValid && (this.emaliValid = true)
                this.emaliMsg = '请填写邮箱'
                return true
            },
            async complete () {
                this.companynameCheck()
                this.sizeCheck()
                this.industryCheck()
                this.areaCheck()
                this.nameCheck()
                this.emaliCheck()
                if (!(this.emaliValid && this.areaValid && this.industryValid && this.sizeValid && this.nameValid && this.companynameValid)) {
                    return
                }
                this.loading = true
                let res =  registerCompany({
                    "companyName" : this.companyname,
                    "scale" : this.sizeValue,
                    "industry" : this.industryValue,
                    "region" : this.areaValue,
                    "adminName" : this.name,
                    "adminEmail" : this.emali,
                    "uuid" : this.uuid
                })
                this.loading = false
                let code = res && res.data && res.data.code
                if(code === 0) {
                    console.error('成功了,但是没有默认主页 所以先跳转到login')
                    this.$router.push('/login')
                } else if (code === 200050) {
                    this.$toast({
                        'success' : false,
                        'message' : '用户已加入公司,请直接登录'
                    })
                    setTimeout(function(){
                        this.$router.push('/login')
                    },1900)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
$img-path: '../../assets/imgs';
@mixin font-style {
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft Yahei", "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
}
.login-container {
    width:100%;
    height: 100%;
    overflow-y:auto;
    overflow-x: hidden;
    position:relative;
    .hide{
        display:none;
    }
    .login-header{
        height:70px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
        background-color: #fff;
        padding-left: 50px;
        .brand {
            height: 100%;
            background: url("#{$img-path}/logo.png") no-repeat;
            background-size: contain;
        }
    }
    .forgetPass-content {
        width: 600px;
        margin: 50px auto;
        border-radius: 4px;
        text-align: center;
        background-color: #fff;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    }
    .tip-login{
        width:600px;
        border:none;
        background: #fff;
        border-radius: 4px 4px 0 0;
    }
    .setTip{
        font-size:14px;
        color:#666;
        line-height:24px;
    }
    .active-text{
        width:100%;
        margin:0 auto;
        font-size:26px;
        color:#333;
        text-align:center;
        padding:70px 0 15px 0;
    }
    .active-text-first{
        padding:70px 0 0 0;
    }
    .tip-form {
        width: 600px;
        height:100%;
        position:relative;
        padding-top: 50px;
        background-color: #FFF;
    }
    .login-form-item {
        width:340px;
        margin:0 auto;
        position: relative;
        margin-top: 30px;
    }
    .captcha{
        border:none;
        position:absolute;
        right:0;
        top:-6px;
        width:90px;
        height:34px;
        border-radius:3px;
        z-index:5;
        cursor:pointer;
    }
    .get-message{
        width:90px;
        height:34px;
        padding:0;
        font-size:12px;
        line-height:34px;
        background:#cccccc;
        border-radius:3px;
        position:absolute;
        top:-6px;
        right:0px;
        color:#fff;
        z-index:3;
        cursor:pointer;
    }
    .get-message.enable {
        background:#4b84f9;
    }
    .login-form-input-wrap {
        position: relative;
        z-index: 100;
    }
    .login-form-input {
        width: 100%;
        height: 34px;
        margin-top: 4px;
        display: block;
        border: none;
        border-bottom: 1px solid #E5E5E5;
        font-size: 14px;
        z-index: 2;
        background: transparent;
    }
    .login-form-tip {
        @include font-style;
        position: absolute;
        left: 0;
        top: 10px;
        font-size: 14px;
        color: #CCC;
        transition: 0.3s linear;
        z-index: 2;
    }
    .login-form-tip-focus {
        top: -12px;
        font-size: 12px;
    }
    .mess{
        margin:90px 0;
        position:relative;
        a{
            font-size:18px;
            color:#4b84f9;
        }
    }
    .confirm{
        width:340px;
        height:45px;
        background:#4B84F9;
        border:none;
        box-shadow:0 4px 6px 0 rgba(72,131,249,0.5);
        border-radius:3px;
        font-size:16px;
        color:#fff;
        cursor:pointer;
        &:hover{
            background:#2b67e4;
        }
    }
    .agreement{
        width:340px;
        margin:0 auto;
        text-align:left;
        padding-top:20px;
        font-size:12px;
        color:#999;
        a{
            color:#4b84f9;
            &:hover{
                color:#2b67e4;
            }
        }
    }
    .cue{
        font-size:12px;
        color:#ccc;
        line-height:18px;
        width:52px;
        height:18px;
        position:absolute;
        left:50%;
        margin-left:32px;
        top:0px;
    }
    .warn-input {
        border-bottom: 1px solid #F41935;
    }
    .warn-msg {
        color: #F41935;
    }
    .footer {
        position: absolute;
        left: 50%;
        bottom: 0px;
        margin-left: -600px;
        width: 100%;
        height: 64px;
        line-height: 64px;
        border-top: 1px solid #E7E7E7;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
        color: #999;
    }
}
</style>
<style lang="scss">

.redriect-to-login {
    cursor: pointer;
    color: #4b84f9;
    padding-left: 3px;
}
.login-container {
    .el-checkbox__label {
        color: #999;
        font-size: 12px;
    }
    .el-select{
        width:340px;
    }
    .el-input__inner{
        border:none;
        border-bottom:1px solid #e5e5e5;
        border-radius:0px;
        padding-left:0px;
    }
    .el-select-dropdown__item.selected.hover{
        background-color:#4B84F9;
    }
    .el-select-dropdown__item:hover{
        background-color:#4B84F9 !important;
    }
   ::-webkit-input-placeholder{
        color:#fff;
   }
   :-ms-input-placeholder{
        color:#fff;
   }
   ::-moz-placeholder{
        color:#fff;
   }
   ::-moz-placeholder{
        color:#fff;
   }

}
</style>