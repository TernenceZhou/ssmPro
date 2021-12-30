pageRightTitle(pageTitleArr);
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
$('#modal_cusubform').on('hidden.bs.modal', function() {
	$('#modal_cusubform button').show();
	$('#modal_cusubform').find('input, select, textarea').removeAttr('disabled','disabled');
	$('#modal_cusubform form')[0].reset();
	$('#modal_cusubform form td').removeClass('has-error');
	$('#modal_cusubform form .help-block').remove();
});
var ruleoption = ComboDBOptionWithParam('cpBase/Combo.getRuleaccWithCustomerized.json', false,{param1:window.CUR_CUSTOMERID});
$('#cusubject_rule').html(ruleoption);
// 客户
//getUserCustomers('cusubject_cu');
$('#cusubject_cu').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);

$('#cusub_form').formview({
	display : 'tableform-one',
	column : 4,
	buttons : [
		{
			id : 'cu_edit',
			icon : 'fa-send',
			style : 'btn-primary',
			text : '&nbsp;修改'
		}, {
			id : 'cu_save',
			icon : 'fa-save',
			style : 'btn-primary',
			text : '&nbsp;保存'
		}, {
			id : 'cu_close',
			icon : 'fa-sign-out',
			style : 'btn-warning',
			text : '&nbsp;关闭'
		}
	],
	items : [
		{
			id :  'cu_autoid',
			type : 'input',
			typeAttr:{
				type : 'hidden'
			}
		},{
			id : 'cu_rule',
			type : 'select',
			label : '报表模板',
			html : ruleoption,
			validate : {
				rules : {
					required : true
				}
			},
			rowspan : 1
		},{
			id : 'cu_subcode',
			type : 'input',
			label : '底稿索引编号',
			typeAttr : {
				normal : true
			}
		},{
			id : 'cu_subname',
			type : 'input',
			label : '科目名称',
			validate : {
				rules : {
					required : true
				}
			},
			rowspan : 1
		},{
			id : 'cu_subreport',
			type : 'input',
			label : '对应报表科目',
			validate : {
				rules : {
					required : true
				}
			}
		}
//		{
//			id : 'cu_subtype',
//			type : 'input',
//			label : '科目分类',
//			plugin : {
//				name : 'treecombo',
//				options :{
//					url : 'cpBase/TreeCommon.findSubType.json',
//					params : {},
//					view : {
//						leafIcon: 'fa fa-building text-flat',    
//						nodeIcon: 'fa fa-bank text-primary-light',
//						folderSelectable: false,
//						multiSelect: false
//					}
//				}
//			},
//			validate : {
//				rules : {
//					required : true
//				}
//			}
//		}
	]
});

setFormTree();
$('#cusubject_rule').change(function(){
	setFormTree();
});
function setFormTree(){
//	$('#cu_subtype').unbind();
//	$('#cu_subtype').treecombo({
//		url : 'cpBase/TreeCommon.findSubType.json',
//		params : {},
//		view : {
//			leafIcon: 'fa fa-building text-flat',    
//			nodeIcon: 'fa fa-bank text-primary-light',
//			folderSelectable: false,
//			multiSelect: false
//		}
//	});
	$('#cu_subreport').unbind();
	$('#cu_subreport').treecombo({
		url : 'cpBase/TreeCommon.findReportSubject.json',
		params : {
			param9 : $('#cusubject_rule').val()
		},
		view : {
			leafIcon: 'fa fa-building text-flat',    
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: false,
			multiSelect: false
		}
	});
}

