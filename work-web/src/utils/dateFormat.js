export  function format (date, fmt) {
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
		'H+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),//季度
		'S': date.getMilliseconds()
	};
	let week = ['日', '一', '二', '三', '四', '五', '六'];
	if(/(y+)/.test(fmt)) {
		let $1 = RegExp.$1;
		fmt = fmt.replace($1, (date.getFullYear() + '').substr(4 - $1.length));
	}
	if(/(E+)/.test(fmt)) {
		let $1 = RegExp.$1;
		fmt = fmt.replace($1, (($1.length > 1) ? ($1.length > 2 ? '星期' : '周') : '') + week[date.getDay()]);
	}
	for(let k in o) {
		if(new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		}
	}
	return fmt;
}