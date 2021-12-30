$(function () {
	uiBlocksApi(false, 'init');
	//客户 日期设置
	getCustomerForImport('account_customerId_model', $('#modal-importCustomerReport'));
	//获取客户下拉
	// 客户
	getUserCustomers('detail_customerId', '');
	getUserCustomers('detail_delete__customerId');

	$('#fileType').html(ComboLocalDicOption(false, '财务数据模板类型'));

	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 2,
		minViewMode: 2,
		language: 'zh-CN', //语言设置
		format: 'yyyy' //日期显示格式
	});
	//补0操作
	function getzf(num) {
		if (parseInt(num) < 10) {
			num = '0' + parseInt(num);
		}
		return num;
	}
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

	/** table 属性 */
	var accdetail_view_index = 1;
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FIN203001',
				menuId: window.sys_menuId,
				lockProjectId: '',
				lockYyyy: '',
				param1: window.sys_userId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			scrollX: true,
			ordering: true,
			serverSide: true,
			order: [6, 'desc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: accdetail_view_index++,
					orderable: false,
					visible: false,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					width: '50px'
				}, {
					targets: accdetail_view_index++,
					orderable: false,
					visible: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function (data, type, row, meta) {
						var renderStr = '';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="dataImportTemplateStop" data-placement="top" title="停止" data-toggle="tooltip"><i class="fa fa-stop"></i></button>';
						return renderStr;
					}
				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-left',
					title: '客户名称',
					name: 'customerName',
					data: 'customerName',
					width: '200px'
				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-center',
					title: '会计年份',
					name: 'yyyy',
					data: 'yyyy',
					width: '60px'
				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-center',
					title: '操作人',
					name: '__uuploadUserName',
					data: '__uuploadUserName',
					width: '60px'

				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-center',
					title: '导入开始时间',
					name: 'importStartDate',
					data: 'importStartDate',
					width: '100px',
					render: function (data, type, row, meta) {
						return data == null ? '' : getMyDate(data);
					}
				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-center',
					title: '导入结束时间',
					name: 'importEndDate',
					data: 'importEndDate',
					width: '100px',
					render: function (data, type, row, meta) {
						return data == null ? '' : getMyDate(data);
					}
				}, {
					targets: accdetail_view_index++,
					orderable: false,
					className: 'text-center',
					title: '导入状态',
					name: 'importState',
					data: 'importState',
					width: '100px',
					render: function (data, type, row, meta) {
						return DicVal2Nm(data, '财务数据导入状态');
					}
				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-left',
					title: '导入结果',
					name: 'checkoutResult',
					data: 'checkoutResult',
					width: '300px',
					render: function (data, type, row, meta) {
						return data && data.length > 50 ? (data.substring(0, 50) + '...') : data;
					}
				}, {
					targets: accdetail_view_index++,
					orderable: true,
					className: 'text-left',
					title: '文件名',
					name: 'fileName',
					data: 'fileName',
					width: '100px'
				}
			]
		}
	};
	BdoDataTable('subjectEntry', accdetail_view);
	$('#li_detailaccountser').click(function () {
		accdetail_view.localParam.urlparam.lockProjectId = $('#detail_customerId').val();
		accdetail_view.localParam.urlparam.lockYyyy = $('#search_startDate').val();
		BdoDataTable('subjectEntry', accdetail_view);
	});

	/** 搜索按钮 */
	$('#btn_search').click(function () {
		accdetail_view.localParam.urlparam.lockProjectId = $('#detail_customerId').val();
		accdetail_view.localParam.urlparam.lockYyyy = $('#search_startDate').val();
		BdoDataTable('subjectEntry', accdetail_view);
	});

	/** 导入客户余额表按钮 */
	$('#btn_import').click(function () {
		$('#modal-importCustomerReport').modal('show');
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
			uploadUrl: 'finCenter/FinAccImportJS.importAccFile.json',
			uploadExtraData: function () {
				return {
					lockProjectId: '',
					lockYyyy: ''
				};
			}
		};
		pluginOpt.uploadExtraData = function () {
			return {
				param1: $('#account_customerId_model').find('option:selected').text(),
				param2: $('#fileType').find('option:selected').val(),
				param3: $('#account_customerId_model').val(),
				param4: $('#account_yyyy_model').val()
			};
		};
		var $el = $('#fileinput').fileinput(pluginOpt);
		$el.on('filebatchuploadsuccess', function (event, data) {
			accdetail_view.localParam.urlparam.lockProjectId = $('#detail_customerId').val();
			accdetail_view.localParam.urlparam.lockYyyy = $('#search_startDate').val();
			BdoDataTable('subjectEntry', accdetail_view);
			if (!data.response.success) {
				bdoErrorBox('系统提示', data.response.resultInfo.statusText);
			} else {
				bdoSuccessBox('上传成功');
			}
			$('#modal-importCustomerReport').modal('hide');
			$('#fileinput').fileinput('clear');
			$('#fileinput').fileinput('enable');
		});
		$el.on('filebatchuploaderror', function (event, data, msg) {
			accdetail_view.localParam.urlparam.lockProjectId = $('#detail_customerId').val();
			accdetail_view.localParam.urlparam.lockYyyy = $('#search_startDate').val();
			BdoDataTable('subjectEntry', accdetail_view);
			bdoErrorBox('系统提示', msg);
			$('#modal-importCustomerReport').modal('hide');
			$('#fileinput').fileinput('clear');
			$('#fileinput').fileinput('enable');
		});
		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}
		/** 导入按钮 */
		$('#import_submit').off();
		$('#import_submit').click(function () {
			var fileUrl = $('#fileinput').val();
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			var tip = '确认导入' + $('#account_customerId_model').find('option:selected').text() + $('#account_yyyy_model').val() + '年的财务数据吗？';
			bdoConfirmBox('确认', tip, function () {
				uploadFile();
			});
		});
	});

	/** 下载模板按钮 */
	$('#btn_downtemp li a').click(function (e) {
		downloadFile('finCenter/FinAccImportJS.downloadTemp.json', { 'fileType': $(e.target).data('value') });
	});

	//停止任务
	$('#subjectEntry').on('click', 'button[name="dataImportTemplateStop"]', function () {
		var object = $('#subjectEntry').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('停止', '确认停止任务？', function () {
			$.ajax({
				url: 'finCenter/FinAccImportJS.stopImportTask.json',
				type: 'post',
				data: {
					param1: object.customerId,
					param2: object.yyyy
				},
				dataType: 'json',
				success: function (data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#searchEngineIndexTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	// 生成上年0金额财务数据
	$('#import_blankdata').click(function () {
		if ($('#account_customerId_model').val() == '') {
			bdoInfoBox('提示', '请选择客户!');
			return;
		}
		if ($('#account_yyyy_model').val() == '') {
			bdoInfoBox('提示', '请选择会计年份!');
			return;
		}
		var tip = '确认导入' + $('#account_customerId_model').find('option:selected').text() + $('#account_yyyy_model').val() + '年的0金额财务数据吗？';
		bdoConfirmBox('确认', tip, function () {
			$.ajax({
				url: 'finCenter/FinAccImportJS.importBlankData.json',
				type: 'post',
				data: {
					param1: $('#account_customerId_model').find('option:selected').text(),
					param3: $('#account_customerId_model').val(),
					param4: parseInt($('#account_yyyy_model').val()) + 1
				},
				dataType: 'json',
				success: function (data) {
					$('#modal-importCustomerReport').modal('hide');
					$('#fileinput').fileinput('clear');
					$('#fileinput').fileinput('enable');
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#searchEngineIndexTable').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

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
					title: '所属机构',
					width: '100px',
					name: '__ddepartIdName',
					data: '__ddepartIdName'
				}
			]
		}
	};
	$('#li_accdata_delete').click(function () {
		$('#btn_delete_search').click();
	});

	/** 搜索按钮 */
	$('#btn_delete_search').click(function () {
		table_delete_view.localParam.urlparam.param1 = $('#detail_delete__customerId').val();
		BdoDataTable('table_delete', table_delete_view);
	});
	// 清除数据(所有年份)
	$('#table_delete').on('click', 'button[name="data_truncate"]', function () {
		var object = $('#table_delete').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('清除账套', '确认是否清除客户[' + object.customerId + ']所有财务数据？', function () {
			deleteAccData(object.customerId, object.yyyy, object.departmentId, '1');
		});
	});
	// 删除数据(选择年份)
	$('#table_delete').on('click', 'button[name="data_delete"]', function () {
		var object = $('#table_delete').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('清除账套', '确认是否删除客户[' + object.customerId + ']' + object.yyyy + '年度财务数据？', function () {
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
					$('#table_delete').DataTable().ajax.reload();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}

	$('#viewFinManual').click(function() {
		window.open('finCenter/FinAccImportJS.viewFinManual.json', '', 'location=no');
	});
});