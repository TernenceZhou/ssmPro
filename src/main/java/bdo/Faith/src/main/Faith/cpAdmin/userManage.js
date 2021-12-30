pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

/** 下拉框 获取字典 */
$('#search_accountStatus').html(ComboDicOption(false, '账户状态'))
$("#search_accountStatus option[value='0']").attr("selected", "selected");
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
			'sqlIndex' : 'aa.name',
			'type' : 'string',
			'value' : $('#search_userName').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_userDepartId').val() != '') {
		queryFilterArr.push({
			'field' : '__departmentid',
			'sqlIndex' : 'aa.__departmentid',
			'type' : 'list',
			'value' : $('#search_userDepartId').treecombo('getTreeComboValue'),
			'operate' : 'eq'
		});
	}
	if ($('#search_userPayBand').val() != '') {
		queryFilterArr.push({
			'field' : 'rank',
			'sqlIndex' : 'aa.rank',
			'type' : 'string',
			'value' : $('#search_userPayBand').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

/** 搜索按钮 */
$('#btn_search').click(function() {
	tableParam.filterParam.filter = queryFilter();
	if($('#search_accountStatus').val() == '0'){
		tableParam.filterParam.param1 = '1';
		tableParam.filterParam.param2 = '';
	} else {
		tableParam.filterParam.param2 = '1';
		tableParam.filterParam.param1 = '';
	}
	BdoDataTables('userManageTable', tableParam);
});

/** 重置按钮 */
$('#btn_clear').click(function() {
	$('#search_userName').val(null);
	$('#search_userDepartId').treecombo('setTreeComboValue',[null, null]);
	$('#search_userPayBand').val(null);
	$('#search_accountStatus').val('0');
	tableParam.filterParam.filter = queryFilter();
	if($('#search_accountStatus').val() == '0'){
		tableParam.filterParam.param1 = '1';
		tableParam.filterParam.param2 = '';
	}
	BdoDataTables('userManageTable', tableParam);
});

/** table 属性 */
var tableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [8, 'asc'],
	//必需
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'sys.S200153',
		param1 : '1',
		param2 : '',
		filter : queryFilter()
	},
	tableColumns :[
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '处理',
			data : null,
			width : '260px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				if($('#search_accountStatus').val() == '0'){
					renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>';
					renderStr += '<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
							+ '<i class="fa fa-eye"></i></button>';
					renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDisable" data-placement="top" title="禁用" data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>';
					renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowAuthorize" data-placement="top" title="授权" data-toggle="tooltip">'
						+ '<i class="fa fa-key"></i></button>';
					renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowRoleAuthorize" data-placement="top" title="人员角色授权" data-toggle="tooltip">'
							+ '<i class="fa fa-user-circle"></i></button>';
					renderStr += '<button class="btn btn-xs btn-default table-btn-operate" type="button" name="rowRestore" data-placement="top" title="初始化原密码" data-toggle="tooltip">'
							+ '<i class="fa fa-eraser"></i></button>';
//					renderStr += '<button class="btn btn-xs btn-inverse table-btn-operate" type="button" name="rowManual" data-placement="top" title="手动同步" data-toggle="tooltip">'
//							+ '<i class="fa fa-reply"></i></button>';
//					renderStr += '<button class="btn btn-xs btn-inverse table-btn-operate" type="button" name="rowAppoint" data-placement="top" title="指定同步" data-toggle="tooltip">'
//							+ '<i class="fa fa-reply-all"></i></button>';
				} else {
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowEnable" data-placement="top" title="还原" data-toggle="tooltip">'
						+ '<i class="fa fa-check-circle"></i></button>';
				}
				return renderStr;
			}
		}, {
			targets : 2,
			orderable : true,
			title : '姓名',
			name : 'name',
			data : 'name',
			width : '90px'
		}, {
			targets : 3,
			orderable : true,
			title : '性别',
			name : 'sex',
			data : 'sex',
			width : '90px'
		}, {
			targets : 4,
			orderable : true,
			title : '登录名',
			name : 'hrLoginId',
			data : 'hrLoginId',
			width : '150px'
		}, {
			targets : 5,
			orderable : true,
			title : '薪酬级别',
			name : 'rank',
			data : 'rank',
			width : '150px'
		}, {
			targets : 6,
			orderable : true,
			title : '所属部门',
			name : '__departmentid',
			data : '__departmentid',
			width : '150px',
			render : function(data, type, row, meta){
				return row.__departmentid.departName;
			}
		}, {
			targets : 7,
			orderable : true,
			title : '权限',
			name : 'roles',
			data : 'roles',
			width : '350px',
			render : function(data, type, row, meta){
				var roles = row.roles;
				if(roles != null && roles.length > 100){
					return roles.substring(0, 100) + '...等';
				} else {
					return roles;
				}
			}
		}, {
			targets : 8,
			orderable : true,
			title : '编号',
			visible : false,
			name : 'id',
			data : 'id',
			width : '90px'
		}]
}

/** table */
BdoDataTables('userManageTable', tableParam);

/** 导出 */
$('#btn_export').click(function() {
	exportExcel(this, '用户信息一览', tableParam, 'userManageTable');
});

