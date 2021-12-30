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

/** 数据库维护 */
// 库 表单
$('#form_schema').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'schema_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'schema_savenext',
			icon : 'fa-chevron-right',
			style : 'btn-success',
			text : '&nbsp;保存并继续'
		},{
			id : 'schema_edit',
			icon : 'fa-edit',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'schema_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'schema_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'schema_dbNm',
			type : 'input',
			label : '数据库名',
			validate : {
				rules : {
					required : true,
					maxlength : 50
				}
			}
		},{
			id : 'schema_dbNmCn',
			type : 'input',
			label : '数据库中文名',
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 100
				}
			}
		},{
			id : 'schema_dbDesc',
			type : 'input',
			label : '数据库描述',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				normal : true
			},
			validate : {
				rules : {
					maxlength : 500
				}
			}
		},{
			id : 'schema_ACTIVE_FLAG',
			type : 'select',
			html : ComboDicOption(true, 'activeFlag'),
			label : '是否有效',
			rowspan : 1
		},{}
	]
});
//检索条件
function schemaFilter() {
	var queryFilterArr = [];
	if ($('#search_dbNm').val() != '') {
		queryFilterArr.push({
			'field' : 'dbNm',
			'sqlIndex' : 'dbNm',
			'type' : 'string',
			'value' : $('#search_dbNm').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
var schemaParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'base/General.findForSingleTable.json',
	filterParam : {
		menuId : window.sys_menuId,
		tableNm : 'bdo_base.base_defdatabase',
		showWho : 'true',
		filter : schemaFilter()
	},
	createdRow: function(row, data, index){
		if (data.ACTIVE_FLAG == '0'){ 
			$(row).css('color', 'red');
		}
	},
	tableColumns : [
		{
			targets : 1,
			className : 'text-center',
			title : '操作',
			width : '200px',
			orderable : false,
			render : function(data, type, row, meta){
				var renderStr = '';
				if(row.ACTIVE_FLAG == '1'){
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
						+ '<i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowTable" data-placement="top" title="数据表定义" data-toggle="tooltip">'
						+ '<i class="fa fa-table"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowRewrite" data-placement="top" title="重写本地定义" data-toggle="tooltip">'
						+ '<i class="si si-info"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowInit" data-placement="top" title="初始化库定义" data-toggle="tooltip">'
						+ '<i class="fa fa-circle-o-notch"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowBan" data-placement="top" title="作废" data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>&nbsp;';
				} else{
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowUse" data-placement="top" title="取消作废" data-toggle="tooltip">'
						+ '<i class="fa fa-reply"></i></button>&nbsp;';
				}
				renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
					+ '<i class="fa fa-eye"></i></button>&nbsp;';
				return renderStr;
			}
		},{
			targets : 2,
			title : '数据库名',
			name : 'dbNm',
			data : 'dbNm',
			width : '100px'
		},{
			targets : 3,
			className : 'text-center',
			title : '数据库中文名',
			name : 'dbNmCn',
			data : 'dbNmCn',
			width : '150px'
		},{
			targets : 4,
			className : 'text-center',
			title : '数据库描述',
			name : 'dbDesc',
			data : 'dbDesc',
			width : '200px'
		},{
			targets : 5,
			className : 'text-center',
			title : '创建日',
			name : 'CREATION_DATE',
			data : 'CREATION_DATE',
			width : '150px',
			render : function(data, type, row, meta){
				var date = new Date(data);
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			}
		},{
			targets : 6,
			className : 'text-center',
			title : '创建人',
			name : 'CREATED_BY',
			data : 'CREATED_BY',
			width : '150px',
			render : function(data, type, row, meta){
				if(!data) {
					return '';
				}
				return data.userName;
			}
		},{
			targets : 7,
			className : 'text-center',
			title : '最终更新日',
			name : 'LAST_UPDATE_DATE',
			data : 'LAST_UPDATE_DATE',
			width : '150px',
			render : function(data, type, row, meta){
				var date = new Date(data);
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			}
		},{
			targets : 8,
			className : 'text-center',
			title : '最终更新人',
			name : 'LAST_UPDATED_BY',
			data : 'LAST_UPDATED_BY',
			width : '150px',
			render : function(data, type, row, meta){
				if(!data) {
					return '';
				}
				return data.userName;
			}
		},{
			targets : 9,
			className : 'text-center',
			title : '删除日',
			name : 'ABOLITION_DATE',
			data : 'ABOLITION_DATE',
			width : '150px'
		},{
			targets : 10,
			className : 'text-center',
			title : '删除人',
			name : 'ABOLISHED_BY',
			data : 'ABOLISHED_BY',
			width : '150px'
		},{
			targets : 11,
			className : 'text-center',
			title : '处理系统',
			name : 'PROGRAM_APPLICATION_ID',
			data : 'PROGRAM_APPLICATION_ID',
			width : '100px'
		},{
			targets : 12,
			className : 'text-center',
			title : '处理菜单',
			name : 'PROGRAM_ID',
			data : 'PROGRAM_ID',
			width : '100px'
		},{
			targets : 13,
			className : 'text-center',
			title : '是否有效',
			name : 'ACTIVE_FLAG',
			data : 'ACTIVE_FLAG',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'activeFlag');
			}
		}
	]
};
BdoDataTables('schema_table', schemaParam);

// 行双击 
$('#schema_table tbody').on('dblclick', 'tr', function() {
	$('#schema_save,#schema_savenext,#schema_edit,#schema_clear').hide();
	$('#modal_schema').find('input, select').attr('disabled', 'disabled');
	var object = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	schemaFormSet(object);
	$('#modal_schema').modal('show');
});

// 查询 
$('#btn_search').click(function() {
	schemaParam.filterParam.filter = schemaFilter();
	$('#schema_table').DataTable().ajax.reload();
});

// 重置 
$('#btn_clear').click(function() {
	$('#search_dbNm').val('');
	schemaParam.filterParam.filter = schemaFilter();
	$('#schema_table').DataTable().ajax.reload();
});

$('#modal_schema').on('hidden.bs.modal', function(){
    $('#schema_save,#schema_savenext,#schema_edit,#schema_clear').show();
    $('#modal_schema').find('input, select').removeAttr('disabled', 'disabled');
    $('#modal_schema').find('input, select').val('');
    $('#modal_schema').find('form td').removeClass('has-error');
  	$('#modal_schema').find('form .help-block').remove();
});
var schemaobject;
// 新增 
$('#schema_add').click(function(){
	$('#schema_edit').hide();
	$('#schema_ACTIVE_FLAG').val('1');
	$('#schema_ACTIVE_FLAG').attr('disabled', 'disabled');
	$('#modal_schema').modal('show');
});

// 加载 
$('#schema_load').click(function(){
	swal({
		title : '请输入要重新获取定义的库名',
		text : '请注意：重新获取定义是根据数据库表定义信息来更新目前的表定义数据。对现有的字段定义将不做删除，仅做增加。',
		type: 'warning',
		input : 'text',
		showCancelButton: true,
		cancelButtonText : '取消',
		confirmButtonText : '确定',
		allowOutsideClick: false,
		preConfirm : function(text) {
			return new Promise(function(resolve, reject) {
				if (text.length > 50) {
					reject('请将输入的字符控制在50以内')
				} else {
					resolve()
				}
			})
		}
	}).then(function(value) {
		$.ajax({
			url : 'admin/DBManageInit.refreshSchemaDef.json',
			data : {
				menuId : window.sys_menuId,
				param1 : value
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#schema_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}, function(dismiss) {
	});
});

// 行按钮 修查看
$('#schema_table').on('click', 'button[name="rowView"]', function() {
	$('#schema_save,#schema_savenext,#schema_edit,#schema_clear').hide();
	$('#modal_schema').find('input, select').attr('disabled', 'disabled');
	var object = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	schemaFormSet(object);
	$('#modal_schema').modal('show');
});

// 行按钮 修改 
$('#schema_table').on('click', 'button[name="rowEdit"]', function() {
	$('#schema_save,#schema_savenext,#schema_clear').hide();
	$('#schema_dbNm, #schema_ACTIVE_FLAG').attr('disabled', 'disabled');
	schemaobject = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	schemaFormSet(schemaobject);
	$('#modal_schema').modal('show');
});

// 行按钮 数据表定义 
$('#schema_table').on('click', 'button[name="rowTable"]', function() {
	schemaobject = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	$('#modal_table').modal('show');
});

// 行按钮 重写本地定义 
$('#schema_table').on('click', 'button[name="rowRewrite"]', function() {
	schemaobject = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('重写', '重写[' + schemaobject.dbNmCn + ']本地定义吗?', function(){
		$.ajax({
			url : 'admin/DBManageInit.writeDBDefInfo.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : schemaobject.dbNm
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#schema_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 初始化库定义 
$('#schema_table').on('click', 'button[name="rowInit"]', function() {
	schemaobject = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('初始化', '初始化[' + schemaobject.dbNmCn + ']库定义吗?', function(){
		$.ajax({
			url : 'admin/DBManageInit.refreshSchemaDef.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : schemaobject.dbNm
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#schema_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 作废 
$('#schema_table').on('click', 'button[name="rowBan"]', function() {
	schemaobject = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('作废', '确定作废数据库[' + schemaobject.dbNm + ']吗?', function(){
		var param = {
			menuId : window.sys_menuId,
			bdo_table_id : 'bdo_base.base_defdatabase',
			bdo_Maintenance_processType : 'abolish',
			dbNm : schemaobject.dbNm,
			dbNmCn : schemaobject.dbNmCn,
			dbDesc : schemaobject.dbDesc,
			ACTIVE_FLAG : schemaobject.ACTIVE_FLAG,
			bdo_pk_ : 'dbNm'
		};
		$.ajax({
			url : 'base/general.abolishByKey.json',
			type : 'post',
			data : param,
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#schema_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 取消作废 
$('#schema_table').on('click', 'button[name="rowUse"]', function() {
	schemaobject = $('#schema_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('取消作废', '确定取消作废数据库[' + schemaobject.dbNm + ']吗?', function(){
		var param = {
			menuId : window.sys_menuId,
			bdo_table_id : 'bdo_base.base_defdatabase',
			bdo_Maintenance_processType : 'unabolish',
			dbNm : schemaobject.dbNm,
			dbNmCn : schemaobject.dbNmCn,
			dbDesc : schemaobject.dbDesc,
			ACTIVE_FLAG : schemaobject.ACTIVE_FLAG,
			bdo_pk_ : 'dbNm'
		};
		$.ajax({
			url : 'base/general.unabolishByKey.json',
			type : 'post',
			data : param,
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#schema_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 保存 
$('#schema_save').click(function(){
	var schema_dbNm = $('#schema_dbNm').val();
	
	var reg= new RegExp("^[0-9]*[a-zA-Z_]+[0-9]*$");       
	if(!reg.test(schema_dbNm)){
		bdoErrorBox('失败', '请输入正确的数据库名');
		return;
	}
	
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_defdatabase',
		bdo_Maintenance_processType : 'add',
		dbNm : $('#schema_dbNm').val(),
		dbNmCn : $('#schema_dbNmCn').val(),
		dbDesc : $('#schema_dbDesc').val(),
		ACTIVE_FLAG : '1',
		bdo_pk_ : 'dbNm'
	};
	submitForm(false, param);
});

// 保存并继续 
$('#schema_savenext').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_defdatabase',
		bdo_Maintenance_processType : 'add',
		dbNm : $('#schema_dbNm').val(),
		dbNmCn : $('#schema_dbNmCn').val(),
		dbDesc : $('#schema_dbDesc').val(),
		ACTIVE_FLAG : '1',
		bdo_pk_ : 'dbNm'
	};
	submitForm(true, param);
});

// 修改 
$('#schema_edit').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_defdatabase',
		bdo_Maintenance_processType : 'edit',
		dbNm : $('#schema_dbNm').val(),
		dbNmCn : $('#schema_dbNmCn').val(),
		dbDesc : $('#schema_dbDesc').val(),
		ACTIVE_FLAG : '1',
		bdo_pk_dbNm : schemaobject.dbNm,
		bdo_pk_ : 'dbNm'
	};
	submitForm(false, param);
});

// 重置 
$('#schema_clear').click(function(){
	$('#modal_schema').find('input, select:not(#schema_ACTIVE_FLAG)').val('');
});

// 关闭 
$('#schema_close').click(function(){
	$('#modal_schema').modal('hide');
});

// 保存,修改提交表单 
function submitForm(submittype, param){
	var submiturl;
	if(param.bdo_Maintenance_processType == 'edit'){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_schema').formview(
		'setAjaxConf',
		[
			submiturl,
			param,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#schema_table').DataTable().draw(false);
					if(!submittype){
						$('#modal_schema').modal('hide');
					}
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_schema').submit();
}

// 库 表单赋值 
function schemaFormSet(object){
	$('#schema_dbNm').val(object.dbNm);
	$('#schema_dbNmCn').val(object.dbNmCn);
	$('#schema_dbDesc').val(object.dbDesc);
	$('#schema_ACTIVE_FLAG').val(object.ACTIVE_FLAG);
}

// 表表单
$('#form_table').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'table_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'table_savenext',
			icon : 'fa-chevron-right',
			style : 'btn-success',
			text : '&nbsp;保存并继续'
		},{
			id : 'table_edit',
			icon : 'fa-edit',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'table_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'table_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'table_dbNm',
			type : 'input',
			label : '数据库名'
		},{
			id : 'table_tableNm',
			type : 'input',
			label : '表名',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'table_tableNmCn',
			type : 'input',
			label : '表中文名',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{},{
			id : 'table_tableDesc',
			type : 'input',
			label : '表描述',
			rowspan : 1,
			colspan : 2,
			typeAttr : {
				normal : true
			}
		},{
			id : 'table_containWho',
			type : 'select',
			html : ComboDicOption(true, 'boolean'),
			label : '是否有WHO列',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'table_containMenuId',
			type : 'select',
			html : ComboDicOption(true, 'boolean'),
			label : '是否有菜单列',
			typeAttr : {
				normal : true
			}
		},{
			id : 'table_ACTIVE_FLAG',
			type : 'select',
			html : ComboDicOption(true, 'activeFlag'),
			label : '是否有效',
			rowspan : 1
		},{}
	]
});
function tableFilter() {
	var queryFilterArr = [];
	if ($('#table_search_tablename').val() != '') {
		queryFilterArr.push({
			'field' : 'tableNm',
			'sqlIndex' : 'tableNm',
			'type' : 'string',
			'value' : $('#table_search_tablename').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
var tableParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {},
	createdRow: function(row, data, index){
		if (data.ACTIVE_FLAG == '0'){ 
			$(row).css('color', 'red');
		}
	},
	tableColumns : [
		{
			targets : 1,
			className : 'text-center',
			title : '操作',
			width : '200px',
			orderable : false,
			render : function(data, type, row, meta){
				var renderStr = '';
				if(row.ACTIVE_FLAG == '1'){
					renderStr += '<button class="btn btn-xs btn-primary" type="button" name="tableData" data-placement="top" title="数据维护" data-toggle="tooltip">'
						+ '<i class="fa fa-table"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="tableEdit" data-placement="top" title="修改" data-toggle="tooltip">'
						+ '<i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="tableBan" data-placement="top" title="作废" data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-info" type="button" name="tableTodb" data-placement="top" title="应用到DB" data-toggle="tooltip">'
						+ '<i class="fa fa-hdd-o"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="tableRewrite" data-placement="top" title="重写本地定义" data-toggle="tooltip">'
						+ '<i class="fa fa-pencil-square-o"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-info" type="button" name="tableCol" data-placement="top" title="表定义维护" data-toggle="tooltip">'
						+ '<i class="fa fa-send"></i></button>&nbsp;';
				} else{
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="tableUse" data-placement="top" title="取消作废" data-toggle="tooltip">'
						+ '<i class="fa fa-reply"></i></button>&nbsp;';
				}
				return renderStr;
			}
		},{
			targets : 2,
			title : '数据库名',
			name : 'dbNm',
			data : 'dbNm',
			width : '100px'
		},{
			targets : 3,
			title : '表名',
			name : 'tableNm',
			data : 'tableNm',
			width : '100px'
		},{
			targets : 4,
			title : '表中文名',
			name : 'tableNmCn',
			data : 'tableNmCn',
			width : '150px'
		},{
			targets : 5,
			title : '表描述',
			name : 'tableDesc',
			data : 'tableDesc',
			width : '200px'
		},{
			targets : 6,
			title : '是否有who列',
			name : 'containWho',
			data : 'containWho',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'boolean');
			}
		},{
			targets : 7,
			title : '是否有菜单列',
			name : 'containMenuId',
			data : 'containMenuId',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'boolean');
			}
		},{
			targets : 8,
			title : '是否有效',
			name : 'ACTIVE_FLAG',
			data : 'ACTIVE_FLAG',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, 'activeFlag');
			}
		}
	]
};
$('#modal_table').on('shown.bs.modal', function(){
	tableParam.filterParam = {
		menuId : window.sys_menuId,
		sqlId : 'sys.S100007',
		param1 : schemaobject.dbNm,
		filter : tableFilter()
	};
	BdoDataTables('table_table', tableParam);
});

// 搜索按钮 
$('#table_search').click(function() {
	tableParam.filterParam.filter = tableFilter();
	$('#table_table').DataTable().ajax.reload();
});
// 重置按钮 
$('#table_sclear').click(function() {
	$('#table_search_tablename').val('');
	tableParam.filterParam.filter = tableFilter();
	$('#table_table').DataTable().ajax.reload();
});

$('#modal_tableform').on('hidden.bs.modal', function(){
	$('#table_save,#table_savenext,#table_edit,#table_clear').show();
    $('#modal_tableform').find('input, select').removeAttr('disabled', 'disabled');
    $('#modal_tableform').find('input, select').val('');
    $('#modal_tableform').find('form td').removeClass('has-error');
  	$('#modal_tableform').find('form .help-block').remove();
});

var tableobject;
// 新增 
$('#table_add').click(function(){
	$('#table_edit').hide();
	$('#table_dbNm').val(schemaobject.dbNm);
	$('#table_ACTIVE_FLAG').val('1');
	$('#table_ACTIVE_FLAG, #table_dbNm').attr('disabled', 'disabled');
	$('#modal_tableform').modal('show');
});
// 行按钮 数据维护 
$('#table_table').on('click', 'button[name="tableData"]', function() {
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	
	SingleTableModal({
		dbNm : schemaobject.dbNm,
		tableNm : tableobject.tableNm,
		modalTitle : tableobject.tableNm
	});
	
	$('#' + schemaobject.dbNm + '_' + tableobject.tableNm + '_data').modal('show');
});
// 行按钮 修改 
$('#table_table').on('click', 'button[name="tableEdit"]', function() {
	$('#table_save,#table_savenext, #table_clear').hide();
	$('#table_dbNm, #table_ACTIVE_FLAG').attr('disabled', 'disabled');
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	tableFormSet(tableobject);
	$('#modal_tableform').modal('show');
});
// 加载 
$('#table_load').click(function(){
	$('#modal_table').attr('tabindex', '');
	swal({
		title : '请输入要重新获取定义的库名',
		text : '请注意：重新获取定义是根据数据库表定义信息来更新目前的表定义数据。对现有的字段定义将不做删除，仅做增加。',
		type: 'warning',
		input : 'text',
		showCancelButton: true,
		cancelButtonText : '取消',
		confirmButtonText : '确定',
		allowOutsideClick: false,
		preConfirm : function(text) {
			return new Promise(function(resolve, reject) {
				if (text.length > 50) {
					reject('请将输入的字符控制在50以内')
				} else {
					resolve()
				}
			})
		}
	}).then(function(value) {
		$('#modal_table').attr('tabindex', '-1');
		$.ajax({
			url : 'admin/DBManageInit.refreshSchemaDef.json',
			data : {
				menuId : window.sys_menuId,
				param1 : schemaobject.dbNm,
				param2 : value
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}, function(dismiss) {
		$('#modal_table').attr('tabindex', '-1');
		$('#modal_table').focus();
	});
});

// 行按钮 重写本地定义 
$('#table_table').on('click', 'button[name="tableRewrite"]', function() {
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('重写', '重写[' + tableobject.tableNmCn + ']本地定义吗?', function(){
		$.ajax({
			url : 'admin/DBManageInit.writeDBDefInfo.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : schemaobject.dbNm,
				param2 : tableobject.tableNm
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 应用到DB 
$('#table_table').on('click', 'button[name="tableTodb"]', function() {
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	$.ajax({
		url : 'admin/DBManage.getDDLScriptForProcess.json',
		type : 'post',
		data : {
			menuId : window.sys_menuId,
			param1 : schemaobject.dbNm,
			param2 : tableobject.tableNm,
			param3 : '1'
		},
		dataType : 'json',
		success : function(data){
			var strsql = data.data[0].strsql;
			strsql = strsql.replace(new RegExp('\n','g'), '<br>');
			$('#tableTodb_detail').html(strsql);
			$('#modal_tableTodb').modal('show');
		}
	});
});
$('#btn_todb').click(function(){
	bdoConfirmBox('', '是否执行SQL', function(){
		$.ajax({
			url : 'admin/DBManage.excuteDDLScript.json',
			type : 'post',
			data : {
				menuId : window.sys_menuId,
				param1 : schemaobject.dbNm,
				param2 : tableobject.tableNm,
				param3 : '1'
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});


// 行按钮 作废 
$('#table_table').on('click', 'button[name="tableBan"]', function() {
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('作废', '确定作废[' + tableobject.tableNmCn + ']吗?', function(){
		var param = {
			menuId : window.sys_menuId,
			bdo_table_id : 'bdo_base.base_deftable',
			bdo_Maintenance_processType : 'abolish',
			dbNm : schemaobject.dbNm,
			tableNm : tableobject.tableNm,
			tableNmCn : tableobject.tableNmCn,
			tableDesc : tableobject.tableDesc,
			containWho : tableobject.tableNmCn,
			containMenuId : tableobject.tableDesc,
			ACTIVE_FLAG : tableobject.ACTIVE_FLAG,
			bdo_pk__dbNm : schemaobject.dbNm,
			bdo_pk__tableNm : tableobject.tableNm
		};
		$.ajax({
			url : 'base/general.abolishByKey.json',
			type : 'post',
			data : param,
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 取消作废 
$('#table_table').on('click', 'button[name="tableUse"]', function() {
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('取消作废', '确定取消作废[' + tableobject.tableNmCn + ']吗?', function(){
		var param = {
			menuId : window.sys_menuId,
			bdo_table_id : 'bdo_base.base_deftable',
			bdo_Maintenance_processType : 'unabolish',
			dbNm : schemaobject.dbNm,
			tableNm : tableobject.tableNm,
			tableNmCn : tableobject.tableNmCn,
			tableDesc : tableobject.tableDesc,
			containWho : tableobject.tableNmCn,
			containMenuId : tableobject.tableDesc,
			ACTIVE_FLAG : tableobject.ACTIVE_FLAG,
			bdo_pk__dbNm : schemaobject.dbNm,
			bdo_pk__tableNm : tableobject.tableNm
		};
		$.ajax({
			url : 'base/general.unabolishByKey.json',
			type : 'post',
			data : param,
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_table').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 表定义维护 
$('#table_table').on('click', 'button[name="tableCol"]', function() {
	tableobject = $('#table_table').DataTable().data()[$(this).closest('tr').index()];
	$('#modal_tablecol').modal('show');
});

function tablecolFilter() {
	var queryFilterArr = [];
	if ($('#tablecol_search_colnm').val() != '') {
		queryFilterArr.push({
			'field' : 'colNm',
			'sqlIndex' : 'colNm',
			'type' : 'string',
			'value' : $('#tablecol_search_colnm').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
var tablecolParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'base/General.query.json',
	filterParam : {},
	createdRow: function(row, data, index){
		if (data.ACTIVE_FLAG == '0'){ 
			$(row).css('color', 'red');
		}
	},
	tableColumns : []
};
var deffiltercol = [{
	targets : 1,
	className : 'text-center',
	title : '操作',
	width : '200px',
	orderable : false,
	render : function(data, type, row, meta){
		var renderStr = '';
		if(row.ACTIVE_FLAG == '1'){
			renderStr += '<button class="btn btn-xs btn-warning" type="button" name="tablecolEdit" data-placement="top" title="修改" data-toggle="tooltip">'
				+ '<i class="fa fa-edit"></i></button>&nbsp;';
			renderStr += '<button class="btn btn-xs btn-danger" type="button" name="tablecolBan" data-placement="top" title="作废" data-toggle="tooltip">'
				+ '<i class="fa fa-ban"></i></button>&nbsp;';
		} else{
			renderStr += '<button class="btn btn-xs btn-danger" type="button" name="tablecolUse" data-placement="top" title="取消作废" data-toggle="tooltip">'
				+ '<i class="fa fa-reply"></i></button>&nbsp;';
		}
		return renderStr;
	}
}];
$.each(getDbColumn('bdo_base', 'base_defcolumn'), function(index, info){
	if(info.sortNum){
		if(info.dataType == 'datetime'){
			deffiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					var date = new Date(data);
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
			});
		}
		if(info.colNm == 'filterType'){
			deffiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					return DicVal2Nm(data, '过滤器类型');
				}
			});
		}
		if(info.colNm == 'fieldType'){
			deffiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					return DicVal2Nm(data, '字段类型');
				}
			});
		}
		if(info.colNm == 'authFlg'){
			deffiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					return DicVal2Nm(data, '权限标志');
				}
			});
		}
		if(info.colNm == 'isNullable'){
			deffiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					return DicVal2Nm(data, 'boolean');
				}
			});
		}
		if(info.colNm == 'ACTIVE_FLAG'){
			deffiltercol.push({
				targets : parseInt(info.sortNum) + 1,
				title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
				name : info.colNm,
				data : info.colNm,
				width : '150px',
				render: function(data, type, row, meta) {
					return DicVal2Nm(data, 'activeFlag');
				}
			});
		}
		deffiltercol.push({
			targets : parseInt(info.sortNum) + 1,
			title : ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm,
			name : info.colNm,
			data : info.colNm,
			width : '150px',
			render: function(data, type, row, meta) {
				if(data){
					if(typeof(data) == 'object'){
						return row[meta.settings.aoColumns[meta.col].data + 'Name'];
					}
					if(data.length > 100){
						return data.substr(0, 100) + '...';
					}
					return data;
				}
				return '';
			}
		});
	}
});

$('#modal_tablecol').on('shown.bs.modal', function(){
	tablecolParam.tableColumns = deffiltercol;
	tablecolParam.filterParam = {
		menuId : window.sys_menuId,
		sqlId : 'sys.S100008',
		param1 : schemaobject.dbNm,
		param2 : tableobject.tableNm,
		filter : tablecolFilter()
	};
	BdoDataTables('table_tablecol', tablecolParam);
});

var tabledataformcol = [];
var noshow = ['CREATION_DATE', 'CREATED_BY', 'LAST_UPDATE_DATE', 'LAST_UPDATED_BY', 'ABOLITION_DATE', 'ABOLISHED_BY', 'PROGRAM_APPLICATION_ID', 'PROGRAM_ID', 'ACTIVE_FLAG'];
$.each(getDbColumn('bdo_base', 'base_defcolumn'), function(index, info){
	if(noshow.indexOf(info.colNm) == -1){
		var obj = {};
		obj.id = 'tablecol_' + info.colNm;
		obj.type = 'input';
		obj.validate = {
			rules : {
				required : false,
				maxlength : info.dataLen
			}
		};
		obj.typeAttr = {
			type : '',
			normal : false
		};
		obj.label = ((info.colNmCn).length > 0) ? info.colNmCn : info.colNm;
		if((info.dataType).indexOf('int') > -1){
			obj.typeAttr.type = 'number'
		}
		if(info.dataType == 'datetime'){
			obj.plugin = {
				name : 'datepicker',
				options : {
					weekStart: 1,
					clearBtn: true,
					autoclose: true,
					language: 'zh-CN',
					format: 'yyyy-mm-dd',
					todayHighlight: true
				}
			}
		}
		if(info.isNullable == '0'){
			obj.validate.rules.required = true;
		} else{
			obj.typeAttr.normal = true
		}
		tabledataformcol[parseInt(info.sortNum) - 1] = obj;
	}
});
$.each(tabledataformcol, function(index, info){
	if(info == "" || typeof(info) == "undefined") {
		tabledataformcol.splice(index,1); 
	}  
});
$.each(tabledataformcol, function(index, info){
	if(index % 2 == 0){
		tabledataformcol[index].rowspan = '1';
	}
});
tabledataformcol.push({
	id : 'tablecol_ACTIVE_FLAG',
	type : 'select',
	label : '是否有效',
	html : ComboDicOption(true, 'activeFlag'),
	typeAttr : {
		disabled : true
	}
});

// 搜索按钮 
$('#tablecol_search').click(function() {
	tablecolParam.filterParam.filter = tablecolFilter();
	$('#table_tablecol').DataTable().ajax.reload();
});
// 重置按钮 
$('#tablecol_sclear').click(function() {
	$('#table_search_tablename').val('');
	tablecolParam.filterParam.filter = tablecolFilter();
	$('#table_tablecol').DataTable().ajax.reload();
});

$('#form_tablecol').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'tablecol_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'tablecol_savenext',
			icon : 'fa-chevron-right',
			style : 'btn-success',
			text : '&nbsp;保存并继续'
		},{
			id : 'tablecol_edit',
			icon : 'fa-edit',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'tablecol_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'tablecol_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : tabledataformcol
});

var tablecolobject;
$('#tablecol_add').click(function(){
	$('#tablecol_edit').hide();
	$('#tablecol_ACTIVE_FLAG').val('1');
	$('#tablecol_dbNm').val(schemaobject.dbNm);
	$('#tablecol_tableNm').val(tableobject.tableNm);
	$('#tablecol_dbNm, #tablecol_tableNm, #tablecol_ACTIVE_FLAG').attr('disabled', 'disabled');
	$('#modal_tablecolform').modal('show');
});
// 行按钮 修改 
$('#table_tablecol').on('click', 'button[name="tablecolEdit"]', function() {
	$('#tablecol_save,#tablecol_savenext, #tablecol_clear').hide();
	$('#tablecol_dbNm, #tablecol_tableNm, #tablecol_ACTIVE_FLAG').attr('disabled', 'disabled');
	tablecolobject = $('#table_tablecol').DataTable().data()[$(this).closest('tr').index()];
	columnformset(tablecolobject);
	$('#modal_tablecolform').modal('show');
});
$('#modal_tablecolform').on('hidden.bs.modal', function(){
	$('#tablecol_save,#tablecol_savenext,#tablecol_edit,#tablecol_clear').show();
    $('#modal_tablecolform').find('input, select').removeAttr('disabled', 'disabled');
    $('#modal_tablecolform').find('input, select').val('');
    $('#modal_tablecolform').find('form td').removeClass('has-error');
  	$('#modal_tablecolform').find('form .help-block').remove();
});
function columnformset(obj){
	var colDef = getDbColumn('bdo_base', 'base_defcolumn');
	$.each(obj, function(index, info){
		if(colDef[index.toLowerCase()]){
			if(colDef[index.toLowerCase()].dataType == 'datetime'){
				var date = new Date(info);
				$('#tablecol_' + index).val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
			} else{
				$('#tablecol_' + index).val(info);
			}
		}
	});
}
// 保存 
$('#tablecol_save').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_defcolumn',
		bdo_Maintenance_processType : 'add',
		bdo_pk__dbNm:schemaobject.dbNm,
		bdo_pk__tableNm:tableobject.tableNm,
		bdo_pk__:'dbNm,tableNm,colNm'
	};
	colformSubmit(false, param);
});
// 保存并继续 
$('#tablecol_savenext').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_defcolumn',
		bdo_Maintenance_processType : 'add',
		bdo_pk__dbNm:schemaobject.dbNm,
		bdo_pk__tableNm:tableobject.tableNm,
		bdo_pk__:'dbNm,tableNm,colNm'
	};
	colformSubmit(true, param);
});
// 修改 
$('#tablecol_edit').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_defcolumn',
		bdo_Maintenance_processType : 'edit',
		bdo_pk__dbNm:schemaobject.dbNm,
		bdo_pk__tableNm:tableobject.tableNm,
		bdo_pk__colNm:tablecolobject.colNm,
		bdo_pk__:'dbNm,tableNm,colNm'
	};
	colformSubmit(false, param);
});
// 重置 
$('#tablecol_clear').click(function(){
	$('#modal_tablecolform').find('input:not(#tablecol_dbNm, #tablecol_tableNm), select:not(#tablecol_ACTIVE_FLAG)').val('');
});
// 关闭 
$('#tablecol_close').click(function(){
	$('#modal_tablecolform').modal('hide');
});
function colformSubmit(submittype, ajaxparam){
	var submiturl;
	if(ajaxparam.bdo_Maintenance_processType == 'edit'){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_tablecol input').each(function(){
		ajaxparam[$(this).attr('id').replace('tablecol_', '')] = $(this).val();
	});
	$('#form_tablecol select').each(function(){
		ajaxparam[$(this).attr('id').replace('tablecol_', '')] = $(this).val();
	});
	$('#form_tablecol').formview(
		'setAjaxConf',
		[
			submiturl,
			ajaxparam,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#table_tablecol').DataTable().draw(false);
					if(!submittype){
						$('#modal_tablecolform').modal('hide');
					}
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_tablecol').submit();
}

// 行按钮 作废 
$('#table_tablecol').on('click', 'button[name="tablecolBan"]', function() {
	tablecolobject = $('#table_tablecol').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('作废', '确定作废吗?', function(){
		var param = {
			menuId : window.sys_menuId,
			bdo_table_id : 'bdo_base.base_defcolumn',
			bdo_Maintenance_processType : 'abolish'
		};
		$.ajax({
			url : 'base/general.abolishByKey.json',
			type : 'post',
			data : $.extend(param, tablecolobject),
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_tablecol').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 行按钮 取消作废 
$('#table_tablecol').on('click', 'button[name="tablecolUse"]', function() {
	tablecolobject = $('#table_tablecol').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('取消作废', '确定取消作废吗?', function(){
		var param = {
			menuId : window.sys_menuId,
			bdo_table_id : 'bdo_base.base_defcolumn',
			bdo_Maintenance_processType : 'unabolish'
		};
		$.ajax({
			url : 'base/general.unabolishByKey.json',
			type : 'post',
			data : $.extend(param, tablecolobject),
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$('#table_tablecol').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 保存 
$('#table_save').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_deftable',
		bdo_Maintenance_processType : 'add',
		dbNm : schemaobject.dbNm,
		tableNm : $('#table_tableNm').val(),
		tableNmCn : $('#table_tableNmCn').val(),
		tableDesc : $('#table_tableDesc').val(),
		containWho : $('#table_containWho').val(),
		containMenuId : $('#table_containMenuId').val(),
		ACTIVE_FLAG : '1',
		bdo_pk__dbNm : schemaobject.dbNm,
		bdo_pk_ : 'dbNm,tableNm'
	};
	submitTableForm(false, param);
});
// 保存并继续 
$('#table_savenext').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_deftable',
		bdo_Maintenance_processType : 'add',
		dbNm : schemaobject.dbNm,
		tableNm : $('#table_tableNm').val(),
		tableNmCn : $('#table_tableNmCn').val(),
		tableDesc : $('#table_tableDesc').val(),
		containWho : $('#table_containWho').val(),
		containMenuId : $('#table_containMenuId').val(),
		ACTIVE_FLAG : '1',
		bdo_pk__dbNm : schemaobject.dbNm,
		bdo_pk_ : 'dbNm,tableNm'
	};
	submitTableForm(true, param);
});
// 修改 
$('#table_edit').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_deftable',
		bdo_Maintenance_processType : 'edit',
		dbNm : schemaobject.dbNm,
		tableNm : $('#table_tableNm').val(),
		tableNmCn : $('#table_tableNmCn').val(),
		tableDesc : $('#table_tableDesc').val(),
		containWho : $('#table_containWho').val(),
		containMenuId : $('#table_containMenuId').val(),
		ACTIVE_FLAG : '1',
		bdo_pk__dbNm : schemaobject.dbNm,
		bdo_pk__tableNm : tableobject.tableNm,
		bdo_pk_ : 'dbNm,tableNm'
	};
	submitTableForm(false, param);
});
// 重置 
$('#table_clear').click(function(){
	$('#modal_tableform').find('input:not(#table_dbNm), select:not(#table_ACTIVE_FLAG)').val('');
});
// 关闭 
$('#table_close').click(function(){
	$('#modal_tableform').modal('hide');
});

// 保存,修改提交表单 
function submitTableForm(submittype, param){
	var submiturl;
	if(param.bdo_Maintenance_processType == 'edit'){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_table').formview(
		'setAjaxConf',
		[
			submiturl,
			param,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#table_table').DataTable().draw(false);
					if(!submittype){
						$('#modal_tableform').modal('hide');
					}
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_table').submit();
}

// 表 表单赋值 
function tableFormSet(object){
	$('#table_dbNm').val(object.dbNm);
	$('#table_tableNm').val(object.tableNm);
	$('#table_tableNmCn').val(object.tableNmCn);
	$('#table_tableDesc').val(object.tableDesc);
	$('#table_containWho').val(object.containWho);
	$('#table_containMenuId').val(object.containMenuId);
	$('#table_ACTIVE_FLAG').val(object.ACTIVE_FLAG);
}