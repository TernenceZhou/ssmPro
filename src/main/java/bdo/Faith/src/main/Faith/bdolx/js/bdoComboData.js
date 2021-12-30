/** */
var ComboDicData = function(existBlank, dicType) {
	var resultData = '';
	$.ajax({
		type: 'post',
		url: 'base/GeneralCombo.findDic.json',
		data: {
			blank: existBlank,
			param2: dicType
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			resultData = data.data;
		}
	});
	return resultData;
};


/** 获取dic表数据 */
var ComboDicOption = function(existBlank, dicType) {
	var jsonArr = '';
	$.ajax({
		type: 'post',
		url: 'base/GeneralCombo.findDic.json',
		data: {
			blank: existBlank,
			param2: dicType
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			$.each(data.data, function(index, info) {
				jsonArr += '<option value="' + info.value
					+ '">' + info.label + '</option>';
			});
		}
	});
	return jsonArr;
};

/** 从全局变量（DicJsonlData）中获取 用来传入stores中，获取数组对象[{},{}]样式  */
var ComboLabelValueDicData = function(existBlank, dicType) {
	var resultData = [];
	if (existBlank) {
		resultData.push({label: '', value: ''});
	}
	var dicData = DicJsonlData.responseJSON[dicType];
	if (dicData) {
		for (var key in dicData) {
			resultData.push({label: dicData[key], value: key});
		}
	}
	return resultData;
};


/** 获取dic表数据
 *  从全局变量（DicJsonlData）中获取
 *  默认升序排列，若参数 isSortDesc 为 true，则为降序
 * */
var ComboLocalDicOption = function(existBlank, dicType, isSortDesc) {
	var html = existBlank ? '<option value></option>' : '';
	var dicData = DicJsonlData.responseJSON[dicType];

	if (dicData) {
		var tmp = [];
		for (var key in dicData) {
			tmp.push({label: key, value: '<option value="' + key + '">' + dicData[key] + '</option>'});
		}

		var lgval = isSortDesc ? -1 : 1;
		var lsval = isSortDesc ? 1 : -1;

		// for...in不能保证按顺序遍历对象属性，所以需要重新排序
		if (tmp.length > 0) {
			var isNotNumber = isNaN(tmp[0].label) || isNaN(tmp[tmp.length - 1].label);
			tmp.sort(function(a, b) {
				var val1 = isNotNumber ? a.label : parseInt(a.label);
				var val2 = isNotNumber ? b.label : parseInt(b.label);
				if (val1 > val2) {
					return lgval;
				} else if (val1 < val2) {
					return lsval;
				} else {
					return 0;
				}
			});
		}

		for (var i = 0; i < tmp.length; i++) {
			html += tmp[i].value;
		}
	}
	return html;
};


/** 获取dic表数据 */
var ComboDicOptionF = function(existBlank, dicType, minVal, maxVal) {
	var jsonArr = '';
	$.ajax({
		type: 'post',
		url: 'base/GeneralCombo.findDic.json',
		data: {
			blank: existBlank,
			param2: dicType,
			param3: minVal,
			param4: maxVal
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			$.each(data.data, function(index, info) {
				jsonArr += '<option value="' + info.value
					+ '">' + info.label + '</option>';
			});
		}
	});
	return jsonArr;
};

/** 获取数据库其他表数据 */
var ComboDBOption = function(url, existBlank) {
	var jsonArr = '';
	$.ajax({
		type: 'post',
		url: url,
		data: {
			blank: existBlank,
			menuId: window.sys_menuId,
			page: -1,
			start: -1,
			limit: -1
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			jsonArr += '<option value="" selected="selected"></option>';
			$.each(data.data, function(index, info) {
				jsonArr += '<option value="' + info.value
					+ '">' + info.label + '</option>';
			});
		}
	});
	return jsonArr;
};

/** 获取数据库其他表数据 */
var ComboDBOptionWithParam = function(url, existBlank, param) {
	var data = {
		blank: existBlank,
		menuId: window.sys_menuId,
		page: 1,
		start: 0,
		limit: 1000
	};
	var jsonArr = '';
	$.ajax({
		type: 'post',
		url: url,
		data: $.extend(data, param),
		dataType: 'json',
		async: false,
		success: function(data) {
			$.each(data.data, function(index, info) {
				jsonArr += '<option value="' + info.value
					+ '">' + info.label + '</option>';
			});
		}
	});
	return jsonArr;
};

