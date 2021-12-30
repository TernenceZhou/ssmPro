//pageRightTitle(pageTitleArr);
uiBlocksApi(false, 'init');
/*$('[data-toggle="tabs"]').on('click', 'a', function (e) {
	e.preventDefault();
	$(this).tab('show');
});*/
/** 模态框设置 */
/*$('.modal').on('show.bs.modal', function () {
	$(this).draggable({
		handle: '.block-header',
		cursor: 'move'
	});
	$(this).css('overflow', 'hidden');
});*/
$('#modal_comsubform').on('hidden.bs.modal', function () {
	$('#modal_comsubform button').show();
	$('#modal_comsubform').find('input, select, textarea').removeAttr('disabled', 'disabled');
	$('#modal_comsubform form')[0].reset();
	$('#modal_comsubform form td').removeClass('has-error');
	$('#modal_comsubform form .help-block').remove();
});

var baobeiTemplate  = ComboDicOption(false, '报备模板类型');
//当前报表模板id
var currentVocationId;
//当前报备模板id
var currentBaobeiTemplateTypeId;
var ruleoption = ComboDBOption('cpBase/Combo.getRuleacc.json', false);
$('#template_vocationId').html(ruleoption + '<option value=0>默认模板</option>');
//var template_type = ComboDBOption('cpBase/Combo.getRuleaccType.json', false);
$('#template_type').html(ComboLocalDicOption(true,'报表模板类型'));
$("#baobeiTemplateTypeSelect").html(ComboLocalDicOption(false, '报备模板类型'));
$("#tableDivSelect").html(ComboLocalDicOption(false, 'TABLE_DIV'));
var currentBaobeiTemplateType = $('#baobeiTemplateTypeSelect').val();
var currentTableDiv = $('#tableDivSelect').val();


$('#baobeiReferenceEdit_form').formview({
	display: 'tableform-one',
	column: 4,
	buttons: [
		{
			id: 'baobeiReferenceEdit_save',
			icon: 'fa-save',
			style: 'btn-primary',
			text: '&nbsp;保存'
		}, {
			id: 'baobeiReferenceEdit_close',
			icon: 'fa-sign-out',
			style: 'btn-warning',
			text: '&nbsp;关闭'
		}
	],
	items: [
		{
			id: 'baobeitemplateId',
			type: 'input',
			typeAttr: {
				type: 'hidden'
			}
		}, {
			id: 'baobeitemplate',
			type: 'input',
			label: '报备项',
			rowspan: 1,
			typeAttr : {
				disabled : true
			}
		},{
			id: 'baobeiReportType',
			type: 'input',
			label: '所属报表',
			rowspan: 1,
			typeAttr : {
				disabled : true
			}
		},{
			id: 'subtemplatecol_type',
			type: 'select',
			label: '报表项匹配',
			validate: {
				rules: {
					required: true
				}
			},
			rowspan: 1
		}
	]
});

//模板报表项修改保存
$('#baobeiReferenceEdit_save').click(function () {
	$('#baobeiReferenceEdit_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.updateBetween.json',
			{
				param1: $('#baobeitemplateId').val(),
				param2: $('#subtemplatecol_type option:selected').val(),
				param3 : currentVocationId,
				param4 : currentBaobeiTemplateTypeId
			},
			'json', true,
			function (data) {

				//$('#comtemplate_table').DataTable().ajax.reload();
				if (data.resultInfo.status == '0') {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_comtemplatecolEditform').modal('hide');
			}
		]
	);
	$('#baobeiReferenceEdit_form').submit();
});

$('#baobeiReferenceEdit_close').click(function () {
	$('#modal_comtemplatecolEditform').modal('hide');
});


$('#baobeiTemplateSelect').formview({
	display: 'tableform-one',
	column: 4,
	buttons: [
		{
			id: 'baobeiTemplateEnsure',
			icon: 'fa-save',
			style: 'btn-primary',
			text: '&nbsp;确认'
		}
	],
	items: [
		{
			id: 'com_templateId2',
			type: 'input',
			typeAttr: {
				type: 'hidden'
			}
		}, {
			id: 'baobeiTemplateSelect',
			type: 'select',
			label: '报备模板',
			html: baobeiTemplate,
			validate: {
				rules: {
					required: true
				}
			},
			rowspan: 1
		}
	]
});


