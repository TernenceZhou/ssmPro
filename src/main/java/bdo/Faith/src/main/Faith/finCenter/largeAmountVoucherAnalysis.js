$(document).ready(function() {
	//pageRightTitle(pageTitleArr);
	uiBlocksApi(false, 'init');
	var formId = 'regist_form';
	var table = 'subjectEntry';
	$('#analysis_count').hide();

	/*	$('.modal').on('show.bs.modal', function(){
			$(this).draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			$(this).css('overflow', 'hidden');
		});*/

	$('#subjectlist_block').hide();
	$('#subjectlist1_block').hide();


	/** 下拉框 获取字典 */
	// 客户
	getUserCustomers('largeanalysis_customerId');
	// 日期
	//getUserYear('analysis_yyyy');
//	getUserLocalYear('analysis_yyyy');
	$('#analysis_yyyy').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});

	$('#analysis_yyyy').change(function() {
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			$('#accmulsubject_tree').tree('reset');
			$('#accmulsubject_tree').tree('destory');
		}
	});
	let startyear = window.CUR_PROJECT_START_YEAR;    //2018
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#analysis_yyyy').val(startyear);

	$('#analysis_subjectid').focus(function() {
		if ($('#largeanalysis_customerId').val() == '') {
			$('#largeanalysis_customerId').focus();
			bdoErrorBox('错误', '请选择客户');
			return;
		}
		if ($('#analysis_yyyy').val() == '') {
			$('#analysis_yyyy').focus();
			bdoErrorBox('错误', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			return;
		}
		$('#accmulsubject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#largeanalysis_customerId').val(),
				lockYyyy: $('#analysis_yyyy').val(),
				searchInputId: 'searchInput2'
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

			}
		});
	});


	$('#modal_accmulsubjectid_sure').click(function() {
		if (typeof($('#accmulsubject_tree').tree('getTreeMultiValue')) == 'object') {
			$('#analysis_subjectid').val('');
		} else {
			$('#analysis_subjectid').val($('#accmulsubject_tree').tree('getTreeMultiValue'));
		}
		$('#modal_subjectid').modal('hide');
	});

	$('#modal_accmulsubjectid_reset').click(function() {
		$('#accmulsubject_tree').tree('reset');
	});
	var dirctionName = '';
	var getLargeAmountECharts = function() {
		var params = {
			'lockProjectId': $('#largeanalysis_customerId').val(),
//			'customerId': $('#largeanalysis_customerId').val(),
			lockYyyy: $('#analysis_yyyy').val(),
			'subjectid': $('#analysis_subjectid').val(),
			'start_money': $('#start_money').val(),
			'end_money': $('#end_money').val(),
			'direction': $('#analysis_moneyType').val()
		};


		if ($('#analysis_moneyType').val() == 1) {
			dirctionName = '借方发生额';
		} else {
			dirctionName = '贷方发生额';
		}
		$.ajax({
			type: 'get',
			url: 'finCenter/LargeAmountVoucherAnalysis.getLargeAmountECharts.json',
			data: {jsonData: JSON.stringify(params),lockProjectId:$('#largeanalysis_customerId').val(),lockYyyy:$('#analysis_yyyy').val()},
			dataType: 'json',
			success: function(result) {

				$.ajax({
					type: 'get',
					url: 'finCenter/LargeAmountVoucherAnalysis.getLargeAmountEChartsCount.json',
					data: {jsonData: JSON.stringify(params),lockProjectId:$('#largeanalysis_customerId').val(),lockYyyy:$('#analysis_yyyy').val()},
					dataType: 'json',
					success: function(result1) {
						getEcharts(result.data, result1.data);
					}
				});
			}
		});


	};


	var Mdata = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	var XMonth = '';
	var getEcharts = function(Edata, Cdata) {
		var arrayEdata = [];
		var arrayCdata = [];
		for (var i = 0; i < Mdata.length; i++) {
			for (var j = 0; j < Edata.length; j++) {
				arrayEdata[i] = 0;

				if (Mdata[i] == Edata[j].Mdate) {
					arrayEdata[i] = Edata[j].sumValue;
					break;
				}
			}

		}

		for (var i = 0; i < Mdata.length; i++) {
			for (var j = 0; j < Cdata.length; j++) {
				arrayCdata[i] = 0;

				if (Mdata[i] == Cdata[j].Mdate) {
					arrayCdata[i] = Cdata[j].sumValue;
					break;
				}
			}

		}


		var myChart = echarts.init(document.getElementById('analysis_echarts'));
		option = {

			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'

					}
				},
				formatter: function(params) {
					var html = '';
					if (params.length > 0) {
						Xindex = params[0].dataIndex;
						XMonth = params[0].axisValue;
						for (var int = 0; int < params.length; int++) {
							html += params[int].seriesName + ':' + params[int].data.toLocaleString() + '<br>';
						}
					}

					return html;

				}
			},

			legend: {
				data: [dirctionName, '凭证数量']
			},
			xAxis: [
				{
					type: 'category',
					data: Mdata,
					axisPointer: {
						type: 'shadow'
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '金额',
					splitNumber: 4,

					axisLabel: {
						formatter: '{value}'
					}
				},
				{
					type: 'value',
					name: '数量',
					splitNumber: 4,

					axisLabel: {
						formatter: '{value}'
					}
				}
			],
			series: [
				{
					name: dirctionName,
					type: 'bar',
					barGap: 0,

					data: arrayEdata
				},
				{
					name: '凭证数量',
					type: 'bar',

					yAxisIndex: 1,
					data: arrayCdata
				}
			]
		};
		myChart.setOption(option);
	};


	/** table 属性 */
	var largeamount_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			select: true,
			param1: 'jsq',
			lengthChange: true,
			serverSide: true,
			pageLength: 30,
			fixedThead: true,
			fixedHeight: '500px',
			fixedColumns:   {
				leftColumns: 3
			},
			columnDefs: [
				{
					targets: 1,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: '25px'

				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '凭证号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: '85px'
//				render : function(data, type, row, meta) {
//					var renderStr = '';
//					//renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowView" data-placement="top" title="查看 " data-toggle="tooltip">'
//					//		+ '<i class="fa fa-eye"></i></button>';
//					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowRelation" data-placement="top" title="对照 " data-toggle="tooltip">'
//						+ '<i class="fa fa-edit"></i></button>';
//					return renderStr;
//				}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: '85px'

				}, {
					targets: 4,
					orderable: false,
					className: 'text-center',
					title: '凭证类型',
					name: 'typeId',
					data: 'typeId',
					width: '50px'

				}/*, {
					targets: 5,
					orderable: true,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '50px'

				}*/, {
					targets: 5,
					orderable: true,
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
					targets: 6,
					orderable: true,
					className: 'text-left',
					title: '对方科目',
					name: 'oppositeSubjectValue',
					data: 'oppositeSubjectValue',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: 7,
					orderable: true,
					className: 'text-right',
					title: '借方发生额',
					name: 'debit',
					data: 'debit',
					width: '100px',
					render: function(data, type, row, meta) {

						return formatMoney(data);
					}
				}, {
					targets: 8,
					orderable: true,
					className: 'text-right',
					title: '贷方发生额',
					name: 'credit',
					data: 'credit',
					width: '100px',
					render: function(data, type, row, meta) {

						return formatMoney(data);
					}
				}, {
					targets: 9,
					orderable: true,
					title: '发生额',
					className: 'text-right',
					name: 'currValue',
					data: 'currValue',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					orderable: true,
					className: 'text-left',
					title: '创建人',
					name: 'voucherFillUser',
					data: 'voucherFillUser',
					width: '50px'

				}, {
					targets: 11,
					orderable: true,
					className: 'text-left',
					title: '审核人',
					name: 'voucherAuditUser',
					data: 'voucherAuditUser',
					width: '50px'

				}]
		}
	};

	var formatSubjectFullName = function(val) {

		var count = val.length;

		if (count > 20) {
			return val.substring(0, 16) + '......';
		}
		return val;

	};


	var showRowData = function(event) {
		//$('form').find('input, select, textarea').attr('disabled','disabled');
		//setModalData(formId,table,this);
		//$('form table table button').attr('disabled', 'disabled');
		//$('form table table input').attr('disabled', 'disabled');
		//formdataSet($('#chanceInfo').DataTable().data()[$(this).closest('tr').index()]);
		//$('#modal_form').modal('show');


	};

	$('#subjectEntry').on('xhr.dt', function(e, settings, json, xhr) {

		if (json.recordsTotal > 0) {
			$('#largeAmountVoucher_export_dg').css('display', 'block');
			$('#largeAmountVoucher_export').css('display', 'block');
		} else {
			$('#largeAmountVoucher_export_dg').css('display', 'none');
			$('#largeAmountVoucher_export').css('display', 'block');
		}
	});


	/** 行双击 */
	$('#' + table + ' tbody').on('mouseenter', 'tr', function() {
		
	});

	/** 行按钮 查看 */
	$('#' + table).on('click', 'button[name="rowView"]', showRowData);

	$('#' + table).on('click', 'button[name="rowRelation"]', function() {
		var object = $('#' + table).DataTable().data()[$(this).closest('tr').index()];
		$('#relation_autoId').val(object.autoId);
		$('#relation_userSubjectId').val(object.userSubjectId + '-' + object.userSubjectName);

		if (object.stanSubjectId != null && object.stanSubjectId != '' && object.stanSubjectName != null && object.stanSubjectName != '') {
			$('#relation_stanSubjectId').val(object.stanSubjectId + '-' + object.stanSubjectName);
		} else {
			$('#relation_stanSubjectId').val('');
		}

		if (object.reportSubjectId != null && object.reportSubjectId != '' && object.reportSubjectName != null && object.reportSubjectName != '') {
			$('#relation_reportSubjectId').val(object.reportSubjectId + '-' + object.reportSubjectName);
		} else {
			$('#relation_reportSubjectId').val('');
		}
		$('#modal-setRelation').modal('show');
	});
	/** 单元格点击事件 */
	$('#subjectEntry').on('click', 'td', function() {

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
	$('#jsq_clear_subjectEntry').on('click', function() {

		$('#suanshi_subjectEntry').val('');
		$('#jieguo_subjectEntry').val('');
	});

	//统计图单击事件
	$('#analysis_echarts').click(function() {
		var params = {
			'sqlId': 'FIN107004',
			'menuId': window.sys_menuId,
			'lockProjectId': $('#largeanalysis_customerId').val(),
			'lockYyyy': $('#analysis_yyyy').val(),
			'param1': $('#analysis_subjectid').val(),
			'param2': $('#start_money').val(),
			'param3': $('#end_money').val(),
			'param4': $('#analysis_moneyType').val(),
			'param5': XMonth
		};
		largeamount_view.localParam.urlparam = params;
		BdoDataTable(table, largeamount_view);
		$('#subjectlist_block').show();
		$('#subjectlist1_block').show();


	});

	//获取凭证数量
	var getVoucherCount = function() {

		if ($('#largeanalysis_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}

		var params = {
			'subjectid': $('#analysis_subjectid').val(),
			'direction': $('#analysis_moneyType').val(),
			'start_moneycount': $('#start_moneycount').val(),
			'end_moneycount': $('#end_moneycount').val()

		};


		$.ajax({
			type: 'get',
			url: 'finCenter/LargeAmountVoucherAnalysis.getLargeAmountVoucherCount.json',
			data: {jsonData: JSON.stringify(params),lockProjectId: $('#largeanalysis_customerId').val(),lockYyyy:$('#analysis_yyyy').val()},
			dataType: 'json',
			success: function(result) {

				$('#voucher_count').html(result.data[0].sumValue);
			}
		});
	};

	$('#count_detail').click(function() {
		if ($('#largeanalysis_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}
		getVoucherCount();
		var params = {
			'sqlId': 'FIN107004',
			'menuId': window.sys_menuId,
			'lockProjectId': $('#largeanalysis_customerId').val(),
			'lockYyyy': $('#analysis_yyyy').val(),
			'param1': $('#analysis_subjectid').val(),
			'param2': $('#start_moneycount').val(),
			'param3': $('#end_moneycount').val(),
			'param4': $('#analysis_moneyType').val(),
			'param5': ''

		};
		largeamount_view.localParam.urlparam = params;
		jsq(largeamount_view.tableParam, table);
		BdoDataTable(table, largeamount_view);
		$('#subjectlist_block').show();
		$('#subjectlist1_block').show();
	});

	/** 搜索按钮 */
	$('#btn_search').click(function() {

		if ($('#largeanalysis_customerId').val() == '') {
			bdoInfoBox('提示', '请输入客户编号');
			return;
		}
		if ($('#analysis_yyyy').val() == '') {
			$('#analysis_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		if ($('#analysis_subjectid').val() == '' && $('#start_money').val() == '' && $('#end_money').val() == '') {
			bdoInfoBox('提示', '请选择科目编号或者计量金额');
			return;
		}
		// 账套过期时间
		getValidDate($('#largeanalysis_customerId').val(), $('#analysis_yyyy').val(), 'validDate');
		var params = {
			'sqlId': 'FIN107004',
			'menuId': window.sys_menuId,
			'lockProjectId': $('#largeanalysis_customerId').val(),
			'lockYyyy': $('#analysis_yyyy').val(),
			'param1': $('#analysis_subjectid').val(),
			'param2': $('#start_money').val(),
			'param3': $('#end_money').val(),
			'param4': $('#analysis_moneyType').val(),
			'param5': ''
		};

		largeamount_view.localParam.urlparam = params;
		jsq(largeamount_view.tableParam, table);
		BdoDataTable(table, largeamount_view);
		$('#subjectlist_block').show();
		$('#subjectlist1_block').show();

		$('#start_moneycount').val($('#start_money').val());
		$('#end_moneycount').val($('#end_money').val());
		getLargeAmountECharts();

		$('#analysis_count').show();
		getVoucherCount();
		tableColor();

		$('#subjectEntry').on('xhr.dt', function(e, settings, json, xhr) {
			/*if(json.recordsTotal>2000){
				swal({
					title : '系统提示',
					text : "数据量过大，只显示2000条，请缩小精度再次查询",
					type: 'warning',
					confirmButtonText : '确定',
					allowEscapeKey: true,
					allowOutsideClick: true
				})
			}*/
			if (json.recordsTotal > 0) {
				$('#largeAmountVoucher_export').css('display', 'block');
				$('#largeAmountVoucher_export_dg').css('display', 'block');
			} else {
				$('#largeAmountVoucher_export').css('display', 'none');
				$('#largeAmountVoucher_export_dg').css('display', 'none');
			}

		});
		$('#' + table + ' tbody').on('dblclick', 'tr', function() {
			var object = $('#subjectEntry').DataTable().data()[$(this).closest('tr').index()];
			voucherTab('tab_detailaccount', $('#largeanalysis_customerId').val(), object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});

	/*$('#start_moneycount').blur(function() {
		getVoucherCount();
	});
	$('#end_moneycount').blur(function() {
		getVoucherCount();
	});*/

	/** 导出*/
	$('#largeAmountVoucher_export').click(function() {

		//获取获取echarts表格图
		var subchart = echarts.init(document.getElementById('analysis_echarts'));
		var imgData = subchart.getDataURL();

		exportEchartsExcel(this, '大金额凭证分析', largeamount_view, table, imgData);

	});

	/** 导出到底稿附件  打开Tb附件框 */
	$('#largeAmountVoucher_export_dg').click(function() {

		var customerId = $('#largeanalysis_customerId').val();
		var customername = $('#largeanalysis_customerId option:selected').text();

		ecportToDg(customerId, customername, largeamount_view);


	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			data.title = '大金额凭证分析一览';
			data.view = largeamount_view;
			data.table = 'subjectEntry';
			data.customerId = $('#largeanalysis_customerId').val();
			//获取获取echarts表格图
			var subchart = echarts.init(document.getElementById('analysis_echarts'));
			data.imgData = subchart.getDataURL();
			exportExcelToImage(this, data);
		} else {

		}
	}

	/*导出到底稿附件*/
	$('#modal_tbsubjectid_sure').click(onExport);

	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#analysis_subjectid').val('');
		$('#start_money').val('');
		$('#end_money').val('');
		$('#largeanalysis_customerId').val('').trigger('change');
		$('#analysis_moneyType').val('1');
		//getUserYear('analysis_yyyy');
		getUserLocalYear('analysis_yyyy');
		$('#subjectlist_block').hide();
		$('#subjectlist1_block').hide();
		//$('#'+table).dataTable().fnClearTable();
		//$('#'+table).dataTable().fnDestroy();
	});


	var tableColor = function() {
		$('#' + table).find('tr').each(function() {
			$(this).css('background-color', '');//先将所有的行背景置为空
		});
	};


	/**
	 * 模态框数据 加载
	 */
	var setModalData = function(formId, table, me) {

	};
	
});