/** 查询客户下拉框 */
/*var ComboCustomerOption = function(existBlank, param) {
	var jsonArr = '';
	$.ajax({
		type: 'post',
		url: 'cusBase/CusGeneral.query.json',
		data: param,
		dataType: 'json',
		async: false,
		success: function(data) {
			if (existBlank) {
				jsonArr += '<option></option>';
			}
			$.each(data.data, function(index, info) {
				jsonArr += '<option value="' + info.customerId
					+ '">' + info.customerId + '-' + info.customerName + '</option>';
			});
		}
	});
	return jsonArr;
};*/

/** 动态检索下拉框 **/
var ComboSearch = function(options, values, url, document, existBlank, param, async) {
	$(document).selectpicker({
		noneSelectedText: '请选择'//默认显示内容
	});
	$(window).on('load', function() {
		$(document).selectpicker('val', '');
		$(document).selectpicker('refresh');
	});
	//下拉数据加载
	$.ajax({
		type: 'get',
		url: url,
		dataType: 'json',
		data: param,
		async: async,
		success: function(data) {//返回list数据并循环获取
			var select = document;
			select.append(options);
			if (existBlank) {
				select.append('<option></option>');
			}
			$.each(data.data, function(index, info) {
				select.children('option[value=\'' + info.value + '\']').remove();
				select.append('<option value="' + info.value
					+ '">' + info.label + '</option>');
			});
			$(document).selectpicker('val', values);
			$(document).selectpicker('refresh');
		}
	});
};


/** 字典生成下拉框整合bootstrap select **/
var ComboDicOptionNew = function(document, html) {
	$(document).selectpicker({
		noneSelectedText: '请选择(将被视为全选)'//默认显示内容
	});
	$(window).on('load', function() {
		$(document).selectpicker('val', '');
		$(document).selectpicker('refresh');
	});
	//下拉数据加载
	$(document).html(html);
	$(document).selectpicker('val', '');
	$(document).selectpicker('refresh');
	$(document).unbind('changed.bs.select.a');
	$(document).bind('changed.bs.select.a', function() {
		var info = $(document).siblings().find('.filter-option');
		var values = info.text();
		var labels = values.split(',');
		if (labels.length === 0) {
			return;
		}
		var forText;
		if (labels.length === 1) {
			forText = labels[0];
			info.text(forText);
		} else if (labels.length === 2) {
			forText = labels[0] + ',' + labels[1];
			info.text(forText);
		} else {
			forText = labels[0] + ',' + labels[1] + '...   +' + (labels.length - 2);
			if (forText.length > 20) {
				forText = labels[0] + '...   +' + (labels.length - 1);
			}
			info.text(forText);
		}
	});
};

/** 字典生成下拉框整合select2 **/
var ComboDicOptionNew2 = function(document, html) {
	$(document).select2({
		placeholder: '请选择'//默认显示内容
	});
	//下拉数据加载
	$(document).html(html);
};


// 获取客户下拉
var getUserCustomers = function(itemid, defaultValue) {
	if (typeof(defaultValue) == 'undefined'){
		defaultValue = window.BDO_PROJECT_SELECT;
	}
	/*if (userCustomers == null || userCustomers == 'null') {

		return;
	}*/
	var customers = null;
	if (userCustomers != null && userCustomers != 'null') {
		customers = JSON.parse(userCustomers);
	}
	$.ajax({
		url: 'cpBase/Combo.getCustomers.json',
		type: 'post',
		data: {
			param1 : ''
		},
		dataType: 'json',
		success: function(data) {
			if (data.success === true) {
				if(data.data != null) {
					customers = data.data;
				}
			}
			if(customers != null){
				for (var i = 0; i < customers.length; i++) {
					if(!customers[i]) {
						return;
					}
					if (customers[i].value == defaultValue) {
						$('#' + itemid).append(' <option value="' + customers[i].value + '" selected>' + customers[i].value + '-' + customers[i].label + '</option>');
					} else {
						$('#' + itemid).append(' <option value="' + customers[i].value + '">' + customers[i].value + '-' + customers[i].label + '</option>');
					}
				}
				if (!$('#' + itemid).select2) {
					console.log(itemid);
				}
				$('#' + itemid).select2();
				$('#' + itemid).change(function() {
					window.BDO_PROJECT_SELECT = $(this).val();
					if ($('#subject_tree').hasClass('treeview')) {
						$('#subject_tree').tree('reset');
						$('#subject_tree').tree('destory');
					}
				});
			}
			
		}
	});
	
};


