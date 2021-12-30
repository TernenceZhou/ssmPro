$(document).ready(function() {
	uiBlocksApi(false, 'init');
	var myDate = new Date();
	var feedbackId = '';
	/** table 属性 */
	var accdetail_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'sys.S300016',
				menuId: window.sys_menuId,
				param1: '',
				param2: '',
				param3: ''
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
					name: 'autoId',
					data: 'autoId',
					visible: false,
					width: 25

				}, {
					targets : 2,
					orderable : false,
					className : 'text-center',
					title : '处理',
					data : null,
					width : '25px',
					render : function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
								+ '<i class="fa fa-eye"></i></button>';
						return renderStr;
					}
				},{
					targets: 3,
					orderable: true,
					className: 'text-center',
					title: '所属部门',
					name: '__departmentidName',
					data: '__departmentidName',
					width: 50
				}, {
					targets: 4,
					orderable: true,
					className: 'text-center',
					title: '创建人',
					name: '__ueditUserName',
					data: '__ueditUserName',
					width: 50
				}, {
					targets: 5,
					orderable: true,
					className: 'text-center',
					title: '创建时间',
					name: 'CREATION_DATE',
					data: 'CREATION_DATE',
					width: 30,
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}
				}, {
					targets: 6,
					orderable: true,
					className: 'text-center',
					title: '回复人',
					name: '__ureplyUserName',
					data: '__ureplyUserName',
					width: 50
				}, {
					targets: 7,
					orderable: true,
					className: 'text-center',
					title: '回复时间',
					name: 'replyTime',
					data: 'replyTime',
					width: 30,
					render: function(data, type, row, meta) {
						return getMyDate(data);
					}
				}
			]
		}
	};
	BdoDataTable('feedbacksForm', accdetail_view);


	
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', //语言设置
		format: 'yyyy-mm-dd', //日期显示格式
		minViewMode: 0
	});

	//时间毫秒数转时间
	function getMyDate(str) {
		if(str == null || str == ''){
			return str;
		}
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


	/** 搜索按钮 */
	$('#btn_feedback_search').click(function() {
		accdetail_view.localParam.urlparam.param1 = $('#createUser').val();
		accdetail_view.localParam.urlparam.param2 = $('#startDate').val();
		if($('#endDate').val().length>0){
			var date=$('#endDate').val()+" 23:59:59";
			accdetail_view.localParam.urlparam.param3 =date;
		}

		BdoDataTable('feedbacksForm', accdetail_view);
		$('#feedback_block').show();


	});

	$('#feedbacksForm').on('click', 'button[name="rowView"]', function() {
		var rowData = $('#feedbacksForm').DataTable().data()[$(this).closest('tr').index()];
		$('#feedbackDeatilForm.modal.fade .modal-dialog').css({
			'width': '800px'
		});
		$('#feedbackDeatilForm').modal('show');
		$('#feebackContentDetails').empty();
		$('#feebackContentDetails').append(rowData.content);
		$('#replayContent').val(rowData.replyContent);
		feedbackId = rowData.autoId;
	});
	function getQueryString(url, name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");// 匹配目标参数
		var result = url.substr(1).match(reg);// 对querystring匹配目标参数
		if (result != null) {
			return decodeURIComponent(result[2]);
		} else {
			return null;
		}
	}
	/** 回复 */
	$('#btn_reply').click(function() {
		var replyContent = $('#replayContent').val();
		if(replyContent.length == 0){
			bdoInfoBox('提示', '请填写回复内容');
			return;
		}
		$.ajax({
			url : 'dgCenter/DgMain.replyFeeBack.json',
			type : 'post',
			data : {
				param1 : feedbackId,
				param2 : replyContent
			},
			dataType : 'json',
			success : function(data){
				if(data.success){
					$('#feedbackDeatilForm').modal('hide');
					$('#feedbacksForm').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});

	});
});





