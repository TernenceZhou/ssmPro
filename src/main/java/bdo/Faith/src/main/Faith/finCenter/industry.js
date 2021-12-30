$('#analysis_industry').treecombo({
	url: 'cpBase/TreeCommon.findIndustry2Tree.json',
	params: {},
	view: {
		leafIcon: 'fa fa-building text-flat',
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});

var findIndustry = function() {

	if ($('#slpk2').val() === null || $('#slpk2').val() === '') {
		return;
	}
	if ($('#industry_standard').val() === null || $('#industry_standard').val() === '') {
		return;
	}
	var companyId = $('#slpk2').val()[0];
	var standard = $('#industry_standard').attr('data-result');
	if (parseInt(companyId) > 10000000 && standard.indexOf('GB') < 0) {
		bdoErrorBox('错误', '抱歉,立信公司暂时仅支持立信行业分类!');
		return;
	}
	if (parseInt(companyId) < 10000000 && standard.indexOf('GB') > 0) {
		bdoErrorBox('错误', '抱歉,万得公司不支持立信行业分类!');
		return;
	}
	$.ajax({
		type: 'get',
		url: 'finCenter/analysis.getIndustryByCompany.json',
		data: {
			menuId: window.sys_menuId,
			sqlId: 'FA20129',
			param1: standard,
//			param2: companyId,
			param3: $('#industry_year').val(),
			param4: $('#industry_period').val(),
			lockCustomerId: companyId
		},
		dataType: 'json',
		success: function(result) {
			if (result.success) {
				var classCode = result.data[0].classCode;
				var className = result.data[0].className;
				$('#analysis_industry').attr('data-result', classCode);
				$('#analysis_industry').attr('data-content', className);
				$('#analysis_industry').attr('data-contentdata', className);
				$('#analysis_industry').val(className);
			} else {
				bdoErrorBox('错误', result.resultInfo.statusText);
			}
		}
	});
};
$('#industry_standard').focus(function() {
	if ($('#slpk2').val()) {
		/*行业分类标准树构造*/
		$('#industry_standard').treecombo({
			url: 'cpBase/TreeCommon.findIndustry3Tree.json',
			params: {
				param1: $('#slpk2').val()[0]
			},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false
			},
			nodeSelectedCallback: findIndustry

		});
	} else {
		$('#industry_standard').trigger('blur');
		bdoInfoBox('提示', '请先选择公司!');
	}
});

ComboSearch('', '', 'cpBase/combo.findCompanys.json', $('#slpk2'), false, {'param1': ''}, true);
$('#slpk2').prev().find('input').attr('id', 'deviceInput2'); //为input增加id属性.
var findCompnays = function(selectDoc, inputDoc) {
	//选中的option
	var selectOptions = selectDoc.children('option:selected');
	var companys = selectDoc.val();
	selectDoc.html('');
	var regex = inputDoc;
	ComboSearch(selectOptions, companys, 'cpBase/combo.findCompanys.json', selectDoc, false, {'param1': regex}, false);
};

var findCompanyInterval2;
var deviceInput2Val = '';
var chiPattern = /^[\u4e00-\u9fa5]+$/;
$('#deviceInput2').focus(function() {
	findCompanyInterval2 = self.setInterval(function() {
		if (chiPattern.test($('#deviceInput2').val()) && deviceInput2Val !== $('#deviceInput2').val()) {
			findCompnays($('#slpk2'), $('#deviceInput2').val());
			deviceInput2Val = $('#deviceInput2').val();
		}
	}, 500);
}).blur(function() {
	window.clearInterval(findCompanyInterval2);
});

//生成年度option
var myDate = new Date();
var nowYear = myDate.getFullYear();
var yearOptions = '';
for (var i = 2015; i <= nowYear; i++) {
	yearOptions += '<option value="' + i + '"> ' + i + ' </option>';
}
//ComboDicOptionNew($('#industry_year'), yearOptions);
$('#industry_year').datepicker({
	autoclose: true,
	todayHighlight: true,
	language: 'zh-CN', //语言设置
	format: 'yyyy', //日期显示格式
	minViewMode: 2
});

