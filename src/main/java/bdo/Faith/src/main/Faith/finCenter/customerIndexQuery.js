$(document).ready(function() {
	uiBlocksApi(false, 'init');
	/*$('[data-toggle="tabs"]').on('click', 'a', function (e) {
		e.preventDefault();
		$(this).tab('show');
	});*/

	//convertLanguage();
	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function () {
		$(this).draggable({
			handle: '.block-header',
			cursor: 'move'
		});
		$(this).css('overflow', 'hidden');
	});*/
	// 加载万德数据
	//$(function(){
	$.ajax({
		type: 'post',
		url: 'wind/WindQuery.getTotalData.json',
		dataType: 'json',
		success: function(data) {
			var arr = [];
			if (data) {
				arr = data.data[0].totaldata.split(',');
				$('#windCustomer').html('万得 ：客户数(' + arr[0] + ') 年报数(' + arr[1] + ') 报告数' + arr[2] + ')');
				/* $("#windYear").html(arr[1]);
				 $("#windReport").html(arr[2]);*/
				$('#bdoCustomer').html('立信 ：客户数(' + arr[3] + ') 年报数(' + arr[4] + ') 报告数' + arr[5] + ')');
				/* $("#bdoYear").html(arr[4]);
				 $("#bdoReport").html(arr[5]);*/
			}
		}
	});
	//});
	/*var template_ = tplLoader('dgCenter/html/dg/customerProjectSet.html');
	$("#selectProjectForm").html(template_);
	$('#contentChild').removeClass('col-md-6');
	$('#contentChild').addClass('col-md-12');

	$("#showProjectModal").click(function () {
		$("#modal_selectProject").modal("show");
	});
	$.fn.modal.Constructor.prototype.enforceFocus = function () { };

	// 客户
	getUserCustomers2('set_customerId',CUR_CUSTOMERID);
	//项目
	if ((CUR_CUSTOMERID != null && window.CUR_CUSTOMERID != '')){
		$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false,{param1:$('#set_customerId').val()}));
		$('#set_projectId').val(window.CUR_PROJECTID);
		setProjectInfo($('#set_projectId').val());
	}
	//查询并显示项目相关信息
	function setProjectInfo(projectId){
		if ($('#set_projectId').val() == '' || $('#set_projectId').val() == null){
			return;
		}
		$.ajax({
			type : 'post',
			url : 'dgCenter/CustomerProjectSet.getProjectInfo.json',
			data : {
				param1 : projectId
			},
			dataType : 'json',
			success : function(data) {
				var data = data.data[0];
				$('#set_auditStartDate').val(data.AuditTimeBegin);
				$('#set_auditEndDate').val(data.AuditTimeEnd);
			}
		});
	}
	//客户选择
	$('#set_customerId').change(function(){
		//BDO_CUSTOMER_SELECT = $(this).val();
		$('#set_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false,{param1:$('#set_customerId').val()}));
		setProjectInfo($('#set_projectId').val());
	});

	//项目选择
	$('#set_projectId').change(function(){
		setProjectInfo($(this).val());
	});
	*/

	ComboSearch('', '', 'cpBase/combo.findCompanys.json', $('#slpk'), false, {'param1': ''}, true);
	$('#slpk').prev().find('input').attr('id', 'deviceInput'); //为input增加id属性.
	var findCompnays = function(selectDoc, inputDoc) {
		//选中的option
		var selectOptions = selectDoc.children('option:selected');
		var companys = selectDoc.val();
		selectDoc.html('');
		var regex = inputDoc;
		ComboSearch(selectOptions, companys, 'cpBase/combo.findCompanys.json', selectDoc, false, {'param1': regex}, false);
	};

	var chiPattern = /^[\u4e00-\u9fa5]+$/;
	var findCompanyInterval;
	var deviceInput1Val = '';
	$('#deviceInput').focus(function() {
		findCompanyInterval = self.setInterval(function() {
			if (chiPattern.test($('#deviceInput').val()) && deviceInput1Val !== $('#deviceInput').val()) {
				findCompnays($('#slpk'), $('#deviceInput').val());
				deviceInput1Val = $('#deviceInput').val();
			}
		}, 500);
	}).blur(function() {
		window.clearInterval(findCompanyInterval);
	});


	/*$("#set_save").click(function () {
		$("#modal_selectProject").modal("hide");
		$("#projectId").val($('#set_projectId').val());
		findCompnays($('#slpk'), $('#set_customerId option:checked').text().split('-')[1]);
		$('#slpk').selectpicker('val', $('#set_customerId').val());
		$("#analysis_search").trigger('click');
	});

	$('#set_clear').click(function() {
		$('#set_customerId').val('').trigger("change");
		$('#set_projectId').val('');
		$('#set_auditStartDate').val('');
		$('#set_auditEndDate').val('');
	});*/

	//下拉框选中后回显股票代码
	$('#slpk').change(function() {
		var tmparr = [];
		var tmpValue = $('#slpk').val();
		tmparr.push(tmpValue);
		if (tmpValue !== null && tmpValue !== '') {
			FindCompanyByCompanyId(tmparr, $('#stock_code'));
		}
	});
	//股票代码回显公司名
	$('#stock_code').change(function() {
		var tmpValue = $('#stock_code').val();
		if (tmpValue !== null && tmpValue !== '') {
			FindCompanyByStockCode(tmpValue, $('#slpk'));
		}
	});

	//ComboDicOptionNew($('#analysis_reportType'), ComboDicOption(false, 'WindReportType'));
	//ComboDicOptionNew($('#analysis_reportType'), ComboLocalDicOption(false, 'WindReportType'));

	//ComboDicOptionNew($('#analysis_monoOrMerge'), ComboDicOption(false, 'WindMonoOrMerge'));
	//ComboDicOptionNew($('#analysis_monoOrMerge'), ComboLocalDicOption(false, 'WindMonoOrMerge'));

	//ComboDicOptionNew($('#analysis_period'), ComboDicOption(false, 'WindPeriod'));
	ComboDicOptionNew($('#analysis_period'), ComboLocalDicOption(false, 'WindPeriod'));

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
	//设置结束时间必须晚于开始时间
	/*$("#customer_enddate").datepicker().on('changeDate', function(e) {
		//获取选取的开始时间))
	     var endTimeStart =$("#customer_startdate").val();           
		//设置结束时间
	     $('#customer_enddate').datepicker('setStartDate', endTimeStart);   
	 });
	*/


	/** 默认搜索条件 */
	$('#slpk').selectpicker('val', '100001');
	$('#stock_code').val('000001');
	//$("#analysis_reportType").selectpicker('val', '1');
	//$("#analysis_monoOrMerge").selectpicker('val', '1');
	$('#analysis_period').selectpicker('val', '1');
	var myDate = new Date();
	var cusyear = myDate.getFullYear();//年
	$('#customer_enddate').val(cusyear - 1 );
	var startYear = window.CUR_PROJECT_END_YEAR - 3;
	$('#customer_startdate').val(cusyear - 3);

	/** 监管消息table 属性 */
	var superviewMsg_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/analysis.getSuperViewMsg.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockCustomerId: '',
				param2: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: true,
			order: [4, 'DESC'],
			serverSide: true,
			columnDefs: [
				{
					targets: 1,
					className: 'text-center',
					title: '编号',
					visible: false,
					name: 'autoId',
					data: 'autoId',
					width: '100px'
				}, {
					targets: 2,
					className: 'text-center',
					title: '类型',
					name: 'zjhtype',
					data: 'zjhtype',
					width: '50px'
				}, {
					targets: 3,
					className: 'text-center',
					title: '标题',
					name: 'title',
					data: 'title',
					width: '150px'
				}, {
					targets: 4,
					className: 'text-center',
					title: '时间',
					name: 'QTime',
					data: 'QTime',
					width: '50px'
				}, {
					targets: 5,
					className: 'text-left',
					title: '原件',
					name: 'url',
					data: 'url',
					width: '150px',
					render: function(data, type, row, meta) {
						return '<a href="' + data + '" target="_blank">' + data + '</a>';
					}
				}]
		}
	};

	/** 报表一览table 属性 */
	var analysis_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/analysis.getTableInfo.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockCustomerId: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: true,
			order: [8, 'DESC'],
			serverSide: true,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: 'id',
					name: 'id',
					data: 'id',
					visible: false
				}, {
					targets: 2,
					className: 'text-left',
					title: 'companyId',
					name: 'companyid',
					data: 'companyid',
					visible: false
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '公司名称',
					name: 'company_name',
					data: 'company_name',
					width: '80px'
				}, {
					targets: 4,
					orderable: true,
					className: 'text-left',
					title: '报表名称',
					name: 'reportName',
					data: 'reportName',
					width: '100px'
				}, {
					targets: 5,
					className: 'text-center',
					title: '财务报表种类',
					name: 'reportType',
					data: 'reportType',
					width: '40px',
					renderer: 'getDicLabelByVal|WindReportType',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, 'WindReportType');
					}
				}, {
					targets: 6,
					className: 'text-center',
					title: '财务报表类型',
					name: 'monoOrMerge',
					data: 'monoOrMerge',
					width: '40px',
					renderer: 'getDicLabelByVal|WindMonoOrMerge',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, 'WindMonoOrMerge');
					}
				}, {
					targets: 7,
					className: 'text-center',
					title: '报告期间',
					name: 'period',
					data: 'period',
					width: '30px',
					renderer: 'getDicLabelByVal|WindPeriod',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, 'WindPeriod');
					}
				}, {
					targets: 8,
					className: 'text-center',
					title: '报告日期',
					name: 'reportDate',
					data: 'reportDate',
					width: '40px'
				}, {
					targets: 9,
					className: 'text-center',
					title: '更新日期',
					name: 'updateDate',
					data: 'updateDate',
					width: '40px'
				}]
		}
	};

	/** 报表详情table 属性 */
	var detail_view = {
		localParam: {
			tabNum: false,
			url: 'finCenter/analysis.getReportDetail.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockCustomerId:'',
				param1: '',
				param2: '',
				param3: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			scrollY: true,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-left',
					title: '项目',
					name: 'programName1',
					data: 'programName1',
					visible: true,
					width: '120px',
					render: function(data, type, row, meta){
						if (data != '' && data != null){
							return data.replace(' ','&nbsp;&nbsp;');
						}else{
							return data;
						}
					}
				}, {
					targets: 2,
					orderable: false,
					className: 'text-right',
					title: '值',
					name: 'data1',
					data: 'data1',
					visible: true,
					width: '60px'
				}/*, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '项目',
					name: 'programName2',
					data: 'programName2',
					visible: true,
					width: '120px'
				}, {
					targets: 4,
					orderable: false,
					className: 'text-right',
					title: '值',
					name: 'data2',
					data: 'data2',
					visible: true,
					width: '60px'
				}, {
					targets: 5,
					orderable: false,
					className: 'text-left',
					title: '项目',
					name: 'programName3',
					data: 'programName3',
					visible: true,
					width: '120px'
				}, {
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '值',
					name: 'data3',
					data: 'data3',
					visible: true,
					width: '60px'
				}*/]
		}
	};
	var abstractTableId = 'abstractByYear_table';
	var quotaTableId = 'quotaByYear_table';
	var duPontTableId = 'duPontforYear';
	var chartsTableId = 'chartsProfitForYear';

	//选项卡被选中时生成相关表格
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		// 获取已激活的标签页的tableId
		var tableId = $(e.target).attr('tableId');
		if (tableId == null) {
			return;
		}
		//摘要数据tab
		if (tableId.indexOf('abstract') >= 0) {
			abstractTableId = tableId;
			createTab(tableId);
		}
		//单公司指标分析tab
		if (tableId.indexOf('quota') >= 0) {
			quotaTableId = tableId;
			createTab(tableId);
		}
		//行业指标分析tab
		if (tableId.indexOf('industry') >= 0) {
			industryTableId = tableId;
			createTab2(tableId);
		}
		//杜邦分析tab
		if (tableId.indexOf('duPont') >= 0) {
			duPontTableId = tableId;
			createTab(tableId);
		}
		//指标分析
		if (tableId.indexOf('charts') >= 0) {
			chartsTableId = tableId;
			createTab(tableId);
		}
		//指标分析
		if (tableId.indexOf('analysis') >= 0) {
			//createTab(tableId);
			var innerTableId = $('#' + tableId).find('ul li.active').children().attr('tableId');
			$('#' + tableId).find('ul li.active').children().tab('show');
			chartsTableId = innerTableId;
			createTab(chartsTableId);
		}
	});

	/** 搜索按钮 */
	$('#analysis_search').click(function() {
		if ($('#slpk').val() === null || $('#slpk').val() === '') {
			bdoErrorBox('错误', '请选择公司');
			return;
		}
		var startdate = $('#customer_startdate').val();
		var enddate = $('#customer_enddate').val();
		if (startdate === null || startdate === '') {
			bdoErrorBox('错误', '开始时间不能为空!');
			return;
		}
		if (enddate === null || enddate === '') {
			bdoErrorBox('错误', '结束时间不能为空!');
			return;
		}
		if (startdate !== '' && enddate !== '' && startdate > enddate) {
			bdoErrorBox('错误', '开始年份不能大于结束年份!');
			return;
		}
		// 账套过期时间
		// getValidDate($('#slpk').val(), $('#customer_enddate').val(), 'validDate');
		// 报表列表
		analysis_view.localParam.urlparam.lockCustomerId = $('#slpk').val();
		analysis_view.localParam.urlparam.param2 = $('#customer_startdate').val();
		analysis_view.localParam.urlparam.param3 = $('#customer_enddate').val();
		BdoDataTable('analysis_table', analysis_view);
		
		/** 行双击 */
		$('#analysis_table tbody').unbind();
		$('#analysis_table tbody').on('dblclick', 'tr', function() {
			var object = $('#analysis_table').DataTable().data()[$(this).closest('tr').index()];
			$('#modal_reportDetail').modal('show');
			var count = 1;
			$('#modal_reportDetail').on('shown.bs.modal', function() {
				if (count++ === 1) {
					//报表名称
					$('#detailHead').html();
					$('#detailHead').html(object.reportName);
					//参数
					detail_view.localParam.urlparam.lockCustomerId = $('#slpk').val();
					detail_view.localParam.urlparam.param1 = object.reportType;
					detail_view.localParam.urlparam.param2 = object.id;
					detail_view.localParam.urlparam.param3 = object.reportDate;
					$('#analysisDetail_table').html('');
					BdoDataTable('analysisDetail_table', detail_view);
				}
			});
		});
		createTab(abstractTableId);
		createTab(quotaTableId);
		createTab(duPontTableId);
		createTab(chartsTableId);
		// 监管消息
		superviewMsg_view.localParam.urlparam.lockCustomerId = $('#slpk').val();
		BdoDataTable('superviewMsgTable', superviewMsg_view);
		//本福特
		var reportDate = '';
		for(var i = startdate;i <= enddate;i++){
			reportDate = reportDate + i + '-12-31,';
		}
		reportDate = reportDate.substring(0,reportDate.length-1);
		var param ={
			param2 : reportDate,
			param3 : '万得报表金额,立信报表金额',
			param4 : '0',
			lockCustomerId : $('#slpk').val()
		};
		benfordChartInit(param);
		//财务预警分析-阿尔曼模型
		var reportYear = '';
		for(var i = startdate;i <= enddate;i++){
			reportYear = reportYear + i + ',';
		}
		reportYear = reportYear.substring(0,reportYear.length-1);
		var param ={
			param2 : reportYear,
			lockCustomerId : $('#slpk').val()
		};
		almanChartInit(param);
	});
	
	//公式弹出

	function showFormulaChi(doc, formulaChi) {
		/*//$("[data-toggle='popover']").popover('hide');
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findFormulaChiByProgramId.json',
			dataType: 'json',
			data: {param1: programId},
			success: function (data) {
				if (data.success) {
					$(doc).popover({
						trigger: 'hover',
						animation: true,
						html: true,
						container: 'body',
						title: data.data[0].formulaChi
					});
					$(doc).popover('show');
				}
			}
		});*/
		$(doc).popover({
			trigger: 'hover',
			animation: true,
			html: true,
			container: 'body',
			title: formulaChi
		});
		$(doc).popover('show');
	}

	//公式隐藏
	function hideFormulaChi(doc, programId) {
		$('.popover-title').each(function() {
			$(this).popover('hide');
		});
	}


	/*
	生成tab
	 */
	var createTab = function(tableId) {
		//立信数据不支持按季度
		if (tableId.indexOf('Period') > 0 && parseInt($('#slpk').val()) > 10000000) {
			return;
		}
		//非杜邦分析 删除原table
		if (tableId.indexOf('duPont') < 0) {
			if ($('#' + tableId).hasClass('dataTable')) {
				var wrapper = $('#' + tableId + '_wrapper');
				var content = wrapper.parent();
				var newTable = '<table id="' + tableId + '" class="table table-bordered table-striped table-hover"> </table>';
				content.append(newTable);
				wrapper.remove();
			}
		}
		var startdate = $('#customer_startdate').val();
		var enddate = $('#customer_enddate').val();
		if ($('#slpk').val() === null || $('#slpk').val() === '') {
			bdoErrorBox('错误', '请选择公司');
			return;
		}
		if (startdate === null || startdate === '') {
			bdoErrorBox('错误', '开始时间不能为空!');
			return;
		}
		if (enddate === null || enddate === '') {
			bdoErrorBox('错误', '结束时间不能为空!');
			return;
		}
		if (startdate !== '' && enddate !== '' && startdate > enddate) {
			bdoErrorBox('错误', '开始年份不能大于结束年份!');
			return;
		}
		/** 摘要数据table 属性 */
		var abstract_view = {
			localParam: {
				tabNum: false,
				url: '',
				urlparam: {
					menuId: window.sys_menuId,
					param1: '',
					param2: '',
					param3: '',
					param4: ''
				}
			},
			tableParam: {
				select: true,
				lengthChange: true,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				ordering: false,
				order: [1, 'ASC'],
				serverSide: true,
				columnDefs: []
			}
		};
		var periodStandard = '';
		//如果包含period 发送param3为1
		if (tableId.indexOf('Period') > 0) {
			periodStandard = '1';
		}
		//year 发送param3为2
		if (tableId.indexOf('Year') > 0) {
			periodStandard = '2';
		}
		//生成table cloumn 以及param
		var tmpParam = [];
		abstract_view.localParam.url = '';
		abstract_view.tableParam.columnDefs = [];
		if (tableId.indexOf('abstract') >= 0) {
			abstract_view.tableParam.columnDefs.push({
				targets: 1,
				orderable: false,
				className: 'text-left',
				title: '项目',
				name: 'programName',
				data: 'programName',
				width: '250px',
				visible: true,
				render: function(data, type, row, meta) {
					if (2 === row.isTitle) {
						return '<strong>' + data + '</strong>';
					}
					return data;
				}
			});
		}
		if (tableId.indexOf('quota') >= 0) {
			abstract_view.tableParam.columnDefs.push({
				targets: 1,
				orderable: false,
				className: 'text-left',
				title: '项目',
				name: 'programName',
				data: 'programName',
				width: '250px',
				visible: true,
				render: function(data, type, row, meta) {
					if (2 === row.isTitle) {
						return '<strong>' + data + '</strong>';
					}
					return '<span class="text-center" data-toggle="popover" onmouseover="showFormulaChi(this,' + '\'' + row.formulaChi + '\'' + ')" onmouseleave="hideFormulaChi(this,' + '\'' + row.formulaChi + '\'' + ')">' + data + '</span>';
				}
			});
		}
		abstract_view.tableParam.columnDefs.push({
			targets: 2,
			name: 'programId',
			data: 'programId',
			visible: false
		});
		abstract_view.tableParam.columnDefs.push({
			targets: 3,
			name: 'isTitle',
			data: 'isTitle',
			visible: false
		});
		$.ajax({
				type: 'get',
				url: 'finCenter/analysis.findPeriods.json',
				dataType: 'json',
				data: {param1: $('#customer_startdate').val()+'-01-01',
						param2: $('#customer_enddate').val()+'-12-31', 
						param3: periodStandard
						},
				success: function(data) {
					if (data.success) {
						//如果是杜邦分析tab则生成链接按钮
						var proejectId = $('#projectId').val();
						if (tableId.indexOf('duPont') >= 0) {
							//生成按钮
							$('#duPontDateUl').children().html('');
							for (var i = 0; i < data.data.length; i++) {
								var map = data.data[i];
								$.each(map, function(key, value) {
									$('#duPontDateUl').children().append('<button type="button" class="btn btn-default btn-sm duPontButton" >' + key + '</button>&nbsp;&nbsp;');
								});
							}
							if (proejectId !== null && proejectId !== '') {
								$('#duPontDateUl').children().append('<button type="button" class="btn btn-default btn-sm duPontButton" >未审报表</button>&nbsp;&nbsp;');
								$('#duPontDateUl').children().append('<button type="button" class="btn btn-default btn-sm duPontButton" >审定报表</button>&nbsp;&nbsp;');
							}
							var content = $('#duPontContent');
							content.css('display', 'block');
							var tab = $('#' + tableId);
							tab.html('');
							tab.append(content.clone());
							content.remove();
							$('.duPontButton').click(function() {
								var reportDate = $(this).text();
								showDupont(reportDate);
								$('.duPontButton').removeClass('btn-success');
								$('.duPontButton').addClass('btn-default');
								$(this).addClass('btn-success');
							});
							$('.duPontButton').last().trigger('click');
						} else if (tableId.indexOf('charts') >= 0) {
							//指标分析
							for (var i = 0; i < data.data.length; i++) {
								var map = data.data[i];
								$.each(map, function(key, value) {
									tmpParam[i] = key;
								});
							}
							var paramStr = tmpParam.join(',').toString();
							if (proejectId != null && proejectId !== '') {
								tmpParam.push('未审报表');
								tmpParam.push('审定报表');
							}
							$.ajax({
								type: 'get',
								url: 'finCenter/analysis.getChartsData.json',
								dataType: 'json',
								data: {
									lockCustomerId: $('#slpk').val(),
									param2: paramStr,
									param3: tableId,
									param4: periodStandard
								},
								success: function(data) {
									if (data.success) {
										//清除tableId
										var doc = $('#' + tableId);
										//doc.html('');
										$('#chartsTabContent').find('.block-content.row').empty();
										//封装数据
										for (var i = 0; i < data.data.length; i++) {
											var legendData = [];
											var xAxisData = tmpParam;
											var seriesData = [];
											var yAxisData = [];
											var selectedField = {};
											var tmpChartData = data.data[i];
											var tmpId = tableId + i;
											doc.append('<div id="' + tmpId + '" style="width: ' + tmpChartData.width + 'px;height: ' + tmpChartData.height + 'px" class="col-sm-3 col-xs-3"></div>');
											for (var j = 0; j < tmpChartData.dataList.length; j++) {
												var tmpInnerData = tmpChartData.dataList[j];
												legendData.push(tmpInnerData.field);
												if (j <= 2) {
													selectedField[tmpInnerData.field] = true;
												} else {
													selectedField[tmpInnerData.field] = false;
												}
												yAxisData.push({
													type: 'value',
													show: false
												});
												var tmpData = [];
												for (var k = 0; k < tmpInnerData.data.length; k++) {
													tmpData.push(parseFloat(tmpInnerData.data[k]));
												}
												var magicType = tmpInnerData.magicType;
												var tmpSeries = {
													name: tmpInnerData.field,
													type: magicType,
													stack: tmpInnerData.stock,
													data: tmpData,
													yAxisIndex: j,
													label: {
														normal: {
															show: true,
															position: 'top'
														}
													},
													barMaxWidth: '80',
													barGap: '30%'
												};
												if ('line' === magicType || tmpInnerData.stock !== '') {
													//折线图不显示数据
													tmpSeries.label.normal.show = false;
												}
												if ('bar' === magicType) {
													//柱状图公用同Y轴
													tmpSeries.yAxisIndex = 0;
												}
												seriesData.push(tmpSeries);
											}
											//第一个y轴显示
											yAxisData[0].show = true;
											var option = {
												title: {
													text: tmpChartData.chartName + '(单位:亿)'
												},
												grid: {
													top: '20%'
												},
												tooltip: {
													show: true,
													trigger: 'axis'
												},
												legend: {
													x: '50',
													data: legendData,
													selected: selectedField,
													y: '10%'
												},
												toolbox: {
													show: true,
													feature: {
														restore: {show: true}
													}
												},
												calculable: true,
												xAxis:
													{
														type: 'category',
														data: xAxisData,
														axisLabel: {
															interval: 0,//横轴信息全部显示
															rotate: -30//-30度角倾斜显示
														}
													},
												yAxis: yAxisData,
												series: seriesData
											};
											var tmpChart = echarts.init(document.getElementById(tmpId));
											// 使用刚指定的配置项和数据显示图表。
											tmpChart.setOption(option);
										}
									}
								}
							});
						}
						else {
							//摘要数据和指标展示
							tmpParam = new Array(data.data.length);
							for (var i = 0; i < data.data.length; i++) {
								var map = data.data[i];
								$.each(map, function(key, value) {
									tmpParam[i] = key;
									abstract_view.tableParam.columnDefs.push({
										targets: i + 4,
										orderable: false,
										className: 'text-right',
										title: key,
										name: key,
										data: key,
										visible: true,
										render: function(data, type, row, meta) {
											//当前数
											var thisData = data;
											var beData;
											//获取上一个索引的值
											var beIndex = meta.col - 1;
											if (beIndex <= 3) {
												//上一个索引所在列非含有值的列
												return thisData;
											} else {
												//上一个索引所在列含有值 取出该值进行比较
												var tmpFiled = meta.settings.aoColumns[beIndex].name;
												beData = row[tmpFiled];
												//比较前后结果
												return compareData(thisData, beData);
											}
										}
									});
								});
							}
							if (proejectId != null && proejectId !== '') {
								abstract_view.tableParam.columnDefs.push({
									targets: data.data.length + 4,
									orderable: false,
									className: 'text-right',
									title: '未审报表',
									name: '未审报表',
									data: '未审报表',
									visible: true,
									render: function(data, type, row, meta) {
										//当前数
										var thisData = data;
										var beData;
										//获取上一个索引的值
										var beIndex = meta.col - 1;
										if (beIndex <= 3) {
											//上一个索引所在列非含有值的列
											return thisData;
										} else {
											//上一个索引所在列含有值 取出该值进行比较
											var tmpFiled = meta.settings.aoColumns[beIndex].name;
											beData = row[tmpFiled];
											//比较前后结果
											return compareData(thisData, beData);
										}
									}
								});
								abstract_view.tableParam.columnDefs.push({
									targets: data.data.length + 5,
									orderable: false,
									className: 'text-right',
									title: '审定报表',
									name: '审定报表',
									data: '审定报表',
									visible: true,
									render: function(data, type, row, meta) {
										//当前数
										var thisData = data;
										var beData;
										//获取上一个索引的值
										var beIndex = meta.col - 1;
										if (beIndex <= 3) {
											//上一个索引所在列非含有值的列
											return thisData;
										} else {
											//上一个索引所在列含有值 取出该值进行比较
											var tmpFiled = meta.settings.aoColumns[beIndex].name;
											beData = row[tmpFiled];
											//比较前后结果
											return compareData(thisData, beData);
										}
									}
								});
							}
							paramStr = tmpParam.join(',').toString();
							//参数设置
							abstract_view.localParam.urlparam.param1 = paramStr;
							abstract_view.localParam.urlparam.lockCustomerId = $('#slpk').val();
							//请求路径设置
							if (tableId.indexOf('abstract') >= 0) {
								abstract_view.localParam.url = 'finCenter/analysis.getAbstractData.json';
							}
							if (tableId.indexOf('quota') >= 0) {
								abstract_view.localParam.url = 'finCenter/analysis.getQuotaData.json';
								abstract_view.localParam.urlparam.param3 = periodStandard;
							}

							BdoDataTable(tableId, abstract_view);
							$('#' + tableId).unbind();
							/** 行单击 选中*/
							$('#' + tableId).on('click', 'tr', function() {
								//使摘要table数据中programId为公式相关数据的行颜色改变
								//$('#' + abstractTableId).dataGridView.Columns[""].DefaultCellStyle.BackColor = Color.Red;
								//单击选中
								//var object = $('#' + tableId).DataTable().data()[$(this).closest('tr').index()];
								$(this).toggleClass('selected');
							});
							/** 行双击 生成单表*/
							$('#' + tableId).on('dblclick', 'tr', function() {
								var object = $('#' + tableId).DataTable().data()[$(this).closest('tr').index()];
								if (object.isTitle === 2) {
									return;
								}
								var objectArr = [];
								objectArr.push(object);
								createChart(objectArr);
							});
							if (tableId.indexOf('abstract')) {
								$('#abstractRemix').unbind();
								$('#abstractRemix').click(function() {
									var objectArr = $('#' + abstractTableId).DataTable().rows('.selected').data();
									if (objectArr.length === 0) {
										bdoErrorBox('错误', '请至少选择一行数据');
										return;
									}
									if (objectArr.length > 3) {
										bdoErrorBox('错误', '请至多选择三行数据');
										return;
									}
									createChart(objectArr);
								});
							}
							if (tableId.indexOf('quota')) {
								$('#quotaRemix').unbind();
								/**
								 * 多行图表
								 */
								$('#quotaRemix').click(function() {
									var objectArr = $('#' + quotaTableId).DataTable().rows('.selected').data();
									if (objectArr.length === 0) {
										bdoErrorBox('错误', '请至少选择一个指标');
										return;
									}
									if (objectArr.length > 3) {
										bdoErrorBox('错误', '请至多选择三个指标');
										return;
									}
									createChart(objectArr);
								});
							}
						}
					}
				}
			}
		)
		;
	};


	//比较前后索引上的数据
	var compareData = function(thisData, beData) {
		var thisDataF = parseFloat(thisData);
		var beDataF = parseFloat(beData);
		if (thisDataF != null && beDataF != null) {
			//如果单位存在'万'的除以10000
			if (thisData != null && thisData.indexOf('万') > 0) {
				thisDataF = thisDataF / 10000.0;
			}
			if (beData != null && beData.indexOf('万') > 0) {
				beDataF = beDataF / 10000.0;
			}
			//该索引值小于上个索引 减少 加下箭头加红
			if (thisDataF < beDataF) {
				return '<span style="color: red">' + thisData + '  ↓' + '</span>';
			} else if (thisDataF > beDataF) {
				return '<span style="color: green">' + thisData + '  ↑' + '</span>';
			} else {
				return thisData;
			}
		}
	};

	//生成杜邦数据
	var showDupont = function(reportDate) {
		var companyId = $('#slpk').val();
		if (companyId === null || companyId === '') {
			bdoErrorBox('错误', '请选择公司');
			return;
		}
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findDuPontDate.json',
			dataType: 'json',
			data: {
				lockCustomerId: companyId,
				param2: reportDate
			},
			success: function(data) {
				if (data.success) {
					var map = data.data[0];
					$.each(map, function(key, value) {
						$('#' + key).text('');
						$('#' + key).text(value);
					});
				} else {
					$('#duPontContent').find('p').text('-');
				}
			}
		});
	};

	var quotaChart;
	/**
	 * echart生成
	 * @param object
	 */
	var createChart = function(objectArr) {
		var legendData = [];
		var seriesDataArr = [];
		var xAxisDataFin = [];
		var yAxisData = [];
		var yShow = true;
		if (objectArr.length > 1) {
			yShow = false;
		}
		for (var k = 0; k < objectArr.length; k++) {
			var object = objectArr[k];
			legendData.push(object.programName.replace(/-/g, ''));
			var seriesData = [];
			var xAxisData = [];
			$.each(object, function(key, value) {
				if (key !== 'programName' && key !== 'programId' && key !== 'isTitle' && key !== 'formulaChi') {
					if (value !== '-') {
						value = parseFloat(value);
						seriesData.push(value.toFixed(3));
					} else {
						seriesData.push(null);
					}
					xAxisData.push(key);
				}
			});
			var minYData = parseFloat(seriesData[0]);
			var maxYdata = parseFloat(seriesData[0]);
			for (var i = 0; i < seriesData.length; i++) {
				tmp = parseFloat(seriesData[i]);
				if (minYData === null) {
					minYData = tmp;
				}
				if (maxYdata === null) {
					maxYdata = tmp;
				}
				if (minYData > tmp && tmp !== null) {
					minYData = tmp;
				}
				if (maxYdata < tmp && tmp !== null) {
					maxYdata = tmp;
				}
			}
			var min = (minYData - (maxYdata - minYData) * 0.1).toFixed(2);
			//冒泡排序
			for (var i = 0; i < xAxisData.length; i++) {
				//将为0的数据设置为最小值以不显示
				for (var j = i + 1; j < xAxisData.length; j++) {
					if (xAxisData[i] > xAxisData[j]) {
						var tmp1 = xAxisData[i];
						var tmp2 = seriesData[i];
						xAxisData[i] = xAxisData[j];
						seriesData[i] = seriesData[j];
						xAxisData[j] = tmp1;
						seriesData[j] = tmp2;
					}
				}
			}
			//x轴值设定
			if (k === 0) {
				xAxisDataFin = xAxisData;
			}
			//y轴设定
			yAxisData.push({
				type: 'value',
				min: min,
				show: yShow
			});
			//数据设定
			seriesDataArr.push({
				name: object.programName.replace(/-/g, ''),
				type: 'line',
				data: seriesData,
				markPoint: {
					data: [
						{type: 'max', name: '最大值'},
						{type: 'min', name: '最小值'}
					]
				},
				markLine: {
					data: [
						{type: 'average', name: '平均值'}
					]
				},
				yAxisIndex: k
			});
		}
		//指定图表的配置项和数据
		var option = {
			title: {
				text: '指标图表分析'
			},
			tooltip: {
				show: true,
				trigger: 'axis'
			},
			legend: {
				data: legendData
			},
			xAxis: {
				data: xAxisDataFin,
				axisLabel: {
					interval: 0,//横轴信息全部显示
					rotate: -15//-30度角倾斜显示
				},
				type: 'category',
				boundaryGap: false
			},
			calculable: true,
			toolbox: {
				show: true,
				feature: {
					mark: {show: true},
					dataView: {show: true, readOnly: false},
					magicType: {show: true, type: ['line', 'bar']},
					restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			yAxis: yAxisData,
			series: seriesDataArr
		};
		// 基于准备好的dom，初始化echarts实例
		if (quotaChart !== null && quotaChart !== '' && quotaChart !== undefined) {
			quotaChart.dispose();
		}
		quotaChart = echarts.init(document.getElementById('quotaChart'));
		// 使用刚指定的配置项和数据显示图表。
		quotaChart.setOption(option);
		$('#modal_quota').modal('show');
	};

	function benfordChartInit(param) {
		
		$.ajax({
			url: 'finCenter/Benford.queryBenfordList.json',
			data: param,
			type: 'POST',
			dataType : 'json'
		}).done((data) => {
			if(data.success) {
				var doc = $('#chartsBenford');
				doc.empty();
				if(data.data && data.data.length > 0) {
					for(var i=0;i<data.data.length;i++){
						var seriesData = [];
						var legendData = [];
						let option = {
							title: {
								text: '本福特'
							},
							tooltip : {
								trigger: 'axis',
								formatter: function(params) {
					            var result = params[0].name + "<br>";
					            params.forEach(function(item) {
					              if (item.value) {
					                result += item.marker + " " + item.seriesName + " : " + (item.value*100).toFixed(2) + "%</br>";
					              } else {
					                result += item.marker + " " + item.seriesName + " :  - </br>";
					              }
					            });
					            return result;
					          }
							},
							grid: {
								left: '3%',
								right: '20%',
								bottom: '3%',
								containLabel: true
							},
							legend: {
								x: '50',
								data: [],
								y: '10%'
							},
							toolbox: {
								show: true,
								feature: {
									restore: {show: true}
								}
							},
							xAxis : [
								{
									type : 'category',
									data : ['1', '2', '3', '4', '5', '6', '7', '8', '9']
								}
							],
							yAxis : {
								minInterval: 0.1,
								type : 'value',
								axisLabel: {
				                    show: true,  
				                    interval: 'auto',  
				                    formatter: function(value,index){
				                        return (value*100).toFixed(2)+'%';
				                    }
				                }
							},
							/*yAxis : {
						        type: 'value'
						    },*/
							series : [
								{
									name:'',
									type:'line',
									barWidth: '60%',
									data:[]
								}
							]
						};
						for(var j=0;j<data.data[i].chart.length;j++){
							let tempData = [];
							tempData.push(data.data[i].chart[j].d1);
							tempData.push(data.data[i].chart[j].d2);
							tempData.push(data.data[i].chart[j].d3);
							tempData.push(data.data[i].chart[j].d4);
							tempData.push(data.data[i].chart[j].d5);
							tempData.push(data.data[i].chart[j].d6);
							tempData.push(data.data[i].chart[j].d7);
							tempData.push(data.data[i].chart[j].d8);
							tempData.push(data.data[i].chart[j].d9);
							var tmpSeries = {
								name: data.data[i].chart[j].name,
								type: 'line',
								data: tempData
							};
							seriesData.push(tmpSeries);
							legendData.push(data.data[i].chart[j].name);
							if(data.data[i].chart[j].name.indexOf('客户本福特分布') != -1){
								option.title.text = data.data[i].chart[j].type + '相似度：' + data.data[i].chart[j].result1 + '，差异平方和：'
								+ (data.data[i].chart[j].result2 * 100).toFixed(2) + '%';
							}
						}

						option.series = seriesData;
						option.legend.data = legendData;
						//let dom = document.getElementById("chartsBenford");
						doc.append('<div id="chartsBenford' + i + '" data-height="250" style="height: 300px"></div>')
						let dom = document.getElementById("chartsBenford" + i);
						let myChart = echarts.init(dom);

						if (option && typeof option === "object") {
							myChart.setOption(option, true);
						}
					}
				}else{
					doc.append('没有数据')
				}
			}
		});

	}
	/** 预警指标table 属性 */
	var alman_view = {
		localParam: {
			tabNum: false,
			url: '',
			urlparam: {
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: "<'row'<'col-sm-12'tr>>",
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollCollapse: true,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-left',
					title: '指标',
					name: 'quotaNameChi',
					data: 'quotaNameChi',
					visible: true,
					width: '100px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: '计算公式',
					name: 'formulaChi',
					data: 'formulaChi',
					visible: true,
					width: '150px'
				}]
		}
	};
	var almanSet_view = {
		localParam: {
			tabNum: false,
			url: '',
			urlparam: {
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom:
				"<'row'<'col-sm-12'tr>>" /*+
				"<'row'<'col-sm-6'i><'col-sm-6'p>>"*/,
			ordering: false,
			serverSide: true,
			scrollX: true,
			scrollCollapse: true,
			showCount: false,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-left',
					title: 'Z值（上市公司-制造业）',
					name: 'column1',
					data: 'column1',
					visible: true,
					width: '120px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: 'Z值（其他企业）',
					name: 'column2',
					data: 'column2',
					visible: true,
					width: '120px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '区间释义',
					name: 'column3',
					data: 'column3',
					visible: true,
					width: '200px'
				}]
		}
	};
	var almanResult_view = {
			localParam: {
				tabNum: false,
				url: '',
				urlparam: {
					menuId: window.sys_menuId
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom:
					"<'row'<'col-sm-12'tr>>" /*+
					"<'row'<'col-sm-6'i><'col-sm-6'p>>"*/,
				ordering: false,
				serverSide: true,
				scrollX: true,
				scrollCollapse: true,
				showCount: false,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-left',
						title: '年份',
						name: 'year',
						data: 'year',
						visible: true,
						width: '60px'
					}, {
						targets: 2,
						orderable: false,
						className: 'text-left',
						title: 'Z值公式',
						name: 'zName',
						data: 'zName',
						visible: true,
						width: '200px'
					}, {
						targets: 3,
						orderable: false,
						className: 'text-left',
						title: 'Z值',
						name: 'z',
						data: 'z',
						visible: true,
						width: '50px'
					}, {
						targets: 4,
						orderable: false,
						className: 'text-left',
						title: '预警结论',
						name: 'zRegion',
						data: 'zRegion',
						visible: true,
						width: '120px'
					}]
			}
		};
	/** 设置table */
	function setColumnDefs(table_view,year){
		for(var i = 0;i < year.length;i++){
			table_view.tableParam.columnDefs.push({
				targets: i + 3,
				orderable: false,
				className: 'text-right',
				title: year[i],
				name: year[i],
				data: year[i],
				visible: true,
				width: '80px',
				render: function (data, type, row, meta) {
					if(data != null){
						return formatMoney(data);
					}else{
						return data;
					}
				}
			});
		}
	}
	var almanSet_data = [];
	almanSet_data.push({column1:'Z＜1.81',column2:'Z＜1.21',column3:'存在严重财务危机，破产几率高'});
	almanSet_data.push({column1:'1.81＜=Z＜=2.99',column2:'1.21＜=Z＜=2.99',column3:'财务状况不稳定，仍有可能出现财务困难'});
	almanSet_data.push({column1:'Z＞2.99',column2:'Z＞2.99',column3:'财务状况良好'});
	//查询阿尔曼模型
	function almanChartInit(param) {
		var year = param.param2.split(',');
		var xAxisData = [];
		for(var i = 0;i < year.length;i++){
			xAxisData.push(year[i]);
		}
		$.ajax({
			url: 'finCenter/analysis.queryAlman.json',
			data: param,
			type: 'POST',
			dataType : 'json'
		}).done((data) => {
			if(data.success) {
				var doc = $('#chartsAlman');
				doc.empty();
				if(data.data && data.data.length > 0) {
					var current_alman_view = $.extend(true, {}, alman_view);
					setColumnDefs(current_alman_view, year);
					current_alman_view.localParam.data = data.data[0].quotas;
					BdoDataTable('alman_table', current_alman_view);
					almanSet_view.localParam.data = almanSet_data;
					BdoDataTable('almanSet_table', almanSet_view);
					almanResult_view.localParam.data = data.data[0].charts;
					BdoDataTable('almanResult_table', almanResult_view);
					var seriesData = [];
					var legendData = [];
					let option = {
						title: {
							text: '阿尔曼模型'
						},
						tooltip : {
							trigger: 'axis'
						},
						grid: {
							left: '3%',
							right: '20%',
							bottom: '3%',
							containLabel: true
						},
						legend: {
							x: '50',
							data: [],
							y: '10%'
						},
						toolbox: {
							show: true,
							feature: {
								restore: {show: true}
							}
						},
						xAxis : [
							{
								type : 'category',
								data : xAxisData
							}
						],
						yAxis : {
							minInterval: 0.1,
							type : 'value',
							axisLabel: {
			                    show: true,  
			                    interval: 'auto'
			                }
						},
						/*yAxis : {
					        type: 'value'
					    },*/
						series : [
							{
								name:'',
								type:'line',
								barWidth: '60%',
								data:[]
							}
						]
					};
					let tempData = [];
					let result = '';
					for(var i=0;i<data.data[0].charts.length;i++){
						tempData.push(data.data[0].charts[i].z);
						result = result + data.data[0].charts[i].year + '-' + data.data[0].charts[i].zRegion + '<br>';
					}
					//$('#almanResult').html(result);
					var tmpSeries = {
						name: 'z值',
						type: 'line',
						data: tempData
					};
					seriesData.push(tmpSeries);
					option.title.text = 'z值变化';
					option.series = seriesData;
					if(xAxisData.length > 1){
						doc.append('<div id="chartsAlman0" data-height="250" style="height: 300px"></div>')
						let dom = document.getElementById("chartsAlman0");
						let myChart = echarts.init(dom);
						if (option && typeof option === "object") {
							myChart.setOption(option, true);
						}
					}
				}else{
					doc.append('暂无数据');
				}
			}
		});

	}

	$('#companyCard').click(function() {
		if ($('#slpk').val() === null || $('#slpk').val() === '') {
			bdoErrorBox('错误', '请选择公司');
			return;
		}
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findCompanyInfo.json',
			dataType: 'json',
			data: {param1: $('#slpk').val()},
			success: function(data) {
				if (data.success) {
					$('#companyName').text(data.data[0]['company_name']);
					$('#stockCode').text(data.data[0]['stock_code']);
					$('#inceptionDate').text(data.data[0]['inception_date']);
					$('#ipoDate').text(data.data[0]['ipo_date']);
					$('#secType').text(data.data[0]['sec_type']);
					$('#regcapital').text(parseFloat(data.data[0]['regcapital']).toFixed(2));
					$('#chairman').text(data.data[0]['chairman']);
					$('#discloser').text(data.data[0]['discloser']);
					$('#address').text(data.data[0]['address']);
					$('#office').text(data.data[0]['office']);
					$('#zipcode').text(data.data[0]['zipcode']);
					$('#telephone').text(data.data[0]['telephone']);
					$('#fax').text(data.data[0]['fax']);
					$('#website').html('<a href="#">' + data.data[0]['website'] + '</a>');
					$('#website').unbind();
					$('#website').click(function() {
						window.open('http://' + data.data[0]['website']);
					});
					$('#modal_company').modal('show');
				}
			}
		});
	});

	//重置按钮
	$('#analysis_clear').click(function() {
		$('#stock_code').val('');
		$('#slpk').selectpicker('val', '100001');
		$('#slpk').selectpicker('refresh');
		$('#stock_code').val('000001');
//		$("#analysis_reportType").selectpicker('val', '1');
//		$("#analysis_monoOrMerge").selectpicker('val', '1');
		$('#analysis_period').selectpicker('val', '1');
		
		var date = new Date();
		var year = date.getFullYear();//年
		var month = date.getMonth() + 1;//月份
		var day = date.getDate();//日期
		var str = year;
		$('#customer_enddate').val(str-1);
		$('#customer_startdate').val(str-3);
	});

	/**
	 * 根据公司ID找公司
	 */
	var FindCompanyByCompanyId = function(companyId, element) {
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findCompanyByCompanyId.json',
			dataType: 'json',
			data: {
				param2 : companyId
			},
			success: function(data) {
				if (data.success && data && data.data && data.data.length > 0) {
					element.val(data.data[0].stockCode);
                    $('#analysis_search').click();
				} else{
				bdoErrorBox('错误', '没有找到数据');
				
				}
			}
		});
	};

	/**
	 * 根据股票代码找公司
	 */
	var FindCompanyByStockCode = function(stockCode, element) {
		$.ajax({
			type: 'get',
			url: 'finCenter/analysis.findCompanyByStockCode.json',
			dataType: 'json',
			data: {
				param2 : stockCode
			},
			success: function(data) {
				if (data.success && data && data.data && data.data.length > 0) {
					var option = element.children('option[value=\'' + data.data[0].companyId + '\']');
					option.remove();
					var newOption = '<option value="' + data.data[0].companyId + '">' + data.data[0].companyName + '</option>';
					element.prepend(newOption);
					element.selectpicker('val', data.data[0].companyId);
					element.selectpicker('refresh');
                    $('#analysis_search').click();
				} else{
				bdoErrorBox('错误', '没有找到数据');
				
				}
			}
		});
	};
});