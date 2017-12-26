<template>
    <div class="login-container">
        <!-- 头部通栏 -->
        <div class="login-header">
            <div class="header-box">
                <div class="headerBox-left">
                    <a href="javascript:;" class="headerBox-left title">国美互联网企业云</a>
                </div>
                <div class="headerBox-right">
                    <a href="javascript:;">登录</a>
                    <a href="javascript:;">创建公司</a>
                </div>
            </div>
        </div>
        <!-- 修改密码表单 -->
        <form method="post" autocomplete="on" class="forgetPass-content">
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
                    <input type="button" class="confirm" value="确定" @click.prevent="submit">
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                setPassword: '',
                setPasswordMsg: '设置密码(6~20字符，必须包含字母、数字)',
                setPasswordValid:true,
                echoPass: '',
                echoPassMsg: '再次输入密码',
                echoPassValid: true,
                activeSetPassword:false,
                activeEchoPass:false,
            }
        },
        created () {
            if(this.username){
                this.activeSetPassword = true
                this.activeEchoPass = true
            }
        },
        methods: {
            inputFocus(key) {
                !this[key] && (this[key] = true)
            },
            // 设置密码验证
            setPasswordCheck () {
                this.setPassword=this.setPassword.trim()
                // 判断密码是否为空
                if(!this.setPassword) {
                    this.setPasswordMsg = '请输入密码'
                    this.setPasswordValid = false
                    return false
                }
                //判断密码格式是否正确
                if(!/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/.test(this.setPassword)) {
                    this.setPasswordMsg = '密码格式错误'
                    this.setPasswordValid && (this.setPasswordValid = false)
                    return false
                }
                !this.setPasswordValid && (this.setPasswordValid = true)
                this.setPasswordMsg = '请输入密码'
                return true
            },
            // 再次输入密码验证
            echoPassCheck () {
                if(!this.echoPass) {
                    this.echoPassMsg = '请再次输入密码'
                    this.echoPassValid = false
                    return false
                }
                this.echoPassValid = true
                return true
            },
            async submit () {
                let setPasswordValid = this.setPasswordCheck()
                let echoPassValid = this.echoPassCheck()
                // 或关系
                if(!setPasswordValid || !echoPassValid) {
                    this.inputFocus('activeSetPassword')
                    this.inputFocus('activeEchoPass')
                    return false
                }
                if(this.setPasswordMsg == this.echoPassMsg){
                    return true
                }else{
                    this.echoPassValid=false
                    this.echoPassMsg="两次密码输入不一致"
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
$img-path: '../../assets/imgs';
@mixin font-style {
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft Yahei", "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
}
body{
    overflow-y:hidden !important;
    overflow-x:hidden !important;
}
.login-container {
    width:100%;
    height:600px;
    overflow:auto;
    position:relative;
    .hide{
        display:none;
    }
    .login-header{
        width:100%;
        height:70px;
        box-shadow:0px 1px 5px 0px rgba(0,0,0,0.1);
        background:#fff;
    }
    .header-box{
        min-width:1007px;
        max-width:1200px;
        height:100%;
        margin:0 auto;
    }
    .headerBox-left{
        float:left;
    }
    .headerBox-right{
        float:right;
    }
    .title{
        height:100%;
        line-height:70px;
        font-size:20px;
        padding-left:62px;
        padding-right:50px;
        color:#4B84F9;
        background:url("#{$img-path}/logo-big.png") no-repeat 10px center;
        background-size:42px 48px;
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
        background:#4b84f9;
        border-radius:3px;
        position:absolute;
        top:-6px;
        right:0px;
        color:#fff;
        z-index:3;
        cursor:pointer;
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