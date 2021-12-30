$(document).ready(function() {
	var endMonth;
	var tagsTable;
	let tbEditerId;
	tagsTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00083',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					start: -1,
					limit: -1
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			pageLength: 30,
			scrollX: true,
			scrollY: '170px',
			select: true,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			// paging: false,
			fixedHeight: '460px',
			columnDefs: [{
				targets: 1,
				orderable: true,
				title: '标签',
				name: 'autoId',
				data: 'autoId',
				width: '60px',
				render: function(data, type, row, meta) {
					let renderStr = '<a href=\"#\">' + 'p' + data + '</a>';
					return renderStr;
				}
			}, {
				targets: 2,
				orderable: false,
				title: '标签名',
				name: 'tagName',
				data: 'tagName',
				width: '100px'
			}, {
				targets: 3,
				orderable: true,
				title: '标签属性',
				className: 'text-center',
				name: 'tagProperty',
				data: 'tagProperty',
				renderer: 'getDicLabelByVal|标签属性',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '标签属性');
				}
			}, {
				targets: 4,
				orderable: true,
				title: '标签类型',
				className: 'text-center',
				name: 'tagType',
				data: 'tagType',
				renderer: 'getDicLabelByVal|标签类型',
				width: '60px',
				render(data) {
					return DicVal2Nm(data, '标签类型');
				}
			}, {
				targets: 5,
				orderable: true,
				title: '位置',
				name: 'otherPosition',
				data: 'otherPosition',
				width: '100px'
			}, {
				targets: 6,
				orderable: false,
				title: '详细位置',
				name: 'tagPosition',
				data: 'tagPosition',
				width: '100px',
				render: function(data, type, row, meta) {
					let renderStr = data;
					if(row.tagType === 'dg' || row.tagType === 'note'){
						renderStr = '<a href=\"#\">' + data + '</a>'
					}
					return renderStr;
				}
			}, {
				targets: 7,
				orderable: false,
				className: 'text-right',
				title: '标签值',
				name: 'tagValue',
				data: 'tagValue',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr = formatMoney(data);
					return renderStr;
				}
			}, {
				targets: 8,
				orderable: false,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'tagName',
				width: '40px',
				render: function(data, type, row, meta) {
					let renderStr = '<button class=\"btn btn-xs btn-default\" type=\"button\" title=\"删除标签\"><i class=\"fa fa-close\"></i><input type=\"text\" value=\"' + data + '\" style=\"display: none;\"></button>';
					return renderStr;
				}
			}, {
				targets: 9,
				name: 'tagDgId',
				data: 'tagDgId',
				visible: false
			}, {
				targets: 10,
				name: 'tagInfo',
				data: 'tagInfo',
				visible: false
			}
			]
		}
	};
	var formulaTable;
	formulaTable = {
		localParam: {
			url: 'dgCenter/DgGeneral.query.json',
			urlparam: (() => {
				let param = {
					menuId: window.sys_menuId,
					sqlId: 'DG00114',
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: '',
					start: -1,
					limit: -1
				};
				return param;
			})(),
			tabNum: true
		},
		tableParam: {
			scrollX: true,
			scrollY: '270px',
			select: true,
			ordering: false,
			order: [1, 'asc'],
			serverSide: true,
			fixedThead: true,
			fixedHeight: '400px',
			columnDefs: [{
				targets: 1,
				orderable: false,
				className: 'text-center',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '60px'
			}, {
				targets: 2,
				orderable: false,
				className: 'text-center',
				title: '科目名称',
				name: 'subjectName',
				data: 'subjectName',
				width: '60px',
				render: function(data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 3,
				orderable: false,
				title: '公式',
				name: 'formula',
				data: 'formula',
				width: '100px',
				render: function(data, type, row, meta) {
					var pAutoId = data.split(/[\+\-\=]+/);
					var sign = data.split(/[^\+\-\=]+/).splice(1, data.split(/[^\+\-\=]+/).length - 2);
					var text = row.formulaText.split(/[\+\-\=]+/);
					var renderStr = '<a name="tag" href="#" title="' + text[0] + '">' + pAutoId[0];
					for(let i = 1;i < pAutoId.length;i++){
						renderStr += '</a><label>' + sign[i - 1] + '</label><a name="tag" href="#" title="' + text[i] + '">' + pAutoId[i];
					}
					renderStr += '</a>';
					return renderStr;
				}
			}, {
				targets: 4,
				orderable: false,
				title: '公式信息',
				name: 'formulaText',
				data: 'formulaText',
				width: '100px',
				render: function(data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 5,
				orderable: false,
				title: '公式值',
				name: 'formulaValue',
				data: 'formulaValue',
				width: '100px',
				render: function(data, type, row, meta) {
					renderStr = '<label>' + data + '</label>';
					return renderStr;
				}
			}, {
				targets: 6,
				orderable: false,
				className: 'text-center',
				title: '公式校验结果',
				name: 'formulaCalc',
				data: 'formulaCalc',
				width: '80px',
				render: function(data, type, row, meta) {
					if (data == 1) {
						var renderStr = '<span class=\"label label-success\"><i class=\"fa fa-check\"></i> 通过</span>';
						return renderStr;
					} else if (data == 0) {
						var renderStr = '<span class=\"label label-danger\"><i class=\"fa fa-times\"></i> 未通过</span>';
						return renderStr;
					}
				}
			}, {
				targets: 7,
				orderable: false,
				title: '校验时间',
				name: 'updateTime',
				data: 'updateTime',
				width: '100px',
				render(data) {
					return new Date(data).format('yyyy-MM-dd HH:mm:ss');
				}
			}, {
				targets: 8,
				orderable: false,
				title: '操作',
				className: 'text-center',
				name: 'operate',
				data: 'autoId',
				width: '80px',
				render: function(data, type, row, meta) {
					let renderStr = '<button class=\"btn btn-xs btn-success\" name=\"editFormula\" type=\"button\" title=\"修改校验公式\"><i class=\"fa fa-edit\"></i></button>';
					renderStr += '&nbsp;<button class=\"btn btn-xs btn-success\" name=\"delFormula\" type=\"button\" title=\"删除校验公式\"><i class=\"fa fa-trash-o\"></i></button>';
					return renderStr;
				}
			}
			]
		}
	};
	let projectYear = '';

	//借贷方向下拉选
	$('#direction_select').html(ComboLocalDicOption(false,'借贷方向',false));
	// 设置公式
	/*$('#formulaModal [data-toggle="tabs"] a').click(function(e) {
		e.preventDefault();
		jQuery(this).tab('show');
	});*/
	function querEndMonth() {
		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.searchProjectEndMonth.json',
			async: true,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					endMonth = data.data[0]['ext'].endMonth;
					tbEditerId =  data.data[0]['ext'].tbEditer;
					setTbeEditerSelect();
				}
			}
		});
	}

	querEndMonth();
	function setTbeEditerSelect(){
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgProject.getProjectMember.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: window.CUR_CUSTOMERID
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					let tbEditer = '<option value="" label="" />';
					data.data.map(item => {
						if (tbEditerId ==  item.id) {
							tbEditer+='<option style="color: #000000"  value="'+ item.id+'" label="'+item.name+'" selected />';
						}else {
							tbEditer+='<option style="color: #000000"  value="'+ item.id+'" label="'+item.name+'" />';
						}
						// return {id: item.id, text: item.name, value: item.name};
					});
					$('#tb_editer').append(tbEditer);
				}else {
					$('#tb_editer').val('');
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});
	}
	$('#tb_editer').change(function () {
		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.saveTbEditer.json',
			//async : false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param2: '1',
				param3: $(this).val(),
				param4: $(this).find('option:selected').attr('label')
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox("保存TB编制人成功！");
					// $('#tb_editer').append(tbEditer);
				}else {
					bdoErrorBox(data.resultInfo.statusText);
				}
			}
		});


	});

	$('#formulaModal [data-toggle="tabs"] a').on('show.bs.tab', function(evt) {
		var href = evt.target.href;
		var index = href.lastIndexOf('#');
		var id = href.substring(index + 1);
		switch (id) {
			case 'tagTab':
				$('#tagsTable').DataTable().ajax.reload();
				break;
			case 'formulaTab':
				var referredAutoId;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					async: true,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00113',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: 'TB',
						param4: $('#formulaSubjectId').val(),
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (data.data[0] != null) {
								referredAutoId = data.data[0].infoFormula;
							}
						}
					}
				});
				if (referredAutoId == '') {
					referredAutoId = '0';
				}
				formulaTable.localParam.urlparam.param3 = referredAutoId;
				BdoDataTable('formulaTable', formulaTable);
				break;
			default:
				break;
		}
	});

	$('#formulaModal').on('show.bs.modal', function(e) {
		BdoDataTable('tagsTable', tagsTable);
		$('#tagGroup').html('');
		$('#tagsTable tbody').on('click', 'td button', function() {
			var cellAlias = this.lastElementChild.value;
			$.ajax({
				type: 'post',
				url: 'dgCenter/DgCheck.deleteTag.json',
				// async : false,
				data: {
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: cellAlias,
					start: -1,
					limit: -1
				},
				dataType: 'json',
				success(data) {
					if (data.success) {
						$('#tagsTable').DataTable().ajax.reload();
						bdoSuccessBox('成功', '删除标签成功！');
					}
				}
			});
		});
		$('#tagsTable tbody').on('click', 'td a', function() {
			var colIndex = $(this).parents('td').index();
			if (colIndex === 6) {
				var rowIndex = $(this).parents('tr').index();
				var rowData = $('#tagsTable').DataTable().row(rowIndex).data();
				if (rowData.tagDgId != null) {
					let tagInfo = JSON.parse(rowData.tagInfo)[0];
					if(tagInfo.type == 'dg'){
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							// async : false,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00078',
								param1: window.CUR_CUSTOMERID,
								param2: window.CUR_PROJECTID,
								param3: tagInfo.workpaperId,
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									// 打开底稿
									var nodeData = {
										extraOptions: data.data[0],
										currentNode: {
											extraOptions: data.data[0]
										}
									};
									nodeData.autoId = nodeData.extraOptions.autoId;
									nodeData.workpaperId = nodeData.extraOptions.workpaperId;
									nodeData.menuId = window.sys_menuId;
									$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
									$.sessionStorage('cellLinkFormula', '');
									$.sessionStorage('cellLinkFormulaBySheetName', '');
									$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
									window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
								}
							}
						});
					} else if(tagInfo.type == 'note'){
						$.ajax({
							type: 'post',
							url: 'dgCenter/DgGeneral.query.json',
							// async: true,
							data: {
								menuId: window.sys_menuId,
								sqlId: 'DG00092',
								param1: tagInfo.noteAutoId,
								param2: window.CUR_CUSTOMERID,
								param3: window.CUR_PROJECTID,
								start: -1,
								limit: -1
							},
							dataType: 'json',
							success(data) {
								if (data.success) {
									var nodeData = {
										extraOptions: data.data[0],
										currentNode: {
											extraOptions: data.data[0]
										}
									};
									nodeData.autoId = nodeData.extraOptions.autoId;
									nodeData.menuId = window.sys_menuId;
									$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
									$.sessionStorage('cellLinkFormula', '');
									$.sessionStorage('cellLinkFormulaBySheetName', '');
									$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
									window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					}
				}
			} else if (colIndex === 1) {
				let length = $('#tagGroup .col-sm-1 input').length;
				let txt;
				if (length > 0) {
					txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div><div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
				} else {
					txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"></div></div>');
				}
				$('#tagGroup').append(txt);
				$('#tagGroup .col-sm-1 input')[length].value = $(this).text();
				$('#tagGroup .col-sm-1 input')[length].title = $(this).parent().next().text();
			}
		});
	});

	$('#uodoTagBtn').click((event) => {
		var length1 = $('#tagGroup .col-sm-1 input').length;
		if (length1 > 0) {
			$('#tagGroup .col-sm-1')[length1 * 2 - 2].remove();
		}
		var length2 = $('#tagGroup .col-sm-1 select').length;
		if (length2 > 0) {
			$('#tagGroup .col-sm-1')[length2 * 2 - 1].remove();
		}
	});
	$('#formulaTable').on('click', 'a[name="tag"]', function() {
		var tagid = $(this).text().substring(1);
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00235',
				param1: tagid,
				param2: window.CUR_CUSTOMERID,
				param3: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if (data.data[0] != null) {
						var tagInfo = JSON.parse(data.data[0].tagInfo)[0];
						if(tagInfo.type == 'dg'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async : false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00078',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: tagInfo.workpaperId,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										// 打开底稿
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.workpaperId = nodeData.extraOptions.workpaperId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openWorkpaper&index=' + nodeData.extraOptions.indexId + '&projectId=' + nodeData.extraOptions.projectId);
									}
								}
							});
						} else if(tagInfo.type == 'note'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async: false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00092',
									param1: tagInfo.noteAutoId,
									param2: window.CUR_CUSTOMERID,
									param3: window.CUR_PROJECTID,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.autoId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('noteInfoNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openDgNoteInfo&noteNo=' + nodeData.extraOptions.noteNo + '&projectId=' + nodeData.extraOptions.projectId);
									} else {
										bdoErrorBox('失败', data.resultInfo.statusText);
									}
								}
							});
						} else if(tagInfo.type == 'db'){
							var yyyy = tagInfo.whereParam.substr(tagInfo.whereParam.indexOf('yyyy') + 7, 4);
							var text = '该标签为试算平衡表"' + tagInfo.subjectName + '"的"' + yyyy;
							var field = tagInfo.field;
							if(field == 'unAuditAmount'){
								text += '年未审数';
							}else if(field == 'adjustAmount'){
								text += '年审计调整数';
							}else if(field == 'auditAmount'){
								text += '年审定数"';
							}
							swal(text);
						} else if(tagInfo.type == 'function'){
							var field = tagInfo.field;
							var yyyy = 0;
							if(field.indexOf('current') != -1){
								yyyy = parseInt(tagInfo.yyyy);
							} else {
								yyyy = parseInt(tagInfo.yyyy) - 1;
							}
							var text = '';
							if(field.indexOf('Before') != -1){
								text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '未审数"';
							}else if(field.indexOf('Adjust') != -1){
								text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '调整数"';
							}else if(field.indexOf('After') != -1){
								text += '该标签为导引表"' + tagInfo.subjectName + '"的"' + yyyy + '审定数"';
							}
							swal(text);
						} else if(tagInfo.type == 'report'){
							var text = '该标签为报表"' + tagInfo.colName + tagInfo.colCode + '"的"' + tagInfo.reportValDesc + '"';
							swal(text);
						} else if(tagInfo.type == 'auditReport'){
							$.ajax({
								type: 'post',
								url: 'dgCenter/DgGeneral.query.json',
								// async : false,
								data: {
									menuId: window.sys_menuId,
									sqlId: 'DG00224',
									param1: window.CUR_CUSTOMERID,
									param2: window.CUR_PROJECTID,
									param3: tagInfo.workpaperId,
									start: -1,
									limit: -1
								},
								dataType: 'json',
								success(data) {
									if (data.success) {
										// 打开底稿
										var nodeData = {
											extraOptions: data.data[0],
											currentNode: {
												extraOptions: data.data[0]
											}
										};
										nodeData.autoId = nodeData.extraOptions.workpaperId;
										nodeData.workpaperId = nodeData.extraOptions.workpaperId;
										nodeData.menuId = window.sys_menuId;
										$.sessionStorage('subjecttreeNode', JSON.stringify(nodeData));
										$.sessionStorage('cellLinkFormulaBySheetName', JSON.stringify(tagInfo.tagPosition.substr(tagInfo.tagPosition.indexOf(':') + 1)));
										window.open('/Faith/dgcenter.do?m=openQYXJFile&projectId=' + nodeData.extraOptions.projectId);
									}
								}
							});
						}
					}
				}
			}
		});
	});
	$('#formulaTable').on('click', 'button[name="editFormula"]', function() {
		var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
		$('#tagGroup').html('');
		var title = object.formulaText.split(/[\+\-\=]+/);
		var text = object.formula.split(/[\+\-\=]+/);
		var sign = object.formula.split(/[^\+\-\=]+/);
		var txt;
		for (var i = 0; i < text.length; i++) {
			txt = $('<div class=\"col-sm-1\"><div class=\"form-material input-group\"><input class=\"form-control\" type=\"text\" value=\"' + text[i] + '\" title=\"' + title[i] + '\" readonly=\"readonly\"></div></div>');
			$('#tagGroup').append(txt);
			if (i + 1 < sign.length - 1) {
				txt = $('<div class=\"col-sm-1\"><div class=\"form-material\"><select class=\"form-control\"><option value=\"\"></option><option value=\"=\">=</option><option value=\"+">+</option><option value=\"-\">-</option></select></div></div>');
				$('#tagGroup').append(txt);
				$('#tagGroup .col-sm-1 select')[i].value = sign[i + 1];
			}
		}
		$('#formulaModal [data-toggle="tabs"] a:first').tab('show');
	});
	$('#formulaTable').on('click', 'button[name="delFormula"]', function() {
		var object = $('#formulaTable').DataTable().data()[$(this).closest('tr').index()];
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgCheck.delFormula.json',
			// async: false,
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: object.autoId
			},
			dataType: 'json',
			success(data) {
				var referredAutoId;
				$.ajax({
					type: 'post',
					url: 'dgCenter/DgGeneral.query.json',
					// async: false,
					data: {
						menuId: window.sys_menuId,
						sqlId: 'DG00113',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						param3: 'TB',
						param4: $('#formulaSubjectId').val(),
						start: -1,
						limit: -1
					},
					dataType: 'json',
					success(data) {
						if (data.success) {
							if (data.data[0] != null) {
								referredAutoId = data.data[0].infoFormula;
							}
						}
					}
				});
				if (referredAutoId == '') {
					referredAutoId = '0';
				}
				formulaTable.localParam.urlparam.param3 = referredAutoId;
				$('#formulaTable').DataTable().ajax.reload();
				bdoSuccessBox('成功', '成功删除校验公式！');
			}
		});
	});
	$('#checkFormulaBtn').click((event) => {
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgCheck.checkFormula.json',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: 'TB',
				param4: $('#formulaSubjectId').val(),
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					swal({
						title: '正在校验中...',
						html: '请稍后查看!',
						type: 'info',
						allowOutsideClick: false,
						allowEscapeKey: false,
						timer: 3000
					}).catch(swal.noop);
				}
			}
		});
	});

	function getTagValue(inputText) {
		let tagValue = 0;
		let tagId = inputText.replace('p', '');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			// async: false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00235',
				param1: tagId,
				param2: window.CUR_CUSTOMERID,
				param3: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					tagValue = data.data[0].tagValue;
				}
			}
		});
		return parseFloat(tagValue).toFixed(2);
	}

	$('#ensureProjectTagBtn').click((event) => {
		var length = $('#tagGroup .col-sm-1 select').length;
		if (length == 0) {
			bdoErrorBox('失败', '请正确设置公式！');
			$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
			return;
		}
		var formula = $('#tagGroup .col-sm-1 input')[0].value;
		var formulaText = $('#tagGroup .col-sm-1 input')[0].title;

		var inputFirstValue = $('#tagGroup .col-sm-1 input')[0].value;
		var formulaValue = getTagValue(inputFirstValue);
		for (var i = 0; i < length; i++) {
			var inputValue = $('#tagGroup .col-sm-1 input')[i + 1].value;
			var selectValue = $('#tagGroup .col-sm-1 select')[i].value;
			if (selectValue == '') {
				$('#tagGroup .col-sm-1 select')[i].focus();
				bdoErrorBox('失败', '请选择运算符号！');
				return;
			}
			formula = formula + selectValue + inputValue;
			formulaText = formulaText + selectValue + $('#tagGroup .col-sm-1 input')[i + 1].title;

			var value = getTagValue(inputValue);
			formulaValue = formulaValue + selectValue + value;
		}
		if (formula.indexOf('=') === -1 || formula.indexOf('=') !== formula.lastIndexOf('=')) {
			bdoErrorBox('失败', '请正确设置公式！');
			return;
		}
		// 等式左边值
		var formulaValueLeft = formulaValue.substring(0, formulaValue.indexOf('='));
		// 取得具体数值数组
		var formulaValueListLeft = formulaValueLeft.split(/[\+\-]+/);
		// 取得运算符号数组
		var signListLeft = formulaValueLeft.split(/[^\+\-]+/);
		let formulaCalcLeft = formulaValueListLeft[0] == '' ? 0 : formulaValueListLeft[0];
		var formulaValueLeftNew = formulaCalcLeft.toString();
		if (signListLeft.length > 1) {
			let startNumLeft = 1;
			if (signListLeft[0] == '-') {
				startNumLeft = 0;
			}
			for (let i = startNumLeft; i < signListLeft.length - 1; i++) {
				let signLeft = signListLeft[i];
				let signValueLeft = formulaValueListLeft[i + 1 - startNumLeft];
				if (signLeft === '+') {
					formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
				} else if (signLeft === '-') {
					formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
				} else if (signLeft === '+-') {
					formulaCalcLeft = parseFloat(formulaCalcLeft) - parseFloat(signValueLeft);
				} else if (signLeft === '--') {
					formulaCalcLeft = parseFloat(formulaCalcLeft) + parseFloat(signValueLeft);
				}
			}
		}
		// 等式右边值
		var formulaValueRight = formulaValue.substring(formulaValue.indexOf('=') + 1);
		// 取得具体数值数组
		var formulaValueListRight = formulaValueRight.split(/[\+\-]+/);
		// 取得运算符号数组
		var signListRight = formulaValueRight.split(/[^\+\-]+/);
		let formulaCalcRight = formulaValueListRight[0] == '' ? 0 : formulaValueListRight[0];
		if (signListRight.length > 1) {
			let startNumRight = 1;
			if (signListRight[0] == '-') {
				startNumRight = 0;
			}
			for (let i = startNumRight; i < signListRight.length - 1; i++) {
				let signRight = signListRight[i];
				let signValueRight = formulaValueListRight[i + 1 - startNumRight];
				if (signRight === '+') {
					formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
				}
				if (signRight === '-') {
					formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
				}
				if (signRight === '+-') {
					formulaCalcRight = parseFloat(formulaCalcRight) - parseFloat(signValueRight);
				}
				if (signRight === '--') {
					formulaCalcRight = parseFloat(formulaCalcRight) + parseFloat(signValueRight);
				}
			}
		}
		// 等式左边等于等式右边 1:计算结果正确
		if (parseFloat(formulaCalcLeft).toFixed(2) == parseFloat(formulaCalcRight).toFixed(2)) {
			var formulaCal = '1';
		} else {
			var formulaCal = '0';
		}
		let formulaAutoId = formula.replace(/p/g,'');
		let tagAllId = formulaAutoId.replace(/=/g,',').replace(/\+/g,',').replace(/-/g,',');
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgCheck.setProjectFormula.json',
			// async : false,
			data: {
				menuId: window.sys_menuId,
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				param3: formula.replace(/\+/g, '%2B'),
				param4: formulaText.replace(/\+/g, '%2B'),
				param5: formulaValue.replace(/\+/g, '%2B'),
				param6: formulaCal,
				param7: formulaAutoId.replace(/\+/g, '%2B'),
				param8: $('#formulaSubjectId').val(),
				param9: $('#formulaSubjectName').val(),
				param10: tagAllId,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					bdoSuccessBox('成功', '设置校验数据公式成功！');
					$('#formulaModal [data-toggle="tabs"] a:last').tab('show');
					$('#tagGroup .col-sm-1').remove();
				} else {
					bdoErrorBox('失败', '设置校验数据公式失败！');
				}
			}
		});
	});

	//pageRightTitle(pageTitleArr);
	uiBlocksApi(false, 'init');
	var formId = 'regist_form';
	var table = 'example';

	/*	$('.modal').on('show.bs.modal', function(){
		$(this).draggable({
			handle: '.block-header',
			cursor: 'move'
		});
		$(this).css('overflow', 'hidden');
	});*/
	$('#search_customerId').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);

	// 日期
	// getUserYear('search_yyyy');
	// $('#search_yyyy').val(CUR_PROJECT_START_YEAR);


	var tbReportTemplate = '-1';
	projectYear = window.CUR_PROJECT_ACC_YEAR;
	$.ajax({
		url: 'dgCenter/DgAdjust.findProjectInfo.json',
		type: 'post',
		async: true,
		data: {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID
		},
		dataType: 'json',
		success: function(data) {
			if (!data.data || !data.data[0].tbTemplate || !data.data[0].tbReportTemplate) {
				//bdoErrorBox('失败', '请先完成项目配置');
				return;
			}
			tbReportTemplate = data.data[0].tbReportTemplate;
		}
	});
	let node = $('.js-tree-collapsed').treeview(true).getSelected()[0];
	$('#title_index').text('【' + node.extraOptions.indexId + '】');
	$('#headtitle').empty().text(node.text);
	//$('#cus_select1').text('【' + CUR_PROJECTNAME+'   ' + projectYear + '-' + CUR_PROJECT_START_MONTH + '~' + projectYear + '-' + CUR_PROJECT_END_MONTH + '】');
	$('#cus_select2').text('【' + window.CUR_PROJECTNAME + '   ' + projectYear + '-' + window.CUR_PROJECT_START_MONTH + '~' + projectYear + '-' + window.CUR_PROJECT_END_MONTH + '】');
	/** table 属性 */
	var tbcontract_view = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/FTBSubjectContract.queryContactData.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param2: $("#selectYear").val(),
				param10: $('#show_contrast').val(),
				refreshFlg:1
			}
		},
		tableParam: {
			select: true,
			lengthChange: true,
			pageLength: 1000,
			setCol: false,
			ordering: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			serverSide: true,
			columnDefs: [{
				targets: 0,
				orderable: false,
				className: 'text-center',
				title: '序号',
				width: '30px',
				visible: true,
				render: function(data, type, row, meta) {
					return meta.settings._iDisplayStart + meta.row + 1;
				}
			},

				{
					targets: 1,
					index: 1,
					orderable: false,
					className: 'text-left',
					title: '处理',
					data: null,
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						if (row.isLeaf0 == 0 && (row.remain != 0 || row.debitTotalOcc != 0 || row.creditTotalOcc != 0 || row.balance != 0)) {
							renderStr += '<button class="btn btn-xs btn-info table-btn-operate" type="button" name="rowShowSub" data-placement="top" title="展开下级" data-toggle="tooltip">'
								+ '<i class="fa fa-plus"></i></button>';
						}

						if (row.tbSubjectName == '' || row.tbSubjectName == null || row.userSubjectName == '' || row.userSubjectName == null) {
							renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowRelation" data-placement="top" title="对照 " data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
						} else {
							renderStr += '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowRelation" data-placement="top" title="重新对照 " data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
						}

						if (row.level0 > 1) {
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelRelation" data-placement="top" title="删除 " data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}
						if (row.userDefined) {
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowEditUserSubject" data-placement="top" title="修改财务科目 " data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
							renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowDelUserSubject" data-placement="top" title="删除财务科目 " data-toggle="tooltip">'
								+ '<i class="fa fa-times"></i></button>';
						}
						/*if(row.tbSubjectName != '' && row.tbSubjectName != null && row.level0 == 1){
						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="rowCancelRelation" data-placement="top" title="解除对照 " data-toggle="tooltip">'
						+ '<i class="fa fa-ban"></i></button>';
					}*/
						//借方发生额。
						let debitTotalOcc = row.debitTotalOcc;
						//借方发生额(剔除结转)
						let debitTotalOccNoTran = row.debitTotalOccNoTran;
						//贷方发生额
						let creditTotalOcc = row.creditTotalOcc;
						//贷方发生额（剔除结转）
						let creditTotalOccNoTran = row.creditTotalOccNoTran;
						let direction = row.direction;
						if (row.reportSubjectId && row.reportSubjectId.startsWith('S')) {
							if ('借' == direction) {
								if (debitTotalOcc != debitTotalOccNoTran || creditTotalOccNoTran > 0) {
									renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="setproAndLos" data-placement="top" title="设置损益结转" data-toggle="tooltip">' +
										'<i class="fa fa-random"></i></button>';
								}
							} else {
								if (creditTotalOcc != creditTotalOccNoTran || debitTotalOccNoTran > 0) {
									renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="setproAndLos" data-placement="top" title="设置损益结转" data-toggle="tooltip">' +
										'<i class="fa fa-random"></i></button>';
								}
							}
						}

						return renderStr;
					}
				}, {
					targets: 2,
					index: 2,
					orderable: false,
					className: 'text-left',
					title: '客户科目编号',
					name: 'userSubjectId',
					data: 'userSubjectId',
					width: '100px'
				}, {
					targets: 3,
					index: 3,
					orderable: false,
					className: 'text-left',
					title: '客户科目名称',
					name: 'userSubjectName',
					data: 'userSubjectName',
					width: '100px'
				}, {
					targets: 4,
					index: 4,
					orderable: false,
					className: 'text-left',
					title: 'TB科目编号',
					name: 'tbSubjectCode',
					data: 'tbSubjectCode',
					width: '90px'
				}, {
					targets: 5,
					index: 5,
					orderable: false,
					className: 'text-left',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '100px'
				}, {
					targets: 6,
					index: 6,
					orderable: false,
					className: 'text-left',
					title: '标准科目编号',
					name: 'baseSubjectId',
					data: 'baseSubjectId',
					width: '90px'
				}, {
					targets: 7,
					index: 7,
					orderable: false,
					className: 'text-left',
					title: '标准科目名称',
					name: 'baseSubjectName',
					data: 'baseSubjectName',
					width: '100px'
				}, {
					targets: 8,
					index: 8,
					orderable: false,
					title: '期初数',
					className: 'text-right',
					name: 'remain',
					data: 'remain',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}/*,{
				targets : 8,
				orderable : true,
				title : '借方期初',
				className : 'text-right',
				name : 'debitRemain',
				data : 'debitRemain',
				width : '100px',
				render: function(data, type, row, meta){
					return formatMoney(data);
				}
			}, {
				targets : 9,
				orderable : true,
				title : '贷方期初',
				className : 'text-right',
				name : 'creditRemain',
				data : 'creditRemain',
				width : '100px',
				render: function(data, type, row, meta){
					return formatMoney(data);
				}
			}*/, {
					targets: 9,
					index: 9,
					orderable: false,
					title: '借方发生额',
					className: 'text-right',
					name: 'debitTotalOcc',
					data: 'debitTotalOcc',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 10,
					index: 10,
					orderable: false,
					title: '借方发生额（剔除结转）',
					className: 'text-right',
					name: 'debitTotalOccNoTran',
					data: 'debitTotalOccNoTran',
					width: '170px',
					render: function(data, type, row, meta) {
						//借方发生额。
						let debitTotalOcc = row.debitTotalOcc;
						//借方发生额(剔除结转)
						let debitTotalOccNoTran = row.debitTotalOccNoTran;
						// //贷方发生额
						// let creditTotalOcc = row.creditTotalOcc;
						// //贷方发生额（剔除结转）
						// let creditTotalOccNoTran = row.creditTotalOccNoTran;
						let direction = row.direction;
						//借方科目 【借方发生额】 不等于 【借方剔除结转发生额】时 借方剔除结转发生额添加背景色
						//贷方科目 【借方剔除结转发生额】>0 时 借方剔除结转发生额添加背景色
						let data2 = formatMoney(data);
						if (row.reportSubjectId && row.reportSubjectId.startsWith('S')) {
							if ('借' == direction) {
								if (debitTotalOcc != debitTotalOccNoTran) {
									html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + data2 + '</span>';
									return html;
								}
							} else {
								if (debitTotalOccNoTran > 0) {
									html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + data2 + '</span>';
									return html;
								}
							}
						}
						return formatMoney(data);
						/*					if (data == row.debitTotalOcc) {
						if (row.userSubjectId.substr(0,1) == 6) {
							var data2 = formatMoney(data);
							html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + data2 + '</span>';
							return html;
						} else {
							return formatMoney(data);
						}
					} else {
						return formatMoney(data);
					}*/
					}
				}, {
					targets: 11,
					index: 11,
					orderable: false,
					title: '贷方发生额',
					className: 'text-right',
					name: 'creditTotalOcc',
					data: 'creditTotalOcc',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: 12,
					index: 12,
					orderable: false,
					title: '贷方发生额（剔除结转）',
					className: 'text-right',
					name: 'creditTotalOccNoTran',
					data: 'creditTotalOccNoTran',
					width: '170px',
					render: function(data, type, row, meta) {
						//借方发生额。
						// let debitTotalOcc =row.debitTotalOcc;
						//借方发生额(剔除结转)
						// let debitTotalOccNoTran = row.debitTotalOccNoTran;
						//贷方发生额
						let creditTotalOcc = row.creditTotalOcc;
						//贷方发生额（剔除结转）
						let creditTotalOccNoTran = row.creditTotalOccNoTran;
						let direction = row.direction;
						// 贷方科目 【贷方发生额】 不等于 【贷方剔除结转发生额】时 贷方剔除结转发生额添加背景色
						// 借方科目 【贷方剔除结转发生额】>0 时 【贷方剔除结转发生额】添加背景色
						let data2 = formatMoney(data);
						if (row.reportSubjectId && row.reportSubjectId.startsWith('S')) {
							if ('借' == direction) {
								if (creditTotalOccNoTran > 0) {
									html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + data2 + '</span>';
									return html;
								}
							} else {
								if (creditTotalOcc != creditTotalOccNoTran) {
									html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + data2 + '</span>';
									return html;
								}
							}
						}
						return formatMoney(data);
						/*		if (data == row.debitTotalOcc) {
						if (row.userSubjectId.substr(0,1) == 6) {
							var data2 = formatMoney(data);
							html = '<span style="background-color: #53f9f9;width: 90%;margin: 0 0 0 auto;display: block;">' + data2 + '</span>';
							return html;
						} else {
							return formatMoney(data);
						}
					} else {
						return formatMoney(data);
					}*/
					}
				}, {
					targets: 13,
					index: 13,
					orderable: false,
					title: '期末数',
					className: 'text-right',
					name: 'balance',
					data: 'balance',
					width: '100px',
					render: function(data, type, row, meta) {
						return formatMoney(data);
					}
				}/*, {
				targets : 12,
				orderable : true,
				title : '借方期末',
				className : 'text-right',
				name : 'debitBalance',
				data : 'debitBalance',
				width : '100px',
				render: function(data, type, row, meta){
					return formatMoney(data);
				}
			}, {
				targets : 13,
				orderable : true,
				title : '贷方期末',
				className : 'text-right',
				name : 'creditBalance',
				data : 'creditBalance',
				width : '100px',
				render: function(data, type, row, meta){
					return formatMoney(data);
				}
			}*/, {
					targets: 14,
					index: 14,
					orderable: false,
					title: '方向',
					className: 'text-center',
					name: 'direction',
					data: 'direction',
					width: '50px'
				}, {
					targets: 15,
					index: 15,
					orderable: false,
					className: 'text-center',
					title: '年份',
					name: 'yyyy',
					data: 'yyyy',
					width: '60px'
				}/*, {
				targets : 12,
				orderable : true,
				title : '级别',
				name : 'level0',
				data : 'level0',
				width : '10px',
				visible : false
			}, {
				targets : 13,
				orderable : true,
				title : '是否叶子',
				name : 'isLeaf0',
				data : 'isLeaf0',
				width : '10px',
				visible : false
			}, {
				targets : 14,
				orderable : true,
				title : '',
				name : 'vocationId',
				data : 'vocationId',
				width : '10px',
				visible : false
			}*/]

		}
	};

	//选择客户时查询报表模板
	/*$('#search_customerId').change(function(){
		var customer = $('#search_customerId').val().split('-');
		getCustomerVocation('search_vocationId',{param1:customer[0],param2:$('#search_yyyy').val(),param3:departIdSession});
	});*/

	//选择年时查询报表模板
	/*$('#search_yyyy').change(function(){
		var customer = $('#search_customerId').val().split('-');
		getCustomerVocation('search_vocationId',{param1:customer[0],param2:$('#search_yyyy').val(),param3:departIdSession});
	});*/

	/** 展开下级 */
	$('#' + table).on('click', 'button[name="rowShowSub"]', function() {
		var dataTable = $('#' + table).DataTable();
		var tr = $(this).closest('tr');
		/*
		$.each(tr.siblings('tr'),function(i, obj){
			var row = dataTable.row(obj);
			if (row.child.isShown()) {
				row.child.hide();
			}
		});*/
		var trArr = tr.siblings('tr');
		for (let i = 0; i < trArr.length; i++) {
			var row = dataTable.row($(trArr[i]));
			if (row.child.isShown()) {
				row.child.hide();
			}
		}
		tr.siblings('tr').removeClass('shown');

		var rowData = $('#' + table).DataTable().data()[tr.index()];
		var row = dataTable.row(tr);

		if (row.child.isShown()) {
			row.child.hide();
			tr.removeClass('shown');
		} else {
			let curprojectaccyear = window.CUR_PROJECT_ACC_YEAR;
			let selYear = $('#selectYear').val();
			let paramYear;
			if (selYear == curprojectaccyear) {
				paramYear = endMonth;
			} else {
				paramYear = 12;
			}
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.queryChildSubjects.json',
				data: {
					sqlId: 'FA10013',
					menuId: window.sys_menuId,
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					start: -1,
					limit: -1,
					param1: window.CUR_CUSTOMERID,
					param2: $('#selectYear').val(),
					param3: 1,
					param4: paramYear,
					param5: rowData.userSubjectId,
					param6: rowData.level0 + 1

				},
				dataType: 'json',
				success: function(data) {
					var object = data.data;

					if (object != null && object.length > 0) {
						row.child(format(object, rowData)).show();
						tr.addClass('shown');


						/** 添加下级对照 */
						$('#subtable').on('click', 'button[name="rowSubRelation"]', function(rowSubRelationEvent) {
							$('#modal-setRelation').modal('show');
							let tbAutoId = $(rowSubRelationEvent.currentTarget).attr('data-auto-id');
							$('#relation_baseSubjectId').attr('data-auto-id', tbAutoId);
							$('#relation_userSubjectYear').val($('#selectYear').val());
							if (!$('#relation_tbSubjectId').attr('isTree')) {
								//TB科目选择
								$('#relation_tbSubjectId').treecombo({
									url: 'dgCenter/DgAdjustTree.findProjectTb.json',
									params: {
										customerId: window.CUR_CUSTOMERID,
										projectId: window.CUR_PROJECTID,
										param14: window.CUR_CUSTOMERID,
										param15: departIdSession,
										//param16 : object.vocationId,
										param17: window.CUR_PROJECTID
									},
									lazyLoad: false,
									view: {
										leafIcon: 'fa fa-building text-flat',
										nodeIcon: 'fa fa-bank text-primary-light',
										folderSelectable: false,
										multiSelect: false,
										positionValue: 'absolute'
									}
								});
							}
							if (!$('#relation_baseSubjectId').attr('isTree')) {
								//标准科目选择
								$('#relation_baseSubjectId').treecombo({
									url: 'dgCenter/DgAdjustTree.findBaseSubjectType.json',
									params: {
									customerId: window.CUR_CUSTOMERID,
									projectId: window.CUR_PROJECTID,
										//menuId : window.sys_menuId,
										//sqlId : 'DG00032',
										param15: departIdSession
									},
									lazyLoad: false,
									view: {
										leafIcon: 'fa fa-building text-flat',
										nodeIcon: 'fa fa-bank text-primary-light',
										folderSelectable: false,
										multiSelect: false,
										positionValue: 'absolute'
									}
								});
							}
							$('#modal-setRelation').one('hidden.bs.modal', function() {
								$('#relation_tbSubjectId').treecombo('setTreeComboValue', []);
								$('#relation_baseSubjectId').treecombo('setTreeComboValue', []);
							});
							var data = '';
							/*							$.each($('#checkUserSubject:checked'),function(){
								if (data == ''){
									data = $(this).val();
								}else{
									data = data + ';' + $(this).val();
								}
				            });*/
							let checkUserSubjectArr = $('#checkUserSubject:checked');
							for (let i = 0; i < checkUserSubjectArr.length; i++) {
								if (data == '') {
									data = $(checkUserSubjectArr[i]).val();
								} else {
									data = data + ';' + $(this).val();
								}
							}
							$('#relation_userSubjectId').val(data);
							$('#relation_tbSubjectId').val('');
							$('#relation_vocationId').val(rowData.vocationId);
						});


						$('#subtable').on('mouseup', 'tbody tr', function() {
							$('#subtable tr.selected').removeClass('selected');
							$(this).addClass('selected');
						});

					} else {
						bdoInfoBox('无下级科目！');
					}
				}
			});
		}
	});


	/** 对照 */
	$('#' + table).on('click', 'button[name="rowRelation"]', function() {
		if ($(this).parents('#subtable').length != 0) {
			var object = $('#' + table).DataTable().data()[$(this).parents('#subtable').parents('tr').prev().index()];
		} else if ($(this).closest('tr').prevAll().hasClass('shown')) {
			object = $('#' + table).DataTable().data()[$(this).closest('tr').index() - 1];
		} else {
			var object = $('#' + table).DataTable().data()[$(this).closest('tr').index()];
		}
		showRowRelation(object);
	});

	/** 对照 */
	var showRowRelation = function(object) {
		$('#relation_baseSubjectId').attr('data-auto-id', object.autoId);
		$('#relation_userSubjectYear').val(object.yyyy);
		//$('#relation_tbSubjectId').one('focus',function() {
		if (!$('#relation_tbSubjectId').attr('isTree')) {
			//TB科目选择
			$('#relation_tbSubjectId').treecombo({
				url: 'dgCenter/DgAdjustTree.findProjectTb.json',
				params: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param14: window.CUR_CUSTOMERID,
					param15: departIdSession,
					//param16 : object.vocationId,
					param17: window.CUR_PROJECTID
				},
				//singleSelect:true,
				lazyLoad: false,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false,
					positionValue: 'absolute'
				}
			});
		}
		if (!$('#relation_baseSubjectId').attr('isTree')) {
			//客户科目选择
			$('#relation_baseSubjectId').treecombo({
				url: 'dgCenter/DgAdjustTree.findBaseSubjectType.json',
				params: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					//menuId : window.sys_menuId,
					//sqlId : 'DG00032',
					param15: departIdSession
				},
				lazyLoad: false,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false
				}
			});
		}
		//});
		$('#modal-setRelation').modal('show');
		$('#modal-setRelation').one('hidden.bs.modal', function() {
			$('#relation_tbSubjectId').treecombo('setTreeComboValue', []);
			$('#relation_baseSubjectId').treecombo('setTreeComboValue', []);
		});

		$('#relation_vocationId').val(object.vocationId);
		$('#relation_userSubjectId').val(object.userSubjectId + '-' + object.userSubjectName);
		$('#relation_userSubjectLevel').val(object.level0);
		//
		if (object.baseSubjectName != null && object.baseSubjectName != '') {
			$('#relation_baseSubjectId').treecombo('setTreeComboValue',
				[(object.baseSubjectId + '-' + object.baseSubjectName), (object.baseSubjectId + '-' + object.baseSubjectName)]);
		}
		//
		if (object.tbSubjectName != null && object.tbSubjectName != '') {
			var thisTb = object.tbSubjectCode + '-' + object.tbSubjectName;
			$('#relation_tbSubjectId').treecombo('setTreeComboValue',
				[thisTb, thisTb]);
		} else {
			$('#relation_tbSubjectId').val('');
		}
		$('#relation_tbAddSubjectId').val('');
	};

	/** 删除对照 */
	$('#' + table).on('click', 'button[name="rowDelRelation"]', function() {
		var object = $('#' + table).DataTable().data()[$(this).closest('tr').index()];
		if ($(this).closest('tr').prevAll().hasClass('shown')) {
			object = $('#' + table).DataTable().data()[$(this).closest('tr').index() - 1];
		}
		bdoAjaxBox('系统提示', '确定要删除吗?', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.deleteSubRelation.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: object.autoId,
					param2: object.customerId
				},
				dataType: 'json',
				success: function(data) {
					$('#' + table).DataTable().ajax.reload();

					if (data.success) {
						bdoSuccessBox('删除成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('删除失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	/** 解除对照 */
	$('#' + table).on('click', 'button[name="rowCancelRelation"]', function() {
		var object = $('#' + table).DataTable().data()[$(this).closest('tr').index()];

		bdoAjaxBox('系统提示', '确定要解除对照吗?', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.cancelRelation.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: object.autoId
				},
				dataType: 'json',
				success: function(data) {
					$('#' + table).DataTable().ajax.reload();

					if (data.success) {
						bdoSuccessBox('保存成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('保存失败', data.resultInfo.statusText);
					}
				}
			});
		});

	});


	$('#tab2').click(function() {
		$('#tb_search').click();
	});
	$('#tab1').one('click', function() {
		tbcontract_viewQuery();
	});
	/** 搜索按钮 */
	$('#btn_search').click(function() {
		$('#btn_search').blur();
		/** table */
		tbcontract_viewQuery();
	});


	function tbcontract_viewQuery() {
		/** table */
		tbcontract_view.localParam.urlparam.param2 =  $('#selectYear').val();
		tbcontract_view.localParam.urlparam.param10 = $('#show_contrast').val();
		BdoDataTable(table, tbcontract_view);
	}

	//tbcontract_viewQuery();

	/** 重置按钮 */
	$('#btn_clear').click(function() {
		$('#search_yyyy').val(CUR_PROJECT_START_YEAR);
	});

	/** 导出 */
	$('#btn_export').click(function() {
		var isManager = true;
		$.ajax({
			type: 'post',
			url: 'dgCenter/DgGeneral.query.json',
			async : false,
			data: {
				menuId: window.sys_menuId,
				sqlId: 'DG00197',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start: -1,
				limit: -1
			},
			dataType: 'json',
			success(data) {
				if (data.success) {
					if(sys_userId != data.data[0].manager){
						isManager = false;
					}
				}
			}
		});
		if(!isManager){
			bdoInfoBox('提示', '非项目负责人无权限导出TB科目对照表！');
			return;
		}
		exportExcel(this, 'TB科目对照表', tbcontract_view, table);
	});


	/** 刷新对照按钮 */
	$('#tb_refresh').click(function() {
		$('#tb_refresh').blur();
		$("#detail_customerId").empty();
		$.ajax({
			url: 'cpBase/General.query.json',
			data: {
				sqlId: 'DG00196',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: departIdSession//部门id

			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					let customers = data.data;
					$('#detail_customerId').append(' <option>' +'</option>');
					if (data.data&& data.data.length > 0) {
						for (let i = 0; i < customers.length; i++) {
							$('#detail_customerId').append(' <option value="' + customers[i].customerId + '" >' +  customers[i].customerName + '</option>');
						}
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);

				}
			}
		});
		$('#subject_contract_pre').modal('show');
	});
	$('#subject_contract_pre_save').on('click', function() {
		let selectValue= $('#detail_customerId').val();
		if (selectValue == '') {
			bdoConfirmBox('提示', '是否执行默认的科目对照，如已进行过此操作请确认是否要重新对照？<font color=red>重新对照后原来的对照结果将被清除！</font>', function() {
				$('#selectYear').val(projectYear);
				bdoInProcessingBox('对照中');
				$.ajax({
					type: 'post',
					url: 'dgCenter/FTBSubjectContract.refreshContract.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: projectYear,
						param3: '',
						param4: 1,
						param5: 12,
						param6: null
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('操作成功', data.resultInfo.statusText);
							setTimeout(tbcontract_viewQuery(), 1000);
							$('#subject_contract_pre').modal('hide');
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				});

			});
		} else {
			bdoConfirmBox('提示', '是否执行选择的科目对照，如已进行过此操作请确认是否要重新对照？<font color=red>重新对照后原来的对照结果将被清除！</font>', function() {
				$('#selectYear').val(projectYear);
				bdoInProcessingBox('对照中');
				$.ajax({
					type: 'post',
					url: 'dgCenter/FTBSubjectContract.refreshContract.json',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: window.CUR_CUSTOMERID,
						param2: projectYear,
						param3: '',
						param4: 1,
						param5: 12,
						param6: selectValue//选择的客户(将按照此客户的对照关系进行对照)
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							bdoSuccessBox('操作成功', data.resultInfo.statusText);
							setTimeout(tbcontract_viewQuery(), 1000);
							$('#subject_contract_pre').modal('hide');
						} else {
							bdoErrorBox('操作失败', data.resultInfo.statusText);
						}
					}
				});

			});
		}
	});
	$('#tb_retrieve_financialdata').on('click', function() {
		bdoConfirmBox('提示', '是否执行重新获取财务数据？<font color=red>重新获取后原来的财务数据将被清除！</font>', function() {
			$('#selectYear').val(projectYear);
			bdoInProcessingBox('重新获取中');
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.retrieveFinancialData.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: projectYear,
					param3: '',
					param4: 1,
					param5: 12,
					param6: null
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('操作成功', data.resultInfo.statusText);
						setTimeout(tbcontract_viewQuery(), 1000);
					} else {
						bdoErrorBox('操作失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//重置对照
	$('#relation_reset').on('click', function () {
		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.findDelAdjust.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: $('#relation_tbSubjectId').val(),
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					let text = '';
					let item = `<div style="height: 200px;overflow-y: auto">
								<table class="table table-bordered table-striped table-hover dataTable no-footer">
								<thead>
								<th>索引号</th>
								<th>TB科目编号</th>
								<th>TB科目名称</th>
								</thead>
								<tbody>`;
					let result = data.data[0];
					if (result) {
						for (let key in result) {
							let elements = result[key];
							item += `<tr>
							<td rowspan="${elements.length}">${key}</td>`;

							for (let i = 0; i < elements.length; i++) {
								let ele = elements[i];
								if (i === 0) {
									item += `<td>${ele.code}</td>`;
									item += `<td>${ele.name}</td>`;
									item += `</tr>`;
								} else {
									item += `<tr>`;
									item += `<td>${ele.code}</td>`;
									item += `<td>${ele.name}</td>`;
									item += `</tr>`;

								}
							}
						}

					}
					item += `</tbody></table>`;
					item = '重置此科目将会删除以下调整 <br>' + item + '<br>是否确定重置？</div>';
					bdoConfirmBox('提示', item, function (isConfirm) {
						// var userSubjectName = $('#relation_userSubjectId').val().split('-')[1];
						$.ajax({
							type: 'post',
							url: 'dgCenter/FTBSubjectContract.resetTbContract.json',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: $('#relation_userSubjectId').val(),
								param2: $('#relation_userSubjectYear').val()
							},
							dataType: 'json',
							success: function(data) {
								if (data.success) {
									bdoSuccessBox('清除对照成功', data.resultInfo.statusText);
									$('#relation_tbSubjectId').treecombo('setTreeComboValue', []);
									$('#relation_baseSubjectId').treecombo('setTreeComboValue', []);
									$('#' + table).DataTable().ajax.reload();
									$('#modal-setRelation').modal('hide');

								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});

					});
				}
			}
		});
	});


	//保存对照
	$('#relation_save').click(function() {
		var userSubjectName = $('#relation_userSubjectId').val().split('-')[1];

		if ($('#relation_tbSubjectId').val() == '') {
			bdoInfoBox('请选择TB科目');
			return;
		}
		if($('#relation_userSubjectId').val() == ''){
			bdoInfoBox('客户科目为空！');
			return;
		}


		$.ajax({
			type: 'post',
			url: 'dgCenter/FTBSubjectContract.saveRelation.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: $('#relation_userSubjectId').val(),
				param2: $('#relation_tbSubjectId').attr('data-result'),
				param3: window.CUR_CUSTOMERID,
				param4: $('#selectYear').val(),
				param5: $('#relation_vocationId').val(),
				//param6 : $('#relation_tbSubjectId').attr('data-result'),
				param7: 1,
				param8: 12,
				param9: $('#relation_baseSubjectId').attr('data-content') == undefined ? undefined : $('#relation_baseSubjectId').attr('data-result'),
				param10: $('#relation_baseSubjectId').attr('data-auto-id')
			},
			dataType: 'json',
			success: function(data) {
				$('#' + table).DataTable().ajax.reload();

				if (data.success) {
					bdoSuccessBox('保存成功', data.resultInfo.statusText);
					$('#modal-setRelation').modal('hide');
				} else {
					bdoErrorBox('保存失败', data.resultInfo.statusText);
				}
			}
		});
	});


	$('#tb_reset_contract').on('click', function() {
		$('#tb_reset_contract').blur();
		bdoAjaxBox('系统提示', '确定要删除科目对照数据，试算平衡表数据，未审报表数据，科目认定分值，重新生成科目对照吗?', function() {
			bdoInProcessingBox('生成中');
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.resetTbTable.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: 1
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						setTimeout(tbcontract_viewQuery(), 1000);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	//TB科目操作
	var loadTBbData = function() {
		var init_table_view = {
			localParam: {
				tabNum: true,
				//fixedHeader : {header : true},
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'DG00057',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
				order: [1, 'ASC'],
				setCol: true,
				ordering: false,
				serverSide: true,
				fixedColumns: false,
				rowReorder: {
					update: false
				},
				columnDefs: [{
					targets: 1,
					index: 1,
					className: 'text-left',
					title: '处理',
					data: null,
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="user_tb_edit" data-placement="top" title="修改 " data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>&nbsp;';

						renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="user_tb_delete" data-placement="top" title="删除 " data-toggle="tooltip">'
							+ '<i class="fa fa-times"></i></button>&nbsp;';
						// 修改tb科目对照
						if (row.isSubject == 1) {
							renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="user_tb_reContract" data-placement="top" title="修改对照 " data-toggle="tooltip">'
								+ '<i class="fa fa-edit"></i></button>';
						}
						renderStr += '<input name="autoId" value="' + row.autoId + '" hidden/>';
						return renderStr;
					}
				}, {
					targets: 2,
					index: 2,
					className: 'text-left',
					title: 'TB科目编号',
					name: 'tbSubjectId',
					data: 'tbSubjectId',
					width: '100px'
				}, {
					targets: 3,
					index: 3,
					className: 'text-left',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '200px'
				}, {
					targets: 4,
					index: 4,
					className: 'text-left',
					title: '报表科目编号',
					name: 'reportSubjectId',
					data: 'reportSubjectId',
					width: '100px'
				}, {
					targets: 5,
					index: 5,
					className: 'text-left',
					title: '报表科目名称',
					name: 'reportSubjectName',
					data: 'reportSubjectName',
					width: '200px'
				}, {
					targets: 6,
					index: 6,
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
					targets: 7,
					index: 7,
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
					targets: 8,
					index: 8,
					className: 'text-left',
					title: '排序号',
					name: 'sortNo',
					data: 'sortNo',
					width: '50px'
				}]
			}
		};
		BdoDataTable('user_tb_table', init_table_view);
	};

	var init_table_view = {
		localParam: {
			tabNum: true,
			//fixedHeader : {header : true},
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'DG00057',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			order: [1, 'ASC'],
			setCol: true,
			ordering: true,
			serverSide: true,
			fixedColumns: false,
			rowReorder: {
				update: false
			},
			columnDefs: [{
				targets: 1,
				index: 1,
				className: 'text-left',
				title: '处理',
				data: null,
				width: '100px',
				render: function(data, type, row, meta) {
					var renderStr = '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="user_tb_edit" data-placement="top" title="修改 " data-toggle="tooltip">'
						+ '<i class="fa fa-edit"></i></button>&nbsp;';

					renderStr += '<button class="btn btn-xs btn-danger table-btn-operate" type="button" name="user_tb_delete" data-placement="top" title="删除 " data-toggle="tooltip">'
						+ '<i class="fa fa-times"></i></button>&nbsp;';
					if (row.isSubject == 1) {
						renderStr += '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="user_tb_reContract" data-placement="top" title="修改对照 " data-toggle="tooltip">'
							+ '<i class="fa fa-edit"></i></button>';
					}
					renderStr += '<input name="autoId" value="' + row.autoId + '" hidden/>';
					return renderStr;
				}
			}, {
				targets: 2,
				index: 2,
				className: 'text-left',
				title: 'TB科目编号',
				name: 'tbSubjectId',
				data: 'tbSubjectId',
				width: '100px'
			}, {
				targets: 3,
				index: 3,
				className: 'text-left',
				title: 'TB科目名称',
				name: 'tbSubjectName',
				data: 'tbSubjectName',
				width: '200px'
			}, {
				targets: 4,
				index: 4,
				className: 'text-left',
				title: '报表科目编号',
				name: 'reportSubjectId',
				data: 'reportSubjectId',
				width: '100px'
			}, {
				targets: 5,
				index: 5,
				className: 'text-left',
				title: '报表科目名称',
				name: 'reportSubjectName',
				data: 'reportSubjectName',
				width: '200px'
			}, {
				targets: 6,
				index: 6,
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
				targets: 7,
				index: 7,
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
				targets: 8,
				index: 8,
				className: 'text-left',
				title: '排序号',
				name: 'sortNo',
				data: 'sortNo',
				width: '50px'
			}]
		}
	};

	var report_view = {
		localParam: {
			tabNum: false,
			url: 'cpBase/General.query.json',
			urlparam: {
				sqlId: 'FA40046',
				menuId: window.sys_menuId,
				start: -1,
				limit: -1,
				param3: '0',
				param4: '0',
				param5: window.CUR_CUSTOMERID,
				param6: window.CUR_PROJECTID
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

			infoCallback: function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
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
				render: function(data, type, row, meta) {
					data = data ? data : '';
					return '<span style="width:auto; display:block; white-space:nowrap;text-overflow:ellipsis; overflow:hidden" title="' + data + '">' + data + '</span>';
				}
			}, {
				targets: 4,
				className: 'text-left',
				orderable: false,
				title: '报表计算公式',
				name: 'cusCalFun',
				data: 'cusCalFun',
				width: '100px'
			}]
		}
	};

	//切换功能
	$('#user_tb_change').on('click', function() {
		$('#user_tb_change').blur();
		let check = $('#user_tb_change').attr('data-item-index');
		if (check == '1') {
			$('#user_tb_change').attr('data-item-index', 0);
			BdoDataTable('user_tb_table', init_table_view);

		} else {
			$('#user_tb_change').attr('data-item-index', 1);
			$.ajax({
				url: 'dgCenter/DgAdjust.findProjectInfo.json',
				type: 'post',
				async: true,
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID, param2: window.CUR_PROJECTID, param3: window.CUR_PROJECT_ACC_YEAR
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						// console.log("项目信息："+JSON.stringify(data));
						let tbtemplateId = data.data[0].tbTemplate;
						let vocationId = data.data[0].tbReportTemplate;
						report_view.localParam.urlparam.param1 = tbtemplateId;
						report_view.localParam.urlparam.param2 = vocationId;
						BdoDataTable('user_tb_table', report_view);
					} else {
						bdoErrorBox('提示', data.resultInfo.statusText);
					}
				}
			});

		}
	});


	/**
	 *  check报表计算公式
	 * */
	function checkcalFun(str, value_) {
		// 允许清空
		if ( value_ === ''){
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
	var reprot = {
		'param2': '',
		'param1': '',
		'param3': {}
	};

	$('#user_tb_table').on('dblclick', 'td', function() {
		let isReport = $('#user_tb_change').attr('data-item-index');
		if ($(this).closest('td').index() != 3) {
			return;
		}
		if (isReport === '1') {
			// 如果有错误输入的公式又去编辑其他公式，原错误公式回滚
			let $jsErrInput = $('.js-calfun-err');
			let oldValueOfErrInput = $jsErrInput.attr('old-value') || '';
			$jsErrInput.removeClass('js-calfun-err').val(oldValueOfErrInput);
			$jsErrInput.parent().html('<span style=\'color:green;\'>' + oldValueOfErrInput + '</span>');

			let $table = $(this).closest('table');
			let th = $table.DataTable().context[0].aoColumns[$table.DataTable().cell(this).index().column];
			let data = $table.DataTable().row($(this).closest('tr')).data();
			let oldVal = data[th.name] || '';
			$(this).html(`<span><input type=\'text\' old-value="${oldVal}" style=\'width:100%; align=right;\'></span>`);
			let input = $(this).find('input');
			if (oldVal) {
				input.val(oldVal);
			}
			input.focus();
			input.on('keydown', function(e) {
				if (e.keyCode == 13) {
					//console.log(e);
					input.blur();
				}
			});
			input.on('blur', function() {
				let $table = $(this).closest('table');
				let data = $table.DataTable().row($(this).closest('tr')).data();
				let value = $(this).val();
				reprot.param1 = report_view.localParam.urlparam.param1;
				reprot.param2 = report_view.localParam.urlparam.param2;
				if (value == null) {
					return false;
				}
				let  funcReg = /[~!@#$%^&\\|,.<>?"'();:_=\[\]{}]/;
				if (funcReg.test(value)){
					bdoErrorBox('失败', '公式只支持四则运算');
					return;
				}

				// 计算
				reprot.param3[data.colCode] = data;
				if (typeof (data.tbSubject) == 'undefined' || data.tbSubject == null || data.tbSubject == '') {
					$(this).parent().html('');
					reprot.param3 = {};
					bdoErrorBox('失败', '当前报表科目未与TB科目对照');
					return;
				}

				data.tbSubject == null ? '' : data.tbSubject;

				if (!checkcalFun(data.tbSubject, value)) {
					$(input).addClass('js-calfun-err');
					bdoErrorBox('失败', '当前报表公式中报表科目未与TB科目对照');
					return false;
				}
				data['cusCalFun'] = value.trim(); // 检查正确才保存
				for (let key in reprot.param3){
					if (reprot.param3[key]['cusCalFun'] === null){
						delete reprot.param3[key];
					}
				}
				$(this).parent().html('<span style=\'color:green;\'>' + value + '</span>');

				$.ajax({
					url: 'dgCenter/DgAdjust.addProjectTBFun.json',
					type: 'post',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: reprot.param1,
						param2: reprot.param2,
						param3: encodeURIComponent(JSON.stringify(reprot.param3))
					},
					dataType: 'json',
					success: function(data) {
						$('#tbsubject_table').DataTable().ajax.reload();
						isSort = false;
						if (data.success) {
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


	//另存为模板
	$('#comsubject_addtotemplate').on('click', function() {
		var init_table_view = {
			localParam: {
				tabNum: true,
				//fixedHeader : {header : true},
				url: 'cpBase/General.query.json',
				urlparam: {
					sqlId: 'DG00057',
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
				order: [1, 'ASC'],
				setCol: true,
				ordering: true,
				serverSide: true,
				fixedColumns: false,
				rowReorder: {
					update: false
				},
				columnDefs: [{
					targets: 2,
					index: 2,
					className: 'text-left',
					title: 'TB科目编号',
					name: 'tbSubjectId',
					data: 'tbSubjectId',
					width: '80px'
				}, {
					targets: 3,
					index: 3,
					className: 'text-left',
					title: 'TB科目名称',
					name: 'tbSubjectName',
					data: 'tbSubjectName',
					width: '100px'
				}, {
					targets: 6,
					index: 6,
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
		exportExcel4(this, $('#cus_select1').text(), init_table_view, 'user_tb_table');
	});

	$('#user_tb_form').on('change', '#com_isSubject', function(event) {
		if ($('#com_isSubject option:selected').text() === '是') {
			$('#com_calFun').val('');
		}
	});
	//新增TB科目form参数
	$('#user_tb_form').formview({
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
				id: 'com_autoId',
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
						required: true
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
			}, {
				id: 'com_reportSubject',
				type: 'input',
				label: '对应报表科目',
				validate: {
					rules: {
						required: false
					}
				},
				rowspan: 1,
				colspan: 2
			}
		]
	});//修改TB科目form参数
	$('#user_tb_form2').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'comSubject_save2',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'

			}, {
				id: 'comSubject_close2',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}
		],
		items: [
			{
				id: 'com_autoId2',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			}, {
				id: 'com_subjectId2',
				type: 'input',
				label: '科目编号',
				validate: {
					rules: {
						required: false
					}
				}
			}, {
				id: 'com_subjectName2',
				type: 'input',
				label: '科目名称',
				validate: {
					rules: {
						required: false
					}
				}
			}, {
				id: 'com_isSubject2',
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
				id: 'com_calFun2',
				type: 'input',
				label: '计算公式',
				validate: {
					rules: {
						required: false
					}
				},
				rowspan: 1,
				colspan: 2
			}, {
				id: 'com_reportSubject2',
				type: 'input',
				label: '对应报表科目',
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
			$('#com_reportSubject').prop('disabled', false);
		} else {
			$('#com_calFun').prop('disabled', false);
			$('#com_reportSubject').prop('disabled', true);
		}
	});

	$('#com_reportSubject').on('focus', function() {
		initReportTree();
	});
	$('#com_reportSubject2').on('focus', function() {
		initReportTree2();
	});
	//下拉树初始化
	var initReportTree = function() {
		$('#com_reportSubject').unbind();
		$('#com_reportSubject').treecombo({
			url: 'cpBase/TreeCommon.findReportSubject.json',
			params: {
				param9: tbReportTemplate
			},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false
			}
		});
	};
	//修改tb对照的下拉框
	var initReportTree2 = function() {
		$('#com_reportSubject2').unbind();
		$('#com_reportSubject2').treecombo({
			url: 'cpBase/TreeCommon.findReportSubject.json',
			params: {
				param9: tbReportTemplate
			},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false
			}
		});
	};
//删除左右两端的空格
	function trim(str){
		return str.replace(/\s/g,"");
	}
	//保存tb科目
	$('#comSubject_save').on('click', function() {
		let curTbSubjectId = $('#com_subjectId').val();
		let curTbSubjectName = $('#com_subjectName').val();
		//科目名只能包含/
		let nameReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;
		//科目编号不能包含特殊字符
		let idReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;

		let str = new RegExp(/^[A-Za-z].*/);
		if (!str.test(curTbSubjectId)) {
			bdoInfoBox('提示', '科目编号必须以字母开头!');
			return false;
		}
		if (idReg.test(curTbSubjectId)) {
			bdoInfoBox('提示','科目编号不能包含以下特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+\-=[]{}\\/');
			return false;
		}
		if (nameReg.test(curTbSubjectName)){
			bdoInfoBox('提示','科目名称不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
			return false;
		}
		let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
		if (reg.test($('#com_subjectId').val())) {

			// 检查公式
			// let curTbSubjectId = $('#com_subjectId').val();
			let cal = $('#com_calFun').val();
			if(cal){

				let calItems = parseCalFunItems(cal);
				for (let i = 0; i < calItems.length; i++) {
					if (curTbSubjectId === calItems[i]){
						bdoInfoBox('提示', `公式有误，不能有自身科目编号【${curTbSubjectId}】!`);
						return false;
					}
				}

				let tbSubjectMap = new Map();
				$.ajax({
					url: 'cpBase/General.query.json',
					type: 'post',
					async: false,
					data: {
						sqlId: 'DG00216',
						param1: window.CUR_CUSTOMERID,
						param2: window.CUR_PROJECTID,
						start : -1,
						limit : -1,
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							data.data.forEach(row => tbSubjectMap.set(row.tbSubjectId, row.calFun));
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);

						}
					}
				});

				for (let i = 0; i < calItems.length; i++) {
					if (!tbSubjectMap.has(calItems[i])){
						bdoInfoBox('提示', `公式有误，不能有不存在的科目编号【${calItems[i]}】!`);
						return false;
					}
				}
			}


			$.ajax({
				url: 'dgCenter/FTBSubjectContract.saveTBSubject.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: $('#com_autoId').val(),
					param2: $('#com_subjectId').val(),
					param3: trim($('#com_subjectName').val()),
					param4: $('#com_reportSubject').attr('data-result'),
					param5: $('#com_reportSubject').val(),
					param6: $('#com_isSubject').val(),
					param7: encodeURIComponent($('#com_calFun').val())
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}
					$('#user_tb_table').DataTable().ajax.reload();
					$('#user_tb_detail').modal('hide');
				}
			});
		} else {
			bdoInfoBox('提示', '科目编号必须包含数字和字母!');
		}

	});

	//关闭tb科目对话框
	$('#comSubject_close').on('click', function() {
		$('#user_tb_detail').modal('hide');
	});
	//保存修改tb科目对照
	$('#comSubject_save2').on('click', function() {
			$.ajax({
				url: 'dgCenter/FTBSubjectContract.saveTBSubjectContract.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: $('#com_autoId2').val(),
					param2: $('#com_subjectId2').val(),
					param3: $('#com_subjectName2').val(),
					param4: $('#com_reportSubject2').attr('data-result'),
					param5: $('#com_reportSubject2').val(),
					// param6: $('#com_isSubject2').val(),
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}
					$('#user_tb_table').DataTable().ajax.reload();
					$('#user_tb_detail2').modal('hide');
				}
			});

	});

	//关闭修改tb科目对话框
	$('#comSubject_close2').on('click', function() {
		$('#user_tb_detail2').modal('hide');
	});

	//删除TB
	$('#user_tb_table').on('click', 'button[name="user_tb_delete"]', function() {
		var object = $('#user_tb_table').DataTable().data()[$(this).closest('tr').index()];
		var patt1 = new RegExp("S001|S002|S003|S004|S005|S006|TA01|TA02|TA03|TB01|TB02|TB03|TB04|TB05|TB06|TB07|TB08|TB09|TB10|TB11|TB12|TB13|TC01|TC02|TC03|TC04|TC05|TC06|TC07|TC08|TC09");
		if (patt1.test(object.tbSubjectId)){
			bdoInfoBox('提示信息','该科目是必须包含的科目项，禁止删除!');
			return;
		}

		// 检查是否被公式引用
		let tbSubjectMap = new Map();
		$.ajax({
			url: 'cpBase/General.query.json',
			type: 'post',
			// async: false,
			data: {
				sqlId: 'DG00216',
				param1: window.CUR_CUSTOMERID,
				param2: window.CUR_PROJECTID,
				start : -1,
				limit : -1,
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					data.data.forEach(row => tbSubjectMap.set(row.tbSubjectId, parseCalFunItems(row.calFun)));
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);

				}
			}
		});

		let tbCal = '';
		tbSubjectMap.forEach((v,k) => {
			if (v.includes(object.tbSubjectId)){
				tbCal = k;
			}
		});
		if (tbCal){
			bdoErrorBox('提示', `该科目已被科目【${tbCal}】中的公式引用，不能删除！`);
			return;
		}


		bdoAjaxBox('系统提示', '确定要删除对照吗?', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.deleteTBSubject.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: object.autoId,
					param2: object.tbSubjectId,
					param3: object.tbSubjectName,
					param4: object.sortNo
				},
				dataType: 'json',
				success: function(data) {
					$('#user_tb_table').DataTable().ajax.reload();

					if (data.success) {
						bdoSuccessBox('删除成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('删除失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//修改
	$('#user_tb_table').on('click', 'button[name="user_tb_edit"]', function() {
		var object = $('#user_tb_table').DataTable().data()[$(this).closest('tr').index()];
		$('#com_autoId').val(object.autoId),
			$('#com_subjectId').val(object.tbSubjectId),
			$('#com_subjectName').val(object.tbSubjectName),
			initReportTree();
		$('#com_isSubject').val(object.isSubject + '');
		$('#com_calFun').val(object.calFun);
		if (object.isSubject) {
			$('#com_calFun').prop('disabled', true);
			$('#com_reportSubject').prop('disabled', false);
		} else {
			$('#com_calFun').prop('disabled', false);
			$('#com_reportSubject').prop('disabled', true);
		}
		$('#com_reportSubject').treecombo('setTreeComboValue', [object.reportSubjectId, object.reportSubjectName]);
		$('#user_tb_detail').modal('show');
	});
	//修改对照
	$('#user_tb_table').on('click', 'button[name="user_tb_reContract"]', function() {
		var object = $('#user_tb_table').DataTable().data()[$(this).closest('tr').index()];
		$('#com_autoId2').val(object.autoId),
			$('#com_subjectId2').val(object.tbSubjectId),
			$('#com_subjectName2').val(object.tbSubjectName),
			initReportTree();
		$('#com_isSubject2').val(object.isSubject + '');
		$('#com_calFun2').val(object.calFun);
		$('#com_subjectId2').prop('disabled', true);
		$('#com_subjectName2').prop('disabled', true);
		$('#com_isSubject2').prop('disabled', true);
		$('#com_calFun2').prop('disabled', true);
		$('#com_reportSubject2').prop('disabled', false);

		initReportTree2();
		$('#com_reportSubject2').treecombo('setTreeComboValue', [object.reportSubjectId, object.reportSubjectName]);
		$('#user_tb_detail2').modal('show');
	});
	//新增
	$('#user_tb_add').on('click', function() {
		$('#com_autoId').val(''),
			$('#com_subjectId').val(''),
			$('#com_subjectName').val(''),
			initReportTree();
		$('#com_isSubject').val(1);
		$('#com_calFun').val('');
		$('#com_calFun').prop('disabled', true);
		$('#com_reportSubject').prop('disabled', false);
		$('#com_reportSubject').treecombo('setTreeComboValue', ['', '']);
		$('#user_tb_detail').modal('show');
	});
	$('#tab3').one('click', function() {
		//进入页面
		loadTBbData();
		$('#user_tb_addFun').hide();
	});
	$('#btn_tb_search').on('click', function() {
		//刷新
		$('#btn_tb_search').blur();
		$('#user_tb_table').DataTable().ajax.reload();
	});
	//选择对照关系form参数
	$('#subject_contract_pre_form').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'userContract_save',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'

			}, {
				id: 'userContract_close',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}],
		items: [
				 {
					id: 'Contract_userSubjectId',
					type: 'input',
					label: '对照关系',
					validate: {
						rules: {
							required: false
						}
					}
				}
			]
	});



	//新增客户财务科目form参数
	$('#user_subject_form').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'userSubject_save',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'

			}, {
				id: 'userSubject_close',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}
		],
		items: [
			{
				id: 'userSubject_autoId',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			}, {
				id: 'userSubject_userSubjectId',
				type: 'input',
				label: '科目编号',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'userSubject_userSubjectName',
				type: 'input',
				label: '科目名称',
				validate: {
					rules: {
						required: true
					}
				}
			}, {
				id: 'userSubject_parentSubject',
				type: 'input',
				label: '上级科目',
				validate: {
					rules: {
						required: false
					}
				},
				rowspan: 1
			},{
				id: 'Subject_direction',
				html: (() => {
					const res = '<div class="form-material " style="width: 100%;">'
						+ '	<label for="userSubject_direction">借贷方向<span class="necessary">*</span></label>'
						+ '	<select class="form-control" id="userSubject_direction" style="width: 100%;">'
						+ '		<option value="-1">贷</option>'
						+ '		<option value="1">借</option>'
						+ '	</select>'
						+ '</div>';
					return res;
				})(),
				// type: 'input',
				validate: {
					rules: {
						required: true
					}
				}
			},
			// {
			// 	id: 'userSubject_debitRemain',
			// 	type: 'input',
			// 	label: '借方初期',
			// 	validate: {
			// 		rules: {
			// 			required: true
			// 		}
			// 	},
			// 	rowspan: 1
			// }, {
			// 	id: 'userSubject_creditRemain',
			// 	type: 'input',
			// 	label: '贷方初期',
			// 	validate: {
			// 		rules: {
			// 			required: true
			// 		}
			// 	}
			// },
			{
				id: 'userSubject_debitTotalOcc',
				type: 'input',
				label: '借方发生额',
				validate: {
					rules: {
						required: true
					}
				},
				rowspan: 1
			}, {
				id: 'userSubject_creditTotalOcc',
				type: 'input',
				label: '贷方发生额',
				validate: {
					rules: {
						required: true
					}
				}
			},
			// {
			// 	id: 'userSubject_tranDebitTotalOcc',
			// 	type: 'input',
			// 	label: '借方损益结转数',
			// 	validate: {
			// 		rules: {
			// 			required: true
			// 		}
			// 	},
			// 	rowspan: 1
			// }, {
			// 	id: 'userSubject_tranCreditTotalOcc',
			// 	type: 'input',
			// 	label: '贷方损益结转数',
			// 	validate: {
			// 		rules: {
			// 			required: true
			// 		}
			// 	}
			// }, {
			// 	id: 'userSubject_debitBalance',
			// 	type: 'input',
			// 	label: '借方期末',
			// 	validate: {
			// 		rules: {
			// 			required: true
			// 		}
			// 	},
			// 	rowspan: 1
			// }, {
			// 	id: 'userSubject_creditBalance',
			// 	type: 'input',
			// 	label: '贷方期末',
			// 	validate: {
			// 		rules: {
			// 			required: true
			// 		}
			// 	}
			// },
			{
				id: 'userSubject_remain',
				type: 'input',
				label: '期初数',
				validate: {
					rules: {
						required: true
					}
				},
				rowspan: 1
			}, {
				id: 'userSubject_balance',
				type: 'input',
				label: '期末数',
				validate: {
					rules: {
						required: true
					}
				}
			}
		]
	});
	$('#userSubject_isParentSubject').html(ComboLocalDicOption(true, 'boolean'));


	//选择对照下拉框
	$('#detail_customerId').on('click', function() {


	});




	//下拉树初始化
	var initUserSubjectTree = function() {
		if (!$('#selectYear').val()) {
			return;
		}
		$('#userSubject_parentSubject').unbind();
		$('#userSubject_parentSubject').treecombo({
			url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
			params: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param9: window.CUR_CUSTOMERID,
				param10:  $('#selectYear').val(),
				param11: window.CUR_PROJECTID
			},
			singleSelect: true,
			lazyLoad: true,
			//onceLoad : true,

			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: false,
				showCheckbox: false,
				selectedColor: '',
				selectedBackColor: ''
			},
			nodeSelectedCallback:function(tree,param) {
				$.ajax({
					url: 'dgCenter/FTBSubjectContract.querySubjectDirection.json',
					type: 'POST',
					data: {
						customerId: window.CUR_CUSTOMERID,
						projectId: window.CUR_PROJECTID,
						param1: param.result,
						param2: $('#selectYear').val()
					},
					dataType: 'json',
					success: function(data) {
						if (data.success) {
							var direction = data.data[0].direction;
							if (direction===-1){
								$('#userSubject_direction').val("-1");
								$('#userSubject_direction').prop('disabled', true);
								}else if (direction===1) {
								$('#userSubject_direction').val("1");
								$('#userSubject_direction').prop('disabled', true);
								}else{
								$('#userSubject_direction').prop('disabled', false);
							}
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);

						}
					}
				});
			}

			/*

			view : {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: true,
				multiSelect: false
			}*/
		});
	};

	//初始化下啦书
	(function() {
		initUserSubjectTree();
		let userSubjectFormArr = $('#user_subject_form').find('input');
		/*	.each(function(index, node) {
			var id = $(node).attr('id');
			if (id != 'userSubject_autoId' && id != 'userSubject_parentSubject') {
				$(node).attr('aria-required', 'true');
				$(node).attr('aria-invalid', 'false');
				$(node).attr('aria-describedby', id + '-error');
			}
		});*/
		for (let i = 0; i < userSubjectFormArr.length; i++) {
			let node = userSubjectFormArr[i];
			let id = $(node).attr('id');
			if (id != 'userSubject_autoId' && id != 'userSubject_parentSubject') {
				$(node).attr('aria-required', 'true');
				$(node).attr('aria-invalid', 'false');
				$(node).attr('aria-describedby', id + '-error');
			}
		}
	})();
	//获得焦点触发下拉树
	// $('#userSubject_parentSubject').on('focus', function() {
	// 	initUserSubjectTree();
	// 	// alert("选中的值为"+$(this).val());
	// });
	//新增
	$('#btn_user_subject').on('click', function() {
		document.getElementById("user_subject_form").reset();
		let userSubjectFormArr = $('#user_subject_form').find('input');
		/*$('#user_subject_form').find('input').each(function(index, node) {
			var id = $(node).attr('id');
			if (id == 'userSubject_autoId' || id == 'userSubject_userSubjectId'
			|| id == 'userSubject_userSubjectName' || id == 'userSubject_parentSubject') {
				$(node).val('');
			} else {
				$(node).val('0');
			}
		});*/
		for (let i = 0; i < userSubjectFormArr.length; i++) {
			let node = userSubjectFormArr[i];
			let id = $(node).attr('id');
			if (id == 'userSubject_autoId' || id == 'userSubject_userSubjectId'
				|| id == 'userSubject_userSubjectName' || id == 'userSubject_parentSubject') {
				$(node).val('');
			} else {
				$(node).val('0');
			}

		}
		initUserSubjectTree();
		$('#userSubject_parentSubject').treecombo('setTreeComboValue', ['', '']);
		$('#userSubject_userSubjectId').prop('readonly', false);
		$('#userSubject_userSubjectName').prop('readonly', false);
		$('#user_subject_detail').modal('show');
	});
	// 按科目树选择添加
	$('#btnAddUserSubjectByTree').on('click', function() {
		$('#modal_subjectid').modal('show');
		$('#searchInput2').val('');
		$('#adsubject_tree').tree4({
			url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
			params: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param9: window.CUR_CUSTOMERID,
				param10: $("#selectYear").val(),
				param11: window.CUR_PROJECTID,
				param12: window.showType,
				param13: 1,
				searchInputId: 'searchInput2'
			},
			singleSelect: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: false,
				selectedColor: '#000',
				selectedBackColor: 'lightskyblue'
			}
		});
	});
	// 科目树对话框：重置
	$('#modal_subject_reset').click(function() {
		$('#adsubject_tree').tree4('reset');
	});

	function saveUserSubject(direction,subjectId) {
		$.ajax({
			url: 'dgCenter/FTBSubjectContract.addSubjectContract.json',
			type: 'POST',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID,
				param2: $('#selectYear').val(),
				param3: subjectId,
				param4: direction
			},
			dataType: 'json',
			success: function (data) {
				if (data.success) {
					bdoSuccessBox('成功');
					$('#example').DataTable().ajax.reload();
					if (data.data && data.data.length > 0) {
						showRowRelation(data.data[0]);
					}
				} else {
					bdoInfoBox('提示', data.resultInfo.statusText, 2000);
				}
			}
		});
	}
	// 科目树对话框：确定
	$('#modal_subject_sure').click(function() {
		let dt = $('#adsubject_tree').treeview(true).getSelected()[0];
		if (!dt){
			$('#modal_subjectid').modal('hide');
			$('#adsubject_tree').tree4('reset');
			return; // 没有选择，直接关闭
		}

		let subjectId = dt.value; // 所选的客户科目ID

		$.ajax({
			url: 'dgCenter/FTBSubjectContract.queryDirection.json',
			type: 'POST',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: $('#selectYear').val(),
				param2: subjectId,
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					saveUserSubject(data.limit,subjectId);
				} else {
					$('#direction_title').text('选择【'+dt.text+'】借贷方向')
					$('#set_user_direction').modal('show');
				}
			}
		});

		$('#modal_subjectid').modal('hide');
		$('#adsubject_tree').tree4('reset');
	});

	$('#direction_save').click(function (){
		$('#set_user_direction').modal('hide');
		let dt = $('#adsubject_tree').treeview(true).getSelected()[0];
		// 所选的客户科目ID
		let subjectId = dt.value;
		saveUserSubject($('#direction_select').val(),subjectId);
	});

	// 添加年初未分配利润
	$('#btnAddNcwfplr').on('click', function() {
		$.ajax({
			url: 'dgCenter/FTBSubjectContract.autoAddRetainedProfits.json',
			type: 'POST',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: window.CUR_PROJECTID
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功');
					$('#example').DataTable().ajax.reload();
				} else {
					bdoInfoBox('提示', data.resultInfo.statusText, 2000);
				}
			}
		});

	});

	//关闭
	$('#userSubject_close').on('click', function() {
		$('#userSubject_debitTotalOcc').prop('readonly', false);
		$('#userSubject_creditTotalOcc').prop('readonly', false);
		$('#userSubject_remain').prop('readonly', false);
		$('#userSubject_balance').prop('readonly', false);
		$('#userSubject_parentSubject').prop('readonly', false);
		$('#user_subject_detail').modal('hide');
	});
	$('#user_subject_detail > div > div > div.block.block-themed.block-transparent.remove-margin-b > div > ul > li > button').click(function () {
		$('#userSubject_debitTotalOcc').prop('readonly', false);
		$('#userSubject_creditTotalOcc').prop('readonly', false);
		$('#userSubject_remain').prop('readonly', false);
		$('#userSubject_balance').prop('readonly', false);
		$('#userSubject_parentSubject').prop('readonly', false);
	})
	//保存
	$('#userSubject_save').on('click', function() {
		var userSubjectName = $('#userSubject_userSubjectName').val();
		let nameReg = /[~!@#$%^&*\\|,.<>?"'();:_+\-=\[\]{}\/]/;
		if (nameReg.test(userSubjectName)){
			bdoInfoBox('提示','科目名称不能包含特殊字符!<br/>~!@#$%^&*|,.<>?"\'();:_+-=[]{}\/!');
			return false;
		}
		let numberReg = /^[0-9]*$/;
		let userSubjectId = $('#userSubject_userSubjectId').val();
		if (!numberReg.test(userSubjectId)) {
			bdoInfoBox('提示','科目编号只能为数字！');
			return false;
		}
		if ($('#user_subject_form').valid() !== true) {
			return;
		}
		var values = {};
		let userSubjectFormArr = $('#user_subject_form').find('input');
		/*$('#user_subject_form').find('input').each(function(index, node) {
            values[$(node).attr('id').split('_').pop()] = $(node).val();
        });
        */
		for (let i = 0; i < userSubjectFormArr.length; i++) {
			let node = userSubjectFormArr[i];
			values[$(node).attr('id').split('_').pop()] = $(node).val();

		}

		var parentSubjectId = $('#userSubject_parentSubject').attr('data-result');
		console.log();
		values['parentSubjectId'] = parentSubjectId ? parentSubjectId : '';
		if ($('#userSubject_userSubjectId').val().trim() == '') {
			$('#userSubject_userSubjectId').val('');
		}
		if ($('#userSubject_userSubjectName').val().trim() == '') {
			$('#userSubject_userSubjectName').val('');
		}
		if ($('#user_subject_form').valid() !== true) {
			return;
		}
		$.ajax({
			url: 'dgCenter/FTBSubjectContract.saveUserSubject.json',
			type: 'POST',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: JSON.stringify(values),
				param2: $('#selectYear').val(),
				param3: $('#userSubject_isParentSubject').val(),
				param4: $('#userSubject_direction').val()


			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					bdoSuccessBox('成功', data.resultInfo.statusText);
					if (data.data && data.data.length > 0) {
						showRowRelation(data.data[0]);
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
					return;
				}
				$('#example').DataTable().ajax.reload();
				$('#user_subject_detail').modal('hide');
			}
		});
	});

	//删除
	$('#example').on('click', 'button[name=rowDelUserSubject]', function() {
		var object = $('#example').DataTable().data()[$(this).closest('tr').index()];
		if ($(this).closest('tr').prevAll().hasClass('shown')) {
			object = $('#' + table).DataTable().data()[$(this).closest('tr').index() - 1];
		}
		bdoAjaxBox('系统提示', '确定要删除科目吗?', function() {
			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.deleteUserSubject.json',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: object.autoId,
					param2: object.userSubjectName,
					param3:  $('#selectYear').val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						$('#example').DataTable().ajax.reload();
						bdoSuccessBox('删除成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('删除失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	//粘贴
	/*$(document).on('keydown', function(e) {
		if (document.getElementById('copy_temp') && ctrlKey && ) {
			var $nodes = $('#example').find('.selected').closest('tr');
			if ($nodes.length > 0) {

			}
		}
		$('#copy_temp').focus();
	});
	$('#A123').on('keydown', function(e) {
		$(document).focus();
	});*/

	//编辑
	$('#example').on('click', 'button[name=rowEditUserSubject]', function() {
		//重置表单 以防缓存干扰
		document.getElementById("user_subject_form").reset();
		var object = $('#example').DataTable().data()[$(this).closest('tr').index()];
		if ($(this).closest('tr').prevAll().hasClass('shown')) {
			object = $('#' + table).DataTable().data()[$(this).closest('tr').index() - 1];
		}
		let userSubjectFormArr = $('#user_subject_form').find('input');
		/*$('#user_subject_form').find('input').each(function(index, node) {
			var value = object[$(node).attr('id').split('_').pop()];
			if (value || value == '0') {
				$(node).val(value);
				$(node).blur();
			}
		});*/
		for (let i = 0; i < userSubjectFormArr.length; i++) {
			let node = userSubjectFormArr[i];
			let value = object[$(node).attr('id').split('_').pop()];
			if (value || value == '0') {
				$(node).val(value);
				$(node).blur();
			}
		}
		initUserSubjectTree();
		$.ajax({
			url: 'dgCenter/FTBSubjectContract.findParentSubject.json',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: object.userDefined,
				refreshFlg: 1
			},
			dataType: 'json',
			success: function(data) {
				if (data.success) {
					if (data.data&& data.data.length > 0) {
						let obj = data.data[0];
						if (obj) {
							$('#userSubject_parentSubject').treecombo('setTreeComboValue', [obj.subjectId, obj.subjectName]);
						}
					}
				}else{
					bdoErrorBox('操作失败', data.resultInfo.statusText);
				}
			}
		});
		$('#userSubject_userSubjectId').prop('readonly', true);
		$('#userSubject_userSubjectName').prop('readonly', true);

		$("#userSubject_direction").find("option:contains('"+object.direction+"')").attr("selected",true);

		$('#user_subject_detail').modal('show');
	});
	//保存排序
	$('#tbSubject_sort').on('click', function() {
		bdoConfirmBox('提示', '是否按当前表格顺序保存', function() {
			var sortparam = [];
			let userTbTableTrArr = $('#user_tb_table tbody tr');
			/*$('#user_tb_table tbody tr').each(function(){
				sortparam.push($(this).find('[name="autoId"]').val());
			});*/
			for (let i = 0; i < userTbTableTrArr.length; i++) {
				sortparam.push($(userTbTableTrArr[i]).find('[name="autoId"]').val());
			}

			$.ajax({
				url: 'dgCenter/FTBSubjectContract.sortTbSubject.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: sortparam.toString()
				},
				dataType: 'json',
				success: function(data) {
					$('#user_tb_table').DataTable().ajax.reload();
					//isSort = false;
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	function format(data, rowData) {
		var renderStr;
		if (rowData.tbSubjectName == '' || rowData.tbSubjectName == null || rowData.userSubjectName == '' || rowData.userSubjectName == null) {
			renderStr = '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="rowSubRelation" data-placement="top" title="对照 " data-auto-id="'+rowData.autoId+'" data-toggle="tooltip">'
				+ '<i class="fa fa-edit"></i></button>&nbsp;';
		} else {
			renderStr = '<button class="btn btn-xs btn-success table-btn-operate" type="button" name="rowSubRelation" data-placement="top" title="重新对照 " data-auto-id="'+rowData.autoId+'" data-toggle="tooltip">'
				+ '<i class="fa fa-edit"></i></button>&nbsp;';
		}
		var subTable = '<table id="subtable">' +
			'<thead><tr>' +
			'<th width:100px>' +
			renderStr +
			'</th>' +
			'<th>客户科目编号</th>' +
			'<th width:"150px">客户科目名称</th>' +
			'<th width:"100px">期初</th>' +
			'<th width:"100px">借方发生额</th>' +
			'<th width:"100px">借方发生额(剔除结转)</th>' +
			'<th width:"100px">贷方发生额</th>' +
			'<th width:"100px">贷方发生额(剔除结转)</th' +
			'><th width:"100px">期末数</th>' +

			'</tr></thead>';
		/*
        '<button class="btn btn-xs btn-warning table-btn-operate" type="button" name="setproAndLos" data-placement="top" title="设置损益结转" data-toggle="tooltip">' +
        '<i class="fa fa-random"></i></button>' */
		/*	    $.each(data, function(index, info) {
	    	subTable =  subTable +
	    	'<tr>'+
            '<td align="left">' + info.userSubjectId + '</td><td align="left">'+ info.userSubjectName +'</td><td align="right">'+ formatMoney(info.remain) +'</td><td align="right">'+ formatMoney(info.debitTotalOcc) + '</td><td align="right">'+ formatMoney(info.debitTotalOccNoTran)  +'</td><td align="right">'+ formatMoney(info.creditTotalOcc) +'</td><td align="right">'+ formatMoney(info.creditTotalOccNoTran) +'</td><td align="right">'+ formatMoney(info.balance) +'</td>'+
            '<td>' +
           // '<button data="'+info.userSubjectId + '-' + info.userSubjectName + '" level="' + info.level0 +'" class="btn btn-xs btn-success table-btn-operate" type="button" name="rowSubRelation" data-placement="top" title="添加对照" data-toggle="tooltip">' +
			//'<i class="fa fa-plus"></i></button>' +
            '<input type="checkbox" id="checkUserSubject" value="'+  info.userSubjectId + '-' + info.userSubjectName + '">' +

			'</td>' +
            '</tr>';
	    });*/
		for (let i = 0; i < data.length; i++) {
			let info = data[i];
			if (!info.remain){
				info.remain = 0;
			}
			if (!info.debitTotalOcc){
				info.debitTotalOcc = 0;
			}
			if (!info.debitTotalOccNoTran){
				info.debitTotalOccNoTran = 0;
			}
			if (!info.creditTotalOcc){
				info.creditTotalOcc = 0;
			}
			if (!info.creditTotalOccNoTran){
				info.creditTotalOccNoTran = 0;
			}
			if (!info.balance){
				info.balance = 0;
			}
			subTable = subTable +
				'<tr>' +
				'<td>' +
				// '<button data="'+info.userSubjectId + '-' + info.userSubjectName + '" level="' + info.level0 +'" class="btn btn-xs btn-success table-btn-operate" type="button" name="rowSubRelation" data-placement="top" title="添加对照" data-toggle="tooltip">' +
				//'<i class="fa fa-plus"></i></button>' +
				'<input type="checkbox" id="checkUserSubject" value="' + info.userSubjectId + '-' + info.userSubjectName + '">' +
				'</td>' +
				'<td align="left">' + info.userSubjectId + '</td><td align="left">' + info.userSubjectName + '</td>' +
				'<td align="right">' + formatMoney(info.remain) + '</td>' +
				'<td align="right">' + formatMoney(info.debitTotalOcc) + '</td>' +
				'<td align="right">' + formatMoney(info.debitTotalOccNoTran) + '</td>' +
				'<td align="right">' + formatMoney(info.creditTotalOcc) + '</td>' +
				'<td align="right">' + formatMoney(info.creditTotalOccNoTran) + '</td>' +
				'<td align="right">' + formatMoney(info.balance) + '</td>' +

				'</tr>';
		}

		subTable = subTable + '</table>';

		return subTable;
	}


	function getMonthSpan(selYear) {
		var monthSpan = {
			startMonth: 1,
			endMonth: 12
		};
		if (window.CUR_PROJECT_START_YEAR == window.CUR_PROJECT_END_YEAR) {
			if (selYear == window.CUR_PROJECT_START_YEAR) {
				monthSpan.startMonth = window.CUR_PROJECT_START_MONTH;
				monthSpan.endMonth = window.CUR_PROJECT_END_MONTH;
			}
		} else if (window.CUR_PROJECT_START_YEAR < window.CUR_PROJECT_END_YEAR) {
			if (selYear == window.CUR_PROJECT_START_YEAR) {
				monthSpan.startMonth = window.CUR_PROJECT_START_MONTH;
			} else if (selYear == window.CUR_PROJECT_END_YEAR) {
				monthSpan.endMonth = window.CUR_PROJECT_END_MONTH;
			}
		}
		return monthSpan;
	}


//点击设置转结，打开搜索页
	var lastYear = projectYear - 1;
	$('#selectYear').append('<option value="' + projectYear + '" style="color: #000;">' + projectYear + '</option>');
	$('#selectYear').append('<option value="' + lastYear + '" style="color: #000;">' + lastYear + '</option>');
	var subjectId = '';
	$('#tab_tbContract').on('click', 'button[name="setproAndLos"]', function() {
		// $('#selectYear').val(projectYear); // #4611 试算平衡表损益结转按钮跳转时没有根据年度
		var flag = 1;
		if ($(this).parents('tr').hasClass('shown')) {
			var checked = $(this).parents('tr').next().find('#subtable').find('input[type="checkbox"]:checked');
			if (checked.length == 0) {
				$('#search_subjectId').val($('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectId + '-' + $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectName);
			} else {
				flag = 0;
				var ids = $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectId + ',';
				var str = $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectId + '-' + $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectName + ',';
				/*checked.each(function(i){
				if(i != checked.length-1){
					ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text() + ',';
				}else{
					ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text();
				}
			});*/

				for (let i = 0; i < checked.length; i++) {
					if (i != checked.length - 1) {
						ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text() + ',';
					} else {
						ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text();
					}
				}

				$('#search_subjectId').val(str);
				subjectId = ids;
			}
		} else if ($(this).parents('tr').prev().hasClass('shown')) {
			var checked = $(this).parents('#subtable').find('input[type="checkbox"]:checked');
			if (checked.length == 0) {
				$('#search_subjectId').val($('#example').DataTable().data()[$(this).parents('#subtable').parents('tr').prev().index()].userSubjectId + '-' + $('#example').DataTable().data()[$(this).parents('#subtable').parents('tr').prev().index()].userSubjectName);
			} else {
				flag = 0;
				var ids = $('#example').DataTable().data()[$(this).parents('#subtable').parents('tr').prev().index()].userSubjectId + ',';
				var str = $('#example').DataTable().data()[$(this).parents('#subtable').parents('tr').prev().index()].userSubjectId + '-' + $('#example').DataTable().data()[$(this).parents('#subtable').parents('tr').prev().index()].userSubjectName;
				/*	checked.each(function(i){
				if(i != checked.length-1){
					ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text() + ',';
				}else{
					ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text();
				}
			});*/
				for (let i = 0; i < checked.length; i++) {
					if (i != checked.length - 1) {
						ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text() + ',';
					} else {
						ids += $('#subtable').find('tbody').find('tr').eq(i).find('td').eq(0).text();
					}
				}

				$('#search_subjectId').val(str);
				subjectId = ids;
			}
		}
		if (flag == 1) {
			var tr = $(this).closest('tr');
			if ($(this).parents('tr').prevAll().hasClass('shown') && !$(this).parents('tr').prev().hasClass('shown')) {
				var rowData = $('#example').DataTable().data()[tr.index() - 1];
				var ids = $('#example').DataTable().data()[$(this).closest('tr').index() - 1].userSubjectId + ',';
				var str = $('#example').DataTable().data()[$(this).closest('tr').index() - 1].userSubjectId + '-' + $('#example').DataTable().data()[$(this).closest('tr').index() - 1].userSubjectName;
				$('#search_subjectId').val(str);
			} else {
				var rowData = $('#example').DataTable().data()[tr.index()];
				var ids = $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectId + ',';
				var str = $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectId + '-' + $('#example').DataTable().data()[$(this).closest('tr').index()].userSubjectName;
				$('#search_subjectId').val(str);
			}
			let curprojectaccyear = window.CUR_PROJECT_ACC_YEAR;
			let selYear = $('#selectYear').val();
			let paramYear;
			if (selYear == curprojectaccyear) {
				paramYear = endMonth;
			} else {
				paramYear = 12;
			}

			$.ajax({
				type: 'post',
				url: 'dgCenter/FTBSubjectContract.queryChildSubjects.json',
				data: {
					sqlId: 'FA10013',
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					menuId: window.sys_menuId,
					start: -1,
					limit: -1,
					param1: window.CUR_CUSTOMERID,
//  设置损益结转 同步年度
//				param2 : projectYear,
					param2: $('#selectYear').val(),
					param3: 1,
					param4: paramYear,
					param5: rowData.userSubjectId,
					param6: rowData.level0 + 1

				},
				dataType: 'json',
				success: function(data) {
					var object = data.data;
					for (var i = 0; i < object.length; i++) {
						if (i == object.length - 1) {
							ids += object[i].userSubjectId;
						} else {
							ids += object[i].userSubjectId + ',';
						}
					}
					subjectId = ids;
					$('#voucher_search').click();
				}
			});
		}
		$('#tab_carry-forward').addClass('active');
		$('a[href="#tab_carry-forward"]').parent().addClass('active');
		$('#tab_tbContract').removeClass('active');
		$('a[href="#tab_tbContract"]').parent().removeClass('active');
		$('a[href="#tab_carry-forward"]').css('display', 'block');
		$('#search_customerId').val(window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME);
		var yyyy = $('#selectYear').val();
		$('#search_startDate').val(yyyy);
		$('#search_endDate').val(yyyy);
		if (flag == 0) {
			$('#voucher_search').click();
			flag = 1;
		} else {
			flag = 1;
		}
		return false;

	});

//关闭页签
	$('a[href="#tab_carry-forward"] .fa-times-circle').on('click', function() {
		$('#tab_carry-forward').parent().find('.active').removeClass('active');
		$('a[href="#tab_carry-forward"]').parent().parent().find('.active').removeClass('active');
		$('#tab_tbContract').addClass('active');
		$('a[href="#tab_tbContract"]').parent().addClass('active');
		$('#tab_carry-forward').removeClass('active');
		$('a[href="#tab_carry-forward"]').parent().removeClass('active');
		$('a[href="#tab_carry-forward"]').css('display', 'none');
		//$('#voucher_search').click();
		tbcontract_viewQuery();
		//$(document).resize();
		return false;
	});

	$('#selectYear').on('change', tbcontract_viewQuery);


	var voucher_view1 = {
		localParam: {
			tabNum: true,
			url: 'finCenter/Account.getAccountLedager.json',
			start: -1,
			limit: -1,
			urlparam: {
				menuId: window.sys_menuId,
				lockProjectId: window.CUR_PROJECTID,
				lockCustomerId: window.CUR_CUSTOMERID,
				lockYyyy: window.CUR_PROJECT_ACC_YEAR
			}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			infoCallback: fnInfoCallback,
			ordering: false,
			serverSide: true,
			//fixedHeader : true,
			fixedThead: true,
			setCol: false,
			fixedHeight: '500px',
			columnDefs: [{
				targets: 1,
				className: 'text-left',
				title: '科目编号',
				name: 'subjectId',
				data: 'subjectId',
				width: '80px'
			}, {
				targets: 2,
				className: 'text-left',
				title: '科目名称',
				name: 'subjectFullName',
				data: 'subjectFullName',
				width: '150px'
			}, {
				targets: 3,
				className: 'text-center',
				title: '科目方向',
				name: 'direction',
				data: 'direction',
				width: '30px'
			}, {
				targets: 4,
				className: 'text-center',
				title: '会计月份',
				name: 'subMonth',
				data: 'subMonth',
				width: '30px'
			}, {
				targets: 5,
				className: 'text-right',
				title: '借方发生金额',
				name: 'debitOcc',
				data: 'debitOcc',
				width: '150px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 6,
				className: 'text-right',
				title: '贷方发生金额',
				name: 'creditOcc',
				data: 'creditOcc',
				width: '150px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 7,
				className: 'text-right',
				title: '期末金额',
				name: 'balance',
				data: 'balance',
				width: '150px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 8,
				className: 'text-right',
				title: '借方结转额',
				name: 'tranDebitOcc',
				data: 'tranDebitOcc',
				width: '150px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}, {
				targets: 9,
				className: 'text-right',
				title: '贷方结转额',
				name: 'tranCreditOcc',
				data: 'tranCreditOcc',
				width: '150px',
				render: function(data, type, row, meta) {
					return formatMoney(data);
				}
			}]
		}
	};

	$('#voucher_search').click(function() {
		if ($('#search_endDate').val() == '' && $('#search_startDate').val() != '') {
			$('#search_endDate').val($('#search_startDate').val());
		}

		if ($('#search_startDate').val() == '' && $('#search_endDate').val() != '') {
			$('#search_startDate').val($('#search_endDate').val());
		}

		if ($('#search_customerId').val() == '') {
			$('#search_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
//	if($('#search_startDate').val() == ''){
//		$('#search_startDate').focus();
//		bdoInfoBox('提示', '请选择凭证开始日期');
//		return;
//	}
//
//	if($('#search_endDate').val() == ''){
//		$('#search_endDate').focus();
//		bdoInfoBox('提示', '请选择凭证结束日期');
//		return;
//	}

		var yyyy = $('#search_startDate').val();
		if(!yyyy || yyyy == '') {
			yyyy = projectYear;
		}
		var params = {
			menuId: window.sys_menuId,
			sqlId: 'FIN100004',
			lockProjectId: window.CUR_PROJECTID,
			lockCustomerId: window.CUR_CUSTOMERID,
			lockYyyy: $('#search_startDate').val(),
			param3: subjectId.split(',')[0]
		};
		voucher_view1.localParam.urlparam = params;
		BdoDataTable('voucher_tab', voucher_view1);

		$(this).parents('.block').next('.block').find('span[name="cus_select"]').text('【' + window.CUR_CUSTOMERID + '-' + window.CUR_CUSTOMERNAME + '】');
		/** 行双击 */
		$('#voucher_tab tbody').on('dblclick', 'tr', function() {
			var object = $('#voucher_tab').DataTable().data()[$(this).closest('tr').index()];
			var customerId = window.CUR_CUSTOMERID;
			var subjectID = object.subjectId;
			if (object.accName != '>期初') {
				if (subjectID == '') {
					subjectID = subjectId.split(',')[0];
				}
				if (object.subMonth == '') {
					startsubMonth = 1;
					endsubMonth = 12;
				} else {
					startsubMonth = object.subMonth;
					endsubMonth = object.subMonth;
				}
				var yyyy = $('#search_startDate').val();
				if(!$.isNumeric(yyyy)) {
					yyyy = projectYear;
				}
				accountdetailTab('tab_contract', window.CUR_PROJECTID, yyyy, startsubMonth, yyyy, endsubMonth, subjectID);
			}
		});

	});
	OneUI.initHelper('slimscroll');



	function parseCalFunItems(calFun){
		if (!calFun){
			return [];
		}

		let tmp = calFun.replace(/[-+*\/()]/g, " ");
		return tmp.split(/\s+/).filter(v => v.replace(/\d/g, "") && v.replace(/\d+\.\d+/g, ""));
	}
	$('#show_contrast').change(tbcontract_viewQuery);
});

