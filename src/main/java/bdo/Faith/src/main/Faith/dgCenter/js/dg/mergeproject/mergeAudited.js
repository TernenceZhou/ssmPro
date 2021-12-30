function MergeAudited(args) {
	let _template
		, _data
		, mount
		, listener
		, uploadDataForm;
	_data = args.data;
	_template = args.template || tplLoader('dgCenter/html/dg/mergeproject/mergeAudited.html');
	args.template = _template;
	$(args.region).html(_template);
	$('#headtitle').empty().text(args.data.text);
	$('#auditedStateIndex').text('【' + _data.extraOptions.indexId + '】');

	let mergeProjectId = _data.extraOptions.subjectId; // 被合并项目的项目编号

	cnt = 0;
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	let xjTable = {
		localParam: {
			data: []
		},
		tableParam: {
			scrollX: true,
			scrollCollapse: true,
			pageLength: 1000,
			select: true,
			lengthChange: false,
			serverSide: true,
			ordering: false,
			dom: '<"row"<"col-sm-12"tr>>',
			paging: false,
			fixedThead: true,
			fixedHeight: '480px',
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
					/*if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
						return '<b>' + data + '</b>';
					} else {
						return data.replace(/ /g, '&nbsp;');
					}*/
					return data;
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
	var thisPageConfig = {
		id: 'zc_report1_table',  	//当前表格id
		showType: '1',				//当前为期初/期末
		TABLE_DIV: '7',			//当前报表类型
		showZero: '2',				//当前显示方式
		rptName: {'7': '资产负债表', '9': '利润表', '10': '现金流量表', '11': '所有者权益变动表(本年)', '12': '所有者权益变动表(上年)'}
	};
	// 文件上传对话框配置
	const uploadDataFormCfg = {
		options: {
			propsData: {
				jsonData: {
					dataFile: [],
					customerId: '',
					projectId: ''
				}
			}
		},
		props: {
			jsonData: Object
		},
		display: 'tableform-one',
		column: 1,
		id: 'uploadDataForm',
		data() {
			return {
				ajaxConfig: {
					type: 'POST',
					url: 'dgCenter/DgMergeProject.uploadDataFile.json',
					dataType: 'json',
					success(data) {
						if (data.success) {
							// 上传成功后再次提交，进行导入处理
							fnImportDataFile(data.data[0]);
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				}
			};
		},
		methods: {
			onUploadDataFileBtn() {
				let file = $('#dataFile').fileinput('getFileStack');
				if (!file || file.length < 1) {
					bdoInfoBox('提示', '请先选择文件');
					return;
				}
				this.uploadFile(true);
			}
		},
		buttons: [{
			id: 'uploadDataFileBtn',
			icon: 'fa-floppy-o',
			style: 'btn-primary',
			text: '上传',
			typeAttr: {
				'v-on:click': 'onUploadDataFileBtn'
			}
		}, {
			id: 'cancelUploadBtn',
			icon: 'fa-arrow-left',
			style: 'btn-warning',
			text: '取消',
			typeAttr: {
				'data-dismiss': 'modal'
			}
		}],
		items: [{
			id: 'dataFile',
			type: 'file',
			label: '数据文件',
			rowspan: 1,
			colspan: 2,
			validate: {
				rules: {}
			},
			show: true,
			typeAttr: {
				multiple: false
			},
			plugin: {
				name: 'fileinput',
				options: {
					allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam', 'jpg', 'png', 'doc', 'docx', 'zip', 'rar', 'pdf'],
					uploadUrl: 'dgCenter/DgDownload.uploadTempFile.json',
					uploadExtraData() {
						return {};
					}
				}
			}
		}]
	};

	// 导入文件（文件上传成功后调用）
	function fnImportDataFile(uploadFileInfo) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeProjectAudited.importTbByDataFile.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': mergeProjectId,       // 被合并项目编号
				'param2': uploadFileInfo.path,  // 临时文件路径
				'param3': uploadFileInfo.name  // 临时文件名
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功');
					$('#uploadDataModal').modal('hide'); // 关闭上传文件对话框
					initFourTable('1');
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});

	}

	/**
	 * 事件绑定
	 */
	listener = () => {

		// 刷新
		$('#rpt_search').click(function() {
			initFourTable('1');
		});
		// 导入
		$('#audit_report_upload').click(function() {
			$('#uploadDataModal').modal('show'); // 显示上传文件对话框
		});
	};

	/**
	 * 挂载
	 */
	mount = () => {
		uploadDataForm = createForm(uploadDataFormCfg); // 初始化文件上传对话框
		listener();
		initFourTable('1');
	};
	//初始化，4个表格
	var initFourTable = function (index) {
		$.ajax({
			type: 'post',
			url: 'dgCenter/HbMergeProjectAudited.findXjTbData.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				'menuId': window.sys_menuId,
				'param1': window.CUR_PROJECTID,
				'param2': window.CUR_CUSTOMERID,
				'param3': mergeProjectId
			},
			dataType: 'json',
			success: function (data) {
					var data = data.data[0];
					// 资产负债表 为 年初年末
					var zc = $.extend(true, {}, rpt_view);
					zc.tableParam = createColumnZC(index);
					//其他表 为 上年数 本年数
					var lr = $.extend(true, {}, rpt_view);
					lr.tableParam = createColumn(index);
					var xj = $.extend(true, {}, rpt_view);
					xj.tableParam = createColumnXJ(index);
					var qy = $.extend(true, {}, qyTable);
					var lqy = $.extend(true, {}, qyTable);

					zc.localParam.data = data.zc;
					lr.localParam.data = data.lr;
					xj.localParam.data = data.xj;
					qy.localParam.data = data.qy;
					lqy.localParam.data = data.lqy;

					BdoDataTable('zc_report' + index + '_table', zc);
					BdoDataTable('lr_report' + index + '_table', lr);
					BdoDataTable('xj_report' + index + '_table', xj);
					BdoDataTable('qy_report' + index + '_table', qy);
					BdoDataTable('lqy_report' + index + '_table', lqy);
					BdoDataTable('rpt_tbcheck', Tbcheck);



			}
		});
	};
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
	/** 生成显示列 */
	function createColumn(flag) {
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
				}, {
					targets: ++cnt,
					orderable: true,
					title: '未审数',
					name: 'unAuditAmount',
					data: 'unAuditAmount',
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
				}
			]
		};
		return tbColumns;
	}
	function createColumnXJ(flag) {
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
				}, {
					targets: ++cnt,
					orderable: true,
					title: '本期金额',
					name: 'curAmount',
					data: 'curAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: ++cnt,
					orderable: true,
					title: '上期金额',
					name: 'preAmount',
					data: 'preAmount',
					//width: '100px',
					className: 'text-right width-je',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		};
		return tbColumns;
	}
	/** 生成资产负债表显示列 */
	function createColumnZC(flag) {
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
				}, {
					targets: ++cnt,
					orderable: true,
					title: '未审数',
					name: 'unAuditAmount',
					data: 'unAuditAmount',
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
				}
			]
		};
		return tbColumns;
	}
	// 加载表格数据并显示
	function loadTableData() {
		if ( thisPageConfig.TABLE_DIV == '11' || thisPageConfig.TABLE_DIV == '12') {
			var node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
			var fileIndexId = node.extraOptions.indexId;
			var subjectTreeId = node.extraOptions.autoId;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgGeneral.query.json',
				async: false,
				data: {
					menuId: window.sys_menuId,
					sqlId: 'DG00280',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: thisPageConfig.TABLE_DIV,
					param5: mergeProjectId,
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
										return formatMoney(data);
									}
								});
							}
						}
					}
				}
			});
			var qy = $.extend(true, {}, qyTable);
			qy.localParam.url = 'dgCenter/DgGeneral.query.json';
			qy.localParam.urlparam.sqlId = 'DG00281';
			qy.localParam.urlparam.param1 = window.CUR_CUSTOMERID;
			qy.localParam.urlparam.param2 = window.CUR_PROJECTID;
			qy.localParam.urlparam.param3 = window.CUR_PROJECT_ACC_YEAR;
			qy.localParam.urlparam.param4 = thisPageConfig.TABLE_DIV;
			qy.localParam.urlparam.param5 = mergeProjectId;
			if(thisPageConfig.TABLE_DIV == '11'){
				qy.localParam.urlparam.param6 = 2;
			}else{
				qy.localParam.urlparam.param6 = 1;
			}
			BdoDataTable(thisPageConfig.id, qy);
		}

	}
	$('#subPageRight [data-toggle="tabs"]').on('shown.bs.tab', function (e) {
		//$(this).resize();
		var upperNode = $('#tab_unAuditReport').find('li[class=active] a');
		thisPageConfig.showType = upperNode.attr('data-content');
		var tempId = upperNode.attr('data-result');
		var lowerNode = $('#' + tempId).find('li[class=active] a');
		thisPageConfig.id = lowerNode.attr('data-result');
		thisPageConfig.TABLE_DIV = lowerNode.attr('data-content');
		loadTableData();
	});
	var Tbcheck = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/HbMergeProjectAudited.tbListCheck.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId,
				param3:mergeProjectId
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
			},{
				targets: 5,
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

	// 显示
	mount();


}