/** 新建模态框 */
$('#sub_add').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'add_save',
			icon : 'fa-floppy-o',
			style : 'btn-primary',
			text : '确认'
		},
		{
			id :  'add_close',
			icon : 'fa-sign-out',
			style : 'btn-css1 btn-warning',
			text : '关闭'
		}
	],
	items : [
		{
			id :  'n_loginid',
			type : 'input',
			label : '登录名',
			typeAttr:{
				type : 'hidden'
			}
		},{
			id :  'n_name',
			type : 'input',
			label : '姓名',
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id :  'n_hrLoginId',
			type : 'input',
			label : 'HR登录名',
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id :  'n_departmentid',
			type : 'input',
			label : '所属部门',
			rowspan : 1,
			colspan : 3,
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './base/TreeCommon.findDepartTree.json',
					params : {},
					view : {
						leafIcon: 'fa fa-building text-flat',    
						nodeIcon: 'fa fa-bank text-primary-light',
						folderSelectable: true,
						multiSelect: false
					}
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
//    $(this).css('overflow', 'hidden');
//});

/** 重置模态框表单 */
$('#modal_new').on('hidden.bs.modal', function() {
	$('#modal_new').find('input, select, textarea').removeAttr('disabled','disabled');
	$('#modal_new form')[0].reset();
	$('#modal_new form td').removeClass('has-error');
	$('#modal_new form .help-block').remove();
});

/** 新建模态框 显示 */
$('#btn_add').on('click', function(){
	$('#modal_new').modal('show');
});

/** 新建模态框 新增 */
$('#add_save').on('click',function(){
	var submitUrl = 'cpBase/KUser.add.json';
	var deptId = $('#n_departmentid').treecombo('getTreeComboValue');
	var data = {
		param1 : $('#n_name').val(),
		param2 : $('#n_loginid').val(),
		param3 : $('#n_hrLoginId').val(),
		param4 : $('#n_departmentid').treecombo('getTreeComboValue')
	};
	
	$('#sub_add').formview(
		'setAjaxConf',
		[
			submitUrl,
			data,
			'json',true,
			function(data) {
				$('#userManageTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					var maxId = maxUserId();
					addUserRole(deptId , maxId);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_new').modal('hide');
			}
		]
	)
	$('#sub_add').submit();
});

function maxUserId(){
	var maxId ='';
	$.ajax({
		url : 'base/General.query.json',
		type : 'post',
		data : {
			menuId : window.sys_menuId,
			sqlId : 'sys.S100136'
		},
		dataType: 'json',
		async : false,
		success : function(data){
			maxId = data.data[0].id
		}
	});
	return maxId;
}

function addUserRole(deptId , maxId){
	$.ajax({
		url : 'admin/userManage.userRoleAdd.json',
		type : 'post',
		data : {
			param1 : deptId,
			param2 : maxId,
			menuId : window.sys_menuId
		},
		dataType: 'json',
		async : false,
		success : function(data){
			
		}
	});
}

/** 新建模态框 隐藏 */
$('#add_close').on('click',function(){
	$('#modal_new').modal('hide');
});

/** 新建模态框 */
$('#sub_edit').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'edit_save',
			icon : 'fa-floppy-o',
			style : 'btn-primary',
			text : '确认'
		},
		{
			id :  'edit_close',
			icon : 'fa-sign-out',
			style : 'btn-css1 btn-warning',
			text : '关闭'
		}
	],
	items : [
		{
			id :  'e_loginid',
			type : 'input',
			label : '旧系统登录名',
			typeAttr : {
				type : 'hidden'
			}
		},{
			id :  'e_name',
			type : 'input',
			label : '姓名',
			rowspan : 1,
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id :  'e_hrLoginId',
			type : 'input',
			label : '登录名',
			validate : {
				rules : {
					required : true,
					maxlength : 100
				}
			}
		},{
			id :  'e_hrDepart',
			type : 'input',
			label : 'HR部门',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_departmentid',
			type : 'input',
			label : '所属部门',
			rowspan : 1,
			colspan : 3,
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
				name : 'treecombo',
				options :{
					url : './base/TreeCommon.findDepartTree.json',
					params : {},
					view : {
						leafIcon: 'fa fa-building text-flat',    
						nodeIcon: 'fa fa-bank text-primary-light',
						folderSelectable: true,
						multiSelect: false
					}
				}
			}
		},{
			id :  'e_mobilePhone',
			type : 'input',
			label : '手机',
			rowspan : 1,
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_phone',
			type : 'input',
			label : '办公电话',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_sex',
			type : 'input',
			label : '性别',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_educational',
			type : 'input',
			label : '学历',
			rowspan : 1,
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_bornDate',
			type : 'input',
			label : '出生年月',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_rank',
			type : 'input',
			label : '职级',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_diploma',
			type : 'input',
			label : '毕业院校及专业',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_cpano',
			type : 'input',
			label : 'CPA编号',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_email',
			type : 'input',
			label : '邮箱',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_isCpa',
			type : 'select',
			label : '是否cpa',
			html : ComboDicOption(true, 'boolean'),
			typeAttr : {
				disabled : true
			}
		},{
			id :  'e_isLXcpa',
			type : 'select',
			label : '是否立信cpa',
			rowspan : 1,
			html : ComboDicOption(true, 'boolean'),
			typeAttr : {
				disabled : true
			}
		},{
			id :  'e_cpaRelation',
			type : 'input',
			label : 'cpa注册地',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_cpaState',
			type : 'input',
			label : 'cpa状态',
			typeAttr : {
				readonly : true
			}
		},{
			id :  'e_hrLoginId1',
			type : 'input',
			label : 'HR登录名1',
			rowspan : 1,
			html : ComboDicOption(true, 'boolean'),
			typeAttr : {
				type : 'hidden'
			}
		},{
			id :  'e_loginid1',
			type : 'input',
			label : '登录名1',
			rowspan : 1,
			typeAttr : {
				type : 'hidden'
			}
		},{
			id :  'e_psw',
			type : 'input',
			label : '新密码',
			rowspan : 1,
			typeAttr : {
				type : 'hidden'
			}
		},{
			id :  'e_psw1',
			type : 'input',
			label : '确认密码',
			rowspan : 1,
			typeAttr : {
				type : 'hidden'
			}
		}
		
	]
});

/** 重置模态框表单 */
$('#modal_edit').on('hidden.bs.modal', function() {
	$('#modal_edit').find('input, select, textarea').removeAttr('disabled','disabled');
	$('#modal_edit form')[0].reset();
	$('#modal_edit form td').removeClass('has-error');
	$('#modal_edit form .help-block').remove();
});

