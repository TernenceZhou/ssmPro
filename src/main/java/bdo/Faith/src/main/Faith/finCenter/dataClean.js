$(function () {
	uiBlocksApi(false, 'init');
	//获取客户下拉
	// 客户
	getUserCustomers('dataClean_customerId');

	/** table 属性 */
	var table_delete_view_index = 1;
	var table_delete_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/FinAccImportJS.viewAccData.json',
			urlparam: {
				param1: ''
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
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '处理',
					width: '100px',
					render: function (data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="data_truncate" data-placement="top" title="清除(删除此客户下所有年度数据)" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="data_delete" data-placement="top" title="删除客户本年数据" data-toggle="tooltip"><i class="fa fa-trash"></i></button>';
						return renderStr;
					}
				}, {
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '客户ID',
					width: '100px',
					name: 'customerId',
					data: 'customerId'
				}, {
					targets: table_delete_view_index++,
					className: 'text-left',
					title: '客户名称',
					width: '300px',
					name: 'customerName',
					data: 'customerName'
				}, {
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '会计年份',
					width: '100px',
					name: 'yyyy',
					data: 'yyyy',
				}, {
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '数据源',
					width: '100px',
					name: 'finSource',
					data: 'finSource',
					render: function (data, type, row, meta) {
						if (data && data != '0') {
							return DicVal2Nm(data, '财务数据源')
						}
						return '无数据';
					}
				}, {
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '上次导入时间',
					width: '100px',
					name: 'lastDate',
					data: 'lastDate'
				}, {
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '上次导入用户',
					width: '100px',
					name: '__ulastUser',
					data: '__ulastUser',
					render: function (data, type, row, meta) {
						if (data && data > '') {
							return data.userName
						}
						return '系统';
					}
				}, {
					targets: table_delete_view_index++,
					className: 'text-center',
					title: '所属机构',
					width: '100px',
					name: 'departmentId',
					data: 'departmentId',
					render: function (data, type, row, meta) {
						if (data != '0') {
							return row.__ddepartmentId.departName;
						}
						return '其他';
					}
				}
			]
		}
	};
	$('#li_dataClean').click(function () {
		$('#btn_dataClean_search').click();
	});

	/** 搜索按钮 */
	$('#btn_dataClean_search').click(function () {
		table_delete_view.localParam.urlparam.param1 = $('#dataClean_customerId').val();
		BdoDataTable('table_dataClean', table_delete_view);
	});
	// 清除数据(所有年份)
	$('#table_dataClean').on('click', 'button[name="data_truncate"]', function () {
		var object = $('#table_dataClean').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('清除账套', '确认是否清除客户[' + object.customerId + ']所有财务数据？', function () {
			bdoInProcessingBox('删除中,请稍后!');
			deleteAccData(object.customerId, object.yyyy, object.departmentId, '1');
		});
	});
	// 删除数据(选择年份)
	$('#table_dataClean').on('click', 'button[name="data_delete"]', function () {
		var object = $('#table_dataClean').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('清除账套', '确认是否删除客户[' + object.customerId + ']' + object.yyyy + '年度财务数据？', function () {
			bdoInProcessingBox('删除中,请稍后!');
			deleteAccData(object.customerId, object.yyyy, object.departmentId, '0');
		});
	});

	function deleteAccData(customerId, yyyy, departId, deleteType) {
		$.ajax({
			url: 'finCenter/FinAccImportJS.deleteAccData.json',
			type: 'post',
			data: {
				lockProjectId: customerId,
				lockYyyy: yyyy,
				param1: departId,
				param2: deleteType
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#table_dataClean').DataTable().ajax.reload();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}
});