pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');

function dictionaryFilter() {
	var queryFilterArr = [];
	if ($('#search_attributetype').val() != '') {
		queryFilterArr.push({
			'field' : 'attributetype',
			'sqlIndex' : 'attributetype',
			'type' : 'string',
			'value' : $('#search_attributetype').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_attributeName').val() != '') {
		queryFilterArr.push({
			'field' : 'attributeName',
			'sqlIndex' : 'attributeName',
			'type' : 'string',
			'value' : $('#search_attributeName').val(),
			'operate' : 'eq'
		});
	}
	if ($('#search_attributeValue1').val() != '') {
		queryFilterArr.push({
			'field' : 'attributeValue1',
			'sqlIndex' : 'attributeValue1',
			'type' : 'string',
			'value' : $('#search_attributeValue1').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

/** 查询 */
$('#btn_search').click(function() {
	dictionaryParam.filterParam.filter = dictionaryFilter();
	$('#dictionaryTable').DataTable().ajax.reload();
});

/** 重置 */
$('#btn_clear').click(function() {
	$('#search_attributetype').val('');
	$('#search_attributeName').val('');
	$('#search_attributeValue1').val('');
	dictionaryParam.filterParam.filter = dictionaryFilter();
	$('#dictionaryTable').DataTable().ajax.reload();
});

var dictionaryParam = {
	tabNum : false,
	scrollX : true,
	lengthChange : true,
//	dom : '<"row"<"col-sm-12"tr>>',
	order : [2, 'asc'],
	sourceData : {},
	sourceUrl : 'base/General.findForSingleTable.json',
	filterParam : {
		menuId : window.sys_menuId,
		tableNm : 'bdo_base.base_dic',
		showWho : 'true',
		filter : dictionaryFilter()
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
			render : function(data, type, row, meta){
				var renderStr = '';
				if(row.ACTIVE_FLAG == '1'){
					renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowEdit" data-placement="top" title="修改" data-toggle="tooltip">'
						+ '<i class="fa fa-edit"></i></button>';
					renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowBan" data-placement="top" title="作废" data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>';
					renderStr += '<button class="btn btn-xs btn-primary table-btn-operate" type="button" name="rowView" data-placement="top" title="查看" data-toggle="tooltip">'
						+ '<i class="fa fa-eye"></i></button>';
				} else{
					renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowUse" data-placement="top" title="取消作废" data-toggle="tooltip">'
						+ '<i class="fa fa-reply"></i></button>';
				}
				return renderStr;
			}
		},{
			targets : 2,
			title : '编号',
			name : 'id',
			data : 'id',
			width : '100px'
		},{
			targets : 3,
			title : '大分类',
			name : 'ccatalog',
			data : 'ccatalog',
			width : '150px'
		},{
			targets : 4,
			title : '中分类',
			name : 'classification',
			data : 'classification',
			width : '150px'
		},{
			targets : 5,
			title : '小分类',
			name : 'attributetype',
			data : 'attributetype',
			width : '200px'
		},{
			targets : 6,
			className : 'text-center',
			title : '属性名称',
			name : 'attributeName',
			data : 'attributeName',
			width : '150px'
		},{
			targets : 7,
			className : 'text-center',
			title : '属性值1',
			name : 'attributeValue1',
			data : 'attributeValue1',
			width : '150px'
		},{
			targets : 8,
			className : 'text-center',
			title : '属性值2',
			name : 'attributeValue2',
			data : 'attributeValue2',
			width : '100px'
		},{
			targets : 9,
			className : 'text-center',
			title : '属性值3',
			name : 'attributeValue3',
			data : 'attributeValue3',
			width : '100px'
		},{
			targets : 10,
			className : 'text-center',
			title : '属性值4',
			name : 'attributeValue4',
			data : 'attributeValue4',
			width : '100px'
		},{
			targets : 11,
			className : 'text-center',
			title : '属性值5',
			name : 'attributeValue5',
			data : 'attributeValue5',
			width : '100px'
		},{
			targets : 12,
			className : 'text-center',
			title : '属性值6',
			name : 'attributeValue6',
			data : 'attributeValue6',
			width : '100px'
		},{
			targets : 13,
			className : 'text-center',
			title : '属性值7',
			name : 'attributeValue7',
			data : 'attributeValue7',
			width : '100px'
		},{
			targets : 14,
			className : 'text-center',
			title : '属性值8',
			name : 'attributeValue8',
			data : 'attributeValue8',
			width : '100px'
		},{
			targets : 15,
			className : 'text-center',
			title : '属性值9',
			name : 'attributeValue9',
			data : 'attributeValue9',
			width : '100px'
		},{
			targets : 16,
			className : 'text-center',
			title : '显示顺序',
			name : 'sortNum',
			data : 'sortNum',
			width : '150px'
		},{
			targets : 17,
			className : 'text-center',
			title : '是否可自定义',
			name : 'canCustomize',
			data : 'canCustomize',
			width : '150px',
			render : function(data, type, row, meta){
				var canCustomize = '';
				if(row.canCustomize == '0' && row.canCustomize != ''){
					canCustomize = '否';
					return canCustomize;
				}else if( row.canCustomize == ''){
					return canCustomize;
				}else {
					canCustomize = '是';
					return canCustomize;
				}
			}
		},{
			targets : 18,
			className : 'text-center',
			title : '创建日',
			name : 'CREATION_DATE',
			data : 'CREATION_DATE',
			width : '150px',
			render : function(data, type, row, meta){
				if(data){
					var date = new Date(data)
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
				return '';
			}
		},{
			targets : 19,
			className : 'text-center',
			title : '创建人',
			name : 'CREATED_BY',
			data : 'CREATED_BY',
			width : '150px',
			render : function(data, type, row, meta){
				if(data){
					return data.userName;
				}
				return '';
			}
		},{
			targets : 20,
			className : 'text-center',
			title : '最后更新日',
			name : 'LAST_UPDATE_DATE',
			data : 'LAST_UPDATE_DATE',
			width : '150px',
			render : function(data, type, row, meta){
				if(data){
					var date = new Date(data)
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
				return '';
			}
		},{
			targets : 21,
			className : 'text-center',
			title : '最后更新人',
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
			targets : 22,
			className : 'text-center',
			title : '删除日',
			name : 'ABOLITION_DATE',
			data : 'ABOLITION_DATE',
			width : '100px',
			render : function(data, type, row, meta){
				if(data){
					var date = new Date(data)
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				}
				return '';
			}
		},{
			targets : 23,
			className : 'text-center',
			title : '删除人',
			name : 'ABOLISHED_BY',
			data : 'ABOLISHED_BY',
			width : '100px',
			render : function(data, type, row, meta){
				if(data){
					return data.userName;
				}
				return '';
			}
		},{
			targets : 24,
			className : 'text-center',
			title : '处理系统',
			name : 'PROGRAM_APPLICATION_ID',
			data : 'PROGRAM_APPLICATION_ID',
			width : '100px',
			render : function(data, type, row, meta){
				return DicVal2Nm(data, '系统');
			}
		},{
			targets : 25,
			className : 'text-center',
			title : '处理菜单',
			name : 'PROGRAM_ID',
			data : 'PROGRAM_ID',
			width : '100px'
		},{
			targets : 26,
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
}
BdoDataTables('dictionaryTable', dictionaryParam);

///** 模态框设置 */
//$('.modal').on('show.bs.modal', function(){
//    $(this).draggable({
//		handle: '.block-header',
//		cursor: 'move'
//    });
//    $(this).css('overflow', 'hidden');
//});

/** 模态框关闭 : 清除表单数据*/
$('.modal').on('hidden.bs.modal', function (event) {
	$(event.target).find('input, select, textarea').removeAttr('disabled');
	$(event.target).find('input, select, textarea').val(null);
	$(event.target).find(':input[isTree]').treecombo('setTreeComboValue',[null, null]);
	$(event.target).find('[id^="treecombocon"]').remove();
	$(event.target).find('form td').removeClass('has-error');
	$(event.target).find('form .help-block').remove();
})

$('#form_dictionary').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'd_save',
			icon : 'fa-save',
			style : 'btn-success',
			text : '&nbsp;保存'
		},{
			id : 'd_clear',
			icon : 'fa-circle',
			style : 'btn-primary',
			text : '&nbsp;重置'
		},{
			id : 'd_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'd_id',
			type : 'input',
			label : '编号',
			typeAttr : {
				placeholder: '保存后自动生成'
			}
		},{
			id : 'd_ccatalog',
			type : 'input',
			label : '大分类',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_classification',
			type : 'input',
			label : '中分类',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributetype',
			type : 'input',
			label : '小分类',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'd_attributeName',
			type : 'input',
			label : '属性名称',
			rowspan : 1,
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'd_attributeValue1',
			type : 'input',
			label : '属性值1',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue2',
			type : 'input',
			label : '属性值2',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue3',
			type : 'input',
			label : '属性值3',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue4',
			type : 'input',
			label : '属性值4',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue5',
			type : 'input',
			label : '属性值5',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue6',
			type : 'input',
			label : '属性值6',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue7',
			type : 'input',
			label : '参数3类型',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue8',
			type : 'input',
			label : '属性值8',
			rowspan : 1,
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_attributeValue9',
			type : 'input',
			label : '属性值9',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_sortNum',
			type : 'input',
			label : '显示顺序',
			rowspan : 1,
			typeAttr : {
				normal : true,
				type : 'number'
			},
			validate : {
				rules : {
					min : 0
				}
			}
		},{
			id : 'd_canCustomize',
			type : 'select',
			html : ComboDicOption(true, 'boolean'),
			label : '是否可是自定义',
			typeAttr : {
				normal : true
			}
		},{
			id : 'd_active',
			type : 'select',
			html : ComboDicOption(false, 'activeFlag'),
			label : '是否有效',
			rowspan : 1
		},{}
	]
});

/** 新增 */
$('#btn_add').click(function(){
	$('#d_id, #d_active').attr('disabled', 'disabled');
	$('#modal_dictionary').modal('show');
});

/** 行按钮 修改 */
$('#dictionaryTable').on('click', 'button[name="rowEdit"]', function() {
	$('#d_id, #d_active').attr('disabled', 'disabled');
	var object = $('#dictionaryTable').DataTable().data()[$(this).closest('tr').index()];
	$('#d_clear').hide();
	formSet(object);
	$('#modal_dictionary').modal('show');
});

/** 行按钮 查看 */
$('#dictionaryTable').on('click', 'button[name="rowView"]', function() {
	$(this).closest('tr').dblclick();
});

/** 行双击 */
$('#dictionaryTable tbody').on('dblclick', 'tr', function() {
	$('#d_save,#d_clear').hide();
	$('#modal_dictionary').find('input, select').attr('disabled', 'disabled');
	var object = $('#dictionaryTable').DataTable().data()[$(this).closest('tr').index()];
	formSet(object);
	$('#modal_dictionary').modal('show');
});

/** 保存 */
$('#d_save').click(function(){
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_dic',
		//bdo_Maintenance_processType : 'add',
		//bdo_Maintenance_processType : 'edit',
		id : $('#d_id').val(),
		ccatalog : $('#d_ccatalog').val(),
		classification : $('#d_classification').val(),
		attributetype : $('#d_attributetype').val(),
		attributeName : $('#d_attributeName').val(),
		attributeValue1 : $('#d_attributeValue1').val(),
		attributeValue2 : $('#d_attributeValue2').val(),
		attributeValue3 : $('#d_attributeValue3').val(),
		attributeValue4 : $('#d_attributeValue4').val(),
		attributeValue5 : $('#d_attributeValue5').val(),
		attributeValue6 : $('#d_attributeValue6').val(),
		attributeValue7 : $('#d_attributeValue7').val(),
		attributeValue8 : $('#d_attributeValue8').val(),
		attributeValue9 : $('#d_attributeValue9').val(),
		sortNum : $('#d_sortNum').val(),
		canCustomize : $('#d_canCustomize').val(),
		ACTIVE_FLAG : '1'
	}
	
	var id = $('#d_id').val();
	var submiturl;
	if(id){
		submiturl = 'base/general.updateByKey.json';
	} else{
		submiturl = 'base/general.create.json';
	}
	$('#form_dictionary').formview(
		'setAjaxConf',
		[
			submiturl,
			param,
			'json',
			true,
			function(data) {
				if(data.success === true){
					$('#dictionaryTable').DataTable().draw(false);
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_dictionary').modal('hide');
			}
		]
	)
	$('#form_dictionary').submit();
});

/** 重置 */
$('#d_clear').click(function(){
	$('#modal_dictionary').find('input:not(#d_id), select:not(#d_active)').val('');
});

/** 修改 */
$('#d_close').click(function(){
	$('#modal_dictionary').modal('hide');
});

/** 行按钮 作废 */
$('#dictionaryTable').on('click', 'button[name="rowBan"]', function() {
	var object = $('#dictionaryTable').DataTable().data()[$(this).closest('tr').index()];
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_dic',
		bdo_Maintenance_processType : 'abolish',
		id : object.id,
		ccatalog : object.ccatalog,
		classification : object.classification,
		attributetype : object.attributetype,
		attributeName : object.attributeName,
		attributeValue1 : object.attributeValue1,
		attributeValue2 : object.attributeValue1,
		attributeValue3 : object.attributeValue1,
		attributeValue4 : object.attributeValue1,
		attributeValue5 : object.attributeValue1,
		attributeValue6 : object.attributeValue1,
		attributeValue7 : object.attributeValue1,
		attributeValue8 : object.attributeValue1,
		attributeValue9 : object.attributeValue1,
		sortNum : object.sortNum,
		canCustomize : object.canCustomize,
		ACTIVE_FLAG : object.ACTIVE_FLAG
	}
	$.ajax({
		url : 'base/general.abolishByKey.json',
		type : 'post',
		data : param,
		dataType : 'json',
		success : function(data){
			if(data.success === true){
				$('#dictionaryTable').DataTable().draw(false);
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

/** 行按钮 取消作废 */
$('#dictionaryTable').on('click', 'button[name="rowUse"]', function() {
	var object = $('#dictionaryTable').DataTable().data()[$(this).closest('tr').index()];
	var param = {
		menuId : window.sys_menuId,
		bdo_table_id : 'bdo_base.base_dic',
		bdo_Maintenance_processType : 'unabolish',
		id : object.id,
		ccatalog : object.ccatalog,
		classification : object.classification,
		attributetype : object.attributetype,
		attributeName : object.attributeName,
		attributeValue1 : object.attributeValue1,
		attributeValue2 : object.attributeValue1,
		attributeValue3 : object.attributeValue1,
		attributeValue4 : object.attributeValue1,
		attributeValue5 : object.attributeValue1,
		attributeValue6 : object.attributeValue1,
		attributeValue7 : object.attributeValue1,
		attributeValue8 : object.attributeValue1,
		attributeValue9 : object.attributeValue1,
		sortNum : object.sortNum,
		canCustomize : object.canCustomize,
		ACTIVE_FLAG : object.ACTIVE_FLAG
	}
	$.ajax({
		url : 'base/general.unabolishByKey.json',
		type : 'post',
		data : param,
		dataType : 'json',
		success : function(data){
			if(data.success === true){
				$('#dictionaryTable').DataTable().draw(false);
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});

/** 表单赋值 */
function formSet(object){
	$('#d_id').val(object.id);
	$('#d_ccatalog').val(object.ccatalog);
	$('#d_classification').val(object.classification);
	$('#d_attributetype').val(object.attributetype);
	$('#d_attributeName').val(object.attributeName);
	$('#d_attributeValue1').val(object.attributeValue1);
	$('#d_attributeValue2').val(object.attributeValue2);
	$('#d_attributeValue3').val(object.attributeValue3);
	$('#d_attributeValue4').val(object.attributeValue4);
	$('#d_attributeValue5').val(object.attributeValue5);
	$('#d_attributeValue6').val(object.attributeValue6);
	$('#d_attributeValue7').val(object.attributeValue7);
	$('#d_attributeValue8').val(object.attributeValue8);
	$('#d_attributeValue9').val(object.attributeValue9);
	$('#d_sortNum').val(object.sortNum);
	$('#d_canCustomize').val(object.canCustomize);
	$('#d_active').val(object.ACTIVE_FLAG);
}