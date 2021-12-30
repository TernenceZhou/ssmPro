pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

//// 模态框设置
//$('.modal').on('show.bs.modal', function(){
//    $(this).draggable({
//		handle: '.block-header',
//		cursor: 'move'
//    });
//    $(this).css('overflow', 'hidden');
//});

/** 角色一览 */
function roleFilter() {
	var queryFilterArr = [];
	if ($('#searchrole_name').val() != '') {
		queryFilterArr.push({
			'field' : 'rolename',
			'sqlIndex' : 'rolename',
			'type' : 'string',
			'value' : $('#searchrole_name').val(),
			'operate' : 'eq'
		});
	}
	if ($('#searchrole_user').val() != '') {
		queryFilterArr.push({
			'field' : 'authedUsers',
			'sqlIndex' : 'authedUsers',
			'type' : 'string',
			'value' : $('#searchrole_user').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
// 角色一览table配置 
var roleParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {
		menuId : window.sys_menuId,
		sqlId : 'sys.S200151',
		filter : roleFilter()
	},
	tableColumns : [
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '处理',
			width : '200px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
					+ '<i class="fa fa-edit"></i></button>&nbsp;';
				renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
					+ '<i class="fa fa fa-times"></i></button>&nbsp;';
				renderStr += '<button class="btn btn-xs btn-primary" type="button" name="rowAuthed" data-placement="top" title="角色授权" data-toggle="tooltip">'
					+ '<i class="fa fa-user-circle"></i></button>&nbsp;';
				renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowDeptrole" data-placement="top" title="部门角色关系" data-toggle="tooltip">'
					+ '<i class="fa fa-list"></i></button>&nbsp;';
				renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowUserrole" data-placement="top" title="人员角色关系" data-toggle="tooltip">'
					+ '<i class="fa fa-user"></i></button>&nbsp;';
				renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
					+ '<i class="fa fa-eye"></i></button>&nbsp;';
				return renderStr;
			}
		}, {
			targets : 2,
			className : 'text-center',
			title : '角色编号',
			name : 'id',
			data : 'id',
			width : '150px'
		}, {
			targets : 3,
			title : '角色名称',
			name : 'rolename',
			data : 'rolename',
			width : '150px'
		}, {
			targets : 4,
			title : '角色描述',
			name : 'rolevalue',
			data : 'rolevalue',
			width : '200px',
			render : function(data, type, row, meta){
				return data;
			}
		}, {
			targets : 5,
			className : 'text-center',
			title : '所属机构',
			name : '__ddepartmentId',
			data : '__ddepartmentId',
			width : '150px',
			render : function(data, type, row, meta){
				return data.departName;
			}
		}, {
			targets : 6,
			className : 'text-center',
			title : '是否全所共用',
			name : 'isPublic',
			data : 'isPublic',
			width : '100px',
			render : function(data, type, row, meta) {
				return DicVal2Nm(data, 'boolean');
			}
		}, {
			targets : 7,
			className : 'text-center',
			title : '授权方式',
			name : 'needUserLevel',
			data : 'needUserLevel',
			width : '150px',
			render : function(data, type, row, meta) {
				return DicVal2Nm(data, '授权方式');
			}
		}, {
			targets : 8,
			title : '角色人员',
			name : 'authedUsers',
			data : 'authedUsers',
			width : '150px',
			render : function(data, type, row, meta){
				if(data.length > 15){
					return data.substring(0, 15) + '......';
				}
				return data;
			}
		}, {
			targets : 9,
			className : 'text-center',
			title : '授权状态',
			name : 'pop',
			data : 'pop',
			width : '150px'
		}, {
			targets : 10,
			className : 'text-center',
			title : '排序',
			name : 'sortNum',
			data : 'sortNum',
			width : '150px'
		}]
};
BdoDataTables('roletable', roleParam);

// 查询 
$('#btn_search').click(function(){
	roleParam.filterParam.filter = roleFilter();
	BdoDataTables('roletable', roleParam);
});

// 重置 
$('#btn_clear').click(function() {
	$('#searchrole_name').val('');
	$('#searchrole_user').val('');
	roleParam.filterParam.filter = roleFilter();
	BdoDataTables('roletable', roleParam);
});

// 角色一览详细表单 
$('#form_role').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'role_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'role_savenext',
			icon : 'fa-chevron-right',
			style : 'btn-success',
			text : '&nbsp;保存并继续'
		},{
			id : 'role_edit',
			icon : 'fa-edit',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'role_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'role_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'role_id',
			type : 'input',
			label : '角色编号',
			typeAttr : {
				placeholder: '保存后自动生成'
			}
		},{
			id : 'role_name',
			type : 'input',
			label : '角色名称',
			validate : {
				rules : {
					required : true,
					maxlength : 10
				}
			}
		},{
			id : 'role_value',
			type : 'input',
			label : '角色描述',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 200
				}
			}
		},{
			id : 'role_depart',
			type : 'select',
			label : '所属机构',
			rowspan : 1,
			html : ComboDBOption('./base/GeneralCombo.findDepartTopManageByCompany.json', true),
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'role_ispublic',
			type : 'select',
			label : '是否全所共用',
			html : ComboDicOption(true, 'boolean'),
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'role_needlevel',
			type : 'select',
			label : '授权方式',
			rowspan : 1,
			html : ComboDicOption(true, '授权方式'),
			validate : {
				rules : {
					required : true
				}
			}
		},{}
	]
});