var userId;
/** 行按钮 修改  */
$('#userManageTable').on('click', 'button[name="rowEdit"]', function() {
	formdataSet($('#userManageTable').DataTable().data()[$(this).closest('tr').index()]);
	$('#e_name, #e_hrLoginId, #e_departmentid').attr('disabled', false);
	$('#modalName').html('修改');
	$('#edit_save').show();
	userId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].id;
	$('#modal_edit').modal('show');
});

/** 修改模态框 修改 */
$('#edit_save').on('click',function(){
	var submitUrl = 'cpBase/KUser.edit.json';
	var e_hrLoginId = $('#e_hrLoginId').val();
	var e_hrLoginId1 = $('#e_hrLoginId1').val();
	var deptId = $('#e_departmentid').treecombo('getTreeComboValue');
	var data = {
		menuId : window.sys_menuId,
		param1 : userId,
		param2 : $('#e_name').val(),
		param3 : $('#e_loginid').val(),
		param4 : $('#e_loginid1').val(),
		param5 : $('#e_hrLoginId').val(),
		param6 : $('#e_hrLoginId1').val(),
		param7 : $('#e_sex').val(),
		param8 : $('#e_departmentid').treecombo('getTreeComboValue'),
		param9 : $('#e_mobilePhone').val(),
		param10 : $('#e_phone').val(),
		param11 : $('#e_educational').val(),
		param12 : $('#e_bornDate').val(),
		param13 : $('#e_rank').val(),
		param14 : $('#e_diploma').val(),	
		param15 : $('#e_email').val(),
		param16 : $('#e_cpano').val(),
		param17 : $('#e_isCpa').val(),
		param18 : $('#e_isLXcpa').val(),
		param19 : $('#e_cpaRelation').val(),
		param20 : $('#e_cpaState').val(),
		param21 : $('#e_psw').val()
	};
	
	if(e_hrLoginId != e_hrLoginId1){
		bdoConfirmBox('系统提示', '你确认要绑定这个【' + e_hrLoginId + '】HR登录名吗?', function(){
			if(!checkHRLoginid(e_hrLoginId)){
				bdoErrorBox('失败', '该HR用户【' + e_hrLoginId + '】已被绑定！');

			} else {
				$('#sub_edit').formview(
					'setAjaxConf',
					[
						submitUrl,
						data,
						'json',true,
						function(data) {
							$('#userManageTable').DataTable().draw(false);
							if(data.success === true){
								bdoSuccessBox('成功', data.resultInfo.statusText);
//								deptRoleMove(userId,deptId);
							}else {
								bdoErrorBox('失败', data.resultInfo.statusText);
							}
							$('#modal_edit').modal('hide');
						}
					]
				)
				$('#sub_edit').submit();
			}
		});
	} else {
		$('#sub_edit').formview(
			'setAjaxConf',
			[
				submitUrl,
				data,
				'json',true,
				function(data) {
					$('#userManageTable').DataTable().draw(false);
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
//						deptRoleMove(userId,deptId);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					$('#modal_edit').modal('hide');
				}
			]
		)
		$('#sub_edit').submit();
	}
});

function deptRoleMove(userId,deptId){
	$.ajax({
		url : 'admin/userManage.userRoleDelAdd.json',
		type : 'post',
		data : {
			param1 : deptId,
			param2 : userId,
			menuId : window.sys_menuId
		},
		dataType: 'json',
		async : false,
		success : function(data){
			
		}
	});
}

function checkHRLoginid(e_hrLoginId){
	var returnVal;
	$.ajax({
		url : 'cpBase/KUser.checkHRLoginid.json',
		type : 'post',
		async : false,
		data : {
			menuId : window.sys_menuId,
			param1 : e_hrLoginId
		},
		success : function(data) {
			//var obj = Ext.JSON.decode(response.responseText);
			if (data.data.length > 0) {
				if (data.data[0].success == "false") {
					returnVal = false;
				} else {
					returnVal = true;
				}
			}

		}
	});
	return returnVal;
}

/** 修改模态框 关闭 */
$('#edit_close').on('click',function(){
	$('#modal_edit').modal('hide');
});

/** 行按钮 查看 */
$('#userManageTable').on('click', 'button[name="rowView"]', function() {
	$(this).closest('tr').dblclick();
});

/** 行双击 */
$('#userManageTable tbody').on('dblclick', 'tr', function() {
	formdataSet($('#userManageTable').DataTable().data()[$(this).closest('tr').index()]);
	$('#edit_save').hide();
	$('#modal_edit').find('input, select, textarea').attr('disabled','disabled');
	$('#modalName').html('查看');
	$('#modal_edit').modal('show');
});

