pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

/** 下拉框 获取字典 */
$('#search_userDepartId').treecombo({
	url : './base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});

/** 检索条件设置 */
var queryFilter = function () {
	var queryFilterArr = [];
	if ($('#search_userName').val() != '') {
		queryFilterArr.push({
			'field' : 'name',
			'sqlIndex' : 'a.name',
			'type' : 'string',
			'value' : $('#search_userName').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_userDepartId').val() != '') {
		queryFilterArr.push({
			'field' : 'departmentid',
			'sqlIndex' : 'a.departmentid',
			'type' : 'list',
			'value' : $('#search_userDepartId').treecombo('getTreeComboValue'),
			'operate' : 'eq'
		});
	}
	if ($('#search_userEmail').val() != '') {
		queryFilterArr.push({
			'field' : 'email',
			'sqlIndex' : 'a.email',
			'type' : 'string',
			'value' : $('#search_userEmail').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

/** 搜索按钮 */
$('#btn_search').click(function() {
	tableParam.filterParam.filter = queryFilter();
	$('#accountApplyTable').DataTable().ajax.reload();
});

/** 重置按钮 */
$('#btn_clear').click(function() {
	$('#search_userName').val(null);
	$('#search_userDepartId').treecombo('setTreeComboValue',[null, null]);
	$('#search_userEmail').val(null);
	tableParam.filterParam.filter = queryFilter();
	$('#accountApplyTable').DataTable().ajax.reload();
});

/** table 属性 */
var tableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
  	order : [2, 'asc'],
	//必需
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'sys.S100137',
		filter : queryFilter
	},
	tableColumns :[
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '处理',
			data : null,
			width : '130px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowAdd" data-placement="top" title="新建" data-toggle="tooltip">'
						+ '<i class="fa fa-plus"></i></button>';
				renderStr += '<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="rowReset" data-placement="top" title="重置" data-toggle="tooltip">'
						+ '<i class="fa fa-refresh"></i></button>';
				renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowDel" data-placement="top" title="删除" data-toggle="tooltip">'
						+ '<i class="fa fa-times"></i></button>';
				if(row.iscancel == '0' || row.iscancel == null){
					renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDisable" data-placement="top" title="禁用" data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>';
				} else {
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowEnable" data-placement="top" title="还原" data-toggle="tooltip">'
						+ '<i class="fa fa-check-circle"></i></button>';
				}
				return renderStr;
			}
		}, {
			targets : 2,
			orderable : true,
			title : '名称',
			name : 'name',
			data : 'name',
			width : '90px'
		}, {
			targets : 3,
			orderable : true,
			title : '所属部门',
			name : 'departmentid|__ddepartmentid',
			data : '__ddepartmentid',
			width : '200px',
			render : function(data, type, row, meta){
				return row.__ddepartmentid.departName;
			}
		}, {
			targets : 4,
			orderable : true,
			title : '邮箱',
			name : 'email',
			data : 'email',
			width : '180px'
		}, {
			targets : 5,
			orderable : true,
			title : '密码',
			name : 'passcode',
			data : 'passcode',
			width : '90px'
		}, {
			targets : 6,
			orderable : true,
			title : '是否删除',
			renderer : 'getDicLabelByVal|boolean',
			name : 'isdelete',
			data : 'isdelete',
			width : '70px',
			render : function(data, type, row, meta) {
				var isdelete;
				if(row.isdelete == '0' || row.isdelete == null){
					isdelete = '否';
				} else {
					isdelete = '是';
				}
				return isdelete;
			}
		}, {
			targets : 7,
			orderable : true,
			title : '是否禁用',
			renderer : 'getDicLabelByVal|boolean',
			name : 'iscancel',
			data : 'iscancel',
			width : '70px',
			render : function(data, type, row, meta) {
				var iscancel;
				if(row.iscancel == '0' || row.iscancel == null){
					iscancel = '否';
				} else {
					iscancel = '是';
				}
				return iscancel;
			}
		}]
}

/** table */
BdoDataTables('accountApplyTable', tableParam);

$('#btn_viewport').click(function(){
	$.ajax({
		url : 'admin/UserManage.getOutinterface.json',
		type : 'post',
		dataType : 'json',
		success : function(data){
			var interfacestr = '';
			$.each(data.data, function(index, info){
				interfacestr += '<span>' + info.ifName + ' : ' + info.ifPath + '</span><br>'
			});
			swal({
				title : '接口详情',
				html : interfacestr,
				type : 'warning',
				allowOutsideClick: false,
				allowEscapeKey: false
			});
		}
	});
});

/** 导出 */
$('#btn_export').click(function() {
	exportExcel(this, '风报账号管理', tableParam, 'accountApplyTable');
});

/** 行按钮 新增  */
$('#accountApplyTable').on('click', 'button[name="rowAdd"]', function() {
	var object = $('#accountApplyTable').DataTable().data()[$(this).closest('tr').index()];
	if(object.email == null){
		bdoErrorBox('失败', '该用户无邮箱!');
		return;
	}
	
	if(object.isdelete == '1'){
		bdoErrorBox('失败', '该用户已删除，请联系系统管理员!');
		return;
	}
	
	if(object.iscancel == '1'){
		bdoErrorBox('失败', '该用户已禁用，请联系系统管理员!');
		return;
	}
	
	if(object.passcode != null){
		bdoErrorBox('失败', '该用户已创建，无需重复操作!');
		return;
	}
	
	$.ajax({
		url : 'acc/AccountControl.create.json',
		type : 'post',
		data : {
			param1 : object.id
		},
		dataType: 'json',
		async : false,
		success : function(data){
			$('#accountApplyTable').DataTable().draw(false);
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

/** 行按钮 重置 */
$('#accountApplyTable').on('click', 'button[name="rowReset"]', function() {
	var object = $('#accountApplyTable').DataTable().data()[$(this).closest('tr').index()];
	if(object.email == null){
		bdoErrorBox('失败', '该用户无邮箱!');
		return;
	}
	
	if(object.isdelete == '1'){
		bdoErrorBox('失败', '该用户已删除，请联系系统管理员!');
		return;
	}
	
	if(object.iscancel == '1'){
		bdoErrorBox('失败', '该用户已禁用，请联系系统管理员!');
		return;
	}
	
	if(object.passcode == null){
		bdoErrorBox('失败', '该用户无密码，无法操作!');
		return;
	}
	
	bdoConfirmBox('系统提示', '确认要重置用户名为【' + object.name + '】的密码吗？', function(){
		$.ajax({
			url : 'acc/AccountControl.reset.json',
			type : 'post',
			data : {
				param1 : object.id
			},
			dataType: 'json',
			async : false,
			success : function(data){
				$('#accountApplyTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});	
	
/** 行按钮 删除 */
$('#accountApplyTable').on('click', 'button[name="rowDel"]', function() {
	var object = $('#accountApplyTable').DataTable().data()[$(this).closest('tr').index()];
	if(object.email == null){
		bdoErrorBox('失败', '该用户无邮箱!');
		return;
	}
	
	if(object.isdelete == '1'){
		bdoErrorBox('失败', '该用户已删除，请联系系统管理员!');
		return;
	}
	
	if(object.passcode == null){
		bdoErrorBox('失败', '该用户无密码，无法操作!');
		return;
	}
	
	bdoConfirmBox('系统提示', '确认要删除用户名为【' + object.name + '的密码吗？删除后无法重新新建密码', function(){
		$.ajax({
			url : 'acc/AccountControl.delete.json',
			type : 'post',
			data : {
				param1 : object.id
			},
			dataType: 'json',
			async : false,
			success : function(data){
				$('#accountApplyTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 行按钮 禁用 */
$('#accountApplyTable').on('click', 'button[name="rowDisable"]', function() {
	var object = $('#accountApplyTable').DataTable().data()[$(this).closest('tr').index()];
	
	if(object.isdelete == '1'){
		bdoErrorBox('失败', '该用户已删除，无法操作!');
		return;
	}
		
	if(object.iscancel == '1'){
		bdoErrorBox('失败', '该用户已禁用，无法操作!');
		return;
	}
	
	bdoConfirmBox('系统提示', '确认要禁用用户名为【' + object.name + '】的账户吗？禁用后无法使用风报', function(){
		$.ajax({
			url : 'acc/AccountControl.cancel.json',
			type : 'post',
			data : {
				param1 : object.id
			},
			dataType: 'json',
			async : false,
			success : function(data){
				$('#accountApplyTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 行按钮 还原 */
$('#accountApplyTable').on('click', 'button[name="rowEnable"]', function() {
	var object = $('#accountApplyTable').DataTable().data()[$(this).closest('tr').index()];
		
	if(object.iscancel == '0' || object.iscancel == null){
		bdoErrorBox('失败', '该用户未被禁用，无法操作!');
		return;
	}
	
	bdoConfirmBox('系统提示', '确认要启用用户名为【' + object.name + '】的账户吗？', function(){
		$.ajax({
			url : 'acc/AccountControl.back.json',
			type : 'post',
			data : {
				param1 : object.id
			},
			dataType: 'json',
			async : false,
			success : function(data){
				$('#accountApplyTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});
