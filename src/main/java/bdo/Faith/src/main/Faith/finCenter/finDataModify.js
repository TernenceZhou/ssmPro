$(document).ready(function() {
	uiBlocksApi(false, 'init');

	// 查询条件
	getUserCustomers('modify_customerId');
	getUserCustomers('modify_profit_customerId');
	getUserCustomers('modify_transfer_customerId');
	getUserCustomers('modify_sapsubject_customerId');
	$('#modify_yyyy,#modify_profit_yyyy,#modify_transfer_yyyy,#modify_sapsubject_yyyy').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 2,
		minViewMode: 2,
		language: 'zh-CN', //语言设置
		format: 'yyyy' //日期显示格式
	});
	let startyear = window.CUR_PROJECT_START_YEAR;
	if (window.transferedMenu) {
		startyear = window.BDO_YEAR_SELECT + '';
		window.BDO_CUSTOMER_SELECT = window.BDO_CUSTOMER_SELECT_temp;
		window.BDO_YEAR_SELECT = window.BDO_YEAR_SELECT_temp;
		window.transferedMenu = false;
	}
	if (!startyear || startyear == '') {
		startyear = new Date().getFullYear();
	}
	$('#modify_yyyy,#modify_profit_yyyy,#modify_transfer_yyyy,#modify_sapsubject_yyyy').val(startyear);
	$('#modify_modal_edit_direction').html(ComboLocalDicOption(true, '方向'));

	// 科目方向修正
	/** table 属性 */
	var modify_direction_tabparam_index = 1;
	var modify_direction_tabparam = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				sqlId: 'FIN202004',
				menuId: window.sys_menuId,
				lockProjectId: $('#modify_customerId').val(),
				lockYyyy: $('#modify_yyyy').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			columnDefs: [
				{
					targets: modify_direction_tabparam_index++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: 10,
					render: function(data, type, row, meta) {
						return '<button class="btn btn-xs btn-danger" type="button" name="modifyDirection" data-placement="top" title="修改科目方向" data-toggle="tooltip"><i class="fa fa-edit"></i></button>';
					}
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '客户ID',
					name: 'customerId',
					data: 'customerId',
					width: 20
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 20
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 100,
					render: function(data, type, row, meta) {
						return data + '-' + row.subjectName
					}
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '方向',
					name: 'direction',
					data: 'direction',
					width: 30,
					render: function(data, type, row, meta) {
						if (data == '1') {
							return '借';
						} else if (data == '-1') {
							return '贷';
						} else {
							return '-';
						}
					}
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '期初',
					name: 'remain',
					data: 'remain',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOcc',
					data: 'debitOcc',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOcc',
					data: 'creditOcc',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}, {
					targets: modify_direction_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '期末',
					name: 'balance',
					data: 'balance',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}
			]
		}
	};

	/** 搜索按钮 */
	$('#modify_direction_search').click(function() {
		if ($('#modify_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户!');
			return;
		}
		if ($('#modify_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择年份!');
			return;
		}
		modify_direction_tabparam.localParam.urlparam.lockProjectId = $('#modify_customerId').val();
		modify_direction_tabparam.localParam.urlparam.lockYyyy = $('#modify_yyyy').val();
		BdoDataTable('modify_directiontable', modify_direction_tabparam);
	});

	$('#modify_directiontable').on('click', 'button[name="modifyDirection"]', function() {
		var object = $('#modify_directiontable').DataTable().data()[$(this).closest('tr').index()];
		$('#modify_modal_edit_subject').attr('data-result', object.subjectId);
		$('#modify_modal_edit_subject').val(object.subjectId + '-' + object.subjectName);
		$('#modify_modal_edit_direction').val(object.direction);
		$('#modify_modal_edit').modal('show');
	});

	$('#modify_modal_edit_save').click(function() {
		var subjectId = $('#modify_modal_edit_subject').attr('data-result');
		if (!subjectId || subjectId == '') {
			bdoInfoBox('提示', '请选择科目!');
			return;
		}
		var direction = $('#modify_modal_edit_direction').val();
		if (direction != -1 && direction != 1) {
			bdoInfoBox('提示', '请选择科目方向!');
			return;
		}
		bdoConfirmBox('调整方向', '确认是否调整科目[' + $('#modify_modal_edit_subject').val() + ']的方向？', function() {
			bdoInProcessingBox('修改中,请稍后!');
			$.ajax({
				url: 'finCenter/AccountAll.modifySubjectDirection.json',
				type: 'post',
				data: {
					lockProjectId: modify_direction_tabparam.localParam.urlparam.lockProjectId,
					lockYyyy: modify_direction_tabparam.localParam.urlparam.lockYyyy,
					param1: subjectId,
					param2: direction
				},
				dataType: 'json',
				success: function(data) {
					$('#modify_modal_edit').modal('hide');
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modify_directiontable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	// 本年利润对方科目
	/** table 属性 */
	var modify_profit_tabparam_index = 1;
	var modify_profit_tabparam = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				sqlId: 'FIN202009',
				menuId: window.sys_menuId,
				lockProjectId: $('#modify_profit_customerId').val(),
				lockYyyy: $('#modify_profit_yyyy').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			pageLength: 30,
			order: [5, 'asc'],
			//dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			columnDefs: [
				{
					targets: modify_profit_tabparam_index++,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectId',
					data: 'subjectId',
					width: 100,
					render: function(data, type, row, meta) {
						return data + '-' + row.subjectFullName
					}
				}, {
					targets: modify_profit_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '方向',
					name: 'direction',
					data: 'direction',
					width: 30,
					render: function(data, type, row, meta) {
						if (data == '1') {
							return '借';
						} else if (data == '-1') {
							return '贷';
						} else {
							return '-';
						}
					}
				}, {
					targets: modify_profit_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: 20
				}, {
					targets: modify_profit_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: 20
				}, {
					targets: modify_profit_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: 20
				}, {
					targets: modify_profit_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '发生额',
					name: 'occurValue',
					data: 'occurValue',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}, {
					targets: modify_profit_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '对方科目',
					name: 'oppositeSubjectValue',
					data: 'oppositeSubjectValue',
					width: 20
				}
			]
		}
	};

	// 客户,年度 改变 科目树更新
	$('#modify_profit_customerId,#modify_profit_yyyy').change(function() {
		var tree = $('#subject_modify_tree');
		if (tree.hasClass('treeview')) {
			tree.tree('reset');
			tree.tree('destory');
		}
	});

	// 选择科目
	$('#modify_profit_subjectid').focus(function() {
		if ($('#modify_profit_customerId').val() == '') {
			$('#modify_profit_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#modify_profit_yyyy').val() == '') {
			$('#modify_profit_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_modify_subjectid').modal('show');
		if ($('#subject_modify_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_modify_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#modify_profit_customerId').val(),
				lockYyyy: $('#modify_profit_yyyy').val(),
				searchInputId: 'searchInput_modify'
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
	$('#modal_modify_subjectid_sure').click(function() {
		var selectValue = $('#subject_modify_tree').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			$('#modify_profit_subjectid').val('');
		} else {
			$('#modify_profit_subjectid').val(selectValue);

		}
		$('#modal_modify_subjectid').modal('hide');
	});
	$('#modal_modify_subjectid_reset').click(function() {
		$('#subject_modify_tree').tree('reset');
	});

	/** 搜索按钮 */
	$('#modify_profit_search').click(function() {
		if ($('#modify_profit_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户!');
			return;
		}
		if ($('#modify_profit_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择年份!');
			return;
		}
		modify_profit_tabparam.localParam.urlparam.lockProjectId = $('#modify_profit_customerId').val();
		modify_profit_tabparam.localParam.urlparam.lockYyyy = $('#modify_profit_yyyy').val();
		modify_profit_tabparam.localParam.urlparam.param3 = $('#modify_profit_subjectid').val();
		BdoDataTable('modify_profittable', modify_profit_tabparam);
		/** 行双击 */
		$('#modify_profittable tbody').on('dblclick', 'tr', function() {
			var object = $('#modify_profittable').DataTable().data()[$(this).closest('tr').index()];
			voucherTab('tab_detailaccount', $('#modify_profit_customerId').val(), object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});
	/** 修改对方科目按钮 */
	$('#modify_profit_update').click(function() {
		if ($('#modify_profit_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户!');
			return;
		}
		if ($('#modify_profit_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择年份!');
			return;
		}
		bdoConfirmBox('对方科目修复', '确认是否修正所有含有本年利润科目的凭证的对方科目？', function() {
			bdoInProcessingBox('修改中,请稍后!');
			$.ajax({
				url: 'finCenter/AccountAll.updateOppositeSubject.json',
				type: 'post',
				data: {
					lockProjectId: $('#modify_profit_customerId').val(),
					lockYyyy: $('#modify_profit_yyyy').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modify_profittable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	// 结转科目
	/** table 属性 */
	var modify_transfer_tabparam_index = 1;
	var modify_transfer_tabparam = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				sqlId: 'FIN202012',
				menuId: window.sys_menuId,
				lockProjectId: $('#modify_transfer_customerId').val(),
				lockYyyy: $('#modify_transfer_yyyy').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			pageLength: 30,
			// dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			columnDefs: [
				{
					targets: modify_transfer_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '凭证日期',
					name: 'vchDate',
					data: 'vchDate',
					width: 70
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '字',
					name: 'typeId',
					data: 'typeId',
					width: 20
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: true,
					className: 'text-center',
					title: '号',
					name: 'oldVoucherId',
					data: 'oldVoucherId',
					width: 20
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: 200,
					render: function(data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: 60
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: 200
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '借方发生额',
					name: 'debitOcc',
					data: 'debitOcc',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}, {
					targets: modify_transfer_tabparam_index++,
					orderable: false,
					className: 'text-right',
					title: '贷方发生额',
					name: 'creditOcc',
					data: 'creditOcc',
					width: 60,
					render: function(data, type, row, meta) {
						if (data) {
							return formatMoney(data);
						}
						return '-';
					}
				}
			]
		}
	};

	/** 搜索按钮 */
	$('#modify_transfer_search').click(function() {
		if ($('#modify_transfer_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户!');
			return;
		}
		if ($('#modify_transfer_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择年份!');
			return;
		}
		modify_transfer_tabparam.localParam.urlparam.lockProjectId = $('#modify_transfer_customerId').val();
		modify_transfer_tabparam.localParam.urlparam.lockYyyy = $('#modify_transfer_yyyy').val();
		BdoDataTable('modify_transfer_table', modify_transfer_tabparam);
		/** 行双击 */
		$('#modify_transfer_table tbody').on('dblclick', 'tr', function() {
			var object = $('#modify_transfer_table').DataTable().data()[$(this).closest('tr').index()];
			voucherTab('tab_detailaccount', $('#modify_transfer_customerId').val(), object.typeId, object.oldVoucherId, object.vchDate, object.voucherId);
		});
	});

	// 客户,年度 改变 科目树更新
	$('#modify_transfer_customerId,#modify_transfer_yyyy').change(function() {
		var tree = $('#subject_modify_transfer_tree');
		if (tree.hasClass('treeview')) {
			tree.tree('reset');
			tree.tree('destory');
		}
	});

	// 设置结转科目
	$('#modify_transfer_set').click(function() {
		if ($('#modify_transfer_customerId').val() == '') {
			$('#modify_transfer_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#modify_transfer_yyyy').val() == '') {
			$('#modify_transfer_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_modify_transfer_subjectid').modal('show');
		if ($('#subject_modify_transfer_tree').hasClass('treeview')) {
			return;
		}
		$('#subject_modify_transfer_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccTopSubject.json',
			params: {
				lockProjectId: $('#modify_transfer_customerId').val(),
				lockYyyy: $('#modify_transfer_yyyy').val(),
				searchInputId: 'searchInput_modify'
			},
			singleSelect: false,
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

	$('#modify_transfer_cancel').click(function() {
		if ($('#modify_transfer_customerId').val() == '') {
			$('#modify_transfer_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#modify_transfer_yyyy').val() == '') {
			$('#modify_transfer_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		bdoConfirmBox('取消结转', '确认取消设置所有科目为结转科目？', function() {
			bdoInProcessingBox('设置中,请稍后!');
			$.ajax({
				url: 'finCenter/AccountAll.saveTransferSubject.json',
				type: 'post',
				data: {
					lockProjectId: $('#modify_transfer_customerId').val(),
					lockYyyy: $('#modify_transfer_yyyy').val(),
					param1: '',
					param2: 0
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modify_transfer_table').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	$('#modal_modify_transfer_subjectid_sure').click(function() {
		var selectValue = $('#subject_modify_transfer_tree').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			$('#modify_transfer_subjectid').val('');
		} else {
			$('#modal_modify_transfer_subjectid').modal('hide');
			if ($('#modify_transfer_customerId').val() == '') {
				bdoInfoBox('提示', '请选择客户!');
				return;
			}
			if ($('#modify_transfer_yyyy').val() == '') {
				bdoInfoBox('提示', '请选择年份!');
				return;
			}
			bdoConfirmBox('设置结转', '确认设置科目[' + selectValue + ']为结转科目？', function() {
				bdoInProcessingBox('设置中,请稍后!');
				$.ajax({
					url: 'finCenter/AccountAll.saveTransferSubject.json',
					type: 'post',
					data: {
						lockProjectId: $('#modify_transfer_customerId').val(),
						lockYyyy: $('#modify_transfer_yyyy').val(),
						param1: selectValue,
						param2: 1
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#modify_transfer_table').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		}
	});
	$('#modal_modify_transfer_subjectid_reset').click(function() {
		$('#subject_modify_transfer_tree').tree('reset');
	});

	// SAP科目树处理
	/** table 属性 */
	var modify_sapsubject_tabparam_index = 1;
	var modify_sapsubject_tabparam = {
		localParam: {
			tabNum: true,
			url: 'finCenter/General.query.json',
			urlparam: {
				sqlId: 'FIN202015',
				menuId: window.sys_menuId,
				lockProjectId: $('#modify_sapsubject_customerId').val(),
				lockYyyy: $('#modify_sapsubject_yyyy').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			ordering: false,
			serverSide: true,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			columnDefs: [
				{
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					name: 'subjectLevel',
					data: 'subjectLevel',
					width: 100,
					render: function(data, type, row, meta) {
						if (data == '1') {
							return '<button class="btn btn-xs btn-warning" type="button" name="modifySapSubject" data-placement="top" title="修改科目编号级次" data-toggle="tooltip"><i class="fa fa-legal"></i></button>';
						}
						return '';
					}
				}, {
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: 100
				}, {
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: 500
				}, {
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '科目全名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: 500
				}, {
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-center',
					title: '科目方向',
					name: 'direction',
					data: 'direction',
					width: 100,
					render: function(data, type, row, meta) {
						if (data == '1') {
							return '借';
						} else {
							return '贷';
						}
					}
				}, {
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-center',
					title: '科目编号层级',
					name: 'subjectLevel',
					data: 'subjectLevel',
					width: 100
				}, {
					targets: modify_sapsubject_tabparam_index++,
					orderable: false,
					className: 'text-left',
					title: '父科目编号',
					name: 'parentSubjectId',
					data: 'parentSubjectId',
					width: 100
				}
			]
		}
	};

	/** 搜索按钮 */
	$('#modify_sapsubject_search').click(function() {
		if ($('#modify_sapsubject_customerId').val() == '') {
			bdoInfoBox('提示', '请选择客户!');
			return;
		}
		if ($('#modify_sapsubject_yyyy').val() == '') {
			bdoInfoBox('提示', '请选择年份!');
			return;
		}
		modify_sapsubject_tabparam.localParam.urlparam.lockProjectId = $('#modify_sapsubject_customerId').val();
		modify_sapsubject_tabparam.localParam.urlparam.lockYyyy = $('#modify_sapsubject_yyyy').val();
		BdoDataTable('modify_sapsubject_table', modify_sapsubject_tabparam);
	});

	$('#modify_sapsubject_table').on('click', 'button[name="modifySapSubject"]', function() {
		var object = $('#modify_sapsubject_table').DataTable().data()[$(this).closest('tr').index()];
		$('#modal_modify_sapsubject_setlevel_row').show();
		$('#modal_modify_sapsubject_setlevel_subjectId').val(object.subjectId);

		$('#modal_modify_sapsubject_setlevel').modal('show');
	});

	$('#modify_sapsubject_set').click(function() {
		$('#modal_modify_sapsubject_setlevel_row').hide();
		$('#modal_modify_sapsubject_setlevel_subjectId').val('');

		$('#modal_modify_sapsubject_setlevel').modal('show');
	});

	$('#modal_modify_sapsubject_setlevel_save').click(function() {
		if ($('#modal_modify_sapsubject_setlevel_level').val() == '') {
			bdoInfoBox('提示', '请输入科目层级!');
			$('#modal_modify_sapsubject_setlevel_level').focus();
			return;
		}
		$('#modal_modify_sapsubject_subjecttree').modal('show');
		$('#modal_modify_sapsubject_setlevel').modal('hide');
	});

	$('#modal_modify_sapsubject_subjecttree').on('shown.bs.modal', function() {
		var modify_sapsubject_save_tabparam_index = 1;
		var modify_sapsubject_save_tabparam = {
			localParam: {
				tabNum: true,
				url: 'finCenter/FinModifyJS.findSapSubject.json',
				urlparam: {
					menuId: window.sys_menuId,
					lockProjectId: $('#modify_sapsubject_customerId').val(),
					lockYyyy: $('#modify_sapsubject_yyyy').val(),
					param1: $('#modal_modify_sapsubject_setlevel_subjectId').val(),
					param2: $('#modal_modify_sapsubject_setlevel_level').val(),
					param3: $('#modal_modify_sapsubject_setlevel_separ').val()
				}
			},
			tableParam: {
				select: false,
				lengthChange: false,
				ordering: false,
				serverSide: true,
				scrollY: 380,
				dom: '<"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				columnDefs: [
					{
						targets: modify_sapsubject_save_tabparam_index++,
						orderable: false,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: 100,
						render: function(data, type, row, meta) {
							return '<span name="subjectId">' + data + '</span><span style="display:none;" name="direction">' + row.direction + '</span><span style="display:none;" name="subjectLevel">' + row.subjectLevel + '</span>';
						}
					}, {
						targets: modify_sapsubject_save_tabparam_index++,
						orderable: false,
						className: 'text-left',
						title: '科目名称',
						name: 'subjectName',
						data: 'subjectName',
						width: 400,
						render: function(data, type, row, meta) {
							return '<input class="form-control" type="text" name="subjectName" value="' + data + '">';
						}
					}, {
						targets: modify_sapsubject_save_tabparam_index++,
						orderable: false,
						className: 'text-left',
						title: '父科目编号',
						name: 'parentSubjectId',
						data: 'parentSubjectId',
						width: 100,
						render: function(data, type, row, meta) {
							return '<input class="form-control" type="text" name="parentSubjectId" value="' + data + '">';
						}
					}
				]
			}
		};
		BdoDataTable('modal_modify_sapsubject_subjecttree_table', modify_sapsubject_save_tabparam);
	});

	$('#modal_modify_sapsubject_subjecttree_save').click(function() {
		var subjectJson = new Array();
		$('#modal_modify_sapsubject_subjecttree_table tbody tr').each(function() {
			subjectJson.push({
				subjectId: $(this).find('span[name="subjectId"]').text(),
				subjectName: $(this).find('input[name="subjectName"]').val(),
				parentSubjectId: $(this).find('input[name="parentSubjectId"]').val(),
				direction: $(this).find('span[name="direction"]').text(),
				subjectLevel: $(this).find('span[name="subjectLevel"]').text()
			});
		});
		$.ajax({
			url: 'finCenter/FinModifyJS.setSapSubject.json',
			type: 'post',
			data: {
				lockProjectId: $('#modify_sapsubject_customerId').val(),
				lockYyyy: $('#modify_sapsubject_yyyy').val(),
				param1: $('#modal_modify_sapsubject_setlevel_level').val(),
				jsonData: JSON.stringify(subjectJson)
			},
			dataType: 'json',
			success: function(data) {
				$('#modal_modify_sapsubject_subjecttree').modal('hide');
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});