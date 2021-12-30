$(document).ready(function () {
	uiBlocksApi(false, 'init');
	window.setTimeout('$(\'#adjust_table_processing\').hide()', 2000);
	let projectYear = window.CUR_PROJECT_ACC_YEAR;

	let suggestions = [];
	$('#search_yyyy').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy', //日期显示格式
		minViewMode: 2
	});
	if ($.sessionStorage('mergeType') == 1) {
		$('#tab_adjust').remove();
		$('#tab_offset_ul').show();
		$('#tab_offset_ul a[href="#tab_offset_adjustser"]').parent().addClass('active');
		$('#tab_adjustser').removeClass('active');
		$('#tab_offset_adjustser').addClass('active');
		$('#search_assItemName').parent().parent().parent().remove();
		$('#search-condition > div > div:nth-child(2) > div > div > label').text('科目编号')
	} else {
		$('#tab_adjust').show();
		$('#tab_offset_ul').remove();
		$.ajax({
			type: 'post',
			async: false,
			url: 'dgCenter/DgGeneral.query.json',
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00202',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success(data) {
				data.success && (suggestions = data.data);
			}
		});
		// 默认检索年份
		// $('#search_yyyy').val(projectYear);
	}

	var journal = function() {
	};
	var setIndexId = function() {
	};
	var setUpdateParam = function() {
	};
	var openEditModal = function() {
	};
	var enableOrDisable = function() {
	};
	var deleteAdjust = function() {
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
		setUpdateParam = adjust.setUpdateParam;
		openEditModal = adjust.openEditModal;
		enableOrDisable = adjust.enableOrDisable;
		deleteAdjust = adjust.deleteAdjust;
		$('#adjust_show').hide();
	})();
	
	/** 加载 树 下拉框 */
	//客户
	$('#adjust_companyid').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);

	/** 页面列表初始化参数。*/
	let adjustTable = DgAdjustPage({handleFlag: '0', data: {extraOptions: {}}}).tableModel;
	adjustTable.localParam.urlparam = {
		menuId: window.sys_menuId,
		sqlId: 'DG00193',
		param1: window.CUR_CUSTOMERID,
		param2: window.CUR_PROJECTID
	};

	/** 页面列表初始化参数。*/
	let adjust_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			ordering: false,
			fixedThead: true,
			fixedHeight: '480px',
			rowGroup: {
				dataSrc: 'indexId',
				startRender: null,
				endRender: function (rows, data) {
					var $tableInfo = $('#' + $(rows.nodes()).eq(0).closest('table').attr('id') + '_info b');
					if (!rows[0][0]) {
						$tableInfo.html(0);
					}
					$(rows.nodes()).css('background', 'white');
					$(rows.nodes()).each(function (index, node) {
						if (!index) {
							$(this).find('td').eq(0).attr('rowspan', rows[0].length);
							$(this).find('td').eq(1).attr('rowspan', rows[0].length);
							$(this).find('td').eq(0).html(parseInt($tableInfo.html()) + 1);
						} else {
							$(this).find('td').eq(0).hide();
							$(this).find('td').eq(1).hide();
						}
						// if ($(this).find('td').eq(0).html() == '') {
						// 	$(this).css('background-color', 'rgb(255, 255, 120)');
						// }
					});
					var $endTr = $(rows.nodes()).last().next();
					if ($endTr.children().length == 1) {
						$endTr.remove();
					}
					var $table = $(rows.nodes()).eq(0).closest('table');
					$tableInfo.html(parseInt($tableInfo.html()) + 1);
					$table.find('td').css('border-width', '1px');
				}
				//className : 'adjust-group-row1'
			},
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-left adjust-row-text',
				title: '索引号',
				orderable: false,
				name: 'indexId',
				data: 'indexId',
				width: '100px',
				render: function (data, type, row, meta) {
					return '<span title=' + data + '>' + data + '</span>';
				}
			}, {
				targets: 2,
				className: 'text-left adjust-row-text',
				orderable: false,
				title: '摘要',
				name: 'digest',
				data: 'digest',
				width: '200px',
				render: function (data, type, row, meta) {
					return '<span title=' + data + '>' + data + '</span>';
				}
			}, {
				targets: 3,
				className: 'text-left adjust-row-text',
				orderable: false,
				title: '科目名称',
				name: 'tbSubjectName',
				data: 'tbSubjectName',
				width: '100px',
				render: function (data, type, row, meta) {
					return '<span title=' + data + '>' + data + '</span>';
				}
			}, {
				targets: 4,
				className: 'text-left adjust-row-text',
				title: '科目编号',
				orderable: false,
				name: 'tbSubjectCode',
				data: 'tbSubjectCode',
				width: '60px',
				render: function (data, type, row, meta) {
					return '<span title=' + data + '>' + data + '</span>';
				}
			}, {
				targets: 5,
				className: 'text-right adjust-row-text',
				title: '借方金额',
				orderable: false,
				name: 'deb',
				data: 'deb',
				width: '80px',
				render: function (data, type, row, meta) {
					if (row.direction > 0) {
						return formatMoney(row.occValue);
					}
					return '';
				}
			}, {
				targets: 6,
				className: 'text-right adjust-row-text',
				orderable: false,
				title: '贷方金额',
				name: 'cre',
				data: 'cre',
				width: '80px',
				render: function (data, type, row, meta) {
					if (row.direction < 0) {
						return formatMoney(row.occValue);
					}
					return '';
				}
			}, {
				targets: 7,
				className: 'text-center',
				orderable: false,
				title: '状态',
				name: 'ACTIVE_FLAG',
				data: 'ACTIVE_FLAG',
				renderer: 'getDicLabelByVal|activeFlag',
				width: '45px',
				render: function (data, type, row, meta) {
					return DicVal2Nm(data, 'activeFlag');
				}
			}, {
				targets: 8,
				className: 'text-left adjust-row-text',
				orderable: false,
				title: '未调整原因',
				name: 'reason',
				data: 'reason',
				width: '200px',
				render: function (data, type, row, meta) {
					data = data ? data : '';
					return '<span title=' + data + '>' + data + '</span>';
				}
			},
				{
					targets: 9,
					className: 'text-center',
					orderable: false,
					title: '调整年份',
					name: 'yyyy',
					data: 'yyyy',
					width: '100px',
					render: function (data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 10,
					className: 'text-center',
					orderable: false,
					title: '制单人',
					name: '__ufillUserName',
					data: '__ufillUserName',
					width: '100px',
					render: function (data, type, row, meta) {
						return '<span title=' + row.__ufillUserNameName + '>' + row.__ufillUserNameName + '</span>';
					}
				}, {
					targets: 11,
					className: 'text-center',
					orderable: false,
					title: '最后更新时间',
					name: 'lastUpdateDate',
					data: 'lastUpdateDate',
					width: '130px',
					render: function (data, type, row, meta) {
						return '<span title="' + data + '">' + data + '</span>';
					}
				}]
		}
	};

	adjustTable.localParam.urlparam.param4 = '2';
	adjustTable.localParam.urlparam.param5 = '';
	adjustTable.localParam.urlparam.param6 = projectYear;
	adjustTable.localParam.urlparam.param8 = '1'; // 审计调整
	adjustTable.localParam.urlparam.param9 = '';
	adjustTable.localParam.urlparam.param10 = '';
	adjustTable.localParam.urlparam.param11 = '';
	adjustTable.tableParam.columnDefs[3].title = 'TB科目';
	adjustTable.tableParam.columnDefs[3].sTitle = 'TB科目';
	adjustTable.tableParam.columnDefs[3].data = 'adjustSubjectTB';
	// BdoDataTable('adjust_table', adjustTable);
	/** 审计 */
	$('#tab_adjust').find('a[href="#tab_adjustser"]').click(function () {
		let view_table = $.extend({}, adjustTable, true);
		view_table.localParam.urlparam.param4 = '2';
		view_table.localParam.urlparam.param5 = '';
		//($('#adjust_subjectid').val() == '') ? '' : $('#adjust_subjectid').treecombo('getTreeComboValue');
		view_table.localParam.urlparam.param6 = $('#search_yyyy').val();
		view_table.localParam.urlparam.param8 = '1'; // 审计调整
		view_table.localParam.urlparam.param9 = $('#search_subjectid').val();
		view_table.localParam.urlparam.param10 = $('#search_assItemName').val();
		view_table.localParam.urlparam.param11 = $('#search_fillUser').val();
		view_table.tableParam.columnDefs[3].title = 'TB科目';
		view_table.tableParam.columnDefs[3].sTitle = 'TB科目';
		view_table.tableParam.columnDefs[3].data = 'adjustSubjectTB';
		BdoDataTable('adjust_table', view_table);
		queryAdjustEffect();

	});

	/** 审计未调整 */
	$('#tab_adjust').find('a[href="#tab_noAdjustser"]').click(function () {
		let view_table = $.extend({}, adjustTable, true);
		view_table.localParam.urlparam.param4 = '2';
		view_table.localParam.urlparam.param5 = '';
		view_table.localParam.urlparam.param6 = $('#search_yyyy').val();
		view_table.localParam.urlparam.param8 = '0'; // 审计不调整
		view_table.localParam.urlparam.param9 = $('#search_subjectid').val();
		view_table.localParam.urlparam.param10 = $('#search_assItemName').val();
		view_table.localParam.urlparam.param11 = $('#search_fillUser').val();
		view_table.tableParam.columnDefs[3].title = 'TB科目';
		view_table.tableParam.columnDefs[3].sTitle = 'TB科目';
		view_table.tableParam.columnDefs[3].data = 'adjustSubjectTB';
		BdoDataTable('noAdjust_table', view_table);
		queryAdjustEffect();
	});

	/** 导入客户报表按钮 */
	$('#adjust_importAudit, #adjust_importUser').click(function () {
		let selectYear = projectYear - 1;
		let selectprojectYear = "<option value='" + selectYear + "'>" + selectYear + "</option><option value='" + projectYear + "'>" + projectYear + "</option> ";
		$('#selectProjectYear').html(selectprojectYear);
		$('#modal-importCustomerReport').modal('show');
		$('#import_customer').val($('#adjust_companyid').val());
		//报表模板

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
			uploadAsync: false,
			showCancel: false,
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			allowedFileExtensions: ['xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlsb', 'xlam'],
			uploadAsync: true,
			uploadUrl: 'dgCenter/AuditAdjust.importAuditAdjust.json',
			uploadExtraData: function () {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function () {
			return {
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
//			param2 : $(this).attr('data-adjustType'),
				param3: $('#selectProjectYear option:selected').val()
			};
		};
		var $el = $('#fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function (event, data) {
			if (data.response.success) {
				bdoSuccessBox('导入成功');
			} else {
				bdoErrorBox('错误', data.response.resultInfo.statusText);
			}
			$('#modal-importCustomerReport').modal('hide');
			$('#fileinput').fileinput('clear');
			$('#fileinput').fileinput('enable');
			$('#adjust_search').click();
			//uploadFileSuccess(data);
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function (event, data, msg) {
			bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);
			//uploadFileSuccess(data);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
		}

		//建议文件上传成功之后再提交其他表单数据

		/** 导入按钮 */
		$('#import_submit').on('click', function () {
			$el.fileinput('upload');
		});

		$('#modal_jnadjustform').one('hidden.bs.modal', function () {
			$('#import_submit').off('click');
		});

	});

	/** 下载模板按钮 */
	$('#import_dlTemplate').click(function () {
		var params = {
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: $('#selectProjectYear option:selected').val(),
			param4: '4'
		};
		let clickId = $('#tab_adjust li.active a').attr('href');
		if ('#tab_readjustser' == clickId) {
			params.param4 = '7';
		}
		exportExcelWithTemplate('dgCenter/AuditAdjust.exportAuditAdjustExcel.json', params);

	});


	/** 导出 */
	/*$('#adjust_export').click(function() {
		let exportTable = $.extend({}, adjustTable, true);
		// DG10014
		exportTable.localParam.urlparam.sqlId = 'DG00173';
		exportExcel(this, '分录一览', exportTable, 'adjust_table');
		adjustTable.localParam.urlparam.sqlId = 'DG00014';
	});*/

	/** 客户 */
	$('#tab_adjust').find('a[href="#tab_readjustser"]').click(function () {
		let view_table = $.extend({}, adjustTable, true);
//	getCustomerVocation('readjust_vocationId',{param1:$('#readjust_companyid').val(),param2:$('#readjust_year').val(),param3:departIdSession});
		view_table.localParam.urlparam.param4 = '1';
		view_table.localParam.urlparam.param5 = '';//($('#readjust_subjectid').val() == '') ? '' : $('#readjust_subjectid').treecombo('getTreeComboValue');
		view_table.localParam.urlparam.param6 = $('#search_yyyy').val();
		view_table.localParam.urlparam.param8 = '';
		view_table.localParam.urlparam.param9 = $('#search_subjectid').val();
		view_table.localParam.urlparam.param10 = $('#search_assItemName').val();
		view_table.localParam.urlparam.param11 = $('#search_fillUser').val();
		view_table.localParam.sqlId = 'DG00193';
		view_table.tableParam.columnDefs[3].title = '报表科目';
		view_table.tableParam.columnDefs[3].sTitle = '报表科目';
		view_table.tableParam.columnDefs[3].data = 'adjustSubjectReport';
		view_table.tableParam.ordering = false;
		view_table.tableParam.order = [];
		BdoDataTable('readjust_table', view_table);
		queryAdjustEffect();
	});


	/** 导出 */
	$('#readjust_export').click(function () {
		let exportTable = $.extend({}, adjustTable, true);
		exportTable.localParam.urlparam.sqlId = 'DG00173';
		exportExcel(this, '分录一览', exportTable, 'readjust_table');
		adjustTable.localParam.urlparam.sqlId = 'DG00014';
	});

	$('#adjust_search').click(function () {
		$('#tab_adjust li.active a').click();
	});
	$('#noAdjust_search').click(function () {
		$('#tab_adjust li.active a').click();
	});
	$('#readjust_search').click(function () {
		$('#tab_adjust li.active a').click();
	});

	$('#btn_search').click(function () {
		$('#tab_adjust li.active a').click();
		$('#tab_offset_ul li.active a').click();
	});
	$('#btn_clear').click(function () {
		$('#search-condition .form-control').val('');
	});


	// TB科目自动完成
	$('#search_subjectid').devbridgeAutocomplete({
		minChars: 0,
		autoSelectFirst: true,
		maxHeight: 270,
		lookup: suggestions, 		// TB科目
		onSelect: function (suggestion) {
			$(this).val(suggestion.value);
		}
	});


	$('#tab_offset_ul').find('a[href="#tab_offset"]').click(function () {
		adjust_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			sqlId: 'HB00021',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3:  $('#search_yyyy').val(),
			param9: $('#search_subjectid').val(),
			param11: $('#search_fillUser').val()

		};
		BdoDataTable('offset_table', adjust_view);
	});

	$('#offset_search').click(function () {
		$('#tab_offset_ul > li.active > a').click();
	});

	$('#tab_offset_ul').find('a[href="#tab_offset_adjustser"]').click(function () {
		adjust_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			sqlId: 'HB00022',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: $('#search_yyyy').val(),
			param9: $('#search_subjectid').val(),
			param11: $('#search_fillUser').val()

		};
		BdoDataTable('offset_adjustser_table', adjust_view);
	});
	$('#tab_offset_ul').find('a[href="#tab_offset_noAdjustser"]').click(function () {
		adjust_view.localParam.urlparam = {
			menuId: window.sys_menuId,
			sqlId: 'HB00023',
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID,
			param3: $('#search_yyyy').val(),
			param9: $('#search_subjectid').val(),
			param11: $('#search_fillUser').val()

		};
		BdoDataTable('offset_noAdjustser_table', adjust_view);
	});


	$('#tab_adjust li.active a').click();
	$('#tab_offset_ul li.active a').click();

	/**
	 * 查询调整对利润与资产的影响
	 */
	function queryAdjustEffect(){
		$.ajax({
			type: 'post',
			async: false,
			url: 'dgCenter/AuditAdjust.queryAdjustEffect.json',
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				sqlId: 'DG00202',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					$('#cus_select1').html('期初：审计调整对净资产影响：'+formatMoney2(data.data[0].impactLastYearSAssetAudit)+' 元；   审计调整对净利润影响：'+formatMoney2(data.data[0].impactLastYearSProfitAudit)+'元；' +
						'    <br/>期末：审计调整对净资产影响：'+formatMoney2(data.data[0].impactCurrentYearAssetAudit)+' 元；   审计调整对净利润影响：'+formatMoney2(data.data[0].impactCurrentYearProfitAudit)+'元；');
					$('#cus_select2').html('期初：客户调整对净资产影响：'+formatMoney2(data.data[0].impactLastYearSAssetCusAudit)+' 元；    客户调整对净利润影响：'+formatMoney2(data.data[0].impactLastYearSProfitCusAudit)+'元；' +
						'    <br/>期末：客户调整对净资产影响：'+formatMoney2(data.data[0].impactCurrentYearAssetCusAudit)+' 元；    客户调整对净利润影响：'+formatMoney2(data.data[0].impactCurrentYearProfitCusAudit)+'元；');
					$('#cus_select3').html('期初：审计未调整对净资产影响：'+formatMoney2(data.data[0].impactLastYearSAssetUnAudit)+' 元；   审计未调整对净利润影响：'+formatMoney2(data.data[0].impactLastYearSProfitUnAudit)+'元；'
					+'    <br/>期末：审计未调整对净资产影响：'+formatMoney2(data.data[0].impactCurrentYearAssetUnAudit)+' 元；   审计未调整对净利润影响：'+formatMoney2(data.data[0].impactCurrentYearProfitUnAudit)+'元；');

				}
			}
		});

	}
	// queryAdjustEffect();

	/*
	$('#readjust_companyid, #readjust_year').change(function() {
		getCustomerVocation('readjust_vocationId',{param1:CUR_CUSTOMERID,param2:projectYear,param3:departIdSession});
	});
	*/
	// $('#tab_adjust').find('a[href="#tab_adjustser"]').click();
	// 修改
	$('#adjust_table').on('click', 'button[name="adEdit"]', function() {
		//var object = $('#adjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#adjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: '',
			workpaperId: curNodeData.workpaperId,
			tableId: 'adjust_table'
		};
		setUpdateParam(data);
		openEditModal($(this));
	});
	// 启用/禁用
	$('#adjust_table').on('click', 'button[name="adBan"]', function() {
		//var object = $('#adjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#adjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: '',
			workpaperId: curNodeData.workpaperId,
			tableId: 'adjust_table'
		};
		setUpdateParam(data);
		enableOrDisable($(this));
	});
	// 删除
	$('#adjust_table').on('click', 'button[name="adDelete"]', function() {
		//var object = $('#adjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#adjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: '',
			workpaperId: curNodeData.workpaperId,
			tableId: 'adjust_table'
		};
		setUpdateParam(data);
		deleteAdjust($(this));
	});
	// 修改
	$('#noAdjust_table').on('click', 'button[name="adEdit"]', function() {
		//var object = $('#noAdjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#noAdjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: '',
			workpaperId: curNodeData.workpaperId,
			tableId: 'noAdjust_table'
		};
		setUpdateParam(data);
		openEditModal($(this));
	});
	// 启用/禁用
	$('#noAdjust_table').on('click', 'button[name="adBan"]', function() {
		//var object = $('#noAdjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#noAdjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: '',
			workpaperId: curNodeData.workpaperId,
			tableId: 'noAdjust_table'
		};
		setUpdateParam(data);
		enableOrDisable($(this));
	});
	// 删除
	$('#noAdjust_table').on('click', 'button[name="adDelete"]', function() {
		//var object = $('#noAdjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#noAdjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: '',
			workpaperId: curNodeData.workpaperId,
			tableId: 'noAdjust_table'
		};
		setUpdateParam(data);
		deleteAdjust($(this));
	});
	// 修改
	$('#readjust_table').on('click', 'button[name="adEdit"]', function() {
		//var object = $('#readjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#readjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: curNodeData.adjustType,
			workpaperId: curNodeData.workpaperId,
			tableId: 'readjust_table'
		};
		setUpdateParam(data);
		openEditModal($(this));
	});
	// 启用/禁用
	$('#readjust_table').on('click', 'button[name="adBan"]', function() {
		//var object = $('#readjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#readjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: curNodeData.adjustType,
			workpaperId: curNodeData.workpaperId,
			tableId: 'readjust_table'
		};
		setUpdateParam(data);
		enableOrDisable($(this));
	});
	// 删除
	$('#readjust_table').on('click', 'button[name="adDelete"]', function() {
		//var object = $('#readjust_table').DataTable().data()[$(this).closest('tr').index()];
		var indexSeq = $(this).parent().next().children().html();
		var tableData = $('#readjust_table').DataTable().data();
		var curNodeData = querySelectTableData(indexSeq, tableData);
		var data = {
			adjustTyle: curNodeData.adjustType,
			workpaperId: curNodeData.workpaperId,
			tableId: 'readjust_table'
		};
		setUpdateParam(data);
		deleteAdjust($(this));
	});
	function querySelectTableData(indexSeq, tableData){
		for(var i = 0;i < tableData.length;i++){
			if(tableData[i].indexId == indexSeq){
				return tableData[i];
			}
		}
		return null;
	}
});
