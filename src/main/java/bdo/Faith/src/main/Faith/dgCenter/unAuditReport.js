$(document).ready(function() {
	let tableData = {};
	var exportDgParam = {
		param3: function() {
			return this.param5 == '1' ? '' : parseInt(window.CUR_PROJECT_ACC_YEAR) - 1;
		},
		param5: '1'
	};
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	var vocationId = '';
	var vocationName = '';
	var journal = function() {
	};
	var setIndexId = function() {
	};
	var agrs = {};
	(function() {
		agrs.region = '1';
		agrs.template = '1';
		agrs.adjustTyle = '1';
		agrs.handleFlag = '0';
		agrs.extraOptions = {indexId: DG_CONST_UNAUDITREPORT_BEGINNING, nodeName: window.CUR_CUSTOMERNAME};
		agrs.findMaxIndex = function() {
			$.ajax({
				url: 'dgCenter/DgGeneral.query.json',
				dataType: 'json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00038',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					//param3 : CUR_PROJECT_END_YEAR,
					param4: '1'
				},
				success: function(data) {
					agrs.maxIndex = data.data[0].maxIndex;
				}
			});
		};
		//修改客户调整时 adjustTyle 值为2的问题
		var adjust = DgAdjustPage({region: '#sideRegin', data: agrs, adjustTyle: '1'});
		adjust.mount();
		journal = adjust.journal;
		setIndexId = adjust.setIndexId;
		$('#adjust_show').hide();
	})();
	pageRightTitle(pageTitleArr);
	let reportEditId;
	var table = 'rpt_tab';

	//存储页面填写数字
	var customerAmoutMap = {'qy': {'1': {}, '2': {}}};

	//存储
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '1',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'1': '资产负债表', '3': '利润表', '4': '现金流量表', '5': '所有者权益变动表'}
	};

	uiBlocksApi(false, 'init');
	$('#subPageRight  [data-toggle="tabs"]').on('click', 'a', function(e) {
		e.preventDefault();
		if ($('#abs-remain').hasClass('active')) {
			$(this).tab('show');
			return;
		}
		if ($(this).closest('ul').attr('id') == 'tab_unAuditReport' && $(this).parent().index() > 1) {
			$('#tab_head_rpt').hide();
		} else {
			$('#tab_head_rpt').show();
		}
		$(this).tab('show');
	});
	$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function(e) {
		//$(this).resize();
		var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
		thisPageConfig.showType = upperNode.attr('data-content');
		window.showType = thisPageConfig.showType;
		var tempId = upperNode.attr('data-result');
		var lowerNode = $('#' + tempId).find('li[class=active] a');
		thisPageConfig.id = lowerNode.attr('data-result');
		thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
	});
	/** 模态框设置 */
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/
	// 模板
	$.ajax({
		url: 'dgCenter/DgAdjust.findProjectInfo.json',
		type: 'post',
		async: true,
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID, param3: window.CUR_PROJECT_ACC_YEAR
		},
		dataType: 'json',
		success: function(data) {
			if (data.success) {
				vocationId = data.data[0].tbReportTemplate;
				vocationName = data.data[0].tbReportTemplateName;
				reportEditId =  data.data[0]['ext'].unReportEditer;
				if (CUR_USERID == reportEditId ) {
					$('#rpt_adjustReport').show();
				}
				setSelect();
			} else {
				bdoErrorBox('提示', data.resultInfo.statusText);
			}
		}
	});

	function setSelect() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgProject.getProjectMember.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					let reportEdit = '<option value="" label="" />';
					data.data.map(item => {
						// if (reportEditId ==  item.id) {
						// 	reportEdit+='<option style="color: #000000"  value="'+ item.id+'" label="'+item.name+'" selected />';
						// }else {
						reportEdit += '<option style="color: #000000"  value="' + item.id + '" label="' + item.name + '" />';
						// }
						// return {id: item.id, text: item.name, value: item.name};
					});
					$('#report_editer').append(reportEdit);
					$('#report_editer').val(reportEditId);
				} else {
					$('#report_editer').val('');
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	}

	let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
	$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_ENDING + '】');
	$('#headtitle').empty().text(node.text);

	/**初始化年份下拉选 */
	var lastYear = projectYear - 1;
	$('#selectYear').append('<option value="' + projectYear + '" style="color: #000;">' + projectYear + '</option>');
	$('#selectYear').append('<option value="' + lastYear + '" style="color: #000;">' + lastYear + '</option>');
	/** table 属性 */
	var rpt_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/FUnAuditReport.unAuditReport.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId,
				refreshFlg: '1',
				start: -1
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: []
		}
	};
	//校验表格
	var Tbcheck = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/FUnAuditReport.tbListCheck.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			createdRow(row, data, dataIndex) {
				if (data['unAuditAmount' + projectYear] != 0 && data['unAuditAmount' + projectYear] != null && data['unAuditAmount' + projectYear] != '') {
					// 展开
					$('#unAudit_rpt_tbcheck_intwrap').show();
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['adjustAmount' + projectYear] != 0 && data['adjustAmount' + projectYear] != null && data['adjustAmount' + projectYear] != '') {
					// 展开
					$('#unAudit_rpt_tbcheck_intwrap').show();
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['auditAmount' + projectYear] != 0 && data['auditAmount' + projectYear] != null && data['auditAmount' + projectYear] != '') {
					// 展开
					$('#unAudit_rpt_tbcheck_intwrap').show();
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['unAuditAmount' + (projectYear-1)] != 0 && data['unAuditAmount' + (projectYear-1)] != null && data['unAuditAmount' + (projectYear-1)] != '') {
					// 展开
					$('#unAudit_rpt_tbcheck_intwrap').show();
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['adjustAmount' + (projectYear-1)] != 0 && data['adjustAmount' + (projectYear-1)] != null && data['adjustAmount' + (projectYear-1)] != '') {
					// 展开
					$('#unAudit_rpt_tbcheck_intwrap').show();
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['auditAmount' + (projectYear-1)] != 0 && data['auditAmount' + (projectYear-1)] != null && data['auditAmount' + (projectYear-1)] != '') {
					// 展开
					$('#unAudit_rpt_tbcheck_intwrap').show();
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#unAudit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}
			},
			columnDefs: [{
				targets: 1,
				orderable: false,
				//className: 'text-left font-s12 width-jyx',
				className: 'text-left',
				title: '校验项',
				name: 'colDisp',
				data: 'colDisp',
				width: '350px'
				/*width: '370px',
						render: function(data, type, row, meta){
							return '<font size=10>' + data + '</font>';
						}*/
			}, {
				targets: 2,
				orderable: false,
				className: 'text-right',
				title: projectYear + '年<br>未审数',
				name: 'unAuditAmount' + projectYear,
				data: 'unAuditAmount' + projectYear,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: 3,
				orderable: false,
				className: 'text-right',
				title: projectYear + '年<br>审计调整数',
				name: 'adjustAmount' + projectYear,
				data: 'adjustAmount' + projectYear,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: 4,
				orderable: false,
				className: 'text-right',
				title: projectYear + '年<br>审定数',
				name: 'auditAmount' + projectYear,
				data: 'auditAmount' + projectYear,
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			},{
				targets: 5,
				orderable: false,
				className: 'text-right',
				title: (projectYear-1) + '年<br>未审数',
				name: 'unAuditAmount' + (projectYear-1),
				data: 'unAuditAmount' + (projectYear-1),
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: 6,
				orderable: false,
				className: 'text-right',
				title: (projectYear-1) + '年<br>审计调整数',
				name: 'adjustAmount' + (projectYear-1),
				data: 'adjustAmount' + (projectYear-1),
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: 7,
				orderable: false,
				className: 'text-right',
				title: (projectYear-1) + '年<br>审定数',
				name: 'auditAmount' + (projectYear-1),
				data: 'auditAmount' + (projectYear-1),
				width: '120px',
				render: function(data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}]
		}
	};



	/** 单元格双击事件 */

	$('#tab_unAuditReport_content').on('dblclick', 'table tbody tr.edit-able td', function() {

		let colType = '';
		if ($(this).hasClass('bg-success-light')) {
			colType = 1;
		} else if ($(this).hasClass('bg-gray-light')) {
			colType = 2;
		} else if ($(this).hasClass('bg-gray-lighter')) {
			colType = 3;
		} else {
			return;
		}

		var td = $(this).closest('td');
		var key = td.parent().index();
		var $table = td.closest('table');
		if ($table.attr('id').indexOf('qy_report') >= 0) return;
		var trL = $table.find('tr').length;
		//var index = checkTab($table);
		var th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		var data = $table.DataTable().row($(this).closest('tr')).data();
		var dif = td.next();
		var dfAm = dif.text();
		var dl = td.prev();
		var dlAm = dl.text();
		for (var i = 0; i < dlAm.length / 3; i++) {
			dlAm = dlAm.replace(',', '');
		}
		for (var i = 0; i < dfAm.length / 3; i++) {
			dfAm = dfAm.replace(',', '');
		}
		var check = false;
		if (thisPageConfig.TABLE_DIV == 3 || thisPageConfig.TABLE_DIV == 4) {
			if (th.name.indexOf('remain') >= 0 || th.name.indexOf('unAuditAmount') >= 0) {
				check = true;
			}
		}
		// S08净利润 S10综合收益总额 之间的科目都不能编辑
		var indexS08 = 0;
		var indexS10 = 0;
		for (var i = 0;i < $table.DataTable().data().length;i++) {
			if ($table.DataTable().data()[i].colCode == 'S08') {
				indexS08 = i;
			}
			if ($table.DataTable().data()[i].colCode == 'S10') {
				indexS10 = i;
			}
		}
		if ($(this).closest('tr').index() > indexS08 && $(this).closest('tr').index() < indexS10) {
			return;
		}
		if (colType == 3 || colType == 1) {
			/** 双击客户报表数字列可编辑 */
			if (th.name.indexOf('customerAmount') >= 0 || th.name.indexOf('customerRemain') >= 0 || check) {
				if (data['colType'] != 1) {
					return;
				}
				if (data['colDisp'].indexOf('合计') > 0 || data['colDisp'].indexOf('总计') > 0) {
					return;
				}
				var oldVal = data[th.name];
				td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
				var input = $(this).find('input');
				if (oldVal != 0) {
					input.val(oldVal);
				}
				input.focus();
				input.on('keydown', function(e) {
					if (e.keyCode == 13) {
						//console.log(e);
						input.blur();
					}
				});
				input.on('blur', function() {
					let newVal = $(this).val().toString().replace(/,/g, '');

					function cvs(num) {
						var num = num.toFixed(2);
						var int = num.split('.')[0];
						var float = num.split('.')[1];
						var _number = int.toString().replace(/,/g, '');        // 数字转成字符串
						var result = '';            // 转换后的字符串
						var counter = '';
						for (var i = _number.length - 1; i >= 0; i--) {
							counter++;
							result = _number.charAt(i) + result;
							if (!(counter % 3) && i != 0) {
								result = ',' + result;
							}
						}
						if (int > 0) {
							return '-' + result + '.' + float;
						} else {
							var result = result.replace('-', '');
							if (result[0] == ',') {
								result = result.replace(',', '');
							}
							return result + '.' + float;
						}
					}

					if (newVal == '') {
						td.html(0);
						if (!check) {
							if (dfAm - oldVal < 0) {
								dif.html('<span style=\'color:green;\'>' + '-' + cvs(dfAm - oldVal) + '</span>');
							} else if (dfAm - oldVal > 0) {
								dif.html('<span style=\'color:green;\'>' + cvs(dfAm - oldVal) + '</span>');
							}
						}
					} else if (isNaN(newVal)) {
						td.html(oldVal);
					} else {
						var num = newVal * 1;
						td.html(num.toFixed(2));
						if (!check) {
							var N = (dlAm - num);
							if (N < 0) {
								var N = cvs(N);
								var txt = '<span style=\'color:green;\'>' + N + '</span>';
								dif.html(txt);
							} else if (N > 0) {
								var N = cvs(N);
								var txt = '<span style=\'color:green;\'>' + N + '</span>';
								dif.html(txt);
							} else {
								var N = cvs(N);
								var txt = '<span>' + N + '</span>';
								dif.html(txt);
							}
						}
					}
					if (td.html() != data[th.name]) {
						data[th.name] = td.html();
						var name = th.name.substring(0, th.name.length - 4);
						var tmpData = {};
						if (data.colCode in customerAmoutMap) {
							tmpData = customerAmoutMap[data.colCode];
						}
						tmpData[name] = data[th.name];//'colCode':data.colCode,
						customerAmoutMap[data.colCode] = tmpData;
					}
				});
				return;
			}
		}


		/** 双击调整数穿透显示调整明细 */
		/*if (data.colType == 2) {
			return;
		}*/
		if (colType == 2) {
			if (th.name.indexOf('adjustAmount') >= 0 || th.name.indexOf('adjustRemain') >= 0) {
				if (thisPageConfig.showType == '1') {
					adjustDetailTab('tab_unAuditReport', window.CUR_CUSTOMERID, projectYear, 1, data.colCode, data.colCode, 'FA10065', DG_CONST_UNAUDITREPORT_BEGINNING);
				} else if (thisPageConfig.showType == '2') {
					adjustDetailTab('tab_unAuditReport', window.CUR_CUSTOMERID, projectYear, 1, data.colCode, data.colCode, 'FA10065', DG_CONST_UNAUDITREPORT_BEGINNING);
				}
			}
		}

	});

	//$('#qy_report1, #qy_report2').off('dblclick','tbody td');
	/*$('#qy_report1, #qy_report2').on('dblclick', 'tbody tr.edit-able td.bg-success-light', function() {
		var td = $(this);
		var key = td.parent().index();
		var $table = td.closest('table');
		var th = $table.DataTable().context[0].aoColumns[$(this).index() + 1];
		var data = $table.DataTable().row($(this).closest('tr')).data();
		var oldVal = data[th.name];
		if (th.name.indexOf('column12') >= 0) {
			return;
		}
		td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
		var input = $(this).find('input');
		if (oldVal != 0) {
			input.val(oldVal);
		}
		input.focus();
		input.on('keydown', function(e) {
			if (e.keyCode == 13) {
				//console.log(e);
				input.blur();
			}
		});
		input.on('blur', function() {
			let newVal = $(this).val().toString().replace(/,/g, '');
			if (newVal == '') {
				td.html(0);
			} else if (isNaN(newVal)) {
				td.html(oldVal);
			} else {
				var num = newVal * 1;
				td.html(num.toFixed(2));
			}
			data[th.name] = td.html();
			var sum = 0;
			for (var i in data) {
				if (i.indexOf('column') >= 0 && i != 'column12') {
					sum += (data[i] * 1);
				}
			}
			td.nextAll().last().html(sum.toFixed(2));
			var tmpData = {'colCode': data.colCode};
			if (data.autoId in customerAmoutMap.qy[thisPageConfig.showType]) {
				tmpData = customerAmoutMap.qy[thisPageConfig.showType][data.autoId];
			}
			/!*else {
							   tmpData['isEnd'] = thisPageConfig.showType;
						   }*!/
			tmpData[th.name] = data[th.name];//'colCode':data.colCode,
			tmpData['column12'] = sum;
			customerAmoutMap.qy[thisPageConfig.showType][data.autoId] = tmpData;
		});
	});
*/

	/** 保存按钮 */
	$('#rpt_save').click(function() {
		$('#rpt_save').blur();
		var tempMap = {};
		tempMap = customerAmoutMap;
		var jsonData = JSON.stringify(tempMap);
		if (jsonData == '{}') {
			bdoInfoBox('提示', '客户报表数字未修改，无需保存！');
			return;
		}
		$.ajax({
			type: 'post',
			url: 'dgCenter/FUnAuditReport.editCustomerAmount.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: jsonData,
				param3: thisPageConfig.showType,
				param4: 1,
				param5: 1,

			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					customerAmoutMap = {'qy': {'1': {}, '2': {}}};
					//loadData();
					initFourTable(thisPageConfig.showType);
					// initFourTable('2');
					bdoSuccessBox('保存成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('保存失败', data.resultInfo.statusText);
				}
			}
		});
	});

	/** 刷新按钮 */
	$('#rpt_search').click(function() {
		$('#rpt_search').blur();
		// // loadData();
		// initFourTable('1');
		// initFourTable('2');
		initFourTable(thisPageConfig.showType);
		// if (thisPageConfig.showType&& thisPageConfig.showType == '1'){
		// 	BdoDataTable('rpt_tbcheck', Tbcheck);
		// } else {
		// 	BdoDataTable('rpt_tbcheck', Tbcheck2);
		// }
	});

	/** 核对 */
	$('#rpt_check_Report').on('click', function() {
		$('#rpt_check_Report').blur();
		bdoAjaxBox('系统提示', projectYear + '年未审报表确定完成核对吗？', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FUnAuditReport.checkAuditReport.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: projectYear,
					param3: projectYear
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	/** 刷新未审报表 */
	$('#rpt_createReport').click(function() {
		$('#rpt_createReport').blur();
		bdoAjaxBox('系统提示', '确定要生成【' + window.CUR_CUSTOMERNAME + '】<br>' + projectYear + '年未审报表吗', function() {
			bdoInProcessingBox('生成中');
			$.ajax({
				type: 'post',
				url: 'dgCenter/FUnAuditReport.createReport.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: projectYear,
					param3: projectYear
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						// initFourTable('1');
						// initFourTable('2');
						$('#rpt_search').click();//刷新未审报表校验
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	// 调整分录
	$('#rpt_adjustReport').click(function() {
		window.editId = 1;
		$('#jnadjust_dgYear2').parent().hide();
		//判断未审报表是否已生成
		$.ajax({
			type: 'post',
			url: 'dgCenter/FUnAuditReport.checkExist.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: projectYear,
				param3: projectYear
			},
			dataType: 'json',
			success: function(data) {
				if (data.data[0].chekFlag == 1) {
					agrs.findMaxIndex();
					setIndexId(thisPageConfig.showType == '1' ? DG_CONST_UNAUDITREPORT_ENDING : DG_CONST_UNAUDITREPORT_BEGINNING);


					$('#sideRegin').show();
					$('#adjust_name').text('客户名称:');
					$('#adjust_vocation_div').hide();
					$('#adjust_show').hide();
					window.adjustPageId = true;
					let year = projectYear;
					if (thisPageConfig.showType == '2'){
						year-=1;
					}
					journal(year, agrs.maxIndex, '', '1', false, function() {
						// loadData();
					});


				} else {
					bdoErrorBox('系统提示', projectYear + '年未审报表不存在，不能调整！');
				}
			}

		});

	});
	// =======================文件上传控件初始化开始===========================
	var pluginOpt = {
		dropZoneEnabled: false,
		dropZoneTitle: '',
		dropZoneClickTitle: '',
		browseLabel: '选择文件',
		showCaption: true,
		showRemove: false,
		showUpload: false,
		showBrowse: true,
		showPreview: false,
		required: true,
		initialPreviewShowDelete: true,
		language: 'zh',
		browseOnZoneClick: true,
		showClose: false,
		showCancel: false,
		hideThumbnailContent: true,
		layoutTemplates: {
			actionUpload: '',
			actionZoom: ''
		},
		fileActionSettings: {
			removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
		},
		uploadAsync: true,
		allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam'],
		uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
		uploadExtraData: function() {
			return {
				param1: '',
				param2: ''
			};
		}
	};

	pluginOpt.uploadExtraData = function() {
		return {
			param1: window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME,
			param2: projectYear,
			param3: projectYear,
			param4: (function() {
				return vocationId + '-' + vocationName;
			})()
		};
	};
	var $el = $('#fileinput').fileinput(pluginOpt);

	//uploadAsync = true 时调用
	$el.on('fileuploaded', function(event, data) {
		if (data.response.success) {
			importFile(data);
		} else {
			bdoErrorBox('失败', data.response.resultInfo.statusText);
		}
	});
	//uploadAsync = true 时，后台返回数据data.error 非空是调用
	$el.on('fileuploaderror', function(event, data, msg) {
		$('#fileinput').fileinput('clear');
		$('#fileinput').fileinput('enable');
		bdoErrorBox('系统提示', msg);
	});

	//建议文件上传成功之后再提交其他表单数据
	function uploadFile() {
		$el.fileinput('upload');
	}

	/** 导入按钮 */
	$('#import_submit').click(function() {
		uploadFile();
	});
	//文件上传成功/失败后，处理后台响应函数
	function importFile(param) {
		$.ajax({
				type: 'post',
				url: 'dgCenter/FUnAuditReport.importCustomerReport.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					//文件id
					param1: JSON.stringify(param.response.data[0]),
				},
				dataType: 'json',
				success: function (data) {
					if (data.success){
						bdoSuccessBox('导入成功');
						$('#modal-importCustomerReport').modal('hide');
						$('#fileinput').fileinput('clear');
						$('#fileinput').fileinput('enable');
						// loadData();
						$('#rpt_search').click();
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				},
			}
		);
	}
	/** 下载模板按钮 */
	$('#import_dlTemplate').click(function() {
		if (!vocationId) {
			bdoErrorBox('提示', '请先配置报表模板');
			return;
		}
		var params = {
			id: '1',
			menuId: '40000040',
			mainDatasSql: 'FA40017',
			detailDatasSql: 'FA40016',
			param1: window.CUR_CUSTOMERNAME,
			param2: projectYear,
			param3: vocationId,//(function(){return vocationId;})(),
			param4: vocationName,//(function(){return vocationName;})(),
			param5: ''
		};
		// 一次下载 四张表
		exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.createExcelFile1.json', params);
		/*		bdoConfirmBox('提示', '是否只下载【' + thisPageConfig.rptName[thisPageConfig.TABLE_DIV] + '】？', function(){
					params.param5 = thisPageConfig.TABLE_DIV;
					exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.createExcelFile1.json', params);
				}, function(){
					exportExcelWithTemplate('./dgCenter/FUnAuditReportTemplate.createExcelFile1.json', params);
				});*/
	});
	// =======================文件上传控件初始化结束===========================
	/** 导入客户报表按钮 */
	$('#rpt_importCustomerReport').click(function() {
		$('#modal-importCustomerReport').modal('show');
	});
	function exportUAToDg(param) {
		$.ajax({
			url: 'dgCenter/ExportOtherDg.exportUATbl.json',
			data: param,
			type: 'post',
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if (data.data && data.data.length > 0) {
						let dataString = data.data[0].fileData;
						let fileName = data.data[0].fileName;
						let isNew = data.data[0].isNew;
						bdoInfoBox('成功', fileName + '导出成功！');
						saveAs(dataURLtoFile(dataString, fileName), fileName);
					}
					getSubjecttree({
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_PROJECTID,
						param2: $("#onlyMyselfCheckBox").get(0).checked ? '1' : ''
					}, data => {
						$('.js-tree-collapsed').trigger('rebuild', [{
							data: [data.data[0].treeData],
							levels: 3,
							callback(tree) {
								$.each(tree.findNodes(), (index, tnode) => {
									if (tnode.extraOptions.nodeType == 'UNAUDITED') {
										tree.expandNode(tnode.nodeId, {levels: (tnode.deep + 2), silent: true});
										tree.selectNode(tnode.nodeId, {silent: true});
									}
								});
							}
						}]);
					});
				} else {
					bdoErrorBox('失败', data.resultInfo && data.resultInfo.statusText);
				}
			}
		});
	}

	function exportUSToDgDo(param5, param3) {
		let myParams = [{
			page: '',
			start: '',
			limit: '',
			queryUrl: 'dgCenter/FUnAuditReport.unAuditReport.json',
			menuId: window.sys_menuId,
			param4: '2',
			refreshFlg: '1',
			param5: exportDgParam.param5
		}, {
			page: '',
			start: '',
			limit: '',
			queryUrl: 'dgCenter/FUnAuditReport.tbListCheck.json',
			menuId: window.sys_menuId,
			param3: exportDgParam.param3()
		}];
		exportUAToDg({menuId: window.sys_menuId, param1: JSON.stringify(myParams), param2: '未审报表-期末（本期）'});
	}

	/** 导出 */
	$('#rpt_export').click(function() {
		// var isManager = true;
		// $.ajax({
		// 	type: 'post',
		// 	url: 'dgCenter/DgGeneral.query.json',
		// 	async : false,
		// 	data: {
		// 		menuId: window.sys_menuId,
		// 		sqlId: 'DG00197',
		// 		param1: window.CUR_CUSTOMERID,
		// 		param2: window.CUR_PROJECTID,
		// 		start: -1,
		// 		limit: -1
		// 	},
		// 	dataType: 'json',
		// 	success(data) {
		// 		if (data.success) {
		// 			if(sys_userId != data.data[0].manager){
		// 				isManager = false;
		// 			}
		// 		}
		// 	}
		// });
		// if(!isManager){
		// 	bdoInfoBox('提示', '非项目负责人无权限导出未审报表！');
		// 	return;
		// }
		// 资产负债表 为 年初年末
		let zc = $.extend(true, {}, rpt_view);
		zc.tableParam = createColumnZC(projectYear, projectYear, thisPageConfig.showType);
		//其他表 为 上年数 本年数
		let lr = $.extend(true, {}, rpt_view);
		lr.tableParam = createColumn(projectYear, projectYear, thisPageConfig.showType);
		let xj = $.extend(true, {}, lr);
		let qy = $.extend(true, {}, qyTable);
		let name = '未审报表' + (thisPageConfig.showType == '1' ? '-期末' : '-期初') + '(' + thisPageConfig.rptName[thisPageConfig.TABLE_DIV] + ')';
		let params = {
			menuId: '40000022',
			param4: thisPageConfig.showZero,
			param5: thisPageConfig.showType
		};
		zc.localParam.urlparam = params;
		zc.localParam.urlparam.url = zc.localParam.url;
//		去除编号
		zc.tableParam.columnDefs = zc.tableParam.columnDefs.slice(1);
		lr.tableParam.columnDefs = lr.tableParam.columnDefs.slice(1);
		xj.tableParam.columnDefs = xj.tableParam.columnDefs.slice(1);
		qy.tableParam.columnDefs = qy.tableParam.columnDefs.slice(1);
		// exportExcel3(this,name, [zc,lr,xj,qy], thisPageConfig.id);
		exportUSToDgDo();
	});

	var tplName = ['股本', '优先股', '永续债', '其他', '资本公积', '减：库存股',
		'其它综合收益', '专项储备', '盈余公积', '一般风险准备', '未分配利润', '所有者权益合计'];
	var qyTable = {
		localParam: {
			tabNum: false,
			url: '',
			urlparam: {
				menuId: window.sys_menuId,
				start: -1,
				limit: -1
			}
		},
		tableParam: {
			select: true,
			dom: '<"row"<"col-sm-12"tr>>',//'<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>'
			serverSide: true,
			lengthChange: false,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.flag) {
					$(row).addClass('edit-able');
					for (let i = 3; i < 14; i++) {
						$(row).find('td').eq(i).addClass('bg-success-light');
					}

				}
			},
			columnDefs: [
				{
					targets: 0,
					orderable: false,
					className: 'text-center',
					title: '序号',
					width: '30px',
					visible: true,
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					targets: 1,
					orderable: false,
					className: 'text-left',
					title: '编号',
					name: 'colCode',
					data: 'colCode',
					visible: false,
					width: '60px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					width: '30px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '150px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g,'&nbsp;');
						}
					}
				}
			]
		}
	};
	let j = 4;
	for (var i = 0, len = tplName.length; i < len; i++) {
		//取消 一般风险准备 列
		if (tplName[i] === '一般风险准备') {
			j = j - 1;
			continue;
		}
		qyTable.tableParam.columnDefs.push({
			targets: i + j,
			orderable: false,
			className: 'text-right',
			title: tplName[i],
			name: 'column' + (i + 1),
			data: 'column' + (i + 1),
			width: '110px',
			render: function(data, type, row, meta) {
				return formatMoney(data);
			}
		});
	}

	/** 加载数据 */
	function loadData(arg) {
		//获取参数
		if (thisPageConfig.TABLE_DIV == '5') {
			var qy = $.extend(true, {}, qyTable);
			qy.localParam.url = 'dgCenter/FUnAuditReport.unAuditQYData.json';
			qy.localParam.urlparam.sqlId = 'FA40043';
			qy.localParam.urlparam.param1 = window.CUR_CUSTOMERID;
			qy.localParam.urlparam.param3 = window.CUR_PROJECTID;
			qy.localParam.urlparam.param6 = thisPageConfig.showType;
			if (arg) {
				return qy;
			}
			BdoDataTable(thisPageConfig.id, qy);
			return;
		}
		var params = {
			'menuId': window.sys_menuId,
			'param1': window.CUR_CUSTOMERID,
			'param2': projectYear,
			'param3': projectYear,
			'param4': thisPageConfig.showZero,
			'param5': thisPageConfig.showType,
			'param6': thisPageConfig.TABLE_DIV
		};
		var table_view = $.extend(true, {}, rpt_view);
		table_view.localParam.urlparam = params;
		table_view.tableParam = createColumn(projectYear, projectYear, thisPageConfig.showType);
		if (thisPageConfig.TABLE_DIV == '1') {
			table_view.tableParam = createColumnZC(projectYear, projectYear, thisPageConfig.showType);
		}
		if (arg) {
			return table_view;
		}

		BdoDataTable(thisPageConfig.id, table_view);
	}

	/** 生成显示列 */
	function createColumn(startYear, endYear, flag) {
		var tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				//if (data.colDisp.indexOf("总额"))
				$(row).addClass('edit-able');
				$(row).find('td:eq(6)').addClass('bg-success-light');
				if (data.flag) {

					$(row).find('td:eq(3)').addClass('bg-success-light');
					$(row).find('td:eq(4)').addClass('bg-gray-light');

				}
			},

			/*initComplete : function(settings, json) {

				if (!json || json.data.length == 0) {
					bdoInfoBox('提示', "未生成未审报表，请先点击【生成未审报表】按钮！");
				}
			},*/
			columnDefs: [
				{
					targets: 0,
					orderable: false,
					className: 'text-center width-seq',
					title: '序号',
					//width: '30px',
					visible: true,
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},
				{
					targets: 1,
					orderable: false,
					className: 'text-left width-code',
					title: '编号',
					name: 'colCode',
					data: 'colCode',
					visible: false,
					//width: '60px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left width-subject-id',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '30px',
					render: function(data, type, row, meta) {

						return data.replace(/ /g,'&nbsp;');

					}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-lef width-subject-name',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '150px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g,'&nbsp;');
						}
					}
				}
			]
		};
		var colNum = 3;
		for (var i = startYear; i <= endYear; i++) {
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				orderable: false,
				className: 'text-right width-je',
//				title : i + '年<br>总账金额',
				title: flag == '2' ? '上年数' : '本年数',
// 				title: flag == '2' ?  (i - 1)+'年<br>期末数' : i+'年<br>期末数',
				name: flag == '2' ? 'remain' + i : 'unAuditAmount' + i,
				data: flag == '2' ? 'remain' + i : 'unAuditAmount' + i,
				//width: '60px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 2,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>客户调整数' : i + '年<br>客户调整数',
				name: flag == '2' ? 'adjustRemain' + i : 'adjustAmount' + i,
				data: flag == '2' ? 'adjustRemain' + i : 'adjustAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					var html = formatMoney(data);
					if (row.colType =='1'){
						if (data&&data !='0' ){
							html = '<label style="font-size: 10px;position: relative;top:5px;">' +
								'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
								'</label>';
							return html;
						}
					}
/*					if (flag == '2') {
//						 || row.adjustFlag == '3'

					} else {
/!*						if (row.adjustFlag == '2' || row.adjustFlag == '3') {
							html = '<label style="font-size: 10px;position: relative;top:5px;">' +
								'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
								'</label>';
							return html;
						}*!/
						if (row.colType =='1'){
							if (data !='0' ){
								html = '<label style="font-size: 10px;position: relative;top:5px;">' +
									'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
									'</label>';
								return html;
							}
						}
					}*/
					return html;
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 3,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>调整后金额' : i + '年<br>调整后金额',
				name: flag == '2' ? 'adjustedRemain' + i : 'adjustedAmount' + i,
				data: flag == '2' ? 'adjustedRemain' + i : 'adjustedAmount' + i,
				width: '110px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 4,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>客户报表数字' : i + '年<br>客户报表数字',
				name: flag == '2' ? 'customerRemain' + i : 'customerAmount' + i,
				data: flag == '2' ? 'customerRemain' + i : 'customerAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 5,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>差异金额' : i + '年<br>差异金额',
				name: flag == '2' ? 'differenceRemain' + i : 'differenceAmount' + i,
				data: flag == '2' ? 'differenceRemain' + i : 'differenceAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});

			// #4264 增加公式列
			tbColumns.columnDefs.push({
				targets: colNum + 6,
				orderable: false,
				className: 'text-left width-calfun',
				title: '计算公式',
				name: 'calFun',
				data: 'calFun'
			});

			if (i < endYear) {
				tbColumns.columnDefs.push({
					targets: colNum + 7,
					orderable: false,
					className: 'text-right',
					title: '',
					width: '10px'
				});
			}
			colNum = colNum + 7;
		}
		return tbColumns;
	}

	/** 生成资产负债表显示列 */
	function createColumnZC(startYear, endYear, flag) {

		var tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.colDisp.indexOf('合计') < 0 || data.colDisp.indexOf('总计') < 0) {
					$(row).addClass('edit-able');
					$(row).find('td:eq(6)').addClass('bg-success-light');
				}
			},
			/*initComplete : function(settings, json) {

				if (!json || json.data.length == 0) {
					bdoInfoBox('提示', "未生成未审报表，请先点击【生成未审报表】按钮！");
				}
			},*/
			columnDefs: [
				{
					targets: 0,
					orderable: false,
					className: 'text-center width-seq',
					title: '序号',
					//width: '30px',
					visible: true,
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				},

				{
					targets: 1,
					orderable: false,
					className: 'text-left width-code',
					title: '编号',
					name: 'colCode',
					data: 'colCode',
					visible: false,
					//width: '60px'
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left width-subject-id',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '30px',
					render: function(data, type, row, meta) {
						return data.replace(/ /g,'&nbsp;');

					}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left width-subject-name',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '150px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g,'&nbsp;');
						}
					}
				}
			]
		};
		var colNum = 3;
		for (var i = startYear; i <= endYear; i++) {
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				orderable: false,
				className: 'text-right width-je',
//			 i + '年<br>' +
// 				title: flag == '2' ? '期初数' : '期末数',
				title: flag == '2' ?  (i - 1)+'年<br>期末数' : i+'年<br>期末数',
				name: flag == '2' ? 'remain' + i : 'unAuditAmount' + i,
				data: flag == '2' ? 'remain' + i : 'unAuditAmount' + i,
				//width: '60px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 2,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>客户调整数' : i + '年<br>客户调整数',
				name: flag == '2' ? 'adjustRemain' + i : 'adjustAmount' + i,
				data: flag == '2' ? 'adjustRemain' + i : 'adjustAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					var html = formatMoney(data);
					if (row.colType =='1'){
						if (data&&data !='0' ){
							html = '<label style="font-size: 10px;position: relative;top:5px;">' +
								'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
								'</label>';
							return html;
						}
					}
/*					if (flag == '2') {
//					|| row.adjustFlag == '3'
// 						if (row.adjustFlag == '1' || row.adjustFlag == '3') {
// 							html = '<label style="font-size: 10px;position: relative;top:5px;">' +
// 								'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
// 								'</label>';
// 							return html;
// 						}

					} else {
						// if (row.adjustFlag == '2' || row.adjustFlag == '3') {
						// 	html = '<label style="font-size: 10px;position: relative;top:5px;">' +
						// 		'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
						// 		'</label>';
						// 	return html;
						// }
						if (row.colType =='1'){
							if (data !='0' ){
								html = '<label style="font-size: 10px;position: relative;top:5px;">' +
									'<span style="background-color: #53f9f9;width: 100%;position: relative;top: 0px;display: block;">' + html + '</span>' +
									'</label>';
								return html;
							}
						}
					}*/
					return html;
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 3,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>调整后金额' : i + '年<br>调整后金额',
				name: flag == '2' ? 'adjustedRemain' + i : 'adjustedAmount' + i,
				data: flag == '2' ? 'adjustedRemain' + i : 'adjustedAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 4,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>客户报表数字' : i + '年<br>客户报表数字',
				name: flag == '2' ? 'customerRemain' + i : 'customerAmount' + i,
				data: flag == '2' ? 'customerRemain' + i : 'customerAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});
			tbColumns.columnDefs.push({
				targets: colNum + 5,
				orderable: false,
				className: 'text-right width-je',
				title: flag == '2' ? (i - 1) + '年<br>差异金额' : i + '年<br>差异金额',
				name: flag == '2' ? 'differenceRemain' + i : 'differenceAmount' + i,
				data: flag == '2' ? 'differenceRemain' + i : 'differenceAmount' + i,
				//width: '110px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			});

			// #4264 增加公式列
			tbColumns.columnDefs.push({
				targets: colNum + 6,
				orderable: false,
				className: 'text-left width-calfun',
				title: '计算公式',
				name: 'calFun',
				data: 'calFun'
			});

			if (i < endYear) {
				tbColumns.columnDefs.push({
					targets: colNum + 7,
					orderable: false,
					className: 'text-right',
					title: '',
					width: '10px'
				});
			}
			colNum = colNum + 7;
		}
		return tbColumns;
	}

	//获取审计调整table参数
	var adjustOptions = DgAdjustPage({handleFlag: '0', data: {extraOptions: {}}});
	var adjust_view = adjustOptions.tableModel;
	$('#tab2').on('click', function() {
		window.setTimeout('$(\'#adjustTable_processing\').hide()', 3000);
		if ($('#adjustTable').hasClass('dataTable')) {
			$('#adjustTable').DataTable().clear();
			$('#adjustTable').DataTable().destroy();
			$('#adjustTable').empty();
		}
		$('#selectYear').val(projectYear);
		adjust_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			sqlId: 'FA10064',
			param1: window.CUR_CUSTOMERID,
			param2: projectYear,
			param3: '1',
			//param4 : '%',
			param5: window.CUR_PROJECTID,
			param6: projectYear
		};


		BdoDataTable('adjustTable', adjust_view);
	});
	$('#refreshAdjustTableBtn').on('click', function() {
		$('#refreshAdjustTableBtn').blur();
		$('#adjustTable').DataTable().ajax.reload();
	});
