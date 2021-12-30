$(document).ready(function() {

//pageRightTitle(pageTitleArr);

	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
		e.preventDefault();
		$(this).tab('show');
	});*/
	/*$('a[data-toggle="tabs"]').on('shown.bs.tab', function (e) {
		//$(e.target).resize();
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
	$('#template_vocationId').html(ruleoption +'<option value=0>默认模板</option>');
//var template_type = ComboDBOption('cpBase/Combo.getRuleaccType.json', false);
	var template_type = ComboLocalDicOption(true,'报表模板类型');
	$('#template_type').html(template_type);



	/*$('#comtemplatecol_form').formview({
		display : 'tableform-one',
		column : 4,
		buttons : [
			{
				id : 'comtemplatecol_save',
				icon : 'fa-save',
				style : 'btn-primary',
				text : '&nbsp;保存'
			}, {
				id : 'comtemplatecol_close',
				icon : 'fa-sign-out',
				style : 'btn-warning',
				text : '&nbsp;关闭'
			}
		],
		items : [
			{
				id :  'comcol_templateId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},
			{
				id : 'col_type',
				type : 'select',
				label : '报表项类别',
				html : '<option value="1">报表科目</option><option value="2">分类合计项</option><option value="3">计算项</option>',
				validate : {
					rules : {
						required : false
					}
				},
				rowspan : 1
			},
			{
				id : 'col_subject',
				label : '科目',
				type : 'input',
				plugin : {
					name : 'treecombo',
					options :{
						url : 'cpBase/TreeCommon.findReportSubject.json',
						params : {},
						view : {
							leafIcon: 'fa fa-building text-flat',
							nodeIcon: 'fa fa-bank text-primary-light',
							folderSelectable: false,
							multiSelect: true
						}
					}
				},
				validate : {
					rules : {
						required : false
					}
				},
				rowspan : 1
			}
		]
	});*/
	var profitReferences = ComboDicOption(false,'对利润的影响');
	$('#comtemplatecolEdit_form').formview({
		display : 'tableform-one',
		column : 5,
		/*buttons : [
			{
				id : 'comtemplatecoledit_save',
				icon : 'fa-save',
				style : 'btn-primary',
				text : '&nbsp;保存'
			}, {
				id : 'comtemplatecoledit_close',
				icon : 'fa-sign-out',
				style : 'btn-warning',
				text : '&nbsp;关闭'
			}
		],*/
		items : [
			{
				id :  'comtemplatecol_id',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id : 'comtemplatecol_code',
				type : 'input',
				label : '报表项编号',
				rowspan : 1
			},{
				id : 'comtemplatecol_type',
				type : 'input',
				label : '报表项类别',
				rowspan : 1
			},{
				id : 'comtemplatecol_colName',
				type : 'input',
				label : '报表项名称',
				rowspan : 1
			},{
				id : 'comtemplatecol_dispname',
				type : 'input',
				label : '报表项表示名',
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},{
				id : 'profitReferences',
				type : 'select',
				label : '对利润的影响',
				html : profitReferences,
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			}, {
				id : 'comtemplatecol_calfun',
				type : 'input',
				label : '计算公式',
				validate : {
					rules : {
						required : false
					}
				},
				rowspan : 1
			}, {
				id : 'reportTypeSelect',
				type : 'select',
				label : '所属报表',
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			}
		]
	});


	$("#reportTypeSelect").html(ComboLocalDicOption(false, 'TABLE_DIV'));
	$("#addToTemplate_ReportTypeSelect").html(ComboLocalDicOption(false, 'TABLE_DIV'));

