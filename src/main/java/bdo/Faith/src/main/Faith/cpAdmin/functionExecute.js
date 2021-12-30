pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

///** 模态框设置 */
//$('.modal').on('show.bs.modal', function(){
//    $(this).draggable({
//		handle: '.block-header',
//		cursor: 'move'
//    });
//    $(this).css('overflow', 'hidden');
//});

// 新增部门表单
$('#form_function').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'function_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'function_savenext',
			icon : 'fa-chevron-right',
			style : 'btn-success',
			text : '&nbsp;保存并继续'
		},{
			id : 'function_edit',
			icon : 'fa-edit',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'function_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'function_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'function_id',
			type : 'input',
			label : '内部编号',
			typeAttr : {
				placeholder: '保存后自动生成'
			}
		},{
			id : 'function_name',
			type : 'input',
			label : '名称',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'function_funcname',
			type : 'input',
			label : '方法名',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'function_service',
			type : 'input',
			label : 'service名称',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'function_constructType',
			type : 'select',
			html : ComboDicOption(true, '获取实例方法'),
			label : '获取实例方法',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'function_getInstanceNm',
			type : 'input',
			label : '获取实例具体方法名',
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param1',
			type : 'input',
			label : '参数1',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param1Type',
			type : 'select',
			html : ComboDicOption(true, '参数类型'),
			label : '参数1类型',
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param2',
			type : 'input',
			label : '参数2',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param2Type',
			type : 'select',
			html : ComboDicOption(true, '参数类型'),
			label : '参数2类型',
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param3',
			type : 'input',
			label : '参数3',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param3Type',
			type : 'select',
			html : ComboDicOption(true, '参数类型'),
			label : '参数3类型',
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param4',
			type : 'input',
			label : '参数4',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_param4Type',
			type : 'select',
			html : ComboDicOption(true, '参数类型'),
			label : '参数4类型',
			typeAttr : {
				normal : true
			}
		},{
			id : 'function_active',
			type : 'select',
			html : ComboDicOption(true, 'activeFlag'),
			label : '是否有效',
			rowspan : 1
		},{}
	]
});