$('#comtemplate_form').formview({
	display: 'tableform-one',
	column: 4,
	buttons: [
		{
			id: 'comtemplate_save',
			icon: 'fa-save',
			style: 'btn-primary',
			text: '&nbsp;保存'
		}, {
			id: 'comtemplate_close',
			icon: 'fa-sign-out',
			style: 'btn-warning',
			text: '&nbsp;关闭'
		}
	],
	items: [
		{
			id: 'com_templateId',
			type: 'input',
			typeAttr: {
				type: 'hidden'
			}
		}, {
			id: 'com_template_type',
			type: 'select',
			label: '报表类型',
			html: template_type,
			validate: {
				rules: {
					required: true
				}
			},
			rowspan: 1
		}, {
			id: 'com_template_year',
			type: 'select',
			label: '年份',
			html: '',
			validate: {
				rules: {
					required: true
				}
			},
			rowspan: 1
		}, {
			id: 'com_template_month',
			type: 'select',
			label: '月份',
			html: '',
			validate: {
				rules: {
					required: false
				}
			},
			rowspan: 1
		}, {
			id: 'com_inittemplateId',
			type: 'select',
			label: '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" id="initTemplateCheck" value="1"><span></span>初始化模板',
			html: ruleoption,
			validate: {
				rules: {
					required: false
				}
			},
			rowspan: 1
		}
	]
});

//getUserYear('com_template_year');
$('#com_template_month').html(ComboDicOption(true, 'month'));
//新增
$('#comtemplate_save').click(function () {
	var initFlag = 0;
	if ($('#initTemplateCheck').is(':checked')) {
		initFlag = 1;
	}

	$('#comtemplate_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.templateSave.json',
			{
				param1: $('#com_template_year option:selected').text() + $('#com_template_month option:selected').val() + $('#com_template_type option:selected').text(),
				param2: $('#com_inittemplateId').val(),
				param3: initFlag,
				param4: $('#com_templateId').val(),
				param6: $('#com_template_type').val(),
				param7: $('#com_template_year option:selected').text(),
				param8: $('#com_template_month option:selected').val()
			},
			'json', true,
			function (data) {
				$('#modal_comtemplateform').modal('hide');
				ruleoption = ComboDBOption('cpBase/Combo.getRuleacc.json', false);
				$('#com_inittemplateId').html(ruleoption);
				$('#com_template_search').click();
				if (data.resultInfo.status == '0') {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_comsubform').modal('hide');
			}
		]
	);
	$('#comtemplate_form').submit();
});

$('#comtemplate_close').click(function () {
	$('#modal_comtemplateform').modal('hide');
});

var initTab1Table = function () {
	var all_template_table = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA10076',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: $("#template_active_flag").val(),
				param2: $("#template_type").val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order: [2, 'ASC'],
			serverSide: true,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function (data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
						if (row.ACTIVE_FLAG == 1) {
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="referenceToBaobei" data-placement="top" title="对照报备模板" data-toggle="tooltip"><i class="fa fa-indent"></i></button>&nbsp;';
						}
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '报表类型',
					name: 'templateType',
					data: 'templateType',
					width: '80px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '报表名称',
					name: 'ruleName',
					data: 'ruleName',
					width: '200px'
				},  {
					targets: 4,
					className: 'text-left',
					title: '报备对照程度(%)',
					name: 'treatmentDegree',
					data: 'treatmentDegree',
					width: '130px'
				}]
		}
	};

	BdoDataTable('all_template_table', all_template_table);
};
//查询模板一览
$('#com_template_search').on('click', function () {
	initTab1Table();
});