/** 行按钮 禁用 */
$('#userManageTable').on('click', 'button[name="rowDisable"]', function() {
	var hrLoginId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].hrLoginId;
	var userId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].id;
	bdoConfirmBox('系统提示', '你确认要禁用【' + hrLoginId + '】该帐号吗?禁用后该人员将无法登录系统，取消禁用可以在还原功能中进行，确定要禁用吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpBase/KUser.stopUser.json',
			data : {
				menuId : window.sys_menuId,
				param1 : userId
			},
			dataType : 'json',
			success : function(data) {
				$('#userManageTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					delDeptRole(userId);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

function delDeptRole(userId){
		$.ajax({
		url : 'admin/userManage.userRoleDel.json',
		type : 'post',
		data : {
			param1 : userId,
			menuId : window.sys_menuId
		},
		dataType: 'json',
		async : false,
		success : function(data){
			
		}
	});
}

/** 行按钮 还原 */
$('#userManageTable').on('click', 'button[name="rowEnable"]', function() {
	var obj = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('系统提示', '您是否还原该【' + obj.hrLoginId + '】帐号吗？', function(){
		$.ajax({
			type : 'post',
			url : 'cpBase/KUser.startUser.json',
			data : {
				menuId : window.sys_menuId,
				param1 : obj.id
			},
			dataType : 'json',
			success : function(data) {
				$('#userManageTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					addUserRole(obj.__departmentid.departId,obj.id);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 行按钮 初始化密码 */
$('#userManageTable').on('click', 'button[name="rowRestore"]', function() {
	var userId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].id;
	$.ajax({
		type : 'post',
		url : 'cpBase/KUser.initPwd.json',
		data : {
			menuId : window.sys_menuId,
			param1 : userId
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

var targetName;
/** 行按钮 授权 */
$('#userManageTable').on('click', 'button[name="rowAuthorize"]', function() {
	userId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].id;
	targetName = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].name;
	$('#targetRole').html(targetName);
	$('#modal_authorize').modal('show');
});

$('#modal_authorize').on('shown.bs.modal', function(){
	
	$('#search_lowerLevel').html(ComboDicOption(true, '菜单下级情况'))
	$('#search_type').html(ComboDicOption(true, '菜单类型'))
	
	/** 检索条件设置 */
	var authorizeQueryFilter = function () {
		var queryFilterArr = [];
		if ($('#search_menuPath').val() != '') {
			queryFilterArr.push({
				'field' : 'pathName',
				'sqlIndex' : "CONCAT( IF( i.name IS NULL, '', CONCAT(i.name, '-') ), IF( h.name IS NULL, '', CONCAT(h.name, '-') ), IF( g.name IS NULL, '', CONCAT(g.name, '-') ), IF( f.name IS NULL, '', CONCAT(f.name, '-') ), IF( e.name IS NULL, '', CONCAT(e.name, '-') ), IF( d.name IS NULL, '', CONCAT(d.name, '-') ), IF( c.name IS NULL, '', CONCAT(c.name, '-') ), IF(b.name IS NULL, '', b.name) )",
				'type' : 'string',
				'value' : $('#search_menuPath').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_menuName').val() != '') {
			queryFilterArr.push({
				'field' : 'name',
				'sqlIndex' : 'a.name',
				'type' : 'string',
				'value' : $('#search_menuName').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_lowerLevel').val() != '') {
			queryFilterArr.push({
				'field' : 'lowerstate',
				'sqlIndex' : 'a.lowerstate',
				'type' : 'string',
				'value' : $('#search_lowerLevel').find("option:selected").val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_type').val() != '') {
			queryFilterArr.push({
				'field' : 'ctype',
				'sqlIndex' : 'a.ctype',
				'type' : 'string',
				'value' : $('#search_type').find("option:selected").val(),
				'operate' : 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	}
	
	/** 搜索按钮 */
	$('#btn_authorizeSearch').click(function() {
		authorizeTableParam.filterParam.filter = authorizeQueryFilter();
		BdoDataTables('authorizeTable', authorizeTableParam);
	});
	
	/** 重置按钮 */
	$('#btn_authorizeClear').click(function() {
		$('#search_menuPath').val(null);
		$('#search_menuName').val(null);
		$('#search_lowerLevel').val(null);
		$('#search_type').val(null);
		authorizeTableParam.filterParam.filter = authorizeQueryFilter();
		BdoDataTables('authorizeTable', authorizeTableParam);
	});
	
	/** table 属性 */
	var authorizeTableParam = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
	//	dom : '<"row"<"col-sm-12"tr>>',
		order : [2, 'asc'],
		//必需
		sourceData : {},
		sourceUrl : 'admin/Menu.queryMenuAuth.json',
		filterParam : {
			menuId : window.sys_menuId,
			param1 : '0',
			param3 : 'user',
			param4 : userId,
			filter : authorizeQueryFilter
		},
		createdRow: function(row, data, index){
			if(data.roleAuthed == 'true'){
				$(row).css('color','#000079');
			} else if (data.authed == 'true'){ 
				$(row).css('color', '#090');
			}
		},
		tableColumns :[
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '100px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="menuAuthorize" data-placement="top" title="菜单授权" data-toggle="tooltip">'
							+ '<i class="fa fa-plus-circle"></i></button>';
					renderStr += '<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="deptAuthorize" data-placement="top" title="部门授权" data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>';
					renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="cancleAuthorize" data-placement="top" title="取消授权" data-toggle="tooltip">'
							+ '<i class="fa fa-minus-circle"></i></button>';
					return renderStr;
				}
			}, {
				targets : 2,
				orderable : true,
				title : '菜单路径',
				name : 'pathName',
				data : 'pathName',
				width : '200px'
			}, {
				targets : 3,
				orderable : true,
				title : '菜单名称',
				name : 'name',
				data : 'name',
				width : '150px'
			}, {
				targets : 4,
				orderable : true,
				title : '下级情况',
				name : 'lowerstate',
				data : 'lowerstate',
				width : '70px',
				render : function(data, type, row, meta) {
					var lowerState = '无';
					switch (row.lowerstate) {
							case '0' :
								lowerState = '无';
								break;
							case '1' :
								lowerState = '有子菜单';
								break;
							case '2' :
								lowerState = '有按钮';
								break
					}
					return lowerState;
				}
			}, {
				targets : 5,
				orderable : true,
				title : '类型',
				name : 'ctype',
				data : 'ctype',
				width : '50px',
				render : function(data, type, row, meta) {
					var ctype = '目录';
					switch (row.ctype) {
						case '00' :
							ctype = '目录';
							break;
						case '01' :
							ctype = '菜单';
							break;
						case '02' :
							ctype = '按钮';
							break
					}
					return ctype
				}
			}, {
				targets : 6,
				orderable : true,
				title : '是否授权',
				name : 'authed',
				data : 'authed',
				width : '70px',
				render : function(data, type, row, meta) {
					var authed;
					if(row.authed != 'false'){
						authed = '是';
					} else {
						authed = '否';
					}
					return authed;
				}
			}, {
				targets : 7,
				orderable : true,
				title : '部门授权',
				name : 'isAuthedDep',
				data : 'isAuthedDep',
				width : '70px',
				render : function(data, type, row, meta) {
					var isAuthedDep;
					if(row.isAuthedDep != 'false'){
						isAuthedDep = '是';
					} else {
						isAuthedDep = '否';
					}
					return isAuthedDep;
				}
			}, {
				targets : 8,
				orderable : true,
				title : '角色权限',
				name : 'roleAuthed',
				data : 'roleAuthed',
				width : '70px',
				render : function(data, type, row, meta) {
					var roleAuthed;
					if(row.roleAuthed != 'false'){
						roleAuthed = '是';
					} else {
						roleAuthed = '否';
					}
					return roleAuthed;
				}
			}, {
				targets : 9,
				orderable : true,
				title : '部门角色授权',
				name : 'roleDepAuthed',
				data : 'roleDepAuthed',
				width : '110px',
				render : function(data, type, row, meta) {
					var roleDepAuthed;
					if(row.roleDepAuthed != 'false'){
						roleDepAuthed = '是';
					} else {
						roleDepAuthed = '否';
					}
					return roleDepAuthed;
				}
			}
		]
	}

	/** table */
	BdoDataTables('authorizeTable', authorizeTableParam);
	
	/** 行按钮 菜单授权  */
	$('#authorizeTable').on('click', 'button[name="menuAuthorize"]', function() {
		var authed = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].authed;
		var name = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].name;
		var id = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].id;
		var fullId = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].fullId;
		if(authed != 'false'){
			bdoErrorBox('失败', name + '本来就已经授权了，不需要重复授权。如果需要调整部门授权，请点击部门授权按钮。');
		} else {
			$.ajax({
				url : 'admin/Menu.addMenuAuth.json',
				type : 'post',
				data : {
					param1 : '0',
					param3 : 'user',
					param4 : userId,
					param5 : id,
					param6 : fullId				
				},
				dataType: 'json',
				async : false,
				success : function(data){
					$('#authorizeTable').DataTable().draw(false);
					bdoSuccessBox('成功', name　+ '菜单已被成功授权。');
				}
			});	
		}
	});
	
	/** 行按钮 菜单解除授权  */
	$('#authorizeTable').on('click', 'button[name="cancleAuthorize"]', function() {
		var authed = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].authed;
		var roleAuthed = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].roleAuthed;
		var name = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].name;
		var id = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].id;
		var fullId = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].fullId;
		var ctype = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].ctype;
		if(authed != 'true'){
			bdoErrorBox('失败', name + '本来就未授权，不需要重复删除授权。如果需要调整部门授权，请点击部门授权按钮。');
		} else if( roleAuthed != 'false') {
			bdoErrorBox('失败', name + '是通过角色授权的，无法删除。如果需要调整部门授权，请点击部门授权按钮。');
		} else {
			$.ajax({
				url : 'admin/Menu.removeMenuAuth.json',
				type : 'post',
				data : {
					param1 : '0',
					param3 : 'user',
					param4 : userId,
					param5 : id,
					param6 : fullId,
					param7 : ctype
				},
				dataType: 'json',
				async : false,
				success : function(data){
					$('#authorizeTable').DataTable().draw(false);
					bdoSuccessBox('成功', name　+ '菜单已被成功解除授权。');
				}
			});	
		}
	});
	
	var targetDeptId;
	/** 行按钮 部门授权  */
	$('#authorizeTable').on('click', 'button[name="deptAuthorize"]', function() {
		var authed = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].authed;
		targetDeptId = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].id;
		targetDeptName = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()].name;
		if(authed != 'true'){
			bdoErrorBox('失败', name + '未授权，不能做调整部门授权。');
		} else {
			$('#modal_deptAuthorize').modal('show');
			$('#targetName').html(targetName);
			$('#targetDeptName').html(targetDeptName);
		}
	});
	
	$('#modal_deptAuthorize').on('shown.bs.modal', function(){
		
		/** 检索条件设置 */
		var deptQueryFilter = function () {
			var queryFilterArr = [];
			if ($('#search_mechanismName').val() != '') {
				queryFilterArr.push({
					'field' : 'firstItemName',
					'sqlIndex' : 'firstItemName',
					'type' : 'string',
					'value' : $('#search_mechanismName').val(),
					'operate' : 'eq'
				});
			}
			if ($('#search_deptName').val() != '') {
				queryFilterArr.push({
					'field' : 'departName',
					'sqlIndex' : 'departName',
					'type' : 'string',
					'value' : $('#search_deptName').val(),
					'operate' : 'eq'
				});
			}
			if ($('#search_deptPath').val() != '') {
				queryFilterArr.push({
					'field' : 'fullName',
					'sqlIndex' : 'fullName',
					'type' : 'string',
					'value' : $('#search_deptPath').val(),
					'operate' : 'eq'
				});
			}
			return JSON.stringify(queryFilterArr);
		}
		
		/** 搜索按钮 */
		$('#btn_deptAuthorizeSearch').click(function() {
			deptAuthorizeTableParam.filterParam.filter = deptQueryFilter();
			BdoDataTables('deptAuthorizeTableParam', deptAuthorizeTableParam);
		});
		
		/** 重置按钮 */
		$('#btn_deptAuthorizeClear').click(function() {
			$('#search_mechanismName').val(null);
			$('#search_deptName').val(null);
			$('#search_deptPath').val(null);
			deptAuthorizeTableParam.filterParam.filter = deptQueryFilter();
			BdoDataTables('deptAuthorizeTableParam', deptAuthorizeTableParam);
		});
		
		/** table 属性 */
		var deptAuthorizeTableParam = {
			tabNum : false,
			scrollX : true,
			lengthChange : true,
			//	dom : '<"row"<"col-sm-12"tr>>',
//			order : [2, 'asc'],
			//必需
			sourceData : {},
			sourceUrl : 'admin/Menu.queryDepartAuth.json',
			filterParam : {
				menuId : window.sys_menuId,
				param1 : '0',
				param3 : 'user',
				param4 : userId,
				param5 : targetDeptId,
				filter : deptQueryFilter
			},
			createdRow: function(row, data, index){
				if(data.authed3 == 'true'){
					$(row).css('color','#000079');
				} else if (data.authed == 'true'){ 
					$(row).css('color', '#090');
				}
			},
			tableColumns :[
				{	
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '<input type="checkbox" id="selectAll" />',
					width : '70px',
					render : function(data, type, row, meta){
						var checkBox = '';
						checkBox +='<input type="checkbox" name="checkAdd" />'
						return checkBox;
					}
				}, {
					targets : 2,
					orderable : true,
					title : '机构名',
					name : 'firstItemName',
					data : 'firstItemName',
					width : '110px'
				}, {
					targets : 3,
					orderable : true,
					title : '部门名',
					name : 'departName',
					data : 'departName',
					width : '150px'
				}, {
					targets : 4,
					orderable : true,
					title : '部门全路径',
					name : 'fullName',
					data : 'fullName',
					width : '300px'
				}, {
					targets : 5,
					orderable : true,
					title : '是否机构',
					name : 'isOffice',
					data : 'isOffice',
					width : '70px',
					render : function(data, type, row, meta) {
						var isOffice;
						if(row.isOffice != '0'){
							authed = '是';
						} else {
							authed = '否';
						}
						return authed;
					}
				}, {
					targets : 6,
					orderable : true,
					title : '是否授权',
					name : 'authed',
					data : 'authed',
					width : '70px',
					render : function(data, type, row, meta) {
						var authed;
						if(row.authed != 'false'){
							authed = '是';
						} else {
							authed = '否';
						}
						return authed;
					}
				}, {
					targets : 7,
					orderable : true,
					title : '是否角色授权',
					name : 'authed3',
					data : 'authed3',
					width : '110px',
					render : function(data, type, row, meta) {
						var authed3;
						if(row.authed3 != 'false'){
							authed3 = '是';
						} else {
							authed3 = '否';
						}
						return authed3;
					}
				} 
			]
		}
	
		/** table */
		BdoDataTables('deptAuthorizeTableParam', deptAuthorizeTableParam);
		
		$('#selectAll').click(function() {
			 var checklist = document.getElementsByName ("checkAdd");   
			 if(document.getElementById("selectAll").checked){
			 	for(var i=0;i<checklist.length;i++){
			    	checklist[i].checked = 1;
			    } 
			 }else{
			    for(var j=0;j<checklist.length;j++){
			        checklist[j].checked = 0;
			    }
			 }
		});
		
		/** 增加授权 */
		$('#btn_authorizeAdd').click(function(){
			var selectedDeps = '';
			$('input[name="checkAdd"]:checked').each(function(){
				var object = $('#deptAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
				if (selectedDeps != '') {
					selectedDeps = selectedDeps + ','
				}
				selectedDeps += object.autoId;
			});
			if(selectedDeps != ''){
				$.ajax({
					url : 'admin/Menu.modifyDepAuth.json',
					type : 'post',
					data : {
						param1 : '0',
						param3 : 'user',
						param4 : userId,
						param5 : targetDeptId,
						param6 : selectedDeps,
						param7 : 'dep',
						param8 : 'append'
					},
					dataType: 'json',
					async : false,
					success : function(data){
						$('#deptAuthorizeTableParam').DataTable().draw(false);
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			} else {
				bdoErrorBox('失败', '请选择要处理的数据。');
			}
		});
		
		/** 取消授权 */
		$('#btn_authorizeMove').click(function(){
			var selectedDeps = '';
			$('input[name="checkAdd"]:checked').each(function(){
				var object = $('#deptAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
				if (selectedDeps != '') {
					selectedDeps = selectedDeps + ','
				}
				selectedDeps += object.autoId;
			});
			if(selectedDeps != ''){
				$.ajax({
					url : 'admin/Menu.modifyDepAuth.json',
					type : 'post',
					data : {
						param1 : '0',
						param3 : 'user',
						param4 : userId,
						param5 : targetDeptId,
						param6 : selectedDeps,
						param7 : 'dep',
						param8 : 'remove'
					},
					dataType: 'json',
					async : false,
					success : function(data){
						$('#deptAuthorizeTableParam').DataTable().draw(false);
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			} else {
				bdoErrorBox('失败', '请选择要处理的数据。');
			}
		});
		
		/** 机构内授权 */
		$('#btn_deptAuthorize').click(function(){
			var selectedDeps = '';
			$('input[name="checkAdd"]:checked').each(function(){
				var object = $('#deptAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
				if (selectedDeps != '') {
					selectedDeps = selectedDeps + ','
				}
				selectedDeps += object.autoId;
			});
							
			var data = {
				param1 : '0',
				param3 : 'user',
				param4 : userId,
				param5 : targetDeptId,
				param6 : selectedDeps,
				param7 : 'office',
				param8 : 'append'
			}
			if(selectedDeps != ''){
				bdoAjaxBox('系统提示', '是否机构内授权？', function () {
			    	$.post('admin/Menu.modifyDepAuth.json', data)
			        .done(function (data) {
						$('#deptAuthorizeTableParam').DataTable().draw(false);
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
			        })
			    });
			} else {
				bdoErrorBox('失败', '请选择要处理的数据。');
			}
		});
		
		/** 非机构内全部授权 */
		$('#btn_allAuthorize').click(function(){
			var data = {
				param1 : '0',
				param3 : 'user',
				param4 : userId,
				param5 : targetDeptId,
				param6 : '',
				param7 : 'depart',
				param8 : 'append',
				param9 : '1'
			}
			bdoAjaxBox('系统提示', '是否非机构全部全部授权？', function () {
		    	$.post('admin/Menu.modifyDepAuth.json', data)
		        .done(function (data) {
					$('#deptAuthorizeTableParam').DataTable().draw(false);
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
		        })
		    });
		});
		
		/** 取消机构内授权 */
		$('#btn_deptAuthorizeMove').click(function(){
			var selectedDeps = '';
			$('input[name="checkAdd"]:checked').each(function(){
				var object = $('#deptAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
				if (selectedDeps != '') {
					selectedDeps = selectedDeps + ','
				}
				selectedDeps += object.autoId;
			});
			
			var data = {
				param1 : '0',
				param3 : 'user',
				param4 : userId,
				param5 : targetDeptId,
				param6 : selectedDeps,
				param7 : 'office',
				param8 : 'remove'
			}
			if(selectedDeps != ''){
				bdoAjaxBox('系统提示', '是否取消机构内授权？', function () {
			    	$.post('admin/Menu.modifyDepAuth.json', data)
			        .done(function (data) {
						$('#deptAuthorizeTableParam').DataTable().draw(false);
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
			        })
		   		});
			} else {
				bdoErrorBox('失败', '请选择要处理的数据。');
			}
		});
		
		/** 取消全部授权 */
		$('#btn_allAuthorizeMove').click(function(){
			var data = {
				param1 : '0',
				param3 : 'user',
				param4 : userId,
				param5 : targetDeptId,
				param6 : '',
				param7 : 'office',
				param8 : 'remove',
				param9 : '1'
			}
			bdoAjaxBox('系统提示', '是否取消全部授权？', function () {
		    	$.post('admin/Menu.modifyDepAuth.json', data)
		        .done(function (data) {
					$('#deptAuthorizeTableParam').DataTable().draw(false);
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
		        })
		    });
		});
		
		/** 关闭 */
		$('#deptAuthorizeClose').click(function(){
			$('#search_mechanismName').val(null);
			$('#search_deptName').val(null);
			$('#search_deptPath').val(null);
			$('#modal_deptAuthorize').modal('hide');
		});
		
	});
	
	/** 关闭 */
	$('#authorizeClose').click(function(){
		$('#search_menuPath').val(null);
		$('#search_menuName').val(null);
		$('#search_lowerLevel').val(null);
		$('#search_type').val(null);
		$('#modal_authorize').modal('hide');
	});
	
});

/** 行按钮 人物角色授权 */
$('#userManageTable').on('click', 'button[name="rowRoleAuthorize"]', function() {
	userId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].id;
	targetName = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].name;
	$('#roleTargetName').html(targetName);
	var targetDeptName = '';
	$.ajax({
		url : 'base/General.query.json',
		type : 'post',
		data : {
			menuId : window.sys_menuId,
			param1 : userId,
			param2 : userLevel,
			sqlId : 'sys.S100085'
		},
		dataType: 'json',
		async : false,
		success : function(data){
			if(data && data.success && data.data && data.data.length > 0){
				for(var i = 0 ; i < data.data.length ; i++){
					if(data.data[i].isAuthed == '1'){
						if (targetDeptName != '') {
							targetDeptName = targetDeptName + ','
						}
						targetDeptName += data.data[i].rolename;
					}
				}
			}
		}
	});
	$('#modal_roleAuthorize').modal('show');
});

$('#modal_roleAuthorize').on('shown.bs.modal', function(){
	
	$('#search_belongDept').treecombo({
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
	var roleQueryFilter = function () {
		var queryFilterArr = [];
		if ($('#search_roleName').val() != '') {
			queryFilterArr.push({
				'field' : 'rolename',
				'sqlIndex' : 'a.rolename',
				'type' : 'string',
				'value' : $('#search_roleName').val(),
				'operate' : 'eq'
			});
		}
		if ($('#search_belongDept').val() != '') {
			queryFilterArr.push({
				'field' : 'departmentId',
				'sqlIndex' : 'a.departmentId',
				'type' : 'list',
				'value' : $('#search_belongDept').treecombo('getTreeComboValue'),
				'operate' : 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	}
	
	/** 搜索按钮 */
	$('#btn_roleAuthorizeSearch').click(function() {
		roleAuthorizeTableParam.filterParam.filter = roleQueryFilter();
		BdoDataTables('roleAuthorizeTableParam', roleAuthorizeTableParam);
	});
	
	/** 重置按钮 */
	$('#btn_roleAuthorizeClear').click(function() {
		$('#search_roleName').val(null);
		$('#search_belongDept').treecombo('setTreeComboValue',[null, null]);
		roleAuthorizeTableParam.filterParam.filter = roleQueryFilter();
		BdoDataTables('roleAuthorizeTableParam', roleAuthorizeTableParam);
	});
	
	/** table 属性 */
	var roleAuthorizeTableParam = {
		tabNum : false,
		scrollX : true,
		lengthChange : true,
		//	dom : '<"row"<"col-sm-12"tr>>',
		order : [2, 'asc'],
		//必需
		sourceData : {},
		sourceUrl : 'base/General.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			param1 : userId,
			param2 : userLevel,
			sqlId : 'sys.S100085',
			filter : roleQueryFilter
		},
		createdRow: function(row, data, index){
			if (data.isAuthed == '1'){ 
				$(row).css('color', '#090');
			}
		},
		tableColumns :[
			{	
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '<input type="checkbox" id="roleSelectAll" />',
				width : '70px',
				render : function(data, type, row, meta){
					var checkBox = '';
					checkBox +='<input type="checkbox" name="roleCheckAdd" />'
					return checkBox;
				}
			}, {
				targets : 2,
				orderable : true,
				title : '角色编号',
				name : 'id',
				data : 'id',
				width : '70px'
			}, {
				targets : 3,
				orderable : true,
				title : '角色名称',
				name : 'rolename',
				data : 'rolename',
				width : '120px'
			}, {
				targets : 4,
				orderable : true,
				title : '角色描述',
				name : 'rolevalue',
				data : 'rolevalue',
				width : '300px'
			}, {
				targets : 5,
				orderable : true,
				title : '所属机构',
				name : 'hrDeptName',
				data : 'hrDeptName',
				width : '150px',
				render : function(data, type, row, meta) {
					return row.__ddepartmentId.hrDeptName;
				}
			}, {
				targets : 6,
				orderable : true,
				title : '是否全所共用',
				name : 'isPublic',
				data : 'isPublic',
				width : '130px',
				render : function(data, type, row, meta) {
					var isPublic;
					if(row.isPublic != '0'){
						isPublic = '是';
					} else {
						isPublic = '否';
					}
					return isPublic;
				}
			}, {
				targets : 7,
				orderable : true,
				title : '授权方式',
				name : 'needUserLevel',
				data : 'needUserLevel',
				width : '150px',
				render : function(data, type, row, meta) {
					return DicVal2Nm(data, '授权方式');
				}
			}, {
				targets : 8,
				orderable : true,
				title : '是否已授权',
				name : 'isAuthed',
				data : 'isAuthed',
				width : '110px',
				render : function(data, type, row, meta) {
					var isAuthed;
					if(row.isAuthed != '0'){
						isAuthed = '是';
					} else {
						isAuthed = '否';
					}
					return isAuthed;
				}
			} 
		]
	}

	/** table */
	BdoDataTables('roleAuthorizeTableParam', roleAuthorizeTableParam);
	
	$('#roleSelectAll').click(function() {
		 var checklist = document.getElementsByName ("roleCheckAdd");   
		 if(document.getElementById("roleSelectAll").checked){
		 	for(var i=0;i<checklist.length;i++){
		    	checklist[i].checked = 1;
		    } 
		 }else{
		    for(var j=0;j<checklist.length;j++){
		        checklist[j].checked = 0;
		    }
		 }
	});
	
	/** 添加角色权限 */
	$('#btn_roleAuthorizeAdd').click(function(){
		var roleId = '';
		$('input[name="roleCheckAdd"]:checked').each(function(){
			var object = $('#roleAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
			if (roleId != '') {
				roleId = roleId + ','
			}
			roleId += object.id;
		});
		if(roleId != ''){
			bdoConfirmBox('请确认', '您确定要给该用户添加选中的角色吗？', function(){
				$.ajax({
					url : 'admin/UserRole.addJS.json',
					type : 'post',
					data : {
						menuId : window.sys_menuId,
						param1 : userId,
						param2 : roleId
					},
					dataType: 'json',
					async : false,
					success : function(data){
						$('#roleAuthorizeTableParam').DataTable().draw(false);
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		} else {
			bdoErrorBox('失败', '请选择要处理的数据。');
		}
	});
	
	/** 删除角色权限 */
	$('#btn_roleAuthorizeMove').click(function(){
		var roleId = '';
		$('input[name="roleCheckAdd"]:checked').each(function(){
			var object = $('#roleAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
			if (roleId != '') {
				roleId = roleId + ','
			}
			roleId += object.id;
		});
		if(roleId != ''){
			bdoConfirmBox('请确认', '您确定要删除该用户选中的角色吗？', function(){
				$.ajax({
					url : 'admin/UserRole.deleteJS.json',
					type : 'post',
					data : {
						menuId : window.sys_menuId,
						param1 : userId,
						param2 : roleId
					},
					dataType: 'json',
					async : false,
					success : function(data){
						$('#roleAuthorizeTableParam').DataTable().draw(false);
						if(data.success === true){
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		} else {
			bdoErrorBox('失败', '请选择要处理的数据。');
		}
	});
	
		/** 关闭 */
	$('#roleAuthorizeClose').click(function(){
		$('#modal_roleAuthorize').modal('hide');
	});
	
});

/** 行按钮 手动同步 */
$('#userManageTable').on('click', 'button[name="rowManual"]', function() {
	var hrLoginId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].hrLoginId;
	var hrId = $('#userManageTable').DataTable().data()[$(this).closest('tr').index()].hrId;
	$.ajax({
		type : 'post',
		url : 'cpBase/KUser.synUserFromHr.json',
		data : {
			menuId : window.sys_menuId,
			param1 : hrLoginId,
			param2 : hrId
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

/** 指定同步 */
$('#btn_synchro').click(function(){
	swal({
	  title : '请确认',
	  text : '指定需同步的用户的域账号：',
	  type: 'warning',
	  input : 'text',
	  showCancelButton: true,
	  cancelButtonText : '取消',
	  confirmButtonText : '确定',
	  allowOutsideClick: false,
	  preConfirm : function(text) {
		return new Promise(function(resolve, reject) {
			if (text.length > 100) {
				reject('请将输入的字符控制在100以内')
			} else {
				resolve()
			}
		})
	  }
	}).then(function(value) {
		$.ajax({
			url : 'cpBase/KUser.synUserFromHr.json',
			data : {
				menuId : window.sys_menuId,
				param1 : value
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
	}).catch(swal.noop);
});

function formdataSet(object){
	$('#e_name').val(object.name);
	$('#e_hrLoginId').val(object.hrLoginId);
	$('#e_departmentid').treecombo('setTreeComboValue',[object.__departmentid.departId,object.__departmentid.departName]);
	$('#e_hrDepart').val(object.hrDepart);
	$('#e_mobilePhone').val(object.mobilephone);
	$('#e_phone').val(object.e_phone);
	$('#e_sex').val(object.sex);
	$('#e_educational').val(object.educational);
	$('#e_bornDate').val(object.bornDate);
	$('#e_rank').val(object.rank);
	$('#e_diploma').val(object.diploma);
	$('#e_email').val(object.email);
	$('#e_cpano').val(object.cpano);
	$('#e_isCpa').val(object.isCpa);
	$('#e_isLXcpa').val(object.isLXCpa);
	$('#e_cpaRelation').val(object.cpaRelation);
	$('#e_cpaState').val(object.cpaState);
	$('#e_hrLoginId1').val(object.hrLoginId);
}