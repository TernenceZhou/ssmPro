/**
 * 往 jquery.validate.js 中添加自定义验证
 * 写法可参考assets/js/plugins/jquery-validation/additional-methods.js
 */

// 验证小数点位数
$.validator.addMethod('decimal', function(value, element, param) {
	param = param || 2;
	var decimal = new RegExp('^-?\\d+(\\.\\d{1,' + param + '})?$', 'gim'); //;
	return this.optional(element) || (decimal.test(value));
}, '超过{0}位小数 !');
