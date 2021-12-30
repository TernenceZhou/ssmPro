$(document).ready(function() {
	uiBlocksApi(false, 'init');

	var importState;
	var reportId;
	//获取客户下拉
	// 客户
	getUserCustomers('historyReportImport_customerId');

	//项目
	if ((CUR_CUSTOMERID != null && window.CUR_CUSTOMERID != '' && window.CUR_CUSTOMERID != 'null')) {
		$('#historyReportImport_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, { param1: window.CUR_CUSTOMERID }));
		$('#historyReportImport_projectId').val(window.CUR_PROJECTID);
	}
	//客户选择
	$('#historyReportImport_customerId').change(function() {
		$('#historyReportImport_projectId').html(ComboDBOptionWithParam('cpBase/Combo.findCustomerProject.json', false, { param1: $('#historyReportImport_customerId').val() }));
	});

	/** table 属性 */
	var accdetail_view_inx = 0;
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'WD000015',
				menuId: window.sys_menuId,
				param2: '',
				param3: window.sys_userId
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: true,
			serverSide: true,
			order: [6, 'desc'],
			pageLength: 30,
			columnDefs: [
				{
					targets: accdetail_view_inx++,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 25
				}, {
					targets: accdetail_view_inx++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: 10,
					render: function(data, type, row, meta) {
						return '<button class="btn btn-xs btn-success" type="button" name="historyReportImportBtn" data-placement="top" title="查看" data-toggle="tooltip"><i class="fa fa-eye"></i></button>';
					}
				}, {
					targets: accdetail_view_inx++,
					orderable: true,
					className: 'text-left',
					title: '客户',
					name: 'customerName',
					data: 'customerName',
					width: 50
				}, {
					targets: accdetail_view_inx++,
					orderable: true,
					className: 'text-left',
					title: '项目',
					name: 'projectName',
					data: 'projectName',
					width: 70
				}, {
					targets: accdetail_view_inx++,
					orderable: true,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 30
				}, {
					targets: accdetail_view_inx++,
					orderable: true,
					className: 'text-center',
					title: '操作人',
					name: '__uuploadUserName',
					data: '__uuploadUserName',
					width: 30

				}, {
					targets: accdetail_view_inx++,
					orderable: true,
					className: 'text-center',
					title: '操作日期',
					name: 'uploadTime',
					data: 'uploadTime',
					width: 30,
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}

				}, {
					targets: accdetail_view_inx++,
					orderable: true,
					className: 'text-left',
					title: '文件名',
					name: 'fileName',
					data: 'fileName',
					width: 50
				}, {
					targets: accdetail_view_inx++,
					orderable: false,
					className: 'text-left',
					title: '导入状态',
					name: 'importState',
					data: 'importState',
					width: 30,
					render: function(data, type, row, meta) {
						switch (data) {
							case '0':
								return '上传成功';
							case '1':
								return '审核完成';
							case '2':
								return '计算完成';
							case '9':
								return '处理失败';
							default:
								return '错误';
						}
					}
				}
			]
		}
	};

	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		maxViewMode: 2,
		minViewMode: 2,
		language: 'zh-CN', //语言设置
		format: 'yyyy' //日期显示格式
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
			num = '0' + parseInt(num);
		}
		return num;
	}

	/** 搜索按钮 */
	$('#btn_historyReportImport_search').click(function() {
		accdetail_view.localParam.urlparam.lockCustomerId = $('#historyReportImport_customerId').val();
		accdetail_view.localParam.urlparam.lockProjectId = $('#historyReportImport_projectId').val();
		accdetail_view.localParam.urlparam.param2 = $('#historyReportImport_yyyy').val();
		BdoDataTable('historyReportImport', accdetail_view);
		$('#historyReportImport_block').show();
	});

	/** 导入客户余额表按钮 */
	$('#btn_historyReportImport_import').click(function() {
		$('#modal-historyReportImport').modal('show');
		var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			acceptedFiles: '.xlsx',
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
			uploadAsync: true,
			uploadUrl: 'wind/HistoryReportImport.importHistoryReportFile.json',
			uploadExtraData: function() {
				return {
					param1: '1',
					param2: ''
				};
			}
		};
		pluginOpt.uploadExtraData = function() {
			return {
				lockCustomerId: $('#historyReportImport_customerId').val(),
				lockProjectId: $('#historyReportImport_projectId').val(),
				param1: $('#historyReportImport_yyyy').val(),
				param2: $('#historyReportImport_customerId').find('option:selected').text(),
				param3: $('#historyReportImport_projectId').find('option:selected').text()
			};
		};
		var $el = $('#historyReportImport_fileinput').fileinput('refresh', pluginOpt);
		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('导入成功');
			$('#modal-historyReportImport').modal('hide');
			$('#historyReportImport_fileinput').fileinput('clear');
			$('#historyReportImport_fileinput').fileinput('enable');
			accdetail_view.localParam.urlparam.lockCustomerId = $('#historyReportImport_customerId').val();
			accdetail_view.localParam.urlparam.lockProjectId = $('#historyReportImport_projectId').val();
			accdetail_view.localParam.urlparam.param2 = $('#historyReportImport_yyyy').val();
			BdoDataTable('historyReportImport', accdetail_view);
			$('#historyReportImport_block').show();
			//uploadFileSuccess(data);
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', msg);
			//uploadFileSuccess(data);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {

		}

		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}

		/** 导入按钮 */
		$('#historyReportImport_submit').click(function() {
			var fileUrl = $('#historyReportImport_fileinput').val();
			if (fileUrl == null || fileUrl == '') {
				bdoInfoBox('提示', '请选择导入文件');
				return;
			}
			var tip = '确认导入' + $('#historyReportImport_customerId').find('option:selected').text() + $('#historyReportImport_yyyy').val() + '年的历史报告吗？';
			bdoConfirmBox('确认', tip, function() {
				uploadFile();
			});
		});


	});

	/** 下载模板按钮 */
	$('#btn_downtemp_historyReportImport').click(function(e) {
		downloadFile('wind/HistoryReportImport.downloadTemp.json', {});
	});

	/** table 属性 */
	var zc_view = 1;
	var zc_view = {
		localParam: {
			tabNum: true,
			url: 'wind/historyReportImport.queryHistoryReportZcList.json',
			urlparam: {
				param1: '',
				param2: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			//order: [1, 'desc'],
			//pageLength: 30,
			columnDefs: [
				{
					targets: zc_view++,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: zc_view++,
					orderable: true,
					className: 'text-right',
					title: '金额',
					name: 'amount',
					data: 'amount',
					width: '60px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	/** table 属性 */
	var lr_view = 1;
	var lr_view = {
		localParam: {
			tabNum: true,
			url: 'wind/historyReportImport.queryHistoryReportLrList.json',
			urlparam: {
				param1: '',
				param2: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			//order: [1, 'desc'],
			//pageLength: 30,
			columnDefs: [
				{
					targets: lr_view++,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: lr_view++,
					orderable: true,
					className: 'text-right',
					title: '金额',
					name: 'amount',
					data: 'amount',
					width: '60px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	/** table 属性 */
	var xj_view = 1;
	var xj_view = {
		localParam: {
			tabNum: true,
			url: 'wind/historyReportImport.queryHistoryReportXjList.json',
			urlparam: {
				param1: '',
				param2: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			ordering: false,
			serverSide: true,
			scrollY: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			//order: [1, 'desc'],
			//pageLength: 30,
			columnDefs: [
				{
					targets: xj_view++,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: xj_view++,
					orderable: true,
					className: 'text-right',
					title: '金额',
					name: 'amount',
					data: 'amount',
					width: '60px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}
			]
		}
	};

	//弹出审核页
	$('#historyReportImport').on('click', 'button[name="historyReportImportBtn"]', function() {
		$('#historyReportImport-modal').modal('show');
		$('#historyReportImport-modal').draggable();
		$('#historyReportImport-modal').css('overflow-y', 'scroll');
		var object = $('#historyReportImport').DataTable().data()[$(this).closest('tr').index()];
		importState = object.importState;
		reportId = object.id;
		zc_view.localParam.urlparam.param1 = object.id;
		zc_view.localParam.urlparam.param2 = 'wind_balance_sheet';
		BdoDataTable('zc_report_table', zc_view);
		lr_view.localParam.urlparam.param1 = object.id;
		lr_view.localParam.urlparam.param2 = 'wind_profit_statement';
		BdoDataTable('lr_report_table', lr_view);
		xj_view.localParam.urlparam.param1 = object.id;
		xj_view.localParam.urlparam.param2 = 'wind_cash_flow_statement';
		BdoDataTable('xj_report_table', xj_view);
		return false;
	});

	// 导出 
	$('#historyReportImport_export').click(function() {
		//设置参数与url
		var zc = $.extend(true, {}, zc_view);
		zc.localParam.urlparam.param1 = reportId;
		zc.localParam.urlparam.url = 'cpBase/SubjectManage.queryHistoryReportExcelList.json';
		exportExcelHistory(this, '历史报告', zc, 'zc_report_table');
	});
});