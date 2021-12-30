function MonomerUnAuditReport(args) {
	var _template
		, _data
		, mount
		, cnt
		, uploadAttachCfg
		, uploadAttachForm
		, listener
		, dgAttachTable;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeUnAuditReport.html');
	args.template = _template;
	_data = args.data;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	pageRightTitle(pageTitleArr);
	var table = 'rpt_tab';


	//存储
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '1',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'1': '资产负债表', '3': '利润表', '4': '现金流量表', '5': '所有者权益变动表'}
	};

	uiBlocksApi(false, 'init');

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
			url: 'dgCenter/HbMergeReport.unAuditReport.json',
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
	//校验表格
	var Tbcheck = {
		localParam: {
			tabNum: false,
			// url: 'dgCenter/FUnAuditReport.tbListCheck.json',
			url: 'dgCenter/FUnAuditReport.unAuditReport.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId,
				refreshFlg: '1'
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-left font-s12 width-jyx',
				title: '校验项',
				name: 'colDisp',
				data: 'colDisp',
				/*width: '370px',
						render: function(data, type, row, meta){
							return '<font size=10>' + data + '</font>';
						}*/
			}, {
				targets: 2,
				orderable: false,
				className: 'text-right width-je',
				title: projectYear + '年<br>未审数',
				name: 'unAuditAmount' + projectYear,
				data: 'unAuditAmount' + projectYear,
				//width: '100px',
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
				className: 'text-right width-je',
				title: projectYear + '年<br>审计调整数',
				name: 'adjustAmount' + projectYear,
				data: 'adjustAmount' + projectYear,
				//width: '150px',
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
				className: 'text-right width-je',
				title: projectYear + '年<br>审定数',
				name: 'auditAmount' + projectYear,
				data: 'auditAmount' + projectYear,
				//width: '100px',
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
				className: 'text-right width-je',
				title: (projectYear - 1) + '年<br>未审数',
				name: 'unAuditAmount' + (projectYear - 1),
				data: 'unAuditAmount' + (projectYear - 1),
				//width: '100px',
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
				className: 'text-right width-je',
				title: (projectYear - 1) + '年<br>审计调整数',
				name: 'adjustAmount' + (projectYear - 1),
				data: 'adjustAmount' + (projectYear - 1),
				//width: '150px',
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
				className: 'text-right width-je',
				title: (projectYear - 1) + '年<br>审定数',
				name: 'auditAmount' + (projectYear - 1),
				data: 'auditAmount' + (projectYear - 1),
				//width: '100px',
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
				// $(row).addClass('edit-able');
				// $(row).find('td:eq(6)').addClass('bg-success-light');
				// if (data.flag) {
				//
				// 	$(row).find('td:eq(3)').addClass('bg-success-light');
				// 	$(row).find('td:eq(4)').addClass('bg-gray-light');
				//
				// }
			},
			columnDefs: [
				{
					targets: 0,
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
					//width: '30px',
					render: function (data, type, row, meta) {

						return data.replace(/ /g, '&nbsp;');

					}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-lef width-subject-name',
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
					var html = formatMoney(data);
					if (row.colType == '1') {
						if (data && data != '0') {
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
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
				// if (data.colDisp.indexOf('合计') < 0 || data.colDisp.indexOf('总计') < 0) {
				// 	$(row).addClass('edit-able');
				// 	$(row).find('td:eq(6)').addClass('bg-success-light');
				// }
			},
			columnDefs: [
				{
					targets: 0,
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
					//width: '30px',
					render: function (data, type, row, meta) {
						return data.replace(/ /g, '&nbsp;');

					}
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
		};
		var colNum = 3;
		for (var i = startYear; i <= endYear; i++) {
			tbColumns.columnDefs.push({
				targets: colNum + 1,
				orderable: false,
				className: 'text-right width-je',
//			 i + '年<br>' +
// 				title: flag == '2' ? '期初数' : '期末数',
				title: flag == '2' ? (i - 1) + '年<br>期末数' : i + '年<br>期末数',
				name: flag == '2' ? 'remain' + i : 'unAuditAmount' + i,
				data: flag == '2' ? 'remain' + i : 'unAuditAmount' + i,
				//width: '60px',
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
					var html = formatMoney(data);
					if (row.colType == '1') {
						if (data && data != '0') {
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
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
				render: function (data, type, row, meta) {
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


	//初始化，4个表格
	var initFourTable = function (index) {
		$.ajax({
			url: 'dgCenter/HbMergeReport.unAuditReport.json',
			type: 'post',
			data: {
				start: -1,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param4': '2',
				'param5': index
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					let text = data.resultInfo.statusText;
					let result = data.data[0];
					if (text) {
						bdoInfoBox('提示', text);
					}
					// 资产负债表 为 年初年末
					let zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnZC(projectYear, projectYear, index);
					//其他表 为 上年数 本年数
					let lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumn(projectYear, projectYear, index);
					zc.localParam.data = result.zc;
					lr.localParam.data = result.lr;
					BdoDataTable('zc_report' + index + '_table', zc);
					BdoDataTable('lr_report' + index + '_table', lr);
					let check = $.extend(true, {}, Tbcheck);
					check.localParam.data = result.checkList;
					BdoDataTable('rpt_tbcheck', check);
				}else {
					bdoInfoBox('提示', data.resultInfo.statusText);
				}
			}
		});
	};


	//初始化期末表格
	(function () {
		initFourTable('1');
	})();


// （本年-上年）表格列
	function createColumnAbs(i) {
		return {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				// if (data.colDisp.indexOf('合计') < 0 || data.colDisp.indexOf('总计') < 0) {
				// 	$(row).addClass('edit-able');
				// 	// $(row).find('td:eq(6)').addClass('bg-gray-lighter');
				// }
			},
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '序号',
					width: '30px',
					visible: true,
					render: function (data, type, row, meta) {
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
					render: function (data, type, row, meta) {
						return data.replace(/ /g, '&nbsp;');
					}
				}, {
					targets: 3,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'colDisp',
					data: 'colDisp',
					width: '150px',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
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
					render: function (data, type, row, meta) {
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
					render: function (data, type, row, meta) {
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
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}

			]
		};
	}


	Promise.resolve().then(() => {
		OneUI.initHelper('slimscroll');
	});


	//隐藏按钮方法
	function hideOtherButton() {
		//核对完成
		$('#rpt_check_Report').parent().hide();
		//生成未审报表
		$('#rpt_createReport').parent().hide();
		//保存客户报表数字
		$('#rpt_save').parent().hide();
		//导入客户报表数字
		$('#rpt_importCustomerReport').parent().hide();
		//导出未审报表
		$('#rpt_export').parent().hide();
		//报表编制人
		$('#report_editer').parent().parent().hide();
		//是否显示0
		$('#rpt_showZero').parent().hide();
		//调整分录
		$('#rpt_adjustReport').parent().hide();
		//资产负债表
		$('#report1_type > li:nth-child(1) > a > i').text('资产负债表');
		$('#report2_type > li:nth-child(1) > a > i').text('资产负债表');
		//利润表
		$('#report1_type > li:nth-child(2) > a > i').text('利润表');
		$('#report2_type > li:nth-child(2) > a > i').text('利润表');

		$('#tab3 > a').text("未审报表-期初/上期");
		$('#tab1 > a').text("未审报表-期末/本期");

		// let text = $('#unReportIndex').text();
		$('#unReportName').text('未审报表');
		// $('#tab_head_rpt > div.block-header.bg-primary > div > h3').text("未审报表"+text);


	}

	//事件绑定
	listener = () => {
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
					} else {
						bdoErrorBox(data.resultInfo.statusText);
					}
				}
			});


		});

		//初始化表格 本期-上期
		$('#abs-remain').click(function () {
			//所有者权益变动表暂时隐藏
			$('#tab2_unAuditReportser').addClass('active');
			$($('#report1_type li')[3]).hide();
			$($('#report2_type li')[3]).hide();
			$('#tab_head_rpt').hide();
			$.ajax({
				url: 'dgCenter/HbMergeReport.unAuditReport.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					start: -1,
					'menuId': window.sys_menuId,
					'param4': '2',
					'param5': 1
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
						//两个都要刷新
						BdoDataTable('zc_report2_table', zc);
						BdoDataTable('lr_report2_table', lr);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});


		});

		//初始化期初表格
		$('#tab3').on('click', 'a', function () {
			$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_BEGINNING + '】');
			$($('#report2_type li')[3]).show();
			$('#tab_head_rpt').show();
			initFourTable('2');
		});

		$('#tab1').on('click', 'a', function () {
			$('#unReportIndex').text('【' + node.extraOptions.indexId.substring(0, node.extraOptions.indexId.indexOf('-')) + '-' + DG_CONST_UNAUDITREPORT_ENDING + '】');
			$($('#report1_type li')[3]).show();
			$('#tab_head_rpt').show();
			initFourTable('1');
		});

		/** 刷新按钮 */
		$('#rpt_search').click(function () {
			$('#rpt_search').blur();
			initFourTable(thisPageConfig.showType);
		});

		$('#subPageRight  [data-toggle="tabs"]').on('click', 'a', function (e) {
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
		$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
			//$(this).resize();
			var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
			thisPageConfig.showType = upperNode.attr('data-content');
			window.showType = thisPageConfig.showType;
			var tempId = upperNode.attr('data-result');
			var lowerNode = $('#' + tempId).find('li[class=active] a');
			thisPageConfig.id = lowerNode.attr('data-result');
			thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
		});
	};

	mount = () => {
		hideOtherButton();
		listener();

	};

	mount();
}






