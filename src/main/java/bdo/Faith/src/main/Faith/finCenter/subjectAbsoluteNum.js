//pageRightTitle(pageTitleArr);
$(document).ready(function() {
	uiBlocksApi(false, 'init');
	var tb1 = [];//分组一
	var tb2 = [];//分组二
	var tb3 = [];//分组三
	var chartData = [];
	var chartSwitch = 1;
	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/

	/** 加载 树 下拉框 */
	// 客户
	getUserCustomers('subject_companyid');
	// 日期
	//getUserYear('subject_year');
	//getUserLocalYear('subject_year');
	$('#subject_startYear').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});
	$('#subject_endYear').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});
	//年度改变科目树更新
	$('#subject_endYear').change(function() {
		if ($('#subject_tree').hasClass('treeview')) {
			$('#subject_tree').tree('reset');
			$('#subject_tree').tree('destory');
		}
	});

	//$('#subject_subjectlevel').html(ComboDicOption(false, '科目级别'));
	$('#subject_subjectlevel').html(ComboLocalDicOption(false, '科目级别'));

	//$('#subject_singlelevel').html(ComboDicOption(false, 'boolean'));
	$('#subject_singlelevel').html(ComboLocalDicOption(false, 'boolean'));

	//$('#subject_acctype').html(ComboDicOption(false, '金额类型'));
	$('#subject_acctype').html(ComboLocalDicOption(false, '金额类型'));

	$('#subject_singlelevel').val('0');
	$('#subject_acctype').val('4');
	
	$('#subjectAbsoluteGroup_acctype').html(ComboLocalDicOption(false, '金额类型'));
	$('#subjectAbsoluteGroup_acctype').val('4');
	$('#subjectAbsoluteGroup_dirction').val('plus');
	
	let startyear = window.CUR_PROJECT_START_YEAR;
	if (window.transferedMenu) {
		startyear = window.BDO_YEAR_SELECT + '';
		window.BDO_CUSTOMER_SELECT = window.BDO_CUSTOMER_SELECT_temp;
		window.BDO_YEAR_SELECT = window.BDO_YEAR_SELECT_temp;
		window.transferedMenu = false;
	}
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#subject_year').val(startyear);
	$('#subject_startYear').val(startyear - 1);
	$('#subject_endYear').val(startyear);

	/** table 属性 */
	var absoluatenum_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AbsoluateNum.getAccvalue.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockProjectId: $('#subject_companyid').val(),
				lockYyyy:'',
				param1: ''
			}
		},
		tableParam: {}
	};

	/** 重置按钮 */
	$('#subject_clear').click(function() {
		$('#subject_companyid').val('').trigger('change');
		$('#subject_startYear').val('');
		$('#subject_endYear').val('');
		$('#subject_subjectid').val('');
		$('#subject_subjectlevel').val('00');
		$('#subject_singlelevel').val('0');
		$('#subject_acctype').val('4');
	});
	
	/** 搜索按钮 */
	$('#subject_search').click(function() {
		absoluatenum_view.localParam.url = 'finCenter/AbsoluateNum.getAccvalue.json';
		search_absolute();
	});
	function search_absolute(){
		if ($('#subject_companyid').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#subject_startYear').val() == '') {
			$('#subject_startYear').focus();
			bdoInfoBox('提示', '请选择账套开始年份');
			return;
		}
		if ($('#subject_endYear').val() == '') {
			$('#subject_endYear').focus();
			bdoInfoBox('提示', '请选择账套结束年份');
			return;
		}
		if ($('#subject_table').hasClass('dataTable')) {
			$('#subject_table').DataTable().clear();
			$('#subject_table').DataTable().destroy();
			$('#subject_table').empty();
		}
		var startYear = $('#subject_startYear').val();
		var endYear = $('#subject_endYear').val();
		if(startYear >= endYear){
			bdoInfoBox('提示', '账套开始年份不能大于等于账套结束年份');
			return;
		}
		// 账套过期时间
		getValidDate($('#subject_companyid').val(), $('#subject_endYear').val(), 'validDate');
		let tableColIndex = 1;
		absoluatenum_view.tableParam = {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order: [2, 'ASC'],
			ordering: true,
			serverSide: true,
			fixedThead: true,
			fixedHeight: '500px',
			param1: 'jsq',
			columnDefs: [
				{
					targets: tableColIndex++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '50px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr = '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox"  name="mulsub"><span></span></label><button class="btn btn-xs btn-warning" type="button" name="accView" data-placement="top" title="查看多年月度变化" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
						return renderStr;
					}
				}, {
					targets: tableColIndex++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: tableColIndex++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '150px'
				}]
		};
		for(var i = endYear;i >= startYear;i--){
			absoluatenum_view.tableParam.columnDefs.push({
				targets: tableColIndex++,
				className: 'text-right',
				title: i + '年',
				name: 'accvalue' + i,
				data: 'accvalue' + i,
				width: '100px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
		}
		absoluatenum_view.tableParam.columnDefs.push({
			targets: tableColIndex++,
			className: 'text-right',
			title: endYear - 1 + '至' + endYear + '年增加金额',
			name: 'accvalueC',
			data: 'accvalueC',
			width: '150px',
			render: function(data, type, row, meta) {
				return formatMoney(data);
			}
		});
		absoluatenum_view.tableParam.columnDefs.push({
			targets: tableColIndex++,
			className: 'text-right',
			title: endYear - 1 + '至' + endYear + '年增加金额(％)',
			name: 'accvalueR',
			data: 'accvalueR',
			width: '50px',
			render: function(data, type, row, meta) {
				if (data) {
					if (data >= 0) {
						return (data * 100).toFixed(2) + '%';
					} else {
						return '<font color="red">' + (data * 100).toFixed(2) + '%</font>';
					}
				}
			}
		});
		absoluatenum_view.localParam.urlparam.lockProjectId = $('#subject_companyid').val();
		absoluatenum_view.localParam.urlparam.lockYyyy = $('#subject_endYear').val();
		absoluatenum_view.localParam.urlparam.jsonData = getQueryparam();
		jsq(absoluatenum_view.tableParam, 'subject_table');
		BdoDataTable('subject_table', absoluatenum_view);

		$('#subject_table').on('xhr.dt', function(e, settings, json, xhr) {

			if (json.recordsTotal > 0) {
				$('#subject_view').css('display', 'block');
				$('#subject_export').css('display', 'block');
				$('#account_export_dg').css('display', 'block');
				$('#monthlyVariation_echarts_export').css('display', 'block');
			} else {
				$('#subject_view').css('display', 'none');
				$('#subject_export').css('display', 'none');
				$('#account_export_dg').css('display', 'none');
				$('#monthlyVariation_echarts_export').css('display', 'none');
			}

		});
	}

	$('#subject_table').on('dblclick', 'tbody tr td', function() {
		var object = $('#subject_table').DataTable().data()[$(this).closest('tr').index()];
		var subYear = parseInt($(this).closest('table').find('th').eq($(this).index()).text().substr(0, 4));
		if (subYear) {
			if(object.subjectName.indexOf("分组") != -1){
				subChartsGroup($('#subject_companyid').val(), subYear, subYear, object.subjectName);
				subTableGroup($('#subject_companyid').val(), subYear, subYear, object.subjectName);
			}else{
				subCharts($('#subject_companyid').val(), subYear, subYear, object.subjectId);
				subTable($('#subject_companyid').val(), subYear, subYear, object.subjectId);
			}
		} else {
			if(object.subjectName.indexOf("分组") != -1){
				subChartsGroup($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectName);
				subTableGroup($('#subject_companyid').val(), $('#subject_startYear').val() - 4, $('#subject_endYear').val(), object.subjectName);
			}else{
				subCharts($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectId);
				subTable($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectId);
			}
		}
		$('#monthlyVariation_echarts_switch').css('display', 'none');
	});
	
	/** 单元格点击事件 */
	$('#subject_table').on('click', 'td', function() {

		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_subject_table').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_subject_table').val('(' + data + ')');
			} else {
				$('#suanshi_subject_table').val(data);
			}
			$('#jieguo_subject_table').val(data);
		} else {
			value = $('#suanshi_subject_table').val();
			jieguo = $('#jieguo_subject_table').val();
			if (jieguo.indexOf(',') >= 0) {
				numjieguo = parseFloat(jieguo.split(',').join(''));
			} else {
				numjieguo = parseFloat(jieguo);
			}
			if (data.indexOf(',') >= 0) {
				numdata = parseFloat(data.split(',').join(''));
			} else {
				numdata = parseFloat(data);
			}
			if (data.indexOf('-') >= 0) {
				$('#suanshi_subject_table').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_subject_table').val(value + '+' + data);
			}
			$('#jieguo_subject_table').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	//计算器重置
	$('#jsq_clear_subject_table').on('click', function() {

		$('#suanshi_subject_table').val('');
		$('#jieguo_subject_table').val('');
	});


	/** 导出 */
	$('#subject_export').click(function() {
		exportExcel5(this, '科目绝对数一览', absoluatenum_view, 'subject_table');
	});

	/** 导出到底稿附件  打开Tb附件框 */
	$('#account_export_dg').click(function() {

		var customerId = $('#subject_companyid').val();
		var customername = $('#subject_companyid option:selected').text();

		ecportToDg(customerId, customername, absoluatenum_view);

	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '月度变化';
			data.view = monthlyVariation_view;
			data.table = 'monthlyVariation_table';
			data.customerId = $('#subject_companyid').val();
			//获取获取echarts表格图
			var subchart = echarts.init(document.getElementById('subject_charts'));
			data.imgData = subchart.getDataURL();
			exportExcelToImage(this, data);
		} else {

		}
	}

	/*导出到底稿附件*/
	$('#modal_tbsubjectid_sure').click(onExport);


	/** 查看多项目期末余额月度变化 */
	$('#subject_view').click(function() {
		var mulsub = '';
		var mulaccName = '';
		var count = 0;
		$('input[name="mulsub"]:checked').each(function() {
			var object = $('#subject_table').DataTable().data()[$(this).closest('tr').index()];
			mulsub += object.subjectId + ',';
			mulaccName += object.subjectName + ',';
			count = count + 1;
		});
		if(count == 0){
			$('#subject_table').find('tbody tr').each(function() {
				var object = $('#subject_table').DataTable().data()[$(this).index()];
				mulaccName += object.subjectName + ',';
				count = count + 1;
			});
		}
		if(mulaccName.indexOf("分组") != -1){
			subChartsGroup($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), mulaccName.substr(0, mulaccName.length - 1));
			subTableGroup($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), mulaccName.substr(0, mulaccName.length - 1));
		}else{
			subCharts($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), mulsub.substr(0, mulsub.length - 1));
			subTable($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), mulsub.substr(0, mulsub.length - 1));
		}
		if(count == 2){
			$('#monthlyVariation_echarts_switch').css('display', 'block');
		}else{
			$('#monthlyVariation_echarts_switch').css('display', 'none');
		}
	});

	/** 行按钮 查看 */
	$('#subject_table').on('click', 'button[name="accView"]', function() {
		var object = $('#subject_table').DataTable().data()[$(this).closest('tr').index()];
		if(object.subjectName.indexOf("分组") != -1){
			subChartsGroup($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectName);
			subTableGroup($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectName);
		}else{
			subCharts($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectId);
			subTable($('#subject_companyid').val(), $('#subject_startYear').val(), $('#subject_endYear').val(), object.subjectId);
		}
		$('#monthlyVariation_echarts_switch').css('display', 'none');
	});

	/** 检索条件设置 */
	function getQueryparam() {
		return JSON.stringify({
			subjectId: $('#subject_subjectid').val(),
			subjectLv: $('#subject_subjectlevel').val(),
			singleLv: $('#subject_singlelevel').val(),
			accType: $('#subject_acctype').val(),
			startYear: $('#subject_startYear').val()
		});
	}


	//选择科目
	$('#subject_subjectid').focus(function() {
		if ($('#subject_companyid').val() == '') {
			$('#subject_companyid').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#subject_endYear').val() == '') {
			$('#subject_endYear').focus();
			bdoInfoBox('提示', '请选择账套结束年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#subject_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#subject_companyid').val(),
				lockYyyy: $('#subject_endYear').val().substr(0, 4),
				searchInputId: 'searchInput1'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}/*
			lazyLoad : false,
	        view : {
	            leafIcon: 'fa fa-building text-flat',
	            nodeIcon: 'fa fa-bank text-primary-light',
	            folderSelectable: false,
	            multiSelect: false,
	            showCheckbox: true,
	            selectedColor: '',
	            selectedBackColor: ''
	        }*/
		});
	});
	//选择科目重置
	$('#modal_subjectid_reset').click(function() {
		$('#subject_tree').tree('reset');
	});

	$('#modal_subjectid_sure').click(function() {
		if (typeof($('#subject_tree').tree('getTreeMultiValue')) == 'object') {
			$('#subject_subjectid').val('');
		} else {
			$('#subject_subjectid').val($('#subject_tree').tree('getTreeMultiValue'));
		}
		$('#modal_subjectid').modal('hide');
	});

	var subchartsoption = {
		title: {
			text: ''
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			type: 'scroll',
			data: []
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			width: '95%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '']
		},
		yAxis: {
			type: 'value'
		},
		series: []
	};


	function subCharts(companyId, startYear, endYear, subjectId) {

		$('#modal_subcharts').modal('show');
		subchartsoption.series = [];
		$('#echart_img').show();

		$.ajax({
			url: 'finCenter/AbsoluateNum.getAccvalueDetail.json',
			type: 'post',
			data: {
				lockProjectId: companyId,
				lockYyyy: endYear,
				param3: startYear,
				param4: subjectId,
				param5: $('#subject_acctype').val()
			},
			dataType: 'json',
			success: function(data) {
				$('#echart_img').hide();
				chartData = data.data;
				subchartsoption.series = [];
				subchartsoption.legend.data = [];
				$.each(data.data, function(index, info) {
					subchartsoption.series.push({
						name: info.yyyy + '年度 ' + info.subjectId + '-' + info.fullName,
						type: 'line',
						data: ['', info.accvalue1,
							info.accvalue2, info.accvalue3,
							info.accvalue4, info.accvalue5,
							info.accvalue6, info.accvalue7,
							info.accvalue8, info.accvalue9,
							info.accvalue10, info.accvalue11,
							info.accvalue12, '']
					});
					subchartsoption.legend.data.push(info.yyyy + '年度 ' + info.subjectId + '-' + info.fullName);
				});
				subchartsoption.color = setEchartsColor(subchartsoption.series.length);

				var subchart = echarts.init(document.getElementById('subject_charts'));
				subchart.setOption(subchartsoption, true);

			}
		});
		$('#account_export_dg').css('display', 'block');
		$('#monthlyVariation_echarts_export').css('display', 'block');
		chartSwitch = 1;
	}

	/** 月度变化table 属性 */
	var monthlyVariation_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/AbsoluateNum.getAccvalueDetail.json',
			urlparam: {
				menuId: window.sys_menuId,
				lockProjectId: $('#subject_companyid').val(),
				lockYyyy:'',
				param1: ''
			}
		},
		tableParam: {}
	};

	function subTable(companyId, startYear, endYear, subjectId) {
		monthlyVariation_view.tableParam = {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order: [2, 'ASC'],
			ordering: true,
			serverSide: true,
			scrollY: '100px',
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: '30px'
				}, {
					targets: 2,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-right',
					title: '1月',
					name: 'accvalue1',
					data: 'accvalue1',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 4,
					className: 'text-right',
					title: '2月',
					name: 'accvalue2',
					data: 'accvalue2',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 5,
					className: 'text-right',
					title: '3月',
					name: 'accvalue3',
					data: 'accvalue3',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 6,
					className: 'text-right',
					title: '4月',
					name: 'accvalue4',
					data: 'accvalue4',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '5月',
					name: 'accvalue5',
					data: 'accvalue5',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '6月',
					name: 'accvalue6',
					data: 'accvalue6',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '7月',
					name: 'accvalue7',
					data: 'accvalue7',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					className: 'text-right',
					title: '8月',
					name: 'accvalue8',
					data: 'accvalue8',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 11,
					className: 'text-right',
					title: '9月',
					name: 'accvalue9',
					data: 'accvalue9',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 12,
					className: 'text-right',
					title: '10月',
					name: 'accvalue10',
					data: 'accvalue10',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 13,
					className: 'text-right',
					title: '11月',
					name: 'accvalue11',
					data: 'accvalue11',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 14,
					className: 'text-right',
					title: '12月',
					name: 'accvalue12',
					data: 'accvalue12',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}]
		};
		monthlyVariation_view.localParam.urlparam = {
			lockProjectId: companyId,
			lockYyyy: endYear,
			param3: startYear,
			param4: subjectId,
			param5: $('#subject_acctype').val()
		};
		monthlyVariation_view.localParam.url = 'finCenter/AbsoluateNum.getAccvalueDetail.json';
		BdoDataTable('monthlyVariation_table', monthlyVariation_view);


		/** 单元格点击事件 */
		$('#monthlyVariation_table').on('click', 'td', function(event) {

			event.preventDefault();
			let colIndex = $(this).index();
			if (colIndex > 2) {
				$('#modelclose').click();
				let data = $('#monthlyVariation_table').DataTable().row($(this).parents('tr')).data();
				let customerID = data.customerId;
				let subjectID = data.subjectId;
				let yyyy = data.yyyy;
				let mon = colIndex - 2;
				if (mon < 10) {
					mon = '0' + parseInt(mon);
				}

				let startyearmonth = yyyy + '-' + mon + '-01';
				let new_date = new Date(yyyy, mon, 1);
				let last_date = new Date(new_date.getTime() - 1000 * 60 * 60 * 24);//获得当月最后一天的日期
				window.transferedMenu = true;
				$('body').trigger('transferMenu', [{
					menuId: '40000008'//跳转到凭证查询
				}, function() {
					$('#search_customerId').val(customerID);
					$('#search_subjectId').val(subjectID);

					$('#search_startDate').val(startyearmonth);
					$('#search_endDate').val(last_date.Format('yyyy-MM-dd'));
					$('#search_dateType').val('0');
					$('#search_isInclude').val('0');

					window.transferedMenu = false;


				}]);
			} else {

			}

		});
	}

	Date.prototype.Format = function(fmt) {
		var o = {
			'M+': this.getMonth() + 1, //月份
			'd+': this.getDate(), //日
			'H+': this.getHours(), //小时
			'm+': this.getMinutes(), //分
			's+': this.getSeconds(), //秒
			'q+': Math.floor((this.getMonth() + 3) / 3), //季度
			'S': this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		return fmt;

	};
	$('#modal_subcharts').on('shown.bs.modal', function() {
		var subchart = echarts.init(document.getElementById('subject_charts'));
		subchart.setOption(subchartsoption, true);
	});


	/** 导出echarts */
	$('#monthlyVariation_echarts_export').click(function() {
		//获取获取echarts表格图
		var subchart = echarts.init(document.getElementById('subject_charts'));
		var imgData = subchart.getDataURL();

		exportEchartsExcel(this, '月度变化', monthlyVariation_view, 'monthlyVariation_table', imgData);
		//	exportExcelFin(this, '月度变化', monthlyVariation_view, 'subject_table');
	});
	/** 自定义分组 */
	$('#group_search').click(function() {
		$('#modal_subjectAbsoluteGroup').modal('show');
	});
	//选择科目
	$('#subjectAbsoluteGroup_subjectid').focus(function() {
		if ($('#subject_companyid').val() == '') {
			$('#subject_companyid').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#subject_endYear').val() == '') {
			$('#subject_endYear').focus();
			bdoInfoBox('提示', '请选择账套结束年份');
			return;
		}
		$('#modal_subjectid_group').modal('show');
		if ($('#subject_tree_group').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_group').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#subject_companyid').val(),
				lockYyyy: $('#subject_endYear').val().substr(0, 4),
				searchInputId: 'searchInput1_group'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''

			}/*
			lazyLoad : false,
	        view : {
	            leafIcon: 'fa fa-building text-flat',
	            nodeIcon: 'fa fa-bank text-primary-light',
	            folderSelectable: false,
	            multiSelect: false,
	            showCheckbox: true,
	            selectedColor: '',
	            selectedBackColor: ''
	        }*/
		});
	});
	//选择科目重置
	$('#modal_subjectid_reset_group').click(function() {
		$('#subject_tree_group').tree('reset');
	});

	$('#modal_subjectid_sure_group').click(function() {
		if (typeof($('#subject_tree_group').tree('getTreeMultiValue')) == 'object') {
			$('#subjectAbsoluteGroup_subjectid').val('');
		} else {
			$('#subjectAbsoluteGroup_subjectid').val($('#subject_tree_group').tree('getTreeMultiValue'));
		}
		$('#modal_subjectid_group').modal('hide');
	});
	var group_view = {
		localParam: {
			tabNum: true,
		},
		tableParam: {
			pageLength: 1000,
			//data: initData,
			dom: '<"row"<"col-sm-12"tr>>',
			ordering: false,
			lengthChange: false,
			select: false,
			scrollY: false,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="groupDeleteBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 2,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '金额类型',
					name: 'acctypeName',
					data: 'acctypeName',
					width: '100px'
				}, {
					targets: 4,
					orderable: false,
					className: 'text-left',
					title: '金额方向',
					name: 'dirctionName',
					data: 'dirctionName',
					width: '60px'
				}, {
					targets: 5,
					orderable: false,
					className: 'hide',
					title: '金额类型',
					name: 'acctype',
					data: 'acctype',
					width: '60px'
				}, {
					targets: 6,
					orderable: false,
					className: 'hide',
					title: '金额方向',
					name: 'dirction',
					data: 'dirction',
					width: '60px'
				}
			]
		}
	};
	BdoDataTable('subjectAbsoluteGroup1_table', group_view);
	BdoDataTable('subjectAbsoluteGroup2_table', group_view);
	BdoDataTable('subjectAbsoluteGroup3_table', group_view);
	function checkGroup(){
		if($('#subjectAbsoluteGroup_subjectid').val() == null || $('#subjectAbsoluteGroup_subjectid').val() == ''){
			bdoInfoBox('提示', '请选择科目');
			return false;
		}
		if($('#subjectAbsoluteGroup_acctype').val() == null || $('#subjectAbsoluteGroup_acctype').val() == ''){
			bdoInfoBox('提示', '请选择金额类型');
			return false;
		}
		if($('#subjectAbsoluteGroup_dirction').val() == null || $('#subjectAbsoluteGroup_dirction').val() == ''){
			bdoInfoBox('提示', '请选择金额方向');
			return false;
		}
		return true;
	}
	//添加行
	$('#subjectAbsoluteGroup1_add').click(function() {
		if(checkGroup()){
			$('#subjectAbsoluteGroup1_table').DataTable().row.add({
				subjectId: $('#subjectAbsoluteGroup_subjectid').val(),
				acctypeName: $('#subjectAbsoluteGroup_acctype').find('option:selected').text(),
				dirctionName: $('#subjectAbsoluteGroup_dirction').find('option:selected').text(),
				acctype: $('#subjectAbsoluteGroup_acctype').val(),
				dirction: $('#subjectAbsoluteGroup_dirction').val()
			}).draw();
		}
	});
	//删除行
	$('#subjectAbsoluteGroup1_table').on('click', 'button[name="groupDeleteBtn"]', function(event) {
		var object = $('#subjectAbsoluteGroup1_table').DataTable().data()[$(this).closest('tr').index()];
		var row = $('#subjectAbsoluteGroup1_table').DataTable().row([$(this).closest('tr').index()]);//行
		row.remove().draw();
	});
	//添加行
	$('#subjectAbsoluteGroup2_add').click(function() {
		if(checkGroup()){
			$('#subjectAbsoluteGroup2_table').DataTable().row.add({
				subjectId: $('#subjectAbsoluteGroup_subjectid').val(),
				acctypeName: $('#subjectAbsoluteGroup_acctype').find('option:selected').text(),
				dirctionName: $('#subjectAbsoluteGroup_dirction').find('option:selected').text(),
				acctype: $('#subjectAbsoluteGroup_acctype').val(),
				dirction: $('#subjectAbsoluteGroup_dirction').val()
			}).draw();
		}
	});
	//删除行
	$('#subjectAbsoluteGroup2_table').on('click', 'button[name="groupDeleteBtn"]', function(event) {
		var object = $('#subjectAbsoluteGroup2_table').DataTable().data()[$(this).closest('tr').index()];
		var row = $('#subjectAbsoluteGroup2_table').DataTable().row([$(this).closest('tr').index()]);//行
		row.remove().draw();
	});
	//添加行
	$('#subjectAbsoluteGroup3_add').click(function() {
		if(checkGroup()){
			$('#subjectAbsoluteGroup3_table').DataTable().row.add({
				subjectId: $('#subjectAbsoluteGroup_subjectid').val(),
				acctypeName: $('#subjectAbsoluteGroup_acctype').find('option:selected').text(),
				dirctionName: $('#subjectAbsoluteGroup_dirction').find('option:selected').text(),
				acctype: $('#subjectAbsoluteGroup_acctype').val(),
				dirction: $('#subjectAbsoluteGroup_dirction').val()
			}).draw();
		}
	});
	//删除行
	$('#subjectAbsoluteGroup3_table').on('click', 'button[name="groupDeleteBtn"]', function(event) {
		var object = $('#subjectAbsoluteGroup3_table').DataTable().data()[$(this).closest('tr').index()];
		var row = $('#subjectAbsoluteGroup3_table').DataTable().row([$(this).closest('tr').index()]);//行
		row.remove().draw();
	});
	//分组查询
	$('#subjectAbsoluteGroup_search').click(function() {
		var len1 = $('#subjectAbsoluteGroup1_table').DataTable().data().length;
		var len2 = $('#subjectAbsoluteGroup2_table').DataTable().data().length;
		var len3 = $('#subjectAbsoluteGroup3_table').DataTable().data().length;
		tb1 = [];
		tb2 = [];
		tb3 = [];
		if(len1 > 0){
			$('#subjectAbsoluteGroup1_table').find('tbody tr').each(function() {
				var object = $('#subjectAbsoluteGroup1_table').DataTable().data()[$(this).index()];
				var subjectId = object.subjectId;
				var acctype = object.acctype;
				var dirction = object.dirction;

				tb1.push({
					subjectId: subjectId,
					acctype: acctype,
					dirction: dirction
				});
			});
		}
		if(len2 > 0){
			$('#subjectAbsoluteGroup2_table').find('tbody tr').each(function() {
				var object = $('#subjectAbsoluteGroup2_table').DataTable().data()[$(this).index()];
				var subjectId = object.subjectId;
				var acctype = object.acctype;
				var dirction = object.dirction;

				tb2.push({
					subjectId: subjectId,
					acctype: acctype,
					dirction: dirction
				});
			});
		}
		if(len3 > 0){
			$('#subjectAbsoluteGroup3_table').find('tbody tr').each(function() {
				var object = $('#subjectAbsoluteGroup3_table').DataTable().data()[$(this).index()];
				var subjectId = object.subjectId;
				var acctype = object.acctype;
				var dirction = object.dirction;

				tb3.push({
					subjectId: subjectId,
					acctype: acctype,
					dirction: dirction
				});
			});
		}
		absoluatenum_view.localParam.url = 'finCenter/AbsoluateNum.getAccvalueGroup.json';
		absoluatenum_view.localParam.urlparam.param2 = JSON.stringify(tb1);
		absoluatenum_view.localParam.urlparam.param3 = JSON.stringify(tb2);
		absoluatenum_view.localParam.urlparam.param4 = JSON.stringify(tb3);
		absoluatenum_view.localParam.urlparam.param13 = '分组一';
		absoluatenum_view.localParam.urlparam.param14 = '分组二';
		absoluatenum_view.localParam.urlparam.param15 = '分组三';
		$('#modal_subjectAbsoluteGroup').modal('hide');
		search_absolute();
	});

	function subChartsGroup(companyId, startYear, endYear, accName) {

		$('#modal_subcharts').modal('show');
		subchartsoption.series = [];
		$('#echart_img').show();
		var paramData = {
				lockProjectId: companyId,
				lockYyyy: endYear,
				param3: startYear,
				param5: $('#subject_acctype').val()
			};
		var accNameArr = accName.split(',');
		for(var i = 0;i < accNameArr.length;i++){
			if(accNameArr[i] == '分组一'){
				paramData.param8 = JSON.stringify(tb1);
				paramData.param13 = accNameArr[i];
			}else if(accNameArr[i] == '分组二'){
				paramData.param9 = JSON.stringify(tb2);
				paramData.param14 = accNameArr[i];
			}else if(accNameArr[i] == '分组三'){
				paramData.param10 = JSON.stringify(tb3);
				paramData.param15 = accNameArr[i];
			}
		}

		$.ajax({
			url: 'finCenter/AbsoluateNum.getAccvalueDetailGroup.json',
			type: 'post',
			data: paramData,
			dataType: 'json',
			success: function(data) {
				$('#echart_img').hide();
				chartData = data.data;
				subchartsoption.series = [];
				subchartsoption.legend.data = [];
				$.each(data.data, function(index, info) {
					subchartsoption.series.push({
						name: info.yyyy + '年度 ' + info.subjectId + '-' + info.fullName,
						type: 'line',
						data: ['', info.accvalue1,
							info.accvalue2, info.accvalue3,
							info.accvalue4, info.accvalue5,
							info.accvalue6, info.accvalue7,
							info.accvalue8, info.accvalue9,
							info.accvalue10, info.accvalue11,
							info.accvalue12, '']
					});
					subchartsoption.legend.data.push(info.yyyy + '年度 ' + info.subjectId + '-' + info.fullName);
				});
				subchartsoption.color = setEchartsColor(subchartsoption.series.length);

				var subchart = echarts.init(document.getElementById('subject_charts'));
				subchart.setOption(subchartsoption, true);
				//subchart.resize;

			}
		});
		$('#account_export_dg').css('display', 'block');
		$('#monthlyVariation_echarts_export').css('display', 'block');
		chartSwitch = 1;
	}
	function subTableGroup(companyId, startYear, endYear, accName) {
		monthlyVariation_view.tableParam = {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order: [2, 'ASC'],
			ordering: true,
			serverSide: true,
			scrollY: '100px',
			fixedThead: true,
			fixedHeight: '500px',
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: '30px'
				}, {
					targets: 2,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-right',
					title: '1月',
					name: 'accvalue1',
					data: 'accvalue1',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 4,
					className: 'text-right',
					title: '2月',
					name: 'accvalue2',
					data: 'accvalue2',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 5,
					className: 'text-right',
					title: '3月',
					name: 'accvalue3',
					data: 'accvalue3',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 6,
					className: 'text-right',
					title: '4月',
					name: 'accvalue4',
					data: 'accvalue4',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 7,
					className: 'text-right',
					title: '5月',
					name: 'accvalue5',
					data: 'accvalue5',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 8,
					className: 'text-right',
					title: '6月',
					name: 'accvalue6',
					data: 'accvalue6',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 9,
					className: 'text-right',
					title: '7月',
					name: 'accvalue7',
					data: 'accvalue7',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					className: 'text-right',
					title: '8月',
					name: 'accvalue8',
					data: 'accvalue8',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 11,
					className: 'text-right',
					title: '9月',
					name: 'accvalue9',
					data: 'accvalue9',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 12,
					className: 'text-right',
					title: '10月',
					name: 'accvalue10',
					data: 'accvalue10',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 13,
					className: 'text-right',
					title: '11月',
					name: 'accvalue11',
					data: 'accvalue11',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 14,
					className: 'text-right',
					title: '12月',
					name: 'accvalue12',
					data: 'accvalue12',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}]
		};
		var paramData = {
				lockProjectId: companyId,
				lockYyyy: endYear,
				param3: startYear,
				param5: $('#subject_acctype').val()
			};
		var accNameArr = accName.split(',');
		for(var i = 0;i < accNameArr.length;i++){
			if(accNameArr[i] == '分组一'){
				paramData.param8 = JSON.stringify(tb1);
				paramData.param13 = accNameArr[i];
			}else if(accNameArr[i] == '分组二'){
				paramData.param9 = JSON.stringify(tb2);
				paramData.param14 = accNameArr[i];
			}else if(accNameArr[i] == '分组三'){
				paramData.param10 = JSON.stringify(tb3);
				paramData.param15 = accNameArr[i];
			}
		}

		monthlyVariation_view.localParam.urlparam = paramData;
		monthlyVariation_view.localParam.url = 'finCenter/AbsoluateNum.getAccvalueDetailGroup.json';
		BdoDataTable('monthlyVariation_table', monthlyVariation_view);

	}
	//切换双维度
	$('#monthlyVariation_echarts_switch').click(function() {
		if(chartSwitch == 1){
			var subjectName = '';
			$.each(chartData, function(index, info) {
				if(subjectName == ''){
					subjectName = info.subjectName;
				}else if(subjectName != info.subjectName){
					subchartsoption.yAxis = [{
	        	        type: 'value',
	        	        name: '',
	        			axisLabel: {
	        				formatter: '{value}'
	        			}
	        	    },
	        	    {
	        	        type: 'value',
	        	        name: '',
	        			axisLabel: {
	        				formatter: '{value}'
	        			}
	        	    }];
					subchartsoption.series[index].yAxisIndex = 1;
				}
			});
			chartSwitch = 2;
		}else{
			$.each(chartData, function(index, info) {
				subchartsoption.yAxis = [{
        	        type: 'value',
        	        name: '',
        			axisLabel: {
        				formatter: '{value}'
        			}
        	    }];
				subchartsoption.series[index].yAxisIndex = 0;
			});
			chartSwitch = 1;
		}
		
		var subchart = echarts.init(document.getElementById('subject_charts'));
		subchart.setOption(subchartsoption, true);
	});
	// 
	var setEchartsColor = function(len){
		/*var part1 = 360/len;
		var part2 = 60/5;
		var colorList = [];
		var tmp;
		for(var i = 1;i <= len;i++){
		  tmp = (i % 5) * part2 + 30;
		  colorList.push('hsl(' + parseInt(i * part1) + ',' + tmp + '%,' + tmp + '%');
		}
		return colorList;*/
		var colorList = [];
		for(var i = 1;i <= len;i++){
			colorList.push(handleColors());
		}
		return colorList;
	}
	var handleColors = function(){
	    let color = '';
	    let r=Math.floor(Math.random()*256);
	    let g=Math.floor(Math.random()*256);
	    let b=Math.floor(Math.random()*256);
	    color = `rgb(${r},${g},${b})`;
	    return color;//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
	}
});