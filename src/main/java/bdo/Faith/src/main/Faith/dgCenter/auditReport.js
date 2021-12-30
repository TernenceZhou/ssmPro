$(document).ready(function() {
	let cnt = 0;
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	const auditReportTableCfg = {
		localParam: {
			url: 'dgCenter/FUnAuditReport.auditReport.json',
			urlparam: {
				/*			menuId: window.sys_menuId,
							sqlId: 'DG00064',*/
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			tabNum: true
		},
		tableParam: {
			select: true,
			ordering: true,
			serverSide: true,
			autoWidth: true,
			scrollY: 500,
			scrollX: true,
			scrollCollapse: true,
			paging: true,
			fixedColumns: true,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: [{
				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: true,
				className: 'text-left width-subject-id',
				title: '科目编号',
				name: 'colCode',
				data: 'colCode',
				//width: '100px',
				render: function (data, type, row, meta) {
					return data;
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '科目名称',
				name: 'colDisp',
				data: 'colDisp',
				//width: '100px',
				className: 'dg-ap width-subject-name',
				render: function (data, type, row, meta) {
					if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
						return '<b>' + data + '</b>';
					} else {
						return data.replace(/ /g, '&nbsp;');
					}
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '未审数',
				name: 'adjustedAmount',
				data: 'adjustedAmount',
				//width: '100px',
				className: 'text-right width-je',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '审计调整数',
				name: 'adjustAmount',
				data: 'adjustAmount',
				//width: '100px',
				className: 'text-right width-je',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: ++cnt,
				orderable: true,
				title: '审定数',
				name: 'auditedAmount',
				data: 'auditedAmount',
				//width: '100px',
				className: 'text-right width-je',
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		}
	};
	// BdoDataTable('auditReportTable', auditReportTableCfg);
	$('#rpt_search').click(e => {
		e.preventDefault();
		$('#rpt_search').blur();
		initFourTable('1');
		loadData()
		// $('#auditReportTable').DataTable().ajax.reload();
	});
	pageRightTitle(pageTitleArr);
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '1',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'1': '资产负债表', '3': '利润表', '4': '现金流量表', '5': '所有者权益变动表'}
	};

	uiBlocksApi(false, 'init');
	$('#subPageRight [data-toggle="tabs"]').on('click', 'a', function (e) {
		e.preventDefault();
		if ($(this).closest('ul').attr('id') == 'tab_unAuditReport' && $(this).parent().index() > 1) {
			$('#tab_head_rpt').hide();
		} else {
			$('#tab_head_rpt').show();
		}
		$(this).tab('show');
	});
	$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
		//$(this).resize();
		var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
		thisPageConfig.showType = upperNode.attr('data-content');
		var tempId = upperNode.attr('data-result');
		var lowerNode = $('#' + tempId).find('li[class=active] a');
		thisPageConfig.id = lowerNode.attr('data-result');
		thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
		if (thisPageConfig.TABLE_DIV == '4'){
			loadData();
		}else if (thisPageConfig.TABLE_DIV == '5' || thisPageConfig.TABLE_DIV == '6') {
			var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			var fileIndexId = 'P005-AU001';
			var subjectTreeId = node.extraOptions.autoId;
			var fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00227',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: fileIndexId,
					param4: fileName,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							loadData();
						}else{
							bdoInProcessingBox('加载中...');
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgAuditFile.auditReportFile.json',
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: fileIndexId,
									param4: fileName,
									param5: subjectTreeId,
									param6: thisPageConfig.TABLE_DIV
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										loadData();
										bdoSuccessBox('加载完成');
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						}
					}
				}
			});
		}
		// loadData();
	});
	/*uiBlocksApi(false, 'init');
	$('#subPageRight [data-toggle="tabs"]').on('click', 'a', function (e) {
		e.preventDefault();
		if ($(this).closest('ul').attr('id') == 'tab_unAuditReport' && $(this).parent().index() > 1) {
			$('#tab_head_rpt').hide();
		} else {
			$('#tab_head_rpt').show();
		}
		$(this).tab('show');
	});
	$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
		//$(this).resize();
		var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
		thisPageConfig.showType = upperNode.attr('data-content');
		var tempId = upperNode.attr('data-result');
		var lowerNode = $('#' + tempId).find('li[class=active] a');
		thisPageConfig.id = lowerNode.attr('data-result');
		thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
	});*/
	var rpt_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/FUnAuditReport.auditReport.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId,
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
					$('#rpt_tbcheck_intwrap').show();
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['adjustAmount' + projectYear] != 0 && data['adjustAmount' + projectYear] != null && data['adjustAmount' + projectYear] != '') {
					// 展开
					$('#rpt_tbcheck_intwrap').show();
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['auditAmount' + projectYear] != 0 && data['auditAmount' + projectYear] != null && data['auditAmount' + projectYear] != '') {
					// 展开
					$('#rpt_tbcheck_intwrap').show();
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['unAuditAmount' + (projectYear-1)] != 0 && data['unAuditAmount' + (projectYear-1)] != null && data['unAuditAmount' + (projectYear-1)] != '') {
					// 展开
					$('#rpt_tbcheck_intwrap').show();
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['adjustAmount' + (projectYear-1)] != 0 && data['adjustAmount' + (projectYear-1)] != null && data['adjustAmount' + (projectYear-1)] != '') {
					// 展开
					$('#rpt_tbcheck_intwrap').show();
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}else if (data['auditAmount' + (projectYear-1)] != 0 && data['auditAmount' + (projectYear-1)] != null && data['auditAmount' + (projectYear-1)] != '') {
					// 展开
					$('#rpt_tbcheck_intwrap').show();
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-down', false);
					$('.si', $('#audit_report_hidden_check_table')).toggleClass('si-arrow-up', true);
				}
			},
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-left',
				title: '校验项',
				name: 'colDisp',
				data: 'colDisp',
				width: '350px',
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}, {
				targets: 5,
				orderable: false,
				className: 'text-right',
				title: (projectYear - 1) + '年<br>未审数',
				name: 'unAuditAmount' + (projectYear - 1),
				data: 'unAuditAmount' + (projectYear - 1),
				width: '120px',
				render: function (data, type, row, meta) {
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
				title: (projectYear - 1) + '年<br>审计调整数',
				name: 'adjustAmount' + (projectYear - 1),
				data: 'adjustAmount' + (projectYear - 1),
				width: '120px',
				render: function (data, type, row, meta) {
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
				title: (projectYear - 1) + '年<br>审定数',
				name: 'auditAmount' + (projectYear - 1),
				data: 'auditAmount' + (projectYear - 1),
				width: '120px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}]
		}
	};

	/*var tplName = ['股本', '优先股', '永续债', '其他', '资本公积', '减：库存股',
		'其它综合收益', '专项储备', '盈余公积', '一般风险准备', '未分配利润', '所有者权益合计'];*/
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
				if (data.colType == '1') {
					$(row).addClass('edit-able');
					for (let i = 3; i < 14; i++) {
						$(row).find('td').eq(i).addClass('bg-success-light');
					}
				}
			},
			columnDefs: [
				{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-center width-seq',
					title: '序号',
					//width: '30px',
					visible: true,
					render: function (data, type, row, meta) {
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
					//width: '30px'
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left width-subject-name',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '150px',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				}
			]
		}
	};
	/*for (var i = 0, len = tplName.length; i < len; i++) {
		qyTable.tableParam.columnDefs.push({
			targets: i + 4,
			orderable: false,
			className: 'text-right width-je',
			title: tplName[i],
			name: 'column' + (i + 1),
			data: 'column' + (i + 1),
			//width: '110px',
			render: function (data, type, row, meta) {
				console.log(i)
				if (row.flag){
					var renderStr = '<button class="btn btn-xs btn-default table-btn-operate bdo-drop-btn edit-Button" type="button" style="float: left;" data-placement="top" title="编辑" data-row="'+meta.row+'" data-col="4">'
						+'<i class="fa fa-edit"></i>'
						+'</button>' + '&nbsp;&nbsp;&nbsp;<label>' + formatMoney(data)+ '</label>';
					return renderStr;
				}else {
					return formatMoney(data);
				}
				return formatMoney(data);
				//return formatMoney(data);
			}
		});
	}*/

	/*qyTable.tableParam.columnDefs.push({
		targets: tplName.length + 4,
		orderable: false,
		className: 'text-left width-calfun',
		title: "计算公式",
		name: 'calFun',
		data: 'calFun',
		render: function (data, type, row, meta) {
			return data === '0' ? '' : data;
		}
	});*/

	var customerAmoutMap = {'qy': {'1': {}, '2': {}}};

	/** 加载数据 */
	function loadData() {
		//获取参数
		if (thisPageConfig.TABLE_DIV == '4'){
			var vocationId = '';
			$.ajax({
				type: 'post',
				async: false,
				url: 'dgCenter/DgGeneral.query.json',
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00061',
					param1: window.CUR_PROJECTID,
					param2: window.CUR_CUSTOMERID
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						vocationId = data.data[0].tbReportTemplate;
					} else {
						bdoErrorBox('提示', data.resultInfo.statusText);
					}
				}
			});
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				// async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00394',
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: vocationId,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var sqlId = 'DG00394';
							if(data.data[0].generateMethod == 1){
								sqlId = 'DG00395';
							}
							// 删除增加项
							qyTable.tableParam.columnDefs = qyTable.tableParam.columnDefs.splice(0,4);
							qyTable.tableParam.columnDefs.push({
								targets: 4,
								orderable: false,
								className: 'text-right width-je',
								title: '本期金额',
								name: 'curAmount',
								data: 'curAmount',
								render: function (data, type, row, meta) {
									if(data == null){
										return '';
									}else{
										return formatMoney(data);
									}
								}
							});
							qyTable.tableParam.columnDefs.push({
								targets: 5,
								orderable: false,
								className: 'text-right width-je',
								title: '上期金额',
								name: 'preAmount',
								data: 'preAmount',
								render: function (data, type, row, meta) {
									if(data == null){
										return '';
									}else{
										return formatMoney(data);
									}
								}
							});
							var qy = $.extend(true, {}, qyTable);
							qy.localParam.url = 'dgCenter/DgGeneral.query.json';
							qy.localParam.urlparam.sqlId = sqlId;
							qy.localParam.urlparam.param1 = window.CUR_CUSTOMERID;
							qy.localParam.urlparam.param2 = window.CUR_PROJECTID;
							qy.localParam.urlparam.param3 = window.CUR_PROJECT_ACC_YEAR;
							qy.localParam.urlparam.param4 = vocationId;
							BdoDataTable(thisPageConfig.id, qy);
						}
					}
				}
			});
		}
		if (thisPageConfig.TABLE_DIV == '5' || thisPageConfig.TABLE_DIV == '6') {
			var tableDiv = thisPageConfig.TABLE_DIV;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00232',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if(data.data[0].reportType == '合并'){
							if(tableDiv == '4'){
								tableDiv = 10;
							} else if(tableDiv == '5'){
								tableDiv = 11;
							} else if(tableDiv == '6'){
								tableDiv = 12;
							}
						}
					}
				}
			});
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00225',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: tableDiv,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var tplName = [];
							if(data.data[0].columnDesc1 != null){
								tplName.push(data.data[0].columnDesc1);
							}
							if(data.data[0].columnDesc2 != null){
								tplName.push(data.data[0].columnDesc2);
							}
							if(data.data[0].columnDesc3 != null){
								tplName.push(data.data[0].columnDesc3);
							}
							if(data.data[0].columnDesc4 != null){
								tplName.push(data.data[0].columnDesc4);
							}
							if(data.data[0].columnDesc5 != null){
								tplName.push(data.data[0].columnDesc5);
							}
							if(data.data[0].columnDesc6 != null){
								tplName.push(data.data[0].columnDesc6);
							}
							if(data.data[0].columnDesc7 != null){
								tplName.push(data.data[0].columnDesc7);
							}
							if(data.data[0].columnDesc8 != null){
								tplName.push(data.data[0].columnDesc8);
							}
							if(data.data[0].columnDesc9 != null){
								tplName.push(data.data[0].columnDesc9);
							}
							if(data.data[0].columnDesc10 != null){
								tplName.push(data.data[0].columnDesc10);
							}
							
							if(data.data[0].columnDesc11 != null){
								tplName.push(data.data[0].columnDesc11);
							}
							if(data.data[0].columnDesc12 != null){
								tplName.push(data.data[0].columnDesc12);
							}
							if(data.data[0].columnDesc13 != null){
								tplName.push(data.data[0].columnDesc13);
							}
							if(data.data[0].columnDesc14 != null){
								tplName.push(data.data[0].columnDesc14);
							}
							if(data.data[0].columnDesc15 != null){
								tplName.push(data.data[0].columnDesc15);
							}
							// 删除增加项
							qyTable.tableParam.columnDefs = qyTable.tableParam.columnDefs.splice(0,4);
							for (var i = 0, len = tplName.length; i < len; i++) {
								qyTable.tableParam.columnDefs.push({
									targets: i + 4,
									orderable: false,
									className: 'text-right width-je',
									title: tplName[i],
									name: 'column' + (i + 1),
									data: 'column' + (i + 1),
									render: function (data, type, row, meta) {
										if(data == null){
											return '';
										}else{
											return formatMoney(data);
										}
									}
								});
							}
						}
					}
				}
			});
			var qy = $.extend(true, {}, qyTable);
			qy.localParam.url = 'dgCenter/DgGeneral.query.json';
			qy.localParam.urlparam.sqlId = 'DG00226';
			qy.localParam.urlparam.param1 = window.CUR_CUSTOMERID;
			qy.localParam.urlparam.param2 = window.CUR_PROJECTID;
			qy.localParam.urlparam.param3 = window.CUR_PROJECT_ACC_YEAR;
			qy.localParam.urlparam.param4 = tableDiv;
			BdoDataTable(thisPageConfig.id, qy);
		}
	}

	/** 生成显示列 */
	function createColumn() {
		var tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				$(row).addClass('edit-able');
				if (data.flag) {
					$(row).find('td:eq(3)').addClass('bg-success-light');
					$(row).find('td:eq(4)').addClass('bg-success-light');
				}
			},
			columnDefs: [{
				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: false,
				className: 'text-center width-seq',
				title: '序号',
				//width: '30px',
				visible: true,
				render: function (data, type, row, meta) {
					return meta.settings._iDisplayStart + meta.row + 1;
				}
			},
				{
					targets: ++cnt,
					orderable: true,
					className: 'text-left width-subject-id',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '100px',
					render: function (data, type, row, meta) {
						return data;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '100px',
					className: 'dg-ap width-subject-name',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				}, /*{
					targets: ++cnt,
					orderable: true,
					title: '未审数',
					name: 'adjustedAmount',
					data: 'adjustedAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '审计调整数',
					name: 'adjustAmount',
					data: 'adjustAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, */{
					targets: ++cnt,
					orderable: true,
					title: '审定数',
					name: 'auditedAmount',
					data: 'auditedAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上年数',
					name: 'auditedRemain',
					data: 'auditedRemain',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					className: 'text-left width-calfun'
				}
			]
		};
		return tbColumns;
	}

	/*function createColumnXJ(startYear, endYear, flag) {
		var tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.colType == '1') {
					$(row).addClass('edit-able');
					$(row).find('td:eq(3)').addClass('bg-success-light');
					$(row).find('td:eq(4)').addClass('bg-success-light');
				}
			},
			columnDefs: [{

				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: false,
				className: 'text-center width-seq',
				title: '序号',
				//width: '30px',
				visible: true,
				render: function (data, type, row, meta) {
					return meta.settings._iDisplayStart + meta.row + 1;
				}
			},
				{
					targets: ++cnt,
					orderable: true,
					className: 'text-left width-subject-id',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '100px',
					render: function (data, type, row, meta) {
						return data;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '100px',
					className: 'dg-ap width-subject-name',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '本年数',
					name: 'adjustedAmount',
					data: 'adjustedAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						switch (row.colCode) {
							case 'F00033':
							case 'F00034':
							case 'F00035':
							case 'F00036':
							case 'HB_F00033':
							case 'HB_F00034':
							case 'HB_F00035':
							case 'HB_F00036':
								return '';
							default:
								return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上年数',
					name: 'auditedRemain',
					data: 'auditedRemain',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						switch (row.colCode) {
							case 'F00033':
							case 'F00034':
							case 'F00035':
							case 'F00036':
							case 'HB_F00033':
							case 'HB_F00034':
							case 'HB_F00035':
							case 'HB_F00036':
								return '';
							default:
								return formatMoney(data);
						}
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					className: 'text-left width-calfun'
				}
			]
		};
		return tbColumns;
	}*/

	/** 生成资产负债表显示列 */
	function createColumnZC() {
		var tbColumns = {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			/*initComplete : function(settings, json) {
				debugger;
				if (!json || json.data.length == 0) {
					bdoInfoBox('提示', "未生成未审报表，请先点击【生成未审报表】按钮！");
				}
			},*/
			columnDefs: [{
				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: false,
				className: 'text-center width-seq',
				title: '序号',
				//width: '30px',
				visible: true,
				render: function (data, type, row, meta) {
					return meta.settings._iDisplayStart + meta.row + 1;
				}
			},
				{
					targets: ++cnt,
					orderable: true,
					className: 'text-left width-subject-id',
					title: '科目编号',
					name: 'colCode',
					data: 'colCode',
					//width: '100px',
					render: function (data, type, row, meta) {
						return data;

					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					//width: '100px',
					className: 'dg-ap width-subject-name',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				}, /*{
					targets: ++cnt,
					orderable: true,
					title: '未审数',
					name: 'adjustedAmount',
					data: 'adjustedAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '审计调整数',
					name: 'adjustAmount',
					data: 'adjustAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, */{
					targets: ++cnt,
					orderable: true,
					title: '审定数',
					name: 'auditedAmount',
					data: 'auditedAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '年初数',
					name: 'auditedRemain',
					data: 'auditedRemain',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					className: 'text-left width-calfun'
				}
			]
		};
		return tbColumns;
	}

	// 核对审定报表
	function checkReport(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/FUnAuditReport.checkAudit.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECT_ACC_YEAR,
				param3: window.CUR_PROJECT_ACC_YEAR
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					bdoSuccessBox('核对成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('核对失败', data.resultInfo.statusText);
				}
			}
		});
	}
	
	//核对完成
	$('#rpt_check_Report').on('click', function () {
		$('#rpt_check_Report').blur();
		bdoAjaxBox('系统提示', window.CUR_PROJECT_ACC_YEAR + '年审定报表确定完成核对吗？', function () {
			bdoInProcessingBox('核对中');
			Promise.all([genAuditedReportData(5)])
				.then(()=>{
					checkReport();
				}).catch(()=>{
				bdoErrorBox('失败', "审定报表数据生成失败");
			});
		});
	});

	// 数组去重
	function array_dedup(arr){
		return Array.from(new Set(arr));
	}

	// 获取资产负债表的行数据
	function getZCTableRowData(){
		var aoColumns = $('#zc_report1_table').DataTable().context[0].aoColumns;
		var title = [];
		$.each(aoColumns,function(index,item){
			if(item.title != '计算公式'){
				title.push(item.title);
			}
		});
		var aoData = $('#zc_report1_table').DataTable().context[0].aoData;
		var textContent = [];
		var columnStyle = {
			'序号': {"width":"60px","align":"center"},
			'科目编号': {"width":"180px","align":"left"},
			'科目名称': {"width":"180px","align":"left"},
			'未审数': {"width":"100px","align":"right"},
			'审计调整数': {"width":"100px","align":"right"},
			'审定数': {"width":"100px","align":"right"},
			'年初数': {"width":"100px","align":"right"}
		};
		$.each(aoData,function(index,item){
			var content = {};
 			$.each(item.anCells,function(index,item){
 				content[title[index]] = item.textContent;
			});
 			textContent.push(content);
		});
		var zc = {
			title: array_dedup(title),
			textContent: textContent,
			columnStyle: columnStyle
		};
		return zc;
	}

	// 获取利润表的行数据
	function getLRTableRowData(){
		var aoColumns = $('#lr_report1_table').DataTable().context[0].aoColumns;
		var title = [];
		$.each(aoColumns,function(index,item){
			if(item.title != '计算公式'){
				title.push(item.title);
			}
		});
		var aoData = $('#lr_report1_table').DataTable().context[0].aoData;
		var textContent = [];
		var columnStyle = {
			'序号': {"width":"60px","align":"center"},
			'科目编号': {"width":"180px","align":"left"},
			'科目名称': {"width":"180px","align":"left"},
			'未审数': {"width":"100px","align":"right"},
			'审计调整数': {"width":"100px","align":"right"},
			'审定数': {"width":"100px","align":"right"},
			'上年数': {"width":"100px","align":"right"}
		};
		$.each(aoData,function(index,item){
			var content = {};
 			$.each(item.anCells,function(index,item){
 				content[title[index]] = item.textContent;
			});
 			textContent.push(content);
		});
		var lr = {
			title: array_dedup(title),
			textContent: textContent,
			columnStyle: columnStyle
		};
		return lr;
	}

	// 获取现金流量表的行数据
	function getXJTableRowData(){
		var title = ['序号', '科目编号', '科目名称'];
		var textContent = [];
		var columnStyle = {
			'序号': {"width":"60px","align":"center"},
			'科目编号': {"width":"180px","align":"left"},
			'科目名称': {"width":"180px","align":"left"}
		};
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00304',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: 'F',
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(data.data != null){
						var i = 1;
						for(var item of data.data){
							var content = {};
							content['序号'] = i;
							content['科目编号'] = item.colCode;
							content['科目名称'] = item.colDisp;
							content[item.columnDesc1] = item.column1 == 0 ? 0 : formatMoney2(item.column1);
							content[item.columnDesc2] = item.column2 == 0 ? 0 : formatMoney2(item.column2);
							textContent.push(content);
							i++;
						}
						title.push(item.columnDesc1);
						title.push(item.columnDesc2);
						columnStyle[item.columnDesc1] = {"width":"100px","align":"right"};
						columnStyle[item.columnDesc2] = {"width":"100px","align":"right"};
					}
				}
			}
		});
		var xj = {
			title: array_dedup(title),
			textContent: textContent,
			columnStyle: columnStyle
		};
		return xj;
	}

	// 获取所有者权益变动表（本年）的行数据
	function getQYTable1RowData(){
		var title = [];
		var textContent = [];
		var columnStyle = {};
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00305',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: 'G',
				param4: 2,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(data.data != null){
						var qy = setQYTitleContent(data.data);
						title = qy.title;
						textContent = qy.textContent;
						columnStyle = qy.columnStyle;
					}
				}
			}
		});
		var qy1 = {
			title: array_dedup(title),
			textContent: textContent,
			columnStyle: columnStyle
		};
		return qy1;
	}

	// 获取所有者权益变动表（上年）的行数据
	function getQYTable2RowData(){
		var title = [];
		var textContent = [];
		var columnStyle = {};
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00305',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: 'G',
				param4: 1,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(data.data != null){
						var qy = setQYTitleContent(data.data);
						title = qy.title;
						textContent = qy.textContent;
						columnStyle = qy.columnStyle;
					}
				}
			}
		});
		var qy2 = {
			title: array_dedup(title),
			textContent: textContent,
			columnStyle: columnStyle
		};
		return qy2;
	}

	function setQYTitleContent(data){
		var title = ['序号', '科目编号', '科目名称'];
		var textContent = [];
		var columnStyle = {
			'序号': {"width":"60px","align":"center"},
			'科目编号': {"width":"180px","align":"left"},
			'科目名称': {"width":"180px","align":"left"}
		};
		var i = 1;
		for(var item of data){
			var content = {};
			content['序号'] = i;
			content['科目编号'] = item.colCode;
			content['科目名称'] = item.colDisp;
			if(item.columnDesc1 != null){
				content[item.columnDesc1] = item.column1 == 0 ? 0 : formatMoney2(item.column1);
			}
			if(item.columnDesc2 != null){
				content[item.columnDesc2] = item.column2 == 0 ? 0 : formatMoney2(item.column2);
			}
			if(item.columnDesc3 != null){
				content[item.columnDesc3] = item.column3 == 0 ? 0 : formatMoney2(item.column3);
			}
			if(item.columnDesc4 != null){
				content[item.columnDesc4] = item.column4 == 0 ? 0 : formatMoney2(item.column4);
			}
			if(item.columnDesc5 != null){
				content[item.columnDesc5] = item.column5 == 0 ? 0 : formatMoney2(item.column5);
			}
			if(item.columnDesc6 != null){
				content[item.columnDesc6] = item.column6 == 0 ? 0 : formatMoney2(item.column6);
			}
			if(item.columnDesc7 != null){
				content[item.columnDesc7] = item.column7 == 0 ? 0 : formatMoney2(item.column7);
			}
			if(item.columnDesc8 != null){
				content[item.columnDesc8] = item.column8 == 0 ? 0 : formatMoney2(item.column8);
			}
			if(item.columnDesc9 != null){
				content[item.columnDesc9] = item.column9 == 0 ? 0 : formatMoney2(item.column9);
			}
			if(item.columnDesc10 != null){
				content[item.columnDesc10] = item.column10 == 0 ? 0 : formatMoney2(item.column10);
			}
			if(item.columnDesc11 != null){
				content[item.columnDesc11] = item.column11 == 0 ? 0 : formatMoney2(item.column11);
			}
			if(item.columnDesc12 != null){
				content[item.columnDesc12] = item.column12 == 0 ? 0 : formatMoney2(item.column12);
			}
			if(item.columnDesc13 != null){
				content[item.columnDesc13] = item.column13 == 0 ? 0 : formatMoney2(item.column13);
			}
			if(item.columnDesc14 != null){
				content[item.columnDesc14] = item.column14 == 0 ? 0 : formatMoney2(item.column14);
			}
			if(item.columnDesc15 != null){
				content[item.columnDesc15] = item.column15 == 0 ? 0 : formatMoney2(item.column15);
			}
			textContent.push(content);
			i++;
		}
		if(data[0].columnDesc1 != null){
			title.push(item.columnDesc1);
			columnStyle[item.columnDesc1] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc2 != null){
			title.push(item.columnDesc2);
			columnStyle[item.columnDesc2] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc3 != null){
			title.push(item.columnDesc3);
			columnStyle[item.columnDesc3] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc4 != null){
			title.push(item.columnDesc4);
			columnStyle[item.columnDesc4] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc5 != null){
			title.push(item.columnDesc5);
			columnStyle[item.columnDesc5] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc6 != null){
			title.push(item.columnDesc6);
			columnStyle[item.columnDesc6] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc7 != null){
			title.push(item.columnDesc7);
			columnStyle[item.columnDesc7] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc8 != null){
			title.push(item.columnDesc8);
			columnStyle[item.columnDesc8] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc9 != null){
			title.push(item.columnDesc9);
			columnStyle[item.columnDesc9] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc10 != null){
			title.push(item.columnDesc10);
			columnStyle[item.columnDesc10] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc11 != null){
			title.push(item.columnDesc11);
			columnStyle[item.columnDesc11] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc12 != null){
			title.push(item.columnDesc12);
			columnStyle[item.columnDesc12] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc13 != null){
			title.push(item.columnDesc13);
			columnStyle[item.columnDesc13] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc14 != null){
			title.push(item.columnDesc14);
			columnStyle[item.columnDesc14] = {"width":"100px","align":"right"};
		}
		if(data[0].columnDesc15 != null){
			title.push(item.columnDesc15);
			columnStyle[item.columnDesc15] = {"width":"100px","align":"right"};
		}
		var qy = {
			title: array_dedup(title),
			textContent: textContent,
			columnStyle: columnStyle
		};
		return qy;
	}

	// 获取表格数据
	function getThirdPartyTableListDtos(){
		var thirdPartyTableListDtos = [];
		var date = new Date()
		var createDate = date.getDate();
		// "1","3","4","5","6"
		var zc = getZCTableRowData();
		var tableListDto1 = {
			createDate: createDate,
			id: 1,
			messageId: 1,
			tableColumnName: zc.title,
			tableRow: zc.textContent,
			tableType: "zc",
			tableTypeName: "资产负债表",
			columnStyle: zc.columnStyle
		};
		thirdPartyTableListDtos.push(tableListDto1);
		var lr = getLRTableRowData();
		var tableListDto2 = {
			createDate: createDate,
			id: 3,
			messageId: 3,
			tableColumnName: lr.title,
			tableRow: lr.textContent,
			tableType: "lr",
			tableTypeName: "利润表",
			columnStyle: lr.columnStyle
		};
		thirdPartyTableListDtos.push(tableListDto2);
		var xj = getXJTableRowData();
		var tableListDto3 = {
			createDate: createDate,
			id: 4,
			messageId: 4,
			tableColumnName: xj.title,
			tableRow: xj.textContent,
			tableType: "xj",
			tableTypeName: "现金流量表",
			columnStyle: xj.columnStyle
		};
		thirdPartyTableListDtos.push(tableListDto3);
		var qy1 = getQYTable1RowData();
		var tableListDto4 = {
			createDate: createDate,
			id: 5,
			messageId: 5,
			tableColumnName: qy1.title,
			tableRow: qy1.textContent,
			tableType: "qy",
			tableTypeName: "所有者权益变动表（本年）",
			columnStyle: qy1.columnStyle
		};
		thirdPartyTableListDtos.push(tableListDto4);
		var qy2 = getQYTable2RowData();
		var tableListDto5 = {
			createDate: createDate,
			id: 6,
			messageId: 6,
			tableColumnName: qy2.title,
			tableRow: qy2.textContent,
			tableType: "qy1",
			tableTypeName: "所有者权益变动表（上年）",
			columnStyle: qy2.columnStyle
		};
		thirdPartyTableListDtos.push(tableListDto5);
		return thirdPartyTableListDtos;
	}

	//推送至客户门户
	function sendAuditData(){
		var thirdPartyTableListDto = {
			projectId: window.CUR_PROJECTID,
			title: $('#auditReportSend_title').val(),
			remark: $('#auditReportSend_remark').val(),
			sourcePlat: 'SACP',
			thirdPartyTableListDtos: getThirdPartyTableListDtos(),
			token: 'yUFTYE3#@tj27658JKpos'
		};
		var jsonStr = JSON.stringify(thirdPartyTableListDto).replace(/\+/g, '%2B');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgAuditFile.pushCustomPortal.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: jsonStr
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					$('#modal_auditReportSend').modal('hide');
					bdoSuccessBox('推送成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('推送失败', data.resultInfo.statusText);
				}
			}
		});
	}

	//推送至客户门户
	$('#audit_report_send').on('click', function () {
		$('#audit_report_send').blur();
		$('#modal_auditReportSend').modal('show');
		$('#auditReportSend_title').val('审定报表');
		$('#auditReportSend_remark').val('');
		
	});
	$('#audit_report_hidden_check_table').on('click', function(event) {
		$('#rpt_tbcheck_intwrap').toggle();
		//$('#rpt_tbcheck').toggle();
		$('.si', $(event.currentTarget)).toggleClass('si-arrow-down');
		$('.si', $(event.currentTarget)).toggleClass('si-arrow-up');
		if($('.si', $(event.currentTarget)).hasClass('si-arrow-up')){
			BdoDataTable('rpt_tbcheck', Tbcheck);
		}
	});
	//推送至客户门户
	$('#auditReportSend_submit').on('click', function () {
		if($('#auditReportSend_title').val() == ''){
			bdoInfoBox('提示', '标题不能为空');
			return;
		}
		if($('#auditReportSend_title').val().length > 20){
			bdoInfoBox('提示', '请将输入的标题控制在20字以内');
			return;
		}
		if($('#auditReportSend_remark').val().length > 100){
			bdoInfoBox('提示', '请将输入的备注控制在100字以内');
			return;
		}
		$('#auditReportSend_submit').blur();
		bdoConfirmBox('提示', '是否将审定报表推送至客户门户？', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
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
						if (sys_userId == data.data[0].manager) {
							bdoInProcessingBox('推送中');
							Promise.all([genAuditedReportData(5)])
								.then(()=>{
									sendAuditData();
								}).catch(()=>{
								bdoErrorBox('失败', "审定报表数据推送失败");
							});
						}else{
							bdoInfoBox('提示', '非项目负责人无权限推送审定报表数据至客户门户！');
						}
					}
				}
			});
		});
	});
	//初始化，4个表格
	var initFourTable = function (index) {
		$.ajax({
			url: 'dgCenter/FUnAuditReport.auditReport.json',
			type: 'post',
			data: {
				start: -1,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param4': '2',
				// 'param5': index
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					var text = data.resultInfo.statusText;
					var data = data.data[0];
					if (text) {
						bdoInfoBox('提示', text);
					}
					// 资产负债表 为 年初年末
					var zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnZC();
					//其他表 为 上年数 本年数
					var lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumn();
					/*var xj = $.extend(true, {}, rpt_view);
					xj.tableParam = createColumnXJ(projectYear, projectYear, index);*/
					// var xj = $.extend(true, {}, qyTable);
					// var qy = $.extend(true, {}, qyTable);
					// var lqy = $.extend(true, {}, qyTable);

					zc.localParam.data = data.zc;
					lr.localParam.data = data.lr;
					//现金流量表去掉上年数
					// let  columnDefs = xj.tableParam.columnDefs;
					// xj.tableParam.columnDefs = columnDefs.splice(0,columnDefs.length - 1);
					// xj.localParam.data = data.xj;
					// qy.localParam.data = data.qy;
					// lqy.localParam.data = data.lqy;

					BdoDataTable('zc_report' + index + '_table', zc);
					BdoDataTable('lr_report' + index + '_table', lr);
					// BdoDataTable('xj_report' + index + '_table', xj);
					// BdoDataTable('qy_report' + index + '_table', qy);
					// BdoDataTable('lqy_report' + index + '_table', lqy);
					// BdoDataTable('rpt_tbcheck', Tbcheck);
					BdoDataTable('rpt_tbcheck', Tbcheck);
					return;
				}
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		});
	};


	(function () {
		let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
		$('#auditedStateIndex').text('【' + node.extraOptions.indexId + '】');
		initFourTable('1');
		OneUI.initHelper('slimscroll');
	})();