// 重置角色一览表单 
$('#modal_role').on('hidden.bs.modal', function(){
	$('#modal_role').find('input, select').val('');
	$('#modal_role').find('form td').removeClass('has-error');
  	$('#modal_role').find('form .help-block').remove();
    $('#modal_role').find('input, select').removeAttr('disabled','disabled');
    $('#role_save, #role_savenext, #role_edit, #role_clear').show();
});

// 新增角色 
$('#btn_roleadd').click(function(){
	$('#role_edit').hide();
	$('#role_id').attr('disabled','disabled');
	$('#modal_role').modal('show');
});

// 保存角色 
$('#role_save').click(function(){
	var ajaxparam ={
		bdo_table_id : 'bdo_base.base_role',
		bdo_Maintenance_processType : 'add',
		menuId : window.sys_menuId,
		rolename : $('#role_name').val(),
		rolevalue : $('#role_value').val(),
		departmentId : $('#role_depart').val(),
		isPublic : $('#role_ispublic').val(),
		needUserLevel : $('#role_needlevel').val()
	};
	rolesubmit(true, ajaxparam);
});

// 保存并继续 
$('#role_savenext').click(function(){
	var ajaxparam ={
		bdo_table_id : 'bdo_base.base_role',
		bdo_Maintenance_processType : 'add',
		menuId : window.sys_menuId,
		rolename : $('#role_name').val(),
		rolevalue : $('#role_value').val(),
		departmentId : $('#role_depart').val(),
		isPublic : $('#role_ispublic').val(),
		needUserLevel : $('#role_needlevel').val()
	};
	rolesubmit(false, ajaxparam);
});

// 修改角色 
$('#role_edit').click(function(){
	var ajaxparam ={
		bdo_table_id : 'bdo_base.base_role',
		bdo_Maintenance_processType : 'edit',
		menuId : window.sys_menuId,
		id : $('#role_id').val(),
		rolename : $('#role_name').val(),
		rolevalue : $('#role_value').val(),
		departmentId : $('#role_depart').val(),
		isPublic : $('#role_ispublic').val(),
		needUserLevel : $('#role_needlevel').val()
	};
	rolesubmit(true, ajaxparam);
});

