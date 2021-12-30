MergeReport = function (args) {
	var _template
		, _data
		, mount
		, listener;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeReport.html');
	args.template = _template;
	_data = args.data;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);


	let cnt = 0;
	var projectYear = window.CUR_PROJECT_ACC_YEAR;

	pageRightTitle(pageTitleArr);
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '1',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'1': '合并资产负债表', '3': '合并利润表', '10': '合并现金流量表', '5': '合并所有者权益变动表'}
	};

	uiBlocksApi(false, 'init');

	var rpt_view = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/HbMergeReport.auditedStatementQuery.json',
			urlparam: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
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
			select: true,
			lengthChange: true,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-12"tr>>',
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-left',
				title: '校验项',
				name: 'colDisp',
				data: 'colDisp',
				width: '370px',
				/*render: function(data, type, row, meta){
							return '<font size=10>' + data + '</font>';
						}*/
			},/* {
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
			},*/ {
				targets: 2,
				orderable: false,
				className: 'text-right',
				title: projectYear + '年<br>审定数',
				name: 'auditAmount',
				data: 'auditAmount',
				width: '100px',
				render: function (data, type, row, meta) {
					if (data == 0) {
						return '<div width="100%" style="text-align: center">平<div>';
					} else if (data != null) {
						return formatMoney(data);
					}
				}
			},/* {
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
			},*/ {
				targets: 3,
				orderable: false,
				className: 'text-right',
				title: (projectYear - 1) + '年<br>审定数',
				name: 'preAuditAmount' ,
				data: 'preAuditAmount' ,
				width: '100px',
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
		initFourTable('1')
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
					name: 'subjectId',
					data: 'subjectId',
					//width: '100px',
					render: function (data, type, row, meta) {
						return data;
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					//width: '100px',
					className: 'dg-ap width-subject-name',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				},/* {
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
				},*/ {
					targets: ++cnt,
					orderable: true,
					title: '审定数',
					name: 'auditAmount',
					data: 'auditAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上年数',
					name: 'preAuditAmount',
					data: 'preAuditAmount',
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
					name: 'subjectId',
					data: 'subjectId',
					//width: '100px',
					render: function (data, type, row, meta) {
						return data;

					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					//width: '100px',
					className: 'dg-ap width-subject-name',
					render: function (data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(/ /g, '&nbsp;');
						}
					}
				},/* {
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
				},*/ {
					targets: ++cnt,
					orderable: true,
					title: '审定数',
					name: 'auditAmount',
					data: 'auditAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '年初数',
					name: 'preAuditAmount',
					data: 'preAuditAmount',
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
		return tbColumns;
	}

	// 核对审定报表
	function checkReport() {
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

	//初始化，4个表格
	var initFourTable = function (index) {
		$.ajax({
			url: 'dgCenter/HbMergeReport.auditedStatementQuery.json',
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
					var zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnZC(projectYear, projectYear, index);
					//其他表 为 上年数 本年数
					let lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumn(projectYear, projectYear, index);
					/*var xj = $.extend(true, {}, rpt_view);
					xj.tableParam = createColumnXJ(projectYear, projectYear, index);*/
					let xj = $.extend(true, {}, rpt_view);
					let qy = $.extend(true, {}, qyTable);
					let lqy = $.extend(true, {}, qyTable);

					zc.localParam.data = result.zc;
					lr.localParam.data = result.lr;

					xj = createQyCol(result.txj[0]);
					xj.localParam.data = result.xj;
					if(result.tqy.length > 0){
						qy = createQyCol(result.tqy[0]);
						qy.localParam.data = result.qy;
						BdoDataTable('qy_report' + index + '_table', qy);
						lqy = createQyCol(result.tqy[0]);
						lqy.localParam.data = result.lqy;
						BdoDataTable('lqy_report' + index + '_table', lqy);
					}
					BdoDataTable('zc_report' + index + '_table', zc);
					BdoDataTable('lr_report' + index + '_table', lr);
					BdoDataTable('xj_report' + index + '_table', xj);
					// BdoDataTable('rpt_tbcheck', Tbcheck);
					let check = $.extend(true, {}, Tbcheck);
					check.localParam.data = result.checkList;
					BdoDataTable('rpt_tbcheck', check);
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
						} else {
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

	// 导出报表
	function exportReport() {
		let myParams = [{
			page: '',
			start: '',
			limit: '',
			queryUrl: 'dgCenter/HbMergeReport.auditedStatementQuery.json',
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
			menuId: window.sys_menuId,
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: JSON.stringify(myParams),
			param2: '审定报表'
		};
		$.ajax({
			url: 'dgCenter/ExportOtherDg.exportAuditReport.json',
			bdolxLoader: false,		// 禁用旋转等待
			data: param,
			type: 'post',
			dataType: 'json',
			success: function (data) {
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


	listener = () => {
		//页面刷新按钮
		$('#rpt_search').click(e => {
			e.preventDefault();
			$('#rpt_search').blur();
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
		$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
			//$(this).resize();
			var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
			thisPageConfig.showType = upperNode.attr('data-content');
			var tempId = upperNode.attr('data-result');
			var lowerNode = $('#' + tempId).find('li[class=active] a');
			thisPageConfig.id = lowerNode.attr('data-result');
			thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
			// loadData();
		});
		//==========================

		//核对完成
		$('#rpt_check_Report').on('click', function () {
			$('#rpt_check_Report').blur();
			bdoAjaxBox('系统提示', window.CUR_PROJECT_ACC_YEAR + '年审定报表确定完成核对吗？', function () {
				bdoInProcessingBox('核对中');
				Promise.all([genAuditedReportData(4), genAuditedReportData(5)])
					.then(() => {
						checkReport();
					}).catch(() => {
					bdoErrorBox('失败', "审定报表数据生成失败");
				});
			});
		});

		//所有者权益变动表双击可编辑
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

		//现金流量表双击可编辑
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
				/** 双击客户报表数字列可编辑 */
				if (data['colType'] != 1) {
					return;
				}
				if (data['subjectName'].indexOf('合计') > 0 || data['subjectName'].indexOf('总计') > 0) {
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
						if (data.subjectId in customerAmoutMap) {
							tmpData = customerAmoutMap[data.subjectId];
						}
						tmpData[saveName] = data[th.name];//'subjectId':data.subjectId,
						customerAmoutMap[data.subjectId] = tmpData;
					}
				});
			}
		});

		//打开现金流量表、所有者权益变动表文件
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
		});

/*
		$('#rpt_createReport').click(function() {
			$('#rpt_createReport').blur();
			bdoAjaxBox('系统提示', '确定要生成【' + CUR_CUSTOMERNAME + '】<br>' + projectYear + '年审定报表吗', function() {
				bdoInProcessingBox('生成中');
				let  node = _data;
				var fileIndexId = node.extraOptions.indexId;
				var subjectTreeId = node.extraOptions.autoId;
				let fileName = fileIndexId + '-审定报表-所有者权益变动表.xlsx';
				$.ajax({
					type: 'post',
					url: 'dgCenter/HbMergeReport.createReport.json',
					data: {
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: fileIndexId,
						param4: fileName,
						param5: subjectTreeId,
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('操作成功', data.resultInfo.statusText);
							initFourTable('1');
							// initFourTable('2');
							$('#rpt_search').click();//刷新未审报表校验
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				});
			});
		});

*/


	};
	mount = () => {
		listener();

	};
	mount()
};

