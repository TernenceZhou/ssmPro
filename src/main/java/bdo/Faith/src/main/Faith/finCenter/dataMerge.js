$(document).ready(function () {
	uiBlocksApi(false, 'init');
	let bgColerMap = {};
	let auditProgramRowMark = [];
	let cnt = 0;
	let auditProgramRow = 0;
	let parentApMap = {};
	let new_customerId = '';
	let cur_customerId = '';
	let cur_yyyy = '';
	let cur_autoId = '';
	let listId = '';
	let updateId = '';
	let columnIds = [];
	$('#dataMerge_add_contrast').html(ComboLocalDicOption(true, 'boolean'));
	$('#dataMerge_add_contrast').val('0');
	getUserCustomers('dataMerge_list_customerId');
	getCustomerForImport('add_merge_list_customerId', $('#modal_add_merge_list'));
	$('#add_merge_list_remain').html(ComboLocalDicOption(false, 'boolean'));
	$('#add_merge_list_remain').val('1');
	getCustomerForImport('update_merge_list_customerId', $('#modal_update_merge_list'));
	$('#update_merge_list_remain').html(ComboLocalDicOption(false, 'boolean'));
	//  日期设置
	$('#add_merge_list_yyyy').datepicker({
		autoclose : true,
		todayHighlight : true,
		language : 'zh-CN', // 语言设置
		format : 'yyyy', // 日期显示格式
		minViewMode : 2
	});
	let startyear = window.CUR_PROJECT_START_YEAR;
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#add_merge_list_yyyy').val(startyear);
	// 获取临时客户下拉
	var getMergeTempCustomers = function(itemid) {
		var customers = null;
		if (userCustomers != null && userCustomers != 'null') {
			customers = JSON.parse(userCustomers);
		}
		$.ajax({
			url: 'finCenter/FinTreeCommon.findTempCustomerTree.json',
			type: 'post',
			data: {
				param1 : ''
			},
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					if(data.data != null) {
						customers = data.data;
					}
				}
				if(customers != null){
					for (var i = 0; i < customers.length; i++) {
						if(!customers[i]) {
							return;
						}
						if (customers[i].value == window.BDO_CUSTOMER_SELECT) {
							$('#' + itemid).append(' <option value="' + customers[i].value + '" selected>' + customers[i].label + '</option>');
						} else {
							$('#' + itemid).append(' <option value="' + customers[i].value + '">' + customers[i].label + '</option>');
						}
					}
				}
			}
		});
	};
	getMergeTempCustomers('add_merge_list_main_customerId');
	getMergeTempCustomers('update_merge_list_main_customerId');

	let dataMergeListTableCfg = {
		localParam: {
			url: 'finCenter/FinGeneral.query.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: 'FIN203011',
				param1: $('#dataMerge_list_customerId').val(),
				param2: $('#dataMerge_list_yyyy').val(),
				param3: window.departIdrSession
			},
			tabNum: true
		},
		tableParam: {
			select: true,
			ordering: false,
			serverSide: true,
			autoWidth: true,
			scrollY: 500,
			scrollX: true,
			//dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			// scrollCollapse: true,
			pageLength: 30,
			fixedColumns: true,
			columnDefs: [{
				targets: (() => {
					cnt = 0;
					return ++cnt;
				})(),
				orderable: false,
				className: 'text-center',
				title: '处理',
				name: 'autoId',
				data: 'autoId',
				width: '50px',
				render(data, type, row, meta) {
					let renderStr = '';
					renderStr += '<div class="">';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="editBtn" data-placement="top" title="修改" data-toggle="tooltip" data-auto-id="' + data + '"><i class="fa fa-edit"></i></button>';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="initBtn" data-placement="top" title="初始化对照" data-toggle="tooltip" data-auto-id="' + data + '"><i class="fa fa-refresh"></i></button>';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="subjectContrastTabBtn" data-placement="top" title="科目对照" data-toggle="tooltip" data-auto-id="' + data + '"><i class="fa fa-plus-square"></i></button>';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="assitemContrastTabBtn" data-placement="top" title="核算对照" data-toggle="tooltip" data-auto-id="' + data + '"><i class="fa fa-users"></i></button>';
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="mergeBtn" data-placement="top" title="账套数据合并" data-toggle="tooltip" data-auto-id="' + data + '"><i class="fa fa-send"></i></button>';
					renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="deleteBtn" data-placement="top" title="删除" data-toggle="tooltip" data-auto-id="' + data + '"><i class="fa fa-times"></i></button>';
					renderStr += '</div>';
					return renderStr;
				}
			}, {
				targets: +cnt,
				orderable: false,
				className: 'text-left',
				title: '客户编号',
				name: 'customerId',
				data: 'customerId',
				width: '50px'
			}, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '客户名称',
				name: 'customerName',
				data: 'customerName',
				width: '150px'
			}, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '项目名称',
				name: 'projectName',
				data: 'projectName',
				width: '150px'
			}, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '年份',
				name: 'yyyy',
				data: 'yyyy',
				width: '50px'
			}, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '合并主客户',
				name: 'mainCustomerName',
				data: 'mainCustomerName',
				width: '150px'
			}, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '合并临时客户',
				name: 'mergeCustomerNames',
				data: 'mergeCustomerNames',
				width: '150px',
				render(data, tyep, row, meta) {
					if(data != null){
						let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 300px;">'+data+'</div>';
						return resultStr;
					}else{
						return data;
					}
				}
			}, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '合并状态',
				name: 'mergeStatus',
				data: 'mergeStatus',
				renderer: 'getDicLabelByVal|账套合并状态',
				width: '50px',
				render: function (data, type, row, meta) {
					return DicVal2Nm(data, '账套合并状态');
				}
			}, {
				targets : ++cnt,
				className : 'text-center',
				title : '合并信息',
				name : 'mergeMessage',
				data : 'mergeMessage',
				width : '150px',
				render(data, tyep, row, meta) {
					if(data != null){
						let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 300px;">'+data+'</div>';
						return resultStr;
					}else{
						return data;
					}
				}
			}, {
				targets : ++cnt,
				className : 'text-center',
				title : '操作人',
				name : '__umergeUserName',
				data : '__umergeUserName',
				width : '80px'
			}, {
				targets : ++cnt,
				className : 'text-center',
				title : '最后更新时间',
				name : 'LAST_UPDATE_DATE',
				data : 'LAST_UPDATE_DATE',
				width : '80px',
				render: function (data, type, row, meta) {
					return data == null ? '' : getMyDate(data);
				}
			}]
		}
	}
	BdoDataTable('dataMerge_list_table', dataMergeListTableCfg);
	let dataMergeTableCfg = {};
	let initDataMergerTableView = function(mergeCustomer) {
		dataMergeTableCfg = {
			localParam: {
				url: 'finCenter/FinDataMergeJS.querySubjectMerge.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: '',
						param1: ''
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				// scrollCollapse: true,
				paging: true,
				fixedColumns: true,
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '50px'
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '150px'
				}/*, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '科目编号全路径',
				name: 'subjectFullId',
				data: 'subjectFullId',
				width: '50px'
			}*//*, {
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: '科目名称全路径',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '150px'
				}*/, {
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: '科目层级',
					name: 'level1',
					data: 'level1',
					width: '50px'
				}]
			}
		}
		let customerColumn = mergeCustomer.split(',');
		columnIds = [];
		for(var i = 0;i < customerColumn.length;i++){
			var columnName = 'customer' + customerColumn[i].split('-')[0];
			columnIds.push(columnName);
			dataMergeTableCfg.tableParam.columnDefs.push(
				{
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: customerColumn[i],
					name: columnName,
					data: columnName,
					width: '150px',
					render(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<div class="">';
						/*renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="subjectContrastBtn" data-placement="top" title="对照" data-toggle="tooltip" data-customer-id="' + columnIds[meta.col - 6] + '" data-auto-id="' + row.autoId + '">'
							+ '	<i class="fa fa-plus-square"></i>'
							+ '	</button>';*/
						if(data != null){
							renderStr += data;
						}
						renderStr += '</div>';
						return renderStr;
					}
				}
			);
		}
	}
	let matchTableColIndex = 1;
	var matchTable_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/FinDataMergeJS.querySubjectContrast.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: '',
				param1: '',
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			scrollY: '300px',
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			rowReorder: {
				update: false
			},
			fixedThead: true,
			fixedHeight: '300px',
			columnDefs: [{
				targets: matchTableColIndex ++,
				className: 'text-center',
				title: '操作',
				name: 'sendId',
				data: 'sendId',
				width: '50px',
				render: function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="deleteContrast" data-placement="top" title="删除对照" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
					return renderStr;
				}
			}, {
				targets : matchTableColIndex ++,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '100px'
			}, {
				targets : matchTableColIndex ++,
				className : 'text-left',
				title : '科目全路径',
				name : 'subjectFullName',
				data : 'subjectFullName',
				width : '100px'
			}, {
				targets : matchTableColIndex ++,
				className : 'text-left',
				title : '科目层级',
				name : 'level1',
				data : 'level1',
				width : '100px'
			}
		]}
	};
	let addSubjectTableColIndex = 1;
	var addSubjectTable_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/FinDataMergeJS.querySubjectContrast.json',
			urlparam: {
				menuId: window.sys_menuId,
				sqlId: '',
				param1: '',
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			scrollY: '300px',
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering: false,
			serverSide: true,
			rowReorder: {
				update: false
			},
			fixedThead: true,
			fixedHeight: '300px',
			columnDefs: [{
				targets: addSubjectTableColIndex ++,
				className: 'text-center',
				title: '操作',
				name: 'sendId',
				data: 'sendId',
				width: '50px',
				render: function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="addSubject" data-placement="top" title="添加科目" data-toggle="tooltip"><i class="fa fa-plus"></i></button>&nbsp;';
					//renderStr += '<button class="btn btn-xs btn-danger" type="button" name="deleteContrast" data-placement="top" title="删除对照" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
					return renderStr;
				}
			}, {
				targets : addSubjectTableColIndex ++,
				className : 'text-left',
				title : '科目编号',
				name : 'subjectId',
				data : 'subjectId',
				width : '100px'
			}, {
				targets : addSubjectTableColIndex ++,
				className : 'text-left',
				title : '科目全路径',
				name : 'subjectFullName',
				data : 'subjectFullName',
				width : '100px'
			}, {
				targets : addSubjectTableColIndex ++,
				className : 'text-left',
				title : '科目层级',
				name : 'level1',
				data : 'level1',
				width : '100px'
			}, {
				targets : addSubjectTableColIndex ++,
				className : 'text-left',
				title : '是否已对照',
				name : 'isContrast',
				data : 'isContrast',
				width : '50px'
			}
			]}
	};
	let dataMergeAssitemTableCfg = {};
	let initDataMergerAssitemTableView = function(mergeCustomer) {
		dataMergeAssitemTableCfg = {
			localParam: {
				url: 'finCenter/FinDataMergeJS.queryAssitemMerge.json',
				urlparam: (() => {
					let param = {
						menuId: window.sys_menuId,
						sqlId: '',
						param1: ''
					};
					return param;
				})(),
				tabNum: true
			},
			tableParam: {
				select: true,
				ordering: false,
				serverSide: true,
				autoWidth: true,
				scrollY: 500,
				scrollX: true,
				dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				// scrollCollapse: true,
				paging: true,
				fixedColumns: true,
				columnDefs: [{
					targets: (() => {
						cnt = 0;
						return ++cnt;
					})(),
					orderable: false,
					className: 'text-left',
					title: '核算编号',
					name: 'assItemId',
					data: 'assItemId',
					width: '50px'
				}, {
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: '核算名称',
					name: 'assItemName',
					data: 'assItemName',
					width: '150px'
				}/*, {
				targets: ++cnt,
				orderable: false,
				className: 'text-left',
				title: '核算编号全路径',
				name: 'assItemFullId',
				data: 'assItemFullId',
				width: '50px'
			}*//*, {
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: '核算名称全路径',
					name: 'assTotalName',
					data: 'assTotalName',
					width: '150px'
				}*/, {
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: '核算层级',
					name: 'level1',
					data: 'level1',
					width: '50px'
				}]
			}
		}
		let customerColumn = mergeCustomer.split(',');
		columnIds = [];
		for(var i = 0;i < customerColumn.length;i++){
			var columnName = 'customer' + customerColumn[i].split('-')[0];
			columnIds.push(columnName);
			dataMergeAssitemTableCfg.tableParam.columnDefs.push(
				{
					targets: ++cnt,
					orderable: false,
					className: 'text-left',
					title: customerColumn[i],
					name: columnName,
					data: columnName,
					width: '150px',
					render(data, type, row, meta) {
						let renderStr = '';
						renderStr += '<div class="">';
						/*renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="assitemContrastBtn" data-placement="top" title="对照" data-toggle="tooltip" data-customer-id="' + columnIds[meta.col - 6] + '" data-auto-id="' + row.autoId + '">'
							+ '	<i class="fa fa-plus-square"></i>'
							+ '	</button>';*/
						if(data != null){
							renderStr += data;
						}
						renderStr += '</div>';
						return renderStr;
					}
				}
			);
		}
	}
	// 查询
	$('#btn_list_search').click(function() {
		dataMergeListTableCfg.localParam.urlparam.param1 = $('#dataMerge_list_customerId').val();
		dataMergeListTableCfg.localParam.urlparam.param2 = $('#dataMerge_list_yyyy').val();
		BdoDataTable('dataMerge_list_table', dataMergeListTableCfg);
	});
	// 科目合并tab
	$('#dataMerge_list_table').on('click', 'button[name="subjectContrastTabBtn"]', event => {
		var object = $('#dataMerge_list_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let autoId = $(event.currentTarget).attr('data-auto-id');
		if (object.mergeStatus == '1' || object.mergeStatus == '5') {
			bdoInfoBox('提示', '请先点击初始化按钮获取数据后再做对照');
			return;
		}else if (object.mergeStatus == '2' || object.mergeStatus == '4') {
			bdoInfoBox('提示', '数据处理中，请稍后再试');
			return;
		}
		initDataMergerTableView(object.mainCustomerName + ',' + object.mergeCustomerNames);
		dataMergeTableCfg.localParam.urlparam.param1 = autoId;
		BdoDataTable('dataMerge_table', dataMergeTableCfg);
		new_customerId = object.customerId;
		cur_yyyy = object.yyyy;
		listId = autoId;
		$('#li_dataMerge_subject').click();
	});
	// 核算合并tab
	$('#dataMerge_list_table').on('click', 'button[name="assitemContrastTabBtn"]', event => {
		var object = $('#dataMerge_list_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let autoId = $(event.currentTarget).attr('data-auto-id');
		if (object.mergeStatus == '1' || object.mergeStatus == '5') {
			bdoInfoBox('提示', '请先点击初始化按钮获取数据后再做对照');
			return;
		}else if (object.mergeStatus == '2' || object.mergeStatus == '4') {
			bdoInfoBox('提示', '数据处理中，请稍后再试');
			return;
		}
		initDataMergerAssitemTableView(object.mainCustomerName + ',' + object.mergeCustomerNames);
		dataMergeAssitemTableCfg.localParam.urlparam.param1 = autoId;
		BdoDataTable('dataMerge_assitem_table', dataMergeAssitemTableCfg);
		new_customerId = object.customerId;
		cur_yyyy = object.yyyy;
		listId = autoId;
		$('#li_dataMerge_assitem').click();
	});
	// 科目匹配
	$('#dataMerge_table').on('click', 'button[name="subjectContrastBtn"]', event => {
		var object = $('#dataMerge_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let customerId = $(event.currentTarget).attr('data-customer-id').replaceAll('customer', '');
		matchTable_view.localParam.urlparam.param1 = customerId;
		matchTable_view.localParam.urlparam.param2 = object.yyyy;
		matchTable_view.localParam.urlparam.param3 = object.autoId;
		BdoDataTable('dataMerge_match_table', matchTable_view);
		$('#matchTitle').html('科目匹配：' + object.subjectId + '-' + object.subjectFullName);
		cur_customerId = customerId;
		cur_yyyy = object.yyyy;
		cur_autoId = object.autoId;
		$('#modal_dataMerge_match').modal('show');
	});

	// 选择科目
	$('#dataMerge_match_add').click(function() {
		$('#modal_dataMerge_subjectid').modal('show');
		/*if ($('#subject_tree').hasClass('treeview')) {
			return;
		}*/
		$('#dataMerge_subject_tree').tree({
			url : 'finCenter/FinTreeCommon.findMergeAccSubjectType.json',
			params : {
				lockProjectId : cur_customerId,
				lockYyyy : cur_yyyy,
				searchInputId : 'searchInput_dataMerge'
			},
			singleSelect : true,
			lazyLoad : false,
			onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : false,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});
	$('#modal_dataMerge_subjectid_sure').click(function() {
		var selectValue = $('#dataMerge_subject_tree').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			bdoInfoBox('提示', '请选择科目');
		} else {
			saveSubjectContrast(selectValue);
		}
	});
	$('#modal_dataMerge_subjectid_reset').click(function() {
		$('#dataMerge_subject_tree').tree('reset');
	});
	// 保存对照
	var saveSubjectContrast = function (subjectId) {
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.saveSubjectContrast.json',
				type: 'post',
				data: {
					param1: cur_customerId,
					param2: cur_yyyy,
					param3: new_customerId,
					param4: cur_autoId,
					param5: subjectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_match_table').DataTable().ajax.reload(null,false);
						$('#modal_dataMerge_subjectid').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	}
	/** 删除对照 */
	$('#dataMerge_match_table').on('click', 'button[name="deleteContrast"]', function() {
		var object = $('#dataMerge_match_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '确认删除？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.deleteSubjectContrast.json',
				type: 'post',
				data: {
					param1: cur_customerId,
					param2: cur_yyyy,
					param3: new_customerId,
					param4: object.autoId,
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_match_table').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	$('#dataMerge_add_subject').on('click', function() {
		getMergeTempCustomers('dataMerge_add_customerId');
		let customerId = $('#dataMerge_add_customerId').val().split('-');
		addSubjectTable_view.localParam.urlparam.param1 = customerId[0];
		addSubjectTable_view.localParam.urlparam.param2 = cur_yyyy;
		addSubjectTable_view.localParam.urlparam.param4 =  $('#dataMerge_add_contrast').val();
		BdoDataTable('dataMerge_add_subject_table', addSubjectTable_view);
		$('#modal_dataMerge_add').modal('show');
	});
	$('#btn_add_search').on('click', function() {
		let customerId = $('#dataMerge_add_customerId').val().split('-');
		addSubjectTable_view.localParam.urlparam.param1 = customerId[0];
		addSubjectTable_view.localParam.urlparam.param2 = cur_yyyy;
		addSubjectTable_view.localParam.urlparam.param4 =  $('#dataMerge_add_contrast').val();
		BdoDataTable('dataMerge_add_subject_table', addSubjectTable_view);
	});
	// 初始化
	$('#dataMerge_init').on('click', function() {
		bdoConfirmBox('保存', '确认初始化？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.initSubjectMerge.json',
				type: 'post',
				data: {
					param1: cur_customerId,
					param2: cur_yyyy,
					param3: new_customerId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_table').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 初始化
	$('#dataMerge_assitem_init').on('click', function() {
		bdoConfirmBox('保存', '确认初始化？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.initAssitemMerge.json',
				type: 'post',
				data: {
					param1: cur_customerId,
					param2: cur_yyyy,
					param3: new_customerId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_assitem_table').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** 下载模板按钮 */
	$('#data_merge_downtemp').click(function (e) {
		downloadFile('finCenter/FinDataMergeJS.downloadDataMergeModal.json', {param1:listId});
	});
	// 导入弹窗
	$('#dataMerge_upload').on('click', function () {
		if(listId == '' || listId == null){
			bdoInfoBox('提示', '请先选择合并任务');
			return;
		}
		dataMergeImportInit();
	});
	function dataMergeImportInit() {
		$('#modal_data_merge_import').modal('show');
		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			acceptedFiles: '.xlsx',
			allowedFileExtensions: ['xlsx'],
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			showCancel: false,
			showClose: false,
			required: true,
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			uploadAsync: false,
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadUrl: 'finCenter/FinDataMergeJS.importDataMergeSubject.json',
			uploadExtraData: function () {
				return {
					param1: ''
				};
			}
		};
		pluginOpt.uploadExtraData = function () {
			return {
				param1: listId,
			};
		};
		var $el = $('#data_merge_fileinput').fileinput(pluginOpt);
		$el.on('filebatchuploadsuccess', function (event, data) {
			if (!data.response.success) {
				bdoErrorBox('系统提示', data.response.resultInfo.statusText);
			} else {
				bdoSuccessBox('上传成功');
				$('#dataMerge_table').DataTable().ajax.reload(null,false);
			}
			$('#modal_data_merge_import').modal('hide');
			$('#data_merge_fileinput').fileinput('clear');
			$('#data_merge_fileinput').fileinput('enable');
		});
		$el.on('filebatchuploaderror', function (event, data, msg) {
			bdoErrorBox('系统提示', msg);
			$('#modal_data_merge_import').modal('hide');
			$('#data_merge_fileinput').fileinput('clear');
			$('#data_merge_fileinput').fileinput('enable');
		});
		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}
		/** 导入按钮 */
		$('#data_merge_submit').click(function () {
			var fileUrl = $('#data_merge_fileinput').val();
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			var tip = '确认导入吗？';
			bdoConfirmBox('确认', tip, function () {
				bdoInProcessingBox('导入中');
				uploadFile();
			});
		});
	}
	/** 下载模板按钮 */
	$('#data_merge_assitem_downtemp').click(function (e) {
		downloadFile('finCenter/FinDataMergeJS.downloadDataMergeAssitemModal.json', {param1:listId});
	});
	// 导入弹窗
	$('#dataMerge_assitem_upload').on('click', function () {
		if(listId == '' || listId == null){
			bdoInfoBox('提示', '请先选择合并任务');
			return;
		}
		dataMergeAssitemImportInit();
	});
	function dataMergeAssitemImportInit() {
		$('#modal_data_merge_assitem_import').modal('show');
		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			acceptedFiles: '.xlsx',
			allowedFileExtensions: ['xlsx'],
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			showCancel: false,
			showClose: false,
			required: true,
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			uploadAsync: false,
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadUrl: 'finCenter/FinDataMergeJS.importDataMergeAssitem.json',
			uploadExtraData: function () {
				return {
					param1: ''
				};
			}
		};
		pluginOpt.uploadExtraData = function () {
			return {
				param1: listId,
			};
		};
		var $el = $('#data_merge_assitem_fileinput').fileinput(pluginOpt);
		$el.on('filebatchuploadsuccess', function (event, data) {
			if (!data.response.success) {
				bdoErrorBox('系统提示', data.response.resultInfo.statusText);
			} else {
				bdoSuccessBox('上传成功');
				$('#dataMerge_assitem_table').DataTable().ajax.reload(null,false);
			}
			$('#modal_data_merge_assitem_import').modal('hide');
			$('#data_merge_assitem_fileinput').fileinput('clear');
			$('#data_merge_assitem_fileinput').fileinput('enable');
		});
		$el.on('filebatchuploaderror', function (event, data, msg) {
			bdoErrorBox('系统提示', msg);
			$('#modal_data_merge_assitem_import').modal('hide');
			$('#data_merge_assitem_fileinput').fileinput('clear');
			$('#data_merge_assitem_fileinput').fileinput('enable');
		});
		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}
		/** 导入按钮 */
		$('#data_merge_assitem_submit').click(function () {
			var fileUrl = $('#data_merge_assitem_fileinput').val();
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			var tip = '确认导入吗？';
			bdoConfirmBox('确认', tip, function () {
				bdoInProcessingBox('导入中');
				uploadFile();
			});
		});
	}
	$('#dataMerge_list_add').on('click', function() {
		updateId = '';
		$('#add_merge_list_main_customerId').val('');
		$('#add_merge_list_other_customerId').val('');
		//$('#add_merge_list_customerId').val('');
		$('#add_merge_list_main_customerId').removeAttr('disabled');
		$('#add_merge_list_customerId').removeAttr('disabled');
		$('#add_merge_list_yyyy').removeAttr('disabled');
		$('#modal_add_merge_list').modal('show');
	});

	// 选择合并客户
	$('#dataMerge_add_otherCustomer').click(function() {
		$('#modal_dataMerge_customer').modal('show');
		if ($('#dataMerge_customer_tree').hasClass('treeview')) {
			return;
		}
		$('#dataMerge_customer_tree').tree({
			url : 'finCenter/FinTreeCommon.findTempCustomerTree.json',
			params : {
				lockProjectId : '',
				lockYyyy : '',
				searchInputId : 'searchInput_dataMerge'
			},
			singleSelect : false,
			lazyLoad : false,
			onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : true,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});
	$('#modal_dataMerge_customer_sure').click(function() {
		var selectValue = $('#dataMerge_customer_tree').tree('getTreeMultiLabel');
		if (typeof (selectValue) === 'object') {
			if(updateId != ''){
				bdoInfoBox('提示', '请选择其他合并客户（临时）');
			}else{
				$('#add_merge_list_other_customerId').val('');
			}
			return;
		} else {
			if(updateId != ''){
				addOtherCustomerSelect(updateId,selectValue);
			}else{
				$('#add_merge_list_other_customerId').val(selectValue);
			}
		}
		$('#modal_dataMerge_customer').modal('hide');
	});
	$('#modal_dataMerge_customer_reset').click(function() {
		$('#dataMerge_customer_tree').tree('reset');
	});

	// 选择合并客户
	$('#add_merge_list_other_customerId').click(function() {
		$('#modal_dataMerge_customer').modal('show');
		if ($('#dataMerge_customer_tree').hasClass('treeview')) {
			return;
		}
		$('#dataMerge_customer_tree').tree({
			url : 'finCenter/FinTreeCommon.findTempCustomerTree.json',
			params : {
				lockProjectId : '',
				lockYyyy : '',
				searchInputId : 'searchInput_dataMerge'
			},
			singleSelect : false,
			lazyLoad : false,
			onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : true,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});

	// 新增合并任务
	$('#add_merge_list_submit').click(function() {
		var mainCustomer = $('#add_merge_list_main_customerId').find('option:selected').text();
		var otherCustomer = $('#add_merge_list_other_customerId').val();
		var customer = $('#add_merge_list_customerId').find('option:selected').text();
		var yyyy = $('#add_merge_list_yyyy').val();
		var isMergeRemain = $('#add_merge_list_remain').val();
		if (mainCustomer == null || mainCustomer == '') {
			bdoInfoBox('提示', '请选择合并主客户（临时）');
			return;
		}
		if (otherCustomer == null || otherCustomer == '') {
			bdoInfoBox('提示', '请选择其他合并客户（临时）');
			return;
		}
		if (customer == null || customer == '') {
			bdoInfoBox('提示', '请选择合并后客户（正式）');
			return;
		}
		if (yyyy == null || yyyy == '') {
			bdoInfoBox('提示', '请选择年份');
			return;
		}
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.saveSubjectMergeList.json',
				type: 'post',
				data: {
					//lockProjectId: customer.split('-')[0],
					//lockYyyy: yyyy,
					param1: mainCustomer,
					param2: otherCustomer,
					param3: customer,
					param4: yyyy,
					param5: updateId,
					param6: isMergeRemain
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
						$('#modal_add_merge_list').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 修改合并任务
	$('#dataMerge_list_table').on('click', 'button[name="editBtn"]', event => {
		var object = $('#dataMerge_list_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let autoId = $(event.currentTarget).attr('data-auto-id');
		updateId = autoId;
		/*if (object.__umergeUser.userId != window.CUR_USERID) {
			bdoInfoBox('提示', '非创建人没有权限修改！');
			return;
		}*/
		$('#update_merge_list_main_customerId').val(object.mainCustomerId);
		$('#update_merge_list_other_customerId').val(object.mergeCustomerNames);
		$('#update_merge_list_customerId').val([object.projectId]).trigger('change');
		$('#update_merge_list_yyyy').val(object.yyyy);
		$('#update_merge_list_remain').val(object.isMergeRemain);
		$('#update_merge_list_main_customerId').attr('disabled', true);
		$('#update_merge_list_customerId').attr('disabled', true);
		$('#update_merge_list_yyyy').attr('disabled', true);
		$('#modal_update_merge_list').modal('show');
		/*dataMerge_otherCustomer_select_view.localParam.urlparam.param1 = updateId;
		BdoDataTable('dataMerge_add_otherCustomer_table', dataMerge_otherCustomer_select_view);
		$('#addOtherCustomerTitle').html('合并主客户：' + object.mainCustomerName + '；合并后客户：' + object.customerName + '；年份：' + object.yyyy + '');
		$('#modal_dataMerge_add_otherCustomer').modal('show');*/
	});

	// 修改合并任务
	$('#update_merge_list_submit').click(function() {
		var mainCustomer = $('#update_merge_list_main_customerId').find('option:selected').text();
		var otherCustomer = $('#update_merge_list_other_customerId').val();
		var customer = $('#update_merge_list_customerId').find('option:selected').text();
		var yyyy = $('#update_merge_list_yyyy').val();
		var isMergeRemain = $('#update_merge_list_remain').val();
		if (mainCustomer == null || mainCustomer == '') {
			bdoInfoBox('提示', '请选择合并主客户（临时）');
			return;
		}
		if (otherCustomer == null || otherCustomer == '') {
			bdoInfoBox('提示', '请选择其他合并客户（临时）');
			return;
		}
		if (customer == null || customer == '') {
			bdoInfoBox('提示', '请选择合并后客户（正式）');
			return;
		}
		if (yyyy == null || yyyy == '') {
			bdoInfoBox('提示', '请选择年份');
			return;
		}
		bdoConfirmBox('保存', '确认保存？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.saveSubjectMergeList.json',
				type: 'post',
				data: {
					//lockProjectId: customer.split('-')[0],
					//lockYyyy: yyyy,
					param1: mainCustomer,
					param2: otherCustomer,
					param3: customer,
					param4: yyyy,
					param5: updateId,
					param6: isMergeRemain
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
						$('#modal_update_merge_list').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 初始化合并任务
	$('#dataMerge_list_table').on('click', 'button[name="initBtn"]', event => {
		var object = $('#dataMerge_list_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let autoId = $(event.currentTarget).attr('data-auto-id');
		if (object.mergeStatus == '2' || object.mergeStatus == '4') {
			bdoInfoBox('提示', '数据处理中，请稍后再试');
			return;
		}
		bdoConfirmBox('保存', '初始化将会删除当前已对照数据，并获取最新财务数据，如之前成功合并过，则会获取上一次成功合并后的对照数据，确认要初始化？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.initDataMerge.json',
				type: 'post',
				data: {
					param1: autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', '请稍后查看');
						$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 删除合并任务
	$('#dataMerge_list_table').on('click', 'button[name="deleteBtn"]', event => {
		var object = $('#dataMerge_list_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let autoId = $(event.currentTarget).attr('data-auto-id');
		if (object.mergeStatus == '2' || object.mergeStatus == '4') {
			bdoInfoBox('提示', '数据处理中，请稍后再试');
			return;
		}
		bdoConfirmBox('删除', '确认要删除？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.deleteDataMerge.json',
				type: 'post',
				data: {
					param1: autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 开始合并
	$('#dataMerge_list_table').on('click', 'button[name="mergeBtn"]', event => {
		var object = $('#dataMerge_list_table').DataTable().data()[$(event.currentTarget).closest('tr').index()];
		let autoId = $(event.currentTarget).attr('data-auto-id');
		if (object.mergeStatus == '2' || object.mergeStatus == '4') {
			bdoInfoBox('提示', '数据处理中，请稍后再试');
			return;
		}
		bdoConfirmBox('保存', '确认开始数据合并？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.saveDataMerge.json',
				type: 'post',
				data: {
					param1: autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', '请稍后查看');
						$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** table 属性 */
	var dataMerge_otherCustomer_select_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/FinDataMergeJS.queryOtherCustomerSelect.json',
			urlparam: {
				sqlId: '',
				menuId: window.sys_menuId,
				param1: '',
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			scrollX: true,
			scrollY: false,
			autoWidth: false,
			//order: [2, 'asc'],
			//pageLength: 30,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="otherCustomerDeleteBtn" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '其他合并客户',
					name: 'mergeCustomerName',
					data: 'mergeCustomerName',
					width: '200px'
				}
			]
		}
	};
	// 维护合并客户
	$('#update_merge_list_other_customerId').click(function() {
		dataMerge_otherCustomer_select_view.localParam.urlparam.param1 = updateId;
		BdoDataTable('dataMerge_add_otherCustomer_table', dataMerge_otherCustomer_select_view);
		$('#modal_dataMerge_add_otherCustomer').modal('show');
	});
	//添加合并客户
	function addOtherCustomerSelect(updateId, otherCustomerId){
		$.ajax({
			url: 'finCenter/FinDataMergeJS.saveOtherCustomerSelect.json',
			type: 'post',
			data: {
				sqlId: 'DG10003',
				menuId: window.sys_menuId,
				param1: updateId,
				param2: otherCustomerId
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.success && data.data) {
					$('#update_merge_list_other_customerId').val(data.data[0].mergeCustomerNames);
					$('#dataMerge_add_otherCustomer_table').DataTable().ajax.reload(null,false);
					$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
	/** 删除合并客户 */
	$('#dataMerge_add_otherCustomer_table').on('click', 'button[name="otherCustomerDeleteBtn"]', function() {
		var object = $('#dataMerge_add_otherCustomer_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('删除', '是否确定删除？', function() {
			$.ajax({
				url: 'finCenter/FinDataMergeJS.deleteOtherCustomerSelect.json',
				type: 'post',
				data: {
					param1: updateId,
					param2: object.mergeCustomerId
				},
				dataType: 'json',
				success: function(data) {
					if (data && data.success && data.data) {
						$('#update_merge_list_other_customerId').val(data.data[0].mergeCustomerNames);
						$('#dataMerge_add_otherCustomer_table').DataTable().ajax.reload(null,false);
						$('#dataMerge_list_table').DataTable().ajax.reload(null,false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 下载操作手册
	$('#downloadDataMergeFile').click(function() {
		downloadFile('finCenter/FinDataMergeJS.downloadDataMergeFile.json', {});
	});
	//时间毫秒数转时间
	function getMyDate(str) {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
		return oTime;
	}
	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + num;
		}
		return num;
	}
});