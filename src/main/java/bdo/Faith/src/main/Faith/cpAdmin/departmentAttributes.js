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
$('#form_deptattr').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'deptattr_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'deptattr_savenext',
			icon : 'fa-chevron-right',
			style : 'btn-success',
			text : '&nbsp;保存并继续'
		},{
			id : 'deptattr_edit',
			icon : 'fa-edit',
			style : 'btn-success',
			text : '&nbsp;修改'
		},{
			id : 'deptattr_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'deptattr_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'deptattr_id',
			type : 'input',
			label : '自增长关键字',
			typeAttr : {
				placeholder: '保存后自动生成'
			}
		},{
			id : 'deptattr_departmentId',
			type : 'input',
			label : '部门ID',
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_ccatalog',
			type : 'input',
			label : '大分类',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_classification',
			type : 'input',
			label : '中分类',
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributetype',
			type : 'input',
			label : '小分类',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeName',
			type : 'input',
			label : '属性名',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'deptattr_attributeValue1',
			type : 'input',
			label : '属性值1',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'deptattr_attributeValue2',
			type : 'input',
			label : '属性值2',
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue3',
			type : 'input',
			label : '属性值3',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue4',
			type : 'input',
			label : '属性值4',
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue5',
			type : 'input',
			label : '属性值5',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue6',
			type : 'input',
			label : '属性值6',
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue7',
			type : 'input',
			label : '属性值7',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue8',
			type : 'input',
			label : '属性值8',
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_attributeValue9',
			type : 'input',
			label : '属性值9',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'deptattr_sortNum',
			type : 'input',
			label : '显示顺序',
			typeAttr : {
				normal : true,
				type : 'number'
			}
		},{
			id : 'deptattr_startDate',
			type : 'input',
			label : '启用开始日',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
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
		},{
			id : 'deptattr_endDate',
			type : 'input',
			label : '启用结束日',
			validate : {
				rules : {
					required : true
				}
			},
			plugin : {
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
		},{
			id : 'deptattr_active',
			type : 'select',
			html : ComboDicOption(true, 'activeFlag'),
			label : '是否有效',
			rowspan : 1
		},{}
	]
});

