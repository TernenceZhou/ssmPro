$('#modal_tbsubform').on('hidden.bs.modal', function () {
	$('#modal_tbsubform button').show();
	$('#modal_tbsubform').find('input, select, textarea').removeAttr('disabled', 'disabled');
	$('#modal_tbsubform form')[0].reset();
	$('#modal_tbsubform form td').removeClass('has-error');
	$('#modal_tbsubform form .help-block').remove();
});
var ruleoption = ComboDBOption('cpBase/Combo.getCurrentRuleacc.json', false);
//$('#tbsubject_rule').html('<option></option>' + ruleoption);
$('#tbsubject_rule').on('focus', function () {
	if ($(this).attr('istree') != '1') {
		$(this).treecombo({
			url: './cpBase/TreeCommon.findRuleaccTypeTree.json',
			params: {},
			view: {
				leafIcon: 'fa fa-file text-primary',
				nodeIcon: 'fa fa-folder text-primary',
				folderSelectable: false,
				multiSelect: false
				//positionValue: 'fixed'
			}
		});
	}
});

$('#tbsub_form').formview({
	display: 'tableform-one',
	column: 4,
	buttons: [
		{
			id: 'tb_edit',
			icon: 'fa-send',
			style: 'btn-primary',
			text: '&nbsp;修改'
		}, {
			id: 'tb_save',
			icon: 'fa-save',
			style: 'btn-primary',
			text: '&nbsp;保存'
		}, {
			id: 'tb_close',
			icon: 'fa-sign-out',
			style: 'btn-warning',
			text: '&nbsp;关闭'
		}
	],
	items: [
		{
			id: 'tb_autoid',
			type: 'input',
			typeAttr: {
				type: 'hidden'
			}
		}, {
			id: 'form_tb_rule',
			type: 'select',
			label: 'TB模板',
			html: '',
			rowspan: 1
		}, {
			id: 'tb_rule',
			type: 'select',
			label: '报表模板',
			html: ruleoption
		}, {
			id: 'tb_subcode',
			type: 'input',
			label: '科目编号',
			typeAttr: {
				normal: true
			},
			rowspan: 1
		}, {
			id: 'tb_subname',
			type: 'input',
			label: '科目名称',
			validate: {
				rules: {
					required: true
				}
			},
			rowspan: 1
		},
		{
			id: 'tb_subreport',
			type: 'input',
			label: '对应报表科目',
			/*validate: {
				rules: {
					required: true
				}
			}*/
		}
	]
});

/*setFormTree();
$('#tbsubject_rule').change(function(){
	setFormTree();
});*/
//下啦书
$('#tb_subreport').on('focus', function () {
	initTreeCombo();
});

var initTreeCombo = function () {
	$('#tb_subreport').unbind();
	$('#tb_subreport').treecombo({
		url: 'cpBase/TreeCommon.findReportSubject.json',
		params: {
			param9: $('#tbsubject_rule').attr('data-result')
		},
		view: {
			leafIcon: 'fa fa-building text-flat',
			nodeIcon: 'fa fa-bank text-primary-light',
			folderSelectable: false,
			multiSelect: false
		}
	});
};

