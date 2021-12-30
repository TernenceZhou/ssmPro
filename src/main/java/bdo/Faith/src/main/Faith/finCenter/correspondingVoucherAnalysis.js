$(document).ready(function () {
	uiBlocksApi(false, 'init');
	// 1:多借多贷分析 2:对应凭证分析 3:对应凭证汇总
	var exportType;
	// 1:对应凭证分析刷新flag
	var refreshSearch2 = true;
	// 查询条件定值,防止条件变更后没有查询导致结果不一致
	var customerId_1 = '', yyyy_1 = '', startMonth_1 = '', endMonth_1 = '', fxDirection_1 = '', subjectId_1 = '';
	var customerId_3 = '', yyyy_3 = '', startMonth_3 = '', endMonth_3 = '', fxDirection_3 = '';
	// // 查询条件
	// 客户
	getUserCustomers('analysis_customerId');
	getUserCustomers('analysis_customerId3');
	// 日期
	$('#analysis_yyyy,#analysis_yyyy3').datepicker({
		autoclose: true,
		todayHighlight: true,
		language: 'zh-CN', // 语言设置
		format: 'yyyy', // 日期显示格式
		minViewMode: 2
	});
	$('#analysis_startmonth,#analysis_endmonth,#analysis_startmonth3,#analysis_endmonth3').html(ComboLocalDicOption(false, 'month'));
	$('#analysis_startmonth,#analysis_startmonth3').val('01');
	$('#analysis_endmonth,#analysis_endmonth3').val('12');
	$('#analysis_fxDirection,#analysis_fxDirection3').html(ComboLocalDicOption(false, '方向')).val('1');
	let corrstartyear = window.CUR_PROJECT_START_YEAR;
	if (window.transferedMenu) {
		corrstartyear = window.BDO_YEAR_SELECT + '';
		window.BDO_CUSTOMER_SELECT = window.BDO_CUSTOMER_SELECT_temp;
		window.BDO_YEAR_SELECT = window.BDO_YEAR_SELECT_temp;
		window.transferedMenu = false;
	}
	if (!corrstartyear || corrstartyear == '') {
		corrstartyear = new Date().getFullYear();
	}
	$('#analysis_yyyy').change(function () {
		refreshSearch2 = true;
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			$('#accmulsubject_tree').tree('reset');
			$('#accmulsubject_tree').tree('destory');
		}
	}).val(corrstartyear);
	$('#analysis_yyyy3').val(corrstartyear);
	$('#analysis_customerId,#analysis_startmonth,#analysis_endmonth,#analysis_fxDirection').change(function () {
		refreshSearch2 = true;
	});

	// 选择科目
	$('#analysis_subjectid').focus(function () {
		if ($('#analysis_customerId').val() == '') {
			$('#analysis_customerId').focus();
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#analysis_yyyy').val() == '') {
			$('#analysis_yyyy').focus();
			bdoInfoBox('提示', '请选择账套年份');
			return;
		}
		$('#modal_subjectid').modal('show');
		if ($('#accmulsubject_tree').hasClass('treeview')) {
			return;
		}
		$('#accmulsubject_tree').tree({
			url: 'finCenter/FinTreeCommon.findAccSubjectType.json',
			params: {
				lockProjectId: $('#analysis_customerId').val(),
				lockYyyy: $('#analysis_yyyy').val(),
				searchInputId: 'searchInput2'
			},
			singleSelect: true,
			lazyLoad: false,
			onceLoad: true,
			view: {
				leafIcon: 'fa fa-building text-flat',
				nodeIcon: 'fa fa-bank text-primary-light',
				folderSelectable: false,
				multiSelect: false,
				showCheckbox: true,
				selectedColor: '',
				selectedBackColor: ''
			}
		});
	});

	$('#modal_accmulsubjectid_sure').click(function () {
		if (typeof ($('#accmulsubject_tree').tree('getTreeMultiValue')) == 'object') {
			$('#analysis_subjectid').val('');
			$('#analysis_subjectid').attr('data-content', '');
		} else {
			$('#analysis_subjectid').val($('#accmulsubject_tree').tree('getTreeMultiValue'));
			$('#analysis_subjectid').attr('data-content', $('#accmulsubject_tree').tree('getTreeMultiLabel'));
		}
		$('#modal_subjectid').modal('hide');
		refreshSearch2 = true;
	});

	$('#modal_accmulsubjectid_reset').click(function () {
		$('#accmulsubject_tree').tree('reset');
		refreshSearch2 = true;
	});

	// // 多借多贷分析
	$('#loadImg').hide();
	var dropDown = function () {
		$('#treeTable').html('');
		$('#loadImg').show();
		// 表头
		var th = '<thead><tr>' +
			'<th style="width: 30px;"></th>' +
			'<th>分析</th>' +
			'<th>科目编号</th>' +
			'<th>科目名称</th>' +
			'<th class="text-right">金额</th>' +
			'<th class="text-right">占总发生额百分比(%)</th>' +
			'<th>凭证张数</th>' +
			'<th class="text-right">平均单笔金额</th>' +
			'<th class="text-right">最大单笔金额</th>' +
			'</tr></thead> ';
		$('#treeTable').append(th);
		// 一级科目+多借多贷+同借同贷
		$.ajax({
			type: 'post',
			url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherAnaly.json',
			data: {
				'menuId': window.sys_menuId,
				'lockProjectId': customerId_1,
				'lockYyyy': yyyy_1,
				'param1': startMonth_1,
				'param2': endMonth_1,
				'param3': subjectId_1,
				'param4': fxDirection_1,
				'param5': ''
			},
			dataType: 'json',
			bdolxLoader: false,
			success: function (data) {
				if (data.resultInfo.status == 3) {
					bdoErrorBox('错误', data.resultInfo.statusText);
					$('#loadImg').hide();
					$('#treeTable').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
					return;
				}
				if (data.data == null) {
					$('#loadImg').hide();
					$('#treeTable').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
					return;
				}
				jsqcorresponding('treeTable');
				// 计算器重置
				$('#jsq_clear_treeTable').unbind();
				$('#jsq_clear_treeTable').on('click', function () {
					$('#suanshi_treeTable').val('');
					$('#jieguo_treeTable').val('');
				});
				$.each(data.data, function (idx, obj) {
					var rows = '';
					if (obj.oneSubjectId == '多借多贷凭证') {
						if (obj.voucherCount != 0) {
							rows = '<tbody><tr>'
								+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDjdd" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
								+ '<td class="text-center"><li onclick="manyVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'\',\'' + obj.voucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li></td>'
								+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
								+ '<td><span>' + obj.subjectFullName + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
								+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
								+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
								+ '</tr></tbody>';
						} else {
							rows = '<tbody><tr>'
								+ '<td></td>'
								+ '<td class="text-center"><li onclick="manyVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'\',\'' + obj.voucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li></td>'
								+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
								+ '<td><span>' + obj.subjectFullName + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
								+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
								+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
								+ '</tr></tbody>';
						}
					} else if (obj.oneSubjectId == '同借同贷凭证') {
						if (obj.voucherCount != 0) {
							rows = '<tbody><tr>'
								+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowTjtd" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
								+ '<td class="text-center"><li onclick="sameVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li></td>'
								+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
								+ '<td><span>' + obj.subjectFullName + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
								+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
								+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
								+ '</tr></tbody>';
						} else {
							rows = '<tbody><tr>'
								+ '<td></td>'
								+ '<td class="text-center"><li onclick="sameVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li></td>'
								+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
								+ '<td><span>' + obj.subjectFullName + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
								+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
								+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
								+ '</tr></tbody>';
						}
					} else if (obj.oneSubjectId == '关联方对账凭证') {
						if (obj.voucherCount != 0) {
							rows = '<tbody><tr>'
								+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowRelated" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
								+ '<td class="text-center"><li onclick="relatedVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherKey + '\')" class="fa fa-check-circle-o" style="cursor:pointer;" data-placement="top" title="关联方对账分析" data-toggle="tooltip"></li></td>'
								+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
								+ '<td><span>' + obj.subjectFullName + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
								+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
								+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
								+ '</tr></tbody>';
						} else {
							rows = '<tbody><tr>'
								+ '<td></td>'
								+ '<td class="text-center"><li onclick="relatedVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherKey + '\')" class="fa fa-check-circle-o" style="cursor:pointer;" data-placement="top" title="关联方对账分析" data-toggle="tooltip"></li></td>'
								+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
								+ '<td><span>' + obj.subjectFullName + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
								+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
								+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
								+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
								+ '</tr></tbody>';
						}
					} else if (obj.oneSubjectId == '合计') {
						rows = '<tbody><tr>'
							+ '<td></td>'
							+ '<td></td>'
							+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
							+ '<td><span>' + obj.subjectFullName + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
							+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
							+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
							+ '</tr></tbody>';
					} else if (obj.isLeaf1 == 0) {
						rows = '<tbody><tr>'
							+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowYb" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
							+ '<td class="text-center"><li onclick="vouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
							+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
							+ '<td><span>' + obj.subjectFullName + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
							+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
							+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
							+ '</tr></tbody>';
					} else {
						rows = '<tbody><tr>'
							+ '<td></td>'
							+ '<td class="text-center"><li onclick="vouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
							+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
							+ '<td><span>' + obj.subjectFullName + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
							+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
							+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
							+ '</tr></tbody>';
					}
					$('#treeTable').append(rows);
					$('#loadImg').hide();
				});

				// 多借多贷展开
				$('#treeTable').off('click', '[name=rowShowDjdd]');
				$('#treeTable').on('click', '[name=rowShowDjdd]', function () {
					var MThis = $(this);
					if ($('[vouCher=M]').length != 0) {
						$('[vouCher=M]').remove();
						MThis.removeClass('fa-minus-square-o');
						MThis.addClass('fa-plus-square-o');
						MThis.parents('tbody').removeClass('js-table-sections-header');
						MThis.parents('tbody').removeClass('open');
						return;
					} else {
						MThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getManyVoucherAnalysis.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_1,
							'lockYyyy': yyyy_1,
							'param1': startMonth_1,
							'param2': endMonth_1,
							'param3': subjectId_1,
							'param4': fxDirection_1,
							'param5': ''
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								if (obj.isLeaf1 != 1) {
									rows += '<tbody style="color:#426ab3;" vouCher="M"><tr>'
										+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDjddSubject" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
										+ '<td class="text-center"><li onclick="manyVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								} else {
									rows += '<tbody style="color:#426ab3;" vouCher="M"><tr>'
										+ '<td></td>'
										+ '<td class="text-center"><li onclick="manyVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								}
							});
							MThis.removeClass('fa-plus-square-o');
							MThis.addClass('fa-minus-square-o');
							MThis.parents('tbody').after(rows);
							MThis.parents('tbody').addClass('js-table-sections-header');
							MThis.parents('tbody').addClass('open');
							MThis.parents('tbody').find('#loadImg').remove();

							// 多借多贷科目展开
							$('#treeTable').off('click', '[name="rowShowDjddSubject"]');
							$('#treeTable').on('click', '[name="rowShowDjddSubject"]', function () {
								var MTThis = $(this);
								var oneSubjectId = $(this).parents('tbody').find('[name=oneSubjectId]').html();
								if ($('[name^="' + oneSubjectId + '"][name$="djdd"]').length != 0) {
									$('[name^="' + oneSubjectId + '"][name$="djdd"]').remove();
									MTThis.removeClass('fa-minus-square-o');
									MTThis.addClass('fa-plus-square-o');
									MTThis.parents('tbody').removeClass('js-table-sections-header');
									MTThis.parents('tbody').removeClass('open');
									return;
								} else {
									MTThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
								}
								$.ajax({
									type: 'post',
									url: 'finCenter/CorrespondingVoucherAnalysis.getManyVoucherAnalysis.json',
									data: {
										'menuId': window.sys_menuId,
										'lockProjectId': customerId_1,
										'lockYyyy': yyyy_1,
										'param1': startMonth_1,
										'param2': endMonth_1,
										'param3': subjectId_1,
										'param4': fxDirection_1,
										'param5': oneSubjectId
									},
									dataType: 'json',
									success: function (data) {
										var rows = '';
										$.each(data.data, function (idx, obj) {
											if (obj.isLeaf1 != 1) {
												rows += '<tbody style="color:green;" vouCher="M" name="' + oneSubjectId + 'djdd"><tr>'
													+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDjddSubject" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
													+ '<td class="text-center"><li onclick="manyVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li></td>'
													+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
													+ '<td><span>' + obj.subjectFullName + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
													+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
													+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
													+ '</tr></tbody>';
											} else {
												rows += '<tbody style="color:green;" vouCher="M" name="' + oneSubjectId + 'djdd"><tr>'
													+ '<td></td>'
													+ '<td class="text-center"><li onclick="manyVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li></td>'
													+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
													+ '<td><span>' + obj.subjectFullName + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
													+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
													+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
													+ '</tr></tbody>';
											}
										});
										MTThis.removeClass('fa-plus-square-o');
										MTThis.addClass('fa-minus-square-o');
										MTThis.parents('tbody').after(rows);
										MTThis.parents('tbody').addClass('js-table-sections-header');
										MTThis.parents('tbody').addClass('open');
										MTThis.parents('tbody').find('#loadImg').remove();
									}
								});
							});
						}
					});
				});

				// 同借同贷展开
				$('#treeTable').off('click', '[name=rowShowTjtd]');
				$('#treeTable').on('click', '[name=rowShowTjtd]', function () {
					var MThis = $(this);
					if ($('[vouCher=S]').length != 0) {
						$('[vouCher=S]').remove();
						MThis.removeClass('fa-minus-square-o');
						MThis.addClass('fa-plus-square-o');
						MThis.parents('tbody').removeClass('js-table-sections-header');
						MThis.parents('tbody').removeClass('open');
						return;
					} else {
						MThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getSameVoucherAnalysis.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_1,
							'lockYyyy': yyyy_1,
							'param1': startMonth_1,
							'param2': endMonth_1,
							'param3': subjectId_1,
							'param4': fxDirection_1,
							'param5': ''
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								if (obj.isLeaf1 != 1) {
									rows += '<tbody style="color:#426ab3;" vouCher="S"><tr>'
										+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowTjtdSubject" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
										+ '<td class="text-center"><li onclick="sameVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								} else {
									rows += '<tbody style="color:#426ab3;" vouCher="S"><tr>'
										+ '<td></td>'
										+ '<td class="text-center"><li onclick="sameVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								}
							});
							MThis.removeClass('fa-plus-square-o');
							MThis.addClass('fa-minus-square-o');
							MThis.parents('tbody').after(rows);
							MThis.parents('tbody').addClass('js-table-sections-header');
							MThis.parents('tbody').addClass('open');
							MThis.parents('tbody').find('#loadImg').remove();

							// 同借同贷科目展开
							$('#treeTable').off('click', '[name="rowShowTjtdSubject"]');
							$('#treeTable').on('click', '[name="rowShowTjtdSubject"]', function () {
								var MTThis = $(this);
								var oneSubjectId = $(this).parents('tbody').find('[name=oneSubjectId]').html();
								if ($('[name^="' + oneSubjectId + '"][name$="tjtd"]').length != 0) {
									$('[name^="' + oneSubjectId + '"][name$="tjtd"]').remove();
									MTThis.removeClass('fa-minus-square-o');
									MTThis.addClass('fa-plus-square-o');
									MTThis.parents('tbody').removeClass('js-table-sections-header');
									MTThis.parents('tbody').removeClass('open');
									return;
								} else {
									MTThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
								}
								$.ajax({
									type: 'post',
									url: 'finCenter/CorrespondingVoucherAnalysis.getSameVoucherAnalysis.json',
									data: {
										'menuId': window.sys_menuId,
										'lockProjectId': customerId_1,
										'lockYyyy': yyyy_1,
										'param1': startMonth_1,
										'param2': endMonth_1,
										'param3': subjectId_1,
										'param4': fxDirection_1,
										'param5': oneSubjectId
									},
									dataType: 'json',
									success: function (data) {
										var rows = '';
										$.each(data.data, function (idx, obj) {
											if (obj.isLeaf1 != 1) {
												rows += '<tbody style="color:green;" vouCher="S" name="' + oneSubjectId + 'tjtd"><tr>'
													+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowTjtdSubject" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
													+ '<td class="text-center"><li onclick="sameVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li></td>'
													+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
													+ '<td><span>' + obj.subjectFullName + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
													+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
													+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
													+ '</tr></tbody>';
											} else {
												rows += '<tbody style="color:green;" vouCher="S" name="' + oneSubjectId + 'tjtd"><tr>'
													+ '<td></td>'
													+ '<td class="text-center"><li onclick="sameVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li></td>'
													+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
													+ '<td><span>' + obj.subjectFullName + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
													+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
													+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
													+ '</tr></tbody>';
											}
										});
										MTThis.removeClass('fa-plus-square-o');
										MTThis.addClass('fa-minus-square-o');
										MTThis.parents('tbody').after(rows);
										MTThis.parents('tbody').addClass('js-table-sections-header');
										MTThis.parents('tbody').addClass('open');
										MTThis.parents('tbody').find('#loadImg').remove();
									}
								});
							});
						}
					});
				});

				// 关联方对账展开
				$('#treeTable').off('click', '[name=rowShowRelated]');
				$('#treeTable').on('click', '[name=rowShowRelated]', function () {
					var MThis = $(this);
					if ($('[vouCher=R]').length != 0) {
						$('[vouCher=R]').remove();
						MThis.removeClass('fa-minus-square-o');
						MThis.addClass('fa-plus-square-o');
						MThis.parents('tbody').removeClass('js-table-sections-header');
						MThis.parents('tbody').removeClass('open');
						return;
					} else {
						MThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getRelatedVoucherAnalysis.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_1,
							'lockYyyy': yyyy_1,
							'param1': startMonth_1,
							'param2': endMonth_1,
							'param3': subjectId_1,
							'param4': fxDirection_1,
							'param5': ''
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								if (obj.isLeaf1 != 1) {
									rows += '<tbody style="color:#426ab3;" vouCher="R"><tr>'
										+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowRelatedSubject" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
										+ '<td class="text-center"><li onclick="relatedVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherKey + '\')" class="fa fa-check-circle-o" style="cursor:pointer;" data-placement="top" title="关联方对账分析" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								} else {
									rows += '<tbody style="color:#426ab3;" vouCher="R"><tr>'
										+ '<td></td>'
										+ '<td class="text-center"><li onclick="relatedVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherKey + '\')" class="fa fa-check-circle-o" style="cursor:pointer;" data-placement="top" title="关联方对账分析" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								}
							});
							MThis.removeClass('fa-plus-square-o');
							MThis.addClass('fa-minus-square-o');
							MThis.parents('tbody').after(rows);
							MThis.parents('tbody').addClass('js-table-sections-header');
							MThis.parents('tbody').addClass('open');
							MThis.parents('tbody').find('#loadImg').remove();

							// 关联方对账科目展开
							$('#treeTable').off('click', '[name="rowShowRelatedSubject"]');
							$('#treeTable').on('click', '[name="rowShowRelatedSubject"]', function () {
								var MTThis = $(this);
								var oneSubjectId = $(this).parents('tbody').find('[name=oneSubjectId]').html();
								if ($('[name^="' + oneSubjectId + '"][name$="related"]').length != 0) {
									$('[name^="' + oneSubjectId + '"][name$="related"]').remove();
									MTThis.removeClass('fa-minus-square-o');
									MTThis.addClass('fa-plus-square-o');
									MTThis.parents('tbody').removeClass('js-table-sections-header');
									MTThis.parents('tbody').removeClass('open');
									return;
								} else {
									MTThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
								}
								$.ajax({
									type: 'post',
									url: 'finCenter/CorrespondingVoucherAnalysis.getRelatedVoucherAnalysis.json',
									data: {
										'menuId': window.sys_menuId,
										'lockProjectId': customerId_1,
										'lockYyyy': yyyy_1,
										'param1': startMonth_1,
										'param2': endMonth_1,
										'param3': subjectId_1,
										'param4': fxDirection_1,
										'param5': oneSubjectId
									},
									dataType: 'json',
									success: function (data) {
										var rows = '';
										$.each(data.data, function (idx, obj) {
											if (obj.isLeaf1 != 1) {
												rows += '<tbody style="color:green;" vouCher="R" name="' + oneSubjectId + 'djdd"><tr>'
													+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowRelatedSubject" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
													+ '<td class="text-center"><li onclick="relatedVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherKey + '\')" class="fa fa-check-circle-o" style="cursor:pointer;" data-placement="top" title="关联方对账分析" data-toggle="tooltip"></li></td>'
													+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
													+ '<td><span>' + obj.subjectFullName + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
													+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
													+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
													+ '</tr></tbody>';
											} else {
												rows += '<tbody style="color:green;" vouCher="R" name="' + oneSubjectId + 'djdd"><tr>'
													+ '<td></td>'
													+ '<td class="text-center"><li onclick="relatedVouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherKey + '\')" class="fa fa-check-circle-o" style="cursor:pointer;" data-placement="top" title="关联方对账分析" data-toggle="tooltip"></li></td>'
													+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
													+ '<td><span>' + obj.subjectFullName + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
													+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
													+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
													+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
													+ '</tr></tbody>';
											}
										});
										MTThis.removeClass('fa-plus-square-o');
										MTThis.addClass('fa-minus-square-o');
										MTThis.parents('tbody').after(rows);
										MTThis.parents('tbody').addClass('js-table-sections-header');
										MTThis.parents('tbody').addClass('open');
										MTThis.parents('tbody').find('#loadImg').remove();
									}
								});
							});
						}
					});
				});

				// 一般一级科目展开
				$('#treeTable').off('click', '[name=rowShowYb]');
				$('#treeTable').on('click', '[name=rowShowYb]', function () {
					var oneSubjectId = $(this).parents('tbody').find('[name=oneSubjectId]').html();
					var tThis = $(this);
					if ($('[name^="' + oneSubjectId + '"][name$="yb"]').length != 0) {
						$('[name^="' + oneSubjectId + '"][name$="yb"]').remove();
						tThis.removeClass('fa-minus-square-o');
						tThis.addClass('fa-plus-square-o');
						tThis.parents('tbody').removeClass('js-table-sections-header');
						tThis.parents('tbody').removeClass('open');
						return;
					} else {
						tThis.parents('tbody').append('<tr id="loadImg" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherAnaly.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_1,
							'lockYyyy': yyyy_1,
							'param1': startMonth_1,
							'param2': endMonth_1,
							'param3': subjectId_1,
							'param4': fxDirection_1,
							'param5': oneSubjectId,
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								if (obj.isLeaf1 != 1) {
									rows += '<tbody name="' + oneSubjectId + 'yb" style="color:#426ab3;"><tr>'
										+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowYb" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
										+ '<td class="text-center"><li onclick="vouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								} else {
									rows += '<tbody name="' + oneSubjectId + 'yb" style="color:#426ab3;"><tr>'
										+ '<td></td>'
										+ '<td class="text-center"><li onclick="vouCherTable(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								}
							});
							tThis.removeClass('fa-plus-square-o');
							tThis.addClass('fa-minus-square-o');
							tThis.parents('tbody').after(rows);
							tThis.parents('tbody').addClass('js-table-sections-header');
							tThis.parents('tbody').addClass('open');
							tThis.parents('tbody').find('#loadImg').remove();
						}
					});
				});
			}
		});
	};

	// // 对应凭证分析
	$('#loadImg_two').hide();
	var dropDown_two = function () {
		$('#treeTable_two').html('');
		$('#loadImg_two').show();
		// 表头
		var th = '<thead><tr>' +
			'<th style="width: 30px;"></th>' +
			'<th>分析</th>' +
			'<th>科目编号</th>' +
			'<th>科目名称</th>' +
			'<th class="text-right">金额</th>' +
			'<th class="text-right">占总发生额百分比(%)</th>' +
			'<th>凭证张数</th>' +
			'<th class="text-right">平均单笔金额</th>' +
			'<th class="text-right">最大单笔金额</th>' +
			'</tr></thead>';
		$('#treeTable_two').append(th);
		// 一级科目
		$.ajax({
			type: 'post',
			url: 'finCenter/CorrespondingVoucherAnalysis.getAllVoucherAnaly.json',
			data: {
				'menuId': window.sys_menuId,
				'lockProjectId': customerId_1,
				'lockYyyy': yyyy_1,
				'param1': startMonth_1,
				'param2': endMonth_1,
				'param3': subjectId_1,
				'param4': fxDirection_1,
				'param5': ''
			},
			dataType: 'json',
			success: function (data) {
				if (data.data == null) {
					$('#loadImg_two').hide();
					$('#treeTable_two').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
				}
				jsqcorresponding('treeTable_two');
				// 计算器重置
				$('#jsq_clear_treeTable_two').unbind();
				$('#jsq_clear_treeTable_two').on('click', function () {
					$('#suanshi_treeTable_two').val('');
					$('#jieguo_treeTable_two').val('');
				});
				$.each(data.data, function (idx, obj) {
					var rows = '';
					if (obj.oneSubjectId == '合计') {
						rows = '<tbody><tr>'
							+ '<td></td>'
							+ '<td></td>'
							+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
							+ '<td><span>' + obj.subjectFullName + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
							+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
							+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
							+ '</tr></tbody>';
					} else if (obj.isLeaf1 == 0) {
						rows = '<tbody><tr>'
							+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDypz" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
							+ '<td class="text-center"><li onclick="vouCherTable_two(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
							+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
							+ '<td><span>' + obj.subjectFullName + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
							+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
							+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
							+ '</tr></tbody>';
					} else {
						rows = '<tbody><tr>'
							+ '<td></td>'
							+ '<td class="text-center"><li onclick="vouCherTable_two(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
							+ '<td><span name="oneSubjectId">' + obj.oneSubjectId + '</span></td>'
							+ '<td><span>' + obj.subjectFullName + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
							+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
							+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
							+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
							+ '</tr></tbody>';
					}
					$('#treeTable_two').append(rows);
					$('#loadImg_two').hide();
				});

				// 对应凭证分析科目展开
				$('#treeTable_two').off('click', '[name=rowShowDypz]');
				$('#treeTable_two').on('click', '[name=rowShowDypz]', function () {
					var oneSubjectId = $(this).parents('tbody').find('[name=oneSubjectId]').html();
					var tThis = $(this);
					if ($('[name^="' + oneSubjectId + '"][name$="dypz"]').length != 0) {
						$('[name^="' + oneSubjectId + '"][name$="dypz"]').remove();
						tThis.removeClass('fa-minus-square-o');
						tThis.addClass('fa-plus-square-o');
						tThis.parents('tbody').removeClass('js-table-sections-header');
						tThis.parents('tbody').removeClass('open');
						return;
					} else {
						tThis.parents('tbody').append('<tr id="loadImg_two" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getAllVoucherAnaly.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_1,
							'lockYyyy': yyyy_1,
							'param1': startMonth_1,
							'param2': endMonth_1,
							'param3': subjectId_1,
							'param4': fxDirection_1,
							'param5': oneSubjectId
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								if (obj.isLeaf1 != 1) {
									rows += '<tbody name="' + oneSubjectId + 'dypz" style="color:#426ab3;"><tr>'
										+ '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDypz" data-placement="top" title="下级科目" data-toggle="tooltip"></li></td>'
										+ '<td class="text-center"><li onclick="vouCherTable_two(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								} else {
									rows += '<tbody name="' + oneSubjectId + 'dypz" style="color:#426ab3;"><tr>'
										+ '<td></td>'
										+ '<td class="text-center"><li onclick="vouCherTable_two(\'' + customerId_1 + '\',\'' + yyyy_1 + '\',\'' + startMonth_1 + '\',\'' + endMonth_1 + '\',\'' + subjectId_1 + '\',\'' + fxDirection_1 + '\',\'' + obj.oneSubjectId + '\',\'' + obj.voucherIds + '\')" class="fa fa-eye" style="cursor:pointer;" data-placement="top" title="对应凭证一览" data-toggle="tooltip"></li></td>'
										+ '<td><span name="oneSubjectId" style="padding-left:' + 5 * obj.subjectLevel + 'px;">' + obj.oneSubjectId + '</span></td>'
										+ '<td><span>' + obj.subjectFullName + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.sumValue) + '</span></td>'
										+ '<td class="text-right"><span>' + obj.percentage + '</span></td>'
										+ '<td class="text-right"><span>' + obj.voucherCount + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.avgValue) + '</span></td>'
										+ '<td class="text-right can-calculate"><span>' + formatMoney(obj.largeValue) + '</span></td>'
										+ '</tr></tbody>';
								}
							});
							tThis.removeClass('fa-plus-square-o');
							tThis.addClass('fa-minus-square-o');
							tThis.parents('tbody').after(rows);
							tThis.parents('tbody').addClass('js-table-sections-header');
							tThis.parents('tbody').addClass('open');
							tThis.parents('tbody').find('#loadImg_two').remove();
						}
					});
				});
			}
		});
	};

	$('#dyVoucher_refresh_1').click(function () {
		$('#btn_search').click();
	});
	/** 多借多贷分析 */
	$('#btn_search').click(function () {
		var canSearch = true;
		if ($('#analysis_customerId').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择客户');
		}
		if ($('#analysis_yyyy').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择年份');
		}
		if ($('#analysis_subjectid').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择科目');
		}
		if ($('#analysis_fxDirection').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择分析方向');
		}
		if (canSearch) {
			// 记录成功查询的条件
			customerId_1 = $('#analysis_customerId').val();
			yyyy_1 = $('#analysis_yyyy').val();
			startMonth_1 = $('#analysis_startmonth').val();
			endMonth_1 = $('#analysis_endmonth').val();
			fxDirection_1 = $('#analysis_fxDirection').val();
			subjectId_1 = $('#analysis_subjectid').val();
			// 账套过期时间
			getValidDate(customerId_1, yyyy_1, 'validDate');
			dropDown();
			$('#correspondingVoucherAnalysis_export,#correspondingVoucherAnalysis_export_dg').show();
		} else {
			$('#treeTable_two').html('');
			$('#correspondingVoucherAnalysis_export,#correspondingVoucherAnalysis_export_dg').hide();
		}
	});
	$('#dyVoucher_refresh_2').click(function () {
		refreshSearch2 = true;
		$('#dyVoucher_tab_2').click();
	});
	/** 对应凭证分析 */
	$('#dyVoucher_tab_2').click(function () {
		var canSearch = true;
		if ($('#analysis_customerId').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择客户');
		}
		if ($('#analysis_yyyy').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择年份');
		}
		if ($('#analysis_subjectid').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择科目');
		}
		if ($('#analysis_fxDirection').val() == '') {
			canSearch = false;
			bdoInfoBox('提示', '请选择分析方向');
		}
		if (canSearch) {
			if (refreshSearch2) {
				dropDown_two();
				$('#correspondingVoucherAnalysis_export_two,#correspondingVoucherAnalysis_export_dg_two').show();
				refreshSearch2 = false;
			}
		} else {
			$('#treeTable_two').html('');
			$('#correspondingVoucherAnalysis_export_two,#correspondingVoucherAnalysis_export_dg_two').hide();
		}
	});

	// 对应凭证汇总
	$('#loadImg_3').hide();
	var createDyVoucherGather = function () {
		$('#dyVoucher_table_3').html('');
		$('#loadImg_3').show();
		var fxDirectionNm = (fxDirection_3 == '1' ? '借' : '贷');
		var dyDirection = (fxDirection_3 == '1' ? '-1' : '1');
		var dyDirectionNm = (dyDirection == '1' ? '借' : '贷');
		// 表头
		var th = '<thead><tr>' +
			'<th style="width: 30px;" class="text-center"></th>' +
			'<th class="text-center">分析</th>' +
			'<th class="text-center">科目编号</th>' +
			'<th class="text-center">科目名称</th>' +
			'<th class="text-center">方向</th>' +
			'<th class="text-center">多借多贷及同借同贷凭证金额</th>' +
			'<th class="text-center">分析金额</th>' +
			'<th class="text-center">对应科目分析</th>' +
			'<th class="text-center">对应科目分析金额</th>' +
			'<th class="text-center">是否一致</th>' +
			'</tr></thead>';
		$('#dyVoucher_table_3').append(th);
		// 一级科目
		$.ajax({
			type: 'post',
			url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherSum.json',
			data: {
				'menuId': window.sys_menuId,
				'lockProjectId': customerId_3,
				'lockYyyy': yyyy_3,
				'param1': startMonth_3,
				'param2': endMonth_3,
				'param3': '',
				'param4': fxDirection_3,
				'param5': '',
				'param6': '0'
			},
			dataType: 'json',
			success: function (data) {
				if (data.data == null) {
					$('#dyVoucher_table_3').append('<tr class="odd"><td valign="top" colspan="10" class="dataTables_empty">抱歉， 没有找到你想要的数据</td></tr>');
					$('#loadImg_3').hide();
					bdoErrorBox('失败', data.resultInfo.statusText);
					return;
				}
				jsqcorresponding('dyVoucher_table_3');
				// 计算器重置
				$('#jsq_clear_dyVoucher_table_3').unbind();
				$('#jsq_clear_dyVoucher_table_3').on('click', function () {
					$('#suanshi_dyVoucher_table_3').val('');
					$('#jieguo_dyVoucher_table_3').val('');
				});
				$.each(data.data, function (idx, obj) {
					var rows = '';
					if (obj.isLeaf1 == 0) {
						rows += '<tbody><tr>';
						rows += '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowNext" data-placement="top" title="展开下级" data-toggle="tooltip"></li></td>';
						rows += '<td class="text-center"></td>';
					} else {
						rows += '<tbody><tr>';
						rows += '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDy" data-placement="top" title="展开对应" data-toggle="tooltip"></li></td>';
						rows += '<td class="text-center">';
						if (obj.isMany) {
							rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + obj.subjectId + '\',\'\',' + fxDirection_3 + ',\'' + obj.subjectId + '-' + obj.subjectFullName + '\',1,\'' + obj.mvoucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li>&nbsp;';
						}
						if (obj.isSame) {
							rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + obj.subjectId + '\',\'\',' + fxDirection_3 + ',\'' + obj.subjectId + '-' + obj.subjectFullName + '\',2,\'' + obj.svoucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li>';
						}
						rows += '</td>';
					}
					rows += '<td class="text-left"><span style="display: none;" name="subjectLevel">' + obj.subjectLevel + '</span><span name="subjectId">' + obj.subjectId + '</span></td>';
					rows += '<td class="text-left"><span name="subjectName">' + obj.subjectFullName + '</span></td>';
					rows += '<td class="text-center"><span name="fxDirectionNm">' + fxDirectionNm + '</span></td>';
					rows += '<td class="text-right can-calculate"><span name="voucherValue">' + formatMoney(obj.voucherValue) + '</span></td>';
					rows += '<td class="text-right can-calculate"><span name="dyValue1">' + formatMoney(obj.dyValue1) + '</span></td>';
					rows += '<td></td>';
					rows += '<td class="text-right can-calculate"><span name="dyValue2">' + formatMoney(obj.dyValue2) + '</span></td>';
					rows += '<td class="text-center"><span name="isEqual">' + (obj.isEqual == 1 ? '一致' : '<span style="color:red;">不一致</span>') + '</span></td>';
					rows += '</tr></tbody>';
					$('#dyVoucher_table_3').append(rows);
				});
				// 对应凭证汇总展开下级
				$('#dyVoucher_table_3').off('click', '[name=rowShowNext]');
				$('#dyVoucher_table_3').delegate('[name=rowShowNext]', 'click', function () {
					var tThis = $(this);
					var subjectId = tThis.parents('tr').find('span[name=subjectId]').text();
					var subjectLevel = parseInt(tThis.parents('tr').find('span[name=subjectLevel]').text()) + 1;
					if ($('#dyVoucher_table_3 [name^="' + subjectId + '"][name$="dypzhz"]').length != 0) {
						$('#dyVoucher_table_3 [name^="' + subjectId + '"][name$="dypzhz"]').remove();
						tThis.removeClass('fa-minus-square-o');
						tThis.addClass('fa-plus-square-o');
						tThis.parents('tbody').removeClass('js-table-sections-header');
						tThis.parents('tbody').removeClass('open');
						return;
					} else {
						tThis.parents('tbody').append('<tr id="loadImg_3" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherSum.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_3,
							'lockYyyy': yyyy_3,
							'param1': startMonth_3,
							'param2': endMonth_3,
							'param3': subjectId,
							'param4': fxDirection_3,
							'param5': '',
							'param6': '0'
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								if (obj.isLeaf1 == 0) {
									rows += '<tbody name="' + subjectId + 'dypzhz" style="color:#426ab3;"><tr>';
									rows += '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowNext" data-placement="top" title="展开下级" data-toggle="tooltip"></li></td>';
									rows += '<td class="text-center"></td>';
								} else {
									rows += '<tbody name="' + subjectId + 'dypzhz" style="color:#426ab3;"><tr>';
									rows += '<td class="text-center"><li class="fa fa-plus-square-o" type="button" name="rowShowDy" data-placement="top" title="展开对应" data-toggle="tooltip"></li></td>';
									rows += '<td class="text-center">';
									if (obj.isMany) {
										rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + obj.subjectId + '\',\'\',' + fxDirection_3 + ',\'' + obj.subjectId + '-' + obj.subjectFullName + '\',1,\'' + obj.mvoucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li>&nbsp;';
									}
									if (obj.isSame) {
										rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + obj.subjectId + '\',\'\',' + fxDirection_3 + ',\'' + obj.subjectId + '-' + obj.subjectFullName + '\',2,\'' + obj.svoucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li>';
									}
									rows += '</td>';
								}
								rows += '<td class="text-left" style="padding-left:' + 5 * obj.subjectLevel + 'px;"><span style="display: none;" name="subjectLevel">' + obj.subjectLevel + '</span><span name="subjectId">' + obj.subjectId + '</span></td>';
								rows += '<td class="text-left"><span name="subjectName">' + obj.subjectFullName + '</span></td>';
								rows += '<td class="text-center"><span name="fxDirectionNm">' + fxDirectionNm + '</span></td>';
								rows += '<td class="text-right can-calculate"><span name="voucherValue">' + formatMoney(obj.voucherValue) + '</span></td>';
								rows += '<td class="text-right can-calculate"><span name="dyValue1">' + formatMoney(obj.dyValue1) + '</span></td>';
								rows += '<td></td>';
								rows += '<td class="text-right can-calculate"><span name="dyValue2">' + formatMoney(obj.dyValue2) + '</span></td>';
								rows += '<td class="text-center"><span name="isEqual">' + (obj.isEqual == 1 ? '一致' : '<span style="color:red;">不一致</span>') + '</span></td>';
								rows += '</tr></tbody>';
							});
							tThis.removeClass('fa-plus-square-o');
							tThis.addClass('fa-minus-square-o');
							tThis.parents('tbody').after(rows);
							tThis.parents('tbody').addClass('js-table-sections-header');
							tThis.parents('tbody').addClass('open');
							tThis.parents('tbody').find('#loadImg_3').remove();
						}
					});
				});
				// 对应凭证汇总展开对应
				$('#dyVoucher_table_3').off('click', '[name=rowShowDy]');
				$('#dyVoucher_table_3').delegate('[name=rowShowDy]', 'click', function () {
					var tThis = $(this);
					var subjectId = tThis.parents('tr').find('span[name=subjectId]').text();
					var subjectName = tThis.parents('tr').find('span[name=subjectName]').text();
					if ($('#dyVoucher_table_3 [name^="' + subjectId + '"][name$="dypzhz"]').length != 0) {
						$('#dyVoucher_table_3 [name^="' + subjectId + '"][name$="dypzhz"]').remove();
						tThis.removeClass('fa-minus-square-o');
						tThis.addClass('fa-plus-square-o');
						tThis.parents('tbody').removeClass('js-table-sections-header');
						tThis.parents('tbody').removeClass('open');
						return;
					} else {
						tThis.parents('tbody').append('<tr id="loadImg_3" style="width:100%;text-align:center;"><td colspan="11"><img src="/Faith/img/bdo/loading.gif" width="50px" height="50px" /></td></tr>');
					}
					$.ajax({
						type: 'post',
						url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherSum.json',
						data: {
							'menuId': window.sys_menuId,
							'lockProjectId': customerId_3,
							'lockYyyy': yyyy_3,
							'param1': startMonth_3,
							'param2': endMonth_3,
							'param3': subjectId,
							'param4': fxDirection_3,
							'param5': '',
							'param6': '1'
						},
						dataType: 'json',
						success: function (data) {
							var rows = '';
							$.each(data.data, function (idx, obj) {
								rows += '<tbody name="' + subjectId + 'dypzhz" style="color:green;"><tr>';
								rows += '<td></td>';
								rows += '<td class="text-center">';
								if (obj.isMany) {
									rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + subjectId + '\',\'' + obj.dySubject + '\',' + fxDirection_3 + ',\'' + subjectId + '-' + subjectName + '\',1,\'' + obj.mvoucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li>&nbsp;';
								}
								if (obj.isSame) {
									rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + subjectId + '\',\'' + obj.dySubject + '\',' + fxDirection_3 + ',\'' + subjectId + '-' + subjectName + '\',2,\'' + obj.svoucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li>';
								}
								rows += '</td>';
								rows += '<td class="text-left"><span name="subjectId">' + obj.dySubject + '</span></td>';
								rows += '<td class="text-left"><span name="subjectName">' + obj.dySubjectNm + '</span></td>';
								rows += '<td class="text-center">' + dyDirectionNm + '</td>';
								rows += '<td class="text-right can-calculate"><span name="voucherValue">' + formatMoney(obj.voucherValue) + '</span></td>';
								rows += '<td class="text-right can-calculate"><span name="dyValue1">' + formatMoney(obj.dyValue1) + '</span></td>';
								rows += '<td class="text-center">';
								if (obj.isMany) {
									rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + obj.dySubject + '\',\'' + subjectId + '\',' + dyDirection + ',\'' + obj.dySubject + '-' + obj.dySubjectNm + '\',1,\'' + obj.mvoucherIds + '\')" class="fa fa-maxcdn" style="cursor:pointer;" data-placement="top" title="多借多贷分析" data-toggle="tooltip"></li>&nbsp;';
								}
								if (obj.isSame) {
									rows += '<li onclick="voucherTable3(\'' + customerId_3 + '\',\'' + yyyy_3 + '\',\'' + startMonth_3 + '\',\'' + endMonth_3 + '\',\'' + obj.dySubject + '\',\'' + subjectId + '\',' + fxDirection_3 + ',\'' + obj.dySubject + '-' + obj.dySubjectNm + '\',2,\'' + obj.svoucherIds + '\')" class="fa fa-scribd" style="cursor:pointer;" data-placement="top" title="同借同贷分析" data-toggle="tooltip"></li>';
								}
								rows += '</td>';
								rows += '<td class="text-right can-calculate"><span name="dyValue2">' + formatMoney(obj.dyValue2) + '</span></td>';
								rows += '<td class="text-center"><span name="isEqual">' + (obj.isEqual == 1 ? '一致' : '<span style="color:red;">不一致</span>') + '</span></td>';
								rows += '</tr></tbody>';
							});
							tThis.removeClass('fa-plus-square-o');
							tThis.addClass('fa-minus-square-o');
							tThis.parents('tbody').after(rows);
							tThis.parents('tbody').addClass('js-table-sections-header');
							tThis.parents('tbody').addClass('open');
							tThis.parents('tbody').find('#loadImg_3').remove();
						}
					});
				});
				$('#loadImg_3').hide();
			}
		});
	};

	$('#btn_xxranaly3').click(function () {
		if (customerId_3 == '' || yyyy_3 == '') {
			bdoInfoBox('提示', '请先点击查询');
			return;
		}
		bdoConfirmBox('小杏仁推荐分析', '本次操作将会删除' + startMonth_3 + '月' + '~' + endMonth_3 + '月已经保存的分析,请确认是否继续?', function () {
			bdoInProcessingBox('保存分析中,请稍后!');
			$.ajax({
				type: 'post',
				url: 'finCenter/CorrespondingVoucherAnalysis.saveCorrVoucher.json',
				data: {
					'menuId': window.sys_menuId,
					'lockProjectId': customerId_3,
					'lockYyyy': yyyy_3,
					'param1': startMonth_3,
					'param2': endMonth_3
				},
				dataType: 'json',
				bdolxLoader: false,
				success: function (data) {
					if (data.success) {
						bdoInfoBox('提示','正在分析中,预计需要' + (2+(parseFloat(data.resultInfo.statusText)/20000)).toFixed(0) + '分钟,请稍后查询!')
					} else {
						bdoErrorBox('失败', data.resultInfo.statusText);
					}
				}
			});
		});
	});

	$('#dyVoucher_refresh_3').click(function () {
		$('#btn_search3').click();
	});
	/** 对应凭证汇总 */
	$('#btn_search3').click(function () {
		if ($('#analysis_customerId3').val() == '') {
			bdoInfoBox('提示', '请选择客户');
			return;
		}
		if ($('#analysis_yyyy3').val() == '') {
			bdoInfoBox('提示', '请选择年份');
			return;
		}
		if ($('#analysis_fxDirection3').val() == '') {
			bdoInfoBox('提示', '请选择分析方向');
			return;
		}
		// 记录成功查询的条件
		customerId_3 = $('#analysis_customerId3').val();
		yyyy_3 = $('#analysis_yyyy3').val();
		startMonth_3 = $('#analysis_startmonth3').val();
		endMonth_3 = $('#analysis_endmonth3').val();
		fxDirection_3 = $('#analysis_fxDirection3').val();
		createDyVoucherGather();
		$('#dyVoucher_btnexport_3,#dyVoucher_btnexportdg_3').show();
	});

	// // 导出功能
	function getViewlet(type) {
		/** table 属性 */
		var analsubject_view_index = 1;
		var analsubject_view = {
			localParam: {
				url: '',
				tabNum: true,
				urlparam: {}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				pageLength: 30,
				/* param1 :'jsq', */
				serverSide: true,
				fixedThead: true,
				fixedHeight: '500px',
				columnDefs: [
					{
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-left',
						title: '科目编号',
						name: 'oneSubjectId',
						data: 'oneSubjectId',
						visible: true,
						width: '50px'
					}, {
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-left',
						title: '科目名称',
						name: 'subjectFullName',
						data: 'subjectFullName',
						width: '150px'
					}, {
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-center',
						title: '借贷方向',
						name: 'direction',
						data: 'direction',
						width: '40px'
					}, {
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-right',
						title: '金额',
						name: 'sumValue',
						data: 'sumValue',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-left',
						title: '占总发生额百分比(﹪)',
						name: 'percentage',
						data: 'percentage',
						width: '50px'
					}, {
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-left',
						title: '凭证张数',
						name: 'voucherCount',
						data: 'voucherCount',
						width: '20px'
					}, {
						targets: analsubject_view_index++,
						orderable: false,
						className: 'text-right',
						title: '平均单笔金额',
						name: 'avgValue',
						data: 'avgValue',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: analsubject_view_index++,
						orderable: true,
						className: 'text-right',
						title: '最大单笔金额',
						name: 'largeValue',
						data: 'largeValue',
						width: '80px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}]
			}
		};
		if (type == '1') {
			analsubject_view.localParam.url = 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherAnaly.json';
			analsubject_view.localParam.urlparam = {
				'menuId': window.sys_menuId,
				'lockProjectId': customerId_1,
				'lockYyyy': yyyy_1,
				'param1': startMonth_1,
				'param2': endMonth_1,
				'param3': subjectId_1,
				'param4': fxDirection_1,
				'param5': ''
			};
		} else {
			analsubject_view.localParam.url = 'finCenter/CorrespondingVoucherAnalysis.getAllVoucherAnaly.json';
			analsubject_view.localParam.urlparam = {
				'menuId': window.sys_menuId,
				'lockProjectId': customerId_1,
				'lockYyyy': yyyy_1,
				'param1': startMonth_1,
				'param2': endMonth_1,
				'param3': subjectId_1,
				'param4': fxDirection_1,
				'param5': ''
			};
		}
		return analsubject_view;
	}

	/* 导出 */
	$('#correspondingVoucherAnalysis_export').click(function () {
		let analsubject_view = getViewlet('1');
		exportExcelFin(this, '多借多贷分析', analsubject_view, 'treeTable');
	});

	/** 导出到底稿附件 打开Tb附件框 */
	$('#correspondingVoucherAnalysis_export_dg').click(function () {
		let analsubject_view = getViewlet('1');
		exportType = '1';
		var customername = $('#analysis_customerId option:selected').text();
		ecportToDg(customerId_1, customername, analsubject_view);
	});

	function onExport(event) {
		let data = huoqunode();
		if (data) {
			if (exportType == '1') {
				data.title = '多借多贷分析';
				data.table = 'treeTable';
				data.view = getViewlet('1');
				data.customerId = customerId_1;
			} else if (exportType == '2') {
				data.title = '对应凭证分析';
				data.table = 'treeTable_two';
				data.view = getViewlet('2');
				data.customerId = customerId_1;
			} else if (exportType == '3') {
				data.title = '对应凭证汇总';
				data.table = 'dyVoucher_table_3';
				data.view = getViewDetail();
				data.customerId = customerId_3;
			}
			exportExcelTo(this, data);
		} else {

		}
	}

	/* 导出到底稿附件 */
	$('#modal_tbsubjectid_sure').click(onExport);

	/* 导出tab2 */
	$('#correspondingVoucherAnalysis_export_two').click(function () {
		let analsubject_view = getViewlet('2');
		exportExcelFin(this, '对应凭证分析', analsubject_view, 'treeTable');
	});

	/** 导出到底稿附件tab2 打开Tb附件框 */
	$('#correspondingVoucherAnalysis_export_dg_two').click(function () {
		let analsubject_view = getViewlet('2');
		exportType = '2';
		var customername = $('#analysis_customerId option:selected').text();
		ecportToDg(customerId_1, customername, analsubject_view);
	});

	function getViewDetail() {
		/** table 属性 */
		var detail_view_index = 1;
		var detail_view = {
			localParam: {
				tabNum: true,
				url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherSum.json',
				urlparam: {
					'menuId': window.sys_menuId,
					'lockProjectId': customerId_3,
					'lockYyyy': yyyy_3,
					'param1': startMonth_3,
					'param2': endMonth_3,
					'param3': '',
					'param4': fxDirection_3,
					'param5': '',
					'param6': '0'
				}
			},
			tableParam: {
				select: true,
				lengthChange: false,
				dom: '<"row"<"col-sm-6"i><"col-sm-6">><"row"<"col-sm-12"tr>><"row"<"col-sm-6"i><"col-sm-6">>',
				pageLength: 30,
				serverSide: true,
				fixedHeight: '500px',
				columnDefs: [
					{
						targets: detail_view_index++,
						orderable: false,
						className: 'text-left',
						title: '科目编号',
						name: 'subjectId',
						data: 'subjectId',
						width: '50px'
					}, {
						targets: detail_view_index++,
						className: 'text-left',
						title: '科目名称',
						name: 'subjectFullName',
						data: 'subjectFullName',
						width: '150px'
					}, {
						targets: detail_view_index++,
						className: 'text-right',
						title: '多借多贷及同借同贷凭证金额',
						name: 'voucherValue',
						data: 'voucherValue',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: detail_view_index++,
						className: 'text-right',
						title: '分析金额',
						name: 'dyValue1',
						data: 'dyValue1',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: detail_view_index++,
						className: 'text-right',
						title: '对应科目分析金额',
						name: 'dyValue2',
						data: 'dyValue2',
						width: '100px',
						render: function (data, type, row, meta) {
							return formatMoney(data);
						}
					}, {
						targets: detail_view_index++,
						orderable: false,
						className: 'text-left',
						title: '是否一致',
						name: 'isEqual',
						data: 'isEqual',
						width: '70px',
						renderer: 'getDicLabelByVal|是否一致',
						render: function (data, type, row, meta) {
							return DicVal2Nm(data, '是否一致');
						}
					}]
			}
		};
		return detail_view;
	}
	/* 导出 */
	$('#dyVoucher_btnexport_3').click(function () {
		let detail_view = getViewDetail();
		exportExcelFin(this, '对应凭证汇总', detail_view, 'dyVoucher_table_3');
	});

	/** 导出到底稿附件 打开Tb附件框 */
	$('#dyVoucher_btnexportdg_3').click(function () {
		let detail_view = getViewDetail();
		exportType = '3';
		var customername = $('#analysis_customerId3 option:selected').text();
		ecportToDg(customerId_3, customername, detail_view);
	});

	// // 计算器使用
	/** 单元格点击事件 */
	$('#treeTable,#treeTable_two,#dyVoucher_table_3').on('click', 'td', function () {
		var _id = $(this).closest('table').attr('id');
		var data = $(this).text();
		if (!$(this).hasClass('can-calculate') || data == '') {
			return;
		}
		if ($('#suanshi_' + _id).val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_' + _id).val('(' + data + ')');
			} else {
				$('#suanshi_' + _id).val(data);
			}
			$('#jieguo_' + _id).val(data);
		} else {
			value = $('#suanshi_' + _id).val();
			jieguo = $('#jieguo_' + _id).val();
			if (jieguo.indexOf(',') >= 0) {
				numjieguo = parseFloat(jieguo.split(',').join(''));
			} else {
				numjieguo = parseFloat(jieguo);
			}
			if (data.indexOf(',') >= 0) {
				numdata = parseFloat(data.split(',').join(''));
			} else {
				numdata = parseFloat(data);
			}
			if (data.indexOf('-') >= 0) {
				$('#suanshi_' + _id).val(value + '+(' + data + ')');
			} else {
				$('#suanshi_' + _id).val(value + '+' + data);
			}
			$('#jieguo_' + _id).val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
});

// //// 展开分析列表
var vouCherTable = function (cus, yy, start, end, subject, dir, oneSubjectId, voucherId) {
	var param = {
		'menuId': window.sys_menuId,
		'lockProjectId': cus,
		'lockYyyy': yy,
		'param1': start,
		'param2': end,
		'param3': subject,
		'param4': dir,
		'param5': 'D',
		'param6': oneSubjectId,
		'param7': $('#analysis_subjectid').attr('data-content'),
		'param8': voucherId
	};
	voucherAnalysisTab('tab_detailaccount', param);
};
var vouCherTable_two = function (cus, yy, start, end, subject, dir, oneSubjectId, voucherId) {
	var param = {
		'menuId': window.sys_menuId,
		'lockProjectId': cus,
		'lockYyyy': yy,
		'param1': start,
		'param2': end,
		'param3': subject,
		'param4': dir,
		'param5': 'CONTAIN',
		'param6': oneSubjectId,
		'param7': $('#analysis_subjectid').attr('data-content'),
		'param8': voucherId
	};
	voucherAnalysisTab('tab_detailaccount', param);
};
var manyVouCherTable = function (cus, yy, start, end, subject, dir, oneSubjectId, voucherId) {
	if (oneSubjectId == '多借多贷凭证') {
		oneSubjectId = '';
	}
	var param = {
		'menuId': window.sys_menuId,
		'lockProjectId': cus,
		'lockYyyy': yy,
		'param1': start,
		'param2': end,
		'param3': subject,
		'param4': dir,
		'param5': 'M',
		'param6': oneSubjectId,
		'param7': $('#analysis_subjectid').attr('data-content'),
		'param8': voucherId
	};
	manyVoucherAnalysisTab('tab_detailaccount', param);
};
var sameVouCherTable = function (cus, yy, start, end, subject, dir, oneSubjectId, voucherId) {
	if (oneSubjectId == '同借同贷凭证') {
		oneSubjectId = '';
	}
	var param = {
		'menuId': window.sys_menuId,
		'lockProjectId': cus,
		'lockYyyy': yy,
		'param1': start,
		'param2': end,
		'param3': subject,
		'param4': dir,
		'param5': 'S',
		'param6': oneSubjectId,
		'param7': $('#analysis_subjectid').attr('data-content'),
		'param8': voucherId
	};
	sameVoucherAnalysisTab('tab_detailaccount', param);
};
var relatedVouCherTable = function (cus, yy, start, end, subject, dir, oneSubjectId, voucherKey) {
	if (oneSubjectId == '关联方对账凭证') {
		oneSubjectId = '';
	}
	var param = {
		'menuId': window.sys_menuId,
		'lockProjectId': cus,
		'lockYyyy': yy,
		'subjectId': subject,
		'param1': voucherKey
	};
	insideTransactionAnalysisTab('tab_detailaccount', param);
};
var voucherTable3 = function (cus, yy, start, end, subjectId, corrSubjectId, direction, analyTitle, analyType, voucherId) {
	if (analyType == '1') {
		var param = {
			'menuId': window.sys_menuId,
			'lockProjectId': cus,
			'lockYyyy': yy,
			'param1': start,
			'param2': end,
			'param3': subjectId,
			'param4': direction,
			'param5': 'M',
			'param6': corrSubjectId,
			'param7': analyTitle,
			'param8': voucherId
		};
		manyVoucherAnalysisTab('tab_detailaccount', param);
	} else {
		var param = {
			'menuId': window.sys_menuId,
			'lockProjectId': cus,
			'lockYyyy': yy,
			'param1': start,
			'param2': end,
			'param3': subjectId,
			'param4': direction,
			'param5': 'S',
			'param6': corrSubjectId,
			'param7': analyTitle,
			'param8': voucherId
		};
		sameVoucherAnalysisTab('tab_detailaccount', param);
	}
};
var voucherAnalysisDetailTable = function (rowObj, param) {
	$('#headlabel').html('对应凭证详细 (凭证日期 : ' + rowObj.vchDate + ' 凭证号 : ' + rowObj.oldVoucherId + ')');
	
	voucherdetail_param = {
		'menuId': param.menuId,
		'lockProjectId': param.lockProjectId,
		'lockYyyy': param.lockYyyy,
		'param1': param.param1,
		'param2': param.param2,
		'param3': param.param3,
		'param4': param.param4,
		'param5': param.param5,
		'param6': param.param6,
		'param7': param.param7,
		'param8': rowObj.voucherId,
		'param9': rowObj.vchDate,
		'param10': rowObj.oldVoucherId
	};
	
	/** table 属性 */
	var dfEdit = '&nbsp;<button class="btn btn-xs btn-warning" type="button" name="dfEdit" data-placement="top" title="填充金额" data-toggle="tooltip"><i class="fa fa-edit"></i></button>';
	var dfClear = '&nbsp;<button class="btn btn-xs btn-info" type="button" name="dfClear" data-placement="top" title="清空" data-toggle="tooltip"><i class="fa fa-eraser"></i></button>';
	var dfAdd = '&nbsp;<button class="btn btn-xs btn-success" type="button" name="dfAdd" data-placement="top" title="增加一行" data-toggle="tooltip"><i class="fa fa-plus"></i></button>';
	var dfDel = '&nbsp;<button class="btn btn-xs btn-danger" type="button" name="dfDel" data-placement="top" title="移除" data-toggle="tooltip"><i class="fa fa-times"></i></button>';
	var rowVoucherId;
	
	var voucherdetail_view_index = 1;
	var voucherdetail_view = {
		localParam: {
			tabNum: true,
			url: 'finCenter/CorrespondingVoucherAnalysis.getCorrVoucherDetail.json',
			urlparam: voucherdetail_param
		},
		tableParam: {
			select: true,
			scrollX: true,
			scrollY : '710px',
			param1: 'jsq',
			lengthChange: false,
			dom: '<"row"<"col-sm-12"tr>>',
			ordering: false,
			serverSide: true,
			infoCallback: fnInfoCallback,
			bdoCustomizeColumns: true,
			createdRow(row, data, dataIndex) {
				if (dataIndex == 0) {
					rowVoucherId = '';
				}
				if (rowVoucherId != data.voucherId) {
					rowVoucherId = data.voucherId;
				}
			},
			columnDefs: [
				{
					targets: voucherdetail_view_index++,
					className: 'text-left',
					title: '摘要',
					name: 'summary',
					data: 'summary',
					width: '200px',
					render: function (data, type, row, meta) {
						if (data && data.length > 15) {
							return '<span title="' + data + '">' + data.substring(0, 15) + '...</span>'
						}
						return data;
					}
				}, {
					targets: voucherdetail_view_index++,
					className: 'text-left',
					title: '科目编号',
					name: 'subjectId',
					data: 'subjectId',
					width: '100px'
				}, {
					targets: voucherdetail_view_index++,
					className: 'text-left',
					title: '科目名称',
					name: 'subjectFullName',
					data: 'subjectFullName',
					width: '200px'
				}, {
					targets: voucherdetail_view_index++,
					className: 'text-right',
					title: '借方发生额',
					name: 'drValue',
					data: 'drValue',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: voucherdetail_view_index++,
					className: 'text-right',
					title: '贷方发生额',
					name: 'crValue',
					data: 'crValue',
					width: '100px',
					render: function (data, type, row, meta) {
						return formatMoney(data);
					}
				}, {
					targets: voucherdetail_view_index++,
					className: 'text-center',
					title: '对应发生额',
					name: 'corrSubjectText',
					data: 'corrSubjectText',
					width: '500px',
					render: function (data, type, row, meta) {
						var rowHtml = '';
						// 对应科目编号下拉框
						var subjectIdsArr = row.subjectIds.split(',');
						// 是否已有分析
						var corrSubject = row.corrSubject;
						if (corrSubject && corrSubject > '') {
							var corrSubjectArr = corrSubject.split(',');
							$.each(corrSubjectArr, function (i, d) {
								var subjectValueArr = d.split('|');
								var _inputspan = $('<span class="row-input"></span>');
								var _btnspan = $('<span class="row-btn"></span>');
								var dfSubject = '';
								$.each(subjectIdsArr, function (i2, d2) {
									if (d2 && d2 > '') {
										var d2Arr = d2.split(':');
										dfSubject += '<option ' + (subjectValueArr[0] == d2 ? 'selected' : '') + ' value="' + d2 + '">' + (d2Arr[0] == '1' ? '借' : '贷') + d2Arr[1] + '</option>'
									}
								});
								dfSubject = '<select style="width:120px;" name="dfSubject">' + dfSubject + '</select>';
								var dfValue = '&nbsp;<input type="number" name="dfValue" class="text-right" style="width:120px;" value="' + parseFloat(subjectValueArr[1]).toFixed(2) + '">';
								if (i == 0) {
									_inputspan.append(dfSubject).append(dfValue);
									_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
								} else {
									_inputspan.append(dfSubject).append(dfValue);
									_btnspan.append(dfEdit).append(dfClear).append(dfDel);
								}
								rowHtml += ('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
							});
						} else {
							var _inputspan = $('<span class="row-input"></span>');
							var _btnspan = $('<span class="row-btn"></span>');
							var dfSubject = '';
							$.each(subjectIdsArr, function (i2, d2) {
								if (d2 && d2 > '') {
									var d2Arr = d2.split(':');
									dfSubject += '<option value="' + d2 + '">' + (d2Arr[0] == '1' ? '借' : '贷') + d2Arr[1] + '</option>'
								}
							});
							dfSubject = '<select style="width:120px;" name="dfSubject">' + dfSubject + '</select>';
							var dfValue = '&nbsp;<input type="number" name="dfValue" style="width:120px;" class="text-right">';
							_inputspan.append(dfSubject).append(dfValue);
							_btnspan.append(dfEdit).append(dfClear).append(dfAdd);
							rowHtml = ('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
						}
						return rowHtml;
					}
				}]
		}
	};
	jsq(voucherdetail_view.tableParam, 'voucherdetailTable');
	BdoDataTable('voucherdetailTable', voucherdetail_view);
	
	/** 单元格点击事件 */
	$('#voucherdetailTable').off('click').on('click', 'td', function () {
		var data = $(this).text();
		if ($(this).attr('class').indexOf('text-right') < 0 || data.indexOf('%') >= 0 || data === '') {
			return;
		}
		if ($('#suanshi_voucherdetailTable').val() == '') {
			if (data.indexOf('-') >= 0) {
				$('#suanshi_voucherdetailTable').val('(' + data + ')');
			} else {
				$('#suanshi_voucherdetailTable').val(data);
			}
			$('#jieguo_voucherdetailTable').val(data);
		} else {
			value = $('#suanshi_voucherdetailTable').val();
			jieguo = $('#jieguo_voucherdetailTable').val();
			if (jieguo.indexOf(',') >= 0) {
				numjieguo = parseFloat(jieguo.split(',').join(''));
			} else {
				numjieguo = parseFloat(jieguo);
			}
			if (data.indexOf(',') >= 0) {
				numdata = parseFloat(data.split(',').join(''));
			} else {
				numdata = parseFloat(data);
			}
			if (data.indexOf('-') >= 0) {
				$('#suanshi_voucherdetailTable').val(value + '+(' + data + ')');
			} else {
				$('#suanshi_voucherdetailTable').val(value + '+' + data);
			}
			$('#jieguo_voucherdetailTable').val((numjieguo + numdata).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'));
		}
	});
	/** 行按钮 填充金额 */
	$('#voucherdetailTable').off('click', 'button[name=dfEdit]').on('click', 'button[name=dfEdit]', function () {
		var _select = $(this).closest('div').find('select[name="dfSubject"]').val();
		var _value;
		if (_select.length > 0) {
			var _selects = _select.split(":");
			var _subjectId = _selects[1];
			$('#voucherdetailTable tr').each(function () {
				var _row = $(this);
				var rowObj = $('#voucherdetailTable').DataTable().row(_row.index()).data();
				if (_subjectId == rowObj.subjectId) {
					_value = rowObj.occurValue;
					return false;
				}				
			});
		}
		$(this).closest('tr').attr('data-change', '1');
		$(this).closest('div').find('input[name="dfValue"]').val(_value.toFixed(2));
	});

	/** 行按钮 清空金额 */
	$('#voucherdetailTable').off('click', 'button[name=dfClear]').on('click', 'button[name=dfClear]', function () {
		$(this).closest('tr').attr('data-change', '1');
		$(this).closest('div').find('input[name="dfValue"]').val('');
	});

	/** 行按钮 新增一行 */
	$('#voucherdetailTable').off('click', 'button[name=dfAdd]').on('click', 'button[name=dfAdd]', function () {
		addRow(this);
	});

	function addRow(e) {
		var _inputspan = $(e).closest('div').find('.row-input');
		var _btnspan = $('<span class="row-btn"></span>').append(dfEdit).append(dfClear).append(dfDel);
		$(e).closest('tr').attr('data-change', '1');
		$(e).closest('td').append('<div>' + _inputspan.prop('outerHTML') + _btnspan.prop('outerHTML') + '</div>');
	}

	/** 行按钮 移除 */
	$('#voucherdetailTable').off('click', 'button[name=dfDel]').on('click', 'button[name=dfDel]', function () {
		if ($(this).closest('td').find('div').length == 1) {
			bdoInfoBox('提示', '至少需要保留一行', 1000);
			return;
		}
		$(this).closest('tr').attr('data-change', '1');
		$(this).closest('div').remove();
	});

	$('#voucherdetailTable').off('change', 'button[name=dfValue]').on('change', 'input[name="dfValue"]', function () {
		$(this).closest('tr').attr('data-change', '1');
		$(this).val(parseFloat($(this).val()).toFixed(2));
	});

	$('#voucherdetailTable').off('change', 'button[name=dfSubject]').on('change', 'select[name="dfSubject"]', function () {
		$(this).closest('tr').attr('data-change', '1');
	});
	/* 保存 */
	$('#modal_voucherdetail_save').off('click').on('click', function () {
		if (!counterpartyAmountCheck()){
			bdoErrorBox('失败', '对方科目分析金额借贷不平。');
			return;
		}
			
		var corrObjArr = [];
		$('#voucherdetailTable tr').each(function () {
			var _row = $(this);
			if (_row.attr('data-change') == '1' && _row.find('select[name="dfSubject"]').length > 0) {
				var rowObj = $('#voucherdetailTable').DataTable().row(_row.index()).data();
				var corrObj = {
					subjectEntryId: rowObj.autoId,
					voucherId: rowObj.voucherId,
					serail: rowObj.serail,
					corrObjArr: []
				};
				_row.find('select[name="dfSubject"]').each(function () {
					var _select = $(this);
					var _input = _select.closest('div').find('input[name="dfValue"]');
					if (_input.val() != '') {
						corrObj.corrObjArr.push({
							corrSubjectId: _select.val(),
							corrValue: _input.val()
						});
					}
				});
				corrObjArr.push(corrObj);
			}
		});
		if (corrObjArr && corrObjArr.length > 0) {
			bdoConfirmBox('保存分析', '确认是否保存分析金额？', function () {
				bdoInProcessingBox('保存分析中,请稍后!');
				$.ajax({
					type: 'post',
					url: 'finCenter/CorrespondingVoucherAnalysis.updateCorrDetailValue.json',
					data: {
						menuId: window.sys_menuId,
						lockProjectId: param.lockProjectId,
						lockYyyy: param.lockYyyy,
						param1: param.param5,
						// subjectId
						param2: param.param3,
						// direction
						param3: param.param4,
						// startMonth
						param4: param.param1,
						// endMonth
						param5: param.param2,
						jsonData: JSON.stringify(corrObjArr)
					},
					dataType: 'json',
					success: function (data) {
						if (data.success) {
							$('#voucherdetailTable').DataTable().ajax.reload();
							bdoSuccessBox('成功');
							$('#modal_voucherdetail').modal('hide');
							$('#table_accountledger').DataTable().draw(false);
							$('#table_accountledger').DataTable().ajax.reload();
						} else {
							bdoErrorBox('失败', data.resultInfo.statusText);
						}
					}
				});
			});
		} else {
			bdoInfoBox('', '对应发生额未发生变更，没有要保存的数据', 0);
		}
	});
	// 计算器重置
	$('#jsq_clear_subjectEntry').off('click').on('click', function () {
		$('#suanshi_voucherdetailTable').val('');
		$('#jieguo_voucherdetailTable').val('');
	});
	
	/**
	 * 前端对方科目借贷金额校验
	 * @returns {boolean}
	 */
	function counterpartyAmountCheck() {
		let rowDataArray = $('#voucherdetailTable > tbody > tr ');
		let debitValue = 0;
		let creditValue = 0;
		for (let i = 0; i < rowDataArray.length; i++) {
			let rowData = $(rowDataArray[i]);
			var rowObj = $('#voucherdetailTable').DataTable().row(rowData.index()).data();
			let direction = rowObj.direction;
			let rowAmount  = rowObj.drValue;
			if (direction === -1) {
				rowAmount = rowObj.crValue;
			}
			let oppValueTd = $(rowData.find('td')[6]);
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
			if(String(parseFloat(rowSum).toFixed(2)) != String(parseFloat(rowAmount).toFixed(2))){
				return false;
			}
		}
		let creditStr = String(parseFloat(creditValue).toFixed(2));
		let debitStr = String(parseFloat(debitValue).toFixed(2));
		
		return creditStr === debitStr;
	}
};