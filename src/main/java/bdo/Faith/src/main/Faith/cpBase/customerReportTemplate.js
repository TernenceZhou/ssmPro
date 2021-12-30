//pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');
/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
	e.preventDefault();
	$(this).tab('show');
});*/
/** 模态框设置 */
/*$('.modal').on('show.bs.modal', function(){
    $(this).draggable({
		handle: '.block-header',
		cursor: 'move'
    });
    $(this).css('overflow', 'hidden');
});*/
$('#modal_comsubform').on('hidden.bs.modal', function() {
	$('#modal_comsubform button').show();
	$('#modal_comsubform').find('input, select, textarea').removeAttr('disabled','disabled');
	$('#modal_comsubform form')[0].reset();
	$('#modal_comsubform form td').removeClass('has-error');
	$('#modal_comsubform form .help-block').remove();
});

var ruleoption = ComboDBOption('cpBase/Combo.getRuleacc.json', false);

var template_view = {
		localParam : {
			tabNum : true,
			url : 'cpBase/General.query.json',
			urlparam : {
				sqlId : 'FA10066',
				menuId : window.sys_menuId,
				start : -1,
				limit : -1,
				'param1' : window.CUR_CUSTOMERID
			}
		},
		tableParam : {
			select : true,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order : [2, 'ASC'],
			ordering : true,
			serverSide : true,
			columnDefs : [
			{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '60px',
				render : function(data, type, row, meta) {
					var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
					if (row.type == 0){
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDel" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
					}
					renderStr += '<button class="btn btn-xs btn-primary" type="button" name="subDetail" data-placement="top" title="模板详细" data-toggle="tooltip"><i class="fa fa-file-text"></i></button>';

					return renderStr;
				}
			}, {
				targets : 2,
				className : 'text-left',
				title : '模板名称',
				name : 'label',
				data : 'label',
				width : '250px'
			}, {
				targets : 3,
				className : 'text-left',
				title : '模板类型',
				name : 'type',
				data : 'type',
				width : '250px',
				render: function(data, type, row, meta){
					if (data==0){
						return '自定义模板';
					}else{
						return '通用模板';
					}
				}
			}]
		}
	};

BdoDataTable('custemplate_table', template_view);

$('#custemplate_form').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'custemplate_save',
			icon : 'fa-save',
			style : 'btn-primary',
			text : '&nbsp;保存'
		}, {
			id : 'custemplate_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'cus_templateId',
			type : 'input',
			typeAttr:{
				type : 'hidden'
			}
		},{
			id : 'cus_templateName',
			type : 'input',
			label : '模板名称',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'cus_inittemplateId',
			type : 'select',
			label : '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" id="initTemplateCheck" value="1"><span></span>初始化模板',
			html : '<option value="0">默认模板</option>' + ruleoption,
			validate : {
				rules : {
					required : false
				}
			},
			rowspan : 1
		}
	]
});

//新增
$('#custemplate_save').click(function(){
	var initFlag = 0;
	if ($('#initTemplateCheck').is(':checked')) {
		initFlag = 1;
	}
	
	$('#custemplate_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.templateSave.json',
			{
				param1 : $('#cus_templateName').val(),
				param2 : $('#cus_inittemplateId').val(),
				param3 : initFlag,
				param4 : $('#cus_templateId').val(),
				param5 : window.CUR_CUSTOMERID
			},
			'json', true,
			function(data) {
				$('#modal_custemplateform').modal('hide');
				$('#custemplate_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_cussubform').modal('hide');
			}
		]
	);
	$('#custemplate_form').submit();
});

$('#custemplate_close').click(function(){
	$('#modal_custemplateform').modal('hide');
});

//新增报表模板
$('#custemplate_add').click(function() {
	$('#cus_templateId').val('');
	$('#cus_templateName').val('');
	$('#initTemplateCheck').attr('checked','checked');

	$('#modal_custemplateform').modal('show');
});


/** 行双击 */
$('#custemplate_table tbody').on('dblclick', 'tr', function() {
	var object = $('#custemplate_table').DataTable().data()[$(this).closest('tr').index()];
	var optType = 'view';
	if (object.type == '0'){
		optType = 'edit';
	}
	templateTab('tab_template', window.CUR_CUSTOMERID, object.value,optType);
});

$('#custemplate_table').on('click', 'button[name="subDetail"]', function() {
	var object = $('#custemplate_table').DataTable().data()[$(this).closest('tr').index()];
	var optType = 'view';
	if (object.type == '0'){
		optType = 'edit';
	}
	templateTab('tab_template', window.CUR_CUSTOMERID, object.value,optType);
});


//修改模板
$('#custemplate_table').on('click', 'button[name="subEdit"]', function() {	
	var object = $('#custemplate_table').DataTable().data()[$(this).closest('tr').index()];
	$('#cus_templateId').val(object.value);
	$('#cus_templateName').val(object.label);
	$('#modal_custemplateform').modal('show');
	$('#initTemplateCheck').removeAttr('checked');
});

