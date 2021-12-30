$(document).ready(function() {
	$('#modal_bbsubform').on('hidden.bs.modal', function () {
		$('#modal_bbsubform button').show();
		$('#modal_bbsubform').find('input, select, textarea').removeAttr('disabled', 'disabled');
		$('#modal_bbsubform form')[0].reset();
		$('#modal_bbsubform form td').removeClass('has-error');
		$('#modal_bbsubform form .help-block').remove();
	});
	var ruleoption = ComboDBOption('cpBase/Combo.getCurrentRuleacc.json', false);
	//$('#tbsubject_rule').html('<option></option>' + ruleoption);
	$('#bbsubject_rule').on('focus', function () {
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

	$('#bbsub_form').formview({
		display: 'tableform-one',
		column: 4,
		buttons: [
			{
				id: 'bb_edit',
				icon: 'fa-send',
				style: 'btn-primary',
				text: '&nbsp;修改'
			}, {
				id: 'bb_save',
				icon: 'fa-save',
				style: 'btn-primary',
				text: '&nbsp;保存'
			}, {
				id: 'bb_close',
				icon: 'fa-sign-out',
				style: 'btn-warning',
				text: '&nbsp;关闭'
			}
		],
		items: [
			{
				id: 'bb_autoid',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			}, {
				id: 'bbsubject_label',
				type: 'input',
				typeAttr: {
					type: 'hidden'
				}
			}, {
				id: 'form_bb_rule',
				type: 'select',
				label: '报备模板',
				html: '',
				rowspan: 1
			}, {
				id: 'bb_rule',
				type: 'select',
				label: '报表模板',
				html: ruleoption
			}, {
				id: 'bb_subcode',
				type: 'input',
				label: '科目编号',
				typeAttr: {
					normal: true
				},
				rowspan: 1
			}, {
				id: 'bb_subname',
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
				id: 'bb_subreport',
				type: 'input',
				label: '对应报表科目',
				/*validate: {
					rules: {
						required: true
					}
				}*/
			}, {
				id: 'bb_calFun',
				type: 'input',
				label: '计算公式',
				typeAttr: {
					normal: true
				},
				rowspan: 1,
				colspan: 4
			}
		]
	});

	/*setFormTree();
	$('#tbsubject_rule').change(function(){
		setFormTree();
	});*/
	//下啦书
	$('#bb_subreport').on('focus', function () {
		initTreeCombo();
	});

	var initTreeCombo = function () {
		/*$('#bb_subreport').unbind();
		$('#bb_subreport').treecombo({
			url: 'cpBase/TreeCommon.findBbReportSubject.json',
			params: {
				param9: $('#bbsubject_rule').attr('data-result')
			},
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false
			}
		});*/

		//选择科目
		$('#bb_subreport').one("focus",function () {
			$('#modal_bbsubjectid').modal('show');
			/*if ($('#bbsubject_tree').hasClass('treeview')) {
				return;
			}*/
			$('#bbsubject_tree').tree({
				url: 'cpBase/TreeCommon.findBbReportSubject.json',
				params: {
					param9: $('#bbsubject_rule').attr('data-result'),
					searchInputId: 'searchInputBb'
				},
				singleSelect: false,
				lazyLoad: false,
				onceLoad: false,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: true,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''

				}
			});
		});
		$('#modal_bbsubjectid_sure').click(function() {
			var selectValue = $('#bbsubject_tree').tree('getTreeMultiValue');
			var selectLable = $('#bbsubject_tree').tree('getTreeMultiLabel');
			if (typeof(selectValue) === 'object') {
				$('#bb_subreport').val('');
				$('#bbsubject_label').val('');
			} else {
				$('#bb_subreport').val(selectValue);
				$('#bbsubject_label').val(selectLable);
				var str = selectValue.split(',');
				if(str.length > 1){
					var cal = '';
					for(var i = 0;i < str.length;i++){
						if(i == str.length - 1){
							cal = cal + str[i];
						}else{
							cal = cal + str[i] + '+';
						}
					}
					$('#bb_calFun').val(cal);
					$('#bb_calFun').removeAttr("disabled");
				}else{
					$('#bb_calFun').val('');
					$('#bb_calFun').attr('disabled', 'disabled');
				}

			}
			$('#modal_bbsubjectid').modal('hide');
		});
		$('#modal_bbsubjectid_reset').click(function() {
			$('#bbsubject_tree').tree('reset');
		});

	};
	var checkbbcalFun = function () {
		let value = $('#bb_calFun').val().trim();
		let bbSubject = $('#bbsubject_label').val();
		if (value == null){
			return true;
		}
		let  funcReg = /[~!@#$%^&\\|,.<>?"'();:_=\[\]{}]/;
		if (funcReg.test(value)){
			bdoErrorBox('失败', '公式只支持四则运算');
			return false;
		}
		/*if (typeof (bbSubject) == 'undefined' || bbSubject == null || bbSubject == '') {
			bdoErrorBox('失败', '当前报表科目未与报备科目对照');
			return false;
		}*/

		bbSubject == null ? "" : bbSubject;

		if (!checkcalFun(bbSubject,value)) {
			bdoErrorBox('失败', '当前报表公式中报表科目未与报备科目对照');
			return false;
		}

		//$(this).parent().html("<span style='color:green;'>" + value + "</span>");
		//encodeURIComponent(JSON.stringify(reprot.param3));
		return true;
	};
	var bbsubject_view = {
		localParam: {
			tabNum: true,
			url: 'cpBase/BBSubjectTemplate.bbsubjectSearch.json',
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
						/*if (!row.isSubject) {
							return '';
						}*/
						var renderStr = '<input type="hidden" name="bbAutoid" value="' + row.autoId + '">&nbsp;';
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
					title: '报备科目编号',
					name: 'subjectCode',
					data: 'subjectCode',
					filter: {
						type: 'string'
					},
					width: '150px'
				}, {
					targets: 4,
					className: 'text-left',
					title: '报备科目名称',
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
					title: '所属报表',
					name: 'tableName',
					data: 'tableName',
					filter: {
						type: 'string'
					},
					width: '100px'
				}, {
					targets: 10,
					className: 'text-left',
					title: '对照多科目',
					name: 'mulReportSubjectName',
					data: 'mulReportSubjectName',
					filter: {
						type: 'string'
					},
					width: '100px',
					render(data, tyep, row, meta) {
						if(data != null){
							let resultStr = '<div title="'+data+'" data-toggle="tooltip" style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden;width: 200px;">'+data+'</div>';
							return resultStr;
						}else{
							return data;
						}
					}
				}, {
					targets: 11,
					className: 'text-left',
					title: '计算公式',
					name: 'calFun',
					data: 'calFun',
					filter: {
						type: 'string'
					},
					width: '100px'
				}, {
					targets: 12,
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
	BdoDataTable('bbsubject_table', bbsubject_view);
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
					data = $('#bbsubject_table').DataTable().data(),
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
	$('#bbsubject_table').DataTable().on('row-reorder', function (e, diff, edit) {
		isSort = true;
	});

	//切换
	$('#bb_report_switch').on('click', function () {
		var tbTemplate = $('#tab3_tbTemplate').val();
		var reportTemplate = $('#bbsubject_rule').attr('data-result');
		if (!tbTemplate) {
			bdoErrorBox('提示', '请选择TB模板');
			return;
		}else if (!reportTemplate){
			bdoErrorBox('提示', '请选择报表模板');
			return;
		}
		var isReport = $('#bb_report_switch').attr('isReport');
		if (isReport == '1') {
			$('#bb_report_switch').attr('isReport', '0');
			BdoDataTable('bbsubject_table', bbsubject_view);
		} else {
			$('#bb_report_switch').attr('isReport', '1');
			report_view.localParam.urlparam.param2 = bbsubject_view.localParam.urlparam.param3;
			report_view.localParam.urlparam.param1 = bbsubject_view.localParam.urlparam.param4;
			BdoDataTable('bbsubject_table', report_view);
		}
	});

	//搜索
	$('#bbsubject_search').click(function () {
		var param4 = $('#tab3_bbTemplate option:selected').val();
		var param3 = $('#bbsubject_rule').attr('data-result');
		if (param4 == undefined || param4 == '') {
			bdoErrorBox('提示', '请先选择报备模板');
			return;
		}
		if (param3 == undefined || param3 == '') {
			bdoErrorBox('提示', '请重新选择报备模板和报表模板');
			return;
		}
		bbsubject_view.localParam.urlparam.param3 = param3;
		bbsubject_view.localParam.urlparam.param4 = param4;
		$('#bbsubject_table').DataTable().ajax.reload();
		//report_view.localParam.urlparam.param1 = param3;
		//report_view.localParam.urlparam.param2 = param4;
		//$('#report_table').DataTable().ajax.reload();

	});

	// 导出 
	$('#bbsubject_export').click(function () {
		var tbTemplate = $('#tab3_bbTemplate').val();
		var reportTemplate = $('#bbsubject_rule').attr('data-result');
		if (!tbTemplate) {
			bdoErrorBox('提示', '请选择报备模板');
			return;
		}else if (!reportTemplate){
			bdoErrorBox('提示', '请选择报表模板');
			return;
		}
		exportExcel(this, '报备科目一览', bbsubject_view, 'bbsubject_table');
	});

	// 修改
	$('#bbsubject_table').on('click', 'button[name="subEdit"]', function () {
		$('#form_bb_rule').html($('#tab3_bbTemplate').html());
		$('#form_bb_rule').val($('#tab3_bbTemplate').val());
		$('#form_bb_rule').attr('disabled', 'disabled');
		$('#bb_save').hide();
		/*$('#tb_rule').html($('#tbsubject_rule').html());*/
		$('#bb_rule').val($('#bbsubject_rule').attr('data-result'));
		$('#bb_rule').attr('disabled', 'disabled');
		$('#bb_subcode').attr('disabled', 'disabled');
		$('#bb_subname').attr('disabled', 'disabled');

		var object = $('#bbsubject_table').DataTable().data()[$(this).closest('tr').index()];
		tbformSet(object);
		$('#modal_bbsubform').modal('show');
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
		if ($('#bbsubject_rule').attr('data-result') != '') {
			queryFilterArr.push({
				'field': 'a.vocationId',
				'sqlIndex': 'a.vocationId',
				'type': 'string',
				'value': $('#bbsubject_rule').attr('data-result'),
				'operate': 'eq'
			});
		}
		return JSON.stringify(queryFilterArr);
	}

	// 修改
	$('#bb_edit').click(function () {
		//var reportId = $('#bb_subreport').attr('data-result');
		/*if (reportId) {
			bdoErrorBox('提示', '请选择报表科目');
		}*/
		/*if (!$('#bb_subreport').attr('data-content')) {
			reportId = '';
		}*/
		if(checkbbcalFun()){
			$.ajax({
				url: 'cpBase/BBSubjectTemplate.updateBbsubject.json',
				data: {
					param1: $('#bb_autoid').val(),
					param2: $('#bb_subreport').val(),
					param3: $('#bb_subcode').val(),
					param4: $('#bb_subname').val(),
					param5: $('#bbsubject_rule').attr('data-result'),
					param6: $('#form_bb_rule').val(),
					param7: $('#tab3_tbTemplate option:selected').val(),
					param8: encodeURIComponent($('#bb_calFun').val().trim()),
					param9: $('#bbsubject_label').val()
				},
				dataType: 'json',
				success: function (data) {
					$('#bbsubject_table').DataTable().ajax.reload();
					if (data.success === true) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
						return;
					}

					$('#modal_bbsubform').modal('hide');
				}
			});
		}
		
	});

	$('#bb_close').click(function () {
		$('#modal_bbsubform').modal('hide');
	});

	function tbformSet(object) {
		$('#bb_autoid').val(object.autoId);
		$('#bb_subcode').val(object.subjectCode);
		$('#bb_subname').val(object.subjectName);
		initTreeCombo();
		if(object.reportSubjectCode != null && object.reportSubjectCode != ''){
			$('#bb_subreport').val(object.reportSubjectCode);
		}else{
			$('#bb_subreport').val(object.mulReportSubjectCode);
		}
		$('#bb_calFun').val(object.calFun);
		//$('#bb_subreport').treecombo('setTreeComboValue', [object.reportSubjectCode, object.reportcolName]);
//		$('#tb_subtype').treecombo('setTreeComboValue',[object.subjectType1, object.subjectTypeName]);
//		$('#tb_rule').val(object.vocationId);
	}


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
});