var getUserCustomers2 = function(itemid, selectedCustomer) {

	if (userCustomers == null || userCustomers == 'null') {

		return;
	}

	var customers = JSON.parse(userCustomers);
	for (var i = 0; i < customers.length; i++) {

		if (selectedCustomer && customers[i].value == selectedCustomer) {
			$('#' + itemid).append(' <option value="' + customers[i].value + '" selected>' + customers[i].value + '-' + customers[i].label + '</option>');
		} else {
			$('#' + itemid).append(' <option value="' + customers[i].value + '">' + customers[i].value + '-' + customers[i].label + '</option>');
		}
	}
	$('#' + itemid).select2();
};

/**
 * 获取下拉年份
 * 从全局变量（DicJsonlData）中获取
 */
var getUserLocalYear = function(itemid) {
	$('#' + itemid).html(ComboLocalDicOption(false, 'year', true));
	if (window.BDO_YEAR_SELECT != null && window.BDO_YEAR_SELECT != '') {
		$('#' + itemid).val(window.BDO_YEAR_SELECT);
	} else {
		$('#' + itemid).val((new Date()).getFullYear() - 1);
	}

	$('#' + itemid).change(function() {
		window.BDO_YEAR_SELECT = $(this).val();
	});
};

// 获取年份下拉
/*
var getUserYear = function(itemid) {
	$('#' + itemid).html(ComboDBOption('base/GeneralCombo.findTenYears.json', false));
	if(BDO_YEAR_SELECT!=null && BDO_YEAR_SELECT!=""){
		$('#' + itemid).val(BDO_YEAR_SELECT);
	}else{
		$('#' + itemid).val((new Date()).getFullYear()-1);
	}
	
	$('#' + itemid).change(function(){
		BDO_YEAR_SELECT = $(this).val();
	});
}
*/

//获取客户模板
/*
var getCustomerVocation = function(itemid,param) {	
	$('#' + itemid).html(ComboDBOptionWithParam('cpBase/Combo.getCustomerRuleacc.json', false,param));
};
*/

// 模版导入时的客户(用户有权限的客户)
var getCustomerForImport = function(itemid,parent) {
	$.ajax({
		type: 'get',
		url: 'cpBase/Combo.getCustomerForImport.json',
		dataType: 'json',
		async: true,
		success: function(data) {
			var cusStr = '<option value=""></option>';
			$.each(data.data, function(i, info) {
				cusStr += '<option value="' + info.value + '" selected>' + info.value + '-' + info.label + '</option>';
			});
			$('#' + itemid).html(cusStr);
			if(parent){
				$('#' + itemid).select2({
					dropdownParent : $(parent)
				});
			} else{
				$('#' + itemid).select2();
			}
			
		}
	});
};

// 账套合并时的客户(用户有权限的客户，不包含临时客户)
var getCustomerForImportFormal = function(itemid,parent) {
	$.ajax({
		type: 'get',
		url: 'cpBase/Combo.getCustomerForImportFormal.json',
		dataType: 'json',
		async: true,
		success: function(data) {
			var cusStr = '<option value=""></option>';
			$.each(data.data, function(i, info) {
				cusStr += '<option value="' + info.value + '" selected>' + info.value + '-' + info.label + '</option>';
			});
			$('#' + itemid).html(cusStr);
			if(parent){
				$('#' + itemid).select2({
					dropdownParent : $(parent)
				});
			} else{
				$('#' + itemid).select2();
			}

		}
	});
};