//删除模板
$('#custemplate_table').on('click', 'button[name="subDel"]', function() {	
	var object = $('#custemplate_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认要删除报表模板【' + object.label + '】?', function(){
		$.ajax({
			url : 'cpBase/SubjectManage.templateDelete.json',
			type : 'post',
			data : {
				param1 : object.value
			},
			dataType : 'json',
			success : function(data){
				$('#custemplate_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);				
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});


$('#comsub_form').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'com_edit',
			icon : 'fa-send',
			style : 'btn-primary',
			text : '&nbsp;修改'
		}, {
			id : 'com_save',
			icon : 'fa-save',
			style : 'btn-primary',
			text : '&nbsp;保存'
		}, {
			id : 'com_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'com_autoid',
			type : 'input',
			typeAttr:{
				type : 'hidden'
			}
		},{
			id : 'com_subid',
			type : 'input',
			label : '科目编号',
			typeAttr: {
				placeholder: '自动生成',
				disabled : true
			},
		},{
			id : 'com_subname',
			type : 'input',
			label : '科目名称',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'com_subtype',
			type : 'input',
			label : '科目分类',
			rowspan : 1,
			colspan : 1,
			plugin : {
				name : 'treecombo',
				options :{
					url : 'cpBase/TreeCommon.findSubType.json',
					params : {},
					view : {
						leafIcon: 'fa fa-building text-flat',    
						nodeIcon: 'fa fa-bank text-primary-light',
						folderSelectable: false,
						multiSelect: false
					}
				}
			},
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'com_direction',
			type : 'select',
			label : '方向',
			html : '<option value="1">借</option><option value="-1">贷</option>',
			validate : {
				rules : {
					required : true
				}
			}
		},{
			id : 'com_parentId',
			type : 'select',
			label : '科目',
			rowspan : 1
		}
	]
});


var sys_subtype="";

$('#com_parentId').focus(function(){
	if(sys_subtype==$('#com_subtype').treecombo('getTreeComboValue')){
		return;
	}
	sys_subtype=$('#com_subtype').treecombo('getTreeComboValue');
	var params2 = {
			'sqlId' : 'FA30031',
			'menuId' : window.sys_menuId,
			'param1' : $('#com_subtype').treecombo('getTreeComboValue')
		};
	$('#com_parentId').html(ComboDBOptionWithParam('cpBase/General.query.json', false,params2));
});


var comsubject_view = {
	localParam : {
		tabNum : true,
		url : 'cpBase/General.query.json',
		urlparam : {
			menuId : window.sys_menuId,
			sqlId : 'FA40030',
			start : -1,
			limit : -1,
			param1 : window.CUR_CUSTOMERID,
			filter : queryFilter()
		}
	},
	tableParam : {
		select : true,
		lengthChange : false,
		dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
		order : [2, 'ASC'],
		ordering : true,
		serverSide : true,
		columnDefs : [{
			targets : 1,
			orderable : false,
			className : 'text-left',
			title : '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input id="checkAll" onclick="checkAll(this);" type="checkbox" value=""><span></span></label>',
			data : null,
			width : '10px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				renderStr += '<div align="center"><label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" name="chkSubject" value="' + row.subjectId + '"><span></span></label></div>';
				return renderStr;
			}
		},
		{
			targets : 2,
			orderable : false,
			className : 'text-center',
			title : '处理',
			width : '60px',
			render : function(data, type, row, meta) {
				var renderStr = '';
				if (row.customerId == window.CUR_CUSTOMERID){
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDel" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-remove"></i></button>';				
				}
				return renderStr;
			}
		}, {
			targets : 3,
			className : 'text-left',
			title : '科目编号',
			name : 'subjectId',
			data : 'subjectId',
			width : '150px'
		}, {
			targets : 4,
			className : 'text-left',
			title : '科目名称',
			name : 'subjectName',
			data : 'subjectName',
			width : '350px'
		}, {
			targets : 5,
			className : 'text-center',
			title : '科目分类',
			name : 'subjectTypeName1',
			data : 'subjectTypeName1',
			width : '150px'
		}, {
			targets : 6,
			className : 'text-center',
			title : '方向',
			name : 'direction',
			data : 'direction',
			width : '150px',
			render: function(data, type, row, meta){
				if (data==1){
					return '借';
				} else if (data== -1){
					return '贷';
				}
			}
		}, {
			targets : 7,
			className : 'text-center',
			title : '科目类型',
			name : 'customerId',
			data : 'customerId',
			width : '150px',
			render : function(data, type, row, meta) {
				if (row.customerId == 0){
					return '通用科目';
				}else{
					return '自定义科目';
				}
			}
		}]
	}
};



$('a[href="#tab_subjectcomser"]').click(function(){
	BdoDataTable('comsubject_table', comsubject_view);
});

$('#comsubject_search').click(function() {
	comsubject_view.localParam.urlparam.filter = queryFilter();
	$('#comsubject_table').DataTable().ajax.reload();
});

// 新增 
$('#comsubject_plus').click(function() {
	$('#com_subid').attr('disabled','disabled');
	$('#com_edit').hide();
	$('#modal_comsubform').modal('show');
});

//添加到模板
$('#comsubject_addtotemplate').click(function() {
	
	var checkedFlag = false;
	$('input[name="chkSubject"]:checked').each(function(){
		checkedFlag = true;
    });
	
	if (!checkedFlag){
		bdoInfoBox('提示', '请选择科目');
		return;
	}
	var ruleoptionCustomerized = ComboDBOptionWithParam('cpBase/Combo.getCustomerizedRuleacc.json', false,{param1:CUR_CUSTOMERID});
	$('#seltemplate_templateId').html(ruleoptionCustomerized);
	$('#modal_seltemplate').modal('show');
});

//添加到模板确定保存
$('#addtotemplate_ok').click(function() {
	var data = '';
	$('input[name="chkSubject"]:checked').each(function(){
		if (data == ''){
			data = $(this).val();
			
		}else{
			data = data + ',' + $(this).val();
		}
    });	
	
	$.ajax({
		url : 'cpBase/SubjectManage.addSubjectToTemplate.json',
		type : 'post',
		data : {
			param1 : data,
			param2 : $('#seltemplate_templateId').val()
		},
		dataType : 'json',
		success : function(data){
			$('#modal_seltemplate').modal('hide');
			if(data.success === true){
				bdoSuccessBox('保存成功', data.resultInfo.statusText);
				$('input[name="chkSubject"]:checked').each(function(){
					this.checked = false;
				});
			}else {
				bdoErrorBox('保存失败', data.resultInfo.statusText);
			}
		}
	});
});


// 导出 
$('#comsubject_export').click(function() {
	exportExcel(this, '报表科目一览', comsubject_view, 'comsubject_table');
});


// 禁用/激活
$('#comsubject_table').on('click', 'button[name="subBan"]', function() {
	var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认' + $(this).attr('title') + '科目【' + object.subjectId + '-' + object.subjectName + '】?', function(){
		$.ajax({
			url : 'cpBase/SubjectManage.subjectcomBan.json',
			type : 'post',
			data : {
				param1 : object.autoId,
				param2 : 0
			},
			dataType : 'json',
			success : function(data){
				$('#comsubject_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 修改
$('#comsubject_table').on('click', 'button[name="subEdit"]', function() {
	$('#com_save').hide();
	$('#com_subid').attr('disabled','disabled');
	var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
	comformSet(object);
	$('#modal_comsubform').modal('show');
});

// 删除
$('#comsubject_table').on('click', 'button[name="subDel"]', function() {
	var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认删除科目【' + object.subjectId + '-' + object.subjectName + '】?', function(){
		$.ajax({
			url : 'cpBase/SubjectManage.subjectcomDelete.json',
			type : 'post',
			data : {
				param1 : object.autoId
			},
			dataType : 'json',
			success : function(data){
				$('#comsubject_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 检索条件设置 */
function queryFilter() {
	var queryFilterArr = [];
	if ($('#comsubject_id').val() != '') {
		queryFilterArr.push({
			'field' : 'subjectId',
			'sqlIndex' : 'subjectId',
			'type' : 'string',
			'value' : $('#comsubject_id').val(),
			'operate' : 'eq'
		});
	}
	if ($('#comsubject_name').val() != '') {
		queryFilterArr.push({
			'field' : 'subjectName',
			'sqlIndex' : 'subjectName',
			'type' : 'string',
			'value' : $('#comsubject_namme').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

// 修改
$('#com_edit').click(function(){
	$('#comsub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.subjectcomUpdate.json',
			{
				param1 : JSON.stringify({
					autoId : $('#com_autoid').val(),
					subjectId : $('#com_subid').val(),
					subjectName : $('#com_subname').val(),
					subjectType : $('#com_subtype').treecombo('getTreeComboValue'),
					direction : $('#com_direction').val(),
					com_parentId : $('#com_parentId').val(),
					customerId : window.CUR_CUSTOMERID,
					
				}),
				param2 : 1
			},
			'json', true,
			function(data) {
				$('#comsubject_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_comsubform').modal('hide');
			}
		]
	);
	$('#comsub_form').submit();
});
// 新增
$('#com_save').click(function(){
	$('#comsub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.subjectcomUpdate.json',
			{
				param1 : JSON.stringify({
					autoId : '',
					subjectId : $('#com_subid').val(),
					subjectName : $('#com_subname').val(),
					subjectType : $('#com_subtype').treecombo('getTreeComboValue'),
					direction : $('#com_direction').val(),
					com_parentId : $('#com_parentId').val(),
					customerId : window.CUR_CUSTOMERID
				}),
				param2 : 2
			},
			'json', true,
			function(data) {
				$('#comsubject_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#modal_comsubform').modal('hide');
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				
			}
		]
	);
	$('#comsub_form').submit();
});

$('#com_close').click(function(){
	$('#modal_comsubform').modal('hide');
});

function comformSet(object){
	$('#com_autoid').val(object.autoId);
	$('#com_subid').val(object.subjectId);
	$('#com_subname').val(object.subjectName);
	$('#com_subtype').treecombo('setTreeComboValue',[object.subjectType1, object.subjectTypeName1]);
}