//ComboDicOptionNew($('#industry_period'), ComboDicOption(false, 'WindPeriod'));
ComboDicOptionNew($('#industry_period'), ComboLocalDicOption(false, 'WindPeriod'));

//ComboDicOptionNew($('#industry_standard'), ComboDicOption(false, 'windIndustryStandard'));
ComboDicOptionNew($('#industry_standard'), ComboLocalDicOption(false, 'windIndustryStandard'));

//ComboDicOptionNew($('#industryQuotaStandardYear'), ComboDicOption(false, 'windIndustryDetailStandard'));
ComboDicOptionNew($('#industryQuotaStandardYear'), ComboLocalDicOption(false, 'windIndustryDetailStandard'));

//ComboDicOptionNew($('#industryQuotaStandardPeriod'), ComboDicOption(false, 'windIndustryDetailStandard'));
ComboDicOptionNew($('#industryQuotaStandardPeriod'), ComboLocalDicOption(false, 'windIndustryDetailStandard'));

//ComboDicOptionNew($('#stockPalteSelect'), ComboDicOption(false, 'windStockPalte'));
ComboDicOptionNew($('#stockPalteSelect'), ComboLocalDicOption(false, 'windStockPalte'));

//日期
$.fn.datepicker.dates['cn'] = {   //切换为中文显示
	days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
	daysShort: ['日', '一', '二', '三', '四', '五', '六', '七'],
	daysMin: ['日', '一', '二', '三', '四', '五', '六', '七'],
	months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	today: '今天',
	clear: '清除'
};

$('.selectDate').datepicker({
	autoclose: true,
	todayHighlight: true,
	language: 'zh-CN', //语言设置
	format: 'yyyy', //日期显示格式
	minViewMode: 2
});

/** 默认搜索条件 */
$('#slpk2').selectpicker('val', '100001');
var year = myDate.getFullYear();//年
var month = myDate.getMonth() + 1;//月份
var day = myDate.getDate();//日期
var str = year + '-' + month + '-' + day;
$('#industry_year').val(year - 1);
$('#industry_startdate').val(year - 3);
$('#industry_enddate').val(year - 1);
$('#totalValue_max').val(10000);
$('#totalValue_min').val(0);
$('#industry_year').selectpicker('val', year - 2);
$('#industryQuotaStandardYear').selectpicker('val', '3,10');
$('#industryQuotaStandardPeriod').selectpicker('val', '3,10');

//重置按钮
$('#industry_clear').click(function() {
	$('#slpk2').selectpicker('val', '');
	$('#industry_year').selectpicker('val', '2017');
	$('#industry_period').selectpicker('val', '1');
	$('#industry_standard').attr('data-result', '');
	$('#industry_standard').attr('data-content', '');
	$('#industry_standard').attr('data-contentdata', '');
	$('#industry_standard').val('');
});

$('#industry_clear2').click(function() {
	$('#analysis_industry').attr('data-result', '');
	$('#analysis_industry').attr('data-content', '');
	$('#analysis_industry').attr('data-contentdata', '');
	$('#analysis_industry').val('');
	$('#industry_startdate').val(year - 3);
	var year = myDate.getFullYear();//年
	var month = myDate.getMonth() + 1;//月份
	var day = myDate.getDate();//日期
	var str = year + '-' + month + '-' + day;
	$('#industry_enddate').val(year - 1);
	$('#totalValue_max').val(10000);
	$('#totalValue_min').val(0);
	$('#stockPalteSelect').selectpicker('val', '1');
});

//公司搜索行业
$('#company_search_industry').click(function() {
	findIndustry();
});
$('#industry_year,#industry_period').change(function() {
	findIndustry();
});


//行业搜索公司
self.setInterval('clock1()', 1000);
var tmpIndustry = null;

