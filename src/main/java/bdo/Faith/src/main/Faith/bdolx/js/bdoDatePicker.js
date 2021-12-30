!function(a) {
	a.fn.datepicker.dates['zh-CN'] = {
		days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
		daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		daysMin: ['日', '一', '二', '三', '四', '五', '六'],
		months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月',
			'十一月', '十二月'],
		monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
			'10月', '11月', '12月'],
		today: '今日',
		clear: '清除',
		format: 'yyyy年mm月dd日',
		titleFormat: 'yyyy年mm月',
		weekStart: 1
	};
	a.fn.datepicker.dates['en-AU'] = {
		days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
			'Friday', 'Saturday'],
		daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		months: ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November',
			'December'],
		monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
			'Sep', 'Oct', 'Nov', 'Dec'],
		today: 'Today',
		monthsTitle: 'Months',
		clear: 'Clear',
		weekStart: 1,
		format: 'd/mm/yyyy'
	};
	$('.bdo-datepicker').datepicker({
		language: 'zh-CN',
		autoclose: true,
		todayBtn: 'linked',
		todayHighlight: true,
		clearBtn: true,
		format: 'yyyy-mm-dd'
	});
}(jQuery);