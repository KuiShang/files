<template>
	<div class="center">
		<div class="slide">
			<div class="inside"></div>
			<div class="outside"></div>
		</div>
		<div class="personal-information clearfix">
			<span class="name" :style="{backgroundColor:color,boxShadow:shadow}">{{msg.shortName}}</span>
			<div class="more-msg">
				<p>{{msg.staffName}}</p>
				<ul>
					<li>
						<span class="title">电话：</span>
						<span>{{msg.mobile}}</span>
					</li>
				</ul>
			</div>
			<a href="javascript:;" @click="dialogFormVisible = true">修改密码</a>
		</div>
		<div class="company-information">
			<p>企业信息</p>
			<ul>
				<li class="clearfix">
					<span class="name">公司名称：</span>
					<span>{{msg.companyName}}</span>
				</li>
				<li class="clearfix">
					<span class="name">姓名：</span>
					<span>{{msg.staffName}}</span>
				</li>
				<li class="clearfix">
					<span class="name">所在部门：</span>
					<span>{{msg.deptName}}</span>
				</li>
				<li class="clearfix">
					<span class="name">职务：</span>
					<span>{{msg.dutyName}}</span>
				</li>
				<li class="clearfix">
					<span class="name">电子邮箱：</span>
					<span>{{msg.email}}</span>
				</li>
				<li class="clearfix">
					<span class="name">电话：</span>
					<span>{{msg.mobile}}</span>
				</li>
			</ul>
		</div>
		<!-- 修改密码 -->
        <kdialog
		    :visible="dialogFormVisible"
			width="564px">
			<div class="dialog-password">
				<div class="ui-dialog-close" @click='dialogFormVisible = false'></div>
				<h6 class="dialog-password-title">修改密码</h6>
				<div class="dialog-password-body">
					<div class="dialog-content-item clearfix">
						<div class="item-content oldPassword">
							<input type="password" @input='oldpswEvent' autocomplete="off" placeholder="原始密码" class="" v-model="oldpsw">
						</div>
						<span class="dialog-content-tip forget-password"><a id="findPassWord" target="_blank">忘记密码</a></span>
						<div class="error-tip" v-show="oldIndex != 0">{{rules.oldpsw[oldIndex]}}</div>
					</div>
					<div class="dialog-content-item clearfix">
						<div class="item-content newword ui-input">
							<input type="password" @input='newpswEvent' autocomplete="off" placeholder="请设置新密码" class=""  v-model="newpsw">
						</div>
						<span class="dialog-content-tip">6-20个字符，必须含字母加数字</span>
						<div class="error-tip" v-show="newIndex != 0">{{rules.newpsw[newIndex]}}</div>
					</div>
					<div class="dialog-content-item clearfix">
						<div class="item-content newword2 ui-input">
							<input type="password" @input='newpswEvent2' autocomplete="off" placeholder="再次输入新密码" class=""  v-model="newpswAgain">
						</div>
						<span class="dialog-content-tip"></span>
						<div class="error-tip" v-show="newIndex2 != 0">{{rules.newpsw[newIndex2]}}</div>
					</div>
					<div class="button-box clearfix">
						<div class="confirm ui-button" @click="submitForm('modifyPswForm')">提交</div>
					</div>
				</div>
			</div>
		</kdialog>

	<!-- <el-dialog title="修改密码" :visible.sync="dialogFormVisible"  size="tiny" :show-close=false>
		<el-form :model="form" label-position="left" label-width="110px" :rules="rules" ref="modifyPswForm">
			<a class="forgetpsw" @click="forgetpsw">忘记?</a>
			<el-form-item  label="原始密码" prop="oldpsw" >
				<el-input type="password" v-model="form.oldpsw" auto-complete="off"  ></el-input>
			</el-form-item>
				<el-form-item  label="新密码" prop="newpsw" > 
			<el-input type="password" v-model="form.newpsw" auto-complete="off" ></el-input>
				</el-form-item>
			<el-form-item label="再次输入密码" prop="newpswAgain">
				<el-input type="password" v-model="form.newpswAgain" auto-complete="off" ></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitForm('modifyPswForm')">确 定</el-button>
		</div>
	</el-dialog> -->
	</div>