/*	$('#qy_report1, #lqy_report1').on('dblclick', 'tbody tr.edit-able td.bg-success-light', function () {
		let td = $(this);
		let key = td.parent().index();
		let $table = td.closest('table');

		let tableId = $table.attr("id");
		let th = $table.DataTable().context[0].aoColumns[$(this).index() + 1];
		let data = $table.DataTable().row($(this).closest('tr')).data();
		let oldVal = data[th.name];
		let showType = '1';
		if (tableId == 'lqy_report1_table') {
			showType = '2';
		}
		if (th.name.indexOf('column12') >= 0) {
			return;
		}
		td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
		let input = $(this).find('input');
		if (oldVal != 0) {
			input.val(oldVal);
		}
		input.focus();
		input.on('keydown', function (e) {
			if (e.keyCode == 13) {
				//console.log(e);
				input.blur();
			}
		});
		input.on('blur', function () {
			let newVal = $(this).val().toString().replace(/,/g, '');
			if (newVal == '') {
				td.html(0);
			} else if (isNaN(newVal)) {
				td.html(oldVal);
			} else {
				let num = newVal * 1;
				td.html(num.toFixed(2));
			}
			data[th.name] = td.html();
			let sum = 0;
			for (let i in data) {
				if (i.indexOf('column') >= 0 && i != 'column12') {
					sum += (data[i] * 1);
				}
			}
			td.nextAll().last().html(sum.toFixed(2));
			let tmpData = {'colCode': data.colCode};
			if (data.autoId in customerAmoutMap.qy[showType]) {
				tmpData = customerAmoutMap.qy[showType][data.autoId];
			}
			tmpData[th.name] = data[th.name];
			tmpData['column12'] = sum;
			customerAmoutMap.qy[showType][data.autoId] = tmpData;
		});
	});*/


