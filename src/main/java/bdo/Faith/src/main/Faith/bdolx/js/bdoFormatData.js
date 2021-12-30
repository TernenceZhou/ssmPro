var formatMoney = function(val) {
	if (typeof(val) == 'undefined'){
		return '';
	}
	if (isNaN(val)) {
		return val;
	}
	val = val + '';
	if (val == '') {
		return '';
	} else if (val > 0) {
		return '<span style="color:green;align=right;">' + formatMoney2(val, 1) + '</span>';
	} else if (val < 0) {
		return '<span style="color:green;">' + formatMoney2(val, 1) + '</span>';
	} else {
		return '0';
	}
};

function formatMoney2(s, type) {
	if (!$.isNumeric(s))
		return '0.00';
	s = formatCurrency(s);
	/*if (s == null || s == "null" || s == "")
	    return "0.00";
	s = s.toString().replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*!/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
	    s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");*/
	if (type == 0) {
		var a = s.split('.');
		if (a[1] == '00') {
			s = a[0];
		}
	}
	return s;
}

function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = '0.00';
	var sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	var cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = '0' + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
			num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + num + '.' + cents);
}