</template>
<script>
import { userDetail, logout } from "@/api/gome-header"
import { modifyPassword } from '@/api/createCompany'
import { Base64 } from '@/utils/base64'
import kdialog from "@/components/dialog/component.vue";
export default {
	data(){
		let validateNewpsw =  (rule, value, callback) => {
			//判断密码格式是否正确
			if(!/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/.test(value)) {
				callback(new Error('必须含字母加数字!'));
			} else {
				callback()
			}
		}
		let newpswAgain =  (rule, value, callback) => {
			//判断密码格式是否正确
			if(!(value == this.form.newpsw)) {
				callback(new Error('两次密码必须相同!'));
			} else {
				callback()
			}
		}
		
		return {
			msg:{},
			dialogFormVisible: false,
			oldpsw: '',
			newpsw: '',
			newpswAgain: '',
			formLabelWidth: '150px',
			oldIndex: 0,
			newIndex: 0,
			newIndex2: 0,
			rules: {
				oldpsw: ['','请输入原始密码','长度在 6 到 20 个字符'],
				newpsw: ['','请输入新密码','长度在 6 到 20 个字符','两次输入密码不一致，请重新输入']
			}
		}
	},
	components:{
		kdialog
	},
	computed:{
		color(){
			return this.randomColor(this.msg.id)
		},
		shadow(){
			return "0px 7px 8px " + this.hexToRgba(this.color, 40).rgba
		}
	},
	created(){
		this.getUserDetail()
	},
	methods:{
		oldpswEvent(){
			if(this.oldpsw == ''){
				this.oldIndex = 1
			}else if(this.oldpsw.length > 20){
				this.oldpsw = this.oldpsw.substring(0,20)
			}else {
				this.oldIndex = 0
			}
		},
		newpswEvent(value){
			if(this.newpsw == ''){
				this.newIndex = 1
			}else if(!/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/.test(this.newpsw)) {
				this.newIndex = 2
			}else{
				this.newIndex = 0
			}
		},
		newpswEvent2(){
			if(this.newpswAgain == ''){
				this.newIndex2 = 1
			}else if(!/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/.test(this.newpswAgain)) {
				this.newIndex2 = 2
			}else{
				this.newIndex2 = 0
			}

			if(this.newIndex == 0){
				if(this.newpsw !== this.newpswAgain){
					this.newIndex2 = 3
				}
			}
		},
		async getUserDetail(){
			const id = sessionStorage.getItem('userId')
			const companyName = sessionStorage.getItem('companyName')
			const res = await userDetail({
				params:{
					id:id
				}
			})
			let name = res.data.data.staffName
			name = name?name.substring(name.length-2):''
			res.data.data.shortName = name
			res.data.data.companyName = companyName
			this.msg = res.data.data
		},
		hexToRgba(hex, al) {
            let hexColor = /^#/.test(hex) ? hex.slice(1) : hex,
                alp = hex === 'transparent' ? 0 : Math.ceil(al),
                r, g, b;
            hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff';
            if (hexColor.length === 3) {
                hexColor = hexColor.replace(/(\w)(\w)(\w)/gi, '$1$1$2$2$3$3');
            }
            r = hexColor.slice(0, 2);
            g = hexColor.slice(2, 4);
            b = hexColor.slice(4, 6);
            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
            return {
                hex: '#' + hexColor,
                alpha: alp,
                rgba: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (alp / 100).toFixed(2) + ')'
            };
		},
		async submitForm (formName) {
			if (this.oldpsw && this.newpswAgain && this.newpsw) {
				let res = await modifyPassword({
					"oldPwd": Base64.encode(this.oldpsw),
					"newPwd": Base64.encode(this.newpsw),
					"verifypwd": Base64.encode(this.newpswAgain)
				})
				let code = res && res.data && res.data.code
				console.log(code)
                if(code === 0) {
					this.dialogFormVisible = false
                    this.$toast({
                        'success' : true,
                        'message' : '密码修改成功，请重新登录'
					})
					const res = await logout()
					let code = res && res.data && res.data.code
					if (code === 0) {
						setTimeout(function() {
							this.$router.push('/login')
						}, 1990);
					}
                } else {
					 this.$toast({
                        'success' : false,
                        'message' : res.data.msg
                    })
				}

			} else {
				this.oldpswEvent()
				this.newpswEvent()
				this.newpswEvent2()
				console.log(1)
				return false;
			}
		},
		forgetpsw () {
			this.$router.push('/findPassword')
		}
	}
}
</script>
<style lang="scss" scoped>
.forgetpsw {
	position: relative;
    top: 25px;
    left: 70px;


	color: #4B84F9;
    font-size: 14px;
    cursor: pointer;
	&:hover {
		color: #2B67E4;
	}
}
.center{
	position: absolute;
	top:0;
	left:0;
	width:100%;
	height: 100%;
	min-width: 700px;
	overflow: auto;
	font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
	text-align: left;
	.slide{
		position: fixed;
		top:0px;
		left:0;
		z-index: 1;
		width:100%;
		height: 230px;
		overflow: hidden;
		background: #4B84F9;
		background: -prefix-linear-zgradient(top,#4B84F9 75px, #6573FD); 
		background:-webkit-linear-gradient(top,#4B84F9 75px, #6573FD);
		div{
			width:200%;
			position: absolute;
			top:0;
		}
		.inside{
			height:100%;
			left:-280px;
			background: url(../../assets/imgs/water2.png) repeat-x left bottom;
			animation:3s linear water2 infinite paused;
		}
		.outside{
			height: 100%;
			left:0;
			background: url(../../assets/imgs/water1.png) repeat-x left bottom;
			animation:7s linear water1 infinite paused;
		}
	}
	.slide:hover .outside{
		animation-play-state:running;
	}
	.slide:hover .inside{
		animation-play-state:running;
	}
	@keyframes water1{
		0%{
			left:0;
		}
		100%{
			left:-500px;
		}
	}
	@keyframes water2{
		0%{
			left:-280px;
		}
		100%{
			left:-840px;
		}
	}
	.personal-information{
		position: relative;
		z-index: 2;
		width:680px;
		margin:50px auto 20px;
		padding: 40px 50px 40px 70px;
		background:#ffffff;
		&>a{
			float:right;
			color:#4B84F9;
			font-size: 12px;
			&:hover{
				color:#2B67E4;
			}
			&:active{
				color:#2B67E4;
			}
		}
		.name{
			float:left;
			width: 90px;
			height: 90px;
			background: #F693BF;
			color: #ffffff;
			text-align: center;
			line-height: 90px;
			border-radius: 8px;
			font-size: 22px;
			box-shadow: 0px 7px 8px #F693BF;
		}
	}
	.more-msg{
		float:left;
		padding:6px 20px;
		color:#333333;
		p{
			font-size: 16px;
			margin-bottom: 20px;
		}
		ul li{
			line-height: 14px;
			margin-bottom: 16px; 
			span{
				font-size:14px;
				float: left;
			}
			span.title{
				color:#666666;
				width:42px;
				margin-right:5px;
			}
		}
	}
	.company-information{
		position: relative;
		z-index: 2;
		padding:60px 60px 60px 70px;
		width:670px;
		margin:auto;
		background: #ffffff;
		margin-bottom: 60px;
		color:#333333;
		&>p{
			font-size: 20px;
		}
		&>ul{
			margin-top:30px;
			font-size: 14px;
			li{
				line-height: 18px;
				margin-bottom: 15px;
			}
		}
		span{
			width:590px;
			float: left;
			line-height: 24px;
		}
		span.name{
			width: 70px;
			color: #666666;
			margin-right: 5px;
		}
	}
	.dialog-password{
	    width: 580px;
		font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
		color: #333;
		font-size: 12px;
	    border: 1px solid #ccc;
	    border-radius: 4px;
	    background-color: #fff;
	    .ui-dialog-close{
	    	width: 13px;
		    height: 13px;
		    background: url(../../assets/imgs/close.png) no-repeat;
		    position: absolute;
		    top: 14px;
		    right: 10px;
		    cursor: pointer;
	    }
	    .dialog-password-title{
	    	height: 40px;
		    line-height: 40px;
		    padding: 0 0 0 10px;
		    margin: 0;
		    background-color: #edf3f9;
		    border-bottom: 1px solid #ccc;
		    color: #333;
		    font-weight: normal;
		    font-size: 14px;
		    vertical-align: top;
    		display: block;
	    }
	    .dialog-password-body{
	    	padding: 50px 0px 50px 70px;
	    	.dialog-content-item{
	    		margin-bottom: 23px;
    			position: relative;
	    	}
	    	.item-content{
	    		float: left;
    			width: 260px;
    			overflow: hidden;
    			height: 38px;
			    border-radius: 3px;
			    border: 1px solid #D9DADC;
			    input{
			    	width: 250px;
				    height: 40px;
				    padding: 0;
				    margin: 0;
				    outline: none;
				    border: 0;
				    margin-left: 10px;
				    color: #666;
				    font-size: 14px;
			    }
	    	}
		    .forget-password{
		    	height: 32px;
			    line-height: 64px;
			    color: #999;
			    font-size: 12px;
			    padding-left: 10px;
			    float: left;
			    a{
			    	color: #4B84F9;
				    font-size: 14px;
				    cursor: pointer;
				    text-decoration: none;
			    }
			    a:hover{
			    	color: #2B67E4;
			    }
		    }
		    .error-tip{
		    	position: absolute;
			    left: 0px;
			    top: 44px;
			    color: #F41935;
		    }
		    .dialog-content-tip{
		    	height: 32px;
			    line-height: 64px;
			    color: #999;
			    font-size: 12px;
			    padding-left: 10px;
			    float: left;
		    }
		    .button-box{
		    	width: 130px;
			    height: 40px;
			    line-height: 40px;
			    font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "\5b8b\4f53", sans-serif;
			    font-size: 16px;
			    text-align: center;
			    display: inline-block;
			    border-radius: 3px;
			    cursor: pointer;
			    outline: none;
			    background-color: #4B84F9;
			    color: #ffffff;
			    &:hover{
			    	background-color: #2B67E4;
			    }
		    }
	    }
	}
}
</style>