function functionFilter() {
	var queryFilterArr = [];
	if ($('#search_name').val() != '') {
		queryFilterArr.push({
			'field' : 'name',
			'sqlIndex' : 'name',
			'type' : 'string',
			'value' : $('#search_name').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
var functionParam = {
	tabNum : false,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'admin/AdminGeneral.findForSingleTable.json',
	filterParam : {
		menuId : window.sys_menuId,
		tableNm : 'bdo_base.base_manualexe',
		showWho : 'true',
		filter : functionFilter()
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
			width : '150px',
			orderable : false,
			render : function(data, type, row, meta){
				var renderStr = '';
				if(row.ACTIVE_FLAG == '1'){
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="rowRun" data-placement="top" title="执行方法" data-toggle="tooltip">'
						+ '<i class="fa fa-send"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
						+ '<i class="fa fa-edit"></i></button>&nbsp;';
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
			className : 'text-center',
			title : '内部编号',
			name : 'id',
			data : 'id',
			width : '100px'
		},{
			targets : 3,
			title : '名称',
			name : 'name',
			data : 'name',
			width : '200px'
		},{
			targets : 4,
			title : '方法名',
			name : 'funcName',
			data : 'funcName',
			width : '150px'
		},{
			targets : 5,
			title : 'service名称',
			name : 'service',
			data : 'service',
			width : '200px'
		},{
			targets : 6,
			className : 'text-center',
			title : '获取实例方法',
			name : 'constructType',
			data : 'constructType',
			width : '150px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '获取实例方法');
			}
		},{
			targets : 7,
			className : 'text-center',
			title : '获取实例具体方法名',
			name : 'getInstanceNm',
			data : 'getInstanceNm',
			width : '150px'
		},{
			targets : 8,
			className : 'text-center',
			title : '参数1',
			name : 'param1',
			data : 'param1',
			width : '100px'
		},{
			targets : 9,
			className : 'text-center',
			title : '参数1类型',
			name : 'param1Type',
			data : 'param1Type',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '参数类型');
			}
		},{
			targets : 10,
			className : 'text-center',
			title : '参数2',
			name : 'param2',
			data : 'param2',
			width : '100px'
		},{
			targets : 11,
			className : 'text-center',
			title : '参数2类型',
			name : 'param2Type',
			data : 'param2Type',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '参数类型');
			}
		},{
			targets : 12,
			className : 'text-center',
			title : '参数3',
			name : 'param3',
			data : 'param3',
			width : '100px'
		},{
			targets : 13,
			className : 'text-center',
			title : '参数3类型',
			name : 'param3Type',
			data : 'param3Type',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '参数类型');
			}
		},{
			targets : 14,
			className : 'text-center',
			title : '参数4',
			name : 'param4',
			data : 'param4',
			width : '100px'
		},{
			targets : 15,
			className : 'text-center',
			title : '参数4类型',
			name : 'param4Type',
			data : 'param4Type',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '参数类型');
			}
		},{
			targets : 16,
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
			targets : 17,
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
			targets : 18,
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
			targets : 19,
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
			targets : 20,
			className : 'text-center',
			title : '删除日',
			name : 'ABOLITION_DATE',
			data : 'ABOLITION_DATE',
			width : '150px',
			render : function(data, type, row, meta){
				if(data){
					var date = new Date(data);
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
				return '';
			}
		},{
			targets : 21,
			className : 'text-center',
			title : '删除人',
			name : 'ABOLISHED_BY',
			data : 'ABOLISHED_BY',
			width : '150px',
			render : function(data, type, row, meta){
				if(data){
					return data.userName;
				}
				return '';
			}
		},{
			targets : 22,
			className : 'text-center',
			title : '处理系统',
			name : 'PROGRAM_APPLICATION_ID',
			data : 'PROGRAM_APPLICATION_ID',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '系统');
			}
		},{
			targets : 23,
			className : 'text-center',
			title : '处理菜单',
			name : 'PROGRAM_ID',
			data : 'PROGRAM_ID',
			width : '100px'
		},{
			targets : 24,
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
BdoDataTables('functiontable', functionParam);

/** 行双击 */
$('#functiontable tbody').on('dblclick', 'tr', function() {
	$('#function_save,#function_savenext,#function_edit,#function_clear').hide();
	$('#modal_function').find('input, select').attr('disabled', 'disabled');
	var object = $('#functiontable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_function').modal('show');
});

/** 查询 */
$('#btn_search').click(function() {
	functionParam.filterParam.filter = functionFilter();
	$('#functiontable').DataTable().ajax.reload();
});

/** 重置 */
$('#btn_clear').click(function() {
	$('#search_name').val('');
	functionParam.filterParam.filter = functionFilter();
	$('#functiontable').DataTable().ajax.reload();
});

$('#modal_function').on('hidden.bs.modal', function(){
    $('#function_save,#function_savenext,#function_edit,#function_clear').show();
    $('#modal_function').find('input, select').removeAttr('disabled', 'disabled');
    $('#modal_function').find('input, select').val('');
    $('#modal_function').find('form td').removeClass('has-error');
  	$('#modal_function').find('form .help-block').remove();
});

/** 新增 */
$('#btn_add').click(function(){
	$('#function_edit').hide();
	$('#function_active').val('1');
	$('#function_id, #function_active').attr('disabled', 'disabled');
	$('#modal_function').modal('show');
});

/** 行按钮 执行 */
$('#functiontable').on('click', 'button[name="rowRun"]', function() {
	var object = $('#functiontable').DataTable().data()[$(this).closest('tr').index()];
	bdoAjaxBox('你确定要执行方法吗?', object.name + '(ID:' + object.id + ')', function () {
      $.post('base/ManualExc.executeMethod.json', {menuId: window.sys_menuId, param1:object.id})
        .done(function (data) {
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
        });
    });
});

/** 行按钮 修改 */
$('#functiontable').on('click', 'button[name="rowEdit"]', function() {
	$('#function_save,#function_savenext,#function_clear').hide();
	$('#function_id, #function_active').attr('disabled', 'disabled');
	var object = $('#functiontable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_function').modal('show');
});

/** 行按钮 作废 */
$('#functiontable').on('click', 'button[name="rowBan"]', function() {
	var object = $('#functiontable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('作废', '确定作废方法[' + object.name + ']吗?', function(){
			var param = {
				menuId : window.sys_menuId,
				bdo_table_id : 'bdo_base.base_manualexe',
				bdo_Maintenance_processType : 'abolish',
				id : object.id,
				name : object.name,
				funcName : object.funcName,
				service : object.service,
				constructType : object.constructType,
				getInstanceNm : object.getInstanceNm,
				param1 : object.param1,
				param1Type : object.param1Type,
				param2 : object.param2,
				param2Type : object.param2Type,
				param3 : object.param3,
				param3Type : object.param3Type,
				param4 : object.param4,
				param4Type : object.param4Type,
				ACTIVE_FLAG : object.ACTIVE_FLAG
			};
			$.ajax({
				url : 'base/general.abolishByKey.json',
				type : 'post',
				data : param,
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#functiontable').DataTable().draw(false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
	});
});

/** 行按钮 取消作废 */
$('#functiontable').on('click', 'button[name="rowUse"]', function() {
	var object = $('#functiontable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('取消作废', '确定取消作废方法[' + object.name + ']吗?', function(){
			var param = {
				menuId : window.sys_menuId,
				bdo_table_id : 'bdo_base.base_manualexe',
				bdo_Maintenance_processType : 'unabolish',
				id : object.id,
				name : object.name,
				funcName : object.funcName,
				service : object.service,
				constructType : object.constructType,
				getInstanceNm : object.getInstanceNm,
				param1 : object.param1,
				param1Type : object.param1Type,
				param2 : object.param2,
				param2Type : object.param2Type,
				param3 : object.param3,
				param3Type : object.param3Type,
				param4 : object.param4,
				param4Type : object.param4Type,
				ACTIVE_FLAG : object.ACTIVE_FLAG
			};
			$.ajax({
				url : 'base/general.unabolishByKey.json',
				type : 'post',
				data : param,
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#functiontable').DataTable().draw(false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
	});
});

/** 行按钮 查看 */
$('#functiontable').on('click', 'button[name="rowView"]', function() {
	$('#function_save,#function_savenext,#function_edit,#function_clear').hide();
	$('#modal_function').find('input, select').attr('disabled', 'disabled');
	var object = $('#functiontable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_function').modal('show');
});

/** 保存 */
$('#function_save').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_manualexe',
		bdo_Maintenance_processType : 'add',
		name : $('#function_name').val(),
		funcName : $('#function_funcname').val(),
		service : $('#function_service').val(),
		constructType : $('#function_constructType').val(),
		getInstanceNm : $('#function_getInstanceNm').val(),
		param1 : $('#function_param1').val(),
		param1Type : $('#function_param1Type').val(),
		param2 : $('#function_param2').val(),
		param2Type : $('#function_param2Type').val(),
		param3 : $('#function_param3').val(),
		param3Type : $('#function_param3Type').val(),
		param4 : $('#function_param4').val(),
		param4Type : $('#function_param4Type').val(),
		ACTIVE_FLAG : '1'
	};
	submitForm(false, param);
});