/*

	$('#exportAdjustTableBtn').on('click', function(event) {
		var isManager = true;
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00197',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(sys_userId != data.data[0].manager){
						isManager = false;
					}
				}
			}
		});
		if(!isManager){
			bdoInfoBox('提示', '非项目负责人无权限导出客户调整汇总！');
			return;
		}
		let export_view = $.extend({}, adjust_view, true);
		let year = $('#selectYear').val();
		export_view.localParam.urlparam.menuId = window.sys_menuId;
		export_view.localParam.urlparam.sqlId='FA10064';
		export_view.localParam.urlparam.param2 = year;
		export_view.localParam.urlparam.param3 = '1';
		export_view.localParam.urlparam.param6 = year;
		exportExcel(this, '客户调整汇总', export_view, adjustTable);
	});
*/

	//显示0/不显示0
	$('#rpt_showZero').on('change', function() {
		thisPageConfig.showZero = $('#rpt_showZero').val();
		refTable();
		/*		thisPageConfig.id = 'zc_report' + index + '_table';
				thisPageConfig.TABLE_DIV = 1;
				loadData();
				thisPageConfig.id = 'lr_report' + index + '_table';
				thisPageConfig.TABLE_DIV = 3;
				loadData();
				thisPageConfig.id = 'xj_report' + index + '_table';
				thisPageConfig.TABLE_DIV = 4;
				loadData();
				thisPageConfig.id = 'qy_report' + index + '_table';
				thisPageConfig.TABLE_DIV = 5;
				loadData();
				thisPageConfig.id = tabId;
				thisPageConfig.TABLE_DIV = div;*/

	});

	//初始化，4个表格
	var initFourTable = function(index) {
		$.ajax({
			url: 'dgCenter/FUnAuditReport.unAuditReport.json',
			type: 'post',
			data: {
				start: -1,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param4': '2',
				'refreshFlg': '1',
				'param5': index
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					var text = data.resultInfo.statusText;
					var data = data.data[0];
					if (text) {
						bdoInfoBox('提示', text);
					}
					// 资产负债表 为 年初年末
					var zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnZC(projectYear, projectYear, index);
					//其他表 为 上年数 本年数
					var lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumn(projectYear, projectYear, index);
					var xj = $.extend(true, {}, lr);
					var qy = $.extend(true, {}, qyTable);
					zc.localParam.data = data.zc;
					lr.localParam.data = data.lr;
					xj.localParam.data = data.xj;
					qy.localParam.data = data.qy;
					tableData = data;
					BdoDataTable('zc_report' + index + '_table', zc);
					BdoDataTable('lr_report' + index + '_table', lr);
					// BdoDataTable('rpt_tbcheck', Tbcheck);
					BdoDataTable('rpt_tbcheck', Tbcheck);
					// BdoDataTable('xj_report' + index + '_table', xj);
					// BdoDataTable('qy_report' + index + '_table', qy);
					refTable();
					// if(index == '2'){
					//     BdoDataTable('rpt_tbcheck', Tbcheck2);
					// }else{
					//
					// }
					return;
				}
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		});
	};


	/**
	 * 过滤表格方法
	 */
	function refTable() {
		let index = thisPageConfig.showType;
		let adjust = index == '2' ? 'adjustRemain' + projectYear : 'adjustAmount' + projectYear;
		let adjusted = index == '2' ? 'remain' + projectYear : 'unAuditAmount' + projectYear;
		let zc = $.extend(true, {}, rpt_view);
		zc.tableParam = createColumnZC(projectYear, projectYear, index);
		//其他表 为 上年数 本年数
		let lr = $.extend(true, {}, rpt_view);
		lr.tableParam = createColumn(projectYear, projectYear, index);
		let xj = $.extend(true, {}, lr);
		let zcData = [];
		let lrData = [];
		let xjData = [];
		if (thisPageConfig.showZero == 0) {
			$(tableData.zc).each(function(i) {
				if (this && (this[adjust] != 0 || this[adjusted] != 0)) {
					zcData.push(this);
				}
			});
			$(tableData.lr).each(function(i) {
				if (this && (this[adjust] != 0 || this[adjusted] != 0)) {
					lrData.push(this);
				}
			});
			$(tableData.xj).each(function(i) {
				if (this && (this[adjust] != 0 || this[adjusted] != 0)) {
					xjData.push(this);
				}
			});
		} else if (thisPageConfig.showZero == 1) {
			$(tableData.zc).each(function(i) {
				if (this && (this[adjust] == 0 && this[adjusted] == 0)) {
					zcData.push(this);
				}
			});
			$(tableData.lr).each(function(i) {
				if (this && (this[adjust] == 0 && this[adjusted] == 0)) {
					lrData.push(this);
				}
			});
			$(tableData.xj).each(function(i) {
				if (this && (this[adjust] == 0 && this[adjusted] == 0)) {
					xjData.push(this);
				}
			});
		} else {
			zcData = tableData.zc;
			lrData = tableData.lr;
			xjData = tableData.xj;
		}
		zc.localParam.data = zcData;
		lr.localParam.data = lrData;
		xj.localParam.data = xjData;
		BdoDataTable('zc_report' + index + '_table', zc);
		BdoDataTable('lr_report' + index + '_table', lr);
		// BdoDataTable('xj_report' + index + '_table', xj);
	}

	//初始化期末表格
	(function() {
		initFourTable('1');
	})();

	//初始化期初表格
	$('#tab3').on('click', 'a', function() {
		let empty = {'qy': {'1': {}, '2': {}}};
		if (JSON.stringify(customerAmoutMap) !== JSON.stringify(empty)) {
			$('#rpt_save').click();
			// bdoConfirmBox("提示","当前页面信息未保存，是否保存么？",function () {
			//
			// },function () {
			// 	customerAmoutMap = empty;
			// });
		}
		$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_BEGINNING + '】');
		$($('#report2_type li')[3]).show();
		$('#tab_head_rpt').show();
		initFourTable('2');
		exportDgParam.param5 = '2';
	});
	//
	$('#tab1').on('click', 'a', function() {
		let empty = {'qy': {'1': {}, '2': {}}};
		if (JSON.stringify(customerAmoutMap) !== JSON.stringify(empty)) {
			$('#rpt_save').click();
			// bdoConfirmBox("提示","当前页面信息未保存，是否保存么？",function () {
			// },function () {
			// 	customerAmoutMap=empty;
			// });

		}
		$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_ENDING + '】');
		$($('#report1_type li')[3]).show();
		$('#tab_head_rpt').show();
		initFourTable('1');
		exportDgParam.param5 = '1';
	});


	// $('#subPageRight  [data-toggle="tabs"] a').click(function () {
	//     initFourTable(thisPageConfig.showType);
	//     if(thisPageConfig.showType == '2'){
	//         BdoDataTable('rpt_tbcheck', Tbcheck2);
	//     }else {
	//         BdoDataTable('rpt_tbcheck', Tbcheck);
	//     }
	// });

	/*    $('#subPageRight  [data-toggle="tabs"]').on('click', 'a', function() {
			let showType = '1';
			if (thisPageConfig.showType) {
				showType = thisPageConfig.showType;
			}
			if(showType == '2'){
				BdoDataTable('rpt_tbcheck', Tbcheck2);
			}else {
				BdoDataTable('rpt_tbcheck', Tbcheck);
			}
		});*/