var comtemplate_view = {
	localParam: {
		tabNum: true,
		url: 'cpBase/General.query.json',
		urlparam: {}
	},
	tableParam: {
		select: true,
		lengthChange: false,
		dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
		order: [2, 'ASC'],
		serverSide: true,
		rowReorder: {
			update: false
		},
		columnDefs: [
			{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '处理',
				width: '60px',
				render: function (data, type, row, meta) {
					var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="对照" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="清除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: false,
				className: 'text-left',
				title: '报备模板字段编号',
				name: 'autoId',
				data: 'autoId',
				visible : false,
				width: '60px'
			}, {
				targets: 3,
				orderable: false,
				className: 'text-left',
				title: '报备模板字段',
				name: 'colName',
				data: 'colName',
				width: '200px'
			}, {
				targets: 4,
				orderable: false,
				className: 'text-center',
				title: '所属报表种类',
				name: 'tableName',
				data: 'tableName',
				width: '80px'
			}, {
				targets: 5,
				orderable: false,
				className: 'text-left',
				title: '所在表格行',
				name: 'lineNum',
				data: 'lineNum',
				width: '50px'
			}, {
				targets: 6,
				orderable: false,
				className: 'text-left',
				title: '报表模板字段',
				name: 'colDisp',
				data: 'colDisp',
				width: '200px'
			}, {
				targets: 7,
				orderable: false,
				className: 'text-left',
				title: '报表项标号',
				name: 'colCode',
				data: 'colCode',
				width: '80px'
			}]
	}
};

//确认选择报备模板后
$("#baobeiTemplateEnsure").click(function () {
	//更新currentVocationId
	currentVocationId = $("#com_templateId2").val();
	currentBaobeiTemplateTypeId = $("#baobeiTemplateSelect option:selected").val();
	$("#modal_baobeitemplateform").modal("hide");
	var params = {
		sqlId: 'FA10077',
		menuId: window.sys_menuId,
		start: -1,
		limit: -1,
		param1: currentBaobeiTemplateTypeId,
		param2 :currentVocationId
	};
	comtemplate_view.localParam.urlparam = params;
	BdoDataTable('comtemplate_table', comtemplate_view);
	$('#template_select').text('【报备模板对照】');
	//$('a[href="#tab_template"]').click();
	$('#tab_template').addClass('active');
	$('a[href="#tab_template"]').parent().addClass('active');
	$('#tab_template_browse').removeClass('active');
	$('a[href="#tab_template_browse"]').parent().removeClass('active');
	$('a[href="#tab_template"]').css('display', 'block');
	return false;
});

//查看模板详情
$('#all_template_table').on('click', 'button[name="referenceToBaobei"]', function () {
	$("#modal_baobeitemplateform").modal("show");
	var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
	$("#com_templateId2").val(object.autoId);
});

//关闭页签
$('a[href="#tab_template"] .fa-times-circle').on('click', function () {
	$('#tab_template_browse').addClass('active');
	$('a[href="#tab_template_browse"]').parent().addClass('active');
	$('#tab_template').removeClass('active');
	$('a[href="#tab_template"]').parent().removeClass('active');
	$('a[href="#tab_template"]').css('display', 'none');
	return false;
});

//删除模板
$('#all_template_table').on('click', 'button[name="subAbolish"]', function () {
	var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认删除' + object.ruleName + '吗?', function () {
		$.ajax({
			url: 'cpBase/SubjectManage.abolishTemplate.json',
			type: 'post',
			data: {
				param1: object.autoId
			},
			dataType: 'json',
			success: function (data) {
				if (data.resultInfo.status == '0') {
					$('#all_template_table').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}

			}
		});
	});
});
/*
$('#comtemplate_search').click(function() {
	var params = {
		sqlId : 'FA40026',
		menuId : window.sys_menuId,
		start : -1,
		limit : -1,
		'param1' : $('#template_vocationId').val()
	};	
	
	comtemplate_view.localParam.urlparam = params;
	BdoDataTable('comtemplate_table', comtemplate_view);
	$('#template_select').text('【' + $('#template_vocationId option:selected').text() + '】');

});
*/


//添加报表项
$('#comtemplatecol_add').click(function () {
	$('#modal_comtemplatecolform').modal('show');
});



//修改模板报表项
$('#comtemplate_table').on('click', 'button[name="subEdit"]', function () {

	var object = $('#comtemplate_table').DataTable().data()[$(this).closest('tr').index()];
	//报备项
	$('#baobeitemplate').val(object.colName);
	//id
	$('#baobeitemplateId').val(object.autoId);
	//所属报表
	$('#baobeiReportType').val(object.tableName);
	//报表项匹配
	$("#subtemplatecol_type").html('');
	$("#subtemplatecol_type").html(ComboDBOptionWithParam('cpBase/Combo.getReportTemplate.json', false,{param1:object.tableName,param2:currentVocationId}));
	$('#modal_comtemplatecolEditform').modal('show');

});