var tbsubject_view = {
	localParam: {
		tabNum: true,
		url: 'cpBase/SubjectManage.tbsubjectSearch.json',
		urlparam: {
			menuId: window.sys_menuId,
			param3: '0',
			param4: '0'
		}
	},
	tableParam: {
		lengthChange: false,
		dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
		ordering: false,
		order: [],
		//infoCallback : fnInfoCallback,
		//initComplete : fnInitComplete,
		serverSide: true,
		/*rowReorder : {
			update : false
		},*/
		select: {
			style: 'os',
			items: 'cell'
		},
		columnDefs: [
			{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '处理',
				width: '100px',
				render: function (data, type, row, meta) {
					if (!row.isSubject) {
						return '';
					}
					var renderStr = '<input type="hidden" name="tbAutoid" value="' + row.autoId + '">&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa fa-edit"></i></button>';
					return renderStr;
				}
			}, {
				targets: 2,
				className: 'text-center',
				title: '编号',
				name: 'autoId',
				data: 'autoId',
				width: '100px',
				visible: false,
				filter: {
					type: 'number'
				}
			}, {
				targets: 3,
				className: 'text-center',
				title: 'TB科目编号',
				name: 'subjectCode',
				data: 'subjectCode',
				filter: {
					type: 'string'
				},
				width: '150px'
			}, {
				targets: 4,
				className: 'text-left',
				title: 'TB科目名称',
				name: 'subjectName',
				data: 'subjectName',
				filter: {
					type: 'string'
				},
				width: '200px'
			}, {
				targets: 5,
				className: 'text-center',
				title: '报表科目编号',
				name: 'reportSubjectCode',
				data: 'reportSubjectCode',
				filter: {
					type: 'string'
				},
				width: '100px'
			}, {
				targets: 6,
				className: 'text-left',
				title: '报表科目表示名',
				name: 'reportSubName',
				data: 'reportSubName',
				filter: {
					type: 'string'
				},
				width: '200px'
			}, {
				targets: 7,
				className: 'text-left',
				title: '报表科目名称',
				name: 'reportcolName',
				data: 'reportcolName',
				filter: {
					type: 'string'
				},
				width: '200px'
			}, {
				targets: 8,
				className: 'text-left',
				title: '报表科目分类',
				name: 'subjectTypeName',
				data: 'subjectTypeName',
				filter: {
					type: 'string'
				},
				width: '200px'
			}, {
				targets: 9,
				className: 'text-left',
				title: '排序号',
				name: 't1.sortNo',
				data: 'sortNo',
				filter: {
					type: 'string'
				},
				width: '100px'
			}/*, {
			targets : 8,
			className : 'text-left',
			title : '顺序号',
			name : 'sortNo',
			data : 'sortNo',
			filter : {
				type : 'string'
			},
			width : '100px'
		}*/]
	}
};
BdoDataTable('tbsubject_table', tbsubject_view);
var report_view = {
	localParam: {
		tabNum: false,
		url: 'cpBase/General.query.json',
		urlparam: {
			sqlId: 'FA40041',
			menuId: window.sys_menuId,
			start: -1,
			limit: -1,
			param1: '0',
			param2: '0'
		}
	},
	tableParam: {
		select: true,
		// lengthChange : false,
		dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
		serverSide: true,
		//scrollY : 450px,
		dom: '<"row"<"col-sm-12"tr>>',//'<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>'
		// ordering : false,

		infoCallback: function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
			var id = $(this).attr('id'),
				data = $('#tbsubject_table').DataTable().data(),
				already = 0;
			if (data.length > 0) {
				already = data[0].already;
			}
			if (!document.getElementById(id + '_info_next')) {
				return '<div class="dataTables_info" id="' + id + '_info" role="status" aria-live="polite">' + sPre +
					' &nbsp;已对照 ：<span class="tableRefresh" id="' + id + '_info_next">' + already + '</span></div>';
			}
		},
		createdRow(row, data, dataIndex) {
			$(row).find('td:eq(3)').addClass('bg-success-light');
		},
		columnDefs: [{
			targets: 1,
			className: 'text-left',
			orderable: false,
			title: '报表科目编号',
			name: 'colCode',
			data: 'colCode',
			width: '50px'
		}, {
			targets: 2,
			className: 'text-left',
			orderable: false,
			title: '报表科目名称',
			name: 'colDisp',
			data: 'colDisp',
			width: '100px'
		}, {
			targets: 3,
			className: 'text-left',
			title: 'TB科目',
			name: 'tbSubject',
			data: 'tbSubject',
			width: '200px',
			render: function (data, type, row, meta) {
				data = data ? data : '';
				return '<span style="width:auto; display:block; white-space:nowrap;text-overflow:ellipsis; overflow:hidden" title="' + data + '">' + data + '</span>';
			}
		}, {
			targets: 4,
			className: 'text-left',
			orderable: false,
			title: '报表计算公式',
			name: 'calFun',
			data: 'calFun',
			width: '100px'
		}]
	}
};


var isSort = false;
$('#tbsubject_table').DataTable().on('row-reorder', function (e, diff, edit) {
	isSort = true;
});

//切换
$('#report_switch').on('click', function () {
	var tbTemplate = $('#tab3_tbTemplate').val();
	var reportTemplate = $('#tbsubject_rule').attr('data-result');
	if (!tbTemplate) {
		bdoErrorBox('提示', '请选择TB模板');
		return;
	}else if (!reportTemplate){
		bdoErrorBox('提示', '请选择报表模板');
		return;
	}
	var isReport = $('#report_switch').attr('isReport');
	if (isReport == '1') {
		$('#report_switch').attr('isReport', '0');
		BdoDataTable('tbsubject_table', tbsubject_view);
	} else {
		$('#report_switch').attr('isReport', '1');
		report_view.localParam.urlparam.param2 = tbsubject_view.localParam.urlparam.param3;
		report_view.localParam.urlparam.param1 = tbsubject_view.localParam.urlparam.param4;
		BdoDataTable('tbsubject_table', report_view);
	}
});