function deptattrFilter() {
	var queryFilterArr = [];
	if ($('#search_attributeName').val() != '') {
		queryFilterArr.push({
			'field' : 'attributeName',
			'sqlIndex' : 'attributeName',
			'type' : 'string',
			'value' : $('#search_attributeName').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}
var deptattrParam = {
	tabNum : true,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'base/General.findForSingleTable.json',
	filterParam : {
		menuId : window.sys_menuId,
		tableNm : 'bdo_base.base_departmentattributes',
		showWho : 'true',
		filter : deptattrFilter()
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
			title : '处理',
			width : '150px',
			orderable : false,
			render : function(data, type, row, meta){
				var renderStr = '';
				if(row.ACTIVE_FLAG == '1'){
					renderStr += '<button class="btn btn-xs btn-primary" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
						+ '<i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowBan" data-placement="top" title="作废" data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>&nbsp;';
				} else{
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="rowUse" data-placement="top" title="取消作废" data-toggle="tooltip">'
						+ '<i class="fa fa-reply"></i></button>&nbsp;';
				}
				renderStr += '<button class="btn btn-xs btn-danger" type="button" name="rowDelete" data-placement="top" title="删除" data-toggle="tooltip">'
					+ '<i class="fa fa-times"></i></button>&nbsp;';
				renderStr += '<button class="btn btn-xs btn-info" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
					+ '<i class="fa fa-eye"></i></button>&nbsp;';
				return renderStr;
			}
		},{
			targets : 2,
			className : 'text-center',
			title : '自增长关键字',
			name : 'id',
			data : 'id',
			width : '100px'
		},{
			targets : 3,
			className : 'text-center',
			title : '部门ID',
			name : 'departmentId',
			data : 'departmentId',
			width : '100px'
		},{
			targets : 4,
			title : '大分类',
			name : 'ccatalog',
			data : 'ccatalog',
			width : '150px'
		},{
			targets : 5,
			title : '中分类',
			name : 'classification',
			data : 'classification',
			width : '150px'
		},{
			targets : 6,
			title : '小分类',
			name : 'attributetype',
			data : 'attributetype',
			width : '150px'
		},{
			targets : 7,
			className : 'text-center',
			title : '属性名',
			name : 'attributeName',
			data : 'attributeName',
			width : '150px'
		},{
			targets : 8,
			className : 'text-center',
			title : '属性值1',
			name : 'attributeValue1',
			data : 'attributeValue1',
			width : '150px'
		},{
			targets : 9,
			className : 'text-center',
			title : '属性值2',
			name : 'attributeValue2',
			data : 'attributeValue2',
			width : '150px'
		},{
			targets : 10,
			className : 'text-center',
			title : '属性值3',
			name : 'attributeValue3',
			data : 'attributeValue3',
			width : '150px'
		},{
			targets : 11,
			className : 'text-center',
			title : '属性值4',
			name : 'attributeValue4',
			data : 'attributeValue4',
			width : '150px'
		},{
			targets : 12,
			className : 'text-center',
			title : '属性值5',
			name : 'attributeValue5',
			data : 'attributeValue5',
			width : '150px'
		},{
			targets : 13,
			className : 'text-center',
			title : '属性值6',
			name : 'attributeValue6',
			data : 'attributeValue6',
			width : '150px'
		},{
			targets : 14,
			className : 'text-center',
			title : '属性值7',
			name : 'attributeValue7',
			data : 'attributeValue7',
			width : '150px'
		},{
			targets : 15,
			className : 'text-center',
			title : '属性值8',
			name : 'attributeValue8',
			data : 'attributeValue8',
			width : '150px'
		},{
			targets : 16,
			className : 'text-center',
			title : '属性值9',
			name : 'attributeValue9',
			data : 'attributeValue9',
			width : '150px'
		},{
			targets : 17,
			className : 'text-right',
			title : '显示顺序',
			name : 'sortNum',
			data : 'sortNum',
			width : '100px'
		},{
			targets : 18,
			className : 'text-center',
			title : '启用开始日',
			name : 'startDate',
			data : 'startDate',
			width : '100px'
		},{
			targets : 19,
			className : 'text-center',
			title : '启用结束日',
			name : 'endDate',
			data : 'endDate',
			width : '100px'
		},{
			targets : 20,
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
			targets : 21,
			className : 'text-center',
			title : '创建人',
			name : 'CREATED_BY',
			data : 'CREATED_BY',
			width : '150px',
			render : function(data, type, row, meta){
				return row.userName;
			}
		},{
			targets : 22,
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
			targets : 23,
			className : 'text-center',
			title : '最终更新人',
			name : 'LAST_UPDATED_BY',
			data : 'LAST_UPDATED_BY',
			width : '150px',
			render : function(data, type, row, meta){
				if(data){
					return data.userName;
				}
				return '';
			}
		},{
			targets : 24,
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
			targets : 25,
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
			targets : 26,
			className : 'text-center',
			title : '处理系统',
			name : 'PROGRAM_APPLICATION_ID',
			data : 'PROGRAM_APPLICATION_ID',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '系统');
			}
		},{
			targets : 27,
			className : 'text-center',
			title : '处理菜单',
			name : 'PROGRAM_ID',
			data : 'PROGRAM_ID',
			width : '100px'
		},{
			targets : 28,
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
BdoDataTables('deptattrtable', deptattrParam);

/** 行双击 */
$('#deptattrtable tbody').on('dblclick', 'tr', function() {
	$('#deptattr_save,#deptattr_savenext,#deptattr_edit,#deptattr_clear').hide();
	$('#modal_deptattr').find('input, select').attr('disabled', 'disabled');
	var object = $('#deptattrtable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_deptattr').modal('show');
});

/** 查询 */
$('#btn_search').click(function() {
	deptattrParam.filterParam.filter = deptattrFilter();
	$('#deptattrtable').DataTable().ajax.reload();
});

/** 重置 */
$('#btn_clear').click(function() {
	$('#search_attributeName').val('');
	deptattrParam.filterParam.filter = deptattrFilter();
	$('#deptattrtable').DataTable().ajax.reload();
});

$('#modal_deptattr').on('hidden.bs.modal', function(){
    $('#deptattr_save,#deptattr_savenext,#deptattr_edit,#deptattr_clear').show();
    $('#modal_deptattr').find('input, select').removeAttr('disabled', 'disabled');
    $('#modal_deptattr').find('input, select').val('');
    $('#modal_deptattr').find('form td').removeClass('has-error');
  	$('#modal_deptattr').find('form .help-block').remove();
});

/** 新增 */
$('#btn_add').click(function(){
	$('#deptattr_active').val('1');
	$('#deptattr_edit').hide();
	$('#deptattr_id, #deptattr_active').attr('disabled', 'disabled');
	$('#modal_deptattr').modal('show');
});

/** 行按钮 修改 */
$('#deptattrtable').on('click', 'button[name="rowEdit"]', function() {
	$('#deptattr_save,#deptattr_savenext,#deptattr_clear').hide();
	$('#deptattr_id, #deptattr_active').attr('disabled', 'disabled');
	var object = $('#deptattrtable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_deptattr').modal('show');
});

/** 行按钮 作废 */
$('#deptattrtable').on('click', 'button[name="rowBan"]', function() {
	var object = $('#deptattrtable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('作废', '确定作废吗?', function(){
			var param = {
				menuId : window.sys_menuId,
				bdo_table_id : 'bdo_base.base_departmentattributes',
				bdo_Maintenance_processType : 'abolish',
				
				id : object.id,
				departmentId : object.departmentId,
				ccatalog : object.ccatalog,
				classification : object.classification,
				attributetype : object.attributetype,
				attributeName : object.attributeName,
				attributeValue1 : object.attributeValue1,
				attributeValue2 : object.attributeValue2,
				attributeValue3 : object.attributeValue3,
				attributeValue4 : object.attributeValue4,
				attributeValue5 : object.attributeValue5,
				attributeValue6 : object.attributeValue6,
				attributeValue7 : object.attributeValue7,
				attributeValue8 : object.attributeValue8,
				attributeValue9 : object.attributeValue9,
				sortNum : object.sortNum,
				startDate : object.startDate,
				endDate : object.endDate,
				ACTIVE_FLAG : object.ACTIVE_FLAG
			};
			$.ajax({
				url : 'base/general.abolishByKey.json',
				type : 'post',
				data : param,
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#deptattrtable').DataTable().draw(false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
	});
});

/** 行按钮 取消作废 */
$('#deptattrtable').on('click', 'button[name="rowUse"]', function() {
	var object = $('#deptattrtable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('取消作废', '确定取消作废吗?', function(){
			var param = {
				menuId : window.sys_menuId,
				bdo_table_id : 'bdo_base.base_departmentattributes',
				bdo_Maintenance_processType : 'unabolish',
				
				id : object.id,
				departmentId : object.departmentId,
				ccatalog : object.ccatalog,
				classification : object.classification,
				attributetype : object.attributetype,
				attributeName : object.attributeName,
				attributeValue1 : object.attributeValue1,
				attributeValue2 : object.attributeValue2,
				attributeValue3 : object.attributeValue3,
				attributeValue4 : object.attributeValue4,
				attributeValue5 : object.attributeValue5,
				attributeValue6 : object.attributeValue6,
				attributeValue7 : object.attributeValue7,
				attributeValue8 : object.attributeValue8,
				attributeValue9 : object.attributeValue9,
				sortNum : object.sortNum,
				startDate : object.startDate,
				endDate : object.endDate,
				ACTIVE_FLAG : object.ACTIVE_FLAG
			};
			$.ajax({
				url : 'base/general.unabolishByKey.json',
				type : 'post',
				data : param,
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#deptattrtable').DataTable().draw(false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
	});
});

/** 行按钮 删除 */
$('#deptattrtable').on('click', 'button[name="rowDelete"]', function() {
	var object = $('#deptattrtable').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('作废', '确定删除吗?', function(){
			var param = {
				menuId : window.sys_menuId,
				bdo_table_id : 'bdo_base.base_departmentattributes',
				bdo_Maintenance_processType : 'delete',
				
				id : object.id,
				departmentId : object.departmentId,
				ccatalog : object.ccatalog,
				classification : object.classification,
				attributetype : object.attributetype,
				attributeName : object.attributeName,
				attributeValue1 : object.attributeValue1,
				attributeValue2 : object.attributeValue2,
				attributeValue3 : object.attributeValue3,
				attributeValue4 : object.attributeValue4,
				attributeValue5 : object.attributeValue5,
				attributeValue6 : object.attributeValue6,
				attributeValue7 : object.attributeValue7,
				attributeValue8 : object.attributeValue8,
				attributeValue9 : object.attributeValue9,
				sortNum : object.sortNum,
				startDate : object.startDate,
				endDate : object.endDate,
				ACTIVE_FLAG : object.ACTIVE_FLAG
			};
			$.ajax({
				url : 'base/general.deleteByKey.json',
				type : 'post',
				data : param,
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#deptattrtable').DataTable().draw(false);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
	});
});

/** 行按钮 查看 */
$('#deptattrtable').on('click', 'button[name="rowView"]', function() {
	$('#deptattr_save,#deptattr_savenext,#deptattr_edit,#deptattr_clear').hide();
	$('#modal_deptattr').find('input, select').attr('disabled', 'disabled');
	var object = $('#deptattrtable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_deptattr').modal('show');
});

/** 保存 */
$('#deptattr_save').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_departmentattributes',
		bdo_Maintenance_processType : 'add',
		
		departmentId : $('#deptattr_departmentId').val(),
		ccatalog : $('#deptattr_ccatalog').val(),
		classification : $('#deptattr_classification').val(),
		attributetype : $('#deptattr_attributetype').val(),
		attributeName : $('#deptattr_attributeName').val(),
		attributeValue1 : $('#deptattr_attributeValue1').val(),
		attributeValue2 : $('#deptattr_attributeValue2').val(),
		attributeValue3 : $('#deptattr_attributeValue3').val(),
		attributeValue4 : $('#deptattr_attributeValue4').val(),
		attributeValue5 : $('#deptattr_attributeValue5').val(),
		attributeValue6 : $('#deptattr_attributeValue6').val(),
		attributeValue7 : $('#deptattr_attributeValue7').val(),
		attributeValue8 : $('#deptattr_attributeValue8').val(),
		attributeValue9 : $('#deptattr_attributeValue9').val(),
		sortNum : $('#deptattr_sortNum').val(),
		startDate : $('#deptattr_startDate').val(),
		endDate : $('#deptattr_endDate').val(),
		active : $('#deptattr_ACTIVE_FLAG').val()
	};
	submitForm(false, param);
});

/** 保存并继续 */
$('#deptattr_savenext').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_departmentattributes',
		bdo_Maintenance_processType : 'add',
		
		departmentId : $('#deptattr_departmentId').val(),
		ccatalog : $('#deptattr_ccatalog').val(),
		classification : $('#deptattr_classification').val(),
		attributetype : $('#deptattr_attributetype').val(),
		attributeName : $('#deptattr_attributeName').val(),
		attributeValue1 : $('#deptattr_attributeValue1').val(),
		attributeValue2 : $('#deptattr_attributeValue2').val(),
		attributeValue3 : $('#deptattr_attributeValue3').val(),
		attributeValue4 : $('#deptattr_attributeValue4').val(),
		attributeValue5 : $('#deptattr_attributeValue5').val(),
		attributeValue6 : $('#deptattr_attributeValue6').val(),
		attributeValue7 : $('#deptattr_attributeValue7').val(),
		attributeValue8 : $('#deptattr_attributeValue8').val(),
		attributeValue9 : $('#deptattr_attributeValue9').val(),
		sortNum : $('#deptattr_sortNum').val(),
		startDate : $('#deptattr_startDate').val(),
		endDate : $('#deptattr_endDate').val(),
		active : $('#deptattr_ACTIVE_FLAG').val()
	};
	submitForm(true, param);
});

/** 修改 */
$('#deptattr_edit').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_departmentattributes',
		bdo_Maintenance_processType : 'edit',
		
		id : $('#deptattr_id').val(),
		departmentId : $('#deptattr_departmentId').val(),
		ccatalog : $('#deptattr_ccatalog').val(),
		classification : $('#deptattr_classification').val(),
		attributetype : $('#deptattr_attributetype').val(),
		attributeName : $('#deptattr_attributeName').val(),
		attributeValue1 : $('#deptattr_attributeValue1').val(),
		attributeValue2 : $('#deptattr_attributeValue2').val(),
		attributeValue3 : $('#deptattr_attributeValue3').val(),
		attributeValue4 : $('#deptattr_attributeValue4').val(),
		attributeValue5 : $('#deptattr_attributeValue5').val(),
		attributeValue6 : $('#deptattr_attributeValue6').val(),
		attributeValue7 : $('#deptattr_attributeValue7').val(),
		attributeValue8 : $('#deptattr_attributeValue8').val(),
		attributeValue9 : $('#deptattr_attributeValue9').val(),
		sortNum : $('#deptattr_sortNum').val(),
		startDate : $('#deptattr_startDate').val(),
		endDate : $('#deptattr_endDate').val(),
		active : $('#deptattr_ACTIVE_FLAG').val()
	};
	submitForm(false, param);
});

