import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import axios from 'axios'
import store from './store'
import Toast from './components/Toast';
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$toast = Toast
Vue.mixin({
	methods: {
		randomColor(id) {
			if (isNaN(id) || id < 9) {
				return '#68c6aa';
			}
			var arr = ['#a992d4', '#f7b189', '#b3dbf2', '#f495bf', '#c182d1', '#b5b5e2', '#a8e5c2', '#83beec', '#61d6d6'];
			return arr[id % 9];
		}
	},
	filters: {}
})

//储存用户信息
router.beforeEach((to, from, next) => {
	if(!/\/login/.test(to.path) && !sessionStorage.getItem('companyId') && to.name != 'findPassword'){
		import('@/api/gome-header').then((res)=>{
			res.userInfo().then((d)=>{
				let data = d.data.data;
				sessionStorage.setItem('userId', data.staffs[0].id)
				sessionStorage.setItem('companyName', data.staffs[0].companyName)
				sessionStorage.setItem('userInfo', JSON.stringify(data))
				sessionStorage.setItem('companyId', data.staffs[0] && data.staffs[0].companyId);
				next()
			})
		})
	}else{
		next()
	}
})

export default new Vue({
	el: '#root',
	router,
	store,
	// template: '<App/>',
	// components: {
	// 	App
	// }
	// 
	render: h => h(App)
})