/** 保存并继续 */
$('#function_savenext').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_manualexe',
		bdo_Maintenance_processType : 'add',
		name : $('#function_name').val(),
		funcName : $('#function_funcname').val(),
		service : $('#function_service').val(),
		constructType : $('#function_constructType').val(),
		getInstanceNm : $('#function_getInstanceNm').val(),
		param1 : $('#function_param1').val(),
		param1Type : $('#function_param1Type').val(),
		param2 : $('#function_param2').val(),
		param2Type : $('#function_param2Type').val(),
		param3 : $('#function_param3').val(),
		param3Type : $('#function_param3Type').val(),
		param4 : $('#function_param4').val(),
		param4Type : $('#function_param4Type').val(),
		ACTIVE_FLAG : '1'
	};
	submitForm(true, param);
});

/** 修改 */
$('#function_edit').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_manualexe',
		bdo_Maintenance_processType : 'edit',
		id : $('#function_id').val(),
		name : $('#function_name').val(),
		funcName : $('#function_funcname').val(),
		service : $('#function_service').val(),
		constructType : $('#function_constructType').val(),
		getInstanceNm : $('#function_getInstanceNm').val(),
		param1 : $('#function_param1').val(),
		param1Type : $('#function_param1Type').val(),
		param2 : $('#function_param2').val(),
		param2Type : $('#function_param2Type').val(),
		param3 : $('#function_param3').val(),
		param3Type : $('#function_param3Type').val(),
		param4 : $('#function_param4').val(),
		param4Type : $('#function_param4Type').val(),
		ACTIVE_FLAG : '1'
	};
	submitForm(false, param);
});

/** 重置 */
$('#function_clear').click(function(){
	$('#modal_function').find('input:not(#function_id), select:not(#function_active)').val('');
});

/** 关闭 */
$('#function_close').click(function(){
	$('#modal_function').modal('hide');
});

/** 保存,修改提交表单 */
function submitForm(submittype, param){
	var submiturl;
	if(param.id){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_function').formview(
		'setAjaxConf',
		[
			submiturl,
			param,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#functiontable').DataTable().draw(false);
					if(!submittype){
						$('#modal_function').modal('hide');
					}
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_function').submit();
}

/** 表单赋值 */
function formSet(object){
	$('#function_id').val(object.id);
	$('#function_name').val(object.name);
	$('#function_funcname').val(object.funcName);
	$('#function_service').val(object.service);
	$('#function_constructType').val(object.constructType);
	$('#function_getInstanceNm').val(object.getInstanceNm);
	$('#function_param1').val(object.param1);
	$('#function_param1Type').val(object.param1Type);
	$('#function_param2').val(object.param2);
	$('#function_param2Type').val(object.param2Type);
	$('#function_param3').val(object.param3);
	$('#function_param3Type').val(object.param3Type);
	$('#function_param4').val(object.param4);
	$('#function_param4Type').val(object.param4Type);
	$('#function_active').val(object.ACTIVE_FLAG);
}