var cusubject_view = {
	localParam : {
		tabNum : true,
		url : 'cpBase/SubjectManage.cussubjectSearch.json',
		urlparam : {
			menuId : window.sys_menuId,
			filter : queryFilter(),
			param2 : window.CUR_CUSTOMERID
		}
	},
	tableParam : {
		lengthChange : false,
		dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
		ordering : true,
		order : [],
		serverSide : true,
//		rowReorder : {
//			update : false
//		},
//		select : false,
		columnDefs : [{
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '100px',
				render : function(data, type, row, meta) {
					var renderStr = '<input type="hidden" name="cusAutoid" value="' + row.autoId + '">&nbsp;';
					if(row.customerId != '0'){
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="cusEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="cusDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
					}
					return renderStr;
				}
			}, {
				targets : 2,
				className : 'text-center',
				title : '编号',
				name : 'autoId',
				data : 'autoId',
				width : '150px',
				visible : false
			}, {
				targets : 3,
				className : 'text-center',
				title : '底稿索引编号',
				name : 'subjectCode',
				data : 'subjectCode',
				width : '150px'
			}, {
				targets : 4,
				className : 'text-left',
				title : 'TB科目名称',
				name : 'subjectName',
				data : 'subjectName',
				width : '250px'
			}, {
				targets : 5,
				className : 'text-center',
				title : '对应报表科目编号',
				name : 'reportSubjectCode',
				data : 'reportSubjectCode',
				width : '150px',
				visible : false
			}, {
				targets : 6,
				className : 'text-left',
				title : '对应报表科目',
				name : 'reportSubName',
				data : 'reportSubName',
				width : '250px'
			}, {
				targets : 7,
				className : 'text-left',
				title : '科目分类',
				name : 'subjectTypeName',
				data : 'subjectTypeName',
				width : '250px'
			}, {
				targets : 8,
				className : 'text-left',
				title : '科目类型',
				name : 'customerId',
				data : 'customerId',
				width : '250px',
				render : function(data, type, row, meta) {
					if(row.customerId != '0'){
						return '客户TB科目';
					} else {
						return '部门标准TB科目';
					}
				}
			}]
	}
};
var isSort = false;

// 查询
$('#cusubject_search').click(function() {
	if($('#cusubject_cu').val() == ''){
		$('#cusubject_cu').focus();
		bdoErrorBox('错误', '请选择客户');
		return;
	}
	cusubject_view.localParam.urlparam.param2 = window.CUR_CUSTOMERID;
	cusubject_view.localParam.urlparam.filter = queryFilter();
	BdoDataTable('cusubject_table', cusubject_view);
	$('#cusubject_table').DataTable().on('row-reorder', function(e, diff, edit){
		isSort = true;
	});
});

// 导入部门标准科目
$('#cusubject_init').click(function() {
	swal({
		title : '系统提示',
		text : '是否导入部门标准科目',
		type: 'warning',
		input : 'select',
		showCancelButton: true,
		cancelButtonText : '取消',
		confirmButtonText : '确定',
		allowEscapeKey: false,
		allowOutsideClick: false
	}).then(function(value) {
    	$.post('cpBase/SubjectManage.cussubjectImport.json', {param1 : value,param2 : window.CUR_CUSTOMERID}).done(function (data) {
			cusubject_view.localParam.urlparam.param2 = window.CUR_CUSTOMERID;
			cusubject_view.localParam.urlparam.filter = queryFilter();
			$('#cusubject_table').DataTable().ajax.reload();
			if(data.success === true){
				bdoSuccessBox('成功', data.resultInfo.statusText);
			}else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
        })
	}, function(dismiss) {
	});
	$('.swal2-select').html(ComboDBOption('cpBase/Combo.getRuleacc.json', false));
	$('.swal2-select').val($('#cusubject_rule').val());
});

