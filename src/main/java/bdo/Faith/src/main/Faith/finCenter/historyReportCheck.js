$(document).ready(function() {
	uiBlocksApi(false, 'init');
	/*$('.modal').on('show.bs.modal', function(){
	    $(this).draggable({
			handle: '.block-header',
			cursor: 'move'
	    });
	    $(this).css('overflow', 'hidden');
	});*/

	var importState;
	var reportId;
	//客户 日期设置
	getCustomerForImport('historyReportCheck_customerId_model', $('#modal-historyReportCheck'));
	//获取客户下拉
	// 客户
	getUserCustomers('historyReportCheck_customerId');
	var myDate = new Date();
	var accyear = myDate.getFullYear();//年
	$('#historyReportCheck_yyyy').val(accyear - 1);

	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {

				sqlId: 'WD000015',
				menuId: window.sys_menuId,
				param1: '',
				param2: '',
				param3: '',
				param4: ''
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
					targets: 1,
					orderable: true,
					title: 'ID',
					className: 'text-center',
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 25

				}, {
					targets: 2,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: 10,
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempIndexName" value="' + row.indexName + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="historyReportCheckBtn" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>';
						return renderStr;
					}
				}, {
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '客户名称',
					name: 'customerName',
					data: 'customerName',
					width: 50
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '会计年份',
					name: 'yyyy',
					data: 'yyyy',
					width: 30
				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '操作人',
					name: '__uuploadUserName',
					data: '__uuploadUserName',
					width: 30

				}, {
					targets: 6,
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
					targets: 7,
					orderable: true,
					className: 'text-left',
					title: '文件名',
					name: 'fileName',
					data: 'fileName',
					width: 60
				}, {
					targets: 8,
					orderable: false,
					className: 'text-left',
					title: '导入状态',
					name: 'importState',
					data: 'importState',
					width: 30,
					render: function(data, type, row, meta) {
						switch (data) {
							case '0' :
								return '上传成功';
							case '1' :
								return '审核完成';
							case '2' :
								return '计算完成';
							case '9' :
								return '处理失败';
							default :
								return '未知';
						}
					}
				}
			]
		}
	};
	BdoDataTable('historyReportCheck', accdetail_view);

	/** table 属性 */
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
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: 2,
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
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: 2,
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
					targets: 1,
					orderable: true,
					className: 'text-left',
					title: '科目',
					name: 'subjectName',
					data: 'subjectName',
					width: '50px'
				}, {
					targets: 2,
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
	$('#btn_historyReportCheck_search').click(function() {

		accdetail_view.localParam.urlparam.lockProjectId = $('#historyReportCheck_customerId').val();
//		accdetail_view.localParam.urlparam.param1 = $('#historyReportCheck_customerId').val();
		accdetail_view.localParam.urlparam.param2 = $('#historyReportCheck_yyyy').val();
		accdetail_view.localParam.urlparam.param4 = $('#historyReportCheck_status').val();
		BdoDataTable('historyReportCheck', accdetail_view);

		$('#historyReportCheck_block').show();


	});

	//弹出审核页
	$('#historyReportCheck').on('click', 'button[name="historyReportCheckBtn"]', function() {
		$('#historyReportCheck-modal').modal('show');
		$('#historyReportCheck-modal').draggable();
		$('#historyReportCheck-modal').css('overflow-y', 'scroll');
		var object = $('#historyReportCheck').DataTable().data()[$(this).closest('tr').index()];
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

	/** 审核按钮 */
	$('#historyReportCheck_pass').click(function() {
		if(importState == '0' || importState == '1'){
			bdoConfirmBox('保存', '确认审核通过？', function() {
				bdoInProcessingBox('处理中');
				$.ajax({
					url: 'wind/historyReportImport.checkHistoryReport.json',
					type: 'post',
					data: {
						param1: reportId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#historyReportCheck').DataTable().ajax.reload(null,false);
							$('#historyReportCheck-modal').modal('hide');
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		}else{
			bdoInfoBox('提示', '只能审核并计算上传成功或者审核通过的报告');
		}
	});

	// 导出 
	$('#historyReportCheck_export').click(function() {
		//设置参数与url
		var zc = $.extend(true, {}, zc_view);
		zc.localParam.urlparam.param1=reportId;
		zc.localParam.urlparam.url='cpBase/SubjectManage.queryHistoryReportExcelList.json';
		exportExcelHistory(this, '历史报告', zc, 'zc_report_table');
	});

});





