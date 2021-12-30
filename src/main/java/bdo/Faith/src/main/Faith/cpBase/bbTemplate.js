(function() {
	let tbSubjectMap = null;  // 当前显示的TB科目编号集（用于公式编辑时判断科目是否存在）
	let isCurrentUserHasRole = false;
	let ruleAccDepartId = '';
	uiBlocksApi(false, 'init');
	/*$('[data-toggle="tabs"]').on('click', 'a', function(e){
		e.preventDefault();
		$(this).tab('show');
	});*/
	/** 模态框设置 */
	/*	$('.modal').on('show.bs.modal', function(){
			$(this).draggable({
				handle: '.block-header',
				cursor: 'move'
			});
			$(this).css('overflow', 'hidden');
		});*/
	var ruleoption = ComboDBOption('cpBase/Combo.getBbRuleacc.json', false);
	let createNameOption = ComboDBOption('cpBase/Combo.getTbRuleaccByName.json', false);
	$('#bbsubject_create').html('<option value="" selected="selected"></option>' + createNameOption);
	//$('#tbsubject_name').html('<option value="" selected="selected"></option>'+ruleoption);
	$('#bbTemplate_vocationId').html(ruleoption/* +'<option value=0>默认模板</option>'*/);
	$('#tab2_bbTemplate').html(ruleoption);
	$('#tab3_bbTemplate').html(ruleoption);
	$('#bbsubject_type').html(ComboLocalDicOption(true, '报备模板类型'));
	$("#bbTemplate_tableDiv").html(ComboLocalDicOption(true, 'TABLE_DIV'));
	
	//修改模板参数
	$('#comtemplatecoledit_close').click(function() {
		$('#modal_comtemplatecolEditform').modal('hide');
	});

	var inform = DicJsonlData.responseJSON['报告类型'];
	var inform_select = "<option value=''></option><option value='单体'>"+inform['单体']+"</option><option value='合并'>"+inform['合并']+"</option>";

	var initTemplate = function() {
		//新增模板form参数
		$('#bbcomtemplate_form').formview({
			display: 'tableform-one',
			column: 4,
			buttons: [
				{
					id: 'bbcomtemplate_save',
					icon: 'fa-save',
					style: 'btn-primary',
					text: '&nbsp;保存'
				}, {
					id: 'bbcomtemplate_close',
					icon: 'fa-sign-out',
					style: 'btn-warning',
					text: '&nbsp;关闭'
				}
			],
			items: [
				{
					id: 'bbcom_templateId',
					type: 'input',
					typeAttr: {
						type: 'hidden'
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'bbcom_templateType',
					type: 'select',
					label: '模板类型',
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'bbcom_templateName',
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
					id: 'bbcom_remark',
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
					id: 'bbcom_reportType',
					type: 'select',
					label: '报告类型',
					html : inform_select,
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'bbcom_must',
					type: 'select',
					label: '是否必须',
					validate: {
						rules: {
							required: true
						}
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'bbcom_inittemplateId',
					type: 'input',
					label: '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" id="initBbTemplateCheck" value="1"><span></span>初始化模板',
					rowspan: 1,
					colspan: 2,
					plugin: {
						name: 'treecombo',
						options: {
							url: 'cpBase/TreeCommon.findgBbRuleaccTree.json',
							//添加参数，取消初始化tb模板的分页
							params: {limit: 100000},
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
		$('#bbcom_templateType').html(ComboLocalDicOption(true, '报备模板类型'));
		$('#bbcom_must').html(ComboLocalDicOption(true, '是否'));
		
		var buttonHtml = '<button class="btn btn-primary" type="button" style="margin-left: 4.5%;background-color:#46bbff" id="bb_template_datail">' +
			'<i class="fa fa-save" style="margin-right:8px;"></i><span>&nbsp;查看</span></button>';

		var $formSelect = $('#bbcom_inittemplateId');
		$formSelect.parent().css({'width': '80%', 'display': 'inline-block'});
		$formSelect.closest('td').append(buttonHtml);
		$('#bb_template_datail').on('click', function() {
			var initValue = $('#bbcom_inittemplateId').treecombo('getTreeComboValue');
			if (!initValue) {
				return;
			}
			var init_table_view = {
				localParam: {
					tabNum: true,
					url: 'cpBase/General.query.json',
					urlparam: {
						sqlId: 'FA40052',
						menuId: window.sys_menuId,
						start: -1,
						limit: -1,
						param1: initValue
					}
				},
				tableParam: {
					select: true,
					lengthChange: false,
					dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
					//order : [1, 'ASC'],
					//ordering : true,
					serverSide: true,
					columnDefs: [{
						targets: 1,
						className: 'text-left',
						title: '报备科目编号',
						name: 'bbSubjectId',
						data: 'bbSubjectId',
						width: '80px'
					}, {
						targets: 2,
						className: 'text-left',
						title: '报备科目名称',
						name: 'bbSubjectName',
						data: 'bbSubjectName',
						width: '80px'
					}, {
						targets: 3,
						className: 'text-left',
						title: '所属报表',
						name: 'tableDiv',
						data: 'tableDiv',
						width: '80px'
					}, {
						targets: 4,
						className: 'text-left',
						title: '合计公式',
						name: 'calFun',
						data: 'calFun',
						width: '80px',
						render: function(data, type, row, meta) {
							if (data != null) {
								if (data.length > 35) {
									var str = '<span title="' + data + '">';
									for (var i = 0; i < data.length / 35; i++) {
										str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
									}
									str += '</span>';
									return str;
								} else {
									return '<span>' + data + '</span>';
								}
							} else {
								return '<span></span>';
							}
						}
					}, {
						targets: 5,
						className: 'text-left',
						title: '报备科目显示名称',
						name: 'bbSubjectNameDisp',
						data: 'bbSubjectNameDisp',
						width: '80px',
						render: function(data, type, row, meta){
							if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0){
								return '<b>' + data + '</b>';
							}else{
								return data.replace(' ','&nbsp;&nbsp;');
							}
						}
					}]
				}
			};
			BdoDataTable('init_tamplate_table', init_table_view);
			$('#export_detail').off();
			$('#export_detail').on('click', function() {
				var label = $('#bbcom_inittemplateId').treecombo('getTreeComboLabel');
				exportExcel(this, "报备模板" + label, init_table_view, 'init_tamplate_table');
				return false;
			});
			$('#init_tamplate_detail').modal('show');
		});
	};
	initTemplate();
	//新增科目form参数
	$('#bbcomtemplatecoladd_form').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'bbcomSubject_save',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'

			}, {
				id: 'bbcomSubject_close',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}
		],
		items: [
			{
				id: 'com_bbTemplateId',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			}, {
				id: 'com_bbsubjectId',
				type: 'input',
				label: '科目编号',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'com_bbsubjectName',
				type: 'input',
				label: '科目名称',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'com_bbsubjectNameDisp',
				type: 'input',
				label: '科目显示名称',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'com_bbisSubject',
				type: 'select',
				label: '是否科目项',
				validate: {
					rules: {
						required: false
					}
				},
				rowspan: 1,
				colspan: 2
			}, {
				id: 'com_bbtableDiv',
				type: 'select',
				label: '所属报表',
				validate: {
					rules: {
						required: false
					}
				},
				rowspan: 1,
				colspan: 2
			}, {
				id: 'com_bbcalFun',
				type: 'input',
				label: '合计公式',
				validate: {
					rules: {
						required: false
					}
				},
				rowspan: 1,
				colspan: 2
			}
		]
	});
	/*var example2Select2Multiple='';
	example2Select2Multiple += '<option value="0">否</option>';
	example2Select2Multiple += '<option value="1">是</option>';*/
	$('#com_bbisSubject').html(ComboLocalDicOption(false, 'boolean'));
	$("#com_bbtableDiv").html(ComboLocalDicOption(false, 'TABLE_DIV'));
	
	/*$('#com_bbisSubject').on('change', function() {
		if ($(this).val() == 1) {
			$('#com_bbcalFun').prop('disabled', true);
		} else {
			$('#com_bbcalFun').prop('disabled', false);
		}
	});*/

	//删除左右两端的空格
	function trim(str) {
		if(typeof str == 'string') {
			return str.trim();
		}
		return str;
	}

	//保存tb科目
	$('#bbcomSubject_save').on('click', function() {
		let str = new RegExp(/^[A-Za-z].*/);
		let curTbSubjectId = $('#com_bbsubjectId').val();
		let curTbSubjectName = $('#com_bbsubjectName').val();
		let curTbSubjectNameDisp = $('#com_bbsubjectNameDisp').val();
		//科目名只能包含/
		let nameReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;
		//科目编号不能包含特殊字符
		let idReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;
		if (!str.test(curTbSubjectId)) {
			bdoInfoBox('提示', '科目编号必须以字母开头!');
			return false;
		}
		if (idReg.test(curTbSubjectId)) {
			bdoInfoBox('提示', '科目编号不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
			return false;
		}
		/*if (nameReg.test(curTbSubjectName)) {
			bdoInfoBox('提示', '科目编号不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
			return false;
		}*/
		if (curTbSubjectNameDisp == null || curTbSubjectNameDisp == '') {
			bdoInfoBox('提示', '科目显示名称不能为空!');
			return false;
		}
		let calItems = parseCalFunItems($('#com_bbcalFun').val());
		for (let i = 0; i < calItems.length; i++) {
			if (curTbSubjectId === calItems[i]) {
				bdoInfoBox('提示', `公式有误，不能有自身科目编号【${curTbSubjectId}】!`);
				return false;
			}
			if (!tbSubjectMap.has(calItems[i])) {
				bdoInfoBox('提示', `公式有误，不能有不存在的科目编号【${calItems[i]}】!`);
				return false;
			}
		}
		let reg = new RegExp(/[A-Za-z].*[0-9]/);
		if (reg.test($('#com_bbsubjectId').val())) {
			$.ajax({
				url: 'cpBase/BBSubjectTemplate.saveBBSubject.json',
				data: {
					param1: $('#com_bbTemplateId').val(),
					param2: $('#com_bbsubjectId').val(),
					param3: trim($('#com_bbsubjectName').val()),
					param4: $('#bb_template_select').attr('data-result'),
					param5: $('#com_bbisSubject').val(),
					param6: encodeURIComponent($('#com_bbcalFun').val()),
					param7: $('#com_bbtableDiv').val(),
					param8: $('#com_bbsubjectNameDisp').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						tbSubjectMap.set(curTbSubjectId, calItems);
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}
					$('#bb_comtemplate_table').DataTable().ajax.reload();
					$('#modal_bbcomtemplatecoladdform').modal('hide');
				}
			});
		} else {
			bdoInfoBox('提示', '科目编号必须以字母开头数字结尾!');
		}

	});

	//关闭tb科目对话框
	$('#bbcomSubject_close').on('click', function() {
		$('#modal_bbcomtemplatecoladdform').modal('hide');
	});

	//关闭界面
	$('#bbcomtemplate_close').on('click', function() {
		$('#modal_bbcomtemplateform').modal('hide');
	});

	//保存新增模板
	$('#bbcomtemplate_save').on('click', function() {
		if($('#bbcomtemplate_form').valid()){
			var initFlag = 0;
			if ($('#initBbTemplateCheck').is(':checked')) {
				initFlag = 1;
			}
			$.ajax({
				url: 'cpBase/BBSubjectTemplate.saveBBTemplate.json',
				data: {
					param1: $('#bbcom_templateId').val(),
					param2: $('#bbcom_templateName').val(),
					param3: initFlag,
					param4: $('#bbcom_inittemplateId').treecombo('getTreeComboValue'),
					param5: $('#bbcom_remark').val(),
					param6: $('#bbcom_templateType').val(),
					param7: $('#bbcom_must').val(),
					param8: $('#bbcom_reportType').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}
					//$('#comtemplate_search').click();
					$('#bbcomtemplate_search').click();
					$('#modal_bbcomtemplateform').modal('hide');
					let select_html = ComboDBOption('cpBase/Combo.getBbRuleacc.json', false);
					//$('#template_vocationId').html(select_html);
					$('#tab2_bbTemplate').html(select_html);
					$('#tab3_bbTemplate').html(select_html);
					$('#bbsubject_name').html('<option value="" selected="selected"></option>' + select_html);
					//$('#comtemplate_table').DataTable().ajax().reload();
				}
			});
		}
	});

	var fnInfoCallback = function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
		var id = $(this).attr('id');

		if ($(id + '_info_next').length < 1) {
			return '<div class="dataTables_info" id="' + id + '_info" role="status" aria-live="polite">共 <b>' + iTotal + '</b>条' +
				' <a class="tableRefresh" id="' + id + '_info_next"><i class="fa fa-refresh" style="cursor:pointer;">刷新</i></a></div>';
		} else {
			return '<div class="dataTables_info" id="' + id + '_info" role="status" aria-live="polite">共 <b>' + iTotal + '</b>条' +
				' <a class="tableRefresh" id="' + id + '_info_next"><i class="fa fa-refresh" style="cursor:pointer;">刷新</i></a></div>';

		}
	};
	var fnInitComplete = function(a, b) {
		var $this = $(this);
		var id = $this.attr('id');
		$('#' + id + '_info_next').off();
		$('#' + id + '_info_next').on('click', function() {
			$this.DataTable().ajax.reload();
		});

		tbSubjectMap = new Map();  // 当前显示的TB科目编号集（用于公式编辑时判断科目是否存在）
		b.data.forEach(row => tbSubjectMap.set(row.bbSubjectId, parseCalFunItems(row.calFun)));
	};
	var initTab1Table = function() {
		let bbsubjectAll_tableview = {
			localParam: {
				tabNum: true,
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'FA40050',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: $('#bbsubject_name').val(),
					param2: $('#bbsubject_remark').val(),
					param3: $('#bbsubject_create').val(),
					param4: $('#bbsubject_type').val()
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
				// rowReorder : {
				//     update : false
				// },
				createdRow(row, data, dataIndex) {
					$(row).attr('data-row-id', dataIndex);
				},
				infoCallback: fnInfoCallback,
				initComplete: fnInitComplete,
				columnDefs: [
					{
						targets: 1,
						orderable: false,
						className: 'text-center',
						title: '处理',
						width: '60px',
						render: function(data, type, row, meta) {
							var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
							/*if(row.departId != 555555 && isCurrentUserHasRole){
								renderStr += ('<button class="btn btn-xs btn-warning tb-template-to-public" type="button"  data-placement="top" title="设为通用模板" data-toggle="tooltip" data-row="' + meta.row + '"><i class="fa fa-check"></i></button>&nbsp;');
							}*/
							renderStr += '<button class="btn btn-xs btn-warning" type="button" name="templateUpload" data-placement="top" title="上传报备单模版" data-toggle="tooltip"><i class="fa fa-check"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="templateEdit" id="templateEdit" data-placement="top" title="查看" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
							//if((row.departId == 555555 && isCurrentUserHasRole) || row.departId != 555555) {
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="templateDelete" id="templateDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
							//}
							return renderStr;
						}
					}, {
						targets: 2,
						className: 'text-center',
						title: '模板类型',
						name: 'ruleTypeName',
						data: 'ruleTypeName',
						width: '50px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '模板名称',
						name: 'ruleName',
						data: 'ruleName',
						width: '80px'
					}, {
						targets: 4,
						className: 'text-center',
						title: '描述',
						name: 'remark',
						data: 'remark',
						width: '100px'
					}, {
						targets: 5,
						className: 'text-center',
						title: '是否必须',
						name: 'must',
						data: 'must',
						width: '40px'
					}, {
						targets: 6,
						className: 'text-center',
						title: '报告类型',
						name: 'reportType',
						data: 'reportType',
						width: '50px'
					}, {
						targets: 7,
						className: 'text-center',
						title: '报备单模版',
						name: 'fileName',
						data: 'fileName',
						width: '80px'
					}, {
						targets: 8,
						className: 'text-center',
						title: '创建者',
						name: 'CREATED_BYName',
						data: 'CREATED_BYName',
						width: '60px'
					}, {
						targets: 9,
						className: 'text-center',
						title: '创建时间',
						name: 'CREATION_DATE',
						data: 'CREATION_DATE',
						width: '80px'
					}, {
						targets: 10,
						className: 'text-center',
						title: '更新者',
						name: 'LAST_UPDATED_BYName',
						data: 'LAST_UPDATED_BYName',
						width: '60px'
					}
					, {
						targets: 11,
						className: 'text-center',
						title: '更新时间',
						name: 'LAST_UPDATE_DATE',
						data: 'LAST_UPDATE_DATE',
						width: '80px'
					}
				]
			}
		};
		BdoDataTable('bbSubjectAll_table', bbsubjectAll_tableview);
		/*$.ajax({
			url: 'cpBase/TBSubjectTemplate.getPublicTbPermissions.json',
			type: 'post',
			data: {},
			dataType: 'json',
			bdolxLoader: false,
		}).success(function(data) {
			if (data.success === true) {
				isCurrentUserHasRole = data.data[0].UserHavePermission;
			} else {
				isCurrentUserHasRole = false;
			}
		}).fail(function() {
			isCurrentUserHasRole = false;
		}).complete(function() {
			BdoDataTable('bbSubjectAll_table', bbsubjectAll_tableview);
		});*/
	};


	var bb_comtemplate_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',//
			order: [6, 'ASC'],
			ordering: false,
			serverSide: true,
			fixedColumns: false,
			rowReorder: {
				update: false
			},
			infoCallback: fnInfoCallback,
			initComplete: fnInitComplete,
			createdRow(row, data, dataIndex) {
				$(row).attr('data-row-id', dataIndex);
			},
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '<input type="hidden" name="tempAutoId" value="' + row.autoId + '">&nbsp;';
						//if((row.departId == '555555' && isCurrentUserHasRole) || row.departId != '555555'){
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						//}
						ruleAccDepartId = row.departId;
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '报备科目编号',
					name: 'bbSubjectId',
					data: 'bbSubjectId',
					width: '80px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '报备科目名称',
					name: 'bbSubjectName',
					data: 'bbSubjectName',
					width: '200px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(' ', '&nbsp;&nbsp;');
						}
					}
				}, {
					targets: 4,
					className: 'text-left',
					title: '合计公式',
					name: 'calFun',
					data: 'calFun',
					width: '200px',
					render: function(data, type, row, meta) {
						if (data != null) {
							if (data.length > 35) {
								var str = '<span title="' + data + '">';
								for (var i = 0; i < data.length / 35; i++) {
									str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
								}
								str += '</span>';
								return str;
							} else {
								return '<span>' + data + '</span>';
							}
						} else {
							return '<span></span>';
						}
					}
				}, {
					targets: 5,
					className: 'text-left',
					title: '所属报表',
					name: 'tableDiv',
					data: 'tableDiv',
					width: '100px'
				}, {
					targets: 6,
					className: 'text-left',
					title: '是否科目',
					name: 'isSubject',
					data: 'isSubject',
					width: '50px',
					render: function(data, type, row, meta) {
						if (data) {
							return '是';
						} else {
							return '否';
						}
					}
				}, {
					targets: 7,
					className: 'text-left',
					title: '排序号',
					name: 'sortNo',
					data: 'sortNo',
					width: '50px'
				}, {
					targets: 8,
					className: 'text-left',
					title: '报备科目显示名称',
					name: 'bbSubjectNameDisp',
					data: 'bbSubjectNameDisp',
					width: '200px',
					render: function(data, type, row, meta) {
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0) {
							return '<b>' + data + '</b>';
						} else {
							return data.replace(' ', '&nbsp;&nbsp;');
						}
					}
				}]
		}
	};

	//查询table
	$('#bbMaintain_search').on('click', function() {
		var tbTemplateId = $('#bbTemplate_vocationId').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择报备模板');
			return;
		}
		var params = {
			sqlId: 'FA40052',
			menuId: window.sys_menuId,
			start: -1,
			limit: -1,
			param1: tbTemplateId,
			param2: $('#bbTemplate_tableDiv').val()
		};

		bb_comtemplate_view.localParam.urlparam = params;
		BdoDataTable('bb_comtemplate_table', bb_comtemplate_view);
		$('#bb_template_select').text('【' + $('#bbTemplate_vocationId option:selected').text() + '】');
		$('#bb_template_select').attr('data-result', $('#bbTemplate_vocationId option:selected').val());

	});

	//查询模板一览
	$('#bbcomtemplate_search').on('click', function() {
		initTab1Table();
	});

	//链接到TB模板维护
	$('#bbSubjectAll_table').on('click', 'button[name="templateEdit"]', function() {
		//刷新最新的TB模板
		let select_html = ComboDBOption('cpBase/Combo.getBbRuleacc.json', false);
		$('#bbTemplate_vocationId').html(select_html);

		let object = $('#bbSubjectAll_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		var params = {
			sqlId: 'FA40052',
			menuId: window.sys_menuId,
			start: -1,
			limit: -1,
			param1: object.autoId,
			param2: $('#bbTemplate_tableDiv').val()
		};

		bb_comtemplate_view.localParam.urlparam = params;
		BdoDataTable('bb_comtemplate_table', bb_comtemplate_view);
		$('#bb_template_select').text('【' + object.ruleName + '】');
		$('#bb_template_select').attr('data-result', object.autoId);
		$('#bbTemplate_vocationId').val(object.autoId);
		$('#bbcom_templateName').val(object.ruleName);
		$('#bbcom_templateId').val(object.autoId);
		$('#bbcom_remark').val(object.remark);
		$('#bbcom_templateType').val(object.ruleType);
		$('#bbcom_reportType').val(object.reportType);
		$('#bbcom_must').val(object.must);
		$('#tab_bbMaintain').addClass('active');
		$('a[href="#tab_bbMaintain"]').parent().addClass('active');
		$('#tab_bbTemplate').removeClass('active');
		$('a[href="#tab_bbTemplate"]').parent().removeClass('active');
		$('a[href="#tab_bbMaintain"]').css('display', 'block');
	});

	//删除TB模板
	$('#bbSubjectAll_table').on('click', 'button[name="templateDelete"]', function() {
		let object = $('#bbSubjectAll_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		/*if(object.departId == 555555 && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '您没有权限编辑通用模板。');
		}*/
		//console.log('object:'+JSON.stringify(object));
		bdoConfirmBox('提示', '删除模板会删除与模板关联的所有数据，是否继续删除？', isConfirm => {
			$.ajax({
				url: 'cpBase/BBSubjectTemplate.deleteBBtemplate.json',
				type: 'post',
				data: {
					param1: object.autoId,
					param2: CUR_USERID
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#bbSubjectAll_table').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	/*$('#bbSubjectAll_table').on('click', 'button.tb-template-to-public', function(event) {
		var activeEl = $(event.currentTarget);
		var table = $('#bbSubjectAll_table').dataTable();
		var rowData = table.fnGetData(activeEl.attr('data-row'));
		if(!isCurrentUserHasRole) {
			bdoErrorBox('错误', '您没有权限将模板设置成通用模板。');
			return;
		}
		bdoConfirmBox('提示', '确定将改模板设置成通用模板吗？', isConfirm => {
			if(isConfirm) {
				$.ajax({
					url: 'cpBase/TBSubjectTemplate.saveToPublicTBTemplate.json',
					type: 'post',
					data: {
						param1: rowData.autoId
					},
					dataType: 'json',
				}).success(data => {
					if(data.success === true) {
						bdoInfoBox('设置成功', '该模板已设置成通用模板.');
					}
				});
			}
		});
	});*/
	//新增TB模板
	$('#bbcomtemplate_add').on('click', function() {
		$('#modal_bbcomtemplateform h3').html('新增模板');
		$('#bbcom_templateId').val('');
		$('#bbcom_inittemplateId').val('');
		$('#bbcom_templateName').val('');
		$('#bbcom_remark').val('');
		var ruleoption = ComboDBOption('cpBase/Combo.getBbRuleacc.json', false);
		$('#bbcom_inittemplateId').html(ruleoption);
		$('#modal_bbcomtemplateform').modal('show');
	});

	$('#bbcomtemplatecoladd_form').on('change', '#com_bbisSubject', function(event) {
		if ($('#com_bbisSubject option:selected').text() === '是') {
			$('#com_bbcalFun').val('');
		}
	});

	//修改TB模板
	$('#bb_comtemplate_edit').on('click', function() {
		var tbTemplateId = $('#bbTemplate_vocationId option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择报备模板');
			return;
		}
		$('#modal_bbcomtemplateform h3').html('修改模板');
		//$('#com_templateId').val($('#template_vocationId').val());
		//$('#com_templateName').val($('#template_vocationId option:selected').text());
		var ruleoption = ComboDBOption('cpBase/Combo.getBbRuleacc.json', false);
		$('#bbcom_inittemplateId').html(ruleoption);
		$('#modal_bbcomtemplateform').modal('show');

	});

	//添加科目
	$('#bb_comtemplatecol_add').on('click', function() {
		var tbTemplateId = $('#bbTemplate_vocationId option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择报备模板');
			return;
		}

		$('#com_bbTemplateId').val('');
		$('#com_bbsubjectId').val('');
		$('#com_bbsubjectName').val('');
		$('#com_bbsubjectNameDisp').val('');
		$('#com_bbisSubject').val(1);
		$('#com_bbcalFun').val('');
		$('#com_bbcalFun').prop('disabled', false);
		$('#modal_bbcomtemplatecoladdform').modal('show');
	});

	//修改模板科目
	$('#bb_comtemplate_table').on('click', 'button[name="subEdit"]', function() {
		/*if(ruleAccDepartId == '555555' && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置成通用模板，您没有操作权限。');
			return ;
		}*/
		/*var check = {
			'S001': 0, 'S002': 0, 'S003': 0, 'S004': 0, 'S005': 0, 'S006': 0,
			'TA01': 0, 'TA02': 0, 'TA03': 0
		};*/
		var object = $('#bb_comtemplate_table').DataTable().data()[$(this).parent().parent().attr('data-row-id')];
		$('#com_bbTemplateId').val(object.autoId);
		$('#com_bbsubjectId').val(object.bbSubjectId);
		$('#com_bbsubjectName').val(object.bbSubjectName);
		$('#com_bbsubjectNameDisp').val(object.bbSubjectNameDisp);
		$('#com_bbisSubject').val(object.isSubject + '');
		/*if (object.tbSubjectId in check) {
			$('#com_bbsubjectId').prop('disabled', true);
			$('#com_bbsubjectName').prop('disabled', true);
		} else {
			$('#com_bbsubjectId').prop('disabled', false);
			$('#com_bbsubjectName').prop('disabled', false);
		}
		if (object.isSubject) {
			$('#com_bbcalFun').prop('disabled', true);
		} else {
			$('#com_bbcalFun').prop('disabled', false);
		}*/
		$('#com_bbcalFun').val(object.calFun);
		$('#com_bbtableDiv').val(object.tableDivCode);
		$('#modal_bbcomtemplatecoladdform').modal('show');
	});

	//移除模板报表项
	$('#bb_comtemplate_table').on('click', 'button[name="subDelete"]', function() {
		var object = $('#bb_comtemplate_table').DataTable().data()[$(this).closest('tr').index()];
		//var patt1 = new RegExp('S001|S002|S003|S004|S005|S006|TA01|TA02|TA03|TB01|TB02|TB03|TB04|TB05|TB06|TB07|TB08|TB09|TB10|TB11|TB12|TB13|TC01|TC02|TC03|TC04|TC05|TC06|TC07|TC08|TC09');
		let tbSubjectId = object.bbSubjectId;

		let tbCal = '';
		tbSubjectMap.forEach((v, k) => {
			v && v.includes(object.bbSubjectId) && (tbCal = k);
		});
		if (tbCal) {
			bdoErrorBox('提示', `该科目已被科目【${tbCal}】中的公式引用，不能删除！`);
			return;
		}
		/*if (patt1.test(object.tbSubjectId)) {
			bdoInfoBox('提示信息', '该科目是必须包含的科目项，禁止删除!');
		} else {*/
			bdoConfirmBox('删除', '是否删除该科目？', function() {
				$.ajax({
					url: 'cpBase/BBSubjectTemplate.deleteBBSubject.json',
					type: 'post',
					data: {
						param1: object.autoId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success === true) {
							tbSubjectMap.delete(tbSubjectId);
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#bb_comtemplate_table').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		//}

	});

	//查看
	$('#bb_comtemplate_browse').on('click', function() {
		var tbTemplateId = $('#bbTemplate_vocationId').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择报备模板');
			return;
		}
		$('#tab2_bbTemplate').val($('#bb_template_select').attr('data-result'));
		//$('#tab_tbSubjectManage[data-toggle="tabs"] a').eq(2).click();
		$('#refreshBbReportBtn').click();

		$('#tab_bbReprot').addClass('active');
		$('a[href="#tab_bbReprot"]').parent().addClass('active');
		$('#tab_bbMaintain').removeClass('active');
		$('a[href="#tab_bbMaintain"]').parent().removeClass('active');
		$('a[href="#tab_bbReprot"]').css('display', 'block');
	});

	//排序
	$('#bb_comtemplatecol_sort').on('click', function() {
		var tbTemplate = $('#bb_template_select').attr('data-result');
		if (!tbTemplate) {
			bdoErrorBox('提示', '请选择报备模板');
			return;
		}
		/*if(ruleAccDepartId == '555555' && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置成通用模板，您没有操作权限。');
			return ;
		}*/
		bdoConfirmBox('提示', '是否按当前表格顺序保存', function() {
			var sortparam = [];
			$('#bb_comtemplate_table tbody tr').each(function() {
				sortparam.push($(this).find('[name="tempAutoId"]').val());
			});
			$.ajax({
				url: 'cpBase/BBSubjectTemplate.sortBBSubject.json',
				type: 'post',
				data: {
					param1: sortparam.toString(),
					param2: $('#bb_template_select').text()
				},
				dataType: 'json',
				success: function(data) {
					$('#bbsubject_table').DataTable().ajax.reload();
					isSort = false;
					if (data.success === true) {
						$('#bb_comtemplate_table').DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	//导出数据
	$('#bb_export_template').on('click', function() {
		var initValue = $('#bbTemplate_vocationId').val();
		if (!initValue) {
			bdoErrorBox('提示', '请先选择报备模板');
			return;
		}
		var init_table_view = {
			localParam: {
				tabNum: true,
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'FA40052',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: initValue,
					param2: $('#bbTemplate_tableDiv').val()
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
				order: [1, 'ASC'],
				ordering: true,
				serverSide: true,
				// rowReorder: {
				// 	update: false
				// },
				columnDefs: [{
					targets: 1,
					className: 'text-left',
					title: '报备科目编号',
					name: 'bbSubjectId',
					data: 'bbSubjectId',
					width: '80px'
				}, {
					targets: 2,
					className: 'text-left',
					title: '报备科目名称',
					name: 'bbSubjectName',
					data: 'bbSubjectName',
					width: '100px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '所属报表',
					name: 'tableDiv',
					data: 'tableDiv',
					width: '100px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '合计公式',
					name: 'calFun',
					data: 'calFun',
					width: '200px',
					render: function(data, type, row, meta) {
						if (data != null) {
							if (data.length > 35) {
								var str = '<span title="' + data + '">';
								for (var i = 0; i < data.length / 35; i++) {
									str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
								}
								str += '</span>';
								return str;
							} else {
								return '<span>' + data + '</span>';
							}
						} else {
							return '<span></span>';
						}
					}
				}, {
					targets: 5,
					className: 'text-left',
					title: '报备科目显示名称',
					name: 'bbSubjectNameDisp',
					data: 'bbSubjectNameDisp',
					width: '100px',
					render: function(data, type, row, meta){
						if (data.indexOf('合计') > 0 || data.indexOf('总计') > 0){
							return '<b>' + data + '</b>';
						}else{
							return data.replace(' ','&nbsp;&nbsp;');
						}
					}
				}]
			}
		};
		exportExcelBb(this, $('#bb_template_select').text(), init_table_view, 'bb_comtemplate_table');
	});

	//导入
	$('#bb_import_bbTemplate').click(function() {
		/*if(!isCurrentUserHasRole && ruleAccDepartId == '555555') {
			bdoErrorBox('错误', '该模板已设置为通用模板，您没有权限操作通用模板。');
			return;
		}*/
		let ruleName = $('#bb_template_select').text() == undefined ? '' : $('#bb_template_select').text();
		$('#bbsubjectmanage_ruleName').text(ruleName);
		$('#modal_import_bbTemplate').modal('show');
		//报表模板
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
			uploadUrl: 'cpBase/BBSubjectTemplate.importBBTemplate.json',
			uploadExtraData: function() {
				return {
					param1: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function() {
			return {
				param1: $('#bb_template_select').attr('data-result') == undefined ? '' : $('#bb_template_select').attr('data-result'),
				param2: $('#bb_template_select').text()
			};
		};
		var $el = $('#bb_template_fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('导入成功');
			$('#modal_import_bbTemplate').modal('hide');
			$('#bb_template_fileinput').fileinput('clear');
			$('#bb_template_fileinput').fileinput('enable');
			$('#bb_comtemplate_table').DataTable().ajax.reload();
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);
			uploadFileSuccess(data);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
			$('#bb_template_fileinput').fileinput('clear');
			$('#bb_template_fileinput').fileinput('enable');
			$('#bb_template_fileinput').val('');
			$('.fileinput-remove-button').click();
		}

		//建议文件上传成功之后再提交其他表单数据

		/** 导入按钮 */
		$('#import_bb_submit').on('click', function() {
			$el.fileinput('upload');
		});

		$('#modal_jnadjustform').one('hidden.bs.modal', function() {
			$('#import_bb_submit').off('click');
		});

	});

	/** 下载模板按钮 */
	$('#down_bb_Template').on('click', function() {
		var params = {
		};
		exportExcelWithTemplate('cpBase/BBSubjectTemplate.downbbSubjectMo.json', params);
	});

///////模板对照
	var bbReport_template_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40054',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			order: [2, 'ASC'],
			ordering: true,
			serverSide: true,
			infoCallback: fnInfoCallback,
			initComplete: fnInitComplete,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: 'text-center',
					title: '处理',
					width: '60px',
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success" type="button" name="compareDetail" data-placement="top" title="查看" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
						/*if(row.departId == 555555 && !isCurrentUserHasRole) {
							renderStr = '';
						}*/
						ruleAccDepartId = row.departId;
						//renderStr += '<button class="btn btn-xs btn-danger" type="button" name="compareDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: '报备模板名称',
					name: 'bbTemplateName',
					data: 'bbTemplateName',
					width: '80px'
				}, {
					targets: 3,
					className: 'text-left',
					title: '报表模板名称',
					name: 'reportTemplateName',
					data: 'reportTemplateName',
					width: '80px'
				}, {
					targets: 4,
					className: 'text-center',
					title: '已对照科目',
					name: 'compared',
					data: 'compared',
					width: '80px'
				}]
		}
	};

	//查询对照一栏
	$('#refreshBbReportBtn').on('click', function() {
		var tbTemplateId = $('#tab2_bbTemplate option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择报备模板!');
			return;
		}
		bbReport_template_view.localParam.urlparam.param2 = tbTemplateId;
		BdoDataTable('bbReportCompare', bbReport_template_view);
	});

	//查看
	$('#bbReportCompare').on('click', 'button[name="compareDetail"]', function() {
		var object = $('#bbReportCompare').DataTable().data()[$(this).closest('tr').index()];
		initBBRuleAcc();
		$('#tab3_bbTemplate').val(object.bbTemplateId);
		$('#bbsubject_rule').attr('data-result', object.vocationId);
		$('#bbsubject_rule').attr('data-content', object.reportTemplateName);
		$('#bbsubject_rule').attr('data-contentdata', object.reportTemplateName);
		$('#bbsubject_rule').val(object.reportTemplateName);
		//$('#tab_tbSubjectManage[data-toggle="tabs"] a').eq(3).click();
		$('#bbsubject_search').click();

		$('#tab_bbSubjectManager').addClass('active');
		$('a[href="#tab_bbSubjectManager"]').parent().addClass('active');
		$('#tab_bbReprot').removeClass('active');
		$('a[href="#tab_bbReprot"]').parent().removeClass('active');
		$('a[href="#tab_bbSubjectManager"]').css('display', 'block');
	});

	//新增对照
	$('#bb_contract_add').on('click', function() {
		/*if(ruleAccDepartId == 555555 && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置为通用模板，您没有权限操作通用模板。');
			return;
		}*/
		var tbTemplateId = $('#tab2_bbTemplate option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请选择报备模板');
			return;
		}
		var projectSettingForm;
		var callback = function(value) {
			/*var report = $('.swal2-select').attr('data-result');
			if (!report) {
				return false;
			}*/
			var res = projectSettingForm.jsonData.bbReportTemplate;
			if (!res) {
				bdoErrorBox('提示', '请选择报表模板');
				return;
			}

			$.ajax({
				type: 'post',
				url: 'cpBase/BBSubjectTemplate.updateBBReport.json',
				data: {
					param1: tbTemplateId,
					param2: res,
					param3: $('#tab2_bbTemplate option:selected').text()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						$('#refreshBbReportBtn').click();
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		};
		swal({
			title: '报表模板选择:',
			html: '<center><div id="bbprojectSettingForm"></div></center> ',
			type: 'warning',
			//input : 'select',
			inputPlaceholder: '报表模板',
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			showLoaderOnConfirm: true,
			allowOutsideClick: false,
			allowEscapeKey: false
		}).then(callback, function() {
		});
		var projectSettingFormCfg = {
			options: {
				propsData: {
					jsonData: {}
				}
			},
			props: {
				jsonData: Object
			},
			display: 'tableform-one',
			column: 6,
			id: 'bbprojectSettingForm',
			data() {
				return {};
			},
			items: [{
				id: 'bbReportTemplate',
				type: 'treecombo',
				//label : '报表模板',
				rowspan: 1,
				colspan: 6,
				validate: {
					rules: {
						//required : true
					}
				},
				plugin: {
					name: 'treecombo',
					options: {
						url: './cpBase/TreeCommon.findRuleaccTypeTree.json',
						params: {},
						view: {
							leafIcon: 'fa fa-file text-primary',
							nodeIcon: 'fa fa-folder text-primary',
							folderSelectable: false,
							multiSelect: false,
							positionValue: 'fixed'
						}
					}
				}
			}]
		};
		projectSettingForm = createForm(projectSettingFormCfg);
		$('#bbprojectSettingForm table').attr('class', '');
		$('.form-material').attr('style', 'margin:0px 0px 0px');

		$('.swal2-select').html(ComboDBOption('cpBase/Combo.getBbRuleacc.json', false));
	});

	//刷新对照
	$('#bb_report_contract').on('click', function() {
		var tbTemplate = $('#tab3_bbTemplate').val();
		var reportTemplate = $('#bbsubject_rule').attr('data-result');
		if (!tbTemplate) {
			bdoErrorBox('提示', '请选择TB模板');
			return;
		} else if (!reportTemplate) {
			bdoErrorBox('提示', '请选择报表模板');
			return;
		}
		bdoConfirmBox('提示', '是否重新对照' + $('#tab3_bbTemplate option:selected').text()
			+ '和' + $('#bbsubject_rule').attr('data-content'), function() {
			$.ajax({
				url: 'cpBase/BBSubjectTemplate.updateBBReport.json',
				type: 'post',
				data: {
					param1: tbTemplate,
					param2: reportTemplate,
					param3: $('#tab3_bbTemplate option:selected').text()
				},
				dataType: 'json',
				success: function(data) {
					$('#bbsubject_table').DataTable().ajax.reload();
					if (data.success === true) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	function initBBRuleAcc() {
		let ruleoption = ComboDBOption('cpBase/Combo.getBbRuleacc.json', false);
		$('#tab3_bbTemplate').html(ruleoption);
	}

	//刷新对照状态
	//var refreshColor = function() {};


	//弹出报表科目
	/*$('#tb_suspend').on('click', function() {
		if ($('#modal_report').is(':hidden')) {
			$('#modal_report').modal('show');
			setTimeout(function(){$('.modal-backdrop').remove();}, 500);
		} else {
			$('#modal_report').modal('hide');
		}
	});*/

	/*	$('#tab3_tbTemplate').on('change', function() {
			var ruleoptionForTB = ComboDBOptionWithParam('cpBase/Combo.getRuleaccForTB.json', false, {'param1' : $(this).val()});
			$('#tbsubject_rule').html(ruleoptionForTB);
		});*/
	//$('#tbcomtemplate_search').click();
	initTab1Table();
	//$('#comtemplate_search').click();
	//$('#refreshTbReportBtn').click();
	function parseCalFunItems(calFun) {
		if (!calFun) {
			return [];
		}
		let tmp = calFun.replace(/[-+*\/()]/g, ' ');
		return tmp.split(/\s+/).filter(v => v.replace(/\d/g, '') && v.replace(/\d+\.\d+/g, ''));
	}

	//上传
	$('#bbSubjectAll_table').on('click', 'button[name="templateUpload"]', function() {

		let object = $('#bbSubjectAll_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		var param1 = object.autoId;
		var param2 = object.ruleName;
		$('#modal_upload_bbTemplate').modal('show');
		//报表模板
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
			uploadUrl: 'cpBase/BBSubjectTemplate.uploadBBTemplate.json',
			uploadExtraData: function() {
				return {
					param1: '',
					param2: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function() {
			return {
				param1: param1,
				param2: param2
			};
		};
		$('#bb_upload_fileinput').fileinput('destroy');
		var $el = $('#bb_upload_fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('上传成功');
			$('#modal_upload_bbTemplate').modal('hide');
			$('#bb_upload_fileinput').fileinput('clear');
			$('#bb_upload_fileinput').fileinput('enable');
			$('#bbSubjectAll_table').DataTable().ajax.reload();
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);
			uploadFileSuccess(data);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
			$('#bb_upload_fileinput').fileinput('clear');
			$('#bb_upload_fileinput').fileinput('enable');
			$('#bb_upload_fileinput').val('');
			$('.fileinput-remove-button').click();
		}

		//建议文件上传成功之后再提交其他表单数据

		/** 导入按钮 */
		$('#upload_bb_submit').on('click', function() {
			$el.fileinput('upload');
		});
//modal_jnadjustform
		$('#modal_upload_bbTemplate').one('hidden.bs.modal', function() {
			$('#upload_bb_submit').off('click');
		});

	});
	//报备校验
	$('#bb_qy_check').click(function() {
		$('#qy_check_detail').modal('show');
		qy_check_view.localParam.urlparam.param1 = $('#bb_template_select').attr('data-result') == undefined ? '' : $('#bb_template_select').attr('data-result');
		BdoDataTable('qy_check_table', qy_check_view);
	});
	var qy_check_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40058',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: ''
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			//order : [1, 'ASC'],
			//ordering : true,
			serverSide: true,
			columnDefs: [{
				targets: 1,
				className: 'text-left',
				title: '本期校验公式',
				name: 'column1',
				data: 'column1',
				width: '80px',
				render(data, tyep, row, meta) {
					if(data != null){
						let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
						return resultStr;
					}else{
						return data;
					}
				}
			}, {
				targets: 2,
				className: 'text-left',
				title: '上期校验公式',
				name: 'column2',
				data: 'column2',
				width: '80px',
				render(data, tyep, row, meta) {
					if(data != null){
						let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
						return resultStr;
					}else{
						return data;
					}
				}
			},{
				targets: 3,
				className: 'text-left',
				title: '校验公式显示名',
				name: 'checkFunName',
				data: 'checkFunName',
				width: '200px',
				render(data, tyep, row, meta) {
					if(data != null){
						let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
						return resultStr;
					}else{
						return data;
					}
				}
			},{
				targets: 4,
				className: 'text-left',
				title: '是否合并',
				name: 'mergeType',
				data: 'mergeType',
				width: '70px'
			}]
		}
	};
	$('#export_qy_check').on('click', function() {
		//var label = $('#bbcom_inittemplateId').treecombo('getTreeComboLabel');
		exportExcel(this, "报备校验", qy_check_view, 'qy_check_table');
		return false;
	});
	//上传权益表校验
	$('#upload_qy_check').click(function() {
		let ruleName = $('#bb_template_select').text() == undefined ? '' : $('#bb_template_select').text();
		$('#bbQyCheck_ruleName').text(ruleName);
		$('#modal_import_qyCheck').modal('show');
		//报表模板
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
			uploadUrl: 'cpBase/BBSubjectTemplate.importBBQyCheck.json',
			uploadExtraData: function() {
				return {
					param1: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function() {
			return {
				param1: $('#bb_template_select').attr('data-result') == undefined ? '' : $('#bb_template_select').attr('data-result'),
				param2: $('#bb_template_select').text()
			};
		};
		var $el = $('#bb_qycheck_fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('导入成功');
			$('#modal_import_qyCheck').modal('hide');
			$('#bb_qycheck_fileinput').fileinput('clear');
			$('#bb_qycheck_fileinput').fileinput('enable');
			$('#export_qy_check').DataTable().ajax.reload();
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);
			uploadFileSuccess(data);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
			$('#bb_qycheck_fileinput').fileinput('clear');
			$('#bb_qycheck_fileinput').fileinput('enable');
			$('#bb_qycheck_fileinput').val('');
			$('.fileinput-remove-button').click();
		}

		//建议文件上传成功之后再提交其他表单数据

		/** 导入按钮 */
		$('#import_bb_qy').on('click', function() {
			$el.fileinput('upload');
		});

		$('#modal_import_qyCheck').one('hidden.bs.modal', function() {
			$('#import_bb_qy').off('click');
		});

	});

	/** 下载模板按钮 */
	$('#down_bb_qy').on('click', function() {
		var params = {
		};
		exportExcelWithTemplate('cpBase/BBSubjectTemplate.downbbQyCheckMo.json', params);
	});
})();