//模板报表项修改保存
	$('#comtemplatecoledit_save').click(function(){
		var table = getTable();
		var calfun = $('#comtemplatecol_calfun').val();
		if (calfun.search(/^[0-9]+,[0-9]+$/g) >= 0) {
			var ab = calfun.split(',');
			var i = Number(ab[0]);
			var len = Number(ab[1]);
			var obj = table.DataTable().data();
			if (i > obj.length || len > obj.length || i > len || i <= 0) {

			} else {
				i--;
				calfun = obj[i++].colCode;
				for (; i < len; i++) {
					calfun = calfun + '+' + obj[i].colCode;
				}
			}
		}
		$('#comtemplatecolEdit_form').formview(
			'setAjaxConf',
			[
				'cpBase/SubjectManage.updateTemplateCol.json',
				{
					param1 : $('#comtemplatecol_id').val(),
					param2 : $('#comtemplatecol_dispname').val(),
					param3 : encodeURIComponent(calfun),
					param4 : $("#reportTypeSelect").val(),
					param5 : $('#profitReferences').val(),
					param6 : $('#template_select').text()
				},
				'json', true,
				function(data) {
					if(data.success === true){
						reloadTable();
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modal_comtemplatecolEditform').modal('hide');
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			]
		);
		$('#comtemplatecolEdit_form').submit();
	});

	$('#comtemplatecoledit_close').click(function(){
		$('#modal_comtemplatecolEditform').modal('hide');
	});

	var inform = DicJsonlData.responseJSON['报告类型'];
	var inform_select = "<option value=''></option><option value='单体'>"+inform['单体']+"</option><option value='合并'>"+inform['合并']+"</option>";



	$('#comtemplate_form').formview({
		display : 'tableform-one',
		column : 5,
		/*buttons : [
			{
				id : 'comtemplate_save',
				icon : 'fa-save',
				style : 'btn-primary',
				text : '&nbsp;保存'
			}, {
				id : 'comtemplate_close',
				icon : 'fa-sign-out',
				style : 'btn-warning',
				text : '&nbsp;关闭'
			}
		],*/
		items : [
			{
				id :  'com_templateId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'com_oldName',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id : 'com_rulename',
				type : 'input',
				label : '报表名称',
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},{
				id : 'com_template_type',
				type : 'select',
				label : '报表类型',
				html : template_type,
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},{
				id : 'com_template_merge',
				type : 'select',
				label : '报告类型',
				html : inform_select,
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},{
				id : 'com_template_year',
				type : 'select',
				label : '年份',
				html : '',
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},{
				id : 'com_template_month',
				type : 'select',
				label : '月份',
				html : '',
				validate : {
					rules : {
						required : false
					}
				},
				rowspan : 1
			},/*{
			id : 'com_qyColumn',
			html : '<div class="form-material">' +
				'<input class="form-control" type="text" id="com_qyColumn" required="required">' +
				'<label for="com_qyColumn">所有者权益列</label>' +
				'</div>',
			rowspan : 1
		},*/{
				id : 'com_inittemplateId',
				type : 'input',
				label : '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" id="initTemplateCheck" value="1"><span></span>初始化模板',
				rowspan : 1,

				plugin : {
					name : 'treecombo',
					options :{
						url : 'cpBase/TreeCommon.findRuleaccTypeTree.json',
						params : {},
						view : {
							leafIcon: 'fa fa-building text-flat',
							nodeIcon: 'fa fa-bank text-primary-light',
							folderSelectable: true,
							multiSelect: false
						}
					}
				},
				validate : {
					rules : {
						required : false
					}
				}

			}
		]
	});

	$('#report_wind_form').formview({
		display : 'tableform-one',
		column : 5,
		buttons : [
			{
				id : 'report_reset',
				icon : 'fa-repeat',
				style : 'btn-primary',
				text : '&nbsp;重置'
			}, {
				id : 'report_save',
				icon : 'fa-save',
				style : 'btn-primary',
				text : '&nbsp;保存'
			},{
				id : 'report_close',
				icon : 'fa-sign-out',
				style : 'btn-warning',
				text : '&nbsp;关闭'
			}
		],
		items : [
			{
				id :  'report_userSubjectId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},
			{
				id :  'report_vocationId',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},
			{
				id : 'report_userSubjectCode',
				html : '<div class="form-material">' +
					'<input class="form-control" type="text" id="report_userSubjectCode" disabled="true" required="required">' +
					'<label for="report_userSubjectCode">报表项编号</label>' +
					'</div>',
				rowspan : 1
			},
			{
				id : 'report_userSubjectName',
				html :'<div class="form-material">' +
					'<input class="form-control" type="text" id="report_userSubjectName" disabled="true" required="required">' +
					'<label for="report_userSubjectName">报表项表示名</label>' +
					'</div>',
				rowspan : 1
			},
			{
				id : 'report_tbSubjectId',
				html : '<div class="form-material">' +
					'<input class="form-control" type="text" id="report_tbSubjectId" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,\'\')" placeholder="请输入英文名称" required="required">' +
					'<label for="report_tbSubjectId">万得科目</label>' +
					'</div>',
				rowspan : 1
			}
		]
	});
//getUserYear('com_template_year');
	$('#com_template_year').html(ComboLocalDicOption(true, 'year'));
//$('#com_template_month').html(ComboDicOption(true, 'month'));
	$('#com_template_month').html(ComboLocalDicOption(true, 'month'));
//新增
	$('#comtemplate_save').click(function(){
		var initFlag = 0;
		if ($('#initTemplateCheck').is(':checked')) {
			initFlag = 1;
		}

		var year = $('#com_template_year option:selected').text();
		var month = $('#com_template_month option:selected').val();
		var type = $('#com_template_type option:selected').text();
		var isMerge = $('#com_template_merge option:checked').text();
		var ruleName = $('#com_rulename').val();
		//var qyColumn = $('#com_qyColumn').val();
		//qyColumn = qyColumn.replace("，",",");
		//var name = year + (month?month:'') + type + isMerge+ruleName;
		var name = ruleName;
		$('#comtemplate_form').formview(
			'setAjaxConf',
			[
				'cpBase/SubjectManage.templateSave.json',
				{
					param1 : name,
					param2 : $('#com_inittemplateId').treecombo('getTreeComboValue'),
					param3 : initFlag,
					param4 : $('#com_templateId').val(),
					param6 : $('#com_template_type').val(),
					param7 : year,
					param8 : month,
					param9 : $('#com_oldName').val(),
					param10: $('#com_template_merge option:checked').text()
					//param11: qyColumn
				},
				'json', true,
				function(data) {
					$('#modal_comtemplateform').modal('hide');
					ruleoption = ComboDBOption('cpBase/Combo.getRuleacc.json', false);
					$('#com_inittemplateId').html(ruleoption);
					$('#com_template_search').click();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					$('#modal_comsubform').modal('hide');
				}
			]
		);
		$('#comtemplate_form').submit();
	});

	$('#comtemplate_close').click(function(){
		$('#modal_comtemplateform').modal('hide');
	});

	var initTab1Table = function() {
		var all_template_table = {
			localParam : {
				tabNum : true,
				url : 'cpBase/General.query.json',
				urlparam : {
					sqlId : 'FA10073',
					menuId : window.sys_menuId,
					start : -1,
					limit : -1,
					param1 : $("#template_active_flag").val(),
					param2 : $("#template_type").val()
				}
			},
			tableParam : {
				select : true,
				lengthChange : false,
				pageLength : 30,
				fixedThead : true,
//			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				//order : [2, 'ASC'],
				ordering : true,
				serverSide : true,
				createdRow( row, data, dataIndex ) {
					$(row).attr('data-row-id',dataIndex);
				},
				columnDefs : [
					{
						targets : 1,
						orderable : false,
						className : 'text-center',
						title : '处理',
						width : '90px',
						render : function(data, type, row, meta) {
							var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
							if (row.ACTIVE_FLAG == 1) {
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="subDetail" data-placement="top" title="查看科目" data-toggle="tooltip"><i class="fa fa-indent"></i></button>&nbsp;';
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="subAddTemplate" data-placement="top" title="添加导出模板" data-toggle="tooltip"><i class="fa fa-plus"></i></button>&nbsp;';
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subAbolish" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="subAdd" data-placement="top" title="重要性水平配置" data-toggle="tooltip"><i class="fa fa-table"></i></button>';
							} else {
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subUnAbolish" data-placement="top" title="激活" data-toggle="tooltip"><i class="fa fa-plus"></i></button>';
							}
							return renderStr;
						}
					}, {
						targets : 2,
						className : 'text-left',
						title : '报表类型',
						name : 'templateType',
						data : 'templateType',
						width : '80px'
					}, {
						targets : 3,
						className : 'text-left',
						title : '报表名称',
						name : 'ruleName',
						data : 'ruleName',
						width : '250px'
					}, {
						targets : 4,
						className : 'text-center',
						title : '最后更新时间',
						name : 'LAST_UPDATE_DATE',
						data : 'LAST_UPDATE_DATE',
						width : '80px'
					}, {
						targets : 5,
						className : 'text-left',
						title : '最后更新者',
						name : 'LAST_UPDATED_BYName',
						data : 'LAST_UPDATED_BYName',
						width : '100px'
					}]
			}
		};

		BdoDataTable('all_template_table', all_template_table);
	};
//查询模板一览
	$('#com_template_search').on('click', function() {
		initTab1Table();
	});

	var comtemplate_view = {
		localParam : {
			tabNum : true,
			url : 'cpBase/General.query.json',
			urlparam : {
				//sqlId : 'FA40026',
				menuId : window.sys_menuId
				//start : -1,
				//limit : -1,
				//param1 : '0'
			}
		},
		tableParam : {
			select : true,
			lengthChange : false,
			//pageLength : 20,
			paging:false,
			fixedThead : true,
//			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : false,
			paging:false,
			serverSide : false,
			rowReorder : {
				update : false
			},
			createdRow( row, data, dataIndex ) {
				$(row).attr('data-row-id',dataIndex);
			},
			columnDefs : [ {
				targets : 1,
				orderable : false,
				className : 'text-center',
				title : '处理',
				width : '80px',
				render : function(data, type, row, meta) {
					var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
					renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
					renderStr += '<button class="btn btn-xs btn-warning" type="button" name="subOperate" data-placement="top" title="对照" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';

					/*if ($.sessionStorage('qyColumn') != null && $.sessionStorage('qyColumn') != "" && (row.TABLE_DIV == 5 || row.TABLE_DIV == 11)){
						renderStr += '<button class="btn btn-xs btn-primary" type="button" name="qyOperate" id="qyOperate" data-placement="top" title="添加所有者权益显示列" data-toggle="tooltip"><i class="fa fa-edit"></i></button>'
					}*/

					return renderStr;
				}
			}, {
				targets : 2,
				className : 'text-left',
				title : '报表项编号',
				name : 'colCode',
				data : 'colCode',
				width : '80px'
			}, {
				targets : 3,
				className : 'text-left',
				title : '报表项表示名',
				name : 'colDisp',
				data : 'colDisp',
				width : '300px',
				render: function(data, type, row, meta){
					if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0){
						return '<b>' + data + '</b>';
					}else{
						return data.replace(/ /g,'&nbsp;');
					}
				}
			}, {
				targets : 4,
				className : 'text-center',
				title : '类别',
				name : 'subjectTypeName',
				data : 'subjectTypeName',
				width : '80px'
			}, {
				targets : 5,
				className : 'text-left',
				title : '计算公式',
				name : 'calFun',
				data : 'calFun',
				width : '150px',
				render: function(data, type, row, meta){
					data = data ? data : '';
					return '<span name="cal_fun" style="width:280px; display:block; white-space:nowrap;text-overflow:ellipsis; overflow:hidden" title="' + data + '">' + data + '</span>';
				}
			},{
				targets : 6,
				className : 'text-center',
				title : '对利润的影响',
				name : 'profitReferences',
				data : 'profitReferences',
				width : '80px',
				render: function(data, type, row, meta){
					if(data != null){
						if (data == 1){
							data = data.replace("1","+");
						}else {
							data = data.replace("-1","-");
						}
					}
					return data;
				}
			},/*{
				targets : 7,
				className : 'text-center',
				title : '所有者权益列',
				name : 'qyReportColumn',
				data : 'qyReportColumn',
				width : '80px',
				render: function(data, type, row, meta){
					if (data) {
						if (data.length > 20) {
							return data.substr(0, 50) + '...';
						}else{
							return data;
						}
					}
				}
			},*/{
				targets : 7,
				className : 'text-center',
				title : '所属报表',
				name : 'tableName',
				data : 'tableName',
				width : '80px'
			},{
				targets : 8,
				className : 'text-center',
				title : '万得科目',
				name : 'columnName',
				data : 'columnName',
				width : '200px',
				render: function(data, type, row, meta){
					if(data !==null)
						data = data.replace(/(^\,*)|(\,*$)/g, "");
					return  data;
				}
			}, {
				targets : 9,
				className : 'text-center',
				title : '报表序号',
				name : 'sortNo',
				data : 'sortNo',
				width : '50px'
			}]
		}
	};

//查看模板详情
	$('#all_template_table').on('click', 'button[name="subDetail"]', function() {
		var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
		let table_div;
		if(object.ruleName.indexOf('合并') >=0){
			table_div = "7,9,10,11,12";
		}else {
			table_div = "1,3,4,5,6";
		}
		//getReportColumn(object.autoId);
		$.ajax({
			url : 'cpBase/SubjectManage.searchReport.json',
			type : 'post',
			data : {
				param1 : object.autoId,
				param2 : table_div
			},
			dataType : 'json',
			success : function(data){
				if(data.success){
					var text = data.resultInfo.statusText;
					var data = data.data[0];
					var zc = $.extend(true, {}, comtemplate_view);
					var lr = $.extend(true, {}, comtemplate_view);
					var xj = $.extend(true, {}, comtemplate_view);
					var qy = $.extend(true, {}, comtemplate_view);
					var qy1 = $.extend(true, {}, comtemplate_view);
					zc.localParam.data = data.zc;
					lr.localParam.data = data.lr;
					xj.localParam.data = data.xj;
					qy.localParam.data = data.qy;
					qy1.localParam.data = data.qy1;
					BdoDataTable('zc_report_table', zc);
					BdoDataTable('lr_report_table', lr);
					BdoDataTable('xj_report_table', xj);
					BdoDataTable('qy_report_table', qy);
					BdoDataTable('qy1_report_table', qy1);
					//bdoSuccessBox('成功', text);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		$('#template_select').text('【' + object.ruleName + '】');
		$('#template_select').attr('data-result', object.autoId);
		//$('a[href="#tab_template"]').click();
		$('#tab_template').addClass('active');
		$('a[href="#tab_template"]').parent().addClass('active');
		$('#tab_template_browse').removeClass('active');
		$('a[href="#tab_template_browse"]').parent().removeClass('active');
		$('a[href="#tab_template"]').css('display', 'block');
		return false;
	});

//获取报表模板显示列
	/*function getReportColumn(obj){
		$.ajax({
			url : 'cpBase/SubjectManage.getReportColumn.json',
			type : 'post',
			data : {
				param1 : obj,
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					$.sessionStorage('qyColumn',data.data[0].qyColumn);
					if (data.data[0].qyColumn != null && data.data[0].qyColumn != ""){
						var data = data.data[0].qyColumn.split(',');
						let html = '<table class="table table-bordered">' +
							'<tbody>' ;
						$.each(data,function (index,item) {
							html += '<tr>' +
								'<td><label for="report_column'+index+'" id="report_name'+index+'">'+item+'</label><input class="form-control" type="text" id="report_column'+index+'" name="report_column" required="required"></td>' +
								'<td width="92"><label>是否是单科目</label><select id="report_column_type'+index+'" class="form-control valid" onchange="reportchange()"><option value="1" selected="selected">是</option><option value="2">否</option></select></td>' +
								'<td><label>计算公式</label><input class="form-control" type="text" id="report_column_calfun'+index+'" name="report_column_calfun" required="required"></td>' +
								'<td><label>是否来源于试算平衡表</label><select id="report_tb'+index+'" class="form-control valid"><option value="0">是</option><option value="1" selected="selected">否</option></select></td>' +
								'<td><label>是否来源于未审报表</label><select id="report_unReport'+index+'" class="form-control valid"><option value="0">是</option><option value="1" selected="selected">否</option></select></td>' +
								'<td><label>是否来源于TB科目对照表</label><select id="report_tbcontract'+index+'" class="form-control valid"><option value="0">是</option><option value="1" selected="selected">否</option></select></td>' +
								'</tr>'
						})
						html +=
							'<tr style="display: none"><td><input type="hidden" id="qy_vocationId" name="qy_vocationId" value=""><input type="hidden" id="qy_userSubjectId" name="qy_userSubjectId" value=""></td></tr></tbody>' +
							'</table>';
						$('#report_qyColumn_form').html(html);
					}

				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
	}*/

	function reportchange(){
		for (let i = 0; i < $('input[name="report_column"]').length; i++) {
			if ($('#report_column_type'+[i]).val() == 1){
				$('#report_column_calfun'+[i]).val('');
				$('#report_column_calfun'+[i]).attr('disabled',true);
			} else {
				$('#report_column_calfun'+[i]).attr('disabled',false);
			}
		}

	}

//切换报表显示
	/*$('#report_type').on('click', 'li a', function() {
		var type = $(this).parent().attr('data-result');
		if (type == '0') {
			delete comtemplate_view.localParam.urlparam['param3'];
			comtemplate_view.localParam.urlparam.param2 = type;
			comtemplate_view.tableParam.rowReorder = {update : false};
		} else {
			delete comtemplate_view.localParam.urlparam['param2'];
			comtemplate_view.localParam.urlparam.param3 = type;
			delete comtemplate_view.tableParam['rowReorder'];
		}
		BdoDataTable('comtemplate_table', comtemplate_view);
	});*/

//修改模板
	$('#all_template_table').on('click', 'button[name="subEdit"]', function() {
		$('#modal_comtemplateform h3').html('修改模板');
		var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
		$('#com_rulename').val(object.ruleName);
		$('#com_templateId').val(object.autoId);
		$('#com_template_year').val(object.year);
		let month = object.month;
		$('#com_template_month').val(month < 10 ? '0' + month : '' + month);
		$('#com_template_type').val(object.templateType);
		$('#com_qyColumn').val(object.qyColumn);

		//let merge = object.ruleName.indexOf('单体')>0 ? '单体':'合并'
		let merge = object.reportType;
		$('#com_template_merge').val(merge);
		//$('#com_template_merge').val(object.ruleName.substring(object.ruleName.length - 2, object.ruleName.length));
		$('#com_oldName').val(object.ruleName);
		$('#com_inittemplateId').val('');
		$('#com_inittemplateId').attr('data-content','');
		$('#com_inittemplateId').attr('data-contentdata','');
		$('#modal_comtemplateform').modal('show');
	});
//关闭页签
	$('a[href="#tab_template"] .fa-times-circle').on('click', function(){
		$('#tab_template').parent().find('.active').removeClass('active');
		$('a[href="#tab_template"]').parent().parent().find('.active').removeClass('active');
		$('#tab_template_browse').addClass('active');
		$('a[href="#tab_template_browse"]').parent().addClass('active');
		$('#tab_template').removeClass('active');
		$('a[href="#tab_template"]').parent().removeClass('active');
		$('a[href="#tab_template"]').css('display', 'none');
		//$(document).resize();
		return false;
	});

//删除模板
	$('#all_template_table').on('click', 'button[name="subAbolish"]', function() {
		var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('提示', '确认删除' + object.ruleName + '吗?', function(){
			$.ajax({
				url : 'cpBase/SubjectManage.abolishTemplate.json',
				type : 'post',
				data : {
					param1 : object.autoId,
					param2 : object.ruleName
				},
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#all_template_table').DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}

				}
			});
		});
	});
//激活模板
	$('#all_template_table').on('click', 'button[name="subUnAbolish"]', function() {
		var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('提示', '确认激活' + object.ruleName + '吗?', function(){
			$.ajax({
				url : 'cpBase/SubjectManage.unAbolishTemplate.json',
				type : 'post',
				data : {
					param1 : object.autoId
				},
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						$('#all_template_table').DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
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

//新增报表模板
	$('#com_template_add').click(function() {
		$('#com_template_type').val('');
		$('#com_template_merge').val('');
		$('#com_template_year').val('');
		$('#com_template_month').val('');
		$('#com_templateId').val('');
		$('#com_inittemplateId').val('');
		$('#com_rulename').val('');
		$('#initTemplateCheck').prop('checked', false);
		$('#modal_comtemplateform').modal('show');
	});

//添加报表项
	$('#comtemplatecol_add').click(function() {
		$('#modal_comtemplatecolform').modal('show');
	});

//保存排序
	$('#comtemplate_savesort').click(function() {
		var data = '';
		var table = getTable();
		table.find('tbody tr').each(function(){
			$(this).find('[name="tempAutoId"]').val();
			if (data == ''){
				data = $(this).find('[name="tempAutoId"]').val();

			}else{
				data = data + ',' + $(this).find('[name="tempAutoId"]').val();
			}
		});

		if (data == ''){
			return;
		}
		$.ajax({
			url : 'cpBase/SubjectManage.saveSort.json',
			type : 'post',
			data : {
				param1 : data,
				param2 : table.closest('.active').attr('data-result'),
				param6 : $('#template_select').text()
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					reloadTable();
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}

			}
		});
	});

//修改模板报表项
	$('#four_report').on('click', 'button[name="subEdit"]', function() {

		$('#comtemplatecol_id, #comtemplatecol_code,#comtemplatecol_type,#comtemplatecol_colName').attr('disabled', 'disabled');

		//var object = $(this).closest('table').DataTable().data()[$(this).closest('tr').index()];
		var object = $(this).closest('table').DataTable().data()[$(this).parent().parent().attr('data-row-id')];
		$('#profitReferences').val(object.profitReferences);
		$('#comtemplatecol_id').val(object.autoId);
		$('#comtemplatecol_code').val(object.colCode);
		$('#comtemplatecol_dispname').val(object.colDisp);
		$('#comtemplatecol_colName').val(object.colName);
		$('#comtemplatecol_type').val(object.subjectTypeName);
		$('#comtemplatecol_calfun').val(object.calFun);
		$('#reportTypeSelect').val(object.tableDiv);
		$('#modal_comtemplatecolEditform').modal('show');
	});

//删除模板报表项
	$('#four_report').on('click', 'button[name="subDelete"]', function() {
		bdoConfirmBox('提示','确认删除该报表模板当前报表项吗？',isConfirm =>{
			var object = $(this).closest('table').DataTable().data()[$(this).closest('tr').index()];
			var tr = $(this).closest('tr');
			$.ajax({
				url : 'cpBase/SubjectManage.removeTemplateCol.json',
				type : 'post',
				data : {
					param1 : object.autoId,
					param2 : object.colName,
					param6 : $('#template_select').text()
				},
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						var opa = 1;
						//tr.css('background-color', 'green');
						var color = function(){
							tr.css('opacity', opa);
							if (opa < 0.3) {
								var table = getTable();
								var height = table.parent().scrollTop();
								table.DataTable().row(tr).remove().draw();
								table.parent().scrollTop(height);

							} else {
								opa = opa - 0.1;
								setTimeout(color, 100);
							}
						};
						setTimeout(color, 100);
						//bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		})


	});


//对照模板报表项
	$('#four_report').on('click', 'button[name="subOperate"]',function () {
		var object = $(this).closest('table').DataTable().data()[$(this).parent().parent().attr('data-row-id')];
		$('#report_userSubjectId').val(object.autoId);
		$('#report_userSubjectCode').val(object.colCode);
		$('#report_userSubjectName').val(object.colDisp);
		$('#report_tbSubjectId').val(object.columnName == null ? object.columnName : object.columnName.replace(/(^\,*)|(\,*$)/g, ""));
		$('#report_vocationId').val(object.vocationId);
		$('#report_modal_setRelation').modal('show');
	});

//添加所有者权益显示列
	/*$('#four_report').on('click', 'button[name="qyOperate"]',function () {
		var object = $(this).closest('table').DataTable().data()[$(this).parent().parent().attr('data-row-id')];
		$('#qy_vocationId').val(object.vocationId);
		$('#qy_userSubjectId').val(object.autoId);
		var qyReportColumn = object.qyReportColumn;

		//展现列
		if (null != qyReportColumn && qyReportColumn != ""){

			for (let i = 0; i < $('input[name="report_column"]').length; i++) {
				let report_name = $('#report_name'+[i]).text();
				qyReportColumn = eval(qyReportColumn);
				qyReportColumn.map(function(item){
					if (report_name == item.colName){
						$('#'+$('input[name="report_column"]')[i].id).val(item.colCode);
						$('#report_column_type'+[i]).val(item.type);
						if (item.type == 1){
							$('#report_column_calfun'+[i]).attr('disabled',true);
						}else {
							$('#report_column_calfun'+[i]).attr('disabled',false);
						}
						$('#report_column_calfun'+[i]).val(item.calfun);
						$('#report_tb'+[i]).val(item.tb);
						$('#report_unReport'+[i]).val(item.unreport);
						$('#report_tbcontract'+[i]).val(item.tbcontract);
					}
				})
			}
		}else {
			for (let i = 0; i < $('input[name="report_column"]').length; i++) {
				if ($('#report_column_type'+[i]).val() == 1){
					$('#report_column_calfun'+[i]).val('');
					$('#report_column_calfun'+[i]).attr('disabled',true);
				} else {
					$('#report_column_calfun'+[i]).attr('disabled',false);
				}
			}
		}

		$('#report_setQYColumn_modal').modal('show')
	})*/


//删除左右两端的空格
	function trim(str){
		return str.replace(/\s/g,"");
	}

	/*$('#qyColumn_close').click(function () {
		$('#report_qyColumn_form')[0].reset();
	})

	$('#qyColumn_save').click(function () {
		let arr = [];
		let column = $('input[name="report_column"]');
		let value='';
		let report_name = '';
		for (let i = 0; i < column.length; i++) {
			report_name = $('#report_name'+[i]).text();
			value = trim($('#'+column[i].id).val());
			let json = {};
			json["colName"] = report_name;
			json["colCode"] = value;
			json["tb"] = $('#report_tb'+[i]).val();
			json["unreport"] = $('#report_unReport'+[i]).val();
			json["tbcontract"] = $('#report_tbcontract'+[i]).val();
			json["type"] = $('#report_column_type'+[i]).val();
			json["sortNo"] = i;
			json["calfun"] =$('#report_column_calfun'+[i]).val();
			arr.push(json)
		}

		let qy_vocationId = $('#qy_vocationId').val();
		let qy_autoId = $('#qy_userSubjectId').val();


		$.ajax({
			url : 'cpBase/SubjectManage.saveQYColumn.json',
			type : 'post',
			data : {
				param1 : qy_vocationId,
				param2 : qy_autoId,
				param3 : JSON.stringify(arr)
			},
			dataType : 'json',
			success : function (data) {
				if (data.success == true){
					$('#report_setQYColumn_modal').modal('hide');
					reloadTable();
					$('#report_qyColumn_form')[0].reset();
					bdoSuccessBox('提示','保存所有者权益列成功!');
				} else {
					bdoErrorBox('提示','保存所有者权益列失败!')
				}
			}
		})

	})*/

	$('#report_close').click(function () {
		$('#report_modal_setRelation').modal('hide');
	});
//万得科目树
	/*$('#report_tbSubjectId').focus(function () {
		if (!$('#report_tbSubjectId').attr('isTree')) {
			$('#report_tbSubjectId').treecombo({
				url : 'dgCenter/DgAdjustTree.findWindSubjectType.json',
				params : {
				},
				view : {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: true,
					multiSelect: false
				}
			})
		}
		$('#report_tbSubjectId').treecombo('setTreeComboValue',[]);
	})*/
//保存万得对照
	$('#report_save').click(function () {
		let columnName = $('#report_tbSubjectId').val();
		columnName = trim(columnName);
		columnName = columnName.replace("，",",");
		$('#report_wind_form').formview(
			'setAjaxConf',
			[
				'cpBase/SubjectManage.saveWindSubjectType.json',
				{
					param1 : $('#report_userSubjectId').val(),
					param2 : $('#report_userSubjectCode').val(),
					param3 : $('#report_userSubjectName').val(),
					param4 : columnName,
					param5 : $('#report_vocationId').val(),
					param6 : $('#template_select').text()
				},
				'json', true,
				function(data) {
					if(data.success === true){
						bdoSuccessBox('保存对照成功', data.resultInfo.statusText);
						reloadTable();
						$('#report_modal_setRelation').modal('hide');

					}else {
						bdoErrorBox('保存对照失败', data.resultInfo.statusText);
					}
				}
			]
		);
		$('#report_wind_form').submit();
	});

//重置万得对照
	$('#report_reset').click(function () {
		$('#report_tbSubjectId').val("");
		$.ajax({
			url : 'cpBase/SubjectManage.resetWindSubjectType.json',
			type : 'post',
			data : {
				param1 : $('#report_userSubjectCode').val(),
				param2 : $('#report_userSubjectName').val(),
				param3 : $('#report_tbSubjectId').val(),
				param4 : $('#report_vocationId').val()
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					bdoSuccessBox('清除对照成功', data.resultInfo.statusText);
					//$('#report_tbSubjectId').treecombo('setTreeComboValue',[]);
					reloadTable();
					$('#report_modal_setRelation').modal('hide');

				}else {
					bdoErrorBox('清除对照失败', data.resultInfo.statusText);
				}
			}
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
				label : '报表科目编号',
				validate : {
					rules : {

					}
				}
			},{
				id : 'com_subname',
				type : 'input',
				label : '报表科目名称',
				validate : {
					rules : {
						required : true
					}
				}
			},, {
				id : 'com_subject_merge',
				type : 'select',
				label : '报告类型',
				html : inform_select,
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			},{
				id : 'com_subtype',
				type : 'input',
				label : '报表科目分类',

				plugin : {
					name : 'treecombo',
					options :{
						url : 'cpBase/TreeCommon.findSubType.json',
						params : {},
						view : {
							leafIcon: 'fa fa-building text-flat',
							nodeIcon: 'fa fa-bank text-primary-light',
							folderSelectable: true,
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
				id : 'com_parentId',
				type : 'select',
				label : '上级科目',
				rowspan : 1

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
			}
			,{
				id : 'com_isShow',
				type : 'select',
				label : '是否在树中展示',
				html : '<option value="0">否</option><option value="1">是</option>',
				validate : {
					rules : {
						required : true
					}
				},
				rowspan : 1
			}
		]
	});

	$('#temp').formview({
		display : 'tableform-one',
		column : 4,
		items : [
			{
				id : 'com_subtype11',
				type : 'input',
				label : '报表科目分类',
				rowspan : 1,

				plugin : {
					name : 'treecombo',
					options :{
						url : 'cpBase/TreeCommon.findRuleaccTypeTree.json',
						params : {},
						view : {
							leafIcon: 'fa fa-building text-flat',
							nodeIcon: 'fa fa-bank text-primary-light',
							folderSelectable: true,
							multiSelect: false
						},
						nodeSelectedCallback(tree,data){
//						初始化报表类型下拉选
							$("#addToTemplate_ReportTypeSelect").html(ComboLocalDicOption(false, 'TABLE_DIV'));
//						获取选中模板名称
							subName =  data.content;
							if(subName !== ''){
//							如果是合并模板
								if(subName.indexOf('合并')>0){
									$('#addToTemplate_ReportTypeSelect option').each(function(i,obj){
//									删除单体的 报表类型
										if(obj.text.indexOf("合并")<0){
											$('#addToTemplate_ReportTypeSelect option[value='+obj.value+']').remove();
										}
									});
								}else{
									$('#addToTemplate_ReportTypeSelect option').each(function(i,obj){
										if(obj.text.indexOf("合并")>=0){
											$('#addToTemplate_ReportTypeSelect option[value='+obj.value+']').remove();
										}
									});
								}
							}
						}
					}
				},
				validate : {
					rules : {
						required : true
					}
				}

			}
		]
	});


	var comsubject_view = {
		localParam : {
			tabNum : true,
			//url : 'dgCenter/SubjectManage.getSubjectCom.json',
			url : 'cpBase/General.query.json',
			urlparam : {
				menuId : window.sys_menuId,
				sqlId : 'FA40028',
//			start : -1,
//			limit : -1,
				filter : queryFilter()
			}
		},
		tableParam : {
			select : true,
			lengthChange : false,
			pageLength : 30,
			fixedThead : true,
//		dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
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
						if(row.ACTIVE_FLAG == '1'){
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subBan" data-placement="top" title="作废" data-toggle="tooltip"><i class="fa fa-ban"></i></button>';
						} else {
							renderStr += '<button class="btn btn-xs btn-primary" type="button" name="subBan" data-placement="top" title="取消作废" data-toggle="tooltip"><i class="fa fa-ban"></i></button>';
						}
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets : 3,
					className : 'text-left',
					title : '报表科目编号',
					name : 'subjectId',
					data : 'subjectId',
					width : '50px'
				}, {
					targets : 4,
					className : 'text-left',
					title : '报表科目名称',
					name : 'subjectName',
					data : 'subjectName',
					width : '250px'
				}, {
					targets : 5,
					className : 'text-center',
					title : '报表科目分类',
					name : 'subjectTypeName1',
					data : 'subjectTypeName1',
					width : '50px'
				}, {
					targets : 6,
					className : 'text-center',
					title : '方向',
					name : 'direction',
					data : 'direction',
					width : '30px',
					render: function(data, type, row, meta){
						if (data==1){
							return '借';
						} else if (data== -1){
							return '贷';
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
		$('#com_subname').val('');
		$('#com_subject_merge').val('');
		$('#com_subtype').val('');
		$('#com_subtype').attr('data-content','');
		$('#com_subtype').attr('data-contentdata','');
		$('#com_parentId').text('');
		$('#com_parentId').val('');
		$('#com_subid').attr('disabled', 'disabled');
		$('#com_edit').hide();
		$('#modal_comsubform').modal('show');
	});

	var sys_subtype="";

	$('#com_parentId').focus(function(){
		if($('#com_subtype').treecombo('getTreeComboValue') === ""){
			return;
		}
		if ($('#com_subject_merge option:checked').text() === ""){
			return false;
		}

		let sub_type;
		if ("合并" === $('#com_subject_merge option:checked').text()) {
			sub_type = "HB_"+$('#com_subtype').treecombo('getTreeComboValue');
		}else {
			sub_type = $('#com_subtype').treecombo('getTreeComboValue');
		}
		//sys_subtype=$('#com_subtype').treecombo('getTreeComboValue');
		var params2 = {
			'sqlId' : 'FA30031',
			'menuId' : window.sys_menuId,
			'param1' : sub_type
		};
		$('#com_parentId').html(ComboDBOptionWithParam('cpBase/General.query.json', false,params2));
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

		$('#seltemplate_templateId').html(ruleoption +'<option value=0>默认模板</option>');
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
				param2 : $('#com_subtype11').treecombo('getTreeComboValue'),
				param3 : $('#addToTemplate_ReportTypeSelect').val(),
				param4 : $('#com_subtype11').attr('data-content')
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
		exportExcel(this, '标准报表科目一览', comsubject_view, 'comsubject_table');
	});

// 导出
	$('#comComplete_export').click(function() {
		var autoId = $('#template_select').attr('data-result');
		var view = $.extend(true, {}, comtemplate_view);
		view.localParam = {
			tabNum : true,
			url : 'cpBase/General.query.json',
			urlparam : {
				sqlId : 'FA40026',
				menuId : window.sys_menuId,
				start : -1,
				limit : -1,
				param1 : $('#template_select').attr('data-result'),
				param3 : $('#four_report').find('.active.in').attr('data-result')
			}
		};
//	设置参数与url
		var zc = $.extend(true, {}, comtemplate_view);
		zc.localParam.urlparam.autoId=autoId;
		zc.localParam.urlparam.url='cpBase/SubjectManage.searchReport.json';
		exportExcel2(this, $('#template_select').text() + '模板(' + $('#report_type').find('li[class=active]').text() + ')科目一览', zc, getTable().attr('id'));
	});

// 标准科目对照
	/*$('#comsubject_exchange').click(function() {
		bdoAjaxBox('系统提示', '是否对照科目', function () {
			$.post('dgCenter/SubjectManage.subjectcomExchange.json', '').done(function (data) {
				if(data.success === true){
					bdoSuccessBox('成功', data.resultInfo.statusText);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			})
		});
	});*/

// 禁用/激活
	$('#comsubject_table').on('click', 'button[name="subBan"]', function() {
		var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('提示', '确认' + $(this).attr('title') + '科目【' + object.subjectId + '-' + object.subjectName + '】?', function(){
			$.ajax({
				url : 'cpBase/SubjectManage.subjectcomBan.json',
				type : 'post',
				data : {
					param1 : object.autoId,
					param2 : 0,
					param3 : object.subjectName
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
		$('#com_subject_merge').attr("disabled",true);
		var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
		comformSet(object);

		$('#modal_comsubform').modal('show');
	});

// 删除
	$('#comsubject_table').on('click', 'button[name="subDelete"]', function() {
		var object = $('#comsubject_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('提示', '确认删除科目【' + object.subjectId + '-' + object.subjectName + '】?', function(){
			$.ajax({
				url : 'cpBase/SubjectManage.subjectcomDelete.json',
				type : 'post',
				data : {
					param1 : object.autoId,
					param2 : object.subjectName
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
				'field' : 'colCode',
				'sqlIndex' : 'colCode',
				'type' : 'string',
				'value' : $('#comsubject_id').val(),
				'operate' : 'eq'
			});
		}
		if ($('#comsubject_name').val() != '') {
			queryFilterArr.push({
				'field' : 'colName',
				'sqlIndex' : 'colName',
				'type' : 'string',
				'value' : $('#comsubject_namme').val(),
				'operate' : 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	}

// 修改保存
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
						customerId : 0,
						isShow : $('#com_isShow').val(),
						reportType:$('#com_subject_merge option:selected').text()
					}),
					param2 : 1
				},
				'json', true,
				function(data) {
					//$('#comsubject_table').DataTable().ajax.reload();
					$('#comsubject_table').DataTable().draw(false);
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
		var isMerge = $('#com_subject_merge option:selected').text();
		$('#comsub_form').formview(
			'setAjaxConf',
			[
				'cpBase/SubjectManage.subjectcomUpdate.json',
				{
					param1 : JSON.stringify({
						autoId : '',
						subjectId : "",
						subjectName : $('#com_subname').val(),
						subjectType : $('#com_subtype').treecombo('getTreeComboValue'),
						direction : $('#com_direction').val(),
						com_parentId : $('#com_parentId').val(),
						customerId : 0,
						isShow : $('#com_isShow').val(),
						reportType:isMerge
					}),
					param2 : 2
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

	$('#com_close').click(function(){
		$('#modal_comsubform').modal('hide');
	});

	function comformSet(object){
		$('#com_autoid').val(object.autoId);
		$('#com_subid').val(object.subjectId);
		$('#com_subname').val(object.subjectName);
		let html;
		if (object.parentId == null || object.parentId == '' || object.parentId == 'undefined'){
			html = "<option value='' selected='selected'></option> ";
			$('#com_parentId').html(html);
		}else {
			var params2 = {
				'sqlId' : 'FA30050',
				'menuId' : window.sys_menuId,
				'param1' : object.parentId
			};
			$('#com_parentId').html(ComboDBOptionWithParam('cpBase/General.query.json', false,params2));
		}


		$('#com_subtype').treecombo('setTreeComboValue',[object.subjectType1, object.subjectTypeName1]);
		$('#com_isShow').val(object.isShow);
		/*let sub_type;
		if ("合并" === $('#com_template_merge option:checked').text()) {
			sub_type = "HB_"+$('#com_subtype').treecombo('getTreeComboValue');
		}else {
			sub_type = $('#com_subtype').treecombo('getTreeComboValue');
		}
		var params2 = {
				'sqlId' : 'FA30031',
				'menuId' : window.sys_menuId,
				'param1' : sub_type
			};
		$('#com_parentId').html(ComboDBOptionWithParam('cpBase/General.query.json', false,params2));*/
		if ($("#com_subid").val().indexOf('_')>0){
			$("#com_subject_merge").val("合并")
		}else {
			$("#com_subject_merge").val("单体")
		}

	}

	/** 标准科目分类维护 */
	$('#modal_comsubtypeform').on('hidden.bs.modal', function() {
		$('#modal_comsubtypeform button').show();
		$('#modal_comsubtypeform').find('input, select, textarea').removeAttr('disabled','disabled');
		$('#modal_comsubtypeform form')[0].reset();
		$('#modal_comsubtypeform form td').removeClass('has-error');
		$('#modal_comsubtypeform form .help-block').remove();
	});
	$('#comsubtype_form').formview({
		display : 'tableform-one',
		column : 4,
		buttons : [
			{
				id : 'comtype_edit',
				icon : 'fa-send',
				style : 'btn-primary',
				text : '&nbsp;修改'
			}, {
				id : 'comtype_save',
				icon : 'fa-save',
				style : 'btn-primary',
				text : '&nbsp;保存'
			}, {
				id : 'comtype_close',
				icon : 'fa-sign-out',
				style : 'btn-warning',
				text : '&nbsp;关闭'
			}
		],
		items : [
			{
				id :  'comtype_autoid',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id :  'comtype_typeid',
				type : 'input',
				typeAttr:{
					type : 'hidden'
				}
			},{
				id : 'comtype_id',
				type : 'input',
				label : '分类编号',
				typeAttr : {
					placeholder: '自动生成'
				}
			},{
				id : 'comtype_name',
				type : 'input',
				label : '分类名称',
				validate : {
					rules : {
						required : true
					}
				}
			},{
				id : 'comtype_type',
				type : 'select',
				label : '分类级别',
				rowspan : 1,
				html : '<option></option><option value="1">科目一级分类</option><option value="2">科目二级分类</option>',
				validate : {
					rules : {
						required : true
					}
				}
			}
		]
	});

	var subjecttype_view = {
		localParam : {
			tabNum : true,
			url : 'cpBase/General.query.json',
			urlparam : {
				menuId : window.sys_menuId,
				sqlId : 'FA10030'
			}
		},
		tableParam : {

			select : true,
			lengthChange : false,
			pageLength : 30,
			fixedThead : true,
//		dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order : [2, 'ASC'],
			ordering : true,
			serverSide : true,
			columnDefs : [
				{
					targets : 1,
					orderable : false,
					className : 'text-center',
					title : '处理',
					width : '100px',
					render : function(data, type, row, meta) {
						var renderStr = '';
						if(row.subjectType == '1'){
							renderStr += '<button class="btn btn-xs btn-primary" type="button" name="typeAdd" data-placement="top" title="新增科目二级分类" data-toggle="tooltip"><i class="fa fa-plus"></i></button>&nbsp;';
						}
						renderStr += '<button class="btn btn-xs btn-warning" type="button" name="typeEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="typeDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets : 2,
					className : 'text-center',
					title : '分类编号',
					name : 'subjectTypeId',
					data : 'subjectTypeId',
					width : '150px'
				}, {
					targets : 3,
					className : 'text-left',
					title : '分类名称',
					name : 'subjectTypeName',
					data : 'subjectTypeName',
					width : '200px'
				}, {
					targets : 4,
					className : 'text-center',
					title : '分类类型',
					name : 'subjectClass',
					data : 'subjectClass',
					width : '150px'
				}, {
					targets : 5,
					className : 'text-center',
					title : '分类级别',
					name : 'subjectTypeNm',
					data : 'subjectTypeNm',
					width : '200px'
				}]
		}
	};
	$('a[href="#tab_subjecttypeser"]').click(function(){
		BdoDataTable('subjecttype_table', subjecttype_view);
	});

// 刷新
	$('#subjecttype_refresh').click(function(){
		$('#subjecttype_table').DataTable().ajax.reload();
	});

// 新增
	$('#subjecttype_table').on('click', 'button[name="typeAdd"]', function() {
		$('#comtype_edit').hide();
		$('#comtype_id, #comtype_type').attr('disabled', 'disabled');
		var object = $('#subjecttype_table').DataTable().data()[$(this).closest('tr').index()];
		$('#comtype_autoid').val(object.autoId);
		$('#comtype_typeid').val(object.subjectTypeId);
		$('#comtype_type').val('2');
		$('#modal_comsubtypeform').modal('show');
	});

// 修改
	$('#subjecttype_table').on('click', 'button[name="typeEdit"]', function() {
		$('#comtype_save').hide();
		$('#comtype_id, #comtype_type').attr('disabled', 'disabled');
		var object = $('#subjecttype_table').DataTable().data()[$(this).closest('tr').index()];
		comtypeformSet(object);
		$('#modal_comsubtypeform').modal('show');
	});

// 删除
	$('#subjecttype_table').on('click', 'button[name="typeDelete"]', function() {
		var object = $('#subjecttype_table').DataTable().data()[$(this).closest('tr').index()];
		bdoConfirmBox('提示', '确认删除科目分类【' + object.subjectTypeId + '-' + object.subjectTypeName + '】?', function(){
			$.ajax({
				url : 'cpBase/SubjectManage.subjectcomtypeDelete.json',
				type : 'post',
				data : {
					param1 : object.autoId,
					param2 : object.subjectTypeName
				},
				dataType : 'json',
				success : function(data){
					$('#subjecttype_table').DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	function comtypeformSet(object){
		$('#comtype_autoid').val(object.autoId);
		$('#comtype_id').val(object.subjectTypeId);
		$('#comtype_name').val(object.subjectTypeName);
		$('#comtype_type').val(object.subjectType);
	}

	$('#comtype_close').click(function(){
		$('#modal_comsubtypeform').modal('hide');
	});

// 修改
	$('#comtype_edit').click(function(){
		$('#comsubtype_form').formview(
			'setAjaxConf',
			[
				'cpBase/SubjectManage.subjectcomTypeUpdate.json',
				{
					param1 : JSON.stringify({
						autoId : $('#comtype_autoid').val(),
						typeId : $('#comtype_typeid').val(),
						subjectTypeName : $('#comtype_name').val()
					}),
					param2 : 1
				},
				'json', true,
				function(data) {
					$('#subjecttype_table').DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					$('#modal_comsubtypeform').modal('hide');
				}
			]
		);
		$('#comsubtype_form').submit();
	});
// 新增
	$('#comtype_save').click(function(){
		$('#comsubtype_form').formview(
			'setAjaxConf',
			[
				'cpBase/SubjectManage.subjectcomTypeUpdate.json',
				{
					param1 : JSON.stringify({
						autoId : $('#comtype_autoid').val(),
						typeId : $('#comtype_typeid').val(),
						subjectTypeName : $('#comtype_name').val()
					}),
					param2 : 2
				},
				'json', true,
				function(data) {
					$('#subjecttype_table').DataTable().ajax.reload();
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
					$('#modal_comsubtypeform').modal('hide');
				}
			]
		);
		$('#comsubtype_form').submit();
	});
	$('#com_template_search').click();
	/*$('#tempid').on('focus', function() {
		$(this).treecombo({
			url : 'cpBase/TreeCommon.findRuleaccTypeTree.json',
			params : {
				param9 : window.CUR_CUSTOMERID
			},
			lazyLoad : false,
			view : {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				positionValue:  'fixed'
			}
		});
	});*/
	//重新渲染表格
	/*$(document).on('click', function(){
		$(document).resize();
	});*/

	//绑定修改填写序号
	$('#four_report').on('dblclick', 'td', function() {
		var td = $(this);
		var table = td.closest('table').attr('id');
		var td1 = $(this).closest('td');
		var $table = td1.closest('table');
		//var index = checkTab($table);
		var th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
		var data = $('#'+table).DataTable().row($(this).parents('tr')).data();

		if (th.title && th.title.indexOf('序号') >= 0) {
			$('#sort_sub_name').val(data.colCode + '-' + $.trim(data.colDisp));
			$('#sort_sub_no').val('');
			getTd = function() {
				return td;
			};
			$('#modal_sortSubject').modal('show');
		}
	});
	var getTd = function() {};
	var sortNoCallback = function() {
		var td = $(this);
		var table = td.closest('table').attr('id');
		var no = $('#sort_sub_no').val();
		if (isNaN(no)) {
			bdoErrorBox('失败', '请填写正确的编号');
		} else {
			updateRow(getTd(), getTable().attr('id'), Number(no));
			$('#modal_sortSubject').modal('hide');
		}
	};
	$('#save_sortSub').on('click', sortNoCallback);

	// 调整位置
	var updateRow = function($this, tableId, newIndex) {
		var table = $('#' + tableId).DataTable();
		var index = table.row($this.closest('tr')).index();
		var tabData = table.data();
		var len = tabData.length;
		if (newIndex >= len) {
			newIndex = len - 1;
		} else if (newIndex <= 0) {
			newIndex = 0;
		} else if (newIndex > index) {
			newIndex = newIndex - 2;
		} else {
			newIndex--;
		}
		//table.DataTable().clear();
		//table.DataTable().destroy();
		//table.empty();
		//tabData.splice(newIndex, 0, tabData[index]);
		//var view = $.extend(true, {}, comtemplate_view);
		//view.localParam.data = tabData;
		//BdoDataTable(table.attr('id'), view);
		var height = $('#' + tableId).parent().scrollTop();
		tabData.splice(newIndex, 0, tabData.splice(index, 1)[0]);
		table.clear();
		table.rows.add(tabData).draw();
		$('#' + tableId).parent().scrollTop(height);
	};
	//查找表格
	var getTable = function() {
		var table = $('#' + $('#four_report').find('.active.in').attr('id') + '_table');
		return table;
	};
	//刷新表格
	var reloadTable = function(tr) {
		var view = $.extend(true, {}, comtemplate_view);
		var table = getTable();
		// 合并所有者权益变动表的 table div 为 11
		let table_div = $('#four_report').find('.active.in').attr('data-result');
		if(table.attr('id').indexOf('qy1') >= 0 && $('#template_select').text().indexOf('合并') >=0){
			table_div = 12;
		} else if(table.attr('id').indexOf('qy') >= 0 && $('#template_select').text().indexOf('合并') >=0){
			table_div = 11;
		} else if(table.attr('id').indexOf('zc') >= 0 && $('#template_select').text().indexOf('合并') >=0){
			table_div = 7;
		} else if(table.attr('id').indexOf('lr') >= 0 && $('#template_select').text().indexOf('合并') >=0){
			table_div = 9;
		}else if(table.attr('id').indexOf('xj') >= 0 && $('#template_select').text().indexOf('合并') >=0){
			table_div = 10;
		}
		view.localParam = {
			tabNum : true,
			url : 'cpBase/General.query.json',
			urlparam : {
				sqlId : 'FA40026',
				menuId : window.sys_menuId,
				start : -1,
				limit : -1,
				param1 : $('#template_select').attr('data-result'),
				param3 : table_div
			}
		};
		var height = table.parent().scrollTop();
		view.tableParam.drawCallback = function(){table.parent().scrollTop(height);};
		BdoDataTable(table.attr('id'), view);
	};
	//刷新按钮
	$('#comtemplate_refresh').on('click', function() {
		reloadTable();
	});
//   补充全选方法

	function checkAll(obj){
		if (obj.checked) {
			$(obj).attr('checked','checked');
			$("input[name='chkSubject']").each(function () {
				this.checked = true;
			});
		} else {
			$(obj).removeAttr('checked');
			$("input[name='chkSubject']").each(function () {
				this.checked = false;
			});
		}
	}


	$('#all_template_table').on('click', 'button[name="subAddTemplate"]', function() {
		var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
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
			uploadUrl: 'cpBase/SubjectManage.addTemplate.json',
			uploadExtraData: function() {
				return {
					param1: object.autoId,
				}
			}
		};

		var $el = $('#fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('导入成功');
			$('#modal-importCustomerReport').modal('hide');
			$('#fileinput').fileinput('clear');
			$('#fileinput').fileinput('enable');
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			$('#fileinput').fileinput('clear');
			$('#fileinput').fileinput('enable');
			bdoErrorBox('系统提示',msg);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
		}

		//建议文件上传成功之后再提交其他表单数据
		function uploadFile() {
			$el.fileinput('upload');
		}

		/** 添加 */
		$('#import_submit').click(function() {
			uploadFile();
		});
	});


	$('#all_template_table').on('click', 'button[name="subAdd"]', function() {
		var object = $('#all_template_table').DataTable().data()[$(this).closest('tr').index()];
		$('#com_templateId').val(object.autoId);
		$.ajax({
			url : 'cpBase/SubjectManage.queryMateriality.json',
			type : 'post',
			data : {
				param1 :  object.autoId
			},
			dataType : 'json',
			success : function(data){
				if(data.success === true){
					var data = data.data[0];
					$('#constitute1').val(data.M1);
					$('#constitute2').val(data.M2);
					$('#constitute3').val(data.M3);
					$('#constitute4').val(data.M4);
					$('#constitute5').val(data.M5);
					$('#constitute6').val(data.M6);
				}else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		$('#materialityModal').modal('show');


	});
	$('#constitute_save').click(function(){
		if(materialityCheck()){
			$.ajax({
				url : 'cpBase/SubjectManage.updateMateriality.json',
				type : 'post',
				data : {
					param1 :  $('#constitute1').val(),
					param2 :  $('#constitute2').val(),
					param3 :  $('#constitute3').val(),
					param4 :  $('#constitute4').val(),
					param5 :  $('#constitute5').val(),
					param6 :  $('#constitute6').val(),
					param7 :  $('#com_templateId').val()
				},
				dataType : 'json',
				success : function(data){
					if(data.success === true){
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#materialityModal').modal('hide');
						reloadTable();
					}else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		}

	});
	function materialityCheck(){
		if ($('#constitute1').val() == null || $('#constitute1').val() == '' || $('#constitute1').val() == 'undefined'){
			bdoErrorBox('失败',"请以收入为主要考量标准设置营业收入");
			return false;
		}
		if ($('#constitute2').val() == null || $('#constitute2').val() == '' || $('#constitute2').val() == 'undefined'){
			bdoErrorBox('失败',"请以利润为主要考量标准设置税前利润");
			return false;
		}
		if ($('#constitute3').val() == null || $('#constitute3').val() == '' || $('#constitute3').val() == 'undefined'){
			bdoErrorBox('失败',"请以资产为主要考量标准/投资公司设置总资产");
			return false;
		}
		if ($('#constitute4').val() == null || $('#constitute4').val() == '' || $('#constitute4').val() == 'undefined'){
			bdoErrorBox('失败',"请以非盈利组织设置收入");
			return false;
		}
		if ($('#constitute5').val() == null || $('#constitute5').val() == '' || $('#constitute5').val() == 'undefined'){
			bdoErrorBox('失败',"请以资产为主要考量标准/投资公司设置净资产");
			return false;
		}
		if ($('#constitute6').val() == null || $('#constitute6').val() == '' || $('#constitute6').val() == 'undefined'){
			bdoErrorBox('失败',"请以非盈利组织设置成本");
			return false;
		}
		return true;
	}
	uiBlocksApi(false, 'init');
});
