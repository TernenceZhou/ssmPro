//母公司单体项目 审定报表
MonomerReport = function (args) {
	var _template
		, _data
		//母公司单体项目信息
		, projectId
		, customerId
		, projectYear
		, mount
		, listener;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeReport.html');
	args.template = _template;
	_data = args.data;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);

	function getParentCompany(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			dataType: 'json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'HB00015',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			success: function(data) {
				if (data.success) {
					customerId = data.data[0].mergeCustomerId;
					projectId = data.data[0].mergeProjectId;
				}
			}
		});
		return 1;
	}
	let eventBind;
	!eventBind && (eventBind = getParentCompany());

	let cnt = 0;

	pageRightTitle(pageTitleArr);
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '1',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'1': '资产负债表', '3': '利润表', '4': '现金流量表', '5': '所有者权益变动表'}
	};

	uiBlocksApi(false, 'init');

	var rpt_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/HbMergeReport.auditReport.json',
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
	/**
	 * 检验项
	 */
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
			scrollY: false,
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: false,
			columnDefs: []
		}
	};
	/**
	 * 所有者权益变动表
	 */
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

	var customerAmoutMap = {'qy': {'1': {}, '2': {}}};

	function createXJCol(cols) {
		let tplName = [];
		if (cols.columnDesc1 != null) {
			tplName.push(cols.columnDesc1);
		}
		if (cols.columnDesc2 != null) {
			tplName.push(cols.columnDesc2);
		}
		// 删除增加项
		let qy = $.extend(true, {}, qyTable);
		qy.tableParam.columnDefs = qy.tableParam.columnDefs.splice(0, 4);
		qy.tableParam.columnDefs.push({
			targets: 4,
			orderable: false,
			className: 'text-right width-je',
			title: tplName[0],
			name: 'auditedAmount',
			data: 'auditedAmount',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});
		qy.tableParam.columnDefs.push({
			targets: 5,
			orderable: false,
			className: 'text-right width-je',
			title: tplName[1],
			name: 'auditedRemain',
			data: 'auditedRemain',
			render: function (data, type, row, meta) {
				return formatMoney(data);
			}
		});
		return qy;
	}


	function createQyCol(cols) {
		let tplName = [];
		if (cols.columnDesc1 != null) {
			tplName.push(cols.columnDesc1);
		}
		if (cols.columnDesc2 != null) {
			tplName.push(cols.columnDesc2);
		}
		if (cols.columnDesc3 != null) {
			tplName.push(cols.columnDesc3);
		}
		if (cols.columnDesc4 != null) {
			tplName.push(cols.columnDesc4);
		}
		if (cols.columnDesc5 != null) {
			tplName.push(cols.columnDesc5);
		}
		if (cols.columnDesc6 != null) {
			tplName.push(cols.columnDesc6);
		}
		if (cols.columnDesc7 != null) {
			tplName.push(cols.columnDesc7);
		}
		if (cols.columnDesc8 != null) {
			tplName.push(cols.columnDesc8);
		}
		if (cols.columnDesc9 != null) {
			tplName.push(cols.columnDesc9);
		}
		if (cols.columnDesc10 != null) {
			tplName.push(cols.columnDesc10);
		}
		if (cols.columnDesc11 != null) {
			tplName.push(cols.columnDesc11);
		}
		if (cols.columnDesc12 != null) {
			tplName.push(cols.columnDesc12);
		}
		if (cols.columnDesc13 != null) {
			tplName.push(cols.columnDesc13);
		}
		if (cols.columnDesc14 != null) {
			tplName.push(cols.columnDesc14);
		}
		if (cols.columnDesc15 != null) {
			tplName.push(cols.columnDesc15);
		}
		// 删除增加项
		let qy = $.extend(true, {}, qyTable);
		qy.tableParam.columnDefs = qy.tableParam.columnDefs.splice(0, 4);
		for (var i = 0, len = tplName.length; i < len; i++) {
			qy.tableParam.columnDefs.push({
				targets: i + 4,
				orderable: false,
				className: 'text-right width-je',
				title: tplName[i],
				name: 'column' + (i + 1),
				data: 'column' + (i + 1),
				render: function (data, type, row, meta) {
					return formatMoney(data);
				}
			});
		}
		return qy;
	}


	/** 加载数据 */
	function loadData() {
/*		if (
			thisPageConfig.TABLE_DIV == '4' ||
			thisPageConfig.TABLE_DIV == '5' ||
			thisPageConfig.TABLE_DIV == '6') {
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: true,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00225',
					param1: customerId,
					param2: projectId,
					param3: projectYear,
					param4: thisPageConfig.TABLE_DIV,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						if (data.data[0] != null) {
							var tplName = [];
							if (data.data[0].columnDesc1 != null) {
								tplName.push(data.data[0].columnDesc1);
							}
							if (data.data[0].columnDesc2 != null) {
								tplName.push(data.data[0].columnDesc2);
							}
							if (data.data[0].columnDesc3 != null) {
								tplName.push(data.data[0].columnDesc3);
							}
							if (data.data[0].columnDesc4 != null) {
								tplName.push(data.data[0].columnDesc4);
							}
							if (data.data[0].columnDesc5 != null) {
								tplName.push(data.data[0].columnDesc5);
							}
							if (data.data[0].columnDesc6 != null) {
								tplName.push(data.data[0].columnDesc6);
							}
							if (data.data[0].columnDesc7 != null) {
								tplName.push(data.data[0].columnDesc7);
							}
							if (data.data[0].columnDesc8 != null) {
								tplName.push(data.data[0].columnDesc8);
							}
							if (data.data[0].columnDesc9 != null) {
								tplName.push(data.data[0].columnDesc9);
							}
							if (data.data[0].columnDesc10 != null) {
								tplName.push(data.data[0].columnDesc10);
							}

							if (data.data[0].columnDesc11 != null) {
								tplName.push(data.data[0].columnDesc11);
							}
							if (data.data[0].columnDesc12 != null) {
								tplName.push(data.data[0].columnDesc12);
							}
							if (data.data[0].columnDesc13 != null) {
								tplName.push(data.data[0].columnDesc13);
							}
							if (data.data[0].columnDesc14 != null) {
								tplName.push(data.data[0].columnDesc14);
							}
							if (data.data[0].columnDesc15 != null) {
								tplName.push(data.data[0].columnDesc15);
							}
							// 删除增加项
							qyTable.tableParam.columnDefs = qyTable.tableParam.columnDefs.splice(0, 4);
							for (var i = 0, len = tplName.length; i < len; i++) {
								qyTable.tableParam.columnDefs.push({
									targets: i + 4,
									orderable: false,
									className: 'text-right width-je',
									title: tplName[i],
									name: 'column' + (i + 1),
									data: 'column' + (i + 1),
									render: function (data, type, row, meta) {
										if (data == null){
											return '';
										}
										return formatMoney(data);
									}
								});
							}
						}
					}
				}
			});
// 			var qy = $.extend(true, {}, qyTable);
// 			qy.localParam.url = 'dgCenter/DgGeneral.query.json';
// 			qy.localParam.urlparam.sqlId = 'DG00226';
// 			qy.localParam.urlparam.param1 = customerId;
// 			qy.localParam.urlparam.param2 = projectId;
// 			qy.localParam.urlparam.param3 = projectYear;
// 			qy.localParam.urlparam.param4 = thisPageConfig.TABLE_DIV;
// 			BdoDataTable(thisPageConfig.id, qy);

		}else {
		}*/
		initFourTable(1);
	}

	/** 生成显示列 */
	function createColumn(projectYear) {
		return {
			select: true,
			lengthChange: true,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: true,
			ordering: false,
			createdRow(row, data, dataIndex) {
				if (data.flag) {
					$(row).addClass('edit-able');
					$(row).find('td:eq(3)').addClass('bg-success-light');
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
				}/*, {
					targets: ++cnt,
					orderable: true,
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					className: 'text-left width-calfun'
				}*/
			]
		};
	}

	/** 生成资产负债表显示列 */
	function createColumnZC(projectYear) {
		return {
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
				}/*, {
					targets: ++cnt,
					orderable: true,
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					className: 'text-left width-calfun'
				}*/
			]
		};
	}

	function createColumnCheck(projectYear) {
		let tbColumns = {
			scrollY: false,
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-12"tr>>',
			serverSide: false,
			/*fixedThead: true,*/
			columnDefs: [
				{
					targets: 1,
					className: 'text-left',
					title: '校验项',
					orderable: false,
					name: 'colDisp',
					data: 'colDisp',
					width: '550px',
					/*render: function(data, type, row, meta){
							return '<font size=10>' + data + '</font>';
						}*/
				}
			]
		};

		let colNum = 1;
		/*		tbColumns.columnDefs.push({
                    targets: ++colNum,
                    orderable: false,
                    className: 'text-left font-s12 width-jyx',
                    title: '校验项',
                    name: 'colDisp',
                    data: 'colDisp',
                    width: '442px',
                    /!*width: '370px',
                            render: function(data, type, row, meta){
                                return '<font size=10>' + data + '</font>';
                            }*!/
                });*/
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right ',
			title: projectYear + '年<br>未审数',
			name: 'unAuditAmount' + projectYear,
			data: 'unAuditAmount' + projectYear,
			width: '100px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right ',
			title: projectYear + '年<br>审计调整数',
			name: 'adjustAmount' + projectYear,
			data: 'adjustAmount' + projectYear,
			width: '150px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right ',
			title: projectYear + '年<br>审定数',
			name: 'auditAmount' + projectYear,
			data: 'auditAmount' + projectYear,
			width: '100px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right ',
			title: (projectYear - 1) + '年<br>未审数',
			name: 'unAuditAmount' + (projectYear - 1),
			data: 'unAuditAmount' + (projectYear - 1),
			width: '100px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
			targets: ++colNum,
			orderable: false,
			className: 'text-right ',
			title: (projectYear - 1) + '年<br>审计调整数',
			name: 'adjustAmount' + (projectYear - 1),
			data: 'adjustAmount' + (projectYear - 1),
			width: '150px',
			render: function (data, type, row, meta) {
				if (data == 0) {
					return '<div width="100%" style="text-align: center">平<div>';
				} else if (data != null) {
					return formatMoney(data);
				}
			}
		});
		tbColumns.columnDefs.push({
				targets: ++colNum,
				orderable: false,
				className: 'text-right ',
				title: (projectYear - 1) + '年<br>审定数',
				name: 'auditAmount' + (projectYear - 1),
				data: 'auditAmount' + (projectYear - 1),
				width: '100px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			}
		);
		return tbColumns;

	}
	//初始化，4个表格
	var initFourTable = function (index) {
		$.ajax({
			url: 'dgCenter/HbMergeReport.auditReport.json',
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
					// customerId = result.customerId;
					projectYear = result.projectYear;
					projectId = result.projectId;

					// 资产负债表 为 年初年末
					let zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnZC(projectYear);
					//其他表 为 上年数 本年数
					let lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumn(projectYear);

					let xj = $.extend(true, {}, qyTable);
					let qy = $.extend(true, {}, qyTable);
					let lqy = $.extend(true, {}, qyTable);

					zc.localParam.data = result.zc;
					lr.localParam.data = result.lr;
					// xj.localParam.data = result.xj;
					// qy.localParam.data = result.qy;
					// lqy.localParam.data = result.lqy;

					BdoDataTable('zc_report' + index + '_table', zc);
					BdoDataTable('lr_report' + index + '_table', lr);
					// BdoDataTable('xj_report' + index + '_table', xj);
					// BdoDataTable('qy_report' + index + '_table', qy);
					// BdoDataTable('lqy_report' + index + '_table', lqy);
					if(Object.keys(result.tqy).length > 2){
						qy = createQyCol(result.tqy);
						qy.localParam.data = result.qy;
						BdoDataTable('qy_report' + index + '_table', qy);
						lqy = createQyCol(result.tqy);
						lqy.localParam.data = result.lqy;
						BdoDataTable('lqy_report' + index + '_table', lqy);
					}
					if(Object.keys(result.txj).length > 2){
						xj = createXJCol(result.txj);
						xj.localParam.data = result.xj;
						BdoDataTable('xj_report' + index + '_table', xj);
					}
					//校验项
					let checkData = $.extend(true, {}, Tbcheck);
					checkData.tableParam = createColumnCheck(projectYear);
					checkData.localParam.data = result.checkList;
					BdoDataTable('rpt_tbcheck', checkData);
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

	// 检查生成报表数据
	function genAuditedReportData(tableDiv) {
		return new Promise((resolve, reject) => {
			// 生成数据
			var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			var fileIndexId = node.extraOptions.indexId;
			var subjectTreeId = node.extraOptions.autoId;
			var fileName;
			if (tableDiv == 4) {
				fileName = fileIndexId + '-审定报表-现金流量表.xlsx';
			} else if (tableDiv == 5 || tableDiv == 6) {
				fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				bdolxLoader: false,		// 禁用旋转等待
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00227',
					param1: customerId,
					param2: projectId,
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
						} else {
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgAuditFile.auditReportFile.json',
								bdolxLoader: false,		// 禁用旋转等待
								data: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
									param1: customerId,
									param2: projectId,
									param3: fileIndexId,
									param4: fileName,
									param5: subjectTreeId,
									param6: tableDiv
								},
								dataType: 'json',
								success(data) {
									data.success ? resolve() : reject();
								},
								error() {
									reject();
								}
							});
						}
					} else {
						reject();
					}
				},
				error() {
					reject();
				}
			});
		});
	}


	function hideButton() {
		//核对完成
		$('#rpt_check_Report').parent().hide();
		//导出
		$('#audit_report_export').parent().hide();

		//现金流量表
		$("#xj_report1 > button").hide();

		//所有者权益变动表 本年
		$('#qy_report1 > button').hide();

		//所有者权益变动表 上年
		$('#lqy_report1 > button').hide();

		//更改单体的tab名称
		$('#report1_type > li:nth-child(1) > a > i').text(" 资 ");
		$('#report1_type > li:nth-child(2) > a > i').text(" 利 ");
		$('#report1_type > li:nth-child(3) > a > i').text(" 现 ");
		$('#report1_type > li:nth-child(4) > a > i').text(" 所(本年) ");
		$('#report1_type > li:nth-child(5) > a > i').text(" 所(上年) ");
		$('#audited_title_name').text("审定报表");
		$('#tab1 > a').text("审定报表");
		$('#headtitle').text(" 审定报表 ");
		$('#rpt_createReport').hide();


	}


	listener = () => {
		//页面刷新按钮
		$('#rpt_search').click(e => {
			// e.preventDefault();
			// $('#rpt_search').blur();
			loadData()
		});

		//=========================报表点击事件
		$('#subPageRight [data-toggle="tabs"]').on('click', 'a', function (e) {
			e.preventDefault();
			if ($(this).closest('ul').attr('id') == 'tab_unAuditReport' && $(this).parent().index() > 1) {
				$('#tab_head_rpt').hide();
			} else {
				$('#tab_head_rpt').show();
			}
			$(this).tab('show');
		});
/*
		$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
			//$(this).resize();
			var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
			thisPageConfig.showType = upperNode.attr('data-content');
			var tempId = upperNode.attr('data-result');
			var lowerNode = $('#' + tempId).find('li[class=active] a');
			thisPageConfig.id = lowerNode.attr('data-result');
			thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
			switch (thisPageConfig.TABLE_DIV) {
				case "10":
					thisPageConfig.TABLE_DIV = '4';
					break;
				case "11":
					thisPageConfig.TABLE_DIV = '5';
					break;
				case "12":
					thisPageConfig.TABLE_DIV = '6';
					break;
			}
			loadData();
/!*			if (thisPageConfig.TABLE_DIV == '11'
				|| thisPageConfig.TABLE_DIV == '12'
				|| thisPageConfig.TABLE_DIV == '10') {
				// var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
				let node = _data;
				var fileIndexId = node.extraOptions.indexId;
				var subjectTreeId = node.extraOptions.autoId;
				var fileName;
				if (thisPageConfig.TABLE_DIV == '10') {
					fileName = fileIndexId + '-审定报表-现金流量表.xlsx';
				} else if (thisPageConfig.TABLE_DIV == '11' || thisPageConfig.TABLE_DIV == '12') {
					fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
				}
/!*
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00227',
						param1: customerId,
						param2: projectId,
						param3: fileIndexId,
						param4: fileName,
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
						} else {
							bdoInfoBox("提示!", "未查询到审定报表数据!");
						}
					}
				});*!/
			}*!/
			// loadData();
		});
*/
		//==========================

		//所有者权益变动表双击可编辑
/*
		$('#qy_report1, #lqy_report1').on('dblclick', 'tbody tr.edit-able td.bg-success-light', function () {
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
		});
*/

		//现金流量表双击可编辑
/*
		$('#xj_report1').on('dblclick', 'tbody tr.edit-able td.bg-success-light', function () {
			let colType = '';
			if ($(this).hasClass('bg-success-light')) {
				colType = 1;
			} else {
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
						if (th.name == 'auditedRemain') {
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

/*		//打开现金流量表、所有者权益变动表文件
		$('button[name="openXJQYFile"]').click(function () {
			var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			var fileIndexId = node.extraOptions.indexId;
			var subjectTreeId = node.extraOptions.autoId;
			var fileName;
			if (thisPageConfig.TABLE_DIV == '4') {
				fileName = fileIndexId + '-审定报表-现金流量表.xlsx';
			} else if (thisPageConfig.TABLE_DIV == '5' || thisPageConfig.TABLE_DIV == '6') {
				fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
			}
			bdoInProcessingBox('加载中...');
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgAuditFile.auditReportFile.json',
				data: {
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

		// 审定报表导出
		$('#audit_report_export').click(function () {
			bdoInProcessingBox('导出中');
			Promise.all([genAuditedReportData(4), genAuditedReportData(5)])
				.then(() => {
					exportReport();
				}).catch(() => {
				bdoErrorBox('失败', "审定报表数据生成失败");
			});
		});*/

	};
	mount = () => {
		//隐藏按钮
		hideButton();

		listener();


	};
	mount()
};