function clock1() {
	var currentData = $('#analysis_industry').attr('data-result');
	if (currentData == tmpIndustry) {
		return;
	}
	tmpIndustry = currentData;
	if (currentData != null && currentData != '' && currentData != 'classStandard') {
		//公司下拉框选项更新
		var selectOptions = $('#slpk2 option:selected');
		var companys = $('#slpk2').val();
		$('#slpk2').html('');
		ComboSearch(selectOptions, companys, 'cpBase/combo.findCompanysByIndustry.json', $('#slpk2'), false, {
			param1: currentData,
			param2: $('#industry_year').val(),
			param3: $('#industry_period').val(),
			param4: $('#stockPalteSelect').val()
		}, true);
		//行业分类标准回显
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.getIndustryStandardByCode.json',
			data: {
				param1: currentData
			},
			dataType: 'json',
			success: function(result) {
				if (result.success) {
					$('#industry_standard').selectpicker('val', result.data[0].classColumnName);
				}
			}
		});
		//tab重建
		//createTab2(industryTableId);
	}
}

$('#stockPalteSelect').change(function() {
	//公司下拉框选项更新
	var selectOptions = $('#slpk2 option:selected');
	var companys = $('#slpk2').val();
	$('#slpk2').html('');
	ComboSearch(selectOptions, companys, 'cpBase/combo.findCompanysByIndustry.json', $('#slpk2'), false, {
		param1: $('#analysis_industry').attr('data-result'),
		param2: $('#industry_year').val(),
		param3: $('#industry_period').val(),
		param4: $('#stockPalteSelect').val()
	}, true);
});

var industryTableId = 'industryByYear_table';
//指标选择下拉框
$.ajax({
	type: 'get',
	url: 'finCenter/analysis.findDefQuotas.json',
	data: {
		menuId: window.sys_menuId
	},
	dataType: 'json',
	success: function(result) {
		if (result.success) {
			var quotaOptions = '';
			var length = Object.getOwnPropertyNames(result.data[0]).length;
			for (var i = 1; i <= length + 5; i++) {
				var tmp = result.data[0]['q' + i];
				if (tmp != null) {
					quotaOptions += '<option value="' + 'q' + i + '"> ' + tmp + ' </option>';
				}
			}
			ComboDicOptionNew($('#industryQuotaPeriodSelect'), quotaOptions);
			ComboDicOptionNew($('#industryQuotaYearSelect'), quotaOptions);
		}
	}
});

//ComboDicOptionNew($('#mutiTypePeriodSelect'), ComboDicOption(false, '指标维度'));
ComboDicOptionNew($('#mutiTypePeriodSelect'), ComboLocalDicOption(false, '指标维度'));

//ComboDicOptionNew($('#mutiTypeYearSelect'), ComboDicOption(false, '指标维度'));
ComboDicOptionNew($('#mutiTypeYearSelect'), ComboLocalDicOption(false, '指标维度'));

//选项卡被选中时生成相关表格
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	// 获取已激活的标签页的tableId
	var tableId = $(e.target).attr('tableId');
	if (tableId == null) {
		return;
	}
	//行业指标分析tab
	if (tableId.indexOf('industry') >= 0) {
		industryTableId = tableId;
		createTab2(tableId);
	}
});

//搜索行业均值
$('#industry_search').click(function() {
	createTab2(industryTableId);
});

