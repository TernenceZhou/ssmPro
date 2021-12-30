uiBlocksApi(false, 'init');
/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $(this).css('overflow', 'hidden');
});*/


//客户 日期设置
//getCustomerForImport('account_customerId_model');
//获取客户下拉
// 客户
//getUserCustomers('etlTask_customerId');


/** table 属性 */
var accdetail_view = {
	localParam: {
		tabNum: true,
		url: 'cpBase/General.findEData.json',
		urlparam: {

			sqlId: 'other.E200005',
			menuId: window.sys_menuId,
			param1: '',
			param2: '',
			param3: sys_userId,
			param4: ''
		}
	},
	tableParam: {
		select: true,
		lengthChange: true,
		ordering: true,
		serverSide: true,
		order: [5, 'desc'],
		pageLength: 30,
		columnDefs: [
			{
				targets: 1,
				orderable: true,
				title: 'ID',
				className: 'text-center',
				name: 'id',
				data: 'id',
				visible: false,
				width: 25

			}, {
				targets: 2,
				orderable: false,
				className: 'text-center',
				title: '处理',
				width: '60px',
				render: function(data, type, row, meta) {
					var renderStr = '<input type="hidden" name="tempIndexName1" value="' + row.indexName + '">&nbsp;';
					renderStr += '<button class="btn btn-xs btn-primary" type="button" name="etlTaskReset" data-placement="top" title="重置任务状态" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>';
					renderStr += '<input type="hidden" name="tempIndexName2" value="' + row.indexName + '">&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="etlTaskZero" data-placement="top" title="清空错误次数" data-toggle="tooltip"><i class="fa fa-pencil"></i></button>';
					return renderStr;
				}
			}, {
				targets: 3,
				orderable: true,
				className: 'text-center',
				title: '客户名称',
				name: 'uploadCustomer',
				data: 'uploadCustomer',
				width: 50
			}, {
				targets: 4,
				orderable: true,
				className: 'text-center',
				title: '导入开始时间',
				name: 'beginTime',
				data: 'beginTime',
				width: 30,
				render: function(data, type, row, meta) {
					return getMyDate(data);
				}
			}, {
				targets: 5,
				orderable: true,
				className: 'text-center',
				title: '导入结束时间',
				name: 'endTime',
				data: 'endTime',
				width: 30,
				render: function(data, type, row, meta) {
					return getMyDate(data);
				}

			}, {
				targets: 6,
				orderable: true,
				className: 'text-center',
				title: '状态',
				name: 'state',
				data: 'state',
				width: 30

			}, {
				targets: 7,
				orderable: false,
				className: 'text-left',
				title: '导入状态',
				name: 'isImported',
				data: 'isImported',
				width: 30,
				render: function(data, type, row, meta) {
					switch (data) {
						case '0' :
							return '等待etl';
						case '1' :
							return 'etl中';
						case '2' :
							return 'etl完成';
						case '9' :
							return '导入失败';
						default :
							return '未知';
					}
				}
			}, {
				targets: 8,
				orderable: true,
				className: 'text-center',
				title: 'job运行状态',
				name: 'jobrunflag',
				data: 'jobrunflag',
				width: 30,
				render: function(data, type, row, meta) {
					switch (data) {
						case '0' :
							return '未运行';
						case '1' :
							return '运行中';
						default :
							return '未知';
					}
				}
			}, {
				targets: 9,
				orderable: true,
				className: 'text-center',
				title: 'job错误次数',
				name: 'errorCount',
				data: 'errorCount',
				width: 30

			}, {
				targets: 10,
				orderable: true,
				className: 'text-center',
				title: '客户号',
				name: 'customerId',
				data: 'customerId',
				width: 30

			}, {
				targets: 11,
				orderable: true,
				className: 'text-center',
				title: '年份',
				name: 'accPackageYear',
				data: 'accPackageYear',
				width: 30

			}, {
				targets: 12,
				orderable: true,
				className: 'text-center',
				title: '校验结果',
				name: 'checkoutResult',
				data: 'checkoutResult',
				width: 30

			}
		]
	}
};
BdoDataTable('etlTaskTable', accdetail_view);

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
	if (str != null && str != '') {
		var oDate = new Date(str),
			oYear = oDate.getFullYear(),
			oMonth = oDate.getMonth() + 1,
			oDay = oDate.getDate(),
			oHour = oDate.getHours(),
			oMin = oDate.getMinutes(),
			oSen = oDate.getSeconds(),
			oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
		return oTime;
	} else {
		return '';
	}
}

//补0操作
function getzf(num) {
	if (parseInt(num) < 10) {
		num = '0' + parseInt(num);
	}
	return num;
}


/** 搜索按钮 */
$('#btn_etlTask_search').click(function() {

	accdetail_view.localParam.urlparam.param1 = $('#etlTask_isImported').val();
//	accdetail_view.localParam.urlparam.param2 = $('#etlTask_customerId').val();
	accdetail_view.localParam.urlparam.lockProjectId = $('#etlTask_customerId').val();
	BdoDataTable('etlTaskTable', accdetail_view);

	$('#subjectlist_block').show();


});

//重置任务状态
$('#etlTaskTable').on('click', 'button[name="etlTaskReset"]', function() {
	var object = $('#etlTaskTable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('修改', '确认重置任务状态？', function() {
		$.ajax({
			url: 'finCenter/EtlTask.reSetEtlTask.json',
			type: 'post',
			data: {
				param1: object.id,
				lockProjectId: ''
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#etlTaskTable').DataTable().ajax.reload();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});
//清空错误次数
$('#etlTaskTable').on('click', 'button[name="etlTaskZero"]', function() {
	var object = $('#etlTaskTable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('修改', '确认清空错误次数？', function() {
		$.ajax({
			url: 'finCenter/EtlTask.reSetErrorCount.json',
			type: 'post',
			data: {
				param1: object.id,
				lockProjectId: ''
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#etlTaskTable').DataTable().ajax.reload();
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