/** 重置 */
$('#deptattr_clear').click(function(){
	$('#modal_deptattr').find('input:not(#deptattr_id), select:not(#deptattr_active)').val('');
});

/** 关闭 */
$('#deptattr_close').click(function(){
	$('#modal_deptattr').modal('hide');
});

/** 保存,修改提交表单 */
function submitForm(submittype, param){
	var submiturl;
	if(param.id){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_deptattr').formview(
		'setAjaxConf',
		[
			submiturl,
			param,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#deptattrtable').DataTable().draw(false);
					if(!submittype){
						$('#modal_deptattr').modal('hide');
					}
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#form_deptattr').submit();
}

/** 表单赋值 */
function formSet(object){
	$('#deptattr_id').val(object.id);
	$('#deptattr_departmentId').val(object.departmentId);
	$('#deptattr_ccatalog').val(object.ccatalog);
	$('#deptattr_classification').val(object.classification);
	$('#deptattr_attributetype').val(object.attributetype);
	$('#deptattr_attributeName').val(object.attributeName);
	$('#deptattr_attributeValue1').val(object.attributeValue1);
	$('#deptattr_attributeValue2').val(object.attributeValue2);
	$('#deptattr_attributeValue3').val(object.attributeValue3);
	$('#deptattr_attributeValue4').val(object.attributeValue4);
	$('#deptattr_attributeValue5').val(object.attributeValue5);
	$('#deptattr_attributeValue6').val(object.attributeValue6);
	$('#deptattr_attributeValue7').val(object.attributeValue7);
	$('#deptattr_attributeValue8').val(object.attributeValue8);
	$('#deptattr_attributeValue9').val(object.attributeValue9);
	$('#deptattr_sortNum').val(object.sortNum);
	$('#deptattr_startDate').val(object.startDate);
	$('#deptattr_endDate').val(object.endDate);
	$('#deptattr_active').val(object.ACTIVE_FLAG);
}