// 保存排序
$('#cusubject_sort').click(function() {
	bdoConfirmBox('提示', '是否按当前表格顺序保存', function(){
		var sortparam = [];
		$('#cusubject_table tbody tr').each(function(){
			sortparam.push({
				autoId : $(this).find('[name="cusAutoid"]').val(),
				sortNo : $(this).index()
			});
		});
		$.ajax({
			url : 'cpBase/SubjectManage.subjectSort.json',
			type : 'post',
			data : {
				param1 : JSON.stringify(sortparam)
			},
			dataType : 'json',
			success : function(data){
				$('#cusubject_table').DataTable().ajax.reload();
				isSort = false;
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 新增 
$('#cusubject_plus').click(function() {
	if($('#cusubject_cu').val() == ''){
		$('#cusubject_cu').focus();
		bdoErrorBox('错误', '请选择客户');
		return;
	}
	$('#cu_edit').hide();
	$('#cu_rule').val($('#cusubject_rule').val());
	$('#cu_rule').attr('disabled', 'disabled');
	$('#modal_cusubform').modal('show');
});

// 导出 
$('#cusubject_export').click(function() {
	exportExcel(this, '客户TB科目一览', {tableColumns:cusubject_view.tableParam.columnDefs,filterParam:cusubject_view.localParam.urlparam,sourceUrl:cusubject_view.localParam.url}, 'cusubject_table');
});

// 行按钮
// 修改
$('#cusubject_table').on('click', 'button[name="cusEdit"]', function() {
	if(isSort){
		bdoErrorBox('提示', '请保存排序或刷新画面后再修改');
		return;
	}
	$('#cu_save').hide();
	$('#cu_rule').attr('disabled', 'disabled');
	var object = $('#cusubject_table').DataTable().data()[$(this).closest('tr').index()];
	cuformSet(object);
	$('#modal_cusubform').modal('show');
});

// 删除
$('#cusubject_table').on('click', 'button[name="cusDelete"]', function() {
	if(isSort){
		bdoErrorBox('提示', '请保存排序或刷新画面后再删除');
		return;
	}
	var object = $('#cusubject_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认删除科目【' + object.subjectName + '】?', function(){
		$.ajax({
			url : 'cpBase/SubjectManage.subjectDelete.json',
			type : 'post',
			data : {
				param1 : object.autoId
			},
			dataType : 'json',
			success : function(data){
				$('#cusubject_table').DataTable().ajax.reload();
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 检索条件设置 
function queryFilter() {
	var queryFilterArr = [];
	if ($('#cusubject_id').val() != '') {
		queryFilterArr.push({
			'field' : 'a.subjectCode',
			'sqlIndex' : 'a.subjectCode',
			'type' : 'string',
			'value' : $('#cusubject_id').val(),
			'operate' : 'eq'
		});
	}
	if ($('#cusubject_name').val() != '') {
		queryFilterArr.push({
			'field' : 'a.subjectName',
			'sqlIndex' : 'a.subjectName',
			'type' : 'string',
			'value' : $('#cusubject_name').val(),
			'operate' : 'eq'
		});
	}
	if ($('#cusubject_rule').val() != '') {
		queryFilterArr.push({
			'field' : 'a.vocationId',
			'sqlIndex' : 'a.vocationId',
			'type' : 'string',
			'value' : $('#cusubject_rule').val(),
			'operate' : 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

// 修改
$('#cu_edit').click(function(){
	$('#cusub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.cussubjectUpdate.json',
			{
				param1 : JSON.stringify({
					autoId : $('#cu_autoid').val(),
					customerId : window.CUR_CUSTOMERID,
					subjectCode : $('#cu_subcode').val(),
					subjectName : $('#cu_subname').val(),
					subReport : $('#cu_subreport').treecombo('getTreeComboValue'),
//					subType : $('#cu_subtype').treecombo('getTreeComboValue'),
					vocationId :  $('#cu_rule').val()
				}),
				param2 : 1
			},
			'json', true,
			function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#modal_cusubform').modal('hide');
					$('#cusubject_table').DataTable().ajax.reload();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#cusub_form').submit();
});

// 新增
$('#cu_save').click(function(){

	var object = $('#cusubject_table').DataTable().data()[$('.selected').closest('tr').index()];
	$('#cusub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.cussubjectUpdate.json',
			{
				param1 : JSON.stringify({
					autoId : '',
					customerId : window.CUR_CUSTOMERID,
					subjectCode : $('#cu_subcode').val(),
					subjectName : $('#cu_subname').val(),
					subReport : $('#cu_subreport').treecombo('getTreeComboValue'),
//					subType : $('#cu_subtype').treecombo('getTreeComboValue'),
					vocationId :  $('#cu_rule').val(),
					sortNo : object.sortNo
				}),
				param2 : 2
			},
			'json', true,
			function(data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#modal_cusubform').modal('hide');
					$('#cusubject_table').DataTable().ajax.reload();
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	);
	$('#cusub_form').submit();
});

/** 导入客户报表按钮 */
$('#rpt_importCustomerReport').click(function() {
	
	$('#modal-importCustomerReport').modal('show');
	
});

// 关闭修改框
$('#cu_close').click(function(){
	$('#modal_cusubform').modal('hide');
});

// 修改框显示值
function cuformSet(object){
	$('#cu_autoid').val(object.autoId);
	$('#cu_subcode').val(object.subjectCode);
	$('#cu_subname').val(object.subjectName);
	$('#cu_subreport').treecombo('setTreeComboValue',[object.reportSubjectCode, object.reportSubName]);
//	$('#cu_subtype').treecombo('setTreeComboValue',[object.subjectType1, object.subjectTypeName]);
	$('#cu_rule').val(object.vocationId);
}


/** 下载模板按钮 */
$('#import_dlTemplate').click(function() {
	
	var params = {
		id : '2',
		menuId : '40000045'	
	};
	
	exportExcelWithTemplate('./cpBase/MLGBExcelExport.exportExcel.json', params);
	
});



/** 导入客户报表按钮 */
$('#rpt_importCustomerReport').click(function() {
	
	
	
	$('#modal-importCustomerReport').modal('show');

	
	
		
	var pluginOpt = {
			dropZoneEnabled: false,
			dropZoneTitle: '',
			dropZoneClickTitle: '',
			browseLabel: '选择文件',
			showCaption: true,
			showRemove: false,
			showUpload: false,
			showBrowse: true,
			showPreview: false,
			required : true,
			initialPreviewShowDelete: true,
			language: 'zh',
			browseOnZoneClick: true,
			showClose : false, 
			uploadAsync: false,
			showCancel: false,
			hideThumbnailContent: true,
			layoutTemplates: {
				actionUpload: '',
				actionZoom: ''
			},
			fileActionSettings: {
				removeIcon: '<i class="glyphicon glyphicon-remove text-danger"></i>'
			},
			uploadAsync: true,
			uploadUrl: 'cpBase/SubjectManage.importSubjectReport.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				}
			}
		};
	
	pluginOpt.uploadExtraData = function() {
		return {
		
		}
	};
	var $el = $('#fileinput').fileinput(pluginOpt);

	//uploadAsync = true 时调用
	$el.on('fileuploaded', function(event, data) {
		bdoSuccessBox('导入成功');
		$('#modal-importCustomerReport').modal('hide');
		$('#fileinput').fileinput('clear');
		$('#fileinput').fileinput('enable');
		loadData();
		//uploadFileSuccess(data);
	});
	//uploadAsync = true 时，后台返回数据data.error 非空是调用
	$el.on('fileuploaderror', function(event, data, msg) {
		bdoErrorBox('系统提示',msg);
		//uploadFileSuccess(data);
	});

	//文件上传成功/失败后，处理后台响应函数
	function uploadFileSuccess(data) {
		
	}

	//建议文件上传成功之后再提交其他表单数据
	function uploadFile() {
		$el.fileinput('upload');
	}
	
	/** 导入按钮 */
	$('#import_submit').click(function() {
		var fileUrl=$("#fileinput").val();
		alert(fileUrl);
		console.log(fileUrl);
		if(fileUrl==null || fileUrl==""){
			bdoInfoBox('提示', '请选择导入文件');
			return;
		}
		
		uploadFile();
		
	});
});