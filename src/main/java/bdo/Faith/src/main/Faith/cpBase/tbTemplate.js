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
	var ruleoption = ComboDBOption('cpBase/Combo.getTbRuleacc.json', false);
	let createNameOption = ComboDBOption('cpBase/Combo.getTbRuleaccByName.json', false);
	$('#tbsubject_create').html('<option value="" selected="selected"></option>' + createNameOption);
	//$('#tbsubject_name').html('<option value="" selected="selected"></option>'+ruleoption);
	$('#template_vocationId').html(ruleoption/* +'<option value=0>默认模板</option>'*/);
	$('#tab2_tbTemplate').html('<option></option>' + ruleoption);
	$('#tab3_tbTemplate').html('<option></option>' + ruleoption);


	//修改模板参数
	$('#comtemplatecoledit_close').click(function() {
		$('#modal_comtemplatecolEditform').modal('hide');
	});


	var initTemplate = function() {
		//新增模板form参数
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
					},
					rowspan: 1,
					colspan: 2
				}, {
					id: 'com_templateName',
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
					id: 'com_remark',
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
					id: 'com_inittemplateId',
					type: 'input',
					label: '<label class="css-input css-checkbox css-checkbox-primary css-checkbox-sm"><input type="checkbox" id="initTemplateCheck" value="1"><span></span>初始化模板</label>',
					rowspan: 1,
					colspan: 2,
					plugin: {
						name: 'treecombo',
						options: {
							url: 'cpBase/TreeCommon.findgTbRuleaccTree.json',
							//添加参数，取消初始化tb模板的分页
							params: {limit: 100000},
							view: {
								leafIcon: 'fa fa-building text-flat',
								nodeIcon: 'fa fa-bank text-primary-light',
								folderSelectable: false,
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

		var buttonHtml = '<button class="btn btn-primary" type="button" style="margin-left: 4.5%;background-color:#46bbff" id="tb_template_datail">' +
			'<i class="fa fa-save" style="margin-right:8px;"></i><span>&nbsp;查看</span></button>';

		var $formSelect = $('#com_inittemplateId');
		$formSelect.parent().css({'width': '80%', 'display': 'inline-block'});
		$formSelect.closest('td').append(buttonHtml);
		$('#tb_template_datail').on('click', function() {
			var initValue = $('#com_inittemplateId').treecombo('getTreeComboValue');
			if (!initValue) {
				return;
			}
			var init_table_view = {
				localParam: {
					tabNum: true,
					url: 'cpBase/General.query.json',
					urlparam: {
						sqlId: 'FA40031',
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
						title: 'TB科目编号',
						name: 'tbSubjectId',
						data: 'tbSubjectId',
						width: 'auto'
					}, {
						targets: 2,
						className: 'text-left',
						title: 'TB科目名称',
						name: 'tbSubjectName',
						data: 'tbSubjectName',
						width: 'auto'
					}, {
						targets: 3,
						className: 'text-left',
						title: '计算公式',
						name: 'calFun',
						data: 'calFun',
						render: function(data, type, row, meta) {
							if (data != null) {
								if (data.length > 35) {
									var str = '<span title="' + data + '">';
									for (var i = 0; i < data.length / 35; i++) {
										str += data.substring(i * 33, (i + 1) * 33) + '<br/>';
									}
									str += '</span>';
									return str;
									/*if(data[34] == '+'){
										return '<span title="'+data+'">'+data.substring(0,33)+'+....'+'</span>'
									}else{
										return '<span title="'+data+'">'+data.substring(0,34)+'+....'+'</span>'
									}*/
								} else {
									return '<span>' + data + '</span>';
								}
							} else {
								return '<span></span>';
							}
						}
					}]
				}
			};
			BdoDataTable('init_tamplate_table', init_table_view);
			$('#export_detail').off();
			$('#export_detail').on('click', function() {
				exportExcel(this, $('#com_inittemplateId option:selected').text(), init_table_view, 'init_tamplate_table');
				return false;
			});
			$('#init_tamplate_detail').modal('show');
		});
	};
	initTemplate();
	//新增科目form参数
	$('#comtemplatecoladd_form').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'comSubject_save',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'

			}, {
				id: 'comSubject_close',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}
		],
		items: [
			{
				id: 'com_tbTemplateId',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			}, {
				id: 'com_subjectId',
				type: 'input',
				label: '科目编号',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'com_subjectName',
				type: 'input',
				label: '科目名称',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'com_isSubject',
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
				id: 'com_calFun',
				type: 'input',
				label: '计算公式',
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
	$('#com_isSubject').html(ComboLocalDicOption(false, 'boolean'));

	$('#com_isSubject').on('change', function() {
		if ($(this).val() == 1) {
			$('#com_calFun').prop('disabled', true);
		} else {
			$('#com_calFun').prop('disabled', false);
		}
	});

	//删除左右两端的空格
	function trim(str) {
		if(typeof str == 'string') {
			return str.trim();
		}
		return str;
	}

	//保存tb科目
	$('#comSubject_save').on('click', function() {
		let str = new RegExp(/^[A-Za-z].*/);
		let curTbSubjectId = $('#com_subjectId').val();
		let curTbSubjectName = $('#com_subjectName').val();
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
		if (nameReg.test(curTbSubjectName)) {
			bdoInfoBox('提示', '科目名称不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
			return false;
		}
		let calItems = parseCalFunItems($('#com_calFun').val());
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
		if (reg.test($('#com_subjectId').val())) {
			$.ajax({
				url: 'cpBase/TBSubjectTemplate.saveTBSubject.json',
				data: {
					param1: $('#com_tbTemplateId').val(),
					param2: $('#com_subjectId').val(),
					param3: trim($('#com_subjectName').val()),
					param4: $('#template_select').attr('data-result'),
					param5: $('#com_isSubject').val(),
					param6: encodeURIComponent($('#com_calFun').val())
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
					$('#comtemplate_table').DataTable().ajax.reload();
					$('#modal_comtemplatecoladdform').modal('hide');
				}
			});
		} else {
			bdoInfoBox('提示', '科目编号必须以字母开头数字结尾!');
		}

	});

	//关闭tb科目对话框
	$('#comSubject_close').on('click', function() {
		$('#modal_comtemplatecoladdform').modal('hide');
	});

	//关闭界面
	$('#comtemplate_close').on('click', function() {
		$('#modal_comtemplateform').modal('hide');
	});

	//保存新增模板
	$('#comtemplate_save').on('click', function() {
		var initFlag = 0;
		if ($('#initTemplateCheck').is(':checked')) {
			initFlag = 1;
		}
		$.ajax({
			url: 'cpBase/TBSubjectTemplate.saveTBTemplate.json',
			data: {
				param1: $('#com_templateId').val(),
				param2: $('#com_templateName').val(),
				param3: initFlag,
				param4: $('#com_inittemplateId').treecombo('getTreeComboValue'),
				param5: $('#com_remark').val()
			},
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
					return;
				}
				$('#tbcomtemplate_search').click();
				$('#modal_comtemplateform').modal('hide');
				let select_html = ComboDBOption('cpBase/Combo.queryTbRuleacc.json', false);
				if(window.menuArgs && window.menuArgs[sys_menuId] && window.menuArgs[sys_menuId].debug == true) {
					console.log(select_html);
				}
				if(!window.menuArgs) {
					window.menuArgs = {};
				}
				if(!window.menuArgs[sys_menuId]) {
					window.menuArgs[sys_menuId] = {};
				}
				window.menuArgs[sys_menuId].tbTmplSelectHtml = select_html;
				let val1 = $('#template_vocationId').val();
				let val2 = $('#tab2_tbTemplate').val();
				let val3 = $('#tab3_tbTemplate').val();
				let val4 = $('#tbsubject_name').val();

				$('#template_vocationId').html(select_html);
				$('#tab2_tbTemplate').html('<option></option>' + select_html);
				$('#tab3_tbTemplate').html('<option></option>' + select_html);
				$('#tbsubject_name').html('<option value="" selected="selected"></option>' + select_html);

				$('#template_vocationId').val(val1 ? val1 : '');
				$('#tab2_tbTemplate').val(val2 ? val2 : '');
				$('#tab3_tbTemplate').val(val3 ? val3 : '');
				$('#tbsubject_name').val(val4 ? val4 : '');
				if(window.menuArgs && window.menuArgs[sys_menuId] && window.menuArgs[sys_menuId].debug == true) {
					debugger;
				}
			}
		});
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
		b.data.forEach(row => tbSubjectMap.set(row.tbSubjectId, parseCalFunItems(row.calFun)));
	};
	var initTab1Table = function() {
		let tbsubjectAll_tableview = {
			localParam: {
				tabNum: true,
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'FA40047',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: $('#tbsubject_name').val(),
					param2: $('#tbsubject_remark').val(),
					param3: $('#tbsubject_create').val(),
					param4: departIdrSession
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
				scrollY: 516,
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
							if(row.departId != 555555 && isCurrentUserHasRole){
								renderStr += ('<button class="btn btn-xs btn-warning tb-template-to-public" type="button"  data-placement="top" title="设为通用模板" data-toggle="tooltip" data-row="' + meta.row + '"><i class="fa fa-check"></i></button>&nbsp;');
							}
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="templateEdit" id="templateEdit" data-placement="top" title="查看" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
							if((row.departId == 555555 && isCurrentUserHasRole) || row.departId != 555555) {
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="templateDelete" id="templateDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>&nbsp;';
							}
							return renderStr;
						}
					}, {
						targets: 2,
						className: 'text-center',
						title: '模板名称',
						name: 'ruleName',
						data: 'ruleName',
						width: '80px'
					}, {
						targets: 3,
						className: 'text-center',
						title: '描述',
						name: 'remark',
						data: 'remark',
						width: '100px'
					}, {
						targets: 4,
						className: 'text-center',
						title: '创建者',
						name: 'CREATED_BYName',
						data: 'CREATED_BYName',
						width: '60px'
					}, {
						targets: 5,
						className: 'text-center',
						title: '创建时间',
						name: 'CREATION_DATE',
						data: 'CREATION_DATE',
						width: '80px'
					}, {
						targets: 6,
						className: 'text-center',
						title: '更新者',
						name: 'LAST_UPDATED_BYName',
						data: 'LAST_UPDATED_BYName',
						width: '60px'
					}
					, {
						targets: 7,
						className: 'text-center',
						title: '更新时间',
						name: 'LAST_UPDATE_DATE',
						data: 'LAST_UPDATE_DATE',
						width: '80px'
					}
				]
			}
		};
		$.ajax({
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
			BdoDataTable('tbsubjectAll_table', tbsubjectAll_tableview);
		});
	};


	var comtemplate_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			//dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			order: [2, 'ASC'],
			pageLength: 30,
			ordering: false,
			serverSide: true,
			rowReorder: {
				update: false
			},
			scrollY: 516,
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
						if((row.departId == '555555' && isCurrentUserHasRole) || row.departId != '555555'){
							renderStr += '<button class="btn btn-xs btn-success" type="button" name="subEdit" data-placement="top" title="修改" data-toggle="tooltip"><i class="fa fa-edit"></i></button>&nbsp;';
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="subDelete" data-placement="top" title="删除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
						}
						ruleAccDepartId = row.departId;
						return renderStr;
					}
				}, {
					targets: 2,
					className: 'text-left',
					title: 'TB科目编号',
					name: 'tbSubjectId',
					data: 'tbSubjectId',
					width: '80px'
				}, {
					targets: 3,
					className: 'text-left',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
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
					title: '计算公式',
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
								/*if(data[34] == '+'){
									return '<span title="'+data+'">'+data.substring(0,33)+'+....'+'</span>'
								}else{
									return '<span title="'+data+'">'+data.substring(0,34)+'+....'+'</span>'
								}*/
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
					targets: 6,
					className: 'text-left',
					title: '排序号',
					name: 'sortNo',
					data: 'sortNo',
					width: '50px'
				}/*, {
					targets : 4,
					className : 'text-center',
					title : '类别',
					name : 'subjectTypeName',
					data : 'subjectTypeName',
					width : '80px'
				}*/]
		}
	};

	//查询table
	$('#comtemplate_search').on('click', function() {
		var tbTemplateId = $('#template_vocationId').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择TB模板');
			return;
		}
		var params = {
			sqlId: 'FA40031',
			menuId: window.sys_menuId,
			start: -1,
			limit: -1,
			param1: tbTemplateId
		};

		comtemplate_view.localParam.urlparam = params;
		BdoDataTable('comtemplate_table', comtemplate_view);
		$('#template_select').text('【' + $('#template_vocationId option:selected').text() + '】');
		$('#template_select').attr('data-result', $('#template_vocationId option:selected').val());

	});

	//查询模板一览
	$('#tbcomtemplate_search').on('click', function() {
		initTab1Table();
	});

	//链接到TB模板维护
	$('#tbsubjectAll_table').on('click', 'button[name="templateEdit"]', function() {
		//刷新最新的TB模板
		let select_html = ComboDBOption('cpBase/Combo.getTbRuleacc.json', false);
		$('#template_vocationId').html(select_html);

		let object = $('#tbsubjectAll_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		//console.log("object:"+JSON.stringify(object))
		/*if(object.departId == 555555 && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '您没有权限编辑通用模板。');
			return;
		}*/
		var params = {
			sqlId: 'FA40031',
			menuId: window.sys_menuId,
			start: -1,
			limit: -1,
			param1: object.autoId
		};

		comtemplate_view.localParam.urlparam = params;
		BdoDataTable('comtemplate_table', comtemplate_view);
		$('#template_select').text('【' + object.ruleName + '】');
		$('#template_select').attr('data-result', object.autoId);
		$('#template_vocationId').val(object.autoId);
		$('#com_templateName').val(object.ruleName);
		$('#com_templateId').val(object.autoId);
		$('#com_remark').val(object.remark);


		$('#tab_template').addClass('active');
		$('a[href="#tab_template"]').parent().addClass('active');
		$('#tab_tbtemplate').removeClass('active');
		$('a[href="#tab_tbtemplate"]').parent().removeClass('active');
		$('a[href="#tab_template"]').css('display', 'block');
	});

	//删除TB模板
	$('#tbsubjectAll_table').on('click', 'button[name="templateDelete"]', function() {
		let object = $('#tbsubjectAll_table').DataTable().data()[$(this).closest('tr').attr('data-row-id')];
		if(object.departId == 555555 && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '您没有权限编辑通用模板。');
		}
		//console.log('object:'+JSON.stringify(object));
		bdoConfirmBox('提示', '删除模板会删除与模板关联的所有数据，是否继续删除？', isConfirm => {
			$.ajax({
				url: 'cpBase/TBSubjectTemplate.deleteTBtemplate.json',
				type: 'post',
				data: {
					param1: object.autoId,
					param2: CUR_USERID
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#tbsubjectAll_table').DataTable().ajax.reload();
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	$('#tbsubjectAll_table').on('click', 'button.tb-template-to-public', function(event) {
		var activeEl = $(event.currentTarget);
		var table = $('#tbsubjectAll_table').dataTable();
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
	});
	//新增TB模板
	$('#comtemplate_add').on('click', function() {
		$('#modal_comtemplateform h3').html('新增模板');
		$('#com_templateId').val('');
		$('#com_inittemplateId').val('');
		$('#com_templateName').val('');
		$('#com_remark').val('');
		var ruleoption = ComboDBOption('cpBase/Combo.getCurrentTBRuleacc.json', false);
		$('#com_inittemplateId').html(ruleoption);
		$('#modal_comtemplateform').modal('show');
	});

	$('#comtemplatecoladd_form').on('change', '#com_isSubject', function(event) {
		if ($('#com_isSubject option:selected').text() === '是') {
			$('#com_calFun').val('');
		}
	});

	//修改TB模板
	$('#comtemplate_edit').on('click', function() {
		var tbTemplateId = $('#template_vocationId option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择TB模板');
			return;
		}
		if(ruleAccDepartId == '555555' && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置为通用模板，您没有权限操作通用模板。');
			return
		}
		$('#modal_comtemplateform h3').html('修改模板');
		//$('#com_templateId').val($('#template_vocationId').val());
		//$('#com_templateName').val($('#template_vocationId option:selected').text());
		var ruleoption = ComboDBOption('cpBase/Combo.getCurrentTBRuleacc.json', false);
		$('#com_inittemplateId').html(ruleoption);
		$('#modal_comtemplateform').modal('show');

	});

	//添加科目
	$('#comtemplatecol_add').on('click', function() {
		var tbTemplateId = $('#template_vocationId option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择TB模板');
			return;
		}

		$('#com_tbTemplateId').val('');
		$('#com_subjectId').val('');
		$('#com_subjectName').val('');
		$('#com_isSubject').val(1);
		$('#com_calFun').val('');
		$('#com_calFun').prop('disabled', true);
		$('#modal_comtemplatecoladdform').modal('show');
	});

	//修改模板科目
	$('#comtemplate_table').on('click', 'button[name="subEdit"]', function() {
		if(ruleAccDepartId == '555555' && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置成通用模板，您没有操作权限。');
			return ;
		}
		var check = {
			'S001': 0, 'S002': 0, 'S003': 0, 'S004': 0, 'S005': 0, 'S006': 0,
			'TA01': 0, 'TA02': 0, 'TA03': 0
		};
		var object = $('#comtemplate_table').DataTable().data()[$(this).parent().parent().attr('data-row-id')];
		$('#com_tbTemplateId').val(object.autoId);
		$('#com_subjectId').val(object.tbSubjectId);
		$('#com_subjectName').val(object.tbSubjectName);
		$('#com_isSubject').val(object.isSubject + '');
		if (object.tbSubjectId in check) {
			$('#com_subjectId').prop('disabled', true);
			$('#com_subjectName').prop('disabled', true);
		} else {
			$('#com_subjectId').prop('disabled', false);
			$('#com_subjectName').prop('disabled', false);
		}
		if (object.isSubject) {
			$('#com_calFun').prop('disabled', true);
		} else {
			$('#com_calFun').prop('disabled', false);
		}
		$('#com_calFun').val(object.calFun);
		$('#modal_comtemplatecoladdform').modal('show');
	});

	//移除模板报表项
	$('#comtemplate_table').on('click', 'button[name="subDelete"]', function() {
		var object = $('#comtemplate_table').DataTable().data()[$(this).closest('tr').index()];
		var patt1 = new RegExp('S001|S002|S003|S004|S005|S006|TA01|TA02|TA03|TB01|TB02|TB03|TB04|TB05|TB06|TB07|TB08|TB09|TB10|TB11|TB12|TB13|TC01|TC02|TC03|TC04|TC05|TC06|TC07|TC08|TC09');
		let tbSubjectId = object.tbSubjectId;

		let tbCal = '';
		tbSubjectMap.forEach((v, k) => {
			v && v.includes(object.tbSubjectId) && (tbCal = k);
		});
		if (tbCal) {
			bdoErrorBox('提示', `该科目已被科目【${tbCal}】中的公式引用，不能删除！`);
			return;
		}

		if (patt1.test(object.tbSubjectId)) {
			bdoInfoBox('提示信息', '该科目是必须包含的科目项，禁止删除!');
		} else {
			bdoConfirmBox('删除', '是否删除该科目？', function() {
				$.ajax({
					url: 'cpBase/TBSubjectTemplate.deleteTBSubject.json',
					type: 'post',
					data: {
						param1: object.autoId
					},
					dataType: 'json',
					success: function(data) {
						if (data.success === true) {
							tbSubjectMap.delete(tbSubjectId);
							bdoSuccessBox('成功', data.resultInfo.statusText);
							$('#comtemplate_table').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		}

	});

	//查看
	$('#comtemplate_browse').on('click', function() {
		var tbTemplateId = $('#template_vocationId').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择TB模板');
			return;
		}
		$('#tab2_tbTemplate').val($('#template_select').attr('data-result'));
		//$('#tab_tbSubjectManage[data-toggle="tabs"] a').eq(2).click();
		$('#refreshTbReportBtn').click();

		$('#tab_tbReprot').addClass('active');
		$('a[href="#tab_tbReprot"]').parent().addClass('active');
		$('#tab_template').removeClass('active');
		$('a[href="#tab_template"]').parent().removeClass('active');
		$('a[href="#tab_tbReprot"]').css('display', 'block');
	});

	//排序
	$('#comtemplatecol_sort').on('click', function() {
		var tbTemplate = $('#template_select').attr('data-result');
		if (!tbTemplate) {
			bdoErrorBox('提示', '请选择TB模板');
			return;
		}
		if(ruleAccDepartId == '555555' && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置成通用模板，您没有操作权限。');
			return ;
		}
		bdoConfirmBox('提示', '是否按当前表格顺序保存', function() {
			var sortparam = [];
			$('#comtemplate_table tbody tr').each(function() {
				sortparam.push($(this).find('[name="tempAutoId"]').val());
			});
			$.ajax({
				url: 'cpBase/TBSubjectTemplate.sortTBSubject.json',
				type: 'post',
				data: {
					param1: sortparam.toString(),
					param2: $('#template_select').text()
				},
				dataType: 'json',
				success: function(data) {
					$('#tbsubject_table').DataTable().ajax.reload();
					isSort = false;
					if (data.success === true) {
						$('#comtemplate_table').DataTable().ajax.reload();
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	//导出数据
	$('#export_template1').on('click', function() {
		var initValue = $('#template_vocationId').val();
		if (!initValue) {
			bdoErrorBox('提示', '请先选择TB模板');
			return;
		}
		var init_table_view = {
			localParam: {
				tabNum: true,
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'FA40031',
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
				order: [1, 'ASC'],
				ordering: true,
				serverSide: true,
				// rowReorder: {
				// 	update: false
				// },
				columnDefs: [{
					targets: 2,
					className: 'text-left',
					title: 'TB科目编号',
					name: 'tbSubjectId',
					data: 'tbSubjectId',
					width: '80px'
				}, {
					targets: 3,
					className: 'text-left',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '100px'
				}, {
					targets: 6,
					className: 'text-left',
					title: '计算公式',
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
				}]
			}
		};
		exportExcel6(this, $('#template_select').text(), init_table_view, 'comtemplate_table');
	});

	//导入
	$('#import_tbTemplate').click(function() {
		if(!isCurrentUserHasRole && ruleAccDepartId == '555555') {
			bdoErrorBox('错误', '该模板已设置为通用模板，您没有权限操作通用模板。');
			return;
		}
		let ruleName = $('#template_select').text() == undefined ? '' : $('#template_select').text();
		$('#tbsubjectmanage_ruleName').text(ruleName);
		$('#modal_import_tbTemplate').modal('show');
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
			uploadUrl: 'cpBase/TBSubjectTemplate.importTBTemplate.json',
			uploadExtraData: function() {
				return {
					param1: ''
				};
			}
		};

		pluginOpt.uploadExtraData = function() {
			return {
				param1: $('#template_select').attr('data-result') == undefined ? '' : $('#template_select').attr('data-result'),
				param2: $('#template_select').text()
			};
		};
		var $el = $('#tb_template_fileinput').fileinput(pluginOpt);

		//uploadAsync = true 时调用
		$el.on('fileuploaded', function(event, data) {
			bdoSuccessBox('导入成功');
			$('#modal_import_tbTemplate').modal('hide');
			$('#tb_template_fileinput').fileinput('clear');
			$('#tb_template_fileinput').fileinput('enable');
			$('#comtemplate_table').DataTable().ajax.reload();
		});
		//uploadAsync = true 时，后台返回数据data.error 非空是调用
		$el.on('fileuploaderror', function(event, data, msg) {
			bdoErrorBox('系统提示', data.response.resultInfo.statusText ? data.response.resultInfo.statusText : msg);
			uploadFileSuccess(data);
		});

		//文件上传成功/失败后，处理后台响应函数
		function uploadFileSuccess(data) {
			$('#tb_template_fileinput').fileinput('clear');
			$('#tb_template_fileinput').fileinput('enable');
			$('#tb_template_fileinput').val('');
			$('.fileinput-remove-button').click();
		}

		//建议文件上传成功之后再提交其他表单数据

		/** 导入按钮 */
		$('#import_tb_submit').on('click', function() {
			$el.fileinput('upload');
		});

		$('#modal_jnadjustform').one('hidden.bs.modal', function() {
			$('#import_tb_submit').off('click');
		});

	});

	/** 下载模板按钮 */
	$('#down_tb_Template').on('click', function() {
		var params = {
			param1: 5
		};
		exportExcelWithTemplate('cpBase/TBSubjectTemplate.downtbSubjectMo.json', params);
	});

///////模板对照
	var tbReport_template_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40033',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: departIdrSession
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
			scrollY: 516,
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
					title: 'TB模板名称',
					name: 'tbTemplateName',
					data: 'tbTemplateName',
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
	$('#refreshTbReportBtn').on('click', function() {
		var tbTemplateId = $('#tab2_tbTemplate option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请先选择TB模板!');
			return;
		}
		tbReport_template_view.localParam.urlparam.param2 = tbTemplateId;
		BdoDataTable('tbReportCompare', tbReport_template_view);
	});

	//查看
	$('#tbReportCompare').on('click', 'button[name="compareDetail"]', function() {
		var object = $('#tbReportCompare').DataTable().data()[$(this).closest('tr').index()];
		initTBRuleAcc();
		$('#tab3_tbTemplate').val(object.tbTemplateId);
		$('#tbsubject_rule').attr('data-result', object.vocationId);
		$('#tbsubject_rule').attr('data-content', object.reportTemplateName);
		$('#tbsubject_rule').attr('data-contentdata', object.reportTemplateName);
		$('#tbsubject_rule').val(object.reportTemplateName);
		//$('#tab_tbSubjectManage[data-toggle="tabs"] a').eq(3).click();
		$('#tbsubject_search').click();

		$('#tab_tbSubjectManager').addClass('active');
		$('a[href="#tab_tbSubjectManager"]').parent().addClass('active');
		$('#tab_tbReprot').removeClass('active');
		$('a[href="#tab_tbReprot"]').parent().removeClass('active');
		$('a[href="#tab_tbSubjectManager"]').css('display', 'block');
	});

	//新增对照
	$('#contract_add').on('click', function() {
		if(ruleAccDepartId == 555555 && !isCurrentUserHasRole) {
			bdoErrorBox('错误', '该模板已设置为通用模板，您没有权限操作通用模板。');
			return;
		}
		var tbTemplateId = $('#tab2_tbTemplate option:selected').val();
		if (!tbTemplateId) {
			bdoErrorBox('提示', '请选择TB模板');
			return;
		}
		var projectSettingForm;
		var callback = function(value) {
			/*var report = $('.swal2-select').attr('data-result');
			if (!report) {
				return false;
			}*/
			var res = projectSettingForm.jsonData.tbReportTemplate;
			if (!res) {
				bdoErrorBox('提示', '请选择报表模板');
				return;
			}

			$.ajax({
				type: 'post',
				url: 'cpBase/TBSubjectTemplate.updateTBReport.json',
				data: {
					param1: tbTemplateId,
					param2: res,
					param3: $('#tab2_tbTemplate option:selected').text()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						$('#refreshTbReportBtn').click();
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		};
		swal({
			title: '报表模板选择:',
			html: '<center><div id="projectSettingForm"></div></center> ',
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
			id: 'projectSettingForm',
			data() {
				return {};
			},
			items: [{
				id: 'tbReportTemplate',
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
		$('#projectSettingForm table').attr('class', '');
		$('.form-material').attr('style', 'margin:0px 0px 0px');

		$('.swal2-select').html(ComboDBOption('cpBase/Combo.getCurrentRuleacc.json', false));
	});

	//刷新对照
	$('#tb_report_contract').on('click', function() {
		var tbTemplate = $('#tab3_tbTemplate').val();
		var reportTemplate = $('#tbsubject_rule').attr('data-result');
		if (!tbTemplate) {
			bdoErrorBox('提示', '请选择TB模板');
			return;
		} else if (!reportTemplate) {
			bdoErrorBox('提示', '请选择报表模板');
			return;
		}else if (ruleAccDepartId == '555555' && !isCurrentUserHasRole){
			bdoErrorBox('提示', '该模板为通用模板，您没有权限操作通用模板。');
			return;
		}
		bdoConfirmBox('提示', '是否重新对照' + $('#tab3_tbTemplate option:selected').text()
			+ '和' + $('#tbsubject_rule').attr('data-content'), function() {
			$.ajax({
				url: 'cpBase/TBSubjectTemplate.updateTBReport.json',
				type: 'post',
				data: {
					param1: tbTemplate,
					param2: reportTemplate,
					param3: $('#tab3_tbTemplate option:selected').text()
				},
				dataType: 'json',
				success: function(data) {
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

	function initTBRuleAcc() {
		let ruleoption = ComboDBOption('cpBase/Combo.getTbRuleacc.json', false);
		$('#tab3_tbTemplate').html('<option></option>' + ruleoption);
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
})();