/*
	$('#xj_report1').on('dblclick', 'tbody tr.edit-able td.bg-success-light', function () {
		let colType = '';
		if ($(this).hasClass('bg-success-light')) {
			colType = 1;
		}else{
			return;
		}
		var td = $(this).closest('td');
		// var key = td.parent().index();
		var $table = td.closest('table');
		if ($table.attr('id').indexOf('qy_report') >= 0) return;
		// var trL = $table.find('tr').length;
		var th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		var data = $table.DataTable().row($(this).closest('tr')).data();
		if (colType == 3 || colType == 1) {
			/!** 双击客户报表数字列可编辑 *!/
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
				input.on('keydown', function (e) {
					if (e.keyCode == 13) {
						input.blur();
					}
				});
				input.on('blur', function () {
					let newVal = $(this).val().toString().replace(/,/g, '');
					if (newVal == '') {
						td.html(0);
					} else if (isNaN(newVal)) {
						td.html(oldVal);
					} else {
						var num = newVal * 1;
						td.html(num.toFixed(2));
					}
					if (td.html() != data[th.name]) {
						let saveName = "unAuditAmount";
						if (th.name == 'auditedRemain'){
							saveName = 'remain';
						}
						data[th.name] = td.html();
						var tmpData = {};
						if (data.colCode in customerAmoutMap) {
							tmpData = customerAmoutMap[data.colCode];
						}
						tmpData[saveName] = data[th.name];//'colCode':data.colCode,
						customerAmoutMap[data.colCode] = tmpData;
					}
				});
			}
	});
*/
	// 打开所有者权益变动表底稿
	$('button[name="openXJQYFile"]').click(function () {
		var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
		var fileIndexId = 'P005-AU001';
		var subjectTreeId = node.extraOptions.autoId;
		var fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
		bdoInProcessingBox('加载中...');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgAuditFile.auditReportFile.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: fileIndexId,
				param4: fileName,
				param5: subjectTreeId,
				param6: thisPageConfig.TABLE_DIV
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					// 打开底稿
					var nodeData = {
						extraOptions: data.data[0].data[0],
						currentNode: {
							extraOptions: data.data[0].data[0]
						}
					};
					nodeData.autoId = nodeData.extraOptions.autoId;
					nodeData.workpaperId = nodeData.extraOptions.workpaperId;
					nodeData.extraOptions.tableDiv = thisPageConfig.TABLE_DIV;
					nodeData.menuId = window.sys_menuId;
					$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
					loadData();
					// $('#' + thisPageConfig.id).DataTable().ajax.reload();
					bdoSuccessBox('加载完成');
					window.open('/Faith/dgcenter.do?m=openQYXJFile&customerId=' + window.CUR_CUSTOMERID + '&projectId=' + window.CUR_PROJECTID + '&fileType=' + 2);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
	
	// 检查生成报表数据
	function genAuditedReportData(tableDiv){
		return new Promise((resolve, reject) => {
			// 生成数据
			var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			var fileIndexId = 'P005-AU001';
			var subjectTreeId = node.extraOptions.autoId;
			var fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				bdolxLoader: false,		// 禁用旋转等待
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00227',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: fileIndexId,
					param4: fileName,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							resolve();  // 已生成
						}else{
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgAuditFile.auditReportFile.json',
								bdolxLoader: false,		// 禁用旋转等待
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: fileIndexId,
									param4: fileName,
									param5: subjectTreeId,
									param6: tableDiv
								},
								dataType: 'json',
								success(data) {
									data.success ? resolve() : reject();
								},
								error(){
									reject();
								}
							});
						}
					}else{
						reject();
					}
				},
				error(){
					reject();
				}
			});
		});
	}

	// 导出报表
	function  exportReport(){
		let myParams = [{
			page: '',
			start: '',
			limit: '',
			queryUrl: 'dgCenter/FUnAuditReport.auditReport.json',
			menuId: window.sys_menuId,
			param4: '2',
			param5: '1'
		}, {
			page: '',
			start: '',
			limit: '',
			queryUrl: 'dgCenter/FUnAuditReport.tbListCheck.json',
			menuId: window.sys_menuId,
			param3: ''
		}];
		let param = {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			menuId: window.sys_menuId, param1: JSON.stringify(myParams), param2: '审定报表'
		};
		$.ajax({
			url: 'dgCenter/ExportOtherDg.exportAuditReport.json',
			bdolxLoader: false,		// 禁用旋转等待
			data: param,
			type: 'post',
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoInfoBox('导出成功', '审定报表导出成功！', 2000);
					if (data.data && data.data.length > 0) {
						let dataString = data.data[0].fileData;
						let fileName = data.data[0].fileName;
						let isNew = data.data[0].isNew;
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
							levels: 2,
							callback(tree) {
								$.each(tree.findNodes(), (index, tnode) => {
									if (tnode.extraOptions.nodeType == 'OPINIONS' || tnode.extraOptions.nodeType == 'AUDITED') {
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

	// 审定报表导出
	$('#audit_report_export').click(function() {
		bdoInProcessingBox('导出中');
		Promise.all([genAuditedReportData(5)])
			.then(()=>{
				exportReport();
			}).catch(()=>{
			bdoErrorBox('失败', "审定报表数据生成失败");
		});
	});

	$('#lr_report1_table').on('dblclick', 'tbody tr.edit-able td', function () {

		if (!$(this).hasClass('bg-success-light')) {
			return;
		}
		var td = $(this).closest('td');
		var $table = td.closest('table');
		if ($table.attr('id').indexOf('qy_report') >= 0) return;
		var th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		var data = $table.DataTable().row($(this).closest('tr')).data();
		let name = th.name == 'auditedRemain' ? 'remain' : 'unAuditAmount';
		/*		if (th.name.indexOf('auditedAmount') >= 0 || th.name.indexOf('auditedRemain') >= 0 ||
                    th.name.indexOf('adjustedAmount') >= 0 || th.name.indexOf('adjustedRemain') >= 0) {
                    return;
                }*/

		if (data['colDisp'].indexOf('合计') > 0 || data['colDisp'].indexOf('总计') > 0) {
			return;
		}
		let oldVal = td.text();
		td.html('<span><input type=\'text\' style=\'width:100%; align=right;\'></span>');
		var input = $(this).find('input');
		input.val(oldVal.replace(/,/g, ''));
		input.focus();
		input.on('keydown', function (e) {
			if (e.keyCode == 13) {
				//console.log(e);
				input.blur();
			}
		});
		input.on('blur', function () {
			let newVal = $(this).val().toString().replace(/,/g, '');
			if (isNaN(newVal)) {
				td.html(formatMoney2(oldVal));
			} else {
				var num = newVal * 1;
				td.html(formatMoney2(num));
			}
			if (td.html() != data[name]) {
				data[name] = td.html();
				var tmpData = {};
				if (data.colCode in customerAmoutMap) {
					tmpData = customerAmoutMap[data.colCode];
				}
				tmpData[name] = data[name].replace(/,/g, '');
				customerAmoutMap[data.colCode] = tmpData;
			}
		});
	});


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
				param5: 2,
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					customerAmoutMap = {'qy': {'1': {}, '2': {}}};
					initFourTable('1');
					bdoSuccessBox('保存成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('保存失败', data.resultInfo.statusText);
				}
			}
		});
	});



});