function rolesubmit(submittype, submiparam){
	var submiturl;
	if(submiparam.bdo_Maintenance_processType == 'edit'){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_role').formview(
		'setAjaxConf',
		[
			submiturl,
			submiparam,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#roletable').DataTable().draw(false);
					if(submittype){
						$('#modal_role').modal('hide');	
					}
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_role').submit();
}

// 重置 
$('#role_clear').click(function(){
	$('#modal_role').find('input, select').val('');
});

// 关闭 
$('#role_close').click(function(){
	$('#modal_role').modal('hide');
});

// 行双击 
$('#roletable tbody').on('dblclick', 'tr', function() {
	$('#modal_role').find('input, select').attr('disabled','disabled');
	$('#role_save, #role_savenext, #role_edit, #role_clear').hide();
	var object = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	roleinfoSet(object);
	$('#modal_role').modal('show');
});

// 行按钮 修改角色 
$('#roletable').on('click', 'button[name="rowEdit"]', function() {
	$('#role_save, #role_savenext, #role_clear').hide();
	$('#role_id').attr('disabled','disabled');
	var object = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	roleinfoSet(object);
	$('#modal_role').modal('show');
});

// 行按钮 删除角色 
$('#roletable').on('click', 'button[name="rowDelete"]', function() {
	var object = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('确认', '是否删除角色', function(){
		$.ajax({
			url : './base/general.deleteByKey.json',
			type : 'post',
			data : {
				bdo_table_id : 'bdo_base.base_role',
				bdo_Maintenance_processType : 'delete',
				menuId : window.sys_menuId,
				id : object.id,
				rolename : $('#role_name').val(),
				rolevalue : $('#role_value').val(),
				departmentId : $('#role_depart').val(),
				isPublic : $('#role_ispublic').val(),
				needUserLevel : $('#role_needlevel').val()
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#roletable').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

var rolerow;
// 行按钮 角色授权 
$('#roletable').on('click', 'button[name="rowAuthed"]', function() {
	rolerow = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	$('#modal_authorize').modal('show');
});

// 行按钮 人员角色关系 
$('#roletable').on('click', 'button[name="rowUserrole"]', function() {
	rolerow = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	$('#modal_roleuser').modal('show');
});

// 行按钮 部门角色关系 
$('#roletable').on('click', 'button[name="rowDeptrole"]', function() {
	rolerow = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	$('#modal_roledepart').modal('show');
});

// 行按钮 查看 
$('#roletable').on('click', 'button[name="rowView"]', function() {
	$('#modal_role').find('input, select').attr('disabled','disabled');
	$('#role_save, #role_savenext, #role_edit, #role_clear').hide();
	var object = $('#roletable').DataTable().data()[$(this).closest('tr').index()];
	roleinfoSet(object);
	$('#modal_role').modal('show');
});

// 角色详细信息表单赋值 
function roleinfoSet(obj){
	$('#role_id').val(obj.id);
	$('#role_name').val(obj.rolename);
	$('#role_value').val(obj.rolevalue);
	$('#role_depart').val(obj.__ddepartmentId.firstItemId);
	$('#role_ispublic').val(obj.isPublic);
	$('#role_needlevel').val(obj.needUserLevel);
}

/**  菜单授权  */
$('#search_lowerLevel').html(ComboDicOption(true, '菜单下级情况'));
$('#search_type').html(ComboDicOption(true, '菜单类型'));
// 菜单授权检索条件 
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
};
// 菜单授权table配置 
var authorizeTableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	//必需
	sourceData : {},
	sourceUrl : 'admin/Menu.queryMenuAuth.json',
	filterParam : {},
	createdRow: function(row, data, index){
		if (data.authed == 'true'){ 
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
		}
	]
};

// 菜单授权窗口打开 
$('#modal_authorize').on('shown.bs.modal', function(){
	$('#targetRole').html(rolerow.rolename);
	authorizeTableParam.filterParam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param3 : 'role',
		param4 : rolerow.id,
		authItem : rolerow.rolename,
		filter : authorizeQueryFilter
	};
	BdoDataTables('authorizeTable', authorizeTableParam);
});

// 搜索按钮 
$('#btn_authorizeSearch').click(function() {
	authorizeTableParam.filterParam.filter = authorizeQueryFilter();
	BdoDataTables('authorizeTable', authorizeTableParam);
});

// 重置按钮 
$('#btn_authorizeClear').click(function() {
	$('#search_menuPath').val('');
	$('#search_menuName').val('');
	$('#search_lowerLevel').val('');
	$('#search_type').val('');
	authorizeTableParam.filterParam.filter = authorizeQueryFilter();
	BdoDataTables('authorizeTable', authorizeTableParam);
});

// 行按钮 菜单授权  
$('#authorizeTable').on('click', 'button[name="menuAuthorize"]', function() {
	var authorizerow = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()];
	if(authorizerow.authed == 'true'){
		bdoErrorBox('失败', authorizerow.name + '本来就已经授权了，不需要重复授权。如果需要调整部门授权，请点击部门授权按钮。');
	} else {
		$.ajax({
			url : 'admin/Menu.addMenuAuth.json',
			type : 'post',
			data : {
				param1 : '0',
				param3 : 'role',
				param4 : rolerow.id,
				param5 : authorizerow.id,
				param6 : authorizerow.fullId,
				menuId : window.sys_menuId
			},
			dataType: 'json',
			async : false,
			success : function(data){
				$('#authorizeTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', authorizerow.name　+ '菜单已被成功授权。');
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});	
	}
});

// 行按钮 菜单解除授权  
$('#authorizeTable').on('click', 'button[name="cancleAuthorize"]', function() {
	var authorizerow = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()];
	if(authorizerow.authed == 'true'){
		$.ajax({
			url : 'admin/Menu.removeMenuAuth.json',
			type : 'post',
			data : {
				param1 : '0',
				param3 : 'role',
				param4 : rolerow.id,
				param5 : authorizerow.id,
				param6 : authorizerow.fullId,
				param7 : authorizerow.ctype,
				menuId : window.sys_menuId
			},
			dataType: 'json',
			async : false,
			success : function(data){
				$('#authorizeTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', authorizerow.name　+ '菜单已被成功解除授权。');
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});	
	} else {
		bdoErrorBox('失败', authorizerow.name + '本来就未授权，不需要重复删除授权。如果需要调整部门授权，请点击部门授权按钮。');
	}
});

/**  部门授权  */
var menurow;
// 行按钮 部门授权  
$('#authorizeTable').on('click', 'button[name="deptAuthorize"]', function() {
	menurow = $('#authorizeTable').DataTable().data()[$(this).closest('tr').index()];
	if(menurow.authed == 'true'){
		$('#modal_deptAuthorize').modal('show');
	} else{
		bdoErrorBox('失败', '菜单未授权,不能进行部门授权');
	}
	
});
// 部门授权检索条件  
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
};
// 部门授权table配置  
var deptAuthorizeTableParam = {
	tabNum : false,
	scrollX : true,
	lengthChange : true,
//	order : [2, 'desc'],
	//必需
	sourceData : {},
	sourceUrl : 'admin/Menu.queryDepartAuth.json',
	filterParam : {},
	createdRow: function(row, data, index){
		if(data.authed == 'true'){ 
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
				checkBox +='<input type="checkbox" name="checkAdd" />';
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
};

// 部门授权table  
$('#modal_deptAuthorize').on('shown.bs.modal', function(){
	$('#targetName').html(rolerow.rolename);
	$('#targetDeptName').html(menurow.name);
	deptAuthorizeTableParam.filterParam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		authItem :rolerow.rolename,
		authMenu : menurow.name,
		filter : deptQueryFilter
	};
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
});

// 搜索按钮 
$('#btn_deptAuthorizeSearch').click(function() {
	deptAuthorizeTableParam.filterParam.filter = deptQueryFilter();
	BdoDataTables('deptAuthorizeTableParam', deptAuthorizeTableParam);
});

// 重置按钮 
$('#btn_deptAuthorizeClear').click(function() {
	$('#search_mechanismName').val('');
	$('#search_deptName').val('');
	$('#search_deptPath').val('');
	deptAuthorizeTableParam.filterParam.filter = deptQueryFilter();
	BdoDataTables('deptAuthorizeTableParam', deptAuthorizeTableParam);
});

// 增加授权 
$('#btn_authorizeAdd').click(function(){
	var ajaxparam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param2 : '',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		param6 : '',
		param7 : 'dep',
		param8 : 'append'
	};
	modifyDeptAuth(true, $(this).find('i').text(), ajaxparam);
});

// 取消授权 
$('#btn_authorizeMove').click(function(){
	var ajaxparam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param2 : '',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		param6 : '',
		param7 : 'dep',
		param8 : 'remove'
	};
	modifyDeptAuth(true, $(this).find('i').text(), ajaxparam);
});

// 机构内授权 
$('#btn_deptAuthorize').click(function(){
	var ajaxparam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param2 : '',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		param6 : '',
		param7 : 'office',
		param8 : 'append'
	};
	modifyDeptAuth(true, $(this).find('i').text(), ajaxparam);
});

// 非机构内全部授权 
$('#btn_allAuthorize').click(function(){
	var ajaxparam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param2 : '',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		param6 : '',
		param7 : 'depart',
		param8 : 'append',
		param9 : '1'
	};
	modifyDeptAuth(false, $(this).find('i').text(), ajaxparam);
});

// 取消机构内授权 
$('#btn_deptAuthorizeMove').click(function(){
	var ajaxparam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param2 : '',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		param6 : '',
		param7 : 'office',
		param8 : 'remove'
	};
	modifyDeptAuth(true, $(this).find('i').text(), ajaxparam);
});

// 取消全部授权 
$('#btn_allAuthorizeMove').click(function(){
	var ajaxparam = {
		menuId : window.sys_menuId,
		param1 : '0',
		param2 : '',
		param3 : 'role',
		param4 : rolerow.id,
		param5 : menurow.id,
		param6 : '',
		param7 : 'office',
		param8 : 'remove',
		param9 : '1'
	};
	modifyDeptAuth(false, $(this).find('i').text(), ajaxparam);
});

function modifyDeptAuth(usedept, title, ajaxparam){
	var selectedDeps = '';
	if(usedept){
		$('input[name="checkAdd"]:checked').each(function(){
			var object = $('#deptAuthorizeTableParam').DataTable().data()[$(this).closest('tr').index()];
			if (selectedDeps != '') {
				selectedDeps = selectedDeps + ','
			}
			selectedDeps += object.autoId;
		});
	}
	if(selectedDeps == ''  && usedept){
		bdoErrorBox('失败', '请选择要处理的数据。');
	} else{
		bdoAjaxBox('授权', '是否' + title +'?', function () {
			ajaxparam.param6 = selectedDeps;
			$.post('admin/Menu.modifyDepAuth.json', ajaxparam).done(function (data) {
				$('#deptAuthorizeTableParam').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			});
		});
	}
}

/**  人员角色关系  */
$('#roleuser_depart').treecombo({
	url : 'base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});
// 人员角色关系检索条件  
var userroleQueryFilter = function () {
	var queryFilterArr = [];
	if ($('#roleuser_name').val() != '') {
		queryFilterArr.push({
			'field' : '__uuserid',
			'sqlIndex' : "userid",
			'type' : 'string',
			'value' : $('#roleuser_name').val(),
			'operate' : 'eq'
		});
	}
	if ($('#roleuser_depart').val() != '') {
		queryFilterArr.push({
			'field' : 'a.__ddepartmentid',
			'sqlIndex' : "a.departmentid",
			'type' : 'string',
			'value' : $('#roleuser_depart').val(),
			'operate' : 'eq'
		});
	}
	if ($('#roleuser_rank').val() != '') {
		queryFilterArr.push({
			'field' : 'rank',
			'sqlIndex' : "rank",
			'type' : 'string',
			'value' : $('#roleuser_rank').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
};
// 人员角色关系table配置  
var userroleTableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'desc'],
	//必需
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {},
	tableColumns :[
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '<input type="checkbox" id="userselectedAll">',
			width : '70px',
			render : function(data, type, row, meta){
				var checkBox = '';
				checkBox +='<input type="checkbox" name="usercheckedAdd">';
				return checkBox;
			}
		},{
			targets : 2,
			orderable : true,
			title : '用户名',
			name : 'userid',
			data : '__uuserid',
			width : '100px',
			render : function(data, type, row, meta) {
				if(!data) {
					return '';
				}
				return data.userName + '(' + data.hrLoginId + ')';
			}
		},{
			targets : 3,
			orderable : true,
			title : '所属部门',
			name : '__ddepartmentid',
			data : '__ddepartmentid',
			width : '150px',
			render : function(data, type, row, meta) {
				return data.departName;
			}
		},{
			targets : 4,
			orderable : true,
			title : '角色名称',
			name : 'rolename',
			data : 'rolename',
			width : '200px'
		},{
			targets : 5,
			orderable : true,
			title : 'rank',
			name : 'rank',
			data : 'rank',
			width : '200px'
		}
	],
	tableParam: {
		columnDefs : [
			/*{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '<input type="checkbox" id="userselectedAll">',
				width : '70px',
				render : function(data, type, row, meta){
					var checkBox = '';
					checkBox +='<input type="checkbox" name="usercheckedAdd">'
					return checkBox;
				}
			},*/{
				targets : 2,
				orderable : true,
				title : '用户名',
				name : 'userid',
				data : '__uuserid',
				width : '100px',
				render : function(data, type, row, meta) {
					if(!data) {
						return '';
					}
					return data.userName + '(' + data.hrLoginId + ')';
				}
			},{
				targets : 3,
				orderable : true,
				title : '所属部门',
				name : '__ddepartmentid',
				data : '__ddepartmentid',
				width : '150px',
				render : function(data, type, row, meta) {
					return data.departName;
				}
			},{
				targets : 4,
				orderable : true,
				title : '角色名称',
				name : 'rolename',
				data : 'rolename',
				width : '200px'
			},{
				targets : 5,
				orderable : true,
				title : 'rank',
				name : 'rank',
				data : 'rank',
				width : '200px'
			}
		]
	},
	localParam: {
		url: 'base/General.query.json',
		urlparam: {
			sqlId: 'sys.S200152',
			menuId: '30010003'
		}
	}
};

// 人员角色关系table  
$('#modal_roleuser').on('shown.bs.modal', function(){
	userroleTableParam.filterParam = {
		sqlId : 'sys.S200152',
		param1 : rolerow.id,
		menuId : window.sys_menuId,
		filter : userroleQueryFilter
	};
	BdoDataTables('roleuserTable', userroleTableParam);
	$('#userselectedAll').click(function() {
		var checklist = document.getElementsByName ("usercheckedAdd");
		if(document.getElementById("userselectedAll").checked){
			for(var i=0;i<checklist.length;i++){
				checklist[i].checked = 1;
			} 
		}else{
			for(var j=0;j<checklist.length;j++){
				checklist[j].checked = 0;
			}
		}
	});
});

// 查询 
$('#btn_roleuserSearch').click(function(){
	userroleTableParam.filterParam.filter = userroleQueryFilter();
	BdoDataTables('roleuserTable', userroleTableParam);
});

// 重置 
$('#btn_roleuserClear').click(function() {
	$('#roleuser_name').val('');
	$('#roleuser_depart').treecombo('setTreeComboValue',['', '']);
	$('#roleuser_rank').val('');
	userroleTableParam.filterParam.filter = userroleQueryFilter();
	BdoDataTables('roleuserTable', userroleTableParam);
});

// 添加人员 
$('#btn_useradd').click(function(){
	$('#modal_user').modal('show')
});

$('#user_depart').treecombo({
	url : './base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});
// 所有人员检索条件  
var userQueryFilter = function () {
	var queryFilterArr = [];
	if ($('#user_name').val() != '') {
		queryFilterArr.push({
			'field' : 'name',
			'sqlIndex' : "name",
			'type' : 'string',
			'value' : $('#user_name').val(),
			'operate' : 'eq'
		});
	}
	if ($('#user_depart').val() != '') {
		queryFilterArr.push({
			'field' : 'departname',
			'sqlIndex' : "departname",
			'type' : 'string',
			'value' : $('#user_depart').val(),
			'operate' : 'eq'
		});
	}
	if ($('#user_rank').val() != '') {
		queryFilterArr.push({
			'field' : 'rank',
			'sqlIndex' : "rank",
			'type' : 'string',
			'value' : $('#user_rank').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
};
// 所有人员table  
var userTableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [16, 'desc'],
	//必需
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {},
	tableColumns :[
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '<input type="checkbox" id="userselectAll">',
			width : '50px',
			render : function(data, type, row, meta){
				var checkBox = '';
				checkBox +='<input type="checkbox" name="usercheckAdd">';
				return checkBox;
			}
		},{
			targets : 2,
			orderable : true,
			className : 'text-center',
			title : '姓名',
			name : 'name',
			data : 'name',
			width : '100px',
			render : function(data, type, row, meta){
				return data + '(' + row.hrLoginId + ')';
			}
		},{
			targets : 3,
			orderable : true,
			className : 'text-center',
			title : '性别',
			name : 'sex',
			data : 'sex',
			width : '50px'
		},{
			targets : 4,
			orderable : true,
			title : '薪酬级别',
			name : 'rank',
			data : 'rank',
			width : '200px'
		},{
			targets : 5,
			orderable : true,
			title : '机构名',
			name : 'firstItemName',
			data : 'firstItemName',
			width : '200px'
		},{
			targets : 6,
			orderable : true,
			title : '部门名',
			name : 'departname',
			data : 'departname',
			width : '200px'
		},{
			targets : 7,
			orderable : true,
			title : '电话',
			name : 'phone',
			data : 'phone',
			width : '100px'
		},{
			targets : 8,
			orderable : true,
			title : '手机',
			name : 'mobilePhone',
			data : 'mobilePhone',
			width : '100px'
		},{
			targets : 9,
			orderable : true,
			className : 'text-center',
			title : '短号',
			name : 'ipPhone',
			data : 'ipPhone',
			width : '100px'
		},{
			targets : 10,
			orderable : true,
			title : '邮箱',
			name : 'email',
			data : 'email',
			width : '100px'
		},{
			targets : 11,
			orderable : true,
			title : 'CPA编号',
			name : 'cpano',
			data : 'cpano',
			width : '100px'
		},{
			targets : 12,
			orderable : true,
			title : '是否立信CPA',
			name : 'isLXCpa',
			data : 'isLXCpa',
			width : '50px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'boolean');
			}
		},{
			targets : 13,
			orderable : true,
			title : 'CPA关系所在地',
			name : 'cpaRelation',
			data : 'cpaRelation',
			width : '200px'
		},{
			targets : 14,
			orderable : true,
			title : 'HR所属机构',
			name : 'hrdeptcode019',
			data : 'hrdeptcode019',
			width : '200px'
		},{
			targets : 15,
			orderable : true,
			title : 'HR所属部门',
			name : 'hrDepart',
			data : 'hrDepart',
			width : '200px'
		},{
			targets : 16,
			orderable : true,
			title : '人员编号',
			name : 'id',
			data : 'id',
			width : '200px',
			visible : true
		}
	]
};

// 所有人员table  
$('#modal_user').on('shown.bs.modal', function(){
	userTableParam.filterParam = {
		sqlId : 'sys.S200149',
		menuId : window.sys_menuId,
		filter : userQueryFilter
	};
	BdoDataTables('userTable', userTableParam);
	$('#userselectAll').click(function() {
		var checklist = document.getElementsByName ("usercheckAdd");   
		if(document.getElementById("userselectAll").checked){
			for(var i=0;i<checklist.length;i++){
				checklist[i].checked = 1;
			} 
		}else{
			for(var j=0;j<checklist.length;j++){
				checklist[j].checked = 0;
			}
		}
	});
});

// 查询 
$('#btn_userSearch').click(function(){
	userTableParam.filterParam.filter = userQueryFilter();
	BdoDataTables('userTable', userTableParam);
});

// 重置 
$('#btn_userClear').click(function() {
	$('#user_name').val('');
	$('#user_depart').treecombo('setTreeComboValue',['', '']);
	$('#user_rank').val('');
	userTableParam.filterParam.filter = userQueryFilter();
	BdoDataTables('userTable', userTableParam);
});

// 添加人员  
$('#btn-userSelect').click(function(){
	var selecteduser = '';
	$('input[name="usercheckAdd"]:checked').each(function(){
		var object = $('#userTable').DataTable().data()[$(this).closest('tr').index()];
		if (selecteduser != '') {
			selecteduser = selecteduser + ','
		}
		selecteduser += object.id;
	});
	$.ajax({
		url : 'admin/UserRole.addJS.json',
		type : 'post',
		data : {
			menuId : window.sys_menuId,
			param1 : selecteduser,
			param2 : rolerow.id
		},
		dataType : 'json',
		success : function(data){
			$('#modal_user').modal('hide');
			$('#roleuserTable').DataTable().draw(false);
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

$('#btn_userexport').click(() => {
	$.extend(userroleTableParam.localParam.urlparam, userroleTableParam.filterParam);
	exportExcel(this, '角色用户', userroleTableParam, 'roleuserTable');
});

// 删除人员 
$('#btn_userdelete').click(function(){
	var selecteduser = '';
	$('input[name="usercheckedAdd"]:checked').each(function(){
		var object = $('#roleuserTable').DataTable().data()[$(this).closest('tr').index()];
		if (selecteduser != '') {
			selecteduser = selecteduser + ','
		}
		selecteduser += object.__uuserid.userId;
	});
	$.ajax({
		url : 'admin/UserRole.deleteJS.json',
		type : 'post',
		data : {
			menuId : window.sys_menuId,
			param1 : selecteduser,
			param2 : rolerow.id
		},
		dataType : 'json',
		success : function(data){
			$('#roleuserTable').DataTable().draw(false);
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

// 添加所有人员 
$('#btn_useraddall').click(function(){
	bdoAjaxBox('添加', '是否添加所有人员', function () {
		$.ajax({
			url : 'admin/UserRole.addAllJS.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : rolerow.id
			},
			dataType : 'json',
			success : function(data){
				$('#roleuserTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

var deptusertype;
// 添加部门下所有人员  
$('#btn_useradddept').click(function(){
	depttype = true;
	$('#modal_depart').modal('show');
});
// 删除部门下所有人员  
$('#btn_userdeletedept').click(function(){
	depttype = false;
	$('#modal_depart').modal('show');
});
$('#modal_depart').on('hidden.bs.modal', function(){
	$('#role_deptuser').treecombo('setTreeComboValue',['', '']);
});
$('#role_deptuser').treecombo({
	url : './base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});
// 添加/删除部门下所有人员  

$('#btn_roleuser').click(function(){
	var alerttitle;
	if(depttype == '1'){
		alerttitle = '添加';
		submiturl = 'admin/UserRole.addDepartUser.json';
	} else{
		alerttitle = '删除';
		submiturl = 'admin/UserRole.delDepartUser.json';
	}
	bdoAjaxBox(alerttitle, '是否' + alerttitle + '指定部门下的人员', function () {
		$.ajax({
			url : submiturl,
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : rolerow.id,
				param2 : $('#role_deptuser').attr('data-result')
			},
			dataType : 'json',
			success : function(data){
				$('#modal_depart').modal('hide');
				$('#roleuserTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 部门角色 */
// 部门角色检索条件 
var roledeptQueryFilter = function () {
	var queryFilterArr = [];
	if ($('#roledepart_name').val() != '') {
		queryFilterArr.push({
			'field' : 'departname',
			'sqlIndex' : 'departname',
			'type' : 'string',
			'value' : $('#roledepart_name').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
};
// 部门角色table配置 
var roledeptTableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
//	order : [2, 'asc'],
	//必需
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {},
	tableColumns :[
		{
			targets : 1,
			orderable : false,
			className : 'text-center',
			title : '<input type="checkbox" id="departselectAll">',
			width : '50px',
			render : function(data, type, row, meta){
				var checkBox = '';
				checkBox +='<input type="checkbox" name="departcheckAdd">';
				return checkBox;
			}
		}, {
			targets : 2,
			orderable : true,
			title : '部门名称',
			name : 'departname',
			data : 'departname',
			width : '200px'
		}, {
			targets : 3,
			orderable : true,
			title : '所属机构',
			name : 'firstItemName',
			data : 'firstItemName',
			width : '200px'
		}, {
			targets : 4,
			orderable : true,
			title : '全路径',
			name : 'fullName',
			data : 'fullName',
			width : '200px'
		}, {
			targets : 5,
			orderable : true,
			className : 'text-center',
			title : '是否机构',
			name : 'isOffice',
			data : 'isOffice',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'boolean');
			}
		}, {
			targets : 6,
			orderable : true,
			className : 'text-center',
			title : '是否全所',
			name : 'isCompany',
			data : 'isCompany',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'boolean');
			}
		}
	]
};

// 部门角色窗口打开 
$('#modal_roledepart').on('shown.bs.modal', function(){
	roledeptTableParam.filterParam = {
		menuId : window.sys_menuId,
		sqlId : 'sys.S100131',
		param1 : rolerow.id,
		filter : roledeptQueryFilter
	};
	BdoDataTables('roledepartTable', roledeptTableParam);
	$('#departselectAll').click(function() {
		var checklist = document.getElementsByName ("departcheckAdd");   
		if(document.getElementById("departselectAll").checked){
			for(var i=0;i<checklist.length;i++){
				checklist[i].checked = 1;
			} 
		}else{
			for(var j=0;j<checklist.length;j++){
				checklist[j].checked = 0;
			}
		}
	});
});

// 搜索按钮 
$('#btn_roledepartSearch').click(function() {
	roledeptTableParam.filterParam.filter = roledeptQueryFilter();
	BdoDataTables('roledepartTable', roledeptTableParam);
});

// 重置按钮 
$('#btn_roledepartClear').click(function() {
	$('#roledepart_name').val('');
	roledeptTableParam.filterParam.filter = roledeptQueryFilter();
	BdoDataTables('roledepartTable', roledeptTableParam);
});

$('#role_dept').treecombo({
	url : './base/TreeCommon.findDepartTree.json',
	params : {},
	view : {
		leafIcon: 'fa fa-building text-flat',    
		nodeIcon: 'fa fa-bank text-primary-light',
		folderSelectable: true,
		multiSelect: false
	}
});

var dtpttype;
// 添加部门 
$('#btn_roledepartadd').click(function() {
	$('#modal_departrole').modal('show');
});

// 删除部门 
$('#btn_roledepartdelete').click(function() {
	var selectedDeps = '';
	$('input[name="departcheckAdd"]:checked').each(function(){
		var object = $('#roledepartTable').DataTable().data()[$(this).closest('tr').index()];
		if (selectedDeps != '') {
			selectedDeps = selectedDeps + ','
		}
		selectedDeps += object.deptid;
	});
	if(selectedDeps != ''){
		bdoAjaxBox('删除', '是否删除部门', function () {
			$.ajax({
				url : 'admin/UserRole.delDepartToRole.json',
				type : 'post',
				data : {
					menuId : window.sys_menuId,
					param1 : rolerow.id,
					param2 : selectedDeps
				},
				dataType : 'json',
				success : function(data){
					$('#roledepartTable').DataTable().draw(false);
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	} else {
		bdoErrorBox('失败', '请选择要处理的数据');
	}
});

// 添加部门 
$('#btn_roledepart').click(function() {
	bdoAjaxBox('添加', '是否添加部门', function () {
		$.ajax({
			url : 'admin/UserRole.addDepartToRole.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : rolerow.id,
				param2 : $('#role_dept').attr('data-result')
			},
			dataType : 'json',
			success : function(data){
				$('#modal_departrole').modal('hide');
				$('#roledepartTable').DataTable().draw(false);
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

$('#modal_departrole').on('hidden.bs.modal', function(){
	$('#role_dept').treecombo('setTreeComboValue',['', '']);
});