// （本年-上年）表格列
	function createColumnAbs(i) {
		let tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.colDisp.indexOf('合计') < 0 || data.colDisp.indexOf('总计') < 0) {
					$(row).addClass('edit-able');
					$(row).find('td:eq(6)').addClass('bg-gray-lighter');
				}
			},
			/*initComplete : function(settings, json) {

				if (!json || json.data.length == 0) {
					bdoInfoBox('提示', "未生成未审报表，请先点击【生成未审报表】按钮！");
				}
			},*/
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '序号',
					width: '30px',
					visible: true,
					render: function(data, type, row, meta) {
						return meta.settings._iDisplayStart + meta.row + 1;
					}
				}, {
					targets: 2,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					width: '30px',
					render: function(data, type, row, meta) {
						return data.replace(/ /g,'&nbsp;');
					}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '150px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g,'&nbsp;');
						}
					}
				}, {
					targets: 4,
					orderable: false,
					className: 'text-right',
					title: '本年客户报表数字',
					name: 'customerAmount' + i,
					data: 'customerAmount' + i,
					width: '150px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				},
				{
					targets: 5,
					orderable: false,
					className: 'text-right',
					title: '上年客户报表数字',
					name: 'customerRemain' + i,
					data: 'customerRemain' + i,
					width: '150px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				},
				{
					targets: 6,
					orderable: false,
					className: 'text-right',
					title: '本期-上期',
					name: 'absRemain',
					data: 'absRemain',
					width: '150px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}

			]
		};
		return tbColumns;
	}


	$('#report_editer').change(function () {
		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.saveTbEditer.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param2: '2',
				param3: $(this).val(),
				param4: $(this).find('option:selected').attr('label')
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox("保存报表编制人成功！");
					// $('#tb_editer').append(tbEditer);
				}else {
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});


	});

