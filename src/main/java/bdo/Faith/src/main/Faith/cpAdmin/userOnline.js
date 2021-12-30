pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

$('#search_userName').change(function(){
	$('#search_userDepartId').val(null);
});

$('#search_userDepartId').change(function(){
	$('#search_userName').val(null);
});

/** 检索条件设置 */
var queryFilter = function () {
	var queryFilterArr = [];
	if ($('#search_userName').val() != '') {
		queryFilterArr.push({
			'field' : 'userName',
			'type' : 'string',
			'value' : $('#search_userName').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_userDepartId').val() != '') {
		queryFilterArr.push({
			'field' : 'userAuditDepartmentName',
			'type' : 'string',
			'value' : $('#search_userDepartId').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

/** 搜索按钮 */
$('#btn_search').click(function() {
	tableParam.filterParam.filter = queryFilter();
	$('#userOnlineTable').DataTable().ajax.reload();
});

/** 重置按钮 */
$('#btn_clear').click(function() {
	$('#search_userDepartId').val(null);
	$('#search_userName').val(null);
	tableParam.filterParam.filter = {};
	$('#userOnlineTable').DataTable().ajax.reload();
});

/** table 属性 */
var tableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
	dom : '<"row"<"col-sm-12"tr>>',
//  order : [2, 'asc'],
	//必需
	sourceData : {},
	sourceUrl : 'admin/UserOnline.findOnlineUser.json',
	filterParam : {
		filter : {}
	},
	tableColumns :[
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '处理',
			data : null,
			width : '90px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowNews" data-placement="top" title="发送个人消息" data-toggle="tooltip">'
						+ '<i class="fa fa-pencil"></i></button>';
				renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowSignOut" data-placement="top" title="强制退出" data-toggle="tooltip">'
						+ '<i class="fa fa-times"></i></button>';
				return renderStr;
			}
		}, {
			targets : 2,
			orderable : true,
			title : '用户编号',
			name : 'userId',
			data : 'userId',
			width : '70px'
		}, {
			targets : 3,
			orderable : true,
			title : '登录编号',
			name : 'userLoginId',
			data : 'userLoginId',
			width : '90px'
		}, {
			targets : 4,
			orderable : true,
			title : '用户名',
			name : 'userName',
			data : 'userName',
			width : '90px'
		}, {
			targets : 5,
			orderable : true,
			title : '所在部门',
			name : 'userAuditDepartmentName',
			data : 'userAuditDepartmentName',
			width : '150px'
		}, {
			targets : 6,
			orderable : true,
			title : '用户IP地址',
			name : 'userIp',
			data : 'userIp',
			width : '90px'
		}, {
			targets : 7,
			orderable : true,
			title : '登录时间',
			name : 'userLoginTime',
			data : 'userLoginTime',
			width : '150px'
		}, {
			targets : 8,
			orderable : true,
			title : '会话编号',
			name : 'sessionId',
			data : 'sessionId',
			width : '300px'
		}]
}

/** table */
BdoDataTables('userOnlineTable', tableParam);

/** 行按钮 发送系统广播 */
$('#btn_news').click(function(){	
	$('#modal_sysNews').modal('show');
});

/** 系统广播消息模态框 */
$('#sub_sysNews').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'news_sysSend',
			icon : 'fa-send-o',
			style : 'btn-primary',
			text : '发送'
		},
		{
			id :  'news_sysClose',
			icon : 'fa-sign-out',
			style : 'btn-css1 btn-warning',
			text : '关闭'
		}
	],
	items : [
		{
			id :  'n_sysValue',
			type : 'textarea',
			label : '系统广播内容',
			colspan : 2,
			validate : {
				rules : {
					required : true,
					maxlength : 300
				}
			}
		}
	]
});

$('#news_sysSend').click(function(){
	var submitUrl = 'admin/UserOnline.sendBroadcast.json';
	var data = {
		param1 : $('#n_sysValue').val()
	};
	
	$('#sub_sysNews').formview(
		'setAjaxConf',
		[
			submitUrl,
			data,
			'json',true,
			function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_sysNews').modal('hide');
			}
		]
	)
	$('#sub_sysNews').submit();
});

$('#news_sysClose').click(function(){
	$('#modal_sysNews').modal('hide');
});

/** 行按钮 发送个人消息 */
$('#userOnlineTable').on('click', 'button[name="rowNews"]', function() {
	formdataSet($('#userOnlineTable').DataTable().data()[$(this).closest('tr').index()]);
	$('#modal_news').modal('show');
});

/** 个人消息模态框 */
$('#sub_news').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'news_send',
			icon : 'fa-send-o',
			style : 'btn-primary',
			text : '发送'
		},
		{
			id :  'news_close',
			icon : 'fa-sign-out',
			style : 'btn-css1 btn-warning',
			text : '关闭'
		}
	],
	items : [
		{
			id :  'n_userId',
			type : 'input',
			label : '用户编号',
			typeAttr : {
				disabled : true
			}
		},{
			id :  'n_userName',
			type : 'input',
			label : '用户名',
			typeAttr : {
				disabled : true
			}
		},{
			id :  'n_messageValue',
			type : 'textarea',
			label : '送信内容',
			rowspan : 1,
			colspan : 2,
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		}
	]
});

///** 模态框设置 */
//$('.modal').on('show.bs.modal', function(){
//    $(this).draggable({
//		handle: '.block-header',
//		cursor: 'move'
//    });
//    $('#modal_news, #modal_sysNews').css('overflow', 'hidden');
//});

/** 重置模态框表单 */
$('.modal').on('hidden.bs.modal', function() {
	$('#modal_news form')[0].reset();
	$('#modal_news form td').removeClass('has-error');
	$('#modal_news form .help-block').remove();
	$('#modal_sysNews form')[0].reset();
	$('#modal_sysNews form td').removeClass('has-error');
	$('#modal_sysNews form .help-block').remove();
});

$('#news_send').click(function(){
	var submitUrl = 'admin/UserOnline.sendMessage.json';
	var data = {
		param1 : $('#n_messageValue').val(),
		param2 : $('#n_userId').val()
	};
	
	$('#sub_news').formview(
		'setAjaxConf',
		[
			submitUrl,
			data,
			'json',true,
			function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_news').modal('hide');
			}
		]
	)
	$('#sub_news').submit();
});

$('#news_close').click(function(){
	$('#modal_news').modal('hide');
});

/** 行按钮 强制退出 */
$('#userOnlineTable').on('click', 'button[name="rowSignOut"]', function() {
	var object = $('#userOnlineTable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('系统提示', '你确认要强制退出用户【' + object.userName + '】吗?', function(){
		$.ajax({
			type : 'post',
			url : 'admin/UserOnline.killPerson.json',
			data : {
				param1 : object.sessionId
			},
			dataType : 'json',
			success : function(data) {
				$('#userManageTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

function formdataSet(object){
	$('#n_userId').val(object.userId);
	$('#n_userName').val(object.userName);
}
