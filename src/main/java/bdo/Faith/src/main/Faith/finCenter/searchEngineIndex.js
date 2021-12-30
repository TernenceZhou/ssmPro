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
getUserCustomers('searchEngineIndex_customerId');


/** table 属性 */
var accdetail_view = {
	localParam: {
		tabNum: true,
		url: 'cpBase/General.findSearchEngine.json',
		urlparam: {

			sqlId: 'other.ES000001',
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
				width: '60px',
				render: function(data, type, row, meta) {
					var renderStr = '<input type="hidden" name="tempIndexName" value="' + row.indexName + '">&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="searchEngineIndexDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
					return renderStr;
				}
			}, {
				targets: 3,
				orderable: true,
				className: 'text-center',
				title: '索引名称',
				name: 'indexName',
				data: 'indexName',
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
				title: '客户',
				name: 'customerId',
				data: 'customerId',
				width: 30

			}, {
				targets: 6,
				orderable: true,
				className: 'text-center',
				title: '创建日期',
				name: 'CREATION_DATE',
				data: 'CREATION_DATE',
				width: 30,
				render: function(data, type, row, meta) {
					return getMyDate(data);
				}

			}, {
				targets: 7,
				orderable: false,
				className: 'text-left',
				title: '生成状态',
				name: 'state',
				data: 'state',
				width: 30,
				render: function(data, type, row, meta) {
					switch (data) {
						case '0' :
							return '生成中';
						case '1' :
							return '生成成功';
						case '9' :
							return '生成失败';
						default :
							return '未知';
					}
				}
			}
		]
	}
};
BdoDataTable('searchEngineIndexTable', accdetail_view);

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
$('#btn_searchEngineIndex_search').click(function() {

	accdetail_view.localParam.urlparam.lockProjectId = $('#searchEngineIndex_customerId').val();
//	accdetail_view.localParam.urlparam.param1 = $('#searchEngineIndex_customerId').val();
	accdetail_view.localParam.urlparam.param2 = $('#searchEngineIndex_startDate').val();
	BdoDataTable('searchEngineIndexTable', accdetail_view);

	$('#subjectlist_block').show();


});

//删除索引
$('#searchEngineIndexTable').on('click', 'button[name="searchEngineIndexDelete"]', function() {
	var object = $('#searchEngineIndexTable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('删除', '确认删除索引？', function() {
		$.ajax({
			url: 'finCenter/SearchEngine.deleteSearchEngineIndex.json',
			type: 'post',
			data: {
				param1: object.indexName,
				param2: object.autoId,
				lockProjectId:''
			},
			dataType: 'json',
			success: function(data) {
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


