$(document).ready(function () {
	uiBlocksApi(false, 'init');

	var table = 'subjectEntry';

	$('#subjectlist_block').hide();
	$('#subjectlist_block_echarts').hide();

	/** 下拉框 获取字典 */
	// 客户
	getUserCustomers('analysis_customerId');
	// 日期
	$('#analysis_yyyy').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});
	let startyear = window.CUR_PROJECT_START_YEAR;
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#analysis_yyyy').val(startyear);

	var getInfrequentSubjectsECharts = function () {
		var params = {
			'sqlId': 'FIN108003',
			'lockProjectId': $('#analysis_customerId').val(),
			'param2': $('#analysis_count').val(),
			'lockYyyy': $('#analysis_yyyy').val(),
			'param4': $('#analysis_start_money').val(),
			'param5': $('#analysis_end_money').val()
		};
		$.ajax({
			type: 'post',
			url: 'finCenter/General.query.json',
			data: params,
			dataType: 'json',
			success: function (result) {
				setEcharts(result.data);
			}
		});
	};

	var setEcharts = function (result) {
		if (!result || result.length == 0) {
			return;
		}
		var legendData = [];
		var selectedData = {};
		for (var i = 0; i < result.length; i++) {
			legendData[i] = result[i].name;
			if (i < 5) {
				selectedData[result[i].name] = true;
			} else {
				selectedData[result[i].name] = false;
			}
		}

		var myChart = echarts.init(document.getElementById('analysis_echarts'));
		option = {
			title: {
				text: '非常用科目统计',

				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				type: 'scroll',
				orient: 'vertical',
				left: 'right',
				right: 'right',
				top: '20',
				bottom: '20',
				data: legendData
			},
			series: [
				{
					name: '科目名称',
					type: 'pie',
					radius: '55%',
					center: ['40%', '50%'],
					data: result,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
		myChart.clear();
		myChart.setOption(option);
		chartClick(myChart);
	};


	/** table 属性 */
	var analsubject_index = 1;
	var analsubject_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/InfrequentSubjectsAnalysis.getInfrequentSubjects.json',
			urlparam: {
				param1: ''
			}
		},
		tableParam: {
			select: true,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide: true,
			fixedThead: true,
			fixedHeight: '500px',
			ordering: false,
			columnDefs: [
				{
					targets: analsubject_index++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					visible: true,
					width: '80px'
				}, {
					targets: analsubject_index++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: analsubject_index++,
					className: 'text-center',
					title: '凭证数量',
					name: 'vchCount',
					data: 'vchCount',
					width: '100px'
				}, {
					targets: analsubject_index++,
					className: 'text-center',
					title: '凭证分录数量',
					name: 'jourCount',
					data: 'jourCount',
					width: '100px'
				}, {
					targets: analsubject_index++,
					className: 'text-right',
					title: '借绝对值+贷绝对值',
					name: 'absvalue',
					data: 'absvalue',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: analsubject_index++,
					className: 'text-right',
					title: '借-贷',
					name: 'amount',
					data: 'amount',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}]
		}
	};

	var vchsubject_index = 1;
	var vchsubject_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/InfrequentSubjectsAnalysis.getInfrequentSubjects.json',
			urlparam: {
				param1: ''
			}
		},
		tableParam: {
			select: true,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide: true,
			fixedThead: true,
			fixedHeight: '500px',
			ordering: false,
			columnDefs: [
				{
					targets: vchsubject_index++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					visible: true,
					width: '80px'
				}, {
					targets: vchsubject_index++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: vchsubject_index++,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '100px'
				}, {
					targets: vchsubject_index++,
					className: 'text-center',
					title: '凭证号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '100px'
				}, {
					targets: vchsubject_index++,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: vchsubject_index++,
					className: 'text-right',
					title: '借方发生额',
					name: 'dr',
					data: 'dr',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: vchsubject_index++,
					className: 'text-right',
					title: '贷方发生额',
					name: 'cr',
					data: 'cr',
					width: '80px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}]
		}
	};

	/** 行双击 */
	$('#' + table).on('dblclick', 'tbody tr', function () {
		var object = $('#' + table).DataTable().data()[$(this).closest('tr').index()];
		accountledagerTab('tab_detailaccount', $('#analysis_customerId').val(), $('#analysis_yyyy').val(), object.subjectId);
	});

	/** 单元格点击事件 */
	$('#subjectEntry').on('click', 'td', function () {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_subjectEntry').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_subjectEntry').val('(' + data + ')');
			} else {
				$('#suanshi_subjectEntry').val(data);
			}
			$('#jieguo_subjectEntry').val(data);
		} else {
			value = $('#suanshi_subjectEntry').val();
			jieguo = $('#jieguo_subjectEntry').val();
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
				$('#suanshi_subjectEntry').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_subjectEntry').val(value + '+' + data);
			}
			$('#jieguo_subjectEntry').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	//计算器重置
	$('#jsq_clear_subjectEntry').on('click', function () {

		$('#suanshi_subjectEntry').val('');
		$('#jieguo_subjectEntry').val('');
	});

	// $('#count_detail').click(function () {
	// 	if ($('#analysis_customerId').val() == '') {
	// 		bdoInfoBox('提示', '请输入客户编号');
	// 		return;
	// 	}
	// 	var params = {
	// 		'menuId': window.sys_menuId,
	// 		'lockProjectId': $('#analysis_customerId').val(),
	// 		'lockYyyy': $('#analysis_yyyy').val(),
	// 		'param1': $('#analysis_subjectid').val(),
	// 		'param2': $('#start_moneycount').val(),
	// 		'param3': $('#end_moneycount').val(),
	// 		'param5': $('#analysis_moneyType').val(),
	// 		'param6': ''
	// 	};
	// 	if ($('#isaType').prop("checked")) {
	// 		vchsubject_view.localParam.urlparam = params;
	// 		BdoDataTable(table, vchsubject_view);
	// 	} else {
	// 		analsubject_view.localParam.urlparam = params;
	// 		BdoDataTable(table, analsubject_view);
	// 	}
	// 	$('#subjectlist_block').show();
	// 	$('#subjectlist_block_echarts').show();
	// });

	$('#isaType').on('change', function (event) {
		$('#btn_search').click();
	});

	/** 搜索按钮 */
	$('#btn_search').click(function () {
		if ($('#analysis_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}
		if ($('#analysis_yyyy').val() == '') {
			$('#analysis_yyyy').focus();
			bdoInfoBox('提示', '请选择年份');
			return;
		}
		if ($('#analysis_count').val() == '' && $('#analysis_start_money').val() == '' && $('#analysis_end_money').val() == '') {
			bdoInfoBox('提示', '请输入凭证分录数量或者计量金额');
			return;
		}
		if ($('#analysis_start_money').val() != '' && !isNumber($('#analysis_start_money').val())) {
			bdoInfoBox('提示', '计量金额必须为正数');
			return;
		}
		if ($('#analysis_end_money').val() != '' && !isNumber($('#analysis_end_money').val())) {
			bdoInfoBox('提示', '计量金额必须为正数');
			return;
		}
		// 账套过期时间
		getValidDate($('#analysis_customerId').val(), $('#analysis_yyyy').val(), 'validDate');

		if ($('#isaType').prop("checked")) {
			vchsubject_view.localParam.urlparam = {
				'lockProjectId': $('#analysis_customerId').val(),
				'lockYyyy': $('#analysis_yyyy').val(),
				'param1': '1',
				'param2': $('#analysis_count').val(),
				'param3': $('#analysis_start_money').val(),
				'param4': $('#analysis_end_money').val()
			};
			jsq(vchsubject_view.tableParam, table);
			BdoDataTable(table, vchsubject_view);
		} else {
			analsubject_view.localParam.urlparam = {
				'lockProjectId': $('#analysis_customerId').val(),
				'lockYyyy': $('#analysis_yyyy').val(),
				'param1': '0',
				'param2': $('#analysis_count').val(),
				'param3': $('#analysis_start_money').val(),
				'param4': $('#analysis_end_money').val()
			};
			jsq(analsubject_view.tableParam, table);
			BdoDataTable(table, analsubject_view);
		}
		
		$('#subjectlist_block').show();
		$('#subjectlist_block_echarts').show();

		getInfrequentSubjectsECharts();

		$('#subjectEntry').on('xhr.dt', function (e, settings, json, xhr) {
			if (json.recordsTotal > 0) {
				$('#infrequentSubjectsAnalysis_export').css('display', 'block');
				$('#infrequentSubjectsAnalysis_export_dg').css('display', 'block');
			} else {
				$('#infrequentSubjectsAnalysis_export').css('display', 'none');
				$('#infrequentSubjectsAnalysis_export_dg').css('display', 'none');
			}
		});
	});

	/** 导出 */
	$('#infrequentSubjectsAnalysis_export').click(function () {
		//获取获取echarts表格图
		var subchart = echarts.init(document.getElementById('analysis_echarts'));
		var imgData = subchart.getDataURL();
		if ($('#isaType').prop("checked")) {
			exportEchartsExcel(this, '非常用科目分析-凭证模式', vchsubject_view, table, imgData);
		} else {
			exportEchartsExcel(this, '非常用科目分析-科目模式', analsubject_view, table, imgData);
		}
	});

	/** 导出到底稿附件  打开Tb附件框 */
	$('#infrequentSubjectsAnalysis_export_dg').click(function () {
		var customerId = $('#analysis_customerId').val();
		var customername = $('#analysis_customerId option:selected').text();
		if ($('#isaType').prop("checked")) {
			ecportToDg(customerId, customername, vchsubject_view);
		} else {
			ecportToDg(customerId, customername, analsubject_view);
		}
	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			if ($('#isaType').prop("checked")) {
				data.view = vchsubject_view;
				data.title = '非常用科目分析-凭证模式';
			} else {
				data.view = analsubject_view;
				data.title = '非常用科目分析-科目模式';
			}
			data.table = table;
			data.customerId = $('#analysis_customerId').val();
			//获取获取echarts表格图
			var subchart = echarts.init(document.getElementById('analysis_echarts'));
			data.imgData = subchart.getDataURL();
			exportExcelToImage(this, data);
		} else {

		}
	}

	/*导出到底稿附件*/
	$('#modal_tbsubjectid_sure').click(onExport);

	$('#start_moneycount').blur(function () {
		getVoucherCount();
	});
	$('#end_moneycount').blur(function () {
		getVoucherCount();
	});
	/** 重置按钮 */
	$('#btn_clear').click(function () {
		$('#analysis_customerId').val('').trigger('change');
		//getUserYear('analysis_startyyyy');
		getUserLocalYear('analysis_startyyyy');
		$('#subjectlist_block').hide();
		$('#subjectlist_block_echarts').hide();
		//$('#'+table).dataTable().fnClearTable();
		//$('#'+table).dataTable().fnDestroy();
	});

	function isNumber(val) {
		var regPos = /^\d+(\.\d+)?$/; //非负浮点数
		//var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
		if (regPos.test(val)) {
			return true;
		} else {
			return false;
		}
	}
	// 凭证详细
	var voucherDetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'FIN108005',
				start: -1,
				limit: -1
			}
		},
		tableParam: {
			select: true,
			scrollY: '300',
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			lengthChange: false,
			ordering: false,
			//order: [3, 'asc'],
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-center',
				title: '凭证日期',
				name: 'vchDate',
				data: 'vchDate',
				width: '100px'
			}, {
				targets: 2,
				className: 'text-center',
				title: '字',
				name: 'typeId',
				data: 'typeId',
				width: '80px'
			}, {
				targets: 3,
				className: 'text-center',
				title: '号',
				name: 'oldVoucherId',
				data: 'oldVoucherId',
				width: '80px'
			}, {
				targets: 4,
				className: 'text-left',
				title: '摘要',
				name: 'summary',
				data: 'summary',
				width: '200px'
			}, {
				targets: 5,
				className: 'text-right',
				title: '借方发生额',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			},{
				targets: 6,
				className: 'text-right',
				title: '贷方发生额',
				name: 'creditOcc',
				data: 'creditOcc',
				width: '100px',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 7,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '100px'
			}, {
				targets: 8,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '200px'
			}]
		}
	};
	// 点击饼图查看详细表单
	function chartClick(elem) {
		elem.off('click');
		elem.on('click', function (e) {
			voucherDetail_view.localParam.urlparam.lockProjectId = e.data.customerId;
			voucherDetail_view.localParam.urlparam.lockYyyy = e.data.yyyy;
			voucherDetail_view.localParam.urlparam.param1 = e.data.subjectId;
			BdoDataTable('modal_voucher_detail_table', voucherDetail_view);
			$('#modal_detail_info').html('&emsp;' + e.data.name);
			$('#modal_voucher_detail').modal('show');
		});
	}
	// 导出凭证详细
	$('#modal_voucher_detail_export').on('click', function () {
		exportExcelFin(this, '非常用科目凭证详细', voucherDetail_view, 'modal_voucher_detail_export');
	});
});