//行业指标数据tab生成
var createTab2 = function(tableId) {
	var company = $('#slpk2').val();
	if (company == null || company == '') {
		bdoErrorBox('错误', '请选择公司');
		return;
	}
	var result = $('#analysis_industry').attr('data-result');
	if (result == null || result == '') {
		bdoErrorBox('错误', '请选择行业');
		return;
	}
	if (result === 'classStandard') {
		bdoErrorBox('错误', '请选择具体行业');
		return;
	}
	var palte = $('#stockPalteSelect').val();
	if (result.indexOf('GB') > 0 && palte <= 2) {
		bdoErrorBox('错误', '抱歉,立信行业分类不支持万得板块数据!');
		return;
	}
	if (result.indexOf('GB') < 0 && palte > 2) {
		bdoErrorBox('错误', '抱歉,非立信行业不支持立信板块数据!');
		return;
	}
	if (result.length > 10 && palte != 1) {
		bdoErrorBox('错误', '抱歉,万得行业分类暂时仅支持万得A股板块数据!');
		return;
	}

	if (result.indexOf('GB') > 0 && tableId.indexOf('Period') > 0) {
		bdoErrorBox('错误', '抱歉,立信数据暂时不支持按季度查看!');
		return;
	}
	var startdate = $('#industry_startdate').val();
	var enddate = $('#industry_enddate').val();
	if (startdate === null || startdate === '') {
		bdoErrorBox('错误', '开始时间不能为空!');
		return;
	}
	if (enddate === null || enddate === '') {
		bdoErrorBox('错误', '结束时间不能为空!');
		return;
	}
	// 账套过期时间
	getValidDate($('#slpk2').val()[0], $('#industry_year').val(), 'validDate');
	var mutiTypeSelect = '';
	var industryQuotaSelect = '';
	var periodStandard = '';
	var industryDateUl = '';
	var quotaIndustryChart = '';
	var industryQuotaStandard = '';
	var detailQuotaIndustryTable = '';
	var quotaDetailIndustryChart = '';
	var companysDateUl = '';
	var detailQuotaCompanysTable = '';
	var quotaDetailCompanysChart = '';
	var chartsIndustry = '';
	//如果包含period 发送param3为1
	if (tableId.indexOf('Period') > 0) {
		periodStandard = '1';
		industryDateUl = 'industryPeriodDateUl';
		quotaIndustryChart = 'quotaIndustryPeriodChart';
		industryQuotaSelect = 'industryQuotaPeriodSelect';
		industryQuotaStandard = 'industryQuotaStandardPeriod';
		detailQuotaIndustryTable = 'detailQuotaIndustryTablePeriod';
		quotaDetailIndustryChart = 'quotaDetailIndustryPeriodChart';
		companysDateUl = 'companysPeriodDateUl';
		detailQuotaCompanysTable = 'detailQuotaCompanysTablePeriod';
		quotaDetailCompanysChart = 'quotaDetailCompanysPeriodChart';
		mutiTypeSelect = 'mutiTypePeriodSelect';
		chartsIndustry = 'chartsIndustryForPeriod';
	}
	//year 发送param3为2
	if (tableId.indexOf('Year') > 0) {
		periodStandard = '2';
		industryDateUl = 'industryYearDateUl';
		quotaIndustryChart = 'quotaIndustryYearChart';
		industryQuotaSelect = 'industryQuotaYearSelect';
		industryQuotaStandard = 'industryQuotaStandardYear';
		detailQuotaIndustryTable = 'detailQuotaIndustryTableYear';
		quotaDetailIndustryChart = 'quotaDetailIndustryYearChart';
		companysDateUl = 'companysYearDateUl';
		detailQuotaCompanysTable = 'detailQuotaCompanysTableYear';
		quotaDetailCompanysChart = 'quotaDetailCompanysYearChart';
		mutiTypeSelect = 'mutiTypeYearSelect';
		chartsIndustry = 'chartsIndustryForYear';
	}
	var currentQuota = $('#' + industryQuotaSelect).val();
	if (currentQuota === null || currentQuota === '') {
		bdoErrorBox('错误', '请选择指标!');
		return;
	}
	//生成按钮 对指标选择select绑定图形化方法
	$.ajax({
		type: 'get',
		url: 'finCenter/analysis.findPeriods.json',
		dataType: 'json',
		data: {param1: startdate+'-01-01', param2: enddate+'-12-31', param3: periodStandard},
		success: function(data) {
			if (data.success) {
				// $(".industryQuota").remove();
				// $(".companysQuota").remove();
				$('#' + companysDateUl).children().html('');
				$('#' + industryDateUl).children().html('');
				var dates = [];
				var quotaColumnName = $('#' + industryQuotaSelect).val();
				var quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
				var mutiType = $('#' + mutiTypeSelect).val();
				var mutiTypeName = $('#' + mutiTypeSelect).children('option:selected').text();
				for (let i = 0; i < data.data.length; i++) {
					$.each(data.data[i], function(key) {
						$('#' + industryDateUl).children().append('<button type="button" class="btn btn-default btn-sm industryQuota' + periodStandard + '" >' + key + '</button>&nbsp;&nbsp;');
						$('#' + companysDateUl).children().append('<button type="button" class="btn btn-default btn-sm companysQuota' + periodStandard + '" >' + key + '</button>&nbsp;&nbsp;');
						dates.push(key);
					});
				}
				$('.industryQuota' + periodStandard).click(function() {
						var reportDate = $(this).text();
						showDetail(reportDate, industryQuotaSelect, industryQuotaStandard, periodStandard, detailQuotaIndustryTable, quotaDetailIndustryChart);
						$('.industryQuota' + periodStandard).removeClass('btn-success');
						$('.industryQuota' + periodStandard).addClass('btn-default');
						$(this).addClass('btn-success');
					}
				);
				$('.companysQuota' + periodStandard).click(function() {
						var reportDate = $(this).text();
						showCompanysQuota(reportDate, periodStandard, detailQuotaCompanysTable, quotaDetailCompanysChart, industryQuotaSelect);
						$('.companysQuota' + periodStandard).removeClass('btn-success');
						$('.companysQuota' + periodStandard).addClass('btn-default');
						$(this).addClass('btn-success');
					}
				);
				$('#' + industryQuotaSelect).unbind('change.a');
				$('#' + industryQuotaSelect).bind('change.a', function() {
					var quotaColumnName = $('#' + industryQuotaSelect).val();
					var quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
					var mutiType = $('#' + mutiTypeSelect).val();
					var mutiTypeName = $('#' + mutiTypeSelect).children('option:selected').text();
					//找到行业指标的最大值 最小值 中值 均值 需要传入的参数 指标列名 行业代码 日期 标准
					createIndustryQuotaChart(quotaColumnName, quotaName, dates, periodStandard, quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry);
					$('.industryQuota' + periodStandard + '.btn-success').trigger('click');
					$('.companysQuota' + periodStandard + '.btn-success').trigger('click');
				});
				$('#' + mutiTypeSelect).unbind('change.a');
				$('#' + mutiTypeSelect).bind('change.a', function() {
					var quotaColumnName = $('#' + industryQuotaSelect).val();
					var quotaName = $('#' + industryQuotaSelect).children('option:selected').text();
					if (quotaColumnName.length === 1) {
						return;
					}
					var mutiType = $('#' + mutiTypeSelect).val();
					var mutiTypeName = $('#' + mutiTypeSelect).children('option:selected').text();
					//找到行业指标的最大值 最小值 中值 均值 需要传入的参数 指标列名 行业代码 日期 标准
					createIndustryQuotaChart(quotaColumnName, quotaName, dates, periodStandard, quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry);
				});
				$('#' + industryQuotaStandard).unbind('change.a');
				$('#' + industryQuotaStandard).bind('change.a', function() {
					$('.industryQuota' + periodStandard + '.btn-success').trigger('click');
					$('.companysQuota' + periodStandard + '.btn-success').trigger('click');
				});

				setTimeout(function() {
					createIndustryQuotaChart(quotaColumnName, quotaName, dates, periodStandard, quotaIndustryChart, mutiType, mutiTypeName, chartsIndustry);
				}, 200);
				setTimeout(function() {
					$('.industryQuota' + periodStandard).last().trigger('click');
					$('.companysQuota' + periodStandard).last().trigger('click');
				}, 400);
			}
		}
	});
};




