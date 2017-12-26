/*
 * @Author: shangkui 
 * @Date: 2017-10-30 16:57:21 
 * @Last Modified by: shangkui
 * @Last Modified time: 2017-10-30 17:51:29
 */
import { nojson, getUuid } from '@/utils/interface'
import { getCaptchaPicUrl, acquireSmsCaptcha } from '@/api/createCompany'
import { sendSmsCaptcha } from '@/api/entry'
export default {
  methods: {
    inputFocus(key) {
        !this[key] && (this[key] = true)
    },
    // 手机号验证
    usernameCheck () {
        // 去掉首字符为空
        this.username=this.username.trim()
        //判断是否为空
        if(!this.username) {
            this.usernameMsg = '请输入手机号码'
            this.usernameValid && (this.usernameValid = false)
            return false
        }
        //判断是否为手机号
        if(!/^1\d{10}/g.test(this.username)) {
            this.usernameMsg = '请输入正确的手机号码'
            this.usernameValid && (this.usernameValid = false)
            return false
        }
        !this.usernameValid && (this.usernameValid = true)
        this.usernameMsg = '请输入手机号码'
        return true
    },
    // 图形验证码验证
    captchaCheck () {
        if(!this.captcha) {
            this.captchaMsg = '请输入图形验证码'
            this.captchaValid = false
            return false
        }else if(/^[0-9a-zA-Z]{4}$/.test(this.captcha)){
            this.captchaMsg = "请输入图形验证码"
            this.captchaValid = true
            return true
        }else{
            this.captchaMsg = "输入的图形验证码有误"
            this.captchaValid = false
            return false
        }
    },
    // 手机短信验证码验证
    phoneMessageCheck () {
        if(!this.phoneMessage) {
            this.phoneMessageMsg = '请输入短信验证码'
            this.phoneMessageValid = false
            return false
        }else if(/^[a-zA-Z0-9]{6}$/.test(this.phoneMessage)){
            this.phoneMessageMsg = '请输入短信验证码'
            this.phoneMessageValid = true
            return true
        }else{
            this.phoneMessageMsg = '输入的验证码有误'
            this.phoneMessageValid = false
            return false
        }
    },
    // 设置密码验证
    setPasswordCheck () {
        this.setPassword=this.setPassword.trim()
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
    //获取短信验证码的错误处理
    verifySMSCode (res) {
        let code
        if(res && res.data){
            code = res.data.code
        }
        if (code === 0) {
            this.$toast({
                'success': true,
                'message': '短信验证码发送成功'
            })
            this.countDown()
        } else if (code === 200019) {
            this.usernameMsg = '手机号不存在，请重新输入'
            this.usernameValid = false
        } else if (code === 200011) {
            this.captchaMsg = '图形验证码错误，请重新输入'
            this.captchaValid = false
        } else if (code === 200014) {
            this.captchaMsg = '图形验证码无效，请重新输入'
            this.captchaValid = false
        } else if (code === 200012) {
            this.phoneMessageMsg = '请60秒后再次获取验证码'
            this.phoneMessageValid = false
        } else if (code === 200020) {
            this.phoneMessageMsg = '获取短信验证码次数已达每日上限'
            this.phoneMessageValid = false
        } else if (code === 200040) {
            this.usernameMsg = '账号已存在，请直接<span class="redriect-to-login">登录</span>'
            this.usernameValid = false
            this.redriectFlag = true
        } else {
            this.usernameMsg = res.data.msg
            this.usernameMsg = false
        }
    },
    // 再次输入密码验证
    echoPassCheck () {
        this.echoPass=this.echoPass.trim()
        if(!this.echoPass) {
            this.echoPassMsg = '请再次输入密码'
            this.echoPassValid = false
            return false
        }
        this.echoPassValid = true
        this.echoPassMsg= '请输入密码'
        return true
    },
    // 获取创建公司的短信短信验证码
    async getVerificationCode() {
      if (!this.getSmsCodeTipFlag) {
        return
      }
      this.usernameCheck()
      this.captchaCheck()
      if (!(this.captchaValid && this.usernameValid)) {
        return
      }
      let res = await acquireSmsCaptcha(({
        mobile: this.username,
        pictureCaptcha: this.captcha,
        uuid: this.uuid
      }))
      this.verifySMSCode(res)
    },

    //倒计时
    countDown () {
        this.getSmsCodeTipFlag = false
        let time = 60;
        let _this = this
        let timer = setInterval(clock,1000)
        clock();
        function clock () {
            time--;
            //_this.getSmsCodeTip = time + "秒后重发";
            _this.timeCount=time;
            if(time == -1){
                clearInterval(timer);
                _this.getSmsCodeTip = "重获验证码";
                _this.getSmsCodeTipFlag = true;
            }
        }
    },
    // 获取图形验证码
    getCaptchaPicFromServer () {
        let uuid = this.uuid = getUuid()
        let time = new Date().getTime();
        return this.captchaImgSrc = getCaptchaPicUrl({
            uuid,
            time
        })
    }
  }
};
