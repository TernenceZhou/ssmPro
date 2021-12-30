$(document).ready(function() {
	uiBlocksApi(false, 'init');
	let ruleOption = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
	$('#auditProgramSubject_templateId').html(ruleOption);
	$('#auditProgramCustomize_templateId').html(ruleOption);
	let select_subject = ComboDBOption('cpBase/Combo.getBaseSubject.json', false);
	$('#auditProgramSubject_subjectName').html(select_subject);
	$('#auditProgramCustomize_subjectName').html(select_subject);
	$('#auditProgramCustomize_select').html(ComboLocalDicOption(true, 'boolean'));
	$('#auditProgramCustomize_select').val('1');
	// 模板一览
	let auditProgramTemplate_tableview_index = 1;
	let auditProgramTemplate_tableview = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40060',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: $('#auditProgram_ruleName').val(),
				param2: '',
				param3: window.departIdrSession
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			//dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			order: [2, 'ASC'],
			pageLength: 30,
			ordering: false,
			serverSide: true,
			createdRow(row, data, dataIndex) {
				$(row).attr('data-row-id', dataIndex);
			},
			columnDefs: [
				{
					targets: auditProgramTemplate_tableview_index++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="templateView" id="templateView" data-placement="top" title="查看" data-toggle="tooltip"><i class="fa fa-indent"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="templateEdit" id="templateEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="templateDelete" id="templateDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
						return renderStr;
					}
				}, {
					targets: auditProgramTemplate_tableview_index++,
					className: 'text-center',
					title: '模板名称',
					name: 'ruleName',
					data: 'ruleName',
					width: '80px'
				}, {
					targets: auditProgramTemplate_tableview_index++,
					className: 'text-center',
					title: '描述',
					name: 'remark',
					data: 'remark',
					width: '100px'
				}, {
					targets: auditProgramTemplate_tableview_index++,
					className: 'text-center',
					title: '部门',
					name: '__ddepartmentId',
					data: '__ddepartmentIdName',
					width: '80px'
				}, {
					targets: auditProgramTemplate_tableview_index++,
					className: 'text-center',
					title: '创建者',
					name: '__uuserId',
					data: '__uuserIdName',
					width: '60px'
				}, {
					targets: auditProgramTemplate_tableview_index++,
					className: 'text-center',
					title: '更新时间',
					name: 'LAST_UPDATE_DATE',
					data: 'LAST_UPDATE_DATE',
					width: '80px'
				}
			]
		}
	};
	var initAuditProgramTemplateTable = function() {
		auditProgramTemplate_tableview.localParam.urlparam.param1 = $('#auditProgram_ruleName').val();
		BdoDataTable('auditProgramTemplate_table', auditProgramTemplate_tableview);
	};
	initAuditProgramTemplateTable();
	// 添加模板form
	var initAddTemplate = function() {
		//新增模板form参数
		$('#addtemplate_form').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'addtemplate_save',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;保存'
				}, {
					id: 'addtemplate_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'add_templateId',
					type: 'input',
					typeAttr: {
						type: 'hidden'
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'add_templateName',
					type: 'input',
					label: '模板名称',
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'add_remark',
					type: 'input',
					label: '模板描述',
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'add_inittemplateId',
					type: 'input',
					label: '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" id="initAuditProgramTemplateCheck" value="1"><span></span>初始化模板',
					rowspan: 1,
					colspan: 2,
					plugin: {
						name: 'treecombo',
						options: {
							url: 'cpBase/TreeCommon.finAuditProgramRuleaccTree.json',
							//添加参数，取消初始化tb模板的分页
							params: {param20: window.departIdrSession, limit: 100000},
							view: {
								leafIcon: 'fa fa-building text-flat',
								nodeIcon: 'fa fa-bank text-primary-light',
								folderSelectable: true,
								multiSelect: false
							}
						}
					},
					validate: {
						rules: {
							required: false
						}
					}

				}
			]
		});
	}
	initAddTemplate();

	//新增模板
	$('#auditProgram_add').on('click', function() {
		$('#modal_addtemplateform h3').html('新增模板');
		$('#add_templateId').val('');
		$('#add_inittemplateId').val('');
		$('#add_templateName').val('');
		$('#add_remark').val('');
		// let ruleoption = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
		// $('#add_inittemplateId').html(ruleoption);
		$('#modal_addtemplateform').modal('show');
	});

	//关闭界面
	$('#addtemplate_close').on('click', function() {
		$('#modal_addtemplateform').modal('hide');
	});

	//保存新增模板
	$('#addtemplate_save').on('click', function() {
		if($('#addtemplate_form').valid()){
			var initFlag = 0;
			if ($('#initAuditProgramTemplateCheck').is(':checked')) {
				initFlag = 1;
			}
			$.ajax({
				url: 'cpBase/AuditProgramTemplate.saveAuditProgramTemplate.json',
				data: {
					param1: $('#add_templateId').val(),
					param2: $('#add_templateName').val(),
					param3: initFlag,
					param4: $('#add_inittemplateId').treecombo('getTreeComboValue'),
					param5: $('#add_remark').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						initAuditProgramTemplateTable();
						$('#modal_addtemplateform').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}
				}
			});
		}
	});
	//查询模板一览
	$('#auditProgramTemplate_search').on('click', function() {
		initAuditProgramTemplateTable();
	});
	let auditProgramSubject_tableview_index = 1;
	let auditProgramSubject_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40061',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: $('#auditProgramSubject_templateId').val(),
				param2: $('#auditProgramSubject_subjectName').val()
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',//
			ordering: false,
			serverSide: true,
			fixedColumns: false,
			rowReorder: {
				update: false
			},
			createdRow(row, data, dataIndex) {
				$(row).attr('data-row-id', dataIndex);
			},
			columnDefs: [
				{
					targets: auditProgramSubject_tableview_index++,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						ruleAccDepartId = row.departId;
						return renderStr;
					}
				}, {
					targets: auditProgramSubject_tableview_index++,
					className: 'text-left',
					title: '标准科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: auditProgramSubject_tableview_index++,
					className: 'text-left',
					title: '标准科目名称',
					name: 'subjectName',
					data: 'subjectName',
					width: '200px'
				}]
		}
	};
    var targetsNo = 0;
	var auditprogramTableCnfg = {
		tabNum : true,
		scrollX : true,
		lengthChange : true,
		// order : [2, 'asc'],
		pageLength : 30,
		ordering : false,
		info : true,
		sourceData : {},
		sourceUrl : 'cpBase/General.query.json',
		filterParam : {
			menuId : window.sys_menuId,
			sqlId : 'FA40064',
		},
		createdRow(row, data, dataIndex) {
			$(row).attr('data-row-id', dataIndex);
			/*if(data.customizeId != null && data.customizeId != ''){
				$(row).css('color', '#090');
			}*/
		},
		tableColumns :[
			{
				targets : ++targetsNo,
				orderable : false,
				className : 'text-center',
				title : '处理',
				data : null,
				width : '150px',
				render : function(data, type, row, meta) {
					var renderStr = '';
					if(row.customizeId != null && row.customizeId != '') {
						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate unuse-audit-program" data-row="'+meta.row+'" type="button" data-action="invalid" name="" data-placement="top" title="取消" data-toggle="tooltip">'
							+ '<i class="fa fa-close"></i></button>';
					}else{
						renderStr += '<button class="btn btn-xs btn-success table-btn-operate use-audit-program" data-row="'+meta.row+'" type="button" data-action="add" name="" data-placement="top" title="设置" data-toggle="tooltip">'
							+ '<i class="fa fa-external-link"></i></button>';
					}
					return renderStr;
				}
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : '机构部门',
				name : 'departmentId',
				data : 'departmentId',
				width : '150px',
				render(data, type, row, meta) {
					if(row.__ddepartmentIdName == undefined ){
						return row.name;
					}else{
						return row.__ddepartmentIdName;
					}
				}
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : '程序名称',
				name : 'dgName' ,
				data : 'dgName',
				width : '150px',
				className : 'ribbon ribbon-right',
				render(data, type, row, meta) {
					if(row.depCustomizeFlag != 1 && row.competitiveFlag == 1) {
						return data + '<div class="ribbon-box bg-warning" style="top: 0;padding: 0 3px;height: 16px;line-height: 16px;"><span class="dg-ap-competitive"><i class="fa fa-star"></i></span></div>';
					}
					return data;
				}
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : '程序内容',
				name : 'programName',
				data : 'programName',
				width : '300px',
				className : 'text-ellipsis'
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : '索引号',
				name : 'indexId' ,
				data : 'indexId',
				width : '150px'
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : '标准科目',
				name : 'subject',
				//data : 'subjectName',
				width : '90px',
				render(data, type, row, meta) {
					return row.subjectId + '-' + row.subjectName;
				}
			},{
				targets : ++targetsNo,
				orderable : false,
				title : 'E',
				name : 'E',
				data : 'csE',
				width : '30px',
				className : 'text-center',
				render(data, type, row, meta) {
					return getConfirmStatus(data, row.sE);
				}
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : 'C',
				name : 'C',
				data : 'csC',
				width : '30px',
				className : 'text-center',
				render(data, type, row, meta) {
					return getConfirmStatus(data, row.sC);
				}
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : 'A',
				name : 'A',
				data : 'csA',
				width : '30px',
				className : 'text-center',
				render(data, type, row, meta) {
					return getConfirmStatus(data, row.sA);
				}
			},{
				targets : ++targetsNo,
				orderable : false,
				title : 'V',
				name : 'V',
				data : 'csV',
				width : '30px',
				className : 'text-center',
				render(data, type, row, meta) {
					return getConfirmStatus(data, row.sV);
				}
			},{
				targets : ++targetsNo,
				orderable : false,
				title : 'P',
				name : 'P',
				data : 'csP',
				width : '30px',
				className : 'text-center',
				render(data, type, row, meta) {
					return getConfirmStatus(data, row.sP);
				}
			},{
				targets : ++targetsNo,
				orderable : false,
				title : '行业',
				name : 'industryName',
				data : 'industryName',
				width : '150px'
			},{
				targets: ++targetsNo,
				orderable: false,
				title: '适用板块',
				name: 'userablePlate',
				data: 'userablePlate',
				width: '150px'
			},{
				targets : ++targetsNo,
				orderable : false,
				title : '潜在风险说明',
				name : 'potentialRisk',
				data : 'potentialRisk',
				width : '150px'
			}, {
				targets : ++targetsNo,
				orderable : false,
				title : '具体事项说明',
				name : 'description',
				data : 'description',
				width : '150px'
			},{
				targets : ++targetsNo,
				orderable : false,
				title : '是否必须',
				name : 'required',
				data : 'required',
				render(data, type, row, meta) {
					return DicVal2Nm(data, 'boolean');
				},
				width : '150px'
			},{
				targets : ++targetsNo,
				orderable : false,
				title : '创建人',
				name : 'createUser',
				data : 'createUser',
				render(data, type, row, meta) {
					return row.__ucreateUser.userName;
				},
				width : '150px'
			}
		]
	}
	//修改模板
	$('#auditProgramTemplate_table').on('click', 'button[name="templateEdit"]', function() {
		let object = $('#auditProgramTemplate_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		var templateId = object.autoId;
		if (!templateId) {
			bdoErrorBox('提示', '请先选择审计程序模板');
			return;
		}
		$('#modal_addtemplateform h3').html('修改模板');
		$('#add_templateId').val(templateId);
		$('#add_inittemplateId').val('');
		$('#add_templateName').val(object.ruleName);
		$('#add_remark').val(object.remark);
		let ruleoption = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
		$('#add_inittemplateId').html(ruleoption);
		$('#modal_addtemplateform').modal('show');

	});

	//链接到标准科目维护
	$('#auditProgramTemplate_table').on('click', 'button[name="templateView"]', function() {
		//刷新最新的TB模板
		/*let select_html = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
		$('#auditProgramSubject_templateId').html(select_html);*/

		let object = $('#auditProgramTemplate_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		/*$('#auditProgramSubject_templateId').val(object.autoId);
		auditProgramSubject_view.localParam.urlparam.param1 = object.autoId;
		auditProgramSubject_view.localParam.urlparam.param2 = $('#auditProgramSubject_subjectName').val();
		BdoDataTable('auditProgramSubject_table', auditProgramSubject_view);
		$('#auditProgramSubject_select').text('【' + object.ruleName + '】');
		$('#auditProgramSubject_select').attr('data-result', object.autoId);
		$('#tab_auditProgramSubject').addClass('active');
		$('a[href="#tab_auditProgramSubject"]').parent().addClass('active');
		$('#tab_auditProgramTemplate').removeClass('active');
		$('a[href="#tab_auditProgramTemplate"]').parent().removeClass('active');
		$('a[href="#tab_auditProgramSubject"]').css('display', 'block');*/

		let select_html = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
		$('#auditProgramCustomize_templateId').html(select_html);
		$('#auditProgramCustomize_templateId').val(object.autoId);
		auditprogramTableCnfg.filterParam.param1 = $('#auditProgramCustomize_templateId').val();
		auditprogramTableCnfg.filterParam.param2 = $('#auditProgramCustomize_subjectName').val();
		auditprogramTableCnfg.filterParam.param3 = window.departIdrSession;
		var auditProgramCustomize_select = $('#auditProgramCustomize_select').val();
		if(auditProgramCustomize_select == '0'){
			auditprogramTableCnfg.filterParam.param5 = auditProgramCustomize_select;
		}if(auditProgramCustomize_select == '1'){
			auditprogramTableCnfg.filterParam.param4 = auditProgramCustomize_select;
		}else{
			auditprogramTableCnfg.filterParam.param4 = '';
			auditprogramTableCnfg.filterParam.param5 = '';
		}
		BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);

		$('#tab_auditProgramCustomize').addClass('active');
		$('a[href="#tab_auditProgramCustomize"]').parent().addClass('active');
		$('#tab_auditProgramTemplate').removeClass('active');
		$('a[href="#tab_auditProgramTemplate"]').parent().removeClass('active');
		$('a[href="#tab_auditProgramCustomize"]').css('display', 'block');
	});
	//查询模板一览
	$('#auditProgramSubject_search').on('click', function() {
		var templateId = $('#auditProgramSubject_templateId').val();
		if (!templateId) {
			bdoErrorBox('提示', '请先选择程序模板');
			return;
		}
		auditProgramSubject_view.localParam.urlparam.param1 = $('#auditProgramSubject_templateId').val();
		auditProgramSubject_view.localParam.urlparam.param2 = $('#auditProgramSubject_subjectName').val();
		BdoDataTable('auditProgramSubject_table', auditProgramSubject_view);
		$('#auditProgramSubject_select').text('【' + $('#auditProgramSubject_templateId option:selected').text() + '】');
		$('#auditProgramSubject_select').attr('data-result', $('#auditProgramSubject_templateId').val());
	});
	//删除模板
	$('#auditProgramTemplate_table').on('click', 'button[name="templateDelete"]', function() {
		let object = $('#auditProgramTemplate_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		bdoConfirmBox('添加', '是否确认删除？', function() {
			$.ajax({
				url: 'cpBase/AuditProgramTemplate.deleteAuditProgramTemplate.json',
				type: 'post',
				data: {
					param1: object.autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						initAuditProgramTemplateTable();
						BdoDataTable('auditProgramSubject_table', auditProgramSubject_view);
						BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);
						refreshTemplate();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 选择科目
	$('#auditProgramSubject_add').click(function() {
		$('#modal_selectBaseSubject').modal('show');
		if ($('#subject_tree_base').hasClass('treeview')) {
			return;
		}
		$('#subject_tree_base').tree({
			url : 'cpBase/TreeCommon.getBaseSubjectTree.json',
			params : {
				searchInputId : 'searchInput_tree_base'
			},
			singleSelect : false,
			lazyLoad : false,
			onceLoad : true,
			view : {
				leafIcon : 'fa fa-building text-flat',
				nodeIcon : 'fa fa-bank text-primary-light',
				folderSelectable : false,
				multiSelect : true,
				showCheckbox : true,
				selectedColor : '',
				selectedBackColor : ''

			}
		});
	});
	$('#modal_tree_base_sure').click(function() {
		var selectValue = $('#subject_tree_base').tree('getTreeMultiValue');
		if (typeof (selectValue) === 'object') {
			addBaseSubject('');
		} else {
			addBaseSubject(selectValue);
		}
	});
	$('#modal_tree_base_reset').click(function() {
		$('#subject_tree_base').tree('reset');
	});
	$('#modal_Ttree_base_selectAll').click(function() {
		$('#subject_tree_base').tree('checkAll');
	});
	// 添加标准科目
	var addBaseSubject = function(subjectIds) {
		var templateId = $('#auditProgramSubject_select').attr('data-result');
		if (templateId == null || templateId == '') {
			bdoInfoBox('提示', '请选择程序模板！');
			return;
		}
		if (subjectIds == null || subjectIds == '') {
			bdoInfoBox('提示', '请选择标准科目！');
			return;
		}
		bdoConfirmBox('添加', '是否确认保存？', function() {
			$.ajax({
				url: 'cpBase/AuditProgramTemplate.saveAuditProgramSubject.json',
				type: 'post',
				data: {
					param1: templateId,
					param2: subjectIds
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modal_selectBaseSubject').modal('hide');
						BdoDataTable('auditProgramSubject_table', auditProgramSubject_view);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	}
	//链接到审计程序维护
	$('#auditProgramSubject_table').on('click', 'button[name="subEdit"]', function() {
		//刷新最新的TB模板
		let select_html = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
		$('#auditProgramCustomize_templateId').html(select_html);

		let object = $('#auditProgramSubject_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		$('#auditProgramCustomize_templateId').val(object.templateId);
		$('#auditProgramCustomize_subjectName').val(object.subjectId);
		auditprogramTableCnfg.filterParam.param1 = $('#auditProgramCustomize_templateId').val();
		auditprogramTableCnfg.filterParam.param2 = $('#auditProgramCustomize_subjectName').val();
		auditprogramTableCnfg.filterParam.param3 = window.departIdrSession;
		var auditProgramCustomize_select = $('#auditProgramCustomize_select').val();
		if(auditProgramCustomize_select == '0'){
			auditprogramTableCnfg.filterParam.param5 = auditProgramCustomize_select;
		}if(auditProgramCustomize_select == '1'){
			auditprogramTableCnfg.filterParam.param4 = auditProgramCustomize_select;
		}else{
			auditprogramTableCnfg.filterParam.param4 = '';
			auditprogramTableCnfg.filterParam.param5 = '';
		}
		BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);

		$('#tab_auditProgramCustomize').addClass('active');
		$('a[href="#tab_auditProgramCustomize"]').parent().addClass('active');
		$('#tab_auditProgramSubject').removeClass('active');
		$('a[href="#tab_auditProgramSubject"]').parent().removeClass('active');
		$('a[href="#tab_auditProgramCustomize"]').css('display', 'block');
	});
	//删除模板科目
	$('#auditProgramSubject_table').on('click', 'button[name="subDelete"]', function() {
		let object = $('#auditProgramSubject_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		bdoConfirmBox('添加', '是否确认删除？', function() {
			$.ajax({
				url: 'cpBase/AuditProgramTemplate.deleteAuditProgramSubject.json',
				type: 'post',
				data: {
					param1: object.templateId,
					param2: object.autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						BdoDataTable('auditProgramSubject_table', auditProgramSubject_view);
						BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	function getConfirmStatus(data, score){
		var val = data == '1' ? 'checked' : '';
		var result = '<label class="css-input css-checkbox css-checkbox-primary control-label" >'
			+'			<input type="checkbox" '+ val +' disabled>'
			+'			<span></span>'
			+'		</label>'
			+'<div>' + (score && data == '1' ? score : 0) + '</div>';
		return result;
	}
	//查询程序一览
	$('#auditProgramCustomize_search').on('click', function() {
		var templateId = $('#auditProgramCustomize_templateId').val();
		var subjectId = $('#auditProgramCustomize_subjectName').val();
		if (!templateId) {
			bdoErrorBox('提示', '请先选择程序模板');
			return;
		}
		/*if (subjectId == null || subjectId == '') {
			bdoInfoBox('提示', '请选择标准科目！');
			return;
		}*/
		auditprogramTableCnfg.filterParam.param1 = $('#auditProgramCustomize_templateId').val();
		auditprogramTableCnfg.filterParam.param2 = $('#auditProgramCustomize_subjectName').val();
		auditprogramTableCnfg.filterParam.param3 = window.departIdrSession;
		var auditProgramCustomize_select = $('#auditProgramCustomize_select').val();
		if(auditProgramCustomize_select == '0'){
			auditprogramTableCnfg.filterParam.param5 = auditProgramCustomize_select;
		}if(auditProgramCustomize_select == '1'){
			auditprogramTableCnfg.filterParam.param4 = auditProgramCustomize_select;
		}else{
			auditprogramTableCnfg.filterParam.param4 = '';
			auditprogramTableCnfg.filterParam.param5 = '';
		}
		BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);
	});
	// 添加到模板
	$('#auditProgramCustomize_table').on('click', '.use-audit-program', function() {
		let object = $('#auditProgramCustomize_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		var templateId = $('#auditProgramCustomize_templateId').val();
		var subjectId = object.subjectId;
		if (templateId == null || templateId == '') {
			bdoInfoBox('提示', '请选择程序模板！');
			return;
		}
		if (subjectId == null || subjectId == '') {
			bdoInfoBox('提示', '请选择标准科目！');
			return;
		}
		bdoConfirmBox('添加', '是否确认添加？', function() {
			$.ajax({
				url: 'cpBase/AuditProgramTemplate.saveAuditProgramCustomize.json',
				type: 'post',
				data: {
					param1: templateId,
					param2: subjectId,
					param3: object.autoId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 从模板删除
	$('#auditProgramCustomize_table').on('click', '.unuse-audit-program', function() {
		let object = $('#auditProgramCustomize_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		bdoConfirmBox('添加', '是否确认取消？', function() {
			$.ajax({
				url: 'cpBase/AuditProgramTemplate.deleteAuditProgramCustomize.json',
				type: 'post',
				data: {
					param1: object.templateId,
					param2: object.customizeId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						BdoDataTables('auditProgramCustomize_table', auditprogramTableCnfg);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	function refreshTemplate(){
		let select_html = ComboDBOptionWithParam('cpBase/Combo.getAuditProgramRuleacc.json', false, {param1: window.departIdrSession});
		$('#auditProgramSubject_templateId').html(select_html);
		$('#auditProgramCustomize_templateId').html(select_html);
	}
	// 跳转添加部门审计程序
	$('#auditProgramCustomize_add').on('click', function() {
		var templateId = $('#auditProgramCustomize_templateId').val();
		if (templateId == null || templateId == '') {
			bdoInfoBox('提示', '请选择程序模板！');
			return;
		}
		AuditProgramDetailPage({region: '#tab_auditProgramDetail', data: {useType: '2', templateId: templateId}});
		$('#tab_auditProgramDetail').addClass('active');
		$('a[href="#tab_auditProgramDetail"]').parent().addClass('active');
		$('#tab_auditProgramCustomize').removeClass('active');
		$('a[href="#tab_auditProgramCustomize"]').parent().removeClass('active');
		$('a[href="#tab_auditProgramDetail"]').css('display', 'block');
	});
});