//搜索
$('#tbsubject_search').click(function () {
	var param4 = $('#tab3_tbTemplate option:selected').val();
	var param3 = $('#tbsubject_rule').attr('data-result');
	if (param4 == undefined || param4 == '') {
		bdoErrorBox('提示', '请先选择TB模板');
		return;
	}
	if (param3 == undefined || param3 == '') {
		bdoErrorBox('提示', '请重新选择TB模板和报表模板');
		return;
	}
	tbsubject_view.localParam.urlparam.param3 = param3;
	tbsubject_view.localParam.urlparam.param4 = param4;
	$('#tbsubject_table').DataTable().ajax.reload();
	//report_view.localParam.urlparam.param1 = param3;
	//report_view.localParam.urlparam.param2 = param4;
	//$('#report_table').DataTable().ajax.reload();

});

// 新增 弹窗
/*$('#tbsubject_plus').click(function() {
	$('#tb_edit').hide();
	$('#form_tb_rule').html($('#tab3_tbTemplate').html());
	$('#form_tb_rule').val($('#tab3_tbTemplate').val());
	$('#form_tb_rule').attr('disabled', 'disabled');
	$('#tb_rule').val($('#tbsubject_rule').val());
	$('#tb_rule').attr('disabled', 'disabled');
	$('#modal_tbsubform').modal('show');
});*/

// 导出 
$('#tbsubject_export').click(function () {
	var tbTemplate = $('#tab3_tbTemplate').val();
	var reportTemplate = $('#tbsubject_rule').attr('data-result');
	if (!tbTemplate) {
		bdoErrorBox('提示', '请选择TB模板');
		return;
	}else if (!reportTemplate){
		bdoErrorBox('提示', '请选择报表模板');
		return;
	}
	exportExcel(this, '部门TB科目一览', tbsubject_view, 'tbsubject_table');
});

// 导入标准报表科目
$('#tbsubject_init').click(function () {
	swal({
		title: '系统提示',
		text: '是否导入标准报表科目',
		type: 'warning',
		input: 'select',
//		inputOptions : new Promise(function(resolve){
//			var option = new Array();
//			$.each(ComboDBOption('cpBase/Combo.getRuleacc.json', false), function(info, index){
//			
//			});
//			resolve({'1':'cs1','2':'cs2'});
//		}),
//		inputValue : '2',
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		allowEscapeKey: false,
		allowOutsideClick: false
	}).then(function (value) {
		$.post('cpBase/SubjectManage.tbsubjectImport.json', {param1: value}).done(function (data) {
			tbsubject_view.localParam.urlparam = queryFilter();
			$('#tbsubject_table').DataTable().ajax.reload();
			if (data.success === true) {
				bdoSuccessBox('成功', data.resultInfo.statusText);
			} else {
				bdoErrorBox('失败', data.resultInfo.statusText);
			}
		})
	}, function (dismiss) {
	});
	$('.swal2-select').html(ComboDBOption('cpBase/Combo.getRuleacc.json', false));
	$('.swal2-select').val($('#tbsubject_rule').val());
});