//移除模板报表项
$('#comtemplate_table').on('click', 'button[name="subDelete"]', function () {
	bdoConfirmBox('提示','确定删除该报备模板当前报备字段吗？',isConfirm=>{
		var object = $('#comtemplate_table').DataTable().data()[$(this).closest('tr').index()];
		var colDisp = object.colDisp;
		if(colDisp === null || colDisp === ''){
			return;
		}
		$.ajax({
			url: 'cpBase/SubjectManage.deleteBetween.json',
			type: 'post',
			data: {
				param1: object.autoId,
				param2 : currentVocationId,
				param3 : currentBaobeiTemplateTypeId
			},
			dataType: 'json',
			success: function (data) {
				if (data.resultInfo.status == '0') {
					$('#comtemplate_table').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}

			}
		});
	})


});


$('#comsub_form').formview({
	display: 'tableform-one',
	column: 4,
	buttons: [
		{
			id: 'com_save',
			icon: 'fa-save',
			style: 'btn-primary',
			text: '&nbsp;保存'
		}, {
			id: 'com_close',
			icon: 'fa-sign-out',
			style: 'btn-warning',
			text: '&nbsp;关闭'
		}
	],
	items: [
		{
			id: 'com_autoid',
			type: 'input',
			typeAttr: {
				type: 'hidden'
			}
		}, {
			id: 'com_subid',
			type: 'input',
			label: '报备模板字段',
			validate: {
				rules: {
					required: true
				}
			}
		}, {
			id: 'com_subname',
			type: 'select',
			label: '所属报表种类',
			typeAttr : {
				disabled : true
			},
			validate: {
				rules: {
					required: true
				}
			}
		}, {
			id: 'lineNum',
			type: 'input',
			label: '所在表格行',
			validate: {
				rules: {
					required: true
				}
			}
		}
	]
});
$('#com_subname').html(ComboDicOption(false, 'TABLE_DIV'));
var comsubject_view = {
	localParam: {
		tabNum: true,
		url: 'cpBase/General.query.json',
		urlparam: {
			menuId: window.sys_menuId,
			sqlId: 'FA10079',
			start: -1,
			limit: -1,
			param1:$('#baobeiTemplateTypeSelect').val(),
			param2:$('#tableDivSelect').val(),
			param3: window.CUR_PROJECTID
		}
	},
	tableParam: {
		select: true,
		lengthChange: false,
		dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
		order: [2, 'ASC'],
		serverSide: true,
		columnDefs: [
			{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '处理',
				width: '60px',
				render: function (data, type, row, meta) {
					var renderStr = '';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: false,
				className: 'text-left',
				title: '报备模板字段编号',
				name: 'autoId',
				data: 'autoId',
				visible : false,
				width: '60px'
			}, {
				targets: 3,
				orderable: false,
				className: 'text-left',
				title: '报备模板字段',
				name: 'colName',
				data: 'colName',
				width: '150px'
			}, {
				targets: 4,
				orderable: false,
				className: 'text-left',
				title: '取值路径',
				name: 'fieldPath',
				data: 'fieldPath',
				width: '100px'
			}, {
				targets: 5,
				orderable: false,
				className: 'text-center',
				title: '所属报表种类',
				name: 'tableName',
				data: 'tableName',
				width: '150px'
			}, {
				targets: 6,
				orderable: false,
				className: 'text-left',
				title: '所在表格行',
				name: 'lineNum',
				data: 'lineNum',
				width: '50px'
			}]
	}
};


$('a[href="#tab_subjectcomser"]').click(function () {
	BdoDataTable('comsubject_table', comsubject_view);
});


$('#comsubject_search').click(function () {
	currentBaobeiTemplateType = $('#baobeiTemplateTypeSelect').val();
	currentTableDiv = $('#tableDivSelect').val();
	comsubject_view.localParam.urlparam.param1 = currentBaobeiTemplateType;
	comsubject_view.localParam.urlparam.param2 = currentTableDiv;
	$('#comsubject_table').DataTable().ajax.reload();
});


var sys_subtype = "";

$('#com_parentId').focus(function () {
	if (sys_subtype == $('#com_subtype').treecombo('getTreeComboValue')) {
		return;
	}
	sys_subtype = $('#com_subtype').treecombo('getTreeComboValue');
	var params2 = {
		'sqlId': 'FA30031',
		'menuId': window.sys_menuId,
		'param1': $('#com_subtype').treecombo('getTreeComboValue')
	};
	$('#com_parentId').html(ComboDBOptionWithParam('cpBase/General.query.json', false, params2));
});


//添加到模板确定保存
$('#addtotemplate_ok').click(function () {
	var data = '';
	$('input[name="chkSubject"]:checked').each(function () {
		if (data == '') {
			data = $(this).val();

		} else {
			data = data + ',' + $(this).val();
		}
	});

	$.ajax({
		url: 'cpBase/SubjectManage.addSubjectToTemplate.json',
		type: 'post',
		data: {
			param1: data,
			param2: $('#seltemplate_templateId').val()
		},
		dataType: 'json',
		success: function (data) {
			$('#modal_seltemplate').modal('hide');
			if (data.resultInfo.status == '0') {
				bdoSuccessBox('保存成功', data.resultInfo.statusText);
				$('input[name="chkSubject"]:checked').each(function () {
					this.checked = false;
				});
			} else {
				bdoErrorBox('保存失败', data.resultInfo.statusText);
			}
		}
	});
});


// 修改
$('#comsubject_table').on('click', 'button[name="subEdit"]', function () {
	//comsub_form
	var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
	$('#com_autoid').val(object.autoId);
	$('#com_subid').val(object.colName);
	$('#com_subname').val(currentTableDiv);
	$('#lineNum').val(object.lineNum);
	$('#modal_comsubform').modal('show');
});

// 新增
$('#comsubject_plus').click(function () {
	$('#com_autoid').val('');
	$('#com_subid').val('');
	$('#com_subname').val(currentTableDiv);
	$('#lineNum').val('');
	$('#modal_comsubform').modal('show');
});

// 删除
$('#comsubject_table').on('click', 'button[name="subDelete"]', function () {
	var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认删除字段【' + object.colName+ '】?', function () {
		$.ajax({
			url: 'cpBase/SubjectManage.baobeiTemplateDelete.json',
			type: 'post',
			data: {
				param1: object.autoId,
				param2 : object.lineNum,
				param3 : currentBaobeiTemplateType,
				param4 : $('#com_subname').val(),
			},
			dataType: 'json',
			success: function (data) {
				$('#comsubject_table').DataTable().ajax.reload();
				if (data.resultInfo.status == '0') {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});


// 新增
$('#com_save').click(function () {

	$('#comsub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.baobeiTemplateAddOrUpdate.json',
			{
				param1:$('#com_autoid').val(),
				param2:$('#com_subid').val(),
				param3:$('#com_subname').val(),
				param4:$('#lineNum').val(),
				param5:currentBaobeiTemplateType
			},
			'json', true,
			function (data) {
				$('#comsubject_table').DataTable().ajax.reload();
				if (data.resultInfo.status == '0') {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
				$('#modal_comsubform').modal('hide');
			}
		]
	);
	$('#comsub_form').submit();

});

$('#com_close').click(function () {
	$('#modal_comsubform').modal('hide');
});

//自动对照
$('#autoContract').click(function () {
	$.ajax({
		url: 'cpBase/SubjectManage.autoContract.json',
		type: 'post',
		data: {
			param1: currentBaobeiTemplateTypeId,
			param2 : currentVocationId,
		},
		dataType: 'json',
		success: function (data) {
			$('#comtemplate_table').DataTable().ajax.reload();
			if (data.resultInfo.status == '0') {
				bdoSuccessBox('成功', data.resultInfo.statusText);
			} else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		}
	});
});





$('#com_template_search').click();

/*$(document).on("click", function () {
	setTimeout(function () {
		$(document).resize();
	}, 200)
})*/

//行拖动
