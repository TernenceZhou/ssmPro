/**
 * 审计程序页面
 */
var DgAdjustPage = function(agrs) {
	var _template = '';
	// 对话框html
	var modalHtml = '';
	// 表格默认初始化数据
	var initData = [{
		showAdd: '1',
		autoId: '',
		subjectId: '',
		indexId: '',
		subjectName: '',
		assitemId: '',
		assitemContent: '',
		oppSubjectId:'',
		oppSubjectName:'',
		subjectContent: '',
		adjustSubjectTB: '',
		adjustSubjectCodeReport: '',
		adjustSubjectReport: '',
		workpaperId :0,
		yyyy: '',
		summary: '',
		currency: '',
		currValue: '',
		dirction: '',
		occurValue: '',
		reason: ''
	},
		{
			autoId: '',
			subjectId: '',
			indexId: '',
			subjectName: '',
			assitemId: '',
			assitemContent: '',
			subjectContent: '',
			adjustSubjectTB: '',
			adjustSubjectCodeReport: '',
			adjustSubjectReport: '',
			yyyy: '',
			summary: '',
			currency: '',
			currValue: '',
			dirction: '',
			occurValue: '',
			reason: ''
		}];
	let errorType = ComboDicOption(false,'错报类型');
	var dfEdit = '&nbsp;<button class="btn btn-xs btn-warning" type="button" name="dfEdit" data-placement="top" title="填充金额" data-toggle="tooltip"><i class="fa fa-edit"></i></button>';
	var dfClear = '&nbsp;<button class="btn btn-xs btn-info" type="button" name="dfClear" data-placement="top" title="清空" data-toggle="tooltip"><i class="fa fa-eraser"></i></button>';
	var dfAdd = '&nbsp;<button class="btn btn-xs btn-success" type="button" name="dfAdd" data-placement="top" title="增加一行" data-toggle="tooltip"><i class="fa fa-plus"></i></button>';
	var dfDel = '&nbsp;<button class="btn btn-xs btn-danger" type="button" name="dfDel" data-placement="top" title="移除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
	var managerId = "";
	var rearrangeName = "负值重分类";
	var projectYear = window.CUR_PROJECT_ACC_YEAR;
	var initPageValue = function() {
		/** 加载html页面 */
		_template = agrs.template || tplLoader('dgCenter/html/dg/adjust.html');
		agrs.template = _template;
		// 索引号前缀
		window.adjustDgNO = agrs.data.extraOptions.indexId;
	};
	// 刷新列表
	var refreshTable = function() {
		if(agrs.data.extraOptions.tableId){
			$('#' + agrs.data.extraOptions.tableId).DataTable().ajax.reload();
		}else{
			$('#adjustTable').DataTable().ajax.reload();
		}
	};

	// 返回列表最大索引号
	var findMaxNo = function() {
		var max = 0;
		if ($('#adjustTable').size() == 0) {
			agrs.findMaxIndex();
			return agrs.maxIndex;
		}
		var datas = $('#adjustTable').DataTable().data();
		for (var i in datas) {
			var index = '' + datas[i].indexId;
			var temp = parseInt(index.split('-').pop());
			if (max < temp) {
				max = temp;
			}
		}
		return max;
	};

	// 显示格式，前位补0
	var addZero = function(num, n) {
		return (Array(n).join(0) + num).slice(-n);
	};

	var addWorkpaperId = function(data, param) {
		if (agrs.data.extraOptions.workpaperId) {
			data[param] = agrs.data.extraOptions.workpaperId;
		}
		return data;
	};

	/** 页面列表初始化参数。 */
	var adjustTable = {
		localParam: {
			tabNum: true,
			url: 'dgCenter/DgGeneral.query.json',
			/*rowReorder : {snapX : true},
			fixedHeader : {header : true},*/
			urlparam: {}
		},
		tableParam: {
			select: true,
			lengthChange: false,
			dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>>',
			ordering: false,
			order: [],
			fixedThead: true,
			fixedHeight: '480px',
			/*scrollY : 480,
			scroller : true,
			colReorder : true,
			fnInitComplete : function(setting, data) {
				var i = 0;
				$('.group.group-start').each(function(index, node){
					var j = $(node).index();
					if (j - i == 1) {
						$(node).remove();
					}
					i = j;
				});
			},*/
			rowGroup: {
				dataSrc: 'indexId',
				startRender: null,
				endRender: function(rows, data) {
					var $tableInfo = $('#' + $(rows.nodes()).eq(0).closest('table').attr('id') + '_info b');
					if (!rows[0][0]) {
						$tableInfo.html(0);
					}
					$(rows.nodes()).css('background', 'white');
					$(rows.nodes()).each(function(index, node) {
						if (!index) {
							$(this).find('td').eq(0).attr('rowspan', rows[0].length);
							$(this).find('td').eq(1).attr('rowspan', rows[0].length);
							$(this).find('td').eq(2).attr('rowspan', rows[0].length);
							$(this).find('td').eq(0).html(parseInt($tableInfo.html()) + 1);
						} else {
							$(this).find('td').eq(0).hide();
							$(this).find('td').eq(1).hide();
							$(this).find('td').eq(2).hide();
						}
						if ($(this).find('td').eq(0).html() == '') {
							$(this).css('background-color', 'rgb(255, 255, 120)');
						}
					});
					var $endTr = $(rows.nodes()).last().next();
					if ($endTr.children().length == 1) {
						$endTr.remove();
					}
					var $table = $(rows.nodes()).eq(0).closest('table');
					$tableInfo.html(parseInt($tableInfo.html()) + 1);
					$table.find('td').css('border-width', '1px');
				}
				// className : 'adjust-group-row1'
			},
			serverSide: true,
			columnDefs: [
				{
					targets: 1,
					orderable: false,
					className: (function() {
						if (agrs.handleFlag == 1) return 'hidden';
						return 'text-center';
					})(),
					title: '处理',
					width: '100px',
					render: function(data, type, row, meta) {
						var renderStr = '';
						// if (!agrs.data.extraOptions.workpaperId || agrs.data.extraOptions.workpaperId != row.workpaperId) {
						if (agrs.handleFlag && agrs.handleFlag == 1) {
							return '<div></div>';
						} else if (agrs.handleFlag && agrs.handleFlag != 0) {
							return renderStr;
						}
						// }
						if (agrs.handleFlag && agrs.handleFlag == 0) {
							var styleName = '';
							if (row.status == '1') {
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="adEdit" data-placement="top" title="修改" data-toggle="tooltip" ' + styleName + '><i class="fa fa-edit"></i></button>&nbsp;';
							}
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="adDelete" data-placement="top" title="删除" data-toggle="tooltip" ' + styleName + '><i class="fa fa-times"></i></button>&nbsp;';
							renderStr += '<button style="display : none">' + row.autoId + '</button>';
							if (row.ACTIVE_FLAG == 0) {
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="adBan" data-placement="top" title="调整" data-toggle="tooltip" ' + styleName + '><i class="fa fa-openid"></i></button>&nbsp;';
							} else {
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="adBan" data-placement="top" title="不调整" data-toggle="tooltip" ' + styleName + '><i class="fa fa-ban"></i></button>&nbsp;';
							}
							renderStr += '<button name="accpackYear" style="display : none">' + row.subjectYear + '</button>';
							return renderStr;
						}

						// 底稿id 不一致 隐藏 处理按钮
						if (agrs.data.extraOptions.workpaperId != row.workpaperId) {
							// $('button[name="adEdit"]').hide();
							// $('button[name="adDelete"]').hide();
							// $('button[name="adBan"]').hide();
							// row.indexId = 0;
							return renderStr;
						}
						// if (CUR_USERID != JSON.parse($.sessionStorage('projectManager')) && JSON.parse($.sessionStorage('projectManager')) != undefined) {
						if (row.__ufillUserName && CUR_USERID != row.__ufillUserName.userId && CUR_USERID != managerId) {
							// $('button[name="adEdit"]').hide();
							// $('button[name="adDelete"]').hide();
							// $('button[name="adBan"]').hide();
							return renderStr;
						} else {
							var styleName = '';
							if (row.status == '1') {
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="adEdit" data-placement="top" title="修改" data-toggle="tooltip" ' + styleName + '><i class="fa fa-edit"></i></button>&nbsp;';
							}
							renderStr += '<button class="btn btn-xs btn-danger" type="button" name="adDelete" data-placement="top" title="删除" data-toggle="tooltip" ' + styleName + '><i class="fa fa-times"></i></button>&nbsp;';
							renderStr += '<button style="display : none">' + row.autoId + '</button>';
							if (row.ACTIVE_FLAG == 0) {
								renderStr += '<button class="btn btn-xs btn-success" type="button" name="adBan" data-placement="top" title="调整" data-toggle="tooltip" ' + styleName + '><i class="fa fa-openid"></i></button>&nbsp;';
							} else {
								renderStr += '<button class="btn btn-xs btn-danger" type="button" name="adBan" data-placement="top" title="不调整" data-toggle="tooltip" ' + styleName + '><i class="fa fa-ban"></i></button>&nbsp;';
							}
							renderStr += '<button name="accpackYear" style="display : none">' + row.subjectYear + '</button>';
							return renderStr;
						}


					}
				}, {
					targets: 2,
					className: 'text-left adjust-row-text',
					title: '索引号',
					name: 'indexId',
					data: 'indexId',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 3,
					className: 'text-left adjust-row-text',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 4,
					className: 'text-left adjust-row-text',
					title: 'TB科目名称',
					name: 'adjustSubjectTB',
					data: 'adjustSubjectTB',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 5,
					className: 'text-left adjust-row-text',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '60px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 6,
					className: 'text-left adjust-row-text',
					title: '科目名称',
					name: 'fullName',
					data: 'fullName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 7,
					className: 'text-left adjust-row-text',
					title: '辅助核算',
					name: 'assItemName',
					data: 'assItemName',
					width: '80px',
					render: function(data, type, row, meta) {
						if (data) {
							return '<span title=' + data + '>' + data + '</span>';
						}
						return '';
					}
				}, {
					targets: 8,
					className: 'text-right adjust-row-text',
					title: '借方金额',
					name: 'plusOccurValue',
					data: 'plusOccurValue',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.dirction > 0) {
							return formatMoney(row.occurValue);
						}
						return '';
					}
				}, {
					targets: 9,
					className: 'text-right adjust-row-text',
					title: '贷方金额',
					name: 'minusOccurValue',
					data: 'minusOccurValue',
					width: '80px',
					render: function(data, type, row, meta) {
						if (row.dirction < 0) {
							return formatMoney(row.occurValue);
						}
						return '';
					}
				}, {
					targets: 10,
					className: 'text-center',
					title: '状态',
					name: 'status',
					data: 'status',
					renderer: 'getDicLabelByVal|调整状态',
					width: '45px',
					render: function(data, type, row, meta) {
						return DicVal2Nm(data, '调整状态');
						/*if(row.ACTIVE_FLAG == 0){
							return '未调整';
						}else if(data == 1){
							return '调整';
						}*/
					}
				}, {
					targets: 11,
					className: 'text-center',
					title: '未调整原因',
					name: 'reason',
					data: 'reason',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 12,
					className: 'text-center',
					title: '调整年份',
					name: 'subjectYear',
					data: 'subjectYear',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 13,
					className: 'text-center',
					title: '对税务影响',
					name: 'taxEffect',
					data: 'taxEffect',
					renderer: 'getDicLabelByVal|税务影响',
					width: '100px',
					render: function(data, type, row, meta) {
						// switch (data) {
						// 	case "0":
						// 		return '否';
						// 	case "1":
						// 		return '是';
						// }
						// return '<span title=' + data + '>' + data + '</span>';
						return DicVal2Nm(data, '税务影响');

					}
				}, {
					targets: 14,
					className: 'text-center',
					title: '错报类型',
					name: 'cbType',
					data: 'cbType',
					renderer: 'getDicLabelByVal|错报类型',
					width: '100px',
					render: function(data, type, row, meta) {
						// switch (data) {
						// 	case '0':
						// 		return '事实错报';
						// 	case '1':
						// 		return '判断错报';
						// 	case '2':
						// 		return '推断错报';
						// }
						return DicVal2Nm(data, '错报类型');
						// return '<span title=' + data + '>' + data + '</span>';
					}
				}, {
					targets: 15,
					className: 'text-center',
					title: '制单人',
					name: '__ufillUserName',
					data: '__ufillUserName',
					width: '100px',
					render: function(data, type, row, meta) {
						return '<span title=' + row.__ufillUserNameName + '>' + row.__ufillUserNameName + '</span>';
					}
				}, {
					targets: 16,
					className: 'text-center',
					title: '最后更新时间',
					name: 'lastUpdateDate',
					data: 'lastUpdateDate',
					width: '130px',
					render: function(data, type, row, meta) {
						return '<span title="' + data + '">' + data + '</span>';
					}
				}]
		}
	};

	// 初始化一览表格
	var initTable = function() {
		modalHtml = $('#allTableContent2').html();

		var data = {
			menuId: window.sys_menuId,
			sqlId: 'FA10064',
			param1: window.CUR_CUSTOMERID,
			param2: projectYear,
			param3: '2',
			param4: agrs.data.extraOptions.userSubjectId ? agrs.data.extraOptions.userSubjectId : agrs.data.extraOptions.tbSubjectCode,
			param5: window.CUR_PROJECTID,
			param6: projectYear
		};
		// 底稿页面审计调整 无法展示上年数据问题
		if (agrs.data.extraOptions.userSubjectId && agrs.data.extraOptions.userSubjectId != '') {
			data.param2 = (projectYear - 1);
		}
		adjustTable.localParam.urlparam = data;
		BdoDataTable('adjustTable', adjustTable);
	};

	// 主列表事件
	var listener = function() {
		// 列表刷新事件
		$('#refreshGuideTableBtn').click(function(event) {
			refreshTable();
		});

		// 调整按钮，新增数据事件
		$('#adjustBtn, #addAdjustBtn').on('click', function() {
			window.editId = 1;
			$('#adjust_show').show();
			$('#jnadjust_dgYear2').parent().hide();
			$('#adjustYear').parent().parent().show();
			$('#heavy_classification').show();
			window.adjustPageId = true;
			journalAdjust(projectYear, findMaxNo(), '', agrs.adjustTyle ? '1' : '2', false, refreshTable);

			if ($('#adjustYear').length == 0) {
				$('#adjust_title > span').prepend(
					'<span style="color: white">调整年份: ' +
					'<select id="adjustYear" style="color: #0000009e; border: 0;">' +
					'<option value="' + projectYear + '" selected>' + projectYear + '</option>' +
					'<option value="' + (projectYear - 1) + '">' + (projectYear - 1) +
					'</option>' +
					'</select> </span>'
				)
			}
		});

		// 修改
		$('#adjustTable').on('click', 'button[name="adEdit"]', function() {
			openEditModal($(this));
		});



		$('#invalid-select').append(errorType);
		var  cusNode = {};
		$('#invalid_save').click(function () {
			bdoInProcessingBox("修改中");
			let data = {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: agrs.data.extraOptions.cusNode.adjustYear,
					param3: agrs.data.extraOptions.cusNode.adjustIndexId,
					param4: window.CUR_PROJECTID,
					param5: $('#disabledReason').val(),
					param7: $('#radio-div-id input:checked').val(),
					param8: $('#invalid-select').val()
				};
				$.ajax({
					url: 'dgCenter/DgAdjust.journalBolish.json',
					type: 'post',
					data: addWorkpaperId(data, 'param6'),
					dataType: 'json',
					success: function(data) {
						refreshTable();
						if (data.success) {
							if(data.resultInfo.statusText != ''){
								bdoInfoBox('成功', data.resultInfo.statusText, 15000);
							}else{
								bdoSuccessBox('成功', data.resultInfo.statusText);
							}
							document.getElementById('invalid_form').reset();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
		});

		// 启用/禁用
		$('#adjustTable').on('click', 'button[name="adBan"]', function() {
			enableOrDisable($(this));
		});

		// 删除
		$('#adjustTable').on('click', 'button[name="adDelete"]', function() {
			deleteAdjust($(this));
		});

		$('#ast_save').bind('generate', function () {
			// 是否只生成末级科目
			doGenerate(true);
		});
		$('#ast_save').click(function () {
			bdoInProcessingBox('正在生成' + rearrangeName + '!');
			setTimeout(() => {$('#ast_save').trigger('generate')},1000);
		});
		// 负值重分类 标题说明直接跳转往来客户
		$('#go_to_contacts').click(function (){
			if (window.sys_menuId != null && window.sys_menuId != '' && typeof (window.sys_menuId) != 'undefined') {
				localStorage.setItem("menuId", window.sys_menuId);
			}
			window.open("./contacts/index.html");
		});

		/**
		 * 选择好了负值重分类的科目 弹出选择对方科目页面
		 */
		$('#vch_save').click(function () {
			// $('#vch_account_table').treegrid('getCheckedNodes')
			let showData = [];
			$('#vch_account_table').treegrid('getCheckedNodes').forEach((value) => {
				// 移除父节点
				if (value && value.hasOwnProperty('children') && !value.children) {
					showData.push(value);
				}
			});
			showData.sort(function (a, b) {
				if (a.subjectId > b.subjectId) return 1;
				if (b.subjectId > a.subjectId) return -1;
				return 0;
			});

			reclassification_setting_view.localParam.data = showData;
			$('#account_subject_table').modal('show');
			BdoDataTable('ast_account_table', reclassification_setting_view);
			$('input[name="checkSubjectAll"]').off('click');
			$('input[name="checkSubjectAll"]').on('click',onCheckSubjectAll);
		});


		/**
		 * 对方科目选择
		 */
		$('#ast_account_table').on('focus', 'tbody > tr > td > div > input', function () {
			$('#modal_vch_opp_subjectid').modal('show');
			if ($('#opp_subject_tree').hasClass('treeview')) {
				curRowData = $('#ast_account_table').DataTable().row($(this).parent().parent()).data();
				return;
			}
			let adjustYear = $('#adjustYear').val();
			if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
				adjustYear = $('#jnadjust_dgYear2').text();
			}
			$('#opp_subject_tree').tree4({
				url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
				params: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param9: window.CUR_CUSTOMERID,
					param10: adjustYear,// $("#jnadjust_year").val()//更改
					param11: window.CUR_PROJECTID,
					param12: getShowType(),
					searchInputId: 'opp_searchInput'
				},
				singleSelect: true,
				// lazyLoad : false,
				// onceLoad : true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false,
					showCheckbox: false,
					selectedColor: '',
					selectedBackColor: ''

				}
				/*lazyLoad : false,
				view : {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''
				}*/
			});

			curRowData = $('#ast_account_table').DataTable().row($(this).parent().parent()).data();
		});

		/**
		 * 添加对方科目分析行
		 */
		$('#allTableContent2').on('click', 'button[name=dfAdd]', function () {
			addRow(this);
		});
		/**
		 * 对方科目 根据下拉选选择的科目 寻找对应的金额
		 */
		$('#allTableContent2').on('click', 'button[name=dfEdit]', function () {
			let rowDiv = $(this).closest('div');
			// 对方科目下拉选选择的科目id
			let selectSubjectId = rowDiv.find('select > option:selected').val();
			let rowInput = rowDiv.find('input[name="dfValue"]');
			// 所有科目的input框
			let allSubject = rowDiv.closest('table').find('tbody > tr > td > input[name="jnsubject"]');
			for (let i = 0; i < allSubject.length; i++) {
				let subjectInput = $(allSubject[i]);
				// 比较科目编号是否相等
				if (selectSubjectId === subjectInput.attr('data-result')) {
					let debitAmount = subjectInput.closest('tr').find('td > input[name="outjnvalue"]');
					if (debitAmount.prop('disabled')) {
						let creditAmount = subjectInput.closest('tr').find('td > input[name="injnvalue"]');
						rowInput.val(creditAmount.val());
						rowInput.text(creditAmount.val());
					} else {
						rowInput.val(debitAmount.val());
						rowInput.text(debitAmount.val());
					}
					// 匹配上了一个就直接返回
					break;
				}
			}
		});

		$('#allTableContent2').on('click', 'button[name=dfClear]', function () {
			/** 行按钮 清空金额 */
			$(this).closest('tr').attr('data-change', '1');
			$(this).closest('div').find('input[name="dfValue"]').val('');
		});

		/** 行按钮 移除 */
		$('#allTableContent2').on('click', 'button[name=dfDel]', function () {
			if ($(this).closest('td').find('div').length == 1) {
				bdoInfoBox('提示', '至少需要保留一行', 1000);
				return;
			}
			$(this).closest('tr').attr('data-change', '1');
			$(this).closest('div').remove();
		});

		/**
		 * 对方科目下拉选择不对
		 */
		$('#allTableContent2').on('change', 'select[name="dfSubject"]', function () {
				let selectValue = $(this).val();
				$(this).parent().find("option").attr('selected', false);
				$(this).find('option[value="' + selectValue + '"]').attr("selected", true);
				$(this).val(selectValue);
			}
		);
	};

	/** 对话框table初始化参数 */
	var jnadjust_view = {
		localParam: {
			tabNum: false
		},
		tableParam: {
			pageLength: 1000,
			data: initData,
			dom: '<"row"<"col-sm-12"tr>>',
			ordering: false,
			lengthChange: false,
			select: false,
			scrollY: false,
			// stateSave : false,
			// rowGroup : {dataSrc : 2},
			createdRow: function(row, data, index) {
				$(row).find('[name="jncurrency"]').val(data.currency);
				$(row).find('[name="jndirection"]').val(data.dirction);
			},
			drawCallback() {

			},
			columns: [
				{
					title: '处理',
					width: '80px',
					className: 'text-center',
					render: function(data, type, row, meta) {
						// 设置操作按钮，第一行可以添加行，至少有两行，第一行第二行
						var styleName = 'style="visibility:hidden" disabled';
						var deleteStyle = '';
						var renderStr = '<input class="form-control" type="hidden" name="jnautoId" value="' + row.autoId + '">';
						renderStr += '<input class="form-control" type="hidden" name="jnautoReason" value="' + row.reason + '">';
						if (row.showAdd) {
							styleName = '';
						}
						/*if (row.autoId) {
							deleteStyle = styleName;
						}*/
						renderStr += '<button class="btn btn-xs btn-success" type="button" name="jnadjust_plus_row" data-placement="top" title="添加一行" ' + styleName + '><i class="fa fa-plus""></i></button>&nbsp;';
						renderStr += '<button class="btn btn-xs btn-danger" type="button" name="jnDelete" data-placement="top" title="删除" data-toggle="tooltip " ' + deleteStyle + '><i class="fa fa-times"></i></button>';
						renderStr += '<div style="float:right;">';
						renderStr += '	<label class="css-input css-checkbox css-checkbox-primary control-label" title="是否受限">';
						renderStr += '		<input type="checkbox" name="jnadjust_check">';
						renderStr += '		<span></span>';
						renderStr += '	</label>';
						renderStr += '</div>';
						return renderStr;
					}
				}, {
					title: '索引号',
					className: 'text-center',
					width: '100px',
					data: 'indexId',
					render: function(data, type, row, meta) {
						var renderStr = '';
						var index = 0;
						if (window.editId == 0) {
							renderStr += '<input class="form-control" type="hidden" name="jnvoucherId2" value="' + row.indexId + '">' + row.indexId;
							// return renderStr;
						} else if (window.editId == 1) {

							var table_length = $.fn.dataTable.tables(true).length - 1;
							for (let i = 0; i < table_length; i++) {
								index = i;
							}
							var initIndex = window.adjustDgNO + '-' + addZero(index, 4);
							renderStr += '<input class="form-control" type="hidden" name="jnvoucherId2" value="' + initIndex + '">' + initIndex;
						}
						return renderStr;
					}
				}, {
					title: '摘要',
					className: 'text-left',
					width: '200px',
					data: 'summary',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<input class="form-control" type="text" name="jnsummary" value="' + data + '">';
						return renderStr;
					}
				}, {
					title: 'TB科目',
					className: 'text-left',
					width: '100px',
					data: 'adjustSubjectTB',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<input class="form-control" disabled type="text" data-result="' + row.adjustSubjectCodeReport + ':' + row.adjustSubjectReport + '" data-content="' + row.adjustSubjectTB + '" id="jnadjust' + (window.tabindex++) + '" name="jnadjust" value="' + row.adjustSubjectTB + '">';
						return renderStr;
					}
				}, {
					title: '科目',
					className: 'text-left',
					width: '100px',
					data: 'subjectId',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<input class="form-control" type="text" data-result="' + row.subjectId + '" data-content="' + row.subjectContent + '" id="jnsubject' + (window.tabindex++) + '" name="jnsubject" value="' + row.subjectContent + '">';
						return renderStr;
					}
				}, {
					title: '辅助核算',
					className: 'text-left',
					width: '100px',
					data: 'assitemType',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<input class="form-control" type="text" data-result="' + (row.assItemId ? row.assItemId : '') + '" data-content="' + (row.assItemName ? row.assItemName : '') + '" id="assitemType' + (window.tabindex++) + '" name="assitemType" value="' + (row.assItemName ? row.assItemName : '') + '">';
						return renderStr;
					}
				},

				{
					title: '方向',
					className: 'hidden',
					width: '50px',
					data: 'dirction',
					render: function(data, type, row, meta) {
						var renderStr = '';
						renderStr += '<select class="form-control" name="jndirection"><option></option><option value="1">借</option><option value="-1">贷</option></select>';
						return renderStr;
					}
				}, {
					title: '借方金额',
					className: 'text-right',
					width: '100px',
					data: 'outOccurValue',
					render: function(data, type, row, meta) {
						data = '';
						type = '';
						if (row.dirction > 0) {
							data = row.occurValue;
						} else if (row.dirction < 0) {
							type = 'disabled';
						}
						return '<input class="form-control" type="text" name="outjnvalue" value="' + data + '" style="text-align:right" ' + type + '>';
					}
				}, {
					title: '贷方金额',
					className: 'text-right',
					width: '100px',
					data: 'inOccurValue',
					render: function (data, type, row, meta) {
						data = '';
						type = '';
						if (row.dirction < 0) {
							data = row.occurValue;
						} else if (row.dirction > 0) {
							type = 'disabled';
						}
						return '<input class="form-control" type="text" name="injnvalue" value="' + data + '" style="text-align:right" ' + type + '>';
					}
				}, {
					title: '对方科目',
					className: 'text-left',
					width: '350px',
					data: 'oppSubjectJson',
					render: function (data, type, row, meta) {

						let _inputspan = $('<span class="row-input"></span>');
						let _btnspan = $('<span class="row-btn"></span>');
						let dfValue = '&nbsp;<input name="dfValue" style="width:120px;" class="text-right"/>';
						let dfSubject = '<select style="width:120px;" name="dfSubject">' ;
							// '</select>';
						if (row.oppSubjectJson) {
							// let json = JSON.parse(row.oppSubjectJson);
							let oppJson =  row.oppSubjectJson.replace(',}',"}");
							let json = JSON.parse(oppJson);
							let dirction = row.dirction === 1 ? '贷：' : '借：';
							let isFirst = true;
							if (Object.keys(json).length>1){
								let returnHtml = '';
								for (let key in json) {
									let value = json[key];
									// 循环 重新初始化
									_inputspan = $('<span class="row-input"></span>');
									_btnspan = $('<span class="row-btn"></span>');
									dfSubject = '<select style="width:120px;" name="dfSubject">' ;
									dfSubject += '<option value="' + key + '">' + dirction + key + ' </option>';
									dfSubject += '</select>';
									dfValue = '&nbsp;<input name="dfValue" style="width:120px;" value="' + formatMoney2(value) + '" class="text-right"/>';
									_inputspan.append(dfSubject).append(dfValue);
									if (isFirst){
										_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
									}else {
										_btnspan.append(dfEdit).append(dfClear).append(dfDel);
									}
									returnHtml +=('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>')
									isFirst = false;
								}
								return returnHtml;
							}else {
								for (let key in json) {
									let value = json[key];
									dfSubject += '<option value="' + key + '">' + dirction + key + ' </option>';
									dfValue = '&nbsp;<input name="dfValue" style="width:120px;" value="'+formatMoney2(value)+'" class="text-right"/>';
								}
								dfSubject += '</select>';
								_inputspan.append(dfSubject).append(dfValue);
								_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
								return ('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
							}
						}
						dfSubject += '</select>';
						_inputspan.append(dfSubject).append(dfValue);
						_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
						return ('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');

					}
				}, {
					title: '币种',
					className: 'hidden',
					width: '80px',
					data: 'currency',
					render: function (data, type, row, meta) {
						var renderStr = '';
						renderStr += '<select class="form-control" name="jncurrency"><option></option><option value="人民币">人民币</option><option value="美元">美元</option><option value="欧元">欧元</option></select>';
						renderStr += '<input name="active_flag" value="' + row.active_flag ? row.active_flag : 1 + '" >';
						return renderStr;
					}
				}, {
					title: '原币金额',
					className: 'hidden',
					width: '100px',
					data: 'currValue',
					render: function (data, type, row, meta) {
						var renderStr = '';
						renderStr += '<input class="form-control" type="text" name="jncurrvalue" value="' + data + '" style="text-align:right">';
						return renderStr;
					}
				}
			]
		}
	};

	// 弹出对话框
	var journalAdjust = function(subjectYear, num, editData, adjustType, flag, callback) {
		$('#vch_filter_subject').val('');
		$('#vch_filter_accItem').val('');
		window.tabindex = 0;
		window.minNum = num;
		window.maxNum = ++num;
		$('#jnadjust_dgName2').text(agrs.data.extraOptions.nodeName);
		$('#jnadjust_type2').text(adjustType);
		// if (adjustType == '2') {
		// $('#jnadjust_dgYear2').text(CUR_PROJECT_ACC_YEAR - 1);
		// } else {
		// }
		$('#jnadjust_dgYear2').text(subjectYear);

		// 编辑/新增，判断是否有数据
		if (editData && editData.length > 0) {
			editData[0].showAdd = '1';
			jnadjust_view.tableParam.data = editData;
		} else {
			jnadjust_view.tableParam.data = initData;
			jnadjust_view.tableParam.data[0].num = window.maxNum;
			jnadjust_view.tableParam.data[1].num = window.maxNum;
		}

		// 隐藏禁用添加按钮
		if (flag) {
			$('#jnadjust_plus2').css('visibility', 'hidden');

		} else {
			$('#jnadjust_plus2').css('visibility', 'visible');

		}

		$('#modal_jnadjustform2').css('display', 'block');

		delete jnadjust_view.tableParam.aaData;
		if (!window.adjustPageId) {
			$('#jnadjust_balance2').text('0');
			$('#jnadjust_credit2').text('0');
			$('#jnadjust_debit2').text('0');
			let table = $('table[id^=jnadjust_table_id]')[0].id;
			BdoDataTable(table, jnadjust_view);
			jnamountCalu(table);
		} else {
			if ($('#jnadjust_table_id').length == 0) {
				let id = 'jnadjust_table_id';
				var tableHtml = '';
				var styleName = 'style="position: relative; left: 64%; width: 40%;"';
				tableHtml += '<div class="row" ' + styleName + '><div class="col-sm-4" style="font-size: 14px;padding-left: 11px;">差额(借-贷) : <br/><span data-name="jnadjust_balance2" id="jnadjust_balance2">' + parseFloat(0).toFixed(2) + '</span></div>';
				tableHtml += '<div class="col-sm-4" style="font-size: 14px;padding-left: 3px;">借方金额(合计) : <br/><span data-name="jnadjust_debit2" id="jnadjust_debit2">' + parseFloat(0).toFixed(2) + '</span></div>';
				tableHtml += '<div class="col-sm-4" style="font-size: 14px;padding-left: 0px;">贷方金额(合计) : <br/><span data-name="jnadjust_credit2" id="jnadjust_credit2">' + parseFloat(0).toFixed(2) + '</span></div></div>';
				tableHtml += '<div class="row"><table id="' + id + '" class="table table-bordered table-striped table-hover"></table></div>';
				$('#allTableContent2').append(tableHtml);
			}
			BdoDataTable('jnadjust_table_id', jnadjust_view);
			jnamountCalu('jnadjust_table_id');
		}


		window.editId = 1;


		// 关闭对话框
		$('#adjust_close').click(function() {
			$('#modal_jnadjustform2').css('display', 'none');
			delete window.maxNum;
			delete window.tabindex;
			delete window.minNum;
			$('#allTableContent2').html(modalHtml);
			if (callback != null) {
				callback;
			}
			window.editId = -1;
			refreshTable();
		});

	};

	// 计算借方 贷方 差额
	var jnamountCalu = function(id) {
		var debit = 0;
		var credit = 0;
		$('#' + id + ' tbody tr').each(function() {

			var inValue = $(this).find('[name="injnvalue"]').val();
			inValue = inValue.replace(/,| |\t/g,'');
			var outValue = $(this).find('[name="outjnvalue"]').val();
			outValue = outValue.replace(/,| |\t/g,'');
			debit += parseFloat(parseFloat((inValue ? inValue : 0)).toFixed(2));
			credit += parseFloat(parseFloat((outValue ? outValue : 0)).toFixed(2));
		});
		var prevRow = $('#' + id).closest('.dataTables_wrapper').closest('.row').prev();
		prevRow.find('[data-name="jnadjust_debit2"]').text(formatMoney2(credit));
		prevRow.find('[data-name="jnadjust_credit2"]').text(formatMoney2(debit));
		prevRow.find('[data-name="jnadjust_balance2"]').text(formatMoney2(credit - debit));
	};

	// 负值重分类 对方科目当前行数据
	let curRowData;

	/**
	 * 设置子科目 对方的科目
	 *
	 * @param curRowData
	 *            当前行数据
	 * @param tableData
	 *            表格数据
	 * @param subjectId
	 *            客户科目id
	 * @param subjectLabel
	 *            客户科目label 1121-应收账款
	 */
	function setChildSubject(curRowData, tableData, subjectId,subjectLabel) {
		let selectData = $('#ast_account_table').DataTable().rows('.selected').data();
		if (selectData.length == 0) {
			selectData.push(curRowData);
		}
		for (let i = 0; i < tableData.length; i++) {
			let value = tableData[i];
			// if (curRowData.subjectId === value.subjectId) {
			// }
			for (let j = 0; j < selectData.length; j++) {
				let selectDatum = selectData[j];
				if (selectDatum.assItemId === value.assItemId) {
					value.oppositeSubject = subjectId;
					value.oppositeSubjectLabel = subjectLabel;
					let oppInput = $($('#ast_account_table > tbody > tr > td > div > input')[i]);
					oppInput.val(subjectLabel);
					oppInput.closest('tr').removeClass('selected')
				}
			}
		}
		$('input[name="checkSubjectAll"]').prop("checked",false);
	}

	/**
	 * 少量负值重分类数据提交方法
	 * @param size 调整总条数
	 * @param filteredData 调整数据
	 */
	function littleDataCommit(size, filteredData) {
		let i = 0;
		let subjectIdRowNumberMap = new Map();
		let subjectIdSet = new Set();
		for (let rowNumber = 0; rowNumber < size; rowNumber++) {
			let filteredDatum = filteredData[i];
			generateRowData(rowNumber, filteredDatum, filteredDatum.direction, false);
			subjectIdRowNumberMap.set(rowNumber, filteredDatum.subjectId);
			rowNumber++;
			generateRowData(rowNumber, filteredDatum, filteredDatum.direction * -1, true);
			i++;
			subjectIdRowNumberMap.set(rowNumber, filteredDatum.oppositeSubject);
			subjectIdSet.add(filteredDatum.subjectId);
			subjectIdSet.add(filteredDatum.oppositeSubject);
		}
		let subjectIds = JSON.stringify(Array.from(subjectIdSet));
		let year = getAdjustYear();
		$.ajax({
			url: 'dgCenter/DgAdjust.findTbSubjectByUserSubject.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param14: window.CUR_CUSTOMERID,
				param15: departIdSession,
				param16: subjectIds,
				param17: window.CUR_PROJECTID,
				param18: year
			},
			dataType: 'json',
			success: function (data) {
				if (data.data && data.data.length != 0) {
					let result = data.data[0];
					for (let [key, value] of subjectIdRowNumberMap) {
						// console.log(key + ' = ' + value);
						let $node = $('#jnadjust_table_id > tbody > tr:nth-child(' + (key + 1) + ') > td:nth-child(5) > input');
						let $prevNode = $node.closest('tr').find('[name=jnadjust]');
						let obj = result[value];
						$prevNode.val(obj);
						$prevNode.attr('data-result', obj);
						$prevNode.attr('data-content', obj);
					}
				}

			}
		});
		$('#jnadjust_type3').text('3');
	}

	/**
	 * 设置提交前的数
	 * @param tableIndex 索引下标
	 * @param filteredDatum 行数据
	 * @param direction 借贷方向
	 * @param tableDataArray 要提交的数组
	 * @param isOppSubject 是否为对方科目行
	 */
	function setPreCommitRowData(tableIndex, filteredDatum, direction, tableDataArray, isOppSubject) {
		let subjectId = filteredDatum.subjectId;
		let subjectName = filteredDatum.subjectName;
		let tableData = tableDataArray[tableIndex];
		let subjectLabel;
		let data = {
			result: filteredDatum.subjectId,
		};
		let oppObject = {};
		if (isOppSubject) {
			subjectId = filteredDatum.oppositeSubject;
			subjectLabel = filteredDatum.oppositeSubjectLabel;
			data.result = filteredDatum.oppositeSubject;
			oppObject[filteredDatum.subjectId] = String(filteredDatum.balance * -1);
		}else {
			oppObject[filteredDatum.oppositeSubject] = String(filteredDatum.balance * -1);
		}
		tableData.oppSubjectJson = JSON.stringify(oppObject);
		tableData["indexLength"] = 4;
		tableData["isEliminate"] = false;
		tableData["workpaperId"] = agrs.data.extraOptions.workpaperId ? agrs.data.extraOptions.workpaperId : 0;
		// let str = $(this).find('[name="jnvoucherId2"]').val();
		// let key = str.substring(-1, str.length - 5);
		// tableData["indexKey"] = key;
		let year = getAdjustYear();
		tableData.summary = rearrangeName;
		tableData.subjectId = subjectId;
		tableData.subjectName = subjectLabel ? subjectLabel : subjectId + '-' + subjectName;
		if (direction == 1) {
			// 借方
			tableData.inValue = String(filteredDatum.balance * -1);
		} else {
			tableData.outValue = String(filteredDatum.balance * -1);
		}
		tableData.year = year;
		// 辅助核算
		if (filteredDatum.assItemName) {
			tableData.assItem = filteredDatum.assItemId;
			tableData.assItemName = filteredDatum.assItemName;
			tableData.assItemId = filteredDatum.assItemId;
		}
		tableDataArray[tableIndex] = tableData;
	}

	/**
	 * 大量负值重分类提交方法
	 */
	function bigDataCommit(size, filteredData) {
		let i = 0;
		let subjectIdRowNumberMap = new Map();
		let subjectIdSet = new Set();
		let tableDataArray =  $('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().rows().data();
		for (let rowNumber = 0; rowNumber < size; rowNumber++) {
			let filteredDatum = filteredData[i];
			setPreCommitRowData(rowNumber, filteredDatum, filteredDatum.direction, tableDataArray,false);
			subjectIdRowNumberMap.set(rowNumber, filteredDatum.subjectId);
			rowNumber++;
			setPreCommitRowData(rowNumber, filteredDatum, filteredDatum.direction * -1, tableDataArray,true);
			i++;
			subjectIdRowNumberMap.set(rowNumber, filteredDatum.oppositeSubject);
			subjectIdSet.add(filteredDatum.subjectId);
			subjectIdSet.add(filteredDatum.oppositeSubject);
		}
		let subjectIds = JSON.stringify(Array.from(subjectIdSet));
		let year = getAdjustYear();
		$.ajax({
			url: 'dgCenter/DgAdjust.findTbSubjectByUserSubject.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param14: window.CUR_CUSTOMERID,
				param15: departIdSession,
				param16: subjectIds,
				param17: window.CUR_PROJECTID,
				param18: year
			},
			dataType: 'json',
			success: function (data) {
				if (data.data && data.data.length != 0) {
					let result = data.data[0];
					for (let [key, value] of subjectIdRowNumberMap) {
						let tableData = tableDataArray[key];
						tableData.adjustSubjectTB = result[value];
						// tableDataArray[key] = tableData;
					}
					// console.log(tableDataArray);
					bigAdjustCommit(tableDataArray);
				}
			}
		});
		$('#jnadjust_type3').text('3');
	}

	/**
	 * 直接提交调整
	 * @param tableDataArray 调整数据
	 */
	function bigAdjustCommit(tableDataArray) {
		let isReclassification = $('#jnadjust_type3').text() ? 1 : 0;
		// 审计调整与客户调整年份取值不同的问题
		let adjustYear = $('#adjustYear').val();
		if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
			adjustYear = $('#jnadjust_dgYear2').text();
		}
		// 审计调整修改的问题
		if (!adjustYear) {
			adjustYear = $('#jnadjust_dgYear2').text();
		}
		// json 转换问题
		let commitArray = [];
		for (let i = 0; i < tableDataArray.length; i++) {
			tableDataArray[i]["sortNo"] = i;
			commitArray[i] = tableDataArray[i];
		}
		$('#vch_account_table').treegrid('clearChecked');
		let index = $('#allTableContent2 button[name="jnadjust_plus_row"]').closest('tr').find('[name=jnvoucherId2]').val();
		let indexKey = $('#jnadjust_table_id > tbody > tr:nth-child(' + ( 1) + ') > td:nth-child(2) > input').val();
		indexKey = indexKey.substring(-1, indexKey.length - 5);
		// 清除表格
		$('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().clear()
		$('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().row.add({
			autoId: '',
			subjectId: '',
			indexId: index,
			indexKey:indexKey,
			subjectName: '',
			subjectContent: '',
			adjustSubjectTB: '',
			adjustSubjectCodeReport: '',
			adjustSubjectReport: '',
			yyyy: '',
			summary: '',
			currency: '',
			currValue: '',
			workpaperId: 0,
			dirction: '',
			occurValue: '',
			reason: ''
		}, {
			autoId: '',
			subjectId: '',
			indexId: index,
			indexKey:indexKey,
			subjectName: '',
			subjectContent: '',
			adjustSubjectTB: '',
			adjustSubjectCodeReport: '',
			adjustSubjectReport: '',
			yyyy: '',
			summary: '',
			workpaperId: 0,
			currency: '',
			currValue: '',
			dirction: '',
			occurValue: '',
			reason: ''
		});
		$.ajax({
			url: 'dgCenter/DgAdjust.mulvoucherAdjust.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1: JSON.stringify(commitArray),
				param2: window.CUR_CUSTOMERID,
				// 审计调整年份
				param3: adjustYear,
				param4: $('#jnadjust_type2').text(),// 审计调整或重分类调整
				param5: window.CUR_PROJECTID,
				param6: getShowType(),
				param10: isReclassification
			},
			dataType: 'json',
			success: function (data) {
				window.hasSubmit = false;
				$('#searchInput3').val('');
				if (data.success) {
					$('#jnadjust_type3').text('');
					if(data.resultInfo.statusText != ''){
						bdoInfoBox('成功', data.resultInfo.statusText, 15000);
					}else{
						bdoSuccessBox('成功', data.resultInfo.statusText);
					}
					$('#jnadjust_table_id').closest('.dataTables_wrapper').closest('.row').nextAll().remove();
					$('#' + $('table[id^=jnadjust_table_id]')[0].id).closest('.dataTables_wrapper').closest('.row').parent().children().remove();
					$('#jnadjust_dgYear2').text(projectYear);
					$('#modal_jnadjustform2').hide();
					refreshTable();
					// 为申报表保存后不刷新问题
					if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
						$('#rpt_search').click();
					}
				} else {
					bdoErrorBox('失败', data.resultInfo.statusText);
				}
			}
		});
		$('#jnadjust_type3').text('');
	}

	/**
	 * 生成负值重分类调整
	 *
	 * @param generatedLastSubject
	 *            是否只生成末级
	 */
	function doGenerate(generatedLastSubject) {
		let table = $('#ast_account_table').DataTable();
		let selectData = table.rows().data();
		// console.log(selectData.length + ' row(s) selected');
		let filteredData = [];
		// 过滤数据 判断是值生成末级科目 还是生成一级科目
		for (let i = 0; i < selectData.length; i++) {
			let selectDatum = selectData[i];
			let hasOwnProperty = selectDatum.hasOwnProperty('children');
			if (generatedLastSubject && ((hasOwnProperty && !selectDatum.children) || !hasOwnProperty)) {
				filteredData.push(selectDatum);
			} else if (!generatedLastSubject && hasOwnProperty && !selectDatum.children) {
				filteredData.push(selectDatum)					// 清除表格
				;
			}
		}
		let size = filteredData.length * 2
		if (filteredData.length > 1) {
			let index = $('#allTableContent2 button[name="jnadjust_plus_row"]').closest('tr').find('[name=jnvoucherId2]').val();
			let indexKey = $('#jnadjust_table_id > tbody > tr:nth-child(' + ( 1) + ') > td:nth-child(2) > input').val();
			indexKey = indexKey.substring(-1, indexKey.length - 5);
			$('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().clear()
			$('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().row.add({
				autoId: '',
				subjectId: '',
				indexId: index,
				indexKey:indexKey,
				subjectName: '',
				subjectContent: '',
				adjustSubjectTB: '',
				adjustSubjectCodeReport: '',
				adjustSubjectReport: '',
				yyyy: '',
				summary: '',
				currency: '',
				currValue: '',
				workpaperId :0,
				dirction: '',
				occurValue: '',
				reason: ''
			},{
				autoId: '',
				subjectId: '',
				indexId: index,
				subjectName: '',
				subjectContent: '',
				adjustSubjectTB: '',
				adjustSubjectCodeReport: '',
				adjustSubjectReport: '',
				yyyy: '',
				indexKey:indexKey,
				summary: '',
				workpaperId :0,
				currency: '',
				currValue: '',
				dirction: '',
				occurValue: '',
				reason: ''
			});
			// 提前生成行
			for (let i = 1; i < size; i++) {
				window.editId = 0;
				$('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().row.add({
					autoId: '',
					subjectId: '',
					indexId: index,
					indexKey:indexKey,
					subjectName: '',
					subjectContent: '',
					adjustSubjectTB: '',
					adjustSubjectCodeReport: '',
					adjustSubjectReport: '',
					yyyy: '',
					summary: '',
					currency: '',
					workpaperId :0,
					currValue: '',
					dirction: '',
					occurValue: '',
					reason: ''
				});
			}
		}
		if (size < 20){
			$('#allTableContent2 button[name="jnadjust_plus_row"]').closest('table').DataTable().draw();
			littleDataCommit(size, filteredData);
		}else {
			bigDataCommit(size,filteredData);
		}
		swal.close();
		// generateTheAmount(subjectDirection);
		// console.log(subjectIdRowNumberMap);
	}

	/**
	 * 生成行调整
	 *
	 * @param i
	 *            第几行
	 * @param filteredData
	 *            行数据
	 * @param direction
	 *            借贷方向
	 */
	function generateRowData(i, filteredData,direction,isOppSubject) {
		let subjectId = filteredData.subjectId;
		let subjectName = filteredData.subjectName;
		let subjectLabel;
		let data = {
			result: filteredData.subjectId,
		};
		if (isOppSubject){
			subjectId = filteredData.oppositeSubject;
			subjectLabel = filteredData.oppositeSubjectLabel;
			data.result = filteredData.oppositeSubject;
		}
		// 客户科目
		$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(3) > input').val(rearrangeName);
		$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(5) > input').attr('data-result', subjectId);
		$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(5) > input').attr('data-content', subjectLabel ? subjectLabel : subjectId + '-' + subjectName);
		$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(5) > input').attr('data-contentdata', subjectLabel ? subjectLabel : subjectId + '-' + subjectName);
		$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(5) > input').val(subjectLabel ? subjectLabel : subjectId + '-' + subjectName);

		// $('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').val(selectData.balanceF);
		if (direction == 1) {
			// 借方
			if (filteredData.balance < 0) {
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').val(formatMoney2(filteredData.balance * -1));
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(9) > input').val('');
			} else {
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(9) > input').val(formatMoney2(filteredData.balance));
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').val('');
			}

			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').trigger('change');
			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(9) > input').trigger('change');
		} else {
			if (filteredData.balance < 0) {
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(9) > input').val(formatMoney2(filteredData.balance * -1));
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').val('');
			} else {
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').val(formatMoney2(filteredData.balance));
				$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(9) > input').val('');
			}
			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(8) > input').trigger('change');
			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(9) > input').trigger('change');
		}
		// 批量查询优化
		// subjectCallBack($('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(5) > input'), '', data);
		// 辅助核算
		if (filteredData.assItemName) {
			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(6) > input').attr('data-content', filteredData.assItemName);
			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(6) > input').attr('data-result', filteredData.assItemId);
			$('#jnadjust_table_id > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(6) > input').val( filteredData.assItemName);
		}
	}


	/**
	 * 前端对方科目借贷金额校验
	 * @returns {boolean}
	 */
	function counterpartyAmountCheck() {
		let rowDataArray = $('#jnadjust_table_id > tbody > tr ');
		let debitValue = 0;
		let creditValue = 0;
		for (let i = 0; i < rowDataArray.length; i++) {
			let rowData = $(rowDataArray[i]);
			let direction = 1;
			let rowAmount  = $(rowData.find('input')[8]).val();
			if ($(rowData.find('input')[9]).val() != "") {
				direction = -1;
				rowAmount = $(rowData.find('input')[9]).val();
			}
			let oppValueTd = $(rowData.find('td')[9]);
			let valueInputArray = oppValueTd.find('div span.row-input input');
			let oppSubjectArray = oppValueTd.find('div span.row-input select option:selected');
			let rowSum = 0;
			for (let j = 0; j < oppSubjectArray.length; j++) {
				let oppSubjectName = $(oppSubjectArray[j]).text();
				let oppSubjectAmount = $(valueInputArray[j]).val();
				oppSubjectAmount = oppSubjectAmount.replace(/[, \t]/g, '');
				let amount;
				// if ((oppSubjectName + "").startsWith("借：")) {
				if (direction === 1) {
					amount = parseFloat(parseFloat((oppSubjectAmount ? oppSubjectAmount : 0)).toFixed(2));
					debitValue += amount;
				} else {
					amount = parseFloat(parseFloat((oppSubjectAmount ? oppSubjectAmount : 0)).toFixed(2));
					creditValue +=  amount;
				}
				rowSum += amount;
			}
			if(String(parseFloat(rowSum).toFixed(2)) != String(parseFloat(rowAmount.replace(/,/g, '')).toFixed(2))){
				return false;
			}
		}
		let creditStr = String(parseFloat(creditValue).toFixed(2));
		let debitStr = String(parseFloat(debitValue).toFixed(2));



		return creditStr === debitStr;
	}

	function onCheckSubjectAll(){
		if ($('input[name="checkSubjectAll"]').is(":checked")==true){
			// $("input[name='checkSubject']").each(function () {
			// this.checked = true;
			// });
			$('#ast_account_table tr').addClass('selected');
		}else {
			// $('input[name="checkSubjectAll"]').prop("checked", false);
			// $("input[name='checkSubject']").each(function () {
			// this.checked = false;
			// });
			$('#ast_account_table tr').removeClass('selected');
		}

	}
	/**
	 * 查询指定子节点的顶级父节点
	 *
	 * @param treeId
	 *            树id
	 * @param nodeId
	 *            节点id
	 * @returns {*} 顶级节点id
	 */
	function setParent(treeId,nodeId) {
		let node = $('#'+treeId).treeview(true).getNode(nodeId);
		if (node && node.parentId){
			setParent(treeId,node.parentId)
		}else {
			$('#vch_filter_subject').val(node.id);
		}
	}
	// 绑定对话框操作事件
	var bindModalEvent = function() {
		// 生成表格的索引
		var maxTableIndex = 0;
		// 添加一组
		$('#jnadjust_plus2').click(function() {
			// $('.modal-content').resize();

			var $tables = $('table[id^=jnadjust_table_id]');
			window.maxNum++;
			// 给新增table初始值
			jnadjust_view.tableParam.data = initData;
			jnadjust_view.tableParam.data[0].num = window.maxNum;
			jnadjust_view.tableParam.data[1].num = window.maxNum;
			// 隐藏表头和计算结果样式
			var styleName = 'style="position: relative; left: 64%; width: 40%;"';
			let id = 'jnadjust_table_id' + maxTableIndex++;
			if ($tables.length > 0) {
				styleName = 'style="float: right;width: 40%;top:3rem;"';
				jnadjust_view.tableParam.initComplete = function(settings, json) {
					// console.log('jnadjust_view.tableParam.initComplete');
					if ($('table[id^=jnadjust_table_id]').length != 1) {
						$(this).parent().prev().css('display', 'none');
					}
				};
				// 新增table，初始化
				var tableHtml = '';

				tableHtml += '<div class="row" ' + styleName + '><div class="col-sm-4" style="font-size: 14px;padding-left: 25px;">差额(借-贷) : <br/><span data-name="jnadjust_balance2" id="jnadjust_balance2">' + parseFloat(0).toFixed(2) + '</span></div>';
				tableHtml += '<div class="col-sm-4" style="font-size: 14px;padding-left: 18px;">借方金额(合计) : <br/><span data-name="jnadjust_debit2" id="jnadjust_debit2">' + parseFloat(0).toFixed(2) + '</span></div>';
				tableHtml += '<div class="col-sm-4" style="font-size: 14px;padding-left: 12px;">贷方金额(合计) : <br/><span data-name="jnadjust_credit2" id="jnadjust_credit2">' + parseFloat(0).toFixed(2) + '</span></div></div>';
				tableHtml += '<div class="row"><table id="' + id + '" class="table table-bordered table-striped table-hover"></table></div>';
				$('#allTableContent2').append(tableHtml);
			}
			window.editId = 1;
			if ($tables.length == 0) {
				// 新增table，初始化
				var tableHtml = '';

				tableHtml += '<div class="row" ' + styleName + '><div class="col-sm-4" style="font-size: 14px;padding-left: 11px;">差额(借-贷) : <br/><span data-name="jnadjust_balance2" id="jnadjust_balance2">' + parseFloat(0).toFixed(2) + '</span></div>';
				tableHtml += '<div class="col-sm-4" style="font-size: 14px;padding-left: 5px;">借方金额(合计) : <br/><span data-name="jnadjust_debit2" id="jnadjust_debit2">' + parseFloat(0).toFixed(2) + '</span></div>';
				tableHtml += '<div class="col-sm-4" style="font-size: 14px;padding-left: 0px;">贷方金额(合计) : <br/><span data-name="jnadjust_credit2" id="jnadjust_credit2">' + parseFloat(0).toFixed(2) + '</span></div></div>';
				tableHtml += '<div class="row"><table id="' + id + '" class="table table-bordered table-striped table-hover"></table></div>';
				$('#allTableContent2').append(tableHtml);
			}

			window.adjustPageId = false;
			BdoDataTable(id, jnadjust_view);
		});

		// 添加行
		$('#allTableContent2').on('click', 'button[name="jnadjust_plus_row"]', function(event) {
			window.editId = 0;
			var index = $(this).closest('tr').find('[name=jnvoucherId2]').val();
			$(this).closest('table').DataTable().row.add({
				autoId: '',
				subjectId: '',
				indexId: index,
				subjectName: '',
				subjectContent: '',
				adjustSubjectTB: '',
				adjustSubjectCodeReport: '',
				adjustSubjectReport: '',
				yyyy: '',
				summary: '',
				currency: '',
				currValue: '',
				dirction: '',
				occurValue: '',
				reason: ''
			}).draw();
		});
		// 是否受限checkBox
		$('#allTableContent2').on('change', 'input[name="jnadjust_check"]', function(event) {
			var _this = this;
			var flag = $(_this).is(":checked");
			if(!flag){
				return;
			}
			var nodeId = $(_this).closest('table').attr('id');// 此table的Id
			var $table = $('#' + nodeId);// 此table
			var subjectId = $(this).parents('tr').find('[name="jnsubject"]').attr('data-result');
			if(subjectId == undefined || subjectId == null ||  subjectId == ''){
				$(_this).attr("checked", false);
				return;
			}
			$.ajax({
				url: 'dgCenter/DgAdjust.checkAdjustSubject.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR,
					param4: subjectId
				},
				dataType: 'json',
				success: function(data) {
					if (data.success && data.data && data.data[0] && data.data[0].isChecked) {

					} else {
						$(_this).attr("checked", false);
					}
				}
			});
		});
		$('#jnadjust_save2').click(function (){
			let inputArr = $('#jnadjust_table_id > tbody > tr > td > div > span.row-input > input');
			for (let i = 0; i < inputArr.length; i++) {
				if (inputArr[i].value != '') {
					$('#jnadjust_save2').trigger('commit');
					$('#heavy_classification').show();
					return;
				}
			}
			// bdoInfoBox('提示', '自动分析结果仅按照金额相等匹配，请确认无误后点击保存按钮！');
			reloadSubjectSelect($('#jnadjust_table_id tbody tr td input').first());
			automaticAnalysis();
			// $('#jnadjust_save2').trigger('commit');
		});
		$('#adjust_close').click(function (){$('#heavy_classification').show();});


		// 保存
		$('#jnadjust_save2').bind('commit',function() {
			var tb = [];
			var flag = true;// 验证TB科目是否已对照
			var summaryFlag = true;
			var subjectFlag = true;// 验证财务科目是否对应底稿树
			let multipleSummaryFlag = true;
			if (!counterpartyAmountCheck()){
				bdoErrorBox('失败', '对方科目分析金额借贷不平。');
				return;
			}
			$('.row').find('[data-name="jnadjust_balance2"]').each(function() {
				if ($(this).html() != 0) {
					flag = false;
				}
			});

			if (!flag) {
				bdoErrorBox('失败', '借贷额不平。');
				return;
			}

			var unContract = [];
			// 取每一行的数据
			var count = 1;
			$('#allTableContent2 table').each(function() {
				if (!$(this).attr('id')) {
					return;
				}
				var summaryContent = false;
				var subject2 = false;
				// 是否一借多贷标识
				let summaryContentFlag = false;
				if ($(this).find('tbody tr').size() > 2) {
					summaryContentFlag = true;
				}
				let counnSummary = 0;
				let sortNo = 0;
				$(this).find('tbody tr').each(function() {
					var adjustSubject = $(this).find('[name="jnadjust"]').val();
					var adjustSubjectName = $(this).find('[name="jnadjust"]').attr('data-content') ? $(this).find('[name="jnadjust"]').attr('data-content') : '';
					var summary = $(this).find('[name="jnsummary"]').val();
					var assitem = $(this).find('[name="assitemType"]').attr('data-result');
					let assItemName = $(this).find('[name="assitemType"]').attr('data-content');
					var subjectId = $(this).find('[name="jnsubject"]').attr('data-result');
					var subjectName = $(this).find('[name="jnsubject"]').attr('data-content');
					if (adjustSubject === ':' || adjustSubjectName === '') {
						unContract.push(subjectName);
						flag = false;
					}
					if (!subject2 && subjectId.startsWith(agrs.data.extraOptions.userSubjectId)) {
						subject2 = true;
					}
					if (!summaryContent && summary) {
						summaryContent = true;
					}
					var str = $(this).find('[name="jnvoucherId2"]').val();
					var key = str.substring(-1, str.length - 5);
					// console.log("key:"+str.substring(-1,str.length-5));
					let oppDivArr = $(this).find('td:nth-child(10) > div');
					let oppSubjectMap = {};
					for (let i = 0; i < oppDivArr.length; i++) {
						let div = $(oppDivArr[i]);
						let oppSubjectId = div.find('select[name="dfSubject"]').val();
						// 对方科目空格问题
						let value = div.find('input[name="dfValue"]').val().replace(/,/g,'').replace(/ /g,'');
						if(oppSubjectMap[oppSubjectId]){
							oppSubjectMap[oppSubjectId] = parseFloat(oppSubjectMap[oppSubjectId]) + parseFloat(value);
						}else{
							oppSubjectMap[oppSubjectId] = value;
						}
					}
					tb.push({
						autoId: $(this).find('[name="jnautoId"]').val(),// id
						reason: $(this).find('[name="jnautoReason"]').val(),// 原因
						voucherId: $(this).index() + 1,
						indexId: $(this).find('[name="jnvoucherId2"]').val(),// 索引号
						// adjustSubjectReport : adjustSubject,//报表科目id名称
						adjustSubjectTB: adjustSubject,// tb科目id名称
						subjectId: subjectId,// 财务科目id
						subjectName: subjectName,// 财务科目名称/全路径
						summary: summary,// 摘要
						activeFlag: $(this).find('[name="active_flag"]').val() ? $(this).find('[name="active_flag"]').val() : '',
						outValue: $(this).find('[name="injnvalue"]').val().replace(/,| |\t/g,''),// 借方
						inValue: $(this).find('[name="outjnvalue"]').val().replace(/,| |\t/g,''),// 贷方
						assItem: assitem,
						assItemName: assItemName,
						assItemId: assitem,
						rownum: count++,
						workpaperId: agrs.data.extraOptions.workpaperId ? agrs.data.extraOptions.workpaperId : 0,// 底稿索引号
						indexKey: key,
						oppSubjectJson: oppSubjectMap,
						sortNo: sortNo,
						indexLength: 4,
						isEliminate: $(this).find('[name="jnadjust_check"]').is(":checked")
					});
					sortNo++;
					if (summary !== '') {
						counnSummary++;
					}
				});
				if (summaryContentFlag && counnSummary !== $(this).find('tbody tr').size()) {
					multipleSummaryFlag = false;
					return;
				}
				if (!summaryContent) {
					summaryFlag = false;
					return;
				}
				if (!subject2) {
					subjectFlag = false;
				}
			});
			if (agrs.data.extraOptions.userSubjectId && !subjectFlag) {
				bdoErrorBox('失败', '请重新选择科目，每一笔调整必须包含【' + agrs.data.extraOptions.userSubjectName + '】科目');
				return;
			}
			if (!summaryFlag) {
				bdoErrorBox('失败', '每一笔至少一条摘要。');
				return;
			}
			if (tb.length === 2) {
				let summary0 = tb[0].summary;
				let summary1 = tb[1].summary;
				if (summary0 === '' && summary1 !== '') {
					tb[0].summary = summary1;
				} else if (summary0 !== '' && summary1 === '') {
					tb[1].summary = summary0;
				}
			}

			if (!multipleSummaryFlag) {
				bdoErrorBox('失败', '一借多贷或一贷多贷调整摘要必须全部填写！');
				return;
			}
			if (!flag) {
				bdoErrorBox('失败', '【' + unContract.toString() + '】科目未对照， 请先添加科目对照。');
				return;
			}

			// 防止ajax重复提交
			if (window.hasSubmit) {
				return false;
			}
			window.hasSubmit = true;
			// $('#modal_jnadjustform').modal('hide');
			/*
			 * if (window.showType == "2"){ projectYear = projectYear-1; }
			 */

			// 审计调整与客户调整年份取值不同的问题
			let adjustYear = $('#adjustYear').val();
			if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
				adjustYear = $('#jnadjust_dgYear2').text();
			}
			// 审计调整修改的问题
			if (!adjustYear) {
				adjustYear = $('#jnadjust_dgYear2').text();
			}

			var $tables = $('table[id^=jnadjust_table_id]');
			if ($tables.length == 0) {
				window.hasSubmit = false;
				$('#modal_jnadjustform2').hide();
				return false;
			}

			bdoInProcessingBox('正在保存调整分录!');
			let isReclassification =  $('#jnadjust_type3').text() ? 1:0;
			$.ajax({
				url: 'dgCenter/DgAdjust.mulvoucherAdjust.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: JSON.stringify(tb),
					param2: window.CUR_CUSTOMERID,
					// 审计调整年份
					param3: adjustYear,
					param4: $('#jnadjust_type2').text(),// 审计调整或重分类调整
					param5: window.CUR_PROJECTID,
					param6: getShowType(),
					param10: isReclassification
				},
				dataType: 'json',
				success: function(data) {
					window.hasSubmit = false;
					$('#searchInput3').val('');
					if (data.success) {
						$('#jnadjust_type3').text('');
						if(data.resultInfo.statusText != ''){
							bdoInfoBox('成功', data.resultInfo.statusText, 15000);
						}else{
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}
						$('#jnadjust_table_id').closest('.dataTables_wrapper').closest('.row').nextAll().remove();
						$('#' + $('table[id^=jnadjust_table_id]')[0].id).closest('.dataTables_wrapper').closest('.row').parent().children().remove();
						$('#jnadjust_dgYear2').text(projectYear);
						$('#modal_jnadjustform2').hide();
						refreshTable();
						// $('#jnadjust_table_id').DataTable().ajax.reload();
						// 为申报表保存后不刷新问题
						if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
							$('#rpt_search').click();
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
			$('#jnadjust_type3').text('');
		});

		// 删除
		$('#allTableContent2').on('click', 'button[name="jnDelete"]', function(event) {
			var nodeId = $(this).closest('table').attr('id');// 此table的Id
			var $table = $('#' + nodeId);// 此table
			var _this = $(this);// 此按钮
			var row = $table.DataTable().row([_this.closest('tr').index()]);// 行
			var object = $table.DataTable().data()[_this.closest('tr').index()];// 行数据

			// 判断是否是编辑状态
			if ($table.DataTable().rows()[0].length < 3) {
				// 若分录小于三条，则全部删除，且隐藏对话框
				if (object.autoId) {
					bdoConfirmBox('删除', '是否删除此项凭证下所有分录?', function() {
						$.ajax({
							url: 'dgCenter/DgAdjust.journalDelete.json',
							type: 'post',
							data: {
								customerId: window.CUR_CUSTOMERID,
								projectId: window.CUR_PROJECTID,
								param1: object.autoId
							},
							dataType: 'json',
							success: function(data) {
								if (data.success) {
									$('#modal_jnadjustform2').hide();
									refreshTable();
									if(data.resultInfo.statusText != ''){
										bdoInfoBox('成功', data.resultInfo.statusText, 15000);
									}else{
										bdoSuccessBox('成功', data.resultInfo.statusText);
									}
								} else {
									bdoErrorBox('失败', data.resultInfo.statusText);
								}
							}
						});
					});

				} else {


					bdoConfirmBox('删除', '是否删除此凭证?', function(event) {

						window.maxNum--;
						var $allTable = $($.fn.dataTable.tables(true));
						var $row = $table.closest('.dataTables_wrapper').closest('.row');

						// 若存在table，则将显示表头，将金额计算恢复原始位置
						if ($allTable.eq(1).attr('id') == nodeId && $allTable.length > 2) {
							// $table.parent().prev().insertAfter($allTable.eq(2).children().first());
							// position: relative; left: 64%; width: 40%;
							$row.next().css({'top': '0px'});
							// $row.next().css({ 'position': 'relative','left':
							// '64%','top': '0px'});
							$allTable.eq(2).parents('.row').eq(1).prev().css({
								'float': 'none',
								'position': 'relative',
								'left': '64%',
								'top': '0px'
							});
							$allTable.eq(2).parents('.row').eq(1).prev().children().eq(0).css({'padding-left': '11px'});
							$allTable.eq(2).parents('.row').eq(1).prev().children().eq(1).css({'padding-left': '3px'});
							$allTable.eq(2).parents('.row').eq(1).prev().children().eq(2).css({'padding-left': '0px'});
							$allTable.eq(2).parent().prev().css('display', 'block');
							// $allTable.eq(2).children().first().css('visibility',
							// 'visible');
						}
						// 删除表格和金额
						$row.prev().remove();
						$row.remove();
						// $allTable.eq(2).parent().parent().children().eq(0).remove();


						window.editId = 1;
						// BdoDataTable('jnadjust_table_id', jnadjust_view);
						// 重新计算表格中的索引号
						// 获取当前datatable所有行length-标题行
						let table_length = $.fn.dataTable.tables(true).length - 1;
						$(table_length).each(function(index, element) {

							var $node = $(this).closest('tr').find('[name=jnvoucherId2]').val();
							$node.val($node);
							$node.parent().html($node + 1);

						});

						$($('table[id^=jnadjust_table_id]')[0]).DataTable().ajax.reload();

					});

				}
			} else {
				row.remove().draw();
				$table.find('[name=jnadjust_plus_row]').eq(0).css('visibility', 'visible').prop('disabled', false);
				jnamountCalu(nodeId);
			}
		});

		// 客户科目
		var me;
		let prev;
		$('#allTableContent2').on('focus', 'input[name="jnsubject"]', function() {
			me = this;
			prev = $(this).parent().parent().find('input[name="jnadjust"]');
			var id = $(this).attr('data-result');
			var label = $(this).attr('data-content');
			var $node = $(this);
			// var param12 = $(this).closest('tr').find('[name=jnadjust]').attr('data-result');
			$(this).unbind();
			$('#modal_subjectid').modal('show');
			let year = getAdjustYear();
			$('#adsubject_tree').tree4({
				url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
				params: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param9: window.CUR_CUSTOMERID,
					param10: year,// $("#jnadjust_year").val()//更改
					param11: window.CUR_PROJECTID,
					param12: getShowType(),
					searchInputId: 'searchInput2'
					// param12 : param12
				},
				singleSelect: true,
				// lazyLoad : false,
				// onceLoad : true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''

				}
				/*lazyLoad : false,
				view : {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: false,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''
				}*/
			});
		});
		$('#modal_subject_sure').click(function() {
			dt = $('#adsubject_tree').treeview(true).getSelected()[0];
			if (dt == undefined) {
				$(me).val('');
				$(prev).val('');
			} else {
				$(me).attr('data-result', dt.id);
				$(me).attr('data-content', dt.text);
				$(me).attr('data-contentdata', dt.label);
				var data = {
					result: $(me).attr('data-result'),
					content: $(me).attr('data-content'),
					contentdata: $(me).attr('data-contentdata')
				};
				$(me).val(dt.text);
				subjectCallBack($(me), '', data);
			}
			$('#modal_subjectid').modal('hide');
			$('#adsubject_tree').tree4('reset');
			//
		});
		$('#modal_subject_reset').click(function() {
			$('#adsubject_tree').tree4('reset');

		});
		// 辅助核算
		$('#allTableContent2').on('focus', 'input[name="assitemType"]', function() {
			me = this;
			var param11 = $(this).closest('tr').find('[name=jnsubject]').attr('data-result');
			if (!param11) {
				return;
			}
			let adjustYear =  getAdjustYear();
			if ($('#assitem_tree').hasClass('treeview')) {
				$('#assitem_tree').tree2('reset');
				$('#assitem_tree').tree2('destory');
			}
			$('#modal_assitem').modal('show');
			$('#assitem_tree').tree2({
				url: 'cpBase/TreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: adjustYear,
					param11: param11,
					searchInputId: 'searchInput3',
					param19: $('#searchInput3').val()
				},
				singleSelect: true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: true,
					multiSelect: false,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''
					// positionValue: 'fixed'
				}
			});
			$('#searchInput3').attr('placeholder', '搜索客户');
		});

		$('#modal_assitem_reset').click(function() {
			$('#modal_assitem').modal('hide');
			$('#assitem_tree').tree2('reset');
			$('#searchInputAssitem').keyup();
		});
		var dtz;
		$('#modal_assitem_sure').click(function() {
			dtz = $('#assitem_tree').treeview(true).getSelected()[0];
			if (dtz == undefined) {
				$(me).val('');
			} else {
				$(me).attr('data-result', dtz.id);
				$(me).attr('data-content', dtz.qtip);
				$(me).attr('data-contentdata', dtz.label);
				$(me).val(dtz.text);
			}
			$('#modal_assitem').modal('hide');
			$('#assitem_tree').tree2('reset');

		});
		$('#modal_subjectid_reset').click(function() {
			$('#adsubject_tree').tree4('reset');
		});

		// 修改方向和金额的时候，重新计算借贷差
		$('#allTableContent2').on('change', '[name="injnvalue"]', function(event) {
			var flag = !$(this).val();
			$(this).parent().prev().children().prop('disabled', !flag);
			jnamountCalu($(this).closest('table').attr('id'));
			reloadSubjectSelect($(this));
			let inputArr = $('#jnadjust_table_id > tbody > tr > td > div > span.row-input > input');
			for (let i = 0; i < inputArr.length; i++) {
				if (inputArr[i].value != '') {
					$(inputArr[i]).val('');
				}
			}
		});
		$('#allTableContent2').on('change', '[name="outjnvalue"]', function(event) {
			var flag = !$(this).val();
			$(this).parent().next().children().prop('disabled', !flag);
			jnamountCalu($(this).closest('table').attr('id'));
			reloadSubjectSelect($(this));
			let inputArr = $('#jnadjust_table_id > tbody > tr > td > div > span.row-input > input');
			for (let i = 0; i < inputArr.length; i++) {
				if (inputArr[i].value != '') {
					$(inputArr[i]).val('');
				}
			}
		});
		$('#btn_negative').click(function() {vchAccountSubjectTable('1')});
		$('#btn_customize').click(function() {vchAccountSubjectTable('2')});
		// 余额表点击选择事件
		$('#ast_account_table').on('click', 'tbody tr', function () {
			$(this).toggleClass('selected');
		});
		$('#ast_account_table').on('click', 'tbody > tr > td:nth-child(6)', function () {
			$(this).closest('tr').toggleClass('selected');
		});

		// 核算点击选择事件
		$('#vch_account_table').on('click', 'tbody tr', function () {
			$(this).find('input[name="checkrow"]').prop('checked',$(this).hasClass('selected'))
			$(this).toggleClass('selected');
		});

		// 负值重分类科目
		$('#vch_filter_subject').focus(function() {
			$('#modal_vch_subjectid').modal('show');
			if ($('#subject_tree').hasClass('treeview')) {
				return;
			}
			let adjustYear = $('#adjustYear').val();
			if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
				adjustYear = $('#jnadjust_dgYear2').text();
			}
			$('#subject_tree').tree({
				url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
				params: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param9: window.CUR_CUSTOMERID,
					param10: adjustYear,// $("#jnadjust_year").val()//更改
					param11: window.CUR_PROJECTID,
					param12: getShowType(),
					searchInputId : 'searchInput1'
				},
				singleSelect : true,
				lazyLoad : false,
				onceLoad : true,
				view : {
					leafIcon : 'fa fa-building text-flat',
					nodeIcon : 'fa fa-bank text-primary-light',
					folderSelectable : false,
					multiSelect : false,
					showCheckbox : true,
					selectedColor : '',
					selectedBackColor : ''

				}
			});
		});

		$('#modal_vch_subjectid_sure').click(function () {
			let selectValue = $('#subject_tree').tree('getTreeMultiValue');
			// let checkData = $('#subject_tree').tree('getCheckedData')[0];
			let checkData = $('#subject_tree').tree('getCheckedData')[0];
			if (checkData && checkData.parentId) {
				setParent('subject_tree', checkData.parentId)
			} else if (typeof (selectValue) === 'object') {
				$('#vch_filter_subject').val('');
			} else {
				$('#vch_filter_subject').val(selectValue);
			}
			if (typeof (selectValue) === 'object') {
				$('#vch_filter_subject').val('');
			} else {
				$('#vch_filter_subject').val(selectValue);
			}
			voucher_view_table.localParam.urlparam.param2 = $('#vch_filter_subject').val();
			$('#modal_vch_subjectid').modal('hide');
			let adjustYear = $('#adjustYear').val();
			if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
				adjustYear = $('#jnadjust_dgYear2').text();
			}
			voucher_view_table.localParam.urlparam.param1 = adjustYear;
			// voucher_view_table.localParam.urlparam.param3 = checkData && checkData.parentId == null ? 1 : 0;
			// voucher_view_table.localParam.urlparam.param4 = $('#vch_filter_accItem').val();
			// BdoDataTable('vch_account_table', voucher_view_table);
			loadSubjectTreeTable();
		});
		$('#modal_vch_subjectid_reset').click(function () {
			$('#subject_tree').tree('reset');
			$('#vch_filter_subject').val('');
		});

		// 负值重分类核算树
		$('#vch_filter_accItem').focus(function() {
			$('#modal_assitemid').modal('show');
			// if ($('#modal_vch_assItem').hasClass('treeview')) {
			// return;
			// }
			let adjustYear = $('#adjustYear').val();
			if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
				adjustYear = $('#jnadjust_dgYear2').text();
			}
			if ($('#modal_vch_assItem').hasClass('treeview')) {
				$('#modal_vch_assItem').tree2('reset');
				$('#modal_vch_assItem').tree2('destory');
			}
			$('#modal_vch_assItem').tree2({
				url: 'cpBase/TreeCommon.findSubjectAssitem.json',
				params: {
					lockCustomerId: window.CUR_CUSTOMERID,
					lockProjectId: window.CUR_PROJECTID,
					lockYyyy: adjustYear,
					searchInputId: 'searchInputVchAcc',
					param11: $('#vch_filter_subject').val()
				},
				// singleSelect: true,
				// lazyLoad: false,
				// onceLoad: true,
				view: {
					leafIcon: 'fa fa-building text-flat',
					nodeIcon: 'fa fa-bank text-primary-light',
					folderSelectable: false,
					multiSelect: true,
					showCheckbox: true,
					selectedColor: '',
					selectedBackColor: ''

				}/*
		lazyLoad : false,
        view : {
            leafIcon: 'fa fa-building text-flat',
            nodeIcon: 'fa fa-bank text-primary-light',
            folderSelectable: false,
            multiSelect: false,
            showCheckbox: true,
            selectedColor: '',
            selectedBackColor: ''
        }*/
			});
		});
		$('#modal_assitemid_sure').click(function() {
			let assItemId = $('#modal_vch_assItem').tree2('getTreeMultiValue');
			if (typeof (assItemId) == 'object' || assItemId == undefined || assItemId == 'undefined' ) {
				$('#vch_filter_accItem').val('');
			} else {
				$('#vch_filter_accItem').val(assItemId);
			}
			voucher_view_table.localParam.urlparam.param4 = $('#vch_filter_accItem').val();
			// BdoDataTable('vch_account_table', voucher_view_table);
			loadSubjectTreeTable();
			$('#modal_vch_assItem').tree2('reset');
			$('#modal_assitemid').modal('hide');
		});

		$('#modal_assitemid_reset').click(function() {
			$('#modal_vch_assItem').tree2('reset');
			$('#searchInputVchAcc').keyup();
		});
		/** 全选 */
		$('#modal_jnadjustform2').on('click', '#vch_checkall', function () {
			let isCheckAll = $(this).prop('checked');
			$('#vch_account_table input[name="checkrow"]').each(function () {
				$(this).prop('checked', isCheckAll);
				if (isCheckAll){
					$(this).closest('tr').addClass('selected');
				}else {
					$(this).closest('tr').removeClass('selected');
				}
			});
		});

		// 对方科目科目树
		$('#modal_vch_opp_subjectid_sure').click(function () {
			// $('#opp_subject_tree').treeview(true).getSelected()
			let checkData = $('#opp_subject_tree').treeview(true).getSelected()[0];
			let tableData = $('#ast_account_table').DataTable().rows().data();
			// let checkData = $('#opp_subject_tree').tree4('getCheckedData');
			if (typeof (checkData) == undefined) {
				setChildSubject(curRowData, tableData, '', '');
				$('#modal_vch_opp_subjectid').modal('hide');
				return;
			}
			let label = checkData.label;
			let value = checkData.value;
			// let label = $('#opp_subject_tree').tree4('getAbstractLabel');
			// let value = $('#opp_subject_tree').tree4('getTreeMultiValue')
			if (value) {
				setChildSubject(curRowData, tableData, value, label);
			} else {
				setChildSubject(curRowData, tableData, '', '');
			}
			$('#modal_vch_opp_subjectid').modal('hide');
		});

		$('#modal_vch_opp_subjectid_reset').click(function () {
			$('#opp_subject_tree').tree4('reset');
		});
	};
	let voucher_view_index = 1;
	// 选中的需要负值重分类的科目数据
	let reclassification_setting_view = {
		localParam : {
			tabNum : false,
			urlparam : {}
		},
		tableParam : {
			select : false,
			lengthChange : false,
			dom : '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
			ordering : false,
			serverSide : true,
			// infoCallback : fnInfoCallback,
			fixedThead : true,
			// fixedHeight : '500px',
			columnDefs: [
				{
					targets : voucher_view_index++,
					className : 'text-left',
					title : '<label class="css-input css-checkbox css-checkbox-primary">' +
						'<input type="checkbox" name="checkSubjectAll"/>' +
						'<span></span>' +
						'</label>'+'科目编号',
					name : 'subjectId',
					data : 'subjectId',
					width : '60px'
				},
				{
					targets : voucher_view_index++,
					className : 'text-left',
					title : '科目名称',
					name : 'subjectName',
					data : 'subjectName',
					width : '100px'
				},
				{
					targets : voucher_view_index++,
					className : 'text-left',
					title : '核算编号',
					name : 'assItemId',
					data : 'assItemId',
					width : '60px'
				},
				{
					targets : voucher_view_index++,
					className : 'text-left',
					title : '核算名称',
					name : 'assItemName',
					data : 'assItemName',
					width : '100px'
				},
				{
					targets : voucher_view_index++,
					className : 'text-right',
					title : '金额',
					name : 'balance',
					data : 'balance',
					width : '80px',
					render : function(data, type, row, meta) {
						return formatMoney(data);
					}
				},
				{
					targets: voucher_view_index++,
					className: 'text-left',
					title: '对方科目',
					width: '100px',
					name: 'oppositeSubject',
					data: 'oppositeSubject',
					render:function () {

						return `<div class="form-material col-xs-8 col-sm-8 col-lg-8 bg-success-light" style="width: 100%;height: 22px;padding-right: 0px;margin-bottom: 0px;padding-left: 0px;margin-top: 0px;">
<input name="oppositeSubject" class="form-control" style="
    padding-bottom: 0px;
    padding-top: 0px;
    height: 20px;
"></div>`;

					}
				},
			]
		}
	};
	// let voucher_table_index = 1;
	// 凭证选择
	let voucher_view_table = {
		localParam: {
			tabNum: false,
			url: 'dgCenter/DgAdjust.queryAmountSubject.json',
			urlparam: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				menuId: window.sys_menuId,
			}
		},
		tableParam: {
			select: false,
			lengthChange: false,
			dom: 'tr',
			fixedThead: true,
			// fixedHeight : '500px',
			// order : [ 2, 'asc' ],
			ordering: false,
			// paging: false,
			serverSide: true,
			createdRow(row, data, dataIndex) {
				$(row).children("td").eq(0).html('<label class="css-input css-checkbox css-checkbox-sm css-checkbox-primary"><input type="checkbox" name="checkrow"><span></span></label>');
			},
			columns: [
				{
					className: 'treegrid-control',
					data: function (item) {
						if (item.children != null && item.children.length > 0) {
							return '<span> + </span>';
						}
						return '';
					}
				},
				{"data": "assItemId"},
				{"data": "assItemName"},
				{"data": "subjectId"},
				{"data": "subjectName"},
				{"data": "balance"},
			],
			columnDefs: [
				{
					"defaultContent": "",
					"targets": "_all"
				}
			]
		}
	};


	/**
	 * 核算余额表展示
	 */
	function vchAccountSubjectTable(type) {
		$('#vch_adjust_modal').modal('show');
		$('#vch_filter_subject').val('');
		$('#vch_filter_accItem').val('');
		let adjustYear = $('#adjustYear').val();
		if ($('#jnadjust_type2').text() && $('#jnadjust_type2').text() == '1') {
			adjustYear = $('#jnadjust_dgYear2').text();
		}
		if(type == '1'){
			rearrangeName = '负值重分类';
			$('#rearrangeSubjectTitle').html('选择负值重分类科目 ');
		}else{
			rearrangeName = '自定义重分类';
			$('#rearrangeSubjectTitle').html('选择自定义重分类科目 ');
		}
		voucher_view_table.localParam.urlparam.param1 = adjustYear;
		voucher_view_table.localParam.urlparam.param5 = type;
		if (JSON.parse($.sessionStorage('subjecttreeNode')) && $('#jnadjust_type2').text() && $('#jnadjust_type2').text() != '1'){
			voucher_view_table.localParam.urlparam.param2 = JSON.parse($.sessionStorage('subjecttreeNode')).extraOptions.userSubjectId;
			voucher_view_table.localParam.urlparam.param3 = 1;
			$('#vch_filter_subject').val(voucher_view_table.localParam.urlparam.param2);
			$('#vch_filter_subject').prop('disabled','disabled');
			loadSubjectTreeTable(true);
		}else {
			voucher_view_table.localParam.urlparam.param2='';
			voucher_view_table.localParam.urlparam.param4 = '';
			loadSubjectTreeTable(false);
		}
	}

	/**
	 * 加载负值重分类数据树
	 */
	function loadSubjectTreeTable(hidenSubject) {
		// var me = this;
		var subjectTreeTable = $('#vch_account_table');
		if(subjectTreeTable.val() == 'hasInited') {
		    $('#vch_account_table').treegrid('clearChecked');
		// 	$('#vch_account_table').treegrid('reload', voucher_view_table.localParam.urlparam);
		// 	return;
		}
		if (hidenSubject) {
			easyloader.load(['treegrid'], function () {
				subjectTreeTable.treegrid({
					height: 600,
					width: '100%',
					idField: 'autoId',
					treeField: 'subjectId',
					border: 'none',
					singleSelect: true,
					animate: true,
					checkbox: true,
					expanderExpandedClass: 'glyphicon glyphicon-minus',
					expanderCollapsedClass: 'glyphicon glyphicon-plus',
					queryParams: voucher_view_table.localParam.urlparam,
					columns: [[
						{title: '科目编号', field: 'subjectId', width: 150},
						{field: 'assItemId', title: '核算编号', width: 135},
						{field: 'assItemName', title: '核算名称', width: 360},
						// {field:'subjectName',title:'科目名称',width:190,align:'left'},
						{
							field: 'balance', title: '金额', align: 'right', width: 175,
							formatter: function (value, row, index) {
								return formatMoney(value);
							}
						}
					]],
					loader: function (param, success, error) {
						$.ajax({
							url: 'dgCenter/DgAdjust.queryAmountSubject.json',
							type: 'post',
							data: param,
							dataType: 'json',
							success: function (data) {
								if (!data.success) {
									bdoErrorBox('查询科目信息异常', data.resultInfo.statusText);
									return;
								}
								success({rows: data.data, total: data.data.length});
								$('#vch_account_table').treegrid('resize');
							}
						});
					},
					onBeforeExpand: function (row) {
						// subjectTreeTable.treegrid('options').queryParams.param1 = row.autoId;
						// subjectTreeTable.treegrid('options').queryParams.param11 = parseInt(row.level) + 1;
					},
					onLoadSuccess: function (row, data) {
						$('#vch_account_table').treegrid('collapseAll');
						$('#vch_account_table').treegrid('clearChecked');
						// subjectTreeTable.treegrid('options').queryParams.param1 = null;
						// subjectTreeTable.treegrid('options').queryParams.param11 = 1;
					},
					onDblClickRow: function (row) {
						subjectTreeTable.treegrid('toggle', row.id);
					}
				});
				subjectTreeTable.val('hasInited');
				// subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.edit-subject', me.onEditSubjectClick.bind(me));
				// subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.view-subject', me.onViewSubjectClick.bind(me));
				// subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.del-subject', me.onDelSubjectClick.bind(me));
			});
		} else {
			easyloader.load(['treegrid'], function () {
				subjectTreeTable.treegrid({
					height: 600,
					width: '100%',
					idField: 'autoId',
					treeField: 'subjectId',
					border: 'none',
					singleSelect: true,
					animate: true,
					checkbox: true,
					expanderExpandedClass: 'glyphicon glyphicon-minus',
					expanderCollapsedClass: 'glyphicon glyphicon-plus',
					queryParams: voucher_view_table.localParam.urlparam,
					columns: [[
						{title: '科目编号', field: 'subjectId', width: 165},
						{field: 'subjectName', title: '科目名称', width: 190, align: 'left'},
						{field: 'assItemId', title: '核算编号', width: 130},
						{field: 'assItemName', title: '核算名称', width: 160},
						{
							field: 'balance', title: '金额', width: 200, align: 'right', width: 175,
							formatter: function (value, row, index) {
								return formatMoney(value);
							}
						}
					]],
					loader: function (param, success, error) {
						$.ajax({
							url: 'dgCenter/DgAdjust.queryAmountSubject.json',
							type: 'post',
							data: param,
							dataType: 'json',
							success: function (data) {
								if (!data.success) {
									bdoErrorBox('查询科目信息异常', data.resultInfo.statusText);
									return;
								}
								success({rows: data.data, total: data.data.length});
								$('#vch_account_table').treegrid('resize');
							}
						});
					},
					onBeforeExpand: function (row) {
						// subjectTreeTable.treegrid('options').queryParams.param1 = row.autoId;
						// subjectTreeTable.treegrid('options').queryParams.param11 = parseInt(row.level) + 1;
					},
					onLoadSuccess: function (row, data) {
						$('#vch_account_table').treegrid('collapseAll');
						$('#vch_account_table').treegrid('clearChecked');
					},
					onDblClickRow: function (row) {
						subjectTreeTable.treegrid('toggle', row.id);
					}
				});
				subjectTreeTable.val('hasInited');
				// subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.edit-subject', me.onEditSubjectClick.bind(me));
				// subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.view-subject', me.onViewSubjectClick.bind(me));
				// subjectTreeTable.datagrid('getPanel').on('click', 'button.table-btn-operate.del-subject', me.onDelSubjectClick.bind(me));
			});
		}
		setTimeout("$('#vch_account_table').treegrid('resize');", 500);
	}


	// 失去焦点，查询TB科目
	function subjectCallBack($node, tree, data) {

		// var $node = $(tree);
		var param16 = data.result;
		var $nextNode = $node.closest('tr').find('[name=assitemType]');
		$nextNode.val('');
		$nextNode.attr('data-result', '');
		$nextNode.attr('data-content', '');
		if (!param16) {
			var $prevNode = $node.closest('tr').find('[name=jnadjust]');
			$prevNode.val('');
			$prevNode.attr('data-result', ':');
			$prevNode.attr('data-content', '');
			return;
		}
		let year = getAdjustYear();
		$.ajax({
			url: 'dgCenter/DgAdjust.findTBSubjectType.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param14: window.CUR_CUSTOMERID,
				param15: departIdSession,
				param16: param16,
				param17: window.CUR_PROJECTID,
				param18: year
			},
			dataType: 'json',
			success: function(data) {
				var $prevNode = $node.closest('tr').find('[name=jnadjust]');
				if (data.data && data.data.length != 0) {
					var obj = data.data[0];
					$prevNode.val(obj.label);
					$prevNode.attr('data-result', obj.label);
					$prevNode.attr('data-content', obj.label);
				} else {
					$prevNode.val('');
					$prevNode.attr('data-result', '');
					$prevNode.attr('data-content', '');
				}

			}
		});
	}


	// 生成对方金额
	function generateTheAmount(direction) {
		// $($('#allTableContent2 [name="outjnvalue"]')[0]).change()
		let difference = $('#allTableContent2 > div:nth-child(1) > div:nth-child(1) > span').text().replace(/,/g, '');
		if (direction == 1) {
			$('#jnadjust_table_id > tbody > tr:last > td:nth-child(9) > input').val(formatMoney2(difference));
			$('#jnadjust_table_id > tbody > tr:last > td:nth-child(9) > input').trigger('change');
		} else {
			$('#jnadjust_table_id > tbody > tr:last > td:nth-child(8) > input').val(formatMoney2(difference * -1));
			$('#jnadjust_table_id > tbody > tr:last > td:nth-child(8) > input').trigger('change');
		}
		$('#jnadjust_table_id > tbody > tr:last > td:nth-child(3) > input').val(rearrangeName);
	}

	/** 添加凭证分析行 */
	function addRow(e) {
		let _inputspan = $(e).closest('div').find('.row-input');
		let _btnspan = $('<span class="row-btn"></span>').append(dfEdit).append(dfClear).append(dfDel);
		$(e).closest('tr').attr('data-change', '1');
		let div = $('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
		div.find('input').val();
		$(e).closest('td').append(div);
	}

	/**
	 * 自动分析
	 */
	function automaticAnalysis() {
		// 自动分析 先删除原来新增的行
		$('#jnadjust_table_id > tbody > tr > td > div > span.row-btn > button.btn.btn-xs.btn-danger').click();
		// $('#jnadjust_table_id > tbody > tr > td > div > span.row-btn > button.btn.btn-xs.btn-danger')
		let debitMap = new Map();
		let creditMap = new Map();
		// $('#jnadjust_table_id > tbody > tr > td input:not([disabled])[name="outjnvalue"]')
		let debitArray = $('#jnadjust_table_id > tbody > tr > td input:not([disabled])[name="outjnvalue"]');
		for (let i = 0; i < debitArray.length; i++) {
			let inputItem = $(debitArray[i]);
			let subjectInput = inputItem.closest('tr').find('input[name="jnsubject"]');
			debitMap.set(subjectInput, inputItem.val());
		}
		let creditArray = $('#jnadjust_table_id > tbody > tr > td input:not([disabled])[name="injnvalue"]');
		for (let i = 0; i < creditArray.length; i++) {
			let inputItem = $(creditArray[i]);
			let subjectInput = inputItem.closest('tr').find('input[name="jnsubject"]');
			creditMap.set(subjectInput, inputItem.val());
		}
		// 同金额匹配
		for (let dMapItem of debitMap) {
			let key = dMapItem[0];
			let value = dMapItem[1];
			for (let cMapItem of creditMap) {
				let cKey = cMapItem[0];
				let cValue = cMapItem[1];
				if (value === cValue) {
					let oppSubjectId = cKey.attr('data-result');
					let subjectId = key.attr('data-result');
					let row = key.closest('tr');
					row.find('select[name="dfSubject"]').val(oppSubjectId);
					row.find('input[name="dfValue"]').val(cValue);
					let cRow = cKey.closest('tr');
					cRow.find('select[name="dfSubject"]').val(subjectId);
					cRow.find('input[name="dfValue"]').val(value);
					// 匹配上的 直接从map 删除
					creditMap.delete(cKey);
					debitMap.delete(key);
					break
				}
			}
		}

		let keys = debitMap.keys();
		// 不同金额匹配
		for (let dMapItem of keys) {
			let key = dMapItem;
			let dRow = key.closest('tr');
			// dRow.find('select[name="dfSubject"]').first().parent().parent().nextAll().remove();
			let dValue = debitMap.get(key).replace(/,/g, '');
			let debitIsMinus = Math.sign(dValue) < 0;
			for (let cMapItem of creditMap) {
				let cKey = cMapItem[0];
				let cRow = cKey.closest('tr');
				// cRow.find('select[name="dfSubject"]').first().parent().parent().nextAll().remove();

				let subjectId = key.attr('data-result');
				let cValue = creditMap.get(cKey).replace(/,/g, '');
				let creditIsMinus = Math.sign(cValue) < 0;
				// 比较大小
				if (Math.max(dValue, cValue) == dValue) {
					// 大-小 对方金额取小的值 继续匹配
					if (debitIsMinus && creditIsMinus && dValue != cValue) {
						let oppSubjectId = cKey.attr('data-result');
						if (dRow.find('input[name=dfValue]').last().val() != '') {
							addRow(dRow.find('button[name=dfAdd]').last());
						}
						dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
						dRow.find('input[name="dfValue"]').last().val(dValue);

						if (cRow.find('input[name=dfValue]').last().val() != '') {
							addRow(cRow.find('button[name=dfAdd]').last());
						}
						cRow.find('select[name="dfSubject"]').last().val(subjectId);
						cRow.find('input[name="dfValue"]').last().val(dValue);
						cValue = subFloatToInt(cValue, dValue);
						debitMap.delete(key);
						creditMap.set(cKey, cValue + '');
						break;
					}
					if (cRow.find('input[name=dfValue]').last().val() != '') {
						addRow(cRow.find('button[name=dfAdd]').last());
					}
					cRow.find('select[name="dfSubject"]').last().val(subjectId);
					cRow.find('input[name="dfValue"]').last().val(cValue);
					creditMap.delete(cKey);
					let oppSubjectId = cKey.attr('data-result');
					if (dRow.find('input[name=dfValue]').last().val() != '') {
						addRow(dRow.find('button[name=dfAdd]').last());
					}
					dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
					dRow.find('input[name="dfValue"]').last().val(cValue);
					dValue = subFloatToInt(dValue, cValue);
					creditMap.delete(cKey);
					debitMap.set(key, dValue + '');
				} else {
					if (debitIsMinus && creditIsMinus) {
						if (cRow.find('input[name=dfValue]').last().val() != '') {
							addRow(cRow.find('button[name=dfAdd]').last());
						}
						cRow.find('select[name="dfSubject"]').last().val(subjectId);
						cRow.find('input[name="dfValue"]').last().val(cValue);
						creditMap.delete(cKey);
						let oppSubjectId = cKey.attr('data-result');
						if (dRow.find('input[name=dfValue]').last().val() != '') {
							addRow(dRow.find('button[name=dfAdd]').last());
						}
						dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
						dRow.find('input[name="dfValue"]').last().val(cValue);
						dValue = subFloatToInt(dValue, cValue);
						debitMap.set(key, dValue + '');
						creditMap.delete(cKey);
						continue;
					}
					let oppSubjectId = cKey.attr('data-result');
					if (dRow.find('input[name=dfValue]').last().val() != '') {
						addRow(dRow.find('button[name=dfAdd]').last());
					}
					dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
					dRow.find('input[name="dfValue"]').last().val(dValue);
					if (cRow.find('input[name=dfValue]').last().val() != '') {
						addRow(cRow.find('button[name=dfAdd]').last());
					}
					cRow.find('select[name="dfSubject"]').last().val(subjectId);
					cRow.find('input[name="dfValue"]').last().val(dValue);
					cValue = subFloatToInt(cValue, dValue);
					debitMap.delete(key);
					creditMap.set(cKey, cValue + '');
					break
				}
			}
		}

		// 同借同贷
		selfMatching(debitMap, debitMap);
		selfMatching(creditMap, creditMap)
		$('select[name="dfSubject"]').each(function () {
			let btnName = $(this).parent().next().find('button').last().attr("name");
			if ($(this).next().val() == '' && btnName != 'dfAdd') {
				$(this).parent().parent().remove();
			}
		});
	}

	/**
	 *  同借同贷匹配
	 * @param debitMap 借方map
	 * @param creditMap 贷方map
	 */
	function selfMatching(debitMap, creditMap) {
		let keys = debitMap.keys();
		for (let dMapItem of keys) {
			let key = dMapItem;
			let dRow = key.closest('tr');
			let dValue = debitMap.get(key).replace(/,/g, '');
			let debitIsMinus = Math.sign(dValue) < 0;
			// let dRow = key.closest('tr');
			for (let cMapItem of creditMap) {
				let cKey = cMapItem[0];
				if (key == cKey) {
					break;
				}
				let cRow = cKey.closest('tr');
				let subjectId = key.attr('data-result');
				let cValue = creditMap.get(cKey).replace(/,/g, '');
				let creditIsMinus = Math.sign(cValue) < 0;
				// 比较大小
				if (Math.max(dValue, cValue) == dValue) {
					// 大-小 对方金额取小的值 继续匹配
					if (debitIsMinus && creditIsMinus && dValue != cValue) {
						continue
					}
					if (creditIsMinus) {
						if (cRow.find('input[name=dfValue]').last().val() != '') {
							addRow(cRow.find('button[name=dfAdd]').last());
						}
						cRow.find('select[name="dfSubject"]').last().val(subjectId);
						cRow.find('input[name="dfValue"]').last().val(cValue);
						let oppSubjectId = cKey.attr('data-result');
						if (dRow.find('input[name=dfValue]').last().val() != '') {
							addRow(dRow.find('button[name=dfAdd]').last());
						}
						dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
						cValue += '';
						dRow.find('input[name="dfValue"]').last().val(cValue.replace('-', ''));
						dValue = addFloatToInt(dValue, cValue);
						creditMap.delete(cKey);
						debitMap.set(key, dValue + '');
					} else if (debitIsMinus){
						if (cRow.find('input[name=dfValue]').last().val() != '') {
							addRow(cRow.find('button[name=dfAdd]').last());
						}
						cRow.find('select[name="dfSubject"]').last().val(subjectId);
						cRow.find('input[name="dfValue"]').last().val(cValue);
						let oppSubjectId = cKey.attr('data-result');
						if (dRow.find('input[name=dfValue]').last().val() != '') {
							addRow(dRow.find('button[name=dfAdd]').last());
						}
						dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
						dRow.find('input[name="dfValue"]').last().val(cValue);
						dValue = addFloatToInt(dValue, cValue);
						creditMap.delete(cKey);
						debitMap.set(key, dValue + '');
					}
				} else {
					if (debitIsMinus && creditIsMinus) {
						continue;
					}
					if (debitIsMinus) {
						let oppSubjectId = cKey.attr('data-result');
						if (dRow.find('input[name=dfValue]').last().val() != '') {
							addRow(dRow.find('button[name=dfAdd]').last());
						}
						dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
						dRow.find('input[name="dfValue"]').last().val(dValue);

						if (cRow.find('input[name=dfValue]').last().val() != '') {
							addRow(cRow.find('button[name=dfAdd]').last());
						}
						cValue = subFloatToInt(cValue, dValue);
						dValue += '';
						dValue = dValue.replace('-', '');
						cRow.find('select[name="dfSubject"]').last().val(subjectId);
						cRow.find('input[name="dfValue"]').last().val(dValue);
						debitMap.delete(key);
						creditMap.set(cKey, cValue + '');
						break;
					} else if(creditIsMinus) {
						let oppSubjectId = cKey.attr('data-result');
						if (dRow.find('input[name=dfValue]').last().val() != '') {
							addRow(dRow.find('button[name=dfAdd]').last());
						}
						dRow.find('select[name="dfSubject"]').last().val(oppSubjectId);
						dRow.find('input[name="dfValue"]').last().val(dValue);

						if (cRow.find('input[name=dfValue]').last().val() != '') {
							addRow(cRow.find('button[name=dfAdd]').last());
						}
						cRow.find('select[name="dfSubject"]').last().val(subjectId);
						cRow.find('input[name="dfValue"]').last().val(dValue);
						cValue = addFloatToInt(cValue, dValue);
						debitMap.delete(key);
						creditMap.set(cKey, cValue + '');
						break;
					}
				}
			}
		}
	}

	/**
	 * 浮点数相减
	 *
	 * @param minuend
	 * @param subtraction
	 * @returns {string}
	 */
	function subFloatToInt(minuend, subtraction) {
		let decimalLength, totalValue, minuendLength, subtractionLength;
		try {
			minuendLength = minuend.toString().split(".")[1].length;
		} catch (e) {
			minuendLength = 0;
		}
		try {
			subtractionLength = subtraction.toString().split(".")[1].length;
		} catch (e) {
			subtractionLength = 0;
		}
		decimalLength = minuendLength >= subtractionLength ? minuendLength : subtractionLength;
		totalValue = ((minuend * Math.pow(10, decimalLength) - subtraction * Math.pow(10, decimalLength)) / Math.pow(10, decimalLength)).toFixed(decimalLength);
		return totalValue;
	}
	function addFloatToInt(minuend, subtraction) {
		let decimalLength, totalValue, minuendLength, subtractionLength;
		try {
			minuendLength = minuend.toString().split(".")[1].length;
		} catch (e) {
			minuendLength = 0;
		}
		try {
			subtractionLength = subtraction.toString().split(".")[1].length;
		} catch (e) {
			subtractionLength = 0;
		}
		decimalLength = minuendLength >= subtractionLength ? minuendLength : subtractionLength;
		totalValue = ((minuend * Math.pow(10, decimalLength) +  subtraction * Math.pow(10, decimalLength)) / Math.pow(10, decimalLength)).toFixed(decimalLength);
		return totalValue;
	}

	/**
	 * 重新构建对方科目下拉选
	 *
	 * @param $input
	 *            借方、贷方金额 input框
	 */
	function reloadSubjectSelect($input) {
		let selectVal = $('<select style="width:120px;" name="dfSubject"></select>');
		$input.closest('table').find('tr[class]').each(function () {
			let row = $(this);
			let option = $('<option/>');
			row.find('td > input[name]').each(function () {
				let inputObj = $(this);
				let $input = inputObj.prop('name');
				switch ($input) {
					case 'jnsubject':
						let subjectId = inputObj.attr('data-result');
						if(subjectId){
							option.attr('value', subjectId);
						}
						break;
					case 'outjnvalue':
						if (inputObj.prop('disabled')) {
							option.prop('value');
							option.text('贷：' + option.prop('value'))
						} else {
							option.text('借：' + option.prop('value'))
						}
						break;
				}
			});
			if(option.attr('value')){
				selectVal.append(option);
			}
			let thisOption = selectVal.find("option").filter(function() {return $(this).val() == option.attr('value') });
			//去重
			if (thisOption.length > 1) {
				thisOption.last().remove();
			}
		});
		$('select[name="dfSubject"]').each(function () {
			let select = $(this);
			if (select.find('option:selected')) {
				selectVal.find('option[value="'+select.find('option:selected').attr('value')+'"]').attr('selected', true);
			}
			select.html(selectVal.html());
			selectVal.find('option:selected').attr('selected', false);
		});
	}

	/**
	 * 获取调整年份 未审报表页面根据showType来判断
	 * 底稿里面根据 $('#adjustYear').val();
	 * @date 2021/11/17 16:42
	 */
	function getAdjustYear() {
		let showType = getShowType();
		if (showType) {
			let year;
			if (showType == '2') {
				year = window.CUR_PROJECT_ACC_YEAR - 1;
			} else {
				year = window.CUR_PROJECT_ACC_YEAR;
			}
			return year;
		} else {
			return $('#adjustYear').val();
		}
	}
	/**
	 * 获取未审报表页签的showType
	 *
	 * @date 2021/11/17 16:40
	 */
	function getShowType() {
		let unAuditReportTab = $('#tab_unAuditReport > li.active > a')[0];
		if (unAuditReportTab) {
			return $(unAuditReportTab).attr('data-content')
		}
	}


	/**
	 * 对方科目编辑回显问题
	 */
	function  echoSelect(){
		for (let i = 0; i < $('select[name="dfSubject"]').length; i++) {
			let select = $($('select[name="dfSubject"]')[i]);
			let rowData = select.closest('table').DataTable().data()[$(select).closest('tr').index()];
			if (rowData.hasOwnProperty('oppSubjectJson') && rowData.oppSubjectJson != '') {
				let oppObject = JSON.parse(rowData.oppSubjectJson);
				for (let key of Object.keys(oppObject)) {
					if (formatMoney2(oppObject[key])== select.parent().find('input[name="dfValue"]').val()) {
						select.val(key)
						break;
					}
				}

			}
		}
	}
	var setIndexId = function(newIndexId) {
		window.adjustDgNO = newIndexId;
		agrs.data.extraOptions.indexId = newIndexId;
	};

	/**
	 * 打开编辑页面
	 */
	var openEditModal = function($node) {
		window.editId = 0;
		$('#jnadjust_dgYear2').show();
		$('#heavy_classification').hide();
		// var object = $('#adjustTable').DataTable().data()[$(this).closest('tr').index()];
		//let $node = $(this);
		let paramData = {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID,
			param2: $node.nextAll().eq(3).html(),
			param3: $node.parent().next().children().html(),
			param4: window.CUR_PROJECTID
		};
		let data = {
			customerId: window.CUR_CUSTOMERID,
			projectId: window.CUR_PROJECTID,
			param1: window.CUR_CUSTOMERID,
			param2: window.CUR_PROJECTID
		};
		if (agrs.data.extraOptions.workpaperId) {
			data.param11 = true;
		}
		$.ajax({
			url: 'dgCenter/DgAdjust.checkWorkpaperEditor.json',
			type: 'post',
			data: addWorkpaperId(data, 'param3'),
			dataType: 'json',
			success: function(data) {
				// checkCustomerId = data.data[0].workpaperEditor;
				if (data.data != null) {
					$.ajax({
						url: 'dgCenter/DgAdjust.getVoucher.json',
						type: 'post',
						data: addWorkpaperId(paramData, 'param5'),
						dataType: 'json',
						success: function(data) {
							//$('#adjust_show').show();
							window.adjustPageId = true;
							journalAdjust($node.nextAll().eq(3).html(), 0, data.data, agrs.adjustTyle ? '1' : '2', true, refreshTable);
							if (data.data[0].adjustType == 3){
								$('#jnadjust_type3').text('3')
							}
							// 隐藏按钮
							$('#jnadjust_table_id tbody tr td:nth-child(1) button').hide();
							$('#jnadjust_table_id tbody tr td:nth-child(1) input[name="jnadjust_check"]').attr('disabled', true);
							$('#jnadjust_table_id tbody tr td:nth-child(1) input[name="jnadjust_check"]').parent().css('cursor', 'not-allowed');
							for(var i = 0;i < data.data.length;i++){
								if(data.data[i].isEliminate == '0'){
									$($('#jnadjust_table_id tbody tr td:nth-child(1) input[name="jnadjust_check"]')[i]).attr("checked", false);
								}else{
									$($('#jnadjust_table_id tbody tr td:nth-child(1) input[name="jnadjust_check"]')[i]).attr("checked", true);
								}
							}
							// $('#jnadjust_table_id tbody tr.even
							// button').hide();
							// 隐藏不可编辑框
							$('#jnadjust_table_id tbody tr.odd input').each(function() {
								if ($(this).prop('disabled') && ($(this).prop('name') == 'injnvalue' || $(this).prop('name') == 'outjnvalue')) {
									$(this).hide();
								}
								if ($(this).prop('name') == 'jnsubject') {
									$(this).prop('disabled', true);
								}
							});
							$('#jnadjust_table_id tbody tr.even input').each(function() {
								// 隐藏不可编辑的文本框
								if ($(this).prop('disabled') && ($(this).prop('name') == 'injnvalue' || $(this).prop('name') == 'outjnvalue')) {
									$(this).hide();
								}
								// 科目不可编辑
								if ($(this).prop('name') == 'jnsubject') {
									$(this).prop('disabled', true);
								}
							});
							$('#jnadjust_dgYear2').text(data.data[0].yyyy);
							$('#adjustYear').val(data.data[0].yyyy);
							// $('#adjustYear').parent().parent().hide();
							$('#adjustYear').parent().hide();
							reloadSubjectSelect($($('#jnadjust_table_id tbody tr td input')[0]))
							echoSelect();
						}
					});
				} else {
					bdoErrorBox('提示', '您不是该审计程序的底稿编制人，无法修改！');
				}
			}
		});
	};
	// 启用/禁用
	var enableOrDisable = function($node) {
		// var object = $('#adjustTable').DataTable().data()[$(this).closest('tr').index()];
		//cusNode = $node;
		agrs.data.extraOptions.cusNode = {};
		agrs.data.extraOptions.cusNode.adjustYear = $node.next().html();
		agrs.data.extraOptions.cusNode.adjustIndexId = $node.parent().next().children().html();
		if($node.attr('title') == '调整'){
			$('#invalid_save').click();
		}else {
			$('#modal_invalid').modal('show');
		}
	};
	// 删除
	var deleteAdjust = function($node) {
		// var object = $('#adjustTable').DataTable().data()[$(this).closest('tr').index()];
		//var $node = $(this);
		bdoConfirmBox('删除', '是否删除该笔调整？', function() {
			bdoInProcessingBox("删除中！");
			$.ajax({
				url: 'dgCenter/DgAdjust.journalDelete.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					param1: $node.next().html()
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						refreshTable();
						jnamountCalu();
						if(data.resultInfo.statusText != ''){
							bdoInfoBox('成功', data.resultInfo.statusText, 15000);
						}else{
							bdoSuccessBox('成功', data.resultInfo.statusText);
						}
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	};
	/** 打开添加核算modal */
	$('#add_customer_assItem').click(function() {
		$('#modal_cunstomer_assItem').modal('show');;
	});
	/** 源科目 */
	$('#cunstomer_subjectid_source').on('focus', function() {
		$('#modal_subjectid_source').modal('show');
		let year = getAdjustYear();
		$('#adsubject_tree_source').tree4({
			url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
			params: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param9: window.CUR_CUSTOMERID,
				param10: year,// $("#jnadjust_year").val()//更改
				param11: window.CUR_PROJECTID,
				param12: getShowType(),
				searchInputId: 'searchInput_source'
				// param12 : param12
			},
			singleSelect: true,
			// lazyLoad : false,
			// onceLoad : true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: false,
				selectedColor: '',
				selectedBackColor: ''

			}
			/*lazyLoad : false,
            view : {
                leafIcon: 'fa fa-building text-flat',
                nodeIcon: 'fa fa-bank text-primary-light',
                folderSelectable: false,
                multiSelect: false,
                showCheckbox: true,
                selectedColor: '',
                selectedBackColor: ''
            }*/
		});
	});
	$('#modal_subject_source_sure').click(function() {
		var selectValue = $('#adsubject_tree_source').treeview(true).getSelected()[0];
		if (selectValue == undefined) {
			$('#cunstomer_subjectid_source').val('');
		} else {
			$('#cunstomer_subjectid_source').val(selectValue.id);
		}
		$('#modal_subjectid_source').modal('hide');
		$('#adsubject_tree_source').tree4('reset');
	});
	$('#modal_subject_source_reset').click(function() {
		$('#adsubject_tree_source').tree4('reset');

	});
	/** 目标科目 */
	$('#cunstomer_subjectid_target').on('focus', function() {
		$('#modal_subjectid_target').modal('show');
		let year = getAdjustYear();
		$('#adsubject_tree_target').tree4({
			url: 'dgCenter/DgAdjustTree.findAccSubjectType.json',
			params: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param9: window.CUR_CUSTOMERID,
				param10: year,// $("#jnadjust_year").val()//更改
				param11: window.CUR_PROJECTID,
				param12: getShowType(),
				searchInputId: 'searchInput_target'
				// param12 : param12
			},
			singleSelect: true,
			// lazyLoad : false,
			// onceLoad : true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: false,
				selectedColor: '',
				selectedBackColor: ''

			}
			/*lazyLoad : false,
            view : {
                leafIcon: 'fa fa-building text-flat',
                nodeIcon: 'fa fa-bank text-primary-light',
                folderSelectable: false,
                multiSelect: false,
                showCheckbox: true,
                selectedColor: '',
                selectedBackColor: ''
            }*/
		});
	});
	$('#modal_subject_target_sure').click(function() {
		var selectValue = $('#adsubject_tree_target').treeview(true).getSelected()[0];
		if (selectValue == undefined) {
			$('#cunstomer_subjectid_target').val('');
		} else {
			$('#cunstomer_subjectid_target').val(selectValue.id);
		}
		$('#modal_subjectid_target').modal('hide');
		$('#adsubject_tree_target').tree4('reset');
	});
	$('#modal_subject_target_reset').click(function() {
		$('#adsubject_tree_target').tree4('reset');

	});
	// 添加核算
	$('#modal_cunstomer_assItem_sure').click(function() {
		var cunstomer_subjectid_source = $('#cunstomer_subjectid_source').val();
		var cunstomer_subjectid_target = $('#cunstomer_subjectid_target').val();
		if (cunstomer_subjectid_source == null || cunstomer_subjectid_source == '') {
			bdoInfoBox('提示', '请选择源科目');
			return;
		}
		if (cunstomer_subjectid_target == null || cunstomer_subjectid_target == '') {
			bdoInfoBox('提示', '请选择目标科目');
			return;
		}
		let year = getAdjustYear();
		bdoConfirmBox('保存', '确认保存？', function() {
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'dgCenter/DgAdjust.saveCustomerAssItem.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					//lockProjectId: customer.split('-')[0],
					//lockYyyy: yyyy,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: year,
					param4: cunstomer_subjectid_source,
					param5: cunstomer_subjectid_target
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
						$('#modal_cunstomer_assItem').modal('hide');
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	// 初始化核算
	$('#modal_cunstomer_assItem_init').click(function() {
		bdoConfirmBox('保存', '确认初始化？', function() {
			bdoInProcessingBox('处理中');
			$.ajax({
				url: 'dgCenter/DgAdjust.initCustomerAssItem.json',
				type: 'post',
				data: {
					customerId: window.CUR_CUSTOMERID,
					projectId: window.CUR_PROJECTID,
					//lockProjectId: customer.split('-')[0],
					//lockYyyy: yyyy,
					param1: window.CUR_CUSTOMERID,
					param2: window.CUR_PROJECTID,
					param3: window.CUR_PROJECT_ACC_YEAR
				},
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						bdoSuccessBox('成功', data.resultInfo.statusText);
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});
	/** 初始化页面 */
	var resultAdjust = {};
	resultAdjust.mount = function() {
		initPageValue();
		$(agrs.region).empty().append(_template);
		initTable();
		listener();
		bindModalEvent();
	};
	$('adjustTable_processing').hide(200);
	resultAdjust.tableModel = adjustTable;
	resultAdjust.journal = journalAdjust;
	resultAdjust.setIndexId = setIndexId;
	resultAdjust.openEditModal = openEditModal;
	resultAdjust.enableOrDisable = enableOrDisable;
	resultAdjust.deleteAdjust = deleteAdjust;
	resultAdjust.setUpdateParam = function(param) {
		agrs.adjustTyle = param.adjustTyle;
		agrs.data.extraOptions.workpaperId = param.workpaperId;
		agrs.data.extraOptions.tableId = param.tableId;
	};
	function initManager(){
		$.ajax({
			url: 'dgCenter/DgProject.getProjectInfo.json',
			type: 'post',
			data: {
				customerId: window.CUR_CUSTOMERID,
				projectId: window.CUR_PROJECTID,
				param1:CUR_PROJECTID,
				param2:CUR_CUSTOMERID
			},
			dataType: 'json',
			success: function(data) {
				if (data.success &&  data.data[0] && data.data[0].projectInfo){
					managerId = data.data[0].projectInfo.manager;
				}
			}
		});
	}
	initManager();
	return resultAdjust;
};