// 保存排序
$('#tbsubject_sort').click(function () {
	bdoConfirmBox('提示', '是否按当前表格顺序保存', function () {
		var sortparam = [];
		$('#tbsubject_table tbody tr').each(function () {
			sortparam.push({
				autoId: $(this).find('[name="tbAutoid"]').val(),
				sortNo: $(this).index()
			});
		});
		$.ajax({
			url: 'cpBase/SubjectManage.subjectSort.json',
			type: 'post',
			data: {
				param1: JSON.stringify(sortparam)
			},
			dataType: 'json',
			success: function (data) {
				$('#tbsubject_table').DataTable().ajax.reload();
				isSort = false;
				if (data.success === true) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

// 修改
$('#tbsubject_table').on('click', 'button[name="subEdit"]', function () {
	$('#form_tb_rule').html($('#tab3_tbTemplate').html());
	$('#form_tb_rule').val($('#tab3_tbTemplate').val());
	$('#form_tb_rule').attr('disabled', 'disabled');
	$('#tb_save').hide();
	/*$('#tb_rule').html($('#tbsubject_rule').html());*/
	$('#tb_rule').val($('#tbsubject_rule').attr('data-result'));
	$('#tb_rule').attr('disabled', 'disabled');
	$('#tb_subcode').attr('disabled', 'disabled');
	$('#tb_subname').attr('disabled', 'disabled');

	var object = $('#tbsubject_table').DataTable().data()[$(this).closest('tr').index()];
	tbformSet(object);
	$('#modal_tbsubform').modal('show');
});

// 删除
$('#tbsubject_table').on('click', 'button[name="subDelete"]', function () {
	if (isSort) {
		bdoErrorBox('提示', '请保存排序或刷新画面后再删除');
		return;
	}
	var object = $('#tbsubject_table').DataTable().data()[$(this).closest('tr').index()];
	bdoConfirmBox('提示', '确认删除科目【' + object.subjectName + '】?', function () {
		$.ajax({
			url: 'cpBase/SubjectManage.subjectDelete.json',
			type: 'post',
			data: {
				param1: object.autoId
			},
			dataType: 'json',
			success: function (data) {
				$('#tbsubject_table').DataTable().ajax.reload();
				if (data.success === true) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	});
});

/** 检索条件设置 */
function queryFilter() {
	var queryFilterArr = [];
	if ($('#tbsubject_id').val() != '') {
		queryFilterArr.push({
			'field': 'a.subjectCode',
			'sqlIndex': 'a.subjectCode',
			'type': 'string',
			'value': $('#tbsubject_id').val(),
			'operate': 'eq'
		});
	}
	if ($('#tbsubject_name').val() != '') {
		queryFilterArr.push({
			'field': 'a.subjectName',
			'sqlIndex': 'a.subjectName',
			'type': 'string',
			'value': $('#tbsubject_name').val(),
			'operate': 'eq'
		});
	}
	if ($('#tbsubject_rule').attr('data-result') != '') {
		queryFilterArr.push({
			'field': 'a.vocationId',
			'sqlIndex': 'a.vocationId',
			'type': 'string',
			'value': $('#tbsubject_rule').attr('data-result'),
			'operate': 'eq'
		});
	}
	return JSON.stringify(queryFilterArr);
}

// 修改
$('#tb_edit').click(function () {
	/*$('#tbsub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.tbsubjectUpdate.json',
			{
				param1 : JSON.stringify({
					autoId : $('#tb_autoid').val(),
					subjectCode : $('#tb_subcode').val(),
					subjectName : $('#tb_subname').val(),
					subReport : $('#tb_subreport').treecombo('getTreeComboValue'),
//					subType : $('#tb_subtype').treecombo('getTreeComboValue'),
					vocationId :  $('#tbsubject_rule').val()
				}),
				param2 : 1
			},
			'json', true,
			function(data) {
				if(data.success === true){
					$('#tbsubject_table').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#modal_tbsubform').modal('hide');
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	)
	$('#tbsub_form').submit();*/
	var reportId = $('#tb_subreport').attr('data-result');
	/*if (reportId) {
		bdoErrorBox('提示', '请选择报表科目');
	}*/
	if (!$('#tb_subreport').attr('data-content')) {
		reportId = '';
	}
	$.ajax({
		url: 'cpBase/TBSubjectTemplate.updateTbsubject.json',
		data: {
			param1: $('#tb_autoid').val(),
			param2: reportId,
			param3: $('#tb_subcode').val(),
			param4: $('#tb_subname').val(),
			param5: $('#tbsubject_rule').attr('data-result'),
			param6: $('#form_tb_rule').val(),
			param7: $('#tab3_tbTemplate option:selected').val()
		},
		dataType: 'json',
		success: function (data) {
			$('#tbsubject_table').DataTable().ajax.reload();
			if (data.success === true) {
				bdoSuccessBox('成功', data.resultInfo.statusText);
			} else {
				bdoErrorBox('失败', data.resultInfo.statusText);
				return;
			}

			$('#modal_tbsubform').modal('hide');
		}
	});
});
// 新增
/*$('#tb_save').click(function(){
	
	var object = $('#tbsubject_table').DataTable().data()[$('.selected').closest('tr').index()];
	
	$('#tbsub_form').formview(
		'setAjaxConf',
		[
			'cpBase/SubjectManage.tbsubjectUpdate.json',
			{
				param1 : JSON.stringify({
					autoId : '',
					subjectCode : $('#tb_subcode').val(),
					subjectName : $('#tb_subname').val(),
					subReport : $('#tb_subreport').treecombo('getTreeComboValue'),
//					subType : $('#tb_subtype').treecombo('getTreeComboValue'),
					vocationId :  $('#tbsubject_rule').val(),
					sortNo : object.sortNo
				}),
				param2 : 2
			},
			'json', true,
			function(data) {
				if(data.success === true){
					$('#tbsubject_table').DataTable().ajax.reload();
					bdoSuccessBox('成功', data.resultInfo.statusText);
					$('#modal_tbsubform').modal('hide');
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		]
	)
	$('#tbsub_form').submit();
});
*/
$('#tb_close').click(function () {
	$('#modal_tbsubform').modal('hide');
});

function tbformSet(object) {
	$('#tb_autoid').val(object.autoId);
	$('#tb_subcode').val(object.subjectCode);
	$('#tb_subname').val(object.subjectName);
	initTreeCombo();
	$('#tb_subreport').treecombo('setTreeComboValue', [object.reportSubjectCode, object.reportcolName]);
//	$('#tb_subtype').treecombo('setTreeComboValue',[object.subjectType1, object.subjectTypeName]);
//	$('#tb_rule').val(object.vocationId);
}


/** 下载模板按钮 */
$('#import_dlTemplate').click(function () {

	var params = {
		id: '2',
		menuId: '40000045'
	};

	exportExcelWithTemplate('./cpBase/MLGBExcelExport.exportExcel.json', params);

});


/** 导入客户报表按钮 */
$('#rpt_importCustomerReport').click(function () {

	$('#tbsubject_rule_model').html(ruleoption);

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
		required: true,
		initialPreviewShowDelete: true,
		language: 'zh',
		browseOnZoneClick: true,
		showClose: false,
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
		uploadExtraData: function () {
			return {
				param1: '',
				param2: ''
			}
		}
	};

	pluginOpt.uploadExtraData = function () {
		return {
			param1: $('#tbsubject_rule_model').val()
		}
	};
	var $el = $('#fileinput').fileinput(pluginOpt);

	//uploadAsync = true 时调用
	$el.on('fileuploaded', function (event, data) {
		bdoSuccessBox('导入成功');
		$('#modal-importCustomerReport').modal('hide');
		$('#fileinput').fileinput('clear');
		$('#fileinput').fileinput('enable');
		loadData();
		//uploadFileSuccess(data);
	});
	//uploadAsync = true 时，后台返回数据data.error 非空是调用
	$el.on('fileuploaderror', function (event, data, msg) {
		bdoErrorBox('系统提示', msg);
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
	$('#import_submit').click(function () {
		var fileUrl = $("#fileinput").val();
		console.log(fileUrl);
		if (fileUrl == null || fileUrl == "") {
			bdoInfoBox('提示', '请选择导入文件');
			return;
		}


		uploadFile();

	});
});

/**
 *  check报表计算公式
 * */
function checkcalFun(str, value_) {
	if (value_ === ''){
		return  true;
	}
	var value = value_;
	var bool = true;
	var ex = function(str) {
		var exv = str.replace(/(\+|\-|\*|\/)+/g, ',');
		return exv;
	};
	var ex2 = function(str) {
		var exv = (/^(.)+-/g).exec(str);
		// 匹配到返回对象，没有匹配到返回null
		// console.log(ex);
		// 为null直接retrun 否则做处理，去掉 -
		return exv && exv[0].replace('-', '');
	};
	// str值处理
	var str1 = str;
	// 转数组
	str1 = str1.split(',');
	// 取公式编号
	// var str1_2 = [];    // 已对照的科目
	/*		str1.forEach(function(str) {
				ex2(str) && str1_2.push(ex2(str));
			});*/
	// value 值处理
	var strList = ['+', '-', '*', '/'];
	strList.find(v => {
		if (value.indexOf(v) > -1) {
			value = ex(value);
		}
	});
	var str2 = value.split(','); // 输入的科目

	// value是否含有str内的编号
	// if (str2.find(v => str1_2.indexOf(v) === -1)) {
	// 	bool = false;
	// }
	str2.forEach(v => {
		let val = v.trim();
		for (let i = 0; i < str1.length; i++) {
			if (str1[i].startsWith(val+'-')){
				bool = true;
				break;
			}else{
				bool = false;
			}
		}
		/*		if (val && ) {
					bool = false;
				}*/
	});

	// 通过str反选value是否含有str内的编号
	/*		if (str1_2.find(v => str2.indexOf(v) === -1)) {
				// bool = false
			}*/
	return bool;
}
/**
 * 双击设置 报表科目计算公式
 */
var customerAmoutMap = {'qy': {'1': {}, '2': {}}};


var reprot = {
	"param2": '',
	"param1": '',
	"param3": {}
};

$('#tbsubject_table').on('dblclick', 'td', function () {
	let isReport = $('#report_switch').attr('isReport');
	if ($(this).closest('td').index() != 3) {
		return;
	}
	if (isReport === '1') {
		// let td = $(this).closest('td');
		let $table = $(this).closest('table');
		let th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		let data = $table.DataTable().row($(this).closest('tr')).data();
		// td.html("<span><input type='text' style='width:100%; align=right;'></span>");
		$(this).html("<span><input type='text' style='width:100%; align=right;'></span>");
		let input = $(this).find('input');
		let oldVal = data[th.name];
		if (oldVal) {
			input.val(oldVal);
		}
		input.focus();
		input.on('keydown', function (e) {
			if (e.keyCode == 13) {
				console.log(e);
				input.blur();
			}
		});
		input.on('blur', function () {
			let $table = $(this).closest('table');
			let data = $table.DataTable().row($(this).closest('tr')).data();
			// let obj = {data[subjectCode]:$(this).val()};
			let value = $(this).val().trim();
			reprot.param2 = tbsubject_view.localParam.urlparam.param3;
			reprot.param1 = tbsubject_view.localParam.urlparam.param4;
			/*
			if (data.colCode in reprot.reports) {
				 reprot.reports[data.colCode] = data;
			}*/
			//
			if (value == null){
				return false;
			}
			let  funcReg = /[~!@#$%^&\\|,.<>?"'();:_=\[\]{}]/;
			if (funcReg.test(value)){
				bdoErrorBox('失败', '公式只支持四则运算');
				return;
			}
			data["calFun"] = value;
			reprot.param3[data.colCode] = data;
			for (let key in reprot.param3){
				if (reprot.param3[key]['cusCalFun'] === null){
					delete reprot.param3[key];
				}
			}
			if (typeof (data.tbSubject) == 'undefined' || data.tbSubject == null || data.tbSubject == '') {
				$(this).parent().html("");
				reprot.param3 = {};
				bdoErrorBox('失败', '当前报表科目未与TB科目对照');
				return;
			}

			data.tbSubject == null ? "" : data.tbSubject;

			if (!checkcalFun(data.tbSubject,value)) {
				bdoErrorBox('失败', '当前报表公式中报表科目未与TB科目对照');
				return false;
			}

			$(this).parent().html("<span style='color:green;'>" + value + "</span>");

			$.ajax({
				url: 'cpBase/SubjectManage.addReportFun.json',
				type: 'post',
				data: {
					param1: reprot.param1,
					param2: reprot.param2,
					param3: encodeURIComponent(JSON.stringify(reprot.param3)),
				},
				dataType: 'json',
				success: function (data) {
					//$('#tbsubject_table').DataTable().ajax.reload();
					isSort = false;
					if (data.success === true) {
						//提交成功后清空
						reprot.param3 = {};
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						reprot.param3 = {};
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});

		});
	}

});
/*$('#add_report_func').click(function () {
});*/

//全屏滚动事件
// var sctop = 0;
/*$('.block').on('mousewheel',function(e){
	//向上滚动
	if(e.deltaY == 1){
		if(sctop <= 0){
			return;
		}
		sctop-=80;
		$('.active .dataTables_scrollBody').scrollTop(sctop)
	//向下滚动
	}else if(e.deltaY == -1){
		if($('.active .dataTables_scrollBody')[1]){
			if($('.active .dataTables_scrollBody')[1].scrollHeight-500 <= sctop){
				return;
			}
		}else if($('.active .dataTables_scrollBody').scrollHeight-500 <= sctop){
			return;
		}
		sctop+=80;
		$('.active .dataTables_scrollBody').scrollTop(sctop)
	}
});*/
//重新渲染表格
/*$(document).click(function(){
	$(document).resize();
});*/