//初始化表格 本期-上期
	$('#abs-remain').click(function() {
		//所有者权益变动表暂时隐藏
		$('#tab2_unAuditReportser').addClass('active');
		$($('#report1_type li')[3]).hide();
		$($('#report2_type li')[3]).hide();
		$('#tab_head_rpt').hide();
		$.ajax({
			url: 'dgCenter/FUnAuditReport.unAuditReport.json',
			type: 'post',
			data: {
				start: -1,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'refreshFlg': '1',
				'param4': '2',
				'param5': 1
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					var text = data.resultInfo.statusText;
					var data = data.data[0];
					if (text) {
						bdoInfoBox('提示', text);
					}
					// 资产负债表 为 年初年末
					let zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnAbs(projectYear);
					//其他表 为 上年数 本年数
					let lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumnAbs(projectYear);
					let xj = $.extend(true, {}, lr);
					// var qy = $.extend(true, {}, qyTable);
					zc.localParam.data = data.zc;
					lr.localParam.data = data.lr;
					xj.localParam.data = data.xj;
					// qy.localParam.data = data.qy;
					BdoDataTable('zc_report1_table', zc);
					BdoDataTable('lr_report1_table', lr);
					// BdoDataTable('xj_report1_table', xj);
					//两个都要刷新
					BdoDataTable('zc_report2_table', zc);
					BdoDataTable('lr_report2_table', lr);
					// BdoDataTable('xj_report2_table', xj);
					// BdoDataTable('qy_report' + index + '_table', qy);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});


	});
	$('#unAudit_report_hidden_check_table').on('click', function(event) {
		$('#unAudit_rpt_tbcheck_intwrap').toggle();
		$('.si', $(event.currentTarget)).toggleClass('si-arrow-down');
		$('.si', $(event.currentTarget)).toggleClass('si-arrow-up');
		if($('.si', $(event.currentTarget)).hasClass('si-arrow-up')){
			BdoDataTable('rpt_tbcheck', Tbcheck);
		}
	});
	Promise.resolve().then(() => {
		OneUI.initHelper('slimscroll');
	});
});


//全屏滚动事件
/*var sctop = 0
$('.block').on('mousewheel',function(e){

	//向上滚动
	if(e.deltaY == 1){
		if(sctop <= 0){
			return;
		}
		sctop-=80;
		$('.active .dataTables_scrollBody').scrollTop(sctop)
	//向下滚动
	}else if(e.deltaY == -1){
		if($('.active .dataTables_scrollBody')[1]){
			if($('.active .dataTables_scrollBody')[1].scrollHeight-500 <= sctop){
				return;
			}
		}else if($('.active .dataTables_scrollBody').scrollHeight-500 <= sctop){
			return;
		}
		sctop+=80;
		$('.active .dataTables_scrollBody').scrollTop(sctop)
	}
})*/
/**
 * 下拉选选择事件  选中年份 查询指定年份的客户调整数据
 */
$('#selectYear').on('change', function() {
	var params = {
		menuId: window.sys_menuId,
		sqlId: 'FA10064',
		param1: window.CUR_CUSTOMERID,
		param2: $(this).val(),
		param3: '1',
		//param4 : '%',
		param5: window.CUR_PROJECTID,
		param6: $(this).val()

	};

	var adjustOptions = DgAdjustPage({handleFlag: '0', data: {extraOptions: {}}});
	adjust_view = adjustOptions.tableModel;
	adjust_view.localParam.urlparam = params;
	BdoDataTable('adjustTable', adjust_view);
});


