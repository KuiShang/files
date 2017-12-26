<template>
    <div class="findpwd-container">
        <!-- 找回密码表单 -->
        <form method="post" v-if='show' autocomplete="on" class="forgetPass-content">
            <div class="tip-login">
                <p class="active-text active-text-first">找回密码</p>
            </div>
            <div class="tip-form">
                <div class="login-form-item">
                    <div class="login-form-input-wrap">
                        <input @blur="usernameCheck" @focus="inputFocus('activeUsername')" v-model="username" type="text" :class="['login-form-input', { 'warn-input': !usernameValid }]" autocomplete="off" />
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activeUsername, 'warn-msg': !usernameValid }]">{{ usernameMsg }}</span>
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
                        <button class="get-message" :class="{'enable': getSmsCodeTipFlag }" @click.prevent="getPwdVerificationCode" :disabled="!getSmsCodeTipFlag" >
                            <span v-show="getSmsCodeTipFlag">{{getSmsCodeTip}}</span>
                            <span v-show="!getSmsCodeTipFlag">{{timeCount}}秒后重发</span>
                        </button>
                    </div>
                    <span :class="['login-form-tip', { 'login-form-tip-focus': activePhoneMessage, 'warn-msg': !phoneMessageValid }]">{{ phoneMessageMsg }}</span>
                </div>
                <div class="mess">
                    <a href="javascript:;" v-on:click="nextStep" >下一步</a>
                </div>
            </div>
        </form>
        <!-- 找回密码表单第二步 -->
        <form method="post" v-if='!show' autocomplete="on" class="forgetPass-content">
            <div class="tip-login">
                <p class="active-text">设置密码</p>
                <span class="setTip">请设置新密码</span>
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
                    <input type="submit" class="confirm" value="确定" @click.prevent="submit">
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import commonMethods from './mixin/commonMethods';
    import { setRetsetPassword, verifySmsCaptcha } from '@/api/createCompany';
    import { sendSmsCaptcha, verifyPwdSmsCaptcha } from '@/api/findPassword';
    import { nojson } from '@/utils/interface'
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
                activeUsername: false,
                activeCaptcha:false,
                activePhoneMessage:false,
                activeSetPassword:false,
                activeEchoPass:false,
                show:true,
                uuid: '',
                captchaImgSrc: '',
                getSmsCodeTip: '获取验证码',
                timeCount: 60,
                getSmsCodeTipFlag: true
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
            }
        },
        mixins: [commonMethods],
        methods: {
            //获取短信验证码
            async getPwdVerificationCode() {
                if (!this.getSmsCodeTipFlag) {
                    return
                }
                this.usernameCheck()
                this.captchaCheck()
                if (!(this.captchaValid && this.usernameValid)) {
                    return
                }
                let res = await sendSmsCaptcha(nojson({
                    mobile: this.username,
                    picCaptcha: this.captcha,
                    uuid: this.uuid
                }))
                this.verifySMSCode(res)
            },
            // 下一步
            async nextStep () {
                this.usernameCheck()
                this.captchaCheck()
                this.phoneMessageCheck()
                if (!(this.captchaValid && this.usernameValid && this.phoneMessageValid)) {
                    return
                }
                let res = await verifyPwdSmsCaptcha(nojson({
                    "mobile" : this.username,
                    "smsCaptcha":this.phoneMessage,
                    "picCaptcha" : this.captcha,
                    "uuid" : this.uuid
                }))
                let code = res && res.data && res.data.code
                if(code === 0) {
                    this.show = false
                } else if(code === 200009) {
                    this.phoneMessageMsg = '输入的验证码有误'
                    this.phoneMessageValid = false
                } else if(code === 200014) {
                    this.captchaMsg = '图形验证码无效，请重新输入'
                    this.captchaValid = false
                }
            },
            async submit () {
                this.setPasswordCheck()
                this.echoPassCheck()
                if (!(this.setPasswordValid && this.echoPassValid)) {
                    return
                }
                let res = await setRetsetPassword({
                    "password":this.setPassword,
                    "verifyPassword" : this.echoPass,
                    "uuid" : this.uuid
                })
                let code = res && res.data && res.data.code
                if(code === 0) {
                    this.$toast({
                        'success' : true,
                        'message' : '密码重置成功!'
                    })
                    this.$router.push('/login')
                } else if(code === 10999){
                    this.setPasswordMsg="密码为6—20位字符，必须包含字母、数字"
                    this.setPasswordValid=false
                }else{
                    this.$toast({
                        'success' : false,
                        'message' : '密码重置失败，请稍后再试'
                    })
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
$img-path: '../../assets/imgs';
@mixin font-style {
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft Yahei", "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
}
.findpwd-container {
    width:100%;
    height:600px;
    overflow:hidden;
    position:relative;
    .hide{
        display:none;
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
        background:rgb(204,204,204);
        border-radius:3px;
        position:absolute;
        top:-6px;
        right:0px;
        color:#fff;
        z-index:3;
        cursor: not-allowed;
        outline: none;
        border:none;     
    }
    .get-message.enable {
        background:#4b84f9;
        cursor:pointer;
        &:hover{
            background:#2B67E4
        }
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
    .warn-input {
        border-bottom: 1px solid #F41935;
    }
    .warn-msg {
        color: #F41935;
    }
    .el-checkbox__label {
        color: #999;
        font-size: 12px;
    }
}
</style>